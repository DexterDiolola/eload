#!/home/remotesec/webserver/bin/python

import mysql.connector
import pytz, datetime

dbuser = 'root'
dbpass = 'r3m0teSec'
dbname = 'load_central_transactions'

def deleteManualLoad():
	try:
		conn = mysql.connector.connect(user=dbuser, password=dbpass, 
 				database=dbname)		
		cursor = conn.cursor()
	except:
		return 'Connection Unavailble DB error'

	cursor.callproc('JOB_DELETEMANUALLOAD')
	conn.commit()
	cursor.close()
	conn.close()

	return 'deleted'

deleteManualLoad()