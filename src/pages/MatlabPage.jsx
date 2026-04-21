import CodeBlock from '../components/CodeBlock'
import CompareBlock from '../components/CompareBlock'
import Section, { Sub, InfoBox, WarnBox, TipBox, DangerBox } from '../components/Section'

const sections = [
  'Syntax and Program Structure',
  'Variables and the Matrix Type System',
  'Matrix Operations — The Core of MATLAB',
  'Indexing and Slicing',
  'Control Flow and Functions',
  'Vectorization — Think in Arrays',
  'Plotting and Visualization',
  'Object-Oriented Programming',
  'String Handling',
  'Cell Arrays and Structs',
  'File I/O and Data Import',
  'Error Handling',
  'Functional Programming',
  'Performance and Profiling',
  'Signal Processing and Toolboxes',
  'Numerical Methods',
  'Unit Testing',
  'Design Patterns',
  'Mini Project: Numerical ODE Solver + Dashboard',
]

export default function MatlabPage() {
  return (
    <div>
      <div className="page-hero">
        <div className="lang-icon">📊</div>
        <div>
          <h1>MATLAB</h1>
          <p>A numerical computing environment and language built for matrix operations. MATLAB's entire type system revolves around matrices — a scalar is a 1×1 matrix. Used in engineering, signal processing, control systems, and scientific computing.</p>
          <div className="badges">
            <span className="badge yellow">Matrix-first</span>
            <span className="badge">Dynamic Typing</span>
            <span className="badge green">Interpreted</span>
            <span className="badge purple">Numeric / Scientific</span>
          </div>
        </div>
      </div>

      <div className="toc">
        <div className="toc-title">Contents</div>
        <ul>
          {sections.map((t, i) => (
            <li key={t}><a href={`#s${i + 1}`}>{i + 1}. {t}</a></li>
          ))}
        </ul>
      </div>

      <Section num="1" title="Syntax and Program Structure">
        <p>MATLAB scripts (<code>.m</code> files) run top-to-bottom. Functions are defined in <code>.m</code> files or at the bottom of a script. Unlike Java, there is no class wrapper — just write code.</p>
        <CompareBlock
          javaLabel="Java"
          otherLabel="MATLAB"
          language="matlab"
          javaCode={`public class Main {
    public static void main(String[] args) {
        int x = 5;
        double[] nums = {1, 2, 3, 4, 5};
        double sum = 0;
        for (double n : nums) sum += n;
        System.out.println("Sum: " + sum);
    }
}`}
          otherCode={`% MATLAB script (main.m)
x = 5;                  % no type declaration
nums = [1 2 3 4 5];     % matrix/vector literal
total = sum(nums);      % built-in sum() — no loop needed!
fprintf('Sum: %g\\n', total);

% Semicolon suppresses output
a = 5;     % silent
b = 5      % prints: b = 5`}
        />
        <InfoBox>MATLAB uses <code>%</code> for comments (not <code>//</code>). Omitting the semicolon after an expression prints the result — very useful in interactive sessions.</InfoBox>
      </Section>

      <Section num="2" title="Variables and the Matrix Type System">
        <CodeBlock language="matlab" code={`% Everything is a matrix (or array)
scalar = 42;             % 1x1 double matrix
row_vec = [1 2 3 4 5];  % 1x5 row vector
col_vec = [1; 2; 3; 4]; % 4x1 column vector (semicolon = new row)

% Matrix literal
A = [1 2 3;
     4 5 6;
     7 8 9];    % 3x3 matrix

% Size and type inspection
size(A)         % [3 3]
size(A, 1)      % 3 (rows)
size(A, 2)      % 3 (cols)
numel(A)        % 9 (total elements)
class(A)        % 'double'
isa(A, 'double')% true

% Data types
x = int32(5);          % integer
f = single(3.14);      % single-precision float
b = true;              % logical
s = 'Hello';           % char array (older string)
s2 = "Hello";          % string object (modern, preferred)
c = 3 + 4i;            % complex number (built-in!)

% Type conversion
double(int32(5))       % 5.0
char(65)               % 'A'
num2str(3.14)          % '3.14'
str2num('42')          % 42`} />
      </Section>

      <Section num="3" title="Matrix Operations — The Core of MATLAB">
        <CodeBlock language="matlab" code={`A = [1 2; 3 4];
B = [5 6; 7 8];

% Matrix arithmetic
C = A + B;       % element-wise addition
C = A * B;       % MATRIX multiplication (dot product)
C = A .* B;      % element-wise multiplication (. prefix = element-wise)
C = A ./ B;      % element-wise division
C = A .^ 2;      % element-wise power
C = A ^ 2;       % matrix power (A*A)

% Transpose
At = A';          % conjugate transpose
At = A.';         % regular transpose (for complex matrices)

% Linear algebra
det(A)            % determinant
inv(A)            % inverse
eig(A)            % eigenvalues and eigenvectors
[V, D] = eig(A)  % V=eigenvectors, D=diagonal eigenvalue matrix
rank(A)           % matrix rank

% Solve Ax = b  (like Java's matrix library)
b = [1; 2];
x = A \\ b;         % backslash = left division = solve linear system
                  % much more efficient than inv(A)*b!

% Matrix creation functions
zeros(3, 4)       % 3x4 zero matrix
ones(2, 5)        % 2x5 ones matrix
eye(4)            % 4x4 identity matrix
rand(3)           % 3x3 random uniform [0,1]
randn(3)          % 3x3 random normal
linspace(0, 1, 100)  % 100 evenly spaced points from 0 to 1
0:0.1:1           % range: 0, 0.1, 0.2, ..., 1.0`} />
      </Section>

      <Section num="4" title="Indexing and Slicing">
        <WarnBox>MATLAB indexing starts at <strong>1</strong>, not 0! This is a fundamental difference from Java, Python, C, and most other languages.</WarnBox>
        <CodeBlock language="matlab" code={`A = magic(4);   % 4x4 magic square

% Single element — 1-indexed!
A(1, 1)         % first element (not A(0,0)!)
A(end, end)     % last element (end = size along that dimension)
A(2, 3)         % row 2, column 3

% Slices (: operator)
A(1, :)         % first row (all columns)
A(:, 2)         % second column (all rows)
A(1:3, 2:4)     % rows 1-3, columns 2-4
A(end-1:end, :) % last two rows

% Linear indexing (column-major order!)
A(5)            % 5th element, counting down columns
A(:)            % all elements as column vector

% Logical indexing — extremely powerful!
v = [10 20 30 40 50];
mask = v > 25;         % [0 0 1 1 1] (logical array)
v(mask)                % [30 40 50]   select elements
v(v > 25) = 0;         % set elements > 25 to 0: [10 20 0 0 0]

% Assignment
A(2, :) = zeros(1, 4);  % set row 2 to zeros
A(:, 3) = [];           % DELETE column 3 (resize matrix!)`} />
      </Section>

      <Section num="5" title="Control Flow and Functions">
        <CodeBlock language="matlab" code={`% if / elseif / else
score = 85;
if score >= 90
    grade = 'A';
elseif score >= 80
    grade = 'B';
else
    grade = 'C';
end   % <-- 'end' closes the block (like } in Java)

% for loop
total = 0;
for i = 1:10       % i goes from 1 to 10
    total = total + i;
end

% Loop over vector (like Java for-each)
for x = [10 20 30 40]
    fprintf('%d\\n', x);
end

% while
n = 1;
while n < 100
    n = n * 2;
end

% switch
switch command
    case 'start'
        disp('Starting');
    case {'stop', 'quit'}
        disp('Stopping');
    otherwise
        disp('Unknown');
end

% Functions (defined in .m file or at end of script)
function result = factorial_rec(n)
    if n <= 1
        result = 1;
    else
        result = n * factorial_rec(n - 1);
    end
end

% Multiple return values
function [mn, mx] = minmax(v)
    mn = min(v);
    mx = max(v);
end

[lo, hi] = minmax([3 1 4 1 5 9]);`} />
      </Section>

      <Section num="6" title="Vectorization — Think in Arrays">
        <p>The most important MATLAB performance principle: <strong>avoid loops, use vectorized operations</strong>. MATLAB's matrix operations are highly optimized and run 100x faster than equivalent loops.</p>
        <CompareBlock
          javaLabel="Loop-based (slow in MATLAB)"
          otherLabel="Vectorized (fast)"
          language="matlab"
          javaCode={`// Java: must loop
double[] a = {1,2,3,4,5};
double[] b = {6,7,8,9,10};
double[] c = new double[5];
double total = 0;
for (int i = 0; i < a.length; i++) {
    c[i] = a[i] * b[i];
    total += c[i];
}`}
          otherCode={`% MATLAB: vectorized — NO LOOP!
a = [1 2 3 4 5];
b = [6 7 8 9 10];
c = a .* b;        % element-wise multiply
total = sum(c);    % sum all elements

% More vectorization examples:
x = linspace(0, 2*pi, 1000);
y = sin(x) .^ 2 + cos(x) .^ 2;   % should all be ~1
all(abs(y - 1) < 1e-10)            % true`}
        />
      </Section>

      <Section num="7" title="Plotting and Visualization">
        <CodeBlock language="matlab" code={`% Basic 2D plot
x = 0:0.01:2*pi;
y = sin(x);
plot(x, y)
title('Sine Wave')
xlabel('x (radians)')
ylabel('sin(x)')
grid on

% Multiple plots on same axes
figure;
hold on;
plot(x, sin(x), 'b-',  'LineWidth', 2, 'DisplayName', 'sin(x)');
plot(x, cos(x), 'r--', 'LineWidth', 2, 'DisplayName', 'cos(x)');
hold off;
legend show;

% Subplots
figure;
subplot(2, 2, 1); plot(x, sin(x));   title('sin')
subplot(2, 2, 2); plot(x, cos(x));   title('cos')
subplot(2, 2, 3); plot(x, tan(x));   title('tan'), ylim([-5 5])
subplot(2, 2, 4); plot(x, exp(-x));  title('exp')

% 3D surface plot
[X, Y] = meshgrid(-3:0.1:3, -3:0.1:3);
Z = sin(sqrt(X.^2 + Y.^2));
surf(X, Y, Z)
colorbar`} />
      </Section>

      <Section num="8" title="Object-Oriented Programming">
        <CodeBlock language="matlab" code={`% classdef in a separate file: Circle.m
classdef Circle < handle    % handle = reference semantics (like Java)
                            % value class (no < handle) = copy semantics
    properties
        Radius   % public
    end

    properties (Access = private)
        Color    % private
    end

    methods
        % Constructor
        function obj = Circle(radius, color)
            obj.Radius = radius;
            obj.Color  = color;
        end

        function a = area(obj)
            a = pi * obj.Radius^2;
        end

        function p = perimeter(obj)
            p = 2 * pi * obj.Radius;
        end

        function disp(obj)
            fprintf('Circle(r=%.2f, color=%s)\\n', obj.Radius, obj.Color);
        end
    end

    methods (Static)
        function c = unit()
            c = Circle(1, 'red');
        end
    end
end

% Usage
c = Circle(5, 'blue');
fprintf('Area: %.2f\\n', c.area());
c2 = Circle.unit();`} />
        <Sub title="Inheritance and Abstract Classes">
          <CodeBlock language="matlab" code={`% Shape.m — abstract base class
classdef Shape < handle
    properties (Abstract)
        Color
    end
    methods (Abstract)
        a = area(obj)
    end
    methods
        function describe(obj)
            fprintf('%s with area=%.2f\\n', class(obj), obj.area());
        end
    end
end

% Rectangle.m
classdef Rectangle < Shape
    properties
        Width; Height; Color
    end
    methods
        function obj = Rectangle(w, h, c)
            obj.Width = w; obj.Height = h; obj.Color = c;
        end
        function a = area(obj)
            a = obj.Width * obj.Height;
        end
    end
end

r = Rectangle(4, 5, 'green');
r.describe();   % Rectangle with area=20.00`} />
        </Sub>
      </Section>

      <Section num="9" title="String Handling">
        <InfoBox>MATLAB has two string types: the older <code>char</code> array and the modern <code>string</code> object (double quotes). Use <code>string</code> for new code — it supports array operations and is more consistent.</InfoBox>
        <CodeBlock language="matlab" code={`% Modern string (preferred)
s = "Hello, World!";
class(s)          % string

% String operations
length(s)         % 13
strlength(s)      % 13 (works for string arrays too)
upper(s)          % "HELLO, WORLD!"
lower(s)          % "hello, world!"
strtrim(s)        % strip leading/trailing whitespace
strsplit(s, ', ') % ["Hello" "World!"]
strjoin(["a","b","c"], "-")  % "a-b-c"

% Search and replace
contains(s, "World")    % true
startsWith(s, "Hello")  % true
endsWith(s, "!")         % true
strrep(s, "World", "MATLAB")  % "Hello, MATLAB!"
strfind(s, "l")          % [3 4 11] — all positions (1-indexed)

% Formatting
name = "Alice"; age = 30;
msg = sprintf("Name: %s, Age: %d", name, age);
fprintf("%s\\n", msg);

% String comparison
s1 = "hello"; s2 = "hello";
s1 == s2            % true (unlike Java's == for objects)
strcmp(s1, s2)      % true  (also works for char arrays)
strcmpi(s1, "HELLO")  % true (case-insensitive)

% Regular expressions
str = "Order #1042 placed on 2024-03-15";
[tok] = regexp(str, '(\\d{4}-\\d{2}-\\d{2})', 'tokens');
date = tok{1}{1};   % "2024-03-15"

% String arrays (batch operations)
words = ["apple" "banana" "cherry"];
upper(words)        % ["APPLE" "BANANA" "CHERRY"] — vectorized!
strlength(words)    % [5 6 6]`} />
        <CompareBlock
          javaLabel="Java"
          otherLabel="MATLAB"
          language="matlab"
          javaCode={`String s = "hello";
String upper = s.toUpperCase();
boolean has = s.contains("ell");
String[] parts = s.split(",");
String joined = String.join("-", parts);`}
          otherCode={`s = "hello";
upper = upper(s);          % "HELLO"
has = contains(s, "ell"); % true
parts = strsplit(s, ",");
joined = strjoin(parts, "-");`}
        />
      </Section>

      <Section num="10" title="Cell Arrays and Structs">
        <InfoBox>Cell arrays (<code>{'{}'}</code>) hold heterogeneous data — different types per element, like Java's <code>Object[]</code>. Structs hold named fields, like Java POJOs. Both are fundamental MATLAB data containers.</InfoBox>
        <Sub title="Cell Arrays">
          <CodeBlock language="matlab" code={`% Cell array — each cell can hold anything
c = {42, "hello", [1 2 3], true};
c{1}        % 42           (curly braces to index!)
c{3}        % [1 2 3]
c{3}(2)     % 2            (index into the array inside)

% Create and grow
data = {};                 % empty cell array
data{end+1} = "item1";    % append
data{end+1} = rand(3);    % append matrix

% Cell array of strings (common pattern)
names = {"Alice", "Bob", "Charlie"};
cellfun(@upper, names, 'UniformOutput', false)  % {"ALICE" "BOB" "CHARLIE"}

% Convert to string array
string(names)   % ["Alice" "Bob" "Charlie"]

% iscell, numel, size work on cell arrays
numel(c)        % 4
size(c)         % [1 4]`} />
        </Sub>
        <Sub title="Structs">
          <CodeBlock language="matlab" code={`% Struct — named fields (like a Java record/POJO)
person.name = "Alice";
person.age  = 30;
person.scores = [85 90 78];

person.name   % "Alice"
person.scores(2)  % 90

% Struct constructor syntax
person = struct('name', "Bob", 'age', 25, 'scores', [70 80 90]);

% Array of structs
students(1).name = "Alice"; students(1).gpa = 3.9;
students(2).name = "Bob";   students(2).gpa = 3.5;

% Access a field across all structs
[students.gpa]   % [3.9 3.5]  (horizontal concatenation)

% Dynamic field names (like Java reflection)
field = 'name';
person.(field)   % "Bob"

% fieldnames, rmfield, isfield
fieldnames(person)   % {'name'; 'age'; 'scores'}
isfield(person, 'age')   % true
person2 = rmfield(person, 'scores');  % remove field`} />
        </Sub>
      </Section>

      <Section num="11" title="File I/O and Data Import">
        <CodeBlock language="matlab" code={`% === Text files ===
% Write
fid = fopen('output.txt', 'w');
fprintf(fid, 'Line %d: value = %.4f\\n', 1, 3.14159);
fclose(fid);

% Read line by line
fid = fopen('data.txt', 'r');
while ~feof(fid)
    line = fgetl(fid);
    if ischar(line)
        disp(line);
    end
end
fclose(fid);

% === CSV / Spreadsheet data ===
% Modern approach (returns table)
T = readtable('data.csv');
T.Properties.VariableNames   % column names
T.Age                        % access column by name
T(T.Age > 30, :)             % filter rows (like SQL WHERE)

% Write table back to CSV
writetable(T, 'output.csv');

% Excel
T = readtable('report.xlsx', 'Sheet', 'Sheet2', 'Range', 'A1:D50');
writetable(T, 'report.xlsx', 'Sheet', 'Results');

% === MAT files (binary, fastest for MATLAB data) ===
x = 1:100;
y = sin(x);
save('mydata.mat', 'x', 'y');   % save variables
load('mydata.mat');              % load all variables from file
S = load('mydata.mat', 'x');    % load specific variable into struct

% === JSON ===
data = struct('name', "test", 'values', [1 2 3]);
json_str = jsonencode(data);
parsed = jsondecode('{"x":1,"labels":["a","b"]}');
parsed.x          % 1
parsed.labels     % {'a'; 'b'} cell array`} />
      </Section>

      <Section num="12" title="Error Handling">
        <CompareBlock
          javaLabel="Java"
          otherLabel="MATLAB"
          language="matlab"
          javaCode={`try {
    int result = riskyOp();
} catch (IllegalArgumentException e) {
    System.err.println(e.getMessage());
} catch (Exception e) {
    e.printStackTrace();
} finally {
    cleanup();
}`}
          otherCode={`try
    result = risky_op();
catch ME           % ME = MException object
    fprintf('Error: %s\\n', ME.message);
    fprintf('ID:    %s\\n', ME.identifier);
    fprintf('Stack: %s line %d\\n', ...
        ME.stack(1).name, ME.stack(1).line);
end

% Finally equivalent — use onCleanup
fid = fopen('file.txt');
cleanObj = onCleanup(@() fclose(fid));  % called when cleanObj goes out of scope`}
        />
        <CodeBlock language="matlab" code={`% Throwing errors
error('myApp:badInput', 'Value must be positive, got %d', value);
%       identifier         message with printf format

% Throwing warnings (non-fatal)
warning('myApp:slowPath', 'Using slow fallback algorithm');

% Custom validator function pattern
function validate_positive(x, name)
    if ~isnumeric(x) || ~isscalar(x) || x <= 0
        error('myApp:validate:notPositive', ...
              '%s must be a positive scalar, got %s', name, mat2str(x));
    end
end

% Catch specific error IDs
try
    validate_positive(-5, 'radius');
catch ME
    if strcmp(ME.identifier, 'myApp:validate:notPositive')
        fprintf('Validation failed: %s\\n', ME.message);
    else
        rethrow(ME);   % re-throw unexpected errors
    end
end`} />
      </Section>

      <Section num="13" title="Functional Programming">
        <InfoBox>MATLAB supports first-class functions via anonymous functions (<code>@</code>), function handles, and higher-order utilities like <code>arrayfun</code>, <code>cellfun</code>, and <code>structfun</code>.</InfoBox>
        <CodeBlock language="matlab" code={`% Anonymous functions (like Java lambdas)
square = @(x) x.^2;
square(5)        % 25
square([1 2 3])  % [1 4 9]

add = @(a, b) a + b;
add(3, 4)        % 7

% Closures — capture outer variables
base = 10;
add_base = @(x) x + base;  % closes over 'base'
add_base(5)    % 15
base = 20;
add_base(5)    % still 15! (captured at definition time)

% Passing functions as arguments
apply = @(f, x) f(x);
apply(@sqrt, 16)   % 4
apply(@(x) x^2 + 1, 3)  % 10

% arrayfun — apply function to each element (like map)
x = 1:5;
result = arrayfun(@(n) factorial(n), x)  % [1 2 6 24 120]

% cellfun — apply to each cell
words = {'hello', 'world', 'matlab'};
lengths = cellfun(@length, words)   % [5 5 6]
upper_words = cellfun(@upper, words, 'UniformOutput', false);

% Function composition
compose = @(f, g) @(x) f(g(x));
sqrt_abs = compose(@sqrt, @abs);
sqrt_abs(-16)   % 4

% Partial application via anonymous function
power_of = @(n) @(x) x.^n;
square = power_of(2);
cube   = power_of(3);
square(5)   % 25
cube(3)     % 27

% Accumarray — group-and-reduce (like SQL GROUP BY + aggregate)
groups = [1; 2; 1; 3; 2; 1];
values = [10; 20; 30; 40; 50; 60];
result = accumarray(groups, values, [], @sum);
% result = [100; 70; 40]  (sum for groups 1, 2, 3)`} />
      </Section>

      <Section num="14" title="Performance and Profiling">
        <TipBox>MATLAB's JIT compiler handles loops well in modern versions, but preallocating arrays and using vectorized operations still gives the biggest speedups.</TipBox>
        <CodeBlock language="matlab" code={`% === Profiling ===
profile on
my_slow_function();
profile off
profile viewer    % opens interactive HTML profiler report

% Quick timing
tic
for i = 1:1e6
    x = sqrt(i);
end
toc   % Elapsed time is 0.012 seconds.

% Compare approaches
N = 1e6;

tic
v = zeros(1, N);
for i = 1:N; v(i) = sqrt(i); end
t_loop = toc;

tic
v = sqrt(1:N);
t_vec = toc;

fprintf('Loop: %.4fs  Vectorized: %.4fs  Speedup: %.1fx\\n', ...
        t_loop, t_vec, t_loop/t_vec);`} />
        <Sub title="Preallocation">
          <CodeBlock language="matlab" code={`% BAD — growing array in loop (triggers repeated memory allocation)
result = [];
for i = 1:10000
    result(end+1) = i^2;   % reallocates each iteration!
end

% GOOD — preallocate
result = zeros(1, 10000);
for i = 1:10000
    result(i) = i^2;   % writes into pre-existing memory
end

% Best — vectorize
result = (1:10000).^2;

% Preallocate cell arrays and structs
data = cell(1, N);
for i = 1:N
    data{i} = some_function(i);
end`} />
        </Sub>
        <Sub title="Memory Tips">
          <CodeBlock language="matlab" code={`% Check memory usage
whos           % list all variables and their sizes
whos varname   % specific variable

% Single precision halves memory (vs double)
A = single(rand(1000));   % 4 MB vs 8 MB for double

% Sparse matrices for mostly-zero data
S = sparse(1000, 1000);   % 0 bytes for empty sparse
S(1,1) = 5; S(500,500) = 3;
nnz(S)      % 2  (number of non-zero elements)
full(S)     % convert back to full matrix (dangerous for large!)

% sprand — random sparse matrix
S = sprand(1000, 1000, 0.01);  % 1000x1000, 1% filled

% Solve sparse linear systems efficiently
b = rand(1000, 1);
x = S \\ b;   % sparse backslash uses sparse-aware solvers`} />
        </Sub>
      </Section>

      <Section num="15" title="Signal Processing and Toolboxes">
        <table>
          <thead><tr><th>Toolbox</th><th>Purpose</th><th>Key Functions</th></tr></thead>
          <tbody>
            <tr><td>Signal Processing</td><td>FFT, filtering, spectral analysis</td><td>fft, filter, spectrogram, butter</td></tr>
            <tr><td>Image Processing</td><td>Read/write/process images</td><td>imread, imshow, imfilter, edge</td></tr>
            <tr><td>Statistics & ML</td><td>Stats, regression, classification</td><td>fitlm, kmeans, fitcsvm</td></tr>
            <tr><td>Control System</td><td>Transfer functions, Bode plots</td><td>tf, bode, step, rlocus</td></tr>
            <tr><td>Optimization</td><td>Linear/nonlinear optimization</td><td>fmincon, linprog, fsolve</td></tr>
            <tr><td>Symbolic Math</td><td>Symbolic computation, calculus</td><td>syms, diff, int, solve</td></tr>
          </tbody>
        </table>
        <CodeBlock language="matlab" code={`% Signal processing example
Fs = 1000;              % sampling frequency
t = 0:1/Fs:1-1/Fs;     % time vector
f1 = 50; f2 = 120;
x = sin(2*pi*f1*t) + 0.5*sin(2*pi*f2*t);   % signal

% FFT
N = length(x);
X = fft(x);
f = (0:N-1) * Fs/N;
plot(f(1:N/2), abs(X(1:N/2)) / N * 2);
xlabel('Frequency (Hz)'); ylabel('Amplitude');

% Symbolic calculus
syms x real
f = x^3 - 3*x^2 + 2;
df = diff(f, x)         % derivative: 3x^2 - 6x
integral_f = int(f, x)  % antiderivative
roots_f = solve(f == 0, x)  % solve f(x) = 0`} />
      </Section>

      <Section num="16" title="Numerical Methods">
        <p>MATLAB excels at numerical methods. Many textbook algorithms have direct one-function equivalents, but understanding the underlying methods helps you choose the right solver.</p>
        <Sub title="Root Finding">
          <CodeBlock language="matlab" code={`% fzero — find root of a function (Brent's method)
f = @(x) x^3 - 2*x - 5;
root = fzero(f, 2)        % root near x=2 → 2.0946

% Multiple roots — provide bracket
fzero(f, [0 3])           % find root in interval [0, 3]

% fsolve — systems of equations (Newton-Raphson variants)
F = @(x) [x(1)^2 + x(2)^2 - 1;   % x^2 + y^2 = 1
           x(1) - x(2)];           % x = y
x0 = [0.5; 0.5];
sol = fsolve(F, x0);   % ≈ [0.707; 0.707]`} />
        </Sub>
        <Sub title="Numerical Integration">
          <CodeBlock language="matlab" code={`% integral — adaptive quadrature (recommended)
f = @(x) sin(x).^2 ./ (1 + x.^2);
result = integral(f, 0, pi)      % definite integral ∫₀^π

% integral2 — double integral ∫∫
f2 = @(x, y) x.*y + y.^2;
result2 = integral2(f2, 0, 1, 0, 1)

% integral3 — triple integral
f3 = @(x,y,z) x + y + z;
result3 = integral3(f3, 0, 1, 0, 1, 0, 1)

% Trapzoidal rule (simple)
x = linspace(0, pi, 1000);
y = sin(x);
trapz(x, y)   % ≈ 2.0`} />
        </Sub>
        <Sub title="Optimization">
          <CodeBlock language="matlab" code={`% fminbnd — minimize scalar function on interval
f = @(x) (x - 3).^2 + 2;
[xmin, fmin] = fminbnd(f, 0, 6);   % xmin≈3, fmin≈2

% fmincon — constrained nonlinear optimization
% min f(x) subject to: A*x <= b, Aeq*x == beq, lb <= x <= ub
objective = @(x) (x(1)-1)^2 + (x(2)-2)^2;
A = [1 1]; b = 3;          % x1 + x2 <= 3
lb = [0; 0];               % both non-negative
x0 = [0; 0];
options = optimoptions('fmincon', 'Display', 'off');
[x, fval] = fmincon(objective, x0, A, b, [], [], lb, [], [], options);

% linprog — linear programming
% min c'x  s.t. A*x <= b, lb <= x <= ub
c = [-5; -4];              % maximize 5x1 + 4x2
A = [6 4; 1 2; -1 0; 0 -1];
b = [24; 6; 0; 0];
[x, fval] = linprog(c, A, b);`} />
        </Sub>
        <Sub title="Interpolation and Curve Fitting">
          <CodeBlock language="matlab" code={`% interp1 — 1D interpolation
x = [0 1 2 3 4 5];
y = [0 1 4 9 16 25];  % y = x^2 (sampled)
xq = 0:0.1:5;
yq = interp1(x, y, xq, 'spline');   % 'linear','nearest','cubic','spline'

% interp2 — 2D interpolation
[X, Y] = meshgrid(1:4, 1:4);
Z = X.^2 + Y.^2;
Zq = interp2(X, Y, Z, 1.5, 2.7, 'spline');

% polyfit / polyval — polynomial curve fitting
x = 0:0.5:4;  y = x.^2 + randn(size(x));  % noisy quadratic
p = polyfit(x, y, 2);   % fit degree-2 polynomial → [a b c]
yfit = polyval(p, x);

% fit — general curve fitting (Curve Fitting Toolbox)
ft = fittype('a*exp(-b*x)', 'independent', 'x');
f = fit(x', y', ft, 'StartPoint', [1, 0.5]);`} />
        </Sub>
      </Section>

      <Section num="17" title="Unit Testing">
        <InfoBox>MATLAB's built-in test framework (<code>matlab.unittest</code>) provides xUnit-style tests. Tests live in files starting with <code>test</code> or in methods of a <code>TestCase</code> subclass.</InfoBox>
        <Sub title="Script-based Tests (simplest)">
          <CodeBlock language="matlab" code={`% testMyFunctions.m — all functions starting with 'test' are tests
function testAddPositive
    actual = myAdd(2, 3);
    assert(actual == 5, 'Expected 5, got %d', actual);
end

function testAddNegative
    assert(myAdd(-1, -2) == -3);
end

function testAddFloat
    assert(abs(myAdd(0.1, 0.2) - 0.3) < 1e-10);
end

% Run all tests in file:
results = runtests('testMyFunctions');
table(results)   % display pass/fail table`} />
        </Sub>
        <Sub title="Class-based Tests (recommended)">
          <CodeBlock language="matlab" code={`% TestCalculator.m
classdef TestCalculator < matlab.unittest.TestCase
    properties
        calc   % shared fixture
    end

    methods (TestMethodSetup)
        function createCalc(tc)
            tc.calc = Calculator();  % runs before each test
        end
    end

    methods (Test)
        function testAdd(tc)
            tc.verifyEqual(tc.calc.add(2, 3), 5);
        end

        function testDivideByZero(tc)
            tc.verifyError(@() tc.calc.divide(1, 0), 'Calculator:divByZero');
        end

        function testApproxEqual(tc)
            tc.verifyEqual(tc.calc.sqrt(2), sqrt(2), 'AbsTol', 1e-10);
        end

        function testNegativeInput(tc)
            tc.verifyWarning(@() tc.calc.sqrt(-1), 'Calculator:complexResult');
        end
    end

    methods (Test, TestTags={'slow'})
        function testLargeMatrix(tc)
            result = tc.calc.invert(rand(1000));
            tc.verifySize(result, [1000, 1000]);
        end
    end
end

% Run tests
results = runtests('TestCalculator');

% Run only fast tests (exclude 'slow' tag)
import matlab.unittest.selectors.HasTag
suite = testsuite('TestCalculator');
suite = suite.selectIf(~HasTag('slow'));
results = run(suite);`} />
        </Sub>
      </Section>

      <Section num="18" title="Design Patterns">
        <div className="pattern-card">
          <div className="pattern-card-header">
            <span className="pattern-icon">🔒</span>
            <div>
              <div className="pattern-title">Singleton</div>
              <div className="pattern-desc">One shared instance using persistent variables</div>
            </div>
          </div>
          <div className="pattern-card-body">
            <CodeBlock language="matlab" code={`classdef ConfigManager < handle
    properties (Access = private)
        settings
    end
    methods (Static)
        function obj = getInstance()
            persistent instance
            if isempty(instance) || ~isvalid(instance)
                instance = ConfigManager();
            end
            obj = instance;
        end
    end
    methods (Access = private)
        function obj = ConfigManager()
            obj.settings = struct('debug', false, 'maxIter', 1000);
        end
    end
    methods
        function v = get(obj, key)
            v = obj.settings.(key);
        end
        function set(obj, key, val)
            obj.settings.(key) = val;
        end
    end
end

cfg = ConfigManager.getInstance();
cfg.set('debug', true);
cfg2 = ConfigManager.getInstance();
cfg2.get('debug')   % true — same instance`} />
          </div>
        </div>

        <div className="pattern-card">
          <div className="pattern-card-header">
            <span className="pattern-icon">🏭</span>
            <div>
              <div className="pattern-title">Factory</div>
              <div className="pattern-desc">Create objects without specifying exact class</div>
            </div>
          </div>
          <div className="pattern-card-body">
            <CodeBlock language="matlab" code={`function solver = SolverFactory(type, options)
    switch lower(type)
        case 'ode45'
            solver = ODE45Solver(options);
        case 'euler'
            solver = EulerSolver(options);
        case 'runge-kutta4'
            solver = RK4Solver(options);
        otherwise
            error('SolverFactory:unknown', 'Unknown solver: %s', type);
    end
end

% Usage — caller doesn't know which class it gets
s = SolverFactory('ode45', struct('tol', 1e-6));
[t, y] = s.solve(ode_fun, tspan, y0);`} />
          </div>
        </div>

        <div className="pattern-card">
          <div className="pattern-card-header">
            <span className="pattern-icon">🧱</span>
            <div>
              <div className="pattern-title">Builder</div>
              <div className="pattern-desc">Fluent construction of complex plot configurations</div>
            </div>
          </div>
          <div className="pattern-card-body">
            <CodeBlock language="matlab" code={`classdef PlotBuilder < handle
    properties (Access = private)
        config
    end
    methods
        function obj = PlotBuilder()
            obj.config = struct('title','','xlabel','','ylabel','',...
                                'lineWidth',1,'color','b','grid',false);
        end
        function obj = withTitle(obj, t)
            obj.config.title = t;
        end
        function obj = withLabels(obj, xl, yl)
            obj.config.xlabel = xl; obj.config.ylabel = yl;
        end
        function obj = withStyle(obj, lw, color)
            obj.config.lineWidth = lw; obj.config.color = color;
        end
        function obj = withGrid(obj)
            obj.config.grid = true;
        end
        function build(obj, x, y)
            plot(x, y, 'Color', obj.config.color, 'LineWidth', obj.config.lineWidth);
            title(obj.config.title); xlabel(obj.config.xlabel); ylabel(obj.config.ylabel);
            if obj.config.grid, grid on; end
        end
    end
end

PlotBuilder().withTitle('Sine Wave').withLabels('t','y') ...
             .withStyle(2,'r').withGrid().build(t, sin(t));`} />
          </div>
        </div>

        <div className="pattern-card">
          <div className="pattern-card-header">
            <span className="pattern-icon">🎯</span>
            <div>
              <div className="pattern-title">Strategy</div>
              <div className="pattern-desc">Swap algorithms at runtime using function handles</div>
            </div>
          </div>
          <div className="pattern-card-body">
            <CodeBlock language="matlab" code={`% Strategies as function handles — MATLAB's natural approach
normalize_zscore   = @(x) (x - mean(x)) / std(x);
normalize_minmax   = @(x) (x - min(x)) / (max(x) - min(x));
normalize_l2       = @(x) x / norm(x);

function result = preprocess(data, normalize_fn)
    result = normalize_fn(data);
end

data = [1 5 2 8 3];
z = preprocess(data, normalize_zscore);
m = preprocess(data, normalize_minmax);`} />
          </div>
        </div>

        <div className="pattern-card">
          <div className="pattern-card-header">
            <span className="pattern-icon">👀</span>
            <div>
              <div className="pattern-title">Observer</div>
              <div className="pattern-desc">Event-driven updates using MATLAB events</div>
            </div>
          </div>
          <div className="pattern-card-body">
            <CodeBlock language="matlab" code={`classdef DataStream < handle
    events
        NewDataPoint
    end
    methods
        function push(obj, value)
            notify(obj, 'NewDataPoint', matlab.events.EventData());
            obj.lastValue = value;
        end
    end
    properties
        lastValue
    end
end

classdef LivePlotter < handle
    properties
        stream; buffer = [];
    end
    methods
        function obj = LivePlotter(stream)
            obj.stream = stream;
            addlistener(stream, 'NewDataPoint', @(s,e) obj.update(s));
        end
        function update(obj, src)
            obj.buffer(end+1) = src.lastValue;
            plot(obj.buffer); drawnow;
        end
    end
end

s = DataStream();
p = LivePlotter(s);
for i = 1:50
    s.push(sin(i * 0.3));
    pause(0.05);
end`} />
          </div>
        </div>

        <div className="pattern-card">
          <div className="pattern-card-header">
            <span className="pattern-icon">🎁</span>
            <div>
              <div className="pattern-title">Decorator</div>
              <div className="pattern-desc">Wrap functions to add timing, logging, or caching</div>
            </div>
          </div>
          <div className="pattern-card-body">
            <CodeBlock language="matlab" code={`% Function decorators via anonymous functions
function wrapped = timed(fn, name)
    wrapped = @(varargin) timed_call(fn, name, varargin{:});
end

function varargout = timed_call(fn, name, varargin)
    tic;
    [varargout{1:nargout}] = fn(varargin{:});
    fprintf('[%s] took %.4f s\\n', name, toc);
end

function wrapped = memoize_fn(fn)
    cache = containers.Map('KeyType','char','ValueType','any');
    wrapped = @(x) cached_call(fn, cache, x);
end

function result = cached_call(fn, cache, x)
    key = mat2str(x);
    if isKey(cache, key)
        result = cache(key);
    else
        result = fn(x); cache(key) = result;
    end
end

slow_fn = @(x) (pause(0.1), x^2);   % simulate slow computation
fast_fn = memoize_fn(slow_fn);
fast_fn(5)   % 0.1s first call
fast_fn(5)   % instant second call (cached)`} />
          </div>
        </div>
      </Section>

      <Section num="19" title="Mini Project: Numerical ODE Solver + Dashboard">
        <p>A complete analysis script: solve the Lotka-Volterra predator-prey system, visualize dynamics, compare ODE solvers, and export a report.</p>
        <CodeBlock language="matlab" code={`% ============================================================
%  Lotka-Volterra Predator-Prey Analysis Suite
% ============================================================
clear; clc; close all;

%% Parameters (easy to tune)
params = struct('alpha', 1.0, ...   % prey birth rate
                'beta',  0.1, ...   % predation rate
                'gamma', 1.5, ...   % predator death rate
                'delta', 0.075);    % predator growth per prey eaten

ode_fn = @(t, y) lotka_volterra(t, y, params);

y0    = [10; 5];         % initial populations
tspan = [0 200];

%% Solve with three different solvers and compare
solvers = {@ode45, @ode23, @ode113};
names   = {'ode45 (RK4/5)', 'ode23 (RK2/3)', 'ode113 (Adams)'};
opts    = odeset('RelTol', 1e-6, 'AbsTol', 1e-8, 'Stats', 'off');

results = struct();
for k = 1:numel(solvers)
    tic;
    [results(k).t, results(k).y] = solvers{k}(ode_fn, tspan, y0, opts);
    results(k).elapsed = toc;
    results(k).name    = names{k};
    results(k).steps   = numel(results(k).t);
end

fprintf('%-20s  Steps   Time(s)\\n', 'Solver');
fprintf('%s\\n', repmat('-', 1, 40));
for k = 1:numel(results)
    fprintf('%-20s  %-7d %.4f\\n', results(k).name, results(k).steps, results(k).elapsed);
end

%% Full Dashboard Figure
t = results(1).t;
y = results(1).y;

fig = figure('Name', 'Predator-Prey Dashboard', 'Position', [100 100 1200 800]);
colormap(fig, 'parula');

% 1. Population time series
ax1 = subplot(2, 3, [1 2]);
plot(t, y(:,1), 'b-', 'LineWidth', 2, 'DisplayName', 'Prey');
hold on;
plot(t, y(:,2), 'r-', 'LineWidth', 2, 'DisplayName', 'Predator');
hold off;
xlabel('Time'); ylabel('Population');
title('Population Dynamics');
legend('Location', 'best');
grid on;

% 2. Phase portrait with colormap by time
ax2 = subplot(2, 3, 3);
scatter(y(:,1), y(:,2), 8, t, 'filled');
colorbar; xlabel('Prey'); ylabel('Predator');
title('Phase Portrait (color = time)');
grid on;

% 3. Prey autocorrelation — find period
ax3 = subplot(2, 3, 4);
[acf, lags] = xcorr(y(:,1) - mean(y(:,1)), 'normalized');
stem(lags, acf, 'Marker', 'none', 'Color', [0.2 0.6 1]);
xlim([0 500]); xlabel('Lag (steps)'); ylabel('Autocorrelation');
title('Prey Population Autocorrelation');
grid on;

% 4. Frequency spectrum of prey oscillation
ax4 = subplot(2, 3, 5);
Fs  = 1 / mean(diff(t));   % approximate sampling rate
N   = length(y(:,1));
f   = (0:N-1) * Fs / N;
Ypow = abs(fft(y(:,1) - mean(y(:,1)))).^2 / N;
plot(f(1:floor(N/2)), Ypow(1:floor(N/2)), 'b');
xlabel('Frequency (cycles/time unit)'); ylabel('Power');
title('Prey Power Spectrum');
grid on;

% 5. Solver comparison bar chart
ax5 = subplot(2, 3, 6);
bar([results.steps]);
set(gca, 'XTickLabel', {results.name});
xtickangle(15);
ylabel('Number of Steps'); title('Solver Step Comparison');
grid on;

sgtitle('Lotka-Volterra Predator-Prey Analysis', 'FontSize', 14, 'FontWeight', 'bold');

%% Parameter sensitivity study (vary alpha)
alpha_vals = linspace(0.5, 2.0, 8);
max_prey   = zeros(size(alpha_vals));

for i = 1:numel(alpha_vals)
    p2 = params; p2.alpha = alpha_vals(i);
    [~, y2] = ode45(@(t,y) lotka_volterra(t,y,p2), tspan, y0, opts);
    max_prey(i) = max(y2(:,1));
end

figure('Name', 'Sensitivity');
plot(alpha_vals, max_prey, 'ko-', 'LineWidth', 2, 'MarkerFaceColor', 'b');
xlabel('Prey Birth Rate (\\alpha)'); ylabel('Peak Prey Population');
title('Sensitivity: \\alpha vs Peak Prey');
grid on;

%% Export results to CSV
T = table(t, y(:,1), y(:,2), 'VariableNames', {'time', 'prey', 'predator'});
writetable(T, 'lotka_volterra_results.csv');
fprintf('Results written to lotka_volterra_results.csv\\n');

%% ---- Local functions ----
function dydt = lotka_volterra(~, y, p)
    dydt = [p.alpha * y(1) - p.beta  * y(1) * y(2);
            p.delta * y(1) * y(2) - p.gamma * y(2)];
end`} />
      </Section>
    </div>
  )
}
