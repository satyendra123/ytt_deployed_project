import os
import sys
import logging
import traceback
import socket
import psutil

# ---------------------------
# FIX PATH FOR PYINSTALLER
# ---------------------------
if getattr(sys, 'frozen', False):
    BASE_DIR = sys._MEIPASS
else:
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))

sys.path.insert(0, BASE_DIR)

# ---------------------------
# DJANGO SETTINGS (CRITICAL)
# ---------------------------
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "anpr_backened.settings")

# ---------------------------
# LOGGING SETUP
# ---------------------------
log_file = os.path.join(BASE_DIR, "server.log")
logging.basicConfig(
    filename=log_file,
    filemode="w",
    level=logging.DEBUG,
    format="%(asctime)s [%(levelname)s] %(message)s"
)

logging.info("Starting EXE...")

# ---------------------------
# DJANGO INIT WITH ERROR HANDLING
# ---------------------------
try:
    logging.info("Initializing Django...")
    from django.core.wsgi import get_wsgi_application
    application = get_wsgi_application()
    logging.info("Django initialized successfully")
except Exception:
    logging.error("❌ Django failed to start")
    logging.error(traceback.format_exc())
    sys.exit(1)

# ---------------------------
# FUNCTION TO GET SYSTEM IP
# ---------------------------
'''
def get_system_ip():
    try:
        for iface, addrs in psutil.net_if_addrs().items():
            iface_l = iface.lower()
            if any(x in iface_l for x in ["ethernet", "eth", "enp", "ens"]):
                for addr in addrs:
                    if addr.family == socket.AF_INET:
                        return addr.address
    except Exception as e:
        logging.error("❌ Failed to get system IP")
        logging.error(traceback.format_exc())
    return "127.0.0.1"
'''


# ---------------------------
# WAITRESS SERVER
# ---------------------------
try:
    from waitress import serve
except ModuleNotFoundError:
    logging.error("❌ Waitress is not installed. Please run 'pip install waitress'")
    sys.exit(1)

port = 8000
logging.info(f"Starting Waitress server on {host_ip}:{port}")
print(f"🔧 Starting Waitress server on http://{host_ip}:{port}")

try:
    serve(application, host=0.0.0.0, port=port)
except Exception:
    logging.error("❌ Waitress server crashed")
    logging.error(traceback.format_exc())
    sys.exit(1)
