import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

export default function CodeBlock({ code, language = 'javascript', title }) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="code-wrap">
      <div className="code-header">
        <span className="code-lang">{title || language}</span>
        <button className="code-copy" onClick={copy}>{copied ? '✓ Copied' : 'Copy'}</button>
      </div>
      <div className="code-body">
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          customStyle={{ margin: 0, background: 'transparent', fontSize: '13px' }}
          showLineNumbers={false}
        >
          {code.trim()}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}
