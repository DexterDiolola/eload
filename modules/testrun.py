import mysql.connector
import random, base64, requests, json

dbuser = 'root'
dbpass = 'r3m0teSec'
dbname = 'load_central_transactions'

def encryptLoadData(key, clear):
	enc = []
	for i in range(len(clear)):
		key_c = key[i % len(key)]
		enc_c = chr((ord(clear[i]) + ord(key_c)) % 256)
		enc.append(enc_c)
	return base64.urlsafe_b64encode("".join(enc).encode())

def decryptLoadData(key, enc):
    dec = []
    enc = base64.urlsafe_b64decode(enc).decode()
    for i in range(len(enc)):
        key_c = key[i % len(key)]
        dec_c = chr((256 + ord(enc[i]) - ord(key_c)) % 256)
        dec.append(dec_c)
    return "".join(dec)

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

# Transaction Logs Maker
def insertTransactionLogs():
	try:
		conn = mysql.connector.connect(user=dbuser, password=dbpass, 
 				database=dbname)		
		cursor = conn.cursor()
	except:
		return 'Connection Unavailble DB error'

	logs = requests.get('http://139.162.121.128/api/adminMainDetails?cond=transactionLogs&startDate=2019-04-01&endDate=2019-07-06')
	logs = json.loads(logs.text)
	logs = logs[::-1]

	query = """ INSERT INTO transactions2(routerMac, userMac, mobileNum, denomination, price, loadcentral_price, admin_revenue,
			opr_revenue, rrn, response_code, tid, bal, mac_bal, epin, err, type, site, operator, admin_price, base_price, 
			service_charge, provider, dateCreated) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) """

	for log in logs:
		if log['operator'] == None:	log['operator'] = ''
		if log['service_charge'] == None:	log['service_charge'] = ''
		cursor.execute(query, (log['routerMac'], log['userMac'], log['mobileNum'], log['productCode'], log['operator_price'],
			log['loadcentral_price'], log['admin_revenue'], log['opr_revenue'], log['rrn'], log['response_code'], log['tid'],
			log['bal'], log['mac_bal'], log['epin'], log['err'], log['type'], log['site'], log['operator'], log['admin_price'],
			log['base_price'], log['service_charge'], log['provider'], log['dateCreated']))

	conn.commit()
	cursor.close()
	conn.close()

	return len(logs)


def main():
	xx = insertTransactionLogs()
	print(xx)

main()

