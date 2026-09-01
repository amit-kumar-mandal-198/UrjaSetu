#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// API Endpoints
const char* api_url_telemetry = "http://192.168.1.100:8001/api/v1/telemetry";
const char* api_url_commands = "http://192.168.1.100:8001/api/v1/commands/next?device_id=1";
const char* api_url_ack = "http://192.168.1.100:8001/api/v1/commands/";

const int RELAY_PIN = 23;
const int DEVICE_ID = 1;
bool is_actuator_on = false;
String last_command_id = "";

unsigned long last_telemetry_time = 0;
const unsigned long telemetry_interval = 10000; // 10 seconds

unsigned long last_command_time = 0;
const unsigned long command_interval = 5000; // 5 seconds

void setup() {
  Serial.begin(115200);
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW); // Default off

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    unsigned long current_time = millis();
    
    // 1. Send Telemetry
    if (current_time - last_telemetry_time >= telemetry_interval) {
      sendTelemetry();
      last_telemetry_time = current_time;
    }
    
    // 2. Poll for Commands
    if (current_time - last_command_time >= command_interval) {
      pollCommands();
      last_command_time = current_time;
    }
  }
}

void sendTelemetry() {
  HTTPClient http;
  http.begin(api_url_telemetry);
  http.addHeader("Content-Type", "application/json");

  // Simulate reading sensors
  float voltage = 230.0;
  float current = is_actuator_on ? 6.95 : 0.0;
  float power = voltage * current / 1000.0; // kW
  
  float home_consumption = 1.6 + power;
  float solar_power = 2.4;
  float grid_export = solar_power > home_consumption ? solar_power - home_consumption : 0;
  float grid_import = home_consumption > solar_power ? home_consumption - solar_power : 0;

  StaticJsonDocument<200> doc;
  doc["device_id"] = DEVICE_ID;
  doc["voltage"] = voltage;
  doc["current"] = current;
  doc["power"] = power;
  doc["home_consumption"] = home_consumption;
  doc["solar_power"] = solar_power;
  doc["grid_import"] = grid_import;
  doc["grid_export"] = grid_export;
  doc["device_state"] = is_actuator_on ? "ON" : "OFF";
  doc["sensor_health"] = "OK";
  
  String requestBody;
  serializeJson(doc, requestBody);
  
  int httpResponseCode = http.Post(requestBody);
  Serial.print("Telemetry Sent, Response: ");
  Serial.println(httpResponseCode);
  
  http.end();
}

void pollCommands() {
  HTTPClient http;
  http.begin(api_url_commands);
  
  int httpResponseCode = http.GET();
  if (httpResponseCode > 0) {
    String payload = http.getString();
    Serial.println("Command Poll Response: " + payload);
    
    StaticJsonDocument<500> doc;
    DeserializationError error = deserializeJson(doc, payload);
    
    if (!error && doc["command_id"]) {
      String command_id = doc["command_id"].as<String>();
      String action = doc["action"].as<String>();
      
      // Idempotency check
      if (command_id != last_command_id) {
        executeCommand(command_id, action);
        last_command_id = command_id;
      }
    }
  }
  http.end();
}

void executeCommand(String command_id, String action) {
  Serial.println("Executing Command: " + action);
  
  if (action == "TURN_ON") {
    digitalWrite(RELAY_PIN, HIGH);
    is_actuator_on = true;
  } else if (action == "TURN_OFF") {
    digitalWrite(RELAY_PIN, LOW);
    is_actuator_on = false;
  }
  
  // Acknowledge command to backend
  ackCommand(command_id);
}

void ackCommand(String command_id) {
  HTTPClient http;
  String url = String(api_url_ack) + command_id + "/ack";
  http.begin(url);
  
  int httpResponseCode = http.POST("");
  Serial.print("Ack Sent, Response: ");
  Serial.println(httpResponseCode);
  
  http.end();
}
