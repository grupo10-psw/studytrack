export default function BottomNav({ tela, setTela }) {
  const items = [
    { id: 'materias', label: 'Matérias', icon: '📚' },
    { id: 'sessao', label: 'Sessões', icon: '⏱️' },
    { id: 'meta', label: 'Metas', icon: '🎯' },
    { id: 'relatorio', label: 'Progresso', icon: '📊' },
  ]

  return (
    <nav className="bottom-nav" aria-label="Navegação principal">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`nav-btn ${tela === item.id ? 'active' : ''}`}
          onClick={() => setTela(item.id)}
          aria-label={item.label}
          aria-current={tela === item.id ? 'page' : undefined}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  )
}