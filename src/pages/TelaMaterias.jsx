// src/pages/TelaMaterias.jsx
import { useState } from 'react'
import useStore from '../store/useStore'

const CORES = ['#3A6FD8','#E84855','#2DC653','#F4A21B','#9B59B6','#1ABC9C','#E67E22','#EC407A']

export default function TelaMaterias() {
  const { materias, addMateria } = useStore()

  const [nome,    setNome]    = useState('')
  const [desc,    setDesc]    = useState('')
  const [cor,     setCor]     = useState(CORES[0])
  const [horas,   setHoras]   = useState(6)
  const [periodo, setPeriodo] = useState('Semana')
  const [msg,     setMsg]     = useState('')

  async function salvar() {
    if (!nome.trim()) { setMsg('⚠️ Informe o nome da matéria.'); return }
    await addMateria({ nome: nome.trim(), cor, desc, horas, periodo })
    setMsg(`✅ Matéria "${nome}" salva!`)
    setNome(''); setDesc(''); setCor(CORES[0]); setHoras(6)
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
              <div key={m.id} className="mat-item">
                <div className="dot" style={{ background: m.cor }} />
                <div style={{ flex: 1 }}>
                  <div className="fw700">{m.nome}</div>
                  {m.desc && <div className="text-sm text-muted">{m.desc}</div>}
                </div>
                <div className="text-xs text-primary fw700">{m.horas}h/{m.periodo}</div>
              </div>
            ))}
          </div>
        )}

        <div className="card">
          <div className="card-title">Informações da Matéria</div>
          <label className="lbl">Nome <span className="req">*</span></label>
          <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Cálculo II" className="mb10" />
          <label className="lbl">Descrição</label>
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={2} placeholder="Ex: Integrais, derivadas..." />
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
          <div className="card-title">Carga Horária Esperada</div>
          <div className="row2">
            <div>
              <label className="lbl">Horas <span className="req">*</span></label>
              <input type="number" value={horas} min={1} max={40} onChange={(e) => setHoras(+e.target.value)} />
            </div>
            <div>
              <label className="lbl">Por período</label>
              <select value={periodo} onChange={(e) => setPeriodo(e.target.value)}>
                <option>Semana</option>
                <option>Mês</option>
                <option>Dia</option>
              </select>
            </div>
          </div>
        </div>

        {msg && <div className="alert">{msg}</div>}
        <button className="btn-primary" onClick={salvar}>Salvar Matéria</button>
        <button className="btn-ghost" onClick={() => { setNome(''); setDesc(''); setCor(CORES[0]); }}>Limpar</button>
      </div>
    </>
  )
}