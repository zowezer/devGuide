import CodeBlock from '../components/CodeBlock'
import CompareBlock from '../components/CompareBlock'
import Section, { Sub, InfoBox, WarnBox, TipBox } from '../components/Section'

export default function ReactPage() {
  return (
    <div>
      <div className="page-hero">
        <div className="lang-icon">⚛️</div>
        <div>
          <h1>React</h1>
          <p>A JavaScript library for building component-based UIs. React's core idea: UI = f(state) — given a state, the function always produces the same UI. Think of components as Java classes where render() is called automatically when data changes.</p>
          <div className="badges">
            <span className="badge">Component-Based</span>
            <span className="badge green">Virtual DOM</span>
            <span className="badge yellow">Unidirectional Data Flow</span>
            <span className="badge purple">Hooks (Functional)</span>
          </div>
        </div>
      </div>

      <Section num="1" title="Core Concept: Components">
        <p>A React component is a function (or class) that takes <strong>props</strong> (like constructor arguments) and returns JSX (HTML-like syntax). Components compose like Lego — you build complex UIs from small, reusable pieces.</p>
        <CompareBlock
          javaLabel="Java: stateful object"
          otherLabel="React: functional component"
          language="jsx"
          javaCode={`public class Button {
    private String label;
    private Runnable onClick;

    public Button(String label, Runnable onClick) {
        this.label = label;
        this.onClick = onClick;
    }

    public void render() {
        System.out.println("<button>" + label + "</button>");
    }
}`}
          otherCode={`// Props = constructor arguments
// JSX = what the component renders
function Button({ label, onClick, disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="btn"
    >
      {label}
    </button>
  );
}

// Usage
<Button label="Save" onClick={() => save(data)} />`}
        />
      </Section>

      <Section num="2" title="JSX — JavaScript + HTML">
        <InfoBox>JSX is not HTML — it's syntactic sugar that compiles to <code>React.createElement()</code> calls. All HTML attributes become camelCase: <code>onclick</code> → <code>onClick</code>, <code>class</code> → <code>className</code>, <code>for</code> → <code>htmlFor</code>.</InfoBox>
        <CodeBlock language="jsx" code={`// JSX rules:
// 1. Return a single root element (or Fragment)
// 2. Close all tags (even <br />, <img />)
// 3. Use {} to embed JavaScript expressions

function UserCard({ user }) {
  const isAdmin = user.role === "admin";

  return (
    <>                                  {/* Fragment = no extra DOM node */}
      <div className="card">
        <h2>{user.name}</h2>            {/* expression */}
        <p>Age: {user.age}</p>
        <p>Email: {user.email ?? "N/A"}</p>

        {/* Conditional rendering */}
        {isAdmin && <span className="badge">Admin</span>}
        {isAdmin ? <AdminPanel /> : <UserPanel />}

        {/* List rendering — key is required! */}
        <ul>
          {user.tags.map(tag => (
            <li key={tag.id}>{tag.name}</li>  // key must be unique + stable
          ))}
        </ul>

        {/* Inline styles — object, not string */}
        <div style={{ color: "red", fontSize: "14px" }}>
          Warning
        </div>
      </div>
    </>
  );
}`} />
      </Section>

      <Section num="3" title="State — useState Hook">
        <p>State is data that changes over time and triggers a re-render. Think of <code>useState</code> like a Java instance variable that automatically calls <code>repaint()</code> when changed.</p>
        <CodeBlock language="jsx" code={`import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);  // [value, setter] = useState(initial)
  //    ↑ current value  ↑ function to update it

  // NEVER mutate state directly: count++ won't trigger re-render
  // ALWAYS use the setter: setCount(newValue)

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(prev => prev - 1)}>-</button>
      {/* Use functional update when new state depends on old state */}
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

// Complex state
function Form() {
  const [form, setForm] = useState({ name: "", email: "", age: 0 });

  const update = (field) => (e) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  //              spread old state ↑    ↑ overwrite one field

  return (
    <form>
      <input value={form.name} onChange={update("name")} />
      <input value={form.email} onChange={update("email")} />
    </form>
  );
}`} />
      </Section>

      <Section num="4" title="Effects — useEffect Hook">
        <p><code>useEffect</code> runs side effects after render: fetching data, subscriptions, DOM manipulation. It replaces lifecycle methods (<code>componentDidMount</code>, <code>componentDidUpdate</code>, <code>componentWillUnmount</code>).</p>
        <CodeBlock language="jsx" code={`import { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    // Effect runs after render
    let cancelled = false;    // handle stale requests

    setLoading(true);
    fetch(\`/api/users/\${userId}\`)
      .then(r => r.json())
      .then(data => {
        if (!cancelled) {
          setUser(data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });

    // Cleanup function — like componentWillUnmount
    return () => { cancelled = true; };

  }, [userId]);  // dependency array: re-run when userId changes
  // []       = run once (componentDidMount)
  // [dep]    = run when dep changes
  // no array = run after EVERY render (usually wrong!)

  if (loading) return <Spinner />;
  if (error)   return <ErrorBox message={error} />;
  return <div>{user?.name}</div>;
}`} />
      </Section>

      <Section num="5" title="Custom Hooks">
        <p>Custom hooks extract stateful logic into reusable functions. They're the React equivalent of Java's abstract helper classes — but composable and side-effect free.</p>
        <CodeBlock language="jsx" code={`// useFetch — reusable data fetching
function useFetch(url) {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(url)
      .then(r => { if (!r.ok) throw new Error(r.statusText); return r.json(); })
      .then(d => { if (!cancelled) { setData(d); setLoading(false); } })
      .catch(e => { if (!cancelled) { setError(e); setLoading(false); } });
    return () => { cancelled = true; };
  }, [url]);

  return { data, loading, error };
}

// useLocalStorage
function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch { return defaultValue; }
  });

  const set = (newVal) => {
    setValue(newVal);
    localStorage.setItem(key, JSON.stringify(newVal));
  };

  return [value, set];
}

// Usage — reads like data fetching, no implementation needed
function UserList() {
  const { data: users, loading, error } = useFetch('/api/users');
  const [theme, setTheme] = useLocalStorage('theme', 'dark');
  // ...
}`} />
      </Section>

      <Section num="6" title="useReducer — Complex State">
        <p><code>useReducer</code> is for state that involves multiple sub-values or complex update logic. It's Java's Command pattern + State pattern combined.</p>
        <CodeBlock language="jsx" code={`import { useReducer } from 'react';

// State shape
const initialState = {
  todos: [],
  filter: "all",   // "all" | "active" | "done"
  nextId: 1,
};

// Reducer — pure function: (state, action) => newState
function todoReducer(state, action) {
  switch (action.type) {
    case "ADD":
      return {
        ...state,
        todos: [...state.todos, { id: state.nextId, text: action.text, done: false }],
        nextId: state.nextId + 1,
      };
    case "TOGGLE":
      return {
        ...state,
        todos: state.todos.map(t =>
          t.id === action.id ? { ...t, done: !t.done } : t
        ),
      };
    case "DELETE":
      return { ...state, todos: state.todos.filter(t => t.id !== action.id) };
    case "SET_FILTER":
      return { ...state, filter: action.filter };
    default:
      return state;
  }
}

function TodoApp() {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  const visible = state.todos.filter(t =>
    state.filter === "all" ? true :
    state.filter === "done" ? t.done : !t.done
  );

  return (
    <div>
      <button onClick={() => dispatch({ type: "ADD", text: "New task" })}>Add</button>
      {visible.map(t => (
        <div key={t.id}>
          <span style={{ textDecoration: t.done ? "line-through" : "none" }}>{t.text}</span>
          <button onClick={() => dispatch({ type: "TOGGLE", id: t.id })}>Toggle</button>
        </div>
      ))}
    </div>
  );
}`} />
      </Section>

      <Section num="7" title="Context API — Global State">
        <p>Context is React's dependency injection. Instead of prop-drilling (passing props through 10 layers), you put data in a Context and any component can consume it.</p>
        <CodeBlock language="jsx" code={`import { createContext, useContext, useState } from 'react';

// Create context
const AuthContext = createContext(null);

// Provider — wraps your app (or part of it)
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    const res = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    });
    setUser(await res.json());
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Consumer hook
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

// Deep in component tree — no props needed!
function UserMenu() {
  const { user, logout } = useAuth();
  return user ? <button onClick={logout}>Logout {user.name}</button> : null;
}`} />
      </Section>

      <Section num="8" title="Performance Optimization">
        <CodeBlock language="jsx" code={`import { memo, useMemo, useCallback } from 'react';

// memo — skip re-render if props unchanged (like Java's @Cacheable)
const ExpensiveList = memo(function ExpensiveList({ items, onDelete }) {
  console.log("Rendering list...");
  return (
    <ul>{items.map(i => <li key={i.id}>{i.name}<button onClick={() => onDelete(i.id)}>x</button></li>)}</ul>
  );
});

function Parent() {
  const [items, setItems] = useState([...]);
  const [other, setOther] = useState(0);

  // useMemo — memoize expensive computation
  const sortedItems = useMemo(
    () => [...items].sort((a, b) => a.name.localeCompare(b.name)),
    [items]  // only recompute when items changes
  );

  // useCallback — memoize function reference (needed for memo to work)
  const handleDelete = useCallback(
    (id) => setItems(prev => prev.filter(i => i.id !== id)),
    []  // stable function — no deps
  );

  return (
    <div>
      <button onClick={() => setOther(n => n+1)}>Other state: {other}</button>
      {/* ExpensiveList won't re-render when 'other' changes */}
      <ExpensiveList items={sortedItems} onDelete={handleDelete} />
    </div>
  );
}`} />
      </Section>

      <Section num="9" title="Design Patterns in React">
        <div className="pattern-card">
          <div className="pattern-card-header">
            <span className="pattern-icon">🧩</span>
            <div><div className="pattern-title">Compound Components</div>
            <div className="pattern-desc">Like Java Builder — components that work together</div></div>
          </div>
          <div className="pattern-card-body">
            <CodeBlock language="jsx" code={`// Compound components — shared state via context
const TabContext = createContext();

function Tabs({ children, defaultTab }) {
  const [active, setActive] = useState(defaultTab);
  return (
    <TabContext.Provider value={{ active, setActive }}>
      <div className="tabs">{children}</div>
    </TabContext.Provider>
  );
}

Tabs.List = function TabList({ children }) {
  return <div role="tablist">{children}</div>;
};

Tabs.Tab = function Tab({ value, children }) {
  const { active, setActive } = useContext(TabContext);
  return (
    <button
      role="tab"
      aria-selected={active === value}
      onClick={() => setActive(value)}
    >{children}</button>
  );
};

Tabs.Panel = function Panel({ value, children }) {
  const { active } = useContext(TabContext);
  return active === value ? <div role="tabpanel">{children}</div> : null;
};

// Usage — beautiful, self-documenting API
<Tabs defaultTab="profile">
  <Tabs.List>
    <Tabs.Tab value="profile">Profile</Tabs.Tab>
    <Tabs.Tab value="settings">Settings</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="profile"><ProfilePanel /></Tabs.Panel>
  <Tabs.Panel value="settings"><SettingsPanel /></Tabs.Panel>
</Tabs>`} />
          </div>
        </div>

        <div className="pattern-card">
          <div className="pattern-card-header">
            <span className="pattern-icon">🎁</span>
            <div><div className="pattern-title">Render Props / HOC</div></div>
          </div>
          <div className="pattern-card-body">
            <CodeBlock language="jsx" code={`// Higher-Order Component (HOC) — wraps a component to add behavior
// Like Java's AOP / decorator pattern
function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;
    return <Component {...props} user={user} />;
  };
}

const PrivatePage = withAuth(Dashboard);

// Render props — pass a render function as prop
function DataLoader({ url, render }) {
  const { data, loading, error } = useFetch(url);
  return render({ data, loading, error });
}

<DataLoader
  url="/api/users"
  render={({ data, loading }) =>
    loading ? <Spinner /> : <UserList users={data} />
  }
/>`} />
          </div>
        </div>
      </Section>

      <Section num="10" title="Mini Project: Full Todo App">
        <CodeBlock language="jsx" code={`// Complete todo app with all React concepts
import { useState, useReducer, useCallback, memo } from 'react';

const FILTERS = { ALL: "all", ACTIVE: "active", DONE: "done" };

function reducer(todos, action) {
  switch (action.type) {
    case "ADD":    return [...todos, { id: Date.now(), text: action.text, done: false }];
    case "TOGGLE": return todos.map(t => t.id === action.id ? { ...t, done: !t.done } : t);
    case "DELETE": return todos.filter(t => t.id !== action.id);
    default:       return todos;
  }
}

const TodoItem = memo(({ todo, onToggle, onDelete }) => (
  <li style={{ display: "flex", gap: 8 }}>
    <input type="checkbox" checked={todo.done} onChange={() => onToggle(todo.id)} />
    <span style={{ textDecoration: todo.done ? "line-through" : "none" }}>{todo.text}</span>
    <button onClick={() => onDelete(todo.id)}>✕</button>
  </li>
));

export default function TodoApp() {
  const [todos, dispatch]   = useReducer(reducer, []);
  const [filter, setFilter] = useState(FILTERS.ALL);
  const [input, setInput]   = useState("");

  const add    = () => { if (input.trim()) { dispatch({ type: "ADD", text: input.trim() }); setInput(""); }};
  const toggle = useCallback(id => dispatch({ type: "TOGGLE", id }), []);
  const del    = useCallback(id => dispatch({ type: "DELETE", id }), []);

  const visible = todos.filter(t =>
    filter === FILTERS.ALL ? true : filter === FILTERS.DONE ? t.done : !t.done
  );

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>Todos</h1>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && add()} placeholder="Add todo..." />
        <button onClick={add}>Add</button>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {Object.values(FILTERS).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ fontWeight: filter === f ? "bold" : "normal" }}>
            {f}
          </button>
        ))}
      </div>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {visible.map(todo => (
          <TodoItem key={todo.id} todo={todo} onToggle={toggle} onDelete={del} />
        ))}
      </ul>
      <p style={{ color: "#888" }}>{todos.filter(t => !t.done).length} remaining</p>
    </div>
  );
}`} />
      </Section>
    </div>
  )
}
