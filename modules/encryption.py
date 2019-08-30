''' Error codes:
		100 - Encypting Failed
		101 - Decrypting Failed
		102 - Parsing Failed
		103 - Extract Password Failed
		104 - Key3 & key4 initialization error
		105 - Transaction Validation Failed
		106 - Mac deactivation error
'''

import json, pytz, random, hashlib
import logging, base64, mysql.connector

from logs.log_conf import Logger

logging.basicConfig()
log = logging.getLogger(__name__)  

class EncStyleBase64:
	def __init__(self):
		self.dbuser = 'root'
		self.dbpass = 'r3m0teSec'
		self.dbname = 'load_central_transactions'
		
		self.key1 = '7jFjIYh3jguTuYMd'
		self.key2 = 'oMoffwU5NDLGUx9f'

		self.internal_key1 = 'xn4XG2qTBTKO9ltI'
		self.internal_key2 = 'UOGcen4XGa2qTBT5'
		self.chars = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890'

	def encryptData(self, key, data):
		enc = []
		for i in range(len(data)):
			key_c = key[i % len(key)]
			enc_c = chr((ord(data[i]) + ord(key_c)) % 256)
			enc.append(enc_c)
		return base64.urlsafe_b64encode("".join(enc).encode())

	def decryptData(self, key, enc):
		dec = []
		try:
			enc = base64.urlsafe_b64decode(enc).decode()
		except:
			log.info('Decrypting Failed')
			return 'Error 101'

		for i in range(len(enc)):
			key_c = key[i % len(key)]
			dec_c = chr((256 + ord(enc[i]) - ord(key_c)) % 256)
			dec.append(dec_c)
		return "".join(dec)
	
	# Activation Phase
	def actParseDecryptedData(self, data):
		split = data.split(',')
		try:
			obj = {
				'username' : split[0],
				'password' : split[1],
				'mac' : split[2]
			}
		except:
			log.info('Parsing Failed')
			return 'Error 102'
		return obj
	
	def extractPassword(self, key, obj):
		try:
			obj['password'] = self.decryptData(key, obj['password'])
		except:
			log.info('Extract Password Failed')
			return 'Error 103'
		return obj

	def giveTheKey(self, key, obj):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 				database=self.dbname)		
			cursor = conn.cursor(prepared=True)
		except:
			return 'Connection Unavailble DB error'
		
		# Get the encrypted password & token of username
		query1 = ''' SELECT password, token FROM users WHERE username = %s '''
		cursor.execute(query1, (obj['username'],))
		userData = cursor.fetchall()
		if len(userData) == 0:
			cursor.close()
			conn.close()
			log.info('Cant get encrypted password of ' + obj['username'])
			return 'Error 104'
		encPassword = userData[0][0]
		token = userData[0][1]

		# Password checking
		password = hashlib.sha256(obj['password'].encode() + token.encode()).hexdigest() + hashlib.sha256(token.encode()).hexdigest()
		if password != encPassword:
			log.info('Password checking failed: ' + str(obj['password']))
			return 'Error 104'

		# Generate key3 & key4
		key3 = ''.join(random.choice(self.chars) for i in range(16))
		key4 = ''.join(random.choice(self.chars) for i in range(16))

		# Get the balance of mac
		query2 = ''' SELECT balance FROM macs WHERE mac = %s '''
		cursor.execute(query2, (obj['mac'],))
		macBalance = cursor.fetchall()
		if len(macBalance) == 0:
			query3 = ''' INSERT INTO macs(mac) VALUES(%s) '''
			cursor.execute(query3, (obj['mac'],))
			conn.commit()
			macBalance = '%.2f'%float('0')
		else:
			macBalance = '%.2f'%float(macBalance[0][0])
		

		# Check if mac is already activated
		query4 = ''' SELECT * FROM macs_with_keys WHERE mac = %s '''
		cursor.execute(query4, (obj['mac'],))
		macData = cursor.fetchall()
		if len(macData) > 0:
			query5 = ''' UPDATE macs_with_keys SET keyA = %s, keyB = %s, activator = %s, 
						dateUpdated = NOW() WHERE mac = %s '''
			cursor.execute(query5, (key3, key4, obj['username'], obj['mac']))
			conn.commit()
		else:
			# Insert the mac and created keys in macs_with_keys table
			query6 = ''' INSERT INTO macs_with_keys(mac, keyA, keyB, activator) VALUES(%s, %s, %s, %s) '''
			cursor.execute(query6, (obj['mac'], key3, key4, obj['username']))
			conn.commit()

		info = 'Success,' + key3 + ',' + key4 + ',' + macBalance
		info = self.encryptData(key, info)

		cursor.close()
		conn.close()
		return info.decode()

	# Transacition Phase
	def validateTransReq(self, key, enc):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 				database=self.dbname)		
			cursor = conn.cursor(prepared=True)
		except:
			return 'Connection Unavailble DB error'

		# decrypt the string
		decrypt = self.decryptData(key, enc)

		# parse decrypted string
		split = decrypt.split(',')
		try:
			obj = {
				# index 0 & 1 are used for key and datetime
				'routerMac' : split[2],
				'userMac' : split[3],
				'mobileNum' : split[4],
				'denomination' : split[5],
				'type' : split[6],
				'price' : ''
			}
		except:
			log.info('parse decrypted string error')
			return 'Error 105'

		# Check if mac is activated
		query1 = ''' SELECT * FROM macs_with_keys WHERE mac = %s AND mac = (SELECT mac FROM macs_with_keys WHERE keyA = %s OR keyB = %s) '''
		cursor.execute(query1, (obj['routerMac'], split[0], split[0]))
		macData = cursor.fetchall()
		if len(macData) == 0:
			cursor.close()
			conn.close()
			log.info('mac is not activated')
			return 'Error 105'

		# Check if encrypted string exist in msginfos table
		query2 = ''' SELECT info FROM msginfos WHERE info = %s '''
		cursor.execute(query2, (enc,))
		info = cursor.fetchall()
		if len(info) > 0:
			cursor.close()
			conn.close()
			log.info('encrypted string already exist')
			return 'Error 105'

		# Insert encrypted string into msginfos table
		query3 = ''' INSERT INTO msginfos(info) VALUES(%s) '''
		cursor.execute(query3, (enc,))
		conn.commit()
		cursor.close()
		conn.close()

		return obj

	# Deactivation Phase
	def deactivateMac(self, obj):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 				database=self.dbname)		
			cursor = conn.cursor(prepared=True)
		except:
			return 'Connection Unavailble DB error'
		
		# Get the encrypted password & token of username
		query1 = ''' SELECT password, token FROM users WHERE username = %s '''
		cursor.execute(query1, (obj['username'],))
		userData = cursor.fetchall()
		if len(userData) == 0:
			cursor.close()
			conn.close()
			return 'Error 106'
		encPassword = userData[0][0]
		token = userData[0][1]

		# Password checking
		password = hashlib.sha256(obj['password'].encode() + token.encode()).hexdigest() + hashlib.sha256(token.encode()).hexdigest()
		if password != encPassword:
			return 'Error 106'

		# Check if mac and operator is found in macs_with_keys table
		query2 = ''' SELECT * FROM macs_with_keys WHERE mac = %s AND activator = %s '''
		cursor.execute(query2, (obj['mac'], obj['username']))
		macData = cursor.fetchall()
		if len(macData) == 0:
			cursor.close()
			conn.close()
			return 'Error 106'

		# Delete the data from macs_with_keys table
		query3 = ''' DELETE FROM macs_with_keys WHERE mac = %s AND activator = %s '''
		cursor.execute(query3, (obj['mac'], obj['username']))
		conn.commit()
		cursor.close()
		conn.close()

		return 'Success, mac deactivated'