// src/App.jsx
import { useState, useEffect } from 'react'
import useStore from './store/useStore'
import TelaMaterias from './pages/TelaMaterias'
import TelaMeta from './pages/TelaMeta'
import TelaSessao from './pages/TelaSessao'
import TelaRelatorio from './pages/TelaRelatorio'
import BottomNav from './components/BottomNav'
import './App.css'

export default function App() {
  const [tela, setTela] = useState('relatorio')
  const { fetchAll, loading, error } = useStore()

  useEffect(() => {
    fetchAll()
  }, [])

  return (
    <div className="app">
      {loading && (
        <div className="loading-bar">Carregando dados…</div>
      )}
      {error && (
        <div className="error-bar">{error} — verifique se o json-server está rodando.</div>
      )}

      {tela === 'materias'  && <TelaMaterias />}
      {tela === 'meta'      && <TelaMeta />}
      {tela === 'sessao'    && <TelaSessao />}
      {tela === 'relatorio' && <TelaRelatorio />}

      <BottomNav tela={tela} setTela={setTela} />
    </div>
  )
}