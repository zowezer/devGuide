import CodeBlock from '../components/CodeBlock'
import CompareBlock from '../components/CompareBlock'
import Section, { Sub, InfoBox, WarnBox, TipBox, DangerBox } from '../components/Section'

const sections = [
  'Syntax and Program Structure',
  'Variables and Data Types',
  'Control Flow',
  'Functions',
  'Pointers and Memory',
  'Structs and Enums',
  'Comptime — Compile-Time Programming',
  'Error Handling',
  'Slices and Arrays',
  'Allocators and Memory Management',
  'Modules and Build System',
  'Interoperability with C',
  'Concurrency and Async',
  'Design Patterns in Zig',
  'Mini Project: HTTP Request Parser',
]

export default function ZigPage() {
  return (
    <div>
      <div className="page-hero">
        <div className="lang-icon">⚡</div>
        <div>
          <h1>Zig</h1>
          <p>
            Zig is a modern systems language designed to replace C. Like C, it compiles to native
            code with no hidden control flow, no hidden allocations, and no garbage collector. Unlike
            C, it has proper error handling, comptime (compile-time code execution), and a safe
            optional type. From a Java background: think of Zig as what you'd write when you need
            direct hardware control and zero overhead — no JVM, no GC, no runtime.
          </p>
          <div className="badges">
            <span className="badge green">C Compatible</span>
            <span className="badge">No Hidden Allocations</span>
            <span className="badge yellow">Comptime</span>
            <span className="badge purple">No GC</span>
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
          otherLabel="Zig"
          language="zig"
          javaCode={`public class Hello {
    public static void main(String[] args) {
        String name = "World";
        System.out.println("Hello, " + name + "!");
        for (int i = 0; i < 3; i++) {
            System.out.println(i);
        }
    }
}`}
          otherCode={`const std = @import("std");

pub fn main() void {
    const name = "World";
    std.debug.print("Hello, {s}!\\n", .{name});
    var i: usize = 0;
    while (i < 3) : (i += 1) {
        std.debug.print("{}\\n", .{i});
    }
}`}
        />
        <InfoBox>
          <code>@import</code> is a built-in function (all built-ins start with <code>@</code>).
          The <code>.{`{name}`}</code> syntax passes a tuple of arguments to print. No classes — Zig
          is not object-oriented; it uses structs with methods instead.
        </InfoBox>
        <Sub title="Build and run">
          <CodeBlock language="bash" code={`zig init-exe          # create new executable project
zig build run         # build and run
zig build test        # run tests
zig build-exe main.zig  # direct compile
zig run main.zig      # compile and run without saving binary
zig version           # check version`} />
        </Sub>
      </Section>

      <Section num="2" title="Variables and Data Types">
        <CompareBlock
          javaLabel="Java"
          otherLabel="Zig"
          language="zig"
          javaCode={`// Java — all mutable by default, final for const
int x = 5;
final int MAX = 100;
long big = 9_999_999L;
double pi = 3.14159;
boolean flag = true;
char c = 'A';

// No unsigned integers in Java`}
          otherCode={`// Zig — const by default, var for mutable
const x: i32 = 5;
const MAX: u32 = 100;
var count: usize = 0;     // mutable
const big: i64 = 9_999_999;
const pi: f64 = 3.14159;
const flag: bool = true;
const c: u8 = 'A';

// Rich integer types
// i8 i16 i32 i64 i128 isize (signed)
// u8 u16 u32 u64 u128 usize (unsigned)
// f16 f32 f64 f80 f128 (floats)`}
        />
        <Sub title="Optional types — replacing null">
          <CodeBlock language="zig" code={`// ?T is an optional — either null or a value
const maybe: ?i32 = null;
const value: ?i32 = 42;

// Unwrap with if
if (value) |v| {
    std.debug.print("Got: {}\\n", .{v});
} else {
    std.debug.print("Nothing\\n", .{});
}

// Unwrap with orelse (default value, like Java Optional.orElse)
const safe = value orelse 0;

// Unwrap with .? (panics if null — use only when certain)
const certain = value.?;

// null coalescing with orelse and unreachable
const x = maybe orelse unreachable; // asserts non-null in debug`} />
        </Sub>
        <Sub title="Comptime literals and type inference">
          <CodeBlock language="zig" code={`// Type inference with _ placeholder
const auto = 42;         // comptime_int until assigned to typed variable
const auto_f = 3.14;     // comptime_float

// Explicit types
const n: i32 = 42;
const m: f64 = 3.14;

// undefined — explicitly uninitialized (read is safety-checked in debug)
var buf: [1024]u8 = undefined;

// anytype — generic function parameters resolved at comptime
fn double(x: anytype) @TypeOf(x) {
    return x * 2;
}
// double(5) -> 10 (i32)
// double(3.14) -> 6.28 (f64)`} />
        </Sub>
      </Section>

      <Section num="3" title="Control Flow">
        <CompareBlock
          javaLabel="Java"
          otherLabel="Zig"
          language="zig"
          javaCode={`// if
if (x > 0) { } else if (x < 0) { } else { }

// switch
switch (x) {
    case 1 -> "one";
    case 2, 3 -> "two or three";
    default -> "other";
}

// for
for (int i = 0; i < 10; i++) { }
for (String s : list) { }`}
          otherCode={`// if — can be an expression
const result = if (x > 0) "pos" else if (x < 0) "neg" else "zero";

// switch — exhaustive, no fallthrough
switch (x) {
    1    => std.debug.print("one\\n", .{}),
    2, 3 => std.debug.print("two or three\\n", .{}),
    else => std.debug.print("other\\n", .{}),
}

// for — over arrays/slices
for (array) |item| {
    std.debug.print("{}\\n", .{item});
}
// with index
for (array, 0..) |item, i| {
    std.debug.print("{}: {}\\n", .{i, item});
}

// while with continue expression
var i: usize = 0;
while (i < 10) : (i += 1) { }

// labeled break from nested loops
outer: for (matrix) |row| {
    for (row) |cell| {
        if (cell == 0) break :outer;
    }
}`}
        />
      </Section>

      <Section num="4" title="Functions">
        <CodeBlock language="zig" code={`// Basic function
fn add(a: i32, b: i32) i32 {
    return a + b;
}

// Multiple return values via struct
const MinMax = struct { min: i32, max: i32 };
fn minmax(a: i32, b: i32) MinMax {
    return if (a < b) .{ .min = a, .max = b }
           else       .{ .min = b, .max = a };
}
const result = minmax(3, 7);
// result.min == 3, result.max == 7

// Inline function — always inlined, no function call overhead
inline fn square(x: i32) i32 { return x * x; }

// Passing arrays by pointer (no implicit copying)
fn sumSlice(nums: []const i32) i32 {
    var total: i32 = 0;
    for (nums) |n| total += n;
    return total;
}
const arr = [_]i32{ 1, 2, 3, 4, 5 };
const s = sumSlice(&arr);   // pass slice of array

// Function pointers
const MathFn = *const fn (i32, i32) i32;
fn apply(f: MathFn, a: i32, b: i32) i32 { return f(a, b); }
const r = apply(&add, 2, 3);  // 5

// Recursive
fn fib(n: u32) u32 {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
}`} />
      </Section>

      <Section num="5" title="Pointers and Memory">
        <InfoBox>Zig makes pointers explicit and safe in debug mode. Unlike C, Zig checks for null pointer dereferences, out-of-bounds access, and use-after-free in debug/safe builds. In release-fast, checks are removed for performance.</InfoBox>
        <CompareBlock
          javaLabel="Java"
          otherLabel="Zig"
          language="zig"
          javaCode={`// Java — all objects are references (implicit pointers)
// No way to take address of a primitive
int x = 5;
// Can't do &x in Java

// Java references always point to heap objects
// GC manages lifetime automatically`}
          otherCode={`// Zig — explicit pointers, controlled lifetime
var x: i32 = 5;
const ptr: *i32 = &x;    // pointer to x
ptr.* = 10;               // dereference and assign
// x is now 10

// const pointer — can't modify through it
const cptr: *const i32 = &x;
// cptr.* = 20;  // compile error

// Optional pointer — can be null (use ?*T)
var maybe_ptr: ?*i32 = null;
maybe_ptr = &x;
if (maybe_ptr) |p| { p.* += 1; }

// Many-item pointer (like C pointer arithmetic)
var arr = [_]i32{ 1, 2, 3 };
const p: [*]i32 = &arr;
std.debug.print("{}\\n", .{p[0]});`}
        />
      </Section>

      <Section num="6" title="Structs and Enums">
        <CompareBlock
          javaLabel="Java"
          otherLabel="Zig"
          language="zig"
          javaCode={`public class Point {
    public int x, y;
    public Point(int x, int y) { this.x=x; this.y=y; }
    public double dist() {
        return Math.sqrt(x*x + y*y);
    }
}

enum Color { RED, GREEN, BLUE }
// Java enums can have data via constructors`}
          otherCode={`const Point = struct {
    x: f64,
    y: f64,

    // Methods — first param is self
    pub fn dist(self: Point) f64 {
        return @sqrt(self.x * self.x + self.y * self.y);
    }

    // "Constructor" convention
    pub fn init(x: f64, y: f64) Point {
        return .{ .x = x, .y = y };
    }
};

const p = Point.init(3, 4);
std.debug.print("{d}\\n", .{p.dist()}); // 5.0

// Enums
const Color = enum { red, green, blue };
const c = Color.red;

// Tagged unions — enum + data (like Rust enums / Java sealed classes)
const Value = union(enum) {
    integer: i64,
    float: f64,
    boolean: bool,
};
const v = Value{ .integer = 42 };
switch (v) {
    .integer => |n| std.debug.print("int: {}\\n", .{n}),
    .float   => |f| std.debug.print("float: {d}\\n", .{f}),
    .boolean => |b| std.debug.print("bool: {}\\n", .{b}),
}`}
        />
      </Section>

      <Section num="7" title="Comptime — Compile-Time Programming">
        <InfoBox>Comptime is Zig's most distinctive feature. Code marked <code>comptime</code> runs during compilation — you can compute values, branch on types, and generate specialized code. It replaces C preprocessor macros and Java generics with something more powerful and readable.</InfoBox>
        <CodeBlock language="zig" code={`// comptime parameters — generics without separate syntax
fn Stack(comptime T: type) type {
    return struct {
        items: []T,
        len: usize,

        pub fn push(self: *@This(), item: T) void {
            self.items[self.len] = item;
            self.len += 1;
        }
        pub fn pop(self: *@This()) ?T {
            if (self.len == 0) return null;
            self.len -= 1;
            return self.items[self.len];
        }
    };
}

// Instantiate at compile time — like Java generics but zero overhead
const IntStack = Stack(i32);
const FloatStack = Stack(f64);

// comptime values — computed at compile time
fn fibonacci(comptime n: u32) u32 {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}
const fib10 = fibonacci(10);  // computed at compile time: 55

// @TypeOf, @typeInfo — inspect types at comptime
fn printType(val: anytype) void {
    const T = @TypeOf(val);
    const info = @typeInfo(T);
    switch (info) {
        .Int  => std.debug.print("integer\\n", .{}),
        .Float=> std.debug.print("float\\n", .{}),
        .Struct => std.debug.print("struct\\n", .{}),
        else  => std.debug.print("other\\n", .{}),
    }
}

// Comptime string formatting
const MAX = 256;
const msg = std.fmt.comptimePrint("Max is {}", .{MAX}); // compile-time string`} />
      </Section>

      <Section num="8" title="Error Handling">
        <InfoBox>Zig uses error union types — a function can return either a value or an error from an error set. There are no exceptions. The <code>try</code> keyword propagates errors up (like Rust's <code>?</code> operator).</InfoBox>
        <CompareBlock
          javaLabel="Java"
          otherLabel="Zig"
          language="zig"
          javaCode={`// Java checked exceptions
public int readInt(String path)
    throws IOException, NumberFormatException {
    String content = Files.readString(Path.of(path));
    return Integer.parseInt(content.trim());
}

try {
    int n = readInt("num.txt");
} catch (IOException e) {
    System.err.println("IO error: " + e);
} catch (NumberFormatException e) {
    System.err.println("Parse error: " + e);
}`}
          otherCode={`// Zig error unions — !T means "T or error"
const FileError = error{ NotFound, PermissionDenied };
const ParseError = error{ InvalidNumber };
const AppError = FileError || ParseError;

fn readInt(path: []const u8) AppError!i32 {
    // try propagates error to caller — like Java throws
    const file = try std.fs.cwd().openFile(path, .{});
    defer file.close();
    var buf: [64]u8 = undefined;
    const n = try file.read(&buf);
    return std.fmt.parseInt(i32, buf[0..n], 10);
}

// Handle at call site
const result = readInt("num.txt") catch |err| switch (err) {
    error.NotFound        => { std.debug.print("not found\\n", .{}); return; },
    error.InvalidNumber   => { std.debug.print("bad number\\n", .{}); return; },
    else                  => return err,
};`}
        />
        <TipBox><code>defer</code> runs code when the scope exits — use it for cleanup like closing files. <code>errdefer</code> only runs on error — great for rolling back partial work.</TipBox>
      </Section>

      <Section num="9" title="Slices and Arrays">
        <CodeBlock language="zig" code={`// Fixed-size array — size is part of the type
const arr: [5]i32 = .{ 1, 2, 3, 4, 5 };
// [_] infers size
const arr2 = [_]i32{ 10, 20, 30 };
std.debug.print("len: {}\\n", .{arr2.len}); // 3

// Slice — pointer + length, not a copy
const slice: []const i32 = arr[1..4]; // [2, 3, 4]
const all: []const i32 = &arr;        // whole array as slice

// Mutable slice
var buf = [_]u8{0} ** 1024;          // 1024 zeros
const view: []u8 = buf[0..10];
view[0] = 'H';
view[1] = 'i';

// String — just []const u8 or []u8
const s: []const u8 = "hello";
std.debug.print("{s}\\n", .{s});

// Sentinel-terminated slice — for C interop
const cstr: [*:0]const u8 = "hello"; // null-terminated

// Multi-dimensional
const matrix: [3][3]i32 = .{
    .{ 1, 0, 0 },
    .{ 0, 1, 0 },
    .{ 0, 0, 1 },
};`} />
      </Section>

      <Section num="10" title="Allocators and Memory Management">
        <InfoBox>Every allocation in Zig is explicit — you pass an allocator to any function that needs to heap-allocate. There is no global allocator (unlike C's malloc). This makes it easy to swap allocators for testing, embedded use, or performance tuning.</InfoBox>
        <CodeBlock language="zig" code={`const std = @import("std");
const Allocator = std.mem.Allocator;

// Common allocators
// std.heap.page_allocator    — OS pages, fast but wastes memory
// std.heap.GeneralPurposeAllocator — debug allocator (leak detection)
// std.testing.allocator      — test allocator
// std.heap.ArenaAllocator    — free everything at once (great for request handling)
// std.heap.FixedBufferAllocator — allocate from a fixed stack buffer

pub fn main() !void {
    // GPA for development — detects leaks
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();   // reports leaks on exit
    const alloc = gpa.allocator();

    // Allocate
    const buf = try alloc.alloc(u8, 100);
    defer alloc.free(buf);    // always pair alloc with defer free

    // ArrayList — like Java ArrayList
    var list = std.ArrayList(i32).init(alloc);
    defer list.deinit();
    try list.append(1);
    try list.append(2);
    try list.append(3);

    // StringHashMap — like Java HashMap<String, V>
    var map = std.StringHashMap(i32).init(alloc);
    defer map.deinit();
    try map.put("key", 42);

    // Arena — bulk-free everything at once
    var arena = std.heap.ArenaAllocator.init(std.heap.page_allocator);
    defer arena.deinit();     // frees ALL arena allocations
    const a = arena.allocator();
    const s1 = try a.dupe(u8, "hello");
    const s2 = try a.dupe(u8, "world");
    _ = s1; _ = s2;           // freed all at once by arena.deinit()
}`} />
      </Section>

      <Section num="11" title="Modules and Build System">
        <Sub title="Imports">
          <CodeBlock language="zig" code={`// Import standard library modules
const std = @import("std");
const math = std.math;
const fs = std.fs;
const mem = std.mem;

// Import your own files
const utils = @import("utils.zig");

// Import a package from build.zig.zon
const json = @import("json");

// Declare a public function/struct in a module
// utils.zig:
pub fn greet(name: []const u8) void {
    std.debug.print("Hello, {s}!\\n", .{name});
}`} />
        </Sub>
        <Sub title="build.zig — Zig's build system">
          <CodeBlock language="zig" code={`// build.zig — replaces Makefile, CMake, etc.
const std = @import("std");

pub fn build(b: *std.Build) void {
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{});

    const exe = b.addExecutable(.{
        .name = "my_app",
        .root_source_file = .{ .path = "src/main.zig" },
        .target = target,
        .optimize = optimize,
    });
    b.installArtifact(exe);

    // Add run step
    const run_cmd = b.addRunArtifact(exe);
    const run_step = b.step("run", "Run the app");
    run_step.dependOn(&run_cmd.step);

    // Add test step
    const unit_tests = b.addTest(.{
        .root_source_file = .{ .path = "src/main.zig" },
    });
    const test_step = b.step("test", "Run tests");
    test_step.dependOn(&b.addRunArtifact(unit_tests).step);
}`} />
        </Sub>
      </Section>

      <Section num="12" title="Interoperability with C">
        <InfoBox>Zig can call C libraries directly without bindings — just <code>@cImport</code> the header. You can also use Zig as a C compiler (<code>zig cc</code>) and cross-compile C projects. This is Zig's killer feature for systems work.</InfoBox>
        <CodeBlock language="zig" code={`const c = @cImport({
    @cInclude("stdio.h");
    @cInclude("string.h");
    @cInclude("stdlib.h");
});

pub fn main() void {
    // Call C functions directly
    _ = c.printf("Hello from C: %d\\n", @as(c_int, 42));

    // Use C types
    const len = c.strlen("hello");
    std.debug.print("length: {}\\n", .{len});

    // Allocate with C malloc
    const buf: [*]u8 = @ptrCast(c.malloc(100) orelse unreachable);
    defer c.free(buf);
}

// Export a Zig function to be called from C
export fn zig_add(a: c_int, b: c_int) c_int {
    return a + b;
}

// Link a C library in build.zig
// exe.linkSystemLibrary("ssl");
// exe.linkLibC();

// Cross-compile to any target:
// zig build-exe main.zig -target aarch64-linux-musl
// zig build-exe main.zig -target x86_64-windows-gnu`} />
      </Section>

      <Section num="13" title="Concurrency and Async">
        <Sub title="Threads">
          <CodeBlock language="zig" code={`const std = @import("std");
const Thread = std.Thread;
const Mutex = std.Thread.Mutex;

var counter: u32 = 0;
var mutex = Mutex{};

fn increment(_: void) void {
    var i: u32 = 0;
    while (i < 1000) : (i += 1) {
        mutex.lock();
        defer mutex.unlock();
        counter += 1;
    }
}

pub fn main() !void {
    const t1 = try Thread.spawn(.{}, increment, .{{}});
    const t2 = try Thread.spawn(.{}, increment, .{{}});
    t1.join();
    t2.join();
    std.debug.print("counter: {}\\n", .{counter}); // 2000
}`} />
        </Sub>
        <Sub title="Async (stackless coroutines)">
          <CodeBlock language="zig" code={`// Zig async is stackless — async functions are state machines
// Requires an async framework (e.g. libxev, tigerbeetle's io_uring)
// Basic syntax:
async fn fetchData() []u8 {
    // suspend point — caller can resume later
    suspend {
        // schedule I/O, set callback to resume
    }
    return data;
}

// async/await
pub fn main() void {
    var frame = async fetchData();
    // do other work...
    const data = await frame;
    _ = data;
}`} />
        </Sub>
      </Section>

      <Section num="14" title="Design Patterns in Zig">
        <div className="pattern-card">
          <div className="pattern-card-header">
            <span className="pattern-icon">🔒</span>
            <div>
              <div className="pattern-title">Singleton</div>
              <div className="pattern-desc">Module-level state — the file is the singleton</div>
            </div>
          </div>
          <div className="pattern-card-body">
            <CodeBlock language="zig" code={`// config.zig — the file itself is the singleton
const std = @import("std");

var _debug: bool = false;
var _initialized: bool = false;

pub fn init(debug: bool) void {
    _debug = debug;
    _initialized = true;
}
pub fn isDebug() bool {
    std.debug.assert(_initialized);
    return _debug;
}`} />
          </div>
        </div>

        <div className="pattern-card">
          <div className="pattern-card-header">
            <span className="pattern-icon">🏭</span>
            <div>
              <div className="pattern-title">Builder</div>
              <div className="pattern-desc">Struct with init options using default field values</div>
            </div>
          </div>
          <div className="pattern-card-body">
            <CodeBlock language="zig" code={`const ServerConfig = struct {
    host: []const u8 = "0.0.0.0",
    port: u16 = 8080,
    max_connections: u32 = 1000,
    timeout_ms: u64 = 5000,
};

// "Builder" via struct literal with defaults
const cfg = ServerConfig{
    .port = 9090,
    .timeout_ms = 10_000,
    // host and max_connections use defaults
};`} />
          </div>
        </div>

        <div className="pattern-card">
          <div className="pattern-card-header">
            <span className="pattern-icon">🎯</span>
            <div>
              <div className="pattern-title">Strategy / vtable</div>
              <div className="pattern-desc">Runtime polymorphism via function pointers in a struct</div>
            </div>
          </div>
          <div className="pattern-card-body">
            <CodeBlock language="zig" code={`// Zig's idiomatic vtable pattern
const Allocator = struct {
    ptr: *anyopaque,
    vtable: *const VTable,

    const VTable = struct {
        alloc: *const fn(*anyopaque, usize) ?[*]u8,
        free:  *const fn(*anyopaque, [*]u8, usize) void,
    };

    pub fn alloc(self: @This(), n: usize) ?[*]u8 {
        return self.vtable.alloc(self.ptr, n);
    }
};`} />
          </div>
        </div>

        <div className="pattern-card">
          <div className="pattern-card-header">
            <span className="pattern-icon">🔁</span>
            <div>
              <div className="pattern-title">Iterator</div>
              <div className="pattern-desc">Struct with next() method — standard Zig iterator protocol</div>
            </div>
          </div>
          <div className="pattern-card-body">
            <CodeBlock language="zig" code={`const RangeIter = struct {
    current: i32,
    end: i32,

    pub fn next(self: *RangeIter) ?i32 {
        if (self.current >= self.end) return null;
        defer self.current += 1;
        return self.current;
    }
};

var iter = RangeIter{ .current = 0, .end = 5 };
while (iter.next()) |n| {
    std.debug.print("{}\\n", .{n}); // 0 1 2 3 4
}`} />
          </div>
        </div>

        <div className="pattern-card">
          <div className="pattern-card-header">
            <span className="pattern-icon">🔐</span>
            <div>
              <div className="pattern-title">Resource Guard (RAII via defer)</div>
              <div className="pattern-desc">Automatic cleanup using defer — replaces Java try-with-resources</div>
            </div>
          </div>
          <div className="pattern-card-body">
            <CodeBlock language="zig" code={`// defer guarantees cleanup at scope exit
pub fn processFile(path: []const u8) !void {
    const file = try std.fs.cwd().openFile(path, .{});
    defer file.close();        // always runs, even on error

    var alloc = std.heap.page_allocator;
    const buf = try alloc.alloc(u8, 4096);
    defer alloc.free(buf);     // always freed

    const n = try file.read(buf);
    std.debug.print("Read {} bytes\\n", .{n});
    // file.close() and alloc.free() both run here
}`} />
          </div>
        </div>

        <div className="pattern-card">
          <div className="pattern-card-header">
            <span className="pattern-icon">⚙️</span>
            <div>
              <div className="pattern-title">Comptime Generic Container</div>
              <div className="pattern-desc">Type-safe generic data structures at zero cost</div>
            </div>
          </div>
          <div className="pattern-card-body">
            <CodeBlock language="zig" code={`fn Queue(comptime T: type) type {
    return struct {
        items: std.ArrayList(T),

        pub fn init(alloc: std.mem.Allocator) @This() {
            return .{ .items = std.ArrayList(T).init(alloc) };
        }
        pub fn enqueue(self: *@This(), item: T) !void {
            try self.items.append(item);
        }
        pub fn dequeue(self: *@This()) ?T {
            if (self.items.items.len == 0) return null;
            return self.items.orderedRemove(0);
        }
        pub fn deinit(self: *@This()) void {
            self.items.deinit();
        }
    };
}`} />
          </div>
        </div>

        <div className="pattern-card">
          <div className="pattern-card-header">
            <span className="pattern-icon">🔖</span>
            <div>
              <div className="pattern-title">Tagged Union State Machine</div>
              <div className="pattern-desc">Exhaustive state transitions using tagged unions</div>
            </div>
          </div>
          <div className="pattern-card-body">
            <CodeBlock language="zig" code={`const ConnState = union(enum) {
    disconnected,
    connecting: struct { host: []const u8 },
    connected:  struct { host: []const u8, fd: i32 },
    error_state: []const u8,
};

fn connect(state: ConnState, host: []const u8) ConnState {
    return switch (state) {
        .disconnected => ConnState{ .connecting = .{ .host = host } },
        .connecting   => ConnState{ .connected = .{ .host = host, .fd = 5 } },
        else          => state,
    };
}`} />
          </div>
        </div>

        <div className="pattern-card">
          <div className="pattern-card-header">
            <span className="pattern-icon">🎭</span>
            <div>
              <div className="pattern-title">Comptime Mixin</div>
              <div className="pattern-desc">Add methods to structs via comptime — like Java default interface methods</div>
            </div>
          </div>
          <div className="pattern-card-body">
            <CodeBlock language="zig" code={`fn Comparable(comptime T: type) type {
    return struct {
        pub fn lessThan(a: T, b: T) bool {
            return a.compareTo(b) < 0;
        }
        pub fn greaterThan(a: T, b: T) bool {
            return a.compareTo(b) > 0;
        }
    };
}

const Score = struct {
    value: i32,
    pub usingnamespace Comparable(Score);
    pub fn compareTo(self: Score, other: Score) i32 {
        return self.value - other.value;
    }
};
const a = Score{ .value = 5 };
const b = Score{ .value = 3 };
std.debug.print("{}\\n", .{Score.greaterThan(a, b)}); // true`} />
          </div>
        </div>
      </Section>

      <Section num="15" title="Mini Project: HTTP Request Parser">
        <p>Parse raw HTTP/1.1 request bytes into a structured type — no dependencies, no allocations for the parsed data (uses slices into the original buffer).</p>
        <CodeBlock language="zig" code={`const std = @import("std");

const HttpMethod = enum { GET, POST, PUT, DELETE, HEAD, OPTIONS, PATCH };

const HttpRequest = struct {
    method:  HttpMethod,
    path:    []const u8,
    version: []const u8,
    headers: [32]Header,
    header_count: usize,
    body:    []const u8,

    const Header = struct { name: []const u8, value: []const u8 };
};

const ParseError = error{
    InvalidMethod,
    MissingPath,
    MalformedRequestLine,
    TooManyHeaders,
};

fn parseMethod(s: []const u8) ParseError!HttpMethod {
    if (std.mem.eql(u8, s, "GET"))     return .GET;
    if (std.mem.eql(u8, s, "POST"))    return .POST;
    if (std.mem.eql(u8, s, "PUT"))     return .PUT;
    if (std.mem.eql(u8, s, "DELETE"))  return .DELETE;
    if (std.mem.eql(u8, s, "HEAD"))    return .HEAD;
    if (std.mem.eql(u8, s, "OPTIONS")) return .OPTIONS;
    if (std.mem.eql(u8, s, "PATCH"))   return .PATCH;
    return ParseError.InvalidMethod;
}

fn parseRequest(raw: []const u8) ParseError!HttpRequest {
    var req: HttpRequest = undefined;
    req.header_count = 0;

    // Split on CRLF
    var lines = std.mem.splitSequence(u8, raw, "\\r\\n");

    // First line: METHOD /path HTTP/1.1
    const request_line = lines.next() orelse return ParseError.MalformedRequestLine;
    var parts = std.mem.splitScalar(u8, request_line, ' ');
    const method_str = parts.next() orelse return ParseError.MalformedRequestLine;
    req.method  = try parseMethod(method_str);
    req.path    = parts.next() orelse return ParseError.MissingPath;
    req.version = parts.next() orelse "HTTP/1.1";

    // Headers
    while (lines.next()) |line| {
        if (line.len == 0) break;  // blank line separates headers from body
        if (req.header_count >= 32) return ParseError.TooManyHeaders;

        const colon = std.mem.indexOf(u8, line, ": ") orelse continue;
        req.headers[req.header_count] = .{
            .name  = line[0..colon],
            .value = line[colon + 2..],
        };
        req.header_count += 1;
    }

    // Remaining is body
    req.body = lines.rest();
    return req;
}

pub fn main() !void {
    const raw =
        "POST /api/users HTTP/1.1\\r\\n" ++
        "Host: example.com\\r\\n" ++
        "Content-Type: application/json\\r\\n" ++
        "Content-Length: 27\\r\\n" ++
        "\\r\\n" ++
        "{\\"name\\":\\"Alice\\",\\"age\\":30}";

    const req = try parseRequest(raw);
    const stdout = std.io.getStdOut().writer();
    try stdout.print("Method:  {}\\n",  .{req.method});
    try stdout.print("Path:    {s}\\n", .{req.path});
    try stdout.print("Headers: {}\\n",  .{req.header_count});
    for (req.headers[0..req.header_count]) |h| {
        try stdout.print("  {s}: {s}\\n", .{h.name, h.value});
    }
    try stdout.print("Body:    {s}\\n", .{req.body});
}

// Output:
// Method:  HttpMethod.POST
// Path:    /api/users
// Headers: 3
//   Host: example.com
//   Content-Type: application/json
//   Content-Length: 27
// Body:    {"name":"Alice","age":30}`} />
      </Section>
    </div>
  )
}
