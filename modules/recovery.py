import smtplib, ssl, json, random, logging, hashlib, mysql.connector, re
from logs.log_conf import Logger

logging.basicConfig()
log = logging.getLogger(__name__)

class AccountRecovery:
	def __init__(self):
		self.dbuser = 'root'
		self.dbpass = 'r3m0teSec'
		self.dbname = 'load_central_transactions'

		self.sender = 'peterfrialas@gmail.com'
		self.pword = 'elementorsako'
		self.port = 465

	def findAccount(self, email):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 				database=self.dbname)		
			cursor = conn.cursor(prepared=True)
		except:
			return 'Connection Unavailble DB error'

		# Find the input username
		query1 = ''' SELECT username FROM users WHERE email = %s '''
		cursor.execute(query1, (email,))
		userData = cursor.fetchall()
		if len(userData) == 0:
			cursor.close()
			conn.close()
			return False
		username = userData[0][0]
		cursor.close()
		conn.close()
		return username

	def createVerificationCode(self):
		vcode = ''.join(random.choice('1234567890') for i in range(6))
		return vcode

	def sendVerficationCode(self, email, vcode):
		message = 'Your verification code is ' + str(vcode) + '.'
		context = ssl.create_default_context()
		with smtplib.SMTP_SSL('smtp.gmail.com', self.port, context=context) as server:
			server.login(self.sender, self.pword)
			server.sendmail(self.sender, email, message)
		return True

	def changePassword(self, username, new_pass):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 				database=self.dbname)		
			cursor = conn.cursor(prepared=True)
		except:
			return 'Connection Unavailble DB error'
			
		# Get the token of certain username
		query1 = ''' SELECT token FROM users WHERE username = %s '''
		cursor.execute(query1, (username,))
		token = cursor.fetchall()
		if len(token) == 0:
			return False
		token = token[0][0]

		# Change password
		new_pass = hashlib.sha256(new_pass.encode() + token.encode()).hexdigest() + hashlib.sha256(token.encode()).hexdigest()
		query2 = ''' UPDATE users SET password = %s WHERE username = %s '''
		cursor.execute(query2, (new_pass, username))
		conn.commit()
		cursor.close()
		conn.close()

		return True

	def changeEmail(self, username, new_email):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 				database=self.dbname)		
			cursor = conn.cursor(prepared=True)
		except:
			return 'Connection Unavailble DB error'

		# check if email is valid
		if not re.fullmatch(r"[^@]+@[^@]+\.[^@]+", new_email):
			return 'Invalid email address.'

		# check if email is already existed
		check_for_email = ''' SELECT email FROM users WHERE email = %s '''
		cursor.execute(check_for_email, (new_email,))
		emailData = cursor.fetchall()
		if len(emailData) != 0:
			return 'Email address is already in use.'

		query1 = ''' UPDATE users SET email = %s WHERE username = %s '''
		cursor.execute(query1, (new_email, username))
		conn.commit()
		cursor.close()
		conn.close()

		return 'Success'