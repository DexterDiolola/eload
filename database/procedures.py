import mysql.connector
import pytz, datetime, hashlib, re
import logging
from logs.log_conf import Logger

logging.basicConfig()
log = logging.getLogger(__name__)  

class Procedures:
	def __init__(self):
		time_zone = pytz.timezone('Asia/Manila')
		_datetime = str(datetime.datetime.now(time_zone))
		now = _datetime.split('.')

		self.now = now[0]
		self.dbuser = 'root'
		self.dbpass = 'r3m0teSec'
		self.dbname = 'load_central_transactions'

	def datenow(self):
		time_zone = pytz.timezone('Asia/Manila')
		_datetime = str(datetime.datetime.now(time_zone))
		now = _datetime.split('.')
		return now[0]

	''' ---------------------  TRANSACTIONS PROCEDURES --------------------- '''

	''' This Procedure Adds The Transactions Into Database '''
	def ADD_TRANS(self, _dict, status):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 				database=self.dbname)		
			cursor = conn.cursor(prepared=True)
		except:
			return 'Connection Unavailble DB error'

		if _dict['routerMac'] == None or _dict['routerMac'] == '':
			return 'Failed, routerMac is undefined'

		# Get the operator and site of a certain mac
		get_operator = """ SELECT operator, site FROM macs WHERE mac = %s """
		cursor.execute(get_operator, (_dict['routerMac'],))
		operator = cursor.fetchall()
		if len(operator) == 0:
			operator = ''
			site = ''
		else:
			site = operator[0][1]
			operator = operator[0][0]

		# get operator product price
		get_price = """ SELECT price, provider, pcode FROM price_operators WHERE pcode = %s AND operator = %s """
		cursor.execute(get_price, (_dict['denomination'], operator))
		price = cursor.fetchall()
		if len(price) == 0:
			cursor.execute(get_price, (_dict['denomination'], ''))
			price = cursor.fetchall()
			price = price[0][0]
			provider = price[0][1]
		else:
			provider = price[0][1]
			price = price[0][0]

		# get admin price of certain pcode
		admin_price = """ SELECT price, pcode FROM price_admin WHERE pcode = %s """
		cursor.execute(admin_price, (_dict['denomination'],))
		a_price = cursor.fetchall()
		if len(a_price) == 0:
			a_price = 0
		else:
			a_price = a_price[0][0]

		# get base price of certain pcode
		base_price = re.findall('(\d+)', _dict['denomination'])
		base_price = float(base_price[0])

		# get service charge of certain operator
		getServiceCharge = """ SELECT service_charge FROM operators WHERE operator = %s """
		cursor.execute(getServiceCharge, (operator,))
		serviceCharge = cursor.fetchall()
		if len(serviceCharge) == 0:
			serviceCharge = 0
		else:
			serviceCharge = serviceCharge[0][0]
		
		# if success trnsaction
		if status == 'success':
			loadcentral_price = float(self.GET_BALANCE('admin', '')) - float(_dict['bal']) # PRIORITY NOTE : uncomment after launching to production #base_price
			admin_balance = _dict['bal']
			admin_deduction = loadcentral_price
			deduction = a_price

			# update sales table
			add_to_sales = """ INSERT INTO sales(user, sale, revenue, mac, dateCreated) VALUES(%s, %s, %s, %s, %s) """
			opr_sales = price
			opr_revenue = float(price) - (float(a_price) + float(serviceCharge))
			# if opr_revenue < 0:	opr_revenue = 0
			admin_sales = a_price
			admin_revenue = float(a_price) - float(loadcentral_price)
			# if admin_revenue < 0:	admin_revenue = 0
			cursor.executemany(add_to_sales, [(operator, opr_sales, opr_revenue, _dict['routerMac'], self.datenow()), 
			('admin', admin_sales, admin_revenue, _dict['routerMac'], self.datenow())])

			# update price_loadcentral table
			updatePriceLoadCentral = """ UPDATE price_loadcentral SET price = %s WHERE pcode = %s """
			cursor.execute(updatePriceLoadCentral, (loadcentral_price, _dict['denomination']))
		
		else:
			loadcentral_price = 0
			admin_balance = self.GET_BALANCE('admin', '') # get the current admin balance
			admin_deduction = 0
			deduction = 0
			admin_revenue = 0
			opr_revenue = 0

		# get the current mac balance
		get_current_mac_bal = """ SELECT balance FROM balance_logs WHERE balance_logs.id IN(
								SELECT MAX(id) FROM balance_logs WHERE mac = %s) """
		cursor.execute(get_current_mac_bal, (_dict['routerMac'],))
		mac_bal = cursor.fetchall()
		if len(mac_bal) == 0:	
			current_mac_bal = 0
		else:	
			current_mac_bal = float(mac_bal[0][0]) - float(deduction)
			if current_mac_bal <= 0:	current_mac_bal = 0	# Stop Subtracting

		# update notification table when mac balance is below 100
		if current_mac_bal < 100 and current_mac_bal != 0:
			delete_prev_notif = """ DELETE FROM notifications WHERE notification = %s AND mac = %s """
			update_notif_tb = """ INSERT INTO notifications(user, operator, mac, notification, notiftype, dateCreated)
								VALUES(%s, %s, %s, %s, %s, %s) """
			cursor.execute(delete_prev_notif, ('low-balance', _dict['routerMac']))
			cursor.execute(update_notif_tb, (operator, operator, _dict['routerMac'], 'low-balance', 'Operator', self.datenow()))


		# transaction happens
		add_trans = """ INSERT INTO transactions(routerMac, userMac, mobileNum, denomination, price, loadcentral_price, 
					admin_revenue, opr_revenue, rrn, response_code, tid, bal, mac_bal, epin, err, type, site, operator, 
					admin_price, base_price, service_charge, provider, dateCreated) 
					VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) """
		_trans = (_dict['routerMac'], _dict['userMac'], _dict['mobileNum'], _dict['denomination'], price, loadcentral_price, 
					admin_revenue, opr_revenue, _dict['rrn'], _dict['resp'], _dict['tid'], _dict['bal'], current_mac_bal, 
					_dict['epin'], _dict['err'], _dict['type'], site, operator, a_price, base_price, serviceCharge, provider, self.datenow())	
		
		add_balance_log = """ INSERT INTO balance_logs(mac, balance, deduction, dateCreated)
							VALUES (%s, %s, %s, %s) """
		_balanceLog = [(_dict['routerMac'], current_mac_bal, deduction, self.datenow()),
					   ('admin', admin_balance, admin_deduction, self.datenow())]

		update_macs_tb = """ UPDATE macs SET balance = %s WHERE mac = %s """
		umt = (current_mac_bal, _dict['routerMac'])
		
		cursor.execute(add_trans, _trans)
		cursor.executemany(add_balance_log, _balanceLog)
		cursor.execute(update_macs_tb, umt)
		conn.commit()
		cursor.close()
		conn.close()

		return 'Successfully Inserted'

	''' This Procedure Determines If The Routermac Of Transaction is Already Registered in List of Macs
		Then Adds it Into The List of Macs if Not Registered	'''
	def ADD_MAC(self, mac):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 			   database=self.dbname)
			cursor = conn.cursor(prepared=True)
		except:
			return 'Connection Unavailble DB error'
		
		_macParam = (mac,)
		_mac = (mac, self.datenow(), self.datenow())
		check_for_mac = """ SELECT * FROM macs WHERE macs.mac = %s """
		add_mac = """ INSERT INTO macs(mac, dateCreated, dateUpdated) VALUES(%s, %s, %s) """

		cursor.execute(check_for_mac, _macParam)
		mac = cursor.fetchall()
		
		if len(mac) != 0:
			return 'No insertion'
		
		cursor.execute(add_mac, _mac)
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
						SELECT MAX(id) FROM balance_logs WHERE mac = %s
						AND DATE(dateCreated) = DATE(NOW())) """
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

	def COUNT_MAC_WITH_BALANCE(self, userType, user):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 			   database=self.dbname)
			cursor = conn.cursor(prepared = True)
		except:
			return 'Connection Unavailble DB error'

		if userType == 'admin':
			query = """ SELECT COUNT(mac) AS withBalance FROM macs WHERE macs.balance != '0' """
			cursor.execute(query)

		elif userType == 'operator':
			query = """ SELECT COUNT(mac) AS withBalance FROM macs
					LEFT OUTER JOIN operators ON operators.operator = macs.operator
					WHERE macs.balance != '0' AND operators.operator = %s """
			cursor.execute(query, (user,))
		
		else:
			return 0

		rows = cursor.fetchall()
		if rows[0][0] == None:	return 0
		withBalance = rows[0][0]
		cursor.close()
		conn.close()

		return str(withBalance)

	def GET_REMAINING_LOAD(self, userType, user):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 			   database=self.dbname)
			cursor = conn.cursor(prepared = True)
		except:
			return 'Connection Unavailble DB error'
		

		admin = """ SELECT SUM(balance_logs.balance) AS balance FROM balance_logs
					WHERE balance_logs.id IN(
						SELECT MAX(id) FROM balance_logs
					    GROUP BY mac) AND balance_logs.mac != 'admin' """
		
		operator =	""" SELECT SUM(balance_logs.balance) AS balance FROM balance_logs
					LEFT OUTER JOIN macs ON macs.mac = balance_logs.mac
					WHERE balance_logs.id IN(
						SELECT MAX(id) FROM balance_logs
					    GROUP BY mac)
					AND macs.operator = %s """

		if userType == 'admin':
			cursor.execute(admin)
		
		elif userType == 'operator':
			cursor.execute(operator, (user,))
		
		else:
			return 0
		
		rows = cursor.fetchall()
		if rows[0][0] == None:	return 0
		remaining_load = rows[0][0]
		cursor.close()
		conn.close()
		
		return str(remaining_load)


	# Remove this later
	def GET_BALANCE_EACH(self, userType, user):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 			   database=self.dbname)
			cursor = conn.cursor(prepared = True)
		except:
			return 'Connection Unavailble DB error'

		admin = """ SELECT mac, site, operator, balance FROM macs ORDER BY macs.mac ASC """
		operator = """ SELECT mac, site, operator, balance FROM macs WHERE operator = %s 
					ORDER BY macs.mac ASC """

		_user = (user,)
		if userType == 'admin':
			cursor.execute(admin)
			rows = cursor.fetchall()
			if len(rows) == 0:
				return 0
		elif userType == 'operator':
			cursor.execute(operator, _user)
			rows = cursor.fetchall()
			if len(rows) == 0:
				return 0
		else:
			return 0

		cursor.close()
		conn.close()
		return rows

	def GET_SALES(self, userType, user, occ):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 			   database=self.dbname)
			cursor = conn.cursor(prepared = True)
		except:
			return 'Connection Unavailble DB error'

		if occ == 'daily':
			date = 'DATE(sales.dateCreated) = DATE(NOW())'
		elif occ == 'weekly':
			date = 'WEEK(sales.dateCreated) = WEEK(NOW())'
		elif occ == 'monthly':
			date = 'MONTH(sales.dateCreated) = MONTH(NOW())'
		else:
			date = 'DATE(sales.dateCreated) = DATE(NOW())'

		admin = """	SELECT SUM(sale) AS sales FROM sales
				WHERE """ + date + " AND sales.user = 'admin' "	# Proven correct

		operator = """ SELECT SUM(sale) AS sales FROM sales
					WHERE """ + date + " AND sales.user = %s "	# Proven correct

		if userType == 'admin':
			cursor.execute(admin)
			rows = cursor.fetchall()
		elif userType == 'operator':
			cursor.execute(operator, (user,))
			rows = cursor.fetchall()
		else:
			return 0
		
		if rows[0][0] == None:	return 0
		sales = rows[0][0]
		cursor.close()
		conn.close()
		return sales


	''' This Procedure Gets The Revenue of Admin, Operator & Partner '''
	def GET_EARNINGS(self, userType, user, occ):
		# occ = occurrence
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 			   database=self.dbname)
			cursor = conn.cursor(prepared = True)
		except:
			return 'Connection Unavailble DB error'

		if occ == 'daily':
			date = 'DATE(sales.dateCreated) = DATE(NOW())'
		elif occ == 'weekly':
			date = 'WEEK(sales.dateCreated) = WEEK(NOW())'
		elif occ == 'monthly':
			date = 'MONTH(sales.dateCreated) = MONTH(NOW())'
		else:
			date = 'DATE(sales.dateCreated) = DATE(NOW())'

		admin = """	SELECT SUM(revenue) AS earnings FROM sales
				WHERE """ + date + " AND sales.user = 'admin' "	# Proven correct

		operator = """ SELECT SUM(revenue) AS earnings FROM sales
					WHERE """ + date + " AND sales.user = %s "	# Proven correct

		if userType == 'admin':
			cursor.execute(admin)
			rows = cursor.fetchall()
		elif userType == 'operator':
			cursor.execute(operator, (user,))
			rows = cursor.fetchall()
		else:
			return 0
		
		if rows[0][0] == None:	return 0
		earnings = rows[0][0]
		cursor.close()
		conn.close()
		return earnings

	''' This Procedure Gets The Transactions of Admin, Operator & Partner '''
	def GET_TRANSACTIONS(self, userType, user, status, occ):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 			   database=self.dbname)
			cursor = conn.cursor(prepared = True)
		except:
			return 'Connection Unavailble DB error'

		if occ == 'daily':
			date = 'DATE(transactions.dateCreated) = DATE(NOW())'
		elif occ == 'weekly':
			date = 'WEEK(transactions.dateCreated) = WEEK(NOW())'
		elif occ == 'monthly':
			date = 'MONTH(transactions.dateCreated) = MONTH(NOW())'
		else:
			date = 'DATE(transactions.dateCreated) = DATE(NOW())'


		admin = """ SELECT COUNT(transactions.id) AS transactions FROM transactions WHERE """ + date
		admin_success = """ SELECT COUNT(transactions.id) AS transactions FROM transactions
						WHERE """ + date + """ AND transactions.response_code = '0' """	# Proven correct
		admin_failed = """ SELECT COUNT(transactions.id) AS transactions FROM transactions
						WHERE """ + date + """ AND transactions.response_code != '0' """	# Proven correct

		operator = """ SELECT COUNT(transactions.id) AS transactions FROM transactions
					LEFT OUTER JOIN macs ON macs.mac = transactions.routerMac
					WHERE """ + date + """ AND macs.operator = %s """	# Proven correct
		operator_success = """ SELECT COUNT(transactions.id) AS transactions FROM transactions
							LEFT OUTER JOIN macs ON macs.mac = transactions.routerMac
							WHERE """ + date + """ AND macs.operator = %s AND transactions.response_code = '0' """	# Proven correct
		operator_failed = """ SELECT COUNT(transactions.id) AS transactions FROM transactions
							LEFT OUTER JOIN macs ON macs.mac = transactions.routerMac
							WHERE """ + date + """ AND macs.operator = %s AND transactions.response_code != '0' """	# Proven correct

		_user = (user,)
		if userType == 'admin':
			if status == 'all':
				cursor.execute(admin)
				rows = cursor.fetchall()
			elif status == 'success':
				cursor.execute(admin_success)
				rows = cursor.fetchall()
			elif status == 'failed':
				cursor.execute(admin_failed)
				rows = cursor.fetchall()
			else:
				return 0
		elif userType == 'operator':
			if status == 'all':
				cursor.execute(operator, _user)
				rows = cursor.fetchall()
			elif status == 'success':
				cursor.execute(operator_success, _user)
				rows = cursor.fetchall()
			elif status == 'failed':
				cursor.execute(operator_failed, _user)
				rows = cursor.fetchall()
			else:
				return 0
		else:
			return 0

		transactions = rows[0][0]
		cursor.close()
		conn.close()
		return transactions

	def PERIODIC_DATES(self, period):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 			   database=self.dbname)
			cursor = conn.cursor(prepared = True)
		except:
			return 'Connection Unavailble DB error'
		
		daily = """ SELECT DATE_FORMAT(dateCreated, '%Y-%m-%d') AS dates FROM dates_tb 
				WHERE DAYOFYEAR(dateCreated) = DAYOFYEAR(NOW()) - %s
                GROUP BY DATE(dateCreated) """
		
		weekly = """ SELECT DATE_FORMAT(dateCreated, '%Y-%m-%d') AS dates FROM dates_tb 
				WHERE WEEKOFYEAR(dateCreated) = WEEKOFYEAR(NOW()) - %s
                GROUP BY WEEKOFYEAR(dateCreated) """
		
		dates = []
		if period == 'daily':
			for x in range(16):
				cursor.execute(daily, (x,))
				rows = cursor.fetchall()
				dates.append(rows[0])
		
		elif period == 'weekly':
			for x in range(4):
				cursor.execute(weekly, (x,))
				rows = cursor.fetchall()
				dates.append(rows[0])

		elif period == 'monthly':
			dates = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

		cursor.close()
		conn.close()
		return dates

	''' This Procedure Gets The Peridic Balance of Admin, Operator & Partner 
		NOTE: The database MUST have a scheduler that adds the latest balance
		of each mac even no transactions happened within the day so that operators
		and partners with multiple macs should see their balance correctly '''
	def GET_PERIODIC_BALANCE(self, userType, user, period):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 			   database=self.dbname)
			cursor = conn.cursor(prepared = True)
		except:
			return 'Connection Unavailble DB error'


		''' The ff queries has a null return if no records found in the db '''
		admin_daily = """ SELECT balance_logs.dateCreated, SUM(balance_logs.balance) AS balance FROM balance_logs
						WHERE balance_logs.id IN(
    						SELECT MAX(balance_logs.id) FROM balance_logs
    						WHERE DAYOFYEAR(dateCreated) = DAYOFYEAR(NOW()) - %s
    						GROUP BY mac)
						AND balance_logs.mac = %s """
		admin_weekly = """ SELECT balance_logs.dateCreated, SUM(balance_logs.balance) AS balance FROM balance_logs
						WHERE balance_logs.id IN(
    						SELECT MAX(balance_logs.id) FROM balance_logs
    						WHERE WEEKOFYEAR(dateCreated) = WEEKOFYEAR(NOW()) - %s
    						GROUP BY mac)
						AND balance_logs.mac = %s """
		admin_monthly = """ SELECT balance_logs.dateCreated, SUM(balance_logs.balance) AS balance FROM balance_logs
						WHERE balance_logs.id IN(
    						SELECT MAX(balance_logs.id) FROM balance_logs
    						WHERE MONTH(dateCreated) = %s
    						GROUP BY mac)
						AND balance_logs.mac = %s """

		operator_daily = """ SELECT op_balance_logs.dateCreated, SUM(op_balance_logs.balance) AS balance FROM op_balance_logs
							WHERE op_balance_logs.id IN(
    							SELECT MAX(id) FROM op_balance_logs
    							WHERE DAYOFYEAR(dateCreated) = DAYOFYEAR(NOW()) - %s GROUP BY operator)
							AND op_balance_logs.operator = %s """
		operator_weekly = """ SELECT op_balance_logs.dateCreated, SUM(op_balance_logs.balance) AS balance FROM op_balance_logs
							WHERE op_balance_logs.id IN(
    							SELECT MAX(id) FROM op_balance_logs
    							WHERE WEEKOFYEAR(dateCreated) = WEEKOFYEAR(NOW()) - %s GROUP BY operator)
							AND op_balance_logs.operator = %s """
		operator_monthly = """ SELECT op_balance_logs.dateCreated, SUM(op_balance_logs.balance) AS balance FROM op_balance_logs
							WHERE op_balance_logs.id IN(
    							SELECT MAX(id) FROM op_balance_logs
    							WHERE MONTH(dateCreated) = %s GROUP BY operator)
							AND op_balance_logs.operator = %s """

		current_bal = self.GET_BALANCE(userType, user)
		arr = []
		if userType == 'admin':
			if period == 'daily':
				for x in range(16):
					_user = (x, user)
					cursor.execute(admin_daily, _user)
					rows = cursor.fetchall()
					if rows[0][0] == None:
						arr.append((0,0))
					else:
						arr.append(rows[0])
			elif period == 'weekly':
				for x in range(4):
					_user = (x, user)
					cursor.execute(admin_weekly, _user)
					rows = cursor.fetchall()
					if rows[0][0] == None:
						arr.append((0,0))
					else:
						arr.append(rows[0])
			elif period == 'monthly':
				for x in range(1,13):
					_user = (x, user)
					cursor.execute(admin_monthly, _user)
					rows = cursor.fetchall()
					if rows[0][0] == None:
						arr.append((0,0))
					else:
						arr.append(rows[0])
			else:
				return 0
		
		elif userType == 'operator':
			if period == 'daily':
				for x in range(16):
					_user = (x, user)
					cursor.execute(operator_daily, _user)
					rows = cursor.fetchall()
					if rows[0][0] == None:
						arr.append((0,0))
					else:
						arr.append(rows[0])
			elif period == 'weekly':
				for x in range(4):
					_user = (x, user)
					cursor.execute(operator_weekly, _user)
					rows = cursor.fetchall()
					if rows[0][0] == None:
						arr.append((0,0))
					else:
						arr.append(rows[0])
			elif period == 'monthly':
				for x in range(1,13):
					_user = (x, user)
					cursor.execute(operator_monthly, _user)
					rows = cursor.fetchall()
					if rows[0][0] == None:
						arr.append((0,0))
					else:
						arr.append(rows[0])
			else:
				return 0
		else:
			return 0

		cursor.close()
		conn.close()
		return arr

	def SEARCH_PERIODIC_BALANCE(self, userType, user, period, mac):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 			   database=self.dbname)
			cursor = conn.cursor(prepared = True)
		except:
			return 'Connection Unavailble DB error'

		admin_daily = """ SELECT balance_logs.dateCreated, balance_logs.balance FROM balance_logs
						WHERE balance_logs.id IN(
    						SELECT MAX(balance_logs.id) FROM balance_logs
    						WHERE DAYOFYEAR(dateCreated) = DAYOFYEAR(NOW()) - %s
    						GROUP BY mac)
						AND balance_logs.mac = %s """
		admin_weekly = """ SELECT balance_logs.dateCreated, balance_logs.balance FROM balance_logs
						WHERE balance_logs.id IN(
    						SELECT MAX(balance_logs.id) FROM balance_logs
    						WHERE WEEKOFYEAR(dateCreated) = WEEKOFYEAR(NOW()) - %s
    						GROUP BY mac)
						AND balance_logs.mac = %s """
		admin_monthly = """ SELECT balance_logs.dateCreated, balance_logs.balance FROM balance_logs
						WHERE balance_logs.id IN(
    						SELECT MAX(balance_logs.id) FROM balance_logs
    						WHERE MONTH(dateCreated) = %s
    						GROUP BY mac)
						AND balance_logs.mac = %s """

		operator_daily = """ SELECT balance_logs.dateCreated, balance_logs.balance FROM balance_logs
							LEFT OUTER JOIN macs ON macs.mac = balance_logs.mac
							WHERE balance_logs.id IN(
    							SELECT MAX(id) FROM balance_logs
    							WHERE DAYOFYEAR(dateCreated) = DAYOFYEAR(NOW()) - %s
    							GROUP BY mac)
							AND macs.operator = %s AND balance_logs.mac = %s """
		operator_weekly = """ SELECT balance_logs.dateCreated, balance_logs.balance FROM balance_logs
							LEFT OUTER JOIN macs ON macs.mac = balance_logs.mac
							WHERE balance_logs.id IN(
    							SELECT MAX(id) FROM balance_logs
    							WHERE WEEKOFYEAR(dateCreated) = WEEKOFYEAR(NOW()) - %s
    							GROUP BY mac)
							AND macs.operator = %s AND balance_logs.mac = %s """
		operator_monthly = """ SELECT balance_logs.dateCreated, balance_logs.balance FROM balance_logs
							LEFT OUTER JOIN macs ON macs.mac = balance_logs.mac
							WHERE balance_logs.id IN(
    							SELECT MAX(id) FROM balance_logs
    							WHERE MONTH(dateCreated) = %s
    							GROUP BY mac)
							AND macs.operator = %s AND balance_logs.mac = %s """

		current_mac_bal = self.GET_MAC_BALANCE(mac)
		arr = []
		if userType == 'admin':
			if period == 'daily':
				for x in range(16):
					_user = (x, mac)
					cursor.execute(admin_daily, _user)
					rows = cursor.fetchall()
					if len(rows) == 0:
						arr.append((0,0))
					else:
						arr.append(rows[0])
			elif period == 'weekly':
				for x in range(4):
					_user = (x, mac)
					cursor.execute(admin_weekly, _user)
					rows = cursor.fetchall()
					if len(rows) == 0:
						arr.append((0,0))
					else:
						arr.append(rows[0])
			elif period == 'monthly':
				for x in range(1,13):
					_user = (x, mac)
					cursor.execute(admin_monthly, _user)
					rows = cursor.fetchall()
					if len(rows) == 0:
						arr.append((0,0))
					else:
						arr.append(rows[0])
			else:
				return 0
		
		elif userType == 'operator':
			if period == 'daily':
				for x in range(16):
					_user = (x, user, mac)
					cursor.execute(operator_daily, _user)
					rows = cursor.fetchall()
					if len(rows) == 0:
						arr.append((0,0))
					else:
						arr.append(rows[0])
			elif period == 'weekly':
				for x in range(4):
					_user = (x, user, mac)
					cursor.execute(operator_weekly, _user)
					rows = cursor.fetchall()
					if len(rows) == 0:
						arr.append((0,0))
					else:
						arr.append(rows[0])
			elif period == 'monthly':
				for x in range(1,13):
					_user = (x, user, mac)
					cursor.execute(operator_monthly, _user)
					rows = cursor.fetchall()
					if len(rows) == 0:
						arr.append((0,0))
					else:
						arr.append(rows[0])
			else:
				return 0

		else:
			return 0

		cursor.close()
		conn.close()
		return arr


	''' This Procedure Gets The Peridic Earnings or Deduction as well as TopUp of Admin, Operator & Partner 
		NOTE: The database must have a scheduler that adds the latest balance
		of each mac even no transactions happened within the day so that operators
		and partners with multiple macs should see their balance correctly '''
	def GET_PERIODIC_DEDUCTION(self, userType, user, period):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 			   database=self.dbname)
			cursor = conn.cursor(prepared = True)
		except:
			return 'Connection Unavailble DB error'

		''' The ff queries has a None or empty return if no records found in the db '''
		admin_daily = """ SELECT balance_logs.dateCreated, SUM(balance_logs.deduction) AS deduction,
						SUM(balance_logs.topup) AS topup FROM balance_logs
						WHERE DAYOFYEAR(dateCreated) = DAYOFYEAR(NOW()) - %s
						AND balance_logs.mac = %s
						GROUP BY DAYOFYEAR(balance_logs.dateCreated) """
		admin_weekly = """ SELECT balance_logs.dateCreated, SUM(balance_logs.deduction) AS deduction,
						SUM(balance_logs.topup) AS topup FROM balance_logs
						WHERE WEEKOFYEAR(dateCreated) = WEEKOFYEAR(NOW()) - %s
						AND balance_logs.mac = %s
						GROUP BY WEEKOFYEAR(balance_logs.dateCreated) """
		admin_monthly = """ SELECT balance_logs.dateCreated, SUM(balance_logs.deduction) AS deduction,
						SUM(balance_logs.topup) AS topup FROM balance_logs
						WHERE MONTH(dateCreated) = %s
						AND balance_logs.mac = %s
						GROUP BY MONTH(balance_logs.dateCreated) """

		operator_daily = """ SELECT op_balance_logs.dateCreated, SUM(op_balance_logs.deduction) AS deduction,
							SUM(op_balance_logs.topup) AS topup FROM op_balance_logs
							WHERE DAYOFYEAR(op_balance_logs.dateCreated) = DAYOFYEAR(NOW()) - %s
							AND op_balance_logs.operator = %s
							GROUP BY DAYOFYEAR(op_balance_logs.dateCreated) """
		operator_weekly = """ SELECT op_balance_logs.dateCreated, SUM(op_balance_logs.deduction) AS deduction,
							SUM(op_balance_logs.topup) AS topup FROM op_balance_logs
							WHERE WEEKOFYEAR(op_balance_logs.dateCreated) = WEEKOFYEAR(NOW()) - %s
							AND op_balance_logs.operator = %s
							GROUP BY WEEKOFYEAR(op_balance_logs.dateCreated) """
		operator_monthly = """ SELECT op_balance_logs.dateCreated, SUM(op_balance_logs.deduction) AS deduction,
							SUM(op_balance_logs.topup) AS topup FROM op_balance_logs
							WHERE MONTH(op_balance_logs.dateCreated) = %s
							AND op_balance_logs.operator = %s
							GROUP BY MONTH(op_balance_logs.dateCreated) """
		
		arr = []
		if userType == 'admin':
			if period == 'daily':
				for x in range(16):
					_user = (x, user)
					cursor.execute(admin_daily, _user)
					rows = cursor.fetchall()
					if len(rows) == 0:
						arr.append((0,0,0))
					else:
						arr.append(rows[0])
			elif period == 'weekly':
				for x in range(4):
					_user = (x, user)
					cursor.execute(admin_weekly, _user)
					rows = cursor.fetchall()
					if len(rows) == 0:
						arr.append((0,0,0))
					else:
						arr.append(rows[0])
			elif period == 'monthly':
				for x in range(1,13):
					_user = (x, user)
					cursor.execute(admin_monthly, _user)
					rows = cursor.fetchall()
					if len(rows) == 0:
						arr.append((0,0,0))
					else:
						arr.append(rows[0])
			else:
				return 0
		
		elif userType == 'operator':
			if period == 'daily':
				for x in range(16):
					_user = (x, user)
					cursor.execute(operator_daily, _user)
					rows = cursor.fetchall()
					if len(rows) == 0:
						arr.append((0,0,0))
					else:
						arr.append(rows[0])
			elif period == 'weekly':
				for x in range(4):
					_user = (x, user)
					cursor.execute(operator_weekly, _user)
					rows = cursor.fetchall()
					if len(rows) == 0:
						arr.append((0,0,0))
					else:
						arr.append(rows[0])
			elif period == 'monthly':
				for x in range(1,13):
					_user = (x, user)
					cursor.execute(operator_monthly, _user)
					rows = cursor.fetchall()
					if len(rows) == 0:
						arr.append((0,0,0))
					else:
						arr.append(rows[0])
			else:
				return 0
		
		else:
			return 0

		cursor.close()
		conn.close()
		return arr

	def SEARCH_PERIODIC_DEDUCTION(self, userType, user, period, mac):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 			   database=self.dbname)
			cursor = conn.cursor(prepared = True)
		except:
			return 'Connection Unavailble DB error'

		admin_daily = """ SELECT balance_logs.dateCreated, SUM(balance_logs.deduction) AS deduction,
						SUM(balance_logs.topup) AS topup FROM balance_logs
						WHERE DAYOFYEAR(dateCreated) = DAYOFYEAR(NOW()) - %s
						AND balance_logs.mac = %s
						GROUP BY DAYOFYEAR(balance_logs.dateCreated) """
		admin_weekly = """ SELECT balance_logs.dateCreated, SUM(balance_logs.deduction) AS deduction,
						SUM(balance_logs.topup) AS topup FROM balance_logs
						WHERE WEEKOFYEAR(dateCreated) = WEEKOFYEAR(NOW()) - %s
						AND balance_logs.mac = %s
						GROUP BY WEEKOFYEAR(balance_logs.dateCreated) """
		admin_monthly = """ SELECT balance_logs.dateCreated, SUM(balance_logs.deduction) AS deduction,
						SUM(balance_logs.topup) AS topup FROM balance_logs
						WHERE MONTH(dateCreated) = %s
						AND balance_logs.mac = %s
						GROUP BY MONTH(balance_logs.dateCreated) """

		operator_daily =  """ SELECT balance_logs.dateCreated, SUM(balance_logs.deduction) AS deduction,
							SUM(balance_logs.topup) AS topup FROM balance_logs
							LEFT OUTER JOIN macs ON macs.mac = balance_logs.mac
							WHERE DAYOFYEAR(balance_logs.dateCreated) = DAYOFYEAR(NOW()) - %s
							AND macs.operator = %s AND balance_logs.mac = %s
							GROUP BY DAYOFYEAR(balance_logs.dateCreated) """
		operator_weekly = """ SELECT balance_logs.dateCreated, SUM(balance_logs.deduction) AS deduction,
							SUM(balance_logs.topup) AS topup FROM balance_logs
							LEFT OUTER JOIN macs ON macs.mac = balance_logs.mac
							WHERE WEEKOFYEAR(balance_logs.dateCreated) = WEEKOFYEAR(NOW()) - %s
							AND macs.operator = %s AND balance_logs.mac = %s
							GROUP BY WEEKOFYEAR(balance_logs.dateCreated) """
		operator_monthly = """ SELECT balance_logs.dateCreated, SUM(balance_logs.deduction) AS deduction,
							SUM(balance_logs.topup) AS topup FROM balance_logs
							LEFT OUTER JOIN macs ON macs.mac = balance_logs.mac
							WHERE MONTH(balance_logs.dateCreated) = %s
							AND macs.operator = %s AND balance_logs.mac = %s
							GROUP BY MONTH(balance_logs.dateCreated) """

		arr = []
		if userType == 'admin':
			if period == 'daily':
				for x in range(16):
					_user = (x, mac)
					cursor.execute(admin_daily, _user)
					rows = cursor.fetchall()
					if len(rows) == 0:
						arr.append((0,0,0))
					else:
						arr.append(rows[0])
			elif period == 'weekly':
				for x in range(4):
					_user = (x, mac)
					cursor.execute(admin_weekly, _user)
					rows = cursor.fetchall()
					if len(rows) == 0:
						arr.append((0,0,0))
					else:
						arr.append(rows[0])
			elif period == 'monthly':
				for x in range(1,13):
					_user = (x, mac)
					cursor.execute(admin_monthly, _user)
					rows = cursor.fetchall()
					if len(rows) == 0:
						arr.append((0,0,0))
					else:
						arr.append(rows[0])
			else:
				return 0
		elif userType == 'operator':
			if period == 'daily':
				for x in range(16):
					_user = (x, user, mac)
					cursor.execute(operator_daily, _user)
					rows = cursor.fetchall()
					if len(rows) == 0:
						arr.append((0,0,0))
					else:
						arr.append(rows[0])
			elif period == 'weekly':
				for x in range(4):
					_user = (x, user, mac)
					cursor.execute(operator_weekly, _user)
					rows = cursor.fetchall()
					if len(rows) == 0:
						arr.append((0,0,0))
					else:
						arr.append(rows[0])
			elif period == 'monthly':
				for x in range(1,13):
					_user = (x, user, mac)
					cursor.execute(operator_monthly, _user)
					rows = cursor.fetchall()
					if len(rows) == 0:
						arr.append((0,0,0))
					else:
						arr.append(rows[0])
			else:
				return 0

		else:
			return 0

		cursor.close()
		conn.close()
		return arr



	def GET_PERIODIC_TRANSACTIONS_ALL(self, userType, user, period):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 			   database=self.dbname)
			cursor = conn.cursor(prepared = True)
		except:
			return 'Connection Unavailble DB error'

		admin_daily = """ SELECT transactions.dateCreated, COUNT(transactions.id) AS transactions FROM transactions
						WHERE DAYOFYEAR(dateCreated) = DAYOFYEAR(NOW()) - %s """
		admin_weekly = """ SELECT transactions.dateCreated, COUNT(transactions.id) AS transactions FROM transactions
						WHERE WEEKOFYEAR(dateCreated) = WEEKOFYEAR(NOW()) - %s """
		admin_monthly = """ SELECT transactions.dateCreated, COUNT(transactions.id) AS transactions FROM transactions
						WHERE MONTH(dateCreated) = %s """

		operator_daily = """ SELECT transactions.dateCreated, COUNT(transactions.id) AS transactions FROM transactions
							LEFT OUTER JOIN macs ON macs.mac = transactions.routerMac
							WHERE DAYOFYEAR(transactions.dateCreated) = DAYOFYEAR(NOW()) - %s
							AND macs.operator = %s """
		operator_weekly = """ SELECT transactions.dateCreated, COUNT(transactions.id) AS transactions FROM transactions
							LEFT OUTER JOIN macs ON macs.mac = transactions.routerMac
							WHERE WEEKOFYEAR(transactions.dateCreated) = WEEKOFYEAR(NOW()) - %s
							AND macs.operator = %s """
		operator_monthly = """ SELECT transactions.dateCreated, COUNT(transactions.id) AS transactions FROM transactions
							LEFT OUTER JOIN macs ON macs.mac = transactions.routerMac
							WHERE MONTH(transactions.dateCreated) = %s
							AND macs.operator = %s """

		arr = []
		if userType == 'admin':
			if period == 'daily':
				for x in range(16):
					cursor.execute(admin_daily, (x,))
					rows = cursor.fetchall()
					arr.append(rows[0])
			elif period == 'weekly':
				for x in range(4):
					cursor.execute(admin_weekly, (x,))
					rows = cursor.fetchall()
					arr.append(rows[0])
			elif period == 'monthly':
				for x in range(1,13):
					_user = (x,)
					cursor.execute(admin_monthly, _user)
					rows = cursor.fetchall()
					arr.append(rows[0])
			else:
				return 0

		elif userType == 'operator':
			if period == 'daily':
				for x in range(16):
					cursor.execute(operator_daily, (x, user))
					rows = cursor.fetchall()
					arr.append(rows[0])
			elif period == 'weekly':
				for x in range(4):
					cursor.execute(operator_weekly, (x, user))
					rows = cursor.fetchall()
					arr.append(rows[0])
			elif period == 'monthly':
				for x in range(1,13):
					cursor.execute(operator_monthly, (x, user))
					rows = cursor.fetchall()
					arr.append(rows[0])
			else:
				return 0

		else:
			return 0

		cursor.close()
		conn.close()
		return arr

	def SEARCH_PERIODIC_TRANSACTIONS_ALL(self, userType, user, period, search):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 			   database=self.dbname)
			cursor = conn.cursor(prepared = True)
		except:
			return 'Connection Unavailble DB error'

		if search['mac'] == '' and search['operator'] == '':
			where = " transactions.mobileNum=" + "'" + search['mobileNum'] + "'"
		elif search['operator'] == '' and search['mobileNum'] == '':
			where = " transactions.routerMac=" + "'" + search['mac'] + "'"
		elif search['mobileNum'] == '' and search['mac'] == '':
			where = " macs.operator=" + "'" + search['operator'] + "'"
		else:
			return 0

		admin_daily = """ SELECT transactions.dateCreated, COUNT(transactions.id) AS transactions FROM transactions
						LEFT OUTER JOIN macs ON macs.mac = transactions.routerMac
						WHERE DAYOFYEAR(transactions.dateCreated) = DAYOFYEAR(NOW()) - %s  AND """ + where
		admin_weekly = """ SELECT transactions.dateCreated, COUNT(transactions.id) AS transactions FROM transactions
						LEFT OUTER JOIN macs ON macs.mac = transactions.routerMac
						WHERE WEEKOFYEAR(transactions.dateCreated) = WEEKOFYEAR(NOW()) - %s  AND """ + where
		admin_monthly = """ SELECT transactions.dateCreated, COUNT(transactions.id) AS transactions FROM transactions
						LEFT OUTER JOIN macs ON macs.mac = transactions.routerMac
						WHERE MONTH(transactions.dateCreated) = %s  AND """ + where

		operator_daily = """ SELECT transactions.dateCreated, COUNT(transactions.id) AS transactions FROM transactions
							LEFT OUTER JOIN macs ON macs.mac = transactions.routerMac
							WHERE DAYOFYEAR(transactions.dateCreated) = DAYOFYEAR(NOW()) - %s
							AND macs.operator = %s AND """ + where
		operator_weekly = """ SELECT transactions.dateCreated, COUNT(transactions.id) AS transactions FROM transactions
							LEFT OUTER JOIN macs ON macs.mac = transactions.routerMac
							WHERE WEEKOFYEAR(transactions.dateCreated) = WEEKOFYEAR(NOW()) - %s
							AND macs.operator = %s AND """ + where
		operator_monthly = """ SELECT transactions.dateCreated, COUNT(transactions.id) AS transactions FROM transactions
							LEFT OUTER JOIN macs ON macs.mac = transactions.routerMac
							WHERE MONTH(transactions.dateCreated) = %s
							AND macs.operator = %s AND """ + where

		arr = []
		if userType == 'admin':
			if period == 'daily':
				for x in range(16):
					cursor.execute(admin_daily, (x,))
					rows = cursor.fetchall()
					arr.append(rows[0])
			elif period == 'weekly':
				for x in range(4):
					cursor.execute(admin_weekly, (x,))
					rows = cursor.fetchall()
					arr.append(rows[0])
			elif period == 'monthly':
				for x in range(1,13):
					cursor.execute(admin_monthly, (x,))
					rows = cursor.fetchall()
					arr.append(rows[0])
			else:
				return 0

		elif userType == 'operator':
			if period == 'daily':
				for x in range(16):
					cursor.execute(operator_daily, (x, user))
					rows = cursor.fetchall()
					arr.append(rows[0])
			elif period == 'weekly':
				for x in range(4):
					cursor.execute(operator_weekly, (x, user))
					rows = cursor.fetchall()
					arr.append(rows[0])
			elif period == 'monthly':
				for x in range(1,13):
					cursor.execute(operator_monthly, (x, user))
					rows = cursor.fetchall()
					arr.append(rows[0])
			else:
				return 0

		else:
			return 0

		cursor.close()
		conn.close()
		return arr

	def GET_PERIODIC_TRANSACTIONS_SUCCESS(self, userType, user, period):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 			   database=self.dbname)
			cursor = conn.cursor(prepared = True)
		except:
			return 'Connection Unavailble DB error'

		admin_daily = """ SELECT transactions.dateCreated, COUNT(transactions.id) AS transactions FROM transactions
						WHERE DAYOFYEAR(dateCreated) = DAYOFYEAR(NOW()) - %s
						AND transactions.response_code = '0' """
		admin_weekly = """ SELECT transactions.dateCreated, COUNT(transactions.id) AS transactions FROM transactions
						WHERE WEEKOFYEAR(dateCreated) = WEEKOFYEAR(NOW()) - %s
						AND transactions.response_code = '0' """
		admin_monthly = """ SELECT transactions.dateCreated, COUNT(transactions.id) AS transactions FROM transactions
						WHERE MONTH(dateCreated) = %s
						AND transactions.response_code = '0' """

		operator_daily = """ SELECT transactions.dateCreated, COUNT(transactions.id) AS transactions FROM transactions
							LEFT OUTER JOIN macs ON macs.mac = transactions.routerMac
							WHERE DAYOFYEAR(transactions.dateCreated) = DAYOFYEAR(NOW()) - %s
							AND macs.operator = %s AND transactions.response_code = '0' """
		operator_weekly = """ SELECT transactions.dateCreated, COUNT(transactions.id) AS transactions FROM transactions
							LEFT OUTER JOIN macs ON macs.mac = transactions.routerMac
							WHERE WEEKOFYEAR(transactions.dateCreated) = WEEKOFYEAR(NOW()) - %s
							AND macs.operator = %s AND transactions.response_code = '0' """
		operator_monthly = """ SELECT transactions.dateCreated, COUNT(transactions.id) AS transactions FROM transactions
							LEFT OUTER JOIN macs ON macs.mac = transactions.routerMac
							WHERE MONTH(transactions.dateCreated) = %s
							AND macs.operator = %s AND transactions.response_code = '0' """

		arr = []
		if userType == 'admin':
			if period == 'daily':
				for x in range(16):
					cursor.execute(admin_daily, (x,))
					rows = cursor.fetchall()
					arr.append(rows[0])
			elif period == 'weekly':
				for x in range(4):
					cursor.execute(admin_weekly, (x,))
					rows = cursor.fetchall()
					arr.append(rows[0])
			elif period == 'monthly':
				for x in range(1,13):
					cursor.execute(admin_monthly, (x,))
					rows = cursor.fetchall()
					arr.append(rows[0])
			else:
				return 0

		elif userType == 'operator':
			if period == 'daily':
				for x in range(16):
					cursor.execute(operator_daily, (x, user))
					rows = cursor.fetchall()
					arr.append(rows[0])
			elif period == 'weekly':
				for x in range(4):
					cursor.execute(operator_weekly, (x, user))
					rows = cursor.fetchall()
					arr.append(rows[0])
			elif period == 'monthly':
				for x in range(1,13):
					cursor.execute(operator_monthly, (x, user))
					rows = cursor.fetchall()
					arr.append(rows[0])
			else:
				return 0

		else:
			return 0

		cursor.close()
		conn.close()
		return arr

	def SEARCH_PERIODIC_TRANSACTIONS_SUCCESS(self, userType, user, period, search):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 			   database=self.dbname)
			cursor = conn.cursor(prepared = True)
		except:
			return 'Connection Unavailble DB error'

		if search['mac'] == '' and search['operator'] == '':
			where = " transactions.mobileNum=" + "'" + search['mobileNum'] + "'"
		elif search['operator'] == '' and search['mobileNum'] == '':
			where = " transactions.routerMac=" + "'" + search['mac'] + "'"
		elif search['mobileNum'] == '' and search['mac'] == '':
			where = " macs.operator=" + "'" + search['operator'] + "'"
		else:
			return 0

		admin_daily = """ SELECT transactions.dateCreated, COUNT(transactions.id) AS transactions FROM transactions
						LEFT OUTER JOIN macs ON macs.mac = transactions.routerMac
						WHERE DAYOFYEAR(transactions.dateCreated) = DAYOFYEAR(NOW()) - %s
						AND transactions.response_code = '0' AND """ + where
		admin_weekly = """ SELECT transactions.dateCreated, COUNT(transactions.id) AS transactions FROM transactions
						LEFT OUTER JOIN macs ON macs.mac = transactions.routerMac
						WHERE WEEKOFYEAR(transactions.dateCreated) = WEEKOFYEAR(NOW()) - %s
						AND transactions.response_code = '0' AND """ + where
		admin_monthly = """ SELECT transactions.dateCreated, COUNT(transactions.id) AS transactions FROM transactions
						LEFT OUTER JOIN macs ON macs.mac = transactions.routerMac
						WHERE MONTH(transactions.dateCreated) = %s 
						AND transactions.response_code = '0' AND """ + where

		operator_daily = """ SELECT transactions.dateCreated, COUNT(transactions.id) AS transactions FROM transactions
							LEFT OUTER JOIN macs ON macs.mac = transactions.routerMac
							WHERE DAYOFYEAR(transactions.dateCreated) = DAYOFYEAR(NOW()) - %s
							AND macs.operator = %s AND transactions.response_code = '0' AND """ + where
		operator_weekly = """ SELECT transactions.dateCreated, COUNT(transactions.id) AS transactions FROM transactions
							LEFT OUTER JOIN macs ON macs.mac = transactions.routerMac
							WHERE WEEKOFYEAR(transactions.dateCreated) = WEEKOFYEAR(NOW()) - %s
							AND macs.operator = %s AND transactions.response_code = '0' AND """ + where
		operator_monthly = """ SELECT transactions.dateCreated, COUNT(transactions.id) AS transactions FROM transactions
							LEFT OUTER JOIN macs ON macs.mac = transactions.routerMac
							WHERE MONTH(transactions.dateCreated) = %s
							AND macs.operator = %s AND transactions.response_code = '0' AND """ + where

		arr = []
		if userType == 'admin':
			if period == 'daily':
				for x in range(16):
					cursor.execute(admin_daily, (x,))
					rows = cursor.fetchall()
					arr.append(rows[0])
			elif period == 'weekly':
				for x in range(4):
					cursor.execute(admin_weekly, (x,))
					rows = cursor.fetchall()
					arr.append(rows[0])
			elif period == 'monthly':
				for x in range(1,13):
					cursor.execute(admin_monthly, (x,))
					rows = cursor.fetchall()
					arr.append(rows[0])
			else:
				return 0

		elif userType == 'operator':
			if period == 'daily':
				for x in range(16):
					cursor.execute(operator_daily, (x, user))
					rows = cursor.fetchall()
					arr.append(rows[0])
			elif period == 'weekly':
				for x in range(4):
					cursor.execute(operator_weekly, (x, user))
					rows = cursor.fetchall()
					arr.append(rows[0])
			elif period == 'monthly':
				for x in range(1,13):
					cursor.execute(operator_monthly, (x, user))
					rows = cursor.fetchall()
					arr.append(rows[0])
			else:
				return 0

		else:
			return 0

		cursor.close()
		conn.close()
		return arr

	def GET_PERIODIC_TRANSACTIONS_FAILED(self, userType, user, period):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 			   database=self.dbname)
			cursor = conn.cursor(prepared = True)
		except:
			return 'Connection Unavailble DB error'

		admin_daily = """ SELECT transactions.dateCreated, COUNT(transactions.id) AS transactions FROM transactions
						WHERE DAYOFYEAR(dateCreated) = DAYOFYEAR(NOW()) - %s
						AND transactions.response_code != '0' """
		admin_weekly = """ SELECT transactions.dateCreated, COUNT(transactions.id) AS transactions FROM transactions
						WHERE WEEKOFYEAR(dateCreated) = WEEKOFYEAR(NOW()) - %s
						AND transactions.response_code != '0' """
		admin_monthly = """ SELECT transactions.dateCreated, COUNT(transactions.id) AS transactions FROM transactions
						WHERE MONTH(dateCreated) = %s
						AND transactions.response_code != '0' """

		operator_daily = """ SELECT transactions.dateCreated, COUNT(transactions.id) AS transactions FROM transactions
							LEFT OUTER JOIN macs ON macs.mac = transactions.routerMac
							WHERE DAYOFYEAR(transactions.dateCreated) = DAYOFYEAR(NOW()) - %s
							AND macs.operator = %s AND transactions.response_code != '0' """
		operator_weekly = """ SELECT transactions.dateCreated, COUNT(transactions.id) AS transactions FROM transactions
							LEFT OUTER JOIN macs ON macs.mac = transactions.routerMac
							WHERE WEEKOFYEAR(transactions.dateCreated) = WEEKOFYEAR(NOW()) - %s
							AND macs.operator = %s AND transactions.response_code != '0' """
		operator_monthly = """ SELECT transactions.dateCreated, COUNT(transactions.id) AS transactions FROM transactions
							LEFT OUTER JOIN macs ON macs.mac = transactions.routerMac
							WHERE MONTH(transactions.dateCreated) = %s
							AND macs.operator = %s AND transactions.response_code != '0' """

		arr = []
		if userType == 'admin':
			if period == 'daily':
				for x in range(16):
					cursor.execute(admin_daily, (x,))
					rows = cursor.fetchall()
					arr.append(rows[0])
			elif period == 'weekly':
				for x in range(4):
					cursor.execute(admin_weekly, (x,))
					rows = cursor.fetchall()
					arr.append(rows[0])
			elif period == 'monthly':
				for x in range(1,13):
					cursor.execute(admin_monthly, (x,))
					rows = cursor.fetchall()
					arr.append(rows[0])
			else:
				return 0

		elif userType == 'operator':
			if period == 'daily':
				for x in range(16):
					cursor.execute(operator_daily, (x, user))
					rows = cursor.fetchall()
					arr.append(rows[0])
			elif period == 'weekly':
				for x in range(4):
					cursor.execute(operator_weekly, (x, user))
					rows = cursor.fetchall()
					arr.append(rows[0])
			elif period == 'monthly':
				for x in range(1,13):
					cursor.execute(operator_monthly, (x, user))
					rows = cursor.fetchall()
					arr.append(rows[0])
			else:
				return 0

		else:
			return 0

		cursor.close()
		conn.close()
		return arr

	def SEARCH_PERIODIC_TRANSACTIONS_FAILED(self, userType, user, period, search):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 			   database=self.dbname)
			cursor = conn.cursor(prepared = True)
		except:
			return 'Connection Unavailble DB error'

		if search['mac'] == '' and search['operator'] == '':
			where = " transactions.mobileNum=" + "'" + search['mobileNum'] + "'"
		elif search['operator'] == '' and search['mobileNum'] == '':
			where = " transactions.routerMac=" + "'" + search['mac'] + "'"
		elif search['mobileNum'] == '' and search['mac'] == '':
			where = " macs.operator=" + "'" + search['operator'] + "'"
		else:
			return 0

		admin_daily = """ SELECT transactions.dateCreated, COUNT(transactions.id) AS transactions FROM transactions
						LEFT OUTER JOIN macs ON macs.mac = transactions.routerMac
						WHERE DAYOFYEAR(transactions.dateCreated) = DAYOFYEAR(NOW()) - %s
						AND transactions.response_code != '0' AND """ + where
		admin_weekly = """ SELECT transactions.dateCreated, COUNT(transactions.id) AS transactions FROM transactions
						LEFT OUTER JOIN macs ON macs.mac = transactions.routerMac
						WHERE WEEKOFYEAR(transactions.dateCreated) = WEEKOFYEAR(NOW()) - %s
						AND transactions.response_code != '0' AND """ + where
		admin_monthly = """ SELECT transactions.dateCreated, COUNT(transactions.id) AS transactions FROM transactions
						LEFT OUTER JOIN macs ON macs.mac = transactions.routerMac
						WHERE MONTH(transactions.dateCreated) = %s 
						AND transactions.response_code != '0' AND """ + where

		operator_daily = """ SELECT transactions.dateCreated, COUNT(transactions.id) AS transactions FROM transactions
							LEFT OUTER JOIN macs ON macs.mac = transactions.routerMac
							WHERE DAYOFYEAR(transactions.dateCreated) = DAYOFYEAR(NOW()) - %s
							AND macs.operator = %s AND transactions.response_code != '0' AND """ + where
		operator_weekly = """ SELECT transactions.dateCreated, COUNT(transactions.id) AS transactions FROM transactions
							LEFT OUTER JOIN macs ON macs.mac = transactions.routerMac
							WHERE WEEKOFYEAR(transactions.dateCreated) = WEEKOFYEAR(NOW()) - %s
							AND macs.operator = %s AND transactions.response_code != '0' AND """ + where
		operator_monthly = """ SELECT transactions.dateCreated, COUNT(transactions.id) AS transactions FROM transactions
							LEFT OUTER JOIN macs ON macs.mac = transactions.routerMac
							WHERE MONTH(transactions.dateCreated) = %s
							AND macs.operator = %s AND transactions.response_code != '0' AND """ + where

		arr = []
		if userType == 'admin':
			if period == 'daily':
				for x in range(16):
					cursor.execute(admin_daily, (x,))
					rows = cursor.fetchall()
					arr.append(rows[0])
			elif period == 'weekly':
				for x in range(4):
					cursor.execute(admin_weekly, (x,))
					rows = cursor.fetchall()
					arr.append(rows[0])
			elif period == 'monthly':
				for x in range(1,13):
					cursor.execute(admin_monthly, (x,))
					rows = cursor.fetchall()
					arr.append(rows[0])
			else:
				return 0

		elif userType == 'operator':
			if period == 'daily':
				for x in range(16):
					cursor.execute(operator_daily, (x, user))
					rows = cursor.fetchall()
					arr.append(rows[0])
			elif period == 'weekly':
				for x in range(4):
					cursor.execute(operator_weekly, (x, user))
					rows = cursor.fetchall()
					arr.append(rows[0])
			elif period == 'monthly':
				for x in range(1,13):
					cursor.execute(operator_monthly, (x, user))
					rows = cursor.fetchall()
					arr.append(rows[0])
			else:
				return 0

		else:
			return 0

		cursor.close()
		conn.close()
		return arr

	def GET_TRANSACTION_LOGS(self, userType, user, occ):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 			   database=self.dbname)
			cursor = conn.cursor(prepared = True)
		except:
			return 'Connection Unavailble DB error'
			
		# filter occurence
		if occ == 'daily':
			if userType == 'admin':
				occurence = ' WHERE transactions.dateCreated > DATE_SUB(NOW(), INTERVAL 5 DAY)'
			else:
				occurence = ' AND transactions.dateCreated > DATE_SUB(NOW(), INTERVAL 5 DAY)'
		elif occ == 'weekly':
			if userType == 'admin':
				occurence = ' WHERE transactions.dateCreated > DATE_SUB(NOW(), INTERVAL 15 DAY)'
			else:
				occurence = ' AND transactions.dateCreated > DATE_SUB(NOW(), INTERVAL 15 DAY)'
		elif occ == 'monthly':
			if userType == 'admin':
				occurence = ' WHERE transactions.dateCreated > DATE_SUB(NOW(), INTERVAL 30 DAY)'
			else:
				occurence = ' AND transactions.dateCreated > DATE_SUB(NOW(), INTERVAL 30 DAY)'
		else:
			occurence = ''

		admin = """ SELECT transactions.dateCreated, transactions.routerMac, macs.site, operators.operator, 
				transactions.userMac, transactions.mobileNum, transactions.denomination AS productCode, 
				transactions.loadcentral_price, price_admin.price AS admin_price, transactions.price AS operator_price, 
				operators.service_charge, transactions.admin_revenue, transactions.opr_revenue, 
				transactions.bal, transactions.mac_bal, products.provider, 
				transactions.err, transactions.tid, price_pcode.price AS base_price, transactions.response_code FROM transactions
				LEFT OUTER JOIN price_admin ON price_admin.pcode = transactions.denomination
				LEFT OUTER JOIN price_pcode ON price_pcode.pcode = transactions.denomination
				LEFT OUTER JOIN products ON products.productCode = transactions.denomination
				LEFT OUTER JOIN macs ON macs.mac = transactions.routerMac
				LEFT OUTER JOIN operators ON operators.operator = macs.operator """ + occurence + " ORDER BY transactions.id DESC"
		operator = """ SELECT transactions.dateCreated, transactions.routerMac, macs.site, operators.operator, 
				transactions.userMac, transactions.mobileNum, transactions.denomination AS productCode, 
				transactions.loadcentral_price, price_admin.price AS admin_price, transactions.price AS operator_price, 
				operators.service_charge, transactions.admin_revenue, transactions.opr_revenue, 
				transactions.bal, transactions.mac_bal, products.provider, 
				transactions.err, transactions.tid, price_pcode.price AS base_price, transactions.response_code FROM transactions
				LEFT OUTER JOIN price_admin ON price_admin.pcode = transactions.denomination
				LEFT OUTER JOIN price_pcode ON price_pcode.pcode = transactions.denomination
				LEFT OUTER JOIN products ON products.productCode = transactions.denomination
				LEFT OUTER JOIN macs ON macs.mac = transactions.routerMac
				LEFT OUTER JOIN operators ON operators.operator = macs.operator 
				WHERE macs.operator = %s """ + occurence + " ORDER BY transactions.id DESC"

		if userType == 'admin':
			cursor.execute(admin)
			rows = cursor.fetchall()
			if rows == None:
				return 0
		elif userType == 'operator':
			cursor.execute(operator, (user,))
			rows = cursor.fetchall()
			if rows == None:
				return 0

		else:
			return 0

		cursor.close()
		conn.close()
		return rows

	def SEARCH_TRANSACTION_LOGS(self, userType, user, occ, search):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 			   database=self.dbname)
			cursor = conn.cursor(prepared = True)
		except:
			return 'Connection Unavailble DB error'

		# filter the search object parameter
		if search['mac'] == '' and search['operator'] == '':
			search_param = " transactions.mobileNum=" + "'" + search['mobileNum'] + "'"
		elif search['operator'] == '' and search['mobileNum'] == '':
			search_param = " transactions.routerMac=" + "'" + search['mac'] + "'"
		elif search['mobileNum'] == '' and search['mac'] == '':
			search_param = " macs.operator=" + "'" + search['operator'] + "'"
		else:
			return 0

		# filter occurence
		if occ == 'daily':
			occurence = ' AND transactions.dateCreated > DATE_SUB(NOW(), INTERVAL 5 DAY)'
		elif occ == 'weekly':
			occurence = ' AND transactions.dateCreated > DATE_SUB(NOW(), INTERVAL 15 DAY)'
		elif occ == 'monthly':
			occurence = ' AND transactions.dateCreated > DATE_SUB(NOW(), INTERVAL 30 DAY)'
		else:
			occurence = ''

		admin = """ SELECT transactions.dateCreated, transactions.routerMac, macs.site, operators.operator, 
				transactions.userMac, transactions.mobileNum, transactions.denomination AS productCode, 
				transactions.loadcentral_price, price_admin.price AS admin_price, transactions.price AS operator_price, 
				operators.service_charge, transactions.admin_revenue, transactions.opr_revenue, 
				transactions.bal, transactions.mac_bal, products.provider, 
				transactions.err, transactions.tid, price_pcode.price AS base_price, transactions.response_code FROM transactions
				LEFT OUTER JOIN price_admin ON price_admin.pcode = transactions.denomination
				LEFT OUTER JOIN price_pcode ON price_pcode.pcode = transactions.denomination
				LEFT OUTER JOIN products ON products.productCode = transactions.denomination
				LEFT OUTER JOIN macs ON macs.mac = transactions.routerMac
				LEFT OUTER JOIN operators ON operators.operator = macs.operator WHERE """ + search_param + occurence + " ORDER BY transactions.id DESC "
		operator = """ SELECT transactions.dateCreated, transactions.routerMac, macs.site, operators.operator, 
				transactions.userMac, transactions.mobileNum, transactions.denomination AS productCode, 
				transactions.loadcentral_price, price_admin.price AS admin_price, transactions.price AS operator_price, 
				operators.service_charge, transactions.admin_revenue, transactions.opr_revenue, 
				transactions.bal, transactions.mac_bal, products.provider, 
				transactions.err, transactions.tid, price_pcode.price AS base_price, transactions.response_code FROM transactions
				LEFT OUTER JOIN price_admin ON price_admin.pcode = transactions.denomination
				LEFT OUTER JOIN price_pcode ON price_pcode.pcode = transactions.denomination
				LEFT OUTER JOIN products ON products.productCode = transactions.denomination
				LEFT OUTER JOIN macs ON macs.mac = transactions.routerMac
				LEFT OUTER JOIN operators ON operators.operator = macs.operator
				WHERE macs.operator = %s AND """ + search_param + occurence + " ORDER BY transactions.id DESC "
		
		if userType == 'admin':
			cursor.execute(admin)
			rows = cursor.fetchall()
			if rows == None:
				return 0
		elif userType == 'operator':
			cursor.execute(operator, (user,))
			rows = cursor.fetchall()
			if rows == None:
				return 0
		else:
			return 0

		cursor.close()
		conn.close()
		return rows

	def GET_MACS_LIST(self, userType, user):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 			   database=self.dbname)
			cursor = conn.cursor(prepared = True)
		except:
			return 'Connection Unavailble DB error'

		admin = """ SELECT dateCreated, mac, site, operator, dateUpdated, balance, status FROM macs 
				ORDER BY mac ASC"""
		
		operator = """ SELECT dateCreated, mac, site, operator, dateUpdated, balance, status FROM macs
					WHERE macs.operator = %s ORDER BY mac ASC """

		if userType == 'admin':
			cursor.execute(admin)
			rows = cursor.fetchall()
			if rows == None:
				return 0
		
		elif userType == 'operator':
			cursor.execute(operator, (user,))
			rows = cursor.fetchall()
			if rows == None:
				return 0

		else:
			return 0

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

	def ASSIGN_MACS(self, site, operator, mac):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 			   database=self.dbname)
			cursor = conn.cursor(prepared = True)
		except:
			return 'Connection Unavailble DB error'

		assign = """ UPDATE macs SET macs.site = %s, macs.operator = %s
					WHERE macs.mac = %s """

		_data = (site, operator, mac)
		cursor.execute(assign, _data)
		conn.commit()
		cursor.close()
		conn.close()
		return 'Successfully Assigned'

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
				SELECT MAX(id) FROM balance_logs WHERE mac = %s
				AND DATE(dateCreated) = DATE(NOW())) """

		operator = """ SELECT balance_logs.balance FROM balance_logs
					LEFT OUTER JOIN macs ON macs.mac = balance_logs.mac
					WHERE balance_logs.id IN(
						SELECT MAX(id) FROM balance_logs WHERE mac = %s
						AND DATE(dateCreated) = DATE(NOW()))
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
				self.ADD_MAC(mac)
				return 'None'
			else:
				balance = bal[0][0]
		elif userType == 'Operator':
			_data = (mac, username)
			cursor.execute(operator, _data)
			bal = cursor.fetchall()
			if len(bal) == 0:
				self.ADD_MAC(mac)
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
		if int(topup) > int(op_bal):
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

	def GET_PRODUCTS(self, provider, operator):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 			   database=self.dbname)
			cursor = conn.cursor(prepared = True)
		except:
			return 'Connection Unavailble DB error'

		if operator == '':
			if provider == '':
				products = """ SELECT description, price_admin.pcode, price_loadcentral.price AS product_cost, 
							price_admin.price, provider, price_loadcentral.status FROM price_loadcentral
							LEFT OUTER JOIN price_admin ON price_loadcentral.pcode = price_admin.pcode """
				cursor.execute(products)
			else:
				products = """ SELECT description, price_admin.pcode, price_loadcentral.price AS product_cost, 
							price_admin.price, provider, price_loadcentral.status FROM price_loadcentral
							LEFT OUTER JOIN price_admin ON price_loadcentral.pcode = price_admin.pcode
							WHERE provider = %s """
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
				products = """ SELECT price_operators.description, price_operators.pcode, price_admin.price AS product_cost, 
							price_operators.price, price_operators.provider, price_loadcentral.status FROM price_operators
							LEFT OUTER JOIN price_admin ON price_admin.pcode = price_operators.pcode
							LEFT OUTER JOIN price_loadcentral ON price_loadcentral.pcode = price_operators.pcode
							WHERE operator = %s """
				cursor.execute(products, (operator,))
			else:
				products = """ SELECT price_operators.description, price_operators.pcode, price_admin.price AS product_cost, 
							price_operators.price, price_operators.provider, price_loadcentral.status FROM price_operators 
							LEFT OUTER JOIN price_admin ON price_admin.pcode = price_operators.pcode
							LEFT OUTER JOIN price_loadcentral ON price_loadcentral.pcode = price_operators.pcode
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
			cursor = conn.cursor(prepared = True)
		except:
			return 'Connection Unavailble DB error'

		set_price = """ UPDATE price_admin SET price = %s WHERE pcode = %s """
		_data = (price, pcode)

		try:
			float(price)
		except:
			return 'Failed, invalid value for price'

		cursor.execute(set_price, _data)
		conn.commit()
		cursor.close()
		conn.close()

		return 'Success, Price Successfully Updated'

	def SET_PRICE_OPERATOR(self, pcode, price, operator):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 			   database=self.dbname)
			cursor = conn.cursor(prepared = True)
		except:
			return 'Connection Unavailble DB error'

		try:
			float(price)
		except:
			return 'Failed, invalid value for price'

		# Check if pcode & operator exists
		query1 = """ SELECT operator, pcode FROM price_operators WHERE operator = %s """
		cursor.execute(query1, (operator,))
		res1 = cursor.fetchall()

		if len(res1) == 0:
			query2 = """ INSERT INTO price_operators(pcode, price, operator) VALUES(%s, %s, %s) """
			cursor.execute(query2, (pcode, price, operator))
		else:
			query3 = """ UPDATE price_operators SET pcode = %s, price = %s WHERE operator = %s AND pcode = %s """
			cursor.execute(query3, (pcode, price, operator, pcode))

		conn.commit()
		cursor.close()
		conn.close()

		return 'Success, Price Updated'

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

	def GET_PERIODIC_SALES(self, userType, user, period, mac):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 			   database=self.dbname)
			cursor = conn.cursor(prepared = True)
		except:
			return 'Connection Unavailble DB error'

		if mac == '':
			search_mac = ''
		else:
			search_mac = " AND mac=" + "'" + mac + "'"

		admin_daily = """ SELECT dateCreated, SUM(sale) AS sale, SUM(revenue) AS revenue FROM sales
						WHERE DAYOFYEAR(dateCreated) = DAYOFYEAR(NOW()) - %s AND user = 'admin' """ + search_mac
		admin_weekly = """ SELECT dateCreated, SUM(sale) AS sale, SUM(revenue) AS revenue FROM sales
						WHERE WEEKOFYEAR(dateCreated) = WEEKOFYEAR(NOW()) - %s AND user = 'admin' """ + search_mac
		admin_monthly = """ SELECT dateCreated, SUM(sale) AS sale, SUM(revenue) AS revenue FROM sales
						WHERE MONTH(dateCreated) = %s AND user = 'admin' """ + search_mac
		
		operator_daily = """ SELECT dateCreated, SUM(sale) AS sale, SUM(revenue) AS revenue FROM sales
							WHERE DAYOFYEAR(dateCreated) = DAYOFYEAR(NOW()) - %s AND user = %s """ + search_mac
		operator_weekly = """ SELECT dateCreated, SUM(sale) AS sale, SUM(revenue) AS revenue FROM sales
							WHERE WEEKOFYEAR(dateCreated) = WEEKOFYEAR(NOW()) - %s AND user = %s """ + search_mac
		operator_monthly = """ SELECT dateCreated, SUM(sale) AS sale, SUM(revenue) AS revenue FROM sales
							WHERE MONTH(dateCreated) = %s AND user = %s """ + search_mac

		arr = []
		if userType == 'admin':
			if period == 'daily':
				for x in range(16):
					cursor.execute(admin_daily, (x,))
					rows = cursor.fetchall()
					if rows[0][0] == None:
						arr.append((0,0,0))
					else:
						arr.append(rows[0])
			elif period == 'weekly':
				for x in range(4):
					cursor.execute(admin_weekly, (x,))
					rows = cursor.fetchall()
					if rows[0][0] == None:
						arr.append((0,0,0))
					else:
						arr.append(rows[0])
			elif period == 'monthly':
				for x in range(1,13):
					cursor.execute(admin_monthly, (x,))
					rows = cursor.fetchall()
					if rows[0][0] == None:
						arr.append((0,0,0))
					else:
						arr.append(rows[0])
			else:
				return 0

		elif userType == 'operator':
			if period == 'daily':
				for x in range(16):
					cursor.execute(operator_daily, (x, user))
					rows = cursor.fetchall()
					if rows[0][0] == None:
						arr.append((0,0,0))
					else:
						arr.append(rows[0])
			elif period == 'weekly':
				for x in range(4):
					cursor.execute(operator_weekly, (x, user))
					rows = cursor.fetchall()
					if rows[0][0] == None:
						arr.append((0,0,0))
					else:
						arr.append(rows[0])
			elif period == 'monthly':
				for x in range(1,13):
					cursor.execute(operator_monthly, (x, user))
					rows = cursor.fetchall()
					if rows[0][0] == None:
						arr.append((0,0,0))
					else:
						arr.append(rows[0])
			else:
				return 0

		else:
			return 0

		cursor.close()
		conn.close()

		return arr

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