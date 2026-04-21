import CodeBlock from '../components/CodeBlock'
import CompareBlock from '../components/CompareBlock'
import Section, { Sub, InfoBox, WarnBox, TipBox, DangerBox } from '../components/Section'
import { PointerViz, StackHeapViz, BitRegSim } from '../components/CLangSims'

export default function CPage() {
  return (
    <div>
      <div className="page-hero">
        <div className="lang-icon">🔵</div>
        <div>
          <h1>C Language</h1>
          <p>The foundation of modern computing. C gives you direct memory control, no garbage collector, and compiles to native machine code. Java was designed as "C without the footguns" — studying C reveals what Java protects you from.</p>
          <div className="badges">
            <span className="badge red">Manual Memory</span>
            <span className="badge">Static Typing</span>
            <span className="badge green">Compiled</span>
            <span className="badge yellow">Procedural</span>
          </div>
        </div>
      </div>

      <Section num="1" title="Syntax and Program Structure">
        <p>A C program must have a <code>main()</code> function. All code lives in functions (there are no classes). Every statement ends with a semicolon. Header files (<code>.h</code>) declare functions; source files (<code>.c</code>) define them.</p>
        <CodeBlock language="c" code={`// hello.c
#include <stdio.h>    // standard input/output header
#include <stdlib.h>   // memory allocation, exit
#include <string.h>   // string functions

int main(int argc, char *argv[]) {
    printf("Hello, World!\\n");

    // argc = number of args, argv = array of strings
    if (argc > 1) {
        printf("First arg: %s\\n", argv[1]);
    }

    return 0;   // 0 = success (OS reads this)
}
// Compile: gcc -Wall -o hello hello.c
// Run:     ./hello`} />
        <Sub title="Data Types">
          <CodeBlock language="c" code={`// Primitive types — sizes vary by platform!
int    i = 42;          // typically 4 bytes
long   l = 42L;         // typically 8 bytes
float  f = 3.14f;       // 4 bytes
double d = 3.14;        // 8 bytes
char   c = 'A';         // 1 byte (ASCII value)
char   s[] = "hello";   // string = array of chars + null terminator

// Fixed-size types (use these for portability!)
#include <stdint.h>
int8_t  a = 127;
int32_t b = 2147483647;
uint64_t c = 18446744073709551615ULL;
// _Bool (or bool with <stdbool.h>)
#include <stdbool.h>
bool flag = true;

// Constants
#define MAX_SIZE 100          // preprocessor macro
const int MAX = 100;          // typed constant (prefer this)

// Sizeof
printf("%zu\\n", sizeof(int));    // typically 4
printf("%zu\\n", sizeof(double)); // typically 8`} />
        </Sub>
      </Section>

      <Section num="2" title="Pointers — The Core of C">
        <DangerBox>Pointers are C's most powerful and dangerous feature. Java hides all pointers behind references — in C you work with them directly. A pointer is a variable that stores a memory address.</DangerBox>
        <CodeBlock language="c" code={`int x = 42;
int *p = &x;    // p holds the ADDRESS of x  (&x = "address of x")

printf("%d\\n", x);    // 42     (value of x)
printf("%p\\n", p);    // 0x... (address stored in p)
printf("%d\\n", *p);   // 42     (*p = "dereference" = value at address)

*p = 100;               // modify x through pointer
printf("%d\\n", x);    // 100

// Null pointer — like Java null
int *null_ptr = NULL;
if (null_ptr == NULL) {
    printf("Pointer is null\\n");
}
// NEVER dereference NULL: *null_ptr crashes (segfault)

// Pointer arithmetic
int arr[] = {10, 20, 30, 40, 50};
int *ptr = arr;       // points to first element
printf("%d\\n", *ptr);       // 10
printf("%d\\n", *(ptr + 1)); // 20
printf("%d\\n", *(ptr + 2)); // 30
ptr++;                        // move to next element
printf("%d\\n", *ptr);       // 20`} />
        <Sub title="Pointers and Functions (Pass by Reference)">
          <CompareBlock
            javaLabel="Java (always by reference for objects)"
            otherLabel="C (explicit pointer passing)"
            language="c"
            javaCode={`// Java passes primitives by value
void swap(int a, int b) {
    int tmp = a; a = b; b = tmp;
    // caller's a and b are unchanged!
}

// Objects: reference is passed by value
void modify(List<Integer> list) {
    list.add(99);   // modifies caller's list
}`}
            otherCode={`// C: must pass pointer to modify caller's variable
void swap(int *a, int *b) {
    int tmp = *a;
    *a = *b;
    *b = tmp;
}

int x = 5, y = 10;
swap(&x, &y);
printf("%d %d\\n", x, y);  // 10 5  (actually swapped!)`}
          />
        </Sub>
        <PointerViz defaultLang="c" />
      </Section>

      <Section num="3" title="Arrays and Strings">
        <CodeBlock language="c" code={`// Arrays — fixed size, on stack
int nums[5] = {1, 2, 3, 4, 5};
int zeros[10] = {0};          // all zeros
int auto_size[] = {1,2,3};    // size inferred = 3

// Access
nums[0] = 10;    // no bounds checking! overflow is undefined behavior
printf("%d\\n", nums[4]);

// Multi-dimensional array
int matrix[3][4] = {
    {1, 2, 3, 4},
    {5, 6, 7, 8},
    {9, 10, 11, 12}
};
printf("%d\\n", matrix[1][2]);  // 7

// Strings = char arrays
char name[20] = "Alice";       // null-terminated: A,l,i,c,e,\\0
char *greeting = "Hello";      // string literal (read-only!)

// String functions
#include <string.h>
strlen(name);             // 5 (without null)
strcpy(dest, src);        // copy string (dangerous if dest too small!)
strncpy(dest, src, n);    // safer — copy at most n chars
strcat(dest, src);        // concatenate
strcmp(s1, s2);           // compare: 0=equal, <0, >0
strstr(haystack, needle); // find substring (like String.contains)

// Safe string formatting
char buf[256];
snprintf(buf, sizeof(buf), "Hello %s, you are %d", name, age);`} />
      </Section>

      <Section num="4" title="Memory Management — malloc / free">
        <DangerBox>Java has automatic garbage collection. In C, YOU are the garbage collector. Every <code>malloc()</code> must have a matching <code>free()</code>. Forgetting is a memory leak; double-freeing or using freed memory causes crashes.</DangerBox>
        <CodeBlock language="c" code={`#include <stdlib.h>

// Allocate on the HEAP
int *arr = malloc(10 * sizeof(int));    // 10 integers
if (arr == NULL) {                       // ALWAYS check!
    fprintf(stderr, "Out of memory\\n");
    exit(1);
}

// Use the memory
for (int i = 0; i < 10; i++) {
    arr[i] = i * i;
}

// Resize
int *bigger = realloc(arr, 20 * sizeof(int));
if (bigger == NULL) {
    free(arr);   // realloc failed, original still valid
    exit(1);
}
arr = bigger;

// Free — always free when done
free(arr);
arr = NULL;    // prevent "use after free" bugs

// calloc — allocate + zero-initialize
int *zeros = calloc(100, sizeof(int));   // 100 zeroed ints
free(zeros);

// Stack vs Heap
int stack_var = 42;       // on stack — auto freed when function returns
int *heap_var = malloc(sizeof(int));  // on heap — lives until free()
*heap_var = 42;
free(heap_var);`} />
        <Sub title="Common Memory Bugs">
          <table>
            <thead><tr><th>Bug</th><th>Description</th><th>Java equivalent</th></tr></thead>
            <tbody>
              <tr><td>Memory leak</td><td>malloc without free</td><td>Impossible (GC handles it)</td></tr>
              <tr><td>Buffer overflow</td><td>Write past array end</td><td>ArrayIndexOutOfBoundsException</td></tr>
              <tr><td>Dangling pointer</td><td>Use pointer after free()</td><td>Impossible (GC prevents)</td></tr>
              <tr><td>Double free</td><td>free() called twice</td><td>Impossible</td></tr>
              <tr><td>Null deref</td><td>Dereference NULL</td><td>NullPointerException</td></tr>
              <tr><td>Segfault</td><td>Invalid memory access</td><td>Various runtime exceptions</td></tr>
            </tbody>
          </table>
        </Sub>
        <StackHeapViz defaultLang="c" />
      </Section>

      <Section num="5" title="Structs — C's Classes">
        <p>C has no classes. <code>struct</code> groups data (no methods). Functions that operate on a struct are defined separately and take a pointer to the struct as first argument — this is exactly how C++ classes work under the hood, and why Python/Java's <code>self/this</code> exists.</p>
        <CodeBlock language="c" code={`// Define struct
typedef struct {
    char name[50];
    int age;
    float salary;
} Employee;

// Create instances
Employee e1 = {"Alice", 30, 75000.0f};
Employee e2 = {.name="Bob", .age=25, .salary=60000.0f};

// Access with . (value) or -> (pointer)
printf("%s\\n", e1.name);

Employee *ptr = &e1;
printf("%s\\n", ptr->name);   // equivalent to (*ptr).name
ptr->age = 31;

// Dynamic allocation of struct
Employee *emp = malloc(sizeof(Employee));
if (!emp) exit(1);
strncpy(emp->name, "Charlie", sizeof(emp->name)-1);
emp->age = 28;
emp->salary = 65000.0f;
// Use emp...
free(emp);

// Struct with methods (C-style OOP)
typedef struct {
    int balance;
    int (*deposit)(struct Account*, int);   // function pointer
} Account;

int account_deposit(Account *self, int amount) {
    self->balance += amount;
    return self->balance;
}

Account acc = {100, account_deposit};
acc.deposit(&acc, 50);   // acc.balance = 150`} />
      </Section>

      <Section num="6" title="Control Flow and Functions">
        <CodeBlock language="c" code={`// if / else / switch
if (x > 0) { ... }
else if (x < 0) { ... }
else { ... }

switch (day) {
    case 1: printf("Mon\\n"); break;   // break required!
    case 2: printf("Tue\\n"); break;
    default: printf("Other\\n");
}

// Loops
for (int i = 0; i < n; i++) { ... }
while (condition) { ... }
do { ... } while (condition);

// Functions
int max(int a, int b) {
    return a > b ? a : b;
}

// Function pointer (enables callbacks/strategy pattern)
int apply(int (*operation)(int, int), int a, int b) {
    return operation(a, b);
}

int add(int a, int b) { return a + b; }
int mul(int a, int b) { return a * b; }

printf("%d\\n", apply(add, 3, 4));  // 7
printf("%d\\n", apply(mul, 3, 4));  // 12

// typedef for cleaner function pointer syntax
typedef int (*BinaryOp)(int, int);
BinaryOp op = add;
printf("%d\\n", op(5, 3));  // 8`} />
      </Section>

      <Section num="7" title="File I/O">
        <CodeBlock language="c" code={`#include <stdio.h>

// Writing to a file
FILE *f = fopen("data.txt", "w");  // "r"=read, "w"=write, "a"=append
if (f == NULL) {
    perror("fopen failed");
    exit(1);
}
fprintf(f, "Name: %s, Age: %d\\n", "Alice", 30);
fclose(f);

// Reading from a file
FILE *rf = fopen("data.txt", "r");
char line[256];
while (fgets(line, sizeof(line), rf) != NULL) {
    printf("%s", line);
}
fclose(rf);

// Binary I/O
FILE *bf = fopen("data.bin", "wb");
int nums[] = {1, 2, 3, 4, 5};
fwrite(nums, sizeof(int), 5, bf);
fclose(bf);`} />
      </Section>

      <Section num="8" title="Design Patterns in C">

        <div className="pattern-card">
          <div className="pattern-card-header">
            <span className="pattern-icon">🔒</span>
            <div><div className="pattern-title">Singleton (via static variable)</div></div>
          </div>
          <div className="pattern-card-body">
            <CodeBlock language="c" code={`typedef struct { int value; } Config;

Config *get_config() {
    static Config instance = {0};   // initialized once, persists
    static int initialized = 0;
    if (!initialized) {
        instance.value = 42;
        initialized = 1;
    }
    return &instance;
}`} />
          </div>
        </div>

        <div className="pattern-card">
          <div className="pattern-card-header">
            <span className="pattern-icon">🎯</span>
            <div><div className="pattern-title">Strategy Pattern via Function Pointers</div></div>
          </div>
          <div className="pattern-card-body">
            <CodeBlock language="c" code={`typedef void (*SortFn)(int*, int);

void bubble_sort(int *arr, int n) { /* ... */ }
void quick_sort(int *arr, int n)  { /* ... */ }

typedef struct {
    SortFn sort;
} Sorter;

void sorter_init(Sorter *s, SortFn strategy) {
    s->sort = strategy;
}

Sorter s;
sorter_init(&s, quick_sort);
s.sort(my_array, 10);`} />
          </div>
        </div>

        <div className="pattern-card">
          <div className="pattern-card-header">
            <span className="pattern-icon">🏭</span>
            <div><div className="pattern-title">Factory (vtable / polymorphism)</div></div>
          </div>
          <div className="pattern-card-body">
            <CodeBlock language="c" code={`// Virtual dispatch table (how C++ implements virtual functions)
typedef struct {
    void (*speak)(void *self);
    void (*destroy)(void *self);
} AnimalVTable;

typedef struct {
    AnimalVTable *vtable;
    char name[32];
} Animal;

// Dog implementation
void dog_speak(void *self) {
    Animal *a = (Animal*)self;
    printf("%s says: Woof!\\n", a->name);
}

AnimalVTable dog_vtable = { dog_speak, free };

Animal *create_dog(const char *name) {
    Animal *dog = malloc(sizeof(Animal));
    dog->vtable = &dog_vtable;
    strncpy(dog->name, name, 31);
    return dog;
}

Animal *a = create_dog("Rex");
a->vtable->speak(a);     // Rex says: Woof!`} />
          </div>
        </div>
      </Section>

      <Section num="9" title="Mini Project: Linked List">
        <CodeBlock language="c" code={`#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct Node {
    int value;
    struct Node *next;
} Node;

typedef struct {
    Node *head;
    int size;
} LinkedList;

LinkedList *list_create() {
    LinkedList *l = malloc(sizeof(LinkedList));
    l->head = NULL;
    l->size = 0;
    return l;
}

void list_push_front(LinkedList *l, int value) {
    Node *n = malloc(sizeof(Node));
    n->value = value;
    n->next = l->head;
    l->head = n;
    l->size++;
}

void list_print(const LinkedList *l) {
    for (Node *n = l->head; n != NULL; n = n->next) {
        printf("%d -> ", n->value);
    }
    printf("NULL\\n");
}

void list_free(LinkedList *l) {
    Node *curr = l->head;
    while (curr != NULL) {
        Node *next = curr->next;
        free(curr);
        curr = next;
    }
    free(l);
}

int main() {
    LinkedList *list = list_create();
    list_push_front(list, 3);
    list_push_front(list, 2);
    list_push_front(list, 1);
    list_print(list);   // 1 -> 2 -> 3 -> NULL
    list_free(list);
    return 0;
}`} />
      </Section>

      <Section num="10" title="Register & ALU Operations">
        <p>At the hardware level, arithmetic and bitwise operations happen in the CPU's ALU (Arithmetic Logic Unit) on registers. Each operation costs exactly <strong>1 clock cycle</strong> — the same whether you write it in C or C++. Understanding this helps you write optimal low-level code.</p>
        <InfoBox>In C, register-level operations are expressed with bitwise operators: <code>&amp;</code>, <code>|</code>, <code>^</code>, <code>~</code>, <code>&lt;&lt;</code>, <code>&gt;&gt;</code>. These map 1:1 to CPU instructions.</InfoBox>
        <BitRegSim />
        <Sub title="Common register patterns in C">
          <CodeBlock language="c" code={`uint8_t reg = 0b00000000;

// Set bit 3 (OR with mask)
reg |= (1 << 3);         // reg = 0b00001000

// Clear bit 3 (AND with inverted mask)
reg &= ~(1 << 3);        // reg = 0b00000000

// Toggle bit 5 (XOR with mask)
reg ^= (1 << 5);         // reg = 0b00100000

// Test if bit 4 is set
if (reg & (1 << 4)) {
    // bit 4 is high
}

// Extract a 4-bit field (bits 3:0)
uint8_t nibble = reg & 0x0F;

// Swap nibbles
uint8_t swapped = ((reg << 4) | (reg >> 4));`} />
        </Sub>
      </Section>
    </div>
  )
}
