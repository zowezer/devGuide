import { useState, useEffect, useRef } from 'react'
import CodeBlock from '../components/CodeBlock'
import Section, { Sub, InfoBox, WarnBox, TipBox } from '../components/Section'

// ── Interactive simulation components ─────────────────────────────────────

function RegisterSimulator() {
  const [ddrb, setDdrb] = useState(0b00100000)
  const [portb, setPortb] = useState(0b00000001)
  const toggle = (setter, bit) => setter(v => v ^ (1 << bit))
  const PIN_LABELS = { 5: 'LED', 0: 'BTN', 1: 'PWM', 2: 'PWM', 3: 'PWM' }
  const rows = [
    ['DDRB',  ddrb,  setDdrb,  '#f97316', '1=output  0=input'],
    ['PORTB', portb, setPortb, '#6c8fff', '1=HIGH/pull-up  0=LOW/float'],
  ]
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 20, margin: '16px 0' }}>
      <div style={{ fontWeight: 600, color: 'var(--text-bright)', marginBottom: 4 }}>ATmega328P Port B — Register Simulator</div>
      <div style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 14 }}>Click DDRB to toggle direction · Click PORTB to toggle output level / pull-up</div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 4, marginLeft: 72 }}>
        {[7,6,5,4,3,2,1,0].map(b => (
          <div key={b} style={{ width: 36, textAlign: 'center', fontSize: 11, color: 'var(--text-dim)', fontFamily: 'monospace' }}>PB{b}</div>
        ))}
      </div>
      {rows.map(([label, val, setter, color, hint]) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <div style={{ width: 64, textAlign: 'right' }}>
            <div style={{ fontFamily: 'monospace', fontSize: 13, color: 'var(--text-bright)', fontWeight: 700 }}>{label}</div>
            <div style={{ fontSize: 10, color: 'var(--text-dim)' }}>0x{val.toString(16).padStart(2,'0').toUpperCase()}</div>
          </div>
          {[7,6,5,4,3,2,1,0].map(bit => {
            const on = !!(val & (1 << bit))
            return (
              <button key={bit} onClick={() => toggle(setter, bit)} style={{
                width: 36, height: 36, borderRadius: 4, cursor: 'pointer', fontFamily: 'monospace',
                fontSize: 15, fontWeight: 'bold',
                background: on ? color : 'var(--surface2)',
                border: '1px solid var(--border)',
                color: on ? '#fff' : 'var(--text-dim)',
                transition: 'background 0.12s',
              }}>{on ? '1' : '0'}</button>
            )
          })}
          <span style={{ fontSize: 11, color: 'var(--text-dim)', marginLeft: 4 }}>{hint}</span>
        </div>
      ))}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <div style={{ width: 64, textAlign: 'right' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 13, color: 'var(--text-dim)', fontWeight: 700 }}>PINB</div>
          <div style={{ fontSize: 10, color: 'var(--text-dim)' }}>read-only</div>
        </div>
        {[7,6,5,4,3,2,1,0].map(bit => {
          const isOut = !!(ddrb & (1 << bit))
          const high = isOut && !!(portb & (1 << bit))
          return (
            <div key={bit} style={{
              width: 36, height: 36, borderRadius: 4, fontFamily: 'monospace', fontSize: 15, fontWeight: 'bold',
              background: high ? '#4ade8022' : 'var(--surface2)',
              border: '1px solid var(--border)',
              color: high ? '#4ade80' : 'var(--text-dim)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{high ? '1' : '0'}</div>
          )
        })}
        <span style={{ fontSize: 11, color: 'var(--text-dim)', marginLeft: 4 }}>reflects output pins; floating inputs show 0</span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {[7,6,5,4,3,2,1,0].map(bit => {
          const isOut = !!(ddrb & (1 << bit))
          const pBit = !!(portb & (1 << bit))
          const stateText = isOut ? (pBit ? 'HIGH 5V' : 'LOW 0V') : (pBit ? 'IN+PULLUP' : 'IN FLOAT')
          const stateColor = isOut ? (pBit ? '#4ade80' : '#f87171') : (pBit ? '#60a5fa' : '#555')
          return (
            <div key={bit} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 10px', fontFamily: 'monospace', fontSize: 12 }}>
              <span style={{ color: 'var(--text-bright)' }}>PB{bit}</span>
              {' '}<span style={{ color: 'var(--text-dim)', fontSize: 10 }}>{isOut ? 'OUT' : 'IN'}</span>
              {' '}<span style={{ color: stateColor }}>{stateText}</span>
              {PIN_LABELS[bit] && <span style={{ color: '#fbbf24', marginLeft: 4, fontSize: 10 }}>({PIN_LABELS[bit]})</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function PWMSimulator() {
  const [duty, setDuty] = useState(128)
  const [freqHz, setFreqHz] = useState(490)
  const canvasRef = useRef(null)
  const pct = duty / 255
  const avgV = (pct * 5).toFixed(2)
  const periodMs = (1000 / freqHz).toFixed(3)

  useEffect(() => {
    const c = canvasRef.current
    if (!c) return
    const ctx = c.getContext('2d')
    const W = c.width, H = c.height
    const pl = 44, pr = 16, pt = 18, pb = 26
    const pw = W - pl - pr, ph = H - pt - pb
    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#0d0d14'; ctx.fillRect(0, 0, W, H)
    ctx.strokeStyle = '#ffffff08'; ctx.lineWidth = 1
    for (let i = 0; i <= 4; i++) {
      const y = pt + ph * i / 4
      ctx.beginPath(); ctx.moveTo(pl, y); ctx.lineTo(W - pr, y); ctx.stroke()
    }
    ctx.strokeStyle = '#ffffff18'; ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(pl, pt); ctx.lineTo(pl, pt + ph); ctx.lineTo(W - pr, pt + ph); ctx.stroke()
    ctx.fillStyle = '#666'; ctx.font = '11px monospace'; ctx.textAlign = 'right'
    ctx.fillText('5V', pl - 4, pt + 5); ctx.fillText('0V', pl - 4, pt + ph + 5)
    const CYCLES = 3
    const hiY = pt + 4, loY = pt + ph - 4
    const cycW = pw / CYCLES, onW = cycW * pct
    ctx.strokeStyle = '#6c8fff'; ctx.lineWidth = 2.5
    ctx.shadowColor = '#6c8fff'; ctx.shadowBlur = 10
    ctx.beginPath()
    for (let i = 0; i < CYCLES; i++) {
      const x0 = pl + i * cycW
      if (i === 0) ctx.moveTo(x0, pct > 0 ? hiY : loY)
      if (pct === 0) { ctx.lineTo(x0 + cycW, loY) }
      else if (pct >= 1) { ctx.lineTo(x0 + cycW, hiY) }
      else {
        ctx.lineTo(x0, hiY); ctx.lineTo(x0 + onW, hiY)
        ctx.lineTo(x0 + onW, loY); ctx.lineTo(x0 + cycW, loY)
        if (i < CYCLES - 1) ctx.lineTo(x0 + cycW, hiY)
      }
    }
    ctx.stroke(); ctx.shadowBlur = 0
    const avgY = pt + ph * (1 - pct)
    ctx.strokeStyle = '#f97316'; ctx.setLineDash([5, 4]); ctx.lineWidth = 1.5
    ctx.beginPath(); ctx.moveTo(pl, avgY); ctx.lineTo(W - pr, avgY); ctx.stroke()
    ctx.setLineDash([])
    ctx.fillStyle = '#f97316'; ctx.textAlign = 'left'; ctx.font = '11px monospace'
    ctx.fillText(avgV + 'V avg', W - pr - 60, avgY - 5)
    ctx.fillStyle = '#555'; ctx.textAlign = 'center'; ctx.font = '10px monospace'
    for (let i = 0; i <= CYCLES; i++) {
      ctx.fillText((i * Number(periodMs)).toFixed(1) + 'ms', pl + pw * i / CYCLES, pt + ph + 18)
    }
  }, [duty, freqHz, pct, avgV, periodMs])

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 20, margin: '16px 0' }}>
      <div style={{ fontWeight: 600, color: 'var(--text-bright)', marginBottom: 12 }}>PWM Waveform Simulator</div>
      <div style={{ display: 'flex', gap: 24, marginBottom: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: 'var(--text-dim)', marginBottom: 4 }}>
            analogWrite: <strong style={{ color: 'var(--text)' }}>{duty}</strong>/255 &nbsp; ({(pct * 100).toFixed(1)}% duty)
          </label>
          <input type="range" min="0" max="255" value={duty} onChange={e => setDuty(+e.target.value)} style={{ width: 200 }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: 'var(--text-dim)', marginBottom: 4 }}>Frequency</label>
          <select value={freqHz} onChange={e => setFreqHz(+e.target.value)}
            style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)', padding: '5px 8px', borderRadius: 4, fontSize: 13 }}>
            <option value={490}>490 Hz (Arduino pins 3,9,10,11)</option>
            <option value={980}>980 Hz (Arduino pins 5,6)</option>
            <option value={50}>50 Hz (servo control)</option>
            <option value={1000}>1 kHz</option>
            <option value={25000}>25 kHz (motor / no audible whine)</option>
          </select>
        </div>
      </div>
      <canvas ref={canvasRef} width={600} height={160} style={{ width: '100%', borderRadius: 6, display: 'block' }} />
      <div style={{ display: 'flex', gap: 10, marginTop: 10, flexWrap: 'wrap' }}>
        {[
          ['Avg voltage', avgV + ' V'],
          ['Period', periodMs + ' ms'],
          ['ON time', (pct * Number(periodMs)).toFixed(3) + ' ms'],
          ['OFF time', ((1 - pct) * Number(periodMs)).toFixed(3) + ' ms'],
          ['LED',  duty === 0 ? 'Off' : duty === 255 ? 'Full brightness' : Math.round(pct * 100) + '% brightness'],
        ].map(([k, v]) => (
          <div key={k} style={{ background: 'var(--surface2)', borderRadius: 6, padding: '6px 12px', minWidth: 110 }}>
            <div style={{ fontSize: 10, color: 'var(--text-dim)' }}>{k}</div>
            <div style={{ fontFamily: 'monospace', color: 'var(--accent)', fontSize: 13, fontWeight: 600 }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ADCSim() {
  const VREF = 5.0
  const [voltage, setVoltage] = useState(3.14)
  const [steps, setSteps] = useState([])
  const [sar, setSar] = useState(0)
  const [currentBit, setCurrentBit] = useState(null)
  const started = currentBit !== null || steps.length > 0
  const done = currentBit === null && steps.length > 0
  const start = () => { setSteps([]); setSar(0); setCurrentBit(9) }
  const reset = () => { setSteps([]); setSar(0); setCurrentBit(null) }
  const nextStep = () => {
    if (currentBit === null) return
    const bitVal = 1 << currentBit
    const trialV = (sar | bitVal) / 1023 * VREF
    const kept = voltage >= trialV
    const newSar = kept ? sar | bitVal : sar
    setSteps(s => [...s, { bit: currentBit, bitVal, trialV, kept }])
    setSar(newSar)
    setCurrentBit(currentBit > 0 ? currentBit - 1 : null)
  }
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 20, margin: '16px 0' }}>
      <div style={{ fontWeight: 600, color: 'var(--text-bright)', marginBottom: 12 }}>ADC Successive Approximation — Step-by-Step Simulator (10-bit, Vref=5V)</div>
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', marginBottom: 16, flexWrap: 'wrap' }}>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: 'var(--text-dim)', marginBottom: 4 }}>
            Input Voltage: <strong style={{ color: 'var(--text)' }}>{voltage.toFixed(2)} V</strong>
          </label>
          <input type="range" min="0" max="5" step="0.01" value={voltage}
            onChange={e => { setVoltage(+e.target.value); reset() }} style={{ width: 200 }} />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {!started && <button onClick={start} style={{ padding: '8px 20px', background: 'var(--accent)', border: 'none', borderRadius: 6, color: '#fff', cursor: 'pointer', fontWeight: 600 }}>▶ Start</button>}
          {started && !done && <button onClick={nextStep} style={{ padding: '8px 20px', background: '#10b981', border: 'none', borderRadius: 6, color: '#fff', cursor: 'pointer', fontWeight: 600 }}>Next Bit →</button>}
          {started && <button onClick={reset} style={{ padding: '8px 16px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text)', cursor: 'pointer' }}>Reset</button>}
        </div>
      </div>
      {started && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 6 }}>
            SAR register — {done ? 'conversion complete' : 'trying bit ' + currentBit}:
          </div>
          <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
            {[9,8,7,6,5,4,3,2,1,0].map(bit => {
              const on = !!(sar & (1 << bit))
              const active = bit === currentBit
              return (
                <div key={bit} style={{
                  width: 34, height: 36, borderRadius: 4, display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace',
                  fontSize: 13, fontWeight: 'bold',
                  background: active ? '#f59e0b' : on ? 'var(--accent)' : 'var(--surface2)',
                  border: active ? '2px solid #fbbf24' : '1px solid var(--border)',
                  color: (on || active) ? '#fff' : 'var(--text-dim)',
                }}>
                  <div>{on ? '1' : '0'}</div>
                  <div style={{ fontSize: 8, opacity: 0.7 }}>b{bit}</div>
                </div>
              )
            })}
            <div style={{ marginLeft: 10, fontFamily: 'monospace', fontSize: 12, color: 'var(--text-dim)' }}>
              = {sar} &nbsp; ({(sar / 1023 * 5).toFixed(3)} V)
            </div>
          </div>
        </div>
      )}
      {steps.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse', minWidth: 480 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Bit', 'Add value', 'Trial V', 'Vin >= Trial?', 'Decision'].map(h => (
                  <th key={h} style={{ padding: '4px 10px', textAlign: 'left', color: 'var(--text-dim)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {steps.map((s, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border)', background: i % 2 ? '#ffffff03' : 'transparent' }}>
                  <td style={{ padding: '4px 10px', fontFamily: 'monospace' }}>bit {s.bit}</td>
                  <td style={{ padding: '4px 10px', fontFamily: 'monospace' }}>{s.bitVal}</td>
                  <td style={{ padding: '4px 10px', fontFamily: 'monospace' }}>{s.trialV.toFixed(4)} V</td>
                  <td style={{ padding: '4px 10px', color: s.kept ? '#4ade80' : '#f87171', fontWeight: 600 }}>
                    {voltage.toFixed(2)} {s.kept ? '>=' : '<'} {s.trialV.toFixed(4)} → {s.kept ? 'YES' : 'NO'}
                  </td>
                  <td style={{ padding: '4px 10px', fontFamily: 'monospace', color: s.kept ? '#4ade80' : 'var(--text-dim)' }}>
                    {s.kept ? 'KEEP' : 'CLEAR'} bit {s.bit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {done && (
        <div style={{ marginTop: 12, padding: '10px 16px', background: '#4ade8011', border: '1px solid #4ade8044', borderRadius: 8, fontFamily: 'monospace', fontSize: 13 }}>
          <strong style={{ color: '#4ade80' }}>Done!</strong>{'  '}
          Result: <strong>{sar}</strong> (0b{sar.toString(2).padStart(10,'0')}) = <strong>{(sar/1023*5).toFixed(4)} V</strong>{'  ·  '}
          Error: {Math.abs(voltage - sar/1023*5).toFixed(4)} V ({(Math.abs(voltage - sar/1023*5)/5*100).toFixed(3)}%)
        </div>
      )}
      {!started && <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 8 }}>Set a voltage then click Start. Step through each bit to watch the SAR algorithm converge on the answer.</div>}
    </div>
  )
}

const TL_DATA = [
  { id: 'GREEN',  color: '#4ade80', dim: '#0d2d1a', duration: '30s', next: 'YELLOW', code: 'TL_GREEN'  },
  { id: 'YELLOW', color: '#fbbf24', dim: '#2d1f0a', duration: '5s',  next: 'RED',    code: 'TL_YELLOW' },
  { id: 'RED',    color: '#f87171', dim: '#2d0a0a', duration: '10s', next: 'GREEN',  code: 'TL_RED'    },
]

function TrafficFSM() {
  const [idx, setIdx] = useState(0)
  const [pedReq, setPedReq] = useState(false)
  const [log, setLog] = useState(['System started → GREEN'])
  const current = TL_DATA[idx]
  const step = () => {
    const nextIdx = (idx + 1) % 3
    const next = TL_DATA[nextIdx]
    const note = pedReq && current.id === 'RED' ? ' (+5s pedestrian applied)' : ''
    setLog(l => [...l.slice(-5), current.id + ' → ' + next.id + note])
    if (current.id === 'RED') setPedReq(false)
    setIdx(nextIdx)
  }
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 20, margin: '16px 0' }}>
      <div style={{ fontWeight: 600, color: 'var(--text-bright)', marginBottom: 16 }}>Traffic Light FSM — Interactive Simulator</div>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <div style={{ background: '#111', border: '3px solid #333', borderRadius: 14, padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {['RED','YELLOW','GREEN'].map(lid => {
              const s = TL_DATA.find(t => t.id === lid)
              const on = current.id === lid
              return <div key={lid} style={{ width: 56, height: 56, borderRadius: '50%', background: on ? s.color : s.dim, boxShadow: on ? ('0 0 22px ' + s.color) : 'none', transition: 'all 0.3s' }} />
            })}
          </div>
          <div style={{ fontFamily: 'monospace', fontWeight: 700, color: current.color, fontSize: 14 }}>{current.id}</div>
          <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>
            {current.duration}{current.id === 'RED' && pedReq ? ' +5s' : ''}
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 220 }}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
            {TL_DATA.map((s, i) => (
              <div key={s.id} style={{ padding: '5px 12px', borderRadius: 20, fontFamily: 'monospace', fontSize: 12, background: idx === i ? s.color + '22' : 'var(--surface2)', border: '1px solid ' + (idx === i ? s.color : 'var(--border)'), color: idx === i ? s.color : 'var(--text-dim)', fontWeight: idx === i ? 700 : 400 }}>
                {s.id} ({s.duration}) {idx === i && '←'}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
            <button onClick={step} style={{ padding: '8px 18px', background: current.color, border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 700, color: '#111' }}>Next State →</button>
            <button onClick={() => { if (!pedReq) { setPedReq(true); setLog(l => [...l.slice(-5), '🚶 Pedestrian pressed — will extend RED by 5s']) } }}
              style={{ padding: '8px 14px', borderRadius: 6, cursor: 'pointer', background: pedReq ? '#f59e0b22' : 'var(--surface2)', border: '1px solid ' + (pedReq ? '#f59e0b' : 'var(--border)'), color: pedReq ? '#f59e0b' : 'var(--text)' }}>
              🚶 {pedReq ? 'Pending' : 'Pedestrian'}
            </button>
            <button onClick={() => { setIdx(0); setPedReq(false); setLog(['Reset → GREEN']) }} style={{ padding: '8px 14px', borderRadius: 6, cursor: 'pointer', background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)' }}>Reset</button>
          </div>
          <div style={{ background: 'var(--surface2)', borderRadius: 8, padding: '10px 14px', marginBottom: 10, fontFamily: 'monospace', fontSize: 12 }}>
            <div style={{ color: 'var(--text-dim)', marginBottom: 4 }}>C code executing:</div>
            <div style={{ color: current.color }}>tl_enter(&amp;tl, {current.code});</div>
            <div style={{ color: 'var(--text-dim)', fontSize: 11, marginTop: 4 }}>→ drives {current.id} LED, resets state timer</div>
          </div>
          <div style={{ background: '#0a0a0f', borderRadius: 6, padding: '8px 12px', fontFamily: 'monospace', fontSize: 12, minHeight: 64 }}>
            {log.map((entry, i) => {
              const s = TL_DATA.find(t => entry.includes(t.id))
              return <div key={i} style={{ color: i === log.length - 1 ? 'var(--text)' : 'var(--text-dim)', lineHeight: 1.7 }}>&gt; {entry}</div>
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

const sections = [
  'Microcontrollers vs Microprocessors',
  'Memory Architecture',
  'Clock Cycles and Timing',
  'Data Types in Embedded C',
  'Bitwise Operations and Register Manipulation',
  'Digital I/O',
  'Analog I/O and ADC',
  'PWM — Pulse Width Modulation',
  'Interrupts and ISRs',
  'Communication Protocols — UART, SPI, I2C',
  'Memory Management and Pointers',
  'Performance and Optimization',
  'RTOS Concepts',
  'Debugging Embedded Systems',
  'Mini Project: Digital Thermometer with LCD',
  'Simulation: Register State Walkthrough',
  'Simulation: Signal Timing Diagrams',
  'Simulation: ADC Successive Approximation',
  'Simulation: Interrupt Timeline',
  'Finite State Machines',
  'Simulation: FreeRTOS Scheduler Trace',
  'Power Management and Sleep Modes',
  'Advanced Mini Project: Multi-sensor FreeRTOS Logger',
]

export default function EmbeddedPage() {
  return (
    <div>
      <div className="page-hero">
        <div className="lang-icon">🔌</div>
        <div>
          <h1>Embedded Systems</h1>
          <p>
            Embedded systems are computers built into other devices — your car's ECU, a smart
            thermostat, an industrial controller. They run on microcontrollers with kilobytes of
            RAM, no operating system (or a minimal RTOS), and must respond to hardware in
            real time. Everything is closer to the metal here: no garbage collector, no virtual
            machine, no protected memory — just your code, the CPU, and the hardware registers.
          </p>
          <div className="badges">
            <span className="badge green">Bare Metal C</span>
            <span className="badge">Real-Time</span>
            <span className="badge yellow">Low Power</span>
            <span className="badge purple">Register Level</span>
          </div>
        </div>
      </div>

      <div className="toc">
        <div className="toc-title">Contents</div>
        <ul>
          {sections.map((t, i) => (
            <li key={t}><a href={'#s' + (i + 1)}>{i + 1}. {t}</a></li>
          ))}
        </ul>
      </div>

      <Section num="1" title="Microcontrollers vs Microprocessors">
        <InfoBox>A microprocessor (CPU) is the compute core — it needs external RAM, storage, and peripherals. A microcontroller (MCU) integrates CPU + RAM + Flash + peripherals on one chip. MCUs are cheaper, lower power, and simpler to deploy in products.</InfoBox>
        <CodeBlock language="bash" code={`# Microprocessor (MPU)
Examples: Intel Core, ARM Cortex-A (Raspberry Pi, phone SoCs)
RAM:      External DRAM (GB scale)
Storage:  External (SD card, eMMC, SSD)
OS:       Linux, Android, Windows
Power:    High (1-15W typical)
Use for:  Complex applications, UIs, networking, ML inference

# Microcontroller (MCU)
Examples: Arduino Uno (ATmega328P), STM32, ESP32, RP2040
RAM:      On-chip SRAM (2KB - 512KB typical)
Storage:  On-chip Flash (32KB - 4MB typical)
OS:       Bare metal or RTOS (FreeRTOS)
Power:    Ultra-low (µA in sleep mode)
Use for:  Sensors, actuators, real-time control, IoT nodes

# Comparison table
                ATmega328P  STM32F103   ESP32       Pi 4B
CPU cores:      1           1           2           4
Clock:          16 MHz      72 MHz      240 MHz     1.8 GHz
Flash:          32 KB       128 KB      4 MB        —
RAM:            2 KB        20 KB       520 KB      1-8 GB
OS:             Bare metal  Bare metal  FreeRTOS    Linux
Price:          ~$2         ~$3         ~$4         ~$35
Power:          ~50 mW      ~50 mW      ~500 mW     ~5W`} />
      </Section>

      <Section num="2" title="Memory Architecture">
        <InfoBox>In embedded C, where data lives determines how fast it is, whether it persists across resets, and whether you run out of space. Unlike Java where the JVM manages all this, you must decide explicitly.</InfoBox>
        <CodeBlock language="c" code={`// Memory regions in a typical MCU:

// ── Flash (ROM) — non-volatile, read-only at runtime ─────────────
// Your compiled code lives here. Survives power loss.
// On STM32: 0x08000000 - 0x0801FFFF (128KB)
const char GREETING[] = "Hello";    // stored in Flash
const float PI = 3.14159f;          // stored in Flash (const)

// ── SRAM — volatile, read-write, fast ────────────────────────────
// Global and static variables, stack, heap.
// On ATmega328P: only 2KB total!
int counter = 0;          // .data section (initialized globals)
int uninit;               // .bss section (zero-initialized globals)

void func() {
    int local = 42;       // stack (allocated on function call)
    // Stack grows downward; heap grows upward
    // Stack overflow = silent corruption or crash (no Java StackOverflowError)
}

// ── EEPROM — non-volatile, byte-erasable ─────────────────────────
// Store configuration, calibration data, user settings
// Limited write cycles (~100,000 per byte)
#include <avr/eeprom.h>
uint8_t EEMEM saved_mode = 0;       // EEMEM = stored in EEPROM section
uint8_t mode = eeprom_read_byte(&saved_mode);
eeprom_write_byte(&saved_mode, 1);  // write (slow, ~3ms)

// ── Memory layout visualization ──────────────────────────────────
// High address ──────────────────────────────────────────
//   Stack (grows down) — local variables, function frames
//   ↓
//   [Free RAM]
//   ↑
//   Heap (grows up) — dynamic allocation (avoid in embedded!)
//   .bss — uninitialized globals (zeroed at startup)
//   .data — initialized globals (copied from Flash)
// Low address ───────────────────────────────────────────`} />
      </Section>

      <Section num="3" title="Clock Cycles and Timing">
        <CodeBlock language="c" code={`// MCU operations take a fixed number of clock cycles
// At 16 MHz: 1 clock cycle = 62.5 ns
// Integer add on AVR: 1 cycle = 62.5 ns
// Flash read: 1-5 cycles depending on wait states
// Division: 8-32 cycles (expensive! use bit shifts when possible)

// Delay functions (busy-wait — wastes CPU but simple)
#include <util/delay.h>     // AVR
_delay_ms(1000);            // wait 1 second
_delay_us(100);             // wait 100 microseconds

// For STM32/ARM:
HAL_Delay(1000);            // millisecond delay (uses SysTick)

// Accurate timing with Timer peripheral
// Configure Timer0 for 1ms interrupt (Arduino style)
// Configure Timer1 for microsecond timestamps

// Measure execution time (for optimization)
uint32_t start = micros();       // Arduino: returns µs since boot
do_something();
uint32_t elapsed = micros() - start;
Serial.println(elapsed);

// Real-time constraints:
// Hard real-time: missing deadline = system failure (airbag, ABS)
// Soft real-time: missing deadline = degraded performance (video playback)
// Embedded C rules for real-time:
// - No dynamic memory allocation in time-critical code
// - No unbounded loops (know worst-case execution time)
// - Minimize interrupt latency
// - Use volatile for variables modified in ISRs`} />
      </Section>

      <Section num="4" title="Data Types in Embedded C">
        <InfoBox>In Java, <code>int</code> is always 32 bits. In C, <code>int</code> size depends on the platform. On 8-bit AVR, <code>int</code> is 16 bits. Always use <code>&lt;stdint.h&gt;</code> types in embedded C for portability and to know exactly how much memory you're using.</InfoBox>
        <CodeBlock language="c" code={`#include <stdint.h>    // fixed-width types
#include <stdbool.h>   // bool type

// Fixed-width types — always these sizes, everywhere
uint8_t  byte_val = 255;         // 0 to 255           (unsigned 8-bit)
int8_t   signed_byte = -100;     // -128 to 127        (signed 8-bit)
uint16_t word_val = 65535;       // 0 to 65535         (16-bit)
int16_t  signed_word = -1000;
uint32_t dword = 4294967295UL;   // 0 to 4.29 billion  (32-bit)
int32_t  signed_dword = -1000000L;
uint64_t big = 0;                // avoid on 8-bit MCU — costs 8 bytes + slow ops!

bool flag = true;                // 0 or 1

// Memory cost matters!
// On ATmega328P with 2KB RAM:
// uint8_t  buf[100]  = 100 bytes
// uint16_t buf[100]  = 200 bytes
// uint32_t buf[100]  = 400 bytes  ← that's 20% of total RAM!

// Float considerations
float temp = 23.5f;    // 4 bytes, ~7 significant digits
// Floating point on 8-bit MCU is SLOW (software emulation, no FPU)
// Use integer arithmetic when possible:
// Instead of: float temp = raw * 0.0625f;
// Use:        int16_t temp_x16 = raw;  // temp in 1/16 degree units
//             int16_t temp_whole = temp_x16 >> 4;  // divide by 16 (fast!)

// Structure packing — avoid padding waste
struct __attribute__((packed)) SensorData {
    uint32_t timestamp;     // 4 bytes
    int16_t  temperature;   // 2 bytes (not 4 — packed!)
    uint8_t  humidity;      // 1 byte
    uint8_t  status;        // 1 byte
};  // total: 8 bytes (without packed: might be 12 due to alignment)`} />
      </Section>

      <Section num="5" title="Bitwise Operations and Register Manipulation">
        <InfoBox>Peripheral registers are memory-mapped: write to an address to control hardware. Bitwise operations set, clear, toggle, and read individual bits without affecting others — essential for embedded control.</InfoBox>
        <CodeBlock language="c" code={`// Bit manipulation fundamentals
uint8_t reg = 0b00101010;   // 0x2A

// Set bit N  (force to 1)
reg |= (1 << 3);    // set bit 3: 0b00101010 | 0b00001000 = 0b00101010 → 0b00101010 ✓
//     OR with mask where only bit N is 1

// Clear bit N  (force to 0)
reg &= ~(1 << 3);   // clear bit 3: AND with all-1s except bit 3
//     AND with inverted mask

// Toggle bit N  (flip)
reg ^= (1 << 3);    // XOR with mask

// Check if bit N is set
if (reg & (1 << 5)) { }   // non-zero if bit 5 is 1

// Read multiple bits (mask + shift)
uint8_t speed = (reg >> 4) & 0x03;   // bits 5:4 (2-bit field)

// Convenient macros (common in embedded code)
#define BIT(n)       (1U << (n))
#define SET_BIT(r,n) ((r) |= BIT(n))
#define CLR_BIT(r,n) ((r) &= ~BIT(n))
#define TGL_BIT(r,n) ((r) ^= BIT(n))
#define CHK_BIT(r,n) ((r) & BIT(n))

// ── Direct register manipulation on AVR (ATmega328P) ─────────────
// Port B: digital pins 8-13 on Arduino Uno
// Each port has 3 registers:
//   DDRx  — Data Direction Register: 1=output, 0=input
//   PORTx — Output: write 1=HIGH, 0=LOW (or enable pull-up on input)
//   PINx  — Input: read pin state

// Configure PB5 (Arduino pin 13, built-in LED) as output
DDRB  |= (1 << PB5);   // set bit 5 in DDRB to 1 (output)

// Set PB5 HIGH (LED on)
PORTB |= (1 << PB5);

// Set PB5 LOW (LED off)
PORTB &= ~(1 << PB5);

// Toggle PB5
PORTB ^= (1 << PB5);

// Configure PB0 as input with pull-up
DDRB  &= ~(1 << PB0);   // direction = input
PORTB |=  (1 << PB0);   // enable pull-up resistor

// Read PB0
if (PINB & (1 << PB0)) {
    // pin is HIGH
}`} />
      </Section>

      <Section num="6" title="Digital I/O">
        <CodeBlock language="c" code={`// ── Arduino-style (HAL — Hardware Abstraction Layer) ─────────────
// Simple but slightly slower due to abstraction overhead
#define LED_PIN   13
#define BUTTON_PIN 2

void setup() {
    pinMode(LED_PIN,    OUTPUT);
    pinMode(BUTTON_PIN, INPUT_PULLUP);  // internal pull-up, pressed = LOW
}

void loop() {
    int button_state = digitalRead(BUTTON_PIN);
    if (button_state == LOW) {    // button pressed
        digitalWrite(LED_PIN, HIGH);
    } else {
        digitalWrite(LED_PIN, LOW);
    }
}

// ── STM32 HAL ─────────────────────────────────────────────────────
// Configure in STM32CubeMX, then:
HAL_GPIO_WritePin(GPIOC, GPIO_PIN_13, GPIO_PIN_RESET);  // LED off
HAL_GPIO_WritePin(GPIOC, GPIO_PIN_13, GPIO_PIN_SET);    // LED on
HAL_GPIO_TogglePin(GPIOC, GPIO_PIN_13);

GPIO_PinState state = HAL_GPIO_ReadPin(GPIOA, GPIO_PIN_0);
if (state == GPIO_PIN_SET) { /* HIGH */ }

// ── Debouncing a button (hardware bounces for ~5-20ms) ─────────────
bool read_button_debounced(uint8_t pin) {
    static uint32_t last_change = 0;
    static bool last_state = false;
    bool current = (digitalRead(pin) == LOW);

    if (current != last_state) {
        last_change = millis();
    }
    if ((millis() - last_change) > 20) {   // 20ms debounce window
        last_state = current;
    }
    return last_state;
}`} />
      </Section>

      <Section num="7" title="Analog I/O and ADC">
        <InfoBox>ADC (Analog-to-Digital Converter) converts a voltage (0-5V) to a digital number (0-1023 on 10-bit ADC). This is how you read sensors: temperature, light, sound, pressure all output varying voltages.</InfoBox>
        <CodeBlock language="c" code={`// ── Arduino analogRead (10-bit ADC, 0-5V → 0-1023) ──────────────
int raw = analogRead(A0);          // 0-1023

// Convert to voltage
float voltage = raw * (5.0f / 1023.0f);  // 0.0 to 5.0V

// Convert to temperature with NTC thermistor (Steinhart-Hart)
// More commonly: use a sensor with digital output (DS18B20, DHT22)

// LM35 temperature sensor: 10mV per °C
// At 25°C: output = 250mV = 0.25V
// raw = 0.25 * 1023 / 5.0 = 51
float temp_lm35 = raw * (500.0f / 1023.0f);   // in °C (500mV = 100°C full scale)

// Potentiometer — read position
int pot_raw = analogRead(A1);                // 0-1023
int angle = map(pot_raw, 0, 1023, 0, 270);  // map to 0-270 degrees

// ── AVR direct ADC (no abstraction) ──────────────────────────────
#include <avr/io.h>

void adc_init(void) {
    ADMUX  = (1 << REFS0);          // AVcc reference (5V)
    ADCSRA = (1 << ADEN)            // enable ADC
           | (1 << ADPS2)           // prescaler 64 → 250kHz ADC clock
           | (1 << ADPS1);
}

uint16_t adc_read(uint8_t channel) {
    ADMUX = (ADMUX & 0xF0) | (channel & 0x0F);  // select channel
    ADCSRA |= (1 << ADSC);          // start conversion
    while (ADCSRA & (1 << ADSC));   // wait for completion
    return ADC;                     // 10-bit result (ADCL + ADCH)
}

// ── Oversampling — improve resolution by averaging multiple reads ──
uint16_t adc_read_averaged(uint8_t channel, uint8_t samples) {
    uint32_t sum = 0;
    for (uint8_t i = 0; i < samples; i++) {
        sum += adc_read(channel);
    }
    return sum / samples;
    // 16 samples: 10-bit → 12-bit effective resolution
}`} />
      </Section>

      <Section num="8" title="PWM — Pulse Width Modulation">
        <InfoBox>PWM generates a square wave with variable duty cycle (on-time percentage). It's how you control LED brightness, motor speed, and servo angle using digital outputs.</InfoBox>
        <CodeBlock language="c" code={`// Duty cycle: 0% = always off, 50% = half on/off, 100% = always on
// Frequency: typically 490-1000 Hz for LEDs, 50Hz for servos

// ── Arduino analogWrite (8-bit PWM, 0-255) ───────────────────────
// Only works on PWM pins (~3, 5, 6, 9, 10, 11 on Uno)
analogWrite(9, 0);     // 0% duty cycle (LED off)
analogWrite(9, 128);   // 50% duty cycle (half brightness)
analogWrite(9, 255);   // 100% duty cycle (full brightness)

// LED brightness fade
for (int brightness = 0; brightness <= 255; brightness++) {
    analogWrite(LED_PIN, brightness);
    delay(5);
}

// Motor speed control (with motor driver board like L298N)
analogWrite(MOTOR_PIN, 200);   // ~78% speed

// Servo control (50Hz, 1-2ms pulse = 0-180 degrees)
#include <Servo.h>
Servo myServo;
myServo.attach(9);
myServo.write(0);    // 0 degrees
myServo.write(90);   // 90 degrees
myServo.write(180);  // 180 degrees

// ── Manual PWM with Timer1 (16-bit, higher resolution) ───────────
// Fast PWM mode, non-inverting, prescaler 8 → ~3.9 kHz
void setup_pwm_timer1(void) {
    DDRB  |= (1 << PB1);             // OC1A pin (Arduino pin 9) as output
    TCCR1A = (1 << COM1A1)           // clear OC1A on match, set at bottom
           | (1 << WGM11);           // Fast PWM, ICR1 = TOP
    TCCR1B = (1 << WGM13)
           | (1 << WGM12)
           | (1 << CS11);            // prescaler /8
    ICR1  = 19999;                   // TOP = 20000 ticks = 20ms period (50Hz)
    OCR1A = 1499;                    // compare match at 1.5ms → 90° servo
}

void set_servo_angle(uint8_t degrees) {
    // 1ms = 0°, 1.5ms = 90°, 2ms = 180°
    // At 16MHz/8 prescaler: 1 tick = 0.5µs
    // 1ms = 2000 ticks, 2ms = 4000 ticks
    OCR1A = 2000 + (degrees * 2000UL / 180);
}`} />
        <PWMSimulator />
      </Section>

      <Section num="9" title="Interrupts and ISRs">
        <InfoBox>An interrupt is a hardware signal that suspends normal code execution to run an Interrupt Service Routine (ISR). Critical for real-time response: button presses, serial data arrival, timer overflow — without polling.</InfoBox>
        <CodeBlock language="c" code={`#include <avr/interrupt.h>

// ── External interrupt (pin change) ──────────────────────────────
volatile bool button_pressed = false;   // volatile: shared with ISR!

// ISR: runs when INT0 (pin 2) falls (button pressed, active-low)
ISR(INT0_vect) {
    button_pressed = true;
    // Keep ISRs SHORT — no Serial.print, no delays!
    // Set a flag, set/clear a variable — that's it
}

void setup_external_interrupt(void) {
    EICRA |= (1 << ISC01);  // INT0: trigger on falling edge
    EIMSK |= (1 << INT0);   // enable INT0
    sei();                   // enable global interrupts
}

// Main loop checks the flag (set by ISR)
void loop() {
    if (button_pressed) {
        button_pressed = false;
        handle_button();        // do the actual work here, not in ISR
    }
}

// ── Timer interrupt (runs at fixed rate) ─────────────────────────
volatile uint32_t milliseconds = 0;

// Configure Timer0 to interrupt every 1ms
void setup_timer0_interrupt(void) {
    TCCR0A = (1 << WGM01);         // CTC mode
    TCCR0B = (1 << CS01) | (1 << CS00);  // prescaler /64
    OCR0A  = 249;                   // 16MHz / 64 / 250 = 1000 Hz
    TIMSK0 = (1 << OCIE0A);        // enable compare match interrupt
    sei();
}

ISR(TIMER0_COMPA_vect) {
    milliseconds++;     // fast: just increment
}

uint32_t my_millis(void) {
    uint32_t m;
    cli();              // disable interrupts briefly (read is not atomic on 8-bit!)
    m = milliseconds;
    sei();
    return m;
}

// ── Arduino attachInterrupt (easier) ──────────────────────────────
volatile int encoder_count = 0;

void encoder_isr() {
    if (digitalRead(ENCODER_B) == HIGH) encoder_count++;
    else encoder_count--;
}

attachInterrupt(digitalPinToInterrupt(ENCODER_A), encoder_isr, RISING);`} />
      </Section>

      <Section num="10" title="Communication Protocols — UART, SPI, I2C">
        <Sub title="UART — Universal Asynchronous Receiver/Transmitter">
          <CodeBlock language="c" code={`// UART: point-to-point, 2 wires (TX/RX), asynchronous
// Common for: serial debugging, GPS modules, GSM modems

// Arduino UART
void setup() {
    Serial.begin(9600);   // baud rate: bits per second
}
void loop() {
    Serial.println("Hello");   // transmit
    if (Serial.available()) {  // receive
        char c = Serial.read();
        Serial.print("Got: ");
        Serial.println(c);
    }
}

// AVR UART direct (9600 baud at 16MHz)
void uart_init(uint16_t baud) {
    uint16_t ubrr = F_CPU / 16 / baud - 1;
    UBRR0H = (ubrr >> 8);
    UBRR0L = ubrr;
    UCSR0B = (1 << TXEN0) | (1 << RXEN0);  // enable TX and RX
    UCSR0C = (1 << UCSZ01) | (1 << UCSZ00); // 8 data bits, 1 stop, no parity
}

void uart_tx(uint8_t data) {
    while (!(UCSR0A & (1 << UDRE0)));  // wait for buffer empty
    UDR0 = data;
}`} />
        </Sub>
        <Sub title="SPI and I2C">
          <CodeBlock language="c" code={`// SPI: 4 wires, synchronous, fast (up to 80MHz), 1 master N slaves
// Wires: MOSI (master out), MISO (master in), SCK (clock), CS (chip select)
// Use for: SD cards, displays (SSD1306), ADCs, high-speed sensors

#include <SPI.h>
SPI.begin();
SPI.beginTransaction(SPISettings(4000000, MSBFIRST, SPI_MODE0));
digitalWrite(CS_PIN, LOW);    // select device
uint8_t response = SPI.transfer(0x9F);  // send byte, receive byte simultaneously
digitalWrite(CS_PIN, HIGH);   // deselect
SPI.endTransaction();

// I2C (Wire): 2 wires, up to 127 devices, slower (400kHz), simpler wiring
// Wires: SDA (data), SCL (clock) — pulled up to VCC
// Use for: sensors (BME280, MPU6050), EEPROMs, RTCs, displays

#include <Wire.h>
Wire.begin();  // initialize as master

// Read temperature from DS3231 RTC (I2C address 0x68)
Wire.beginTransmission(0x68);
Wire.write(0x11);           // register address for temperature MSB
Wire.endTransmission(false); // repeated start
Wire.requestFrom(0x68, 2);  // request 2 bytes
int8_t temp_msb = Wire.read();
uint8_t temp_lsb = Wire.read();
float temperature = temp_msb + (temp_lsb >> 6) * 0.25f;`} />
        </Sub>
      </Section>

      <Section num="11" title="Memory Management and Pointers">
        <InfoBox>In embedded C, there is no garbage collector. Memory management is manual. Stack overflows are silent corruption. Dynamic allocation (malloc) is usually avoided — it fragments the tiny heap and can fail unpredictably.</InfoBox>
        <CodeBlock language="c" code={`// ── Avoid malloc in embedded — use static allocation ─────────────
// Instead of:
// uint8_t *buffer = malloc(100);   // risky: heap fragmentation, can fail

// Use static buffers:
static uint8_t uart_rx_buffer[64];    // fixed size, in .bss
static uint8_t tx_buffer[64];

// Ring buffer (circular buffer) — common pattern for UART
#define RING_SIZE 64
typedef struct {
    uint8_t data[RING_SIZE];
    volatile uint8_t head;
    volatile uint8_t tail;
} RingBuffer;

void ring_push(RingBuffer *rb, uint8_t byte) {
    uint8_t next = (rb->head + 1) % RING_SIZE;
    if (next != rb->tail) {         // not full
        rb->data[rb->head] = byte;
        rb->head = next;
    }
}

bool ring_pop(RingBuffer *rb, uint8_t *byte) {
    if (rb->head == rb->tail) return false;  // empty
    *byte = rb->data[rb->tail];
    rb->tail = (rb->tail + 1) % RING_SIZE;
    return true;
}

// ── Pointers — essential for register access and arrays ───────────
uint8_t *reg_ptr = (uint8_t *)0x0025;  // point to memory-mapped register
*reg_ptr |= (1 << 5);                  // manipulate register through pointer

// Pointer to function — like Java interface/callback
typedef void (*callback_t)(void);
void on_timer(void) { /* do something */ }
callback_t timer_callback = on_timer;
timer_callback();   // call via pointer

// Check stack usage (AVR trick — paint stack with known pattern)
extern uint8_t _end;
extern uint8_t __stack;
void measure_stack(void) {
    uint8_t *p = &_end;
    while (*p == 0xAA) p++;  // count unused bytes
    Serial.print("Stack used: ");
    Serial.println(&__stack - p);
}`} />
      </Section>

      <Section num="12" title="Performance and Optimization">
        <CodeBlock language="c" code={`// ── Avoid expensive operations ───────────────────────────────────
// Division is slow on 8-bit MCU (no hardware divider): 18 cycles on AVR
// Use bit shifts instead:
x / 2   → x >> 1     // divide by power of 2
x * 4   → x << 2     // multiply by power of 2
x % 16  → x & 15     // modulo by power of 2

// Use uint8_t for loop counters on 8-bit MCU (fits in register)
for (uint8_t i = 0; i < 10; i++) { }   // 8-bit
// not:
for (int i = 0; i < 10; i++) { }       // 16-bit on AVR = more instructions

// ── const correctness — store constants in Flash, not RAM ─────────
// AVR only: use PROGMEM for constant arrays
#include <avr/pgmspace.h>
const uint8_t PROGMEM sine_table[256] = { 128, 131, 134, ... };
uint8_t val = pgm_read_byte(&sine_table[i]);   // read from Flash

// On 32-bit MCUs (ARM), const data already in Flash automatically

// ── Inline small functions ────────────────────────────────────────
static inline uint8_t max_u8(uint8_t a, uint8_t b) {
    return a > b ? a : b;
}

// ── Volatile — tell compiler not to optimize away ─────────────────
// Required for: variables modified by ISRs, hardware registers
volatile uint8_t *PORT = (volatile uint8_t *)0x25;
volatile bool data_ready = false;

// Without volatile, compiler may cache in register and never re-read
// Hardware register writes may be optimized away entirely!

// ── Check memory usage ────────────────────────────────────────────
// After compilation, avr-size shows:
// text   data    bss    dec
// 5120    108    412   5640   ← 5.1KB Flash, 520B RAM used`} />
      </Section>

      <Section num="13" title="RTOS Concepts">
        <InfoBox>An RTOS (Real-Time Operating System) like FreeRTOS lets you write multiple tasks that appear to run concurrently. The scheduler switches between tasks, giving each a time slice. Essential when you need to handle multiple things simultaneously without complex state machines.</InfoBox>
        <CodeBlock language="c" code={`// FreeRTOS on Arduino/STM32
#include <Arduino_FreeRTOS.h>  // or STM32 HAL FreeRTOS

// Tasks — like threads but for MCUs
void sensor_task(void *params) {
    TickType_t last_wake = xTaskGetTickCount();
    while (1) {
        int temp = read_temperature();
        Serial.print("Temp: ");
        Serial.println(temp);
        vTaskDelayUntil(&last_wake, pdMS_TO_TICKS(1000));  // run every 1s
    }
}

void led_task(void *params) {
    while (1) {
        digitalWrite(LED_PIN, HIGH);
        vTaskDelay(pdMS_TO_TICKS(200));   // yield CPU for 200ms
        digitalWrite(LED_PIN, LOW);
        vTaskDelay(pdMS_TO_TICKS(800));
    }
}

// Queue — pass data between tasks (thread-safe)
QueueHandle_t temp_queue;

void producer_task(void *p) {
    while (1) {
        int temp = read_temperature();
        xQueueSend(temp_queue, &temp, 0);   // send, don't wait
        vTaskDelay(pdMS_TO_TICKS(500));
    }
}

void consumer_task(void *p) {
    int temp;
    while (1) {
        if (xQueueReceive(temp_queue, &temp, pdMS_TO_TICKS(1000))) {
            display_temperature(temp);
        }
    }
}

void setup() {
    temp_queue = xQueueCreate(5, sizeof(int));   // queue of 5 ints
    xTaskCreate(sensor_task,   "Sensor",  128, NULL, 2, NULL);  // priority 2
    xTaskCreate(led_task,      "LED",     64,  NULL, 1, NULL);  // priority 1
    xTaskCreate(producer_task, "Prod",    128, NULL, 2, NULL);
    xTaskCreate(consumer_task, "Cons",    128, NULL, 2, NULL);
    vTaskStartScheduler();  // start RTOS (never returns)
}`} />
      </Section>

      <Section num="14" title="Debugging Embedded Systems">
        <CodeBlock language="c" code={`// ── Serial debug output ──────────────────────────────────────────
// Most common method — print to UART, view in serial monitor

// Debug macros (compile out in production with -DNDEBUG)
#ifdef DEBUG
  #define DBG(fmt, ...) Serial.printf("[%lu] " fmt "\\n", millis(), ##__VA_ARGS__)
#else
  #define DBG(fmt, ...) ((void)0)
#endif

DBG("ADC = %d, voltage = %.2f V", raw, raw * 5.0f / 1023.0f);
// In production: DBG does nothing — zero overhead

// ── LED debug ─────────────────────────────────────────────────────
// Blink LED to signal state: 1 blink = state A, 2 blinks = state B
void blink_code(uint8_t count) {
    for (uint8_t i = 0; i < count; i++) {
        digitalWrite(LED_BUILTIN, HIGH); delay(200);
        digitalWrite(LED_BUILTIN, LOW);  delay(200);
    }
    delay(1000);  // pause between sequences
}

// ── Logic analyzer / oscilloscope ─────────────────────────────────
// Toggle a pin to measure timing precisely
// Set pin HIGH before critical section, LOW after
// Measure with oscilloscope or $15 logic analyzer (Saleae clone)
PORTB |= (1 << PB0);   // mark start
// ... code to measure ...
PORTB &= ~(1 << PB0);  // mark end

// ── JTAG / SWD debugging (for 32-bit MCUs) ────────────────────────
// STM32 with ST-Link: full breakpoint debugging in VS Code / STM32CubeIDE
// Set breakpoints, inspect variables, step through code
// Even watch hardware registers in real time!

// ── Watchdog timer — recover from crashes ─────────────────────────
#include <avr/wdt.h>
wdt_enable(WDTO_2S);   // reset if main loop doesn't pet watchdog every 2s

void loop() {
    wdt_reset();   // pet the dog — call this regularly!
    // ... your code ...
}`} />
      </Section>

      <Section num="15" title="Mini Project: Digital Thermometer with LCD">
        <p>Read temperature from a DS18B20 sensor (1-Wire protocol) and display it on a 16×2 LCD display. Shows real sensor reading, sensor library use, and display formatting.</p>
        <CodeBlock language="c" code={`// ── Hardware connections ──────────────────────────────────────────
// DS18B20 DATA → Arduino pin 2 (with 4.7kΩ pull-up to 5V)
// LCD RS → pin 12, EN → pin 11, D4-D7 → pins 5,4,3,2 (or use I2C LCD)

// ── Libraries ─────────────────────────────────────────────────────
// Arduino IDE: install OneWire + DallasTemperature + LiquidCrystal

#include <OneWire.h>
#include <DallasTemperature.h>
#include <LiquidCrystal.h>

#define ONE_WIRE_PIN 2
OneWire oneWire(ONE_WIRE_PIN);
DallasTemperature sensors(&oneWire);
LiquidCrystal lcd(12, 11, 5, 4, 3, 2);

// Custom degree symbol for LCD
uint8_t degree_char[8] = {
    0b00110, 0b01001, 0b01001, 0b00110,
    0b00000, 0b00000, 0b00000, 0b00000
};

// Running average filter (smooth noisy readings)
#define HISTORY_LEN 5
float history[HISTORY_LEN] = {0};
uint8_t history_idx = 0;
bool history_full = false;

float filtered_temperature(float new_reading) {
    history[history_idx] = new_reading;
    history_idx = (history_idx + 1) % HISTORY_LEN;
    if (history_idx == 0) history_full = true;

    uint8_t count = history_full ? HISTORY_LEN : history_idx;
    float sum = 0;
    for (uint8_t i = 0; i < count; i++) sum += history[i];
    return sum / count;
}

void setup() {
    Serial.begin(9600);
    sensors.begin();

    lcd.begin(16, 2);
    lcd.createChar(0, degree_char);   // custom char slot 0
    lcd.print("Thermometer v1.0");
    delay(2000);
    lcd.clear();
}

void loop() {
    // Request temperature from DS18B20 (takes ~750ms at 12-bit resolution)
    sensors.requestTemperatures();
    float raw_temp   = sensors.getTempCByIndex(0);   // first sensor
    float temp_c     = filtered_temperature(raw_temp);
    float temp_f     = temp_c * 9.0f / 5.0f + 32.0f;

    // Display on LCD
    lcd.setCursor(0, 0);
    lcd.print("Temp: ");
    lcd.print(temp_c, 1);          // 1 decimal place
    lcd.write((uint8_t)0);        // degree symbol
    lcd.print("C  ");             // spaces to clear old chars

    lcd.setCursor(0, 1);
    lcd.print("    = ");
    lcd.print(temp_f, 1);
    lcd.write((uint8_t)0);
    lcd.print("F  ");

    // Serial output for PC monitoring
    Serial.print("T=");
    Serial.print(temp_c, 2);
    Serial.print("C  raw=");
    Serial.println(raw_temp, 2);

    // Overheat warning
    if (temp_c > 30.0f) {
        lcd.setCursor(14, 0);
        lcd.print("!!");
    }

    delay(1000);  // update every second
}`} />
        <TipBox>Use an I2C LCD module (PCF8574 backpack) to reduce wiring from 6 pins to 2 (SDA + SCL). Find address with the I2C scanner sketch, then use <code>LiquidCrystal_I2C lcd(0x27, 16, 2)</code>.</TipBox>
      </Section>

      <Section num="16" title="Simulation: Register State Walkthrough">
        <p>This simulation traces every bit of DDRB and PORTB through a sequence of operations so you can see exactly what's happening at the hardware level — a skill you can't skip in embedded development.</p>
        <Sub title="Configuring Port B Step by Step">
          <CodeBlock language="text" code={`ATmega328P Port B Register Simulation
Pins mapped: PB7 PB6 PB5 PB4 PB3 PB2 PB1 PB0
                                         ↑
                                    Arduino pin 13 (built-in LED) = PB5
                                    Arduino pin  8               = PB0

STEP 0: Power-on reset
  DDRB  = 0b00000000   (all inputs — safest default)
  PORTB = 0b00000000   (no pull-ups, no outputs driven)

STEP 1: DDRB |= (1 << PB5)    ← set PB5 as output
  Mask  = 0b00100000
  DDRB before: 00000000
  DDRB after:  00100000   ← bit 5 is now 1 (output)
  Effect: PB5 pin is now an output; hardware output driver enabled

STEP 2: DDRB |= (1 << PB5) | (1 << PB4)    ← also set PB4 output
  Mask  = 0b00110000
  DDRB before: 00100000
  DDRB after:  00110000

STEP 3: DDRB &= ~(1 << PB0)    ← ensure PB0 is input
  ~Mask = 0b11111110
  DDRB before: 00110000
  DDRB after:  00110000   ← no change (PB0 was already 0)

STEP 4: PORTB |= (1 << PB0)    ← enable internal pull-up on PB0 input
  PORTB before: 00000000
  PORTB after:  00000001
  Effect: 20-50kΩ internal resistor pulls PB0 HIGH
           reading PINB bit 0 will return 1 unless pulled LOW externally

STEP 5: PORTB |= (1 << PB5)    ← drive PB5 HIGH (LED on)
  PORTB before: 00000001
  PORTB after:  00100001
  Effect: PB5 output → 5V  →  current flows through LED  →  LED ON

STEP 6: PORTB &= ~(1 << PB5)   ← drive PB5 LOW (LED off)
  PORTB before: 00100001
  PORTB after:  00000001
  Effect: PB5 output → 0V  →  LED OFF

STEP 7: PORTB ^= (1 << PB5)    ← toggle PB5
  XOR mask:     00100000
  PORTB before: 00000001   (PB5=0)
  PORTB after:  00100001   (PB5=1)

  Run again:
  PORTB before: 00100001   (PB5=1)
  PORTB after:  00000001   (PB5=0)

RULE SUMMARY:
  Set bit  N:  reg |=  (1 << N)    — use OR with mask
  Clear bit N: reg &= ~(1 << N)    — use AND with inverted mask
  Toggle bit N: reg ^=  (1 << N)   — use XOR with mask
  Read bit  N: reg &   (1 << N)    — returns 0 or non-zero`} />
        </Sub>
        <Sub title="Multi-bit Field Manipulation">
          <CodeBlock language="text" code={`Timer0 TCCR0B register (clock select bits CS02:CS01:CS00)
Bits 7-3 are other settings; bits 2:0 select prescaler:
  CS02 CS01 CS00  Meaning
    0    0    0   Timer stopped
    0    0    1   No prescale (CLK/1)
    0    1    0   CLK/8
    0    1    1   CLK/64
    1    0    0   CLK/256
    1    0    1   CLK/1024

Goal: set prescaler to CLK/64 (CS=0b011) without touching bits 7-3

Step 1: clear the CS bits first (mask = 0b00000111)
  TCCR0B &= ~0x07
  Before: TCCR0B = 0b10110100   (some bits already set)
  After:  TCCR0B = 0b10110000   ← CS bits all zero

Step 2: set CS to 0b011
  TCCR0B |= (1 << CS01) | (1 << CS00)
  OR mask:  0b00000011
  After:  TCCR0B = 0b10110011   ← CS = 011 = CLK/64

One-liner:
  TCCR0B = (TCCR0B & ~0x07) | 0x03;
  ────────────────────────────────
  Read-modify-write: preserve other bits, set CS field`} />
        </Sub>
        <Sub title="Volatile and the Compiler Optimisation Trap">
          <CodeBlock language="c" code={`// Without volatile — compiler may remove the loop entirely!
// It sees "reg never changes in this function" and optimises to:
//   if (SOME_REGISTER & FLAG) { while(1); }  → infinite loop or skip
uint8_t *reg = (uint8_t *)0x80;
while (*reg & 0x01) { }   // BAD — optimizer may hoist condition out of loop

// With volatile — compiler re-reads the address every iteration
volatile uint8_t *reg = (volatile uint8_t *)0x80;
while (*reg & 0x01) { }   // CORRECT — hardware can change *reg at any time

// ISR-shared variables also need volatile:
volatile bool data_ready = false;   // ISR sets this
// Without volatile, main loop may see stale cached value in register

// Atomic read of 16-bit value on 8-bit MCU
// Problem: timer is 16-bit but CPU reads 8 bits at a time
// If timer increments between the two reads, you get a torn value!
volatile uint16_t tick_count;   // modified in ISR

uint16_t read_ticks_safe(void) {
    uint8_t sreg_save = SREG;   // save interrupt flag
    cli();                       // disable interrupts
    uint16_t val = tick_count;   // atomic 16-bit read (interrupts off)
    SREG = sreg_save;            // restore (re-enables interrupts if they were on)
    return val;
}`} />
        </Sub>
        <RegisterSimulator />
      </Section>

      <Section num="17" title="Simulation: Signal Timing Diagrams">
        <p>Reading timing diagrams is a core embedded skill. Every protocol datasheet starts with one. These diagrams show exact voltage levels over time for each wire in the protocol.</p>
        <Sub title="UART Frame Anatomy — 9600 baud, 8N1">
          <CodeBlock language="text" code={`UART: 9600 baud → 1 bit = 104.17 µs
Configuration: 8 data bits, No parity, 1 stop bit  (8N1)

Idle line = HIGH (mark state) — line is always HIGH when nothing is sent

Transmitting 0x41 ('A') = 0b01000001

 Time:  [idle] [S][D0][D1][D2][D3][D4][D5][D6][D7][stop][idle]
                             bit index (LSB first)

TX pin: ___    ___|  |___|___|___|___|  |___|___|  |___
           HIGH   LOW                                 HIGH
         (idle) START D0  D1  D2  D3  D4  D5  D6  D7  STOP

Decoding 0x41:
  Start bit: LOW  (always, signals frame start)
  D0 = 1  (LSB)
  D1 = 0
  D2 = 0
  D3 = 0
  D4 = 0
  D5 = 0
  D6 = 1
  D7 = 0  (MSB)
  Stop bit: HIGH (always, gives receiver time to resync)
  → value = 0b01000001 = 0x41 = 'A'

Total frame time: 10 bits × 104.17 µs = 1041.7 µs ≈ 1 ms per byte
At 115200 baud: 1 bit = 8.68 µs → ~86.8 µs per byte → max ~11,520 bytes/sec

Common UART mistakes:
  ✗ Mismatched baud rates → garbage data (framing errors)
  ✗ Floating RX pin → random noise triggers false frames
  ✗ Missing common ground between two devices
  ✗ Long wires at high baud → signal integrity issues`} />
        </Sub>
        <Sub title="SPI Timing — Mode 0 (CPOL=0, CPHA=0)">
          <CodeBlock language="text" code={`SPI Mode 0: Clock idle LOW, data sampled on RISING edge
Transferring 0xA5 = 0b10100101 (master sends) simultaneously receiving 0x3C

     ___     ___     ___     ___     ___     ___     ___     ___
SCK:    |___|   |___|   |___|   |___|   |___|   |___|   |___|   |___
      bit7   bit6   bit5   bit4   bit3   bit2   bit1   bit0

CS:  ______________________________________________________
     LOW = slave selected (active low)

MOSI: 1       0       1       0       0       1       0       1
(master→slave, MSB first)

MISO: 0       0       1       1       1       1       0       0
(slave→master)

       ↑                                                         ↑
    CS goes LOW                                             CS goes HIGH
    (select slave)                                         (deselect slave)

Data is CAPTURED on ↑ (rising edge of SCK)
Data is SHIFTED  on ↓ (falling edge of SCK)

SPI Modes summary:
  Mode 0: CPOL=0 CPHA=0  clock idle LOW,  sample RISING   (most common)
  Mode 1: CPOL=0 CPHA=1  clock idle LOW,  sample FALLING
  Mode 2: CPOL=1 CPHA=0  clock idle HIGH, sample FALLING
  Mode 3: CPOL=1 CPHA=1  clock idle HIGH, sample RISING

Why multiple slaves need separate CS pins:
  All slaves share SCK/MOSI/MISO wires
  Only the slave with CS=LOW responds
  Others keep MISO in high-impedance (tri-state) to avoid bus contention`} />
        </Sub>
        <Sub title="I2C Frame Anatomy">
          <CodeBlock language="text" code={`I2C: 2 wires (SDA=data, SCL=clock), open-drain, pulled HIGH by resistors
     Multiple masters and slaves on same bus, each with 7-bit address

Write transaction: Master writes register 0x11 with value 0x42
to device at address 0x68 (DS3231 RTC)

SDA: __   _________   ___   ___________   _   ___   _   ___________   ____
       |_|           |   |_|           |_| |_|   |_| |               |
       S  addr(0x68) W  ACK  reg(0x11) ACK   data(0x42) ACK          P

SCL:     _   _   _   _   _   _   _   _     _   _   _   _   _   _   _   _
     ___|  | | | | | | | | | | | | | | |___| | | | | | | | | | | | | | |___

Breakdown:
  S     = START condition (SDA falls while SCL is HIGH)
  Addr  = 7-bit address 0x68 = 1101000 (7 bits)
  W     = Write bit = 0
  ACK   = Slave pulls SDA LOW to acknowledge (master releases SDA)
  Reg   = Register address byte 0x11
  ACK   = Slave acknowledges
  Data  = Data byte 0x42
  ACK   = Slave acknowledges
  P     = STOP condition (SDA rises while SCL is HIGH)

Read transaction (read 2 bytes from register 0x11):
  S → addr+W → ACK → reg(0x11) → ACK → Sr → addr+R → ACK → data1 → ACK → data2 → NACK → P
  Sr = Repeated START (no STOP in between — keeps bus ownership)
  NACK on last byte tells slave "I'm done reading"

ACK/NACK logic:
  ACK  = SDA pulled LOW by receiver = "got it, send more"
  NACK = SDA remains HIGH           = "stop / error / done"

I2C speeds:
  Standard mode:  100 kHz
  Fast mode:      400 kHz
  Fast-plus:        1 MHz
  High-speed:       3.4 MHz`} />
        </Sub>
        <Sub title="PWM Waveform Simulation">
          <CodeBlock language="text" code={`PWM at 1 kHz (1 ms period), varying duty cycle

Duty = 0% (analogWrite(pin, 0)):
  _____________________________________________
 | LOW the entire period — LED fully off

Duty = 25% (analogWrite(pin, 64)):
                period = 1 ms
         |←──────────────────────────────────→|
  ____
 |    |___________________________________
  0.25ms  0.75ms

  Average voltage = 5V × 25% = 1.25V
  LED appears dim

Duty = 50% (analogWrite(pin, 128)):
  __________
 |          |__________
  0.5ms      0.5ms

  Average voltage = 5V × 50% = 2.5V

Duty = 75% (analogWrite(pin, 192)):
  _______________
 |               |_____
  0.75ms          0.25ms

  Average voltage = 5V × 75% = 3.75V

Duty = 100% (analogWrite(pin, 255)):
  _____________________________________________
  HIGH the entire period — LED fully on

Motor speed control:
  0%   → stationary
  50%  → half speed (roughly)
  100% → full speed

Servo control (50 Hz, 20 ms period):
  Pulse width 1.0 ms → 0°  (1.0/20.0 = 5% duty)
  Pulse width 1.5 ms → 90° (1.5/20.0 = 7.5% duty)
  Pulse width 2.0 ms → 180° (2.0/20.0 = 10% duty)
  Remaining 18-19 ms: LOW (servo holds position)`} />
        </Sub>
      </Section>

      <Section num="18" title="Simulation: ADC Successive Approximation">
        <InfoBox>The ATmega's ADC uses a Successive Approximation Register (SAR). It works like a binary search — it tries each bit from MSB to LSB, comparing the generated voltage against the input. Each comparison takes 1 ADC clock cycle.</InfoBox>
        <CodeBlock language="text" code={`SAR ADC — converting an analog voltage to a 10-bit digital number

Setup: Vref = 5.00V, Vin = 3.14V (e.g., from a sensor)
Resolution: 5.00V / 1024 steps = 4.883 mV per step
Expected result: 3.14 / 4.883e-3 ≈ 643 = 0b1010000011

The SAR tries bits from MSB (bit 9) to LSB (bit 0):

Bit  Value  Trial voltage  Vin=3.14V?  Result
─────────────────────────────────────────────
  9    512   512×4.883mV = 2.500V   3.14 > 2.50?  YES → keep bit 9
  8    256   (512+256)×4.883mV = 3.750V  3.14 > 3.75?  NO → clear bit 8
  7    128   (512+128)×4.883mV = 3.125V  3.14 > 3.13?  YES → keep bit 7
  6     64   (512+128+64)×4.883mV = 3.438V  3.14 > 3.44?  NO → clear bit 6
  5     32   (512+128+32)×4.883mV = 3.281V  3.14 > 3.28?  NO → clear bit 5
  4     16   (512+128+16)×4.883mV = 3.203V  3.14 > 3.20?  NO → clear bit 4
  3      8   (512+128+8)×4.883mV = 3.164V   3.14 > 3.16?  NO → clear bit 3
  2      4   (512+128+4)×4.883mV = 3.145V   3.14 > 3.14?  NO → clear bit 2
  1      2   (512+128+2)×4.883mV = 3.135V   3.14 > 3.14?  YES → keep bit 1
  0      1   (512+128+2+1)×4.883mV = 3.140V  3.14 > 3.14?  NO → clear bit 0

Final register: bit 9=1, 8=0, 7=1, 6=0, 5=0, 4=0, 3=0, 2=0, 1=1, 0=0
Binary: 1010000010 = 642
Actual voltage: 642 × 4.883mV = 3.135V  (error = 5mV = 0.16%)

This is why ADC conversion takes 13 ADC clock cycles on ATmega:
  1 cycle  = sample and hold (capacitor charges to Vin)
  10 cycles = 10 successive approximation steps
  1 cycle  = output latch
  1 cycle  = setup
  → ADC clock should be 50-200 kHz: at 16MHz/128 prescaler = 125 kHz
  → Conversion time = 13 / 125000 Hz = 104 µs per sample`} />
        <Sub title="Improving ADC Accuracy in Code">
          <CodeBlock language="c" code={`// Problem 1: ADC noise (1-2 LSB random variation)
// Solution: oversample and decimate (hardware-free resolution boost)
// Reading N^2 samples and averaging gives log2(N) extra bits
uint16_t adc_oversample_12bit(uint8_t channel) {
    uint32_t sum = 0;
    for (uint8_t i = 0; i < 16; i++) {   // 16 = 4^2 → 2 extra bits
        sum += adc_read(channel);
        _delay_us(100);   // let noise de-correlate between samples
    }
    return sum >> 2;   // divide by 4 (shift right 2) → 12-bit result
}

// Problem 2: Power supply noise on ADC reference
// Solution: use internal 1.1V bandgap reference (cleaner than AVcc)
void adc_use_internal_ref(void) {
    ADMUX = (1 << REFS1) | (1 << REFS0);  // internal 1.1V ref
    // Wait for reference to settle after switching
    adc_read(0);  // dummy read
    _delay_ms(10);
}

// Problem 3: Digital activity on chip causes noise in ADC
// Solution: disable digital input buffer on ADC pins
void adc_disable_digital(uint8_t channel) {
    DIDR0 |= (1 << channel);   // disable digital input for ADCn pin
}

// Problem 4: Ratiometric measurements (sensor output proportional to Vcc)
// If Vcc varies but sensor tracks it, use Vcc as reference:
// Result is immune to supply voltage variations
// E.g., 10K/10K voltage divider on Vcc → always reads 512 regardless of Vcc`} />
        </Sub>
        <ADCSim />
      </Section>

      <Section num="19" title="Simulation: Interrupt Timeline">
        <InfoBox>When an interrupt fires, the CPU transparently saves its state, jumps to the ISR, executes it, restores state, and continues exactly where it left off. Understanding this timeline explains why ISRs must be short and why <code>volatile</code> is non-negotiable.</InfoBox>
        <CodeBlock language="text" code={`Interrupt Timeline — External interrupt INT0 fires during main loop

Time →

CPU executing main_loop():
  [inst 1] [inst 2] [inst 3]
                              ↑ INT0 fires (button pressed, pin goes LOW)

CPU hardware actions (automatic, 2-5 cycles):
  1. Finish current instruction (cannot interrupt mid-instruction)
  2. Push PC (program counter) onto stack:   SP -= 2, stack[SP] = PC
  3. Push SREG (status register) — on some CPUs this is manual (see below)
  4. Clear global interrupt flag (I-bit in SREG = 0, disables nested interrupts)
  5. Load ISR address into PC → jump to ISR(INT0_vect)

ISR executes (you write this):
  [ISR instr 1] button_pressed = true;   ← fast! 2 cycles
  [ISR instr 2] return (RETI instruction)

RETI (Return from Interrupt):
  1. Pop PC from stack (restore main_loop position)
  2. Set I-bit = 1 (re-enable interrupts)
  3. Continue execution at [inst 4] in main_loop

Full timeline:
  main: [1] [2] [3]──────────────────────────────[4] [5] [6]
                  \  save PC+SREG  ISR runs  RETI /
                   \_________________________________/
                    ← interrupt latency on AVR: ~4-6 cycles (250-375 ns at 16 MHz)

Stack state during ISR (ATmega, grows downward):
  Before:       SP → [free memory]
  After push:   SP → [PCH] [PCL] [saved data]
  In ISR:              ↑ stack frames
  After RETI:   SP → [free memory]  (restored)

Why ISRs must be short:
  If another interrupt fires while I-bit=0: it waits (latency increases)
  If ISR takes 10 ms and timer fires every 1 ms: timer events are LOST
  Rule: set a flag in ISR, do actual work in main loop

Critical section — protecting shared data:
  // main reads a 16-bit variable written by ISR
  // without protection: ISR fires between reading low and high byte → torn read
  uint8_t sreg = SREG;
  cli();                      // I-bit = 0, disable interrupts
  uint16_t val = shared_var;  // safe 16-bit read
  SREG = sreg;                // restore interrupt state`} />
        <Sub title="Interrupt Priority and Nesting on ARM (STM32)">
          <CodeBlock language="c" code={`// STM32 NVIC (Nested Vectored Interrupt Controller)
// Unlike AVR: ARM Cortex-M supports nested interrupts and priorities

// Set interrupt priorities (0 = highest, 15 = lowest on STM32)
HAL_NVIC_SetPriority(EXTI0_IRQn, 0, 0);   // button: highest priority
HAL_NVIC_SetPriority(TIM2_IRQn,  1, 0);   // timer: second
HAL_NVIC_SetPriority(USART1_IRQn, 2, 0);  // UART: third

HAL_NVIC_EnableIRQ(EXTI0_IRQn);
HAL_NVIC_EnableIRQ(TIM2_IRQn);
HAL_NVIC_EnableIRQ(USART1_IRQn);

// Nesting example: if UART ISR (priority 2) is running,
// and button fires (priority 0), Cortex-M will:
//   1. Save UART ISR context (hardware, automatic)
//   2. Execute button ISR
//   3. Restore and continue UART ISR
// This is impossible on AVR without manual sei() inside ISR!

// ARM automatically saves r0-r3, r12, LR, PC, xPSR onto stack
// Called "exception entry stacking" — no manual push/pop needed
// Total overhead: ~12 cycles for state save + 12 for restore`} />
        </Sub>
      </Section>

      <Section num="20" title="Finite State Machines">
        <p>FSMs are the dominant design pattern in embedded systems. Every digital system that has "modes" or "states" is an FSM: a vending machine, a traffic light, a UART receiver, a debounce filter. Implementing an FSM in C is always cleaner than a nest of flags and <code>if</code>-statements.</p>
        <Sub title="Debounce FSM">
          <CodeBlock language="text" code={`Mechanical buttons bounce for 5-20 ms when pressed/released:
Physical button press produces this signal:
  _____|‾‾|_|‾‾‾|__|‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
         bouncing (~10 ms)    stable pressed state

Debounce FSM — 4 states:

         ┌─────────────────────────────────────────────────────┐
         │                     STATES                          │
         │                                                     │
    ┌────┴────┐  pin=LOW   ┌──────────┐  timer=20ms  ┌──────┐ │
    │  IDLE   │──────────→ │DEBOUNCING│─────────────→ │PRESSED│ │
    │ pin=HIGH│            │ count up │               │stable │ │
    └────┬────┘            └────┬─────┘               └───┬──┘ │
         │                     │                          │    │
         │         pin=HIGH    │             pin=HIGH     │    │
         │  (bounce/noise)     │─────────────────────────→│    │
         │                     │             (release)    │    │
         │                     ↓                          │    │
         │              ┌──────────────┐  timer=20ms      │    │
         └──────────────│  RELEASING   │←─────────────────┘    │
                        │  count up   │                        │
                        └──────────────┘                       │
                                                               │
└─────────────────────────────────────────────────────────────┘`} />
          <CodeBlock language="c" code={`typedef enum { BTN_IDLE, BTN_DEBOUNCING, BTN_PRESSED, BTN_RELEASING } BtnState;

typedef struct {
    BtnState  state;
    uint32_t  timer_start;
    bool      event_pressed;   // single-cycle pulse: true for one loop iteration
    bool      event_released;
    uint8_t   pin;
} Button;

void button_init(Button *b, uint8_t pin) {
    b->state = BTN_IDLE;
    b->pin   = pin;
    b->event_pressed = b->event_released = false;
    pinMode(pin, INPUT_PULLUP);
}

void button_update(Button *b) {
    bool raw_low = (digitalRead(b->pin) == LOW);  // active-low button
    b->event_pressed  = false;   // clear one-cycle events
    b->event_released = false;

    switch (b->state) {
        case BTN_IDLE:
            if (raw_low) {
                b->state = BTN_DEBOUNCING;
                b->timer_start = millis();
            }
            break;

        case BTN_DEBOUNCING:
            if (!raw_low) {
                b->state = BTN_IDLE;   // noise, reset
            } else if (millis() - b->timer_start >= 20) {
                b->state = BTN_PRESSED;
                b->event_pressed = true;   // fire pressed event
            }
            break;

        case BTN_PRESSED:
            if (!raw_low) {
                b->state = BTN_RELEASING;
                b->timer_start = millis();
            }
            break;

        case BTN_RELEASING:
            if (raw_low) {
                b->state = BTN_PRESSED;   // still pressed
            } else if (millis() - b->timer_start >= 20) {
                b->state = BTN_IDLE;
                b->event_released = true;
            }
            break;
    }
}

// Usage — no delays, works with millis() non-blocking
Button btn;
void setup() { button_init(&btn, 2); }
void loop() {
    button_update(&btn);
    if (btn.event_pressed)  Serial.println("Pressed!");
    if (btn.event_released) Serial.println("Released!");
}`} />
        </Sub>
        <Sub title="Traffic Light FSM">
          <CodeBlock language="text" code={`Traffic light state machine:

States and transitions:
  ┌──────────────────────────────────────────────────────────┐
  │                                                          │
  ▼   30 seconds                                             │
┌─────┐ ────────→ ┌──────┐ 5 sec ┌────────┐ 10 sec ┌──────┐│
│GREEN│            │YELLOW│──────→│  RED   │────────→│GREEN ││
└─────┘            └──────┘       └────────┘         └──────┘│
                                       │                     │
                                       │ (pedestrian         │
                                       │  button pressed)    │
                                       └─────────────────────┘
                                         stay RED 5 more sec`} />
          <CodeBlock language="c" code={`typedef enum { TL_GREEN, TL_YELLOW, TL_RED } TrafficState;

typedef struct {
    TrafficState state;
    uint32_t     entered_at;   // millis() when state was entered
    bool         ped_request;  // pedestrian button pressed
} TrafficLight;

// State durations in ms
static const uint32_t DURATION[] = {
    [TL_GREEN]  = 30000,
    [TL_YELLOW] =  5000,
    [TL_RED]    = 10000,
};

void tl_enter(TrafficLight *tl, TrafficState s) {
    tl->state      = s;
    tl->entered_at = millis();
    // Drive the actual LEDs
    digitalWrite(PIN_GREEN,  s == TL_GREEN);
    digitalWrite(PIN_YELLOW, s == TL_YELLOW);
    digitalWrite(PIN_RED,    s == TL_RED);
    if (s == TL_RED) tl->ped_request = false;  // served the request
}

void tl_update(TrafficLight *tl) {
    uint32_t elapsed = millis() - tl->entered_at;

    switch (tl->state) {
        case TL_GREEN:
            if (elapsed >= DURATION[TL_GREEN]) tl_enter(tl, TL_YELLOW);
            break;
        case TL_YELLOW:
            if (elapsed >= DURATION[TL_YELLOW]) tl_enter(tl, TL_RED);
            break;
        case TL_RED: {
            uint32_t hold = tl->ped_request ? DURATION[TL_RED] + 5000 : DURATION[TL_RED];
            if (elapsed >= hold) tl_enter(tl, TL_GREEN);
            break;
        }
    }
}

// Interrupt or button check sets tl.ped_request = true`} />
        </Sub>
        <TrafficFSM />
        <Sub title="UART Receive FSM">
          <CodeBlock language="c" code={`// Parses a simple text protocol: "$CMD,DATA\n"
// Without FSM this would be spaghetti; with FSM it's clean and extensible

typedef enum { WAIT_DOLLAR, READ_CMD, WAIT_COMMA, READ_DATA, WAIT_NEWLINE } ParseState;

typedef struct {
    ParseState state;
    char       cmd[8];
    char       data[32];
    uint8_t    cmd_idx;
    uint8_t    data_idx;
    bool       complete;   // set when full frame received
} UartParser;

void parser_reset(UartParser *p) {
    p->state    = WAIT_DOLLAR;
    p->cmd_idx  = p->data_idx = 0;
    p->complete = false;
}

void parser_feed(UartParser *p, char c) {
    switch (p->state) {
        case WAIT_DOLLAR:
            if (c == '$') p->state = READ_CMD;
            break;
        case READ_CMD:
            if (c == ',') { p->cmd[p->cmd_idx] = '\0'; p->state = READ_DATA; }
            else if (p->cmd_idx < 7) p->cmd[p->cmd_idx++] = c;
            else parser_reset(p);   // overflow → reset
            break;
        case READ_DATA:
            if (c == '\n') {
                p->data[p->data_idx] = '\0';
                p->complete = true;
                p->state    = WAIT_DOLLAR;
            } else if (p->data_idx < 31) p->data[p->data_idx++] = c;
            else parser_reset(p);
            break;
        default: break;
    }
}

// In UART ISR or loop:
void loop() {
    if (Serial.available()) {
        parser_feed(&parser, (char)Serial.read());
        if (parser.complete) {
            handle_command(parser.cmd, parser.data);
            parser_reset(&parser);
        }
    }
}`} />
        </Sub>
      </Section>

      <Section num="21" title="Simulation: FreeRTOS Scheduler Trace">
        <InfoBox>FreeRTOS uses a preemptive priority scheduler. Higher-priority tasks always run first. Equal-priority tasks share CPU using round-robin time slicing (one tick = 1 ms by default). Blocked tasks (waiting on queue, delay, semaphore) never consume CPU.</InfoBox>
        <CodeBlock language="text" code={`FreeRTOS Scheduler Trace — 3 tasks on ATmega2560 (Arduino Mega)

Tasks:
  Task A: priority 3 (highest), runs every 10 ms for 1 ms (sensor read)
  Task B: priority 2 (medium),  runs every 50 ms for 5 ms (display update)
  Task C: priority 1 (low),     runs continuously  (background computation)
  IDLE:   priority 0,           runs when nothing else ready

Time (ms):
  0         10        20        30        40        50
  |────────────────────────────────────────────────────────→

A:  |██|          |██|          |██|          |██|          |██|
B:  |████|                                    |████|
C:       |████████|  |████████|  |████████|        |████████|
IDLE: never (C always ready)

Detailed zoom into t=0..12ms:

t=0:  Scheduler starts. A,B,C all ready.
      A has highest priority → A runs
t=1:  A calls vTaskDelayUntil(10ms) → A BLOCKED, gives up CPU
      B is next highest priority → B runs
t=6:  B calls vTaskDelayUntil(50ms) → B BLOCKED
      Only C is ready → C runs
t=10: Timer tick fires. A's delay expires → A becomes READY
      Scheduler sees A (prio 3) > C (prio 1) → PREEMPT C
      Context switch: save C's registers, load A's registers
      A resumes immediately
t=11: A calls vTaskDelayUntil(20ms) → A BLOCKED
      C resumes from exact instruction where it was preempted

Context switch overhead: ~10-20 µs on AVR @ 16 MHz
(saves/restores 32 registers + PC + SREG onto task stack)`} />
        <Sub title="FreeRTOS Primitives Deep Dive">
          <CodeBlock language="c" code={`// ── Semaphore — signal between tasks or ISR→task ──────────────────
SemaphoreHandle_t data_ready_sem;

// ISR: data arrives, signal consumer task
void ISR_SPI_complete(void) {
    BaseType_t woken = pdFALSE;
    xSemaphoreGiveFromISR(data_ready_sem, &woken);
    portYIELD_FROM_ISR(woken);   // if consumer has higher prio, switch now
}

void consumer_task(void *p) {
    while (1) {
        xSemaphoreTake(data_ready_sem, portMAX_DELAY);  // block until signaled
        process_spi_data();   // safe: ISR has already written the data
    }
}

// ── Mutex — mutual exclusion for shared resources ──────────────────
SemaphoreHandle_t uart_mutex;

void task_a(void *p) {
    while (1) {
        xSemaphoreTake(uart_mutex, portMAX_DELAY);   // LOCK
        Serial.println("Task A output");              // only one task at a time
        xSemaphoreGive(uart_mutex);                   // UNLOCK
        vTaskDelay(pdMS_TO_TICKS(500));
    }
}

// ── Event Groups — wait for multiple conditions at once ─────────────
EventGroupHandle_t events;
#define EVT_SENSOR_READY   (1 << 0)
#define EVT_GPS_READY      (1 << 1)
#define EVT_NETWORK_READY  (1 << 2)

void logger_task(void *p) {
    while (1) {
        // Block until BOTH sensor AND gps are ready
        xEventGroupWaitBits(events,
            EVT_SENSOR_READY | EVT_GPS_READY,
            pdTRUE,    // clear bits on return
            pdTRUE,    // wait for ALL (pdFALSE = wait for ANY)
            pdMS_TO_TICKS(5000));
        log_data();
    }
}

// ── Stream Buffer — zero-copy UART receive pipeline ────────────────
StreamBufferHandle_t uart_stream;
// uart_stream = xStreamBufferCreate(256, 1);

// In UART ISR:
void ISR_USART_RX(void) {
    char c = UDR0;
    xStreamBufferSendFromISR(uart_stream, &c, 1, NULL);
}

// In processing task:
char buf[64];
size_t n = xStreamBufferReceive(uart_stream, buf, sizeof(buf), pdMS_TO_TICKS(100));
buf[n] = '\0';`} />
        </Sub>
        <Sub title="Stack Overflow Detection">
          <CodeBlock language="c" code={`// FreeRTOS can paint task stacks with 0xA5 and check for overflow
// Enable in FreeRTOSConfig.h:
//   #define configCHECK_FOR_STACK_OVERFLOW  2
//   #define configUSE_TRACE_FACILITY        1

// This hook is called if a task overflows its stack
void vApplicationStackOverflowHook(TaskHandle_t task, char *name) {
    Serial.print("STACK OVERFLOW IN TASK: ");
    Serial.println(name);
    // In production: trigger watchdog, log to EEPROM, reset
    for (;;);  // halt for debugging
}

// Check how much stack a task has left (high-water mark)
void monitor_task(void *p) {
    while (1) {
        TaskHandle_t tasks[] = { sensor_handle, display_handle, comms_handle };
        const char *names[]  = { "Sensor", "Display", "Comms" };
        for (int i = 0; i < 3; i++) {
            UBaseType_t free = uxTaskGetStackHighWaterMark(tasks[i]);
            Serial.print(names[i]); Serial.print(" free stack: ");
            Serial.print(free * sizeof(StackType_t));
            Serial.println(" bytes");
        }
        vTaskDelay(pdMS_TO_TICKS(5000));
    }
}
// Rule of thumb: if free stack < 10% of total, increase stack size`} />
        </Sub>
      </Section>

      <Section num="22" title="Power Management and Sleep Modes">
        <InfoBox>Sleep modes are the biggest lever for battery life. An ATmega drawing 15 mA active can drop to 0.1 µA in Power-Down sleep — a 150,000× reduction. A coin cell at 200 mAh would last 3 months running, or 228 years sleeping.</InfoBox>
        <CodeBlock language="text" code={`ATmega328P Power Consumption:
  Mode              Active clocks     Current @ 5V   Current @ 3.3V
  ──────────────────────────────────────────────────────────────────
  Active (16 MHz)   CPU+all periph    15 mA          8 mA
  Idle              periph only        5 mA           3 mA
  ADC Noise Red.    ADC only           6 mA           3.5 mA
  Power-save        Timer2 + RTC    0.75 µA          0.5 µA
  Power-down        Watchdog only   0.36 µA          0.1 µA
  Standby           Osc + WDT         0.84 µA
  ──────────────────────────────────────────────────────────────────
  Wakeup sources:
    Idle:       Any interrupt
    Power-save: Timer2, INT0/INT1, TWI address match, WDT
    Power-down: INT0/INT1 (level), WDT, TWI address match

Battery life calculation (coin cell CR2032 = 225 mAh):
  Scenario: wake 1s every 8s, send 50 bytes over UART, sleep rest
    Active time: 1s out of 8s = 12.5% duty
    Average current: 0.125 × 15 mA + 0.875 × 0.36 µA ≈ 1.875 mA
    Battery life: 225 / 1.875 ≈ 120 hours ≈ 5 days

  Optimized: wake 100ms every 8s = 1.25% duty + 3.3V
    Average: 0.0125 × 8 mA + 0.9875 × 0.1 µA ≈ 0.1 mA
    Battery life: 225 / 0.1 = 2250 hours ≈ 94 days`} />
        <CodeBlock language="c" code={`#include <avr/sleep.h>
#include <avr/power.h>
#include <avr/wdt.h>

// ── Power-Down sleep with WDT wake every 8 seconds ────────────────
ISR(WDT_vect) { }   // watchdog ISR — do nothing, just wake up

void sleep_8s(void) {
    // Disable unneeded peripherals before sleep
    power_adc_disable();
    power_spi_disable();
    power_twi_disable();
    power_timer0_disable();
    power_timer1_disable();
    power_timer2_disable();
    power_usart0_disable();

    // Configure WDT as interrupt (not reset) with 8s timeout
    MCUSR &= ~(1 << WDRF);
    WDTCSR = (1 << WDCE) | (1 << WDE);            // unlock sequence
    WDTCSR = (1 << WDIE) | (1 << WDP3) | (1 << WDP0); // interrupt, 8s

    set_sleep_mode(SLEEP_MODE_PWR_DOWN);
    sleep_enable();
    sei();
    sleep_cpu();       // ← CPU stops here; resumes after WDT fires
    sleep_disable();

    // Re-enable what you need
    power_adc_enable();
    power_usart0_enable();
}

// ── Use millis()-style non-blocking + periodic sleep ─────────────
void loop() {
    // Do your work
    read_sensors();
    transmit_data();

    // Sleep until next cycle
    sleep_8s();
    // ← Returns here 8 seconds later, loop continues
}

// ── STM32 low-power with HAL ──────────────────────────────────────
// Stop mode: 1.5 µA, wakes on RTC alarm or external interrupt
HAL_SuspendTick();                  // stop SysTick (would wake immediately)
HAL_PWREx_EnableUltraLowPower();
HAL_PWR_EnterSTOPMode(PWR_LOWPOWERREGULATOR_ON, PWR_STOPENTRY_WFI);
// ← Execution resumes here after wake event
SystemClock_Config();               // must reconfigure PLL after STOP
HAL_ResumeTick();`} />
      </Section>

      <Section num="23" title="Advanced Mini Project: Multi-sensor FreeRTOS Logger">
        <p>A production-style data logger: three FreeRTOS tasks read DHT22, BMP280, and a potentiometer concurrently, protected by a mutex for the shared UART. Readings are queued and written to an SD card in a fourth task. Includes watchdog and stack monitoring.</p>
        <CodeBlock language="c" code={`// Hardware: Arduino Mega (enough RAM for FreeRTOS + 4 tasks)
// DHT22  → pin 2   (temp + humidity)
// BMP280 → I2C     (pressure + altitude)
// POT    → A0      (analog 0-5V)
// SD     → SPI, CS pin 10

#include <Arduino_FreeRTOS.h>
#include <queue.h>
#include <semphr.h>
#include <task.h>
#include <DHT.h>
#include <Adafruit_BMP280.h>
#include <SD.h>

// ── Shared data types ──────────────────────────────────────────────
typedef struct {
    uint32_t timestamp;
    float    temp_c;
    float    humidity;
    float    pressure_hpa;
    int16_t  pot_raw;        // 0-1023
    uint8_t  sensor_id;      // which sensor produced this
} SensorReading;

// ── RTOS handles ───────────────────────────────────────────────────
static QueueHandle_t     reading_queue;
static SemaphoreHandle_t uart_mutex;
static SemaphoreHandle_t i2c_mutex;

DHT dht(2, DHT22);
Adafruit_BMP280 bmp;

// ── Task 1: DHT22 — temperature + humidity every 2 seconds ────────
void task_dht22(void *p) {
    TickType_t last_wake = xTaskGetTickCount();
    while (1) {
        SensorReading r = {0};
        r.timestamp  = xTaskGetTickCount();
        r.sensor_id  = 1;
        r.temp_c     = dht.readTemperature();
        r.humidity   = dht.readHumidity();
        if (!isnan(r.temp_c)) {
            xQueueSend(reading_queue, &r, 0);
        }
        vTaskDelayUntil(&last_wake, pdMS_TO_TICKS(2000));
    }
}

// ── Task 2: BMP280 — pressure every 1 second (I2C shared bus) ─────
void task_bmp280(void *p) {
    TickType_t last_wake = xTaskGetTickCount();
    while (1) {
        SensorReading r = {0};
        r.timestamp  = xTaskGetTickCount();
        r.sensor_id  = 2;
        xSemaphoreTake(i2c_mutex, portMAX_DELAY);   // lock I2C bus
        r.pressure_hpa = bmp.readPressure() / 100.0f;
        xSemaphoreGive(i2c_mutex);
        xQueueSend(reading_queue, &r, 0);
        vTaskDelayUntil(&last_wake, pdMS_TO_TICKS(1000));
    }
}

// ── Task 3: ADC potentiometer — every 500ms ────────────────────────
void task_adc(void *p) {
    TickType_t last_wake = xTaskGetTickCount();
    while (1) {
        SensorReading r = {0};
        r.timestamp = xTaskGetTickCount();
        r.sensor_id = 3;
        // Oversample: 16 readings → 12-bit effective resolution
        uint32_t sum = 0;
        for (uint8_t i = 0; i < 16; i++) sum += analogRead(A0);
        r.pot_raw = sum >> 2;    // divide by 4
        xQueueSend(reading_queue, &r, 0);
        vTaskDelayUntil(&last_wake, pdMS_TO_TICKS(500));
    }
}

// ── Task 4: Logger — dequeue and write to SD + Serial ─────────────
void task_logger(void *p) {
    SensorReading r;
    while (1) {
        if (xQueueReceive(reading_queue, &r, pdMS_TO_TICKS(5000))) {
            // Format CSV line
            char line[80];
            snprintf(line, sizeof(line),
                "%lu,%d,%.2f,%.2f,%.2f,%d",
                (unsigned long)r.timestamp,
                r.sensor_id,
                r.temp_c, r.humidity, r.pressure_hpa, r.pot_raw);

            // Serial output (mutex-protected)
            xSemaphoreTake(uart_mutex, portMAX_DELAY);
            Serial.println(line);
            xSemaphoreGive(uart_mutex);

            // SD write (SPI — SD library is not thread-safe, use mutex)
            static SemaphoreHandle_t sd_mutex;
            if (sd_mutex == NULL) sd_mutex = xSemaphoreCreateMutex();
            xSemaphoreTake(sd_mutex, portMAX_DELAY);
            File f = SD.open("log.csv", FILE_WRITE);
            if (f) { f.println(line); f.close(); }
            xSemaphoreGive(sd_mutex);
        }
    }
}

// ── Task 5: Watchdog + stack monitor ──────────────────────────────
void task_monitor(void *p) {
    TaskHandle_t tasks[4];
    const char  *names[4] = {"DHT22","BMP280","ADC","Logger"};
    // Handles captured after creation in setup()
    while (1) {
        xSemaphoreTake(uart_mutex, portMAX_DELAY);
        Serial.println("── Stack watermarks ──");
        for (int i = 0; i < 4; i++) {
            if (tasks[i]) {
                Serial.print(names[i]);
                Serial.print(": ");
                Serial.print(uxTaskGetStackHighWaterMark(tasks[i]) * 2);
                Serial.println(" bytes free");
            }
        }
        Serial.print("Queue depth: ");
        Serial.println(uxQueueMessagesWaiting(reading_queue));
        xSemaphoreGive(uart_mutex);
        vTaskDelay(pdMS_TO_TICKS(10000));
    }
}

void setup() {
    Serial.begin(115200);
    dht.begin();
    bmp.begin(0x76);
    SD.begin(10);

    reading_queue = xQueueCreate(20, sizeof(SensorReading));
    uart_mutex    = xSemaphoreCreateMutex();
    i2c_mutex     = xSemaphoreCreateMutex();

    // Stack sizes in words (2 bytes each on AVR)
    xTaskCreate(task_dht22,   "DHT22",   196, NULL, 2, NULL);
    xTaskCreate(task_bmp280,  "BMP280",  160, NULL, 2, NULL);
    xTaskCreate(task_adc,     "ADC",     128, NULL, 2, NULL);
    xTaskCreate(task_logger,  "Logger",  256, NULL, 1, NULL);
    xTaskCreate(task_monitor, "Monitor", 160, NULL, 1, NULL);

    vTaskStartScheduler();   // never returns — RTOS takes over
}

void loop() { }   // unused — RTOS scheduler runs instead`} />
        <TipBox>On ATmega2560 (8KB RAM): each task stack uses precious RAM. If you run out, reduce stack sizes with <code>uxTaskGetStackHighWaterMark()</code> measurements, or move to STM32 (20-512KB RAM) where stack sizing is far more forgiving.</TipBox>
      </Section>
    </div>
  )
}
