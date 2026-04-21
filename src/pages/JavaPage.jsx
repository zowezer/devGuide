import CodeBlock from '../components/CodeBlock'
import Section, { Sub, InfoBox, WarnBox, TipBox, DangerBox } from '../components/Section'

export default function JavaPage() {
  return (
    <div>
      <div className="page-hero">
        <div className="lang-icon">☕</div>
        <div>
          <h1>Java — Deep Reference</h1>
          <p>The baseline language for this entire guide. Java is statically typed, class-based, and runs on the JVM. This page covers Java deeply — not the beginner version, but the modern Java (17–21+) that experienced developers use: records, sealed classes, pattern matching, virtual threads, and the full design-pattern toolkit.</p>
          <div className="badges">
            <span className="badge">Static + Strong Typing</span>
            <span className="badge green">JIT Compiled (JVM)</span>
            <span className="badge yellow">Checked + Unchecked Exceptions</span>
            <span className="badge purple">Modern Java 17–21</span>
          </div>
        </div>
      </div>

      <div className="toc">
        <div className="toc-title">Contents</div>
        <ul>
          {[
            'Syntax & Structure','Type System','Control Flow','Functions & Methods',
            'OOP Deep Dive','Generics','Functional Programming','Error Handling',
            'Collections','Streams & Iteration','Modules & Packages','JVM & Memory',
            'Concurrency','Design Patterns','Modern Java 17–21','Spring Boot Primer',
            'Mini Project'
          ].map((t, i) => (
            <li key={t}><a href={`#s${i + 1}`}>{i + 1}. {t}</a></li>
          ))}
        </ul>
      </div>

      {/* ── 1. Syntax ── */}
      <Section num="1" title="Syntax and Program Structure">
        <p>Every Java program lives inside a class. The entry point is always <code>public static void main(String[] args)</code>. Java 21 introduces <strong>unnamed classes</strong> and <strong>instance main methods</strong> (preview) for scripts — but production code still follows the class structure.</p>
        <CodeBlock language="java" code={`// Classic structure
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}

// Java 21 preview — simplified launcher
void main() {                        // no class wrapper needed (preview)
    System.out.println("Hello!");
}

// Text blocks (Java 15+)
String json = """
        {
          "name": "Alice",
          "age": 30
        }
        """;

// String templates (Java 21 preview)
String name = "Alice";
int age = 30;
String msg = STR."Hello \{name}, age \{age}";  // Java 21

// Older style — still common:
String msg2 = "Hello %s, age %d".formatted(name, age);  // Java 15+
String msg3 = String.format("Hello %s, age %d", name, age);`} />
        <Sub title="Access Modifiers">
          <table>
            <thead><tr><th>Modifier</th><th>Class</th><th>Package</th><th>Subclass</th><th>World</th></tr></thead>
            <tbody>
              <tr><td><code>public</code></td><td>✓</td><td>✓</td><td>✓</td><td>✓</td></tr>
              <tr><td><code>protected</code></td><td>✓</td><td>✓</td><td>✓</td><td>✗</td></tr>
              <tr><td><em>(package-private)</em></td><td>✓</td><td>✓</td><td>✗</td><td>✗</td></tr>
              <tr><td><code>private</code></td><td>✓</td><td>✗</td><td>✗</td><td>✗</td></tr>
            </tbody>
          </table>
        </Sub>
      </Section>

      {/* ── 2. Type System ── */}
      <Section num="2" title="Type System — Static and Strong">
        <p>Java is <strong>statically typed</strong> (types resolved at compile time) and <strong>strongly typed</strong> (no silent coercion). The type system has two tiers: <em>primitives</em> (int, double, boolean…) and <em>reference types</em> (objects). Java's generics use <em>type erasure</em> — generic type info is removed at runtime.</p>
        <CodeBlock language="java" code={`// Primitives — stored by value on the stack
byte    b = 127;
short   s = 32767;
int     i = 2_147_483_647;        // underscores for readability
long    l = 9_223_372_036_854_775_807L;
float   f = 3.14f;
double  d = 3.141592653589793;
char    c = 'A';                   // UTF-16 code unit
boolean flag = true;

// Wrapper types — allow primitives in collections
Integer wrapped = Integer.valueOf(42);
Integer autoBoxed = 42;           // auto-boxing (implicit valueOf)
int unboxed = wrapped;            // auto-unboxing (implicit intValue())

// Widening and narrowing
int x = 1_000;
long y = x;                       // widening — automatic
int z = (int) y;                  // narrowing — explicit cast required

// var — local variable type inference (Java 10+)
var list = new ArrayList<String>();   // inferred: ArrayList<String>
var map  = new HashMap<String, Integer>();
// var is only for local variables — not fields, params, or return types

// Records (Java 16+) — immutable data carriers
record Point(double x, double y) {
    // auto-generates: constructor, getters, equals, hashCode, toString
    double distance() {
        return Math.sqrt(x * x + y * y);
    }
}
var p = new Point(3.0, 4.0);
System.out.println(p.x());          // 3.0
System.out.println(p.distance());   // 5.0
System.out.println(p);              // Point[x=3.0, y=4.0]`} />
        <Sub title="Sealed Classes (Java 17+)">
          <CodeBlock language="java" code={`// Sealed classes — restrict which classes can extend this
public sealed interface Shape permits Circle, Rectangle, Triangle {}

public record Circle(double radius) implements Shape {}
public record Rectangle(double w, double h) implements Shape {}
public record Triangle(double base, double height) implements Shape {}

// Now exhaustive pattern matching is possible:
double area(Shape shape) {
    return switch (shape) {
        case Circle c    -> Math.PI * c.radius() * c.radius();
        case Rectangle r -> r.w() * r.h();
        case Triangle t  -> 0.5 * t.base() * t.height();
        // No default needed — compiler knows all subtypes!
    };
}`} />
        </Sub>
      </Section>

      {/* ── 3. Control Flow ── */}
      <Section num="3" title="Control Flow">
        <Sub title="Pattern Matching in switch (Java 21)">
          <p>Java 21 delivers the most expressive <code>switch</code> in the language's history — combining type checks, destructuring, and guards in a single construct.</p>
          <CodeBlock language="java" code={`// Pattern matching switch — replaces instanceof + cast chains
Object obj = "hello";
String result = switch (obj) {
    case Integer i  -> "int: " + i;
    case String  s  -> "string: " + s.toUpperCase();
    case int[]   arr-> "int array, len=" + arr.length;
    case null       -> "null";
    default         -> "other: " + obj;
};

// Guarded patterns (when clause)
Object value = 42;
String label = switch (value) {
    case Integer i when i < 0    -> "negative";
    case Integer i when i == 0   -> "zero";
    case Integer i when i > 100  -> "large";
    case Integer i               -> "normal: " + i;
    default                      -> "not a number";
};

// switch with sealed classes — exhaustive, no default needed
Shape s = new Circle(5.0);
double area = switch (s) {
    case Circle c    -> Math.PI * c.radius() * c.radius();
    case Rectangle r -> r.w() * r.h();
    case Triangle t  -> 0.5 * t.base() * t.height();
};`} />
        </Sub>
        <Sub title="Loops">
          <CodeBlock language="java" code={`// Classic for
for (int i = 0; i < 10; i++) { }

// Enhanced for-each
List<String> names = List.of("Alice", "Bob", "Carol");
for (String name : names) {
    System.out.println(name);
}

// while / do-while
int n = 0;
while (n < 10) n++;
do { n--; } while (n > 0);

// Labeled break/continue (rarely needed, but exists)
outer:
for (int i = 0; i < 5; i++) {
    for (int j = 0; j < 5; j++) {
        if (j == 2) continue outer;   // skip rest of inner loop
        if (i == 3) break outer;      // exit both loops
    }
}`} />
        </Sub>
      </Section>

      {/* ── 4. Methods ── */}
      <Section num="4" title="Functions and Methods">
        <CodeBlock language="java" code={`public class MathUtils {

    // Instance method
    public int add(int a, int b) {
        return a + b;
    }

    // Static method
    public static double circleArea(double radius) {
        return Math.PI * radius * radius;
    }

    // Varargs (variable arguments)
    public static int sum(int... numbers) {
        int total = 0;
        for (int n : numbers) total += n;
        return total;
    }
    // sum(1, 2, 3) or sum(new int[]{1, 2, 3})

    // Method overloading — same name, different signatures
    public static String format(int n)    { return String.valueOf(n); }
    public static String format(double d) { return "%.2f".formatted(d); }
    public static String format(Object o) { return o == null ? "null" : o.toString(); }

    // Generic method
    public static <T extends Comparable<T>> T max(T a, T b) {
        return a.compareTo(b) >= 0 ? a : b;
    }
    // max(3, 5) → 5    max("apple", "banana") → "banana"
}`} />
        <Sub title="First-Class Functions via Functional Interfaces">
          <CodeBlock language="java" code={`import java.util.function.*;

// Java represents functions as functional interfaces
Function<String, Integer>  len    = String::length;         // method reference
Function<Integer, Integer> square = x -> x * x;             // lambda
BiFunction<Integer, Integer, Integer> add = Integer::sum;

// Predicate — boolean-valued function
Predicate<String> isEmpty   = String::isEmpty;
Predicate<String> isLong    = s -> s.length() > 10;
Predicate<String> combined  = isEmpty.or(isLong);   // compose predicates

// Consumer — void function
Consumer<String> printer = System.out::println;
Consumer<String> logger  = s -> System.err.println("[LOG] " + s);
Consumer<String> both    = printer.andThen(logger); // chain consumers

// Supplier — no-arg factory
Supplier<List<String>> listFactory = ArrayList::new;
List<String> freshList = listFactory.get();

// UnaryOperator / BinaryOperator — specializations
UnaryOperator<String> trim    = String::trim;
BinaryOperator<Integer> max2  = Integer::max;

// Passing functions as arguments
List<Integer> nums = List.of(1, 2, 3, 4, 5);
nums.stream()
    .filter(x -> x % 2 == 0)
    .map(x -> x * x)
    .forEach(System.out::println);`} />
        </Sub>
      </Section>

      {/* ── 5. OOP Deep Dive ── */}
      <Section num="5" title="OOP Deep Dive">
        <Sub title="Class Hierarchy and Design">
          <CodeBlock language="java" code={`// Abstract class — partial implementation + contract
public abstract class Vehicle {
    private final String make;
    private final String model;
    private int mileage;

    protected Vehicle(String make, String model) {
        this.make = make;
        this.model = model;
    }

    // Abstract method — must be implemented by subclasses
    public abstract double fuelEfficiency();

    // Template method — defines algorithm, delegates steps
    public final String tripCost(double km, double fuelPricePerLitre) {
        double litres = km / fuelEfficiency();          // step delegated to subclass
        return "%.2f".formatted(litres * fuelPricePerLitre);
    }

    // Concrete methods
    public void drive(int km) { this.mileage += km; }
    public int getMileage()   { return mileage; }

    @Override public String toString() {
        return "%s %s (%d km)".formatted(make, model, mileage);
    }
}

// Interface — pure contract (Java 8+: default + static methods allowed)
public interface Electric {
    double batteryCapacityKwh();
    double chargeLevel();         // 0.0 – 1.0

    default double rangeKm() {   // default method — provided implementation
        return batteryCapacityKwh() * chargeLevel() * 6.0;
    }

    static Electric of(double capacity) {  // static factory on interface
        throw new UnsupportedOperationException("use a concrete class");
    }
}

// Concrete class — multiple interfaces, one superclass
public class Tesla extends Vehicle implements Electric {
    private final double capacity;
    private double charge;

    public Tesla(String model, double capacity) {
        super("Tesla", model);
        this.capacity = capacity;
        this.charge = 1.0;
    }

    @Override public double fuelEfficiency() { return 250.0; }  // km/litre equivalent
    @Override public double batteryCapacityKwh() { return capacity; }
    @Override public double chargeLevel() { return charge; }
}`} />
        </Sub>
        <Sub title="Interfaces vs Abstract Classes — When to Use Each">
          <table>
            <thead><tr><th>Feature</th><th>Interface</th><th>Abstract Class</th></tr></thead>
            <tbody>
              <tr><td>Multiple inheritance</td><td>✓ (implement many)</td><td>✗ (extend one)</td></tr>
              <tr><td>State (fields)</td><td>Constants only</td><td>✓ instance fields</td></tr>
              <tr><td>Constructor</td><td>✗</td><td>✓</td></tr>
              <tr><td>Default methods</td><td>✓ (Java 8+)</td><td>✓</td></tr>
              <tr><td>Use when</td><td>Defining a capability/role</td><td>Sharing code + enforcing structure</td></tr>
            </tbody>
          </table>
        </Sub>
        <Sub title="Composition over Inheritance">
          <CodeBlock language="java" code={`// Favour composition — easier to change, test, and reason about
public class OrderService {
    private final OrderRepository repo;      // composed
    private final PaymentGateway payment;    // composed
    private final EmailService email;        // composed
    private final AuditLog audit;            // composed

    // Constructor injection (favoured over field injection)
    public OrderService(OrderRepository repo,
                        PaymentGateway payment,
                        EmailService email,
                        AuditLog audit) {
        this.repo    = repo;
        this.payment = payment;
        this.email   = email;
        this.audit   = audit;
    }

    public Order placeOrder(Cart cart) {
        Order order = Order.from(cart);
        payment.charge(cart.total(), cart.paymentMethod());
        repo.save(order);
        email.sendConfirmation(order);
        audit.log("ORDER_PLACED", order.id());
        return order;
    }
}`} />
        </Sub>
      </Section>

      {/* ── 6. Generics ── */}
      <Section num="6" title="Generics — Deep Dive">
        <InfoBox>Java generics use <strong>type erasure</strong> — at runtime <code>List&lt;String&gt;</code> and <code>List&lt;Integer&gt;</code> are both just <code>List</code>. This is the biggest difference from C++ templates (which generate separate code per type).</InfoBox>
        <CodeBlock language="java" code={`// Generic class
public class Pair<A, B> {
    private final A first;
    private final B second;

    public Pair(A first, B second) {
        this.first = first;
        this.second = second;
    }

    public A first()  { return first; }
    public B second() { return second; }

    // Static factory method — better than constructor for type inference
    public static <A, B> Pair<A, B> of(A a, B b) {
        return new Pair<>(a, b);
    }

    @Override public String toString() {
        return "(%s, %s)".formatted(first, second);
    }
}

Pair<String, Integer> p = Pair.of("Alice", 30);

// Bounded type parameters
public static <T extends Comparable<T>> T clamp(T value, T min, T max) {
    if (value.compareTo(min) < 0) return min;
    if (value.compareTo(max) > 0) return max;
    return value;
}

clamp(15, 0, 10);     // 10
clamp(5.0, 0.0, 10.0); // 5.0

// Wildcards — use when you don't need to add to the collection
// ? extends T  → producer (read from it)
// ? super T    → consumer (write to it)
// PECS: Producer Extends, Consumer Super

double sumList(List<? extends Number> numbers) {
    return numbers.stream().mapToDouble(Number::doubleValue).sum();
}
sumList(List.of(1, 2, 3));        // Integer extends Number ✓
sumList(List.of(1.1, 2.2, 3.3));  // Double extends Number ✓

void addNumbers(List<? super Integer> list) {
    list.add(1);    // safe — list accepts Integer or supertypes
}
addNumbers(new ArrayList<Number>());   // Number super Integer ✓
addNumbers(new ArrayList<Object>());   // Object super Integer ✓`} />
      </Section>

      {/* ── 7. Functional Programming ── */}
      <Section num="7" title="Functional Programming in Java">
        <Sub title="Lambda Expressions">
          <CodeBlock language="java" code={`// Lambdas implement @FunctionalInterface (single abstract method)
Runnable r       = () -> System.out.println("run");
Comparator<String> byLen = (a, b) -> Integer.compare(a.length(), b.length());

// Method references — 4 forms:
ClassName::staticMethod      // Math::abs
object::instanceMethod       // System.out::println
ClassName::instanceMethod    // String::length   (first arg = receiver)
ClassName::new               // ArrayList::new   (constructor)

List<String> words = Arrays.asList("banana", "apple", "cherry");
words.sort(String::compareToIgnoreCase);
words.forEach(System.out::println);

// Creating your own functional interface
@FunctionalInterface
interface TriFunction<A, B, C, R> {
    R apply(A a, B b, C c);
}

TriFunction<Integer, Integer, Integer, Integer> clamp =
    (val, lo, hi) -> Math.max(lo, Math.min(hi, val));
System.out.println(clamp.apply(15, 0, 10));   // 10`} />
        </Sub>
        <Sub title="Streams — Java's Lazy Pipeline">
          <CodeBlock language="java" code={`import java.util.stream.*;

List<Employee> employees = List.of(
    new Employee("Alice", "Engineering", 95000),
    new Employee("Bob",   "Marketing",   65000),
    new Employee("Carol", "Engineering", 88000),
    new Employee("Dave",  "Engineering", 72000)
);

// Filter → Map → Collect
List<String> highEarners = employees.stream()
    .filter(e -> e.salary() > 80_000)
    .sorted(Comparator.comparing(Employee::salary).reversed())
    .map(Employee::name)
    .collect(Collectors.toList());
// Java 16+: .toList()  (unmodifiable)

// GroupBy — like SQL GROUP BY
Map<String, List<Employee>> byDept = employees.stream()
    .collect(Collectors.groupingBy(Employee::department));

// Statistics per group
Map<String, DoubleSummaryStatistics> stats = employees.stream()
    .collect(Collectors.groupingBy(
        Employee::department,
        Collectors.summarizingDouble(Employee::salary)));
stats.forEach((dept, s) ->
    System.out.printf("%s: avg=%.0f, max=%.0f%n", dept, s.getAverage(), s.getMax()));

// FlatMap — flatten nested collections
List<List<String>> nested = List.of(List.of("a","b"), List.of("c","d"));
List<String> flat = nested.stream()
    .flatMap(Collection::stream)
    .collect(Collectors.toList());

// Reduce
OptionalDouble avg = employees.stream()
    .mapToDouble(Employee::salary)
    .average();

// Parallel stream — use with caution (thread-safe collectors only)
long count = employees.parallelStream()
    .filter(e -> e.salary() > 70_000)
    .count();`} />
        </Sub>
        <Sub title="Optional — Avoid Null">
          <CodeBlock language="java" code={`// Optional wraps a potentially-null value
Optional<String> found = findUserName(id);

// Bad — defensive null checking everywhere
if (found.isPresent()) {
    String name = found.get();
    System.out.println(name.toUpperCase());
}

// Good — functional pipeline
String result = found
    .map(String::toUpperCase)
    .filter(s -> s.length() > 3)
    .orElse("UNKNOWN");

// orElseGet — lazy supplier (avoids computing default if not needed)
String lazy = found.orElseGet(() -> computeExpensiveDefault());

// orElseThrow — unwrap or throw
String name = found.orElseThrow(() -> new UserNotFoundException(id));

// ifPresentOrElse (Java 9+)
found.ifPresentOrElse(
    n -> System.out.println("Found: " + n),
    () -> System.out.println("Not found")
);

// Chaining Optionals
Optional<String> email = findUser(id)
    .map(User::getProfile)
    .map(Profile::getEmail);`} />
        </Sub>
      </Section>

      {/* ── 8. Error Handling ── */}
      <Section num="8" title="Error Handling — Checked and Unchecked">
        <InfoBox>Java is the <strong>only major language</strong> with checked exceptions — the compiler forces you to handle them. Unchecked exceptions (subclasses of <code>RuntimeException</code>) don't need to be declared or caught. Checked exceptions are controversial — most modern Java code uses unchecked exceptions exclusively.</InfoBox>
        <CodeBlock language="java" code={`// Checked exception — must declare in throws or catch
public byte[] readFile(Path path) throws IOException {
    return Files.readAllBytes(path);   // IOException is checked
}

// Unchecked exception — runtime, no declaration needed
public int divide(int a, int b) {
    if (b == 0) throw new ArithmeticException("Cannot divide by zero");
    return a / b;
}

// Try-with-resources (Java 7+) — auto-closes AutoCloseable
try (var conn = dataSource.getConnection();
     var stmt = conn.prepareStatement(sql)) {
    stmt.setInt(1, userId);
    var rs = stmt.executeQuery();
    // connection and statement auto-closed in reverse order
} catch (SQLException e) {
    throw new DataAccessException("Query failed", e);  // wrap + rethrow
}

// Multi-catch (Java 7+)
try {
    riskyOperation();
} catch (IOException | ParseException e) {
    log.error("IO or parse failed: {}", e.getMessage());
}

// Custom exception hierarchy
public class AppException extends RuntimeException {   // unchecked
    private final ErrorCode code;
    public AppException(ErrorCode code, String message) {
        super(message);
        this.code = code;
    }
    public AppException(ErrorCode code, String message, Throwable cause) {
        super(message, cause);
        this.code = code;
    }
    public ErrorCode getCode() { return code; }
}

public class NotFoundException extends AppException {
    public NotFoundException(String resource, Object id) {
        super(ErrorCode.NOT_FOUND, resource + " with id " + id + " not found");
    }
}`} />
      </Section>

      {/* ── 9. Collections ── */}
      <Section num="9" title="Collections Framework">
        <CodeBlock language="java" code={`import java.util.*;
import java.util.concurrent.*;

// === LIST ===
List<String> mutable    = new ArrayList<>();        // resizable array
List<String> linked     = new LinkedList<>();        // better for insert/delete at ends
List<String> immutable  = List.of("a", "b", "c");  // Java 9+ (no nulls, unmodifiable)
List<String> copyOf     = List.copyOf(mutable);     // Java 10+ immutable copy

mutable.add("Alice");
mutable.add(0, "Bob");          // insert at index
mutable.remove("Alice");
mutable.sort(Comparator.naturalOrder());
Collections.sort(mutable);
Collections.reverse(mutable);
Collections.shuffle(mutable);

// === MAP ===
Map<String, Integer> hashMap    = new HashMap<>();     // O(1), unordered
Map<String, Integer> linkedMap  = new LinkedHashMap<>(); // insertion order
Map<String, Integer> treeMap    = new TreeMap<>();     // sorted by key, O(log n)
Map<String, Integer> immutable  = Map.of("a", 1, "b", 2);

hashMap.put("Alice", 95);
hashMap.getOrDefault("Bob", 0);
hashMap.putIfAbsent("Carol", 70);
hashMap.computeIfAbsent("Dave", k -> computeScore(k));
hashMap.merge("Alice", 5, Integer::sum);   // add 5 to existing, or put 5

// Iterate
hashMap.forEach((k, v) -> System.out.println(k + "=" + v));
for (var entry : hashMap.entrySet()) { }

// === SET ===
Set<String> hashSet  = new HashSet<>();      // O(1), unordered
Set<String> treeSet  = new TreeSet<>();      // sorted, O(log n)
Set<String> linked   = new LinkedHashSet<>();// insertion order

// === QUEUE / DEQUE ===
Queue<Task>  queue  = new ArrayDeque<>();    // FIFO
Deque<Task>  deque  = new ArrayDeque<>();    // both ends
Deque<Task>  stack  = new ArrayDeque<>();    // LIFO (use instead of Stack class)
queue.offer(task);    // add (returns false if full, unlike add which throws)
queue.poll();         // remove head (returns null if empty)
queue.peek();         // view head (returns null if empty)

// Priority queue — min-heap by default
PriorityQueue<Task> pq = new PriorityQueue<>(
    Comparator.comparingInt(Task::priority));
pq.offer(new Task("high", 1));
pq.offer(new Task("low", 10));
pq.poll();  // returns Task("high", 1)

// === CONCURRENT ===
ConcurrentHashMap<String, Integer> concMap = new ConcurrentHashMap<>();
CopyOnWriteArrayList<String> cowList = new CopyOnWriteArrayList<>();
BlockingQueue<String> bq = new LinkedBlockingQueue<>(100);`} />
      </Section>

      {/* ── 10. Streams & Iteration ── */}
      <Section num="10" title="Streams and Lazy Evaluation">
        <CodeBlock language="java" code={`// Infinite streams — lazily evaluated
Stream<Integer> naturals = Stream.iterate(1, n -> n + 1);
List<Integer> firstTen   = naturals.limit(10).collect(Collectors.toList());

// takeWhile / dropWhile (Java 9+)
Stream.iterate(1, n -> n * 2)          // 1, 2, 4, 8, 16, ...
    .takeWhile(n -> n < 100)           // [1, 2, 4, 8, 16, 32, 64]
    .forEach(System.out::println);

// Stream.of, Stream.concat, Stream.empty
Stream<String> s1 = Stream.of("a", "b");
Stream<String> s2 = Stream.of("c", "d");
Stream<String> combined = Stream.concat(s1, s2);

// IntStream / LongStream / DoubleStream — avoid boxing
int sum = IntStream.rangeClosed(1, 100).sum();  // 5050
int[] squares = IntStream.range(1, 6).map(x -> x*x).toArray();

// Collectors
// joining
String csv = employees.stream().map(Employee::name).collect(Collectors.joining(", "));

// partitioningBy — splits into true/false groups
Map<Boolean, List<Employee>> partitioned = employees.stream()
    .collect(Collectors.partitioningBy(e -> e.salary() > 80_000));

// toMap
Map<String, Employee> byName = employees.stream()
    .collect(Collectors.toMap(Employee::name, e -> e));

// Collectors.teeing (Java 12+) — two collectors in one pass
var result = employees.stream().collect(
    Collectors.teeing(
        Collectors.counting(),
        Collectors.averagingDouble(Employee::salary),
        (count, avg) -> "Count: " + count + ", Avg: " + avg));`} />
      </Section>

      {/* ── 11. Modules ── */}
      <Section num="11" title="Modules, Packages, and Project Structure">
        <CodeBlock language="java" code={`// module-info.java (Java 9+ JPMS)
module com.myapp.core {
    requires java.net.http;                     // external module dependency
    requires com.fasterxml.jackson.databind;    // Jackson

    exports com.myapp.core.api;                 // expose to all modules
    exports com.myapp.core.internal to com.myapp.web;  // expose to specific module

    opens com.myapp.core.model to com.fasterxml.jackson.databind;  // reflection access
}

// Typical Maven project structure:
// myapp/
// ├── pom.xml                          Maven POM
// ├── src/
// │   ├── main/
// │   │   ├── java/
// │   │   │   └── com/myapp/
// │   │   │       ├── Main.java
// │   │   │       ├── model/
// │   │   │       ├── service/
// │   │   │       ├── repository/
// │   │   │       └── controller/
// │   │   └── resources/
// │   │       └── application.properties
// │   └── test/
// │       └── java/
// └── target/                           compiled output`} />
        <Sub title="Dependency Management (Maven)">
          <CodeBlock language="xml" code={`<!-- pom.xml -->
<project>
  <groupId>com.example</groupId>
  <artifactId>myapp</artifactId>
  <version>1.0.0</version>

  <properties>
    <java.version>21</java.version>
    <spring.version>3.2.0</spring.version>
  </properties>

  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
      <groupId>org.projectlombok</groupId>
      <artifactId>lombok</artifactId>
      <scope>provided</scope>
    </dependency>
    <dependency>
      <groupId>org.junit.jupiter</groupId>
      <artifactId>junit-jupiter</artifactId>
      <scope>test</scope>
    </dependency>
  </dependencies>
</project>`} />
        </Sub>
      </Section>

      {/* ── 12. JVM & Memory ── */}
      <Section num="12" title="JVM and Memory Model">
        <p>The JVM divides memory into regions. Understanding them prevents <code>OutOfMemoryError</code> and GC tuning problems.</p>
        <table>
          <thead><tr><th>Region</th><th>Contents</th><th>GC'd?</th></tr></thead>
          <tbody>
            <tr><td>Heap (Young Gen)</td><td>Newly allocated objects (Eden + Survivor)</td><td>Yes — frequent minor GC</td></tr>
            <tr><td>Heap (Old Gen)</td><td>Long-lived objects promoted from young</td><td>Yes — infrequent major GC</td></tr>
            <tr><td>Metaspace</td><td>Class metadata, static fields</td><td>Yes — on class unload</td></tr>
            <tr><td>Stack (per-thread)</td><td>Local variables, method frames</td><td>No — LIFO auto-managed</td></tr>
            <tr><td>Native Memory</td><td>Direct ByteBuffers, JNI</td><td>Manual or Reference Queue</td></tr>
          </tbody>
        </table>
        <CodeBlock language="java" code={`// GC interaction
Object o = new Object();     // allocated in Eden
o = null;                    // eligible for GC — not immediately collected

// WeakReference — collected when GC runs
WeakReference<ExpensiveObject> weak = new WeakReference<>(new ExpensiveObject());
ExpensiveObject obj = weak.get();   // null if GC ran
if (obj != null) { /* use obj */ }

// SoftReference — collected only under memory pressure (good for caches)
SoftReference<byte[]> cache = new SoftReference<>(loadData());

// JVM flags
// -Xmx2g        max heap 2GB
// -Xms512m      initial heap 512MB
// -XX:+UseZGC   use Z Garbage Collector (low-latency, Java 15+)
// -XX:+UseG1GC  use G1 GC (default Java 9+)
// -verbose:gc   print GC events

// String interning — all literals are pooled
String a = "hello";
String b = "hello";
System.out.println(a == b);   // true — same pool reference

String c = new String("hello");
System.out.println(a == c);   // false — different object
System.out.println(a.equals(c));   // true — same value
System.out.println(a == c.intern());  // true — interned`} />
      </Section>

      {/* ── 13. Concurrency ── */}
      <Section num="13" title="Concurrency and Asynchronous Programming">
        <Sub title="Threads and Executors">
          <CodeBlock language="java" code={`import java.util.concurrent.*;

// Thread pool (always use pools, not new Thread())
ExecutorService pool = Executors.newFixedThreadPool(Runtime.getRuntime().availableProcessors());
ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(2);

// Submit tasks
Future<String> future = pool.submit(() -> {
    return "result from thread";
});
String result = future.get(5, TimeUnit.SECONDS);  // block with timeout

// CompletableFuture — non-blocking async (Java 8+)
CompletableFuture<User> userFuture = CompletableFuture
    .supplyAsync(() -> fetchUser(id), pool)          // run async
    .thenApply(user -> enrichUser(user))              // transform result
    .thenCompose(user -> fetchOrders(user.id()))      // async chain
    .exceptionally(ex -> {
        log.error("Failed: {}", ex.getMessage());
        return null;
    });

// Run multiple in parallel
CompletableFuture<User>   u = CompletableFuture.supplyAsync(() -> fetchUser(id));
CompletableFuture<Orders> o = CompletableFuture.supplyAsync(() -> fetchOrders(id));

CompletableFuture.allOf(u, o).join();   // wait for both
User   user   = u.join();
Orders orders = o.join();

// Shutdown cleanly
pool.shutdown();
if (!pool.awaitTermination(30, TimeUnit.SECONDS)) {
    pool.shutdownNow();
}`} />
        </Sub>
        <Sub title="Virtual Threads — Project Loom (Java 21)">
          <CodeBlock language="java" code={`// Virtual threads — millions of cheap threads (Java 21)
// Each virtual thread is mapped to a platform thread only when running
// When it blocks (I/O, sleep), the platform thread is released

// Create virtual thread
Thread vt = Thread.ofVirtual().start(() -> {
    System.out.println("Virtual thread: " + Thread.currentThread().isVirtual());
});

// Virtual thread executor — best for I/O-bound work
ExecutorService vtPool = Executors.newVirtualThreadPerTaskExecutor();

List<CompletableFuture<String>> futures = urls.stream()
    .map(url -> CompletableFuture.supplyAsync(() -> fetch(url), vtPool))
    .toList();

// Structured concurrency (Java 21 preview)
try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
    var userTask  = scope.fork(() -> fetchUser(id));
    var orderTask = scope.fork(() -> fetchOrders(id));
    scope.join();           // wait for both
    scope.throwIfFailed();  // propagate any exception
    return new Response(userTask.get(), orderTask.get());
}`} />
        </Sub>
        <Sub title="Thread Safety and Synchronization">
          <CodeBlock language="java" code={`// synchronized method
public synchronized void increment() { count++; }

// synchronized block (finer grained)
private final Object lock = new Object();
public void increment() {
    synchronized (lock) { count++; }
}

// Atomic variables (lock-free)
AtomicInteger atomicCount = new AtomicInteger(0);
atomicCount.incrementAndGet();
atomicCount.compareAndSet(expected, newValue);

// volatile — ensure visibility across threads (not atomicity!)
private volatile boolean running = true;

// Lock interface (more flexible than synchronized)
ReentrantLock lock = new ReentrantLock();
lock.lock();
try {
    // critical section
} finally {
    lock.unlock();
}

// ReadWriteLock — multiple readers or one writer
ReadWriteLock rwLock = new ReentrantReadWriteLock();
rwLock.readLock().lock();
try { readSharedState(); } finally { rwLock.readLock().unlock(); }`} />
        </Sub>
      </Section>

      {/* ── 14. Design Patterns ── */}
      <Section num="14" title="Design Patterns — Complete Java Reference">

        <div className="pattern-card">
          <div className="pattern-card-header">
            <span className="pattern-icon">🔒</span>
            <div>
              <div className="pattern-title">Singleton</div>
              <div className="pattern-desc">Guarantee one instance globally</div>
            </div>
          </div>
          <div className="pattern-card-body">
            <CodeBlock language="java" code={`// Thread-safe idiom — initialization-on-demand holder
public class Config {
    private Config() {}

    private static class Holder {
        static final Config INSTANCE = new Config();
    }

    public static Config getInstance() {
        return Holder.INSTANCE;        // loaded lazily and thread-safely
    }
}

// Modern Java — enum singleton (Joshua Bloch's recommendation)
public enum AppConfig {
    INSTANCE;
    private final String env = System.getenv("APP_ENV");
    public String env() { return env; }
}
AppConfig.INSTANCE.env();`} />
          </div>
        </div>

        <div className="pattern-card">
          <div className="pattern-card-header">
            <span className="pattern-icon">🏭</span>
            <div>
              <div className="pattern-title">Factory Method + Abstract Factory</div>
            </div>
          </div>
          <div className="pattern-card-body">
            <CodeBlock language="java" code={`// Factory Method
public interface Notification {
    void send(String message, String to);
}

public abstract class NotificationFactory {
    public abstract Notification createNotification();   // factory method

    public void notify(String msg, String recipient) {   // template method
        createNotification().send(msg, recipient);
    }
}

public class EmailFactory extends NotificationFactory {
    @Override
    public Notification createNotification() {
        return new EmailNotification(smtpConfig);
    }
}

// Abstract Factory — create families of related objects
public interface UiFactory {
    Button createButton();
    TextInput createTextInput();
    Modal createModal();
}

public class DarkThemeFactory implements UiFactory {
    public Button createButton()    { return new DarkButton(); }
    public TextInput createTextInput() { return new DarkInput(); }
    public Modal createModal()      { return new DarkModal(); }
}

// The app never knows which theme it uses:
UiFactory factory = new DarkThemeFactory();
Button btn = factory.createButton();`} />
          </div>
        </div>

        <div className="pattern-card">
          <div className="pattern-card-header">
            <span className="pattern-icon">🧱</span>
            <div>
              <div className="pattern-title">Builder</div>
            </div>
          </div>
          <div className="pattern-card-body">
            <CodeBlock language="java" code={`public class HttpRequest {
    private final String method;
    private final String url;
    private final Map<String, String> headers;
    private final String body;
    private final int timeoutMs;

    private HttpRequest(Builder b) {
        this.method    = Objects.requireNonNull(b.method, "method");
        this.url       = Objects.requireNonNull(b.url, "url");
        this.headers   = Map.copyOf(b.headers);
        this.body      = b.body;
        this.timeoutMs = b.timeoutMs;
    }

    public static class Builder {
        private String method = "GET";
        private String url;
        private final Map<String, String> headers = new LinkedHashMap<>();
        private String body;
        private int timeoutMs = 30_000;

        public Builder url(String url)         { this.url = url; return this; }
        public Builder method(String m)        { this.method = m; return this; }
        public Builder header(String k, String v) { headers.put(k, v); return this; }
        public Builder body(String b)          { this.body = b; return this; }
        public Builder timeout(int ms)         { this.timeoutMs = ms; return this; }
        public HttpRequest build()             { return new HttpRequest(this); }
    }
}

var req = new HttpRequest.Builder()
    .url("https://api.example.com/users")
    .method("POST")
    .header("Content-Type", "application/json")
    .header("Authorization", "Bearer " + token)
    .body("""{"name":"Alice"}""")
    .timeout(5_000)
    .build();`} />
          </div>
        </div>

        <div className="pattern-card">
          <div className="pattern-card-header">
            <span className="pattern-icon">🎯</span>
            <div>
              <div className="pattern-title">Strategy</div>
            </div>
          </div>
          <div className="pattern-card-body">
            <CodeBlock language="java" code={`// Classic — interface + implementations
public interface PricingStrategy {
    double calculate(Order order);
}

public class StandardPricing implements PricingStrategy {
    public double calculate(Order o) { return o.subtotal(); }
}

public class MemberPricing implements PricingStrategy {
    public double calculate(Order o) { return o.subtotal() * 0.9; }  // 10% off
}

// Modern Java — lambda replaces class hierarchy
@FunctionalInterface
public interface PricingStrategy {
    double calculate(Order order);
}

PricingStrategy standard = order -> order.subtotal();
PricingStrategy member   = order -> order.subtotal() * 0.9;
PricingStrategy vip      = order -> order.subtotal() * 0.75;

// Inject at runtime
public class OrderProcessor {
    private PricingStrategy pricing;
    public void setPricing(PricingStrategy p) { this.pricing = p; }
    public double process(Order o) { return pricing.calculate(o); }
}

var processor = new OrderProcessor();
processor.setPricing(member);  // or pass lambda directly`} />
          </div>
        </div>

        <div className="pattern-card">
          <div className="pattern-card-header">
            <span className="pattern-icon">📡</span>
            <div>
              <div className="pattern-title">Observer</div>
            </div>
          </div>
          <div className="pattern-card-body">
            <CodeBlock language="java" code={`// Modern Java — use functional interfaces as listeners
public class EventBus<T> {
    private final Map<String, List<Consumer<T>>> listeners = new ConcurrentHashMap<>();

    public Runnable subscribe(String event, Consumer<T> listener) {
        listeners.computeIfAbsent(event, k -> new CopyOnWriteArrayList<>())
                 .add(listener);
        return () -> listeners.getOrDefault(event, List.of()).remove(listener);
    }

    public void publish(String event, T payload) {
        listeners.getOrDefault(event, List.of())
                 .forEach(l -> l.accept(payload));
    }
}

EventBus<OrderEvent> bus = new EventBus<>();
Runnable unsub = bus.subscribe("ORDER_PLACED", event -> sendEmail(event));
bus.subscribe("ORDER_PLACED", event -> updateInventory(event));
bus.subscribe("ORDER_PLACED", event -> notifyWarehouse(event));

bus.publish("ORDER_PLACED", new OrderEvent(orderId));
unsub.run();   // remove first listener`} />
          </div>
        </div>

        <div className="pattern-card">
          <div className="pattern-card-header">
            <span className="pattern-icon">🎨</span>
            <div>
              <div className="pattern-title">Decorator</div>
            </div>
          </div>
          <div className="pattern-card-body">
            <CodeBlock language="java" code={`public interface DataSource {
    void writeData(String data);
    String readData();
}

// Base implementation
public class FileDataSource implements DataSource {
    private final String filename;
    public FileDataSource(String filename) { this.filename = filename; }
    public void writeData(String data) { /* write to file */ }
    public String readData() { /* read from file */ return ""; }
}

// Decorator base
public abstract class DataSourceDecorator implements DataSource {
    protected final DataSource wrapped;
    public DataSourceDecorator(DataSource w) { this.wrapped = w; }
}

// Encryption decorator
public class EncryptionDecorator extends DataSourceDecorator {
    public EncryptionDecorator(DataSource w) { super(w); }
    public void writeData(String data) { wrapped.writeData(encrypt(data)); }
    public String readData() { return decrypt(wrapped.readData()); }
    private String encrypt(String s) { return Base64.getEncoder().encodeToString(s.getBytes()); }
    private String decrypt(String s) { return new String(Base64.getDecoder().decode(s)); }
}

// Composing decorators (like onion layers)
DataSource source = new EncryptionDecorator(
    new CompressionDecorator(
        new FileDataSource("data.txt")));
source.writeData("secret");   // compress → encrypt → write to file`} />
          </div>
        </div>

        <div className="pattern-card">
          <div className="pattern-card-header">
            <span className="pattern-icon">📋</span>
            <div>
              <div className="pattern-title">Command</div>
            </div>
          </div>
          <div className="pattern-card-body">
            <CodeBlock language="java" code={`// Command — encapsulate an operation as an object (enables undo/redo)
public interface Command {
    void execute();
    void undo();
}

public class AddTextCommand implements Command {
    private final Document doc;
    private final String text;
    private final int position;

    public AddTextCommand(Document doc, String text, int position) {
        this.doc = doc;
        this.text = text;
        this.position = position;
    }

    public void execute() { doc.insert(position, text); }
    public void undo()    { doc.delete(position, text.length()); }
}

// Command history for undo/redo
public class CommandHistory {
    private final Deque<Command> history  = new ArrayDeque<>();
    private final Deque<Command> undone   = new ArrayDeque<>();

    public void execute(Command cmd) {
        cmd.execute();
        history.push(cmd);
        undone.clear();
    }

    public void undo() {
        if (!history.isEmpty()) {
            Command cmd = history.pop();
            cmd.undo();
            undone.push(cmd);
        }
    }

    public void redo() {
        if (!undone.isEmpty()) {
            execute(undone.pop());
        }
    }
}`} />
          </div>
        </div>

        <div className="pattern-card">
          <div className="pattern-card-header">
            <span className="pattern-icon">📐</span>
            <div>
              <div className="pattern-title">Template Method</div>
            </div>
          </div>
          <div className="pattern-card-body">
            <CodeBlock language="java" code={`// Template Method — algorithm skeleton in base class, steps in subclasses
public abstract class DataProcessor {
    // Template method — final to prevent override
    public final void process() {
        var raw  = readData();       // abstract
        var data = parseData(raw);   // abstract
        var result = transform(data);// abstract
        writeResult(result);         // abstract
        if (shouldNotify()) {        // hook — optional override
            notify(result);
        }
    }

    protected abstract byte[] readData();
    protected abstract Object parseData(byte[] raw);
    protected abstract Object transform(Object data);
    protected abstract void writeResult(Object result);

    // Hook method — default implementation, override if needed
    protected boolean shouldNotify() { return false; }
    protected void notify(Object result) { }
}

public class CsvProcessor extends DataProcessor {
    protected byte[] readData() { return Files.readAllBytes(csvPath); }
    protected Object parseData(byte[] raw) { return CsvParser.parse(raw); }
    protected Object transform(Object data) { return validate((CsvData)data); }
    protected void writeResult(Object result) { repo.save(result); }
    protected boolean shouldNotify() { return true; }
}`} />
          </div>
        </div>

      </Section>

      {/* ── 15. Modern Java 17–21 ── */}
      <Section num="15" title="Modern Java 17–21 Features">
        <CodeBlock language="java" code={`// Records (Java 16)
record User(int id, String name, String email) {
    // compact constructor for validation
    User {
        Objects.requireNonNull(name, "name");
        if (name.isBlank()) throw new IllegalArgumentException("name blank");
        email = email.toLowerCase();  // normalize
    }
}

// Sealed interfaces + records — algebraic data types
sealed interface Result<T> permits Success, Failure {}
record Success<T>(T value) implements Result<T> {}
record Failure<T>(String error) implements Result<T> {}

Result<User> findUser(int id) {
    try {
        return new Success<>(repo.find(id));
    } catch (Exception e) {
        return new Failure<>(e.getMessage());
    }
}

// Use with pattern matching
String message = switch (findUser(42)) {
    case Success<User> s -> "Found: " + s.value().name();
    case Failure<User> f -> "Error: " + f.error();
};

// Pattern matching instanceof (Java 16)
Object obj = "Hello";
if (obj instanceof String s && s.length() > 3) {   // bind + guard
    System.out.println(s.toUpperCase());
}

// SequencedCollection (Java 21) — first/last on any collection
List<String> list = new ArrayList<>(List.of("a","b","c"));
list.getFirst();  // "a"
list.getLast();   // "c"
list.addFirst("z");
list.reversed();  // reversed view

// Unnamed patterns and variables (Java 21 preview)
try { } catch (IOException _) { }   // unused variable → _
for (var _ : list) count++;         // unused loop variable

// Unnamed classes (Java 21 preview)
// In file Greeter.java:
void main() {
    System.out.println("No class needed!");
}`} />
      </Section>

      {/* ── 16. Spring Boot ── */}
      <Section num="16" title="Spring Boot Primer">
        <TipBox>Spring Boot is the dominant Java framework for web services. Understanding its key annotations and patterns makes you productive immediately in any Java backend codebase.</TipBox>
        <CodeBlock language="java" code={`// @SpringBootApplication = @Configuration + @EnableAutoConfiguration + @ComponentScan
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}

// REST Controller
@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService service;

    public UserController(UserService service) {   // constructor injection (recommended)
        this.service = service;
    }

    @GetMapping
    public List<UserDto> list(@RequestParam(defaultValue = "0") int page,
                              @RequestParam(defaultValue = "20") int size) {
        return service.findAll(page, size);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> get(@PathVariable Long id) {
        return service.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserDto create(@RequestBody @Valid CreateUserRequest req) {
        return service.create(req);
    }

    @PatchMapping("/{id}")
    public UserDto update(@PathVariable Long id,
                          @RequestBody @Valid UpdateUserRequest req) {
        return service.update(id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}

// Service layer
@Service
@Transactional(readOnly = true)
public class UserService {
    private final UserRepository repo;
    private final PasswordEncoder encoder;

    public UserService(UserRepository repo, PasswordEncoder encoder) {
        this.repo = repo;
        this.encoder = encoder;
    }

    public Optional<UserDto> findById(Long id) {
        return repo.findById(id).map(UserMapper::toDto);
    }

    @Transactional   // write transaction
    public UserDto create(CreateUserRequest req) {
        if (repo.existsByEmail(req.email())) {
            throw new ConflictException("Email already exists");
        }
        var user = User.builder()
            .name(req.name())
            .email(req.email())
            .passwordHash(encoder.encode(req.password()))
            .build();
        return UserMapper.toDto(repo.save(user));
    }
}

// Repository (Spring Data JPA)
public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);
    Optional<User> findByEmail(String email);
    List<User> findByActiveTrue();

    @Query("SELECT u FROM User u WHERE u.role = :role ORDER BY u.name")
    List<User> findByRole(@Param("role") String role);
}`} />
      </Section>

      {/* ── 17. Mini Project ── */}
      <Section num="17" title="Mini Project: Type-Safe Event System">
        <CodeBlock language="java" code={`import java.util.*;
import java.util.concurrent.*;
import java.util.function.Consumer;

// Event hierarchy using sealed interface + records (Java 17+)
sealed interface AppEvent permits
    UserCreated, UserDeleted, OrderPlaced, OrderShipped {}

record UserCreated(long userId, String name, String email) implements AppEvent {}
record UserDeleted(long userId, String reason)             implements AppEvent {}
record OrderPlaced(long orderId, long userId, double total) implements AppEvent {}
record OrderShipped(long orderId, String trackingNumber)    implements AppEvent {}

// Type-safe, generic event bus
public class TypedEventBus {
    private final Map<Class<?>, List<Consumer<Object>>> handlers = new ConcurrentHashMap<>();
    private final ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor();

    @SuppressWarnings("unchecked")
    public <E extends AppEvent> Runnable on(Class<E> type, Consumer<E> handler) {
        handlers.computeIfAbsent(type, _ -> new CopyOnWriteArrayList<>())
                .add(e -> handler.accept((E) e));
        return () -> handlers.getOrDefault(type, List.of())
                             .removeIf(h -> h == handler);
    }

    public <E extends AppEvent> void publish(E event) {
        var specific = handlers.getOrDefault(event.getClass(), List.of());
        specific.forEach(h -> executor.submit(() -> h.accept(event)));
    }
}

// Usage with pattern matching
public class Main {
    public static void main(String[] args) {
        var bus = new TypedEventBus();

        bus.on(UserCreated.class, event ->
            System.out.printf("Welcome email → %s (%s)%n", event.name(), event.email()));

        bus.on(OrderPlaced.class, event ->
            System.out.printf("Order #%d placed, total=$%.2f%n", event.orderId(), event.total()));

        bus.on(OrderShipped.class, event ->
            System.out.printf("Shipping confirmation for #%d: %s%n",
                              event.orderId(), event.trackingNumber()));

        // Publish events
        bus.publish(new UserCreated(1L, "Alice", "alice@example.com"));
        bus.publish(new OrderPlaced(101L, 1L, 89.99));
        bus.publish(new OrderShipped(101L, "FED-12345"));

        // Process an event with exhaustive pattern matching
        AppEvent latest = new OrderShipped(101L, "FED-12345");
        String summary = switch (latest) {
            case UserCreated u  -> "New user: " + u.name();
            case UserDeleted u  -> "Deleted user: " + u.userId();
            case OrderPlaced o  -> "New order: $" + o.total();
            case OrderShipped o -> "Shipped: " + o.trackingNumber();
        };
        System.out.println(summary);
    }
}`} />
      </Section>
    </div>
  )
}
