import random, json, jwt, logging

from flask import Flask, request, flash, render_template, redirect, url_for, session, make_response
from functools import wraps
from modules import authenticates, controller, transactions, files, encryption, recovery
from database import procedures

from logs.log_conf import Logger

app = Flask(__name__)
app.secret_key = 'KEY' + ''.join(random.choice('1234567890') for i in range(10))

trans = transactions.Transactions({'uid' : 'api_dealer04', 'pword' : 'apitest1234'})
auth = authenticates.Authenticates()
controller = controller.Controller()
files = files.Files()
encBase64 = encryption.EncStyleBase64()
rec = recovery.AccountRecovery()
proc = procedures.Procedures()

logging.basicConfig()
log = logging.getLogger(__name__)

# /---------- TRANSACTIONS TAKES PLACE ----------/

# API Routes
@app.route('/getLoad')
def getLoad():
	routerMac = request.args.get('routerMac')
	userMac = request.args.get('userMac')
	mobileNum = request.args.get('mobileNum')
	denom = request.args.get('denomination')
	price = request.args.get('price') # optional query parameter

	response = trans.proc_client_request({'routerMac' : routerMac, 'userMac' : userMac, 
			   'mobileNum' : mobileNum, 'denomination' : denom, 'type' : '', 'price' : price})
	return response

@app.route('/msgInfo')
def msgInfo():
	# routerMac = request.args.get('routerMac')
	# userMac = request.args.get('userMac')
	# mobileNum = request.args.get('mobileNum')
	# denom = request.args.get('denomination')
	# data = '2019-07-04 : 03:32:00,' + routerMac + ',' + userMac + ',' + mobileNum + ',' + denom
	
	# encrypted = trans.encryptLoadData('r3m0teSec', data)
	info = request.args.get('info')

	decrypted = trans.decryptLoadData('r3m0teSec', info)
	parse = trans.parseDecryptedData(decrypted)
	
	if decrypted == 'Transaction Failed' or parse == 'Transaction Failed':
		return 'Failed, transaction failed'
	
	return trans.proc_client_request(parse)

@app.route('/msgInfo2')
def msgInfo2():
	info = request.args.get('info')

	decrypted = trans.decryptLoadData('D3fault@s3curityprofil3', info)
	parse = trans.parseDecryptedData(decrypted)

	if decrypted == 'Transaction Failed' or parse == 'Transaction Failed':
		return 'Failed, transaction failed'

	return trans.proc_client_request(parse)

@app.route('/activate')
def activate():
	info = request.args.get('info')
	decrypted = encBase64.decryptData(encBase64.key1, info)
	if decrypted == 'Error 101':	return encBase64.encryptData(encBase64.key1, 'Failed, Error 101').decode()
	obj = encBase64.actParseDecryptedData(decrypted)
	if obj == 'Error 102':	return encBase64.encryptData(encBase64.key1, 'Failed, Error 102').decode()
	obj = encBase64.extractPassword(encBase64.key2, obj)
	if obj == 'Error 103':	return encBase64.encryptData(encBase64.key1, 'Failed, Error 103').decode()
	info = encBase64.giveTheKey(encBase64.key1, obj)
	if info == 'Error 104':	return encBase64.encryptData(encBase64.key1, 'Failed, Error 104').decode()
	return str(info)

@app.route('/activateShare')
def activateShare():
	info = request.args.get('info')
	decrypted = encBase64.decryptData(encBase64.internal_key1, info)
	if decrypted == 'Error 101':	return encBase64.encryptData(encBase64.internal_key1, 'Failed, Error 101').decode()
	obj = encBase64.actParseDecryptedData(decrypted)
	if obj == 'Error 102':	return encBase64.encryptData(encBase64.internal_key1, 'Failed, Error 102').decode()
	obj = encBase64.extractPassword(encBase64.internal_key2, obj)
	if obj == 'Error 103':	return encBase64.encryptData(encBase64.internal_key1, 'Failed, Error 103').decode()
	info = encBase64.giveTheKey(encBase64.internal_key1, obj)
	if info == 'Error 104':	return encBase64.encryptData(encBase64.internal_key1, 'Failed, Error 104').decode()
	return str(info)


