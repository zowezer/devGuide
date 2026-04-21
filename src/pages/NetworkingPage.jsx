import CodeBlock from '../components/CodeBlock'
import Section, { Sub, InfoBox, WarnBox, TipBox } from '../components/Section'

const sections = [
  'OSI Model — Layer by Layer',
  'TCP/IP Model vs OSI',
  'IP Addressing and Subnetting',
  'DNS — How Names Resolve to IPs',
  'Packets and Frames — Data Transfer',
  'TCP — Reliable Transport',
  'UDP — Fast, Unreliable Transport',
  'Routing Fundamentals',
  'Network Programming in Python',
  'Network Programming in Node.js',
  'Analyzing Traffic — tcpdump and Wireshark',
  'Latency, Throughput, and Bandwidth',
  'Firewalls, NAT, and Port Forwarding',
  'VPNs and Tunneling',
  'Mini Project: Port Scanner and Network Probe',
]

export default function NetworkingPage() {
  return (
    <div>
      <div className="page-hero">
        <div className="lang-icon">🌐</div>
        <div>
          <h1>Computer Networking</h1>
          <p>
            Every web request, database query, and API call travels through a network stack.
            Understanding how packets move from one machine to another — through layers of
            protocols, routers, and switches — makes you a better developer and a better debugger.
            This page covers the theory and the practical: real code, real tools, real commands.
          </p>
          <div className="badges">
            <span className="badge green">TCP/IP</span>
            <span className="badge">OSI Model</span>
            <span className="badge yellow">Packets</span>
            <span className="badge purple">DNS</span>
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

      <Section num="1" title="OSI Model — Layer by Layer">
        <InfoBox>The OSI model is a conceptual framework — real traffic uses TCP/IP, not 7 distinct layers. OSI is useful for diagnosis: "Is this a Layer 3 (routing) problem or a Layer 7 (app) problem?"</InfoBox>
        <CodeBlock language="bash" code={`Layer 7 — Application   HTTP, FTP, SMTP, DNS, SSH, WebSocket
           What it does: end-user protocols, data formatting, encryption

Layer 6 — Presentation  TLS/SSL encryption, compression, character encoding
           What it does: translate between app format and network format

Layer 5 — Session       Session establishment, maintenance, termination
           What it does: manage ongoing connections (rarely discussed separately)

Layer 4 — Transport     TCP (reliable), UDP (fast), ports
           What it does: end-to-end delivery, segmentation, error recovery

Layer 3 — Network       IP, ICMP, routing
           What it does: logical addressing, routing across networks
           Unit: PACKET

Layer 2 — Data Link     Ethernet, WiFi (802.11), MAC addresses, ARP
           What it does: node-to-node delivery on same network segment
           Unit: FRAME

Layer 1 — Physical      Cables, radio waves, fiber, voltage levels
           What it does: raw bit transmission
           Unit: BIT`} />
        <Sub title="Layer encapsulation — how data travels down the stack">
          <CodeBlock language="bash" code={`Your HTTP request: "GET /index.html HTTP/1.1"

Layer 7: HTTP adds headers             [HTTP Header | Data]
Layer 4: TCP adds port numbers         [TCP Header | HTTP Header | Data]
Layer 3: IP adds source/dest IP        [IP Header | TCP Header | HTTP | Data]
Layer 2: Ethernet adds MAC addresses   [Eth Header | IP | TCP | HTTP | Data | FCS]
Layer 1: Converted to electrical/optical signals on the wire

At the router: Layer 2 frame is stripped, IP examined, new frame created
At destination: layers unwrapped in reverse — app gets original data`} />
        </Sub>
      </Section>

      <Section num="2" title="TCP/IP Model vs OSI">
        <CodeBlock language="bash" code={`OSI (7 layers)          TCP/IP (4 layers)     Protocols
─────────────────────── ────────────────────── ─────────────────────────────
Application             Application            HTTP, HTTPS, FTP, SMTP, DNS,
Presentation                                   SSH, WebSocket, gRPC
Session
─────────────────────── ────────────────────── ─────────────────────────────
Transport               Transport              TCP, UDP, SCTP
─────────────────────── ────────────────────── ─────────────────────────────
Network                 Internet               IP (v4/v6), ICMP, ARP
─────────────────────── ────────────────────── ─────────────────────────────
Data Link               Network Access         Ethernet, WiFi, PPP
Physical                                       (hardware-level)

Key insight: TCP/IP is what's actually implemented.
OSI is the reference model for understanding and debugging.`} />
        <TipBox>When debugging: can you <code>ping</code>? (Layer 3 works). Can you <code>telnet host 80</code>? (Layer 4 works). Does the app respond? (Layer 7 works). This narrows the problem layer by layer.</TipBox>
      </Section>

      <Section num="3" title="IP Addressing and Subnetting">
        <Sub title="IPv4 addressing">
          <CodeBlock language="bash" code={`# IPv4: 32 bits, written as 4 octets
192.168.1.100       # dotted decimal notation
0xC0A80164          # same in hex

# Address classes (legacy, replaced by CIDR)
Class A: 1.0.0.0    - 126.255.255.255   (/8  default mask)
Class B: 128.0.0.0  - 191.255.255.255   (/16 default mask)
Class C: 192.0.0.0  - 223.255.255.255   (/24 default mask)

# Private ranges (RFC 1918 — not routable on internet)
10.0.0.0    - 10.255.255.255     (10.0.0.0/8)
172.16.0.0  - 172.31.255.255     (172.16.0.0/12)
192.168.0.0 - 192.168.255.255    (192.168.0.0/16)

# CIDR notation — prefix/length
192.168.1.0/24
# /24 = 24 bits are network, 8 bits are hosts
# Network: 192.168.1.0   Broadcast: 192.168.1.255   Hosts: 192.168.1.1 - .254
# Usable hosts: 2^8 - 2 = 254

# Common subnet masks
/8  = 255.0.0.0       16M hosts
/16 = 255.255.0.0     65534 hosts
/24 = 255.255.255.0   254 hosts
/28 = 255.255.255.240 14 hosts
/30 = 255.255.255.252 2 hosts (point-to-point)`} />
        </Sub>
        <Sub title="IPv6">
          <CodeBlock language="bash" code={`# IPv6: 128 bits, hex groups separated by colons
2001:0db8:85a3:0000:0000:8a2e:0370:7334

# Abbreviations
2001:db8:85a3::8a2e:370:7334   # consecutive zeros -> ::
::1                             # loopback (like 127.0.0.1)
fe80::1                         # link-local (like 169.254.x.x)

# IPv6 commands
ip -6 addr show
ping6 ::1
curl -6 https://example.com`} />
        </Sub>
      </Section>

      <Section num="4" title="DNS — How Names Resolve to IPs">
        <InfoBox>DNS is the phone book of the internet. When you type <code>google.com</code>, your computer asks a DNS resolver to find the IP address. This involves a hierarchy of servers and up to 8 network round-trips for a cold cache.</InfoBox>
        <Sub title="DNS resolution steps">
          <CodeBlock language="bash" code={`You type: google.com in browser

1. Browser cache          → hit? done
2. OS cache (/etc/hosts)  → hit? done
3. Recursive resolver     → your ISP's DNS or 8.8.8.8
4. Root nameserver        → "I don't know .com — ask 192.5.6.30"
5. TLD nameserver (.com)  → "google.com is at 216.239.32.10"
6. Authoritative NS       → "google.com A record is 142.250.185.46"
7. Resolver caches result → TTL determines how long to keep

Total: often < 50ms (cache hits) to 200ms (full lookup)`} />
        </Sub>
        <Sub title="DNS record types">
          <CodeBlock language="bash" code={`A      example.com → 93.184.216.34         (IPv4 address)
AAAA   example.com → 2606:2800:220:1::93     (IPv6 address)
CNAME  www.ex.com  → example.com             (alias)
MX     example.com → mail.example.com:10     (mail server + priority)
TXT    example.com → "v=spf1 include:..."    (text, used for SPF/DKIM)
NS     example.com → ns1.nameserver.com      (nameserver)
PTR    34.216.184.93.in-addr.arpa → example.com (reverse lookup)
SOA    Start of Authority — zone metadata

# Commands
dig example.com           # full DNS info
dig example.com A         # just A records
dig example.com MX
dig +short example.com    # just the IP
dig @8.8.8.8 example.com  # use Google's DNS
nslookup example.com
host example.com`} />
        </Sub>
      </Section>

      <Section num="5" title="Packets and Frames — Data Transfer">
        <CodeBlock language="bash" code={`# A packet is the unit at Layer 3 (IP)
# Maximum packet size: MTU (Maximum Transmission Unit)
ip link show eth0   # check MTU
# usually 1500 bytes for Ethernet

# If data > MTU, IP fragmentation occurs (or TCP does it itself)
# TCP: Maximum Segment Size (MSS) ≈ MTU - 40 bytes = 1460 bytes
# So a 10KB file needs ~7 TCP segments

# Packet structure (IPv4):
# ┌─────────────────────────────────────┐
# │ IP Header (20 bytes)                │
# │  Version | IHL | DSCP | Total Length│
# │  ID | Flags | Fragment Offset       │
# │  TTL | Protocol | Header Checksum   │
# │  Source IP                          │
# │  Destination IP                     │
# ├─────────────────────────────────────┤
# │ TCP Header (20+ bytes)              │
# │  Source Port | Dest Port            │
# │  Sequence Number                    │
# │  Acknowledgement Number             │
# │  Flags (SYN ACK FIN RST PSH URG)   │
# │  Window Size                        │
# ├─────────────────────────────────────┤
# │ Data (payload)                      │
# └─────────────────────────────────────┘

# TTL — Time To Live
# Starts at 64 (Linux) or 128 (Windows), decremented at each router hop
# When TTL reaches 0, router drops packet and sends ICMP "Time Exceeded"
# traceroute works by sending packets with increasing TTL
traceroute google.com   # Linux
tracert google.com      # Windows`} />
      </Section>

      <Section num="6" title="TCP — Reliable Transport">
        <Sub title="Three-way handshake">
          <CodeBlock language="bash" code={`# TCP connection establishment
Client              Server
   │                  │
   │──── SYN ────────▶│  Client: "I want to connect, my seq# is 1000"
   │                  │
   │◀─── SYN-ACK ─────│  Server: "OK, my seq# is 2000, ack your 1001"
   │                  │
   │──── ACK ────────▶│  Client: "Acknowledged, starting data transfer"
   │                  │
   │══════ DATA ══════│  Connection established!

# Connection teardown (4-way)
Client: FIN →
Server: ← ACK
Server: ← FIN
Client: ACK →
# TIME_WAIT state: client waits 2*MSL before fully closing`} />
        </Sub>
        <Sub title="TCP features and tuning">
          <CodeBlock language="bash" code={`# Reliability mechanisms
Sequence numbers  → detect missing segments
Acknowledgements → confirm receipt
Retransmission   → resend on timeout or 3 duplicate ACKs
Checksums        → detect corruption

# Flow control: receiver advertises window size
# "Don't send more than X bytes ahead of what I've acked"

# Congestion control: TCP adjusts send rate to avoid overloading network
Slow start        → double window every RTT until threshold
Congestion avoid  → linear increase after threshold
Fast recovery     → cut window on loss, recover quickly

# Check TCP connections
ss -tnp                    # all TCP connections with PIDs
ss -tn state established   # only established
ss -tn state time-wait     # TIME_WAIT connections
netstat -s                 # TCP/IP statistics
cat /proc/net/sockstat      # socket summary

# Tune TCP (Linux)
sysctl net.ipv4.tcp_keepalive_time     # default 7200s
sysctl net.core.somaxconn              # listen() backlog max
sysctl net.ipv4.tcp_max_syn_backlog    # SYN queue depth`} />
        </Sub>
      </Section>

      <Section num="7" title="UDP — Fast, Unreliable Transport">
        <CodeBlock language="bash" code={`# UDP: no handshake, no guarantee, no ordering, no congestion control
# Header is only 8 bytes (vs 20+ for TCP)

UDP header:
  Source Port (2 bytes)
  Destination Port (2 bytes)
  Length (2 bytes)
  Checksum (2 bytes)
  Data...

# Use UDP when:
✅ Speed matters more than reliability   (gaming, VoIP, live streaming)
✅ You implement your own reliability    (QUIC/HTTP3 is UDP + reliability in userspace)
✅ Broadcast/multicast required         (UDP supports, TCP doesn't)
✅ Simple request/response (DNS)        — one packet each way
✅ Data is so fresh that retransmit is pointless (stock tickers)

# DNS over UDP — port 53
# Responses > 512 bytes fall back to TCP
# QUIC (HTTP/3) — UDP with reliability in application layer

# UDP packet loss test
iperf3 -s                           # server
iperf3 -c server-ip -u -b 100M      # client: UDP at 100 Mbps`} />
      </Section>

      <Section num="8" title="Routing Fundamentals">
        <CodeBlock language="bash" code={`# Routing: how does a packet get from A to B?
# Each router looks at destination IP, finds best next-hop in routing table

# View routing table
ip route show      # Linux
route -n           # Linux (legacy)
netstat -rn        # BSD/macOS

# Example routing table:
# Destination     Gateway         Genmask         Interface
# 0.0.0.0         192.168.1.1     0.0.0.0         eth0      <- default route
# 192.168.1.0     0.0.0.0         255.255.255.0   eth0      <- local network
# 10.0.0.0        10.8.0.1        255.0.0.0       tun0      <- VPN

# Add/remove routes
ip route add 10.0.0.0/8 via 192.168.1.1 dev eth0
ip route del 10.0.0.0/8

# ARP — map IP to MAC on local network
arp -n             # ARP cache
ip neigh show      # modern version

# Protocols
OSPF    — link-state, used inside organizations (IGP)
BGP     — path-vector, glues the internet together (EGP)
        — your ISP uses BGP to exchange routes with others
RIP     — distance-vector, legacy, max 15 hops

# ICMP — control messages
ping  → ICMP echo request/reply
traceroute → ICMP time exceeded messages
"Destination Unreachable" → no route to host`} />
      </Section>

      <Section num="9" title="Network Programming in Python">
        <Sub title="TCP client and server">
          <CodeBlock language="python" code={`import socket
import threading

# ── TCP server ─────────────────────────────────────────────────────
def handle_client(conn, addr):
    print(f"Connected: {addr}")
    with conn:
        while True:
            data = conn.recv(1024)
            if not data: break
            response = data.upper()   # echo back uppercased
            conn.sendall(response)

server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
server.bind(('', 8080))
server.listen(10)
print("Listening on :8080")
while True:
    conn, addr = server.accept()
    threading.Thread(target=handle_client, args=(conn, addr)).start()

# ── TCP client ─────────────────────────────────────────────────────
with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.settimeout(5)
    s.connect(('localhost', 8080))
    s.sendall(b'hello world')
    response = s.recv(1024)
    print(response)  # b'HELLO WORLD'`} />
        </Sub>
        <Sub title="DNS lookup and HTTP probe">
          <CodeBlock language="python" code={`import socket
import time

def dns_lookup(hostname):
    """Resolve hostname to all IPs."""
    results = socket.getaddrinfo(hostname, None)
    ips = set()
    for result in results:
        family, _, _, _, sockaddr = result
        ip = sockaddr[0]
        fam = 'IPv4' if family == socket.AF_INET else 'IPv6'
        ips.add((fam, ip))
    return ips

def tcp_probe(host, port, timeout=3):
    """Check if a TCP port is open."""
    start = time.perf_counter()
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.settimeout(timeout)
            s.connect((host, port))
        ms = (time.perf_counter() - start) * 1000
        return True, ms
    except (socket.timeout, ConnectionRefusedError, OSError) as e:
        return False, str(e)

for ip_info in dns_lookup('example.com'):
    print(ip_info)

open, ms = tcp_probe('example.com', 443)
print(f"Port 443: {'open' if open else 'closed'} ({ms:.1f}ms)")`} />
        </Sub>
      </Section>

      <Section num="10" title="Network Programming in Node.js">
        <CodeBlock language="javascript" code={`import net from 'net'
import dgram from 'dgram'
import dns from 'dns/promises'

// ── TCP server ─────────────────────────────────────────────────────
const server = net.createServer((socket) => {
  console.log('Client connected:', socket.remoteAddress)

  socket.on('data', (data) => {
    socket.write(data.toString().toUpperCase())
  })
  socket.on('end', () => console.log('Client disconnected'))
  socket.on('error', (err) => console.error('Socket error:', err.message))
})
server.listen(8080, () => console.log('Listening on :8080'))

// ── TCP client ─────────────────────────────────────────────────────
const client = net.createConnection({ port: 8080 }, () => {
  client.write('hello world')
})
client.on('data', (data) => {
  console.log('Received:', data.toString())  // 'HELLO WORLD'
  client.end()
})

// ── UDP (datagram) ─────────────────────────────────────────────────
const udpServer = dgram.createSocket('udp4')
udpServer.on('message', (msg, rinfo) => {
  console.log(\`UDP from \${rinfo.address}:\${rinfo.port}: \${msg}\`)
  udpServer.send('ACK', rinfo.port, rinfo.address)
})
udpServer.bind(9000)

const udpClient = dgram.createSocket('udp4')
udpClient.send('ping', 9000, 'localhost', (err) => {
  udpClient.close()
})

// ── DNS lookup ─────────────────────────────────────────────────────
const records = await dns.resolve4('example.com')   // A records
const mx = await dns.resolveMx('example.com')        // MX records
const { address } = await dns.lookup('example.com')  // getaddrinfo`} />
      </Section>

      <Section num="11" title="Analyzing Traffic — tcpdump and Wireshark">
        <CodeBlock language="bash" code={`# tcpdump — capture packets on the command line
sudo tcpdump -i eth0                    # capture all traffic on eth0
sudo tcpdump -i any                     # all interfaces
sudo tcpdump -i eth0 port 80            # only port 80
sudo tcpdump -i eth0 host 192.168.1.5   # traffic to/from IP
sudo tcpdump -i eth0 'tcp and port 443'
sudo tcpdump -i eth0 -w capture.pcap    # write to file (open in Wireshark)
sudo tcpdump -r capture.pcap            # read saved capture

# Useful filters (BPF syntax)
tcp                                     # TCP only
udp port 53                             # DNS
ip host 8.8.8.8                        # to/from Google DNS
not port 22                             # exclude SSH
src 192.168.1.100 and dst port 443      # HTTPS from specific host
tcp[tcpflags] & tcp-syn != 0            # SYN packets only

# Decode HTTP
sudo tcpdump -i eth0 -A port 80         # show ASCII payload
sudo tcpdump -i eth0 -X port 80         # show hex+ASCII

# Wireshark filters (display filters, not capture filters)
http.request.method == "POST"
tcp.port == 8080
ip.addr == 192.168.1.1
dns.qry.name contains "google"
tcp.flags.syn == 1 && tcp.flags.ack == 0   # SYN packets`} />
      </Section>

      <Section num="12" title="Latency, Throughput, and Bandwidth">
        <CodeBlock language="bash" code={`# Latency — time for one packet to travel
# Measured as RTT (Round Trip Time) with ping
ping google.com
# rtt min/avg/max/mdev = 12.3/14.1/18.2/1.3 ms

# Components of latency:
# Propagation delay   = distance / speed of light (fiber: ~200,000 km/s)
#   London to NYC ≈ 5500km → 27ms minimum
# Transmission delay  = packet_size / link_bandwidth
#   1500 byte packet on 100Mbps = 0.12ms
# Queuing delay       = time waiting in router buffer
# Processing delay    = router lookup time (negligible on modern HW)

# Throughput vs bandwidth
# Bandwidth = max capacity of a link (e.g., 1 Gbps fiber)
# Throughput = actual data transfer rate (limited by slowest link + protocol)
# Throughput ≤ Bandwidth

# TCP throughput limited by:
# throughput ≈ window_size / RTT
# At 14ms RTT with 65KB window: 65536 * 8 / 0.014 ≈ 37 Mbps (even on 1Gbps link!)
# Fix: increase TCP window size, use TCP window scaling, or HTTP/2 multiplexing

# Measure throughput
iperf3 -s                          # server
iperf3 -c server-ip -t 10          # TCP test, 10 seconds
iperf3 -c server-ip -u -b 0        # UDP test
speedtest-cli                       # internet speed test

# Bandwidth tools
vnstat                              # historical bandwidth
iftop -i eth0                       # live per-connection bandwidth
nethogs eth0                        # bandwidth per process`} />
      </Section>

      <Section num="13" title="Firewalls, NAT, and Port Forwarding">
        <Sub title="iptables / ufw">
          <CodeBlock language="bash" code={`# ufw — simple frontend to iptables (Ubuntu/Debian)
sudo ufw status verbose
sudo ufw enable
sudo ufw allow 22/tcp           # allow SSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow from 192.168.1.0/24 to any port 5432  # Postgres from LAN only
sudo ufw deny 3306/tcp          # block MySQL from outside
sudo ufw delete allow 80/tcp    # remove rule

# iptables — direct (more powerful)
sudo iptables -L -n -v                       # list rules
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -P INPUT DROP                  # default deny

# NAT — Network Address Translation
# Your home router: many private IPs share one public IP
# SNAT (Source NAT): outbound — change source IP to router's public IP
# DNAT (Destination NAT): inbound — port forwarding to internal host
sudo iptables -t nat -A PREROUTING -p tcp --dport 8080 -j DNAT --to 192.168.1.100:80
sudo iptables -t nat -A POSTROUTING -s 192.168.0.0/16 -j MASQUERADE  # SNAT`} />
        </Sub>
      </Section>

      <Section num="14" title="VPNs and Tunneling">
        <CodeBlock language="bash" code={`# VPN types:
# OpenVPN  — SSL-based, very compatible, port 1194 UDP
# WireGuard — modern, fast, simple config, port 51820 UDP
# IPSec    — enterprise, complex, built into OS kernels
# SSH tunnels — quick, no extra software

# WireGuard — generate keys
wg genkey | tee privatekey | wg pubkey > publickey

# WireGuard config (/etc/wireguard/wg0.conf)
# [Interface]
# PrivateKey = <server_private_key>
# Address = 10.0.0.1/24
# ListenPort = 51820
#
# [Peer]
# PublicKey = <client_public_key>
# AllowedIPs = 10.0.0.2/32

sudo wg-quick up wg0    # start
sudo wg-quick down wg0  # stop
wg show                 # status

# SSH tunnels — no VPN software needed
# Local port forwarding: access remote service locally
ssh -L 5432:db.internal:5432 user@jumpserver
# → connect to localhost:5432 → routed to db.internal:5432 via jumpserver

# Remote port forwarding: expose local service remotely
ssh -R 8080:localhost:3000 user@public-server
# → public-server:8080 → routed to your localhost:3000

# SOCKS proxy — route all traffic through SSH
ssh -D 1080 user@server
# Configure browser to use SOCKS5 proxy at localhost:1080

# Tunneling with socat
socat TCP4-LISTEN:8080,fork TCP4:target-host:80`} />
      </Section>

      <Section num="15" title="Mini Project: Port Scanner and Network Probe">
        <p>A concurrent port scanner that checks which TCP ports are open on a host and performs a basic banner grab to identify services.</p>
        <CodeBlock language="python" code={`#!/usr/bin/env python3
"""
network_probe.py — concurrent port scanner with banner grabbing
Usage: python network_probe.py 192.168.1.1 --ports 1-1024
"""
import socket
import threading
import argparse
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime

# Well-known port → service name
KNOWN_PORTS = {
    21: 'FTP', 22: 'SSH', 23: 'Telnet', 25: 'SMTP',
    53: 'DNS', 80: 'HTTP', 110: 'POP3', 143: 'IMAP',
    443: 'HTTPS', 445: 'SMB', 3306: 'MySQL', 5432: 'PostgreSQL',
    6379: 'Redis', 8080: 'HTTP-Alt', 27017: 'MongoDB',
}

def grab_banner(host: str, port: int, timeout: float = 2.0) -> str:
    """Try to grab a service banner."""
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.settimeout(timeout)
            s.connect((host, port))
            if port in (80, 8080, 8443):
                s.sendall(b'HEAD / HTTP/1.0\\r\\nHost: ' + host.encode() + b'\\r\\n\\r\\n')
            s.settimeout(1.0)
            banner = s.recv(1024).decode(errors='replace').strip()
            return banner[:80]
    except Exception:
        return ''

def scan_port(host: str, port: int, timeout: float) -> dict | None:
    """Return port info if open, None if closed."""
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.settimeout(timeout)
            result = s.connect_ex((host, port))
        if result == 0:
            service = KNOWN_PORTS.get(port, '?')
            banner = grab_banner(host, port)
            return {'port': port, 'service': service, 'banner': banner}
    except Exception:
        pass
    return None

def parse_port_range(spec: str) -> list[int]:
    """Parse '80', '80,443', or '1-1024'."""
    ports = []
    for part in spec.split(','):
        if '-' in part:
            start, end = part.split('-')
            ports.extend(range(int(start), int(end) + 1))
        else:
            ports.append(int(part))
    return sorted(set(ports))

def main():
    parser = argparse.ArgumentParser(description='Network port scanner')
    parser.add_argument('host', help='Target hostname or IP')
    parser.add_argument('--ports', default='1-1024', help='Port range (e.g. 1-1024, 80,443)')
    parser.add_argument('--timeout', type=float, default=1.0, help='Timeout per port (s)')
    parser.add_argument('--workers', type=int, default=200, help='Concurrent threads')
    args = parser.parse_args()

    # Resolve hostname
    try:
        ip = socket.gethostbyname(args.host)
    except socket.gaierror:
        print(f"Cannot resolve {args.host}", file=sys.stderr)
        sys.exit(1)

    ports = parse_port_range(args.ports)
    print(f"Scanning {args.host} ({ip}) — {len(ports)} ports — {datetime.now():%H:%M:%S}")
    print("-" * 60)

    open_ports = []
    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        futures = {pool.submit(scan_port, ip, p, args.timeout): p for p in ports}
        for future in as_completed(futures):
            result = future.result()
            if result:
                open_ports.append(result)

    open_ports.sort(key=lambda x: x['port'])
    if open_ports:
        for p in open_ports:
            banner = f"  {p['banner']}" if p['banner'] else ''
            print(f"  {p['port']:5d}/tcp  {p['service']:<12}{banner}")
    else:
        print("  No open ports found")

    print("-" * 60)
    print(f"Found {len(open_ports)} open port(s)")

if __name__ == '__main__':
    main()`} />
      </Section>
    </div>
  )
}
