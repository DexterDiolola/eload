#!/home/remotesec/webserver/bin/python

import mysql.connector
import pytz, datetime

dbuser = 'root'
dbpass = 'r3m0teSec'
dbname = 'load_central_transactions'

def clearMacs():
	try:
		conn = mysql.connector.connect(user=dbuser, password=dbpass, 
 				database=dbname)		
		cursor = conn.cursor()
	except:
		return 'Connection Unavailble DB error'

	q1 = """ DELETE FROM macs WHERE dateCreated > DATE_SUB(NOW(), INTERVAL 1 DAY)
			AND dateCreated < DATE_SUB(NOW(), INTERVAL 3 HOUR)
			AND operator = '' """

	cursor.execute(q1)
	conn.commit()
	cursor.close()
	conn.close()

	return 'deleted'

clearMacs()