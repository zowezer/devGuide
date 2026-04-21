# DevGuide — The Complete Programmer's Reference

> A deep, Java-centric learning guide for 12 technologies — built as a React single-page application.

## What Is This?

DevGuide is a structured, comprehensive reference for developers who already know **Java** and want to transfer that knowledge into new languages, frameworks, and DevOps tools. Every page covers the same 15 topics — from syntax to design patterns — so you always know where to look.

## Technologies Covered

| Category | Technologies |
|---|---|
| Languages | ☕ Java · 🐍 Python · 🟨 JavaScript · 🔵 C · 🔷 C++ · 📊 MATLAB |
| Frameworks & DBs | ⚛️ React · 🍃 MongoDB |
| DevOps & Tools | 🐳 Docker · ☸️ Kubernetes · 🐧 Linux · 🌿 Git |
| Summary | ⚖️ Comparison (grand tables) |

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# → http://localhost:5173

# Production build
npm run build

# Preview production build
npm run preview
```

## What Each Page Contains

Every technology page follows the same 15-section structure:

| # | Section |
|---|---|
| 1 | Syntax and Program Structure |
| 2 | Variables, Types, and Type System |
| 3 | Control Flow (if/else, loops, pattern matching) |
| 4 | Functions / Methods |
| 5 | Object-Oriented Programming |
| 6 | Functional Programming |
| 7 | Error Handling and Null Safety |
| 8 | Data Structures and Collections |
| 9 | Iteration and Lazy Evaluation |
| 10 | Modules, Packages, Project Structure |
| 11 | Memory Model and Performance |
| 12 | Concurrency and Async Programming |
| 13 | Design Patterns (all 8 GoF patterns) |
| 14 | Idiomatic Practices |
| 15 | Mini Project |

Every section includes **side-by-side Java comparisons**, **runnable code examples**, and **copy buttons**.

## Project Structure

```
lang/
├── public/                         Static assets
├── src/
│   ├── main.jsx                    App entry point (React + Router)
│   ├── App.jsx                     Route registry
│   ├── index.css                   Global design system (dark theme)
│   ├── components/
│   │   ├── Sidebar.jsx             Fixed navigation sidebar
│   │   ├── Header.jsx              Top bar
│   │   ├── CodeBlock.jsx           Syntax-highlighted code + copy
│   │   ├── CompareBlock.jsx        Side-by-side Java vs X
│   │   └── Section.jsx             Section wrapper + callout boxes
│   └── pages/
│       ├── Home.jsx                Landing page
│       ├── JavaPage.jsx            ☕ Java (baseline + modern Java 17–21)
│       ├── PythonPage.jsx          🐍 Python
│       ├── JavaScriptPage.jsx      🟨 JavaScript
│       ├── CPage.jsx               🔵 C
│       ├── CppPage.jsx             🔷 C++
│       ├── MatlabPage.jsx          📊 MATLAB
│       ├── ReactPage.jsx           ⚛️ React
│       ├── MongoPage.jsx           🍃 MongoDB
│       ├── DockerPage.jsx          🐳 Docker
│       ├── KubernetesPage.jsx      ☸️ Kubernetes
│       ├── LinuxPage.jsx           🐧 Linux
│       ├── GitPage.jsx             🌿 Git
│       └── ComparisonPage.jsx      ⚖️ Grand comparison tables
├── CLAUDE.md                       Instructions for AI-assisted development
├── classes.md                      Full component/class diagram
├── README.md                       This file
├── package.json
└── vite.config.js
```

## Adding a New Technology Window

See `CLAUDE.md` for the complete guide. In short:

1. Create `src/pages/NewLangPage.jsx` following the 15-section template
2. Add route in `src/App.jsx`
3. Add nav entry in `src/components/Sidebar.jsx`
4. Add card in `src/pages/Home.jsx`
5. Add column/card in `src/pages/ComparisonPage.jsx`
6. Run `npm run build` to verify

## Design System

The app uses a custom dark-theme CSS design system defined in `src/index.css`.

**Primary colors:** `--accent: #6c8fff` (blue) · `--accent2: #a78bfa` (purple)

**Semantic colors:** `--green` · `--yellow` · `--red` · `--orange` · `--cyan`

Key reusable components:

```jsx
<CodeBlock language="python" code={`your code here`} title="Optional title" />

<CompareBlock
  javaLabel="Java" javaCode={`...`}
  otherLabel="Python" otherCode={`...`}
  language="python"
/>

<Section num="1" title="Section Title">
  <Sub title="Subsection">
    <InfoBox>Blue info callout</InfoBox>
    <WarnBox>Yellow warning callout</WarnBox>
    <TipBox>Green tip callout</TipBox>
    <DangerBox>Red danger callout</DangerBox>
  </Sub>
</Section>
```

## Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| React | 18 | UI framework |
| React Router | v6 | Client-side routing |
| react-syntax-highlighter | latest | Code syntax highlighting |
| Vite | 8 | Build tool and dev server |

## License

 Apache License.