@app.route('/deactivate')
def deactivate():
	info = request.args.get('info')
	decrypted = encBase64.decryptData(encBase64.key1, info)
	if decrypted == 'Error 101':	return 'Failed, Error 101'
	obj = encBase64.actParseDecryptedData(decrypted)
	if obj == 'Error 102':	return 'Failed, Error 102'
	obj = encBase64.extractPassword(obj)
	if obj == 'Error 103':	return 'Failed, Error 103'
	info = encBase64.deactivateMac(obj)
	if info == 'Error 106':	return 'Failed, Error 106'
	return str(info)


@app.route('/msgInfo3')
def msgInfo3():
	info = request.args.get('info')
	obj = encBase64.validateTransReq(encBase64.key1, info)
	if obj == 'Error 105':
		return 'Failed, transaction failed'
	return trans.proc_client_request(obj)

@app.route('/getManualLoadShare')
def getManualLoadShare():
	info = request.args.get('info')
	obj = encBase64.validateTransReq(encBase64.internal_key1, info)
	if obj == 'Error 105':
		return 'Failed, transaction failed'
	return trans.proc_client_request(obj)


@app.route('/encrypt')
def encrpyt():
	string = request.args.get('string')
	encrypted = trans.encryptLoadData('r3m0teSec', string)
	return str(encrypted.decode())

@app.route('/encrypt2')
def encrpyt2():
	string = request.args.get('string')
	encrypted = trans.encryptLoadData('D3fault@s3curityprofil3', string)
	return str(encrypted.decode())

@app.route('/encrypt3')
def encrpyt3():
	string = request.args.get('string')
	key = request.args.get('key')
	if key == 'key1':
		encrypted = encBase64.encryptData(encBase64.key1, string)
	elif key == 'key2':
		encrypted = encBase64.encryptData(encBase64.key2, string)
	elif key == 'internal_key1':
		encrypted = encBase64.encryptData(encBase64.internal_key1, string)
	else:
		encrypted = encBase64.encryptData(encBase64.internal_key2, string)
	
	return str(encrypted.decode())

@app.route('/decrypt')
def decrypt():
	string = request.args.get('string')
	decrypted = trans.decryptStr('r3m0teSec', string)
	return str(decrypted)

@app.route('/decrypt2')
def decrypt2():
	string = request.args.get('string')
	decrypted = trans.decryptStr('D3fault@s3curityprofil3', string)
	return str(decrypted)

@app.route('/decrypt3')
def decrypt3():
	string = request.args.get('string')
	key = request.args.get('key')

	if key == 'key1':
		decrypted = encBase64.decryptData(encBase64.key1, string)
	else:
		decrypted = encBase64.decryptData(encBase64.internal_key1, string)

	return decrypted

@app.route('/check-balance')
def check_balance():
	username = request.args.get('username')
	mac = request.args.get('mac')

	balance = controller.check_balance(username, mac)
	return balance

@app.route('/inquire-rate')
def inquire_rate():
	operator = request.args.get('operator')
	mac = request.args.get('mac')
	data = controller.inquire_rate(operator, mac)

	if operator == None and mac != None:
		return data
	
	response = app.response_class(
		response = json.dumps(data),
		status = 200,
		mimetype = 'application/json'
	)
	return response

@app.route('/addManualLoad')
def addManualLoad():
	routerMac = request.args.get('routerMac')
	userMac = request.args.get('userMac')
	mobileNum = request.args.get('mobileNum')
	denom = request.args.get('denom')
	price = request.args.get('price')

	arr = [routerMac, userMac, mobileNum, denom, price]
	return proc.addManualLoad(arr)

