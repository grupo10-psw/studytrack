import { useRef, useState } from 'react'
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
  return (h ? h + 'h ' : '') + (r ? r + 'min' : '')
}

function fdate(d) {
  if (!d) return '?'
  const [y, mo, dd] = d.split('-')
  return `${dd}/${mo}/${y}`
}

export default function TelaSessao() {
  const { materias, sessoes, metas, addSessao, updateSessao, deleteSessao } = useStore()

  const formRef = useRef(null)

  const [editId, setEditId] = useState(null)
  const [materiaId, setMateriaId] = useState('')
  const [data, setData] = useState(new Date().toISOString().split('T')[0])
  const [inicio, setInicio] = useState('14:00')
  const [fim, setFim] = useState('16:00')
  const [obs, setObs] = useState('')
  const [erros, setErros] = useState({})
  const [msg, setMsg] = useState(null)
  const [saving, setSaving] = useState(false)

  const durMin = calcMin(inicio, fim)
  const mat = materias.find((m) => m._id === materiaId)
  const metaAt = metas.find((mt) => mt.materiaId === materiaId)
  const horasJa = sessoes
    .filter((s) => s.materiaId === materiaId && s._id !== editId)
    .reduce((a, s) => a + Math.max(0, calcMin(s.inicio, s.fim) / 60), 0)

  const horasComAtual = horasJa + Math.max(0, durMin / 60)
  const pct = metaAt ? Math.min(100, Math.round((horasComAtual / metaAt.horas) * 100)) : 0

  function limparForm(resetMsg = false) {
    setEditId(null)
    setMateriaId('')
    setData(new Date().toISOString().split('T')[0])
    setInicio('14:00')
    setFim('16:00')
    setObs('')
    setErros({})
    if (resetMsg) setMsg(null)
  }

  function validar() {
    const e = {}
    if (!materiaId) e.materia = 'Selecione a matéria.'
    if (!data) e.data = 'Informe a data.'
    if (durMin <= 0) e.horario = 'Hora de fim deve ser após a de início.'
    return e
  }

  function editarSessao(s) {
    setEditId(s._id)
    setMateriaId(s.materiaId || '')
    setData(s.data || new Date().toISOString().split('T')[0])
    setInicio(s.inicio || '14:00')
    setFim(s.fim || '16:00')
    setObs(s.obs || '')
    setErros({})
    setMsg({ tipo: 'info', texto: '✏️ Editando sessão selecionada.' })

    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
  }

  async function salvar() {
    const e = validar()
    if (Object.keys(e).length) {
      setErros(e)
      return
    }

    setSaving(true)

    try {
      const payload = { materiaId, data, inicio, fim, obs }

      if (editId) {
        await updateSessao(editId, payload)
        setMsg({ tipo: 'success', texto: `✅ Sessão de ${fmtDur(durMin)} atualizada!` })
      } else {
        await addSessao(payload)
        setMsg({ tipo: 'success', texto: `✅ Sessão de ${fmtDur(durMin)} registrada!` })
      }

      limparForm()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {
      setMsg({ tipo: 'error', texto: '❌ Erro ao registrar. Tente novamente.' })
    } finally {
      setSaving(false)
      setTimeout(() => setMsg(null), 3500)
    }
  }

  async function remover(id) {
    if (!confirm('Remover esta sessão?')) return

    await deleteSessao(id)

    if (editId === id) {
      limparForm()
    }

    setMsg({ tipo: 'success', texto: '🗑️ Sessão removida.' })
    setTimeout(() => setMsg(null), 3000)
  }

  return (
    <>
      <nav className="navbar">
        <span className="navbar-title">⏱️ Sessões de Estudo</span>
      </nav>

      <div className="pad">
        {msg && <div className={`alert alert-${msg.tipo}`}>{msg.texto}</div>}

        {materias.length === 0 && (
          <div className="alert alert-info">
            ⚠️ Cadastre pelo menos uma matéria antes de registrar sessões.
          </div>
        )}

        {sessoes.length > 0 ? (
          <div className="card">
            <div className="card-title">Recentes ({sessoes.length})</div>

            {[...sessoes].reverse().slice(0, 5).map((s) => {
              const m = materias.find((x) => x._id === s.materiaId)
              if (!m) return null

              return (
                <div key={s._id} className="sess-item" style={{ flexWrap: 'wrap' }}>
                  <div className="dot" style={{ background: m.cor }} />

                  <div style={{ flex: 1 }}>
                    <div className="fw700 text-sm">{m.nome}</div>
                    <div className="text-xs text-muted">{fdate(s.data)} · {s.inicio}–{s.fim}</div>
                  </div>

                  <div className="fw800 text-primary text-sm" style={{ marginRight: 8 }}>
                    {fmtDur(calcMin(s.inicio, s.fim))}
                  </div>

                  <div className="row-actions" style={{ width: '100%', marginTop: 8 }}>
                    <button className="btn-mini edit" onClick={() => editarSessao(s)}>
                      Editar
                    </button>
                    <button className="btn-mini delete" onClick={() => remover(s._id)}>
                      Excluir
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">⏱️</div>
            <p>Nenhuma sessão registrada ainda.<br />Registre sua primeira sessão abaixo!</p>
          </div>
        )}

        <div ref={formRef}>
          {editId && (
            <div className="alert alert-info">
              ✏️ Modo edição ativo. Revise a sessão e clique em <strong>Atualizar</strong>.
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-title">{editId ? 'Editar Sessão' : 'Registrar Nova Sessão'}</div>

          <div className="form-group">
            <label className="lbl">Matéria <span className="req">*</span></label>
            <select
              value={materiaId}
              className={erros.materia ? 'error' : ''}
              onChange={(e) => {
                setMateriaId(e.target.value)
                setErros((v) => ({ ...v, materia: '' }))
              }}
            >
              <option value="">— Selecione —</option>
              {materias.map((m) => (
                <option key={m._id} value={m._id}>{m.nome}</option>
              ))}
            </select>
            {erros.materia && <div className="field-error">⚠ {erros.materia}</div>}
          </div>

          <div className="form-group">
            <label className="lbl">Data <span className="req">*</span></label>
            <input
              type="date"
              value={data}
              className={erros.data ? 'error' : ''}
              onChange={(e) => {
                setData(e.target.value)
                setErros((v) => ({ ...v, data: '' }))
              }}
            />
            {erros.data && <div className="field-error">⚠ {erros.data}</div>}
          </div>
        </div>

        <div className="card">
          <div className="card-title">Horário</div>

          <div className="row2 mb12">
            <div className="form-group">
              <label className="lbl">Início <span className="req">*</span></label>
              <input
                type="time"
                value={inicio}
                onChange={(e) => {
                  setInicio(e.target.value)
                  setErros((v) => ({ ...v, horario: '' }))
                }}
              />
            </div>

            <div className="form-group">
              <label className="lbl">Fim <span className="req">*</span></label>
              <input
                type="time"
                value={fim}
                onChange={(e) => {
                  setFim(e.target.value)
                  setErros((v) => ({ ...v, horario: '' }))
                }}
              />
            </div>
          </div>

          {erros.horario && <div className="field-error" style={{ marginBottom: 8 }}>⚠ {erros.horario}</div>}

          <div className={`dur-box ${durMin <= 0 ? 'invalid' : ''}`}>
            <div>
              <div
                style={{
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  color: durMin > 0 ? 'var(--primary)' : 'var(--warning)',
                }}
              >
                {durMin > 0 ? fmtDur(durMin) : 'Inválido'}
              </div>
              <div className="text-xs text-muted">duração calculada</div>
            </div>

            <span style={{ marginLeft: 'auto', fontSize: '1.3rem' }}>
              {durMin > 0 ? '✅' : '⚠️'}
            </span>
          </div>
        </div>

        {mat && metaAt && (
          <div className="card">
            <div className="card-title">Progresso da Meta Atual</div>

            <div className="prog-hint">
              <div className="text-xs text-muted mb6">
                {mat.nome} — meta {metaAt.periodo.toLowerCase()}: {metaAt.horas}h
              </div>

              <div className="prog-track">
                <div className="prog-fill" style={{ width: pct + '%', background: mat.cor }} />
              </div>

              <div className="flex-between">
                <small className="text-muted">{horasComAtual.toFixed(1)}h consideradas</small>
                <small className="fw800 text-primary">{pct}%</small>
              </div>
            </div>
          </div>
        )}

        <div className="card">
          <div className="card-title">Observações</div>
          <textarea
            value={obs}
            onChange={(e) => setObs(e.target.value)}
            rows={3}
            placeholder="Ex: Revisei integrais por substituição..."
          />
        </div>

        <button className="btn-primary" onClick={salvar} disabled={saving || materias.length === 0}>
          {saving
            ? <><span className="spinner" /> Salvando...</>
            : editId ? 'Atualizar Sessão' : '+ Registrar Sessão'}
        </button>

        <button className="btn-ghost" onClick={() => limparForm(true)}>
          {editId ? 'Cancelar edição' : 'Limpar'}
        </button>
      </div>
    </>
  )
}