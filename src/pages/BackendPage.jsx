import CodeBlock from '../components/CodeBlock'
import Section, { Sub, InfoBox, WarnBox, TipBox } from '../components/Section'

const sections = [
  'Backend Architecture Overview',
  'HTML and Forms',
  'REST API with Node.js and Express',
  'REST API with Python and FastAPI',
  'Consuming APIs in React',
  'Database Integration',
  'Authentication — JWT and Sessions',
  'File Upload and Storage',
  'Input Validation and Error Handling',
  'Environment and Configuration',
  'API Documentation with OpenAPI',
  'Testing APIs',
  'Machine Learning Model Serving via API',
  'Deployment Patterns',
  'Mini Project: Full-Stack Task Manager',
]

export default function BackendPage() {
  return (
    <div>
      <div className="page-hero">
        <div className="lang-icon">⚙️</div>
        <div>
          <h1>Backend Engineering</h1>
          <p>
            Backend engineering is everything the user doesn't see: servers, APIs, databases,
            authentication, and business logic. This page covers how to build and connect all
            the pieces — create a REST API in Node.js or Python, connect it to a database, secure
            it with JWT auth, and consume it from a React frontend.
          </p>
          <div className="badges">
            <span className="badge green">Node.js · Python</span>
            <span className="badge">REST APIs</span>
            <span className="badge yellow">Authentication</span>
            <span className="badge purple">Full Stack</span>
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

      <Section num="1" title="Backend Architecture Overview">
        <CodeBlock language="bash" code={`# Request lifecycle: Browser → Load Balancer → API Server → DB → Response

Browser
  ↓ HTTPS request
Load Balancer (nginx, AWS ALB)
  ↓ routes to healthy instance
API Server (Express/FastAPI/Spring)
  ↓ middleware: auth, validation, logging, rate limit
  ↓ route handler
  ├─→ Database (Postgres, MongoDB) — for persistence
  ├─→ Cache (Redis) — for speed
  ├─→ External API — Stripe, SendGrid, etc.
  └─→ Message Queue — async tasks
  ↓ response
Client

# Common backend responsibilities:
# ✅ Authentication — verify who the user is
# ✅ Authorization — decide what they can do
# ✅ Validation — reject bad input before it reaches DB
# ✅ Business logic — the rules of the application
# ✅ Data persistence — CRUD via ORM or query builder
# ✅ Caching — speed up repeated reads
# ✅ Error handling — safe, informative error responses
# ✅ Logging — record what happened for debugging
# ✅ Security — rate limiting, CORS, headers, input sanitization`} />
      </Section>

      <Section num="2" title="HTML and Forms">
        <Sub title="HTML form basics">
          <CodeBlock language="bash" code={`<!-- Basic form that submits to a backend endpoint -->
<form action="/api/users" method="POST" enctype="application/x-www-form-urlencoded">
  <label for="name">Name:</label>
  <input type="text"  id="name"  name="name"  required minlength="2" maxlength="100">

  <label for="email">Email:</label>
  <input type="email" id="email" name="email" required>

  <label for="age">Age:</label>
  <input type="number" id="age" name="age" min="0" max="150">

  <!-- File upload — must use multipart/form-data -->
  <label for="avatar">Avatar:</label>
  <input type="file"  id="avatar" name="avatar" accept="image/*">

  <button type="submit">Create User</button>
</form>

<!-- enctype options:
  application/x-www-form-urlencoded — default, key=value pairs
  multipart/form-data               — required for file uploads
  text/plain                        — rarely used
-->`} />
        </Sub>
        <Sub title="Fetch API from HTML (no framework)">
          <CodeBlock language="javascript" code={`// Submit form with Fetch (prevents page reload)
document.querySelector('#my-form').addEventListener('submit', async (e) => {
  e.preventDefault()

  const form = e.target
  const data = Object.fromEntries(new FormData(form))

  try {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const err = await res.json()
      showError(err.message)
      return
    }

    const user = await res.json()
    showSuccess(\`Created user: \${user.name}\`)
  } catch (err) {
    showError('Network error — try again')
  }
})`} />
        </Sub>
      </Section>

      <Section num="3" title="REST API with Node.js and Express">
        <Sub title="Setup and structure">
          <CodeBlock language="bash" code={`npm init -y
npm install express cors helmet morgan express-validator
npm install -D nodemon

# Project structure
src/
  app.js          — express setup, middleware
  server.js       — bind port, start listening
  routes/
    users.js      — user endpoints
    products.js
  controllers/
    userController.js  — business logic
  models/
    User.js       — DB model (Mongoose or Sequelize)
  middleware/
    auth.js       — JWT verification
    validate.js   — validation helper
  services/
    emailService.js`} />
        </Sub>
        <Sub title="Complete Express API">
          <CodeBlock language="javascript" code={`// src/app.js
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'

const app = express()

app.use(helmet())                        // security headers
app.use(cors({ origin: process.env.CLIENT_URL }))
app.use(morgan('combined'))              // access log
app.use(express.json({ limit: '10mb' }))

// ── Routes ─────────────────────────────────────────────────────────
import userRouter from './routes/users.js'
app.use('/api/v1/users', userRouter)

// ── 404 handler ────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ error: 'Not found' }))

// ── Error handler ──────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err)
  const status = err.status || 500
  res.status(status).json({
    error: { message: err.message || 'Internal error', code: err.code },
  })
})

export default app

// src/routes/users.js
import { Router } from 'express'
import { body, param, validationResult } from 'express-validator'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()

const validateUser = [
  body('name').isLength({ min: 2, max: 100 }).trim(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
]

function checkValidation(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }
  next()
}

router.get('/',     authMiddleware, async (req, res, next) => {
  try {
    const users = await User.find().select('-password').lean()
    res.json({ data: users })
  } catch (err) { next(err) }
})

router.post('/', validateUser, checkValidation, async (req, res, next) => {
  try {
    const { name, email, password } = req.body
    const hashed = await bcrypt.hash(password, 12)
    const user = await User.create({ name, email, password: hashed })
    res.status(201).json({ data: { id: user._id, name, email } })
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: 'Email already exists' })
    next(err)
  }
})

router.get('/:id', param('id').isMongoId(), checkValidation, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password')
    if (!user) return res.status(404).json({ error: 'Not found' })
    res.json({ data: user })
  } catch (err) { next(err) }
})

export default router`} />
        </Sub>
      </Section>

      <Section num="4" title="REST API with Python and FastAPI">
        <Sub title="Setup">
          <CodeBlock language="bash" code={`pip install fastapi uvicorn python-jose[cryptography] passlib[bcrypt] motor

# Run
uvicorn app.main:app --reload --port 8000`} />
        </Sub>
        <Sub title="Complete FastAPI app">
          <CodeBlock language="python" code={`# app/main.py
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr, field_validator
from datetime import datetime, timedelta
from jose import jwt, JWTError
from passlib.context import CryptContext
from typing import Optional
import os

app = FastAPI(title="User API", version="1.0")
app.add_middleware(CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"], allow_headers=["*"])

# In-memory store (replace with MongoDB/Postgres in production)
users_db: dict = {}
pwd_ctx = CryptContext(schemes=["bcrypt"])
SECRET = os.getenv("JWT_SECRET", "change-me-in-production")

# ── Pydantic models (validation + serialization) ────────────────────
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

    @field_validator("password")
    @classmethod
    def password_length(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        return v

class UserOut(BaseModel):
    id: str
    name: str
    email: str
    created_at: datetime

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# ── Auth ────────────────────────────────────────────────────────────
bearer = HTTPBearer()

def create_token(user_id: str) -> str:
    payload = {"sub": user_id, "exp": datetime.utcnow() + timedelta(hours=1)}
    return jwt.encode(payload, SECRET, algorithm="HS256")

async def current_user(creds: HTTPAuthorizationCredentials = Depends(bearer)):
    try:
        payload = jwt.decode(creds.credentials, SECRET, algorithms=["HS256"])
        user_id = payload["sub"]
        if user_id not in users_db:
            raise HTTPException(status_code=401, detail="User not found")
        return users_db[user_id]
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ── Routes ──────────────────────────────────────────────────────────
@app.post("/users", status_code=201, response_model=UserOut)
async def create_user(body: UserCreate):
    if any(u["email"] == body.email for u in users_db.values()):
        raise HTTPException(status_code=409, detail="Email already exists")
    import uuid
    uid = str(uuid.uuid4())
    users_db[uid] = {
        "id": uid, "name": body.name, "email": body.email,
        "password": pwd_ctx.hash(body.password),
        "created_at": datetime.utcnow()
    }
    return users_db[uid]

@app.post("/auth/login")
async def login(body: LoginRequest):
    user = next((u for u in users_db.values() if u["email"] == body.email), None)
    if not user or not pwd_ctx.verify(body.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"token": create_token(user["id"])}

@app.get("/users/me", response_model=UserOut)
async def get_me(user=Depends(current_user)):
    return user

@app.get("/users/{user_id}", response_model=UserOut)
async def get_user(user_id: str, _=Depends(current_user)):
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="Not found")
    return users_db[user_id]`} />
        </Sub>
      </Section>

      <Section num="5" title="Consuming APIs in React">
        <Sub title="Custom hook for API calls">
          <CodeBlock language="javascript" code={`// hooks/useApi.js — reusable API hook
import { useState, useEffect, useCallback } from 'react'

export function useApi(url, options = {}) {
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    fetch(url, { ...options, signal: controller.signal })
      .then(async res => {
        if (!res.ok) throw new Error((await res.json()).error || res.statusText)
        return res.json()
      })
      .then(setData)
      .catch(err => { if (err.name !== 'AbortError') setError(err.message) })
      .finally(() => setLoading(false))

    return () => controller.abort()  // cleanup on unmount
  }, [url])

  return { data, loading, error }
}

// hooks/useMutation.js — POST/PUT/PATCH/DELETE
export function useMutation(url, method = 'POST') {
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState(null)

  const mutate = useCallback(async (body) => {
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: \`Bearer \${token}\` } : {}),
        },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error((await res.json()).error || res.statusText)
      return await res.json()
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [url, method])

  return { mutate, loading, error }
}

// Usage in component
function UserList() {
  const { data, loading, error } = useApi('/api/v1/users')

  if (loading) return <div>Loading...</div>
  if (error)   return <div>Error: {error}</div>
  return (
    <ul>
      {data?.data.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  )
}

function CreateUser() {
  const { mutate, loading, error } = useMutation('/api/v1/users')
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const user = await mutate(form)
      alert(\`Created: \${user.data.name}\`)
    } catch {} // error shown via hook
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
      {error && <p style={{color:'red'}}>{error}</p>}
      <button disabled={loading}>{loading ? 'Saving...' : 'Create'}</button>
    </form>
  )
}`} />
        </Sub>
      </Section>

      <Section num="6" title="Database Integration">
        <Sub title="MongoDB with Mongoose (Node.js)">
          <CodeBlock language="javascript" code={`// npm install mongoose
import mongoose from 'mongoose'

await mongoose.connect(process.env.MONGO_URI)

const userSchema = new mongoose.Schema({
  name:  { type: String, required: true, trim: true, minlength: 2 },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role:  { type: String, enum: ['user','admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now },
})
userSchema.index({ email: 1 })                     // index for fast lookup
userSchema.methods.toSafeObject = function() {
  const { password, __v, ...safe } = this.toObject()
  return safe
}

const User = mongoose.model('User', userSchema)
const user = await User.create({ name: 'Alice', email: 'a@x.com', password: hash })
const found = await User.findOne({ email: 'a@x.com' }).select('-password')`} />
        </Sub>
        <Sub title="PostgreSQL with node-postgres (Node.js)">
          <CodeBlock language="javascript" code={`// npm install pg
import pg from 'pg'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })

// Parameterized queries (prevents SQL injection)
async function getUser(id) {
  const { rows } = await pool.query(
    'SELECT id, name, email, created_at FROM users WHERE id = $1',
    [id]
  )
  return rows[0] || null
}

async function createUser({ name, email, hashedPassword }) {
  const { rows } = await pool.query(
    'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
    [name, email, hashedPassword]
  )
  return rows[0]
}

// Transaction
async function transferFunds(fromId, toId, amount) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query('UPDATE accounts SET balance = balance - $1 WHERE id = $2', [amount, fromId])
    await client.query('UPDATE accounts SET balance = balance + $1 WHERE id = $2', [amount, toId])
    await client.query('COMMIT')
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}`} />
        </Sub>
      </Section>

      <Section num="7" title="Authentication — JWT and Sessions">
        <CodeBlock language="javascript" code={`// npm install jsonwebtoken bcryptjs express-rate-limit
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import rateLimit from 'express-rate-limit'

const loginLimiter = rateLimit({ windowMs: 15 * 60_000, max: 5 }) // 5 attempts per 15min

// Register
app.post('/auth/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body
    const hash = await bcrypt.hash(password, 12)
    const user = await User.create({ name, email, password: hash })
    const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.status(201).json({ token, user: { id: user.id, name, email } })
  } catch (err) { next(err) }
})

// Login
app.post('/auth/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }
  const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' })
  res.json({ token })
})

// Auth middleware
export function authMiddleware(req, res, next) {
  const auth = req.headers.authorization
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'No token' })
  try {
    req.user = jwt.verify(auth.slice(7), process.env.JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}

// Role check
export function requireRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) return res.status(403).json({ error: 'Forbidden' })
    next()
  }
}
// Usage: app.delete('/admin/users/:id', authMiddleware, requireRole('admin'), handler)`} />
      </Section>

      <Section num="8" title="File Upload and Storage">
        <CodeBlock language="javascript" code={`// npm install multer @aws-sdk/client-s3
import multer from 'multer'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { randomUUID } from 'crypto'
import path from 'path'

const s3 = new S3Client({ region: process.env.AWS_REGION })

// Multer config — memory storage (for S3 upload)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },  // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif']
    const ext = path.extname(file.originalname).toLowerCase()
    cb(null, allowed.includes(ext))  // cb(error, accept)
  },
})

// Upload endpoint
app.post('/api/upload', authMiddleware, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file provided' })

  const key = \`uploads/\${req.user.sub}/\${randomUUID()}\${path.extname(req.file.originalname)}\`

  await s3.send(new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  }))

  const url = \`https://\${process.env.S3_BUCKET}.s3.amazonaws.com/\${key}\`
  res.json({ url, key, size: req.file.size })
})

// For local development — save to disk
const localUpload = multer({ dest: 'uploads/', limits: { fileSize: 5 * 1024 * 1024 } })
app.use('/uploads', express.static('uploads'))  // serve static files`} />
      </Section>

      <Section num="9" title="Input Validation and Error Handling">
        <CodeBlock language="javascript" code={`// express-validator — schema-based validation
import { body, query, param, validationResult } from 'express-validator'

export const userValidation = {
  create: [
    body('name')
      .isString().trim()
      .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 chars'),
    body('email')
      .isEmail().normalizeEmail().withMessage('Invalid email'),
    body('password')
      .isLength({ min: 8 }).withMessage('Password min 8 chars')
      .matches(/[A-Z]/).withMessage('Password needs uppercase')
      .matches(/[0-9]/).withMessage('Password needs a number'),
    body('age')
      .optional()
      .isInt({ min: 0, max: 150 }).withMessage('Age must be 0-150'),
  ],
}

// Validation middleware
export function validate(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: 'Validation failed',
      details: errors.array().map(e => ({ field: e.path, message: e.msg })),
    })
  }
  next()
}

// Custom AppError class
export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message)
    this.statusCode = statusCode
    this.code = code
  }
}

// Global error handler (last app.use)
app.use((err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: { message: err.message, code: err.code } })
  }
  console.error('Unhandled error:', err)
  res.status(500).json({ error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } })
})`} />
      </Section>

      <Section num="10" title="Environment and Configuration">
        <CodeBlock language="javascript" code={`// npm install dotenv zod
import 'dotenv/config'
import { z } from 'zod'

// Validate env vars at startup — fail fast if config is wrong
const envSchema = z.object({
  NODE_ENV:    z.enum(['development', 'test', 'production']),
  PORT:        z.coerce.number().default(3000),
  DATABASE_URL:z.string().url(),
  JWT_SECRET:  z.string().min(32),
  REDIS_URL:   z.string().url().optional(),
  S3_BUCKET:   z.string().optional(),
  CLIENT_URL:  z.string().url().default('http://localhost:5173'),
})

const result = envSchema.safeParse(process.env)
if (!result.success) {
  console.error('Invalid environment variables:')
  console.error(result.error.flatten().fieldErrors)
  process.exit(1)
}

export const config = result.data

// .env (never commit this)
// NODE_ENV=development
// PORT=3000
// DATABASE_URL=mongodb://localhost:27017/myapp
// JWT_SECRET=super-secret-32-char-minimum-key-here
// REDIS_URL=redis://localhost:6379
// CLIENT_URL=http://localhost:5173`} />
      </Section>

      <Section num="11" title="API Documentation with OpenAPI">
        <CodeBlock language="javascript" code={`// npm install swagger-ui-express
import swaggerUi from 'swagger-ui-express'

const openApiSpec = {
  openapi: '3.0.0',
  info: { title: 'My API', version: '1.0' },
  components: {
    securitySchemes: { bearer: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
    schemas: {
      User: {
        type: 'object',
        required: ['name', 'email'],
        properties: {
          id:    { type: 'string' },
          name:  { type: 'string', minLength: 2 },
          email: { type: 'string', format: 'email' },
        },
      },
      Error: {
        type: 'object',
        properties: {
          error: { type: 'object', properties: { message: { type: 'string' } } },
        },
      },
    },
  },
  paths: {
    '/api/v1/users': {
      get: {
        summary: 'List users',
        security: [{ bearer: [] }],
        responses: {
          '200': { description: 'Success', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/User' } } } } },
          '401': { description: 'Unauthorized' },
        },
      },
    },
  },
}

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec))
// Visit: http://localhost:3000/docs`} />
      </Section>

      <Section num="12" title="Testing APIs">
        <CodeBlock language="javascript" code={`// npm install -D vitest supertest @faker-js/faker
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import supertest from 'supertest'
import app from '../app.js'

const api = supertest(app)
let token

beforeAll(async () => {
  // Register + login to get token
  await api.post('/auth/register').send({ name: 'Test', email: 'test@example.com', password: 'Password1' })
  const res = await api.post('/auth/login').send({ email: 'test@example.com', password: 'Password1' })
  token = res.body.token
})

describe('GET /api/v1/users', () => {
  it('returns 401 without token', async () => {
    const res = await api.get('/api/v1/users')
    expect(res.status).toBe(401)
  })

  it('returns users with valid token', async () => {
    const res = await api.get('/api/v1/users').set('Authorization', \`Bearer \${token}\`)
    expect(res.status).toBe(200)
    expect(res.body.data).toBeInstanceOf(Array)
  })
})

describe('POST /api/v1/users', () => {
  it('creates a user', async () => {
    const res = await api.post('/api/v1/users').send({
      name: 'Alice', email: 'alice@example.com', password: 'Password1'
    })
    expect(res.status).toBe(201)
    expect(res.body.data).toMatchObject({ name: 'Alice', email: 'alice@example.com' })
    expect(res.body.data.password).toBeUndefined()  // never expose password
  })

  it('rejects invalid email', async () => {
    const res = await api.post('/api/v1/users').send({ name: 'Bad', email: 'not-an-email', password: 'pass' })
    expect(res.status).toBe(422)
    expect(res.body.details[0].field).toBe('email')
  })
})`} />
      </Section>

      <Section num="13" title="Machine Learning Model Serving via API">
        <InfoBox>Train a model in Python, expose it via FastAPI, call it from any client. This is the standard pattern for production ML: model training is separate from model serving.</InfoBox>
        <CodeBlock language="python" code={`# ml_service/main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import numpy as np
import pickle
import os

app = FastAPI(title="ML Model API")

# ── Train and save model (run once) ─────────────────────────────────
# from sklearn.linear_model import LogisticRegression
# from sklearn.datasets import load_iris
# X, y = load_iris(return_X_y=True)
# model = LogisticRegression().fit(X, y)
# pickle.dump(model, open('model.pkl', 'wb'))

# ── Load model at startup ────────────────────────────────────────────
model = None

@app.on_event("startup")
async def load_model():
    global model
    with open("model.pkl", "rb") as f:
        model = pickle.load(f)
    print("Model loaded")

# ── Request / Response schemas ───────────────────────────────────────
class PredictRequest(BaseModel):
    features: list[list[float]]   # 2D array: [[f1,f2,f3,f4], ...]

class PredictResponse(BaseModel):
    predictions: list[int]
    probabilities: list[list[float]]
    model_version: str = "1.0"

# ── Prediction endpoint ──────────────────────────────────────────────
@app.post("/predict", response_model=PredictResponse)
async def predict(req: PredictRequest):
    if model is None:
        raise HTTPException(503, "Model not loaded")
    X = np.array(req.features)
    predictions = model.predict(X).tolist()
    probabilities = model.predict_proba(X).tolist()
    return PredictResponse(predictions=predictions, probabilities=probabilities)

@app.get("/health")
async def health():
    return {"status": "ok", "model_loaded": model is not None}

# Usage from any client:
# curl -X POST http://localhost:8000/predict \\
#   -H "Content-Type: application/json" \\
#   -d '{"features": [[5.1, 3.5, 1.4, 0.2]]}'`} />
      </Section>

      <Section num="14" title="Deployment Patterns">
        <CodeBlock language="dockerfile" code={`# Multi-stage Dockerfile for Node.js API
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:20-alpine AS runtime
WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
COPY --from=builder /app/node_modules ./node_modules
COPY . .
USER appuser
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:3000/health || exit 1
CMD ["node", "src/server.js"]`} />
        <CodeBlock language="yaml" code={`# docker-compose.yml for local development
version: '3.8'
services:
  api:
    build: .
    ports: ["3000:3000"]
    environment:
      - NODE_ENV=development
      - DATABASE_URL=mongodb://mongo:27017/myapp
      - JWT_SECRET=dev-secret-only
      - REDIS_URL=redis://redis:6379
    depends_on: [mongo, redis]
    volumes: ["./src:/app/src"]   # hot reload

  mongo:
    image: mongo:6
    volumes: ["mongo_data:/data/db"]
    ports: ["27017:27017"]

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]

volumes:
  mongo_data:`} />
      </Section>

      <Section num="15" title="Mini Project: Full-Stack Task Manager">
        <p>A complete task manager: Express API + MongoDB + JWT auth + React frontend. Users can create, complete, and delete their own tasks.</p>
        <Sub title="Backend — tasks API">
          <CodeBlock language="javascript" code={`// routes/tasks.js
import { Router } from 'express'
import { body, validationResult } from 'express-validator'
import { authMiddleware } from '../middleware/auth.js'
import Task from '../models/Task.js'

const router = Router()
router.use(authMiddleware)  // all task routes require auth

// Task model
// { title: String, done: Boolean, userId: ObjectId, createdAt: Date }

router.get('/', async (req, res) => {
  const tasks = await Task.find({ userId: req.user.sub }).sort('-createdAt')
  res.json({ data: tasks })
})

router.post('/',
  body('title').isString().trim().isLength({ min: 1, max: 200 }),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() })

    const task = await Task.create({ title: req.body.title, userId: req.user.sub })
    res.status(201).json({ data: task })
  }
)

router.patch('/:id/done', async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.sub },
    { done: true },
    { new: true }
  )
  if (!task) return res.status(404).json({ error: 'Not found' })
  res.json({ data: task })
})

router.delete('/:id', async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.sub })
  if (!task) return res.status(404).json({ error: 'Not found' })
  res.status(204).end()
})

export default router`} />
        </Sub>
        <Sub title="Frontend — React component">
          <CodeBlock language="javascript" code={`// src/TaskManager.jsx
import { useState } from 'react'
import { useApi, useMutation } from './hooks/useApi'

export default function TaskManager() {
  const [newTask, setNewTask] = useState('')
  const { data, loading, error, refetch } = useApi('/api/v1/tasks')
  const createMutation = useMutation('/api/v1/tasks')

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!newTask.trim()) return
    await createMutation.mutate({ title: newTask })
    setNewTask('')
    refetch()
  }

  const markDone = async (id) => {
    await fetch(\`/api/v1/tasks/\${id}/done\`, {
      method: 'PATCH',
      headers: { Authorization: \`Bearer \${localStorage.getItem('token')}\` },
    })
    refetch()
  }

  const deleteTask = async (id) => {
    await fetch(\`/api/v1/tasks/\${id}\`, {
      method: 'DELETE',
      headers: { Authorization: \`Bearer \${localStorage.getItem('token')}\` },
    })
    refetch()
  }

  if (loading) return <p>Loading tasks...</p>
  if (error)   return <p>Error: {error}</p>

  return (
    <div>
      <h1>My Tasks</h1>
      <form onSubmit={handleCreate}>
        <input
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          placeholder="New task..."
        />
        <button type="submit" disabled={createMutation.loading}>Add</button>
      </form>

      <ul>
        {data?.data.map(task => (
          <li key={task._id} style={{ textDecoration: task.done ? 'line-through' : 'none' }}>
            {task.title}
            {!task.done && <button onClick={() => markDone(task._id)}>Done</button>}
            <button onClick={() => deleteTask(task._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}`} />
        </Sub>
      </Section>
    </div>
  )
}
