import hashlib, requests, json, pytz, datetime, random, bs4
import logging, base64, mysql.connector

from modules import controller
from logs.log_conf import Logger

controller = controller.Controller()
logging.basicConfig()
log = logging.getLogger(__name__)  

class Transactions:
	def __init__(self, dict_param):
		self.uid = dict_param['uid']
		self.pword = dict_param['pword']

		time_zone = pytz.timezone('Asia/Manila')
		self.time_now = str(datetime.datetime.now(time_zone))
		self.success_path = '/var/www/html/python_progs/load_central/transactions/main_server/success/'
		self.failed_path = '/var/www/html/python_progs/load_central/transactions/main_server/failed/'

	def auth(self, rrn, pword):
		a = hashlib.md5(rrn.encode()).hexdigest()
		b = hashlib.md5(pword.encode()).hexdigest()
		c = a+b
		auth = hashlib.md5(c.encode()).hexdigest()

		return auth

	def init_trans(self, obj, status, fpath):
		# with open(fpath + 'transactions.txt', 'a+') as f:
		# 	f.write("Store Mac Address: " + obj['routerMac'] + "\n" +
		# 	"Customer Mac Address: " + obj['userMac'] + "\n" +
		# 	"Customer Mobile Num: " + obj['mobileNum'] + "\n" +
		# 	"Denomination: " + obj['denomination'] + "\n" +
		# 	"Transaction Time: " + self.time_now + "\n\n" +
		# 	"/***** TRANSACTION DETAILS *****/" + "\n" +
		# 	"rrn: " + obj['rrn'] + "\n" +
		# 	"response: " + obj['resp'] + "\n" +
		# 	"tid: " + obj['tid'] + "\n" +
		# 	"bal: " + obj['bal'] + "\n" +
		# 	"epin: " + obj['epin'] + "\n" +
		# 	"Status: " + obj['err'] + "\n\n\n\n")

		controller.add_trans(obj, status)
		controller.add_mac(obj['routerMac'])
		
		return 'Success'

	def validate_promo_status(self, obj):
		admin_balance = controller.get_balance('admin', '')
		failed = {
					'routerMac' : obj['routerMac'],
					'userMac' : obj['userMac'],
					'mobileNum' : obj['mobileNum'],
					'denomination' : obj['denomination'],
					'type' : obj['type'],
					'price' : obj['price'],
					'rrn' : '',
					'resp' : '900',
					'tid' : '',
					'bal' : admin_balance[0]['balance'],
					'epin' : '',
					'err' : 'Promo code is not available'
				 }
		status = controller.check_promo_status(obj['denomination'])
		if status == 'Enabled':
			return status
		else:
			self.init_trans(failed, 'failed', self.failed_path)
			return 'Failed, promo code is not available'

	def validate_mac_status(self, obj):
		admin_balance = controller.get_balance('admin', '')
		failed = {
					'routerMac' : obj['routerMac'],
					'userMac' : obj['userMac'],
					'mobileNum' : obj['mobileNum'],
					'denomination' : obj['denomination'],
					'type' : obj['type'],
					'price' : obj['price'],
					'rrn' : '',
					'resp' : '900',
					'tid' : '',
					'bal' : admin_balance[0]['balance'],
					'epin' : '',
					'err' : 'Mac is disabled'
				 }
		status = controller.check_mac_status(obj['routerMac'])
		if status == 'Enabled':
			return status
		else:
			self.init_trans(failed, 'failed', self.failed_path)
			return 'Failed, mac is disabled contact administrator'
	
	def validate_balance(self, obj):
		mac_balance = controller.get_mac_balance(obj['routerMac'])
		admin_balance = controller.get_balance('admin', '')
		price = controller.get_product_price(obj['denomination'], obj['routerMac'])
		failed = {
					'routerMac' : obj['routerMac'],
					'userMac' : obj['userMac'],
					'mobileNum' : obj['mobileNum'],
					'denomination' : obj['denomination'],
					'type' : obj['type'],
					'price' : obj['price'],
					'rrn' : '',
					'resp' : '900',
					'tid' : '',
					'bal' : admin_balance[0]['balance'],
					'epin' : '',
					'err' : 'OPER_NO_BAL Not Allowed'
				 }
		if mac_balance[0]['balance'] == 0 or float(mac_balance[0]['balance']) < float(price):
			self.init_trans(failed, 'failed', self.failed_path)
			return 'Failed, OPER_NO_BAL Not Allowed'
		else:
			return 'Allowed'

	def decryptStr(self, key, enc):
	    dec = []
	    enc = base64.urlsafe_b64decode(enc).decode()
	    for i in range(len(enc)):
	        key_c = key[i % len(key)]
	        dec_c = chr((256 + ord(enc[i]) - ord(key_c)) % 256)
	        dec.append(dec_c)
	    return "".join(dec)

	def encryptLoadData(self, key, clear):
		enc = []
		for i in range(len(clear)):
			key_c = key[i % len(key)]
			enc_c = chr((ord(clear[i]) + ord(key_c)) % 256)
			enc.append(enc_c)
		return base64.urlsafe_b64encode("".join(enc).encode())

	def decryptLoadData(self, key, enc):
		try:
			conn = mysql.connector.connect(user='root', password='r3m0teSec',
	 				database='load_central_transactions')		
			cursor = conn.cursor(prepared=True)
		except:
			return 'Connection Unavailble DB error'

		dec = []
		try:
			enc_d = base64.urlsafe_b64decode(enc).decode()
		except:
			return 'Transaction Failed'
			
		for i in range(len(enc_d)):
			key_c = key[i % len(key)]
			dec_c = chr((256 + ord(enc_d[i]) - ord(key_c)) % 256)
			dec.append(dec_c)
		
		decrypted ="".join(dec)

		# check if entry existed
		query = """ SELECT info FROM msginfos WHERE info = %s """
		cursor.execute(query, (enc,))
		rows = cursor.fetchall()
		if len(rows) != 0:
			cursor.close()
			conn.close()
			return 'Transaction Failed'

		# insert into db
		query2 = """ INSERT INTO msginfos(info) VALUES(%s) """
		cursor.execute(query2, (enc,))
		conn.commit()
		cursor.close()
		conn.close()

		return decrypted

	def parseDecryptedData(self, dec):
		split = dec.split(',')
		try:
			obj = {
				'routerMac' : split[1],
				'userMac' : split[2],
				'mobileNum' : split[3],
				'denomination' : split[4],
				'type' : split[5],
				'price' : ''
			}
		except:
			return 'Transaction Failed'
		return obj

	def proc_client_request(self, dict_param):
		# Generate rrn
		rrn = 'WIZS' + ''.join(random.choice('1234567890') for i in range(10))
		# md5 hashing for auth
		auth = self.auth(rrn, self.uid+self.pword)

		if dict_param['price'] == '' or dict_param['price'] == None:
			dict_param['price'] = 0
		
		# validate promo status
		promo_status = self.validate_promo_status(dict_param)
		if promo_status != 'Enabled':	return promo_status

		# validate mac status
		status = self.validate_mac_status(dict_param)
		if status != 'Enabled':	return status

		# validate balance
		balance_check = self.validate_balance(dict_param)
		if balance_check != 'Allowed':	return balance_check
		
		# Send an API request to load central
		req = requests.get('https://loadcentral.net/sellapi.do?uid=' + self.uid + 
			'&auth=' + auth + '&pcode=' + dict_param['denomination'] + '&to=' + dict_param['mobileNum'] + '&rrn=' + rrn)
		log.info('url for transactions :' + 'https://loadcentral.net/sellapi.do?uid=' + self.uid + 
			'&auth=' + auth + '&pcode=' + dict_param['denomination'] + '&to=' + dict_param['mobileNum'] + '&rrn=' + rrn)
		resp = req.text
		
		resp = bs4.BeautifulSoup(resp, 'html5lib')
		rrn_resp = resp.find('rrn').text
		resp_resp = resp.find('resp').text
		tid_resp = resp.find('tid').text
		bal_resp = resp.find('bal').text
		epin_resp = resp.find('epin').text
		err_resp = resp.find('err').text

		obj = {
				'routerMac' : dict_param['routerMac'],
				'userMac' : dict_param['userMac'],
				'mobileNum' : dict_param['mobileNum'],
				'denomination' : dict_param['denomination'],
				'type' : dict_param['type'],
				'price' : dict_param['price'],
				'rrn' : str(rrn_resp),
				'resp' : str(resp_resp),
				'tid' : str(tid_resp),
				'bal' : str(bal_resp),
				'epin' : str(epin_resp),
				'err' : str(err_resp)
			   }
		
		response = json.dumps(obj)

		
		if resp_resp != '0':
			# Write to failed directory
			self.init_trans(obj, 'failed', self.failed_path)
			# return response // When im going to use the mediation /getLoadMK
			return 'Error: ' + obj['resp'] + '. ' + obj['err'] + '. Please Repeat Transaction.'
		

		# Write to success directory
		self.init_trans(obj, 'success', self.success_path)
		mac_balance = controller.get_mac_balance(dict_param['routerMac'])
		return 'Success, ' + '%.2f'%float(mac_balance[0]['balance'])
		