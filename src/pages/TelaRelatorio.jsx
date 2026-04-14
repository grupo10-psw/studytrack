// src/pages/TelaRelatorio.jsx
import useStore from '../store/useStore'

function calcMin(a, b) {
  if (!a || !b) return 0
  const [ah, am] = a.split(':').map(Number)
  const [bh, bm] = b.split(':').map(Number)
  return (bh * 60 + bm) - (ah * 60 + am)
}

function fmtDur(m) {
  if (m <= 0) return '—'
  const h = Math.floor(m / 60)
  const r = m % 60
  return (h ? `${h}h ` : '') + (r ? `${r}min` : '')
}

function fdate(d) {
  if (!d) return '?'
  const [y, mo, dd] = d.split('-')
  return `${dd}/${mo}/${y}`
}

export default function TelaRelatorio() {
  const { materias, sessoes, metas } = useStore()

  function horasEst(mid) {
    return sessoes
      .filter((s) => String(s.materiaId) === String(mid))
      .reduce((a, s) => a + Math.max(0, calcMin(s.inicio, s.fim) / 60), 0)
  }

  const totalH = sessoes.reduce(
    (a, s) => a + Math.max(0, calcMin(s.inicio, s.fim) / 60),
    0
  )

  const ating = metas.filter((mt) => horasEst(mt.materiaId) >= mt.horas).length

  const pctGeral = metas.length
    ? Math.round(
        metas.reduce(
          (a, mt) =>
            a + Math.min(100, (horasEst(mt.materiaId) / mt.horas) * 100),
          0
        ) / metas.length
      )
    : 0

  const cards = materias.map((mat) => {
    const meta = metas.find((mt) => String(mt.materiaId) === String(mat.id))
    const he = horasEst(mat.id)
    const mh = meta?.horas || 0
    const p = mh ? Math.min(100, Math.round((he / mh) * 100)) : 0

    let statusClass = 'status-low'
    let statusText = 'Abaixo'

    if (p >= 100) {
      statusClass = 'status-ok'
      statusText = 'Atingida'
    } else if (p >= 50) {
      statusClass = 'status-mid'
      statusText = 'Em andamento'
    }

    return { mat, meta, he, mh, p, statusClass, statusText }
  })

  const recentes = [...sessoes]
    .map((s) => ({
      ...s,
      materia: materias.find((m) => String(m.id) === String(s.materiaId)),
    }))
    .filter((s) => s.materia)
    .reverse()
    .slice(0, 5)

  return (
    <>
      <nav className="navbar" style={{ justifyContent: 'space-between' }}>
        <span className="navbar-title">📊 Meu Progresso</span>
      </nav>

      <div className="pad">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-kpi">{totalH.toFixed(1)}h</div>
            <div className="stat-label">Total estudado</div>
          </div>

          <div className="stat-card">
            <div className="stat-kpi">{ating}/{metas.length}</div>
            <div className="stat-label">Metas atingidas</div>
          </div>

          <div className="stat-card">
            <div className="stat-kpi">{pctGeral}%</div>
            <div className="stat-label">Progresso geral</div>
          </div>
        </div>

        <div className="sec-title">Progresso por Matéria</div>

        <div className="progress-grid">
          {cards.map(({ mat, mh, he, p, statusClass, statusText }) => (
            <div key={mat.id} className="progress-card-modern">
              <div className="progress-head">
                <div>
                  <div className="progress-name">{mat.nome}</div>
                  <div className="progress-sub">
                    {mh ? `Meta: ${mh}h/${mat.periodo || 'Semana'}` : 'Sem meta definida'}
                  </div>
                </div>

                <div className="progress-hours">{he.toFixed(1)}h</div>
              </div>

              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${p}%`, background: mat.cor }}
                />
              </div>

              <div className="progress-foot">
                <span>{p}% concluído</span>
                <span className={`status-pill ${statusClass}`}>{statusText}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="sec-title" style={{ marginTop: 18 }}>Últimas Sessões</div>

        <div className="recent-card">
          {recentes.map((s) => (
            <div key={s.id} className="recent-row">
              <div className="dot" style={{ background: s.materia.cor }} />
              <div style={{ flex: 1 }}>
                <div className="fw700 text-sm">{s.materia.nome}</div>
                <div className="text-xs text-muted">
                  {fdate(s.data)} · {s.inicio}–{s.fim}
                </div>
              </div>
              <div className="fw800 text-primary text-sm">
                {fmtDur(calcMin(s.inicio, s.fim))}
              </div>
            </div>
          ))}

          {recentes.length === 0 && (
            <div className="empty-soft">Nenhuma sessão registrada ainda.</div>
          )}
        </div>
      </div>
    </>
  )
}