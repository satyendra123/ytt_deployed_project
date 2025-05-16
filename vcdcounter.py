from flask import Flask, request, jsonify
import mysql.connector

app = Flask(__name__)

def get_db_connection():
    conn = mysql.connector.connect(host='localhost', user='root', password='', database='vcd')
    return conn

@app.route('/vehicle_data', methods=['POST'])
def receive_vehicle_data():
    data = request.get_json()

    gate = data.get('gate_id')  
    action = data.get('event')  

    if not gate or not action:
        return jsonify({"error": "Missing gate_id or event parameter"}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO dashboard_carlog (gate, action, created_at, updated_at) 
            VALUES (%s, %s, NOW(), NOW())
        ''', (gate, action))
        conn.commit()
        conn.close()

        print(f"Inserted Data → Gate: {gate}, Action: {action}")

        return jsonify({"message": "Event data received"}), 200

    except mysql.connector.Error as err:
        return jsonify({"error": f"MySQL Error: {err}"}), 500

@app.route('/check_boomsig', methods=['GET'])
def check_boom_signal():
    gate_id = request.args.get('gate_id')

    if not gate_id:
        return jsonify({"error": "Missing gate_id parameter"}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute('SELECT entryboom FROM boomsig WHERE id = %s', (gate_id,))
        row = cursor.fetchone()
        print(f"Fetched Row for Gate {gate_id}: {row}")  

        if row and row[0] == 'Y':          
            cursor.execute('UPDATE boomsig SET entryboom = "N" WHERE id = %s', (gate_id,))
            conn.commit()
            conn.close()

            return jsonify({"command": "|OPENEN%"}), 200

        conn.close()
        return jsonify({"command": "NO_ACTION"}), 200

    except mysql.connector.Error as err:
        print(f"MySQL Error: {err}")  
        return jsonify({"error": f"MySQL Error: {err}"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True, threaded=True)
