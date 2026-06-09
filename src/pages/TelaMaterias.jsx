import { useRef, useState } from 'react'
import useStore from '../store/useStore'

const CORES = ['#3A6FD8', '#E84855', '#2DC653', '#F4A21B', '#9B59B6', '#1ABC9C', '#E67E22', '#EC407A']

export default function TelaMaterias() {
  const { materias, addMateria, updateMateria, deleteMateria } = useStore()

  const formRef = useRef(null)

  const [editId, setEditId] = useState(null)
  const [nome, setNome] = useState('')
  const [desc, setDesc] = useState('')
  const [cor, setCor] = useState(CORES[0])
  const [horas, setHoras] = useState(6)
  const [periodo, setPeriodo] = useState('Semana')
  const [erros, setErros] = useState({})
  const [msg, setMsg] = useState(null)
  const [saving, setSaving] = useState(false)

  function limparForm(resetMsg = false) {
    setEditId(null)
    setNome('')
    setDesc('')
    setCor(CORES[0])
    setHoras(6)
    setPeriodo('Semana')
    setErros({})
    if (resetMsg) setMsg(null)
  }

  function validar() {
    const e = {}
    if (!nome.trim()) e.nome = 'Informe o nome da matéria.'
    if (!horas || horas < 1) e.horas = 'Informe um valor válido.'
    return e
  }

  function editarMateria(m) {
    setEditId(m._id)
    setNome(m.nome || '')
    setDesc(m.desc || '')
    setCor(m.cor || CORES[0])
    setHoras(Number(m.horas || 1))
    setPeriodo(m.periodo || 'Semana')
    setErros({})
    setMsg({ tipo: 'info', texto: `✏️ Editando "${m.nome}".` })

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
      const payload = {
        nome: nome.trim(),
        cor,
        desc: desc.trim(),
        horas: +horas,
        periodo,
      }

      if (editId) {
        await updateMateria(editId, payload)
        setMsg({ tipo: 'success', texto: `✅ Matéria "${payload.nome}" atualizada!` })
      } else {
        await addMateria(payload)
        setMsg({ tipo: 'success', texto: `✅ Matéria "${payload.nome}" cadastrada!` })
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

  async function remover(id, nomeMat) {
    if (!confirm(`Remover "${nomeMat}" e todas as sessões/metas vinculadas?`)) return

    try {
      await deleteMateria(id)

      if (editId === id) {
        limparForm()
      }

      setMsg({ tipo: 'success', texto: `🗑️ "${nomeMat}" removida.` })
      setTimeout(() => setMsg(null), 3000)
    } catch {
      setMsg({ tipo: 'error', texto: '❌ Erro ao remover.' })
    }
  }

  return (
    <>
      <nav className="navbar">
        <span className="navbar-title">📚 Matérias</span>
      </nav>

      <div className="pad">
        {msg && (
          <div className={`alert alert-${msg.tipo}`}>{msg.texto}</div>
        )}

        {materias.length > 0 ? (
          <div className="card">
            <div className="card-title">Cadastradas ({materias.length})</div>

            {materias.map((m) => (
              <div key={m._id} className="mat-item" style={{ alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <div className="dot" style={{ background: m.cor, marginTop: 6 }} />

                <div style={{ flex: 1 }}>
                  <div className="fw700">{m.nome}</div>
                  {m.desc && <div className="text-xs text-muted">{m.desc}</div>}
                  <div className="text-xs text-primary fw700">{m.horas}h/{m.periodo}</div>
                </div>

                <div className="row-actions" style={{ width: '100%', marginTop: 8 }}>
                  <button className="btn-mini edit" onClick={() => editarMateria(m)}>
                    Editar
                  </button>
                  <button className="btn-mini delete" onClick={() => remover(m._id, m.nome)}>
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <p>Nenhuma matéria cadastrada.<br />Adicione sua primeira abaixo!</p>
          </div>
        )}

        <div ref={formRef}>
          {editId && (
            <div className="alert alert-info">
              ✏️ Modo edição ativo. Atualize os dados da matéria e clique em <strong>Atualizar</strong>.
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-title">{editId ? 'Editar Matéria' : 'Nova Matéria'}</div>

          <div className="form-group">
            <label className="lbl">Nome <span className="req">*</span></label>
            <input
              value={nome}
              onChange={(e) => {
                setNome(e.target.value)
                setErros((v) => ({ ...v, nome: '' }))
              }}
              placeholder="Ex: Cálculo II"
              className={erros.nome ? 'error' : ''}
            />
            {erros.nome && <div className="field-error">⚠ {erros.nome}</div>}
          </div>

          <div className="form-group">
            <label className="lbl">Descrição</label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={2}
              placeholder="Ex: Integrais, derivadas parciais..."
            />
          </div>
        </div>

        <div className="card">
          <div className="card-title">Cor de Identificação</div>

          <div className="color-picker">
            {CORES.map((c) => (
              <div
                key={c}
                className={`swatch ${cor === c ? 'sel' : ''}`}
                style={{ background: c }}
                onClick={() => setCor(c)}
              />
            ))}
          </div>

          <div className="preview">
            <div className="dot" style={{ background: cor, width: 16, height: 16 }} />
            <div>
              <div className="fw700 text-sm">{nome || 'Nova Matéria'}</div>
              <div className="text-xs text-muted">Pré-visualização</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-title">Carga Horária</div>

          <div className="row2">
            <div className="form-group">
              <label className="lbl">Horas <span className="req">*</span></label>
              <input
                type="number"
                value={horas}
                min={1}
                max={40}
                className={erros.horas ? 'error' : ''}
                onChange={(e) => {
                  setHoras(+e.target.value)
                  setErros((v) => ({ ...v, horas: '' }))
                }}
              />
              {erros.horas && <div className="field-error">⚠ {erros.horas}</div>}
            </div>

            <div className="form-group">
              <label className="lbl">Por período</label>
              <select value={periodo} onChange={(e) => setPeriodo(e.target.value)}>
                <option>Semana</option>
                <option>Mês</option>
                <option>Dia</option>
              </select>
            </div>
          </div>
        </div>

        <button className="btn-primary" onClick={salvar} disabled={saving}>
          {saving
            ? <><span className="spinner" /> Salvando...</>
            : editId ? 'Atualizar Matéria' : '+ Adicionar Matéria'}
        </button>

        <button className="btn-ghost" onClick={() => limparForm(true)}>
          {editId ? 'Cancelar edição' : 'Limpar formulário'}
        </button>
      </div>
    </>
  )
}