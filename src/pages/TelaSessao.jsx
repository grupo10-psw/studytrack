// src/pages/TelaSessao.jsx
import { useState } from 'react'
import useStore from '../store/useStore'

function calcMin(a, b) {
  if (!a || !b) return 0
  const [ah, am] = a.split(':').map(Number)
  const [bh, bm] = b.split(':').map(Number)
  return (bh * 60 + bm) - (ah * 60 + am)
}
function fmtDur(m) {
  if (m <= 0) return '—'
  const h = Math.floor(m / 60), r = m % 60
  return (h ? h + 'h ' : '') + (r ? r + 'min' : '')
}
function fdate(d) { if (!d) return '?'; const [y,mo,dd] = d.split('-'); return `${dd}/${mo}/${y}` }

export default function TelaSessao() {
  const { materias, sessoes, metas, addSessao } = useStore()

  const [materiaId, setMateriaId] = useState('')
  const [data,      setData]      = useState('2025-06-03')
  const [inicio,    setInicio]    = useState('14:00')
  const [fim,       setFim]       = useState('16:30')
  const [obs,       setObs]       = useState('')
  const [msg,       setMsg]       = useState('')

  const durMin  = calcMin(inicio, fim)
  const mat     = materias.find((m) => m.id === +materiaId)
  const metaAt  = metas.find((mt) => mt.materiaId === +materiaId)
  const horasJa = sessoes
    .filter((s) => s.materiaId === +materiaId)
    .reduce((a, s) => a + Math.max(0, calcMin(s.inicio, s.fim) / 60), 0)
  const pct = metaAt ? Math.min(100, Math.round((horasJa / metaAt.horas) * 100)) : 0

  async function salvar() {
    if (!materiaId) { setMsg('⚠️ Selecione a matéria.'); return }
    if (durMin <= 0) { setMsg('⚠️ Horário inválido.'); return }
    await addSessao({ materiaId: +materiaId, data, inicio, fim, obs })
    setMsg('✅ Sessão registrada com sucesso!')
    setTimeout(() => setMsg(''), 3000)
  }

  return (
    <>
      <nav className="navbar">
        <span className="navbar-title">⏱️ Nova Sessão de Estudo</span>
      </nav>
      <div className="pad">
        {sessoes.length > 0 && (
          <div className="card">
            <div className="card-title">Sessões Recentes</div>
            {[...sessoes].reverse().slice(0, 3).map((s) => {
              const m = materias.find((x) => x.id === s.materiaId)
              if (!m) return null
              return (
                <div key={s.id} className="mat-item">
                  <div className="dot" style={{ background: m.cor }} />
                  <div style={{ flex: 1 }}>
                    <div className="fw700 text-sm">{m.nome}</div>
                    <div className="text-xs text-muted">{fdate(s.data)} · {s.inicio}–{s.fim}</div>
                  </div>
                  <div className="fw800 text-primary text-sm">{fmtDur(calcMin(s.inicio, s.fim))}</div>
                </div>
              )
            })}
          </div>
        )}

        <div className="card">
          <div className="card-title">Matéria e Data</div>
          <label className="lbl">Matéria Estudada <span className="req">*</span></label>
          <select value={materiaId} onChange={(e) => setMateriaId(e.target.value)} className="mb10">
            <option value="">— Selecione —</option>
            {materias.map((m) => <option key={m.id} value={m.id}>{m.nome}</option>)}
          </select>
          <label className="lbl">Data da Sessão <span className="req">*</span></label>
          <input type="date" value={data} onChange={(e) => setData(e.target.value)} />
        </div>

        <div className="card">
          <div className="card-title">Horário</div>
          <div className="row2 mb12">
            <div>
              <label className="lbl">Início <span className="req">*</span></label>
              <input type="time" value={inicio} onChange={(e) => setInicio(e.target.value)} />
            </div>
            <div>
              <label className="lbl">Fim <span className="req">*</span></label>
              <input type="time" value={fim} onChange={(e) => setFim(e.target.value)} />
            </div>
          </div>
          <div className="dur-box">
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>{durMin > 0 ? fmtDur(durMin) : 'Inválido'}</div>
              <div className="text-xs text-muted">duração calculada</div>
            </div>
            <span style={{ marginLeft: 'auto', fontSize: '1.3rem' }}>{durMin > 0 ? '✅' : '⚠️'}</span>
          </div>
        </div>

        {mat && metaAt && (
          <div className="card">
            <div className="card-title">Progresso da Meta Atual</div>
            <div className="prog-hint">
              <div className="text-xs text-muted mb6">{mat.nome} — meta {metaAt.periodo.toLowerCase()}: {metaAt.horas}h</div>
              <div className="prog-track">
                <div className="prog-fill" style={{ width: pct + '%', background: mat.cor }} />
              </div>
              <div className="flex-between">
                <small>{horasJa.toFixed(1)}h estudadas</small>
                <small className="fw800 text-primary">{pct}%</small>
              </div>
            </div>
          </div>
        )}

        <div className="card">
          <div className="card-title">Observações</div>
          <textarea value={obs} onChange={(e) => setObs(e.target.value)} rows={3} placeholder="Ex: Revisei integrais por substituição..." />
        </div>

        {msg && <div className="alert">{msg}</div>}
        <button className="btn-primary" onClick={salvar}>Registrar Sessão</button>
        <button className="btn-ghost">Cancelar</button>
      </div>
    </>
  )
}