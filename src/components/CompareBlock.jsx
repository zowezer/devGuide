import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

export default function CompareBlock({ javaCode, otherCode, javaLabel = 'Java', otherLabel, language = 'python' }) {
  return (
    <div className="compare-grid">
      <div className="compare-box">
        <div className="box-header">
          <div className="dot java" />
          <span className="box-label">{javaLabel}</span>
        </div>
        <div className="code-body">
          <SyntaxHighlighter language="java" style={vscDarkPlus}
            customStyle={{ margin: 0, background: 'transparent', fontSize: '12px' }}>
            {javaCode.trim()}
          </SyntaxHighlighter>
        </div>
      </div>
      <div className="compare-box">
        <div className="box-header">
          <div className="dot" />
          <span className="box-label">{otherLabel}</span>
        </div>
        <div className="code-body">
          <SyntaxHighlighter language={language} style={vscDarkPlus}
            customStyle={{ margin: 0, background: 'transparent', fontSize: '12px' }}>
            {otherCode.trim()}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  )
}
