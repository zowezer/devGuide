import { useState, useEffect, useRef } from 'react'

// ─── PointerViz ────────────────────────────────────────────────────────────────
export function PointerViz({ defaultLang = 'c' }) {
  const [lang, setLang] = useState(defaultLang)
  const [mem, setMem] = useState(() => {
    const m = Array(16).fill(null)
    m[2] = { label: 'x', value: 42, type: 'int' }
    m[5] = { label: 'y', value: 100, type: 'int' }
    return m
  })
  const [ptrCell, setPtrCell] = useState(null)   // index where pointer/ref lives
  const [ptrTarget, setPtrTarget] = useState(null) // index it points to
  const [log, setLog] = useState([])

  const addLog = (msg) => setLog(prev => [msg, ...prev].slice(0, 6))

  const addrOf = (idx) => `0x${(0x1000 + idx * 4).toString(16).toUpperCase()}`

  const handleSetPointer = () => {
    const pIdx = 9
    const target = 2
    const newMem = [...mem]
    if (lang === 'c') {
      newMem[pIdx] = { label: 'p', value: addrOf(target), type: 'int*' }
    } else {
      newMem[pIdx] = { label: 'ref', value: addrOf(target), type: 'int&' }
    }
    setMem(newMem)
    setPtrCell(pIdx)
    setPtrTarget(target)
    addLog(lang === 'c' ? `int *p = &x;  // p = ${addrOf(target)}` : `int &ref = x;  // ref binds to x at ${addrOf(target)}`)
  }

  const handleDeref = () => {
    if (ptrTarget === null) { addLog('// No pointer set yet'); return }
    const val = mem[ptrTarget]?.value
    addLog(lang === 'c' ? `int v = *p;  // v = ${val}` : `int v = ref;  // v = ${val}`)
  }

  const handleWrite = () => {
    if (ptrTarget === null) { addLog('// No pointer set yet'); return }
    const newMem = [...mem]
    newMem[ptrTarget] = { ...newMem[ptrTarget], value: 99 }
    setMem(newMem)
    addLog(lang === 'c' ? `*p = 99;  // x is now 99` : `ref = 99;  // x is now 99`)
  }

  const handleReset = () => {
    const m = Array(16).fill(null)
    m[2] = { label: 'x', value: 42, type: 'int' }
    m[5] = { label: 'y', value: 100, type: 'int' }
    setMem(m)
    setPtrCell(null)
    setPtrTarget(null)
    setLog([])
  }

  const cellStyle = (i) => {
    let bg = 'var(--surface2)'
    let border = '1px solid var(--border)'
    if (i === ptrTarget) { bg = '#1e3a5f'; border = '1px solid #6c8fff' }
    if (i === ptrCell) { bg = '#2d1e4f'; border = '1px solid #a78bfa' }
    if (mem[i] && i !== ptrCell && i !== ptrTarget) { bg = '#1a2e1a'; border = '1px solid #4ade80' }
    return { background: bg, border, borderRadius: 6, padding: '6px 4px', textAlign: 'center', fontSize: 10, minWidth: 56, minHeight: 44, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }
  }

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, marginTop: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <span style={{ color: 'var(--accent)', fontWeight: 700 }}>Pointer / Reference Visualizer</span>
        <div style={{ display: 'flex', gap: 8 }}>
          {['c', 'cpp'].map(l => (
            <button key={l} onClick={() => { setLang(l); handleReset() }}
              style={{ padding: '4px 14px', borderRadius: 6, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 12,
                background: lang === l ? 'var(--accent)' : 'var(--surface2)', color: lang === l ? '#fff' : 'var(--text-dim)' }}>
              {l === 'c' ? 'C' : 'C++'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 16 }}>
        {mem.map((cell, i) => (
          <div key={i} style={cellStyle(i)}>
            {cell ? (
              <>
                <span style={{ color: '#4ade80', fontWeight: 700, fontSize: 11 }}>{cell.label}</span>
                <span style={{ color: 'var(--text-bright)', fontSize: 10 }}>{cell.value}</span>
                <span style={{ color: 'var(--text-dim)', fontSize: 9 }}>{cell.type}</span>
                <span style={{ color: 'var(--text-dim)', fontSize: 8 }}>{addrOf(i)}</span>
              </>
            ) : (
              <span style={{ color: 'var(--border)', fontSize: 9 }}>{addrOf(i)}</span>
            )}
          </div>
        ))}
      </div>

      {ptrCell !== null && ptrTarget !== null && (
        <div style={{ marginBottom: 12, padding: '8px 12px', background: 'var(--surface2)', borderRadius: 8, fontSize: 12, color: 'var(--text-dim)' }}>
          <span style={{ color: '#a78bfa' }}>{mem[ptrCell]?.label}</span>
          {' → '}
          <span style={{ color: '#6c8fff' }}>{addrOf(ptrTarget)}</span>
          {' → value: '}
          <span style={{ color: '#4ade80' }}>{mem[ptrTarget]?.value}</span>
          {lang === 'cpp' && <span style={{ color: '#f97316', marginLeft: 8 }}>(reference: no null, no rebind)</span>}
          {lang === 'c' && <span style={{ color: '#fbbf24', marginLeft: 8 }}>(pointer: can be NULL, can be reassigned)</span>}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        {[
          { label: lang === 'c' ? 'int *p = &x' : 'int &ref = x', action: handleSetPointer, color: '#6c8fff' },
          { label: lang === 'c' ? 'read *p' : 'read ref', action: handleDeref, color: '#4ade80' },
          { label: lang === 'c' ? '*p = 99' : 'ref = 99', action: handleWrite, color: '#f97316' },
          { label: 'Reset', action: handleReset, color: '#ef4444' },
        ].map(({ label, action, color }) => (
          <button key={label} onClick={action} style={{
            padding: '6px 14px', borderRadius: 7, border: `1px solid ${color}`, background: 'transparent',
            color, cursor: 'pointer', fontSize: 12, fontFamily: 'monospace'
          }}>{label}</button>
        ))}
      </div>

      <div style={{ fontFamily: 'monospace', fontSize: 12, background: '#0d1117', borderRadius: 8, padding: 10, minHeight: 60 }}>
        {log.length === 0 && <span style={{ color: 'var(--text-dim)' }}>// Click actions above to see code</span>}
        {log.map((l, i) => <div key={i} style={{ color: i === 0 ? '#4ade80' : 'var(--text-dim)' }}>{l}</div>)}
      </div>
    </div>
  )
}

// ─── StackHeapViz ───────────────────────────────────────────────────────────────
export function StackHeapViz({ defaultLang = 'c' }) {
  const [lang, setLang] = useState(defaultLang)
  const [stack, setStack] = useState([{ name: 'main()', vars: ['argc=1', 'argv=0x...'] }])
  const [heap, setHeap] = useState([])
  const [nextId, setNextId] = useState(1)
  const [leaks, setLeaks] = useState([])
  const [log, setLog] = useState([])

  const addLog = (msg) => setLog(prev => [msg, ...prev].slice(0, 5))

  const callFn = () => {
    const name = `func${stack.length}()`
    setStack(prev => [...prev, { name, vars: [`local_int=${Math.floor(Math.random()*100)}`, `local_ptr=0x${(0x7fff - stack.length * 16).toString(16)}`] }])
    addLog(`// Push stack frame: ${name}`)
  }

  const returnFn = () => {
    if (stack.length <= 1) { addLog('// Cannot pop main()'); return }
    const frame = stack[stack.length - 1]
    if (lang === 'cpp') {
      const owned = heap.filter(b => b.owner === frame.name)
      if (owned.length > 0) {
        setHeap(prev => prev.filter(b => b.owner !== frame.name))
        addLog(`// RAII: unique_ptr freed ${owned.length} block(s) automatically`)
      }
    } else {
      const owned = heap.filter(b => b.owner === frame.name && !b.freed)
      if (owned.length > 0) {
        setLeaks(prev => [...prev, ...owned.map(b => b.id)])
        addLog(`// ⚠ LEAK: ${owned.length} malloc'd block(s) not freed!`)
      }
    }
    setStack(prev => prev.slice(0, -1))
    if (lang === 'cpp' && heap.filter(b => b.owner === stack[stack.length-1]?.name).length > 0) return
    if (lang === 'c' && heap.filter(b => b.owner === stack[stack.length-1]?.name && !b.freed).length === 0) {
      addLog(`// Pop frame: ${frame.name}`)
    }
  }

  const alloc = () => {
    const frame = stack[stack.length - 1]
    const id = nextId
    const size = [16, 32, 64, 128][Math.floor(Math.random() * 4)]
    setNextId(id + 1)
    setHeap(prev => [...prev, { id, size, owner: frame.name, freed: false, smart: lang === 'cpp' }])
    addLog(lang === 'c'
      ? `void *p${id} = malloc(${size});  // 0x${(0x4000 + id * 64).toString(16)}`
      : `auto p${id} = make_unique<T>(${size});  // heap, RAII`)
  }

  const freeBlock = (id) => {
    setHeap(prev => prev.map(b => b.id === id ? { ...b, freed: true } : b))
    setLeaks(prev => prev.filter(l => l !== id))
    addLog(`free(p${id});  // block ${id} released`)
  }

  const reset = () => {
    setStack([{ name: 'main()', vars: ['argc=1', 'argv=0x...'] }])
    setHeap([])
    setNextId(1)
    setLeaks([])
    setLog([])
    setLang(lang)
  }

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, marginTop: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <span style={{ color: 'var(--accent)', fontWeight: 700 }}>Stack / Heap Visualizer</span>
        <div style={{ display: 'flex', gap: 8 }}>
          {['c', 'cpp'].map(l => (
            <button key={l} onClick={() => { setLang(l); reset() }}
              style={{ padding: '4px 14px', borderRadius: 6, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 12,
                background: lang === l ? 'var(--accent)' : 'var(--surface2)', color: lang === l ? '#fff' : 'var(--text-dim)' }}>
              {l === 'c' ? 'C' : 'C++'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
        {/* Stack */}
        <div>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 6, textAlign: 'center' }}>STACK (grows ↓)</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[...stack].reverse().map((frame, i) => (
              <div key={frame.name} style={{ background: i === 0 ? '#1a2e3a' : 'var(--surface2)', border: `1px solid ${i === 0 ? '#6c8fff' : 'var(--border)'}`, borderRadius: 6, padding: '8px 10px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: i === 0 ? '#6c8fff' : 'var(--text-dim)', fontFamily: 'monospace' }}>{frame.name}</div>
                {frame.vars.map(v => <div key={v} style={{ fontSize: 10, color: 'var(--text-dim)', fontFamily: 'monospace' }}>{v}</div>)}
              </div>
            ))}
          </div>
        </div>
        {/* Heap */}
        <div>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 6, textAlign: 'center' }}>HEAP (grows ↑)</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {heap.length === 0 && <div style={{ color: 'var(--text-dim)', fontSize: 11, textAlign: 'center', padding: 12 }}>(empty)</div>}
            {[...heap].reverse().map(b => (
              <div key={b.id} style={{
                background: b.freed ? '#1a1a1a' : (leaks.includes(b.id) ? '#3a1a1a' : (b.smart ? '#1a1a3a' : '#1a2a1a')),
                border: `1px solid ${b.freed ? 'var(--border)' : (leaks.includes(b.id) ? '#ef4444' : (b.smart ? '#a78bfa' : '#4ade80'))}`,
                borderRadius: 6, padding: '6px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
              }}>
                <div>
                  <span style={{ fontSize: 11, fontFamily: 'monospace', color: b.freed ? 'var(--text-dim)' : 'var(--text-bright)' }}>
                    {b.freed ? '(freed) ' : ''}{b.smart ? 'unique_ptr' : 'malloc'} [{b.size}B]
                  </span>
                  <div style={{ fontSize: 10, color: 'var(--text-dim)' }}>owner: {b.owner}</div>
                </div>
                {!b.freed && !b.smart && (
                  <button onClick={() => freeBlock(b.id)} style={{ padding: '2px 8px', borderRadius: 5, border: '1px solid #ef4444', background: 'transparent', color: '#ef4444', cursor: 'pointer', fontSize: 10 }}>free()</button>
                )}
                {!b.freed && b.smart && <span style={{ fontSize: 10, color: '#a78bfa' }}>RAII</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {leaks.length > 0 && (
        <div style={{ background: '#3a0a0a', border: '1px solid #ef4444', borderRadius: 8, padding: '8px 12px', marginBottom: 10, fontSize: 12, color: '#ef4444' }}>
          ⚠ Memory leak: {leaks.length} block(s) not freed — use valgrind to detect these
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        {[
          { label: 'Call function()', action: callFn, color: '#6c8fff' },
          { label: 'Return / pop frame', action: returnFn, color: '#f97316' },
          { label: lang === 'c' ? 'malloc(n)' : 'make_unique<T>()', action: alloc, color: '#4ade80' },
          { label: 'Reset', action: reset, color: '#ef4444' },
        ].map(({ label, action, color }) => (
          <button key={label} onClick={action} style={{ padding: '6px 14px', borderRadius: 7, border: `1px solid ${color}`, background: 'transparent', color, cursor: 'pointer', fontSize: 12, fontFamily: 'monospace' }}>{label}</button>
        ))}
      </div>

      <div style={{ fontFamily: 'monospace', fontSize: 12, background: '#0d1117', borderRadius: 8, padding: 10, minHeight: 56 }}>
        {log.length === 0 && <span style={{ color: 'var(--text-dim)' }}>// Click actions above</span>}
        {log.map((l, i) => <div key={i} style={{ color: i === 0 ? '#4ade80' : 'var(--text-dim)' }}>{l}</div>)}
      </div>
    </div>
  )
}

// ─── BitRegSim ─────────────────────────────────────────────────────────────────
export function BitRegSim() {
  const [regA, setRegA] = useState(0b10110011)
  const [regB, setRegB] = useState(0b01101010)
  const [result, setResult] = useState(null)
  const [op, setOp] = useState(null)
  const [cycles, setCycles] = useState(null)

  const toBits = (n) => Array.from({ length: 8 }, (_, i) => (n >> (7 - i)) & 1)
  const fromBits = (bits) => bits.reduce((acc, b, i) => acc | (b << (7 - i)), 0)
  const toHex = (n) => '0x' + (n & 0xff).toString(16).padStart(2, '0').toUpperCase()
  const toSigned = (n) => { const u = n & 0xff; return u >= 128 ? u - 256 : u }

  const toggleBit = (reg, i) => {
    if (reg === 'A') setRegA(prev => prev ^ (1 << (7 - i)))
    else setRegB(prev => prev ^ (1 << (7 - i)))
    setResult(null); setOp(null); setCycles(null)
  }

  const ops = [
    { label: 'A & B', key: 'AND', fn: () => regA & regB, code: `uint8_t r = A & B;` },
    { label: 'A | B', key: 'OR', fn: () => regA | regB, code: `uint8_t r = A | B;` },
    { label: 'A ^ B', key: 'XOR', fn: () => regA ^ regB, code: `uint8_t r = A ^ B;` },
    { label: '~A', key: 'NOT', fn: () => (~regA) & 0xff, code: `uint8_t r = ~A;` },
    { label: 'A << 1', key: 'SHL', fn: () => (regA << 1) & 0xff, code: `uint8_t r = A << 1;` },
    { label: 'A >> 1', key: 'SHR', fn: () => (regA >> 1) & 0xff, code: `uint8_t r = A >> 1;` },
    { label: 'A + B', key: 'ADD', fn: () => (regA + regB) & 0xff, code: `uint8_t r = A + B;  // wraps mod 256` },
    { label: 'A - B', key: 'SUB', fn: () => (regA - regB + 256) & 0xff, code: `uint8_t r = A - B;  // 2's complement` },
  ]

  const runOp = (o) => {
    setResult(o.fn())
    setOp(o)
    setCycles(1)
  }

  const RegRow = ({ label, value, reg, color }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
      <span style={{ color, fontSize: 12, fontFamily: 'monospace', width: 24, textAlign: 'right' }}>{label}</span>
      <div style={{ display: 'flex', gap: 3 }}>
        {toBits(value).map((b, i) => (
          <div key={i} onClick={() => reg && toggleBit(reg, i)} style={{
            width: 28, height: 28, borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700, fontFamily: 'monospace',
            background: b ? color + '33' : 'var(--surface2)',
            border: `1px solid ${b ? color : 'var(--border)'}`,
            color: b ? color : 'var(--text-dim)',
            cursor: reg ? 'pointer' : 'default',
            userSelect: 'none',
          }}>{b}</div>
        ))}
      </div>
      <span style={{ color: 'var(--text-dim)', fontSize: 11, fontFamily: 'monospace', width: 32 }}>{toHex(value)}</span>
      <span style={{ color: 'var(--text-dim)', fontSize: 11, fontFamily: 'monospace' }}>{toSigned(value)}</span>
    </div>
  )

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, marginTop: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <span style={{ color: 'var(--accent)', fontWeight: 700 }}>8-bit Register & ALU Simulator</span>
        <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>Click bits in A/B to toggle</span>
      </div>

      <div style={{ marginBottom: 4, fontSize: 10, color: 'var(--text-dim)', fontFamily: 'monospace', paddingLeft: 36 }}>
        bit: 7  6  5  4  3  2  1  0   hex  dec
      </div>
      <RegRow label="A" value={regA} reg="A" color="#6c8fff" />
      <RegRow label="B" value={regB} reg="B" color="#4ade80" />
      {result !== null && (
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 8, marginTop: 4 }}>
          <RegRow label="R" value={result} reg={null} color="#f97316" />
        </div>
      )}

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12, marginBottom: 12 }}>
        {ops.map(o => (
          <button key={o.key} onClick={() => runOp(o)} style={{
            padding: '5px 12px', borderRadius: 6, border: `1px solid ${op?.key === o.key ? '#f97316' : 'var(--border)'}`,
            background: op?.key === o.key ? '#f9731622' : 'var(--surface2)', color: op?.key === o.key ? '#f97316' : 'var(--text)',
            cursor: 'pointer', fontSize: 12, fontFamily: 'monospace', fontWeight: op?.key === o.key ? 700 : 400
          }}>{o.label}</button>
        ))}
      </div>

      {op && result !== null && (
        <div style={{ background: '#0d1117', borderRadius: 8, padding: '10px 14px', fontSize: 12, fontFamily: 'monospace' }}>
          <div style={{ color: '#4ade80' }}>{op.code}</div>
          <div style={{ color: 'var(--text-dim)', marginTop: 4 }}>
            // result: {toHex(result)} = {result} (unsigned) = {toSigned(result)} (signed)
          </div>
          <div style={{ color: '#fbbf24', marginTop: 2 }}>
            // ALU: {cycles} clock cycle — same cost in C and C++
          </div>
          <div style={{ color: 'var(--text-dim)', marginTop: 2, fontSize: 11 }}>
            // on x86: single instruction (AND/OR/XOR/NOT/SHL/SHR/ADD/SUB)
          </div>
        </div>
      )}
    </div>
  )
}
