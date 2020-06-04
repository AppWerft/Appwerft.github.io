import pyodbc

def connectDWH() :
	conn = pyodbc.connect('DRIVER={SQL Server Native Client 11.0};SERVER=pc-1731.kvhh.de;DATABASE=RS_DWH_DEV_CORE;UID=dwh_agent;PWD=DWH1234#;charset=utf8')
	return conn

def disconnectDWH(conn) :
	conn.close