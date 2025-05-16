/*
LOOP A (NO) - pin 2
LOOP A (COM) - gnd
LOOP B (COM) - gnd
LOOP B (NO) - pin 4

ethernet connection-


relay - pin 9

*/

#include <SPI.h>
#include <Ethernet.h>

#define LOOP_A_PIN 2
#define LOOP_B_PIN 4
#define relayPin 9

unsigned long detectionTimestamp = 0;
unsigned long timeout = 180000;

bool loopADetected = false;
bool loopBDetected = false;
bool sequenceComplete = false;

byte mac[] = {0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED};
IPAddress ip(192, 168, 1, 158);

EthernetServer server(7000);
EthernetClient client;

String clientData = "";

boolean IsClientConnected = false;

unsigned long currentMillis, previousMillis, reconnectMillis;
const unsigned long healthPacketInterval = 3000;
const unsigned long reconnectInterval = 5000;

void setup() {
  Ethernet.begin(mac, ip);
  server.begin();
  Serial.begin(9600);

  while (!Serial) {
    ; // wait for the serial port to connect, needed for native USB port only
  }

  Serial.print("Machine Gate IP: ");
  Serial.println(Ethernet.localIP());

  pinMode(LOOP_A_PIN, INPUT_PULLUP);
  pinMode(LOOP_B_PIN, INPUT_PULLUP);
  pinMode(relayPin, OUTPUT);
  digitalWrite(relayPin, HIGH);

  IsClientConnected = false;
}

void resetSequence() {
  loopADetected = false;
  loopBDetected = false;
  detectionTimestamp = 0;
}

void sendEntryExitData(bool isEntry) {
  byte gateID = 0x02;
  Serial.print("Sending data: Gate ");
  Serial.print(gateID);
  Serial.print(isEntry ? " Entry" : " Exit");
  Serial.println();

  if (!client.connected()) {
    Serial.println("Client not connected. Attempting to reconnect...");
    connectToServer();
  }

  if (client.connected()) {
    client.print(gateID);
    client.print(isEntry ? " entry" : " exit");
  } else {
    Serial.println("Failed to send data: Client not connected.");
  }
}

void checkLoopSequence() {
  if (sequenceComplete) {
    delay(1000);
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

void connectToServer() {
  if (client.connect("192.168.1.157", 7000)) {
    Serial.println("Connected to server.");
    client.println("Connected to Arduino");
    IsClientConnected = true;
  } else {
    Serial.println("Connection failed, trying again...");
    IsClientConnected = false;
  }
}

void loop() {
  if (!IsClientConnected) {
    if (!client.connected()) {
      client.stop();
    }
    
    EthernetClient newClient = server.available();
    if (newClient) {
      client = newClient;
      IsClientConnected = true;
      client.flush();
      Serial.println("Client Connected");
      client.println("Connected to Arduino");
    }
  }

  if (IsClientConnected) {
    if (client.available() > 0) {
      char thisChar = client.read();
      if (thisChar == '|') {
        clientData = "";
      } else if (thisChar == '%') {
        Serial.println(clientData);
        if (clientData.equals("OPENEN")) {
          Serial.println("Barrier is opening");
          digitalWrite(relayPin, LOW);
          delay(500);
          digitalWrite(relayPin, HIGH);
          delay(500);
        }
      } else {
        clientData += thisChar;
      }
    }
    
    currentMillis = millis();
    if (currentMillis - previousMillis >= healthPacketInterval) {
      previousMillis = currentMillis;
      if (client.connected()) {
        client.println("|HLT%");
      } else {
        Serial.println("Client disconnected. Attempting to reconnect...");
        IsClientConnected = false;
        connectToServer();
      }
    }
    
    if (!client.connected()) {
      Serial.println("Client Disconnected");
      IsClientConnected = false;
      reconnectMillis = millis();
    }
    
    if (!IsClientConnected && (millis() - reconnectMillis >= reconnectInterval)) {
      Serial.println("Attempting to reconnect...");
      connectToServer();
      reconnectMillis = millis();
    }
  }
  checkLoopSequence();
}
