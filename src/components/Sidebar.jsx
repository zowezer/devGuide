import { NavLink } from 'react-router-dom'

const nav = [
  { label: 'Home', path: '/', icon: '🏠' },
  { section: 'Languages' },
  { label: 'Java', path: '/java', icon: '☕' },
  { label: 'Python', path: '/python', icon: '🐍' },
  { label: 'JavaScript', path: '/javascript', icon: '🟨' },
  { label: 'C', path: '/c', icon: '🔵' },
  { label: 'C++', path: '/cpp', icon: '🔷' },
  { label: 'MATLAB', path: '/matlab', icon: '📊' },
  { label: 'Rust', path: '/rust', icon: '🦀' },
  { label: 'Zig', path: '/zig', icon: '⚡' },
  { label: 'Python Stdlib', path: '/python-stdlib', icon: '🐍' },
  { section: 'Frameworks & DBs' },
  { label: 'React', path: '/react', icon: '⚛️' },
  { label: 'MongoDB', path: '/mongodb', icon: '🍃' },
  { label: 'Redis', path: '/redis', icon: '🔴' },
  { section: 'Networking & Systems' },
  { label: 'Computer Networking', path: '/networking', icon: '🌐' },
  { label: 'Web Protocols', path: '/web-protocols', icon: '🔗' },
  { label: 'Distributed Systems', path: '/distributed-systems', icon: '🕸️' },
  { label: 'Backend Engineering', path: '/backend', icon: '🖥️' },
  { section: 'Hardware & Embedded' },
  { label: 'IoT Networking', path: '/iot', icon: '📡' },
  { label: 'Embedded Systems', path: '/embedded', icon: '🔧' },
  { label: 'Arduino', path: '/arduino', icon: '🔌' },
  { label: 'Raspberry Pi', path: '/raspberry-pi', icon: '🍓' },
  { section: 'DevOps & Tools' },
  { label: 'Docker', path: '/docker', icon: '🐳' },
  { label: 'Kubernetes', path: '/kubernetes', icon: '☸️' },
  { label: 'Linux', path: '/linux', icon: '🐧' },
  { label: 'Git', path: '/git', icon: '🌿' },
  { section: 'Summary' },
  { label: 'Comparison', path: '/comparison', icon: '⚖️' },
]

export default function Sidebar() {
  return (
    <nav className="sidebar">
      {nav.map((item, i) =>
        item.section ? (
          <div key={i} className="sidebar-section">{item.section}</div>
        ) : (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 'sidebar-item' + (isActive ? ' active' : '')}
            end={item.path === '/'}
          >
            <span className="icon">{item.icon}</span>
            {item.label}
          </NavLink>
        )
      )}
    </nav>
  )
}
