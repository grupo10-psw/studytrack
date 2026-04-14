// src/store/useStore.js
// Estado global com Zustand — substitui Redux
import { create } from 'zustand'

const API = 'http://localhost:3001'

const useStore = create((set) => ({
  materias: [],
  sessoes: [],
  metas: [],
  loading: false,
  error: null,

  fetchAll: async () => {
    set({ loading: true, error: null })
    try {
      const [mRes, sRes, mtRes] = await Promise.all([
        fetch(`${API}/materias`),
        fetch(`${API}/sessoes`),
        fetch(`${API}/metas`),
      ])
      const [materias, sessoes, metas] = await Promise.all([
        mRes.json(),
        sRes.json(),
        mtRes.json(),
      ])
      set({ materias, sessoes, metas, loading: false })
    } catch (e) {
      set({ error: 'Erro ao conectar com o servidor.', loading: false })
    }
  },

  fetchMaterias: async () => {
    const res = await fetch(`${API}/materias`)
    const materias = await res.json()
    set({ materias })
  },

  fetchSessoes: async () => {
    const res = await fetch(`${API}/sessoes`)
    const sessoes = await res.json()
    set({ sessoes })
  },

  fetchMetas: async () => {
    const res = await fetch(`${API}/metas`)
    const metas = await res.json()
    set({ metas })
  },

  addMateria: async (novaMateria) => {
    const res = await fetch(`${API}/materias`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novaMateria),
    })
    const saved = await res.json()
    set((state) => ({ materias: [...state.materias, saved] }))
  },

  addSessao: async (novaSessao) => {
    const res = await fetch(`${API}/sessoes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novaSessao),
    })
    const saved = await res.json()
    set((state) => ({ sessoes: [...state.sessoes, saved] }))
  },

  addMeta: async (novaMeta) => {
    const res = await fetch(`${API}/metas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novaMeta),
    })
    const saved = await res.json()
    set((state) => ({ metas: [...state.metas, saved] }))
  },
}))

export default useStore