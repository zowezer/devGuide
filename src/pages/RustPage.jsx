import CodeBlock from '../components/CodeBlock'
import CompareBlock from '../components/CompareBlock'
import Section, { Sub, InfoBox, WarnBox, TipBox, DangerBox } from '../components/Section'

const sections = [
  'Syntax and Program Structure',
  'Ownership and Borrowing',
  'Variables and Data Types',
  'Control Flow',
  'Functions and Closures',
  'Structs and Enums',
  'Traits — Rust Interfaces',
  'Error Handling',
  'Collections',
  'Iterators and Functional Programming',
  'Modules and Cargo',
  'Memory Model and Performance',
  'Concurrency',
  'Design Patterns in Rust',
  'Mini Project: CLI File Search',
]

export default function RustPage() {
  return (
    <div>
      <div className="page-hero">
        <div className="lang-icon">🦀</div>
        <div>
          <h1>Rust</h1>
          <p>
            Rust gives you the performance of C/C++ with memory safety guarantees — no garbage
            collector, no runtime, no null pointer crashes. Where Java uses a JVM and GC to manage
            memory, Rust uses an ownership system enforced at compile time. The compiler is strict,
            but once your code compiles, it is almost certainly correct.
          </p>
          <div className="badges">
            <span className="badge green">Memory Safe</span>
            <span className="badge">No GC</span>
            <span className="badge yellow">Systems Language</span>
            <span className="badge purple">Zero-Cost Abstractions</span>
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

      <Section num="1" title="Syntax and Program Structure">
        <CompareBlock
          javaLabel="Java"
          otherLabel="Rust"
          language="rust"
          javaCode={`public class Hello {
    public static void main(String[] args) {
        String name = "World";
        System.out.println("Hello, " + name + "!");
        for (int i = 0; i < 3; i++) {
            System.out.println(i);
        }
    }
}`}
          otherCode={`fn main() {
    let name = "World";
    println!("Hello, {}!", name);
    for i in 0..3 {
        println!("{}", i);
    }
}`}
        />
        <InfoBox>
          <code>println!</code> is a macro (the <code>!</code> is the tell). Macros in Rust are
          hygienic and checked at compile time — unlike C macros. No semicolon on the last
          expression in a block means that expression is the return value.
        </InfoBox>
        <Sub title="Cargo — the build tool">
          <CodeBlock language="bash" code={`cargo new my_project     # creates src/main.rs + Cargo.toml
cargo build              # compile (debug)
cargo build --release    # compile optimized
cargo run                # build + run
cargo test               # run tests
cargo doc --open         # generate + open docs
cargo add serde          # add a dependency (like npm install)`} />
        </Sub>
      </Section>

      <Section num="2" title="Ownership and Borrowing">
        <InfoBox>
          This is the core concept that makes Rust unique. Java has a GC that tracks references and
          frees memory automatically. Rust instead enforces three rules at compile time: (1) every
          value has one owner, (2) when the owner goes out of scope the value is dropped, (3) you
          can have either one mutable reference OR any number of immutable references — never both.
        </InfoBox>
        <Sub title="Ownership and Move">
          <CodeBlock language="rust" code={`fn main() {
    let s1 = String::from("hello");
    let s2 = s1;          // s1 is MOVED into s2
    // println!("{}", s1); // ERROR: s1 is no longer valid

    // Clone explicitly copies the heap data
    let s3 = s2.clone();
    println!("{} {}", s2, s3); // both valid

    // Primitives implement Copy — no move, always duplicated
    let x = 5;
    let y = x;
    println!("{} {}", x, y); // fine — i32 is Copy
}`} />
        </Sub>
        <Sub title="Borrowing — references">
          <CodeBlock language="rust" code={`fn print_len(s: &String) {  // &String = immutable borrow
    println!("Length: {}", s.len());
}   // s goes out of scope but does NOT drop the string

fn append(s: &mut String) {  // &mut String = mutable borrow
    s.push_str(" world");
}

fn main() {
    let mut owned = String::from("hello");

    print_len(&owned);      // immutable borrow
    append(&mut owned);     // mutable borrow
    println!("{}", owned);  // "hello world"

    // Cannot have multiple mutable borrows at same time
    let r1 = &mut owned;
    // let r2 = &mut owned; // ERROR: second mutable borrow
    println!("{}", r1);
}`} />
        </Sub>
        <Sub title="Lifetimes">
          <CodeBlock language="rust" code={`// Lifetime annotations tell the compiler how long references are valid
// Most of the time the compiler infers them (lifetime elision)
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}
// 'a means: the returned reference lives as long as the shorter input

fn main() {
    let s1 = String::from("long string");
    let result;
    {
        let s2 = String::from("xyz");
        result = longest(s1.as_str(), s2.as_str());
        println!("{}", result); // OK — both alive here
    }
    // println!("{}", result); // ERROR — s2 dropped, result dangling
}`} />
        </Sub>
      </Section>

      <Section num="3" title="Variables and Data Types">
        <CompareBlock
          javaLabel="Java"
          otherLabel="Rust"
          language="rust"
          javaCode={`// Java — all variables mutable by default
int x = 5;
x = 10;              // fine
final int y = 5;     // immutable

// Primitives
boolean b = true;
char c = 'a';
long l = 100L;
double d = 3.14;

// Integer overflow wraps silently (in release builds)`}
          otherCode={`// Rust — all variables immutable by default
let x = 5;
// x = 10;          // ERROR: cannot assign twice
let mut y = 5;      // explicitly mutable
y = 10;

// Primitives
let b: bool = true;
let c: char = 'a';   // 4-byte Unicode scalar
let l: i64 = 100;
let d: f64 = 3.14;
let u: u8 = 255;

// Integer overflow panics in debug, wraps in release`}
        />
        <Sub title="Type system">
          <CodeBlock language="rust" code={`// Scalar types
i8, i16, i32, i64, i128, isize   // signed integers
u8, u16, u32, u64, u128, usize   // unsigned integers
f32, f64                          // floats
bool                              // true / false
char                              // Unicode scalar (4 bytes)

// Compound types
let tup: (i32, f64, bool) = (500, 6.4, true);
let (a, b, c) = tup;             // destructure
println!("{}", tup.0);           // index access

let arr: [i32; 5] = [1, 2, 3, 4, 5];
let zeros = [0; 10];             // 10 zeros
println!("{}", arr[0]);

// Type inference — Rust infers most types
let x = 42;          // i32
let v = vec![1,2,3]; // Vec<i32>

// Constants
const MAX_POINTS: u32 = 100_000;  // type required
static GREETING: &str = "hello"; // static lifetime`} />
        </Sub>
      </Section>

      <Section num="4" title="Control Flow">
        <CompareBlock
          javaLabel="Java"
          otherLabel="Rust"
          language="rust"
          javaCode={`// if/else
int x = 5;
String msg = x > 3 ? "big" : "small";

// switch
switch (day) {
    case "Mon": case "Tue": break;
    default: break;
}

// for loop
for (int i = 0; i < 10; i++) { }
for (String s : list) { }`}
          otherCode={`// if is an expression in Rust
let x = 5;
let msg = if x > 3 { "big" } else { "small" };

// match — exhaustive pattern matching
match day {
    "Mon" | "Tue" | "Wed" | "Thu" | "Fri" => "weekday",
    "Sat" | "Sun" => "weekend",
    _ => "unknown",   // must cover all cases
};

// loops
for i in 0..10 { }         // exclusive range
for i in 0..=10 { }        // inclusive range
for s in &list { }         // iterate references
while condition { }
loop { break value; }      // loop returns a value`}
        />
        <Sub title="Pattern matching — Rust's superpower">
          <CodeBlock language="rust" code={`let num = 7;
let desc = match num {
    1       => "one",
    2 | 3   => "two or three",
    4..=6   => "four to six",
    n if n > 10 => "greater than ten",   // guard
    _       => "something else",
};

// Destructure in match
let point = (0, -2);
match point {
    (0, 0) => println!("origin"),
    (x, 0) | (0, x) => println!("on axis: {}", x),
    (x, y) => println!("({}, {})", x, y),
}

// if let — match one pattern, ignore rest
if let Some(val) = maybe_value {
    println!("Got {}", val);
}

// while let
while let Some(top) = stack.pop() {
    println!("{}", top);
}`} />
        </Sub>
      </Section>

      <Section num="5" title="Functions and Closures">
        <CompareBlock
          javaLabel="Java"
          otherLabel="Rust"
          language="rust"
          javaCode={`// Method
public int add(int a, int b) {
    return a + b;
}

// Lambda
Function<Integer,Integer> double = x -> x * 2;
BiFunction<Integer,Integer,Integer> add = (a,b) -> a+b;

// Higher-order
list.stream()
    .filter(x -> x > 0)
    .map(x -> x * 2)
    .collect(Collectors.toList());`}
          otherCode={`// Function — last expression is return value (no semicolon)
fn add(a: i32, b: i32) -> i32 {
    a + b     // no semicolon = return value
}

// Closure — captures environment
let double = |x: i32| x * 2;
let add = |a, b| a + b;

// Move closure — takes ownership
let msg = String::from("hi");
let say = move || println!("{}", msg);
say();   // msg was moved into closure

// Higher-order
let result: Vec<i32> = vec![1, -2, 3, -4]
    .into_iter()
    .filter(|&x| x > 0)
    .map(|x| x * 2)
    .collect();`}
        />
        <TipBox>Functions in Rust can return multiple values via tuples: <code>fn minmax(v: &[i32]) -&gt; (i32, i32)</code>. This is safer than Java's workaround of returning arrays or wrapper objects.</TipBox>
      </Section>

      <Section num="6" title="Structs and Enums">
        <CompareBlock
          javaLabel="Java"
          otherLabel="Rust"
          language="rust"
          javaCode={`public class Point {
    public final double x, y;
    public Point(double x, double y) {
        this.x = x; this.y = y;
    }
    public double distance() {
        return Math.sqrt(x*x + y*y);
    }
}

// Enums — only constant variants in Java
enum Direction { NORTH, SOUTH, EAST, WEST }`}
          otherCode={`struct Point {
    x: f64,
    y: f64,
}

impl Point {                 // impl block = methods
    fn new(x: f64, y: f64) -> Self {
        Point { x, y }       // shorthand when names match
    }
    fn distance(&self) -> f64 {
        (self.x * self.x + self.y * self.y).sqrt()
    }
}

// Enums can carry data — like sealed classes in Java 17+
enum Shape {
    Circle(f64),             // radius
    Rectangle(f64, f64),     // width, height
    Triangle { base: f64, height: f64 },
}

impl Shape {
    fn area(&self) -> f64 {
        match self {
            Shape::Circle(r)           => std::f64::consts::PI * r * r,
            Shape::Rectangle(w, h)    => w * h,
            Shape::Triangle { base, height } => 0.5 * base * height,
        }
    }
}`}
        />
        <Sub title="Option and Result enums">
          <CodeBlock language="rust" code={`// Option<T> replaces null — the compiler forces you to handle None
// enum Option<T> { Some(T), None }
fn find_user(id: u32) -> Option<String> {
    if id == 1 { Some(String::from("Alice")) } else { None }
}

let user = find_user(1);
println!("{}", user.unwrap());          // panics if None
println!("{}", user.unwrap_or("unknown".into())); // safe default
if let Some(name) = user { println!("{}", name); }

// Result<T,E> replaces checked exceptions
// enum Result<T,E> { Ok(T), Err(E) }
fn divide(a: f64, b: f64) -> Result<f64, String> {
    if b == 0.0 { Err("division by zero".into()) }
    else { Ok(a / b) }
}
let r = divide(10.0, 2.0).unwrap_or(0.0); // safe`} />
        </Sub>
      </Section>

      <Section num="7" title="Traits — Rust Interfaces">
        <InfoBox>Traits are like Java interfaces but more powerful — they can have default implementations, and you can implement a trait for a type you didn't write (orphan rules apply). Generics are bounded by traits, not class hierarchies.</InfoBox>
        <CompareBlock
          javaLabel="Java"
          otherLabel="Rust"
          language="rust"
          javaCode={`interface Printable {
    void print();
    default String label() { return "item"; }
}

class Dog implements Printable {
    String name;
    @Override
    public void print() {
        System.out.println("Dog: " + name);
    }
}

// Generics bounded by interface
<T extends Printable> void show(T item) {
    item.print();
}`}
          otherCode={`trait Printable {
    fn print(&self);
    fn label(&self) -> &str { "item" } // default impl
}

struct Dog { name: String }

impl Printable for Dog {
    fn print(&self) { println!("Dog: {}", self.name); }
}

// Implement a standard trait for your type
impl std::fmt::Display for Dog {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        write!(f, "Dog({})", self.name)
    }
}

// Generic bounded by trait
fn show<T: Printable>(item: &T) { item.print(); }

// Trait objects — dynamic dispatch (like Java polymorphism)
fn show_dynamic(item: &dyn Printable) { item.print(); }
let items: Vec<Box<dyn Printable>> = vec![Box::new(dog)];`}
        />
        <Sub title="Common standard traits">
          <CodeBlock language="rust" code={`// Derive macros auto-implement common traits
#[derive(Debug, Clone, PartialEq, Eq, Hash)]
struct Point { x: i32, y: i32 }

// Debug   — {:?} printing (like Java toString)
// Clone   — .clone() explicit deep copy
// PartialEq / Eq — == operator
// Hash    — usable as HashMap key
// Copy    — implicit copy instead of move (for small types)
// Default — Point::default() returns zeroed struct`} />
        </Sub>
      </Section>

      <Section num="8" title="Error Handling">
        <InfoBox>Java uses checked/unchecked exceptions. Rust uses <code>Result&lt;T,E&gt;</code> — errors are values, not thrown objects. The <code>?</code> operator is the idiomatic way to propagate errors up the call stack.</InfoBox>
        <CodeBlock language="rust" code={`use std::fs;
use std::num::ParseIntError;

// Custom error type
#[derive(Debug)]
enum AppError {
    Io(std::io::Error),
    Parse(ParseIntError),
    NotFound(String),
}

// Implement From<> for automatic conversion with ?
impl From<std::io::Error> for AppError {
    fn from(e: std::io::Error) -> Self { AppError::Io(e) }
}
impl From<ParseIntError> for AppError {
    fn from(e: ParseIntError) -> Self { AppError::Parse(e) }
}

// The ? operator: if Err, convert and return early
fn read_number(path: &str) -> Result<i32, AppError> {
    let content = fs::read_to_string(path)?;   // ? propagates io::Error
    let trimmed = content.trim();
    let n: i32 = trimmed.parse()?;             // ? propagates ParseIntError
    Ok(n)
}

fn main() {
    match read_number("num.txt") {
        Ok(n)  => println!("Number: {}", n),
        Err(e) => println!("Error: {:?}", e),
    }
}`} />
        <TipBox>For quick scripts, use <code>anyhow::Result</code> from the <code>anyhow</code> crate — it gives you <code>?</code> everywhere without defining custom error types. For libraries, prefer <code>thiserror</code>.</TipBox>
      </Section>

      <Section num="9" title="Collections">
        <CompareBlock
          javaLabel="Java"
          otherLabel="Rust"
          language="rust"
          javaCode={`List<Integer> list = new ArrayList<>(List.of(1,2,3));
list.add(4);
list.remove(0);
int first = list.get(0);

Map<String,Integer> map = new HashMap<>();
map.put("a", 1);
int v = map.getOrDefault("b", 0);

Set<String> set = new HashSet<>(Set.of("a","b"));`}
          otherCode={`// Vec<T> — growable array (like ArrayList)
let mut v: Vec<i32> = vec![1, 2, 3];
v.push(4);
v.remove(0);
let first = v[0];          // panics if out of bounds
let safe  = v.get(0);      // returns Option<&i32>

// HashMap<K,V>
use std::collections::HashMap;
let mut map: HashMap<String, i32> = HashMap::new();
map.insert("a".to_string(), 1);
let val = map.get("a");    // Option<&i32>
map.entry("b".to_string()).or_insert(0); // insert if missing

// HashSet<T>
use std::collections::HashSet;
let mut set: HashSet<&str> = HashSet::from(["a","b"]);
set.insert("c");
set.contains("a");`}
        />
        <Sub title="Other useful collections">
          <CodeBlock language="rust" code={`use std::collections::{VecDeque, BTreeMap, BinaryHeap};

// VecDeque — deque with fast push/pop at both ends
let mut dq: VecDeque<i32> = VecDeque::new();
dq.push_back(1);
dq.push_front(0);

// BTreeMap — sorted HashMap (like Java TreeMap)
let mut btm: BTreeMap<&str, i32> = BTreeMap::new();
btm.insert("b", 2); btm.insert("a", 1);
for (k,v) in &btm { println!("{}: {}", k, v); } // sorted

// BinaryHeap — max-heap priority queue
let mut heap: BinaryHeap<i32> = BinaryHeap::from([3,1,4,1,5]);
println!("{}", heap.pop()); // 5 (max)`} />
        </Sub>
      </Section>

      <Section num="10" title="Iterators and Functional Programming">
        <InfoBox>Rust iterators are lazy — nothing runs until you consume them with <code>collect()</code>, <code>for</code>, or a consuming adapter. This is more like Java Streams than Java collections, but zero-overhead.</InfoBox>
        <CodeBlock language="rust" code={`let numbers = vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Chain of lazy adapters — nothing runs until collect()
let result: Vec<i32> = numbers.iter()
    .filter(|&&x| x % 2 == 0)
    .map(|&x| x * x)
    .collect();
// [4, 16, 36, 64, 100]

// fold — like Java reduce
let sum = numbers.iter().fold(0, |acc, &x| acc + x);

// Useful iterators
numbers.iter().sum::<i32>()          // 55
numbers.iter().product::<i32>()      // 3628800
numbers.iter().min()                 // Some(&1)
numbers.iter().max()                 // Some(&10)
numbers.iter().count()               // 10
numbers.iter().enumerate()           // (index, &value) pairs
numbers.iter().zip(other.iter())     // (a, b) pairs
numbers.iter().take(3)               // first 3
numbers.iter().skip(2)               // skip first 2
numbers.iter().flat_map(|&x| vec![x, x*10])
numbers.iter().any(|&x| x > 5)      // bool
numbers.iter().all(|&x| x > 0)      // bool
numbers.iter().find(|&&x| x > 3)    // Option<&i32>
numbers.iter().position(|&x| x==5)  // Option<usize>

// Custom iterator
struct Counter { count: u32 }
impl Iterator for Counter {
    type Item = u32;
    fn next(&mut self) -> Option<u32> {
        if self.count < 5 { self.count += 1; Some(self.count) }
        else { None }
    }
}`} />
      </Section>

      <Section num="11" title="Modules and Cargo">
        <Sub title="Module system">
          <CodeBlock language="rust" code={`// src/main.rs
mod math;        // loads src/math.rs or src/math/mod.rs
mod utils {      // inline module
    pub fn helper() -> &'static str { "help" }
}

use math::add;           // bring into scope
use math::{add, sub};   // multiple items
use std::collections::HashMap;

fn main() {
    println!("{}", add(2, 3));
    println!("{}", utils::helper());
}

// src/math.rs
pub fn add(a: i32, b: i32) -> i32 { a + b }   // pub = public
pub fn sub(a: i32, b: i32) -> i32 { a - b }
fn internal() {}  // private by default (unlike Java)`} />
        </Sub>
        <Sub title="Cargo.toml — dependency management">
          <CodeBlock language="bash" code={`# Cargo.toml
[package]
name = "my_app"
version = "0.1.0"
edition = "2021"

[dependencies]
serde = { version = "1", features = ["derive"] }
serde_json = "1"
tokio = { version = "1", features = ["full"] }
anyhow = "1"
reqwest = { version = "0.11", features = ["json"] }

[dev-dependencies]
assert_eq = "1"      # test-only dependencies`} />
        </Sub>
      </Section>

      <Section num="12" title="Memory Model and Performance">
        <InfoBox>Java objects always live on the heap; the JVM GC decides when to free them. Rust values default to the stack and are freed deterministically when they go out of scope. Use <code>Box&lt;T&gt;</code> to explicitly heap-allocate.</InfoBox>
        <CodeBlock language="rust" code={`// Stack allocation — default, fast, fixed size
let x: i32 = 5;
let arr: [i32; 1000] = [0; 1000];  // 4KB on stack

// Box<T> — heap allocation (like Java new)
let boxed: Box<i32> = Box::new(5);
let big = Box::new([0u8; 1_000_000]);  // 1MB on heap, freed when dropped

// Rc<T> — reference-counted pointer (single-threaded)
use std::rc::Rc;
let a = Rc::new(String::from("shared"));
let b = Rc::clone(&a);     // b and a point to same data
println!("{}", Rc::strong_count(&a)); // 2

// Arc<T> — atomic reference count (thread-safe, like Java AtomicReference)
use std::sync::Arc;
let shared = Arc::new(vec![1,2,3]);

// Cow<'_, T> — clone on write (avoid copies when possible)
use std::borrow::Cow;
fn process(s: Cow<str>) -> Cow<str> {
    if s.contains("bad") { Cow::Owned(s.replace("bad","good")) }
    else { s }
}

// Zero-cost: str slices avoid allocation
fn greet(name: &str) {}   // takes a view — no allocation
greet("literal");         // &'static str
greet(&my_string);        // &String coerces to &str`} />
      </Section>

      <Section num="13" title="Concurrency">
        <InfoBox>Rust calls this "fearless concurrency" — the ownership system prevents data races at compile time. If your code compiles with threads, it won't have race conditions.</InfoBox>
        <Sub title="Threads and shared state">
          <CodeBlock language="rust" code={`use std::thread;
use std::sync::{Arc, Mutex};

fn main() {
    // Mutex<T> — like Java synchronized / ReentrantLock
    let counter = Arc::new(Mutex::new(0));

    let mut handles = vec![];
    for _ in 0..10 {
        let c = Arc::clone(&counter);
        let h = thread::spawn(move || {
            let mut num = c.lock().unwrap();   // acquire lock
            *num += 1;
        });                                    // lock released here
        handles.push(h);
    }
    for h in handles { h.join().unwrap(); }
    println!("Count: {}", *counter.lock().unwrap()); // 10
}`} />
        </Sub>
        <Sub title="Async / await with Tokio">
          <CodeBlock language="rust" code={`// Cargo.toml: tokio = { version="1", features=["full"] }
use tokio::time::{sleep, Duration};

#[tokio::main]
async fn main() {
    let results = tokio::join!(
        fetch("https://httpbin.org/get"),
        fetch("https://httpbin.org/ip"),
    );
    println!("{:?}", results);
}

async fn fetch(url: &str) -> String {
    sleep(Duration::from_millis(100)).await;
    format!("fetched {}", url)
}

// reqwest for HTTP (like Java HttpClient)
async fn get_json(url: &str) -> Result<serde_json::Value, reqwest::Error> {
    let resp = reqwest::get(url).await?.json().await?;
    Ok(resp)
}`} />
        </Sub>
      </Section>

      <Section num="14" title="Design Patterns in Rust">
        <div className="pattern-card">
          <div className="pattern-card-header">
            <span className="pattern-icon">🔒</span>
            <div>
              <div className="pattern-title">Singleton</div>
              <div className="pattern-desc">Global state via once_cell or lazy_static</div>
            </div>
          </div>
          <div className="pattern-card-body">
            <CodeBlock language="rust" code={`use once_cell::sync::Lazy;
use std::sync::Mutex;

static CONFIG: Lazy<Mutex<Config>> = Lazy::new(|| {
    Mutex::new(Config::load())
});

struct Config { debug: bool }
impl Config {
    fn load() -> Self { Config { debug: false } }
}`} />
          </div>
        </div>

        <div className="pattern-card">
          <div className="pattern-card-header">
            <span className="pattern-icon">🏭</span>
            <div>
              <div className="pattern-title">Builder</div>
              <div className="pattern-desc">Fluent builder via method chaining — very idiomatic in Rust</div>
            </div>
          </div>
          <div className="pattern-card-body">
            <CodeBlock language="rust" code={`struct Request {
    url: String,
    method: String,
    timeout: u64,
}

struct RequestBuilder { url: String, method: String, timeout: u64 }

impl RequestBuilder {
    fn new(url: &str) -> Self {
        RequestBuilder { url: url.into(), method: "GET".into(), timeout: 30 }
    }
    fn method(mut self, m: &str) -> Self { self.method = m.into(); self }
    fn timeout(mut self, t: u64) -> Self { self.timeout = t; self }
    fn build(self) -> Request {
        Request { url: self.url, method: self.method, timeout: self.timeout }
    }
}

let req = RequestBuilder::new("https://api.example.com")
    .method("POST")
    .timeout(60)
    .build();`} />
          </div>
        </div>

        <div className="pattern-card">
          <div className="pattern-card-header">
            <span className="pattern-icon">🎯</span>
            <div>
              <div className="pattern-title">Strategy</div>
              <div className="pattern-desc">Interchangeable algorithms via trait objects or generics</div>
            </div>
          </div>
          <div className="pattern-card-body">
            <CodeBlock language="rust" code={`trait Sorter { fn sort(&self, data: &mut Vec<i32>); }

struct BubbleSort;
struct QuickSort;

impl Sorter for BubbleSort {
    fn sort(&self, data: &mut Vec<i32>) { /* bubble sort */ }
}
impl Sorter for QuickSort {
    fn sort(&self, data: &mut Vec<i32>) { data.sort(); }
}

struct App { sorter: Box<dyn Sorter> }
impl App {
    fn run(&self, data: &mut Vec<i32>) { self.sorter.sort(data); }
}`} />
          </div>
        </div>

        <div className="pattern-card">
          <div className="pattern-card-header">
            <span className="pattern-icon">👁️</span>
            <div>
              <div className="pattern-title">Observer</div>
              <div className="pattern-desc">Event callbacks via closures or trait objects</div>
            </div>
          </div>
          <div className="pattern-card-body">
            <CodeBlock language="rust" code={`type Callback = Box<dyn Fn(&str)>;

struct EventEmitter { listeners: Vec<Callback> }
impl EventEmitter {
    fn on(&mut self, cb: impl Fn(&str) + 'static) {
        self.listeners.push(Box::new(cb));
    }
    fn emit(&self, event: &str) {
        for cb in &self.listeners { cb(event); }
    }
}

let mut emitter = EventEmitter { listeners: vec![] };
emitter.on(|e| println!("Listener 1: {}", e));
emitter.on(|e| println!("Listener 2: {}", e));
emitter.emit("click");`} />
          </div>
        </div>

        <div className="pattern-card">
          <div className="pattern-card-header">
            <span className="pattern-icon">🎁</span>
            <div>
              <div className="pattern-title">Decorator / Newtype</div>
              <div className="pattern-desc">Wrap a type to add behavior without inheritance</div>
            </div>
          </div>
          <div className="pattern-card-body">
            <CodeBlock language="rust" code={`struct Meters(f64);    // newtype wraps f64
struct Kilograms(f64);

impl Meters {
    fn to_feet(&self) -> f64 { self.0 * 3.28084 }
}

// Can't accidentally mix Meters and Kilograms
let height = Meters(1.8);
// let broken = height + Kilograms(70.0); // compile error!
println!("{} feet", height.to_feet());`} />
          </div>
        </div>

        <div className="pattern-card">
          <div className="pattern-card-header">
            <span className="pattern-icon">📦</span>
            <div>
              <div className="pattern-title">State Machine</div>
              <div className="pattern-desc">Type-safe state via enum variants — states encoded in the type system</div>
            </div>
          </div>
          <div className="pattern-card-body">
            <CodeBlock language="rust" code={`enum TrafficLight { Red, Yellow, Green }

impl TrafficLight {
    fn next(&self) -> TrafficLight {
        match self {
            TrafficLight::Red    => TrafficLight::Green,
            TrafficLight::Green  => TrafficLight::Yellow,
            TrafficLight::Yellow => TrafficLight::Red,
        }
    }
    fn duration_secs(&self) -> u32 {
        match self { TrafficLight::Red => 30, TrafficLight::Green => 25, TrafficLight::Yellow => 5 }
    }
}`} />
          </div>
        </div>

        <div className="pattern-card">
          <div className="pattern-card-header">
            <span className="pattern-icon">⚙️</span>
            <div>
              <div className="pattern-title">Command</div>
              <div className="pattern-desc">Encapsulate actions for undo/redo or queuing</div>
            </div>
          </div>
          <div className="pattern-card-body">
            <CodeBlock language="rust" code={`trait Command { fn execute(&self); fn undo(&self); }

struct SetValueCmd { old: i32, new: i32, target: *mut i32 }
impl Command for SetValueCmd {
    fn execute(&self) { unsafe { *self.target = self.new; } }
    fn undo(&self)    { unsafe { *self.target = self.old; } }
}

struct CommandHistory { history: Vec<Box<dyn Command>> }
impl CommandHistory {
    fn execute(&mut self, cmd: Box<dyn Command>) {
        cmd.execute();
        self.history.push(cmd);
    }
    fn undo(&mut self) {
        if let Some(cmd) = self.history.pop() { cmd.undo(); }
    }
}`} />
          </div>
        </div>

        <div className="pattern-card">
          <div className="pattern-card-header">
            <span className="pattern-icon">📋</span>
            <div>
              <div className="pattern-title">Template Method</div>
              <div className="pattern-desc">Define skeleton algorithm in a trait with default steps</div>
            </div>
          </div>
          <div className="pattern-card-body">
            <CodeBlock language="rust" code={`trait DataProcessor {
    fn read(&self) -> Vec<String>;
    fn process(&self, data: Vec<String>) -> Vec<String>;
    fn write(&self, data: Vec<String>);

    // Template method — calls the above steps
    fn run(&self) {
        let raw = self.read();
        let processed = self.process(raw);
        self.write(processed);
    }
}

struct CsvProcessor;
impl DataProcessor for CsvProcessor {
    fn read(&self) -> Vec<String> { vec!["a,b".into()] }
    fn process(&self, d: Vec<String>) -> Vec<String> { d }
    fn write(&self, d: Vec<String>) { println!("{:?}", d); }
}`} />
          </div>
        </div>
      </Section>

      <Section num="15" title="Mini Project: CLI File Search">
        <p>A minimal <code>grep</code>-like tool: recursively search files for a pattern, print matching lines with file and line number. Demonstrates file I/O, error handling, iterators, and Cargo.</p>
        <Sub title="Cargo.toml">
          <CodeBlock language="bash" code={`[package]
name = "rusty-grep"
version = "0.1.0"
edition = "2021"

[dependencies]
walkdir = "2"
regex   = "1"
anyhow  = "1"
clap    = { version = "4", features = ["derive"] }`} />
        </Sub>
        <Sub title="src/main.rs">
          <CodeBlock language="rust" code={`use anyhow::Result;
use clap::Parser;
use regex::Regex;
use std::fs;
use walkdir::WalkDir;

#[derive(Parser)]
#[command(about = "Recursive file search")]
struct Args {
    pattern: String,
    #[arg(default_value = ".")]
    path: String,
    #[arg(short, long)]
    ignore_case: bool,
}

fn main() -> Result<()> {
    let args = Args::parse();
    let pattern = if args.ignore_case {
        format!("(?i){}", args.pattern)
    } else {
        args.pattern.clone()
    };
    let re = Regex::new(&pattern)?;

    let mut match_count = 0usize;

    for entry in WalkDir::new(&args.path)
        .into_iter()
        .filter_map(|e| e.ok())
        .filter(|e| e.file_type().is_file())
    {
        let path = entry.path();
        let Ok(content) = fs::read_to_string(path) else { continue };

        for (line_no, line) in content.lines().enumerate() {
            if re.is_match(line) {
                println!("{}:{}: {}", path.display(), line_no + 1, line);
                match_count += 1;
            }
        }
    }

    println!("--- {} match(es) found ---", match_count);
    Ok(())
}

// Usage:
// cargo run -- "TODO" ./src
// cargo run -- "error" --ignore-case ./logs`} />
        </Sub>
      </Section>
    </div>
  )
}
