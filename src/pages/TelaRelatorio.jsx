// src/pages/TelaRelatorio.jsx
import useStore from '../store/useStore'

function calcMin(a, b) {
  if (!a || !b) return 0
  const [ah, am] = a.split(':').map(Number)
  const [bh, bm] = b.split(':').map(Number)
  return (bh * 60 + bm) - (ah * 60 + am)
}
function fmtDur(m) { if (m <= 0) return '—'; const h = Math.floor(m/60), r = m%60; return (h ? h+'h ' : '')+(r ? r+'min' : '') }
function fdate(d) { if (!d) return '?'; const [y,mo,dd] = d.split('-'); return `${dd}/${mo}/${y}` }

export default function TelaRelatorio() {
  const { materias, sessoes, metas } = useStore()

  function horasEst(mid) {
    return sessoes
      .filter((s) => s.materiaId === mid)
      .reduce((a, s) => a + Math.max(0, calcMin(s.inicio, s.fim) / 60), 0)
  }

  const totalH   = sessoes.reduce((a, s) => a + Math.max(0, calcMin(s.inicio, s.fim) / 60), 0)
  const ating    = metas.filter((mt) => horasEst(mt.materiaId) >= mt.horas).length
  const pctGeral = metas.length
    ? Math.round(metas.reduce((a, mt) => a + Math.min(100, horasEst(mt.materiaId) / mt.horas * 100), 0) / metas.length)
    : 0

  return (
    <>
      <nav className="navbar" style={{ justifyContent: 'space-between' }}>
        <span className="navbar-title">📊 Meu Progresso</span>
      </nav>
      <div className="pad">
        <div className="hero">
          <div className="hero-grid">
            <div style={{ textAlign: 'center' }}>
              <div className="hero-val">{totalH.toFixed(0)}h</div>
              <div className="hero-lbl">Total estudado</div>
            </div>
            <div className="hero-div" />
            <div style={{ textAlign: 'center' }}>
              <div className="hero-val">{ating}/{metas.length}</div>
              <div className="hero-lbl">Metas atingidas</div>
            </div>
            <div className="hero-div" />
            <div style={{ textAlign: 'center' }}>
              <div className="hero-val">{pctGeral}%</div>
              <div className="hero-lbl">Progresso geral</div>
            </div>
          </div>
        </div>

        <div className="sec-title">Progresso por Matéria</div>
        {materias.map((mat) => {
          const meta  = metas.find((mt) => mt.materiaId === mat.id)
          const he    = horasEst(mat.id)
          const mh    = meta?.horas || 0
          const p     = mh ? Math.min(100, Math.round(he / mh * 100)) : 0
          const sc    = p >= 100 ? 'ok' : p >= 50 ? 'mid' : 'low'
          const label = { ok: '✅ Atingida', mid: 'Em andamento', low: '⚠️ Abaixo' }[sc]
          return (
            <div key={mat.id} className="prog-card" style={{ borderColor: mat.cor }}>
              <div className="flex-between mb8">
                <span className="fw800">{mat.nome}</span>
                <div style={{ textAlign: 'right' }}>
                  <div className="fw900 text-primary">{he.toFixed(1)}h</div>
                  {mh > 0 && <div className="text-xs text-muted">meta: {mh}h</div>}
                </div>
              </div>
              {mh > 0 && (
                <>
                  <div className="prog-track">
                    <div className="prog-fill" style={{ width: p + '%', background: mat.cor }} />
                  </div>
                  <div className="flex-between">
                    <small>{p}% concluído</small>
                    <span className={`badge badge-${sc}`}>{label}</span>
                  </div>
                </>
              )}
            </div>
          )
        })}

        <div className="sec-title" style={{ marginTop: 4 }}>Últimas Sessões</div>
        {[...sessoes].reverse().slice(0, 5).map((s) => {
          const m = materias.find((x) => x.id === s.materiaId)
          if (!m) return null
          return (
            <div key={s.id} className="sess-item">
              <div className="dot" style={{ background: m.cor }} />
              <div style={{ flex: 1 }}>
                <div className="fw700 text-sm">{m.nome}</div>
                <div className="text-xs text-muted">{fdate(s.data)} · {s.inicio}–{s.fim}</div>
              </div>
              <div className="fw800 text-primary text-sm">{fmtDur(calcMin(s.inicio, s.fim))}</div>
            </div>
          )
        })}
        {sessoes.length === 0 && (
          <div style={{ textAlign: 'center', color: '#aaa', padding: '20px 0', fontSize: '.88rem' }}>
            Nenhuma sessão registrada ainda.
          </div>
        )}
      </div>
    </>
  )
}