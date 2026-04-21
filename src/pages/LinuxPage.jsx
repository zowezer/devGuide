import CodeBlock from '../components/CodeBlock'
import Section, { Sub, InfoBox, WarnBox, TipBox } from '../components/Section'

const sections = [
  'File System and Navigation',
  'File Permissions',
  'Searching and Text Processing',
  'Pipes, Redirection and Process Substitution',
  'Process Management',
  'Networking Commands',
  'Shell Scripting',
  'Package Management',
  'Environment Variables and Configuration',
  'User and Group Management',
  'Archives and Compression',
  'System Monitoring and Performance',
  'Vim Essentials',
  'Common Patterns and Idioms',
  'Mini Project: Server Setup Script',
]

export default function LinuxPage() {
  return (
    <div>
      <div className="page-hero">
        <div className="lang-icon">🐧</div>
        <div>
          <h1>Linux</h1>
          <p>
            The OS that runs the internet. Nearly every server, cloud instance, and container runs
            Linux. As a developer, mastering the command line turns you from a GUI-dependent coder
            into a systems power user who can automate, debug, and deploy anything.
          </p>
          <div className="badges">
            <span className="badge green">Open Source</span>
            <span className="badge">POSIX Standard</span>
            <span className="badge yellow">CLI Mastery</span>
            <span className="badge purple">Everything is a File</span>
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

      <Section num="1" title="File System and Navigation">
        <InfoBox>Linux uses a single tree rooted at <code>/</code>. There are no drive letters like Windows. Everything — devices, sockets, pipes — is a file.</InfoBox>
        <CodeBlock language="bash" code={`# Navigation
pwd                        # print working directory
ls                         # list files
ls -la                     # long format + hidden files
ls -lh                     # human-readable sizes
cd /path/to/dir            # absolute path
cd ~                       # home directory
cd -                       # previous directory
cd ..                      # parent directory

# Files and Directories
mkdir newdir
mkdir -p path/to/nested    # create with parents
touch file.txt             # create empty file
cp source.txt dest.txt
cp -r src/ dest/           # copy directory
mv old.txt new.txt         # rename or move
rm file.txt
rm -rf directory/          # delete recursively (careful!)
ln -s /path/to/file link   # symbolic link

# View Files
cat file.txt               # print entire file
head -20 file.txt          # first 20 lines
tail -20 file.txt          # last 20 lines
tail -f app.log            # follow log file live
less file.txt              # paginated viewer (q to quit)
wc -l file.txt             # count lines`} />
      </Section>

      <Section num="2" title="File Permissions">
        <InfoBox><code>ls -la</code> output: <code>-rwxr-xr-x 1 alice devs 4096 Apr 20 main.sh</code> — type + permissions (owner|group|other) + links + owner + group + size + date + name</InfoBox>
        <CodeBlock language="bash" code={`# chmod — change permissions
# r=4  w=2  x=1  (octal notation)
chmod 755 script.sh    # rwxr-xr-x
chmod 644 data.txt     # rw-r--r--
chmod +x script.sh     # add execute for everyone
chmod go-w file.txt    # remove write from group and other

# Ownership
chown alice file.txt             # change owner
chown alice:devs file.txt        # change owner and group
chgrp devs dir/                  # change group only
chown -R alice:devs project/     # recursive

# Special bits
chmod 4755 program   # setuid: runs as file owner
chmod 2755 dir       # setgid: new files inherit group
chmod 1777 /tmp      # sticky: only owner can delete own files

# umask — default permissions subtracted from 666/777
umask                # see current (often 022)
umask 022            # new files 644, new dirs 755`} />
      </Section>

      <Section num="3" title="Searching and Text Processing">
        <CodeBlock language="bash" code={`# find — locate files
find . -name "*.js"
find . -type d -name "node_modules"
find . -size +10M
find . -newer reference.txt
find . -name "*.log" -delete
find . -name "*.py" -exec wc -l {} \\;

# grep — search content
grep "pattern" file.txt
grep -r "TODO" ./src           # recursive
grep -rn "import React" ./src  # show line numbers
grep -i "error" app.log        # case-insensitive
grep -v "debug" app.log        # invert (exclude)
grep -E "err|warn" app.log     # OR pattern
grep -l "pattern" *.txt        # only show filenames

# sed — stream editor
sed 's/old/new/g' file.txt           # replace all
sed -i 's/localhost/prod.db/g' cfg   # in-place edit
sed -n '10,20p' file.txt             # print lines 10-20
sed '/pattern/d' file.txt            # delete matching lines

# awk — column processing
awk '{print $1, $3}' data.txt
awk -F: '{print $1}' /etc/passwd     # colon delimiter
awk '$3 > 100 {print $1}' data.txt
awk '{sum+=$2} END {print sum}' f    # sum column`} />
      </Section>

      <Section num="4" title="Pipes, Redirection and Process Substitution">
        <CodeBlock language="bash" code={`# Pipes — chain commands
ls -la | grep ".txt"
cat app.log | grep ERROR | wc -l
ps aux | grep node | awk '{print $2}'

# Redirection
command > file.txt        # stdout to file (overwrite)
command >> file.txt       # stdout to file (append)
command 2> error.log      # stderr to file
command &> all.log        # both stdout and stderr
command < input.txt       # stdin from file
command 2>/dev/null       # discard errors

# Useful combinations
sort file.txt | uniq
sort file.txt | uniq -c | sort -rn   # frequency count
cut -d',' -f2 data.csv               # extract CSV column

# xargs — build arg lists from stdin
find . -name "*.log" | xargs rm
cat urls.txt | xargs curl -O
echo "1 2 3" | xargs -n1 echo

# tee — write to file AND pass through
make 2>&1 | tee build.log | grep error

# Process substitution
diff <(sort file1.txt) <(sort file2.txt)`} />
      </Section>

      <Section num="5" title="Process Management">
        <CodeBlock language="bash" code={`# View processes
ps aux                    # all processes
ps aux | grep java
pgrep nginx               # find PID by name
pidof nginx

# Signals and killing
kill 1234                 # SIGTERM (graceful)
kill -9 1234              # SIGKILL (force)
killall nginx
pkill -f "node server"    # match full command

# Background jobs
command &                 # run in background
jobs                      # list background jobs
fg %1                     # bring to foreground
bg %1                     # send to background
nohup command &           # survive terminal close
disown %1                 # detach from terminal

# systemd — service management
systemctl start nginx
systemctl stop nginx
systemctl restart nginx
systemctl enable nginx       # start on boot
systemctl disable nginx
systemctl status nginx
journalctl -u nginx -f       # follow service logs
journalctl -u nginx --since "1h ago"

# Resource usage
df -h                     # disk space
du -sh ./node_modules     # directory size
free -h                   # memory
lscpu                     # CPU info`} />
      </Section>

      <Section num="6" title="Networking Commands">
        <CodeBlock language="bash" code={`# Connectivity
ping google.com
traceroute google.com
curl https://api.example.com
curl -X POST -H "Content-Type: application/json" \\
  -d '{"name":"Alice"}' https://api.example.com/users
curl -o output.html https://example.com   # save to file
wget https://example.com/file.zip

# DNS
nslookup example.com
dig example.com
dig example.com MX          # mail records
host example.com

# Ports and connections
ss -tlnp                    # listening ports (modern)
netstat -tlnp               # older alternative
lsof -i :3000               # what uses port 3000
lsof -i tcp                 # all TCP connections

# SSH
ssh user@server.com
ssh -i ~/.ssh/key.pem user@server
ssh -L 8080:localhost:3000 user@server   # port forward
scp file.txt user@server:/path/
rsync -avz ./src/ user@server:/app/`} />
      </Section>

      <Section num="7" title="Shell Scripting">
        <CodeBlock language="bash" code={`#!/usr/bin/env bash
set -euo pipefail    # exit on error | unset var | pipe failure

# Variables
NAME="World"
echo "Hello, \${NAME}!"
RESULT=\$(command)   # capture output
COUNT=0
((COUNT++))          # arithmetic

# Arrays
fruits=("apple" "banana" "cherry")
echo "\${fruits[0]}"          # apple
echo "\${fruits[@]}"          # all elements
echo "\${#fruits[@]}"         # length

# Functions
greet() {
  local name="\$1"            # local variable
  echo "Hello, \$name!"
  return 0
}
greet "Alice"

# Conditionals
if [[ -f "file.txt" ]]; then
  echo "file exists"
elif [[ -d "dir" ]]; then
  echo "dir exists"
fi

# String tests
[[ -z "\$VAR" ]]    # empty string
[[ -n "\$VAR" ]]    # non-empty
[[ "\$A" == "\$B" ]]
[[ "\$A" =~ ^[0-9]+\$ ]]   # regex match

# File tests
[[ -f file ]]   # regular file
[[ -d dir  ]]   # directory
[[ -x bin  ]]   # executable

# Loops
for i in {1..10}; do echo \$i; done
for f in *.txt; do process "\$f"; done
while IFS= read -r line; do
  echo "\$line"
done < input.txt

# Error handling pattern
die() { echo "ERROR: \$*" >&2; exit 1; }
[[ -f config.json ]] || die "config.json missing"`} />
      </Section>

      <Section num="8" title="Package Management">
        <Sub title="apt (Debian / Ubuntu)">
          <CodeBlock language="bash" code={`sudo apt update            # refresh package list
sudo apt upgrade           # upgrade all
sudo apt install nginx
sudo apt remove nginx      # uninstall (keep config)
sudo apt purge nginx       # uninstall + remove config
apt search "web server"
apt show nginx             # package info
dpkg -l | grep nginx       # list installed
dpkg -L nginx              # files installed by package`} />
        </Sub>
        <Sub title="yum / dnf (RHEL / CentOS / Amazon Linux)">
          <CodeBlock language="bash" code={`sudo yum update
sudo yum install nginx
sudo dnf install nginx     # newer systems

# Find executables
which node
whereis node

# Common tools
sudo apt install -y curl wget git htop jq tree vim build-essential`} />
        </Sub>
      </Section>

      <Section num="9" title="Environment Variables and Configuration">
        <CodeBlock language="bash" code={`# View
env                         # all vars
printenv HOME
echo \$PATH

# Set (current session)
export MY_VAR="value"
export PATH="\$PATH:/new/bin"

# Set permanently
echo 'export MY_VAR="value"' >> ~/.bashrc
source ~/.bashrc            # reload

# .env files
cat .env                    # DB_HOST=localhost
source .env                 # load into current shell

# System-wide
# /etc/environment          — always loaded
# /etc/profile.d/*.sh       — login shells

# Cron jobs
crontab -e                  # edit
crontab -l                  # list
# minute hour day month weekday command
# 0 2 * * *  /backup.sh    — 2 AM daily
# */5 * * * * /check.sh    — every 5 min
# @reboot     /startup.sh  — on boot`} />
      </Section>

      <Section num="10" title="User and Group Management">
        <CodeBlock language="bash" code={`# Users
id                          # current user info
whoami                      # username
who                         # who is logged in
last                        # login history

sudo useradd -m -s /bin/bash alice    # create user with home + shell
sudo passwd alice                     # set password
sudo usermod -aG docker alice         # add to group
sudo userdel -r alice                 # delete user + home

# Groups
getent group docker         # who is in docker group
groups alice                # groups alice belongs to
sudo groupadd mygroup
sudo groupdel mygroup

# sudo
sudo command                # run as root
sudo -u alice command       # run as alice
sudo -i                     # root shell
sudo visudo                 # edit /etc/sudoers safely

# /etc/passwd format: user:x:uid:gid:comment:home:shell
getent passwd alice
cat /etc/passwd | awk -F: '{print \$1, \$3, \$7}'  # user uid shell

# Switch users
su - alice                  # switch to alice (full login env)
su -c "command" alice       # run one command as alice`} />
      </Section>

      <Section num="11" title="Archives and Compression">
        <CodeBlock language="bash" code={`# tar — tape archive
tar -czf archive.tar.gz dir/     # create gzip archive
tar -cjf archive.tar.bz2 dir/    # create bzip2 archive
tar -xzf archive.tar.gz          # extract
tar -xzf archive.tar.gz -C /dest # extract to directory
tar -tzf archive.tar.gz          # list contents
tar -czf backup.tar.gz --exclude='*.log' dir/

# gzip / gunzip
gzip file.txt              # creates file.txt.gz, removes original
gunzip file.txt.gz
gzip -k file.txt           # keep original
gzip -d file.txt.gz        # decompress (same as gunzip)

# zip / unzip
zip -r archive.zip dir/
zip archive.zip file1 file2
unzip archive.zip
unzip archive.zip -d /dest/
unzip -l archive.zip       # list without extracting

# Common pattern: create and transfer
tar -czf - ./project | ssh user@server "cat > backup.tar.gz"

# Check file type
file unknown.archive       # detect format`} />
      </Section>

      <Section num="12" title="System Monitoring and Performance">
        <CodeBlock language="bash" code={`# CPU and memory
top                         # live process monitor (q to quit)
htop                        # better top (if installed)
vmstat 1 5                  # VM stats every 1s, 5 times
mpstat 1                    # per-CPU stats

# Disk I/O
iostat -x 1                 # disk stats
iotop                       # I/O by process (needs root)
df -h                       # disk space
df -i                       # inode usage
du -sh *                    # size of each item

# Network
ifconfig                    # network interfaces (legacy)
ip addr                     # modern replacement
ip route                    # routing table
iftop                       # live bandwidth (needs root)
nethogs                     # bandwidth by process

# System info
uname -a                    # kernel version + arch
lsb_release -a              # distro info
lscpu                       # CPU details
lsmem                       # memory details
dmidecode -t memory         # physical RAM info

# Logs
journalctl -f               # follow all system logs
journalctl -u nginx -n 100  # last 100 lines for service
dmesg | tail -20            # kernel ring buffer
tail -f /var/log/syslog     # traditional syslog`} />
        <TipBox>Use <code>watch -n 2 df -h</code> to re-run any command every 2 seconds — great for watching disk fill during a big copy.</TipBox>
      </Section>

      <Section num="13" title="Vim Essentials">
        <InfoBox>Vim is available on virtually every Linux system — knowing the basics saves you when nano is not installed or you are editing over SSH.</InfoBox>
        <CodeBlock language="bash" code={`# Open / create a file
vim file.txt

# MODES
# Normal mode    — default, navigate + run commands
# Insert mode    — type text
# Visual mode    — select text
# Command mode   — :commands

# Normal mode shortcuts
i          # enter insert mode (before cursor)
a          # insert after cursor
o          # new line below, insert mode
Esc        # return to normal mode

# Navigation (normal mode)
h j k l    # left down up right
w / b      # next / previous word
0 / $      # start / end of line
gg / G     # top / bottom of file
:42        # go to line 42

# Editing (normal mode)
dd         # delete line
yy         # yank (copy) line
p          # paste below
u          # undo
Ctrl+r     # redo
x          # delete character
r          # replace one character

# Search
/pattern   # search forward
n / N      # next / previous match
:%s/old/new/g   # replace all in file

# Save and quit
:w         # write (save)
:q         # quit
:wq        # save and quit
:q!        # quit without saving
ZZ         # save and quit (shortcut)`} />
      </Section>

      <Section num="14" title="Common Patterns and Idioms">
        <Sub title="One-liners for common tasks">
          <CodeBlock language="bash" code={`# Find and kill a process by port
kill \$(lsof -t -i:3000)

# Run command on each line of a file
while IFS= read -r server; do ssh "\$server" uptime; done < servers.txt

# Backup with timestamp
tar -czf "backup-\$(date +%Y%m%d-%H%M%S).tar.gz" ./data

# Show 10 largest files
du -ah . | sort -rh | head -10

# Watch for file changes (poor man's inotify)
while true; do inotifywait -e modify file.txt && process file.txt; done

# Retry a command up to N times
for i in {1..5}; do command && break || sleep 2; done

# Count occurrences of each value in a column
awk '{print \$1}' access.log | sort | uniq -c | sort -rn | head -20

# SSH config for quick aliases (~/.ssh/config)
# Host prod
#   HostName 1.2.3.4
#   User deploy
#   IdentityFile ~/.ssh/prod.pem`} />
        </Sub>
        <Sub title="Safe script template">
          <CodeBlock language="bash" code={`#!/usr/bin/env bash
set -euo pipefail
IFS=\$'\\n\\t'

readonly SCRIPT_DIR=\$(cd "\$(dirname "\$0")" && pwd)
readonly LOG_FILE="/tmp/\$(basename "\$0").log"

log()  { echo "[INFO]  \$*" | tee -a "\$LOG_FILE"; }
warn() { echo "[WARN]  \$*" | tee -a "\$LOG_FILE"; }
die()  { echo "[ERROR] \$*" >&2; exit 1; }

[[ "\$EUID" -eq 0 ]] || die "Must run as root"
[[ -n "\${1:-}" ]]   || die "Usage: \$0 <environment>"

ENV="\$1"
log "Starting deployment for \$ENV"
# ... rest of script`} />
        </Sub>
      </Section>

      <Section num="15" title="Mini Project: Server Setup Script">
        <p>A production-grade script that provisions a new Ubuntu server: creates a deploy user, hardens SSH, installs Docker, and sets up a firewall.</p>
        <CodeBlock language="bash" code={`#!/usr/bin/env bash
# server-setup.sh — idempotent Ubuntu 22.04 provisioner
set -euo pipefail

DEPLOY_USER="deploy"
SSH_PORT="2222"
ALLOWED_PORTS=(80 443)

log()  { echo "[\$(date +%H:%M:%S)] \$*"; }
die()  { echo "ERROR: \$*" >&2; exit 1; }

[[ "\$EUID" -eq 0 ]] || die "Run as root"
[[ -f /etc/lsb-release ]] || die "Ubuntu only"

# ── 1. System update ────────────────────────────────────────────────
log "Updating system packages..."
apt-get update -qq && apt-get upgrade -y -qq

# ── 2. Create deploy user ───────────────────────────────────────────
if ! id "\$DEPLOY_USER" &>/dev/null; then
  log "Creating user \$DEPLOY_USER..."
  useradd -m -s /bin/bash "\$DEPLOY_USER"
  usermod -aG sudo "\$DEPLOY_USER"
  mkdir -p "/home/\$DEPLOY_USER/.ssh"
  chmod 700 "/home/\$DEPLOY_USER/.ssh"
  # Copy authorized_keys from root if present
  [[ -f /root/.ssh/authorized_keys ]] && \\
    cp /root/.ssh/authorized_keys "/home/\$DEPLOY_USER/.ssh/"
  chown -R "\$DEPLOY_USER:\$DEPLOY_USER" "/home/\$DEPLOY_USER/.ssh"
else
  log "User \$DEPLOY_USER already exists, skipping."
fi

# ── 3. Harden SSH ───────────────────────────────────────────────────
log "Hardening SSH..."
cat > /etc/ssh/sshd_config.d/90-hardened.conf <<EOF
Port \$SSH_PORT
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
MaxAuthTries 3
EOF
systemctl restart ssh
log "SSH now on port \$SSH_PORT, root login disabled."

# ── 4. Firewall (ufw) ───────────────────────────────────────────────
log "Configuring firewall..."
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow "\$SSH_PORT/tcp"
for port in "\${ALLOWED_PORTS[@]}"; do
  ufw allow "\$port/tcp"
done
ufw --force enable
log "Firewall active. Open ports: SSH=\$SSH_PORT \${ALLOWED_PORTS[*]}"

# ── 5. Install Docker ───────────────────────────────────────────────
if ! command -v docker &>/dev/null; then
  log "Installing Docker..."
  curl -fsSL https://get.docker.com | bash
  usermod -aG docker "\$DEPLOY_USER"
  systemctl enable --now docker
else
  log "Docker already installed: \$(docker --version)"
fi

# ── 6. Install common tools ─────────────────────────────────────────
log "Installing utilities..."
apt-get install -y -qq git curl wget jq htop unzip

# ── 7. Summary ──────────────────────────────────────────────────────
log "Setup complete!"
log "  User:       \$DEPLOY_USER (sudo + docker)"
log "  SSH port:   \$SSH_PORT"
log "  Firewall:   active"
log "  Docker:     \$(docker --version 2>/dev/null | cut -d' ' -f3)"
log "Next: copy your SSH public key and test login as \$DEPLOY_USER"
`} />
        <WarnBox>Always test this script on a disposable VM before running on production. Double-check your SSH key is in <code>authorized_keys</code> before restarting SSH — or you will lock yourself out.</WarnBox>
      </Section>
    </div>
  )
}
