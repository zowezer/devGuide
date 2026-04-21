# DevGuide — Class & Component Diagram

Full structural documentation of every component, page, and their relationships.

---

## Application Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Browser                                                                     │
│  http://localhost:5173                                                        │
└─────────────────────────┬───────────────────────────────────────────────────┘
                          │ renders
                          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  main.jsx                                                                    │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  <BrowserRouter>                                                     │   │
│  │    <App />                                                           │   │
│  │  </BrowserRouter>                                                    │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Tree

```
App
├── Header
└── div.layout
    ├── Sidebar
    │   └── NavLink × N  (one per route)
    └── main.main
        └── Routes
            ├── Route "/"           → Home
            ├── Route "/java"       → JavaPage
            ├── Route "/python"     → PythonPage
            ├── Route "/javascript" → JavaScriptPage
            ├── Route "/c"          → CPage
            ├── Route "/cpp"        → CppPage
            ├── Route "/matlab"     → MatlabPage
            ├── Route "/react"      → ReactPage
            ├── Route "/mongodb"    → MongoPage
            ├── Route "/docker"     → DockerPage
            ├── Route "/kubernetes" → KubernetesPage
            ├── Route "/linux"      → LinuxPage
            ├── Route "/git"        → GitPage
            └── Route "/comparison" → ComparisonPage
```

---

## Shared Components

### `<Header />`
```
Header
├── Props: none
├── State: none
└── Renders:
    ├── .header-logo  "DevGuide"
    └── .header-subtitle
```

### `<Sidebar />`
```
Sidebar
├── Props: none
├── State: none (uses React Router's useMatch internally via NavLink)
├── Data: nav[] array (static, defined in file)
│   ├── { label, path, icon }   → renders as <NavLink className="sidebar-item">
│   └── { section }             → renders as <div className="sidebar-section">
└── Renders:
    └── <nav className="sidebar">
        ├── NavLink "🏠 Home"          → /
        ├── section "Languages"
        ├── NavLink "☕ Java"          → /java
        ├── NavLink "🐍 Python"        → /python
        ├── NavLink "🟨 JavaScript"    → /javascript
        ├── NavLink "🔵 C"             → /c
        ├── NavLink "🔷 C++"           → /cpp
        ├── NavLink "📊 MATLAB"        → /matlab
        ├── section "Frameworks & DBs"
        ├── NavLink "⚛️ React"         → /react
        ├── NavLink "🍃 MongoDB"       → /mongodb
        ├── section "DevOps & Tools"
        ├── NavLink "🐳 Docker"        → /docker
        ├── NavLink "☸️ Kubernetes"    → /kubernetes
        ├── NavLink "🐧 Linux"         → /linux
        ├── NavLink "🌿 Git"           → /git
        ├── section "Summary"
        └── NavLink "⚖️ Comparison"    → /comparison
```

### `<CodeBlock />`
```
CodeBlock
├── Props:
│   ├── code: string           (required) — the source code to display
│   ├── language: string       (default: "javascript") — Prism language key
│   └── title: string          (optional) — overrides language label
├── State:
│   └── copied: boolean        — controls "Copy" / "✓ Copied" button text
├── Behavior:
│   └── onClick → navigator.clipboard.writeText(code) → setCopied(true) → timeout reset
└── Renders:
    └── div.code-wrap
        ├── div.code-header
        │   ├── span.code-lang      (title || language)
        │   └── button.code-copy    ("Copy" or "✓ Copied")
        └── div.code-body
            └── <SyntaxHighlighter language={language} style={vscDarkPlus}>
                    {code.trim()}
                </SyntaxHighlighter>
```

### `<CompareBlock />`
```
CompareBlock
├── Props:
│   ├── javaCode: string       (required)
│   ├── otherCode: string      (required)
│   ├── javaLabel: string      (default: "Java")
│   ├── otherLabel: string     (required)
│   └── language: string       (default: "python") — syntax lang for otherCode
├── State: none
└── Renders:
    └── div.compare-grid
        ├── div.compare-box                    (Java side)
        │   ├── div.box-header
        │   │   ├── div.dot.java               (orange dot)
        │   │   └── span.box-label             javaLabel
        │   └── div.code-body
        │       └── <SyntaxHighlighter language="java">
        │               {javaCode}
        │           </SyntaxHighlighter>
        └── div.compare-box                    (other lang side)
            ├── div.box-header
            │   ├── div.dot                    (blue dot)
            │   └── span.box-label             otherLabel
            └── div.code-body
                └── <SyntaxHighlighter language={language}>
                        {otherCode}
                    </SyntaxHighlighter>
```

### `<Section />` and helpers
```
Section
├── Props:
│   ├── num: string | number   — section number shown in badge
│   ├── title: string          — section heading
│   └── children: ReactNode
├── State: none
└── Renders:
    └── div.section id="s{num}"
        ├── h2.section-title
        │   ├── span.num    (num)
        │   └── {title}
        └── {children}

Sub
├── Props: { title: string, children: ReactNode }
└── Renders: div.subsection > div.subsection-title + {children}

InfoBox   → div.info-box  + "ℹ️" icon  (cyan)
WarnBox   → div.warn-box  + "⚠️" icon  (yellow)
TipBox    → div.tip-box   + "💡" icon  (green)
DangerBox → div.danger-box+ "🚨" icon  (red)
```

---

## Page Components

All page components follow the same interface:

