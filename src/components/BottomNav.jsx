// src/components/BottomNav.jsx
export default function BottomNav({ tela, setTela }) {
  const items = [
    { key: 'materias',  icon: '📚', label: 'Matérias'  },
    { key: 'sessao',    icon: '⏱️', label: 'Sessões'   },
    { key: 'relatorio', icon: '📊', label: 'Progresso' },
    { key: 'meta',      icon: '🎯', label: 'Metas'     },
  ]
  return (
    <nav className="bottom-nav">
      {items.map((i) => (
        <button
          key={i.key}
          className={`nav-btn ${tela === i.key ? 'active' : ''}`}
          onClick={() => setTela(i.key)}
        >
          <span className="nav-icon">{i.icon}</span>
          {i.label}
        </button>
      ))}
    </nav>
  )
}