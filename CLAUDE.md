# CLAUDE.md — DevGuide Project Instructions

This file tells Claude how to maintain, extend, and improve the DevGuide React app
without degrading its quality or consistency.

---

## Project Overview

**DevGuide** is a Vite + React single-page application that serves as a comprehensive
programmer's reference — one page per technology, all styled consistently.

**Stack:** React 18 + React Router v6 + react-syntax-highlighter (Prism) + custom CSS

**Entry point:** `src/main.jsx` → `src/App.jsx`

---

## Architecture Rules

### File Layout
```
src/
  App.jsx                  — Route registry (add one <Route> per new page)
  index.css                — Global design system (DO NOT add inline styles that belong here)
  components/
    Sidebar.jsx            — Navigation (add one { label, path, icon } entry per new page)
    Header.jsx             — Top bar (rarely needs changes)
    CodeBlock.jsx          — Syntax-highlighted code + copy button
    CompareBlock.jsx       — Side-by-side Java vs X comparison
    Section.jsx            — Section wrapper + InfoBox / WarnBox / TipBox / DangerBox
  pages/
    Home.jsx               — Landing page lang-grid (add one entry to `langs` array)
    [Lang]Page.jsx         — One file per technology
    ComparisonPage.jsx     — Grand comparison tables (update when adding a language)
```

### Every New Page Must Follow This Exact Structure

```jsx
// src/pages/NewLangPage.jsx
import CodeBlock from '../components/CodeBlock'
import CompareBlock from '../components/CompareBlock'
import Section, { Sub, InfoBox, WarnBox, TipBox, DangerBox } from '../components/Section'

export default function NewLangPage() {
  return (
    <div>
      {/* 1. Hero banner */}
      <div className="page-hero">
        <div className="lang-icon">{EMOJI}</div>
        <div>
          <h1>{LANGUAGE NAME}</h1>
          <p>{One-paragraph description comparing to Java}</p>
          <div className="badges">
            <span className="badge">...</span>
            <span className="badge green">...</span>   {/* green/yellow/red/purple */}
          </div>
        </div>
      </div>

      {/* 2. Table of Contents — always include */}
      <div className="toc">
        <div className="toc-title">Contents</div>
        <ul>
          {['Section 1', 'Section 2', ...].map((t, i) => (
            <li key={t}><a href={`#s${i+1}`}>{i+1}. {t}</a></li>
          ))}
        </ul>
      </div>

      {/* 3. Sections */}
      <Section num="1" title="Syntax and Program Structure">
        <p>Explanation...</p>
        <CompareBlock javaLabel="Java" otherLabel="NewLang" language="xxx"
          javaCode={`...`} otherCode={`...`} />
        <Sub title="Sub-topic">
          <CodeBlock language="xxx" code={`...`} />
          <InfoBox>Tip or note</InfoBox>
        </Sub>
      </Section>

      {/* ... sections 2-15 ... */}

      {/* Must include Design Patterns section with pattern-card components */}
      {/* Must include Mini Project as the last section */}
    </div>
  )
}
```

---

## Wiring a New Page — Checklist

When adding a new language/technology window, complete ALL of these steps:

1. **Create** `src/pages/[Name]Page.jsx` — follow the template above
2. **Import + Route** in `src/App.jsx`:
   ```jsx
   import NewPage from './pages/NewPage'
   // inside <Routes>:
   <Route path="/newlang" element={<NewPage />} />
   ```
3. **Sidebar** — add entry to the `nav` array in `src/components/Sidebar.jsx`:
   ```js
   { label: 'NewLang', path: '/newlang', icon: '🔣' },
   ```
   Add it under the correct `{ section: '...' }` heading.
4. **Home page** — add entry to `langs` array in `src/pages/Home.jsx`:
   ```js
   { icon: '🔣', name: 'NewLang', type: 'Language', path: '/newlang', color: '#hex' },
   ```
5. **Comparison page** — add a column (or card) in `src/pages/ComparisonPage.jsx`:
   - Add to the `rows` array (language feature comparison table)
   - Add to the "When to use" grid
   - Add to the "Java migration reference" table if it's a language
6. **Verify build** — run `npm run build` and confirm zero errors before finishing

---

## Content Quality Standards

### Every page MUST include all 13+ topic areas:
1. Syntax and Program Structure
2. Variables and Data Types / Type System
3. Control Flow (if/else, loops, pattern matching if applicable)
4. Functions / Methods (declaration styles, params, first-class functions)
5. Object-Oriented Programming (classes, constructors, inheritance, abstract, interfaces)
6. Functional Programming (lambdas, closures, map/filter/reduce)
7. Error Handling (exceptions, null safety)
8. Data Structures and Collections
9. Iteration and Lazy Evaluation
10. Modules, Packages, Project Structure
11. Memory Model and Performance
12. Concurrency and Async Programming
13. Design Patterns (all 8: Singleton, Factory, Builder, Strategy, Observer, Decorator, Command, Template Method)
14. Idiomatic Practices
15. Mini Project (working, realistic example)

### Java comparison requirement
- **Every section** must compare the concept to Java
- Use `<CompareBlock>` for side-by-side code comparisons
- Use `<InfoBox>` / `<TipBox>` for "Java vs X" notes

### Code examples
- **All code must be real and correct** — no pseudocode
- Keep examples short enough to fit in a single code block
- Use `language=` matching the technology (e.g. `"python"`, `"javascript"`, `"cpp"`, `"bash"`, `"yaml"`, `"java"`)
- For DevOps pages use `"bash"`, `"yaml"`, or `"dockerfile"` as appropriate

### Design Patterns section
Each pattern MUST use the `pattern-card` structure:
```jsx
<div className="pattern-card">
  <div className="pattern-card-header">
    <span className="pattern-icon">🔒</span>
    <div>
      <div className="pattern-title">Pattern Name</div>
      <div className="pattern-desc">One-line description</div>
    </div>
  </div>
  <div className="pattern-card-body">
    <p>Context / explanation</p>
    <CodeBlock language="xxx" code={`...`} />
  </div>
