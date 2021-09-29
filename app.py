import logging
from flask import Flask, request, redirect, Response
from flask_cors import CORS

from utils import success_json_response, format_sse
from security import secured
from error_handler import error_handler, BadRequestException
from messages import MessageAnnouncer

app = Flask(__name__,
            static_url_path="/",
            static_folder="static")
CORS(app)

# set logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] (%(threadName)-10s) %(message)s')
logger = logging.getLogger(__name__)

announcer = MessageAnnouncer()

@app.route("/")
def gotoindex():
  # headers on request
  logger.info("Headers on request...")
  for key,value in dict(request.headers).items():
    logger.debug("{key} -> {val}".format(key=key, val=value))
  # check for X-Forwarded headers
  if request.headers.get("x-forwarded-host"):
    host = request.headers.get("x-forwarded-host")
    # check if host is a list and get first element assuming this is the host the user expects
    if len(host.split(",")) > 1:
      host = host.split(",")[0].strip()
    if request.headers.get("x-forwarded-proto"):
      proto = request.headers.get("x-forwarded-proto")
      url = "{proto}://{host}/index.html".format(proto=proto, host=host)
      logger.info("URL for redirect is {url}".format(url=url))
      return redirect(url, code=302)
    else:
      url = "http://{host}/index.html".format(host=host)
      logger.info("URL for redirect is {url}".format(url=url))
      return redirect(url, code=302)
  else:
    return redirect("/index.html", code=302)

@app.route("/api")
@error_handler
@secured
def root(username, groups):
  return success_json_response({
    "ping": "pong",
    "username": username,
    "groups": groups
  })

@app.route("/api/messages", methods=["POST"])
@error_handler
@secured
def put_message(username, groups):
  if not request.json:
    raise BadRequestException("Request should be JSON")
  if not "message" in request.json:
    raise BadRequestException("Request should have 'message' attribute")
  logger.info("Got a message: " + request.json["message"])
  msg = format_sse(data=request.json["message"])
  announcer.announce(
    username=username,
    msg=msg
  )
  return {}, 200

@app.route("/api/messages", methods=["GET"])
@error_handler
@secured
def get_messages(username, groups):
  logger.info("Client is registering for events...")
  def stream():
    messages = announcer.listen(username)  # returns a queue.Queue
    while True:
      msg = messages.get()  # blocks until a new message arrives
      yield msg
  
  return Response(stream(), mimetype='text/event-stream')

if __name__ == "__main__":
  app.run(debug=False, host="0.0.0.0")