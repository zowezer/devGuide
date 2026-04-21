import Section, { Sub, InfoBox, TipBox } from '../components/Section'
import { Link } from 'react-router-dom'

const langs = [
  { name: 'Python',     icon: '🐍', path: '/python' },
  { name: 'JavaScript', icon: '🟨', path: '/javascript' },
  { name: 'C',          icon: '🔵', path: '/c' },
  { name: 'C++',        icon: '🔷', path: '/cpp' },
  { name: 'MATLAB',     icon: '📊', path: '/matlab' },
  { name: 'React',      icon: '⚛️', path: '/react' },
  { name: 'MongoDB',    icon: '🍃', path: '/mongodb' },
  { name: 'Docker',     icon: '🐳', path: '/docker' },
  { name: 'Kubernetes', icon: '☸️', path: '/kubernetes' },
  { name: 'Linux',      icon: '🐧', path: '/linux' },
  { name: 'Git',        icon: '🌿', path: '/git' },
]

const rows = [
  {
    feature: 'Typing',
    java: 'Static, Strong',
    python: 'Dynamic, Strong',
    js: 'Dynamic, Weak',
    c: 'Static, Weak',
    cpp: 'Static, Strong',
    matlab: 'Dynamic',
  },
  {
    feature: 'Memory Mgmt',
    java: 'GC (Generational)',
    python: 'Ref count + cyclic GC',
    js: 'GC (Mark-and-sweep)',
    c: 'Manual (malloc/free)',
    cpp: 'RAII + smart ptrs',
    matlab: 'GC',
  },
  {
    feature: 'OOP Style',
    java: 'Class-based (strict)',
    python: 'Class-based + duck typing',
    js: 'Prototype-based (class sugar)',
    c: 'Structs + function pointers',
    cpp: 'Class-based, multi-inherit',
    matlab: 'Class-based (classdef)',
  },
  {
    feature: 'Null / Empty',
    java: 'null (NPE risk)',
    python: 'None',
    js: 'null + undefined',
    c: 'NULL (crash risk)',
    cpp: 'nullptr + optional<T>',
    matlab: '[] (empty matrix)',
  },
  {
    feature: 'Error Handling',
    java: 'Checked + unchecked exceptions',
    python: 'Unchecked exceptions only',
    js: 'Unchecked + Promise rejection',
    c: 'Return codes / errno',
    cpp: 'Exceptions (unchecked)',
    matlab: 'try/catch, error()',
  },
  {
    feature: 'Concurrency',
    java: 'Threads + CompletableFuture',
    python: 'asyncio / multiprocessing (GIL)',
    js: 'Event loop + Promises / async-await',
    c: 'pthreads (manual)',
    cpp: 'std::thread + std::async',
    matlab: 'parfor / parfeval (Parallel TB)',
  },
  {
    feature: 'Generics',
    java: 'Type-erased generics',
    python: 'Type hints (hints only)',
    js: 'TypeScript generics (compile-time)',
    c: 'Macros (unsafe)',
    cpp: 'Templates (compile-time specialization)',
    matlab: 'Not applicable',
  },
  {
    feature: 'Functional FP',
    java: 'Streams, Lambdas, Optional',
    python: 'First-class fns, comprehensions, generators',
    js: 'Array methods, closures, currying',
    c: 'Function pointers (limited)',
    cpp: 'Lambdas, algorithms, ranges (C++20)',
    matlab: 'arrayfun, cellfun, function handles',
  },
  {
    feature: 'Performance',
    java: 'JIT-compiled (fast)',
    python: 'Slow (CPython), fast with NumPy/PyPy',
    js: 'JIT-compiled (V8 is very fast)',
    c: 'Fastest — native code',
    cpp: 'Near-C speed',
    matlab: 'Slow for loops; fast for vectorized ops',
  },
  {
    feature: 'Build System',
    java: 'Maven / Gradle',
    python: 'pip / Poetry / uv',
    js: 'npm / yarn / pnpm',
    c: 'Make / CMake',
    cpp: 'CMake / Meson',
    matlab: 'None (interpreter)',
  },
  {
    feature: 'Primary Use',
    java: 'Enterprise apps, Android, Spring',
    python: 'Data science, AI/ML, web, scripting',
    js: 'Web frontend, Node.js backend',
    c: 'OS, embedded, systems',
    cpp: 'Games, HPC, browsers, embedded',
    matlab: 'Engineering, science, signal processing',
  },
]