@app.route('/addManualLoad2')
def addManualLoad2():
	routerMac = request.args.get('routerMac')
	userMac = request.args.get('userMac')
	mobileNum = request.args.get('mobileNum')
	denom = request.args.get('denom')
	price = request.args.get('price')

	arr = [routerMac, userMac, mobileNum, denom, price]
	data = proc.addManualLoad(arr)
	data = [{'status' : data}]

	return 'dataresponse(' + str(data) + ')'


@app.route('/getManualLoad')
def getManualLoad():
	routerMac = request.args.get('routerMac')
	data = proc.getManualLoad(routerMac)
	response = app.response_class(
		response = json.dumps(data),
		status = 200,
		mimetype = 'application/json'
	)
	return response

@app.route('/deleteManualLoad')
def deleteManualLoad():
	routerMac = request.args.get('routerMac')
	userMac = request.args.get('userMac')
	mobileNum = request.args.get('mobileNum')
	denom = request.args.get('denom')

	arr = [routerMac, userMac, mobileNum, denom]
	return proc.deleteManualLoad(arr)

@app.route('/getReport')
def getReport():
	routerMac = request.args.get('routerMac')
	data = proc.getReport(routerMac)
	response = app.response_class(
		response = json.dumps(data),
		status = 200,
		mimetype = 'application/json'
	)
	return response

@app.route('/api/adminMainDetails')
def adminMainDetails():
	cond = request.args.get('cond')
	startDate = request.args.get('startDate')
	endDate = request.args.get('endDate')

	data = proc.adminMainDetails(cond, startDate, endDate)
	response = app.response_class(
		response = json.dumps(data),
		status = 200,
		mimetype = 'application/json'
	)
	return response

@app.route('/api/adminMainDetailsEach')
def adminMainDetailsEach():
	cond = request.args.get('cond')
	startDate = request.args.get('startDate')
	endDate = request.args.get('endDate')
	mac = request.args.get('mac')

	data = proc.adminMainDetailsEach(cond, startDate, endDate, mac)
	response = app.response_class(
		response = json.dumps(data),
		status = 200,
		mimetype = 'application/json'
	)
	return response

@app.route('/api/oprMainDetails')
def oprMainDetails():
	cond = request.args.get('cond')
	startDate = request.args.get('startDate')
	endDate = request.args.get('endDate')
	opr = request.args.get('opr')

	data = proc.oprMainDetails(cond, startDate, endDate, opr)
	response = app.response_class(
		response = json.dumps(data),
		status = 200,
		mimetype = 'application/json'
	)
	return response

@app.route('/api/oprMainDetailsEach')
def oprMainDetailsEach():
	cond = request.args.get('cond')
	startDate = request.args.get('startDate')
	endDate = request.args.get('endDate')
	opr = request.args.get('opr')
	mac = request.args.get('mac')

	data = proc.oprMainDetailsEach(cond, startDate, endDate, opr, mac)
	response = app.response_class(
		response = json.dumps(data),
		status = 200,
		mimetype = 'application/json'
	)
	return response

@app.route('/api/downloadTransactionLogs')
def downloadTransactionLogs():
	userType = request.args.get('userType')
	startDate = request.args.get('startDate')
	endDate = request.args.get('endDate')
	opr = request.args.get('opr')
	mac = request.args.get('mac')

	if userType == None or startDate == None or endDate == None or opr == None or mac == None:
		return 0

	transaction_logs = files.initTransactionLogs(userType, startDate, endDate, opr, mac)
	return files.downloadTransactionLogs(transaction_logs, userType, opr, startDate, endDate)














@app.route('/api/get-periodic-transactions-all')
def get_periodic_transactions_all():
	userType = request.args.get('userType')
	user = request.args.get('user')
	period = request.args.get('period')
	data = controller.get_periodic_transactions_all(userType, user, period)
	response = app.response_class(
		response = json.dumps(data),
		status = 200,
		mimetype = 'application/json'
	)
	return response

@app.route('/api/get-periodic-transactions-success')
def get_periodic_transactions_success():
	userType = request.args.get('userType')
	user = request.args.get('user')
	period = request.args.get('period')
	data = controller.get_periodic_transactions_success(userType, user, period)
	response = app.response_class(
		response = json.dumps(data),
		status = 200,
		mimetype = 'application/json'
	)
	return response

