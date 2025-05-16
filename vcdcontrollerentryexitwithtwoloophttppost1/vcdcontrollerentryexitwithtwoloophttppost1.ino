#include <SPI.h>
#include <Ethernet.h>

#define LOOP_A_PIN 2
#define LOOP_B_PIN 4
#define relayPin 9

unsigned long detectionTimestamp = 0;
unsigned long timeout = 180000;  // Timeout after 3 minutes
unsigned long lastBoomSigCheck = 0;  // Track the last check for boomsig
unsigned long boomSigCheckInterval = 5000;  // Check boomsig every 5 seconds

bool loopADetected = false;
bool loopBDetected = false;
bool sequenceComplete = false;

// for gate-1
byte mac[] = {0xAA, 0xBB, 0xCC, 0xDD, 0xEE, 0xFF};
IPAddress ip(192, 168, 0, 157);

//for gate-2
//byte mac[] = {0xAB, 0xBC, 0xCD, 0xDE, 0xEF, 0xFA};
//IPAddress ip(192, 168, 0, 158);

//for gate-3
//byte mac[] = {0xAF, 0xBF, 0xCF, 0xDF, 0xEF, 0xAC};
//IPAddress ip(192, 168, 0, 159);

EthernetClient client;

const int gate_id = 1;  // Change this for each device (1, 2, 3)

void setup() {
  Ethernet.begin(mac, ip);
  Serial.begin(9600);

  while (!Serial) {
    ;
  }

  Serial.print("Machine Gate IP: ");
  Serial.println(Ethernet.localIP());

  pinMode(LOOP_A_PIN, INPUT_PULLUP);
  pinMode(LOOP_B_PIN, INPUT_PULLUP);
  pinMode(relayPin, OUTPUT);
  digitalWrite(relayPin, HIGH);
}

void resetSequence() {
  loopADetected = false;
  loopBDetected = false;
  detectionTimestamp = 0;
}

void sendEntryExitData(bool isEntry) {
  String jsonPayload = "{";
  jsonPayload += "\"gate_id\": \"" + String(gate_id) + "\",";
  jsonPayload += "\"event\": \"" + String(isEntry ? "entry" : "exit") + "\"";
  jsonPayload += "}";

  Serial.print("Sending JSON: ");
  Serial.println(jsonPayload);

  if (client.connect("192.168.0.100", 8000)) {
    client.print("POST /vehicle_data HTTP/1.1\r\n");
    client.print("Host: 192.168.1.100\r\n");
    client.print("Content-Type: application/json\r\n");
    client.print("Content-Length: " + String(jsonPayload.length()) + "\r\n");
    client.print("\r\n");
    client.print(jsonPayload);
    client.print("\r\n");

    unsigned long startTime = millis();
    while (!client.available()) {
      if (millis() - startTime > 5000) {
        Serial.println("Server not responding.");
        client.stop();
        return;
      }
    }

    String response = "";
    while (client.available()) {
      response += (char)client.read();
    }

    Serial.print("Response: ");
    Serial.println(response);

    client.stop();
  } else {
    Serial.println("Connection failed.");
  }
}

void checkLoopSequence() {
  if (sequenceComplete) {
    resetSequence();
    sequenceComplete = false;
    return;
  }

  if (digitalRead(LOOP_A_PIN) == LOW && !loopADetected && !loopBDetected) {
    loopADetected = true;
    detectionTimestamp = millis();
    Serial.println("Loop A detected, waiting for Loop B...");
  }

  if (digitalRead(LOOP_B_PIN) == LOW && !loopBDetected && !loopADetected) {
    loopBDetected = true;
    detectionTimestamp = millis();
    Serial.println("Loop B detected, waiting for Loop A...");
  }

  if (loopADetected && !loopBDetected) {
    if (digitalRead(LOOP_B_PIN) == LOW) {
      Serial.println("Sequence: Loop A -> Loop B (Car Entry)");
      sendEntryExitData(true);
      resetSequence();
      sequenceComplete = true;
    } else if (millis() - detectionTimestamp > timeout) {
      Serial.println("Timeout: Restarting sequence...");
      resetSequence();
      sequenceComplete = true;
    }
  }

  if (loopBDetected && !loopADetected) {
    if (digitalRead(LOOP_A_PIN) == LOW) {
      Serial.println("Sequence: Loop B -> Loop A (Car Exit)");
      sendEntryExitData(false);
      resetSequence();
      sequenceComplete = true;
    } else if (millis() - detectionTimestamp > timeout) {
      Serial.println("Timeout: Restarting sequence...");
      resetSequence();
      sequenceComplete = true;
    }
  }
}

void openGate() {
  digitalWrite(relayPin, LOW);
  Serial.println("Gate Opened");
  delay(1000);
  digitalWrite(relayPin, HIGH);
}

void checkBoomSig() {
  if (millis() - lastBoomSigCheck >= boomSigCheckInterval) {
    lastBoomSigCheck = millis();

    if (client.connect("192.168.1.100", 8000)) {
      String request = "GET /check_boomsig?gate_id=" + String(gate_id) + " HTTP/1.1\r\n";
      request += "Host: 192.168.1.100\r\n";
      request += "\r\n";
      client.print(request);

      unsigned long startTime = millis();
      while (!client.available()) {
        if (millis() - startTime > 5000) {
          Serial.println("Server not responding.");
          client.stop();
          return;
        }
      }

      String response = "";
      while (client.available()) {
        response += (char)client.read();
      }

      if (response.indexOf("|OPENEN%") != -1) {
        openGate();
      }

      client.stop();
    }
  }
}

void loop() {
  checkLoopSequence();
  checkBoomSig();
}
