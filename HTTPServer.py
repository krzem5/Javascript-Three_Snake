from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, HTTPServer
import io
import json
import sys



with open("score-data.json","r") as f:
	SCORES=json.loads(f.read())



def save():
	with open("score-data.json","w") as f:
		f.write(json.dumps(SCORES,indent=4,sort_keys=True).replace("    ","\t"))



class Client(SimpleHTTPRequestHandler):
	server_version="HTTP/1.3"
	protocol_version="HTTP/1.0"



	def do_SCOREGET(self):
		if (self.headers["X-Forwarded-For"] not in SCORES.keys()):
			SCORES[self.headers["X-Forwarded-For"]]=-1
		enc=str(SCORES[self.headers["X-Forwarded-For"]]).encode(sys.getfilesystemencoding(),"surrogateescape")
		f=io.BytesIO()
		f.write(enc)
		f.seek(0)
		self.send_response(HTTPStatus.OK)
		self.send_header("Content-type","text/plain")
		self.send_header("Content-Length",str(len(enc)))
		self.send_header("Last-Modified",0)
		self.end_headers()
		self.copyfile(f,self.wfile)



	def do_SCOREUPDATE(self):
		SCORES[self.headers["X-Forwarded-For"]]=max(SCORES[self.headers["X-Forwarded-For"]],int(self.path[1:]))
		save()
		scp=1
		scl=0
		cs=SCORES[self.headers["X-Forwarded-For"]]
		for k in SCORES.keys():
			v=SCORES[k]
			if (v==-1):
				continue
			if (v>cs):
				scp+=1
			scl+=1
		enc=f"{SCORES[self.headers['X-Forwarded-For']]}~{scp}~{scl}".encode(sys.getfilesystemencoding(),"surrogateescape")
		f=io.BytesIO()
		f.write(enc)
		f.seek(0)
		self.send_response(HTTPStatus.OK)
		self.send_header("Content-type","text/plain")
		self.send_header("Content-Length",str(len(enc)))
		self.send_header("Last-Modified",0)
		self.end_headers()
		self.copyfile(f,self.wfile)



def start():
	with HTTPServer(("localhost",8005),Client) as httpd:
		print("HTTP server started on port 8005!")
		httpd.serve_forever()



if (__name__=="__main__"):
	start()
