import { Link } from 'react-router-dom'

const langs = [
  { icon: '☕', name: 'Java', type: 'Language (baseline)', path: '/java', color: '#f97316' },
  { icon: '🐍', name: 'Python', type: 'Language', path: '/python', color: '#3b82f6' },
  { icon: '🟨', name: 'JavaScript', type: 'Language', path: '/javascript', color: '#fbbf24' },
  { icon: '🔵', name: 'C', type: 'Language', path: '/c', color: '#60a5fa' },
  { icon: '🔷', name: 'C++', type: 'Language', path: '/cpp', color: '#818cf8' },
  { icon: '📊', name: 'MATLAB', type: 'Language', path: '/matlab', color: '#f97316' },
  { icon: '⚛️', name: 'React', type: 'Framework', path: '/react', color: '#22d3ee' },
  { icon: '🍃', name: 'MongoDB', type: 'Database', path: '/mongodb', color: '#4ade80' },
  { icon: '🐳', name: 'Docker', type: 'DevOps', path: '/docker', color: '#38bdf8' },
  { icon: '☸️', name: 'Kubernetes', type: 'DevOps', path: '/kubernetes', color: '#6366f1' },
  { icon: '🐧', name: 'Linux', type: 'OS / CLI', path: '/linux', color: '#e2e8f0' },
  { icon: '🌿', name: 'Git', type: 'Version Control', path: '/git', color: '#f87171' },
  { icon: '🦀', name: 'Rust', type: 'Language', path: '/rust', color: '#f97316' },
  { icon: '⚡', name: 'Zig', type: 'Language', path: '/zig', color: '#f59e0b' },
  { icon: '🐍', name: 'Python Stdlib', type: 'Library', path: '/python-stdlib', color: '#3b82f6' },
  { icon: '🔴', name: 'Redis', type: 'Database', path: '/redis', color: '#ef4444' },
  { icon: '🌐', name: 'Computer Networking', type: 'Networking', path: '/networking', color: '#06b6d4' },
  { icon: '🔗', name: 'Web Protocols', type: 'Networking', path: '/web-protocols', color: '#8b5cf6' },
  { icon: '🕸️', name: 'Distributed Systems', type: 'Architecture', path: '/distributed-systems', color: '#6366f1' },
  { icon: '🖥️', name: 'Backend Engineering', type: 'Engineering', path: '/backend', color: '#10b981' },
  { icon: '📡', name: 'IoT Networking', type: 'Hardware', path: '/iot', color: '#14b8a6' },
  { icon: '🔧', name: 'Embedded Systems', type: 'Hardware', path: '/embedded', color: '#64748b' },
  { icon: '🔌', name: 'Arduino', type: 'Hardware', path: '/arduino', color: '#00979d' },
  { icon: '🍓', name: 'Raspberry Pi', type: 'Hardware', path: '/raspberry-pi', color: '#c84b4b' },
  { icon: '⚖️', name: 'Comparison', type: 'Summary', path: '/comparison', color: '#a78bfa' },
]

export default function Home() {
  return (
    <div>
      <div className="home-hero">
        <h1>The Complete Dev Guide</h1>
        <p>A deep, Java-centric learning reference for 11 technologies — languages, frameworks, databases, and DevOps tools. Built for programmers who already know Java and want to transfer their knowledge efficiently.</p>
        <div className="lang-grid">
          {langs.map(l => (
            <Link key={l.path} to={l.path} className="lang-card">
              <div className="lc-icon">{l.icon}</div>
              <div className="lc-name">{l.name}</div>
              <div className="lc-type">{l.type}</div>
            </Link>
          ))}
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">How to use this guide</h2>
        <p>Each chapter covers the same 13 topics — Syntax, OOP, Functional Programming, Error Handling, Collections, Iteration, Modules, Memory, Concurrency, Design Patterns, Idioms, Mini Projects, and Java Comparisons — so you always know where to look. Every section has live code examples with copy buttons.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16, marginTop: 20 }}>
          {[
            ['📖', 'Deep conceptual explanations, not summaries'],
            ['💻', 'Runnable code examples for every concept'],
            ['☕', 'Side-by-side Java comparisons throughout'],
            ['🎯', 'Design patterns in every language'],
            ['🏗️', 'Practical mini-projects at the end'],
            ['⚖️', 'Grand comparison table at the end'],
          ].map(([icon, text]) => (
            <div key={text} style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 10, padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'flex-start'
            }}>
              <span style={{ fontSize: 20 }}>{icon}</span>
              <span style={{ fontSize: 13, color: 'var(--text)' }}>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
