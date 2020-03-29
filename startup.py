from email.mime.text import MIMEText
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
import base64
import ntpath
import os
import pickle
import requests
import subprocess
import threading
import time



SCOPES=["https://mail.google.com/"]



def setup():
	cdata=None
	if (ntpath.exists("token.tk")):
		with open("token.tk","rb") as t:
			cdata=pickle.load(t)
	if (not cdata or not cdata.valid):
		if (cdata and cdata.expired and cdata.refresh_token):
			cdata.refresh(Request())
		else:
			flw=InstalledAppFlow.from_client_secrets_file("creds.json",SCOPES)
			cdata=flw.run_local_server(port=0)
		with open("token.tk","wb") as t:
			pickle.dump(cdata,t)
	gmail=build("gmail","v1",credentials=cdata)
	return gmail



def start_http():
	import HTTPServer as s
	s.start()



with open(r"C:\Users\MAKS\.ngrok2\ngrok.yml","w") as f:
	f.write("""authtoken: 1TQVS6o9GO1y27axytlhcwM1rl5_7Vm3wtoke5juZfMudMEud
web_addr: localhost:4444""")
NGROK_PID=subprocess.Popen(["ngrok.exe","http","8005"]).pid
time.sleep(2)
_dt=None
while (True):
	_dt=requests.get("http://localhost:4444/api/tunnels").json()
	if (len(_dt["tunnels"])>=2):
		break
HTTPS_URL=_dt["tunnels"][0]["public_url"].replace("https","http").replace("http","https")
msg=MIMEText(f"Snake:\n{HTTPS_URL}")
msg["to"]="aleks.black42@gmail.com"
msg["from"]=""
msg["subject"]="Snake App Creds"
setup().users().messages().send(userId="me",body={"raw":base64.urlsafe_b64encode(msg.as_bytes()).decode()}).execute()
os.system(f"start chrome \"{HTTPS_URL}\"")
# thr=threading.Thread(target=start_http,args=(),kwargs={})
# thr.deamon=True
# thr.start()