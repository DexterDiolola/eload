import re
import mysql.connector

dbuser = 'root'
dbpass = 'r3m0teSec'
dbname = 'load_central_transactions'

def read_price_file():
	arr = []
	f = open('prices.csv', 'r')
	lines = f.readlines()
	for line in lines:
		ext_float = re.findall("(\d+\.\d+)", line)	# get integers with floating point from string
		sums = float(ext_float[0]) + float(ext_float[1]) + float(ext_float[2])
		arr.append((round(sums)/100,))

	print(arr)
	return arr

def read_products_file():
	arr = []
	f = open('products.csv', 'r')
	lines = f.readlines()
	for line in lines:
		spliter = line.split(',')
		spliter2 = spliter[0].split('\n')
		spliter2a = spliter[1].split('\n')
		tup = (spliter2[0], spliter2a[0])
		arr.append(tup)

	print(arr)
	return arr

def read_providers_file():
	arr = []
	f = open('providers.csv', 'r')
	lines = f.readlines()
	for line in lines:
		spliter = line.split('\n')
		tup = (spliter[0],)
		arr.append(tup)

	return arr

def add_to_database():
	try:
		conn = mysql.connector.connect(user=dbuser, password=dbpass, 
			database=dbname)
		cursor = conn.cursor()
	except:
		return 'Connection Unavailable'

	tb1 = """ INSERT INTO tb1(rate) VALUES(%s) """
	tb2 = """ INSERT INTO tb2(description, pcode) VALUES(%s, %s) """
	tb4 = """ INSERT INTO tb4(providers) VALUES(%s) """

	cursor.executemany(tb1, read_price_file())
	cursor.executemany(tb2, read_products_file())
	cursor.executemany(tb4, read_providers_file())
	conn.commit()
	cursor.close()
	conn.close()

	print('Inserted Successfully')
	return

def init_price():
	try:
		conn = mysql.connector.connect(user=dbuser, password=dbpass, 
			database=dbname)
		cursor = conn.cursor()
	except:
		return 'Connection Unavailable'

	arr = []
	tb3 = """ INSERT INTO tb3(price) VALUES(%s) """
	tb5 = """ INSERT INTO tb5(stdprice) VALUES(%s) """

	# get rates
	get_rates = """ SELECT rate FROM tb1 """
	cursor.execute(get_rates)
	rates = cursor.fetchall()

	# get pcodes
	get_pcode = """ SELECT pcode FROM tb2 """
	cursor.execute(get_pcode)
	pcodes = cursor.fetchall()

	for x in range(len(rates)):
		default_price = re.findall('(\d+)', pcodes[x][0])	# get integers from string
		if len(default_price) == 0:
			default_price = ['0']
		discount = float(default_price[0]) * float(rates[x][0])
		price = float(default_price[0]) - float(discount)
		arr.append((round(price),))

	cursor.executemany(tb3, arr)
	conn.commit()
	cursor.close()
	conn.close()

	print(arr)
	return

# add_to_database()
# add_to_database(read_price_file(), read_products_file())
init_price()