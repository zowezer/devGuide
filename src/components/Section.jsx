export default function Section({ num, title, children }) {
  return (
    <div className="section" id={`s${num}`}>
      <h2 className="section-title">
        {num && <span className="num">{num}</span>}
        {title}
      </h2>
      {children}
    </div>
  )
}

export function Sub({ title, children }) {
  return (
    <div className="subsection">
      <div className="subsection-title">{title}</div>
      {children}
    </div>
  )
}

export function InfoBox({ children }) {
  return <div className="info-box"><span className="icon">ℹ️</span><div>{children}</div></div>
}

export function WarnBox({ children }) {
  return <div className="warn-box"><span className="icon">⚠️</span><div>{children}</div></div>
}

export function TipBox({ children }) {
  return <div className="tip-box"><span className="icon">💡</span><div>{children}</div></div>
}

export function DangerBox({ children }) {
  return <div className="danger-box"><span className="icon">🚨</span><div>{children}</div></div>
}
