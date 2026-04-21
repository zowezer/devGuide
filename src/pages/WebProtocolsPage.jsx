import CodeBlock from '../components/CodeBlock'
import Section, { Sub, InfoBox, WarnBox, TipBox } from '../components/Section'

const sections = [
  'HTTP/1.1 — The Foundation',
  'HTTP Methods and Status Codes',
  'Headers — Request and Response',
  'HTTPS and TLS',
  'HTTP/2 and HTTP/3',
  'REST API Design',
  'WebSockets — Real-Time Bidirectional',
  'gRPC — High-Performance RPC',
  'GraphQL',
  'Authentication — JWT and OAuth2',
  'CORS and Security Headers',
  'Caching — ETags and Cache-Control',
  'Rate Limiting and Pagination',
  'API Versioning and Documentation',
  'Mini Project: HTTP Client from Scratch',
]

export default function WebProtocolsPage() {
  return (
    <div>
      <div className="page-hero">
        <div className="lang-icon">🔗</div>
        <div>
          <h1>Web Protocols</h1>
          <p>
            HTTP is the language of the web. Every API call, page load, and WebSocket connection
            uses it. Understanding HTTP at the wire level — requests, responses, headers, TLS
            handshakes — makes you a better API designer, a better debugger, and helps you build
            faster, more secure applications.
          </p>
          <div className="badges">
            <span className="badge green">HTTP/1.1 · 2 · 3</span>
            <span className="badge">TLS/HTTPS</span>
            <span className="badge yellow">REST · gRPC · GraphQL</span>
            <span className="badge purple">WebSockets</span>
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

      <Section num="1" title="HTTP/1.1 — The Foundation">
        <InfoBox>HTTP is a stateless, text-based, request-response protocol. Every interaction is a request (client → server) followed by a response (server → client). Stateless means each request carries all the information the server needs — there is no "memory" between requests.</InfoBox>
        <Sub title="Raw HTTP request/response">
          <CodeBlock language="bash" code={`# HTTP Request structure
GET /api/users/42 HTTP/1.1          ← Request line: method + path + version
Host: api.example.com               ← Headers (required: Host)
Accept: application/json            ←
Authorization: Bearer eyJ...        ←
User-Agent: MyApp/1.0               ←
                                    ← Blank line separates headers from body
                                    ← (GET has no body)

# HTTP Response structure
HTTP/1.1 200 OK                     ← Status line: version + code + reason
Content-Type: application/json      ← Response headers
Content-Length: 87                  ←
Cache-Control: max-age=300          ←
                                    ← Blank line
{"id":42,"name":"Alice","email":"alice@example.com","createdAt":"2024-01-01"}

# Inspect raw HTTP with curl
curl -v https://api.example.com/users/42    # verbose — shows headers
curl -i https://api.example.com/users/42    # show response headers
curl -I https://api.example.com             # HEAD only (no body)`} />
        </Sub>
        <Sub title="HTTP/1.1 connection behaviour">
          <CodeBlock language="bash" code={`# HTTP/1.0 — one TCP connection per request (slow)
# HTTP/1.1 — persistent connections by default (Connection: keep-alive)
#           — pipelining (send multiple requests without waiting for each response)
#           — but still HEAD-OF-LINE BLOCKING: responses must arrive in order

# HTTP/1.1 problems:
# - Only 1 request in flight per connection (practically)
# - Browsers open 6 connections per domain to workaround
# - Header overhead (repeated cookies/UA on every request, text not binary)

# Check what version a server uses
curl --http1.1 https://example.com -v 2>&1 | grep "< HTTP"
curl --http2   https://example.com -v 2>&1 | grep "< HTTP"`} />
        </Sub>
      </Section>

      <Section num="2" title="HTTP Methods and Status Codes">
        <Sub title="Methods">
          <CodeBlock language="bash" code={`GET     /resources          # Retrieve — safe, idempotent, cacheable
POST    /resources          # Create — not idempotent (calling twice creates twice)
PUT     /resources/42       # Replace entire resource — idempotent
PATCH   /resources/42       # Partial update — usually not idempotent
DELETE  /resources/42       # Delete — idempotent
HEAD    /resources/42       # GET without body (check existence, get headers)
OPTIONS /resources          # What methods are allowed? (also for CORS preflight)

# Idempotent = calling N times has same effect as calling once
# Safe = no side effects (GET, HEAD, OPTIONS)

# curl examples
curl https://api.example.com/users                          # GET
curl -X POST -H "Content-Type: application/json" \\
  -d '{"name":"Alice"}' https://api.example.com/users       # POST
curl -X PATCH -H "Content-Type: application/json" \\
  -d '{"name":"Alicia"}' https://api.example.com/users/42   # PATCH
curl -X DELETE https://api.example.com/users/42             # DELETE`} />
        </Sub>
        <Sub title="Status codes">
          <CodeBlock language="bash" code={`# 1xx — Informational
100 Continue         # Server received request headers, client should proceed
101 Switching Protocols  # Upgrading to WebSocket

# 2xx — Success
200 OK               # Standard success
201 Created          # POST succeeded, new resource created (include Location header)
204 No Content       # Success but no body (DELETE, PATCH with no return)
206 Partial Content  # Range request succeeded (video streaming)

# 3xx — Redirection
301 Moved Permanently   # URL changed forever, update your links (browsers cache)
302 Found               # Temporary redirect (don't cache)
304 Not Modified        # Conditional GET — resource unchanged, use your cache
307 Temporary Redirect  # Preserve method (don't change POST to GET)
308 Permanent Redirect  # Like 301 but preserve method

# 4xx — Client errors
400 Bad Request         # Malformed syntax, invalid data
401 Unauthorized        # Not authenticated (misleading name)
403 Forbidden           # Authenticated but not authorized
404 Not Found
405 Method Not Allowed  # PUT /users when PUT isn't supported
409 Conflict            # Duplicate key, version conflict
410 Gone                # Resource permanently deleted
422 Unprocessable Entity  # Validation failed (common in REST APIs)
429 Too Many Requests   # Rate limited

# 5xx — Server errors
500 Internal Server Error  # Generic server crash
502 Bad Gateway            # Upstream server error (nginx → app server)
503 Service Unavailable    # Down for maintenance / overloaded
504 Gateway Timeout        # Upstream too slow`} />
        </Sub>
      </Section>

      <Section num="3" title="Headers — Request and Response">
        <CodeBlock language="bash" code={`# ── Common Request Headers ──────────────────────────────────────────
Content-Type: application/json          # body format
Content-Type: multipart/form-data       # file uploads
Accept: application/json, text/html     # what formats client accepts
Accept-Encoding: gzip, deflate, br      # compression client supports
Authorization: Bearer <jwt_token>       # auth token
Authorization: Basic dXNlcjpwYXNz      # base64 of user:pass
Cookie: sessionId=abc; theme=dark       # send cookies
Cache-Control: no-cache                 # bypass cache
If-None-Match: "abc123"                 # conditional — only if ETag changed
If-Modified-Since: Mon, 01 Jan 2024...  # conditional — only if newer
User-Agent: Mozilla/5.0 ...             # client identification
X-Request-ID: 550e8400-e29b-41d4-a716  # distributed tracing

# ── Common Response Headers ──────────────────────────────────────────
Content-Type: application/json; charset=utf-8
Content-Length: 1234
Content-Encoding: gzip
Location: /api/users/42              # after 201 Created or 3xx redirect
Set-Cookie: sessionId=abc; HttpOnly; Secure; SameSite=Strict; Max-Age=3600
ETag: "abc123"                       # cache validator
Last-Modified: Mon, 01 Jan 2024 ...  # cache validator
Cache-Control: max-age=3600, public  # caching directives
Vary: Accept-Encoding                # cache by this header
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
Retry-After: 60                      # after 429, wait this many seconds

# ── CORS Headers (server → browser) ──────────────────────────────────
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Authorization, Content-Type
Access-Control-Max-Age: 86400        # preflight cache duration`} />
      </Section>

      <Section num="4" title="HTTPS and TLS">
        <InfoBox>HTTPS = HTTP over TLS. TLS encrypts the connection so that eavesdroppers see only ciphertext. It also authenticates the server (via certificates) so you know you're talking to the real server and not an attacker.</InfoBox>
        <Sub title="TLS handshake (TLS 1.3)">
          <CodeBlock language="bash" code={`Client                            Server
  │                                 │
  │── ClientHello ─────────────────▶│  supported TLS versions, cipher suites,
  │   + key_share                   │  key share for Diffie-Hellman
  │                                 │
  │◀── ServerHello ─────────────────│  chosen cipher suite, key share,
  │    + Certificate                │  server certificate (public key)
  │    + CertificateVerify          │  signature proving cert ownership
  │    + Finished (encrypted)       │
  │                                 │
  [Client verifies certificate:
   - Signed by trusted CA?
   - Not expired?
   - Domain matches?]
  │                                 │
  │── Finished (encrypted) ────────▶│
  │                                 │
  │══════ Encrypted HTTP ═══════════│  Connection established!

TLS 1.3: 1 round trip (vs 2 in TLS 1.2)
Session resumption (0-RTT): can send data with first packet`} />
        </Sub>
        <Sub title="Certificate chain">
          <CodeBlock language="bash" code={`# Certificate chain:
# Your cert (example.com) signed by → Intermediate CA signed by → Root CA
# Root CA certificates are pre-installed in your OS/browser

# Inspect a certificate
openssl s_client -connect example.com:443 -servername example.com
echo | openssl s_client -connect example.com:443 2>/dev/null | openssl x509 -text

# Check expiry
echo | openssl s_client -connect example.com:443 2>/dev/null \\
  | openssl x509 -noout -dates

# Generate self-signed cert (for development)
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes

# Let's Encrypt (free production certs)
certbot certonly --standalone -d example.com
certbot renew --dry-run   # test auto-renewal`} />
        </Sub>
      </Section>

      <Section num="5" title="HTTP/2 and HTTP/3">
        <CodeBlock language="bash" code={`# ── HTTP/2 ────────────────────────────────────────────────────────
# Binary framing (not text) — more efficient parsing
# Multiplexing — multiple requests on ONE TCP connection simultaneously
#   → solves HTTP/1.1's head-of-line blocking at the HTTP layer
# Header compression (HPACK) — repeated headers sent once
# Server push — server proactively sends resources before client asks
# Requires TLS in practice (all browsers require it)

# HTTP/2 frames:
# HEADERS — like HTTP/1 headers (compressed)
# DATA    — payload
# SETTINGS — configuration
# WINDOW_UPDATE — flow control
# PUSH_PROMISE — server push announcement

# Check HTTP/2 support
curl -v --http2 https://example.com 2>&1 | grep "using HTTP/2"
nghttp -v https://example.com       # HTTP/2 client

# ── HTTP/3 / QUIC ──────────────────────────────────────────────────
# Built on UDP (not TCP) + QUIC protocol
# Eliminates TCP head-of-line blocking (QUIC handles per-stream reliability)
# Faster connection setup (0-RTT or 1-RTT vs TCP 3-way + TLS)
# Connection migration — survive IP address changes (mobile handoff)

# QUIC handles:
# - Reliability (ACKs, retransmission)
# - Encryption (TLS 1.3 built-in)
# - Multiplexing (independent streams)
# - Flow control

curl --http3 https://cloudflare.com  # if curl compiled with QUIC support`} />
      </Section>

      <Section num="6" title="REST API Design">
        <InfoBox>REST (Representational State Transfer) is an architectural style, not a protocol. A RESTful API uses HTTP methods and URLs to represent resources and operations.</InfoBox>
        <CodeBlock language="bash" code={`# Resource naming — use nouns, not verbs
✅ GET    /users              # list all users
✅ POST   /users              # create user
✅ GET    /users/42           # get user 42
✅ PUT    /users/42           # replace user 42
✅ PATCH  /users/42           # partial update
✅ DELETE /users/42           # delete user 42

# Nested resources
GET    /users/42/posts         # posts by user 42
POST   /users/42/posts         # create post for user 42
GET    /users/42/posts/7       # specific post

# Filtering, sorting, pagination
GET /products?category=electronics&minPrice=100&maxPrice=500
GET /users?sort=createdAt&order=desc
GET /users?page=2&limit=20
GET /users?cursor=eyJpZCI6NDJ9  # cursor-based pagination

# Response envelope (common patterns)
{
  "data": [...],
  "meta": { "total": 150, "page": 2, "limit": 20 },
  "links": { "next": "/users?page=3", "prev": "/users?page=1" }
}

# Error response
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is invalid",
    "details": [{"field": "email", "message": "must be valid email"}],
    "requestId": "550e8400-e29b-41d4-a716"
  }
}

# Versioning strategies
/v1/users           # URL path versioning (most common, explicit)
Accept: application/vnd.api+json;version=1   # header versioning
api.v1.example.com  # subdomain versioning`} />
      </Section>

      <Section num="7" title="WebSockets — Real-Time Bidirectional">
        <InfoBox>HTTP is half-duplex (request then response). WebSockets upgrade an HTTP connection to a full-duplex channel where both client and server can send messages at any time. Used for chat, live dashboards, multiplayer games, and real-time notifications.</InfoBox>
        <Sub title="WebSocket server (Node.js)">
          <CodeBlock language="javascript" code={`import { WebSocketServer } from 'ws'   // npm install ws

const wss = new WebSocketServer({ port: 8080 })
const clients = new Set()

wss.on('connection', (ws, req) => {
  clients.add(ws)
  console.log('Client connected. Total:', clients.size)

  ws.on('message', (data) => {
    const msg = JSON.parse(data.toString())
    console.log('Received:', msg)

    // Broadcast to all other clients
    for (const client of clients) {
      if (client !== ws && client.readyState === ws.OPEN) {
        client.send(JSON.stringify({ from: 'other', ...msg }))
      }
    }
  })

  ws.on('close', () => {
    clients.delete(ws)
    console.log('Client disconnected. Total:', clients.size)
  })

  ws.send(JSON.stringify({ type: 'welcome', message: 'Connected!' }))
})`} />
        </Sub>
        <Sub title="WebSocket client (browser / Node.js)">
          <CodeBlock language="javascript" code={`// Browser
const ws = new WebSocket('wss://example.com/ws')

ws.onopen    = ()    => { ws.send(JSON.stringify({ type: 'ping' })) }
ws.onmessage = (e)   => { console.log('Message:', JSON.parse(e.data)) }
ws.onclose   = (e)   => { console.log('Closed:', e.code, e.reason) }
ws.onerror   = (e)   => { console.error('Error:', e) }

// Send
ws.send(JSON.stringify({ type: 'chat', text: 'Hello!' }))
ws.close()  // clean close

// Node.js client
import WebSocket from 'ws'
const ws = new WebSocket('ws://localhost:8080')
ws.on('open', () => ws.send('hello'))
ws.on('message', (data) => console.log('Server says:', data.toString()))`} />
        </Sub>
      </Section>

      <Section num="8" title="gRPC — High-Performance RPC">
        <InfoBox>gRPC uses Protocol Buffers (binary serialization) over HTTP/2. It's 5-10x more efficient than JSON REST for internal service-to-service communication. Strongly typed contracts via <code>.proto</code> files.</InfoBox>
        <Sub title="Proto definition">
          <CodeBlock language="bash" code={`// user.proto
syntax = "proto3";
package user;

service UserService {
  rpc GetUser    (GetUserRequest)    returns (User);
  rpc ListUsers  (ListUsersRequest)  returns (stream User);   // server streaming
  rpc CreateUser (stream UserInput)  returns (CreateResult); // client streaming
  rpc Chat       (stream Message)    returns (stream Message); // bidirectional
}

message User {
  int32  id    = 1;
  string name  = 2;
  string email = 3;
  int64  created_at = 4;
}

message GetUserRequest  { int32 id = 1; }
message ListUsersRequest{ string filter = 1; int32 limit = 2; }
message UserInput       { string name = 1; string email = 2; }
message CreateResult    { repeated int32 ids = 1; int32 count = 2; }`} />
        </Sub>
        <Sub title="gRPC server (Node.js)">
          <CodeBlock language="javascript" code={`// npm install @grpc/grpc-js @grpc/proto-loader
import grpc from '@grpc/grpc-js'
import protoLoader from '@grpc/proto-loader'

const pkg = protoLoader.loadSync('user.proto')
const proto = grpc.loadPackageDefinition(pkg).user

const server = new grpc.Server()
server.addService(proto.UserService.service, {
  getUser: (call, callback) => {
    const { id } = call.request
    // fetch from DB
    const user = { id, name: 'Alice', email: 'alice@example.com', created_at: Date.now() }
    callback(null, user)
  },
  listUsers: (call) => {
    const users = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]
    users.forEach(u => call.write(u))
    call.end()
  },
})
server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
  console.log('gRPC server on :50051')
})`} />
        </Sub>
      </Section>

      <Section num="9" title="GraphQL">
        <InfoBox>GraphQL lets clients request exactly the fields they need — no over-fetching (getting too much data) or under-fetching (needing multiple requests). One endpoint (<code>/graphql</code>) replaces dozens of REST endpoints.</InfoBox>
        <CodeBlock language="javascript" code={`// npm install @apollo/server graphql
import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'

const typeDefs = \`
  type User {
    id: ID!
    name: String!
    email: String!
    posts: [Post!]!
  }
  type Post {
    id: ID!
    title: String!
    body: String!
    author: User!
  }
  type Query {
    user(id: ID!): User
    users: [User!]!
  }
  type Mutation {
    createUser(name: String!, email: String!): User!
    createPost(authorId: ID!, title: String!, body: String!): Post!
  }
\`

const resolvers = {
  Query: {
    user: (_, { id }) => db.users.find(u => u.id === id),
    users: () => db.users,
  },
  User: {
    posts: (user) => db.posts.filter(p => p.authorId === user.id),
  },
  Post: {
    author: (post) => db.users.find(u => u.id === post.authorId),
  },
  Mutation: {
    createUser: (_, { name, email }) => {
      const user = { id: String(db.users.length + 1), name, email }
      db.users.push(user)
      return user
    },
  },
}

const server = new ApolloServer({ typeDefs, resolvers })
const { url } = await startStandaloneServer(server, { listen: { port: 4000 } })
console.log(\`GraphQL at \${url}\`)`} />
        <Sub title="GraphQL query syntax">
          <CodeBlock language="bash" code={`# Query — fetch exactly what you need
query {
  user(id: "42") {
    name
    email
    posts {
      title
      # body intentionally omitted — won't be fetched
    }
  }
}

# Mutation — create/update
mutation CreateUser {
  createUser(name: "Alice", email: "alice@example.com") {
    id
    name
  }
}

# Variables (parameterized queries)
query GetUser($id: ID!) {
  user(id: $id) { name email }
}
# variables: { "id": "42" }

# Subscription (real-time over WebSocket)
subscription {
  newPost { title author { name } }
}`} />
        </Sub>
      </Section>

      <Section num="10" title="Authentication — JWT and OAuth2">
        <Sub title="JWT (JSON Web Token)">
          <CodeBlock language="javascript" code={`// JWT structure: header.payload.signature (base64url encoded)
// npm install jsonwebtoken
import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET   // keep this secret!

// Sign (create token)
function createToken(userId, role) {
  return jwt.sign(
    { sub: userId, role, iat: Date.now() },
    SECRET,
    { expiresIn: '1h', algorithm: 'HS256' }
  )
}

// Verify (validate token)
function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET)  // throws if invalid/expired
  } catch (err) {
    return null
  }
}

// Express middleware
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'No token' })
  const payload = verifyToken(auth.slice(7))
  if (!payload) return res.status(401).json({ error: 'Invalid token' })
  req.user = payload
  next()
}
// Usage: app.get('/protected', authMiddleware, handler)`} />
        </Sub>
        <Sub title="OAuth2 flow">
          <CodeBlock language="bash" code={`# OAuth2 Authorization Code Flow (for web apps)
# "Login with Google" flow:

1. User clicks "Login with Google"
2. App redirects to Google:
   GET https://accounts.google.com/o/oauth2/auth
     ?response_type=code
     &client_id=YOUR_CLIENT_ID
     &redirect_uri=https://yourapp.com/callback
     &scope=openid email profile
     &state=random_csrf_token

3. User logs in to Google, grants permission
4. Google redirects back:
   GET https://yourapp.com/callback?code=AUTH_CODE&state=...

5. App exchanges code for tokens (server-side, never expose client_secret):
   POST https://oauth2.googleapis.com/token
     client_id=...&client_secret=...&code=AUTH_CODE&grant_type=authorization_code

6. Google returns:
   { "access_token": "...", "id_token": "...", "expires_in": 3600 }

7. App verifies id_token (JWT), extracts user info, creates session`} />
        </Sub>
      </Section>

      <Section num="11" title="CORS and Security Headers">
        <InfoBox>The Same-Origin Policy prevents JavaScript on <code>evil.com</code> from making requests to <code>bank.com</code>. CORS (Cross-Origin Resource Sharing) is the mechanism that lets trusted origins opt-in to cross-origin requests.</InfoBox>
        <Sub title="CORS">
          <CodeBlock language="javascript" code={`// Express CORS setup
import cors from 'cors'   // npm install cors

// Permissive (development only)
app.use(cors())

// Production config
app.use(cors({
  origin: ['https://myapp.com', 'https://app.mycompany.com'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,   // allow cookies
  maxAge: 86400,        // cache preflight for 24h
}))

// How CORS works:
// 1. Simple request (GET/POST with basic headers) — browser adds Origin header
// 2. Preflight (OPTIONS) — sent before PUT/DELETE or custom headers
//    Server must respond with Access-Control-Allow-* headers
// 3. Browser checks headers — if allowed, proceeds with actual request`} />
        </Sub>
        <Sub title="Security headers">
          <CodeBlock language="javascript" code={`// npm install helmet
import helmet from 'helmet'
app.use(helmet())   // sets all security headers automatically

// What helmet sets:
// Content-Security-Policy: default-src 'self'
//   → Prevents XSS by whitelisting allowed content sources
// Strict-Transport-Security: max-age=31536000; includeSubDomains
//   → Force HTTPS for 1 year (HSTS)
// X-Frame-Options: DENY
//   → Prevent clickjacking (your page can't be iframed)
// X-Content-Type-Options: nosniff
//   → Browser won't MIME-sniff response
// Referrer-Policy: no-referrer
//   → Don't leak URL in Referer header
// Permissions-Policy: camera=(), microphone=()
//   → Disable browser features you don't need

// Custom CSP example
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", 'https://cdn.jsdelivr.net'],
    imgSrc: ["'self'", 'data:', 'https://images.example.com'],
    connectSrc: ["'self'", 'https://api.example.com'],
  },
}))`} />
        </Sub>
      </Section>

      <Section num="12" title="Caching — ETags and Cache-Control">
        <CodeBlock language="bash" code={`# Cache-Control directives (response header)
Cache-Control: max-age=3600           # cache for 1 hour
Cache-Control: no-cache               # always revalidate (but can still cache)
Cache-Control: no-store               # never cache (sensitive data)
Cache-Control: public                 # CDNs can cache
Cache-Control: private                # only browser can cache (not CDN)
Cache-Control: immutable              # will never change (versioned assets)
Cache-Control: stale-while-revalidate=60  # serve stale, refresh in background

# ETag — content hash for conditional requests
# Server response:
ETag: "a1b2c3d4"   (strong ETag, byte-for-byte match)
ETag: W/"a1b2c3d4" (weak ETag, semantically equivalent)

# Client next request:
If-None-Match: "a1b2c3d4"
# Server: 304 Not Modified if unchanged (saves bandwidth)
# Server: 200 OK with new body+ETag if changed

# Last-Modified (time-based caching)
Last-Modified: Mon, 01 Jan 2024 12:00:00 GMT
# Client: If-Modified-Since: Mon, 01 Jan 2024 12:00:00 GMT

# Express caching
import etag from 'etag'  // or use express built-in
app.set('etag', 'strong')
app.get('/data', (req, res) => {
  const data = fetchData()
  const hash = etag(JSON.stringify(data))
  if (req.headers['if-none-match'] === hash) {
    return res.status(304).end()
  }
  res.setHeader('ETag', hash)
  res.setHeader('Cache-Control', 'public, max-age=300')
  res.json(data)
})`} />
      </Section>

      <Section num="13" title="Rate Limiting and Pagination">
        <Sub title="Rate limiting headers">
          <CodeBlock language="bash" code={`# Response headers to communicate rate limit state
X-RateLimit-Limit: 100           # requests allowed per window
X-RateLimit-Remaining: 43        # requests left this window
X-RateLimit-Reset: 1700000060    # Unix timestamp when window resets
Retry-After: 30                  # seconds to wait when 429

# Strategies:
# Fixed window: count requests in fixed time buckets (simple, burstable at boundary)
# Sliding window: exact count in last N seconds (smooth, more complex)
# Token bucket: fill at rate R, burst up to capacity B (allows controlled bursts)
# Leaky bucket: process at fixed rate, queue excess (smoothest output)`} />
        </Sub>
        <Sub title="Cursor-based pagination">
          <CodeBlock language="javascript" code={`// Cursor pagination — more stable than page/offset for large datasets
// Offset pagination breaks when items are inserted/deleted mid-page

// Request:
// GET /posts?limit=20&after=eyJpZCI6NDJ9
// (after is base64 of {"id": 42})

// Response:
// {
//   "data": [...20 posts...],
//   "pagination": {
//     "hasNextPage": true,
//     "hasPrevPage": true,
//     "nextCursor": "eyJpZCI6NjJ9",   ← base64({"id": 62})
//     "prevCursor": "eyJpZCI6MjJ9"
//   }
// }

// Implementation
app.get('/posts', async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 20, 100)
  const cursor = req.query.after ? JSON.parse(Buffer.from(req.query.after, 'base64').toString()) : null

  const posts = await db.collection('posts').find(
    cursor ? { _id: { $gt: cursor.id } } : {}
  ).limit(limit + 1).toArray()  // fetch one extra to know if there's a next page

  const hasNextPage = posts.length > limit
  if (hasNextPage) posts.pop()

  const nextCursor = hasNextPage
    ? Buffer.from(JSON.stringify({ id: posts.at(-1)._id })).toString('base64')
    : null

  res.json({ data: posts, pagination: { hasNextPage, nextCursor } })
})`} />
        </Sub>
      </Section>

      <Section num="14" title="API Versioning and Documentation">
        <Sub title="OpenAPI / Swagger">
          <CodeBlock language="bash" code={`# npm install swagger-ui-express @fastify/swagger
# Or generate from code with annotations

# openapi.yaml — API contract
openapi: "3.0.0"
info:
  title: User API
  version: "1.0"
paths:
  /users/{id}:
    get:
      summary: Get a user
      parameters:
        - name: id
          in: path
          required: true
          schema: { type: integer }
      responses:
        "200":
          description: User found
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/User"
        "404":
          description: Not found

components:
  schemas:
    User:
      type: object
      properties:
        id:   { type: integer }
        name: { type: string }
        email: { type: string, format: email }
      required: [id, name, email]
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT`} />
        </Sub>
      </Section>

      <Section num="15" title="Mini Project: HTTP Client from Scratch">
        <p>Build a minimal HTTP/1.1 client using raw TCP sockets — no http libraries. Shows exactly what happens at the wire level for a GET request with headers and response parsing.</p>
        <CodeBlock language="python" code={`#!/usr/bin/env python3
"""
http_client.py — minimal HTTP/1.1 client over raw TCP
Handles: redirect following, chunked transfer encoding, compression
"""
import socket
import ssl
import gzip
import zlib
from urllib.parse import urlparse, urlencode

def send_request(method, url, headers=None, body=None, max_redirects=5):
    parsed = urlparse(url)
    scheme = parsed.scheme
    host   = parsed.hostname
    port   = parsed.port or (443 if scheme == 'https' else 80)
    path   = parsed.path or '/'
    if parsed.query:
        path += '?' + parsed.query

    # Build raw request
    req_headers = {
        'Host': host,
        'User-Agent': 'PythonHTTPClient/1.0',
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'close',
    }
    if headers:
        req_headers.update(headers)
    if body:
        req_headers['Content-Length'] = str(len(body))

    request = f"{method} {path} HTTP/1.1\\r\\n"
    request += ''.join(f"{k}: {v}\\r\\n" for k, v in req_headers.items())
    request += "\\r\\n"

    # Open TCP connection
    sock = socket.create_connection((host, port), timeout=10)
    if scheme == 'https':
        ctx = ssl.create_default_context()
        sock = ctx.wrap_socket(sock, server_hostname=host)

    try:
        sock.sendall(request.encode())
        if body:
            sock.sendall(body if isinstance(body, bytes) else body.encode())

        # Read response
        raw = b''
        while chunk := sock.recv(8192):
            raw += chunk
    finally:
        sock.close()

    # Parse response
    header_end = raw.find(b'\\r\\n\\r\\n')
    header_section = raw[:header_end].decode()
    body_raw = raw[header_end + 4:]

    lines = header_section.split('\\r\\n')
    status_line = lines[0]
    version, status_code, *reason_parts = status_line.split(' ')
    status_code = int(status_code)
    reason = ' '.join(reason_parts)

    resp_headers = {}
    for line in lines[1:]:
        if ':' in line:
            k, _, v = line.partition(':')
            resp_headers[k.strip().lower()] = v.strip()

    # Handle chunked transfer encoding
    if resp_headers.get('transfer-encoding') == 'chunked':
        body_raw = decode_chunked(body_raw)

    # Decompress
    enc = resp_headers.get('content-encoding', '')
    if 'gzip' in enc:
        body_raw = gzip.decompress(body_raw)
    elif 'deflate' in enc:
        body_raw = zlib.decompress(body_raw)

    # Follow redirects
    if status_code in (301, 302, 303, 307, 308) and max_redirects > 0:
        location = resp_headers.get('location')
        if location:
            if not location.startswith('http'):
                location = f"{scheme}://{host}{location}"
            method = 'GET' if status_code in (301, 302, 303) else method
            return send_request(method, location, headers, body, max_redirects - 1)

    charset = 'utf-8'
    ct = resp_headers.get('content-type', '')
    if 'charset=' in ct:
        charset = ct.split('charset=')[1].split(';')[0].strip()

    return {
        'status': status_code,
        'reason': reason,
        'headers': resp_headers,
        'body': body_raw.decode(charset, errors='replace'),
        'raw_body': body_raw,
    }

def decode_chunked(data):
    """Decode HTTP chunked transfer encoding."""
    result = b''
    while data:
        crlf = data.find(b'\\r\\n')
        if crlf == -1: break
        chunk_size = int(data[:crlf], 16)
        if chunk_size == 0: break
        result += data[crlf + 2:crlf + 2 + chunk_size]
        data = data[crlf + 2 + chunk_size + 2:]
    return result

# ── Demo ──────────────────────────────────────────────────────────
if __name__ == '__main__':
    resp = send_request('GET', 'https://httpbin.org/get',
                        headers={'X-Custom': 'test'})
    print(f"Status: {resp['status']} {resp['reason']}")
    print(f"Content-Type: {resp['headers'].get('content-type', '?')}")
    print(f"Body ({len(resp['raw_body'])} bytes):")
    print(resp['body'][:500])`} />
      </Section>
    </div>
  )
}
