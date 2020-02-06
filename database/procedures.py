import pytz, datetime, time, re, mysql.connector, hashlib, json, random
import logging, requests, monthdelta
from logs.log_conf import Logger
from modules import files

logging.basicConfig()
log = logging.getLogger(__name__)

macSettingsFile = files.MacsSettingsFile()

class Procedures:
	def __init__(self):
		time_zone = pytz.timezone('Asia/Manila')
		_datetime = str(datetime.datetime.now(time_zone))
		now = _datetime.split('.')

		self.now = now[0]
		self.dbuser = 'root'
		self.dbpass = 'r3m0teSec'
		self.dbname = 'load_central_transactions'
		self.chars = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890'

	def datenow(self):
		time_zone = pytz.timezone('Asia/Manila')
		_datetime = str(datetime.datetime.now(time_zone))
		now = _datetime.split('.')
		return now[0]

	# Added start
	def normalDate(self):
		time_zone = pytz.timezone('Asia/Manila')
		return datetime.datetime.now(time_zone)

	def readableDate(self):
		return self.normalDate().strftime('%b/%d/%Y_%H:%M:%S').lower()
	# Added end

	def dbClose(self, conn, cursor):
		cursor.close()
		conn.close()
		return ''

	def getOperatorOfMac(self, mac):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 				database=self.dbname)		
			cursor = conn.cursor(dictionary=True)
		except:
			return 'Connection Unavailble DB error'

		q1 = ''' SELECT operator, site FROM macs WHERE mac = %s '''
		cursor.execute(q1, (mac,))
		operatorData = cursor.fetchall()
		if len(operatorData) == 0:
			operatorData = [{'operator' : '', 'site' : ''}]
		cursor.close()
		conn.close()

		return operatorData

	def getOperatorPrice(self, pcode, operator):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 				database=self.dbname)		
			cursor = conn.cursor(dictionary=True)
		except:
			return 'Connection Unavailble DB error'

		q1 = ''' SELECT price, provider, pcode FROM price_operators WHERE pcode = %s AND operator = %s '''
		cursor.execute(q1, (pcode, operator))
		oprPriceData = cursor.fetchall()
		if len(oprPriceData) == 0:
			cursor.execute(q1, (pcode, ''))
			oprPriceData = cursor.fetchall()
			if len(oprPriceData) == 0:
				oprPriceData = [{'price' : 0, 'provider' : 0, 'pcode' : 'undefined'}]
		cursor.close()
		conn.close()

		return oprPriceData

	def getAdminPrice(self, pcode):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 				database=self.dbname)		
			cursor = conn.cursor(dictionary=True)
		except:
			return 'Connection Unavailble DB error'

		q1 = ''' SELECT price, pcode FROM price_admin WHERE pcode = %s '''
		cursor.execute(q1, (pcode,))
		adminPriceData = cursor.fetchall()
		if len(adminPriceData) == 0:
			adminPriceData = [{'price' : 0, 'pcode' : 'undefined'}]
		cursor.close()
		conn.close()

		return adminPriceData

	def getBasePrice(self, pcode):
		base_price = re.findall('(\d+)', pcode)
		return float(base_price[0])

	def getServiceCharge(self, operator):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 				database=self.dbname)		
			cursor = conn.cursor(dictionary=True)
		except:
			return 'Connection Unavailble DB error'

		q1 = ''' SELECT service_charge FROM operators WHERE operator = %s '''
		cursor.execute(q1, (operator,))
		serviceCharge = cursor.fetchall()
		if len(serviceCharge) == 0:
			serviceCharge = 0
		cursor.close()
		conn.close()

		return serviceCharge[0]['service_charge']

	''' ---------------------  TRANSACTIONS PROCEDURES --------------------- '''

	''' This Procedure Adds The Transactions Into Database '''
	def addTransApp(self, obj, status):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 				database=self.dbname)		
			cursor = conn.cursor(prepared=True)
		except:
			return 'Connection Unavailble DB error'

		if obj['routerMac'] == None or obj['routerMac'] == '':
			return 'Failed, routerMac is undefined'

		# Get the operator and site of a certain mac
		operatorData = self.getOperatorOfMac(obj['routerMac'])
		operator = operatorData[0]['operator']
		site = operatorData[0]['site']

		# get operator product price
		oprPriceData = self.getOperatorPrice(obj['denomination'], operator)
		price = oprPriceData[0]['price']
		provider = oprPriceData[0]['provider']

		# get admin price of certain pcode
		adminPriceData = self.getAdminPrice(obj['denomination'])
		a_price = adminPriceData[0]['price']

		# get base price of certain pcode
		base_price = self.getBasePrice(obj['denomination'])

		# get service charge of certain operator
		serviceCharge = self.getServiceCharge(operator)
		
		# if success trnsaction
		if status == 'success':
			loadcentral_price = float(self.GET_BALANCE('admin', '')) - float(obj['bal']) # PRIORITY NOTE : uncomment after launching to production #base_price
			admin_balance = obj['bal']
			admin_deduction = loadcentral_price
			deduction = a_price

			opr_sales = price
			opr_revenue = float(price) - (float(a_price) + float(serviceCharge))
			# if opr_revenue < 0:	opr_revenue = 0
			admin_sales = a_price
			admin_revenue = float(a_price) - float(loadcentral_price)
			# if admin_revenue < 0:	admin_revenue = 0

			# update sales table
			addToSales = """ INSERT INTO sales(user, sale, revenue, mac, dateCreated) VALUES(%s, %s, %s, %s, %s) """
			cursor.executemany(addToSales, [(operator, opr_sales, opr_revenue, obj['routerMac'], self.datenow()), 
			('admin', admin_sales, admin_revenue, obj['routerMac'], self.datenow())])

			# update price_loadcentral table
			updatePriceLoadCentral = """ UPDATE price_loadcentral SET price = %s WHERE pcode = %s """
			cursor.execute(updatePriceLoadCentral, (loadcentral_price, obj['denomination']))
		
		else:
			loadcentral_price = 0
			admin_balance = self.GET_BALANCE('admin', '') # get the current admin balance
			admin_deduction = 0
			deduction = 0
			admin_revenue = 0
			opr_revenue = 0

		# get the current mac balance
		macBalance = self.GET_MAC_BALANCE(obj['routerMac'])
		macBalance = float(macBalance) - float(deduction)
		if macBalance <= 0:	macBalance = 0	# Stop Subtracting

		# update notification table when mac balance is below 100
		if macBalance < 100 and macBalance != 0:
			deletePrevNotif = """ DELETE FROM notifications WHERE notification = %s AND mac = %s """
			updateNotifTable = """ INSERT INTO notifications(user, operator, mac, notification, notiftype, dateCreated)
								VALUES(%s, %s, %s, %s, %s, %s) """
			cursor.execute(deletePrevNotif, ('low-balance', obj['routerMac']))
			cursor.execute(updateNotifTable, (operator, operator, obj['routerMac'], 'low-balance', 'Operator', self.datenow()))

		# transaction happens
		addTrans = """ INSERT INTO transactions(routerMac, userMac, mobileNum, denomination, price, loadcentral_price, 
					admin_revenue, opr_revenue, rrn, response_code, tid, bal, mac_bal, epin, err, type, site, operator, 
					admin_price, base_price, service_charge, provider, dateCreated) 
					VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) """
		transData = (obj['routerMac'], obj['userMac'], obj['mobileNum'], obj['denomination'], price, loadcentral_price, 
					admin_revenue, opr_revenue, obj['rrn'], obj['resp'], obj['tid'], obj['bal'], macBalance, 
					obj['epin'], obj['err'], obj['type'], site, operator, a_price, base_price, serviceCharge, provider, self.datenow())
		cursor.execute(addTrans, transData)


		addBalanceLog = """ INSERT INTO balance_logs(mac, balance, deduction, dateCreated)
							VALUES (%s, %s, %s, %s) """
		balanceLogData = [(obj['routerMac'], macBalance, deduction, self.datenow()),
					   ('admin', admin_balance, admin_deduction, self.datenow())]
		cursor.executemany(addBalanceLog, balanceLogData)

		updateMacsTable = """ UPDATE macs SET balance = %s WHERE mac = %s """
		cursor.execute(updateMacsTable, (macBalance, obj['routerMac']))

		conn.commit()
		cursor.close()
		conn.close()

		return 'Successfully Inserted'


	def addTransWeb(self, obj, status):
		# NOTE: obj['routerMac'] stands as operator
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 				database=self.dbname)		
			cursor = conn.cursor(prepared=True)
		except:
			return 'Connection Unavailble DB error'
		
		# get operator product price
		oprPriceData = self.getOperatorPrice(obj['denomination'], obj['routerMac'])
		price = oprPriceData[0]['price']
		provider = oprPriceData[0]['provider']

		# get admin price of certain pcode
		adminPriceData = self.getAdminPrice(obj['denomination'])
		a_price = adminPriceData[0]['price']

		# get base price of certain pcode
		base_price = self.getBasePrice(obj['denomination'])

		# get service charge of certain operator
		serviceCharge = self.getServiceCharge(obj['routerMac'])
		
		# if success trnsaction
		if status == 'success':
			loadcentral_price = float(self.GET_BALANCE('admin', '')) - float(obj['bal']) # PRIORITY NOTE : uncomment after launching to production #base_price
			admin_balance = obj['bal']
			admin_deduction = loadcentral_price
			deduction = a_price

			opr_sales = price
			opr_revenue = float(price) - (float(a_price) + float(serviceCharge))
			# if opr_revenue < 0:	opr_revenue = 0
			admin_sales = a_price
			admin_revenue = float(a_price) - float(loadcentral_price)
			# if admin_revenue < 0:	admin_revenue = 0

			# update sales table
			addToSales = """ INSERT INTO sales(user, sale, revenue, mac, dateCreated) VALUES(%s, %s, %s, %s, %s) """
			cursor.executemany(addToSales, [(obj['routerMac'], opr_sales, opr_revenue, obj['routerMac'], self.datenow()), 
			('admin', admin_sales, admin_revenue, obj['routerMac'], self.datenow())])

			# update price_loadcentral table
			updatePriceLoadCentral = """ UPDATE price_loadcentral SET price = %s WHERE pcode = %s """
			cursor.execute(updatePriceLoadCentral, (loadcentral_price, obj['denomination']))
		
		else:
			loadcentral_price = 0
			admin_balance = self.GET_BALANCE('admin', '') # get the current admin balance
			admin_deduction = 0
			deduction = 0
			admin_revenue = 0
			opr_revenue = 0

		# get the current operator balance
		oprBalance = self.GET_OPERATOR_BALANCE(obj['routerMac'])
		oprBalance = float(oprBalance) - float(deduction)
		if oprBalance <= 0:	oprBalance = 0	# Stop Subtracting

		# update notification table when operator balance is below 100
		if oprBalance < 1000 and oprBalance != 0:
			deletePrevNotif = """ DELETE FROM notifications WHERE notification = %s AND operator = %s """
			updateNotifTable = """ INSERT INTO notifications(user, operator, mac, notification, notiftype, dateCreated)
								VALUES(%s, %s, %s, %s, %s, %s) """
			cursor.execute(deletePrevNotif, ('low-balance', obj['routerMac']))
			cursor.execute(updateNotifTable, (obj['routerMac'], obj['routerMac'], '', 'low-balance', 'Operator', self.datenow()))

		# transaction happens
		addTrans = """ INSERT INTO transactions(routerMac, userMac, mobileNum, denomination, price, loadcentral_price, 
					admin_revenue, opr_revenue, rrn, response_code, tid, bal, mac_bal, epin, err, type, site, operator, 
					admin_price, base_price, service_charge, provider, dateCreated) 
					VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) """
		transData = (obj['routerMac'], obj['userMac'], obj['mobileNum'], obj['denomination'], price, loadcentral_price, 
					admin_revenue, opr_revenue, obj['rrn'], obj['resp'], obj['tid'], obj['bal'], oprBalance, 
					obj['epin'], obj['err'], obj['type'], 'WebPurchase', obj['routerMac'], a_price, base_price, serviceCharge, provider, self.datenow())
		cursor.execute(addTrans, transData)


		addBalanceLog = """ INSERT INTO op_balance_logs(operator, balance, deduction, dateCreated)
							VALUES (%s, %s, %s, %s) """
		balanceLogData = [(obj['routerMac'], oprBalance, deduction, self.datenow()),
					   ('admin', admin_balance, admin_deduction, self.datenow())]
		cursor.executemany(addBalanceLog, balanceLogData)

		updateOprTable = """ UPDATE operators SET balance = %s WHERE operator = %s """
		cursor.execute(updateOprTable, (oprBalance, obj['routerMac']))

		conn.commit()
		cursor.close()
		conn.close()

		return 'Successfully Inserted'


	''' This Procedure Determines If The Routermac Of Transaction is Already Registered in List of Macs
		Then Adds it Into The List of Macs if Not Registered	'''
	def addMac(self, mac):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 			   database=self.dbname)
			cursor = conn.cursor(dictionary=True)
		except:
			return 'Connection Unavailble DB error'

		if mac == None or mac == '':
			return 'No insertion'

		# check for mac
		q1 = ''' SELECT * FROM macs WHERE macs.mac = %s '''
		cursor.execute(q1, (mac,))
		macData = cursor.fetchall()
		if len(macData) != 0:
			return 'No insertion'

		q2 = ''' INSERT INTO macs(mac, dateCreated, dateUpdated) VALUES(%s, %s, %s) '''
		cursor.execute(q2, (mac, self.datenow(), self.datenow()))
		conn.commit()
		cursor.close()
		conn.close()

		return 'Successfully Inserted'
		

	def CHECK_PROMO_STATUS(self, pcode):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 			   database=self.dbname)
			cursor = conn.cursor(prepared=True)
		except:
			return 'Connection Unavailble DB error'

		query = """ SELECT status, pcode FROM price_loadcentral WHERE pcode = %s """
		cursor.execute(query, (pcode,))
		rows = cursor.fetchall()
		if len(rows) == 0:
			status = 'Enabled'
		else:
			status = rows[0][0]
		cursor.close()
		conn.close()

		return status

	def CHECK_MAC_STATUS(self, mac):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 			   database=self.dbname)
			cursor = conn.cursor(prepared=True)
		except:
			return 'Connection Unavailble DB error'

		query = """ SELECT status, mac FROM macs WHERE mac = %s """
		cursor.execute(query, (mac,))
		rows = cursor.fetchall()
		if len(rows) == 0:
			status = 'Enabled'
		else:
			status = rows[0][0]
		cursor.close()
		conn.close()

		return status

	''' This Procedure Gets The Latest Balance of a Device '''
	def GET_MAC_BALANCE(self, mac):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 			   database=self.dbname)
			cursor = conn.cursor(prepared=True)
		except:
			return 'Connection Unavailble DB error'

		get_mac_bal = """ SELECT balance FROM balance_logs WHERE balance_logs.id IN(
						SELECT MAX(id) FROM balance_logs WHERE mac = %s) """
		_mac = (mac,)

		cursor.execute(get_mac_bal, _mac)
		mac_bal = cursor.fetchall()
		if len(mac_bal) == 0:		return 0
		mac_bal = mac_bal[0][0]
		
		cursor.close()
		conn.close()
		return mac_bal

	''' ---------------------  SITE PROCEDURES --------------------- '''
	
	''' This Procedure Gets The Balance of Admin, Operator & Partner '''
	def GET_BALANCE(self, userType, user):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 			   database=self.dbname)
			cursor = conn.cursor(prepared = True)
		except:
			return 'Connection Unavailble DB error'
		

		admin = """ SELECT bal FROM transactions WHERE transactions.id IN(
				SELECT MAX(id) FROM transactions) """	# Proven correct
		
		operator =	""" SELECT balance FROM op_balance_logs WHERE id IN(
						SELECT MAX(id) FROM op_balance_logs WHERE operator = %s) """	# Proven correct

		if userType == 'admin':
			cursor.execute(admin)
			rows = cursor.fetchall()
		
		elif userType == 'operator':
			cursor.execute(operator, (user,))
			rows = cursor.fetchall()
	
		else:
			return 0
		
		if len(rows) == 0: return 0
		if rows[0][0] == None:	return 0
		balance = rows[0][0]
		cursor.close()
		conn.close()
		return balance

	




	def getMacsList(self, userType, user):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 			   database=self.dbname)
			cursor = conn.cursor(dictionary = True)
		except:
			return 'Connection Unavailble DB error'

		admin = """ SELECT CAST(dateCreated AS CHAR(50)) AS dateCreated, mac, site, operator, 
				CAST(dateUpdated AS CHAR(50)) AS dateUpdated, balance, status FROM macs 
				ORDER BY mac ASC"""
		
		operator = """ SELECT CAST(dateCreated AS CHAR(50)) AS dateCreated, mac, site, operator, 
					CAST(dateUpdated AS CHAR(50)) AS dateUpdated, balance, status FROM macs
					WHERE macs.operator = %s ORDER BY mac ASC """

		if userType == 'admin':
			cursor.execute(admin)
			rows = cursor.fetchall()
		
		elif userType == 'operator':
			cursor.execute(operator, (user,))
			rows = cursor.fetchall()

		else:
			rows = []

		cursor.close()
		conn.close()
		return rows

	def GET_OPERATORS_LIST(self):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 			   database=self.dbname)
			cursor = conn.cursor(prepared = True)
		except:
			return 'Connection Unavailble DB error'

		query = """ SELECT dateCreated, operator, partner, dateUpdated, balance, status FROM operators
				ORDER BY operator ASC """

		# drop = """ DROP TABLE IF EXISTS tmpopbalancelogs """
		# create = """ CREATE TABLE tmpopbalancelogs(
		# 				id int(11) AUTO_INCREMENT PRIMARY KEY,
		# 				operator varchar(180) NOT NULL DEFAULT '',
		# 				balance varchar(180) NOT NULL DEFAULT '',
		# 				dateCreated varchar(180) NOT NULL DEFAULT ''
		# 			) """
		# populate = """ INSERT INTO tmpopbalancelogs(operator, balance, dateCreated)
		# 							        SELECT operator, balance, dateCreated FROM op_balance_logs
		# 							        WHERE id IN(SELECT MAX(id) FROM op_balance_logs GROUP BY operator) """
		# query = """ SELECT operators.dateCreated, operators.operator, operators.partner, tmpopbalancelogs.balance FROM operators
		# 			LEFT OUTER JOIN tmpopbalancelogs ON operators.operator = tmpopbalancelogs.operator
		# 			ORDER BY operators.operator ASC """

		# cursor.execute(drop)
		# cursor.execute(create)
		# cursor.execute(populate)
		# conn.commit()
		cursor.execute(query)
		rows = cursor.fetchall()
		if rows == None:
			return 0

		cursor.close()
		conn.close()
		return rows

	def GET_PARTNERS_LIST(self):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 			   database=self.dbname)
			cursor = conn.cursor(prepared = True)
		except:
			return 'Connection Unavailble DB error'

		query = """ SELECT dateCreated, username, dateUpdated FROM users
				WHERE type = 'Partner' ORDER BY username ASC """

		cursor.execute(query)
		rows = cursor.fetchall()
		if rows == None:
			return 0

		cursor.close()
		conn.close()
		return rows


	def ASSIGN_OPERATORS(self, partner, operator):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 			   database=self.dbname)
			cursor = conn.cursor(prepared = True)
		except:
			return 'Connection Unavailble DB error'

		assign = """ UPDATE operators SET operators.partner = %s
					WHERE operators.operator = %s """

		_data = (partner, operator)
		cursor.execute(assign, _data)
		conn.commit()
		cursor.close()
		conn.close()
		return 'Successfully Assigned'

	def ADD_TOPUP(self, mac, topup):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 			   database=self.dbname)
			cursor = conn.cursor(prepared = True)
		except:
			return 'Connection Unavailble DB error'

		add_topup = """ INSERT INTO balance_logs(mac, balance, deduction, topup, dateCreated)
					VALUES(%s, %s, %s, %s, %s) """

		update_macs_tb = """ UPDATE macs SET balance = %s WHERE mac = %s """
		topup_history = """ INSERT INTO topup_history(operator, mac, topup, dateCreated)
							VALUES(%s, %s, %s, %s) """
		update_notif_tb = """ INSERT INTO notifications(user, operator, mac, notification, notiftype, dateCreated)
							VALUES(%s, %s, %s, %s, %s, %s) """
		notif = 'distribute|' + topup + '|' + mac

		# Get the operator of a certain mac
		get_operator = """ SELECT operator FROM macs WHERE mac = %s """
		cursor.execute(get_operator, (mac,))
		operator = cursor.fetchall()
		if len(operator) == 0:
			operator = ''
		else:
			operator = operator[0][0]
		
		current_mac_bal = self.GET_MAC_BALANCE(mac)
		balance = float(current_mac_bal) + int(topup)

		cursor.execute(add_topup, (mac, balance, '0', topup, self.datenow()))
		cursor.execute(update_macs_tb, (balance, mac))
		cursor.execute(topup_history, ('Admin', mac, topup, self.datenow()))
		cursor.execute(update_notif_tb, ('Admin', operator, mac, notif, 'Operator', self.datenow()))
		conn.commit()
		cursor.close()
		conn.close()

		return 'Successfully Topped Up'

	def CHECK_BALANCE(self, username, mac):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 			   database=self.dbname)
			cursor = conn.cursor(prepared = True)
		except:
			return 'Connection Unavailble DB error'

		admin = """ SELECT balance FROM balance_logs WHERE balance_logs.id IN(
				SELECT MAX(id) FROM balance_logs WHERE mac = %s) """

		operator = """ SELECT balance_logs.balance FROM balance_logs
					LEFT OUTER JOIN macs ON macs.mac = balance_logs.mac
					WHERE balance_logs.id IN(
						SELECT MAX(id) FROM balance_logs WHERE mac = %s)
					AND macs.operator = %s """

		get_userType = """ SELECT type FROM users WHERE username = %s """

		_username = (username,)
		cursor.execute(get_userType, _username)
		rows = cursor.fetchall()
		if len(rows) == 0:
			return 'None'
		else:
			userType = rows[0][0]

		if userType == 'Admin':
			_data = (mac,)
			cursor.execute(admin, _data)
			bal = cursor.fetchall()
			if len(bal) == 0:
				self.addMac(mac)
				return 'None'
			else:
				balance = bal[0][0]
		elif userType == 'Operator':
			_data = (mac, username)
			cursor.execute(operator, _data)
			bal = cursor.fetchall()
			if len(bal) == 0:
				self.addMac(mac)
				return 'None'
			else:
				balance = bal[0][0]

		else:
			return 0

		cursor.close()
		conn.close()
		return balance

	def GET_OPERATOR_BALANCE(self, operator):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 			   database=self.dbname)
			cursor = conn.cursor(prepared = True)
		except:
			return 'Connection Unavailble DB error'

		current_op_bal = """ SELECT balance FROM op_balance_logs WHERE id IN(
						SELECT MAX(id) FROM op_balance_logs WHERE operator = %s) """
		
		# Get the latest balance of operator
		op_val = (operator,)
		cursor.execute(current_op_bal, op_val)
		op_bal = cursor.fetchall()
		if len(op_bal) == 0:
			op_bal = '0'
		else:
			op_bal = op_bal[0][0]

		cursor.close()
		conn.close()
		return op_bal

	# This procedure adds balance to operators
	def TOPUP_OPERATOR(self, operator, topup):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 			   database=self.dbname)
			cursor = conn.cursor(prepared = True)
		except:
			return 'Connection Unavailble DB error'

		add_topup = """ INSERT INTO op_balance_logs(operator, balance, deduction, topup, dateCreated)
					VALUES(%s, %s, %s, %s, %s) """

		opr_tb = """ UPDATE operators SET balance = %s WHERE operator = %s """

		topup_history_opr = """ INSERT INTO topup_history(operator, mac, topup, dateCreated)
							VALUES(%s, %s, %s, %s) """
		update_notif_tb = """ INSERT INTO notifications(user, operator, mac, notification, notiftype, dateCreated)
							VALUES(%s, %s, %s, %s, %s, %s) """
		notif = 'distribute|' + topup + '|' + operator

		op_bal = self.GET_OPERATOR_BALANCE(operator)
		balance = float(op_bal) + int(topup)

		cursor.execute(add_topup, (operator, balance, '0', topup, self.datenow()))
		cursor.execute(opr_tb, (balance, operator))
		cursor.execute(topup_history_opr, (operator, operator, topup, self.datenow()))
		cursor.execute(update_notif_tb, ('Admin', operator, '', notif, 'Operator', self.datenow()))
		cursor.close()
		conn.commit()
		conn.close()

		return 'Successfully, Topped Up'

	# This procedure is desame as ADD_TOPUP except it is dependent from operator's balance
	def TOPUP_OPERATOR_MAC(self, operator, mac, topup):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 			   database=self.dbname)
			cursor = conn.cursor(prepared = True)
		except:
			return 'Connection Unavailble DB error'

		add_topup = """ INSERT INTO balance_logs(mac, balance, deduction, topup, dateCreated)
					VALUES(%s, %s, %s, %s, %s) """

		deduct_opr = """ INSERT INTO op_balance_logs(operator, balance, deduction, topup, dateCreated)
						VALUES(%s, %s, %s, %s, %s) """

		opr_tb = """ UPDATE operators SET balance = %s WHERE operator = %s """

		update_macs_tb = """ UPDATE macs SET balance = %s WHERE mac = %s """

		topup_history_opr = """ INSERT INTO topup_history(operator, mac, topup, dateCreated)
							VALUES(%s, %s, %s, %s) """

		update_notif_tb = """ INSERT INTO notifications(user, operator, mac, notification, notiftype, dateCreated)
							VALUES(%s, %s, %s, %s, %s, %s) """
		notif = 'distribute|' + topup + '|' + mac

		op_bal = self.GET_OPERATOR_BALANCE(operator)

		# Check if topup value is greater than operator balance
		if int(topup) > float(op_bal):
			return 'Topup Failed, Your internal balance is not enough'

		current_mac_bal = self.GET_MAC_BALANCE(mac)
		mac_balance = float(current_mac_bal) + int(topup)
		op_bal = float(op_bal) - int(topup)

		# Check if operator balance is below 1000
		if op_bal <= 1000:
			delete_prev_notif = """ DELETE FROM notifications WHERE notification = %s AND operator = %s AND user = 'Admin' """
			update_notif_tb2 = """ INSERT INTO notifications(user, operator, mac, notification, notiftype, dateCreated)
								VALUES(%s, %s, %s, %s, %s, %s) """
			cursor.execute(delete_prev_notif, ('low-balance', operator))
			cursor.executemany(update_notif_tb2, [('Admin', operator, '', 'low-balance', 'Admin', self.datenow()),
												('Admin', operator, '', 'low-balance', 'Operator', self.datenow())])


		cursor.execute(add_topup, (mac, mac_balance, '0', topup, self.datenow()))
		cursor.execute(deduct_opr, (operator, op_bal, topup, '0', self.datenow()))
		cursor.execute(opr_tb, (op_bal, operator))
		cursor.execute(update_macs_tb, (mac_balance, mac))
		cursor.execute(topup_history_opr, (operator, mac, topup, self.datenow()))
		cursor.execute(update_notif_tb, (operator, operator, mac, notif, 'Operator', self.datenow()))
		conn.commit()
		cursor.close()
		conn.close()

		return 'Successfully Topped Up'

	def TOPUP_HISTORY(self, operator, occ, mac):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 			   database=self.dbname)
			cursor = conn.cursor(prepared = True)
		except:
			return 'Connection Unavailble DB error'

		if occ == 'daily':
			occurence = 'AND dateCreated > DATE_SUB(NOW(), INTERVAL 5 DAY)'
		elif occ == 'weekly':
			occurence = 'AND dateCreated > DATE_SUB(NOW(), INTERVAL 15 DAY)'
		elif occ == 'monthly':
			occurence = 'AND dateCreated > DATE_SUB(NOW(), INTERVAL 30 DAY)'
		else:
			occurence = ''

	
		# For admin purpose
		if operator == '' or operator == None:
			query = query = """ SELECT operator, mac, topup, dateCreated FROM topup_history
					WHERE mac = %s """ + occurence +  " ORDER BY dateCreated DESC "
			cursor.execute(query, (mac,))

		# Note : The next 3 elif statements uses operator parameter as a condition parameter for admin
		elif operator == 'all':
			query = """ SELECT operator, mac, topup, dateCreated FROM topup_history
					WHERE operator != '' AND mac != '' """ + occurence +  " ORDER BY dateCreated DESC "
			cursor.execute(query)

		elif operator == 'all-operator':
			query = """ SELECT operator, mac, topup, dateCreated FROM topup_history
					WHERE operator = mac """ + occurence +  " ORDER BY dateCreated DESC "
			cursor.execute(query)

		elif operator == 'all-mac':
			query = """ SELECT operator, mac, topup, dateCreated FROM topup_history
					WHERE operator != mac """ + occurence +  " ORDER BY dateCreated DESC "
			cursor.execute(query)

		# For operators purpose
		elif mac == '' or mac == None:
			query = """ SELECT operator, mac, topup, dateCreated FROM topup_history
					WHERE operator = %s """ + occurence +  " ORDER BY dateCreated DESC "
			cursor.execute(query, (operator,))
		
		else:
			query = """ SELECT operator, mac, topup, dateCreated FROM topup_history
					WHERE operator = %s AND mac = %s """ + occurence +  " ORDER BY dateCreated DESC "
			cursor.execute(query, (operator, mac))

		rows = cursor.fetchall()
		if len(rows) == 0:
			return 0

		cursor.close()
		conn.close()
		return rows

	# Returns the product prices of a certain operator
	def INQUIRE_RATE(self, operator, mac):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 			   database=self.dbname)
			cursor = conn.cursor(prepared = True)
		except:
			return 'Connection Unavailble DB error'

		if operator == None and mac != None:
			# Get the operator of certain mac
			q1 = ''' SELECT operator FROM macs WHERE mac = %s '''
			cursor.execute(q1, (mac,))
			operator = cursor.fetchall()
			if len(operator) == 0:
				cursor.close()
				conn.close()
				return operator
			operator = operator[0][0]

		query = """ SELECT pcode, price FROM price_operators WHERE operator = %s """
		cursor.execute(query, (operator,))
		rows = cursor.fetchall()
		cursor.close()
		conn.close()

		return rows

	def getProducts(self, provider, operator):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 			   database=self.dbname)
			cursor = conn.cursor(dictionary = True)
		except:
			return 'Connection Unavailble DB error'

		if operator == '':
			if provider == '':
				products = """ SELECT price_loadcentral.description, products.description AS description2, price_admin.pcode, price_loadcentral.price AS product_cost, 
							price_admin.price, price_loadcentral.provider, price_loadcentral.status FROM price_loadcentral
							LEFT OUTER JOIN price_admin ON price_loadcentral.pcode = price_admin.pcode
							LEFT OUTER JOIN products ON products.productCode = price_loadcentral.pcode """
				cursor.execute(products)
			else:
				products = """ SELECT price_loadcentral.description, products.description AS description2, price_admin.pcode, price_loadcentral.price AS product_cost, 
							price_admin.price, price_loadcentral.provider, price_loadcentral.status FROM price_loadcentral
							LEFT OUTER JOIN price_admin ON price_loadcentral.pcode = price_admin.pcode
							LEFT OUTER JOIN products ON products.productCode = price_loadcentral.pcode
							WHERE price_loadcentral.provider = %s """
				cursor.execute(products, (provider,))

		else:
			# check if there were already products of certain operator
			query1 = """ SELECT operator, pcode FROM price_operators WHERE operator = %s """
			cursor.execute(query1, (operator,))
			res1 = cursor.fetchall()
			if len(res1) == 0:
				query2 = """ INSERT INTO price_operators(description, pcode, price, provider, operator)
						SELECT description, pcode, price, provider, %s AS operator FROM price_operators WHERE operator = '' """
				cursor.execute(query2, (operator,))
				conn.commit()

			if provider == '':
				products = """ SELECT price_operators.description, products.description AS description2, price_operators.pcode, price_admin.price AS product_cost, 
							price_operators.price, price_operators.provider, price_loadcentral.status, icon FROM price_operators
							LEFT OUTER JOIN price_admin ON price_admin.pcode = price_operators.pcode
							LEFT OUTER JOIN price_loadcentral ON price_loadcentral.pcode = price_operators.pcode
							LEFT OUTER JOIN products ON products.productCode = price_operators.pcode
							LEFT OUTER JOIN provider_icons ON provider_icons.provider = price_operators.provider
							WHERE operator = %s """
				cursor.execute(products, (operator,))
			else:
				products = """ SELECT price_operators.description, products.description AS description2, price_operators.pcode, price_admin.price AS product_cost, 
							price_operators.price, price_operators.provider, price_loadcentral.status, icon FROM price_operators 
							LEFT OUTER JOIN price_admin ON price_admin.pcode = price_operators.pcode
							LEFT OUTER JOIN price_loadcentral ON price_loadcentral.pcode = price_operators.pcode
							LEFT OUTER JOIN products ON products.productCode = price_operators.pcode
							LEFT OUTER JOIN provider_icons ON provider_icons.provider = price_operators.provider
							WHERE price_operators.provider = %s AND operator = %s """
				cursor.execute(products, (provider, operator))
		
		rows = cursor.fetchall()
		cursor.close()
		conn.close()
		return rows

	def SET_PRICE_ADMIN(self, pcode, price):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 			   database=self.dbname)
			cursor = conn.cursor(dictionary = True)
		except:
			return 'Connection Unavailble DB error'
		
		try:
			float(price)
		except:
			return 'Failed, invalid value for price'

		q1 = ''' SELECT price FROM price_loadcentral WHERE pcode = %s '''
		cursor.execute(q1, (pcode,))
		lc_price = cursor.fetchall()
		lc_price = lc_price[0]['price']

		if float(price) < float(lc_price):
			return 'Failed, price is lower than the product cost'

		q2 = ''' UPDATE price_admin SET price = %s WHERE pcode = %s '''
		cursor.execute(q2, (price, pcode))
		conn.commit()
		cursor.close()
		conn.close()

		return 'Success'

	def SET_PRICE_OPERATOR(self, pcode, price, operator):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 			   database=self.dbname)
			cursor = conn.cursor(dictionary = True)
		except:
			return 'Connection Unavailble DB error'

		try:
			float(price)
		except:
			return 'Failed, invalid value for price'

		q1 = ''' SELECT price FROM price_admin WHERE pcode = %s '''
		cursor.execute(q1, (pcode,))
		adm_price = cursor.fetchall()
		adm_price = adm_price[0]['price']

		if float(price) < float(adm_price):
			return 'Failed, price is lower than the product cost'

		# Check if pcode & operator exists
		q2 = """ SELECT operator, pcode FROM price_operators WHERE operator = %s """
		cursor.execute(q2, (operator,))
		res1 = cursor.fetchall()

		if len(res1) == 0:
			q3 = """ INSERT INTO price_operators(pcode, price, operator) VALUES(%s, %s, %s) """
			cursor.execute(q3, (pcode, price, operator))
		else:
			q4 = """ UPDATE price_operators SET pcode = %s, price = %s WHERE operator = %s AND pcode = %s """
			cursor.execute(q4, (pcode, price, operator, pcode))

		conn.commit()
		cursor.close()
		conn.close()

		return 'Success'

	def GET_PRODUCT_PRICE(self, pcode, mac):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 			   database=self.dbname)
			cursor = conn.cursor(prepared = True)
		except:
			return 'Connection Unavailble DB error'

		# Get the operator of a certain mac
		get_operator = """ SELECT operator FROM macs WHERE mac = %s """
		cursor.execute(get_operator, (mac,))
		operator = cursor.fetchall()
		if len(operator) == 0:
			operator = ''
		else:
			operator = operator[0][0]

		get_price = """ SELECT price, pcode FROM price_operators WHERE pcode = %s AND operator = %s """
		cursor.execute(get_price, (pcode, operator))
		price = cursor.fetchall()
		if len(price) == 0:
			return '0'
		price = price[0][0]

		cursor.close()
		conn.close()
		return price

	def SET_PROMO_STATUS(self, pcode, status):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 			   database=self.dbname)
			cursor = conn.cursor(prepared = True)
		except:
			return 'Connection Unavailble DB error'

		if pcode == None or pcode == '':
			return 'Failed, invalid product code'

		query = """ UPDATE price_loadcentral SET status = %s WHERE pcode = %s """
		cursor.execute(query, (status, pcode))
		conn.commit()
		cursor.close()
		conn.close()

		return 'Promo code successfully ' + status


	# This procedure enables & disables macs and operators
	def SET_STATUS(self, opr, mac, status):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 			   database=self.dbname)
			cursor = conn.cursor(prepared = True)
		except:
			return 'Connection Unavailble DB error'

		if opr == '' or opr == None:
			query = """ UPDATE macs SET status = %s WHERE mac = %s """
			cursor.execute(query, (status, mac))

		elif mac == '' or mac == None:
			query = """ UPDATE operators SET status = %s WHERE operator = %s """
			query2 = """ UPDATE macs SET status = %s WHERE operator = %s """
			cursor.execute(query, (status, opr))
			cursor.execute(query2, (status, opr))

		else:
			return 'Failed check parameters'

		conn.commit()
		cursor.close()
		conn.close()

		return 'Status succssfully changed'

	def RESET_PASSWORD(self, user):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 			   database=self.dbname)
			cursor = conn.cursor(prepared = True)
		except:
			return 'Connection Unavailble DB error'

		default_pass = '1234'
		default_token = '1234'
		query = """ UPDATE users SET password = %s, token = %s WHERE username = %s """

		# Check if user existed
		check_for_user = """ SELECT username FROM users WHERE username = %s """
		cursor.execute(check_for_user, (user,))
		rows = cursor.fetchall()
		if len(rows) == 0:
			return 'Failed, user is not registered'

		h_pass = hashlib.sha256(default_pass.encode() + default_token.encode()).hexdigest() + hashlib.sha256(default_token.encode()).hexdigest()
		cursor.execute(query, (h_pass, default_token, user))
		conn.commit()
		cursor.close()
		conn.close()

		return 'Success, user password has been reset'

	def CHANGE_PASSWORD(self, user, pword, new_pass):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 			   database=self.dbname)
			cursor = conn.cursor(prepared = True)
		except:
			return 'Connection Unavailble DB error'

		# Get user's password & token
		get_pass = """ SELECT password, token FROM users WHERE username = %s """
		cursor.execute(get_pass, (user,))
		rows = cursor.fetchall()
		if len(rows) == 0:
			return 'Failed, user not exist'
		else:
			user_pass = rows[0][0]
			user_token = rows[0][1]

		# Check password
		pword = hashlib.sha256(pword.encode() + user_token.encode()).hexdigest() + hashlib.sha256(user_token.encode()).hexdigest()
		if pword != user_pass:
			return 'Failed, password not matched'
		else:
			# Change pasword
			new_pass = hashlib.sha256(new_pass.encode() + user_token.encode()).hexdigest() + hashlib.sha256(user_token.encode()).hexdigest()
			query = """ UPDATE users SET password = %s WHERE username = %s """
			cursor.execute(query, (new_pass, user))

		conn.commit()
		cursor.close()
		conn.close()
		return 'Password successfully changed'

	def GET_NOTIFICATIONS(self, user, status):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 			   database=self.dbname)
			cursor = conn.cursor(prepared = True)
		except:
			return 'Connection Unavailble DB error'

		notif_admin = """ SELECT id, user, operator, mac, notification, status, dateCreated FROM notifications
						WHERE user = 'Admin' AND notiftype = 'Admin' AND status = """ + "'" + status + "'" + " ORDER BY dateCreated DESC LIMIT 20 "
		
		notif_operator = """ SELECT id, user, operator, mac, notification, status, dateCreated FROM notifications
							WHERE operator = %s AND notiftype = 'Operator' AND status = """ + "'" + status + "'" + " ORDER BY dateCreated DESC LIMIT 20 "

		if user == 'Admin':
			cursor.execute(notif_admin)
			rows = cursor.fetchall()
			if len(rows) == 0:
				return 0

		else:
			cursor.execute(notif_operator, (user,))
			rows = cursor.fetchall()
			if len(rows) == 0:
				return 0

		cursor.close()
		conn.close()
		return rows

	def CLEAR_NOTIFICATIONS(self, clr, opr):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 			   database=self.dbname)
			cursor = conn.cursor(prepared = True)
		except:
			return 'Connection Unavailble DB error'

		if clr == 'admin':
			query = """ UPDATE notifications SET status = 'Seen' WHERE notiftype = 'Admin' """
			cursor.execute(query)
		elif clr == 'operator':
			query = """ UPDATE notifications SET status = 'Seen' WHERE operator = %s AND notiftype = 'Operator' """
			cursor.execute(query, (opr,))
		else:
			query = """ UPDATE notifications SET status = 'Seen' WHERE id = %s """
			cursor.execute(query, (clr,))

		conn.commit()
		cursor.close()
		conn.close()

		return 'Notification cleared'

	def INIT_SERVICE_CHARGE(self, cond, opr, scharge):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 			   database=self.dbname)
			cursor = conn.cursor(prepared = True)
		except:
			return 'Connection Unavailble DB error'

		if cond == 'get':
			query = """ SELECT service_charge FROM operators WHERE operator = %s """
			cursor.execute(query, (opr,))
			rows = cursor.fetchall()
			if len(rows) == 0:
				return 0
			else:
				cursor.close()
				conn.close()
				return rows[0][0]

		elif cond == 'set':
			query = """ UPDATE operators SET service_charge = %s WHERE operator = %s """
			cursor.execute(query, (scharge, opr))
			conn.commit()
			cursor.close()
			conn.close()
			return 'Service charge updated'

		else:
			return 0



	def adminMainDetails(self, cond, startDate, endDate):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 				database=self.dbname)		
			cursor = conn.cursor(dictionary=True)
		except:
			return 'Connection Unavailble DB error'

		obj = []
		cursor.callproc('ADM_MAIN_DETAILS', (cond, startDate, endDate))
		for result in cursor.stored_results():
			for row in result:
				obj.append(dict(zip(result.column_names, row)))
		
		conn.commit()
		cursor.close()
		conn.close()

		return obj

	def adminMainDetailsEach(self, cond, startDate, endDate, mac):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 				database=self.dbname)		
			cursor = conn.cursor(dictionary=True)
		except:
			return 'Connection Unavailble DB error'

		obj = []
		cursor.callproc('ADM_MAIN_DETAILS_EACH', (cond, startDate, endDate, mac))
		for result in cursor.stored_results():
			for row in result:
				obj.append(dict(zip(result.column_names, row)))
		
		conn.commit()
		cursor.close()
		conn.close()

		return obj

	def oprMainDetails(self, cond, startDate, endDate, opr):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 				database=self.dbname)		
			cursor = conn.cursor(dictionary=True)
		except:
			return 'Connection Unavailble DB error'

		obj = []
		cursor.callproc('OPR_MAIN_DETAILS', (cond, startDate, endDate, opr))
		for result in cursor.stored_results():
			for row in result:
				obj.append(dict(zip(result.column_names, row)))
		
		conn.commit()
		cursor.close()
		conn.close()

		return obj

	def oprMainDetailsEach(self, cond, startDate, endDate, opr, mac):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 				database=self.dbname)		
			cursor = conn.cursor(dictionary=True)
		except:
			return 'Connection Unavailble DB error'

		obj = []
		cursor.callproc('OPR_MAIN_DETAILS_EACH', (cond, startDate, endDate, opr, mac))
		for result in cursor.stored_results():
			for row in result:
				obj.append(dict(zip(result.column_names, row)))
		
		conn.commit()
		cursor.close()
		conn.close()

		return obj

	def addManualLoad(self, arr):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 				database=self.dbname)		
			cursor = conn.cursor()
		except:
			return 'Connection Unavailble DB error'

		cursor.callproc('MANUAL_LOAD', ('addManualLoad', arr[0], arr[1], arr[2], arr[3], arr[4]))
		conn.commit()
		cursor.close()
		conn.close()

		return 'Added'

	def getManualLoad(self, routerMac):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 				database=self.dbname)		
			cursor = conn.cursor(dictionary=True)
		except:
			return 'Connection Unavailble DB error'

		obj = []
		cursor.callproc('MANUAL_LOAD', ('getManualLoad', routerMac, '', '', '', ''))
		for result in cursor.stored_results():
			for row in result:
				obj.append(dict(zip(result.column_names, row)))
		
		cursor.close()
		conn.close()

		return obj

	def deleteManualLoad(self, arr):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 				database=self.dbname)		
			cursor = conn.cursor()
		except:
			return 'Connection Unavailble DB error'

		# check if data not existed
		cursor.callproc('MANUAL_LOAD', ('checkIfExisted', arr[0], arr[1], arr[2], arr[3], ''))
		for result in cursor.stored_results():
			rows = result.fetchall()
		if len(rows) == 0:
			return 'Failed, data not found'
		
		cursor.callproc('MANUAL_LOAD', ('deleteManualLoad', arr[0], arr[1], arr[2], arr[3], ''))
		conn.commit()
		cursor.close()
		conn.close()

		return 'Deleted'

	def getReport(self, routerMac):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 				database=self.dbname)		
			cursor = conn.cursor(dictionary=True)
		except:
			return 'Connection Unavailble DB error'

		obj = []
		cursor.callproc('ADM_MAIN_DETAILS', ('getReport', routerMac, ''))
		for result in cursor.stored_results():
			for row in result:
				obj.append(dict(zip(result.column_names, row)))
		
		for x in obj:
			if x['lp'] != '0':
				x['lp'] = 'success'
			else:
				x['lp'] = 'failed'
				
		conn.commit()
		cursor.close()
		conn.close()

		return obj

	def checkForOperator(self, operator):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 				database=self.dbname)		
			cursor = conn.cursor(dictionary=True)
		except:
			return 'Connection Unavailble DB error'

		q1 = ''' SELECT * FROM operators WHERE operator = %s '''
		cursor.execute(q1, (operator,))
		oprData = cursor.fetchall()
		if len(oprData) == 0:
			return ''
		cursor.close()
		conn.close()
		return 'Success'





	def macsListAssignment(self):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 				database=self.dbname)		
			cursor = conn.cursor(dictionary=True)
		except:
			return 'Connection Unavailble DB error'

		macsList = []

		# Get list of macs from .116
		macFromReps = requests.get('http://wb1.wizher.com/api/adminMainDetails?cond=getMacsList&startDate=&endDate=')
		macFromReps = macFromReps.json()

		# Get list of macs from db
		q1 = ''' SELECT macs.mac, macs.site, macs.operator AS owner, macs.status FROM macs '''
		cursor.execute(q1)
		macData = cursor.fetchall()

		# match the 2 list of objects
		for x in macFromReps:
			for y in macData:
				if x['mac'] == y['mac']:
					obj = {
						'mac' : x['mac'],
						'site' : y['site'],
						'owner' : y['owner'],
						'status' : y['status']
					}
					break
				else:
					obj = {
						'mac' : x['mac'],
						'site' : '',
						'owner' : '',
						'status' : 'Disabled'
					}
			macsList.append(obj)
		return macsList

	def assignMacs(self, mac, owner, site):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 			   database=self.dbname)
			cursor = conn.cursor(prepared = True)
		except:
			return 'Connection Unavailble DB error'

		# Check if operator existed in users table
		if owner != '':
			q1 = ''' SELECT operator FROM operators WHERE operator = %s '''
			cursor.execute(q1, (owner,))
			username = cursor.fetchall()
			if len(username) == 0:
				self.dbClose(conn, cursor)
				return 'Failed, operator not found'

		# Check if mac is existed in macs table
		q2 = ''' SELECT mac FROM macs WHERE macs.mac = %s '''
		cursor.execute(q2, (mac,))
		macData = cursor.fetchall()
		if len(macData) == 0:
			q3 = ''' INSERT INTO macs(operator, site, mac) VALUES (%s, %s, %s) '''
		else:
			q3 = ''' UPDATE macs SET macs.operator = %s, macs.site = %s
					WHERE macs.mac = %s '''
		
		cursor.execute(q3, (owner, site, mac))
		conn.commit()
		self.dbClose(conn, cursor)

		return 'Successfully Assigned'

	def adminMacReports(self, obj):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 			   database=self.dbname)
			cursor = conn.cursor(dictionary = True)
		except:
			return 'Connection Unavailble DB error'

		q1 = ''' SELECT mac, operator AS owner, site FROM macs '''
		cursor.execute(q1)
		macData = cursor.fetchall()

		response = []
		for o in obj:
			for mac in macData:
				if o['mac'] == mac['mac']:
					o['owner'] = mac['owner']
					o['site'] = mac['site']
					break
				else:
					o['owner'] = ''
					o['site'] = ''
		return obj


	def oprMacReports(self, obj, owner):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 			   database=self.dbname)
			cursor = conn.cursor(dictionary = True)
		except:
			return 'Connection Unavailble DB error'

		q1 = ''' SELECT mac, operator AS owner, site FROM macs WHERE operator = %s '''
		cursor.execute(q1, (owner,))
		macData = cursor.fetchall()

		data = []
		for o in obj:
			for mac in macData:
				try:
					if mac['mac'] == o['mac']:
						o['owner'] = mac['owner']
						o['site'] = mac['site']
						data.append(o)
				except:
					self.dbClose(conn, cursor)
					return data

		self.dbClose(conn, cursor)
		return data

	def checkMacOperator(self, operator, mac):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 				database=self.dbname)		
			cursor = conn.cursor(dictionary=True)
		except:
			return 'Connection Unavailble DB error'
		q1 = ''' SELECT mac, operator FROM macs WHERE operator = %s AND mac = %s '''
		cursor.execute(q1, (operator, mac))
		macData = cursor.fetchall()
		if len(macData) == 0:
			self.dbClose(conn, cursor)
			return 0
		self.dbClose(conn, cursor)

		return 1

	def initMikrotikCommand(self, obj):
		if obj[0]['operator'] != '':
			# Check if mac is owned by certain operator
			checkMacOperator = self.checkMacOperator(obj[0]['operator'], obj[0]['mac'])
			if checkMacOperator == 0:
				return 'failed, operator not matched'

		# Send data to .39 server
		data = json.dumps(obj)
		headers = {'content-type': 'application/json'}
		commandOutput =  requests.get('http://139.162.32.39/initSetCommands', data=data, headers=headers)

		try:
			arr = commandOutput.json()
		except:
			return str(commandOutput.text)

		# initialize mac settings file
		for o in obj:
			macSettingsFile.initSetting(o['mac'], o['param'], o['settingType'])
		return arr

	def getMacSettings(self, obj):
		if obj['operator'] != '':
			# Check if mac is owned by certain operator
			checkMacOperator = self.checkMacOperator(obj['operator'], obj['mac'])
			if checkMacOperator == 0:
				return 'failed, operator not matched'

		macSetting = macSettingsFile.getMacSetting(obj['mac'])
		return macSetting

	# Added start
	def getCommandOutput(self, obj):	# initSetCommands equivalent
		headers = {'content-type': 'application/json'}
		data = json.dumps(obj)
		output = requests.get('http://139.162.32.39/initSetCommands', data=data, headers=headers)
		try:
			output = output.json()
		except:
			return str(output.text)
		return output

	def findAttribute(self, obj, att, val):
		output = []
		for o in obj:
			try:
				if str(o[att]) == str(val):
					output.append(o)
			except:
				return output
		return output

	def updateMacSettings(self, obj):
		if obj['operator'] != '':
			# Check if mac is owned by certain operator
			checkMacOperator = self.checkMacOperator(obj['operator'], obj['mac'])
			if checkMacOperator == 0:
				return 'failed, operator not matched'
		
		commandSet = ['/interface/wireless/getall', '/routing/filter/getall', '/ip/hotspot/profile/getall', '/ip/hotspot/user/getall', '/ip/dns/getall']
		setOfCommands = []
		for x in commandSet:
			sc = {
				'mac' : obj['mac'],
				'param' : '',
				'command' : x,
				'settingType' : ''
			}
			setOfCommands.append(sc)
		commandOutput = self.getCommandOutput(setOfCommands)
		if isinstance(commandOutput, str) == True:
			return commandOutput

		# /interface/wireless/getall data
		ssidData = commandOutput[0]
		ssid = str({'ssid' : ssidData[0]['ssid'], 'hide-ssid' : ssidData[0]['hide-ssid']})
		macSettingsFile.initSetting(obj['mac'], ssid, 'ssidSett')

		# /routing/filter/getall data
		configData = commandOutput[1]
		appPassword = self.findAttribute(configData, 'chain', 'config')
		try:
			appPassword = str({'comment' : appPassword[0]['comment']})
		except:
			appPassword = str({'comment' : '0000'})
		
		emailReport = self.findAttribute(configData, 'chain', 'email')
		try:
			emailReport = str({'route-tag' : str(emailReport[0]['route-tag']), 'route-comment' : emailReport[0]['route-comment']})
		except:
			emailReport = str({'route-tag' : '0', 'route-comment' : ''})
		
		wallet = self.findAttribute(configData, 'chain', 'wallet')
		try:
			wallet = str({'comment' : wallet[0]['comment']})
		except:
			wallet = str({'comment' : '0'})
		
		packageList = self.findAttribute(configData, 'chain', 'packageList')
		try:
			packageList = str({'comment' : packageList[0]['comment']})
		except:
			packageList = str({'comment' : '|30 Minutes, 30m, 1d, 3, true|1 Hour, 1h, 3d, 5, true|2 Hours, 2h, 3d, 10, true|' +
				'3 Hours, 3h, 3d, 20, false|5 Hours, 5h, 3d, 30, true|1 Day,  1d, 3d, 40, true|2 Days, 2d, 5d, 50, true|' +
				'3 Days, 3d, 6d, 60, true|7 Days, 7d, 10d, 90, true|15 Days,15d, 18d, 150, false|30 Days,30d, 33d, 300, false'})

		macSettingsFile.initSetting(obj['mac'], appPassword, 'pwSett')
		macSettingsFile.initSetting(obj['mac'], emailReport, 'emRepSett')
		macSettingsFile.initSetting(obj['mac'], wallet, 'macBalSett')
		macSettingsFile.initSetting(obj['mac'], packageList, 'rateManSett')

		# /ip/hotspot/profile/getall data
		hotspotData = commandOutput[2]
		try:
			freeTrial = str({'login-by' : hotspotData[1]['login-by'], 'trial-uptime-limit' : hotspotData[1]['trial-uptime-limit']})
		except:
			freeTrial = str({'login-by' : 'http,pap', 'trial-uptime-limit' : '0s'})
		macSettingsFile.initSetting(obj['mac'], freeTrial, 'frTrialSett')

		# /ip/hotspot/user/getall data
		hotspotData2 = commandOutput[3]
		fixedUser = self.findAttribute(hotspotData2, 'comment', 'FixedUser')
		# log.info(str(fixedUser[0]['disabled']))
		try:
			fixedUser = str({'disabled' : fixedUser[0]['disabled'], 'name' : fixedUser[0]['name'], 'limit-uptime' : fixedUser[0]['limit-uptime']})
		except:
			fixedUser = str({'disabled' : 'true', 'name' : '', 'limit-uptime' : '0s'})
		macSettingsFile.initSetting(obj['mac'], fixedUser, 'fxUsrSett')

		# /ip/dns/getall data
		dnsData = commandOutput[4]
		parentalControl = str({'servers' : dnsData[0]['servers']})
		macSettingsFile.initSetting(obj['mac'], parentalControl, 'parContSett')

		macSetting = macSettingsFile.getMacSetting(obj['mac'])
		return macSetting
	# Added end

	def rebootReset(self, obj):
		if obj['operator'] != '':
			# Check if mac is owned by certain operator
			checkMacOperator = self.checkMacOperator(obj['operator'], obj['mac'])
			if checkMacOperator == 0:
				return 'failed, operator not matched'

		if obj['action'] == 'Reboot':
			param = "{}"
			command = '/system/reboot'
		elif obj['action'] == 'Reset':
			param = '{"no-defaults" : "no", "skip-backup" : "no"}'
			command = '/system/reset-configuration'
		else:
			param = ''
			command = ''

		data = {
			'mac' : obj['mac'],
			'param' : param,
			'command' : command,
			'settingType' : ''
		}

		headers = {'content-type': 'application/json'}
		data = json.dumps(data)
		output = requests.get('http://139.162.32.39/initCommand', data=data, headers=headers)

		if str(output.text) == 'Socket timed out. timed out':
			return 1
		else:
			return str(output.text)

	# Added start
	def validyCalculator(self, validity, package):
		if len(validity) >= 4:
			if package[1] == '30m':
				newValidity = self.normalDate() + datetime.timedelta(days=1)
				return newValidity.strftime('%b/%d/%Y %H:%M:%S')
			elif package[1] == '1h':
				newValidity = self.normalDate() + datetime.timedelta(days=3)
				return newValidity.strftime('%b/%d/%Y %H:%M:%S')
			elif package[1] == '2h':
				newValidity = self.normalDate() + datetime.timedelta(days=3)
				return newValidity.strftime('%b/%d/%Y %H:%M:%S')
			elif package[1] == '3h':
				newValidity = self.normalDate() + datetime.timedelta(days=3)
				return newValidity.strftime('%b/%d/%Y %H:%M:%S')
			elif package[1] == '5h':
				newValidity = self.normalDate() + datetime.timedelta(days=3)
				return newValidity.strftime('%b/%d/%Y %H:%M:%S')
			elif package[1] == '1d':
				newValidity = self.normalDate() + datetime.timedelta(days=3)
				return newValidity.strftime('%b/%d/%Y %H:%M:%S')
			elif package[1] == '2d':
				newValidity = self.normalDate() + datetime.timedelta(days=5)
				return newValidity.strftime('%b/%d/%Y %H:%M:%S')
			elif package[1] == '3d':
				newValidity = self.normalDate() + datetime.timedelta(days=6)
				return newValidity.strftime('%b/%d/%Y %H:%M:%S')
			elif package[1] == '7d':
				newValidity = self.normalDate() + datetime.timedelta(days=10)
				return newValidity.strftime('%b/%d/%Y %H:%M:%S')
			elif package[1] == '15d':
				newValidity = self.normalDate() + datetime.timedelta(days=18)
				return newValidity.strftime('%b/%d/%Y %H:%M:%S')
			elif package[1] == '30d':
				newValidity = self.normalDate() + datetime.timedelta(days=33)
				return newValidity.strftime('%b/%d/%Y %H:%M:%S')
			else:
				newValidity = self.normalDate()
				return newValidity.strftime('%b/%d/%Y %H:%M:%S')
		else:
			validityVal = int(re.findall('\d+', validity)[0])
			newValidity = int(re.findall('\d+', package[2])[0])
			newValidity = str(validityVal + newValidity) + 'd'
			return newValidity

	def addTime(self, obj):
		if obj['operator'] != '':
			checkMacOperator = self.checkMacOperator(obj['operator'], obj['mac'])
			if checkMacOperator == 0:
				return 'failed, operator not matched'

		# initialize the needed output of ff set of commands
		commandSet = ['/ip/hotspot/user/getall', '/routing/prefix-lists/getall', '/routing/filter/getall']
		setOfCommands = []
		for x in commandSet:
			sc = {'mac' : obj['mac'], 'param' : '', 'command' : x, 'settingType' : ''}
			setOfCommands.append(sc)
		commandOutput = self.getCommandOutput(setOfCommands)
		if isinstance(commandOutput, str) == True:
			return commandOutput
		
		headers = {'content-type': 'application/json'}
		packageData = self.findAttribute(commandOutput[2], 'chain', 'packageList')
		walletData = self.findAttribute(commandOutput[2], 'chain', 'wallet')
		hotspotData = self.findAttribute(commandOutput[0], 'name', obj['pin'])
		if len(hotspotData) == 0:	return 'Failed, unidentified pin.'
		
		# Initialize /ip/hotspot/user/add command
		packageList = packageData[0]['comment'].replace(' ', '').split('|')
		package = packageList[int(obj['package'])].split(',')
		validity = self.validyCalculator(hotspotData[0]['comment'], package)
		try:
			hotspotData[0]['email']
			return 'Failed, cannot add time. Pin is currently in use.'
		except:
			isActive = 'Not'
		hotspotParam = {
			'.id' : hotspotData[0]['.id'],
			'name' : hotspotData[0]['name'],
			'password' : hotspotData[0]['name'],
			'disabled' : "false",
			'limit-uptime' : hotspotData[0]['limit-uptime'] + package[1],
			'comment' : validity
		}
		hotspotObj = {'mac' : obj['mac'], 'param' : str(hotspotParam), 'command' : '/ip/hotspot/user/set', 'settingType' : ''}

		# Deduct wallet
		macReportsBalance = walletData[0]['comment']
		newMacReportsBalance = int(macReportsBalance) - int(package[3])
		if newMacReportsBalance < 0:	newMacReportsBalance = 0
		walletParam = {'.id' : walletData[0]['.id'], 'comment' : newMacReportsBalance}
		walletObj = {'mac' : obj['mac'], 'param' : str(walletParam), 'command' : '/routing/filter/set', 'settingType' : ''}

		# Initialize /routing/prefix-lists/add command
		xx = re.findall('\d+', package[0])[0]
		yy = package[0].split(re.findall('\d+', package[0])[0])
		prefixComment = (str(xx) + ' ' + yy[1] + ',' + str(package[3]) + ',' + str(macReportsBalance) + ',' 
				+ str(newMacReportsBalance) + ',' + str(hotspotData[0]['name']))
		prefixParam = {'comment' : prefixComment, 'chain' : 'RAW_' + self.readableDate(), 'disabled' : 'true'}
		prefixObj = {'mac' : obj['mac'], 'param' : str(prefixParam), 'command' : '/routing/prefix-lists/add', 'settingType' : ''}


		data = json.dumps([hotspotObj, walletObj, prefixObj])
		response = requests.get('http://139.162.32.39/initSetCommands', data=data, headers=headers)
		# return prefixComment + ' ' + 'RAW_' + self.readableDate()
		if isinstance(response, str) == True:
			return commandOutput
		return ''

	def batchPinGenerator(self, obj):
		if obj['operator'] != '':
			checkMacOperator = self.checkMacOperator(obj['operator'], obj['mac'])
			if checkMacOperator == 0:
				return 'failed, operator not matched'

		headers = {'content-type': 'application/json'}
		commandSet = ['/routing/filter/getall', '/system/script/getall']
		commandObj = []
		for x in commandSet:
			sc = {'mac' : obj['mac'], 'param' : '', 'command' : x, 'settingType' : ''}
			commandObj.append(sc)
		commandOutput = self.getCommandOutput(commandObj)
		if isinstance(commandOutput, str) == True:
			return commandOutput
		
		genParamData = self.findAttribute(commandOutput[0], 'chain', 'genParam')
		packageData = self.findAttribute(commandOutput[0], 'chain', 'packageList')
		walletData = self.findAttribute(commandOutput[0], 'chain', 'wallet')
		scriptData = self.findAttribute(commandOutput[1], 'name', 'scriptGen')

		packageList = packageData[0]['comment'].replace(' ', '').split('|')
		package = packageList[int(obj['package'])].split(',')
		batchValue = int(package[3]) * int(obj['amount'])
		walletBalance = int(walletData[0]['comment'])

		# # Check balance
		# if walletBalance < batchValue or walletBalance <= 0:
		# 	return 'Failed, not enough balance.'

		# Initialize /routing/filter/set command
		xx = re.findall('\d+', package[0])[0]
		yy = package[0].split(re.findall('\d+', package[0])[0])
		genParamParam = {
			'.id' : genParamData[0]['.id'],
			'comment' : str(xx) + ' ' + yy[1],
			'bgp-as-path-length' : obj['amount'],
			'bgp-med' : package[3],
			'route-comment' : package[1],
			'bgp-as-path' : package[2]
		}
		genParamObj = {'mac' : obj['mac'], 'param' : str(genParamParam), 'command' : '/routing/filter/set', 'settingType' : ''}

		# Run script
		scriptParam = {'.id' : scriptData[0]['.id']}
		scriptObj = {'mac' : obj['mac'], 'param' : str(scriptParam), 'command' : '/system/script/run', 'settingType' : ''}

		data = json.dumps([genParamObj, scriptObj])
		response = requests.get('http://139.162.32.39/initSetCommands', data=data, headers=headers)
		if isinstance(response, str) == True:
			return commandOutput
		return ''

	def getRoutingAndHotspot(self, obj):
		if obj['operator'] != '':
			checkMacOperator = self.checkMacOperator(obj['operator'], obj['mac'])
			if checkMacOperator == 0:
				return 'failed, operator not matched'
		
		headers = {'content-type': 'application/json'}
		commandSet = ['/routing/prefix-lists/getall', '/ip/hotspot/user/getall']
		commandObj = []
		for x in commandSet:
			sc = {'mac' : obj['mac'], 'param' : '', 'command' : x, 'settingType' : ''}
			commandObj.append(sc)
		commandOutput = self.getCommandOutput(commandObj)
		if isinstance(commandOutput, str) == True:
			return commandOutput
		return commandOutput

	def deletePinsBatch(self, obj):
		if obj['operator'] != '':
			checkMacOperator = self.checkMacOperator(obj['operator'], obj['mac'])
			if checkMacOperator == 0:
				return 'failed, operator not matched'

		headers = {'content-type': 'application/json'}
		commandSet = ['/routing/prefix-lists/getall', '/ip/hotspot/user/getall', '/system/script/getall']
		commandObj = []
		for x in commandSet:
			sc = {'mac' : obj['mac'], 'param' : '', 'command' : x, 'settingType' : ''}
			commandObj.append(sc)
		commandOutput = self.getCommandOutput(commandObj)
		if isinstance(commandOutput, str) == True:
			return commandOutput

		def deletePin(pinParam):
			pinData = self.findAttribute(commandOutput[1], 'name', pinParam)
			if len(pinData) == 0:
				return 'Failed, pin not found.'
			
			subPinsData = []
			for x in commandOutput[0]:
				getPin = str(x['comment'].split(',')[4])
				if str(pinParam) == getPin:
					subPinsData.append(x)

			deleteCommandsSet = []
			pinObj = {
				'mac' : obj['mac'], 
				'param' : str({'.id' : pinData[0]['.id']}), 
				'command' : '/ip/hotspot/user/remove', 
				'settingType' : ''
			}
			for x in subPinsData:
				xx = {
					'mac' : obj['mac'],
					'param' : str({'.id' : x['.id']}),
					'command' : '/routing/prefix-lists/remove',
					'settingType' : ''
				}
				deleteCommandsSet.append(xx)
			deleteCommandsSet.append(pinObj)
			self.getCommandOutput(deleteCommandsSet)
			return 1

		def deleteBatch(batchParam):
			pinNames = []
			for x in commandOutput[0]:
				getBatch = x['chain'].split('_')[0]
				if batchParam == getBatch:
					pinNames.append(x['comment'].split(',')[4])

			if len(pinNames) == 0:
				return 'Failed, batch not found'

			# Delete all pins (BATCH_ or RAW_ type) that are related to batch name
			for x in pinNames:
				deletePin(x)

			return 1

		def deleteAll():
			scriptData = self.findAttribute(commandOutput[2], 'name', 'scriptResetCounter')
			scriptObj = [{
				'mac' : obj['mac'],
				'param' : str({'.id' : scriptData[0]['.id']}),
				'command' : '/system/script/run',
				'settingType' : ''
			}]
			self.getCommandOutput(scriptObj)
			return 1

		if obj['cond'] == '0':
			return deletePin(obj['pinOrBatch'])
		elif obj['cond'] == '1':
			return deleteBatch(obj['pinOrBatch'])
		elif obj['cond'] == '2':
			return deleteAll()
		else:
			return 'Failed, deletePB action not found'

	def pinsData(self, obj):
		if obj['operator'] != '':
			checkMacOperator = self.checkMacOperator(obj['operator'], obj['mac'])
			if checkMacOperator == 0:
				return 'failed, operator not matched'

		pinsHistory = requests.get('http://139.162.32.39/api/macPinsHistory?mac=' + obj['mac'])
		pinsHistory = pinsHistory.json()

		headers = {'content-type': 'application/json'}
		commandSet = ['/routing/prefix-lists/getall', '/ip/hotspot/user/getall']
		commandObj = []
		for x in commandSet:
			sc = {'mac' : obj['mac'], 'param' : '', 'command' : x, 'settingType' : ''}
			commandObj.append(sc)
		commandOutput = self.getCommandOutput(commandObj)
		if isinstance(commandOutput, str) == True:
			print(str(pinsHistory) + ' pinsHistory')
			return commandOutput

		for x in commandOutput[0]:
			pinData = x['comment'].split(',')
			dateCreated = x['chain'].split('_')[1] + ' ' + x['chain'].split('_')[2]
			dateCreated = datetime.datetime.strptime(dateCreated, '%b/%d/%Y %H:%M:%S')
			xx = {
				'mac' : obj['mac'] ,
				'dateCreated' : str(dateCreated),
				'category' : x['chain'].split('_')[0],
				'pin' : pinData[4],
				'package' : pinData[0],
				'value' : pinData[1],
				'prevBalance' : pinData[2],
				'newBalance' : pinData[3]
			}
			if xx not in pinsHistory:
				pinsHistory.append(xx)

		pinsData = []
		for x in pinsHistory:
			for y in commandOutput[1]:
				try:
					validity = y['comment']
				except:
					validity = 'None'
				if str(x['pin']) == str(y['name']):
					xx = {
						'mac' : x['mac'],
						'dateCreated' : x['dateCreated'],
						'category' : x['category'],
						'pin' : x['pin'],
						'pin2' : x['pin'][0:10],
						'package' : x['package'],
						'value' : x['value'],
						'prevBalance' : x['prevBalance'],
						'newBalance' : x['newBalance'],
						'limit-uptime' : y['limit-uptime'],
						'validity' : validity,
						'disabled' : y['disabled']
					}
					break
				else:
					xx = {
						'mac' : x['mac'],
						'dateCreated' : x['dateCreated'],
						'category' : x['category'],
						'pin' : x['pin'],
						'pin2' : x['pin'][0:10],
						'package' : x['package'],
						'value' : x['value'],
						'prevBalance' : x['prevBalance'],
						'newBalance' : x['newBalance'],
						'limit-uptime' : 'deleted/expired',
						'validity' : 'deleted/expired',
						'disabled' : 'true'
					}
			
			if obj['month'] == '':
				pinsData.append(xx)

			extractMonth = datetime.datetime.strptime(x['dateCreated'], '%Y-%m-%d %H:%M:%S').strftime('%b %Y')
			if extractMonth == obj['month']:
				pinsData.append(xx)

		print(len(pinsData))
		return pinsData

	def pinsDataSummation(self, obj):
		# Get list of months
		monthRange = 12
		months = []
		for x in range(monthRange):
			month = str(datetime.datetime.now() - monthdelta.MonthDelta(x))
			month = month.split('-')[0] + '-' + month.split('-')[1]
			months.append(month)

		pinsData = self.pinsData(obj)
		if isinstance(pinsData, str) == True:
			return pinsData
		
		pinsSummation = []
		for month in months:
			totalValue = 0
			wallet = 0
			xxxMins = 0
			iHour = 0
			iiHours = 0
			iiiHours = 0
			vHours = 0
			iDay = 0
			iiDays = 0
			iiiDays = 0
			viiDays = 0
			xvDays = 0
			xxxDays = 0
			for pd in pinsData:
				extractMonth = pd['dateCreated'].split('-')[0] + '-' + pd['dateCreated'].split('-')[1]
				if month == extractMonth:
					totalValue = totalValue + float(pd['value'])
					wallet = pd['newBalance']
					if pd['package'] == '30 Minutes' or pd['package'] == '30 minutes':
						xxxMins = xxxMins + 1
					elif pd['package'] == '1 Hour' or pd['package'] == '1 hour':
						iHour = iHour + 1
					elif pd['package'] == '2 Hours' or pd['package'] == '2 hours':
						iiHours = iiHours + 1
					elif pd['package'] == '3 Hours' or pd['package'] == '3 hours':
						iiiHours = iiiHours + 1
					elif pd['package'] == '5 Hours' or pd['package'] == '5 hours':
						vHours = vHours + 1
					elif pd['package'] == '1 Day' or pd['package'] == '1 day':
						iDay = iDay + 1
					elif pd['package'] == '2 Days' or pd['package'] == '2 days':
						iiDays = iiDays + 1
					elif pd['package'] == '3 Days' or pd['package'] == '3 days':
						iiiDays = iiiDays + 1
					elif pd['package'] == '7 Days' or pd['package'] == '7 days':
						viiDays = viiDays + 1
					elif pd['package'] == '15 Days' or pd['package'] == '15 days':
						xvDays = xvDays + 1
					elif pd['package'] == '30 Days' or pd['package'] == '30 days':
						xxxDays = xxxDays + 1
					else:
						log.info('package not defined.')
			
			summation = {
				'mac' : obj['mac'],
				'month' : datetime.datetime.strptime(month, '%Y-%m').strftime('%b %Y'),
				'wallet' : wallet,
				'totalValue' : totalValue,
				'xxxMins' : xxxMins,
				'iHour' : iHour,
				'iiHours' : iiHours,
				'iiiHours' : iiiHours,
				'vHours' : vHours,
				'iDay' : iDay,
				'iiDays' : iiDays,
				'iiiDays' : iiiDays,
				'viiDays' : viiDays,
				'xvDays' : xvDays,
				'xxxDays' : xxxDays
			}
			pinsSummation.append(summation)

		print(pinsSummation)
		return pinsSummation
