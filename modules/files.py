import os, logging, re, pytz, datetime
import mysql.connector

from flask import request, send_file, send_from_directory
from werkzeug.utils import secure_filename
from logs.log_conf import Logger

logging.basicConfig()
log = logging.getLogger(__name__)

class Files:
	def __init__(self):
		self.dbuser = 'root'
		self.dbpass = 'r3m0teSec'
		self.dbname = 'load_central_transactions'
		self.upload_csv_path = '/var/www/html/python_progs/load_central/static/csv/'
		self.transactionLogs_path = '/var/www/html/python_progs/load_central/static/csv/transaction_logs/'
		self.upload_carousel_img_path = '/var/www/html/python_progs/load_central/static/img/login_carousel'
		self.allowed_extensions = ['csv', 'txt', 'pdf', 'png', 'jpg', 'jpeg']

	def datenow(self):
		time_zone = pytz.timezone('Asia/Manila')
		_datetime = str(datetime.datetime.now(time_zone))
		now = _datetime.split('.')
		return now[0]

	def allowedFiles(self, filename):
		return '.' in filename and \
			filename.rsplit('.', 1)[1].lower() in self.allowed_extensions

	def downloadCsvPrices(self):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 				database=self.dbname)		
			cursor = conn.cursor(prepared=True)
		except:
			return 'Connection Unavailble DB error'

		query = """ SELECT price_admin.pcode, price_admin.price, provider FROM price_loadcentral
				LEFT OUTER JOIN price_admin ON price_loadcentral.pcode = price_admin.pcode """
		cursor.execute(query)
		rows = cursor.fetchall()
		cursor.close()
		conn.close()

		filename = 'prices.csv'
		file = open(self.upload_csv_path + filename, 'w')
		for row in rows:
			file.write(row[0] + ',' + row[1] + ',' + row[2] + '\n')
		file.close()

		# log.info(len(rows))
		return send_from_directory(self.upload_csv_path, filename=filename, as_attachment=True)
		# return send_file(self.upload_csv_path + filename, attachment_filename=filename, as_attachment=True)

	def downloadCsvPricesOpr(self):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 				database=self.dbname)		
			cursor = conn.cursor(prepared=True)
		except:
			return 'Connection Unavailble DB error'

		operator = request.args.get('operator')
		query = """ SELECT price_operators.pcode, price_operators.price, price_operators.provider
				FROM price_operators WHERE operator = %s """
		cursor.execute(query, (operator,))
		rows = cursor.fetchall()
		cursor.close()
		conn.close()

		filename = operator + '_prices.csv'
		file = open(self.upload_csv_path + filename, 'w')
		for row in rows:
			file.write(row[0] + ',' + row[1] + ',' + row[2] + '\n')
		file.close()

		# log.info(len(rows))
		return send_file(self.upload_csv_path + filename, attachment_filename=filename, as_attachment=True)

	def initTransactionLogs(self, userType, startDate, endDate, opr, mac):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 				database=self.dbname)		
			cursor = conn.cursor(dictionary=True)
		except:
			return 'Connection Unavailble DB error'
		
		if userType == 'admin':
			cursor.callproc('ADM_MAIN_DETAILS', ('transactionLogs', startDate, endDate))
	
		elif userType == 'adminEach':
			cursor.callproc('ADM_MAIN_DETAILS_EACH', ('transactionLogs', startDate, endDate, mac))
			
		elif userType == 'operator':
			cursor.callproc('OPR_MAIN_DETAILS', ('transactionLogs', startDate, endDate, opr))
			
		elif userType == 'operatorEach':
			cursor.callproc('OPR_MAIN_DETAILS_EACH', ('transactionLogs', startDate, endDate, opr, mac))

		else:
			return 0

		obj = []
		for result in cursor.stored_results():
			for row in result:
				obj.append(dict(zip(result.column_names, row)))
		
		conn.commit()
		cursor.close()
		conn.close()

		return obj

	def downloadTransactionLogs(self, obj, userType, user, startDate, endDate):
		def nullValidator(string, ret):
			if string == '' or string == None:
				return ret
			else:
				return string

		if user == '':	user = 'admin'	
		filename = user + '_transactionlogs(' + startDate + '-' + endDate + ').csv'
		file = open(self.transactionLogs_path + filename, 'w')
		
		if userType == 'admin' or userType == 'adminEach':
			file.write('Datetime,Mac,Admin Balance,Mac Balance,Promo Code,Adm Product Cost,' +
				'Adm Publish Price,Adm ProCostEarning,Adm Revenue,Opr Product Cost,Opr Publish Price,' +
				'Opr Service Charge,Opr ProCostEarning,Opr Revenue,Status,Provider,Site,Owner,userMac,' +
				'Mobile Number,Transaction ID' + '\n')

			for tl in obj:
				if tl['response_code'] == '0':
					admProCostEarnings = '%.2f'%(float(tl['base_price']) - float(tl['loadcentral_price']))
					oprProCostEarnings = '%.2f'%(float(tl['base_price']) - float(tl['admin_price']))
				else:
					admProCostEarnings = '0'
					oprProCostEarnings = '0'
				
				serviceCharge = nullValidator(tl['service_charge'], '0')
				site = nullValidator(tl['site'], '-----')
				operator = nullValidator(tl['operator'], '-----')
				tid = nullValidator(tl['tid'], 'No TID Failed')
				
				file.write(tl['dateCreated'] + ',' + tl['routerMac'] + ',' + '%.2f'%float(tl['bal']) + ',' + '%.2f'%float(tl['mac_bal']) +
					',' + tl['productCode'] + ',' + tl['loadcentral_price'] + ',' + tl['admin_price'] + ',' +
					admProCostEarnings + ',' + '%.2f'%float(tl['admin_revenue']) + ',' + tl['admin_price'] + ',' + tl['operator_price'] +
					','  + serviceCharge + ',' + oprProCostEarnings + ',' + '%.2f'%float(tl['opr_revenue']) + ',' + tl['err'] + ',' +
					 tl['provider'] + ',' + site + ',' + operator + ',' + tl['userMac'] + ',' + tl['mobileNum'] + ',' + tid + '\n') 

			file.close()
			return send_from_directory(self.transactionLogs_path, filename=filename, as_attachment=True)
		
		else:
			file.write('Datetime,Mac,Mac Balance,Promo Code,Product Cost,' +
				'Publish Price,Service Charge,ProCostEarning,Revenue,Status,Provider,Site,userMac,' +
				'Mobile Number,Transaction ID' + '\n')

			for tl in obj:
				if tl['response_code'] == '0':
					oprProCostEarnings = '%.2f'%(float(tl['base_price']) - float(tl['admin_price']))
				else:
					oprProCostEarnings = '0'
				
				serviceCharge = nullValidator(tl['service_charge'], '0')
				site = nullValidator(tl['site'], '-----')
				tid = nullValidator(tl['tid'], 'No TID Failed')
				
				file.write(tl['dateCreated'] + ',' + tl['routerMac'] + ',' + '%.2f'%float(tl['mac_bal']) +
					',' + tl['productCode'] + ',' + tl['admin_price'] + ',' + tl['operator_price'] +
					','  + serviceCharge + ',' + oprProCostEarnings + ',' + '%.2f'%float(tl['opr_revenue']) + ',' + tl['err'] + ',' +
					 tl['provider'] + ',' + site + ',' + tl['userMac'] + ',' + tl['mobileNum'] + ',' + tid + '\n') 

			file.close()
			return send_from_directory(self.transactionLogs_path, filename=filename, as_attachment=True)

	# def downloadTransactionLogs(self):
	# 	filename = self.initTransactionLogs()
	# 	return send_file(self.transactionLogs_path + filename, attachment_filename=filename, as_attachment=True)

	def validateCsvPrices(self, filename):
		# initialize csv values from the uploaded file
		csv_vals = []
		f = open(self.upload_csv_path + filename, 'r')
		lines = f.readlines()
		for line in lines:
			split = line.split(',')
			csv_pcode = split[0]
			try:
				csv_price = float(split[1])
			except:
				return 'Failed'

			csv_provider = split[2].split('\n')
			csv_provider = csv_provider[0]
			csv_vals.append((csv_pcode, csv_price, csv_provider))

		return csv_vals

	def uploadCsvPrices(self):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 				database=self.dbname)		
			cursor = conn.cursor(prepared=True)
		except:
			return 'Connection Unavailble DB error'

		if 'file' not in request.files:
			return 'Failed, no file selected'

		# validate file name
		file = request.files['file']
		if file.filename == '' or file.filename != 'prices.csv':
			return 'Failed, file name must be prices.csv'

		# validate file format and secure file name
		if file and self.allowedFiles(file.filename):
			filename = secure_filename(file.filename)
			file.save(os.path.join(self.upload_csv_path, filename))

			# validate prices
			csv_vals = self.validateCsvPrices(filename)
			if csv_vals == 'Failed':
				return 'Failed, the file contents is invalid and not matched'
			
			# update prices
			for x in range(len(csv_vals)):
				query = """ UPDATE price_admin SET price = %s WHERE pcode = %s """
				cursor.execute(query, (csv_vals[x][1], csv_vals[x][0]))
				conn.commit()
			
			cursor.close()
			conn.close()
			return 'File successfully uploaded'

		else:
			return 'File format not supported'

	def uplodCsvPricesOpr(self):
		try:
			conn = mysql.connector.connect(user=self.dbuser, password=self.dbpass, 
	 				database=self.dbname)		
			cursor = conn.cursor(prepared=True)
		except:
			return 'Connection Unavailble DB error'

		if 'file' not in request.files:
			return 'Failed, no file selected'

		# validate file name
		file = request.files['file']
		operator = request.form['operator']
		if file.filename == '' or file.filename != operator + '_prices.csv':
			return 'Failed, file name must be (username)_prices.csv'

		# validate file format and secure file name
		if file and self.allowedFiles(file.filename):
			filename = secure_filename(file.filename)
			file.save(os.path.join(self.upload_csv_path, filename))

			# validate prices
			csv_vals = self.validateCsvPrices(filename)
			if csv_vals == 'Failed':
				return 'Failed, the file contents is invalid and not matched'
			
			# update prices
			for x in range(len(csv_vals)):
				query = """ UPDATE price_operators SET price = %s WHERE pcode = %s AND operator = %s """
				cursor.execute(query, (csv_vals[x][1], csv_vals[x][0], operator))
				conn.commit()
			
			cursor.close()
			conn.close()
			return 'File successfully uploaded'

		else:
			return 'File format not supported'

	def uploadForCarousel(self):
		images = request.files.getlist('login_carousel')
		inc = 0

		if len(images) != 3:
			return 'You must upload 3 image files'

		for image in images:
			if image and self.allowedFiles(image.filename):
				inc += 1
				filename = secure_filename(image.filename)
				filename = 'login_carousel_' + str(inc) + '.jpg'
				image.save(os.path.join(self.upload_carousel_img_path, filename))
			else:
				return 'Failed, invalid file formaat'
			
		log.info(len(images))

		return 'Images successfully uploaded'

