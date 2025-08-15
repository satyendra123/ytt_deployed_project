#include <SoftwareSerial.h>

#define LOOP_A_PIN 6
#define LOOP_B_PIN 7
#define relayPin 9

unsigned long detectionTimestamp = 0;
unsigned long timeout = 120000;
unsigned long lastSequenceResetTime = 0;

unsigned long lastHeartbeatTime = 0;
const unsigned long heartbeatInterval = 3000;

bool loopADetected = false;
bool loopBDetected = false;
bool sequenceComplete = false;

const int gate_id = 1;

String receivedString = "";

void setup() {
  Serial.begin(9600);
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
  String msg = "|AA|";
  msg += String(gate_id);
  msg += isEntry ? "|ENTRY|FF|" : "|EXIT|FF|";
  Serial.println(msg);
}

void openGate() {
  digitalWrite(relayPin, LOW);
  delay(1000);
  digitalWrite(relayPin, HIGH);
}

void checkLoopSequence() {
  bool loopAState = (digitalRead(LOOP_A_PIN) == LOW);
  bool loopBState = (digitalRead(LOOP_B_PIN) == LOW);

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

  if (loopAState && loopBState) return;

  if ((loopADetected || loopBDetected) && (millis() - detectionTimestamp > timeout)) {
    Serial.println("Timeout: Second loop not detected. Resetting...");
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

void checkIncomingCommand() {
  if (Serial.available()) {
    String incoming = Serial.readStringUntil('%');
    incoming.trim();
    incoming += '%';
    Serial.print(incoming);
    if (incoming == "|OPENEN%") {
      openGate();
    }
  }
}

void sendHeartbeat() {
  if (millis() - lastHeartbeatTime >= heartbeatInterval) {
    lastHeartbeatTime = millis();
    Serial.println("|HLT%");
  }
}

void loop() {
  checkLoopSequence();
  checkIncomingCommand();
  sendHeartbeat();
}
