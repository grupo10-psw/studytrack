import { useRef, useState } from 'react'
import useStore from '../store/useStore'

export default function TelaMeta() {
  const { materias, metas, addMeta, updateMeta, deleteMeta } = useStore()

  const formRef = useRef(null)

  const [editId, setEditId] = useState(null)
  const [materiaId, setMateriaId] = useState('')
  const [periodo, setPeriodo] = useState('Semanal')
  const [inicio, setInicio] = useState('2025-06-01')
  const [fim, setFim] = useState('2025-06-07')
  const [horas, setHoras] = useState(8)
  const [erros, setErros] = useState({})
  const [msg, setMsg] = useState(null)
  const [saving, setSaving] = useState(false)

  const pl = { Diário: 'hoje', Semanal: 'esta semana', Mensal: 'este mês' }
  const matSel = materias.find((m) => m._id === materiaId)
  const fdate = (d) => {
    if (!d) return '?'
    const [y, mo, dd] = d.split('-')
    return `${dd}/${mo}/${y}`
  }

  function limparForm(resetMsg = false) {
    setEditId(null)
    setMateriaId('')
    setPeriodo('Semanal')
    setInicio('2025-06-01')
    setFim('2025-06-07')
    setHoras(8)
    setErros({})
    if (resetMsg) setMsg(null)
  }

  function validar() {
    const e = {}
    if (!materiaId) e.materia = 'Selecione a matéria.'
    if (!horas || horas < 1) e.horas = 'Informe um valor válido.'
    if (!inicio) e.inicio = 'Informe a data de início.'
    if (!fim) e.fim = 'Informe a data de fim.'
    if (inicio && fim && inicio > fim) e.fim = 'Data de fim deve ser após o início.'
    return e
  }

  function editarMeta(mt) {
    setEditId(mt._id)
    setMateriaId(mt.materiaId || '')
    setPeriodo(mt.periodo || 'Semanal')
    setInicio(mt.inicio || '2025-06-01')
    setFim(mt.fim || '2025-06-07')
    setHoras(Number(mt.horas || 1))
    setErros({})
    setMsg({ tipo: 'info', texto: '✏️ Editando meta selecionada.' })

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
      const payload = { materiaId, horas: +horas, periodo, inicio, fim }

      if (editId) {
        await updateMeta(editId, payload)
        setMsg({ tipo: 'success', texto: `✅ Meta de ${horas}h atualizada!` })
      } else {
        await addMeta(payload)
        setMsg({ tipo: 'success', texto: `✅ Meta de ${horas}h salva para ${matSel?.nome || 'a matéria'}!` })
      }

      limparForm()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {
      setMsg({ tipo: 'error', texto: '❌ Erro ao salvar. Tente novamente.' })
    } finally {
      setSaving(false)
      setTimeout(() => setMsg(null), 3500)
    }
  }

  async function remover(id) {
    if (!confirm('Remover esta meta?')) return

    await deleteMeta(id)

    if (editId === id) {
      limparForm()
    }

    setMsg({ tipo: 'success', texto: '🗑️ Meta removida.' })
    setTimeout(() => setMsg(null), 3000)
  }

  return (
    <>
      <nav className="navbar">
        <span className="navbar-title">🎯 Metas de Estudo</span>
      </nav>

      <div className="pad">
        {msg && <div className={`alert alert-${msg.tipo}`}>{msg.texto}</div>}

        {materias.length === 0 && (
          <div className="alert alert-info">
            ⚠️ Cadastre pelo menos uma matéria antes de criar metas.
          </div>
        )}

        {metas.length > 0 && (
          <div className="card">
            <div className="card-title">Metas Ativas ({metas.length})</div>

            {metas.map((mt) => {
              const m = materias.find((x) => x._id === mt.materiaId)
              if (!m) return null

              return (
                <div key={mt._id} className="mat-item" style={{ alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  <div className="dot" style={{ background: m.cor, marginTop: 6 }} />

                  <div style={{ flex: 1 }}>
                    <div className="fw700 text-sm">{m.nome}</div>
                    <div className="text-xs text-muted">
                      {mt.horas}h · {mt.periodo} · {fdate(mt.inicio)}–{fdate(mt.fim)}
                    </div>
                  </div>

                  <div className="row-actions" style={{ width: '100%', marginTop: 8 }}>
                    <button className="btn-mini edit" onClick={() => editarMeta(mt)}>
                      Editar
                    </button>
                    <button className="btn-mini delete" onClick={() => remover(mt._id)}>
                      Excluir
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div ref={formRef}>
          {editId && (
            <div className="alert alert-info">
              ✏️ Modo edição ativo. Revise os dados da meta e clique em <strong>Atualizar</strong>.
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-title">{editId ? 'Editar Meta' : 'Nova Meta'}</div>

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
        </div>

        <div className="card">
          <div className="card-title">Período</div>

          <div className="period-tabs">
            {['Diário', 'Semanal', 'Mensal'].map((p) => (
              <button
                key={p}
                type="button"
                className={`period-tab ${periodo === p ? 'active' : ''}`}
                onClick={() => setPeriodo(p)}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="row2">
            <div className="form-group">
              <label className="lbl">Início <span className="req">*</span></label>
              <input
                type="date"
                value={inicio}
                className={erros.inicio ? 'error' : ''}
                onChange={(e) => {
                  setInicio(e.target.value)
                  setErros((v) => ({ ...v, inicio: '' }))
                }}
              />
              {erros.inicio && <div className="field-error">⚠ {erros.inicio}</div>}
            </div>

            <div className="form-group">
              <label className="lbl">Fim <span className="req">*</span></label>
              <input
                type="date"
                value={fim}
                className={erros.fim ? 'error' : ''}
                onChange={(e) => {
                  setFim(e.target.value)
                  setErros((v) => ({ ...v, fim: '' }))
                }}
              />
              {erros.fim && <div className="field-error">⚠ {erros.fim}</div>}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-title">Objetivo</div>

          <div className="form-group">
            <label className="lbl">Horas desejadas <span className="req">*</span></label>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input
                type="number"
                min={1}
                value={horas}
                className={erros.horas ? 'error' : ''}
                style={{
                  fontSize: '1.6rem',
                  fontWeight: 800,
                  color: 'var(--primary)',
                  textAlign: 'center',
                  background: '#EEF3FF',
                  borderColor: '#c2d0f5',
                }}
                onChange={(e) => {
                  setHoras(+e.target.value)
                  setErros((v) => ({ ...v, horas: '' }))
                }}
              />
              <span className="fw700 text-sub">horas</span>
            </div>

            {erros.horas && <div className="field-error">⚠ {erros.horas}</div>}

            {matSel && (
              <div className="field-hint">Meta sugerida: {matSel.horas}h/{matSel.periodo}</div>
            )}
          </div>
        </div>

        {matSel && (
          <div className="sum-card">
            <span style={{ fontSize: '2rem' }}>🎯</span>
            <div>
              <div className="fw800" style={{ fontSize: '1rem' }}>
                {matSel.nome} — {horas}h {pl[periodo] || ''}
              </div>
              <div style={{ fontSize: '.72rem', opacity: .85 }}>
                {fdate(inicio)} até {fdate(fim)}
              </div>
            </div>
          </div>
        )}

        <button className="btn-primary" onClick={salvar} disabled={saving || materias.length === 0}>
          {saving
            ? <><span className="spinner" /> Salvando...</>
            : editId ? 'Atualizar Meta' : '+ Criar Meta'}
        </button>

        <button className="btn-ghost" onClick={() => limparForm(true)}>
          {editId ? 'Cancelar edição' : 'Limpar'}
        </button>
      </div>
    </>
  )
}