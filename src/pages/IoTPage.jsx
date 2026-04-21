import CodeBlock from '../components/CodeBlock'
import Section, { Sub, InfoBox, WarnBox, TipBox } from '../components/Section'

const sections = [
  'IoT Architecture Overview',
  'MQTT Protocol',
  'CoAP Protocol',
  'MQTT with Python (paho-mqtt)',
  'MQTT with Node.js (mqtt.js)',
  'HTTP for IoT Devices',
  'Device-to-Cloud Communication',
  'Edge Computing',
  'Data Formats — JSON, CBOR, Protobuf',
  'Time Series Data',
  'Power and Bandwidth Constraints',
  'Security in IoT',
  'IoT Platforms — AWS IoT, Azure IoT Hub',
  'Testing and Simulation',
  'Mini Project: Temperature Monitor System',
]

export default function IoTPage() {
  return (
    <div>
      <div className="page-hero">
        <div className="lang-icon">📡</div>
        <div>
          <h1>IoT Networking</h1>
          <p>
            The Internet of Things connects physical devices — sensors, actuators, embedded
            computers — to the internet. IoT networking is different from web networking:
            devices are constrained (low power, low memory, unreliable connections), data flows
            continuously, and security is critical because devices are physically accessible.
          </p>
          <div className="badges">
            <span className="badge green">MQTT</span>
            <span className="badge">CoAP</span>
            <span className="badge yellow">Edge Computing</span>
            <span className="badge purple">Device-to-Cloud</span>
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

      <Section num="1" title="IoT Architecture Overview">
        <CodeBlock language="bash" code={`# Three-tier IoT architecture

┌─────────────────────────────────────────────────────────────┐
│ CLOUD TIER — Analytics, storage, dashboards, commands       │
│  AWS IoT / Azure IoT / Google Cloud IoT                     │
│  Time-series DB (InfluxDB, TimescaleDB)                     │
│  Dashboard (Grafana, Kibana)                                │
└────────────────────────────┬────────────────────────────────┘
                             │ MQTT / HTTPS / WebSocket
┌────────────────────────────▼────────────────────────────────┐
│ EDGE TIER — Local processing, reduce cloud traffic          │
│  Raspberry Pi / NVIDIA Jetson / Industrial PC               │
│  Edge broker (local MQTT), filtering, aggregation           │
│  Local ML inference, anomaly detection                      │
└────────────────────────────┬────────────────────────────────┘
                             │ MQTT / CoAP / Modbus / CAN bus
┌────────────────────────────▼────────────────────────────────┐
│ DEVICE TIER — Sensors, actuators, embedded systems          │
│  Arduino, ESP32/8266, STM32, Raspberry Pi Pico              │
│  Temperature, humidity, pressure, motion sensors            │
│  Relay boards, motors, LEDs, displays                       │
└─────────────────────────────────────────────────────────────┘

# Communication protocols by use case
MQTT      — publish/subscribe, low bandwidth, IoT standard
CoAP      — REST-like but UDP, for very constrained devices
HTTP/REST — simple devices with good connectivity
WebSocket — real-time bidirectional (dashboards)
LoRaWAN   — long range, very low bandwidth, battery devices (IoT sensors in fields)
Zigbee/Z-Wave — mesh networking, home automation
BLE       — short range, phone to device`} />
      </Section>

      <Section num="2" title="MQTT Protocol">
        <InfoBox>MQTT (Message Queuing Telemetry Transport) is the standard protocol for IoT. It runs over TCP, uses a publish-subscribe model, and is designed for unreliable networks and constrained devices. Designed at IBM for oil pipeline monitoring in the 1990s.</InfoBox>
        <Sub title="Core concepts">
          <CodeBlock language="bash" code={`# Key concepts:
# Broker — central server that routes messages (Mosquitto, HiveMQ, AWS IoT Core)
# Publisher — device that sends messages to a topic
# Subscriber — device/app that receives messages from a topic
# Topic — hierarchical string like a file path: home/living-room/temperature

# Topic wildcards
home/+/temperature      # + matches one level: home/bedroom/temperature ✅
home/#                  # # matches everything: home/any/thing/here ✅
sensors/#               # all messages under sensors/

# QoS (Quality of Service) levels
QoS 0 — At most once  (fire and forget, possible loss)
QoS 1 — At least once (guaranteed delivery, possible duplicates)
QoS 2 — Exactly once  (guaranteed, no duplicates, slowest)

# Use QoS 0 for: frequent sensor data (losing one reading is OK)
# Use QoS 1 for: commands, alerts
# Use QoS 2 for: billing, critical events

# Retained messages — broker stores last message, sent to new subscribers
# Will messages — sent if device disconnects unexpectedly (last will and testament)

# Install Mosquitto broker (MQTT broker)
sudo apt install mosquitto mosquitto-clients
mosquitto -v     # start with verbose logging

# Test with CLI
mosquitto_sub -h localhost -t "sensors/#" -v      # subscribe
mosquitto_pub -h localhost -t "sensors/temp" -m "23.5"  # publish`} />
        </Sub>
        <Sub title="MQTT packet structure">
          <CodeBlock language="bash" code={`# MQTT message structure (very compact!)
Fixed header: 2-5 bytes
  - Message type (4 bits): CONNECT, PUBLISH, SUBSCRIBE, etc.
  - Flags (4 bits): QoS, retain, dup
  - Remaining length (1-4 bytes, variable-length encoding)

Variable header: depends on message type
  - Topic name (UTF-8 string, 2 byte length prefix)
  - Packet ID (2 bytes, for QoS 1 and 2)

Payload: the actual message data

# Minimum PUBLISH overhead: ~4 bytes (vs 200+ bytes for HTTP headers)
# Max message size: 256MB (but typical IoT: <1KB)`} />
        </Sub>
      </Section>

      <Section num="3" title="CoAP Protocol">
        <InfoBox>CoAP (Constrained Application Protocol, RFC 7252) is REST-like but runs over UDP. Designed for microcontrollers with as little as 10KB RAM. Uses 4-byte headers (vs 200+ bytes for HTTP).</InfoBox>
        <CodeBlock language="bash" code={`# CoAP mirrors HTTP but is binary and runs over UDP port 5683

# Methods: GET, POST, PUT, DELETE (same semantics as HTTP)
# Response codes: 2.05 Content, 4.04 Not Found, etc.

# Message types:
CON (Confirmable)    — reliable, requires ACK
NON (Non-confirmable)— fire-and-forget, for sensor readings
ACK (Acknowledgement)— response to CON
RST (Reset)          — reject message

# CoAP observe extension — like MQTT subscribe but for CoAP
# Client subscribes to resource, server sends updates automatically
# GET coap://device/temperature?observe   → stream of temperature readings

# CoAP vs MQTT:
# CoAP:  REST model, request-response, client-to-server
# MQTT:  pub/sub, broker-mediated, many-to-many
# Use CoAP when: device is the server (expose resources to query)
# Use MQTT when: device is a publisher (stream data to cloud)

# Python CoAP with aiocoap
# pip install aiocoap
# import aiocoap
# context = await aiocoap.Context.create_client_context()
# request = aiocoap.Message(code=aiocoap.GET, uri='coap://device/temperature')
# response = await context.request(request).response`} />
      </Section>

      <Section num="4" title="MQTT with Python (paho-mqtt)">
        <CodeBlock language="python" code={`# pip install paho-mqtt
import paho.mqtt.client as mqtt
import json
import time
import random

BROKER = "localhost"
PORT   = 1883
CLIENT_ID = "temp-sensor-01"

# ── Sensor (Publisher) ──────────────────────────────────────────────
def create_sensor():
    client = mqtt.Client(CLIENT_ID)
    client.username_pw_set("sensor", "secret")  # optional auth

    # Will message — sent if we disconnect unexpectedly
    client.will_set(f"devices/{CLIENT_ID}/status", "offline", qos=1, retain=True)

    def on_connect(client, userdata, flags, rc):
        if rc == 0:
            print("Connected to broker")
            # Announce online status
            client.publish(f"devices/{CLIENT_ID}/status", "online", qos=1, retain=True)
        else:
            print(f"Connection failed: {rc}")

    client.on_connect = on_connect
    client.connect(BROKER, PORT, keepalive=60)
    client.loop_start()   # background thread for network I/O
    return client

def publish_readings(client):
    while True:
        payload = {
            "device": CLIENT_ID,
            "temperature": round(20 + random.uniform(-2, 5), 2),
            "humidity":    round(50 + random.uniform(-10, 10), 1),
            "timestamp":   time.time(),
        }
        client.publish(
            f"sensors/{CLIENT_ID}/telemetry",
            json.dumps(payload),
            qos=0    # fire-and-forget for frequent readings
        )
        print(f"Published: {payload}")
        time.sleep(5)

# ── Dashboard (Subscriber) ──────────────────────────────────────────
def create_dashboard():
    client = mqtt.Client("dashboard-01")

    def on_connect(client, userdata, flags, rc):
        print("Dashboard connected")
        client.subscribe("sensors/#", qos=0)     # all sensor data
        client.subscribe("devices/#", qos=1)     # device status (important)

    def on_message(client, userdata, msg):
        topic = msg.topic
        try:
            payload = json.loads(msg.payload.decode())
        except json.JSONDecodeError:
            payload = msg.payload.decode()

        if "telemetry" in topic:
            device = topic.split("/")[1]
            print(f"[{device}] temp={payload['temperature']}°C hum={payload['humidity']}%")
        elif "status" in topic:
            device = topic.split("/")[1]
            print(f"[STATUS] {device}: {payload}")

    client.on_connect = on_connect
    client.on_message = on_message
    client.connect(BROKER, PORT)
    client.loop_forever()   # blocks, handles reconnect

if __name__ == "__main__":
    import sys
    if sys.argv[1] == "sensor":
        c = create_sensor()
        publish_readings(c)
    else:
        create_dashboard()`} />
      </Section>

      <Section num="5" title="MQTT with Node.js (mqtt.js)">
        <CodeBlock language="javascript" code={`// npm install mqtt
import mqtt from 'mqtt'

// ── Connect with options ─────────────────────────────────────────────
const client = mqtt.connect('mqtt://localhost:1883', {
  clientId: 'node-backend-01',
  username: 'app',
  password: process.env.MQTT_PASSWORD,
  keepalive: 60,
  reconnectPeriod: 1000,  // reconnect every 1s on disconnect
  will: {
    topic: 'devices/node-backend-01/status',
    payload: 'offline',
    qos: 1,
    retain: true,
  },
})

client.on('connect', () => {
  console.log('Connected to MQTT broker')
  client.publish('devices/node-backend-01/status', 'online', { qos: 1, retain: true })

  // Subscribe to all sensor telemetry
  client.subscribe('sensors/+/telemetry', { qos: 0 })
  // Subscribe to device commands (for this device)
  client.subscribe('devices/node-backend-01/commands', { qos: 1 })
})

client.on('message', (topic, payload) => {
  const data = JSON.parse(payload.toString())

  if (topic.includes('telemetry')) {
    const deviceId = topic.split('/')[1]
    // Store to time-series DB
    influxdb.writePoint({ measurement: 'temperature', tags: { device: deviceId }, fields: data })
  }

  if (topic.includes('commands')) {
    console.log('Command received:', data)
    executeCommand(data)
  }
})

client.on('error', (err)         => console.error('MQTT error:', err))
client.on('offline', ()          => console.log('Client offline'))
client.on('reconnect', ()        => console.log('Reconnecting...'))

// Publish a command to a device
function sendCommand(deviceId, command) {
  client.publish(
    \`devices/\${deviceId}/commands\`,
    JSON.stringify({ action: command, timestamp: Date.now() }),
    { qos: 1 }
  )
}`} />
      </Section>

      <Section num="6" title="HTTP for IoT Devices">
        <CodeBlock language="python" code={`# When to use HTTP vs MQTT for IoT:
# HTTP: simple devices with WiFi, infrequent data, no persistent connection needed
# MQTT: continuous data stream, unreliable connection, many devices

# ESP32 sending HTTP POST (MicroPython)
import urequests
import ujson
import utime

def send_telemetry(temperature, humidity):
    payload = ujson.dumps({
        "device_id": "esp32-001",
        "temperature": temperature,
        "humidity": humidity,
        "timestamp": utime.time()
    })
    try:
        res = urequests.post(
            "https://api.myserver.com/telemetry",
            headers={
                "Content-Type": "application/json",
                "X-Device-Token": "secret-device-token"
            },
            data=payload,
            timeout=10
        )
        print("HTTP", res.status_code)
        res.close()
    except Exception as e:
        print("HTTP error:", e)

# Receiving commands via HTTP polling (simple but not real-time)
def poll_commands():
    while True:
        try:
            res = urequests.get(
                "https://api.myserver.com/devices/esp32-001/commands",
                headers={"X-Device-Token": "secret-device-token"}
            )
            if res.status_code == 200:
                cmd = ujson.loads(res.text)
                if cmd.get("action") == "restart":
                    machine.reset()
            res.close()
        except Exception as e:
            print("Poll error:", e)
        utime.sleep(30)  # poll every 30 seconds`} />
      </Section>

      <Section num="7" title="Device-to-Cloud Communication">
        <CodeBlock language="bash" code={`# AWS IoT Core — managed MQTT broker at scale
# Devices connect via MQTT, messages routed to Lambda/DynamoDB/S3/Kinesis

# AWS IoT connection (certificate-based auth)
# Each device has a unique X.509 certificate
# No username/password — certificates = device identity

# Device shadow — virtual representation of device state
# Desired state (what cloud wants): {"led": "on", "interval": 5}
# Reported state (what device says): {"led": "on", "temp": 23.5}
# Delta — difference between desired and reported

# Topics for device shadow:
$aws/things/device-001/shadow/update           # update shadow
$aws/things/device-001/shadow/get              # request current shadow
$aws/things/device-001/shadow/update/delta     # receive desired changes

# AWS IoT Rule — route messages to other services
# SELECT temperature, humidity, timestamp
# FROM 'sensors/+/telemetry'
# WHERE temperature > 30
# → Action: INSERT into DynamoDB / invoke Lambda / send SNS alert

# Azure IoT Hub — similar to AWS IoT Core
# Device-to-Cloud: EventHub-compatible endpoint
# Cloud-to-Device: messages with delivery acknowledgement
# Direct methods: like RPC — invoke function on device from cloud
# Device twin: like AWS device shadow`} />
      </Section>

      <Section num="8" title="Edge Computing">
        <InfoBox>Edge computing processes data close to where it's generated — on a Raspberry Pi, industrial gateway, or embedded system — rather than sending raw data to the cloud. Reduces latency, bandwidth costs, and cloud dependency.</InfoBox>
        <CodeBlock language="python" code={`# Edge node: Raspberry Pi collecting data from 10 sensors,
# running local analytics, only sending aggregates to cloud

import statistics
from collections import deque
from datetime import datetime

class EdgeAggregator:
    def __init__(self, window_size=60, cloud_interval=300):
        self.readings = deque(maxlen=window_size)   # last 60 readings
        self.cloud_interval = cloud_interval         # send to cloud every 5min
        self.last_cloud_send = 0

    def add_reading(self, value: float):
        self.readings.append({'value': value, 'ts': datetime.utcnow()})

        # Local anomaly detection — no cloud needed
        if len(self.readings) > 10:
            mean = statistics.mean(r['value'] for r in self.readings)
            stdev = statistics.stdev(r['value'] for r in self.readings)
            if abs(value - mean) > 3 * stdev:
                self.trigger_local_alert(value, mean)

    def trigger_local_alert(self, value, mean):
        print(f"ANOMALY DETECTED: {value:.1f}°C (mean: {mean:.1f}°C)")
        # Sound buzzer, turn on LED — no internet required!

    def should_send_to_cloud(self) -> bool:
        import time
        return time.time() - self.last_cloud_send > self.cloud_interval

    def get_aggregate(self) -> dict:
        vals = [r['value'] for r in self.readings]
        return {
            'min': min(vals),
            'max': max(vals),
            'mean': round(statistics.mean(vals), 2),
            'count': len(vals),
            'timestamp': datetime.utcnow().isoformat(),
        }

# Benefits of edge processing:
# ✅ Works offline (no cloud dependency)
# ✅ 60 readings → 1 cloud message (60x less data)
# ✅ Anomaly response in milliseconds (vs seconds via cloud)
# ✅ Privacy (sensitive data never leaves the building)`} />
      </Section>

      <Section num="9" title="Data Formats — JSON, CBOR, Protobuf">
        <CodeBlock language="python" code={`# Data format comparison for IoT
import json
import struct
import time

data = {"t": 23.5, "h": 65.2, "ts": 1700000000}

# JSON — human readable, large
json_bytes = json.dumps(data).encode()
print(f"JSON: {len(json_bytes)} bytes: {json_bytes}")
# JSON: 38 bytes: b'{"t": 23.5, "h": 65.2, "ts": 1700000000}'

# Binary struct — smallest, no schema discovery
# Format: <2floats + 1uint32 = 4+4+4 = 12 bytes
binary = struct.pack('<ffI', data['t'], data['h'], data['ts'])
print(f"Binary struct: {len(binary)} bytes")
# Binary struct: 12 bytes

# CBOR (Concise Binary Object Representation) — binary JSON
# pip install cbor2
import cbor2
cbor_bytes = cbor2.dumps(data)
print(f"CBOR: {len(cbor_bytes)} bytes")
# CBOR: ~25 bytes (self-describing, smaller than JSON)

# MessagePack — like CBOR
# pip install msgpack
import msgpack
mp_bytes = msgpack.packb(data)
print(f"MessagePack: {len(mp_bytes)} bytes")
# MessagePack: ~26 bytes

# Protocol Buffers — smallest + strongly typed (requires .proto schema)
# message SensorReading { float temperature = 1; float humidity = 2; uint32 timestamp = 3; }
# Typical size: 15-20 bytes

# Rule of thumb for IoT:
# WiFi/Ethernet → JSON (human readable, easy debug)
# LoRaWAN/BLE (< 250 bytes payload) → binary struct or CBOR`} />
      </Section>

      <Section num="10" title="Time Series Data">
        <Sub title="InfluxDB for IoT data">
          <CodeBlock language="python" code={`# pip install influxdb-client
from influxdb_client import InfluxDBClient, Point, WritePrecision
from influxdb_client.client.write_api import SYNCHRONOUS
from datetime import datetime

client = InfluxDBClient(
    url="http://localhost:8086",
    token=os.environ.get("INFLUX_TOKEN"),
    org="myorg"
)
write_api = client.write_api(write_options=SYNCHRONOUS)
query_api = client.query_api()

# Write sensor data
point = (
    Point("environment")
    .tag("device", "sensor-01")
    .tag("location", "server-room")
    .field("temperature", 23.5)
    .field("humidity", 65.2)
    .time(datetime.utcnow(), WritePrecision.SECONDS)
)
write_api.write(bucket="iot-data", record=point)

# Query last 1 hour of temperature data
query = '''
from(bucket: "iot-data")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "environment")
  |> filter(fn: (r) => r._field == "temperature")
  |> filter(fn: (r) => r.device == "sensor-01")
  |> aggregateWindow(every: 5m, fn: mean)
'''
tables = query_api.query(query)
for table in tables:
    for record in table.records:
        print(f"{record.get_time()}: {record.get_value():.1f}°C")`} />
        </Sub>
      </Section>

      <Section num="11" title="Power and Bandwidth Constraints">
        <CodeBlock language="bash" code={`# Power budgets for battery-powered IoT devices
# CR2032 coin cell: ~225 mAh
# ESP32 active:     ~80-240 mA  → 1-3 hours battery life
# ESP32 deep sleep: ~10 µA      → 225000 mAh / 0.01 mA = years!

# Power optimization strategies:
# 1. Deep sleep between readings
#    Wake → read sensor → publish → deep sleep for 60s
#    Active time: ~1s. Sleep: 59s. Average current: ~1.5 mA
#    → CR2032 lasts ~150 hours = 6 days

# 2. Minimize transmissions
#    Send once per minute instead of once per second
#    Batch multiple readings in one message

# 3. Radio wake-up
#    Use LPWAN (LoRaWAN, Sigfox) for very low power
#    LoRa: ~50 mA active, but only active for 1-2 seconds per hour

# Bandwidth optimization:
# LoRaWAN payload limit: 51-222 bytes (depends on region + spreading factor)
# Solution: compact binary encoding

# Encode temperature + humidity in 4 bytes:
# temp: multiply by 100, store as int16 (range: -327.68 to 327.67°C)
# humidity: multiply by 10, store as uint8 (range: 0 to 25.5%) — or use 2 bytes

import struct
def encode_reading(temp_c: float, humidity_pct: float) -> bytes:
    temp_raw = int(temp_c * 100)        # 23.45°C → 2345
    hum_raw  = int(humidity_pct * 10)   # 65.4% → 654
    return struct.pack('>hH', temp_raw, hum_raw)  # 4 bytes total

def decode_reading(data: bytes):
    temp_raw, hum_raw = struct.unpack('>hH', data)
    return temp_raw / 100, hum_raw / 10`} />
      </Section>

      <Section num="12" title="Security in IoT">
        <WarnBox>IoT devices are often physically accessible, rarely updated, and deployed in large numbers. A compromised device can attack your network or join a botnet. Security must be designed in from the start — it cannot be bolted on later.</WarnBox>
        <CodeBlock language="bash" code={`# Device identity and authentication
# Never hardcode credentials in firmware!
# Use: certificate-based auth (AWS IoT), pre-provisioned secure element,
#      or device-unique tokens stored in secure flash

# TLS everywhere
# All MQTT should use MQTTS (port 8883, TLS)
# All HTTP should use HTTPS
# Verify server certificates on device (don't skip TLS verification!)

# Mosquitto TLS config
listener 8883
cafile   /etc/mosquitto/certs/ca.crt
certfile /etc/mosquitto/certs/server.crt
keyfile  /etc/mosquitto/certs/server.key
require_certificate true   # client certificates required

# Connect with client certificate (Python)
client.tls_set(
    ca_certs="ca.crt",
    certfile="device.crt",
    keyfile="device.key"
)

# Network segmentation
# IoT devices on separate VLAN from main network
# IoT VLAN: can reach internet (for cloud), cannot reach internal servers
# Use firewall rules to enforce

# Firmware update security
# OTA (Over-the-Air) updates must be signed
# Verify signature before flashing: crypto.verify(firmware, signature, pub_key)
# Rollback if new firmware fails health check

# Minimal attack surface
# Disable unused interfaces (serial debug in production!)
# No open ports except what's needed
# Regular firmware updates (automate via OTA)`} />
      </Section>

      <Section num="13" title="IoT Platforms — AWS IoT, Azure IoT Hub">
        <CodeBlock language="bash" code={`# AWS IoT Core
# ── Setup ──────────────────────────────────────────────────────────
# 1. Create a "Thing" (device registry entry)
# 2. Create and download certificates (cert.pem, private.key, root-CA.crt)
# 3. Attach policy allowing MQTT publish/subscribe
# 4. Connect device

# Policy (allow device to publish to its own topic)
{
  "Effect": "Allow",
  "Action": ["iot:Publish", "iot:Subscribe", "iot:Connect"],
  "Resource": "arn:aws:iot:us-east-1:123456789:topic/devices/\${iot:ClientId}/*"
}

# AWS IoT Rule — stream to DynamoDB
SELECT device_id, temperature, timestamp FROM 'sensors/+/telemetry'
→ DynamoDB: TableName=IoTReadings, HashKey=device_id, RangeKey=timestamp

# Device connection (Python with AWS IoT SDK)
# pip install awsiotsdk
from awscrt import mqtt
from awsiot import mqtt_connection_builder

conn = mqtt_connection_builder.mtls_from_path(
    endpoint="xxxx.iot.us-east-1.amazonaws.com",
    cert_filepath="cert.pem",
    pri_key_filepath="private.key",
    ca_filepath="root-CA.crt",
    client_id="device-001",
)
connect_future = conn.connect()
connect_future.result()
conn.publish(topic="sensors/device-001/telemetry",
             payload=json.dumps(data), qos=mqtt.QoS.AT_LEAST_ONCE)`} />
      </Section>

      <Section num="14" title="Testing and Simulation">
        <CodeBlock language="python" code={`#!/usr/bin/env python3
"""Simulate multiple IoT devices for testing without hardware"""
import asyncio
import json
import random
import time
import paho.mqtt.client as mqtt

class SimulatedSensor:
    def __init__(self, device_id: str, broker: str = "localhost"):
        self.device_id = device_id
        self.base_temp = 20 + random.uniform(-5, 5)
        self.base_hum  = 50 + random.uniform(-10, 10)
        self.client = mqtt.Client(device_id)
        self.client.connect(broker, 1883)
        self.client.loop_start()

    def read_temperature(self) -> float:
        # Simulate gradual temperature drift with noise
        self.base_temp += random.uniform(-0.1, 0.1)
        return round(self.base_temp + random.gauss(0, 0.3), 2)

    def read_humidity(self) -> float:
        return round(self.base_hum + random.gauss(0, 1), 1)

    def send_telemetry(self):
        payload = {
            "device_id": self.device_id,
            "temperature": self.read_temperature(),
            "humidity": self.read_humidity(),
            "battery_pct": random.randint(70, 100),
            "timestamp": time.time(),
        }
        topic = f"sensors/{self.device_id}/telemetry"
        self.client.publish(topic, json.dumps(payload), qos=0)
        print(f"[{self.device_id}] temp={payload['temperature']}°C")

    def simulate_anomaly(self):
        """Occasionally spike temperature to test alerting"""
        if random.random() < 0.02:  # 2% chance
            anomaly = self.base_temp + random.uniform(10, 20)
            self.client.publish(
                f"sensors/{self.device_id}/telemetry",
                json.dumps({"device_id": self.device_id,
                            "temperature": round(anomaly, 2),
                            "timestamp": time.time()}),
                qos=1
            )
            print(f"⚠️  [{self.device_id}] ANOMALY: {anomaly:.1f}°C")

def run_simulation(num_devices=5, interval_sec=5):
    sensors = [SimulatedSensor(f"sim-sensor-{i:02d}") for i in range(num_devices)]
    print(f"Simulating {num_devices} sensors, publishing every {interval_sec}s")
    print("Press Ctrl+C to stop")
    while True:
        for sensor in sensors:
            sensor.send_telemetry()
            sensor.simulate_anomaly()
        time.sleep(interval_sec)

if __name__ == "__main__":
    run_simulation(num_devices=5, interval_sec=2)`} />
      </Section>

      <Section num="15" title="Mini Project: Temperature Monitor System">
        <p>Complete IoT pipeline: simulated sensors → MQTT broker → Node.js backend → InfluxDB → real-time dashboard. Each component runs in Docker.</p>
        <Sub title="Backend — MQTT to InfluxDB bridge">
          <CodeBlock language="javascript" code={`// backend/index.js
import mqtt from 'mqtt'
import { InfluxDB, Point, WritePrecision } from '@influxdata/influxdb-client'

const mqttClient = mqtt.connect('mqtt://mosquitto:1883')
const influx = new InfluxDB({ url: 'http://influxdb:8086', token: process.env.INFLUX_TOKEN })
const writeApi = influx.getWriteApi('myorg', 'iot-data', WritePrecision.s)

mqttClient.on('connect', () => {
  console.log('Connected to MQTT')
  mqttClient.subscribe('sensors/+/telemetry')
})

mqttClient.on('message', (topic, payload) => {
  const data = JSON.parse(payload.toString())
  const deviceId = topic.split('/')[1]

  const point = new Point('environment')
    .tag('device', deviceId)
    .floatField('temperature', data.temperature)
    .floatField('humidity', data.humidity ?? 0)
    .intField('battery', data.battery_pct ?? 100)
    .timestamp(new Date(data.timestamp * 1000))

  writeApi.writePoint(point)
  console.log(\`Stored: \${deviceId} → \${data.temperature}°C\`)
})

// REST API for dashboard queries
import express from 'express'
const app = express()
const queryApi = influx.getQueryApi('myorg')

app.get('/api/readings', async (req, res) => {
  const { device = '', range = '-1h' } = req.query
  const deviceFilter = device ? \`|> filter(fn:(r) => r.device == "\${device}")\` : ''

  const query = \`
    from(bucket: "iot-data")
      |> range(start: \${range})
      |> filter(fn:(r) => r._measurement == "environment")
      |> filter(fn:(r) => r._field == "temperature")
      \${deviceFilter}
      |> aggregateWindow(every: 1m, fn: mean)
  \`

  const rows = []
  for await (const row of queryApi.iterateRows(query)) {
    rows.push({ time: row._time, device: row.device, temperature: row._value })
  }
  res.json(rows)
})

app.listen(3001, () => console.log('API :3001'))`} />
        </Sub>
        <Sub title="docker-compose.yml">
          <CodeBlock language="yaml" code={`version: '3.8'
services:
  mosquitto:
    image: eclipse-mosquitto:2
    ports: ["1883:1883"]
    volumes: ["./mosquitto.conf:/mosquitto/config/mosquitto.conf"]

  influxdb:
    image: influxdb:2
    ports: ["8086:8086"]
    environment:
      - DOCKER_INFLUXDB_INIT_MODE=setup
      - DOCKER_INFLUXDB_INIT_ORG=myorg
      - DOCKER_INFLUXDB_INIT_BUCKET=iot-data
      - DOCKER_INFLUXDB_INIT_ADMIN_TOKEN=mytoken

  backend:
    build: ./backend
    depends_on: [mosquitto, influxdb]
    environment:
      - INFLUX_TOKEN=mytoken
    ports: ["3001:3001"]

  simulator:
    build: ./simulator
    depends_on: [mosquitto]

  grafana:
    image: grafana/grafana:latest
    ports: ["3000:3000"]
    depends_on: [influxdb]`} />
        </Sub>
      </Section>
    </div>
  )
}