@app.route('/api/get-periodic-transactions-failed')
def get_periodic_transactions_failed():
	userType = request.args.get('userType')
	user = request.args.get('user')
	period = request.args.get('period')
	data = controller.get_periodic_transactions_failed(userType, user, period)
	response = app.response_class(
		response = json.dumps(data),
		status = 200,
		mimetype = 'application/json'
	)
	return response

@app.route('/api/get-macs-list')
def get_macs_list():
	userType = request.args.get('userType')
	user = request.args.get('user')
	data = controller.get_macs_list(userType, user)
	response = app.response_class(
		response = json.dumps(data),
		status = 200,
		mimetype = 'application/json'
	)
	return response

@app.route('/api/get-operators-list')
def get_operators_list():
	data = controller.get_operators_list()
	response = app.response_class(
		response = json.dumps(data),
		status = 200,
		mimetype = 'application/json'
	)
	return response

@app.route('/api/get-partners-list')
def get_partners_list():
	data = controller.get_partners_list()
	response = app.response_class(
		response = json.dumps(data),
		status = 200,
		mimetype = 'application/json'
	)
	return response

@app.route('/api/assign-macs', methods = ['POST'])
def assign_macs():
	site = request.args.get('site')
	operator = request.args.get('operator')
	mac = request.args.get('mac')

	assign = controller.assign_macs(site, operator, mac)

	return 'Successfully Assigned'

@app.route('/api/assign-operators', methods = ['POST'])
def assign_operators():
	partner = request.args.get('partner')
	operator = request.args.get('operator')

	assign = controller.assign_operators(partner, operator)

	return 'Successfully Assigned'

@app.route('/api/add-topup', methods = ['POST'])
def add_topup():
	mac = request.args.get('mac')
	topup = request.args.get('topup')

	add_topup = controller.add_topup(mac, topup)

	return 'Successfully Topped Up'



@app.route('/api/get-operator-balance')
def get_operator_balance():
	operator = request.args.get('operator')
	data = controller.get_operator_balance(operator)
	response = app.response_class(
		response = data,
		status = 200,
		mimetype = 'text/html'
	)
	return response

@app.route('/api/topup-operator', methods = ['POST'])
def topup_operator():
	operator = request.args.get('operator')
	topup = request.args.get('topup')

	add_topup = controller.topup_operator(operator, topup)

	return 'Successfully Topped Up'

@app.route('/api/topup-operator-mac', methods = ['POST'])
def topup_operator_mac():
	operator = request.args.get('operator')
	mac = request.args.get('mac')
	topup = request.args.get('topup')

	return controller.topup_operator_mac(operator, mac, topup)

@app.route('/api/topup-history')
def topup_history():
	operator = request.args.get('operator')
	occ = request.args.get('occ')
	mac = request.args.get('mac')
	data = controller.topup_history(operator, occ, mac)
	response = app.response_class(
		response = json.dumps(data),
		status = 200,
		mimetype = 'application/json'
	)
	return response



@app.route('/api/get-products')
def get_products():
	provider = request.args.get('provider')
	operator = request.args.get('operator')
	data = controller.get_products(provider, operator)
	response = app.response_class(
		response = json.dumps(data),
		status = 200,
		mimetype = 'application/json'
	)
	return response

@app.route('/api/set-price-admin', methods = ['POST'])
def set_price_admin():
	pcode = request.args.get('pcode')
	price = request.args.get('price')

	if pcode == '' or price == '':
		return 'Failed, Invalid parameter value'

	set_price = controller.set_price_admin(pcode, price)
	return set_price

@app.route('/api/set-price-operator')
def set_price_operator():
	pcode = request.args.get('pcode')
	price = request.args.get('price')
	operator = request.args.get('operator')

	if pcode == '' or price == '' or operator == '':
		return 'Failed, Invalid parameter value'

	set_price = controller.set_price_operator(pcode, price, operator)
	return set_price

