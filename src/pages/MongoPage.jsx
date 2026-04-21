import CodeBlock from '../components/CodeBlock'
import CompareBlock from '../components/CompareBlock'
import Section, { Sub, InfoBox, WarnBox, TipBox } from '../components/Section'

export default function MongoPage() {
  return (
    <div>
      <div className="page-hero">
        <div className="lang-icon">🍃</div>
        <div>
          <h1>MongoDB</h1>
          <p>A document-oriented NoSQL database. Instead of rows in tables, MongoDB stores JSON-like documents in collections. Think of a collection as a Java ArrayList of flexible-schema Maps, backed by a distributed storage engine.</p>
          <div className="badges">
            <span className="badge green">Document DB</span>
            <span className="badge">Schema-flexible</span>
            <span className="badge yellow">Horizontally Scalable</span>
            <span className="badge purple">JSON/BSON</span>
          </div>
        </div>
      </div>

      <Section num="1" title="Core Concepts: RDBMS vs MongoDB">
        <table>
          <thead><tr><th>SQL / Java JPA</th><th>MongoDB</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td>Database</td><td>Database</td><td>Same concept</td></tr>
            <tr><td>Table</td><td>Collection</td><td>Group of documents</td></tr>
            <tr><td>Row</td><td>Document</td><td>BSON (binary JSON) object</td></tr>
            <tr><td>Column</td><td>Field</td><td>Key in the document</td></tr>
            <tr><td>Primary Key</td><td>_id</td><td>Auto-generated ObjectId</td></tr>
            <tr><td>Foreign Key</td><td>Reference (manual)</td><td>Or embedded sub-document</td></tr>
            <tr><td>JOIN</td><td>$lookup</td><td>Or denormalize (embed)</td></tr>
            <tr><td>INDEX</td><td>Index</td><td>Same concept, more types</td></tr>
            <tr><td>Schema (fixed)</td><td>Optional JSON Schema validation</td><td>Flexible by default</td></tr>
          </tbody>
        </table>
        <InfoBox>MongoDB documents in the same collection don't need the same fields — one user might have an "address" field, another might not. This flexibility speeds up early development but requires application-level discipline.</InfoBox>
      </Section>

      <Section num="2" title="MongoDB Shell & CRUD">
        <Sub title="Insert">
          <CodeBlock language="javascript" code={`// MongoDB Shell (mongosh)
use myapp          // switch/create database

// insertOne
db.users.insertOne({
  name: "Alice",
  email: "alice@example.com",
  age: 30,
  roles: ["admin", "user"],       // arrays are native
  address: {                       // embedded document
    city: "Tel Aviv",
    country: "Israel"
  },
  createdAt: new Date()
})
// Returns: { acknowledged: true, insertedId: ObjectId("...") }

// insertMany
db.users.insertMany([
  { name: "Bob",   email: "bob@example.com",   age: 25 },
  { name: "Carol", email: "carol@example.com", age: 35 },
])`} />
        </Sub>
        <Sub title="Query — Find">
          <CodeBlock language="javascript" code={`// Find all
db.users.find()

// Find with filter (like WHERE)
db.users.find({ age: 30 })
db.users.find({ name: "Alice", age: 30 })   // AND

// Comparison operators
db.users.find({ age: { $gt: 25 } })         // age > 25
db.users.find({ age: { $gte: 18, $lt: 65 }})// 18 <= age < 65
db.users.find({ age: { $in: [25, 30, 35] }})// age IN (25,30,35)
db.users.find({ age: { $nin: [0, -1] }})    // NOT IN

// Logical operators
db.users.find({ $or: [{ age: { $lt: 18 } }, { age: { $gt: 65 } }] })
db.users.find({ $and: [{ age: { $gt: 20 } }, { roles: "admin" }] })
db.users.find({ age: { $not: { $gte: 30 } }})  // NOT

// Query on nested fields (dot notation)
db.users.find({ "address.city": "Tel Aviv" })

// Query on arrays
db.users.find({ roles: "admin" })           // array contains "admin"
db.users.find({ roles: { $all: ["admin", "user"] }})  // array has ALL

// Projection — like SELECT columns
db.users.find({}, { name: 1, email: 1, _id: 0 })  // 1=include, 0=exclude

// Sort, limit, skip
db.users.find().sort({ age: -1 }).limit(10).skip(20)   // page 3 of 10

// findOne — like LIMIT 1
db.users.findOne({ email: "alice@example.com" })`} />
        </Sub>
        <Sub title="Update">
          <CodeBlock language="javascript" code={`// updateOne — updates first matching document
db.users.updateOne(
  { email: "alice@example.com" },    // filter
  { $set: { age: 31, "address.city": "Haifa" } }  // update operator
)

// Update operators
db.users.updateOne({ _id: id }, {
  $set:    { name: "Alice B" },          // set specific fields
  $unset:  { temporaryField: "" },       // remove field
  $inc:    { loginCount: 1 },            // increment
  $push:   { roles: "moderator" },       // append to array
  $pull:   { roles: "admin" },           // remove from array
  $addToSet: { tags: "verified" },       // add to array if not present
})

// updateMany — update all matching
db.users.updateMany(
  { age: { $lt: 18 } },
  { $set: { isMinor: true } }
)

// findOneAndUpdate — get document back
const updated = db.users.findOneAndUpdate(
  { _id: id },
  { $inc: { balance: 100 } },
  { returnDocument: "after" }   // return updated document
)`} />
        </Sub>
        <Sub title="Delete">
          <CodeBlock language="javascript" code={`db.users.deleteOne({ _id: ObjectId("...") })
db.users.deleteMany({ active: false })

// Drop entire collection
db.users.drop()`} />
        </Sub>
      </Section>

      <Section num="3" title="Aggregation Pipeline">
        <p>The aggregation pipeline is MongoDB's SQL GROUP BY + JOINs + computed columns — on steroids. Each stage transforms the documents stream, like a Unix pipe or Java Stream pipeline.</p>
        <CodeBlock language="javascript" code={`// SQL equivalent:
// SELECT city, COUNT(*) as count, AVG(age) as avgAge
// FROM users WHERE age >= 18
// GROUP BY city HAVING count > 5
// ORDER BY count DESC

db.users.aggregate([
  // Stage 1: $match — like WHERE
  { $match: { age: { $gte: 18 } } },

  // Stage 2: $group — like GROUP BY
  {
    $group: {
      _id: "$address.city",            // group key
      count:  { $sum: 1 },            // COUNT(*)
      avgAge: { $avg: "$age" },       // AVG(age)
      users:  { $push: "$name" },     // collect names into array
    }
  },

  // Stage 3: $match again — like HAVING
  { $match: { count: { $gt: 5 } } },

  // Stage 4: $sort
  { $sort: { count: -1 } },

  // Stage 5: $project — shape the output
  {
    $project: {
      city: "$_id",
      count: 1,
      avgAge: { $round: ["$avgAge", 1] },
      _id: 0
    }
  },

  // Stage 6: $limit
  { $limit: 10 }
])

// $lookup — like LEFT JOIN
db.orders.aggregate([
  {
    $lookup: {
      from: "users",           // join with users collection
      localField: "userId",    // orders.userId
      foreignField: "_id",     // users._id
      as: "user"               // output field name
    }
  },
  { $unwind: "$user" },        // flatten the array (1-to-1 join)
  { $project: {
    orderDate: 1,
    total: 1,
    "user.name": 1,
    "user.email": 1
  }}
])`} />
      </Section>

      <Section num="4" title="Indexes — Performance Critical">
        <WarnBox>A MongoDB query without an index does a full collection scan — O(n). Always create indexes on fields you query frequently. Use <code>explain("executionStats")</code> to check if indexes are used.</WarnBox>
        <CodeBlock language="javascript" code={`// Single field index
db.users.createIndex({ email: 1 })         // 1=ascending, -1=descending
db.users.createIndex({ email: 1 }, { unique: true })  // enforce uniqueness

// Compound index (order matters!)
db.orders.createIndex({ userId: 1, createdAt: -1 })
// Supports queries on: userId, or userId + createdAt, NOT createdAt alone

// Text index (full-text search)
db.articles.createIndex({ title: "text", body: "text" })
db.articles.find({ $text: { $search: "mongodb performance" } })

// Geospatial index
db.places.createIndex({ location: "2dsphere" })
db.places.find({
  location: {
    $near: {
      $geometry: { type: "Point", coordinates: [34.78, 32.08] },
      $maxDistance: 5000  // 5km
    }
  }
})

// TTL index — auto-delete documents after N seconds
db.sessions.createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 })

// View index usage
db.users.find({ email: "alice@example.com" }).explain("executionStats")`} />
      </Section>

      <Section num="5" title="Schema Design: Embed vs Reference">
        <CompareBlock
          javaLabel="Relational (normalized)"
          otherLabel="MongoDB (embedded)"
          language="javascript"
          javaCode={`-- Users table
CREATE TABLE users (id, name, email);
-- Addresses table (normalized)
CREATE TABLE addresses (
  id, user_id FK, city, country
);
-- Query requires JOIN:
SELECT u.name, a.city
FROM users u JOIN addresses a ON u.id = a.user_id`}
          otherCode={`// Embedded document — no JOIN needed!
// Best when address is always accessed with user
{
  "_id": ObjectId("..."),
  "name": "Alice",
  "email": "alice@example.com",
  "address": {           // embedded
    "city": "Tel Aviv",
    "country": "Israel"
  }
}

// Retrieve in one query:
db.users.findOne({ _id: id })`}
        />
        <TipBox>Rule of thumb: <strong>Embed</strong> when you always access the data together and the sub-document doesn't change independently. <strong>Reference</strong> when the data is large, frequently updated, or shared across many documents.</TipBox>
      </Section>

      <Section num="6" title="Node.js Driver + Mongoose">
        <Sub title="Native Driver">
          <CodeBlock language="javascript" code={`import { MongoClient, ObjectId } from 'mongodb';

const client = new MongoClient('mongodb://localhost:27017');
await client.connect();
const db = client.db('myapp');
const users = db.collection('users');

// CRUD
const result = await users.insertOne({ name: "Alice", age: 30 });
const user   = await users.findOne({ _id: result.insertedId });
const all    = await users.find({ age: { $gte: 18 } }).toArray();
await users.updateOne({ _id: result.insertedId }, { $set: { age: 31 } });
await users.deleteOne({ _id: result.insertedId });

// Transaction (requires replica set)
const session = client.startSession();
try {
  await session.withTransaction(async () => {
    await accounts.updateOne({ _id: from }, { $inc: { balance: -amount } }, { session });
    await accounts.updateOne({ _id: to   }, { $inc: { balance:  amount } }, { session });
  });
} finally {
  await session.endSession();
}`} />
        </Sub>
        <Sub title="Mongoose — ODM (like JPA for MongoDB)">
          <CodeBlock language="javascript" code={`import mongoose from 'mongoose';
const { Schema, model } = mongoose;

// Define schema (like JPA @Entity)
const userSchema = new Schema({
  name:  { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  age:   { type: Number, min: 0, max: 150 },
  roles: { type: [String], default: ["user"] },
  createdAt: { type: Date, default: Date.now },
});

// Instance method (like non-static Java method)
userSchema.methods.isAdmin = function() {
  return this.roles.includes("admin");
};

// Static method (like Java static method)
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Virtual property (not stored in DB)
userSchema.virtual("displayName").get(function() {
  return \`\${this.name} <\${this.email}>\`;
});

// Pre-save hook (like JPA @PrePersist)
userSchema.pre("save", async function(next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = model("User", userSchema);

// CRUD with Mongoose
const user = await User.create({ name: "Alice", email: "alice@example.com" });
const found = await User.findById(user._id);
const admins = await User.find({ roles: "admin" }).sort({ name: 1 }).limit(10);
await User.findByIdAndUpdate(user._id, { $set: { age: 31 } }, { new: true });
await User.findByIdAndDelete(user._id);`} />
        </Sub>
      </Section>

      <Section num="7" title="Mini Project: User API with Express + Mongoose">
        <CodeBlock language="javascript" code={`import express from 'express';
import mongoose from 'mongoose';

const app = express();
app.use(express.json());

await mongoose.connect('mongodb://localhost:27017/demo');

const User = mongoose.model('User', new mongoose.Schema({
  name:  { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age:   Number,
}));

// GET /users?page=1&limit=10
app.get('/users', async (req, res) => {
  const page  = parseInt(req.query.page)  || 1;
  const limit = parseInt(req.query.limit) || 10;
  const users = await User.find()
    .sort({ name: 1 })
    .skip((page - 1) * limit)
    .limit(limit);
  const total = await User.countDocuments();
  res.json({ users, total, page, pages: Math.ceil(total / limit) });
});

// GET /users/:id
app.get('/users/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: "Not found" });
  res.json(user);
});

// POST /users
app.post('/users', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: "Email exists" });
    res.status(400).json({ error: err.message });
  }
});

// PATCH /users/:id
app.patch('/users/:id', async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!user) return res.status(404).json({ error: "Not found" });
  res.json(user);
});

// DELETE /users/:id
app.delete('/users/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

app.listen(3000, () => console.log("API running on :3000"));`} />
      </Section>
    </div>
  )
}