const devopsRows = [
  {
    feature: 'Purpose',
    docker: 'Containerize applications',
    k8s: 'Orchestrate containers at scale',
    linux: 'Operating system',
    git: 'Version control',
  },
  {
    feature: 'Core unit',
    docker: 'Image / Container',
    k8s: 'Pod / Deployment',
    linux: 'Process / File',
    git: 'Commit / Branch',
  },
  {
    feature: 'Config format',
    docker: 'Dockerfile + YAML (Compose)',
    k8s: 'YAML manifests',
    linux: 'Shell scripts + config files',
    git: '.gitignore + .gitconfig',
  },
  {
    feature: 'Scaling',
    docker: 'Manual (run more containers)',
    k8s: 'Automatic (HPA, cluster autoscaler)',
    linux: 'Manual (processes)',
    git: 'N/A',
  },
  {
    feature: 'Persistence',
    docker: 'Volumes (named or bind)',
    k8s: 'PersistentVolume / PVC',
    linux: 'Filesystem',
    git: 'Repository history',
  },
  {
    feature: 'Networking',
    docker: 'Bridge / host / overlay networks',
    k8s: 'Service / Ingress / NetworkPolicy',
    linux: 'TCP/IP, netfilter, iptables',
    git: 'Remote URLs (SSH / HTTPS)',
  },
  {
    feature: 'Key commands',
    docker: 'build, run, compose up/down',
    k8s: 'apply, get, describe, logs',
    linux: 'ls, grep, ps, ssh, chmod',
    git: 'add, commit, push, merge, rebase',
  },
]

const patternTable = [
  { pattern: 'Singleton',     java: 'enum / synchronized getInstance()', python: 'Module-level variable / __new__', js: 'ES module default export', cpp: 'Static local variable in getInstance()' },
  { pattern: 'Factory',       java: 'Interface + factory method', python: 'Function returning class instance', js: 'Function / registry object', cpp: 'Static factory method / abstract creator' },
  { pattern: 'Builder',       java: 'Inner Builder class, fluent API', python: 'kwargs + dataclass (usually unnecessary)', js: 'Method chaining / config object', cpp: 'Nested Builder class' },
  { pattern: 'Observer',      java: 'EventListener interface / PropertyChangeSupport', python: 'EventEmitter / callback lists', js: 'EventEmitter / DOM addEventListener', cpp: 'Virtual update() / std::function callbacks' },
  { pattern: 'Strategy',      java: 'Functional interface + lambda', python: 'Function as argument (1st class)', js: 'Function as argument', cpp: 'std::function / template policy' },
  { pattern: 'Decorator',     java: '@annotations / wrapper classes', python: '@decorator syntax (language feature)', js: 'HOF / class inheritance', cpp: 'CRTP / wrapper class' },
  { pattern: 'Command',       java: 'Runnable / functional interface', python: 'Callable object / function', js: 'Function in an object / class', cpp: 'std::function / functor' },
  { pattern: 'Template Method', java: 'Abstract class + overrideable methods', python: 'ABC + @abstractmethod', js: 'Class inheritance', cpp: 'Pure virtual + concrete methods' },
]