</div>
```

---

## JSX Template Literal Pitfalls

Code inside backtick template literals that contains `${...}` with colons or
array subscripts will confuse the JSX parser. Always escape:

```jsx
// ❌ Will cause parse error
code={`VERSION="${1:-latest}"`}
code={`echo "${fruits[@]}"`}

// ✅ Escape the dollar sign
code={`VERSION="\${1:-latest}"`}
code={`echo "\${fruits[@]}"`}
```

Run `npm run build` to catch these errors before declaring done.

---

## CSS Design System — Do Not Break

All styling lives in `src/index.css`. The CSS variables are:

```css
--bg, --surface, --surface2, --border          /* backgrounds */
--text, --text-dim, --text-bright              /* text */
--accent (#6c8fff), --accent2 (#a78bfa)        /* primary colors */
--green, --yellow, --red, --orange, --cyan, --pink  /* semantic colors */
```

### Existing class names to reuse — never invent new ones for these cases:
- `.page-hero` — language page header
- `.badge`, `.badge.green/.yellow/.red/.purple` — inline tags
- `.section`, `.section-title`, `.subsection`, `.subsection-title`
- `.code-wrap`, `.code-header`, `.code-body` — code blocks (managed by CodeBlock.jsx)
- `.compare-grid`, `.compare-box` — side-by-side comparison (managed by CompareBlock.jsx)
- `.info-box`, `.warn-box`, `.tip-box`, `.danger-box` — callout boxes
- `.pattern-card`, `.pattern-card-header`, `.pattern-card-body` — design pattern cards
- `.toc`, `.toc-title` — table of contents
- `.mega-table` — wide scrollable table
- `.comparison-grid`, `.comp-card` — comparison page grid

Inline styles are acceptable for one-off layout (e.g. `style={{ display: 'flex', gap: 8 }}`).
Do NOT add new CSS classes for things already covered above.

---

## Performance Notes

- The bundle is large (~1MB JS) because all content is inline JSX.
- Do NOT add heavy dependencies — the only allowed new npm packages are:
  - Additional syntax highlighting languages (already included via react-syntax-highlighter)
  - Nothing else without checking first
- For very large new pages, consider lazy loading:
  ```jsx
  const NewPage = React.lazy(() => import('./pages/NewPage'))
  // wrap in <Suspense fallback={<div>Loading...</div>}> in App.jsx
  ```

---

## Commands

```bash
npm run dev      # start dev server (http://localhost:5173)
npm run build    # production build — run this to verify no errors
npm run preview  # preview production build locally
```

---

## Technology Coverage Priorities

When new windows are requested, add them in this priority order for maximum consistency:

**Languages:** Rust, Go, TypeScript, Swift, Kotlin, R, Scala
**Frameworks:** Next.js, FastAPI, Spring Boot (standalone), Vue, Angular
**Databases:** PostgreSQL, Redis, Elasticsearch
**DevOps:** Terraform, Ansible, GitHub Actions, AWS CLI

For each, follow the exact same 15-section template and wiring checklist.
