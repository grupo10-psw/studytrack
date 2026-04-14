// src/pages/TelaMaterias.jsx
import { useState } from 'react'
import useStore from '../store/useStore'

export default function TelaMaterias() {
  const { materias, addMateria, updateMateria, deleteMateria } = useStore()

  const [editId, setEditId] = useState(null)
  const [nome, setNome] = useState('')
  const [desc, setDesc] = useState('')
  const [cor, setCor] = useState('#3A6FD8')
  const [horas, setHoras] = useState(6)
  const [periodo, setPeriodo] = useState('Semana')
  const [msg, setMsg] = useState('')

  function limparForm(resetMsg = true) {
    setEditId(null)
    setNome('')
    setDesc('')
    setCor('#3A6FD8')
    setHoras(6)
    setPeriodo('Semana')
    if (resetMsg) setMsg('')
  }

  function editarMateria(m) {
    setEditId(m.id)
    setNome(m.nome || '')
    setDesc(m.desc || '')
    setCor(m.cor || '#3A6FD8')
    setHoras(Number(m.horas || 1))
    setPeriodo(m.periodo || 'Semana')
    setMsg('✏️ Editando matéria...')
  }

  async function excluirMateria(id) {
    if (!window.confirm('Excluir esta matéria? Isso também removerá metas e sessões relacionadas.')) return
    await deleteMateria(id)
    if (String(editId) === String(id)) limparForm(false)
    setMsg('🗑️ Matéria excluída com sucesso!')
    setTimeout(() => setMsg(''), 3000)
  }

  async function salvar() {
    if (!nome.trim()) {
      setMsg('⚠️ Informe o nome da matéria.')
      return
    }

    const payload = {
      nome: nome.trim(),
      desc: desc.trim(),
      cor,
      horas: Number(horas),
      periodo,
    }

    if (editId) {
      await updateMateria(editId, payload)
      limparForm(false)
      setMsg('✅ Matéria atualizada com sucesso!')
    } else {
      await addMateria(payload)
      limparForm(false)
      setMsg('✅ Matéria salva com sucesso!')
    }

    setTimeout(() => setMsg(''), 3000)
  }

  return (
    <>
      <nav className="navbar">
        <span className="navbar-title">📚 Nova Matéria</span>
      </nav>

      <div className="pad">
        {materias.length > 0 && (
          <div className="card">
            <div className="card-title">Matérias Cadastradas</div>

            {materias.map((m) => (
              <div key={m.id} className="mat-item" style={{ alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <div className="dot" style={{ background: m.cor, marginTop: 6 }} />

                <div style={{ flex: 1 }}>
                  <div className="fw700 text-sm">{m.nome}</div>
                  <div className="text-xs text-muted">{m.desc || 'Sem descrição'}</div>
                </div>

                <div className="fw800 text-primary text-sm">
                  {m.horas}h/{m.periodo}
                </div>

                <div className="row-actions" style={{ width: '100%', marginTop: 8 }}>
                  <button className="btn-mini edit" onClick={() => editarMateria(m)}>
                    Editar
                  </button>
                  <button className="btn-mini delete" onClick={() => excluirMateria(m.id)}>
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="card">
          <div className="card-title">Informações da Matéria</div>

          <label className="lbl">Nome <span className="req">*</span></label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Cálculo II"
            className="mb10"
          />

          <label className="lbl">Descrição</label>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={3}
            placeholder="Ex: Integrais, derivadas parciais..."
          />
        </div>

        <div className="card">
          <div className="card-title">Cor de Identificação</div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <input
              type="color"
              value={cor}
              onChange={(e) => setCor(e.target.value)}
              style={{
                width: 52,
                height: 40,
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
              }}
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                className="dot"
                style={{
                  width: 14,
                  height: 14,
                  background: cor,
                }}
              />
              <div>
                <div className="fw700 text-sm">{nome || 'Nova Matéria'}</div>
                <div className="text-xs text-muted">Pré-visualização</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-title">Carga Horária Esperada</div>

          <label className="lbl">Horas <span className="req">*</span></label>
          <input
            type="number"
            min={1}
            value={horas}
            onChange={(e) => setHoras(Number(e.target.value))}
            className="mb10"
          />

          <label className="lbl">Período</label>
          <select value={periodo} onChange={(e) => setPeriodo(e.target.value)}>
            <option value="Semana">Semana</option>
            <option value="Mês">Mês</option>
            <option value="Dia">Dia</option>
          </select>
        </div>

        {msg && <div className="alert">{msg}</div>}

        <button className="btn-primary" onClick={salvar}>
          {editId ? 'Atualizar Matéria' : 'Salvar Matéria'}
        </button>

        <button className="btn-ghost" onClick={() => limparForm()}>
          Limpar
        </button>
      </div>
    </>
  )
}