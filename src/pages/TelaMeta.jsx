// src/pages/TelaMeta.jsx
import { useState } from 'react'
import useStore from '../store/useStore'

export default function TelaMeta() {
  const { materias, metas, addMeta } = useStore()

  const [materiaId, setMateriaId] = useState('')
  const [periodo,   setPeriodo]   = useState('Semanal')
  const [inicio,    setInicio]    = useState('2025-06-01')
  const [fim,       setFim]       = useState('2025-06-07')
  const [horas,     setHoras]     = useState(8)
  const [msg,       setMsg]       = useState('')

  const matSel = materias.find((m) => m.id === +materiaId)
  const pl = { Diário: 'hoje', Semanal: 'esta semana', Mensal: 'este mês' }
  const fdate = (d) => { if (!d) return '?'; const [y,mo,dd] = d.split('-'); return `${dd}/${mo}/${y}` }

  async function salvar() {
    if (!materiaId) { setMsg('⚠️ Selecione a matéria.'); return }
    await addMeta({ materiaId: +materiaId, horas, periodo, inicio, fim })
    setMsg('✅ Meta salva com sucesso!')
    setTimeout(() => setMsg(''), 3000)
  }

  return (
    <>
      <nav className="navbar">
        <span className="navbar-title">🎯 Nova Meta</span>
      </nav>
      <div className="pad">
        {metas.length > 0 && (
          <div className="card">
            <div className="card-title">Metas Ativas</div>
            {metas.map((mt) => {
              const m = materias.find((x) => x.id === mt.materiaId)
              if (!m) return null
              return (
                <div key={mt.id} className="mat-item">
                  <div className="dot" style={{ background: m.cor }} />
                  <div style={{ flex: 1 }} className="fw600 text-sm">{m.nome}</div>
                  <div className="text-xs text-primary fw700">{mt.horas}h · {mt.periodo}</div>
                </div>
              )
            })}
          </div>
        )}

        <div className="card">
          <div className="card-title">Matéria</div>
          <select value={materiaId} onChange={(e) => setMateriaId(e.target.value)}>
            <option value="">— Selecione —</option>
            {materias.map((m) => <option key={m.id} value={m.id}>{m.nome}</option>)}
          </select>
        </div>

        <div className="card">
          <div className="card-title">Período da Meta</div>
          <div className="period-tabs">
            {['Diário', 'Semanal', 'Mensal'].map((p) => (
              <button
                key={p}
                className={`period-tab ${periodo === p ? 'active' : ''}`}
                onClick={() => setPeriodo(p)}
              >{p}</button>
            ))}
          </div>
          <div className="row2">
            <div>
              <label className="lbl">Início <span className="req">*</span></label>
              <input type="date" value={inicio} onChange={(e) => setInicio(e.target.value)} />
            </div>
            <div>
              <label className="lbl">Fim <span className="req">*</span></label>
              <input type="date" value={fim} onChange={(e) => setFim(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-title">Objetivo de Horas</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <input
              type="number" min={1} value={horas}
              onChange={(e) => setHoras(+e.target.value)}
              style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)', textAlign: 'center', background: '#EEF3FF', borderColor: '#c2d0f5' }}
            />
            <span className="fw700" style={{ color: '#555' }}>horas</span>
          </div>
          {matSel && <div className="text-xs text-muted mb10">Meta sugerida: {matSel.horas}h/{matSel.periodo}</div>}
        </div>

        <div className="sum-card">
          <span style={{ fontSize: '2rem' }}>🎯</span>
          <div>
            <div className="fw800" style={{ fontSize: '1rem' }}>
              {matSel ? `${matSel.nome} — ${horas}h ${pl[periodo] || ''}` : 'Selecione a matéria'}
            </div>
            <div style={{ fontSize: '.72rem', opacity: .85 }}>{fdate(inicio)} até {fdate(fim)}</div>
          </div>
        </div>

        {msg && <div className="alert">{msg}</div>}
        <button className="btn-primary" onClick={salvar}>Salvar Meta</button>
        <button className="btn-ghost">Cancelar</button>
      </div>
    </>
  )
}