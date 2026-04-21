import CodeBlock from '../components/CodeBlock'
import Section, { Sub, InfoBox, WarnBox, TipBox } from '../components/Section'

const sections = [
  'Arduino Architecture and Ecosystem',
  'Code Structure — setup() and loop()',
  'Digital I/O — GPIO Control',
  'Analog I/O and ADC',
  'PWM and Servo Control',
  'Serial Communication',
  'I2C and SPI',
  'Interrupts and Timers',
  'Common Sensors',
  'Libraries and Package Management',
  'EEPROM and Persistent Storage',
  'Power Management',
  'WiFi and Networking with ESP32',
  'Debugging and Serial Plotter',
  'Mini Projects — LED Matrix, Sensor Logger, WiFi Monitor',
]

export default function ArduinoPage() {
  return (
    <div>
      <div className="page-hero">
        <div className="lang-icon">🔧</div>
        <div>
          <h1>Arduino</h1>
          <p>
            Arduino is an open-source electronics platform combining a microcontroller board and
            a C++-based IDE. It hides the complexity of direct register manipulation behind a
            simple, well-documented API — perfect for prototyping and learning embedded systems.
            The ecosystem spans hundreds of boards (Uno, Mega, Nano, ESP32) and thousands of
            libraries for every sensor and actuator imaginable.
          </p>
          <div className="badges">
            <span className="badge green">Open Source</span>
            <span className="badge">C++ Based</span>
            <span className="badge yellow">Huge Ecosystem</span>
            <span className="badge purple">Hardware + Code</span>
          </div>
        </div>
      </div>

      <div className="toc">
        <div className="toc-title">Contents</div>
        <ul>
          {sections.map((t, i) => (
            <li key={t}><a href={'#s' + (i + 1)}>{i + 1}. {t}</a></li>
          ))}
        </ul>
      </div>

      <Section num="1" title="Arduino Architecture and Ecosystem">
        <CodeBlock language="bash" code={`# Popular Arduino-compatible boards
Board           MCU           Clock  Flash  RAM   Notes
──────────────────────────────────────────────────────────────────
Uno Rev3        ATmega328P    16MHz  32KB   2KB   Most popular, starter board
Nano            ATmega328P    16MHz  32KB   2KB   Compact, breadboard-friendly
Mega 2560       ATmega2560    16MHz  256KB  8KB   More pins, big projects
Leonardo        ATmega32U4    16MHz  32KB   2.5KB Native USB HID
Micro           ATmega32U4    16MHz  32KB   2.5KB Micro size, native USB
Due             ATSAM3X8E     84MHz  512KB  96KB  32-bit ARM
ESP32 (via IDE) Xtensa LX6   240MHz 4MB    520KB WiFi+BT, IoT powerhouse
ESP8266 (Wemos) Xtensa L106  80MHz  4MB    80KB  WiFi, cheaper than ESP32
RP2040 (Pico)   Dual ARM M0+ 133MHz 2MB    264KB Raspberry Pi's MCU chip

# Board pin types (Arduino Uno)
Digital I/O: 14 pins (D0-D13)  — HIGH/LOW, 5V logic
  PWM capable: D3, D5, D6, D9, D10, D11 (~490Hz or ~980Hz)
Analog input: 6 pins (A0-A5)  — 10-bit ADC, 0-5V
Power pins: 5V, 3.3V, GND, VIN (input 7-12V)
UART: D0 (RX), D1 (TX)
SPI: D10 (CS), D11 (MOSI), D12 (MISO), D13 (SCK)
I2C: A4 (SDA), A5 (SCL)
Interrupt pins: D2 (INT0), D3 (INT1)`} />
      </Section>

      <Section num="2" title="Code Structure — setup() and loop()">
        <InfoBox>Arduino code is C++ with two required functions: <code>setup()</code> runs once at startup, <code>loop()</code> runs continuously. There is no main() — the Arduino framework provides it.</InfoBox>
        <CodeBlock language="c" code={`// Minimal Arduino sketch
void setup() {
    // Called once: initialize pins, serial, libraries
    Serial.begin(9600);           // start serial at 9600 baud
    pinMode(LED_BUILTIN, OUTPUT); // configure built-in LED as output
    Serial.println("Initialized");
}

void loop() {
    // Called continuously — do NOT put long blocking delays here
    // in production code (use millis() for non-blocking timing)
    digitalWrite(LED_BUILTIN, HIGH);
    delay(1000);
    digitalWrite(LED_BUILTIN, LOW);
    delay(1000);
}

// ── Non-blocking timing with millis() ─────────────────────────────
// delay() blocks everything — bad for responsive code
// Use millis() instead (like Java's System.currentTimeMillis())

unsigned long last_blink = 0;
bool led_state = false;
const unsigned long BLINK_INTERVAL = 500;

void loop() {
    unsigned long now = millis();

    // Blink LED every 500ms without blocking
    if (now - last_blink >= BLINK_INTERVAL) {
        last_blink = now;
        led_state = !led_state;
        digitalWrite(LED_BUILTIN, led_state);
    }

    // Can do other things here — not blocked!
    read_sensors();
    check_buttons();
}`} />
      </Section>

      <Section num="3" title="Digital I/O — GPIO Control">
        <CodeBlock language="c" code={`// Configure pin mode
pinMode(13, OUTPUT);             // output: can drive HIGH/LOW
pinMode(2,  INPUT);              // input: read external signal
pinMode(3,  INPUT_PULLUP);       // input with internal 20kΩ pull-up

// Write
digitalWrite(13, HIGH);  // 5V (or 3.3V on 3.3V boards)
digitalWrite(13, LOW);   // 0V

// Read
int val = digitalRead(2);   // returns HIGH (1) or LOW (0)

// ── Button with debounce ──────────────────────────────────────────
#define BUTTON_PIN 2
#define DEBOUNCE_MS 20

bool last_stable = HIGH;
bool last_read   = HIGH;
unsigned long last_debounce_time = 0;
int press_count = 0;

void loop() {
    bool reading = digitalRead(BUTTON_PIN);

    if (reading != last_read) {
        last_debounce_time = millis();
        last_read = reading;
    }

    if ((millis() - last_debounce_time) > DEBOUNCE_MS) {
        if (reading != last_stable) {
            last_stable = reading;
            if (last_stable == LOW) {  // button just pressed
                press_count++;
                Serial.println(press_count);
            }
        }
    }
}

// ── Shift register (74HC595) — expand to 8+ outputs from 3 pins ──
void shift_out_value(uint8_t val) {
    digitalWrite(LATCH_PIN, LOW);
    shiftOut(DATA_PIN, CLOCK_PIN, MSBFIRST, val);
    digitalWrite(LATCH_PIN, HIGH);
}`} />
      </Section>

      <Section num="4" title="Analog I/O and ADC">
        <CodeBlock language="c" code={`// analogRead returns 0-1023 (10-bit) for 0-5V input
int raw = analogRead(A0);
float voltage = raw * (5.0 / 1023.0);

// ── Common sensors via analogRead ─────────────────────────────────
// Photoresistor (light sensor) — voltage changes with light
int light = analogRead(A1);
Serial.print("Light: ");
Serial.println(light);  // 0 = dark, ~800-1000 = bright

// Potentiometer (variable resistor)
int pot = analogRead(A2);
int angle = map(pot, 0, 1023, 0, 270);  // map to 0-270 degrees
// map(value, fromLow, fromHigh, toLow, toHigh)

// NTC Thermistor (10kΩ at 25°C, in voltage divider with 10kΩ)
int raw_therm = analogRead(A3);
float voltage_therm = raw_therm * 5.0 / 1023.0;
float resistance = 10000.0 * voltage_therm / (5.0 - voltage_therm);
// Steinhart-Hart equation (simplified Beta equation):
float beta = 3950.0;  // from datasheet
float temp_k = 1.0 / (1.0/298.15 + log(resistance/10000.0)/beta);
float temp_c = temp_k - 273.15;

// Joystick (2 axes + button)
int joy_x = analogRead(A4);  // 0-1023, center ~512
int joy_y = analogRead(A5);
bool joy_btn = !digitalRead(JOY_BTN_PIN);  // active LOW

// Sound sensor / microphone
int mic = analogRead(A0);
int volume = abs(mic - 512);  // deviation from center

// ── analogWrite — DAC on some boards ──────────────────────────────
// Due has true 12-bit DAC on DAC0 and DAC1
analogWriteResolution(12);   // 0-4095 instead of 0-255
analogWrite(DAC0, 2048);     // 1.65V (midpoint)`} />
      </Section>

      <Section num="5" title="PWM and Servo Control">
        <CodeBlock language="c" code={`// ── analogWrite (PWM) ─────────────────────────────────────────────
// Only on PWM pins (3, 5, 6, 9, 10, 11 on Uno)
// 8-bit: 0 = 0%, 255 = 100% duty cycle

// LED brightness
for (int i = 0; i <= 255; i++) {
    analogWrite(9, i);
    delay(5);  // fade in
}

// DC motor speed (with L298N driver)
analogWrite(MOTOR_PIN, 200);  // ~78% speed forward
analogWrite(MOTOR_PIN, 0);    // stop
digitalWrite(DIR_PIN, HIGH);  // direction forward
digitalWrite(DIR_PIN, LOW);   // direction reverse

// ── Servo motor ───────────────────────────────────────────────────
#include <Servo.h>
Servo servo1;
Servo servo2;

void setup() {
    servo1.attach(9);   // attach to PWM pin
    servo2.attach(10);
}

void loop() {
    servo1.write(0);    // 0 degrees
    delay(1000);
    servo1.write(90);   // center position
    delay(1000);
    servo1.write(180);  // 180 degrees
    delay(1000);

    // Sweep smoothly
    for (int pos = 0; pos <= 180; pos++) {
        servo2.write(pos);
        delay(15);
    }
}

// ── Buzzer — tone generation ──────────────────────────────────────
// passive buzzer: needs frequency signal
tone(8, 440);         // 440 Hz on pin 8 (A4 musical note)
delay(500);
tone(8, 880);         // 880 Hz (one octave up)
delay(500);
noTone(8);            // stop

// Play a melody
int notes[] = {262, 294, 330, 349, 392};   // C D E F G
for (int n : notes) {
    tone(8, n, 300);  // note, frequency, duration ms
    delay(350);
}`} />
      </Section>

      <Section num="6" title="Serial Communication">
        <CodeBlock language="c" code={`void setup() {
    Serial.begin(115200);   // use 115200 for faster data
}

// ── Sending data ──────────────────────────────────────────────────
Serial.print("Value: ");      // no newline
Serial.println(42);           // with newline
Serial.print(3.14, 4);        // float with 4 decimal places
Serial.printf("Temp: %.2f°C\\n", temp);  // printf-style (ESP32/Teensy)

// ── Receiving data ─────────────────────────────────────────────────
if (Serial.available() > 0) {
    char c = Serial.read();
    // or read until newline:
    String line = Serial.readStringUntil('\\n');
    int val = line.toInt();
}

// Parse commands from serial (e.g., "LED:1\\n", "PWM:200\\n")
String cmd = Serial.readStringUntil('\\n');
cmd.trim();
if (cmd.startsWith("LED:")) {
    int state = cmd.substring(4).toInt();
    digitalWrite(LED_BUILTIN, state);
} else if (cmd.startsWith("PWM:")) {
    int duty = cmd.substring(4).toInt();
    analogWrite(9, constrain(duty, 0, 255));
}

// ── Software serial — extra UART on any pins ──────────────────────
#include <SoftwareSerial.h>
SoftwareSerial gpsSerial(4, 5);  // RX=pin4, TX=pin5
gpsSerial.begin(9600);
while (gpsSerial.available()) {
    char c = gpsSerial.read();
    Serial.print(c);  // forward GPS data to USB serial
}

// ── Serial CSV logging ─────────────────────────────────────────────
// Copy-paste from Serial Monitor into Excel / Python pandas
void log_csv(float temp, float hum, int light) {
    Serial.print(millis()); Serial.print(",");
    Serial.print(temp, 2);  Serial.print(",");
    Serial.print(hum, 1);   Serial.print(",");
    Serial.println(light);
}`} />
      </Section>

      <Section num="7" title="I2C and SPI">
        <Sub title="I2C — two-wire protocol">
          <CodeBlock language="c" code={`#include <Wire.h>

void setup() { Wire.begin(); }  // join I2C bus as master

// Scan for I2C devices (find addresses)
void i2c_scan() {
    Serial.println("Scanning...");
    for (uint8_t addr = 1; addr < 127; addr++) {
        Wire.beginTransmission(addr);
        if (Wire.endTransmission() == 0) {
            Serial.print("Found: 0x");
            Serial.println(addr, HEX);
        }
    }
}

// BME280 temperature/humidity/pressure sensor (address 0x76 or 0x77)
// Use Adafruit BME280 library for easy access
#include <Adafruit_BME280.h>
Adafruit_BME280 bme;
bme.begin(0x76);
float temp     = bme.readTemperature();    // °C
float pressure = bme.readPressure() / 100; // hPa
float humidity = bme.readHumidity();       // %RH

// MPU6050 accelerometer/gyroscope
#include <MPU6050.h>
MPU6050 mpu;
mpu.initialize();
int16_t ax, ay, az, gx, gy, gz;
mpu.getMotion6(&ax, &ay, &az, &gx, &gy, &gz);
float accel_x = ax / 16384.0;  // g (±2g range)`} />
        </Sub>
        <Sub title="SPI — high-speed serial">
          <CodeBlock language="c" code={`#include <SPI.h>

// SSD1306 OLED display (also has I2C version)
// Use Adafruit GFX + SSD1306 library
#include <Adafruit_SSD1306.h>
Adafruit_SSD1306 display(128, 64, &SPI, DC_PIN, RST_PIN, CS_PIN);
display.begin(SSD1306_SWITCHCAPVCC);
display.clearDisplay();
display.setTextSize(2);
display.setTextColor(SSD1306_WHITE);
display.setCursor(0, 0);
display.println("Hello!");
display.println("Arduino");
display.display();  // push buffer to screen

// SD card (SPI, CS = pin 10)
#include <SD.h>
SD.begin(10);
File f = SD.open("data.csv", FILE_WRITE);
if (f) {
    f.print(millis()); f.print(",");
    f.println(analogRead(A0));
    f.close();
}`} />
        </Sub>
      </Section>

      <Section num="8" title="Interrupts and Timers">
        <CodeBlock language="c" code={`// ── External interrupt (pin change) ──────────────────────────────
volatile int pulse_count = 0;
volatile unsigned long last_pulse_time = 0;

void pulse_isr() {
    pulse_count++;
    last_pulse_time = micros();
}

// Attach interrupt on pin 2 (INT0) rising edge
attachInterrupt(digitalPinToInterrupt(2), pulse_isr, RISING);
// Modes: RISING, FALLING, CHANGE, LOW

// Rotary encoder (2 interrupt pins)
volatile int encoder_pos = 0;
void encoder_isr() {
    bool b = digitalRead(ENCODER_B_PIN);
    encoder_pos += (b == HIGH) ? 1 : -1;
}
attachInterrupt(digitalPinToInterrupt(ENCODER_A_PIN), encoder_isr, RISING);

// ── Hardware timer interrupt (TimerOne library) ────────────────────
#include <TimerOne.h>
volatile bool tick = false;

void timer_isr() {
    tick = true;  // set flag in ISR, handle in loop
}

void setup() {
    Timer1.initialize(10000);   // 10000 µs = 100 Hz
    Timer1.attachInterrupt(timer_isr);
}

void loop() {
    if (tick) {
        tick = false;
        // Do periodic work at exactly 100 Hz
        sample_sensor();
    }
}

// ── Watchdog timer — auto-reset on hang ──────────────────────────
#include <avr/wdt.h>
wdt_enable(WDTO_2S);   // reset after 2 seconds if not petted
// In loop(): wdt_reset();   // call at least every 2s`} />
      </Section>

      <Section num="9" title="Common Sensors">
        <Sub title="Temperature and humidity">
          <CodeBlock language="c" code={`// DHT22 — digital temperature + humidity (1-Wire protocol)
#include <DHT.h>
DHT dht(2, DHT22);  // data pin 2, sensor type DHT22
dht.begin();

float temp = dht.readTemperature();    // °C
float hum  = dht.readHumidity();       // %
if (isnan(temp) || isnan(hum)) {
    Serial.println("DHT read failed");
    return;
}
float heat_index = dht.computeHeatIndex(temp, hum, false);

// DS18B20 — 1-Wire digital temperature, waterproof, multiple on one pin
#include <OneWire.h>
#include <DallasTemperature.h>
OneWire ow(4);
DallasTemperature sensors(&ow);
sensors.begin();
sensors.requestTemperatures();
float t = sensors.getTempCByIndex(0);   // first sensor
// Can address individual sensors by 64-bit address for multiple on same wire`} />
        </Sub>
        <Sub title="Distance, motion, gas">
          <CodeBlock language="c" code={`// HC-SR04 Ultrasonic distance sensor
#define TRIG_PIN 9
#define ECHO_PIN 10

float read_distance_cm() {
    digitalWrite(TRIG_PIN, LOW);  delayMicroseconds(2);
    digitalWrite(TRIG_PIN, HIGH); delayMicroseconds(10);
    digitalWrite(TRIG_PIN, LOW);
    long duration = pulseIn(ECHO_PIN, HIGH, 30000);  // 30ms timeout
    return duration * 0.0343 / 2;  // distance in cm (speed of sound / 2)
}

// PIR motion sensor (passive infrared)
bool motion = digitalRead(PIR_PIN);
if (motion) { Serial.println("Motion detected!"); }

// MQ-2 gas sensor (smoke, LPG, propane — analog output)
int gas_raw = analogRead(A0);
if (gas_raw > 600) {
    Serial.println("GAS DETECTED!");
    tone(BUZZER_PIN, 2000);  // alarm
}

// Light sensor (BH1750 I2C, 0-65535 lux)
#include <BH1750.h>
BH1750 lightMeter;
lightMeter.begin();
float lux = lightMeter.readLightLevel();
Serial.print(lux); Serial.println(" lux");`} />
        </Sub>
      </Section>

      <Section num="10" title="Libraries and Package Management">
        <CodeBlock language="bash" code={`# Install libraries via Arduino IDE:
# Tools → Manage Libraries → search + install

# Or via Arduino CLI:
arduino-cli lib install "Adafruit BME280 Library"
arduino-cli lib install "DHT sensor library"
arduino-cli lib install "FastLED"

# Or for PlatformIO (better for professional use):
# platformio.ini:
# [env:uno]
# platform = atmelavr
# board = uno
# framework = arduino
# lib_deps =
#     adafruit/Adafruit BME280 Library
#     fastled/FastLED
#     bblanchon/ArduinoJson@^7.0.0

# ── FastLED — control RGB LED strips ──────────────────────────────
#include <FastLED.h>
#define NUM_LEDS 60
#define DATA_PIN 6
CRGB leds[NUM_LEDS];

void setup() {
    FastLED.addLeds<WS2812B, DATA_PIN, GRB>(leds, NUM_LEDS);
    FastLED.setBrightness(50);
}
void loop() {
    leds[0] = CRGB::Red;        // first LED red
    leds[1] = CRGB(0, 255, 0);  // second LED green
    FastLED.show();              // send to LEDs
    fill_rainbow(leds, NUM_LEDS, 0, 255/NUM_LEDS);
    FastLED.show();

# ── ArduinoJson — parse JSON from APIs ──────────────────────────────
#include <ArduinoJson.h>
const char* json = '{"sensor":"temp","value":23.5}';
JsonDocument doc;
deserializeJson(doc, json);
const char* sensor = doc["sensor"];
float value = doc["value"];
Serial.println(value);  // 23.5`} />
      </Section>

      <Section num="11" title="EEPROM and Persistent Storage">
        <CodeBlock language="c" code={`#include <EEPROM.h>

// EEPROM.length() on Uno: 1024 bytes
// Write cycles: ~100,000 per address — minimize writes!

// ── Write / Read single byte ──────────────────────────────────────
EEPROM.write(0, 42);         // write byte 42 to address 0
uint8_t val = EEPROM.read(0); // read from address 0

// ── Write / Read any type (put/get) ──────────────────────────────
struct Config {
    uint8_t  brightness;
    uint16_t timeout;
    float    calibration;
    bool     debug_mode;
};

Config cfg = {50, 5000, 1.05f, false};
EEPROM.put(0, cfg);    // write struct starting at address 0

Config loaded;
EEPROM.get(0, loaded); // read struct back
Serial.println(loaded.brightness);

// ── EEPROM.update — only write if different (saves write cycles) ──
EEPROM.update(0, new_value);   // no write if already same

// ── Magic number / version check ──────────────────────────────────
#define EEPROM_MAGIC 0xABCD
uint16_t magic;
EEPROM.get(0, magic);
if (magic != EEPROM_MAGIC) {
    // First boot or format — write defaults
    EEPROM.put(0, (uint16_t)EEPROM_MAGIC);
    EEPROM.put(2, cfg);  // save default config after magic
    Serial.println("EEPROM initialized with defaults");
} else {
    EEPROM.get(2, cfg);  // load saved config
}

// ── ESP32 Preferences (more robust than raw EEPROM) ──────────────
// #include <Preferences.h>
// Preferences prefs;
// prefs.begin("config", false);  // namespace "config", read-write
// prefs.putFloat("cal", 1.05f);
// float cal = prefs.getFloat("cal", 1.0f);  // default 1.0
// prefs.end();`} />
      </Section>

      <Section num="12" title="Power Management">
        <CodeBlock language="c" code={`#include <avr/sleep.h>
#include <avr/power.h>

// ── Power reduction on AVR ────────────────────────────────────────
// Disable unused peripherals
power_adc_disable();   // ADC off (saves ~300µA)
power_twi_disable();   // I2C off
power_spi_disable();   // SPI off
power_usart0_disable();// Serial off
power_timer1_disable(); // Timer1 off

// ── Sleep modes (progressively deeper sleep) ──────────────────────
// SLEEP_MODE_IDLE          — CPU stopped, timers run (~15mA → ~10mA)
// SLEEP_MODE_ADC           — ADC conversion while sleeping
// SLEEP_MODE_PWR_DOWN      — almost everything off (~1µA) ← deepest

// Deep sleep, wake on interrupt (e.g., button press)
void setup() {
    attachInterrupt(digitalPinToInterrupt(2), wake_up_isr, LOW);
    // Wake when pin 2 goes LOW (button press)
}

volatile bool woke = false;
void wake_up_isr() { woke = true; }

void sleep_now() {
    woke = false;
    set_sleep_mode(SLEEP_MODE_PWR_DOWN);
    sleep_enable();
    sei();               // enable interrupts (needed to wake!)
    sleep_cpu();         // sleep here — next instruction runs after wake
    sleep_disable();     // after waking
}

// Typical deep sleep loop: read sensor → transmit → sleep → repeat
void loop() {
    float temp = read_temperature();
    transmit(temp);
    sleep_now();   // wake only from interrupt/watchdog
}

// ── ESP32 deep sleep (IoT use case) ──────────────────────────────
// Wake after 60 seconds
esp_sleep_enable_timer_wakeup(60 * 1000000ULL);  // µs
esp_deep_sleep_start();  // ~10µA until wake`} />
      </Section>

      <Section num="13" title="WiFi and Networking with ESP32">
        <CodeBlock language="c" code={`// ESP32 has WiFi + Bluetooth built in
// Board: "ESP32 Dev Module" in Arduino IDE
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* SSID     = "MyNetwork";
const char* PASSWORD = "MyPassword";

void setup() {
    Serial.begin(115200);
    WiFi.begin(SSID, PASSWORD);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500); Serial.print(".");
    }
    Serial.println("Connected: " + WiFi.localIP().toString());
}

// ── HTTP GET ──────────────────────────────────────────────────────
void fetch_weather() {
    HTTPClient http;
    http.begin("https://api.open-meteo.com/v1/forecast?latitude=51.5&longitude=-0.1&current_weather=true");
    int code = http.GET();

    if (code == 200) {
        JsonDocument doc;
        deserializeJson(doc, http.getStream());
        float temp = doc["current_weather"]["temperature"];
        Serial.printf("London: %.1f°C\\n", temp);
    }
    http.end();
}

// ── HTTP POST (send sensor data to API) ───────────────────────────
void send_telemetry(float temp, float hum) {
    HTTPClient http;
    http.begin("https://api.myserver.com/telemetry");
    http.addHeader("Content-Type", "application/json");
    http.addHeader("X-Device-Token", "my-secret-token");

    JsonDocument doc;
    doc["device_id"] = "esp32-001";
    doc["temperature"] = temp;
    doc["humidity"] = hum;

    String payload;
    serializeJson(doc, payload);
    int code = http.POST(payload);
    Serial.printf("POST %d\\n", code);
    http.end();
}

// ── MQTT with ESP32 ───────────────────────────────────────────────
#include <PubSubClient.h>
WiFiClient wifi;
PubSubClient mqtt(wifi);

void mqtt_setup() {
    mqtt.setServer("broker.hivemq.com", 1883);
    mqtt.connect("esp32-001");
    mqtt.subscribe("commands/esp32-001");
    mqtt.setCallback([](char* topic, byte* payload, unsigned int len) {
        Serial.print("Command: ");
        Serial.write(payload, len);
        Serial.println();
    });
}

void loop() {
    mqtt.loop();  // must call frequently
    // Publish every 30s
    static unsigned long last = 0;
    if (millis() - last > 30000) {
        last = millis();
        String msg = String("{\\\"temp\\\":") + read_temperature() + "}";
        mqtt.publish("sensors/esp32-001/telemetry", msg.c_str());
    }
}`} />
      </Section>

      <Section num="14" title="Debugging and Serial Plotter">
        <CodeBlock language="c" code={`// ── Serial Monitor tips ──────────────────────────────────────────
// Tools → Serial Monitor (Ctrl+Shift+M)
// Must match baud rate set in Serial.begin()

// Print with labels for easy reading
Serial.print("T="); Serial.print(temp);
Serial.print(" H="); Serial.print(hum);
Serial.print(" L="); Serial.println(light);

// ── Serial Plotter — visualize data in real time ──────────────────
// Tools → Serial Plotter — plots one value per line, or labeled values
// Print comma-separated values to see multiple channels
Serial.print(temp); Serial.print(",");
Serial.print(hum);  Serial.print(",");
Serial.println(light);  // newline = new data point

// Print labeled values (shows in legend)
Serial.print("Temperature:"); Serial.print(temp);
Serial.print(",Humidity:"); Serial.print(hum);
Serial.print(",Light:"); Serial.println(light);

// ── Debug macros — compile out in production ──────────────────────
#define DEBUG_MODE 1
#if DEBUG_MODE
  #define LOG(x)    Serial.println(x)
  #define LOGF(...) Serial.printf(__VA_ARGS__)
#else
  #define LOG(x)    ((void)0)
  #define LOGF(...) ((void)0)
#endif

LOG("Button pressed");
LOGF("ADC = %d, V = %.2f\\n", raw, voltage);

// ── Stack/heap usage check ────────────────────────────────────────
void check_memory() {
    extern int __heap_start, *__brkval;
    int v;
    int free_mem = (int)&v - (__brkval == 0 ? (int)&__heap_start : (int)__brkval);
    Serial.print("Free RAM: ");
    Serial.print(free_mem);
    Serial.println(" bytes");
}`} />
      </Section>

      <Section num="15" title="Mini Projects — LED Matrix, Sensor Logger, WiFi Monitor">
        <Sub title="Project 1: 8×8 LED Matrix scrolling text">
          <CodeBlock language="c" code={`// MAX7219 + 8x8 LED matrix, SPI connected
// Library: LedControl
#include <LedControl.h>

LedControl lc(DATA_PIN, CLK_PIN, CS_PIN, 1);  // 1 MAX7219

// 5x7 font for digits 0-9 (truncated to 0-3 for example)
const byte DIGITS[10][7] = {
    {0x3E, 0x51, 0x49, 0x45, 0x3E, 0, 0},  // 0
    {0x00, 0x42, 0x7F, 0x40, 0x00, 0, 0},  // 1
    {0x42, 0x61, 0x51, 0x49, 0x46, 0, 0},  // 2
    // ...
};

void setup() {
    lc.shutdown(0, false);    // wake up
    lc.setIntensity(0, 4);    // brightness 0-15
    lc.clearDisplay(0);
}

void display_digit(int d) {
    for (int row = 0; row < 8; row++) {
        lc.setRow(0, row, (row < 7) ? DIGITS[d][row] : 0);
    }
}`} />
        </Sub>
        <Sub title="Project 2: Sensor data logger to SD card">
          <CodeBlock language="c" code={`#include <SD.h>
#include <DHT.h>

DHT dht(2, DHT22);
const int SD_CS = 10;
unsigned long log_interval = 10000;  // log every 10s
unsigned long last_log = 0;

void setup() {
    Serial.begin(9600);
    dht.begin();
    if (!SD.begin(SD_CS)) {
        Serial.println("SD init failed!");
        while (1) { delay(100); }
    }

    // Write CSV header
    File f = SD.open("log.csv", FILE_WRITE);
    if (f) {
        f.println("millis,temperature,humidity");
        f.close();
    }
    Serial.println("Logger started");
}

void loop() {
    if (millis() - last_log >= log_interval) {
        last_log = millis();

        float t = dht.readTemperature();
        float h = dht.readHumidity();

        if (!isnan(t) && !isnan(h)) {
            File f = SD.open("log.csv", FILE_WRITE);
            if (f) {
                f.print(millis()); f.print(",");
                f.print(t, 2);    f.print(",");
                f.println(h, 1);
                f.close();
                Serial.printf("Logged: %.2f°C %.1f%%\\n", t, h);
            }
        }
    }
}`} />
        </Sub>
        <Sub title="Project 3: WiFi temperature monitor (ESP32 + web dashboard)">
          <CodeBlock language="c" code={`// ESP32 hosts a tiny web server — visit device IP in browser
#include <WiFi.h>
#include <WebServer.h>
#include <DHT.h>

WebServer server(80);
DHT dht(4, DHT22);
float temperature = 0, humidity = 0;

void handle_root() {
    String html = R"(
<!DOCTYPE html><html>
<head><title>ESP32 Monitor</title>
<meta http-equiv='refresh' content='5'>  <!-- refresh every 5s -->
<style>body{font-family:sans-serif;text-align:center;padding:40px}
.value{font-size:3em;color:#2196F3}</style></head>
<body>
<h1>ESP32 Sensor</h1>
<p>Temperature: <span class='value'>)" + String(temperature, 1) + R"(°C</span></p>
<p>Humidity: <span class='value'>)" + String(humidity, 0) + R"(%</span></p>
<p><small>Updates every 5 seconds</small></p>
</body></html>
)";
    server.send(200, "text/html", html);
}

void handle_api() {
    String json = "{\"temperature\":" + String(temperature, 2) +
                  ",\"humidity\":" + String(humidity, 1) + "}";
    server.send(200, "application/json", json);
}

void setup() {
    dht.begin();
    WiFi.begin("SSID", "PASSWORD");
    while (WiFi.status() != WL_CONNECTED) delay(500);
    Serial.println("IP: " + WiFi.localIP().toString());

    server.on("/",    handle_root);
    server.on("/api", handle_api);
    server.begin();
}

void loop() {
    server.handleClient();

    static unsigned long last = 0;
    if (millis() - last > 5000) {
        last = millis();
        temperature = dht.readTemperature();
        humidity    = dht.readHumidity();
    }
}`} />
        </Sub>
      </Section>
    </div>
  )
}
