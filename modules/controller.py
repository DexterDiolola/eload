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

	def count_mac_with_balance(self, userType, user):
		return proc.COUNT_MAC_WITH_BALANCE(userType, user)

	def get_remaining_load(self, userType, user):
		return proc.GET_REMAINING_LOAD(userType, user)

	def get_balance_each(self, userType, user):
		response = []
		if userType == None or user == None:
			return 0
		balance = proc.GET_BALANCE_EACH(userType, user)
		if balance == 0:
			return 0
		for x in range(len(balance)):
			obj = {
				'mac' :  balance[x][0],
				'site' : balance[x][1],
				'operator' : balance[x][2],
				'balance' : balance[x][3]
			}
			response.append(obj)
		return response

	def get_sales(self, userType, user, occ):
		response = []
		if userType == None or user == None:
			return 0
		sales = proc.GET_SALES(userType, user, occ)
		response.append({'sales' : sales})
		return response

	def get_earnings(self, userType, user, occ):
		response = []
		if userType == None or user == None:
			return 0
		earnings = proc.GET_EARNINGS(userType, user, occ)
		response.append({'earnings' : earnings})
		return response

	def get_transactions(self, userType, user, status, occ):
		response = []
		if userType == None or user == None or status == None:
			return 0
		transactions = proc.GET_TRANSACTIONS(userType, user, status, occ)
		response.append({'transactions' : transactions})
		return response

	def periodic_dates(self, period):
		response = []
		if period == None:
			return 0
		dates = proc.PERIODIC_DATES(period)
		for x in range(len(dates)):
			if period == 'daily':
				date = period_initiator(dates[x], period)
				obj = {
					'date' : date
				}
			elif period == 'weekly':
				date = period_initiator(dates[x], period)
				obj = {
					'date' : date
				}
			elif period == 'monthly':
				obj = {
					'date' : dates[x]
				}
			else:
				return 0
			response.append(obj)
		return response

	def get_periodic_balance(self, userType, user, period):
		response = []
		if userType == None or user == None or period == None:
			return 0
		balance = proc.GET_PERIODIC_BALANCE(userType, user, period)
		if balance == 0:
			return 0
		for x in range(len(balance)):
			obj = {
				'dateCreated' : balance[x][0],
				'balance' : balance[x][1]
			}
			response.append(obj)
		return response

	def search_periodic_balance(self, userType, user, period, mac):
		response = []
		if userType == None or user == None or period == None or mac == None:
			return 0
		balance = proc.SEARCH_PERIODIC_BALANCE(userType, user, period, mac)
		if balance == 0:
			return 0
		for x in range(len(balance)):
			obj = {
				'dateCreated' : balance[x][0],
				'balance' : balance[x][1]
			}
			response.append(obj)
		return response

	def get_periodic_deduction(self, userType, user, period):
		response = []
		if userType == None or user == None or period == None:
			return 0
		deduction = proc.GET_PERIODIC_DEDUCTION(userType, user, period)
		if deduction == 0:
			return 0
		for x in range(len(deduction)):
			obj = {
				'dateCreated' : deduction[x][0],
				'deduction' : deduction[x][1],
				'topup' : deduction[x][2]
			}
			response.append(obj)
		return response

	def search_periodic_deduction(self, userType, user, period, mac):
		response = []
		if userType == None or user == None or period == None or mac == None:
			return 0
		deduction = proc.SEARCH_PERIODIC_DEDUCTION(userType, user, period, mac)
		if deduction == 0:
			return 0
		for x in range(len(deduction)):
			obj = {
				'dateCreated' : deduction[x][0],
				'deduction' : deduction[x][1],
				'topup' : deduction[x][2]
			}
			response.append(obj)
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

	def search_periodic_transactions_all(self, userType, user, period, mac, opr, mob):
		response = []
		if userType == None or user == None or period == None:
			return 0
		search = {
			'mac' : mac,
			'operator' : opr,
			'mobileNum' : mob
		}
		transactions = proc.SEARCH_PERIODIC_TRANSACTIONS_ALL(userType, user, period, search)
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

	def search_periodic_transactions_success(self, userType, user, period, mac, opr, mob):
		response = []
		if userType == None or user == None or period == None:
			return 0
		search = {
			'mac' : mac,
			'operator' : opr,
			'mobileNum' : mob
		}
		transactions = proc.SEARCH_PERIODIC_TRANSACTIONS_SUCCESS(userType, user, period, search)
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

	def search_periodic_transactions_failed(self, userType, user, period, mac, opr, mob):
		response = []
		if userType == None or user == None or period == None:
			return 0
		search = {
			'mac' : mac,
			'operator' : opr,
			'mobileNum' : mob
		}
		transactions = proc.SEARCH_PERIODIC_TRANSACTIONS_FAILED(userType, user, period, search)
		if transactions == 0:
			return 0
		for x in range(len(transactions)):
			obj = {
				'dateCreated' : transactions[x][0],
				'transactions' : transactions[x][1]
			}
			response.append(obj)
		return response

	def get_transaction_logs(self, userType, user, occ):
		response = []
		if userType == None or user == None or occ == None:
			return 0
		logs = proc.GET_TRANSACTION_LOGS(userType, user, occ)
		if logs == 0:
			return 0
		for x in range(len(logs)):
			obj = {
				'dateCreated' : logs[x][0],
				'mac' : logs[x][1],
				'site' : logs[x][2],
				'operator' : logs[x][3],
				'userMac' : logs[x][4],
				'mobileNum' : logs[x][5],
				'productCode' : logs[x][6],
				'loadcentral_price' : logs[x][7],
				'admin_price' : logs[x][8],
				'operator_price' : logs[x][9],
				'service_charge' : logs[x][10],
				'admin_revenue' : logs[x][11],
				'opr_revenue' : logs[x][12],
				'admin_bal' : logs[x][13],
				'mac_bal' : logs[x][14],
				'provider' : logs[x][15],
				'status' : logs[x][16],
				'tid' : logs[x][17],
				'base_price' : logs[x][18],
				'response_code' : logs[x][19]
			}
			response.append(obj)
		return response

	def search_transaction_logs(self, userType, user, occ, mac, opr, mob):
		response = []
		if userType == None or user == None:
			return 0
		search = {
			'mac' : mac,
			'operator' : opr,
			'mobileNum' : mob
		}
		logs = proc.SEARCH_TRANSACTION_LOGS(userType, user, occ, search)
		if logs == 0:
			return 0
		for x in range(len(logs)):
			obj = {
				'dateCreated' : logs[x][0],
				'mac' : logs[x][1],
				'site' : logs[x][2],
				'operator' : logs[x][3],
				'userMac' : logs[x][4],
				'mobileNum' : logs[x][5],
				'productCode' : logs[x][6],
				'loadcentral_price' : logs[x][7],
				'admin_price' : logs[x][8],
				'operator_price' : logs[x][9],
				'service_charge' : logs[x][10],
				'admin_revenue' : logs[x][11],
				'opr_revenue' : logs[x][12],
				'admin_bal' : logs[x][13],
				'mac_bal' : logs[x][14],
				'provider' : logs[x][15],
				'status' : logs[x][16],
				'tid' : logs[x][17],
				'base_price' : logs[x][18],
				'response_code' : logs[x][19]
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

	def get_periodic_sales(self, userType, user, period, mac):
		response = []
		if userType == None or user == None or period == None or mac == None:
			return 0
		sales = proc.GET_PERIODIC_SALES(userType, user, period, mac)
		if sales == 0:
			return 0
		for x in range(len(sales)):
			obj = {
				'dateCreated' : sales[x][0],
				'sale' : sales[x][1],
				'revenue' : sales[x][2]
			}
			response.append(obj)

		return response

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

'''
def init_admin_periodic_earnings(param):
	for x in range(len(param)):
		idx = x + 1
		if idx == len(param):
			idx = len(param) - 1
		if int(param[x]['balance']) > int(param[idx]['balance']) :
'''		