@app.route('/api/set-promo-status')
def set_promo_status():
	pcode = request.args.get('pcode')
	status = request.args.get('status')

	return controller.set_promo_status(pcode, status)

@app.route('/api/set-status')
def set_status():
	opr = request.args.get('opr')
	mac = request.args.get('mac')
	status = request.args.get('status')

	return controller.set_status(opr, mac, status)

@app.route('/api/reset-password')
def reset_password():
	user = request.args.get('user')
	return controller.reset_password(user)

@app.route('/api/change-password')
def change_password():
	user = request.args.get('user')
	pword = request.args.get('pword')
	new_pass = request.args.get('new_pass')

	return controller.change_password(user, pword, new_pass)

@app.route('/api/change_email')
def changeEmail():
	user = request.args.get('user')
	email = request.args.get('email')

	return rec.changeEmail(user, email)

@app.route('/api/get-notifications')
def get_notifications():
	user = request.args.get('user')
	status = request.args.get('status')

	data = controller.get_notifications(user, status)
	response = app.response_class(
		response = json.dumps(data),
		status = 200,
		mimetype = 'application/json'
	)
	return response

@app.route('/api/clear-notifications')
def clear_notifications():
	clr = request.args.get('clr')
	opr = request.args.get('opr')

	return controller.clear_notifications(clr, opr)

@app.route('/api/init-service-charge')
def init_service_charge():
	cond = request.args.get('cond')
	opr = request.args.get('opr')
	scharge = request.args.get('scharge')

	return controller.init_service_charge(cond, opr, scharge)


''' /---------- REPORTS AUTHENTICATION TAKES PLACE ----------/ '''

def adminMiddleware(a):
	@wraps(a)
	def decorator(*args, **kwargs):
		try:
			admin = session['admin']	# admin variable contains the value of session that has been created after the login
			flash(admin)
		except:
			return redirect(url_for('adminLogin'))	# If there is no session created, redirect to login page
		return a(*args, **kwargs)	# the current return of function that is overriden
	return decorator

def operatorMiddleware(o):
	@wraps(o)
	def decorator(*args, **kwargs):
		try:
			operator = session['operator']
			flash(operator)
		except:
			cur_url = request.url_rule
			if 'operator' in cur_url.rule:
				return redirect('/operator/login')
			else:
				return redirect('/eload/login')
		return o(*args, **kwargs)
	return decorator

def partnerMiddleware(p):
	@wraps(p)
	def decorator(*args, **kwargs):
		try:
			partner = session['partner']
			flash(partner)
		except:
			return redirect(url_for('partnerLogin'))
		return p(*args, **kwargs)
	return decorator


@app.route('/xxx')
def xxx():
	return render_template('index.html')

		
@app.route('/admin/login', methods = ['GET', 'POST'])
def adminLogin():
	error = None
	if request.method == 'POST':
		uname = request.form['username']
		pword = request.form['password']
		validate_pass = auth.checkPassword(uname, pword, 'admin')
		if validate_pass != 'Success':
			error = 'Invalid Username or Password'
		else:
			session['admin'] = uname
			return redirect(url_for('adminHome'))

	response = make_response(render_template('login.html', error = error))
	response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0, max-age=0'
	response.headers['Pragma'] = 'no-cache'
	
	return response

@app.route('/admin/logout', methods = ['POST'])
def adminLogout():
	session.pop('admin', None)
	return redirect(url_for('adminLogin'))

@app.route('/admin/register', methods = ['GET', 'POST'])
@adminMiddleware
def adminRegister():
	error = None
	if request.method == 'POST':
		if request.form['username'] == '' or request.form['password'] == '' or request.form['email'] == '':
			error = 'Please Complete Fields'
		elif request.form['username'].isalnum() == False:
			error = 'Username must alphanumeric characters only'
		elif request.form['email'] != request.form['vemail']:
			error = 'Email address not matched'
		elif request.form['password'] != request.form['vpassword']:
			error = 'Password not matched'
		else:
			addNewUser = auth.addUser(request.form['username'], request.form['email'],
				request.form['password'], 'Admin')
			if addNewUser == 0:
				error = 'Failed, username already exists'
			elif addNewUser == 1:
				error = 'Failed, email is already in use'
			elif addNewUser == 2:
				error = 'The email you entered is invalid'
			else:
				return redirect(url_for('adminLogin'))
	return render_template('register.html', error = error)