```
[Lang]Page
├── Props: none   (data is all static / inline)
├── State: none   (stateless — pure render)
├── Imports:
│   ├── CodeBlock
│   ├── CompareBlock
│   └── Section, Sub, InfoBox, WarnBox, TipBox, DangerBox
└── Structure:
    ├── div.page-hero      (lang icon, title, description, badges)
    ├── div.toc            (anchor links to all sections)
    └── Section × N       (content sections, numbered 1..15+)
        ├── Sub × M       (subsections within each section)
        ├── CodeBlock × K (code examples)
        ├── CompareBlock  (Java vs this language)
        ├── pattern-card  (design pattern cards in section 13)
        └── table         (comparison tables)
```

### Individual Page Summary

| Component | Route | Sections | Design Patterns | Mini Project |
|---|---|---|---|---|
| Home | / | — (grid of lang cards) | — | — |
| JavaPage | /java | 17 | ✓ All 8 GoF | Typed Event System |
| PythonPage | /python | 15 | ✓ All 8 GoF | Task Manager CLI |
| JavaScriptPage | /javascript | 13 | ✓ Singleton, Observer, Strategy | Todo API (Node.js) |
| CPage | /c | 9 | ✓ Singleton, Strategy, Factory (vtable) | Linked List |
| CppPage | /cpp | 9 | ✓ Singleton, Builder, CRTP | Generic Matrix |
| MatlabPage | /matlab | 10 | — | ODE Solver (Lotka-Volterra) |
| ReactPage | /react | 10 | ✓ Compound, HOC, Render Props | Full Todo App |
| MongoPage | /mongodb | 7 | — | User REST API (Express + Mongoose) |
| DockerPage | /docker | 7 | — | — (best-practices table) |
| KubernetesPage | /kubernetes | 10 | — | Full deploy flow |
| LinuxPage | /linux | 9 | — | Deploy shell script |
| GitPage | /git | 10 | — | GitHub Flow workflow |
| ComparisonPage | /comparison | 7 | ✓ All languages table | Learning path |

---

## Data Flow Diagram

```
User clicks NavLink
        │
        ▼
React Router matches path
        │
        ▼
[Lang]Page component renders
        │
        ├── Passes static code strings to CodeBlock
        │                │
        │                ▼
        │       react-syntax-highlighter
        │       renders highlighted HTML
        │
        ├── Passes two code strings to CompareBlock
        │   (each uses SyntaxHighlighter internally)
        │
        └── Wraps text/code in Section/Sub/InfoBox
            (pure presentational wrappers)
```

No API calls. No external data sources. All content is **static inline JSX**.

---

## CSS Architecture

```
src/index.css
├── :root                       CSS custom properties (design tokens)
│   ├── Layout variables        --sidebar-w, --header-h
│   ├── Color palette           --bg, --surface, --surface2, --border
│   ├── Text colors             --text, --text-dim, --text-bright
│   └── Semantic colors         --accent, --accent2, --green, --yellow, --red...
│
├── Base reset                  *, body, #root
├── Scrollbar styling
│
├── Layout classes
│   ├── .header
│   ├── .layout
│   ├── .sidebar, .sidebar-section, .sidebar-item, .sidebar-item.active
│   └── .main
│
├── Page components
│   ├── .page-hero, .lang-icon, .badges, .badge (+ color variants)
│   ├── .section, .section-title, .subsection, .subsection-title
│   └── .toc, .toc-title
│
├── Content components
│   ├── .code-wrap, .code-header, .code-lang, .code-copy, .code-body
│   ├── .compare-grid, .compare-box, .box-header, .dot, .box-label
│   ├── .info-box, .warn-box, .tip-box, .danger-box
│   └── table, th, td
│
├── Pattern cards
│   ├── .pattern-card, .pattern-card-header, .pattern-card-body
│   ├── .pattern-icon, .pattern-title, .pattern-desc
│
├── Comparison page
│   ├── .comparison-grid, .comp-card
│   └── .mega-table
│
├── Home page
│   ├── .home-hero
│   ├── .lang-grid, .lang-card, .lc-icon, .lc-name, .lc-type
│
└── Responsive
    └── @media (max-width: 768px)
        ├── Sidebar hidden (width: 0)
        └── Main content full width
```

---

## Dependency Graph

```
main.jsx
  └── App.jsx
        ├── react-router-dom (BrowserRouter, Routes, Route)
        ├── components/Sidebar.jsx
        │     └── react-router-dom (NavLink)
        ├── components/Header.jsx
        └── pages/*.jsx
              ├── components/CodeBlock.jsx
              │     └── react-syntax-highlighter (Prism + vscDarkPlus)
              ├── components/CompareBlock.jsx
              │     └── react-syntax-highlighter (Prism + vscDarkPlus)
              └── components/Section.jsx
                    (no external deps)
```

**npm packages used:**
- `react` + `react-dom` — UI framework
- `react-router-dom` — client-side routing
- `react-syntax-highlighter` — code block rendering

**npm packages NOT used (intentionally avoided):**
- No state management library (Redux, Zustand) — all content is static
- No CSS framework (Tailwind, MUI) — custom design system
- No data fetching library — no API calls
- No testing library — content app, not logic-heavy

---

## Extension Points

To add a new page, touch exactly these 5 files:

```
src/App.jsx                  +1 import, +1 <Route>
src/components/Sidebar.jsx   +1 item in nav[]
src/pages/Home.jsx           +1 item in langs[]
src/pages/[New]Page.jsx      CREATE (new file)
src/pages/ComparisonPage.jsx UPDATE rows[], devopsRows[], use-case grid
```

The `Section`, `Sub`, `CodeBlock`, `CompareBlock`, and callout box components
require **zero changes** when adding new pages — they are fully generic.
