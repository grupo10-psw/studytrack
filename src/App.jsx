import { useEffect, useState } from 'react'
import './App.css'

import useStore from './store/useStore'
import BottomNav from './components/BottomNav'
import AuthScreen from './components/AuthScreen'

import TelaMaterias from './pages/TelaMaterias'
import TelaSessao from './pages/TelaSessao'
import TelaMeta from './pages/TelaMeta'
import TelaRelatorio from './pages/TelaRelatorio'

export default function App() {
  const [tela, setTela] = useState('materias')

  const {
    user,
    loading,
    error,
    fetchAll,
    logout,
  } = useStore()

  useEffect(() => {
    if (user) {
      fetchAll()
    }
  }, [user, fetchAll])

  if (!user) {
    return <AuthScreen />
  }

  return (
    <div className="app">
      <header className="navbar">
        <div className="navbar-title">StudyTrack</div>
        <button className="navbar-action" onClick={logout}>
          Sair
        </button>
      </header>

      {loading && (
        <div className="loading-bar">
          <span className="spinner" />
          Carregando...
        </div>
      )}

      {error && <div className="error-bar">{error}</div>}

      {tela === 'materias' && <TelaMaterias />}
      {tela === 'sessao' && <TelaSessao />}
      {tela === 'meta' && <TelaMeta />}
      {tela === 'relatorio' && <TelaRelatorio />}

      <BottomNav tela={tela} setTela={setTela} />
    </div>
  )
}