@app.route('/admin/home')
@adminMiddleware
def adminHome():
	return render_template('reports-admin.html')

@app.route('/admin/administration')
@adminMiddleware
def administration():
	return render_template('reports-admin.html')

@app.route('/admin/load_wallet')
@adminMiddleware
def topup():
	return render_template('reports-admin.html')

@app.route('/admin/load_wallet/macs')
@adminMiddleware
def topupEach():
	return render_template('reports-admin.html')

@app.route('/admin/products_services')
@adminMiddleware
def adminProdServ():
	return render_template('reports-admin.html')

@app.route('/admin/news_ads')
@adminMiddleware
def adminNewsAds():
	return render_template('reports-admin.html')

@app.route('/admin/settings')
@adminMiddleware
def adminSettings():
	return render_template('reports-admin.html')

@app.route('/admin/reports')
@adminMiddleware
def adminReports():
	return render_template('reports-admin.html')

@app.route('/admin/reports/macs')
@adminMiddleware
def adminReportsEach():
	return render_template('reports-admin.html')

@app.route('/admin/reports/operators')
@adminMiddleware
def adminReportsOpr():
	return render_template('reports-admin.html')

@app.route('/admin/download_prices', methods = ['GET'])
@adminMiddleware
def downloadPrices():
	return files.downloadCsvPrices()

@app.route('/admin/upload_prices', methods = ['POST'])
@adminMiddleware
def uploadPrices():
	uploaded = files.uploadCsvPrices()
	return redirect('/admin/products_services?msg=' + uploaded)

@app.route('/admin/upload_for_carousel', methods = ['POST'])
@adminMiddleware
def uploadForCarousel():
	uploaded = files.uploadForCarousel()
	return redirect('/admin/settings?msg=' + uploaded)





@app.route('/operator/login', methods = ['GET', 'POST'])
@app.route('/eload/login', methods = ['GET', 'POST'])
def operatorLogin():
	error = None
	cur_url = request.url_rule
	if request.method == 'POST':
		uname = request.form['username']
		pword = request.form['password']
		validate_pass = auth.checkPassword(uname, pword, 'operator')
		if validate_pass != 'Success':
			error = 'Invalid Username or Password'
		else:
			session['operator'] = uname
			flash(uname)
			if 'operator' in cur_url.rule:
				return redirect('/operator/home')
			else:
				return redirect('/eload/home')
	return render_template('login-operator.html', error = error)

@app.route('/operator/logout', methods = ['POST'])
@app.route('/eload/logout', methods = ['POST'])
def operatorLogout():
	cur_url = request.url_rule
	session.pop('operator', None)
	if 'operator' in cur_url.rule:
		return redirect('/operator/login')
	else:
		return redirect('/eload/login')

@app.route('/operator/register', methods = ['GET', 'POST'])
@app.route('/eload/register', methods = ['GET', 'POST'])
def operatorRegister():
	error = None
	cur_url = request.url_rule
	if request.method == 'POST':
		if request.form['username'] == '' or request.form['password'] == '' or request.form['email'] == '':
			error = 'Please Complete Fields'
		elif request.form['username'].isalnum() == False:
			error = 'Username must alphanumeric characters only'
		elif request.form['email'] != request.form['vemail']:
			error = 'Email address not matched'
		elif request.form['password'] != request.form['vpassword']:
			error = 'Password Did not Match'
		else:
			addNewUser = auth.addUser(request.form['username'], request.form['email'],
				request.form['password'], 'Operator')
			if addNewUser == 0:
				error = 'Failed, username already exists'
			elif addNewUser == 1:
				error = 'Failed, email is already in use'
			elif addNewUser == 2:
				error = 'The email you entered is invalid'
			else:
				if 'operator' in cur_url.rule:
					return redirect('/operator/login')
				else:
					return redirect('/eload/login')
	return render_template('register.html', error = error)

