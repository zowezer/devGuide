import CodeBlock from '../components/CodeBlock'
import Section, { Sub, InfoBox, WarnBox, TipBox } from '../components/Section'

const sections = [
  'What is a Distributed System',
  'Microservices Architecture',
  'Service Communication — REST, gRPC, Message Queues',
  'Load Balancing',
  'Service Discovery',
  'CAP Theorem',
  'Consistency Models',
  'Fault Tolerance — Retries, Timeouts, Bulkheads',
  'Circuit Breaker Pattern',
  'API Gateway',
  'Event-Driven Architecture',
  'Data Partitioning and Sharding',
  'Distributed Transactions',
  'Observability — Logs, Metrics, Traces',
  'Mini Project: Microservice with Node.js',
]

export default function DistributedSystemsPage() {
  return (
    <div>
      <div className="page-hero">
        <div className="lang-icon">🖥️</div>
        <div>
          <h1>Distributed Systems</h1>
          <p>
            A distributed system is a collection of independent computers that appear to users as
            a single system. Almost every production application at scale is distributed — multiple
            servers, multiple services, multiple databases. This page covers the core concepts,
            failure modes, and patterns that make distributed systems work reliably.
          </p>
          <div className="badges">
            <span className="badge green">Microservices</span>
            <span className="badge">CAP Theorem</span>
            <span className="badge yellow">Fault Tolerance</span>
            <span className="badge purple">Event-Driven</span>
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

      <Section num="1" title="What is a Distributed System">
        <InfoBox>The 8 fallacies of distributed computing (Peter Deutsch, 1994): The network is reliable; latency is zero; bandwidth is infinite; the network is secure; topology doesn't change; there is one administrator; transport cost is zero; the network is homogeneous. Distributed systems break all of these assumptions.</InfoBox>
        <CodeBlock language="bash" code={`# Why distribute?
Scalability   — one machine can't serve 10 million users
Reliability   — no single point of failure
Performance   — serve users from geographically closer nodes
Isolation     — failures in one service don't crash everything
Team autonomy — different teams own different services

# What makes it hard?
Network partitions  — nodes can't reach each other
Partial failures    — some nodes crash, others don't
Race conditions     — concurrent updates to shared data
Clock skew          — clocks on different machines drift
Cascading failures  — one slow service backs up its callers

# Distributed system types
Monolith          — one deployable unit (start here)
SOA               — large services communicating via bus (ESB)
Microservices     — small, independent, single-responsibility services
Serverless        — functions deployed on demand (no servers to manage)
Event Sourcing    — state stored as sequence of events`} />
      </Section>

      <Section num="2" title="Microservices Architecture">
        <InfoBox>Microservices: decompose an application into small, independently deployable services each owning its own data. The "micro" part is about scope of responsibility, not lines of code.</InfoBox>
        <Sub title="Decomposition strategies">
          <CodeBlock language="bash" code={`# By business domain (Domain-Driven Design)
UserService      — authentication, profiles, preferences
OrderService     — cart, checkout, order status
PaymentService   — payment processing, refunds
NotificationService — email, SMS, push notifications
CatalogService   — product listings, search, inventory

# Each service should:
✅ Own its own database (no shared DB)
✅ Communicate only through well-defined APIs
✅ Be independently deployable
✅ Be small enough for one team to understand fully
✅ Have a single responsibility

# Signs you've split too fine (over-microservices):
❌ Every change requires updating 5 services
❌ Services that always deploy together
❌ Network calls for things that were simple function calls
❌ Distributed transactions needed for every operation`} />
        </Sub>
        <Sub title="Microservices vs Monolith">
          <CodeBlock language="bash" code={`# Monolith pros:
+ Simple deployment (one artifact)
+ Easy local development
+ Low latency (function calls, not network)
+ Easy transactions (single DB)
+ Simple debugging

# Microservices pros:
+ Independent scaling (scale only hot services)
+ Technology flexibility (each service can use different stack)
+ Independent deployments (teams move faster)
+ Fault isolation
+ Smaller codebases

# Rule of thumb:
# Start with a monolith. Split out services when you have:
# - A team ownership boundary
# - A scaling requirement (this part needs 10x resources)
# - A technology requirement (ML service needs Python/GPU)
# - An isolation requirement (compliance, security boundary)`} />
        </Sub>
      </Section>

      <Section num="3" title="Service Communication — REST, gRPC, Message Queues">
        <Sub title="Synchronous vs asynchronous">
          <CodeBlock language="bash" code={`# Synchronous (request-response)
REST/HTTP  — universal, human-readable, easy to debug
gRPC       — binary, typed, efficient for internal services
GraphQL    — flexible queries, good for BFF (Backend for Frontend)

# Async advantages:
# - Services are decoupled (sender doesn't wait for receiver)
# - Natural buffering (queue absorbs traffic spikes)
# - Retry without duplicate work (message stays in queue)
# - Multiple consumers can process the same event

# Message queue options
RabbitMQ   — AMQP, flexible routing, good for task queues
Apache Kafka — append-only log, replay, millions msg/s, stream processing
Redis Streams — simpler, when you already have Redis
AWS SQS    — managed, simple, at-least-once delivery
NATS       — lightweight, fast, good for microservices`} />
        </Sub>
        <Sub title="Kafka patterns">
          <CodeBlock language="javascript" code={`// npm install kafkajs
import { Kafka } from 'kafkajs'

const kafka = new Kafka({ clientId: 'order-service', brokers: ['kafka:9092'] })

// Producer — publish events
const producer = kafka.producer()
await producer.connect()
await producer.send({
  topic: 'order.created',
  messages: [{
    key: String(order.id),        // same key → same partition → ordered
    value: JSON.stringify(order),
    headers: { 'correlation-id': requestId },
  }],
})

// Consumer — subscribe to events
const consumer = kafka.consumer({ groupId: 'notification-service' })
await consumer.connect()
await consumer.subscribe({ topic: 'order.created', fromBeginning: false })
await consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    const order = JSON.parse(message.value.toString())
    await sendOrderConfirmationEmail(order)
    // Kafka auto-commits offset after this returns
  },
})`} />
        </Sub>
      </Section>

      <Section num="4" title="Load Balancing">
        <CodeBlock language="bash" code={`# Load balancing algorithms
Round Robin    — requests distributed evenly in rotation (default nginx)
Least Connections — send to server with fewest active connections
IP Hash        — same client always hits same server (session affinity)
Weighted       — more powerful servers get more traffic
Random         — random selection (surprisingly effective)
Least Response Time — combined: fewest connections + fastest response

# nginx load balancer config
upstream api_servers {
    least_conn;
    server app1:3000 weight=2;   # gets 2x traffic
    server app2:3000;
    server app3:3000;
    keepalive 32;                 # connection pool to backends
}

server {
    listen 80;
    location / {
        proxy_pass http://api_servers;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_connect_timeout 5s;
        proxy_read_timeout 30s;
    }
}

# Health checks
upstream api_servers {
    server app1:3000;
    server app2:3000;
    check interval=3000 rise=2 fall=3 timeout=1000 type=http;
    check_http_send "HEAD /health HTTP/1.0\\r\\n\\r\\n";
    check_http_expect_alive http_2xx;
}

# Layer 4 vs Layer 7
# L4 (TCP): faster, can't inspect content, used for raw TCP/UDP
# L7 (HTTP): content-aware, can route by path/header, sticky sessions`} />
      </Section>

      <Section num="5" title="Service Discovery">
        <CodeBlock language="bash" code={`# Problem: microservices are ephemeral — IPs change when containers restart
# Solution: service registry — services register themselves, others look them up

# Client-side discovery (service queries registry, picks instance)
# Server-side discovery (load balancer queries registry)

# Consul — popular service discovery + health checking + KV store
# Register a service
curl -X PUT http://consul:8500/v1/agent/service/register -d '{
  "ID":      "user-service-1",
  "Name":    "user-service",
  "Port":    3000,
  "Check": {
    "HTTP":     "http://localhost:3000/health",
    "Interval": "10s",
    "Timeout":  "3s"
  }
}'

# Discover a service
curl http://consul:8500/v1/health/service/user-service?passing=true

# Kubernetes service discovery — DNS-based
# Every Service gets a DNS name: <service>.<namespace>.svc.cluster.local
# user-service.default.svc.cluster.local → ClusterIP
# Environment variables also injected: USER_SERVICE_HOST, USER_SERVICE_PORT

# Kubernetes service definition
# apiVersion: v1
# kind: Service
# metadata:
#   name: user-service
# spec:
#   selector:
#     app: user-service
#   ports:
#     - port: 80
#       targetPort: 3000`} />
      </Section>

      <Section num="6" title="CAP Theorem">
        <InfoBox>CAP Theorem (Brewer, 2000): A distributed system can guarantee at most 2 of: Consistency, Availability, and Partition Tolerance. Since network partitions always happen in distributed systems, you must choose between CP (consistent but may be unavailable) or AP (available but may be inconsistent).</InfoBox>
        <CodeBlock language="bash" code={`# Consistency (C) — every node returns the most recent write
# Availability (A) — every non-failing node returns a response
# Partition Tolerance (P) — system works despite network splits

# In practice: P is not optional (partitions happen)
# Real choice: during a partition, which do you sacrifice — C or A?

# CP systems (consistent, partition-tolerant)
HBase, ZooKeeper, etcd, Consul
→ During partition: refuse writes to prevent inconsistency
→ Use for: leader election, config management, financial transactions

# AP systems (available, partition-tolerant)
CouchDB, Cassandra, DynamoDB, Riak
→ During partition: accept writes (reconcile later via CRDT or last-write-wins)
→ Use for: social feeds, shopping carts, any data where stale reads are OK

# PACELC extension (more practical):
# Even without partition:
# Latency vs Consistency tradeoff
# DynamoDB: PA/EL (available+low latency)
# MongoDB (with writeConcern=majority): PC/EC (consistent)

# Practical guidance:
# - Use eventual consistency for: user preferences, product listings, counts
# - Use strong consistency for: account balances, inventory, auth tokens
# - Design for: "what if this data is 100ms stale?"
#   If the answer is "fine" → eventual consistency is OK`} />
      </Section>

      <Section num="7" title="Consistency Models">
        <CodeBlock language="bash" code={`# Strong consistency (linearizability)
# — Every read sees the latest write
# — Operations appear instantaneous and ordered
# — Slowest, most expensive (requires coordination)
# Examples: etcd, CockroachDB, Spanner

# Sequential consistency
# — All nodes see operations in the same order
# — But not necessarily in real-time order
# Examples: single-leader replication

# Causal consistency
# — If A causes B, everyone sees A before B
# — Causally unrelated operations can be in any order
# Examples: MongoDB (causal sessions)

# Eventual consistency
# — Given no new updates, all nodes eventually converge
# — May read stale data
# — Best performance and availability
# Examples: DynamoDB, Cassandra, Redis replication

# Read-your-writes consistency
# — After writing, you always see your own write
# — Others may not see it yet
# Examples: Primary/replica with sticky sessions

# Monotonic reads
# — Once you see a value, future reads won't return older values
# — Prevents "time travel" reads

# In practice: most apps need read-your-writes + monotonic reads
# Use sticky sessions OR route all reads/writes to primary temporarily`} />
      </Section>

      <Section num="8" title="Fault Tolerance — Retries, Timeouts, Bulkheads">
        <CodeBlock language="javascript" code={`// ── Timeouts — always set them ──────────────────────────────────────
// Never make a network call without a timeout!
const response = await fetch(url, { signal: AbortSignal.timeout(5000) })

// ── Retries with exponential backoff ────────────────────────────────
async function retryWithBackoff(fn, maxAttempts = 3, baseDelay = 100) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (err) {
      if (attempt === maxAttempts) throw err

      // Only retry idempotent operations / transient errors
      if (err.status === 400 || err.status === 401) throw err  // don't retry

      const delay = baseDelay * 2 ** (attempt - 1) + Math.random() * 100  // jitter
      console.log(\`Attempt \${attempt} failed, retrying in \${delay}ms\`)
      await new Promise(r => setTimeout(r, delay))
    }
  }
}

// ── Bulkhead — isolate failures ──────────────────────────────────────
// Separate thread pools / connection pools per service
// One slow downstream doesn't exhaust all resources
class BulkheadPool {
  constructor(maxConcurrent = 10) {
    this.semaphore = maxConcurrent
    this.queue = []
  }
  async execute(fn) {
    if (this.semaphore <= 0) throw new Error('Bulkhead full — rejecting request')
    this.semaphore--
    try { return await fn() }
    finally { this.semaphore++ }
  }
}

const paymentPool = new BulkheadPool(5)   // max 5 concurrent payment calls
const emailPool   = new BulkheadPool(20)  // emails can be more concurrent`} />
      </Section>

      <Section num="9" title="Circuit Breaker Pattern">
        <InfoBox>A circuit breaker prevents a cascade of failures by stopping calls to a failing service. Like an electrical circuit breaker: trips open when failures exceed a threshold, lets the service recover, then probes with a test request before fully closing again.</InfoBox>
        <CodeBlock language="javascript" code={`class CircuitBreaker {
  constructor(fn, options = {}) {
    this.fn = fn
    this.failureThreshold = options.failureThreshold ?? 5
    this.successThreshold = options.successThreshold ?? 2
    this.timeout          = options.timeout ?? 60_000  // 1 minute
    this.state   = 'CLOSED'   // CLOSED | OPEN | HALF_OPEN
    this.failures = 0
    this.successes = 0
    this.nextRetry  = 0
  }

  async call(...args) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextRetry) {
        throw new Error('Circuit OPEN — request rejected')
      }
      this.state = 'HALF_OPEN'
      console.log('Circuit HALF-OPEN — probing...')
    }

    try {
      const result = await this.fn(...args)
      this.onSuccess()
      return result
    } catch (err) {
      this.onFailure()
      throw err
    }
  }

  onSuccess() {
    this.failures = 0
    if (this.state === 'HALF_OPEN') {
      this.successes++
      if (this.successes >= this.successThreshold) {
        this.state = 'CLOSED'
        this.successes = 0
        console.log('Circuit CLOSED — service recovered')
      }
    }
  }

  onFailure() {
    this.failures++
    this.successes = 0
    if (this.failures >= this.failureThreshold) {
      this.state = 'OPEN'
      this.nextRetry = Date.now() + this.timeout
      console.log(\`Circuit OPEN — will retry at \${new Date(this.nextRetry).toISOString()}\`)
    }
  }
}

const cb = new CircuitBreaker(fetchPaymentAPI, { failureThreshold: 3, timeout: 30_000 })
try {
  const result = await cb.call(paymentData)
} catch (err) {
  // Either service failed OR circuit is open — use fallback
  return await processPaymentFallback(paymentData)
}`} />
      </Section>

      <Section num="10" title="API Gateway">
        <CodeBlock language="bash" code={`# API Gateway — single entry point for all clients
# Handles: routing, auth, rate limiting, SSL termination, logging, caching

Client → API Gateway → User Service
                     → Order Service
                     → Payment Service

# Popular API Gateways
Kong      — plugin-based, Lua, very flexible
AWS API Gateway — managed, integrates with Lambda/ECS
nginx + Lua — custom, high performance
Traefik   — K8s-native, auto service discovery
Envoy     — sidecar proxy used in service meshes

# nginx as API gateway
server {
    listen 443 ssl;

    # Route by path
    location /api/users {
        proxy_pass http://user-service:3000;
        auth_request /auth/validate;    # validate JWT on every request
    }
    location /api/orders {
        proxy_pass http://order-service:3001;
        limit_req zone=api burst=20;    # rate limit
    }
    location /api/payments {
        proxy_pass http://payment-service:3002;
        proxy_ssl_verify on;            # mTLS to payment service
    }

    # Auth validation subrequest
    location /auth/validate {
        internal;
        proxy_pass http://auth-service/validate;
        proxy_pass_request_body off;
        proxy_set_header Content-Length "";
        proxy_set_header X-Original-URI $request_uri;
    }
}

# Service mesh (advanced) — sidecar proxy per service
# Istio, Linkerd: inject Envoy proxy alongside every service
# Handle: mTLS, retries, circuit breaking, tracing — without app code changes`} />
      </Section>

      <Section num="11" title="Event-Driven Architecture">
        <Sub title="Event sourcing">
          <CodeBlock language="javascript" code={`// Event Sourcing: store sequence of events, derive state by replaying them
// Audit log is built-in. Can rebuild any historical state.

// Events (immutable facts that happened)
const events = [
  { type: 'AccountOpened',   data: { id: 1, owner: 'Alice', balance: 0 } },
  { type: 'MoneyDeposited',  data: { accountId: 1, amount: 1000 } },
  { type: 'MoneyWithdrawn',  data: { accountId: 1, amount: 200 } },
  { type: 'MoneyDeposited',  data: { accountId: 1, amount: 500 } },
]

// Current state = replay of events
function replay(events) {
  return events.reduce((state, event) => {
    switch (event.type) {
      case 'AccountOpened':
        return { ...state, [event.data.id]: { ...event.data } }
      case 'MoneyDeposited':
        return {
          ...state,
          [event.data.accountId]: {
            ...state[event.data.accountId],
            balance: state[event.data.accountId].balance + event.data.amount,
          },
        }
      case 'MoneyWithdrawn':
        return {
          ...state,
          [event.data.accountId]: {
            ...state[event.data.accountId],
            balance: state[event.data.accountId].balance - event.data.amount,
          },
        }
      default: return state
    }
  }, {})
}

const currentState = replay(events)
// { 1: { id: 1, owner: 'Alice', balance: 1300 } }`} />
        </Sub>
        <Sub title="CQRS (Command Query Responsibility Segregation)">
          <CodeBlock language="bash" code={`# CQRS: separate read and write models

# Write side (Commands):
# - Accepts commands: CreateOrder, CancelOrder, ShipOrder
# - Validates business rules
# - Emits events to event store
# - Write DB optimized for transactions

# Read side (Queries):
# - Subscribes to events
# - Builds read-optimized projections (denormalized views)
# - Multiple read models for different use cases:
#   - OrderSummaryView (for dashboard)
#   - OrderDetailView (for order page)
#   - CustomerOrderHistoryView

# Benefits:
# - Read and write models scale independently
# - Read models can be in different DB (Elasticsearch for search)
# - Easy to add new read models without changing write side`} />
        </Sub>
      </Section>

      <Section num="12" title="Data Partitioning and Sharding">
        <CodeBlock language="bash" code={`# Sharding: split a large dataset across multiple DB instances
# Each shard holds a subset of data

# Sharding strategies:
# Hash sharding: shard = hash(key) % num_shards
#   Pros: even distribution
#   Cons: resharding is hard (must move ~all data)

# Range sharding: shard by value range (A-F → shard1, G-M → shard2)
#   Pros: range queries efficient
#   Cons: hot spots (everyone signs up today = shard with today's date overloaded)

# Directory sharding: lookup table maps keys to shards
#   Pros: flexible, can rebalance without resharding
#   Cons: lookup table is bottleneck + single point of failure

# Consistent hashing (used by Cassandra, DynamoDB)
# Virtual ring: place nodes and keys on ring, key goes to next node clockwise
# Adding/removing a node only moves ~1/N of keys
# Pros: minimal data movement on scale-out

# Practical sharding in MongoDB
db.adminCommand({
  shardCollection: "mydb.orders",
  key: { customerId: "hashed" }   // hash shard key for even distribution
})

# Shard key selection rules:
# ✅ High cardinality (many distinct values)
# ✅ Not monotonically increasing (timestamp → hot shard)
# ✅ Aligns with most common queries
# ❌ Avoid: timestamp, auto-increment IDs as shard keys`} />
      </Section>

      <Section num="13" title="Distributed Transactions">
        <InfoBox>In a monolith with a single database, transactions are easy: ACID gives you atomicity. In microservices with separate databases, there is no global transaction manager — you must coordinate commits across services.</InfoBox>
        <Sub title="2-Phase Commit (2PC)">
          <CodeBlock language="bash" code={`# 2PC: coordinator asks all participants to prepare, then commit (or rollback)
# Phase 1: PREPARE
# Coordinator → all services: "Can you commit this?"
# Each service: locks resources, responds YES or NO

# Phase 2: COMMIT / ROLLBACK
# If all YES → Coordinator → all: "COMMIT"
# If any NO  → Coordinator → all: "ROLLBACK"

# Problems:
# - Coordinator crash between phases → participants stuck with locks
# - Slow (2 round trips + synchronous)
# - Not available if coordinator is down (CP, not AP)
# Used by: XA transactions, Postgres prepared transactions`} />
        </Sub>
        <Sub title="SAGA pattern (preferred for microservices)">
          <CodeBlock language="javascript" code={`// SAGA: sequence of local transactions, each publishing events
// If one step fails, compensating transactions undo previous steps

// Order SAGA steps:
// 1. Create Order (OrderService)      → event: OrderCreated
// 2. Reserve Inventory (StockService) → event: InventoryReserved
// 3. Charge Payment (PaymentService)  → event: PaymentCharged
// 4. Ship Order (ShippingService)     → event: OrderShipped

// If step 3 fails (payment declined):
// Compensate step 2: Release inventory
// Compensate step 1: Cancel order

// Orchestration SAGA (coordinator service drives the workflow)
class OrderSaga {
  async execute(order) {
    const steps = [
      { execute: () => orderService.create(order),
        compensate: () => orderService.cancel(order.id) },
      { execute: () => stockService.reserve(order),
        compensate: () => stockService.release(order.id) },
      { execute: () => paymentService.charge(order),
        compensate: () => paymentService.refund(order.id) },
    ]
    const completed = []
    for (const step of steps) {
      try {
        await step.execute()
        completed.push(step)
      } catch (err) {
        // rollback in reverse
        for (const done of completed.reverse()) {
          await done.compensate().catch(console.error)
        }
        throw err
      }
    }
  }
}`} />
        </Sub>
      </Section>

      <Section num="14" title="Observability — Logs, Metrics, Traces">
        <InfoBox>The three pillars of observability: Logs (what happened), Metrics (how much / how often), Traces (where time was spent across services).</InfoBox>
        <CodeBlock language="javascript" code={`// ── Structured logging ──────────────────────────────────────────────
import pino from 'pino'  // npm install pino
const log = pino({ level: 'info' })

log.info({ requestId, userId, method: 'POST', path: '/orders', ms: 42 }, 'Request completed')
// Output: {"level":30,"time":1700000000,"requestId":"...","msg":"Request completed"}

// ── Metrics with Prometheus ──────────────────────────────────────────
import { Counter, Histogram, register } from 'prom-client'  // npm install prom-client

const httpRequests = new Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status'],
})

const httpDuration = new Histogram({
  name: 'http_request_duration_ms',
  help: 'HTTP request latency',
  labelNames: ['method', 'route'],
  buckets: [5, 10, 25, 50, 100, 250, 500, 1000],
})

// Middleware
app.use((req, res, next) => {
  const timer = httpDuration.startTimer({ method: req.method, route: req.path })
  res.on('finish', () => {
    timer()
    httpRequests.inc({ method: req.method, route: req.path, status: res.statusCode })
  })
  next()
})
app.get('/metrics', (req, res) => res.send(register.metrics()))

// ── Distributed tracing (OpenTelemetry) ─────────────────────────────
import { trace } from '@opentelemetry/api'
const tracer = trace.getTracer('order-service')

async function processOrder(orderId) {
  const span = tracer.startSpan('processOrder')
  span.setAttribute('order.id', orderId)
  try {
    const span2 = tracer.startSpan('fetchInventory', { parent: span })
    const inventory = await inventoryService.get(orderId)
    span2.end()
    return inventory
  } catch (err) {
    span.recordException(err)
    span.setStatus({ code: SpanStatusCode.ERROR })
    throw err
  } finally {
    span.end()
  }
}`} />
      </Section>

      <Section num="15" title="Mini Project: Microservice with Node.js">
        <p>Two microservices communicating via REST and a message queue (Redis Streams). Order Service creates orders; Notification Service sends email confirmations asynchronously.</p>
        <Sub title="order-service/index.js">
          <CodeBlock language="javascript" code={`import express from 'express'
import Redis from 'ioredis'
import { randomUUID } from 'crypto'

const app = express()
const redis = new Redis()

app.use(express.json())

// POST /orders — create an order and emit an event
app.post('/orders', async (req, res) => {
  const { customerId, items } = req.body
  if (!customerId || !items?.length) {
    return res.status(422).json({ error: 'customerId and items required' })
  }

  const order = {
    id: randomUUID(),
    customerId,
    items,
    total: items.reduce((sum, i) => sum + i.price * i.qty, 0),
    status: 'pending',
    createdAt: new Date().toISOString(),
  }

  // "Persist" (in real app: write to DB inside a transaction)
  await redis.hset(\`order:\${order.id}\`, order)

  // Emit event to Redis Stream (async — don't block response)
  await redis.xadd('order.created', '*',
    'orderId',    order.id,
    'customerId', order.customerId,
    'total',      String(order.total),
    'payload',    JSON.stringify(order),
  )

  res.status(201).json(order)
})

app.get('/orders/:id', async (req, res) => {
  const order = await redis.hgetall(\`order:\${req.params.id}\`)
  if (!order?.id) return res.status(404).json({ error: 'Not found' })
  res.json(order)
})

app.get('/health', (_, res) => res.json({ ok: true }))
app.listen(3000, () => console.log('Order Service :3000'))`} />
        </Sub>
        <Sub title="notification-service/index.js">
          <CodeBlock language="javascript" code={`import Redis from 'ioredis'

const redis = new Redis()

// Consumer group — multiple instances share work
const GROUP   = 'notification-consumers'
const STREAM  = 'order.created'
const CONSUMER = process.env.HOSTNAME || 'notification-1'

async function ensureGroup() {
  try {
    await redis.xgroup('CREATE', STREAM, GROUP, '0', 'MKSTREAM')
    console.log('Consumer group created')
  } catch (err) {
    if (!err.message.includes('BUSYGROUP')) throw err
  }
}

async function sendEmail(order) {
  // In real app: call SendGrid, SES, etc.
  console.log(\`✉️  Email sent to customer \${order.customerId}:
     Order \${order.orderId} confirmed — total \$\${Number(order.total).toFixed(2)}\`)
  await new Promise(r => setTimeout(r, 50))  // simulate async email call
}

async function processMessages() {
  console.log(\`Notification Service listening on stream '\${STREAM}'...\`)
  while (true) {
    try {
      // Read new messages assigned to this consumer
      const results = await redis.xreadgroup(
        'GROUP', GROUP, CONSUMER,
        'COUNT', 10,
        'BLOCK', 2000,       // block up to 2s
        'STREAMS', STREAM, '>'  // '>' = new undelivered messages
      )

      if (!results) continue

      for (const [, messages] of results) {
        for (const [id, fields] of messages) {
          const data = {}
          for (let i = 0; i < fields.length; i += 2) {
            data[fields[i]] = fields[i + 1]
          }

          try {
            await sendEmail(data)
            await redis.xack(STREAM, GROUP, id)  // mark as processed
          } catch (err) {
            console.error(\`Failed to process \${id}:\`, err.message)
            // Leave unacked — will be redelivered on restart
          }
        }
      }
    } catch (err) {
      console.error('Stream error:', err.message)
      await new Promise(r => setTimeout(r, 1000))
    }
  }
}

ensureGroup().then(processMessages)`} />
        </Sub>
        <Sub title="docker-compose.yml">
          <CodeBlock language="yaml" code={`version: '3.8'
services:
  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]

  order-service:
    build: ./order-service
    ports: ["3000:3000"]
    environment:
      - REDIS_HOST=redis
    depends_on: [redis]

  notification-service:
    build: ./notification-service
    environment:
      - REDIS_HOST=redis
    depends_on: [redis]
    # Scale to multiple instances: docker compose up --scale notification-service=3`} />
        </Sub>
      </Section>
    </div>
  )
}
