#include <SPI.h>
#include <Ethernet.h>

#define LOOP_A_PIN 2
#define LOOP_B_PIN 4
#define relayPin 9

unsigned long detectionTimestamp = 0;
unsigned long timeout = 120000;
unsigned long lastBoomSigCheck = 0;
unsigned long boomSigCheckInterval = 5000;
unsigned long lastSequenceResetTime = 0;

bool loopADetected = false;
bool loopBDetected = false;
bool sequenceComplete = false;

// for gate-1
//byte mac[] = {0xAA, 0xBB, 0xCC, 0xDD, 0xEE, 0xFF};
//IPAddress ip(192, 168, 0, 157);

// for gate-2
byte mac[] = {0xAB, 0xBC, 0xCD, 0xDE, 0xEF, 0xFA};
IPAddress ip(192, 168, 0, 158);

// for gate-3
//byte mac[] = {0xAF, 0xBF, 0xCF, 0xDF, 0xEF, 0xAC};
//IPAddress ip(192, 168, 0, 159);

EthernetClient client;

const int gate_id = 2;

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
  Serial.println("Sequence reset.");
}

void sendEntryExitData(bool isEntry) {
  String jsonPayload = "{";
  jsonPayload += "\"gate_id\": \"" + String(gate_id) + "\",";
  jsonPayload += "\"event\": \"" + String(isEntry ? "entry" : "exit") + "\"";
  jsonPayload += "}";

  Serial.print("Sending JSON: ");
  Serial.println(jsonPayload);

  if (client.connect("192.168.0.128", 5000)) {
    client.print("POST /vehicle_data HTTP/1.1\r\n");
    client.print("Host: 192.168.0.128\r\n");
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
  bool loopAState = digitalRead(LOOP_A_PIN) == LOW;
  bool loopBState = digitalRead(LOOP_B_PIN) == LOW;

  // If a sequence is complete, wait until both loops are clear and a cooldown has passed
  if (sequenceComplete) {
    if (!loopAState && !loopBState && (millis() - lastSequenceResetTime > 2000)) {
      resetSequence();
      sequenceComplete = false;
      Serial.println("Ready for next detection...");
    }
    return;
  }

  if (loopAState && !loopADetected && !loopBDetected && !loopBState) {
    loopADetected = true;
    detectionTimestamp = millis();
    Serial.println("Loop A detected, waiting for Loop B...");
  }

  if (loopBState && !loopBDetected && !loopADetected && !loopAState) {
    loopBDetected = true;
    detectionTimestamp = millis();
    Serial.println("Loop B detected, waiting for Loop A...");
  }

  if (loopAState && loopBState) {
    return;
  }

  if ((loopADetected || loopBDetected) && millis() - detectionTimestamp > timeout) {
    Serial.println("Timeout: Second loop not detected in time. Resetting sequence...");
    resetSequence();
    return;
  }

  if (loopADetected && !loopBDetected && !loopAState && loopBState) {
    Serial.println("Sequence: Loop A -> Loop B (Car Entry)");
    sendEntryExitData(true);
    sequenceComplete = true;
    lastSequenceResetTime = millis();
  }

  if (loopBDetected && !loopADetected && !loopBState && loopAState) {
    Serial.println("Sequence: Loop B -> Loop A (Car Exit)");
    sendEntryExitData(false);
    sequenceComplete = true;
    lastSequenceResetTime = millis();
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

    if (client.connect("192.168.0.128", 5000)) {
      String request = "GET /check_boomsig?gate_id=" + String(gate_id) + " HTTP/1.1\r\n";
      request += "Host: 192.168.0.128\r\n";
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