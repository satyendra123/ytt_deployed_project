# ytt_deployed_project
run_server.py code - 
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

2) then run ths code to make the exe

python "C:\Users\Satyendra Singh\AppData\Roaming\Python\Python39\Scripts\pyinstaller.exe" --onefile --noconsole --hidden-import=authentication --hidden-import=authentication.apps --hidden-import=authentication.urls --hidden-import=accounts --hidden-import=accounts.apps --hidden-import=accounts.urls --hidden-import=controller --hidden-import=controller.apps --hidden-import=controller.urls --hidden-import=dashboard --hidden-import=dashboard.apps --hidden-import=dashboard.urls --hidden-import=dj_rest_auth --hidden-import=dj_rest_auth.registration --hidden-import=allauth --hidden-import=allauth.account --hidden-import=allauth.socialaccount --hidden-import=rest_framework run_server.py