export default function ComparisonPage() {
  return (
    <div>
      <div className="page-hero">
        <div className="lang-icon">⚖️</div>
        <div>
          <h1>Grand Comparison</h1>
          <p>All 11 technologies compared across every major dimension — types, memory, OOP, concurrency, tooling, and design patterns. Your ultimate reference card for choosing the right tool and understanding the tradeoffs.</p>
          <div className="badges">
            <span className="badge purple">All 11 Technologies</span>
            <span className="badge green">Side-by-side</span>
            <span className="badge">Java as baseline</span>
          </div>
        </div>
      </div>

      {/* Quick nav */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 32 }}>
        {langs.map(l => (
          <Link key={l.path} to={l.path} style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 8, padding: '6px 14px', textDecoration: 'none',
            color: 'var(--text)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6
          }}>
            {l.icon} {l.name}
          </Link>
        ))}
      </div>

      {/* Language mega-table */}
      <Section num="1" title="Languages: Feature Comparison">
        <div className="mega-table">
          <table>
            <thead>
              <tr>
                <th>Feature</th>
                <th>☕ Java (baseline)</th>
                <th>🐍 Python</th>
                <th>🟨 JavaScript</th>
                <th>🔵 C</th>
                <th>🔷 C++</th>
                <th>📊 MATLAB</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.feature}>
                  <td><strong>{r.feature}</strong></td>
                  <td>{r.java}</td>
                  <td>{r.python}</td>
                  <td>{r.js}</td>
                  <td>{r.c}</td>
                  <td>{r.cpp}</td>
                  <td>{r.matlab}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* DevOps comparison */}
      <Section num="2" title="DevOps Tools: Feature Comparison">
        <div className="mega-table">
          <table>
            <thead>
              <tr>
                <th>Feature</th>
                <th>🐳 Docker</th>
                <th>☸️ Kubernetes</th>
                <th>🐧 Linux</th>
                <th>🌿 Git</th>
              </tr>
            </thead>
            <tbody>
              {devopsRows.map(r => (
                <tr key={r.feature}>
                  <td><strong>{r.feature}</strong></td>
                  <td>{r.docker}</td>
                  <td>{r.k8s}</td>
                  <td>{r.linux}</td>
                  <td>{r.git}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Design patterns */}
      <Section num="3" title="Design Patterns Across Languages">
        <div className="mega-table">
          <table>
            <thead>
              <tr>
                <th>Pattern</th>
                <th>☕ Java</th>
                <th>🐍 Python</th>
                <th>🟨 JavaScript</th>
                <th>🔷 C++</th>
              </tr>
            </thead>
            <tbody>
              {patternTable.map(r => (
                <tr key={r.pattern}>
                  <td><strong>{r.pattern}</strong></td>
                  <td>{r.java}</td>
                  <td>{r.python}</td>
                  <td>{r.js}</td>
                  <td>{r.cpp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Performance ranking */}
      <Section num="4" title="Performance Hierarchy">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, margin: '16px 0' }}>
          {[
            { label: 'C', bar: 98, color: '#60a5fa', note: 'Closest to hardware. No overhead at all.' },
            { label: 'C++', bar: 95, color: '#818cf8', note: 'Near-C speed with RAII and zero-cost abstractions.' },
            { label: 'Java', bar: 80, color: '#f97316', note: 'JIT compilation brings performance close to native.' },
            { label: 'JavaScript (V8)', bar: 72, color: '#fbbf24', note: 'V8 JIT is exceptional — node.js is genuinely fast.' },
            { label: 'C++ (MATLAB ops)', bar: 70, color: '#fb923c', note: 'MATLAB vectorized ops use optimized BLAS/LAPACK.' },
            { label: 'Python (NumPy)', bar: 55, color: '#3b82f6', note: 'NumPy delegates to C — array ops are fast.' },
            { label: 'Python (pure)', bar: 20, color: '#6366f1', note: 'CPython interpreter overhead. GIL limits threads.' },
            { label: 'MATLAB (loops)', bar: 15, color: '#f59e0b', note: 'Interpreter + overhead. Always vectorize!' },
          ].map(({ label, bar, color, note }) => (
            <div key={label}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <span style={{ width: 160, fontSize: 13, fontWeight: 600, color: 'var(--text-bright)' }}>{label}</span>
                <div style={{ flex: 1, background: 'var(--surface2)', borderRadius: 4, height: 18, position: 'relative' }}>
                  <div style={{ width: `${bar}%`, background: color, height: '100%', borderRadius: 4, opacity: 0.8 }} />
                  <span style={{ position: 'absolute', right: 8, top: 0, fontSize: 11, color: 'var(--text-dim)', lineHeight: '18px' }}>{bar}%</span>
                </div>
              </div>
              <p style={{ margin: '0 0 4px 170px', fontSize: 12, color: 'var(--text-dim)' }}>{note}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Use case guide */}
      <Section num="5" title="When to Use Each Technology">
        <div className="comparison-grid">
          {[
            { icon: '🐍', name: 'Python', uses: ['Data science / ML / AI', 'Quick scripting and automation', 'Web APIs (FastAPI, Django)', 'Research and prototyping'], avoid: ['Real-time / high-performance', 'Mobile development', 'Frontend web'] },
            { icon: '🟨', name: 'JavaScript', uses: ['Web frontend (universal)', 'Node.js backend APIs', 'Serverless functions', 'Cross-platform (Electron, React Native)'], avoid: ['CPU-intensive computation', 'Systems programming', 'Scientific computing'] },
            { icon: '🔵', name: 'C', uses: ['Operating systems, kernels', 'Embedded / IoT firmware', 'Performance-critical libraries', 'When you need zero overhead'], avoid: ['Web development', 'Business apps', 'Any project with time constraints'] },
            { icon: '🔷', name: 'C++', uses: ['Game engines (Unreal)', 'High-performance computing', 'Browser engines, databases', 'Robotics and real-time systems'], avoid: ['Rapid prototyping', 'Data science', 'Web APIs'] },
            { icon: '📊', name: 'MATLAB', uses: ['Engineering simulation', 'Signal / image processing', 'Control systems', 'Academic research with toolboxes'], avoid: ['Production web services', 'General purpose apps', 'Cost-sensitive projects (license!)'] },
            { icon: '⚛️', name: 'React', uses: ['SPAs and complex web UIs', 'Data dashboards', 'When component reuse matters', 'Large teams / shared design systems'], avoid: ['Simple static pages', 'Performance-critical minimal-JS sites', 'When SEO is primary concern (use Next.js)'] },
            { icon: '🍃', name: 'MongoDB', uses: ['Flexible schema data', 'Document storage (products, content)', 'Rapid iteration / MVP', 'Hierarchical / nested data'], avoid: ['Complex transactions (financial)', 'Highly relational data', 'When ACID compliance is critical'] },
            { icon: '🐳', name: 'Docker', uses: ['Consistent dev environments', 'Packaging any app for deployment', 'Microservices isolation', 'CI/CD pipelines'], avoid: ['Tiny scripts on single servers', 'When startup time matters (FaaS)', 'Deeply stateful apps (use with volumes)'] },
            { icon: '☸️', name: 'Kubernetes', uses: ['Scaling containerized apps', 'Multi-service production systems', 'High availability requirements', 'Cloud-native microservices'], avoid: ['Small teams / single apps', 'Development environments', 'When Docker Compose is sufficient'] },
            { icon: '🐧', name: 'Linux', uses: ['Every server and cloud instance', 'Docker containers', 'Development environment', 'DevOps and automation'], avoid: ['End-user desktop (macOS/Windows better UX)', 'Gaming (historically)'] },
            { icon: '🌿', name: 'Git', uses: ['Every software project', 'Collaboration on any text files', 'Infrastructure as code', 'Documentation versioning'], avoid: ['Large binary files (use Git LFS)', 'Database versioning (use migrations)'] },
          ].map(item => (
            <div key={item.name} className="comp-card">
              <h3>{item.icon} {item.name}</h3>
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--green)', marginBottom: 4 }}>USE FOR</div>
                {item.uses.map(u => <div key={u} style={{ fontSize: 12, color: 'var(--text)', marginBottom: 2 }}>✓ {u}</div>)}
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--red)', marginBottom: 4 }}>AVOID FOR</div>
                {item.avoid.map(a => <div key={a} style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 2 }}>✗ {a}</div>)}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Java Migration Guide */}
      <Section num="6" title="Java → New Language: Quick Migration Reference">
        <div className="mega-table">
          <table>
            <thead>
              <tr>
                <th>Java Concept</th>
                <th>🐍 Python</th>
                <th>🟨 JavaScript</th>
                <th>🔵 C</th>
                <th>🔷 C++</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['String.format()', 'f-strings: f"hi {name}"', 'Template literal: `hi ${name}`', 'printf / sprintf / snprintf', 'std::format (C++20) / ostringstream'],
                ['ArrayList<T>', 'list (built-in)', 'Array []', 'array + manual realloc', 'std::vector<T>'],
                ['HashMap<K,V>', 'dict {k: v}', 'Map / Object {}', 'struct + hash (manual)', 'std::unordered_map<K,V>'],
                ['HashSet<T>', 'set {1, 2, 3}', 'Set', 'No built-in', 'std::unordered_set<T>'],
                ['Optional<T>', 'return None / type hints', 'value ?? default / ?.', 'Return NULL pointer', 'std::optional<T>'],
                ['interface', 'ABC / duck typing', 'No keyword — use classes/mixins', 'Function pointer struct', 'Pure virtual class'],
                ['synchronized', 'threading.Lock() / asyncio.Lock()', 'Not needed (single-threaded)', 'pthread_mutex_t', 'std::mutex'],
                ['Stream.filter()', 'list comprehension / filter()', 'array.filter(fn)', 'Manual loop', 'ranges::filter (C++20)'],
                ['Stream.map()', 'list comprehension / map()', 'array.map(fn)', 'Manual loop', 'ranges::transform'],
                ['for-each loop', 'for x in iterable:', 'for (x of iterable)', 'for(int i=0; i<n; i++)', 'for (auto &x : container)'],
                ['try-catch', 'try: except X:', 'try { } catch(e) { }', 'if (err < 0) return -1;', 'try { } catch(const Ex& e)'],
                ['implements', 'class Foo(Interface):', 'class Foo extends Mixin', 'struct with function pointers', ': public AbstractBase'],
                ['super()', 'super().__init__()', 'super() — must call first', 'Calling parent struct init', 'Base::Base() in init list'],
                ['"this"', '"self" (explicit param)', '"this" (auto-bound)', 'First param by convention', '"this" pointer (auto)'],
                ['new Object()', 'just call Object()', 'new Object()', 'malloc + manual init', 'make_unique<Object>() / new'],
                ['GC', 'Reference counting + cyclic GC', 'Mark-and-sweep GC', 'NO GC — manual free()', 'RAII + smart pointers'],
              ].map(([java, py, js, c, cpp]) => (
                <tr key={java}>
                  <td><strong>{java}</strong></td>
                  <td style={{ color: 'var(--text-bright)', fontFamily: 'monospace', fontSize: 12 }}>{py}</td>
                  <td style={{ color: 'var(--text-bright)', fontFamily: 'monospace', fontSize: 12 }}>{js}</td>
                  <td style={{ color: 'var(--text-bright)', fontFamily: 'monospace', fontSize: 12 }}>{c}</td>
                  <td style={{ color: 'var(--text-bright)', fontFamily: 'monospace', fontSize: 12 }}>{cpp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Learning path */}
      <Section num="7" title="Recommended Learning Path">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16, marginTop: 16 }}>
          {[
            { step: '1', title: 'Linux & CLI Fundamentals', desc: 'Everything else runs on Linux. Master the terminal first — navigation, files, pipes, scripts.', path: '/linux', time: '1–2 weeks' },
            { step: '2', title: 'Git Workflow', desc: 'Version control from day 1. Learn branching, merging, and team workflows.', path: '/git', time: '1 week' },
            { step: '3', title: 'Python', desc: 'Your scripting Swiss Army knife. Easiest transition from Java. Learn immediately.', path: '/python', time: '2–3 weeks' },
            { step: '4', title: 'JavaScript', desc: 'Web is everywhere. Learn ES6+, async/await, and the DOM.', path: '/javascript', time: '2–3 weeks' },
            { step: '5', title: 'React', desc: 'Build real web UIs. React\'s component model is clean once you know hooks.', path: '/react', time: '2–4 weeks' },
            { step: '6', title: 'MongoDB', desc: 'Learn a NoSQL database to complement your Java SQL knowledge.', path: '/mongodb', time: '1 week' },
            { step: '7', title: 'Docker', desc: 'Containerize everything. Essential for any modern deployment.', path: '/docker', time: '1 week' },
            { step: '8', title: 'C', desc: 'Understand what Java protects you from. Essential foundation.', path: '/c', time: '3–4 weeks' },
            { step: '9', title: 'C++', desc: 'C with classes and the STL. Required for game dev, HPC, embedded.', path: '/cpp', time: '4–6 weeks' },
            { step: '10', title: 'Kubernetes', desc: 'After Docker, learn to orchestrate at scale.', path: '/kubernetes', time: '2–3 weeks' },
            { step: '11', title: 'MATLAB', desc: 'Domain-specific — learn when you need engineering simulation or signal processing.', path: '/matlab', time: '1–2 weeks' },
          ].map(item => (
            <Link key={item.step} to={item.path} style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 16,
                transition: 'all 0.2s', cursor: 'pointer'
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{
                    background: 'var(--accent)', color: 'white', borderRadius: '50%',
                    width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700, flexShrink: 0
                  }}>{item.step}</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-bright)', fontSize: 14 }}>{item.title}</span>
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 8 }}>{item.desc}</p>
                <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600 }}>⏱ {item.time}</span>
              </div>
            </Link>
          ))}
        </div>
      </Section>
    </div>
  )
}
