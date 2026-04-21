import CodeBlock from '../components/CodeBlock'
import CompareBlock from '../components/CompareBlock'
import Section, { Sub, InfoBox, WarnBox, TipBox } from '../components/Section'

export default function PythonPage() {
  return (
    <div>
      <div className="page-hero">
        <div className="lang-icon">🐍</div>
        <div>
          <h1>Python</h1>
          <p>A dynamically typed, interpreted, high-level language celebrated for its readability and massive ecosystem. Python trades Java's verbosity for expressiveness — the same idea in 3 lines instead of 20.</p>
          <div className="badges">
            <span className="badge">Dynamic Typing</span>
            <span className="badge green">Interpreted</span>
            <span className="badge yellow">GIL (CPython)</span>
            <span className="badge purple">Multi-paradigm</span>
          </div>
        </div>
      </div>

      <div className="toc">
        <div className="toc-title">Contents</div>
        <ul>
          {['Syntax & Structure','Variables & Types','Control Flow','Functions','OOP','Functional Programming','Error Handling','Collections','Iteration','Modules','Memory','Concurrency','Design Patterns','Idioms','Mini Project'].map((t,i) => (
            <li key={t}><a href={`#s${i+1}`}>{i+1}. {t}</a></li>
          ))}
        </ul>
      </div>

      {/* 1. Syntax */}
      <Section num="1" title="Syntax and Program Structure">
        <p>Python uses <strong>indentation</strong> instead of curly braces to define blocks. There are no semicolons, no type annotations required, and no class wrapping your main logic. Compared to Java, a Python program can start executing immediately from the top of the file.</p>
        <CompareBlock
          javaLabel="Java"
          otherLabel="Python"
          language="python"
          javaCode={`public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`}
          otherCode={`print("Hello, World!")

# Or as a module-guarded script:
if __name__ == "__main__":
    print("Hello, World!")`}
        />
        <InfoBox>The <code>if __name__ == "__main__"</code> guard is Python's equivalent of Java's <code>main()</code> method — it ensures code only runs when the file is executed directly, not imported.</InfoBox>
        <Sub title="Comments and Docstrings">
          <CodeBlock language="python" code={`# Single-line comment

"""
Multi-line string — used as docstrings
when placed at the start of a module, class, or function.
"""

def greet(name):
    """Return a greeting for the given name."""
    return f"Hello, {name}!"`} />
        </Sub>
      </Section>

      {/* 2. Variables */}
      <Section num="2" title="Variables and Data Types">
        <p>Python is <strong>dynamically typed</strong> — you never declare a type. Variables are just names bound to objects. Every value is an object, including integers and booleans (unlike Java's primitives).</p>
        <CodeBlock language="python" code={`# No type declaration needed
x = 42              # int
pi = 3.14           # float
name = "Alice"      # str
active = True       # bool
nothing = None      # NoneType (Java's null)

# Multiple assignment
a, b, c = 1, 2, 3   # tuple unpacking
a, b = b, a         # swap without temp variable!

# Type introspection
print(type(x))      # <class 'int'>
print(isinstance(x, int))  # True

# Python 3.10+ type hints (optional, for tooling)
age: int = 25
price: float = 9.99`} />
        <Sub title="Type System">
          <InfoBox><strong>Dynamic + Strong:</strong> Python resolves types at runtime (dynamic) but does NOT silently coerce incompatible types (strong). <code>"3" + 3</code> raises a <code>TypeError</code> — unlike JavaScript which would return <code>"33"</code>.</InfoBox>
          <table>
            <thead><tr><th>Java</th><th>Python</th><th>Notes</th></tr></thead>
            <tbody>
              <tr><td>int</td><td>int</td><td>Python ints are arbitrary precision</td></tr>
              <tr><td>double / float</td><td>float</td><td>Always 64-bit</td></tr>
              <tr><td>boolean</td><td>bool</td><td>True/False (capitalized)</td></tr>
              <tr><td>String</td><td>str</td><td>Immutable, Unicode by default</td></tr>
              <tr><td>null</td><td>None</td><td>Singleton object</td></tr>
              <tr><td>char</td><td>str (len 1)</td><td>No char type</td></tr>
              <tr><td>long / BigInteger</td><td>int</td><td>Automatic bignum promotion</td></tr>
            </tbody>
          </table>
        </Sub>
        <Sub title="Strings">
          <CodeBlock language="python" code={`# f-strings (Python 3.6+) — like Java's String.format but readable
name, age = "Alice", 30
msg = f"Name: {name}, Age: {age}, Born: {2024 - age}"

# Multi-line strings
sql = """
    SELECT *
    FROM users
    WHERE active = 1
"""

# String methods
s = "  Hello World  "
print(s.strip())          # "Hello World"
print(s.lower())          # "  hello world  "
print(s.split())          # ['Hello', 'World']
print(",".join(["a","b","c"]))  # "a,b,c"
print("world" in s)       # True  (Java: s.contains("world"))

# Slicing  [start:stop:step]
s = "Python"
print(s[0:3])   # "Pyt"
print(s[-3:])   # "hon"
print(s[::-1])  # "nohtyP"  (reverse)`} />
        </Sub>
      </Section>

      {/* 3. Control Flow */}
      <Section num="3" title="Control Flow">
        <Sub title="if / elif / else">
          <CompareBlock
            javaLabel="Java"
            otherLabel="Python"
            language="python"
            javaCode={`int score = 85;
if (score >= 90) {
    System.out.println("A");
} else if (score >= 80) {
    System.out.println("B");
} else {
    System.out.println("C");
}`}
            otherCode={`score = 85
if score >= 90:
    print("A")
elif score >= 80:
    print("B")
else:
    print("C")

# Ternary (conditional expression)
grade = "Pass" if score >= 60 else "Fail"`}
          />
        </Sub>
        <Sub title="Loops">
          <CodeBlock language="python" code={`# for iterates over ANY iterable (no index counter needed)
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)

# enumerate() — get index + value (replaces for(int i=0; i<list.size(); i++))
for i, fruit in enumerate(fruits):
    print(f"{i}: {fruit}")

# range() — generates numbers lazily
for i in range(10):         # 0..9
    print(i)
for i in range(2, 10, 2):  # 2,4,6,8  (start, stop, step)
    print(i)

# while loop
count = 0
while count < 5:
    print(count)
    count += 1

# Loop control
for n in range(20):
    if n % 2 == 0:
        continue   # skip even
    if n > 9:
        break      # stop at 10
    print(n)

# for...else — runs if loop was NOT broken (unique to Python!)
for n in range(5):
    if n == 10:
        break
else:
    print("Loop completed without break")  # this prints`} />
        </Sub>
        <Sub title="Pattern Matching (Python 3.10+)">
          <p>Python's <code>match</code> statement is similar to Java's <code>switch</code> but far more powerful — it can destructure objects, tuples, and match on types.</p>
          <CodeBlock language="python" code={`# Basic match — like Java switch
command = "quit"
match command:
    case "quit":
        print("Quitting")
    case "help":
        print("Showing help")
    case _:          # default (wildcard)
        print("Unknown command")

# Structural pattern matching — destructuring
point = (1, 0)
match point:
    case (0, 0):
        print("Origin")
    case (x, 0):
        print(f"On x-axis at {x}")
    case (0, y):
        print(f"On y-axis at {y}")
    case (x, y):
        print(f"Point at ({x}, {y})")

# Match with class patterns
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

p = Point(1, 2)
match p:
    case Point(x=0, y=0):
        print("origin")
    case Point(x=x, y=y):
        print(f"x={x}, y={y}")`} />
        </Sub>
      </Section>

      {/* 4. Functions */}
      <Section num="4" title="Functions">
        <CodeBlock language="python" code={`# Basic function
def add(a, b):
    return a + b

# Default parameters (like Java overloading, but simpler)
def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

greet("Alice")           # "Hello, Alice!"
greet("Bob", "Hi")       # "Hi, Bob!"

# Keyword arguments — call with any order
def create_user(name, age, admin=False):
    return {"name": name, "age": age, "admin": admin}

create_user(age=25, name="Alice", admin=True)

# *args — variadic positional (Java's varargs)
def sum_all(*numbers):
    return sum(numbers)

sum_all(1, 2, 3, 4)  # 10

# **kwargs — variadic keyword arguments (no Java equivalent)
def log(**options):
    for key, val in options.items():
        print(f"{key} = {val}")

log(level="INFO", message="Started", port=8080)

# Multiple return values (returns a tuple)
def min_max(nums):
    return min(nums), max(nums)

lo, hi = min_max([3,1,4,1,5])   # unpacking

# Type hints (optional, improves IDE support)
def divide(a: float, b: float) -> float:
    if b == 0:
        raise ValueError("Cannot divide by zero")
    return a / b`} />
        <Sub title="First-Class Functions">
          <p>Functions in Python are objects. You can assign them to variables, pass them as arguments, and return them from other functions — just like Java's <code>Function&lt;T,R&gt;</code> interface, but without the boilerplate.</p>
          <CodeBlock language="python" code={`def square(x):
    return x * x

# Assign function to variable
op = square
print(op(5))  # 25

# Pass function as argument
def apply(func, value):
    return func(value)

print(apply(square, 4))   # 16
print(apply(str.upper, "hello"))  # "HELLO"

# Return function from function
def multiplier(factor):
    def multiply(x):
        return x * factor
    return multiply

triple = multiplier(3)
print(triple(7))   # 21`} />
        </Sub>
      </Section>

      {/* 5. OOP */}
      <Section num="5" title="Object-Oriented Programming">
        <Sub title="Classes and Objects">
          <CompareBlock
            javaLabel="Java"
            otherLabel="Python"
            language="python"
            javaCode={`public class Person {
    private String name;
    private int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String getName() { return name; }
    public int getAge() { return age; }

    @Override
    public String toString() {
        return "Person(" + name + ", " + age + ")";
    }
}`}
            otherCode={`class Person:
    def __init__(self, name: str, age: int):
        self.name = name   # public by default
        self._age = age    # _ = convention for "private"

    @property
    def age(self):
        return self._age

    def __repr__(self):
        return f"Person({self.name!r}, {self._age})"

p = Person("Alice", 30)
print(p.name)   # Alice
print(p.age)    # 30 (via property)
print(p)        # Person('Alice', 30)`}
          />
        </Sub>
        <Sub title="self, __init__, and Encapsulation">
          <p>Python's <code>self</code> is Java's <code>this</code>, but it must be explicitly declared as the first parameter of every instance method. There is no true <code>private</code> keyword — by convention, <code>_name</code> means "internal use" and <code>__name</code> triggers name mangling to discourage outside access.</p>
          <CodeBlock language="python" code={`class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.__balance = balance   # name-mangled: _BankAccount__balance

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("Amount must be positive")
        self.__balance += amount

    def withdraw(self, amount):
        if amount > self.__balance:
            raise ValueError("Insufficient funds")
        self.__balance -= amount

    @property
    def balance(self):
        return self.__balance

    def __str__(self):
        return f"Account({self.owner}, ${self.__balance})"

acc = BankAccount("Alice", 100)
acc.deposit(50)
print(acc.balance)   # 150
# acc.__balance would raise AttributeError`} />
        </Sub>
        <Sub title="Inheritance and super()">
          <CodeBlock language="python" code={`class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        raise NotImplementedError("Subclass must implement speak()")

    def describe(self):
        return f"I am {self.name}"

class Dog(Animal):          # Java: class Dog extends Animal
    def __init__(self, name, breed):
        super().__init__(name)   # Java: super(name)
        self.breed = breed

    def speak(self):         # method override
        return "Woof!"

    def describe(self):
        base = super().describe()   # call parent method
        return f"{base}, a {self.breed}"

class Cat(Animal):
    def speak(self):
        return "Meow!"

# Polymorphism
animals = [Dog("Rex", "Husky"), Cat("Whiskers")]
for a in animals:
    print(a.speak())   # Woof! / Meow!`} />
        </Sub>
        <Sub title="Abstract Classes and Interfaces">
          <p>Python uses the <code>abc</code> module for abstract classes. There is no <code>interface</code> keyword — instead use <strong>Abstract Base Classes (ABC)</strong> or duck typing (if it has a <code>speak()</code> method, it's "speakable").</p>
          <CodeBlock language="python" code={`from abc import ABC, abstractmethod

class Shape(ABC):           # abstract class
    @abstractmethod
    def area(self) -> float:    # abstract method
        pass

    @abstractmethod
    def perimeter(self) -> float:
        pass

    def describe(self):         # concrete method
        return f"Area: {self.area():.2f}, Perimeter: {self.perimeter():.2f}"

class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius

    def area(self):
        import math
        return math.pi * self.radius ** 2

    def perimeter(self):
        import math
        return 2 * math.pi * self.radius

c = Circle(5)
print(c.describe())   # Area: 78.54, Perimeter: 31.42

# Duck typing — Python's alternative to interfaces
# Any object with a "speak()" method can be used where a "Speaker" is expected
class Robot:
    def speak(self):
        return "Beep boop"

def make_noise(speaker):   # no type constraint needed
    print(speaker.speak())

make_noise(Dog("Rex", "Lab"))   # works
make_noise(Robot())             # also works`} />
        </Sub>
        <Sub title="Class Methods and Static Methods">
          <CodeBlock language="python" code={`class Counter:
    _count = 0   # class variable (shared across all instances)

    def __init__(self):
        Counter._count += 1
        self.id = Counter._count

    @classmethod                    # has access to class, not instance
    def get_count(cls):
        return cls._count

    @staticmethod                   # no access to class or instance
    def validate(n):
        return isinstance(n, int) and n > 0

c1 = Counter()
c2 = Counter()
print(Counter.get_count())  # 2
print(Counter.validate(5))  # True`} />
        </Sub>
        <Sub title="Dataclasses (Python 3.7+)">
          <p>Dataclasses auto-generate <code>__init__</code>, <code>__repr__</code>, and <code>__eq__</code> — like Java's Lombok <code>@Data</code> or a Java record.</p>
          <CodeBlock language="python" code={`from dataclasses import dataclass, field

@dataclass
class Point:
    x: float
    y: float
    label: str = "origin"  # default value

@dataclass(frozen=True)     # immutable (like Java record)
class ImmutablePoint:
    x: float
    y: float

p = Point(1.0, 2.0)
print(p)               # Point(x=1.0, y=2.0, label='origin')
p1 = Point(1.0, 2.0)
p2 = Point(1.0, 2.0)
print(p1 == p2)        # True (auto __eq__)`} />
        </Sub>
      </Section>

      {/* 6. Functional Programming */}
      <Section num="6" title="Functional Programming">
        <Sub title="Lambda Expressions">
          <CompareBlock
            javaLabel="Java"
            otherLabel="Python"
            language="python"
            javaCode={`// Java lambda
Function<Integer, Integer> square = x -> x * x;
Comparator<String> byLen = (a, b) -> a.length() - b.length();

// Java stream
List<Integer> evens = list.stream()
    .filter(x -> x % 2 == 0)
    .collect(Collectors.toList());`}
            otherCode={`# Python lambda
square = lambda x: x * x
by_len = lambda a, b: len(a) - len(b)

# Python uses built-in map/filter/sorted
nums = [1, 2, 3, 4, 5, 6]
evens = list(filter(lambda x: x % 2 == 0, nums))

# But list comprehensions are more Pythonic:
evens = [x for x in nums if x % 2 == 0]`}
          />
        </Sub>
        <Sub title="map / filter / reduce">
          <CodeBlock language="python" code={`from functools import reduce

numbers = [1, 2, 3, 4, 5]

# map — transform each element
squares = list(map(lambda x: x**2, numbers))   # [1,4,9,16,25]
squares = [x**2 for x in numbers]              # same, more Pythonic

# filter — keep elements matching predicate
evens = list(filter(lambda x: x % 2 == 0, numbers))  # [2,4]
evens = [x for x in numbers if x % 2 == 0]           # more Pythonic

# reduce — fold to single value (like Java's Stream.reduce)
total = reduce(lambda acc, x: acc + x, numbers)  # 15
total = sum(numbers)                             # built-in is better

# Chaining operations
result = list(map(
    lambda x: x**2,
    filter(lambda x: x % 2 == 0, numbers)
))  # [4, 16]

# Cleaner with comprehension
result = [x**2 for x in numbers if x % 2 == 0]`} />
        </Sub>
        <Sub title="Closures">
          <CodeBlock language="python" code={`# A closure captures variables from its enclosing scope
def make_counter(start=0):
    count = start

    def increment(by=1):
        nonlocal count      # must declare nonlocal to modify outer var
        count += by
        return count

    def reset():
        nonlocal count
        count = start

    return increment, reset

inc, rst = make_counter(10)
print(inc())    # 11
print(inc(5))   # 16
rst()
print(inc())    # 11 again`} />
        </Sub>
        <Sub title="List / Dict / Set Comprehensions">
          <CodeBlock language="python" code={`# List comprehension: [expression for item in iterable if condition]
squares = [x**2 for x in range(10)]
evens   = [x for x in range(20) if x % 2 == 0]
matrix  = [[row*col for col in range(5)] for row in range(5)]

# Dict comprehension
word_len = {word: len(word) for word in ["apple", "fig", "banana"]}
# {'apple': 5, 'fig': 3, 'banana': 6}

# Set comprehension
unique_lengths = {len(w) for w in ["apple", "fig", "pear", "ant"]}
# {5, 3, 4}

# Generator expression (lazy — like Java Stream)
total = sum(x**2 for x in range(1_000_000))  # no list created!`} />
        </Sub>
      </Section>

      {/* 7. Error Handling */}
      <Section num="7" title="Error Handling and Null Safety">
        <Sub title="Exceptions">
          <p>Python has only <strong>unchecked exceptions</strong> — unlike Java there are no checked exceptions. You never have to declare <code>throws</code>. The hierarchy: <code>BaseException → Exception → specific exceptions</code>.</p>
          <CompareBlock
            javaLabel="Java"
            otherLabel="Python"
            language="python"
            javaCode={`try {
    int result = 10 / 0;
} catch (ArithmeticException e) {
    System.out.println("Error: " + e.getMessage());
} catch (Exception e) {
    System.out.println("General: " + e);
} finally {
    System.out.println("Always runs");
}`}
            otherCode={`try:
    result = 10 / 0
except ZeroDivisionError as e:
    print(f"Error: {e}")
except (ValueError, TypeError) as e:
    print(f"Value/Type error: {e}")
except Exception as e:
    print(f"General: {e}")
else:
    print("No exception occurred")   # unique to Python
finally:
    print("Always runs")`}
          />
        </Sub>
        <Sub title="Custom Exceptions">
          <CodeBlock language="python" code={`class AppError(Exception):
    """Base exception for this application."""
    pass

class ValidationError(AppError):
    def __init__(self, field, message):
        self.field = field
        super().__init__(f"Validation failed on '{field}': {message}")

class NotFoundError(AppError):
    def __init__(self, resource, id):
        super().__init__(f"{resource} with id={id} not found")

def get_user(user_id):
    if not isinstance(user_id, int):
        raise ValidationError("user_id", "must be an integer")
    if user_id <= 0:
        raise NotFoundError("User", user_id)
    return {"id": user_id, "name": "Alice"}

try:
    user = get_user(-1)
except NotFoundError as e:
    print(e)   # User with id=-1 not found
except ValidationError as e:
    print(f"Bad input: {e.field}")
except AppError as e:
    print(f"App error: {e}")`} />
        </Sub>
        <Sub title="None / Optional Patterns">
          <WarnBox>Python has no <code>Optional&lt;T&gt;</code>. <code>None</code> is Python's null. Best practice is to return <code>None</code> only for "not found" scenarios, and raise exceptions for errors.</WarnBox>
          <CodeBlock language="python" code={`# None checks
user = find_user(42)   # might return None
if user is None:       # always use 'is None', not '== None'
    print("Not found")

# Using 'or' default
name = user.name if user else "Anonymous"
name = getattr(user, 'name', 'Anonymous')

# Walrus operator := (Python 3.8+) — assign and test in one step
if result := expensive_computation():
    process(result)

# Type hints communicate optionality
from typing import Optional

def find_user(id: int) -> Optional[dict]:
    # ...
    return None`} />
        </Sub>
      </Section>

      {/* 8. Collections */}
      <Section num="8" title="Data Structures and Collections">
        <Sub title="List — Java's ArrayList">
          <CodeBlock language="python" code={`# Mutable, ordered, allows duplicates
fruits = ["apple", "banana", "cherry"]
fruits.append("date")       # add to end
fruits.insert(1, "avocado") # insert at index
fruits.remove("banana")     # remove first occurrence
fruits.pop()                # remove and return last
fruits.pop(0)               # remove at index

print(fruits[0])     # first element
print(fruits[-1])    # last element
print(fruits[1:3])   # slice [1,3)

# List operations
a = [1, 2, 3]
b = [4, 5, 6]
c = a + b            # [1,2,3,4,5,6]
c = a * 3            # [1,2,3,1,2,3,1,2,3]

# Sort
nums = [3,1,4,1,5,9,2,6]
nums.sort()                          # in-place
sorted_copy = sorted(nums)           # new list
by_len = sorted(["foo","a","hello"], key=len)  # custom key

# List comprehension
squares = [x**2 for x in range(10) if x % 2 == 0]`} />
        </Sub>
        <Sub title="Tuple — Immutable List">
          <CodeBlock language="python" code={`# Immutable, ordered — use for fixed collections
point = (3, 4)
rgb = (255, 128, 0)
single = (42,)      # trailing comma = tuple of one element!

x, y = point        # unpacking
first, *rest = (1, 2, 3, 4)  # first=1, rest=[2,3,4]

# Named tuples — like Java records
from collections import namedtuple
Point = namedtuple('Point', ['x', 'y'])
p = Point(3, 4)
print(p.x, p.y)   # 3 4
print(p)          # Point(x=3, y=4)`} />
        </Sub>
        <Sub title="Dict — Java's HashMap">
          <CodeBlock language="python" code={`# Mutable, ordered (Python 3.7+), key-value pairs
user = {"name": "Alice", "age": 30, "admin": True}

# Access
print(user["name"])               # "Alice" (KeyError if missing)
print(user.get("email"))          # None (safe)
print(user.get("email", "N/A"))   # "N/A" (default)

# Modify
user["email"] = "alice@example.com"   # add/update
user.update({"age": 31, "role": "admin"})
del user["admin"]

# Iteration
for key in user:
    print(key)
for key, value in user.items():
    print(f"{key}: {value}")
for value in user.values():
    print(value)

# Dict comprehension
squares = {x: x**2 for x in range(5)}   # {0:0, 1:1, 2:4, 3:9, 4:16}

# Merge dicts (Python 3.9+)
d1 = {"a": 1}
d2 = {"b": 2}
merged = d1 | d2    # {"a":1, "b":2}

# defaultdict — auto-creates missing keys
from collections import defaultdict
word_count = defaultdict(int)
for word in "the cat sat on the mat".split():
    word_count[word] += 1`} />
        </Sub>
        <Sub title="Set — Java's HashSet">
          <CodeBlock language="python" code={`# Mutable, unordered, no duplicates
s = {1, 2, 3, 4}
s.add(5)
s.discard(10)   # safe remove (no error if missing)
s.remove(1)     # raises KeyError if missing

a = {1, 2, 3, 4}
b = {3, 4, 5, 6}
print(a | b)    # union:        {1,2,3,4,5,6}
print(a & b)    # intersection: {3,4}
print(a - b)    # difference:   {1,2}
print(a ^ b)    # symmetric diff: {1,2,5,6}
print(a.issubset(b))   # False

# Frozenset — immutable set
fs = frozenset([1, 2, 3])`} />
        </Sub>
      </Section>

      {/* 9. Iteration */}
      <Section num="9" title="Iteration and Data Processing">
        <Sub title="Generators — Lazy Evaluation">
          <p>Generators are Python's equivalent of Java Streams — they compute values lazily, one at a time, using the <code>yield</code> keyword.</p>
          <CodeBlock language="python" code={`# Generator function
def fibonacci():
    a, b = 0, 1
    while True:        # infinite sequence!
        yield a
        a, b = b, a + b

fib = fibonacci()
print(next(fib))   # 0
print(next(fib))   # 1
print(next(fib))   # 1

# Take first 10 fibonacci numbers
from itertools import islice
first_10 = list(islice(fibonacci(), 10))

# Generator expression (lazy list comprehension)
squares = (x**2 for x in range(1_000_000))   # no memory allocation!
first_five = [next(squares) for _ in range(5)]

# Generators are iterable
def count_up(start, end):
    while start <= end:
        yield start
        start += 1

for n in count_up(1, 5):
    print(n)   # 1 2 3 4 5`} />
        </Sub>
        <Sub title="itertools — Functional Iteration">
          <CodeBlock language="python" code={`import itertools

# chain — concatenate iterables
combined = list(itertools.chain([1,2], [3,4], [5,6]))   # [1..6]

# product — cartesian product
for x, y in itertools.product([1,2], [3,4]):
    print(x, y)   # (1,3),(1,4),(2,3),(2,4)

# zip — pair elements (like Java's stream with index)
names = ["Alice", "Bob"]
scores = [95, 87]
for name, score in zip(names, scores):
    print(f"{name}: {score}")

# zip_longest — fill missing with default
import itertools
pairs = list(itertools.zip_longest([1,2,3], [4,5], fillvalue=0))

# takewhile / dropwhile
nums = [1, 2, 3, 10, 4, 5]
taken = list(itertools.takewhile(lambda x: x < 5, nums))   # [1,2,3]`} />
        </Sub>
      </Section>

      {/* 10. Modules */}
      <Section num="10" title="Modules, Packages, and Project Structure">
        <CodeBlock language="python" code={`# Imports
import math                          # import module
import math as m                     # alias
from math import pi, sqrt            # import specific names
from math import *                   # import everything (avoid!)

# Your own modules
# utils.py
def helper():
    return "help"

# main.py
from utils import helper
from . import utils                  # relative import (inside package)
from .models import User             # relative from sub-module

# Package = directory with __init__.py
# myapp/
# ├── __init__.py
# ├── models/
# │   ├── __init__.py
# │   └── user.py
# ├── services/
# │   └── auth.py
# └── main.py`} />
        <Sub title="Dependency Management">
          <CodeBlock language="bash" code={`# requirements.txt (simple)
requests==2.31.0
flask>=3.0.0
sqlalchemy~=2.0

# Install dependencies
pip install -r requirements.txt

# Modern: pyproject.toml with Poetry or uv
poetry init
poetry add requests flask
poetry install

# Virtual environments (always use one!)
python -m venv .venv
source .venv/bin/activate   # macOS/Linux
.venv\\Scripts\\activate       # Windows`} />
        </Sub>
      </Section>

      {/* 11. Memory */}
      <Section num="11" title="Memory Model and Performance">
        <p>Python uses <strong>reference counting + cyclic garbage collection</strong>. Every object has a reference count; when it hits 0, it's freed. CPython has the <strong>Global Interpreter Lock (GIL)</strong> which means only one thread runs Python bytecode at a time.</p>
        <CodeBlock language="python" code={`import sys

# Reference counting
x = [1, 2, 3]
y = x           # both point to same object (like Java references)
y.append(4)
print(x)        # [1, 2, 3, 4]  — x and y are the SAME list

# Copy vs reference
import copy
x = [1, [2, 3]]
shallow = x.copy()       # shallow copy — inner list still shared
deep    = copy.deepcopy(x)  # deep copy — fully independent

# Check reference count
a = "hello"
print(sys.getrefcount(a))   # count (usually n+1 for the getrefcount arg)

# Memory size
print(sys.getsizeof([]))    # 56 bytes
print(sys.getsizeof([1]*1000))  # 8056 bytes

# Value vs identity
a = 256
b = 256
print(a == b)    # True (value equality, like .equals())
print(a is b)    # True (CPython caches small ints -5..256)

a = 1000
b = 1000
print(a == b)    # True
print(a is b)    # False! (different objects)`} />
        <TipBox>Use <code>__slots__</code> in classes to save memory — it prevents the per-instance <code>__dict__</code> from being created. Can reduce memory by 40–70% for many small objects.</TipBox>
      </Section>

      {/* 12. Concurrency */}
      <Section num="12" title="Concurrency and Asynchronous Programming">
        <Sub title="Threading">
          <CodeBlock language="python" code={`import threading
import time

def worker(name, delay):
    print(f"{name} starting")
    time.sleep(delay)
    print(f"{name} done")

# Create threads
t1 = threading.Thread(target=worker, args=("T1", 2))
t2 = threading.Thread(target=worker, args=("T2", 1))
t1.start()
t2.start()
t1.join()
t2.join()

# Threading with a Lock (prevent race conditions)
counter = 0
lock = threading.Lock()

def increment():
    global counter
    with lock:
        counter += 1`} />
        </Sub>
        <Sub title="async / await — asyncio">
          <p>Python's <code>asyncio</code> is the modern approach for I/O-bound concurrency. Like Java's CompletableFuture or Project Loom virtual threads, but cooperative (non-preemptive).</p>
          <CodeBlock language="python" code={`import asyncio
import aiohttp   # async HTTP client

async def fetch(session, url):
    async with session.get(url) as response:
        return await response.text()

async def main():
    urls = [
        "https://api.example.com/users/1",
        "https://api.example.com/users/2",
    ]
    async with aiohttp.ClientSession() as session:
        # Fetch all URLs concurrently
        tasks = [fetch(session, url) for url in urls]
        results = await asyncio.gather(*tasks)
    return results

asyncio.run(main())

# Async generator
async def paginate(client, endpoint):
    page = 1
    while True:
        data = await client.get(f"{endpoint}?page={page}")
        if not data:
            break
        yield data
        page += 1`} />
        </Sub>
        <Sub title="multiprocessing — True Parallelism">
          <CodeBlock language="python" code={`from multiprocessing import Pool
import os

def square(n):
    return n ** 2

if __name__ == "__main__":
    with Pool(processes=os.cpu_count()) as pool:
        results = pool.map(square, range(100))
    print(results[:5])   # [0, 1, 4, 9, 16]`} />
        </Sub>
      </Section>

      {/* 13. Design Patterns */}
      <Section num="13" title="Design Patterns">

        <div className="pattern-card">
          <div className="pattern-card-header">
            <span className="pattern-icon">🔒</span>
            <div>
              <div className="pattern-title">Singleton</div>
              <div className="pattern-desc">Ensure only one instance exists</div>
            </div>
          </div>
          <div className="pattern-card-body">
            <CodeBlock language="python" code={`class Singleton:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

a = Singleton()
b = Singleton()
print(a is b)   # True`} />
          </div>
        </div>

        <div className="pattern-card">
          <div className="pattern-card-header">
            <span className="pattern-icon">🏭</span>
            <div>
              <div className="pattern-title">Factory</div>
              <div className="pattern-desc">Create objects without specifying the exact class</div>
            </div>
          </div>
          <div className="pattern-card-body">
            <CodeBlock language="python" code={`class Animal:
    def speak(self): pass

class Dog(Animal):
    def speak(self): return "Woof"

class Cat(Animal):
    def speak(self): return "Meow"

def animal_factory(kind: str) -> Animal:
    registry = {"dog": Dog, "cat": Cat}
    cls = registry.get(kind)
    if not cls:
        raise ValueError(f"Unknown animal: {kind}")
    return cls()

a = animal_factory("dog")
print(a.speak())  # Woof`} />
          </div>
        </div>

        <div className="pattern-card">
          <div className="pattern-card-header">
            <span className="pattern-icon">🧱</span>
            <div>
              <div className="pattern-title">Builder</div>
              <div className="pattern-desc">Construct complex objects step by step</div>
            </div>
          </div>
          <div className="pattern-card-body">
            <p>Python's keyword arguments and <code>dataclass</code> often eliminate the need for a Builder — but here's the pattern when needed:</p>
            <CodeBlock language="python" code={`class QueryBuilder:
    def __init__(self):
        self._table = ""
        self._conditions = []
        self._limit = None

    def from_table(self, table):
        self._table = table
        return self   # return self for chaining

    def where(self, condition):
        self._conditions.append(condition)
        return self

    def limit(self, n):
        self._limit = n
        return self

    def build(self):
        q = f"SELECT * FROM {self._table}"
        if self._conditions:
            q += " WHERE " + " AND ".join(self._conditions)
        if self._limit:
            q += f" LIMIT {self._limit}"
        return q

query = (QueryBuilder()
    .from_table("users")
    .where("age > 18")
    .where("active = 1")
    .limit(10)
    .build())
print(query)`} />
          </div>
        </div>

        <div className="pattern-card">
          <div className="pattern-card-header">
            <span className="pattern-icon">🎯</span>
            <div>
              <div className="pattern-title">Strategy</div>
              <div className="pattern-desc">Define a family of algorithms, make them interchangeable</div>
            </div>
          </div>
          <div className="pattern-card-body">
            <p>Python's first-class functions make Strategy trivial — pass a function instead of creating an interface hierarchy:</p>
            <CodeBlock language="python" code={`from typing import Callable

# Python way: use functions directly
def bubble_sort(data): ...
def quick_sort(data): ...
def merge_sort(data): ...

class Sorter:
    def __init__(self, strategy: Callable):
        self.strategy = strategy

    def sort(self, data):
        return self.strategy(data)

s = Sorter(strategy=sorted)        # use built-in
s.sort([3,1,2])   # [1,2,3]

# Or just: sorted_data = sorted(data, key=..., reverse=True)`} />
          </div>
        </div>

        <div className="pattern-card">
          <div className="pattern-card-header">
            <span className="pattern-icon">📡</span>
            <div>
              <div className="pattern-title">Observer</div>
              <div className="pattern-desc">Notify subscribers when state changes</div>
            </div>
          </div>
          <div className="pattern-card-body">
            <CodeBlock language="python" code={`class EventEmitter:
    def __init__(self):
        self._listeners: dict[str, list] = {}

    def on(self, event, callback):
        self._listeners.setdefault(event, []).append(callback)
        return self

    def emit(self, event, *args, **kwargs):
        for cb in self._listeners.get(event, []):
            cb(*args, **kwargs)

class Store(EventEmitter):
    def __init__(self):
        super().__init__()
        self._data = {}

    def set(self, key, value):
        old = self._data.get(key)
        self._data[key] = value
        self.emit("change", key, old, value)

store = Store()
store.on("change", lambda k, old, new: print(f"{k}: {old} → {new}"))
store.set("user", "Alice")   # user: None → Alice
store.set("user", "Bob")     # user: Alice → Bob`} />
          </div>
        </div>

        <div className="pattern-card">
          <div className="pattern-card-header">
            <span className="pattern-icon">🎨</span>
            <div>
              <div className="pattern-title">Decorator Pattern (and @decorator syntax)</div>
              <div className="pattern-desc">Add behavior without modifying the original object</div>
            </div>
          </div>
          <div className="pattern-card-body">
            <p>Python's <code>@decorator</code> syntax is a language feature that <em>is</em> the Decorator pattern applied to functions:</p>
            <CodeBlock language="python" code={`import functools
import time

# Function decorator
def timer(func):
    @functools.wraps(func)    # preserve __name__ etc.
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed = time.perf_counter() - start
        print(f"{func.__name__} took {elapsed:.4f}s")
        return result
    return wrapper

def cache(func):
    memo = {}
    @functools.wraps(func)
    def wrapper(*args):
        if args not in memo:
            memo[args] = func(*args)
        return memo[args]
    return wrapper

@timer
@cache
def fib(n):
    if n <= 1: return n
    return fib(n-1) + fib(n-2)

print(fib(30))   # cached + timed`} />
          </div>
        </div>

      </Section>

      {/* 14. Idioms */}
      <Section num="14" title="Idiomatic Python">
        <CodeBlock language="python" code={`# ✅ Pythonic practices

# Use enumerate instead of range(len(...))
for i, item in enumerate(items):  ...

# Use zip for parallel iteration
for name, score in zip(names, scores): ...

# Use dict.get() with default
value = d.get("key", "default")

# Use 'with' for resource management (like Java try-with-resources)
with open("file.txt") as f:
    content = f.read()

# Use _ for unused variables
for _ in range(10):
    do_something()

# Use any() / all() instead of loops
has_adult = any(p.age >= 18 for p in people)
all_valid  = all(x > 0 for x in values)

# Unpack directly
first, *middle, last = [1, 2, 3, 4, 5]

# Swap without temp variable
a, b = b, a

# ❌ Avoid
if x == True:  ...        # use: if x:
if x == None:  ...        # use: if x is None:
for i in range(len(lst)): # use: for item in lst:
    lst[i]                # or:  enumerate(lst)`} />
      </Section>

      {/* 15. Mini Project */}
      <Section num="15" title="Mini Project: Task Manager CLI">
        <CodeBlock language="python" code={`from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional
import json

@dataclass
class Task:
    title: str
    done: bool = False
    created_at: str = field(default_factory=lambda: datetime.now().isoformat())
    id: int = field(default=0)

class TaskManager:
    def __init__(self):
        self._tasks: list[Task] = []
        self._next_id = 1

    def add(self, title: str) -> Task:
        task = Task(title=title, id=self._next_id)
        self._tasks.append(task)
        self._next_id += 1
        return task

    def complete(self, task_id: int) -> Optional[Task]:
        task = self._find(task_id)
        if task:
            task.done = True
        return task

    def _find(self, task_id: int) -> Optional[Task]:
        return next((t for t in self._tasks if t.id == task_id), None)

    @property
    def pending(self) -> list[Task]:
        return [t for t in self._tasks if not t.done]

    def to_json(self) -> str:
        return json.dumps([t.__dict__ for t in self._tasks], indent=2)

# Usage
mgr = TaskManager()
t1 = mgr.add("Buy groceries")
t2 = mgr.add("Write report")
mgr.complete(t1.id)
print(f"Pending: {[t.title for t in mgr.pending]}")
print(mgr.to_json())`} />
      </Section>
    </div>
  )
}