@app.route('/operator/home')
@app.route('/eload/home')
@operatorMiddleware
def operatorHome():
	cur_url = request.url_rule
	if 'operator' in cur_url.rule:
		return render_template('reports-operator.html')
	else:
		return render_template('reports_wizher_users.html')

@app.route('/operator/load_wallet')
@app.route('/eload/load_wallet')
@operatorMiddleware
def operatorTopup():
	cur_url = request.url_rule
	if 'operator' in cur_url.rule:
		return render_template('reports-operator.html')
	else:
		return render_template('reports_wizher_users.html')

@app.route('/operator/load_wallet/macs')
@app.route('/eload/load_wallet/macs')
@operatorMiddleware
def operatorTopupEach():
	cur_url = request.url_rule
	if 'operator' in cur_url.rule:
		return render_template('reports-operator.html')
	else:
		return render_template('reports_wizher_users.html')

@app.route('/operator/products_services')
@app.route('/eload/products_services')
@operatorMiddleware
def operatorProdServ():
	cur_url = request.url_rule
	if 'operator' in cur_url.rule:
		return render_template('reports-operator.html')
	else:
		return render_template('reports_wizher_users.html')

@app.route('/operator/news_ads')
@app.route('/eload/news_ads')
@operatorMiddleware
def operatorNewsAds():
	cur_url = request.url_rule
	if 'operator' in cur_url.rule:
		return render_template('reports-operator.html')
	else:
		return render_template('reports_wizher_users.html')

@app.route('/operator/settings')
@app.route('/eload/settings')
@operatorMiddleware
def operatorSettings():
	cur_url = request.url_rule
	if 'operator' in cur_url.rule:
		return render_template('reports-operator.html')
	else:
		return render_template('reports_wizher_users.html')

@app.route('/operator/reports')
@app.route('/eload/reports')
@operatorMiddleware
def operatorReports():
	cur_url = request.url_rule
	if 'operator' in cur_url.rule:
		return render_template('reports-operator.html')
	else:
		return render_template('reports_wizher_users.html')

@app.route('/operator/reports/macs')
@app.route('/eload/reports/macs')
@operatorMiddleware
def operatorReportsEach():
	cur_url = request.url_rule
	if 'operator' in cur_url.rule:
		return render_template('reports-operator.html')
	else:
		return render_template('reports_wizher_users.html')

@app.route('/operator/upload_prices', methods = ['POST'])
@app.route('/eload/upload_prices', methods = ['POST'])
@operatorMiddleware
def uploadPricesOpr():
	cur_url = request.url_rule
	uploaded = files.uplodCsvPricesOpr()
	if 'operator' in cur_url.rule:
		return redirect('/operator/products_services?msg=' + uploaded)
	else:
		return redirect('/eload/products_services?msg=' + uploaded)

@app.route('/operator/download_prices', methods = ['GET'])
@operatorMiddleware
def downloadPricesOpr():
	return files.downloadCsvPricesOpr()


# ACOUNT RECOVERY SECTION
@app.route('/admin/recover_s1', methods = ['GET', 'POST'])
def admin_account_recovery():
	error = None	
	if request.method == 'POST':
		email = request.form['email']
		findAccount = rec.findAccount(email)
		if email == '':
			error = 'Please Complete Fields'
		elif findAccount == False:
			error = 'The account associated with this email is not found.'
		else:
			vcode = rec.createVerificationCode()
			session['rec_username'] = findAccount
			session['rec_vcode'] = vcode
			rec.sendVerficationCode(email, vcode)
			return redirect('/admin/recover_s2')
	return render_template('recovery-step1.html', error = error)

