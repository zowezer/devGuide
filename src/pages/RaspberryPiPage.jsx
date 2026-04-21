import CodeBlock from '../components/CodeBlock'
import Section, { Sub, InfoBox, WarnBox, TipBox } from '../components/Section'

const sections = [
  'Hardware Overview — Pi vs Arduino',
  'Getting Started — OS and First Boot',
  'Linux System Essentials on Pi',
  'GPIO Control with Python (gpiozero and RPi.GPIO)',
  'GPIO vs Arduino Comparison',
  'Sensors and Actuators',
  'Camera Module',
  'I2C, SPI, UART Communication',
  'Running Python Scripts and Services',
  'Networking Capabilities',
  'Web Server on Raspberry Pi',
  'Docker on Raspberry Pi',
  'Computer Vision with OpenCV',
  'Remote Access — SSH and VNC',
  'Mini Project: IoT Dashboard with Flask',
]

export default function RaspberryPiPage() {
  return (
    <div>
      <div className="page-hero">
        <div className="lang-icon">🧠</div>
        <div>
          <h1>Raspberry Pi</h1>
          <p>
            The Raspberry Pi is a full Linux computer the size of a credit card. Unlike Arduino
            (bare-metal C on a microcontroller), the Pi runs a full OS (Raspberry Pi OS / Ubuntu)
            with networking, Python, Docker, and a desktop environment. It bridges the gap between
            embedded hardware control and server-class software development.
          </p>
          <div className="badges">
            <span className="badge green">Full Linux</span>
            <span className="badge">Python Native</span>
            <span className="badge yellow">GPIO + WiFi</span>
            <span className="badge purple">Camera + AI</span>
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

      <Section num="1" title="Hardware Overview — Pi vs Arduino">
        <CodeBlock language="bash" code={`# Raspberry Pi models (as of 2024)
Model          CPU              RAM     Storage  USB  WiFi  Price
──────────────────────────────────────────────────────────────────
Pi Zero 2W     ARM Cortex-A53   512MB   MicroSD  1    Y     ~$15
Pi 3B+         ARM Cortex-A53   1GB     MicroSD  4    Y     ~$35
Pi 4B          ARM Cortex-A72   1-8GB   MicroSD  4    Y     ~$35-75
Pi 5           ARM Cortex-A76   4-8GB   MicroSD  4    Y     ~$60-80
Pi Pico        RP2040 (MCU!)    264KB   Flash    —    N     ~$4

# Pi 4B specs
CPU:     Quad-core ARM Cortex-A72 @ 1.8GHz (64-bit)
RAM:     1/2/4/8 GB LPDDR4
Storage: MicroSD (or USB SSD for better performance)
GPIO:    40-pin header (26 GPIO, I2C, SPI, UART, PWM)
Network: Gigabit Ethernet, WiFi 5 (802.11ac), Bluetooth 5.0
Video:   2x micro-HDMI (4K@60fps), MIPI DSI (touchscreen)
Camera:  MIPI CSI (Pi Camera Module)
Power:   5V 3A USB-C

# Raspberry Pi vs Arduino comparison
              Arduino Uno      Raspberry Pi 4B
CPU:          8-bit @ 16MHz    64-bit quad @ 1.8GHz
RAM:          2KB              1-8GB
OS:           None (bare metal) Linux (Raspberry Pi OS)
Python:       No (Arduino C++) Yes (native)
Networking:   No (needs shield) Built-in WiFi + Ethernet
Price:        ~$25             ~$35-75
Startup time: Instant (<1ms)   ~30s (boot Linux)
Power:        50mW             3-7W
Best for:     Real-time I/O    Complex apps + connectivity`} />
      </Section>

      <Section num="2" title="Getting Started — OS and First Boot">
        <CodeBlock language="bash" code={`# 1. Download Raspberry Pi Imager from raspberrypi.com
# 2. Flash Raspberry Pi OS (64-bit) to MicroSD
# 3. Enable SSH + WiFi in Imager settings before flashing

# First boot — find Pi on network
ping raspberrypi.local        # if mDNS works
nmap -sn 192.168.1.0/24      # scan local network

# Connect via SSH
ssh pi@raspberrypi.local      # default password: raspberry (change immediately!)
ssh pi@192.168.1.x

# First things to do
sudo raspi-config              # configuration tool
# → Change password
# → Enable camera, I2C, SPI, serial interfaces
# → Set locale, timezone
# → Expand filesystem to use full SD card

# Update system
sudo apt update && sudo apt upgrade -y
sudo apt install -y git python3-pip python3-venv vim htop

# Check hardware info
uname -a                      # kernel version
cat /proc/cpuinfo             # CPU details
cat /proc/meminfo             # memory info
vcgencmd measure_temp         # CPU temperature (Pi specific)
vcgencmd get_throttled        # check for thermal throttling`} />
      </Section>

      <Section num="3" title="Linux System Essentials on Pi">
        <CodeBlock language="bash" code={`# Pi OS is Debian-based — same commands as Ubuntu

# System management
sudo systemctl status          # all services
sudo systemctl start myapp     # start service
sudo systemctl enable myapp    # start on boot
journalctl -f                  # follow system log

# Performance monitoring
htop                           # interactive process monitor
vcgencmd measure_temp          # "temp=52.1'C" — watch for >80°C
cat /sys/class/thermal/thermal_zone0/temp  # temp in millidegrees
watch -n 1 'cat /proc/loadavg' # CPU load every second

# GPIO permission (add user to gpio group)
sudo usermod -aG gpio pi
sudo usermod -aG i2c pi
sudo usermod -aG spi pi
# Log out and back in for group to take effect

# SD card health
df -h                          # disk usage
sudo smartctl -a /dev/mmcblk0  # S.M.A.R.T. info (install smartmontools)

# USB SSD (better than SD for frequent writes)
# Boot from USB: use raspi-config → Boot Order → USB Boot

# Cron job for regular tasks
crontab -e
# */5 * * * * python3 /home/pi/sensor.py >> /var/log/sensor.log 2>&1`} />
      </Section>

      <Section num="4" title="GPIO Control with Python (gpiozero and RPi.GPIO)">
        <InfoBox>The Pi has 40 GPIO pins in 2 rows. Pin numbering: use BCM (Broadcom chip numbering) consistently. All GPIO pins operate at 3.3V — never connect 5V signals directly; use a level shifter!</InfoBox>
        <Sub title="gpiozero — high-level library (recommended)">
          <CodeBlock language="python" code={`# pip install gpiozero
from gpiozero import LED, Button, PWMLED, AngularServo, MCP3008
from time import sleep
from signal import pause

# LED on GPIO 17 (BCM)
led = LED(17)
led.on()
led.off()
led.toggle()
led.blink(on_time=0.5, off_time=0.5)  # blink in background thread

# Dimming with PWM
dim_led = PWMLED(17)
dim_led.value = 0.5   # 50% brightness (0.0 to 1.0)
dim_led.pulse()       # fade in/out continuously

# Button on GPIO 27 (BCM) — with internal pull-up
button = Button(27, pull_up=True, bounce_time=0.05)

# Event-driven
button.when_pressed  = lambda: print("Pressed!")
button.when_released = lambda: print("Released!")

# Or wait for press
button.wait_for_press()
print("Button was pressed")

# Servo on GPIO 18 (PWM-capable pin)
servo = AngularServo(18, min_angle=-90, max_angle=90)
servo.angle = 0      # center
servo.angle = 90     # full right
sleep(1)
servo.angle = -90    # full left

# Link button to LED directly
from gpiozero import LED, Button
from gpiozero.tools import negated
led = LED(17)
button = Button(27)
led.source = button  # LED mirrors button state

pause()  # keep script running`} />
        </Sub>
        <Sub title="RPi.GPIO — lower-level control">
          <CodeBlock language="python" code={`import RPi.GPIO as GPIO
import time

GPIO.setmode(GPIO.BCM)        # use BCM pin numbering
GPIO.setwarnings(False)

# Setup
GPIO.setup(17, GPIO.OUT)      # LED
GPIO.setup(27, GPIO.IN, pull_up_down=GPIO.PUD_UP)  # button

# Write
GPIO.output(17, GPIO.HIGH)
GPIO.output(17, GPIO.LOW)

# Read
state = GPIO.input(27)        # GPIO.HIGH or GPIO.LOW

# PWM (software)
pwm = GPIO.PWM(17, 1000)      # pin 17, 1kHz frequency
pwm.start(0)                  # 0% duty cycle
pwm.ChangeDutyCycle(50)       # 50%
pwm.stop()

# Interrupt / edge detection
def button_callback(channel):
    print(f"Button on pin {channel} pressed!")

GPIO.add_event_detect(27, GPIO.FALLING,  # falling edge = button press
    callback=button_callback,
    bouncetime=200)

# Always cleanup!
try:
    while True:
        time.sleep(1)
finally:
    GPIO.cleanup()`} />
        </Sub>
      </Section>

      <Section num="5" title="GPIO vs Arduino Comparison">
        <CodeBlock language="bash" code={`# Feature comparison
Feature              Arduino Uno        Raspberry Pi 4B
────────────────────────────────────────────────────────────
GPIO voltage:        5V (some 3.3V)     3.3V ONLY!
PWM pins:            6 hardware PWM     2 hardware, rest software
Analog input:        6 (10-bit ADC)     NONE (need external ADC)
Real-time:           Yes (deterministic) No (Linux preemption)
I2C/SPI/UART:        1 each             Multiple via /dev/
GPIO max current:    40mA per pin       16mA per pin (careful!)
Programming:         C/C++              Python, C, Go, Node.js
Interrupt latency:   ~1µs              ~50µs (OS overhead)

# Key implications for hardware projects:
# Pi has NO analog input → use MCP3008 (SPI 8-channel ADC)
# Pi GPIO is 3.3V → use level shifter for 5V sensors
# Pi is NOT real-time → don't use for precise PWM timing
# Arduino is better for: motor control, precise timing, ADC
# Pi is better for: networking, video, ML, complex logic, UI

# Best combo: Arduino + Pi
# Arduino reads sensors, controls actuators (real-time)
# Pi handles: networking, display, data storage, ML
# Communicate via: USB serial, I2C (Pi=master, Arduino=slave), MQTT`} />
      </Section>

      <Section num="6" title="Sensors and Actuators">
        <Sub title="Sensors with Python">
          <CodeBlock language="python" code={`# DHT22 temperature + humidity
# pip install adafruit-circuitpython-dht
import board
import adafruit_dht

dht = adafruit_dht.DHT22(board.D4)  # GPIO 4
try:
    temp = dht.temperature    # °C
    hum  = dht.humidity       # %
    print(f"{temp:.1f}°C  {hum:.0f}%")
except RuntimeError as e:
    print("DHT read error:", e)
finally:
    dht.exit()

# BMP280 pressure/temperature/altitude (I2C)
# pip install adafruit-circuitpython-bmp280
import board
import busio
import adafruit_bmp280

i2c = busio.I2C(board.SCL, board.SDA)
bmp = adafruit_bmp280.Adafruit_BMP280_I2C(i2c, address=0x76)
bmp.sea_level_pressure = 1013.25
print(f"{bmp.temperature:.1f}°C  {bmp.pressure:.1f} hPa  {bmp.altitude:.1f}m")

# MCP3008 — 8-channel 10-bit SPI ADC (adds analog input to Pi)
# pip install adafruit-mcp3xxx
import busio
import digitalio
import adafruit_mcp3xxx.mcp3008 as MCP
from adafruit_mcp3xxx.analog_in import AnalogIn

spi = busio.SPI(clock=board.SCK, MISO=board.MISO, MOSI=board.MOSI)
cs  = digitalio.DigitalInOut(board.D22)
mcp = MCP.MCP3008(spi, cs)
ch0 = AnalogIn(mcp, MCP.P0)          # channel 0
voltage = ch0.voltage                  # 0-3.3V
raw     = ch0.value                    # 0-65535 (16-bit scaled)`} />
        </Sub>
      </Section>

      <Section num="7" title="Camera Module">
        <CodeBlock language="python" code={`# Raspberry Pi Camera Module (V2, V3, or HQ)
# Enable in raspi-config → Interface Options → Camera

# ── New camera stack (Pi OS Bookworm, Python) ─────────────────────
# pip install picamera2
from picamera2 import Picamera2
import time

cam = Picamera2()

# Still photo
config = cam.create_still_configuration()
cam.configure(config)
cam.start()
time.sleep(1)  # let camera settle
cam.capture_file("photo.jpg")
cam.stop()

# Video recording
config = cam.create_video_configuration()
cam.configure(config)
encoder = cam.create_encoder('h264')
cam.start_recording(encoder, 'video.h264')
time.sleep(10)
cam.stop_recording()

# Live preview with overlay
from picamera2.previews import QtPreview
cam.start_preview(QtPreview())

# Capture to numpy array (for OpenCV processing)
import numpy as np
config = cam.create_preview_configuration(main={"format": "RGB888", "size": (640, 480)})
cam.configure(config)
cam.start()
frame = cam.capture_array()  # numpy array (480, 640, 3)
cam.stop()

# ── Command-line ──────────────────────────────────────────────────
# libcamera-still -o photo.jpg
# libcamera-vid -t 10000 -o video.mp4     (10 second video)
# libcamera-vid -t 0 --inline -o - | ffmpeg -i - stream.mp4`} />
      </Section>

      <Section num="8" title="I2C, SPI, UART Communication">
        <CodeBlock language="python" code={`# ── I2C ────────────────────────────────────────────────────────────
# Enable: raspi-config → Interface → I2C
# Check devices: i2cdetect -y 1   (shows hex addresses)

import smbus2

bus = smbus2.SMBus(1)   # I2C bus 1 (SDA=GPIO2, SCL=GPIO3)

# Read 2 bytes from device at address 0x48, register 0x00
data = bus.read_i2c_block_data(0x48, 0x00, 2)
value = (data[0] << 8) | data[1]

# Write to device
bus.write_byte_data(0x48, 0x01, 0x83)  # address, register, value

# ── SPI ────────────────────────────────────────────────────────────
# Enable: raspi-config → Interface → SPI
# Devices: /dev/spidev0.0 and /dev/spidev0.1

import spidev
spi = spidev.SpiDev()
spi.open(0, 0)            # bus 0, device 0 (CE0 = GPIO8)
spi.max_speed_hz = 1000000
spi.mode = 0b00           # CPOL=0, CPHA=0

response = spi.xfer2([0x01, 0x80, 0x00])  # send 3 bytes, receive 3
# MCP3008 read: send [0x01, 0x80|channel<<4, 0x00] → [don't care, upper 2 bits, lower 8 bits]
adc_value = ((response[1] & 0x03) << 8) | response[2]
spi.close()

# ── UART / Serial ──────────────────────────────────────────────────
# Enable: raspi-config → Interface → Serial → disable login shell, enable serial
# Devices: /dev/serial0 (main), /dev/ttyUSB0 (USB serial)

import serial
ser = serial.Serial('/dev/serial0', 9600, timeout=1)
ser.write(b'Hello Arduino\\n')
if ser.in_waiting:
    line = ser.readline().decode('utf-8').strip()
    print("Arduino:", line)
ser.close()`} />
      </Section>

      <Section num="9" title="Running Python Scripts and Services">
        <Sub title="Virtual environments and packages">
          <CodeBlock language="bash" code={`# Create isolated environment
python3 -m venv ~/myproject/venv
source ~/myproject/venv/bin/activate
pip install flask gpiozero adafruit-circuitpython-dht

# Freeze dependencies
pip freeze > requirements.txt
pip install -r requirements.txt

# Run script
python3 app.py`} />
        </Sub>
        <Sub title="Run as systemd service (always on)">
          <CodeBlock language="bash" code={`# /etc/systemd/system/myapp.service
[Unit]
Description=My IoT Application
After=network.target

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/myapp
Environment="PATH=/home/pi/myapp/venv/bin:/usr/bin"
ExecStart=/home/pi/myapp/venv/bin/python app.py
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target

# Enable and start
sudo systemctl daemon-reload
sudo systemctl enable myapp
sudo systemctl start myapp
sudo systemctl status myapp
journalctl -u myapp -f      # follow logs`} />
        </Sub>
      </Section>

      <Section num="10" title="Networking Capabilities">
        <CodeBlock language="bash" code={`# Wireless
iwconfig wlan0                    # WiFi status
sudo iwlist wlan0 scan            # scan networks
nmcli device wifi connect "SSID" password "pass"  # connect

# Static IP (recommended for servers)
# Edit /etc/dhcpcd.conf:
# interface eth0
# static ip_address=192.168.1.100/24
# static routers=192.168.1.1
# static domain_name_servers=8.8.8.8

# Hotspot — Pi as WiFi access point
sudo nmcli con add type wifi ifname wlan0 con-name Hotspot \\
  ssid "PiHotspot" mode ap
sudo nmcli con modify Hotspot wifi-sec.key-mgmt wpa-psk
sudo nmcli con modify Hotspot wifi-sec.psk "password123"
sudo nmcli con up Hotspot

# Pi as network gateway / router
# Enable IP forwarding:
echo 'net.ipv4.ip_forward=1' | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
# + iptables rules for NAT

# Check open ports
ss -tlnp                   # listening TCP ports
nmap localhost             # scan self

# File transfer
scp localfile.py pi@raspberrypi.local:~/
rsync -avz ./project/ pi@raspberrypi.local:~/project/`} />
      </Section>

      <Section num="11" title="Web Server on Raspberry Pi">
        <Sub title="Flask web server">
          <CodeBlock language="python" code={`# pip install flask
from flask import Flask, jsonify, render_template_string
from gpiozero import LED, Button
import psutil  # pip install psutil

app = Flask(__name__)
led = LED(17)

@app.route('/')
def index():
    return render_template_string('''
    <html><body style="font-family:sans-serif;text-align:center">
    <h1>Pi Control Panel</h1>
    <button onclick="fetch('/led/on').then(()=>this.textContent='LED ON')">LED ON</button>
    <button onclick="fetch('/led/off').then(()=>this.textContent='LED OFF')">LED OFF</button>
    <p id="stats"></p>
    <script>
    setInterval(async()=>{
        const d = await fetch('/stats').then(r=>r.json());
        document.getElementById('stats').textContent =
            \`CPU: \${d.cpu}% | RAM: \${d.memory}% | Temp: \${d.temp}°C\`;
    }, 2000);
    </script>
    </body></html>
    ''')

@app.route('/led/<state>')
def control_led(state):
    if state == 'on':  led.on()
    else:              led.off()
    return jsonify({'led': state})

@app.route('/stats')
def stats():
    temp = None
    try:
        with open('/sys/class/thermal/thermal_zone0/temp') as f:
            temp = round(int(f.read()) / 1000, 1)
    except Exception:
        pass
    return jsonify({
        'cpu':    psutil.cpu_percent(),
        'memory': psutil.virtual_memory().percent,
        'disk':   psutil.disk_usage('/').percent,
        'temp':   temp,
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)`} />
        </Sub>
        <Sub title="nginx as reverse proxy">
          <CodeBlock language="bash" code={`sudo apt install nginx
# /etc/nginx/sites-available/myapp
server {
    listen 80;
    server_name raspberrypi.local;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /static {
        alias /home/pi/myapp/static;
        expires 1d;
    }
}

sudo ln -s /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx`} />
        </Sub>
      </Section>

      <Section num="12" title="Docker on Raspberry Pi">
        <CodeBlock language="bash" code={`# Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker pi
# Log out and back in

docker run hello-world         # test
docker version

# ARM architecture — use ARM-compatible images
# Pi 4 (64-bit OS): arm64 / aarch64
# Pi 3 (32-bit OS): armv7 / arm32v7
# Good images: python:3.11-slim, node:20-alpine, nginx:alpine

# Example: run Portainer (Docker GUI)
docker run -d --name portainer -p 9000:9000 \\
  -v /var/run/docker.sock:/var/run/docker.sock \\
  -v portainer_data:/data \\
  portainer/portainer-ce:latest
# Visit: http://raspberrypi.local:9000

# docker-compose on Pi
sudo apt install docker-compose-plugin
# docker-compose.yml (same as on x86, use ARM images)

version: '3.8'
services:
  app:
    image: python:3.11-slim
    volumes: ["./app:/app"]
    working_dir: /app
    command: python server.py
    ports: ["5000:5000"]
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    restart: unless-stopped

  grafana:
    image: grafana/grafana:latest  # has ARM build
    ports: ["3000:3000"]
    restart: unless-stopped`} />
      </Section>

      <Section num="13" title="Computer Vision with OpenCV">
        <CodeBlock language="python" code={`# pip install opencv-python-headless (no GUI)
# pip install opencv-python (with GUI - requires display)
import cv2
import numpy as np

# ── Read and process an image ─────────────────────────────────────
img = cv2.imread('photo.jpg')
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
blurred = cv2.GaussianBlur(gray, (5, 5), 0)
edges = cv2.Canny(blurred, 50, 150)

# ── Face detection (Haar cascade) ────────────────────────────────
face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)
for (x, y, w, h) in faces:
    cv2.rectangle(img, (x, y), (x+w, y+h), (0, 255, 0), 2)

# ── Live camera processing (headless, save results) ───────────────
from picamera2 import Picamera2

cam = Picamera2()
cam.configure(cam.create_preview_configuration(
    main={"format": "RGB888", "size": (640, 480)}))
cam.start()

frame_count = 0
while frame_count < 100:
    frame = cam.capture_array()
    bgr   = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)
    gray  = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)

    # Motion detection
    if frame_count == 0:
        prev = gray.copy()

    diff = cv2.absdiff(prev, gray)
    thresh = cv2.threshold(diff, 25, 255, cv2.THRESH_BINARY)[1]
    motion = np.sum(thresh) / thresh.size

    if motion > 0.02:  # 2% pixels changed
        print(f"Motion detected! ({motion*100:.1f}% pixels changed)")
        cv2.imwrite(f'motion_{frame_count:04d}.jpg', bgr)

    prev = gray.copy()
    frame_count += 1

cam.stop()`} />
      </Section>

      <Section num="14" title="Remote Access — SSH and VNC">
        <CodeBlock language="bash" code={`# ── SSH (text interface) ──────────────────────────────────────────
# Enable: raspi-config → Interface → SSH
ssh pi@raspberrypi.local

# SSH key authentication (no password)
ssh-keygen -t ed25519          # on your computer
ssh-copy-id pi@raspberrypi.local  # copy public key to Pi

# Port forwarding — access Pi's services from outside home network
ssh -L 5000:localhost:5000 pi@raspberrypi.local
# Now: localhost:5000 on your PC → Pi's port 5000

# Reverse SSH tunnel — Pi behind NAT, access from internet
# On Pi: ssh -R 2222:localhost:22 user@your-public-server
# On public server: ssh -p 2222 pi@localhost

# Persistent SSH with autossh
sudo apt install autossh
autossh -M 20000 -f -N -R 2222:localhost:22 user@your-server

# ── VNC (graphical desktop) ──────────────────────────────────────
# Enable: raspi-config → Interface → VNC
# On Pi: vncserver :1 -geometry 1280x720
# Connect with RealVNC Viewer (free) from your computer

# Screen sharing (VNC) without physical monitor
# headless setup in /etc/X11/xorg.conf or use:
sudo raspi-config → Display → Headless Resolution → 1920x1080

# ── noVNC — browser-based VNC ─────────────────────────────────────
# Access Pi desktop from any browser, no VNC client needed
sudo apt install novnc websockify
websockify --daemon --web /usr/share/novnc 6080 localhost:5900
# Visit: http://raspberrypi.local:6080

# ── Tailscale — easy VPN for remote access ─────────────────────────
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up
tailscale ip -4    # get VPN IP, use to SSH from anywhere`} />
      </Section>

      <Section num="15" title="Mini Project: IoT Dashboard with Flask">
        <p>A real-time dashboard served by the Pi: reads temperature from a DHT22, stores readings in SQLite, and shows a live updating chart in the browser. Accessible from any device on the network.</p>
        <Sub title="app.py">
          <CodeBlock language="python" code={`from flask import Flask, jsonify, render_template_string
import sqlite3
import time
import threading
from datetime import datetime

try:
    import board
    import adafruit_dht
    dht = adafruit_dht.DHT22(board.D4)
    REAL_SENSOR = True
except Exception:
    REAL_SENSOR = False
    import random

app = Flask(__name__)
DB = 'readings.db'

# ── Database setup ────────────────────────────────────────────────
def init_db():
    with sqlite3.connect(DB) as conn:
        conn.execute('''CREATE TABLE IF NOT EXISTS readings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT NOT NULL,
            temperature REAL,
            humidity REAL
        )''')

# ── Background sensor reader ──────────────────────────────────────
def read_sensor():
    while True:
        try:
            if REAL_SENSOR:
                temp = dht.temperature
                hum  = dht.humidity
            else:
                temp = round(20 + random.uniform(-2, 5), 1)
                hum  = round(50 + random.uniform(-10, 10), 1)

            if temp is not None and hum is not None:
                with sqlite3.connect(DB) as conn:
                    conn.execute(
                        'INSERT INTO readings (timestamp, temperature, humidity) VALUES (?,?,?)',
                        (datetime.now().isoformat(), temp, hum)
                    )
                    # Keep only last 24 hours of readings
                    conn.execute(
                        "DELETE FROM readings WHERE timestamp < datetime('now', '-1 day')"
                    )
        except Exception as e:
            print("Sensor error:", e)
        time.sleep(30)  # read every 30 seconds

# ── API endpoints ─────────────────────────────────────────────────
@app.route('/api/readings')
def get_readings():
    with sqlite3.connect(DB) as conn:
        rows = conn.execute(
            'SELECT timestamp, temperature, humidity FROM readings ORDER BY id DESC LIMIT 48'
        ).fetchall()
    return jsonify([{'ts': r[0], 'temp': r[1], 'hum': r[2]} for r in reversed(rows)])

@app.route('/api/current')
def current():
    with sqlite3.connect(DB) as conn:
        row = conn.execute(
            'SELECT temperature, humidity, timestamp FROM readings ORDER BY id DESC LIMIT 1'
        ).fetchone()
    if not row: return jsonify({'error': 'No data'})
    return jsonify({'temperature': row[0], 'humidity': row[1], 'timestamp': row[2]})

@app.route('/')
def dashboard():
    return render_template_string(DASHBOARD_HTML)

DASHBOARD_HTML = '''<!DOCTYPE html>
<html>
<head>
  <title>Pi Dashboard</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    body { font-family: sans-serif; background: #1a1a2e; color: #eee; padding: 20px; }
    .cards { display: flex; gap: 20px; margin-bottom: 30px; }
    .card { background: #16213e; padding: 20px 30px; border-radius: 12px; flex: 1; text-align: center; }
    .card .val { font-size: 3em; font-weight: bold; color: #0f3460; color: #e94560; }
    .card .label { color: #aaa; margin-top: 5px; }
    canvas { background: #16213e; border-radius: 12px; padding: 15px; }
    h1 { color: #e94560; }
  </style>
</head>
<body>
  <h1>🌡️ Raspberry Pi Dashboard</h1>
  <div class="cards">
    <div class="card"><div class="val" id="temp">--</div><div class="label">Temperature (°C)</div></div>
    <div class="card"><div class="val" id="hum">--</div><div class="label">Humidity (%)</div></div>
    <div class="card"><div class="val" id="time" style="font-size:1.2em">--</div><div class="label">Last Reading</div></div>
  </div>
  <canvas id="chart" height="100"></canvas>
  <script>
    const ctx = document.getElementById('chart').getContext('2d');
    const chart = new Chart(ctx, {
      type: 'line',
      data: { labels: [], datasets: [
        { label: 'Temperature (°C)', data: [], borderColor: '#e94560', tension: 0.3, yAxisID: 'y1' },
        { label: 'Humidity (%)',     data: [], borderColor: '#0f3460', tension: 0.3, yAxisID: 'y2' },
      ]},
      options: {
        scales: {
          y1: { type: 'linear', position: 'left',  title: { display: true, text: '°C', color: '#e94560' } },
          y2: { type: 'linear', position: 'right', title: { display: true, text: '%',  color: '#0f3460' } },
        },
        plugins: { legend: { labels: { color: '#eee' } } },
        color: '#eee',
      }
    });

    async function update() {
      const [curr, hist] = await Promise.all([
        fetch('/api/current').then(r=>r.json()),
        fetch('/api/readings').then(r=>r.json()),
      ]);
      document.getElementById('temp').textContent = curr.temperature?.toFixed(1) ?? '--';
      document.getElementById('hum').textContent  = curr.humidity?.toFixed(0) ?? '--';
      document.getElementById('time').textContent = new Date(curr.timestamp).toLocaleTimeString();

      chart.data.labels = hist.map(r => new Date(r.ts).toLocaleTimeString());
      chart.data.datasets[0].data = hist.map(r => r.temp);
      chart.data.datasets[1].data = hist.map(r => r.hum);
      chart.update();
    }
    update();
    setInterval(update, 30000);
  </script>
</body></html>'''

if __name__ == '__main__':
    init_db()
    t = threading.Thread(target=read_sensor, daemon=True)
    t.start()
    print("Dashboard at http://raspberrypi.local:5000")
    app.run(host='0.0.0.0', port=5000)`} />
        </Sub>
      </Section>
    </div>
  )
}
