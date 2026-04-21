import CodeBlock from '../components/CodeBlock'
import Section, { Sub, InfoBox, TipBox, WarnBox } from '../components/Section'

const sections = [
  'os and pathlib — File System',
  'sys and platform — Runtime Info',
  'datetime and time',
  'json and csv',
  're — Regular Expressions',
  'collections — Specialized Containers',
  'itertools and functools',
  'threading and multiprocessing',
  'subprocess — Run System Commands',
  'socket and http.client — Networking',
  'logging',
  'argparse — CLI Argument Parsing',
  'unittest and mock — Testing',
  'dataclasses and typing',
  'contextlib, abc, and inspect',
]

export default function PythonStdlibPage() {
  return (
    <div>
      <div className="page-hero">
        <div className="lang-icon">📦</div>
        <div>
          <h1>Python Standard Library</h1>
          <p>
            Python ships with "batteries included" — the standard library covers file I/O,
            networking, concurrency, testing, data processing, and more without any pip install.
            This page is a practical reference for the most useful modules, with real examples
            you can run immediately.
          </p>
          <div className="badges">
            <span className="badge green">No Install Needed</span>
            <span className="badge">3.10+</span>
            <span className="badge yellow">Practical Examples</span>
            <span className="badge purple">Batteries Included</span>
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

      <Section num="1" title="os and pathlib — File System">
        <InfoBox>Prefer <code>pathlib.Path</code> for all new code — it's object-oriented and cross-platform. Use <code>os</code> for environment variables and process info.</InfoBox>
        <Sub title="pathlib — modern path handling">
          <CodeBlock language="python" code={`from pathlib import Path

p = Path('/home/alice/projects/app')

# Navigation
p.parent          # Path('/home/alice/projects')
p.name            # 'app'
p.stem            # 'config'  (no suffix)
p.suffix          # '.json'
p.parts           # ('/', 'home', 'alice', ...)

# Build paths (cross-platform, no string concat)
config = p / 'config' / 'settings.json'
# Path('/home/alice/projects/app/config/settings.json')

# Check
config.exists()
config.is_file()
config.is_dir()

# Read / write
text = config.read_text(encoding='utf-8')
config.write_text('{"debug": true}', encoding='utf-8')
data = config.read_bytes()

# Glob
for f in p.glob('**/*.py'):     # recursive
    print(f)
for f in p.glob('*.json'):      # current dir only
    print(f)

# Create / delete
Path('new_dir').mkdir(parents=True, exist_ok=True)
Path('file.txt').unlink(missing_ok=True)
Path('old').rename('new')

# Iterate directory
for child in p.iterdir():
    if child.is_file():
        print(child.name, child.stat().st_size)`} />
        </Sub>
        <Sub title="os — environment and process">
          <CodeBlock language="python" code={`import os

# Environment variables
os.environ.get('HOME', '/tmp')          # safe get with default
os.environ['MY_VAR'] = 'value'          # set
os.getenv('DB_URL')                     # None if missing

# Working directory
os.getcwd()
os.chdir('/tmp')

# Process
os.getpid()           # current process ID
os.getppid()          # parent process ID
os.cpu_count()        # logical CPUs

# Walk directory tree
for root, dirs, files in os.walk('/tmp'):
    for f in files:
        full_path = os.path.join(root, f)
        print(full_path)

# Path utilities (prefer pathlib, but these still appear)
os.path.join('a', 'b', 'c')        # 'a/b/c'
os.path.basename('/foo/bar.txt')   # 'bar.txt'
os.path.dirname('/foo/bar.txt')    # '/foo'
os.path.splitext('file.tar.gz')    # ('file.tar', '.gz')`} />
        </Sub>
      </Section>

      <Section num="2" title="sys and platform — Runtime Info">
        <CodeBlock language="python" code={`import sys
import platform

# Python version
sys.version               # '3.11.4 (main, ...)'
sys.version_info          # sys.version_info(major=3, minor=11, ...)
sys.version_info >= (3, 10)  # True

# Platform
sys.platform              # 'linux', 'darwin', 'win32'
platform.system()         # 'Linux', 'Darwin', 'Windows'
platform.machine()        # 'x86_64', 'arm64'
platform.python_implementation()  # 'CPython', 'PyPy'

# Command-line arguments
sys.argv                  # ['script.py', 'arg1', 'arg2']
sys.argv[0]               # script name
sys.argv[1:]              # user args

# Standard I/O
sys.stdin.readline()
sys.stdout.write("hello\\n")
sys.stderr.write("error\\n")

# Module search path
sys.path                  # list of directories searched for imports
sys.path.insert(0, '/my/modules')  # prepend

# Exit
sys.exit(0)               # exit with code 0 (success)
sys.exit(1)               # exit with error code

# Memory
sys.getsizeof([1,2,3])    # size of object in bytes
sys.getrecursionlimit()   # default 1000
sys.setrecursionlimit(5000)`} />
      </Section>

      <Section num="3" title="datetime and time">
        <CodeBlock language="python" code={`from datetime import datetime, date, timedelta, timezone

# Current time
now = datetime.now()                    # local time (naive)
utc = datetime.now(timezone.utc)        # UTC (aware)
today = date.today()

# Create
dt = datetime(2024, 6, 15, 9, 30, 0)
d  = date(2024, 6, 15)

# Arithmetic
tomorrow = today + timedelta(days=1)
next_week = now + timedelta(weeks=1)
diff = datetime(2025, 1, 1) - now
diff.days          # int
diff.total_seconds()  # float

# Formatting
now.strftime('%Y-%m-%d %H:%M:%S')    # '2024-06-15 09:30:00'
now.strftime('%d/%m/%Y')             # '15/06/2024'
now.isoformat()                      # '2024-06-15T09:30:00'

# Parsing
dt = datetime.strptime('2024-06-15', '%Y-%m-%d')
dt = datetime.fromisoformat('2024-06-15T09:30:00')

# Timezone conversion
import zoneinfo
london = datetime.now(zoneinfo.ZoneInfo('Europe/London'))
tokyo  = london.astimezone(zoneinfo.ZoneInfo('Asia/Tokyo'))

# Unix timestamps
import time
timestamp = time.time()             # 1700000000.123 (float seconds)
time.time_ns()                      # nanoseconds (int)
time.sleep(0.5)                     # sleep 500ms
datetime.fromtimestamp(timestamp)   # convert unix ts to datetime

# Measure execution time
start = time.perf_counter()
# ... code ...
elapsed = time.perf_counter() - start
print(f"{elapsed:.4f}s")`} />
      </Section>

      <Section num="4" title="json and csv">
        <Sub title="json">
          <CodeBlock language="python" code={`import json
from pathlib import Path

# Serialize
data = {'name': 'Alice', 'age': 30, 'scores': [95, 87, 92]}
s = json.dumps(data)                   # str
s = json.dumps(data, indent=2)         # pretty-printed
s = json.dumps(data, sort_keys=True)   # sorted keys

# Deserialize
obj = json.loads(s)                    # dict
obj = json.loads('{"key": "value"}')

# File I/O
Path('data.json').write_text(json.dumps(data, indent=2))
obj = json.loads(Path('data.json').read_text())

# Custom encoder for non-serializable types
from datetime import datetime
class DateTimeEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.isoformat()
        return super().default(obj)

json.dumps({'ts': datetime.now()}, cls=DateTimeEncoder)`} />
        </Sub>
        <Sub title="csv">
          <CodeBlock language="python" code={`import csv
from pathlib import Path

# Write CSV
rows = [
    ['name', 'age', 'city'],
    ['Alice', 30, 'London'],
    ['Bob', 25, 'Paris'],
]
with open('people.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerows(rows)

# Read CSV
with open('people.csv', newline='', encoding='utf-8') as f:
    reader = csv.reader(f)
    header = next(reader)          # skip header
    for row in reader:
        print(row)                 # ['Alice', '30', 'London']

# DictWriter / DictReader (keys = column names)
people = [{'name': 'Alice', 'age': 30}, {'name': 'Bob', 'age': 25}]
with open('people.csv', 'w', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=['name', 'age'])
    writer.writeheader()
    writer.writerows(people)

with open('people.csv', newline='') as f:
    for row in csv.DictReader(f):
        print(row)  # {'name': 'Alice', 'age': '30'}`} />
        </Sub>
      </Section>

      <Section num="5" title="re — Regular Expressions">
        <CodeBlock language="python" code={`import re

text = "Alice (30) called +44-7911-123456 on 2024-06-15"

# Search — find first match anywhere
m = re.search(r'\\d{4}-\\d{2}-\\d{2}', text)
if m:
    print(m.group())           # '2024-06-15'
    print(m.start(), m.end())  # position

# Match — only matches at START of string
re.match(r'Alice', text)

# Findall — all non-overlapping matches
re.findall(r'\\d+', text)      # ['30', '44', '7911', '123456', '2024', '06', '15']

# Finditer — match objects (use for groups/positions)
for m in re.finditer(r'\\b\\d{4}\\b', text):
    print(m.group(), m.start())

# Named groups
m = re.search(r'(?P<year>\\d{4})-(?P<month>\\d{2})-(?P<day>\\d{2})', text)
m.group('year')   # '2024'
m.groupdict()     # {'year': '2024', 'month': '06', 'day': '15'}

# Substitute
re.sub(r'\\d+', 'N', text)               # replace all digits
re.sub(r'(\\d{4})-(\\d{2})', r'\\2/\\1', text)  # swap year-month

# Compile for repeated use (performance)
phone_re = re.compile(r'\\+?[\\d\\-]{10,15}')
phone_re.findall(text)

# Flags
re.findall(r'alice', text, re.IGNORECASE)
re.search(r'^Alice.*\\d$', text, re.MULTILINE | re.DOTALL)`} />
      </Section>

      <Section num="6" title="collections — Specialized Containers">
        <CodeBlock language="python" code={`from collections import Counter, defaultdict, deque, namedtuple, OrderedDict, ChainMap

# Counter — count occurrences
words = ['apple', 'banana', 'apple', 'cherry', 'banana', 'apple']
c = Counter(words)
# Counter({'apple': 3, 'banana': 2, 'cherry': 1})
c.most_common(2)    # [('apple', 3), ('banana', 2)]
c['apple']          # 3
c['mango']          # 0 (no KeyError)
c += Counter(['apple', 'mango'])   # merge counts

# defaultdict — no KeyError on missing keys
dd = defaultdict(list)
dd['fruits'].append('apple')   # creates empty list if missing
dd['fruits'].append('banana')

word_groups = defaultdict(set)
for word in words:
    word_groups[word[0]].add(word)   # group by first letter

# deque — fast O(1) push/pop at both ends
dq = deque([1, 2, 3], maxlen=5)
dq.appendleft(0)     # [0, 1, 2, 3]
dq.append(4)         # [0, 1, 2, 3, 4]
dq.popleft()         # 0
dq.rotate(1)         # rotate right
# Use as sliding window: maxlen auto-discards old items
window = deque(maxlen=3)
for n in range(6):
    window.append(n)   # always last 3

# namedtuple — lightweight struct
Point = namedtuple('Point', ['x', 'y'])
p = Point(3, 4)
p.x, p.y        # 3, 4
p._asdict()     # {'x': 3, 'y': 4}
p._replace(x=0) # Point(x=0, y=4) (immutable, returns new)

# ChainMap — search multiple dicts in order
defaults = {'color': 'blue', 'size': 'medium'}
user_prefs = {'color': 'red'}
merged = ChainMap(user_prefs, defaults)
merged['color']  # 'red'  (user override)
merged['size']   # 'medium'  (default)`} />
      </Section>

      <Section num="7" title="itertools and functools">
        <Sub title="itertools — lazy iterators">
          <CodeBlock language="python" code={`from itertools import (
    chain, islice, groupby, combinations, permutations,
    product, count, cycle, repeat, takewhile, dropwhile,
    accumulate, zip_longest, starmap
)

# chain — flatten iterables
list(chain([1,2], [3,4], [5]))       # [1, 2, 3, 4, 5]
list(chain.from_iterable([[1,2],[3,4]]))

# islice — lazy slice
list(islice(count(0), 5))            # [0, 1, 2, 3, 4] (count is infinite)
list(islice(range(100), 10, 20, 2))  # [10, 12, 14, 16, 18]

# groupby — group consecutive equal elements (sort first!)
data = [('a', 1), ('a', 2), ('b', 3), ('b', 4)]
for key, group in groupby(data, key=lambda x: x[0]):
    print(key, list(group))

# combinations / permutations
list(combinations('ABC', 2))         # [('A','B'),('A','C'),('B','C')]
list(permutations('AB', 2))          # [('A','B'),('B','A')]
list(product('AB', repeat=2))        # [('A','A'),('A','B'),('B','A'),('B','B')]

# accumulate — running total (like scan in functional programming)
from operator import add
list(accumulate([1,2,3,4], add))     # [1, 3, 6, 10]

# takewhile / dropwhile
list(takewhile(lambda x: x<4, [1,2,3,4,5]))  # [1, 2, 3]
list(dropwhile(lambda x: x<4, [1,2,3,4,5]))  # [4, 5]`} />
        </Sub>
        <Sub title="functools — higher-order functions">
          <CodeBlock language="python" code={`from functools import reduce, partial, lru_cache, wraps, cache

# reduce — fold left (like Java Stream.reduce)
reduce(lambda acc, x: acc + x, [1,2,3,4], 0)   # 10

# partial — partially apply a function
from operator import mul
double = partial(mul, 2)
double(5)   # 10

def power(base, exp): return base ** exp
square = partial(power, exp=2)
square(5)   # 25

# lru_cache — memoization decorator
@lru_cache(maxsize=128)
def fib(n):
    if n <= 1: return n
    return fib(n-1) + fib(n-2)
fib(50)       # fast — results cached
fib.cache_info()   # CacheInfo(hits=..., misses=..., ...)
fib.cache_clear()  # clear cache

# @cache is lru_cache(maxsize=None) — unlimited (Python 3.9+)
@cache
def expensive(n): return n * n

# wraps — preserve metadata when writing decorators
def timer(func):
    @wraps(func)    # copies __name__, __doc__, etc.
    def wrapper(*args, **kwargs):
        import time
        start = time.perf_counter()
        result = func(*args, **kwargs)
        print(f"{func.__name__}: {time.perf_counter()-start:.4f}s")
        return result
    return wrapper

@timer
def my_function(): pass`} />
        </Sub>
      </Section>

      <Section num="8" title="threading and multiprocessing">
        <InfoBox>Python's GIL (Global Interpreter Lock) prevents true thread parallelism for CPU-bound tasks. Use <code>threading</code> for I/O-bound tasks (HTTP requests, file I/O), <code>multiprocessing</code> for CPU-bound tasks (computation, data processing).</InfoBox>
        <Sub title="threading">
          <CodeBlock language="python" code={`import threading
from concurrent.futures import ThreadPoolExecutor
import requests   # pip install requests

# Basic thread
def fetch(url):
    r = requests.get(url, timeout=10)
    print(f"{url}: {r.status_code}")

t = threading.Thread(target=fetch, args=("https://httpbin.org/get",))
t.start()
t.join()   # wait for completion

# Thread pool (recommended)
urls = ["https://httpbin.org/get", "https://httpbin.org/ip", "https://httpbin.org/uuid"]
with ThreadPoolExecutor(max_workers=10) as pool:
    results = list(pool.map(fetch, urls))

# Thread-safe data sharing
counter = 0
lock = threading.Lock()

def increment():
    global counter
    for _ in range(10000):
        with lock:   # acquire / release automatically
            counter += 1

threads = [threading.Thread(target=increment) for _ in range(4)]
for t in threads: t.start()
for t in threads: t.join()
print(counter)   # 40000

# Event — signal between threads
event = threading.Event()
# In one thread: event.set()
# In another:    event.wait()  or  event.wait(timeout=5.0)`} />
        </Sub>
        <Sub title="multiprocessing">
          <CodeBlock language="python" code={`from multiprocessing import Pool, Process, Queue, cpu_count
from concurrent.futures import ProcessPoolExecutor

# Parallel CPU-bound work
def heavy(n):
    return sum(i*i for i in range(n))

with Pool(processes=cpu_count()) as pool:
    results = pool.map(heavy, [1_000_000] * 8)

# ProcessPoolExecutor (concurrent.futures API — cleaner)
with ProcessPoolExecutor(max_workers=4) as pool:
    futures = [pool.submit(heavy, 1_000_000) for _ in range(8)]
    results = [f.result() for f in futures]

# Queue for inter-process communication
def producer(q):
    for i in range(5):
        q.put(i)
    q.put(None)   # sentinel

def consumer(q):
    while True:
        item = q.get()
        if item is None: break
        print(f"got {item}")

q = Queue()
p = Process(target=producer, args=(q,))
c = Process(target=consumer, args=(q,))
p.start(); c.start()
p.join();  c.join()`} />
        </Sub>
      </Section>

      <Section num="9" title="subprocess — Run System Commands">
        <CodeBlock language="python" code={`import subprocess
from subprocess import run, PIPE, CalledProcessError

# Simple run — just check exit code
result = run(['ls', '-la'], check=True)   # raises if exit code != 0
result.returncode   # 0

# Capture output
result = run(['git', 'log', '--oneline', '-5'], capture_output=True, text=True)
result.stdout    # string output
result.stderr    # error output

# Pass input
result = run(['python', '-c', 'print(input())'],
             input='hello\\n', capture_output=True, text=True)
result.stdout    # 'hello\\n'

# Shell command (use list form when possible — safer against injection)
result = run('echo $HOME', shell=True, capture_output=True, text=True)

# Error handling
try:
    run(['false'], check=True)   # 'false' always returns exit code 1
except CalledProcessError as e:
    print(f"Command failed: {e.returncode}")

# Streaming output (long-running processes)
proc = subprocess.Popen(
    ['ping', '-c', '4', 'google.com'],
    stdout=PIPE, text=True
)
for line in proc.stdout:
    print(line, end='')
proc.wait()

# Run Python script
run(['python', 'script.py', '--arg', 'value'], check=True)

# Timeout
try:
    run(['sleep', '10'], timeout=3)
except subprocess.TimeoutExpired:
    print("Took too long!")`} />
      </Section>

      <Section num="10" title="socket and http.client — Networking">
        <Sub title="socket — low-level TCP">
          <CodeBlock language="python" code={`import socket

# TCP client
with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.connect(('example.com', 80))
    s.sendall(b'GET / HTTP/1.0\\r\\nHost: example.com\\r\\n\\r\\n')
    response = b''
    while chunk := s.recv(4096):
        response += chunk
    print(response.decode()[:200])

# TCP server
server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
server.bind(('', 8080))
server.listen(5)
print("Listening on :8080")
while True:
    conn, addr = server.accept()
    with conn:
        data = conn.recv(1024)
        conn.sendall(b'HTTP/1.0 200 OK\\r\\n\\r\\nHello!')

# UDP
with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
    s.sendto(b'ping', ('localhost', 9999))
    data, addr = s.recvfrom(1024)`} />
        </Sub>
        <Sub title="urllib and http.client — HTTP requests">
          <CodeBlock language="python" code={`import urllib.request
import urllib.parse
import json

# Simple GET
with urllib.request.urlopen('https://httpbin.org/get') as resp:
    data = json.loads(resp.read().decode())
    print(data)

# POST with JSON
payload = json.dumps({'name': 'Alice'}).encode()
req = urllib.request.Request(
    'https://httpbin.org/post',
    data=payload,
    headers={'Content-Type': 'application/json'},
    method='POST'
)
with urllib.request.urlopen(req) as resp:
    print(json.loads(resp.read()))

# URL encoding
params = urllib.parse.urlencode({'q': 'python redis', 'page': 1})
url = f'https://api.example.com/search?{params}'

# Note: for production HTTP use 'requests' (pip install requests)
# import requests
# r = requests.get(url, timeout=10, headers={'Authorization': 'Bearer token'})
# r.json()   r.status_code   r.raise_for_status()`} />
        </Sub>
      </Section>

      <Section num="11" title="logging">
        <InfoBox>Always use <code>logging</code> instead of <code>print()</code> in anything beyond a quick script. Logging gives you levels, formatting, file output, and the ability to turn debug output on/off without changing code.</InfoBox>
        <CodeBlock language="python" code={`import logging
import sys

# Basic config (for scripts)
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s %(levelname)-8s %(name)s: %(message)s',
    datefmt='%H:%M:%S',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler('app.log'),
    ]
)

# Levels: DEBUG < INFO < WARNING < ERROR < CRITICAL
logging.debug("debug info")
logging.info("started")
logging.warning("disk space low")
logging.error("connection failed")
logging.critical("system crash")

# Module logger (recommended pattern)
logger = logging.getLogger(__name__)   # e.g. "myapp.utils"
logger.info("Processing %d items", 42)
logger.error("Failed: %s", str(exc), exc_info=True)  # include traceback

# Structured logger for libraries / larger apps
import logging.config
logging.config.dictConfig({
    'version': 1,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'formatters': {
        'verbose': {
            'format': '%(asctime)s %(name)s %(levelname)s %(message)s'
        },
    },
    'root': {'level': 'INFO', 'handlers': ['console']},
})`} />
      </Section>

      <Section num="12" title="argparse — CLI Argument Parsing">
        <CodeBlock language="python" code={`import argparse

parser = argparse.ArgumentParser(
    description='Process files',
    formatter_class=argparse.RawDescriptionHelpFormatter
)

# Positional argument
parser.add_argument('input', help='Input file path')

# Optional arguments
parser.add_argument('-o', '--output', default='out.json',
                    help='Output file (default: out.json)')
parser.add_argument('-n', '--count', type=int, default=10,
                    help='Number of items to process')
parser.add_argument('-v', '--verbose', action='store_true',
                    help='Enable verbose output')
parser.add_argument('--format', choices=['json', 'csv', 'txt'],
                    default='json', help='Output format')

# Multiple values
parser.add_argument('--tags', nargs='+', help='Tags (space-separated)')
parser.add_argument('--ids', nargs='*', type=int, help='IDs')

# Subcommands
subs = parser.add_subparsers(dest='command')
run_cmd = subs.add_parser('run', help='Run processing')
run_cmd.add_argument('--workers', type=int, default=4)
info_cmd = subs.add_parser('info', help='Show info')

args = parser.parse_args()

# Use args
if args.verbose:
    print(f"Input: {args.input}")
if args.command == 'run':
    print(f"Running with {args.workers} workers")`} />
      </Section>

      <Section num="13" title="unittest and mock — Testing">
        <Sub title="unittest basics">
          <CodeBlock language="python" code={`import unittest
from pathlib import Path

class MathTests(unittest.TestCase):

    def test_add(self):
        self.assertEqual(1 + 1, 2)

    def test_divide_by_zero(self):
        with self.assertRaises(ZeroDivisionError):
            _ = 1 / 0

    def test_type(self):
        self.assertIsInstance([], list)
        self.assertIsNone(None)
        self.assertTrue(len([]) == 0)
        self.assertIn('a', ['a', 'b'])

    def setUp(self):       # runs before each test
        self.temp = Path('/tmp/test_output')
        self.temp.mkdir(exist_ok=True)

    def tearDown(self):    # runs after each test
        import shutil
        shutil.rmtree(self.temp, ignore_errors=True)

class ParametrizedTests(unittest.TestCase):
    def test_squares(self):
        cases = [(2, 4), (3, 9), (4, 16), (-2, 4)]
        for n, expected in cases:
            with self.subTest(n=n):
                self.assertEqual(n*n, expected)

if __name__ == '__main__':
    unittest.main()`} />
        </Sub>
        <Sub title="mock — fake objects and side effects">
          <CodeBlock language="python" code={`from unittest.mock import Mock, patch, MagicMock

# Mock an object
db = Mock()
db.query.return_value = [{'id': 1, 'name': 'Alice'}]
db.query('SELECT * FROM users')   # returns the mocked value
db.query.assert_called_once_with('SELECT * FROM users')

# Patch — replace object in a module during the test
# tests/test_api.py
import requests
with patch('requests.get') as mock_get:
    mock_get.return_value.json.return_value = {'status': 'ok'}
    mock_get.return_value.status_code = 200
    result = requests.get('https://api.example.com')
    assert result.json() == {'status': 'ok'}

# Patch as decorator
class UserServiceTests(unittest.TestCase):
    @patch('myapp.services.requests.get')
    def test_fetch_user(self, mock_get):
        mock_get.return_value.json.return_value = {'id': 1, 'name': 'Alice'}
        # ... test code

# Side effects — simulate exceptions or sequences
mock = Mock()
mock.side_effect = [1, 2, 3]          # returns values in order
mock.side_effect = ConnectionError()   # raises on call`} />
        </Sub>
      </Section>

      <Section num="14" title="dataclasses and typing">
        <Sub title="dataclasses — lightweight structs">
          <CodeBlock language="python" code={`from dataclasses import dataclass, field, asdict, astuple
from typing import Optional, ClassVar

@dataclass
class Point:
    x: float
    y: float
    label: str = ''          # default value
    tags: list = field(default_factory=list)  # mutable default!

    def distance(self) -> float:
        return (self.x**2 + self.y**2) ** 0.5

@dataclass(frozen=True)       # immutable — hashable, usable in sets/dicts
class Color:
    r: int
    g: int
    b: int

@dataclass(order=True)        # generates __lt__, __le__, etc.
class Score:
    sort_index: float = field(init=False, repr=False)
    value: float
    player: str

    def __post_init__(self):
        self.sort_index = self.value   # used for ordering

p = Point(3, 4, 'origin')
p.distance()       # 5.0
asdict(p)          # {'x': 3, 'y': 4, 'label': 'origin', 'tags': []}
astuple(p)         # (3, 4, 'origin', [])`} />
        </Sub>
        <Sub title="typing — type annotations">
          <CodeBlock language="python" code={`from typing import Optional, Union, List, Dict, Tuple, Any
from typing import Callable, Iterator, Generator, TypeVar

# Basic annotations
def greet(name: str) -> str:
    return f"Hello, {name}"

def process(items: list[int]) -> dict[str, int]:  # Python 3.9+
    return {str(i): i*2 for i in items}

# Optional (= value or None)
def find(id: int) -> Optional[str]:   # same as str | None (Python 3.10+)
    return None

# Union
def parse(val: str | int | float) -> float:
    return float(val)

# Callable
def apply(fn: Callable[[int, int], int], a: int, b: int) -> int:
    return fn(a, b)

# TypeVar — for generic functions
T = TypeVar('T')
def first(items: list[T]) -> T:
    return items[0]

# TypedDict — dict with known keys
from typing import TypedDict
class UserDict(TypedDict):
    name: str
    age: int
    email: str

# Protocol — structural typing (duck typing with type checking)
from typing import Protocol
class Drawable(Protocol):
    def draw(self) -> None: ...`} />
        </Sub>
      </Section>

      <Section num="15" title="contextlib, abc, and inspect">
        <Sub title="contextlib — context managers">
          <CodeBlock language="python" code={`from contextlib import contextmanager, suppress, nullcontext, asynccontextmanager
import time

# Create a context manager with a generator
@contextmanager
def timer(label: str):
    start = time.perf_counter()
    try:
        yield                   # code inside 'with' runs here
    finally:
        elapsed = time.perf_counter() - start
        print(f"{label}: {elapsed:.3f}s")

with timer("my operation"):
    time.sleep(0.1)

# suppress — ignore specific exceptions
with suppress(FileNotFoundError):
    Path('missing.txt').unlink()   # no exception raised

# ExitStack — dynamic context managers
from contextlib import ExitStack
files = ['a.txt', 'b.txt', 'c.txt']
with ExitStack() as stack:
    handles = [stack.enter_context(open(f)) for f in files]
    # all files auto-closed on exit`} />
        </Sub>
        <Sub title="abc — Abstract Base Classes">
          <CodeBlock language="python" code={`from abc import ABC, abstractmethod

class Animal(ABC):
    @abstractmethod
    def speak(self) -> str: ...

    @abstractmethod
    def move(self) -> None: ...

    def describe(self) -> str:   # concrete method
        return f"I say: {self.speak()}"

class Dog(Animal):
    def speak(self) -> str: return "Woof"
    def move(self) -> None: print("runs")

# Animal()  # TypeError: Can't instantiate abstract class
dog = Dog()
dog.describe()   # "I say: Woof"

# abstractproperty
class Shape(ABC):
    @property
    @abstractmethod
    def area(self) -> float: ...

class Circle(Shape):
    def __init__(self, r): self.r = r
    @property
    def area(self) -> float: return 3.14159 * self.r ** 2`} />
        </Sub>
        <Sub title="inspect — introspection">
          <CodeBlock language="python" code={`import inspect

def greet(name: str, greeting: str = 'Hello') -> str:
    """Greet someone."""
    return f"{greeting}, {name}!"

# Signature
sig = inspect.signature(greet)
sig.parameters        # {'name': <Parameter>, 'greeting': <Parameter>}
for name, param in sig.parameters.items():
    print(name, param.default, param.annotation)

# Source code
print(inspect.getsource(greet))

# Is checks
inspect.isfunction(greet)    # True
inspect.isclass(str)         # True
inspect.ismethod(obj.method) # True

# Members
inspect.getmembers(str, predicate=inspect.isbuiltin)

# Call stack
for frame in inspect.stack():
    print(frame.filename, frame.lineno, frame.function)`} />
        </Sub>
      </Section>
    </div>
  )
}
