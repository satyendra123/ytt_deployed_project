import logging
import traceback
from waitress import serve
from anpr_backened.wsgi import application

# Log to file
logging.basicConfig(
    filename="server.log",
    filemode="w",
    level=logging.DEBUG,
    format="%(asctime)s [%(levelname)s] %(message)s"
)

print("🔧 Starting Waitress server on http://0.0.0.0:5000")
logging.info("Starting Waitress server...")

try:
    serve(application, host='0.0.0.0', port=5000)
except Exception as e:
    logging.error("❌ Exception occurred while running server:")
    logging.error(traceback.format_exc())
    print("❌ Server crashed! Check server.log")
