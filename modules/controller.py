import pytz, datetime, re

from database import procedures
proc = procedures.Procedures()

# Most function must return a dictionary format
class Controller:
	def __init__(self):
		time_zone = pytz.timezone('Asia/Manila')
		self.time_now = str(datetime.datetime.now(time_zone))

	def add_trans(self, _dict, status):
		return proc.ADD_TRANS(_dict, status)

	def add_mac(self, mac):
		if mac == None or mac == '':
			return 0
		return proc.ADD_MAC(mac)

	def check_promo_status(self, pcode):
		return proc.CHECK_PROMO_STATUS(pcode)

	def check_mac_status(self, mac):
		return proc.CHECK_MAC_STATUS(mac)

	def get_mac_balance(self, mac):
		response = []
		if mac == None:
			return 0
		bal = proc.GET_MAC_BALANCE(mac)
		response.append({'balance' : bal})
		return response

	def get_balance(self, userType, user):
		response = []
		if userType == None or user == None:
			return 0
		balance = proc.GET_BALANCE(userType, user)
		response.append({'balance' : balance})
		return response

	def get_periodic_transactions_all(self, userType, user, period):
		response = []
		if userType == None or user == None or period == None:
			return 0
		transactions = proc.GET_PERIODIC_TRANSACTIONS_ALL(userType, user, period)
		if transactions == 0:
			return 0
		for x in range(len(transactions)):
			obj = {
				'dateCreated' : transactions[x][0],
				'transactions' : transactions[x][1]
			}
			response.append(obj)
		return response

	def get_periodic_transactions_success(self, userType, user, period):
		response = []
		if userType == None or user == None or period == None:
			return 0
		transactions = proc.GET_PERIODIC_TRANSACTIONS_SUCCESS(userType, user, period)
		if transactions == 0:
			return 0
		for x in range(len(transactions)):
			obj = {
				'dateCreated' : transactions[x][0],
				'transactions' : transactions[x][1]
			}
			response.append(obj)
		return response

	def get_periodic_transactions_failed(self, userType, user, period):
		response = []
		if userType == None or user == None or period == None:
			return 0
		transactions = proc.GET_PERIODIC_TRANSACTIONS_FAILED(userType, user, period)
		if transactions == 0:
			return 0
		for x in range(len(transactions)):
			obj = {
				'dateCreated' : transactions[x][0],
				'transactions' : transactions[x][1]
			}
			response.append(obj)
		return response

	def get_macs_list(self, userType, user):
		response = []
		macs = proc.GET_MACS_LIST(userType, user)
		if macs == 0:
			return 0
		for x in range(len(macs)):
			obj = {
				'dateCreated' : str(macs[x][0]),
				'mac' : macs[x][1],
				'site' : macs[x][2],
				'operator' : macs[x][3],
				'dateUpdated' : str(macs[x][4]),
				'balance' : macs[x][5],
				'status' : macs[x][6]
			}
			response.append(obj)
		return response

	def get_operators_list(self):
		response = []
		operators = proc.GET_OPERATORS_LIST()
		if operators == 0:
			return 0
		for x in range(len(operators)):
			obj = {
				'dateCreated' : operators[x][0],
				'operator' : operators[x][1],
				'partner' : operators[x][2],
				'dateUpdated' : operators[x][3],
				'balance' : operators[x][4],
				'status' : operators[x][5]
			}
			response.append(obj)
		return response

	def get_partners_list(self):
		response = []
		partners = proc.GET_PARTNERS_LIST()
		if partners == 0:
			return 0
		for x in range(len(partners)):
			obj = {
				'dateCreated' : partners[x][0],
				'partner' : partners[x][1],
				'dateUpdated' : partners[x][2]
			}
			response.append(obj)
		return response

	def assign_macs(self, site, operator, mac):
		return proc.ASSIGN_MACS(site, operator, mac)

	def assign_operators(self, partner, operator):
		return proc.ASSIGN_OPERATORS(partner, operator)

	def add_topup(self, mac, topup):
		return proc.ADD_TOPUP(mac, topup)

	def check_balance(self, username, mac):
		balance = proc.CHECK_BALANCE(username, mac)
		if balance == 'None':
			return 'Failed, not existing account'
		else:
			return 'Balance, ' + '%.2f'%float(balance)

	def get_operator_balance(self, operator):
		return proc.GET_OPERATOR_BALANCE(operator)

	def topup_operator(self, operator, topup):
		return proc.TOPUP_OPERATOR(operator, topup)

	def topup_operator_mac(self, operator, mac, topup):
		return proc.TOPUP_OPERATOR_MAC(operator, mac, topup)

	def topup_history(self, operator, occ, mac):
		response = []
		history = proc.TOPUP_HISTORY(operator, occ, mac)
		if history == 0:
			return 0
		for x in range(len(history)):
			obj = {
				'operator' : history[x][0],
				'mac' : history[x][1],
				'topup' : history[x][2],
				'dateCreated' : history[x][3]
			}
			response.append(obj)
		return response

	def inquire_rate(self, operator, mac):
		response = []
		rate = proc.INQUIRE_RATE(operator, mac)
		for x in range(len(rate)):
			obj = {
				'pcode' : rate[x][0],
				'price' : rate[x][1]
			}
			response.append(obj)
		if operator == None and mac != None:
			return 'dataresponse(' + str(response) + ')'
		return response

	def get_products(self, provider, operator):
		response = []
		if provider == None:
			return 0
		products = proc.GET_PRODUCTS(provider, operator)
		for x in range(len(products)):
			obj = {
				'description' : products[x][0],
				'pcode' : products[x][1],
				'product_cost' : products[x][2],
				'price' : products[x][3],
				'provider' : products[x][4],
				'status' : products[x][5]
			}
			response.append(obj)
		return response
	
	def set_price_admin(self, pcode, price):
		return proc.SET_PRICE_ADMIN(pcode, price)

	def set_price_operator(self, pcode, price, operator):
		return proc.SET_PRICE_OPERATOR(pcode, price, operator)

	# Do something with this
	def get_product_price(self, pcode, mac):
		price = proc.GET_PRODUCT_PRICE(pcode, mac)
		if price == '0':
			return '0'
		else:
			return price

	def set_promo_status(self, pcode, status):
		return proc.SET_PROMO_STATUS(pcode, status)

	def set_status(self, opr, mac, status):
		return proc.SET_STATUS(opr, mac, status)

	def reset_password(self, user):
		return proc.RESET_PASSWORD(user)

	def change_password(self, user, pword, new_pass):
		return proc.CHANGE_PASSWORD(user, pword, new_pass)

	def get_notifications(self, user, status):
		response = []
		notifications = proc.GET_NOTIFICATIONS(user, status)
		if notifications == 0:
			return 0
		for x in range(len(notifications)):
			obj = {
				'id' : notifications[x][0],
				'user' : notifications[x][1],
				'operator' : notifications[x][2],
				'mac' : notifications[x][3],
				'notification' : notifications[x][4],
				'status' : notifications[x][5],
				'dateCreated' : notifications[x][6]
			}
			response.append(obj)

		return response

	def clear_notifications(self, clr, opr):
		return proc.CLEAR_NOTIFICATIONS(clr, opr)

	def init_service_charge(self, cond, opr, scharge):
		return proc.INIT_SERVICE_CHARGE(cond, opr, scharge)


def period_initiator(param, period):
	months = ['', 'Jan', 'Feb', 'March', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
	
	extract_month = param[0].split('-')
	day = extract_month[2].split(' ')
	day = day[0]
	year = extract_month[0]
	extracted_month = extract_month[1]
	
	if extracted_month == '01':	
		month = months[1]
	elif extracted_month == '02':
		month = months[2]
	elif extracted_month == '03':
		month = months[3]
	elif extracted_month == '04':
		month = months[4]
	elif extracted_month == '05':
		month = months[5]
	elif extracted_month == '06':
		month = months[6]
	elif extracted_month == '07':
		month = months[7]
	elif extracted_month == '08':
		month = months[8]
	elif extracted_month == '09':
		month = months[9]
	elif extracted_month == '10':
		month = months[10]
	elif extracted_month == '11':
		month = months[11]
	elif extracted_month == '12':
		month = months[12]
	
	if period == 'daily' or period == 'weekly':
		date = month + '-' + day + '-' + year
		return date
	elif period == 'monthly':
		return month
	else:
		return None