import mysql.connector
import pytz, datetime, hashlib
import random
import jwt, logging, re

from logs.log_conf import Logger

logging.basicConfig()
log = logging.getLogger(__name__)

class Authenticates:
	def __init__(self):
		time_zone = pytz.timezone('Asia/Manila')
		_datetime = str(datetime.datetime.now(time_zone))
		now = _datetime.split('.')

		self.now = now[0]
		self.dbuser = 'root'
		self.dbpass = 'r3m0teSec'
		self.dbname = 'load_central_transactions'
	
	def dict_converter(self, tup_param):
		arr = []
		for i in range(len(tup_param)):
			obj = {}
			obj['id'] = tup_param[i][0]
			obj['username'] = tup_param[i][1]
			obj['email'] = tup_param[i][2]
			obj['password'] = tup_param[i][3]
			obj['type'] = tup_param[i][4]
			obj['token'] = tup_param[i][5]
			obj['dateCreated'] = tup_param[i][6]
			obj['dateUpdated'] = tup_param[i][7]
			arr.append(obj)
		return arr

	def getUser(self, uname, utype):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 			   database=self.dbname)
		except:
			return None
		data = (uname, utype)
		get_user = """ SELECT * FROM users WHERE users.username = %s
        			AND users.type = %s """

		cursor = conn.cursor(prepared = True)
		cursor.execute(get_user, data)
		user_data = cursor.fetchall()
		user_data = self.dict_converter(user_data)

		cursor.close()
		conn.close()
		return user_data

	def addUser(self, uname, email, pword, utype):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 			   database=self.dbname)
			cursor = conn.cursor(prepared = True)
		except:
			return 'Connection Unavailble DB error'
		
		token = ''.join(random.choice('1234567890') for i in range(20))
		pword = hashlib.sha256(pword.encode() + token.encode()).hexdigest() + hashlib.sha256(token.encode()).hexdigest()

		data = (uname, email, pword, utype, token, self.now, self.now)
		add_new_user = """ INSERT INTO users(username, email, password, type, token, dateCreated, dateUpdated)
						VALUES(%s, %s, %s, %s, %s, %s, %s) """
		
		# check if username is already existed
		check_for_user = """ SELECT username FROM users WHERE username = %s """
		cursor.execute(check_for_user, (uname,))
		user = cursor.fetchall()
		if len(user) != 0:
			return 0

		# check if email is already existed
		check_for_email = ''' SELECT email FROM users WHERE email = %s '''
		cursor.execute(check_for_email, (email,))
		emailData = cursor.fetchall()
		if len(emailData) != 0:
			return 1

		# check if email is valid
		if not re.fullmatch(r"[^@]+@[^@]+\.[^@]+", email):
			return 2

		# If user type is operator, the operators table must be updated
		if utype == 'Operator':
			data_operator = (uname, self.now, self.now)
			add_to_operator = """ INSERT INTO operators(operator, dateCreated, dateUpdated)
								VALUES(%s, %s, %s) """
			cursor.execute(add_to_operator, data_operator)

		cursor.execute(add_new_user, data)
		conn.commit()
		cursor.close()
		conn.close()
		return 'Successfully Added'

	def checkPassword(self, uname, pword, utype):
		user = self.getUser(uname, utype)
		if user == None:
			return 'Connection Not Available DB error'
		if len(user) == 0:
			return 0
		user_pword = user[0]['password']
		user_token = user[0]['token']
		log.info(str(user))
		att_pword = hashlib.sha256(pword.encode() + user_token.encode()).hexdigest() + hashlib.sha256(user_token.encode()).hexdigest()

		if att_pword == user_pword:
			return 'Success'
		return 0

	def create_web_token(self, uname):
		# Generate random string
		str1 = '_' + ''.join(random.choice('1234567890') for i in range(10))
		# create token
		token = jwt.encode({'username' : uname, 'exp' : self.now + datetime.timedelta(seconds=30)},
				app.secret_key)
		return token
