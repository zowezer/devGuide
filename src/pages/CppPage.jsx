import CodeBlock from '../components/CodeBlock'
import CompareBlock from '../components/CompareBlock'
import Section, { Sub, InfoBox, WarnBox, TipBox } from '../components/Section'
import { PointerViz, StackHeapViz, BitRegSim } from '../components/CLangSims'

export default function CppPage() {
  return (
    <div>
      <div className="page-hero">
        <div className="lang-icon">🔷</div>
        <div>
          <h1>C++</h1>
          <p>C with classes — and then some. C++ adds OOP, templates (generics), the STL, RAII memory management, and modern features (C++11/14/17/20) that rival Java's expressiveness while remaining close to the metal.</p>
          <div className="badges">
            <span className="badge">Static Typing</span>
            <span className="badge green">Compiled</span>
            <span className="badge red">Manual + RAII Memory</span>
            <span className="badge purple">Multi-paradigm</span>
          </div>
        </div>
      </div>

      <Section num="1" title="Syntax and Program Structure">
        <CompareBlock
          javaLabel="Java"
          otherLabel="C++"
          language="cpp"
          javaCode={`import java.util.*;

public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        int x = 42;
        var nums = new ArrayList<Integer>();
    }
}`}
          otherCode={`#include <iostream>
#include <vector>
#include <string>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    int x = 42;
    auto nums = vector<int>();   // auto = type inference
    return 0;
}`}
        />
        <Sub title="References vs Pointers">
          <InfoBox>C++ has both <strong>pointers</strong> (from C) and <strong>references</strong>. A reference is an alias — it cannot be null and cannot be rebound. Java's object variables are most similar to C++ references.</InfoBox>
          <CodeBlock language="cpp" code={`int x = 42;
int &ref = x;      // reference — alias for x
ref = 100;
cout << x;         // 100 (x was modified through ref)

// Pass by reference (like Java's object passing)
void increment(int &val) {
    val++;
}
increment(x);      // x is now 101

// const reference — view without modifying
void print(const string &s) {
    cout << s;     // cannot modify s
}

// Difference from pointers:
int *ptr = &x;     // can be null, can be rebound
int &ref2 = x;     // cannot be null, cannot change what it refers to`} />
        </Sub>
        <PointerViz defaultLang="cpp" />
      </Section>

      <Section num="2" title="Memory Management — RAII and Smart Pointers">
        <p>Modern C++ (C++11+) uses <strong>RAII</strong> (Resource Acquisition Is Initialization) — resources are tied to object lifetimes. Smart pointers replace raw <code>new</code>/<code>delete</code>, making memory management almost as safe as Java's GC.</p>
        <CodeBlock language="cpp" code={`#include <memory>

// unique_ptr — sole ownership (like Java's reference, but explicit ownership)
// Freed automatically when goes out of scope
auto dog = make_unique<Dog>("Rex");   // prefer make_unique over new
dog->bark();
// dog goes out of scope here → Dog is automatically destroyed

// shared_ptr — shared ownership (reference counted)
// Like Java's normal references — freed when last shared_ptr goes away
auto shared = make_shared<Animal>("Cat");
auto copy = shared;    // both point to same Animal, refcount = 2
// Freed when both 'shared' and 'copy' go out of scope

// weak_ptr — non-owning reference (break circular references)
weak_ptr<Animal> weak = shared;
if (auto locked = weak.lock()) {   // locked = shared_ptr if still alive
    locked->speak();
}

// ❌ Old style (avoid unless necessary)
Dog *raw = new Dog("Old");
raw->bark();
delete raw;    // must manually delete!

// RAII example — file handle
class FileHandle {
    FILE *f;
public:
    FileHandle(const string &path) : f(fopen(path.c_str(), "r")) {
        if (!f) throw runtime_error("Cannot open " + path);
    }
    ~FileHandle() { if (f) fclose(f); }   // destructor called automatically
    // No manual cleanup needed!
};`} />
        <StackHeapViz defaultLang="cpp" />
      </Section>

      <Section num="3" title="Classes and OOP">
        <CodeBlock language="cpp" code={`#include <string>
#include <iostream>
using namespace std;

class BankAccount {
private:                    // private by default in class (public in struct)
    string owner;
    double balance;

public:
    // Constructor with initializer list (more efficient than assignment)
    BankAccount(const string &owner, double balance = 0.0)
        : owner(owner), balance(balance) {}

    // Copy constructor (Java doesn't have this)
    BankAccount(const BankAccount &other)
        : owner(other.owner), balance(other.balance) {}

    // Destructor (called when object destroyed — like Java's finalize() but reliable)
    ~BankAccount() {
        cout << "Account for " << owner << " closed" << endl;
    }

    void deposit(double amount) {
        if (amount <= 0) throw invalid_argument("Must be positive");
        balance += amount;
    }

    double getBalance() const { return balance; }  // const = won't modify object

    // Operator overloading (no Java equivalent!)
    bool operator==(const BankAccount &other) const {
        return owner == other.owner && balance == other.balance;
    }

    friend ostream &operator<<(ostream &os, const BankAccount &acc) {
        return os << "Account(" << acc.owner << ", $" << acc.balance << ")";
    }
};

BankAccount acc("Alice", 100);
acc.deposit(50);
cout << acc << endl;         // Account(Alice, $150)`} />
        <Sub title="Inheritance and Virtual Functions">
          <CodeBlock language="cpp" code={`class Animal {
protected:             // accessible in derived classes
    string name;
public:
    Animal(const string &n) : name(n) {}
    virtual ~Animal() {}   // virtual destructor — ALWAYS do this for base classes!

    virtual string speak() const {    // virtual = can be overridden
        return name + " makes a sound";
    }

    string getName() const { return name; }
};

class Dog : public Animal {   // public inheritance (like Java extends)
    string breed;
public:
    Dog(const string &name, const string &breed)
        : Animal(name), breed(breed) {}

    string speak() const override {   // override keyword (like @Override)
        return Animal::speak() + ": Woof! (a " + breed + ")";
    }
};

// Polymorphism — must use pointer or reference!
// (C++ copies by value otherwise — "object slicing")
vector<unique_ptr<Animal>> animals;
animals.push_back(make_unique<Dog>("Rex", "Husky"));
animals.push_back(make_unique<Animal>("Ghost"));

for (const auto &a : animals) {
    cout << a->speak() << endl;  // dynamic dispatch via vtable
}`} />
        </Sub>
        <Sub title="Abstract Classes and Interfaces">
          <CodeBlock language="cpp" code={`// Abstract class = class with at least one pure virtual function
class Shape {
public:
    virtual ~Shape() {}
    virtual double area() const = 0;         // pure virtual — must implement
    virtual double perimeter() const = 0;

    // Concrete method in abstract class (like Java default interface method)
    virtual string describe() const {
        return "Area: " + to_string(area());
    }
};

// "Interface" in C++ — abstract class with only pure virtual functions
class Drawable {
public:
    virtual void draw() const = 0;
    virtual ~Drawable() {}
};

// Multiple inheritance (C++ allows it, Java forbids it)
class Circle : public Shape, public Drawable {
    double radius;
public:
    Circle(double r) : radius(r) {}
    double area() const override { return 3.14159 * radius * radius; }
    double perimeter() const override { return 2 * 3.14159 * radius; }
    void draw() const override { cout << "Drawing circle r=" << radius; }
};`} />
        </Sub>
      </Section>

      <Section num="4" title="Templates — C++ Generics">
        <p>Templates are C++'s generics. Unlike Java's type-erased generics, C++ templates generate specialized code at compile time — zero runtime overhead, and you can constrain types with <strong>concepts</strong> (C++20).</p>
        <CompareBlock
          javaLabel="Java Generics"
          otherLabel="C++ Templates"
          language="cpp"
          javaCode={`// Java generics — type erased at runtime
public class Stack<T> {
    private List<T> items = new ArrayList<>();
    public void push(T item) { items.add(item); }
    public T pop() { return items.remove(items.size()-1); }
    public boolean isEmpty() { return items.isEmpty(); }
}
Stack<Integer> s = new Stack<>();`}
          otherCode={`// C++ template — generates separate code per type
template<typename T>
class Stack {
    vector<T> items;
public:
    void push(T item) { items.push_back(item); }
    T pop() {
        T val = items.back();
        items.pop_back();
        return val;
    }
    bool empty() const { return items.empty(); }
};
Stack<int> s;      // int-specialized Stack
Stack<string> ss;  // string-specialized Stack`}
        />
        <Sub title="Function Templates and Concepts (C++20)">
          <CodeBlock language="cpp" code={`// Function template
template<typename T>
T max_val(T a, T b) {
    return a > b ? a : b;
}
cout << max_val(3, 7);       // 7 (int)
cout << max_val(3.14, 2.72); // 3.14 (double)

// Variadic template (like Java varargs, but for types)
template<typename... Args>
void print_all(Args... args) {
    ((cout << args << " "), ...);  // fold expression (C++17)
}
print_all(1, "hello", 3.14);   // 1 hello 3.14

// Concepts (C++20) — type constraints
#include <concepts>
template<typename T>
concept Numeric = is_arithmetic_v<T>;

template<Numeric T>
T add(T a, T b) { return a + b; }`} />
        </Sub>
      </Section>

      <Section num="5" title="STL — Standard Template Library">
        <CodeBlock language="cpp" code={`#include <vector>
#include <map>
#include <unordered_map>
#include <set>
#include <algorithm>

// vector = ArrayList
vector<int> v = {3, 1, 4, 1, 5, 9};
v.push_back(2);
v.pop_back();
v[0] = 10;
v.size();

// map = TreeMap (sorted)
map<string, int> scores;
scores["Alice"] = 95;
scores["Bob"]   = 87;
for (auto &[name, score] : scores) {  // structured binding (C++17)
    cout << name << ": " << score << endl;
}

// unordered_map = HashMap (faster, unsorted)
unordered_map<string, int> fast_map;
fast_map["key"] = 42;

// set = TreeSet
set<int> unique = {3, 1, 4, 1, 5};   // {1,3,4,5}

// Algorithm library
sort(v.begin(), v.end());
sort(v.begin(), v.end(), greater<int>());   // reverse sort
auto it = find(v.begin(), v.end(), 5);
auto count5 = count(v.begin(), v.end(), 5);
bool any_neg = any_of(v.begin(), v.end(), [](int x){ return x < 0; });

// transform = map
vector<int> squares(v.size());
transform(v.begin(), v.end(), squares.begin(), [](int x){ return x*x; });`} />
      </Section>

      <Section num="6" title="Lambda Expressions (C++11+)">
        <CodeBlock language="cpp" code={`// [capture](params) -> return_type { body }
auto add = [](int a, int b) { return a + b; };
cout << add(3, 4);  // 7

// Capture list:
// []    — capture nothing
// [=]   — capture all by value (copy)
// [&]   — capture all by reference
// [x]   — capture x by value
// [&x]  — capture x by reference
int multiplier = 3;
auto triple = [multiplier](int x) { return x * multiplier; };
auto increment = [&multiplier](int x) { return x + multiplier; };

// Use with STL algorithms
vector<int> nums = {1,2,3,4,5,6};
vector<int> evens;
copy_if(nums.begin(), nums.end(), back_inserter(evens),
        [](int x){ return x % 2 == 0; });

// Generic lambda (C++14)
auto print = [](const auto &x) { cout << x << " "; };
print(42);
print("hello");
print(3.14);`} />
      </Section>

      <Section num="7" title="Design Patterns in C++">
        <div className="pattern-card">
          <div className="pattern-card-header">
            <span className="pattern-icon">🔒</span>
            <div><div className="pattern-title">Singleton</div></div>
          </div>
          <div className="pattern-card-body">
            <CodeBlock language="cpp" code={`class Logger {
    Logger() {}   // private constructor
public:
    static Logger &getInstance() {
        static Logger instance;   // thread-safe in C++11+
        return instance;
    }
    Logger(const Logger &) = delete;             // no copy
    Logger &operator=(const Logger &) = delete;  // no assign

    void log(const string &msg) {
        cout << "[LOG] " << msg << endl;
    }
};

Logger::getInstance().log("Server started");`} />
          </div>
        </div>

        <div className="pattern-card">
          <div className="pattern-card-header">
            <span className="pattern-icon">🧱</span>
            <div><div className="pattern-title">Builder</div></div>
          </div>
          <div className="pattern-card-body">
            <CodeBlock language="cpp" code={`class HttpRequest {
    string method_, url_, body_;
    map<string, string> headers_;
public:
    class Builder {
        HttpRequest req;
    public:
        Builder &method(const string &m) { req.method_ = m; return *this; }
        Builder &url(const string &u) { req.url_ = u; return *this; }
        Builder &header(const string &k, const string &v) {
            req.headers_[k] = v; return *this;
        }
        Builder &body(const string &b) { req.body_ = b; return *this; }
        HttpRequest build() { return req; }
    };
};

auto req = HttpRequest::Builder()
    .method("POST")
    .url("/api/users")
    .header("Content-Type", "application/json")
    .body(R"({"name":"Alice"})")
    .build();`} />
          </div>
        </div>

        <div className="pattern-card">
          <div className="pattern-card-header">
            <span className="pattern-icon">🎨</span>
            <div><div className="pattern-title">CRTP — Curiously Recurring Template Pattern</div>
            <div className="pattern-desc">C++-specific: static polymorphism with zero runtime overhead</div></div>
          </div>
          <div className="pattern-card-body">
            <CodeBlock language="cpp" code={`// CRTP — known at compile time, no vtable overhead
template<typename Derived>
class Printable {
public:
    void print() const {
        static_cast<const Derived *>(this)->printImpl();
    }
};

class Foo : public Printable<Foo> {
public:
    void printImpl() const { cout << "I am Foo" << endl; }
};

Foo f;
f.print();  // resolved at compile time — no virtual call`} />
          </div>
        </div>
      </Section>

      <Section num="8" title="Modern C++ Features">
        <CodeBlock language="cpp" code={`// Range-based for (C++11)
for (const auto &item : container) { ... }

// auto type deduction
auto x = 42;            // int
auto s = "hello"s;      // std::string (with 's' literal)
auto v = vector{1,2,3}; // vector<int> (C++17 CTAD)

// Structured bindings (C++17) — like Python tuple unpacking
auto [key, value] = *map.begin();
auto [a, b, c]    = make_tuple(1, "two", 3.0);

// std::optional (C++17) — Java's Optional<T>
#include <optional>
optional<string> find_user(int id) {
    if (id == 1) return "Alice";
    return nullopt;
}
auto user = find_user(1);
if (user.has_value()) cout << *user;
auto name = find_user(2).value_or("Unknown");

// std::variant (C++17) — tagged union (like Rust enum)
#include <variant>
using Shape = variant<Circle, Rectangle, Triangle>;
Shape s = Circle{5.0};
visit([](const auto &shape) { cout << shape.area(); }, s);

// Ranges (C++20) — lazy pipelines like Java Streams
#include <ranges>
auto result = views::iota(1, 10)
    | views::filter([](int x){ return x % 2 == 0; })
    | views::transform([](int x){ return x * x; });
for (int v : result) cout << v << " ";  // 4 16 36 64`} />
      </Section>

      <Section num="9" title="Mini Project: Generic Matrix">
        <CodeBlock language="cpp" code={`#include <vector>
#include <stdexcept>
#include <iostream>
using namespace std;

template<typename T>
class Matrix {
    vector<vector<T>> data;
    size_t rows_, cols_;
public:
    Matrix(size_t rows, size_t cols, T init = T{})
        : data(rows, vector<T>(cols, init)), rows_(rows), cols_(cols) {}

    T &operator()(size_t r, size_t c) {
        if (r >= rows_ || c >= cols_) throw out_of_range("Index out of bounds");
        return data[r][c];
    }

    Matrix operator+(const Matrix &other) const {
        if (rows_ != other.rows_ || cols_ != other.cols_)
            throw invalid_argument("Size mismatch");
        Matrix result(rows_, cols_);
        for (size_t i = 0; i < rows_; ++i)
            for (size_t j = 0; j < cols_; ++j)
                result(i,j) = data[i][j] + other.data[i][j];
        return result;
    }

    void print() const {
        for (auto &row : data) {
            for (auto &v : row) cout << v << " ";
            cout << "\\n";
        }
    }

    size_t rows() const { return rows_; }
    size_t cols() const { return cols_; }
};

int main() {
    Matrix<int> a(2, 2, 1);
    Matrix<int> b(2, 2, 2);
    auto c = a + b;
    c.print();   // 3 3 / 3 3
}`} />
      </Section>

      <Section num="10" title="Register & ALU Operations — C vs C++">
        <p>C++ compiles to the same machine instructions as C for arithmetic and bitwise ops. A <code>uint8_t</code> AND in C++ costs exactly 1 clock cycle, identical to C. The abstractions (classes, templates, RAII) have <strong>zero runtime overhead</strong> when the optimizer runs — this is the zero-overhead principle.</p>
        <InfoBox>The C++ standard guarantees: "You don't pay for what you don't use." Bitwise ops on primitives in C++ produce the same single-instruction assembly as C.</InfoBox>
        <BitRegSim />
        <Sub title="C++ vs C: same bits, safer wrappers">
          <CompareBlock
            javaLabel="C (raw)"
            otherLabel="C++ (typed wrapper)"
            language="cpp"
            javaCode={`// C: raw uint8_t manipulation
uint8_t flags = 0;
flags |= (1 << 2);   // set bit 2
flags &= ~(1 << 2);  // clear bit 2
if (flags & (1 << 2)) { }  // test bit 2`}
            otherCode={`// C++: bitset gives named access
#include <bitset>
bitset<8> flags;
flags.set(2);        // set bit 2
flags.reset(2);      // clear bit 2
if (flags.test(2)) { }  // test bit 2
// Same assembly output after optimization`}
          />
        </Sub>
      </Section>
    </div>
  )
}
