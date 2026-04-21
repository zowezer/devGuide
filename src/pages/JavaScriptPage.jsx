import CodeBlock from '../components/CodeBlock'
import CompareBlock from '../components/CompareBlock'
import Section, { Sub, InfoBox, WarnBox, TipBox, DangerBox } from '../components/Section'

export default function JavaScriptPage() {
  return (
    <div>
      <div className="page-hero">
        <div className="lang-icon">🟨</div>
        <div>
          <h1>JavaScript</h1>
          <p>The language of the web — dynamically typed, prototype-based, and event-driven. JavaScript runs in browsers and on the server (Node.js). Understanding its quirks is essential for any modern developer.</p>
          <div className="badges">
            <span className="badge">Dynamic Typing</span>
            <span className="badge yellow">Weakly Typed</span>
            <span className="badge green">Prototype-based OOP</span>
            <span className="badge purple">Event Loop</span>
          </div>
        </div>
      </div>

      <Section num="1" title="Syntax and Program Structure">
        <p>JavaScript syntax is C-like (curly braces, semicolons optional). It runs in a browser or Node.js runtime. Unlike Java, there is no <code>main()</code> — code runs top-to-bottom in the file, or is triggered by events.</p>
        <CodeBlock language="javascript" code={`// Variables: let (block-scoped), const (immutable binding), var (avoid)
let name = "Alice";
const PI = 3.14159;
var old = "avoid this";   // function-scoped, hoisted — source of bugs

// Template literals (like Python f-strings)
const greeting = \`Hello, \${name}! PI is \${PI.toFixed(2)}\`;

// Destructuring (powerful unpacking)
const [first, second, ...rest] = [1, 2, 3, 4, 5];
const { name: userName, age = 25 } = { name: "Bob", role: "admin" };

// Spread operator
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5];   // [1,2,3,4,5]
const obj1 = { a: 1 };
const obj2 = { ...obj1, b: 2 }; // { a:1, b:2 }`} />
      </Section>

      <Section num="2" title="Variables and Type System">
        <DangerBox><strong>JavaScript is weakly typed</strong> — it coerces types silently. This is the main difference from Python (also dynamic but strong). <code>"5" - 3 === 2</code> and <code>"5" + 3 === "53"</code>. Always use <code>===</code> (strict equality), never <code>==</code>.</DangerBox>
        <CodeBlock language="javascript" code={`// Primitive types
typeof 42          // "number"
typeof "hello"     // "string"
typeof true        // "boolean"
typeof undefined   // "undefined"
typeof null        // "object" — famous JS bug!
typeof {}          // "object"
typeof []          // "object" — arrays are objects!
typeof function(){}// "function"

// Type coercion gotchas
console.log(1 + "2")    // "12"  (number + string = string)
console.log("5" - 3)    // 2    (string - number coerces to number)
console.log([] + [])    // ""
console.log([] + {})    // "[object Object]"
console.log(false == 0) // true  (loose equality!)
console.log(false === 0)// false (strict equality)

// Always use === for comparisons
const x = "5";
if (x === 5) { /* never runs */ }
if (x == 5)  { /* runs! (coercion) */ }`} />
        <Sub title="TypeScript — JavaScript with Java-style Types">
          <TipBox>For large projects, use <strong>TypeScript</strong> — it adds static typing on top of JavaScript, giving you compile-time checks like Java without losing JS's flexibility.</TipBox>
          <CodeBlock language="typescript" code={`// TypeScript (compiles to JavaScript)
function greet(name: string, age: number): string {
  return \`Hello \${name}, you are \${age}\`;
}

interface User {
  id: number;
  name: string;
  email?: string;   // optional
}

type Status = "active" | "inactive" | "pending";  // union type`} />
        </Sub>
      </Section>

      <Section num="3" title="Control Flow">
        <CodeBlock language="javascript" code={`// if/else — same as Java
if (score >= 90) {
  grade = "A";
} else if (score >= 80) {
  grade = "B";
} else {
  grade = "C";
}

// Ternary
const label = isAdmin ? "Admin" : "User";

// Nullish coalescing (better than ||)
const name = user.name ?? "Anonymous";  // ?? only checks null/undefined
const name2 = user.name || "Anonymous"; // || checks any falsy value (0,"",false)

// Optional chaining
const city = user?.address?.city;        // undefined if any is null
const len  = user?.tags?.length ?? 0;

// switch
switch (command) {
  case "start": start(); break;
  case "stop":  stop();  break;
  default:      console.log("unknown");
}

// for loops
for (let i = 0; i < 10; i++) { }              // classic
for (const item of array) { }                  // iterate values (like Java for-each)
for (const key in object) { }                  // iterate object keys

// while
while (condition) { }
do { } while (condition);`} />
      </Section>

      <Section num="4" title="Functions">
        <Sub title="Function Declarations vs Arrow Functions">
          <CompareBlock
            javaLabel="Java"
            otherLabel="JavaScript"
            language="javascript"
            javaCode={`// Java method
public int add(int a, int b) {
    return a + b;
}

// Java lambda
Function<Integer, Integer> square = x -> x * x;
BiFunction<Integer, Integer, Integer> add = (a, b) -> a + b;`}
            otherCode={`// Function declaration (hoisted)
function add(a, b) { return a + b; }

// Function expression
const add2 = function(a, b) { return a + b; };

// Arrow function (preferred for callbacks)
const add3 = (a, b) => a + b;
const square = x => x * x;
const noop = () => {};

// Arrow functions capture 'this' from surrounding scope
// Regular functions have their own 'this' (common source of bugs)`}
          />
        </Sub>
        <Sub title="Default, Rest, and Spread Parameters">
          <CodeBlock language="javascript" code={`// Default parameters
function greet(name, greeting = "Hello") {
  return \`\${greeting}, \${name}!\`;
}

// Rest parameters (...args) — like Java varargs
function sum(...numbers) {
  return numbers.reduce((acc, n) => acc + n, 0);
}
sum(1, 2, 3, 4)   // 10

// Destructuring parameters
function createUser({ name, age = 18, role = "user" } = {}) {
  return { name, age, role };
}
createUser({ name: "Alice", age: 25 });

// Returning multiple values via object/array
function minMax(arr) {
  return { min: Math.min(...arr), max: Math.max(...arr) };
}
const { min, max } = minMax([3, 1, 4, 1, 5]);`} />
        </Sub>
      </Section>

      <Section num="5" title="Object-Oriented Programming">
        <Sub title="Classes (ES6+)">
          <p>JavaScript's <code>class</code> syntax is syntactic sugar over prototype-based inheritance. Under the hood, everything is still prototypes — but the API looks like Java.</p>
          <CodeBlock language="javascript" code={`class Animal {
  #name;        // private field (ES2022 — # prefix)
  #sound;

  constructor(name, sound) {
    this.#name = name;
    this.#sound = sound;
  }

  speak() {
    return \`\${this.#name} says \${this.#sound}\`;
  }

  get name() { return this.#name; }   // getter (like Java @property)
  set name(v) {
    if (!v) throw new Error("Name cannot be empty");
    this.#name = v;
  }

  static create(name, sound) {         // static factory
    return new Animal(name, sound);
  }

  toString() { return \`Animal(\${this.#name})\`; }
}

class Dog extends Animal {
  #breed;

  constructor(name, breed) {
    super(name, "Woof");    // must call super() first!
    this.#breed = breed;
  }

  speak() {
    return super.speak() + \`! (a \${this.#breed})\`;
  }
}

const dog = new Dog("Rex", "Husky");
console.log(dog.speak());   // Rex says Woof! (a Husky)`} />
        </Sub>
        <Sub title="Prototype Chain — What's Under the Hood">
          <InfoBox>Java uses class-based inheritance. JavaScript uses <strong>prototype chains</strong>. Each object has a hidden <code>__proto__</code> link to its prototype. When you access a property, JS walks the chain until it finds it or reaches <code>null</code>.</InfoBox>
          <CodeBlock language="javascript" code={`// Before ES6 classes existed:
function PersonProto(name, age) {
  this.name = name;
  this.age = age;
}
PersonProto.prototype.greet = function() {
  return \`Hi, I'm \${this.name}\`;
};

const p = new PersonProto("Alice", 30);
console.log(Object.getPrototypeOf(p) === PersonProto.prototype);  // true`} />
        </Sub>
        <Sub title="Mixins — Interface-like Composition">
          <CodeBlock language="javascript" code={`// JavaScript has no interfaces, use mixins for composition
const Serializable = (Base) => class extends Base {
  serialize() { return JSON.stringify(this); }
  static deserialize(json) { return Object.assign(new this(), JSON.parse(json)); }
};

const Validatable = (Base) => class extends Base {
  validate() {
    return Object.values(this).every(v => v !== null && v !== undefined);
  }
};

class User extends Validatable(Serializable(class {})) {
  constructor(name, email) {
    super();
    this.name = name;
    this.email = email;
  }
}

const u = new User("Alice", "alice@example.com");
console.log(u.serialize());   // JSON string
console.log(u.validate());    // true`} />
        </Sub>
      </Section>

      <Section num="6" title="Functional Programming">
        <Sub title="Array Methods — JavaScript's Streams">
          <p>JavaScript arrays have built-in higher-order methods that work like Java Streams, but eagerly (not lazy by default).</p>
          <CompareBlock
            javaLabel="Java Streams"
            otherLabel="JavaScript Array methods"
            language="javascript"
            javaCode={`List<Integer> nums = List.of(1,2,3,4,5,6);

// filter + map + collect
List<Integer> result = nums.stream()
    .filter(x -> x % 2 == 0)
    .map(x -> x * x)
    .collect(Collectors.toList());

int total = nums.stream()
    .reduce(0, Integer::sum);`}
            otherCode={`const nums = [1, 2, 3, 4, 5, 6];

// filter + map (each returns a new array)
const result = nums
  .filter(x => x % 2 === 0)
  .map(x => x * x);    // [4, 16, 36]

// reduce
const total = nums.reduce((acc, x) => acc + x, 0);  // 21

// find — returns first match (Java: findFirst())
const first = nums.find(x => x > 3);   // 4

// every / some (Java: allMatch / anyMatch)
nums.every(x => x > 0);  // true
nums.some(x => x > 5);   // true

// flatMap (Java: flatMap)
[[1,2],[3,4]].flatMap(x => x);  // [1,2,3,4]`}
          />
        </Sub>
        <Sub title="Closures and Module Pattern">
          <CodeBlock language="javascript" code={`// Closures power encapsulation in JS
function createCounter(initial = 0) {
  let count = initial;    // private via closure

  return {
    increment: (n = 1) => { count += n; return count; },
    decrement: (n = 1) => { count -= n; return count; },
    reset:     ()      => { count = initial; return count; },
    value:     ()      => count,
  };
}

const counter = createCounter(10);
counter.increment();    // 11
counter.increment(5);   // 16
counter.reset();        // 10`} />
        </Sub>
        <Sub title="Currying and Composition">
          <CodeBlock language="javascript" code={`// Currying — transform f(a,b,c) into f(a)(b)(c)
const curry = fn => {
  const arity = fn.length;
  return function curried(...args) {
    if (args.length >= arity) return fn(...args);
    return (...more) => curried(...args, ...more);
  };
};

const add = curry((a, b, c) => a + b + c);
const add5 = add(5);
const add5and3 = add5(3);
console.log(add5and3(2));   // 10

// Function composition
const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);
const pipe    = (...fns) => x => fns.reduce((v, f) => f(v), x);

const process = pipe(
  x => x * 2,
  x => x + 1,
  x => \`Result: \${x}\`
);
console.log(process(5));   // "Result: 11"`} />
        </Sub>
      </Section>

      <Section num="7" title="Error Handling and Null Safety">
        <CodeBlock language="javascript" code={`// Try/catch/finally — no checked exceptions (like Python)
try {
  const data = JSON.parse(invalidJson);
} catch (err) {
  if (err instanceof SyntaxError) {
    console.error("Bad JSON:", err.message);
  } else {
    throw err;    // re-throw unknown errors
  }
} finally {
  cleanup();
}

// Custom errors
class AppError extends Error {
  constructor(message, code) {
    super(message);
    this.name = "AppError";
    this.code = code;
  }
}

class NotFoundError extends AppError {
  constructor(resource, id) {
    super(\`\${resource} with id=\${id} not found\`, 404);
    this.name = "NotFoundError";
  }
}

// Optional chaining + nullish coalescing
const user = getUser();   // might be null/undefined
const city = user?.address?.city ?? "Unknown";
const len  = user?.tags?.length ?? 0;

// Null handling
const value = null;
console.log(value ?? "default");  // "default"
console.log(value || "default");  // "default" (also catches 0, "", false!)
console.log(value?.toString());   // undefined (no error)`} />
      </Section>

      <Section num="8" title="Collections: Map, Set, WeakMap">
        <CodeBlock language="javascript" code={`// Array — ordered, index-based
const arr = [1, 2, 3];
arr.push(4);
arr.unshift(0);   // prepend
arr.splice(2, 1); // remove 1 element at index 2
arr.slice(1, 3);  // new array [1,3)

// Object — key/value (string or Symbol keys)
const obj = { name: "Alice", age: 30 };
Object.keys(obj);    // ["name", "age"]
Object.values(obj);  // ["Alice", 30]
Object.entries(obj); // [["name","Alice"],["age",30]]

// Map — like Java HashMap (any key type, preserves order)
const map = new Map();
map.set("key", "value");
map.set({ id: 1 }, "object-key");   // objects as keys!
map.get("key");   // "value"
map.has("key");   // true
map.size;         // 2
for (const [k, v] of map) { console.log(k, v); }

// Set — like Java HashSet (unique values)
const set = new Set([1, 2, 2, 3]);  // {1,2,3}
set.add(4);
set.has(2);   // true
set.delete(2);

// WeakMap / WeakSet — keys are weakly held (no memory leak)
const cache = new WeakMap();   // good for DOM-related caching`} />
      </Section>

      <Section num="9" title="Async Programming — Promises and async/await">
        <p>JavaScript is single-threaded with an <strong>event loop</strong>. Async operations (network, filesystem) are non-blocking. Java's equivalent is CompletableFuture, but JS async/await is more ergonomic.</p>
        <Sub title="Promises">
          <CodeBlock language="javascript" code={`// Promise — wraps an async operation
const fetchUser = (id) => new Promise((resolve, reject) => {
  setTimeout(() => {
    if (id > 0) resolve({ id, name: "Alice" });
    else reject(new Error("Invalid ID"));
  }, 100);
});

// .then / .catch / .finally
fetchUser(1)
  .then(user => console.log(user))
  .catch(err => console.error(err))
  .finally(() => console.log("Done"));

// Promise.all — run in parallel (like Java CompletableFuture.allOf)
const [users, posts] = await Promise.all([
  fetchUsers(),
  fetchPosts()
]);

// Promise.allSettled — don't fail if one rejects
const results = await Promise.allSettled([p1, p2, p3]);
results.forEach(r => {
  if (r.status === "fulfilled") console.log(r.value);
  else console.error(r.reason);
});`} />
        </Sub>
        <Sub title="async / await">
          <CompareBlock
            javaLabel="Java CompletableFuture"
            otherLabel="JavaScript async/await"
            language="javascript"
            javaCode={`CompletableFuture<User> cf = fetchUserAsync(id)
    .thenCompose(user -> fetchPostsAsync(user.id))
    .exceptionally(ex -> {
        log.error("Failed", ex);
        return null;
    });`}
            otherCode={`async function loadUserData(userId) {
  try {
    const user = await fetchUser(userId);
    const posts = await fetchPosts(user.id);
    return { user, posts };
  } catch (err) {
    console.error("Failed:", err);
    return null;
  }
}

// Concurrent fetches
async function loadAll(ids) {
  const users = await Promise.all(ids.map(fetchUser));
  return users;
}`}
          />
        </Sub>
      </Section>

      <Section num="10" title="Modules (ES Modules)">
        <CodeBlock language="javascript" code={`// math.js — named exports
export const PI = 3.14159;
export function add(a, b) { return a + b; }
export function multiply(a, b) { return a * b; }

// user.js — default export
export default class User {
  constructor(name) { this.name = name; }
}

// main.js — imports
import User from './user.js';                    // default import
import { PI, add } from './math.js';             // named imports
import { add as mathAdd } from './math.js';      // alias
import * as math from './math.js';               // namespace import

// Dynamic import (lazy loading)
const module = await import('./heavy-module.js');`} />
      </Section>

      <Section num="11" title="Design Patterns in JavaScript">

        <div className="pattern-card">
          <div className="pattern-card-header">
            <span className="pattern-icon">🔒</span>
            <div><div className="pattern-title">Singleton</div></div>
          </div>
          <div className="pattern-card-body">
            <CodeBlock language="javascript" code={`// ES modules are singletons by design!
// config.js
const config = { env: "production", port: 3000 };
export default config;   // same object every time it's imported

// Class-based singleton
class Database {
  static #instance = null;
  #connection;

  static getInstance() {
    if (!Database.#instance) {
      Database.#instance = new Database();
    }
    return Database.#instance;
  }
}

const db1 = Database.getInstance();
const db2 = Database.getInstance();
console.log(db1 === db2);  // true`} />
          </div>
        </div>

        <div className="pattern-card">
          <div className="pattern-card-header">
            <span className="pattern-icon">📡</span>
            <div><div className="pattern-title">Observer (EventEmitter)</div></div>
          </div>
          <div className="pattern-card-body">
            <CodeBlock language="javascript" code={`class EventEmitter {
  #events = new Map();

  on(event, listener) {
    if (!this.#events.has(event)) this.#events.set(event, []);
    this.#events.get(event).push(listener);
    return () => this.off(event, listener);   // return unsubscribe fn
  }

  off(event, listener) {
    const listeners = this.#events.get(event) ?? [];
    this.#events.set(event, listeners.filter(l => l !== listener));
  }

  emit(event, ...args) {
    (this.#events.get(event) ?? []).forEach(l => l(...args));
  }
}

const emitter = new EventEmitter();
const unsub = emitter.on("data", (d) => console.log("Received:", d));
emitter.emit("data", { id: 1 });  // Received: {id:1}
unsub();                           // unsubscribe`} />
          </div>
        </div>

        <div className="pattern-card">
          <div className="pattern-card-header">
            <span className="pattern-icon">🎯</span>
            <div><div className="pattern-title">Strategy with Functions</div></div>
          </div>
          <div className="pattern-card-body">
            <CodeBlock language="javascript" code={`// Strategies as plain functions
const strategies = {
  bubble: (arr) => { /* ... */ return arr; },
  quick:  (arr) => [...arr].sort((a,b) => a-b),
  merge:  (arr) => { /* ... */ return arr; },
};

function sort(data, strategy = "quick") {
  const fn = strategies[strategy];
  if (!fn) throw new Error(\`Unknown strategy: \${strategy}\`);
  return fn(data);
}

sort([3,1,2], "quick");`} />
          </div>
        </div>
      </Section>

      <Section num="12" title="Idiomatic JavaScript">
        <CodeBlock language="javascript" code={`// ✅ Modern JS best practices

// Prefer const, use let only when reassigning, never var
const users = [];
let count = 0;

// Destructure immediately
const { name, age, ...rest } = user;
const [first, ...others] = array;

// Short-circuit evaluation
const log = debug && console.log.bind(console);

// Object shorthand
const x = 1, y = 2;
const point = { x, y };       // instead of { x: x, y: y }

// Computed property names
const key = "name";
const obj = { [key]: "Alice" };   // { name: "Alice" }

// Array from / keys / fill
Array.from({ length: 5 }, (_, i) => i * 2);  // [0,2,4,6,8]

// Immutable updates (React-friendly)
const newUser = { ...user, age: user.age + 1 };
const newArr  = [...arr, newItem];
const removed = arr.filter(x => x.id !== targetId);

// ❌ Avoid
var x = 1;              // use let/const
x == null;              // use x === null || x === undefined  OR  x == null (ok for both)
new Array(3).fill(0);   // ok but Array.from is clearer`} />
      </Section>

      <Section num="13" title="Mini Project: Todo API (Node.js)">
        <CodeBlock language="javascript" code={`// todo-api.js — simple in-memory REST API (Node.js built-in http)
import { createServer } from 'http';

class TodoStore {
  #todos = new Map();
  #nextId = 1;

  create(title) {
    const todo = { id: this.#nextId++, title, done: false };
    this.#todos.set(todo.id, todo);
    return todo;
  }

  getAll() { return [...this.#todos.values()]; }

  complete(id) {
    const todo = this.#todos.get(id);
    if (!todo) throw new Error(\`Todo \${id} not found\`);
    todo.done = true;
    return todo;
  }

  delete(id) { return this.#todos.delete(id); }
}

const store = new TodoStore();

const server = createServer(async (req, res) => {
  const send = (status, data) => {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  };

  try {
    if (req.method === 'GET' && req.url === '/todos') {
      send(200, store.getAll());
    } else if (req.method === 'POST' && req.url === '/todos') {
      let body = '';
      for await (const chunk of req) body += chunk;
      const { title } = JSON.parse(body);
      send(201, store.create(title));
    } else {
      send(404, { error: 'Not found' });
    }
  } catch (err) {
    send(500, { error: err.message });
  }
});

server.listen(3000, () => console.log('Listening on :3000'));`} />
      </Section>
    </div>
  )
}
