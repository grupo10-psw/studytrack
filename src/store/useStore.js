// src/store/useStore.js
import { create } from 'zustand'

const API = 'http://localhost:3001'
const sameId = (a, b) => String(a) === String(b)

async function getJson(url, options) {
  const res = await fetch(url, options)
  if (!res.ok) throw new Error('Erro na requisição')
  return res.status === 204 ? null : res.json()
}

const useStore = create((set, get) => ({
  materias: [],
  sessoes: [],
  metas: [],
  loading: false,
  error: null,

  // ─── CARREGAR TUDO ───────────────────────────────────────────────
  fetchAll: async () => {
    set({ loading: true, error: null })
    try {
      const [materias, sessoes, metas] = await Promise.all([
        getJson(`${API}/materias`),
        getJson(`${API}/sessoes`),
        getJson(`${API}/metas`),
      ])
      set({ materias, sessoes, metas, loading: false })
    } catch {
      set({ error: 'Erro ao conectar com o servidor.', loading: false })
    }
  },

  // ─── MATÉRIAS ────────────────────────────────────────────────────
  addMateria: async (novaMateria) => {
    const saved = await getJson(`${API}/materias`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novaMateria),
    })
    set((state) => ({ materias: [...state.materias, saved] }))
  },

  updateMateria: async (id, payload) => {
    const saved = await getJson(`${API}/materias/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    set((state) => ({
      materias: state.materias.map((m) => (sameId(m.id, id) ? saved : m)),
    }))
  },

  deleteMateria: async (id) => {
    const { sessoes, metas } = get()

    const sessoesRelacionadas = sessoes.filter((s) => sameId(s.materiaId, id))
    const metasRelacionadas   = metas.filter((m) => sameId(m.materiaId, id))

    await Promise.all([
      ...sessoesRelacionadas.map((s) =>
        fetch(`${API}/sessoes/${s.id}`, { method: 'DELETE' })
      ),
      ...metasRelacionadas.map((m) =>
        fetch(`${API}/metas/${m.id}`, { method: 'DELETE' })
      ),
      fetch(`${API}/materias/${id}`, { method: 'DELETE' }),
    ])

    set((state) => ({
      materias: state.materias.filter((m) => !sameId(m.id, id)),
      sessoes:  state.sessoes.filter((s) => !sameId(s.materiaId, id)),
      metas:    state.metas.filter((m) => !sameId(m.materiaId, id)),
    }))
  },

  // ─── SESSÕES ─────────────────────────────────────────────────────
  addSessao: async (novaSessao) => {
    const saved = await getJson(`${API}/sessoes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novaSessao),
    })
    set((state) => ({ sessoes: [...state.sessoes, saved] }))
  },

  updateSessao: async (id, payload) => {
    const saved = await getJson(`${API}/sessoes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    set((state) => ({
      sessoes: state.sessoes.map((s) => (sameId(s.id, id) ? saved : s)),
    }))
  },

  deleteSessao: async (id) => {
    await fetch(`${API}/sessoes/${id}`, { method: 'DELETE' })
    set((state) => ({
      sessoes: state.sessoes.filter((s) => !sameId(s.id, id)),
    }))
  },

  // ─── METAS ───────────────────────────────────────────────────────
  addMeta: async (novaMeta) => {
    const saved = await getJson(`${API}/metas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novaMeta),
    })
    set((state) => ({ metas: [...state.metas, saved] }))
  },

  updateMeta: async (id, payload) => {
    const saved = await getJson(`${API}/metas/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    set((state) => ({
      metas: state.metas.map((m) => (sameId(m.id, id) ? saved : m)),
    }))
  },

  deleteMeta: async (id) => {
    await fetch(`${API}/metas/${id}`, { method: 'DELETE' })
    set((state) => ({
      metas: state.metas.filter((m) => !sameId(m.id, id)),
    }))
  },
}))

export default useStore