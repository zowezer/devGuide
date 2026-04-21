import CodeBlock from '../components/CodeBlock'
import Section, { Sub, InfoBox, WarnBox, TipBox, DangerBox } from '../components/Section'

const sections = [
  'What is Redis and When to Use It',
  'Installation and Connection',
  'Strings — the Universal Type',
  'Lists',
  'Hashes',
  'Sets and Sorted Sets',
  'Expiry and TTL',
  'Pub / Sub Messaging',
  'Transactions and Lua Scripting',
  'Persistence — RDB vs AOF',
  'Redis with Node.js (ioredis)',
  'Redis with Python (redis-py)',
  'Caching Patterns',
  'Performance and Best Practices',
  'Mini Project: Session Store + Rate Limiter',
]

export default function RedisPage() {
  return (
    <div>
      <div className="page-hero">
        <div className="lang-icon">🔴</div>
        <div>
          <h1>Redis</h1>
          <p>
            Redis (Remote Dictionary Server) is an in-memory data structure store used as a cache,
            message broker, and session store. Unlike a relational database, Redis keeps all data
            in RAM — reads and writes happen in microseconds. If MongoDB is your primary database,
            Redis is the layer in front of it that makes your app fast.
          </p>
          <div className="badges">
            <span className="badge green">In-Memory</span>
            <span className="badge">Sub-millisecond</span>
            <span className="badge yellow">Pub/Sub</span>
            <span className="badge purple">Cache + Store</span>
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

      <Section num="1" title="What is Redis and When to Use It">
        <InfoBox>Redis stores data in RAM — everything is fast (sub-millisecond), but RAM is expensive and limited. Think of Redis as a supercharged HashMap that lives outside your application process and can be shared across multiple servers.</InfoBox>
        <Sub title="Use Redis for">
          <CodeBlock language="bash" code={`✅ Session storage       — Store user sessions (with TTL auto-expiry)
✅ Caching               — Cache expensive DB queries or API responses
✅ Rate limiting         — Count requests per user per time window
✅ Job queues            — Simple task queues with lists
✅ Leaderboards          — Sorted sets for score rankings
✅ Pub/Sub               — Real-time messaging between services
✅ Distributed locks     — Prevent concurrent operations across servers
✅ Counters              — Atomic increments for views, likes, etc.

❌ Primary database      — No relations, limited query power
❌ Large blobs           — Storing images/files wastes RAM
❌ Complex queries       — Use Postgres/Mongo for joins and aggregations`} />
        </Sub>
        <Sub title="Redis vs alternatives">
          <CodeBlock language="bash" code={`Redis vs Memcached
  Redis: data structures, persistence, pub/sub, replication
  Memcached: simpler, multi-threaded, only strings

Redis vs Database caching (app-level)
  Redis: shared across servers, survives app restart
  App cache: simpler, no network hop, lost on restart

Redis vs Kafka/RabbitMQ
  Redis: simple queues, not durable by default
  Kafka: durable, replay, millions of messages/sec`} />
        </Sub>
      </Section>

      <Section num="2" title="Installation and Connection">
        <Sub title="Install and start">
          <CodeBlock language="bash" code={`# macOS
brew install redis
brew services start redis   # start as background service
redis-cli ping              # should return PONG

# Ubuntu/Debian
sudo apt install redis-server
sudo systemctl start redis
sudo systemctl enable redis

# Docker (recommended for dev)
docker run -d --name redis -p 6379:6379 redis:latest
docker run -d --name redis -p 6379:6379 redis:latest redis-server --requirepass secret

# Connect
redis-cli                   # interactive CLI
redis-cli -h localhost -p 6379
redis-cli -a secret         # with password

# Redis config
cat /etc/redis/redis.conf
redis-server /path/to/redis.conf`} />
        </Sub>
        <Sub title="redis-cli basics">
          <CodeBlock language="bash" code={`redis-cli ping                # PONG
redis-cli set name Alice      # OK
redis-cli get name            # "Alice"
redis-cli info server         # server info
redis-cli info memory         # memory stats
redis-cli monitor             # watch all commands in real time
redis-cli --latency           # measure latency
redis-cli flushdb             # delete all keys in current DB (DANGER)
redis-cli keys "*"            # list all keys (slow, avoid on prod)
redis-cli dbsize              # count keys`} />
        </Sub>
      </Section>

      <Section num="3" title="Strings — the Universal Type">
        <InfoBox>In Redis, "string" means any binary data up to 512MB — text, integers, serialized JSON, or raw bytes. Strings are the most versatile type.</InfoBox>
        <CodeBlock language="bash" code={`# Basic set / get
SET name "Alice"
GET name               # "Alice"
DEL name               # 1 (keys deleted)
EXISTS name            # 0 (deleted) or 1

# Set with TTL (expire)
SET session:abc123 "user:1" EX 3600   # expires in 1 hour
SET session:abc123 "user:1" PX 60000  # expires in 60 seconds
TTL session:abc123     # seconds remaining
PERSIST session:abc123 # remove TTL

# Atomic integer operations
SET views:post:42 0
INCR  views:post:42    # 1  (atomic!)
INCR  views:post:42    # 2
INCRBY views:post:42 10  # 12
DECR  views:post:42    # 11
GET   views:post:42    # "11"

# Conditional set
SETNX lock:resource "process-1"   # set if not exists (for distributed locks)
SET lock:resource "process-1" NX EX 30  # modern version

# Multi-key
MSET k1 v1 k2 v2 k3 v3
MGET k1 k2 k3          # ["v1","v2","v3"]

# String operations
APPEND greeting "Hello"
APPEND greeting " World"
GET greeting           # "Hello World"
STRLEN greeting        # 11`} />
      </Section>

      <Section num="4" title="Lists">
        <InfoBox>Redis Lists are linked lists — fast O(1) push/pop at both ends. Use for message queues, activity feeds, or recent-items lists.</InfoBox>
        <CodeBlock language="bash" code={`# Push
LPUSH queue task3 task2 task1   # push left: [task1, task2, task3]
RPUSH queue task4               # push right: [task1, task2, task3, task4]

# Pop
LPOP queue       # "task1" (left pop)
RPOP queue       # "task4" (right pop)
LPOP queue 2     # pop 2 items: ["task2","task3"]

# Blocking pop — waits until item available (great for worker queues)
BLPOP queue 0    # block indefinitely
BLPOP queue 30   # block up to 30 seconds

# Inspect
LLEN queue           # length
LRANGE queue 0 -1    # all items (0 to last)
LRANGE queue 0 9     # first 10 items
LINDEX queue 0       # first item
LINDEX queue -1      # last item

# Trim — keep only a range (like a capped log)
RPUSH log "event1" "event2" "event3" "event4" "event5"
LTRIM log 0 2        # keep only first 3: [event1, event2, event3]

# Pattern: producer/consumer queue
# Producer:  RPUSH jobs "job-data"
# Consumer:  BLPOP jobs 0  (blocks until work arrives)`} />
      </Section>

      <Section num="5" title="Hashes">
        <InfoBox>Hashes store field-value pairs — like a dictionary or Java Map. Perfect for storing objects (user profiles, product data) without serializing to JSON.</InfoBox>
        <CodeBlock language="bash" code={`# Set fields
HSET user:1 name "Alice" email "alice@example.com" age 30
HMSET user:1 city "London" plan "pro"   # multi-field (legacy, HSET accepts multiple now)

# Get fields
HGET user:1 name          # "Alice"
HMGET user:1 name email   # ["Alice","alice@example.com"]
HGETALL user:1            # all fields and values
HKEYS user:1              # ["name","email","age","city","plan"]
HVALS user:1              # ["Alice","alice@example.com","30","London","pro"]

# Check / delete
HEXISTS user:1 email      # 1
HDEL user:1 city          # 1
HLEN user:1               # field count

# Numeric operations (like INCR but for hash fields)
HSET product:5 stock 100
HINCRBY product:5 stock -1   # 99 (atomic decrement)

# Pattern: store object as hash vs JSON string
# Hash pros: can update individual fields, HINCRBY for numbers
# JSON pros: single GET, easier to pass around
# Rule: use hash when you need to update sub-fields frequently`} />
      </Section>

      <Section num="6" title="Sets and Sorted Sets">
        <Sub title="Sets — unique unordered members">
          <CodeBlock language="bash" code={`SADD tags:post:1 "redis" "database" "nosql"
SADD tags:post:2 "redis" "cache" "performance"

SMEMBERS tags:post:1   # {"redis","database","nosql"} (unordered)
SISMEMBER tags:post:1 "redis"  # 1 (exists)
SCARD tags:post:1      # 3 (cardinality)
SRANDMEMBER tags:post:1 2      # 2 random members

# Set operations (great for common/unique items)
SUNION tags:post:1 tags:post:2    # all tags from both posts
SINTER tags:post:1 tags:post:2    # common: {"redis"}
SDIFF  tags:post:1 tags:post:2    # in post:1 but not post:2`} />
        </Sub>
        <Sub title="Sorted Sets — leaderboards and rankings">
          <CodeBlock language="bash" code={`# Add members with scores
ZADD leaderboard 1500 "Alice"
ZADD leaderboard 2300 "Bob"
ZADD leaderboard 1800 "Carol"
ZADD leaderboard 900  "Dave"

# Range queries — O(log N)
ZRANGE leaderboard 0 -1                   # all, ascending score
ZRANGE leaderboard 0 -1 WITHSCORES        # with scores
ZREVRANGE leaderboard 0 2 WITHSCORES      # top 3
ZRANGEBYSCORE leaderboard 1000 2000       # scores in range
ZRANGEBYSCORE leaderboard -inf +inf LIMIT 0 10  # paginate

# Rank
ZRANK leaderboard "Alice"    # 1 (0-indexed, ascending)
ZREVRANK leaderboard "Bob"   # 0 (top position)
ZSCORE leaderboard "Carol"   # 1800.0

# Update score
ZINCRBY leaderboard 500 "Dave"   # Dave: 900 + 500 = 1400

# Use cases: leaderboards, priority queues, scheduled tasks (score = timestamp)`} />
        </Sub>
      </Section>

      <Section num="7" title="Expiry and TTL">
        <InfoBox>TTL (Time To Live) is one of Redis's most useful features — data auto-deletes itself. This is how session stores and caches work without a cleanup job.</InfoBox>
        <CodeBlock language="bash" code={`# Set TTL on creation
SET token:xyz "user:42" EX 3600       # seconds
SET token:xyz "user:42" PX 3600000    # milliseconds
SET token:xyz "user:42" EXAT 1700000000  # Unix timestamp

# Set TTL on existing key
EXPIRE  key 300        # seconds
PEXPIRE key 300000     # milliseconds
EXPIREAT key 1700000000

# Inspect TTL
TTL key          # -1 = no TTL, -2 = key doesn't exist, N = seconds left
PTTL key         # milliseconds

# Remove TTL (make persistent)
PERSIST key

# Pattern: sliding window session
# Each time user does something, reset TTL:
SET session:abc "data" EX 1800    # 30min session
# On each request: EXPIRE session:abc 1800  (reset timer)

# Key events — get notified when keys expire (needs config)
# redis.conf: notify-keyspace-events Ex
# Subscribe: PSUBSCRIBE __keyevent@0__:expired`} />
      </Section>

      <Section num="8" title="Pub / Sub Messaging">
        <InfoBox>Redis Pub/Sub lets processes publish messages to channels and subscribe to receive them in real time. Messages are not persisted — if no subscriber is listening, the message is lost. For durable messaging use Redis Streams.</InfoBox>
        <CodeBlock language="bash" code={`# Terminal 1 — subscriber
redis-cli
SUBSCRIBE notifications user-events

# Terminal 2 — publisher
redis-cli
PUBLISH notifications "New comment on your post"
PUBLISH user-events '{"type":"login","userId":42}'

# Pattern subscribe (wildcard)
PSUBSCRIBE events.*       # matches events.login, events.logout, etc.

# Redis Streams — durable, replayable (Kafka-like)
XADD events * type login userId 42 ip "1.2.3.4"
XADD events * type purchase amount 99.99

XRANGE events - +          # read all messages
XREAD COUNT 10 STREAMS events 0  # read from beginning
XREAD BLOCK 0 STREAMS events $   # block for new messages`} />
      </Section>

      <Section num="9" title="Transactions and Lua Scripting">
        <Sub title="Transactions with MULTI/EXEC">
          <CodeBlock language="bash" code={`# MULTI starts a transaction — commands are queued
MULTI
SET account:1 900
SET account:2 1100
EXEC         # execute atomically — other clients can't interleave

# DISCARD to cancel
MULTI
SET key1 val1
DISCARD      # cancel queued commands

# WATCH — optimistic locking (like Java's CAS)
WATCH account:1
MULTI
DECR account:1
EXEC         # returns nil if account:1 changed since WATCH
             # nil means another client modified it — retry`} />
        </Sub>
        <Sub title="Lua scripting — atomic complex operations">
          <CodeBlock language="bash" code={`# Lua scripts run atomically — no other commands can interleave
# EVALSHA for repeated scripts (cache the SHA)
redis-cli EVAL "
  local val = redis.call('GET', KEYS[1])
  if val then
    redis.call('SET', KEYS[1], tonumber(val) + ARGV[1])
    return tonumber(val) + tonumber(ARGV[1])
  else
    redis.call('SET', KEYS[1], ARGV[1])
    return tonumber(ARGV[1])
  end
" 1 counter 5

# Load script and call by SHA (efficient for repeated calls)
# redis-cli SCRIPT LOAD "return redis.call('GET',KEYS[1])"
# returns sha1 hash
# redis-cli EVALSHA <sha> 1 mykey`} />
        </Sub>
      </Section>

      <Section num="10" title="Persistence — RDB vs AOF">
        <CodeBlock language="bash" code={`# redis.conf options

# ── RDB (Redis Database) — periodic snapshots ──────────────────
# Saves a binary snapshot of the dataset
save 900 1      # save if 1+ changes in 900 seconds
save 300 10     # save if 10+ changes in 300 seconds
save 60 10000   # save if 10000+ changes in 60 seconds
dbfilename dump.rdb
dir /var/lib/redis

# ── AOF (Append Only File) — every write logged ────────────────
appendonly yes
appendfilename "appendonly.aof"
appendfsync everysec   # fsync every second (balanced)
# appendfsync always   # fsync every write (safe but slow)
# appendfsync no       # let OS decide (fast but risky)

# ── Combined: RDB + AOF (recommended for production) ──────────
# AOF for durability, RDB for fast restarts

# Manual save
redis-cli BGSAVE       # background RDB snapshot
redis-cli BGREWRITEAOF # rewrite/compact AOF

# Check last save
redis-cli LASTSAVE     # Unix timestamp`} />
        <TipBox>For a pure cache (data can be regenerated), disable persistence entirely with <code>save ""</code> and <code>appendonly no</code> — Redis will be faster and use less disk I/O.</TipBox>
      </Section>

      <Section num="11" title="Redis with Node.js (ioredis)">
        <CodeBlock language="bash" code={`npm install ioredis`} />
        <CodeBlock language="javascript" code={`import Redis from 'ioredis'

const redis = new Redis({
  host: 'localhost',
  port: 6379,
  password: process.env.REDIS_PASSWORD,
  retryStrategy: (times) => Math.min(times * 50, 2000),
})

// Strings
await redis.set('name', 'Alice')
await redis.set('session:abc', JSON.stringify({ userId: 1 }), 'EX', 3600)
const name = await redis.get('name')

// Hash
await redis.hset('user:1', { name: 'Alice', email: 'alice@example.com', age: 30 })
const user = await redis.hgetall('user:1')

// List
await redis.rpush('queue', 'job1', 'job2')
const job = await redis.blpop('queue', 5)  // block 5s

// Sorted set
await redis.zadd('leaderboard', 1500, 'Alice', 2300, 'Bob')
const top3 = await redis.zrevrange('leaderboard', 0, 2, 'WITHSCORES')

// Pub/Sub (needs separate connection)
const sub = new Redis()
await sub.subscribe('events')
sub.on('message', (channel, message) => {
  console.log(\`\${channel}: \${message}\`)
})
await redis.publish('events', 'hello')

// Pipeline — batch commands, one round trip
const pipeline = redis.pipeline()
pipeline.set('k1', 'v1')
pipeline.set('k2', 'v2')
pipeline.get('k1')
const results = await pipeline.exec()   // [[null,'OK'],[null,'OK'],[null,'v1']]`} />
      </Section>

      <Section num="12" title="Redis with Python (redis-py)">
        <CodeBlock language="bash" code={`pip install redis`} />
        <CodeBlock language="python" code={`import redis
import json
from datetime import timedelta

r = redis.Redis(
    host='localhost',
    port=6379,
    password=None,
    decode_responses=True  # auto-decode bytes to str
)

# Strings
r.set('name', 'Alice')
r.setex('session:abc', timedelta(hours=1), json.dumps({'userId': 1}))
name = r.get('name')

# Hash
r.hset('user:1', mapping={'name': 'Alice', 'email': 'a@example.com'})
user = r.hgetall('user:1')  # {'name': 'Alice', 'email': '...'}

# List
r.rpush('queue', 'job1', 'job2')
job = r.blpop('queue', timeout=5)

# Sorted set
r.zadd('leaderboard', {'Alice': 1500, 'Bob': 2300})
top3 = r.zrevrange('leaderboard', 0, 2, withscores=True)

# Pub/Sub
pubsub = r.pubsub()
pubsub.subscribe('events')
for message in pubsub.listen():
    if message['type'] == 'message':
        print(message['data'])

# Pipeline
pipe = r.pipeline()
pipe.set('k1', 'v1')
pipe.set('k2', 'v2')
pipe.get('k1')
results = pipe.execute()  # ['OK', 'OK', 'v1']

# Context manager (auto-close)
with redis.Redis() as r:
    r.set('temp', 'data')`} />
      </Section>

      <Section num="13" title="Caching Patterns">
        <Sub title="Cache-Aside (most common)">
          <CodeBlock language="javascript" code={`// Cache-aside (lazy loading) — app manages the cache
async function getUser(id) {
  const key = \`user:\${id}\`

  // 1. Check cache
  const cached = await redis.get(key)
  if (cached) return JSON.parse(cached)

  // 2. Cache miss — fetch from DB
  const user = await db.query('SELECT * FROM users WHERE id = ?', [id])
  if (!user) return null

  // 3. Store in cache for 10 minutes
  await redis.set(key, JSON.stringify(user), 'EX', 600)
  return user
}

// Invalidate on update
async function updateUser(id, data) {
  await db.query('UPDATE users SET ? WHERE id = ?', [data, id])
  await redis.del(\`user:\${id}\`)   // bust the cache
}`} />
        </Sub>
        <Sub title="Write-Through and Cache Stampede prevention">
          <CodeBlock language="javascript" code={`// Write-through — update cache on every write
async function updateUser(id, data) {
  await db.query('UPDATE users SET ? WHERE id = ?', [data, id])
  await redis.set(\`user:\${id}\`, JSON.stringify(data), 'EX', 600)
}

// Cache stampede prevention (probabilistic early expiry)
async function getCachedWithEarlyRefresh(key, ttl, fetchFn) {
  const raw = await redis.get(key)
  if (raw) {
    const { data, expires } = JSON.parse(raw)
    const remaining = expires - Date.now()
    // Probabilistically refresh in final 10% of TTL
    if (remaining > ttl * 100 * 0.1 * Math.random()) return data
  }
  const fresh = await fetchFn()
  const stored = { data: fresh, expires: Date.now() + ttl * 1000 }
  await redis.set(key, JSON.stringify(stored), 'EX', ttl)
  return fresh
}

// Distributed lock — prevent thundering herd
async function getWithLock(key, fetchFn) {
  const lock = \`lock:\${key}\`
  const got = await redis.set(lock, '1', 'NX', 'EX', 10)
  if (!got) {
    await new Promise(r => setTimeout(r, 100))
    return redis.get(key)  // wait and re-read
  }
  try {
    const data = await fetchFn()
    await redis.set(key, JSON.stringify(data), 'EX', 60)
    return data
  } finally {
    await redis.del(lock)
  }
}`} />
        </Sub>
      </Section>

      <Section num="14" title="Performance and Best Practices">
        <CodeBlock language="bash" code={`# Key naming conventions
user:1                   # object:id
user:1:sessions          # object:id:subtype
cache:user:1             # namespace:object:id
rate:192.168.1.1:login   # prefix:identifier:action

# Memory optimization
redis-cli info memory     # used_memory, used_memory_rss, mem_fragmentation_ratio

# Object encoding check
redis-cli object encoding mykey   # ziplist, quicklist, hashtable, etc.
# Redis uses compact encodings for small data:
# hash with < 128 fields + small values -> ziplist (very compact)
# list with < 512 items -> quicklist

# Scan instead of KEYS (non-blocking)
redis-cli --scan --pattern "user:*"           # scan for pattern
redis-cli scan 0 MATCH "session:*" COUNT 100  # paginated scan

# Monitor slow queries
redis-cli slowlog get 10   # last 10 slow commands
redis-cli slowlog len       # total slow commands count
# redis.conf: slowlog-log-slower-than 10000  (10ms in microseconds)

# Connection pooling (in application code)
# Always use a pool — creating connections is expensive
# ioredis / redis-py both pool by default`} />
        <WarnBox>Never use <code>KEYS *</code> in production — it blocks the entire server while scanning. Use <code>SCAN</code> instead, which iterates incrementally.</WarnBox>
        <TipBox>Set <code>maxmemory</code> and <code>maxmemory-policy allkeys-lru</code> in redis.conf to prevent Redis from consuming all RAM. LRU eviction automatically removes least-recently-used keys when full.</TipBox>
      </Section>

      <Section num="15" title="Mini Project: Session Store + Rate Limiter">
        <p>A complete Express.js middleware using Redis for session management and sliding-window rate limiting.</p>
        <CodeBlock language="javascript" code={`import express from 'express'
import Redis from 'ioredis'
import crypto from 'crypto'

const app = express()
const redis = new Redis()

// ── Session middleware ────────────────────────────────────────────
function sessionMiddleware(sessionTTL = 3600) {
  return async (req, res, next) => {
    let sessionId = req.cookies?.sessionId

    if (sessionId) {
      const data = await redis.get(\`session:\${sessionId}\`)
      if (data) {
        req.session = JSON.parse(data)
        // Sliding expiry — reset TTL on each request
        await redis.expire(\`session:\${sessionId}\`, sessionTTL)
      }
    }

    req.session = req.session || {}

    res.saveSession = async () => {
      if (!sessionId) {
        sessionId = crypto.randomBytes(32).toString('hex')
        res.cookie('sessionId', sessionId, { httpOnly: true, secure: true })
      }
      await redis.set(
        \`session:\${sessionId}\`,
        JSON.stringify(req.session),
        'EX', sessionTTL
      )
    }

    res.destroySession = async () => {
      if (sessionId) {
        await redis.del(\`session:\${sessionId}\`)
        res.clearCookie('sessionId')
      }
    }

    next()
  }
}

// ── Rate limiter (sliding window) ─────────────────────────────────
function rateLimit({ max = 100, windowSec = 60, keyFn = (req) => req.ip } = {}) {
  const script = \`
    local key = KEYS[1]
    local now = tonumber(ARGV[1])
    local window = tonumber(ARGV[2])
    local max = tonumber(ARGV[3])
    local cutoff = now - window * 1000

    redis.call('ZREMRANGEBYSCORE', key, '-inf', cutoff)
    local count = redis.call('ZCARD', key)

    if count >= max then
      return 0
    end
    redis.call('ZADD', key, now, now)
    redis.call('EXPIRE', key, window)
    return max - count - 1
  \`

  return async (req, res, next) => {
    const key = \`rate:\${keyFn(req)}\`
    const now = Date.now()
    const remaining = await redis.eval(script, 1, key, now, windowSec, max)

    res.setHeader('X-RateLimit-Limit', max)
    res.setHeader('X-RateLimit-Remaining', Math.max(0, remaining))

    if (remaining < 0) {
      return res.status(429).json({ error: 'Too many requests' })
    }
    next()
  }
}

// ── Routes ────────────────────────────────────────────────────────
app.use(express.json())
app.use(sessionMiddleware())
app.use(rateLimit({ max: 100, windowSec: 60 }))

app.post('/login', async (req, res) => {
  const { username, password } = req.body
  // ... validate credentials
  req.session = { userId: 1, username, loginAt: Date.now() }
  await res.saveSession()
  res.json({ ok: true })
})

app.get('/profile', async (req, res) => {
  if (!req.session?.userId) return res.status(401).json({ error: 'Not logged in' })
  res.json({ user: req.session })
})

app.post('/logout', async (req, res) => {
  await res.destroySession()
  res.json({ ok: true })
})

app.listen(3000, () => console.log('http://localhost:3000'))`} />
      </Section>
    </div>
  )
}
