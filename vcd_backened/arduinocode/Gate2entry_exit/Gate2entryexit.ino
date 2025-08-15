/*
#include <SPI.h>
#include <Ethernet.h>

#define LOOP_A_PIN 6
#define LOOP_B_PIN 7
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
byte mac[] = {0xAA, 0xBB, 0xCC, 0xDD, 0xEE, 0xFF};
IPAddress ip(192, 168, 1, 157);

// for gate-2
//byte mac[] = {0xAB, 0xBC, 0xCD, 0xDE, 0xEF, 0xFA};
//IPAddress ip(192, 168, 0, 158);

// for gate-3
//byte mac[] = {0xAF, 0xBF, 0xCF, 0xDF, 0xEF, 0xAC};
//IPAddress ip(192, 168, 0, 159);

EthernetClient client;

const int gate_id = 1;

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

  if (client.connect("192.168.1.128", 8000)) {
    client.print("POST /vehicle_data HTTP/1.1\r\n");
    client.print("Host: 192.168.1.128\r\n");
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

    if (client.connect("192.168.1.128", 8000)) {
      String request = "GET /check_boomsig?gate_id=" + String(gate_id) + " HTTP/1.1\r\n";
      request += "Host: 192.168.1.128\r\n";
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
*/


#include <SPI.h>
#include <Ethernet.h>
#include <avr/wdt.h>

#define LOOP_A_PIN 6
#define LOOP_B_PIN 7
#define relayPin 9

unsigned long detectionTimestamp = 0;
unsigned long timeout = 120000;
unsigned long lastBoomSigCheck = 0;
unsigned long boomSigCheckInterval = 5000;
unsigned long lastSequenceResetTime = 0;
unsigned long lastEthernetCheck = 0;
unsigned long ethernetCheckInterval = 10000;

bool loopADetected = false;
bool loopBDetected = false;
bool sequenceComplete = false;

//byte mac[] = {0xAA, 0xBB, 0xCC, 0xDD, 0xEE, 0xFF};
//IPAddress ip(192, 168, 1, 157);

byte mac[] = {0xAB, 0xBC, 0xCD, 0xDE, 0xEF, 0xFA};
IPAddress ip(192, 168, 1, 158);

IPAddress serverIP(192, 168, 1, 128);

EthernetClient client;
const int gate_id = 1;

void setup() {
  Serial.begin(9600);
  wdt_enable(WDTO_8S);
  startEthernet();
  pinMode(LOOP_A_PIN, INPUT_PULLUP);
  pinMode(LOOP_B_PIN, INPUT_PULLUP);
  pinMode(relayPin, OUTPUT);
  digitalWrite(relayPin, HIGH);
}

void loop() {
  wdt_reset();
  checkLoopSequence();
  checkBoomSig();
  checkEthernetConnection();
}

void startEthernet() 
{ 
  Serial.println("Initializing Ethernet..."); 
  delay(2000); 
  Ethernet.begin(mac, ip); 
  Serial.print("Machine Gate IP: "); 
  Serial.println(Ethernet.localIP()); 
}

void checkEthernetConnection() {
  if (millis() - lastEthernetCheck >= ethernetCheckInterval) {
    lastEthernetCheck = millis();
    if (Ethernet.linkStatus() == LinkOFF || Ethernet.hardwareStatus() == EthernetNoHardware) {
      Serial.println("⚠ Ethernet link lost. Reinitializing...");
      startEthernet();
    }
  }
}

// -------------------- Sequence Reset --------------------
void resetSequence() {
  loopADetected = false;
  loopBDetected = false;
  detectionTimestamp = 0;
  Serial.println("Sequence reset.");
}

// -------------------- Send Data --------------------
void sendEntryExitData(bool isEntry) {
  wdt_reset();
  String jsonPayload = "{";
  jsonPayload += "\"gate_id\": \"" + String(gate_id) + "\",";
  jsonPayload += "\"event\": \"" + String(isEntry ? "entry" : "exit") + "\"";
  jsonPayload += "}";

  Serial.print("Sending JSON: ");
  Serial.println(jsonPayload);

  if (client.connect(serverIP, 8000)) {
    client.print("POST /vehicle_data HTTP/1.1\r\n");
    client.print("Host: 192.168.1.128\r\n");
    client.print("Content-Type: application/json\r\n");
    client.print("Content-Length: " + String(jsonPayload.length()) + "\r\n\r\n");
    client.print(jsonPayload + "\r\n");

    unsigned long startTime = millis();
    while (!client.available()) {
      wdt_reset();
      if (millis() - startTime > 5000) {
        Serial.println("Server not responding.");
        client.stop();
        return;
      }
    }

    String response = "";
    while (client.available()) {
      wdt_reset();
      response += (char)client.read();
    }

    Serial.print("Response: ");
    Serial.println(response);
    client.stop();
  } else {
    Serial.println("Connection failed.");
  }
}

// -------------------- Loop Detection --------------------
void checkLoopSequence() {
  bool loopAState = digitalRead(LOOP_A_PIN) == LOW;
  bool loopBState = digitalRead(LOOP_B_PIN) == LOW;

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

// -------------------- Gate Control --------------------
void openGate() {
  digitalWrite(relayPin, LOW);
  Serial.println("Gate Opened");
  delay(1000);
  digitalWrite(relayPin, HIGH);
}

// -------------------- Boom Signal --------------------
void checkBoomSig() {
  if (millis() - lastBoomSigCheck >= boomSigCheckInterval) {
    lastBoomSigCheck = millis();

    if (client.connect(serverIP, 8000)) {
      client.println("GET /check_boomsig?gate_id=1 HTTP/1.1");
      client.println("Host: 192.168.1.128");
      client.println("Connection: close");
      client.println();
      Serial.println("Request sent: /check_boomsig?gate_id=1");

      while (client.connected()) {
        wdt_reset();
        if (client.available()) {
          String line = client.readStringUntil('\n');
          line.trim();
          if (line.startsWith("{") && line.endsWith("}")) {
            Serial.println(line);
            if (line.indexOf("|OPENEN%") >= 0) {
              openGate();
            }
          }
        }
      }
      client.stop();
    }
  }
}