@app.route('/operator/recover_s1', methods = ['GET', 'POST'])
def operator_account_recovery():
	error = None	
	if request.method == 'POST':
		email = request.form['email']
		findAccount = rec.findAccount(email)
		if email == '':
			error = 'Please Complete Fields'
		elif findAccount == False:
			error = 'The account associated with this email is not found.'
		else:
			vcode = rec.createVerificationCode()
			session['rec_username'] = findAccount
			session['rec_vcode'] = vcode
			rec.sendVerficationCode(email, vcode)
			return redirect('/operator/recover_s2')
	return render_template('recovery-step1.html', error = error)

@app.route('/admin/recover_s2', methods = ['GET', 'POST'])
def admin_account_recovery_s2():
	try:
		rec_username = session['rec_username']
		rec_vcode = session['rec_vcode']
	except:
		return redirect(url_for('adminLogin'))

	error = None
	if request.method == 'POST':
		vcode = request.form['vcode']
		if vcode == '':
			error = 'Please Enter Your Code.'
		elif vcode != rec_vcode:
			error = 'Verification Code is Invalid.'
		else:
			session['vcode_matched'] = '200'
			return redirect('/admin/recover_s3')
	return render_template('recovery-step2.html', error = error)

@app.route('/operator/recover_s2', methods = ['GET', 'POST'])
def operator_account_recovery_s2():
	try:
		rec_username = session['rec_username']
		rec_vcode = session['rec_vcode']
	except:
		return redirect(url_for('operatorLogin'))

	error = None
	if request.method == 'POST':
		vcode = request.form['vcode']
		if vcode == '':
			error = 'Please Enter Your Code.'
		elif vcode != rec_vcode:
			error = 'Verification Code is Invalid.'
		else:
			session['vcode_matched'] = '200'
			return redirect('/operator/recover_s3')
	return render_template('recovery-step2.html', error = error)


@app.route('/admin/recover_s3', methods = ['GET', 'POST'])
def admin_account_recovery_s3():
	try:
		vcode_matched = session['vcode_matched']
	except:
		return redirect(url_for('adminLogin'))

	error = None
	if request.method == 'POST':
		new_pass = request.form['new_password']
		verify_pass = request.form['verify_password']
		if new_pass == '' or verify_pass == '':
			error = 'Please Complete Fields'
		elif new_pass != verify_pass:
			error = 'Password not matched'
		else:
			rec.changePassword(session['rec_username'], new_pass)
			session.pop('rec_username', None)
			session.pop('rec_vcode', None)
			session.pop('vcode_matched', None)
			return redirect(url_for('adminLogin'))
	return render_template('recovery-step3.html', error = error)

@app.route('/operator/recover_s3', methods = ['GET', 'POST'])
def operator_account_recovery_s3():
	try:
		vcode_matched = session['vcode_matched']
	except:
		return redirect(url_for('operatorLogin'))

	error = None
	if request.method == 'POST':
		new_pass = request.form['new_password']
		verify_pass = request.form['verify_password']
		if new_pass == '' or verify_pass == '':
			error = 'Please Complete Fields'
		elif new_pass != verify_pass:
			error = 'Password not matched'
		else:
			rec.changePassword(session['rec_username'], new_pass)
			session.pop('rec_username', None)
			session.pop('rec_vcode', None)
			session.pop('vcode_matched', None)
			return redirect(url_for('operatorLogin'))
	return render_template('recovery-step3.html', error = error)



if __name__ == "__main__":
	app.run()








'''
# JSON WEB TOKEN BASED MIDDLEWARE
def adminMiddleware(f):
	@wraps(f)
	def decorated(*args, **kwargs):
		try:
			admin = session['admin']	# admin variable contains the value of session that has been created after the login
		except:
			return redirect(url_for('adminLogin'))	# If there is no session created, redirect to login page
		
		token = auth.create_web_token(admin)
		if not token:
			return 'No Token Assigned'
		try:
			data = jwt.decode(token, app.secret_key)
		except:
			return 'Invalid Token'
		return f(*args, **kwargs)	# the current return of function that is overriden
	return decorated
'''