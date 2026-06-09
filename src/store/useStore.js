import { create } from 'zustand'

const API = 'http://localhost:3001'

async function getJson(url, options = {}) {
  const res = await fetch(url, options)

  if (!res.ok) {
    throw new Error('Erro na requisição')
  }

  if (res.status === 204) return null
  return await res.json()
}

const useStore = create((set) => ({
  materias: [],
  sessoes: [],
  metas: [],
  loading: false,
  error: null,

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

  // ── Matérias ─────────────────────────────
  addMateria: async (nova) => {
    const saved = await getJson(`${API}/materias`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nova),
    })

    set((s) => ({ materias: [...s.materias, saved] }))
    return saved
  },

  updateMateria: async (id, dados) => {
    const saved = await getJson(`${API}/materias/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    })

    set((s) => ({
      materias: s.materias.map((m) => (m._id === id ? saved : m)),
    }))

    return saved
  },

  deleteMateria: async (id) => {
    await getJson(`${API}/materias/${id}`, { method: 'DELETE' })

    set((s) => ({
      materias: s.materias.filter((m) => m._id !== id),
      sessoes: s.sessoes.filter((sessao) => sessao.materiaId !== id),
      metas: s.metas.filter((mt) => mt.materiaId !== id),
    }))
  },

  // ── Sessões ──────────────────────────────
  addSessao: async (nova) => {
    const saved = await getJson(`${API}/sessoes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nova),
    })

    set((s) => ({ sessoes: [saved, ...s.sessoes] }))
    return saved
  },

  updateSessao: async (id, dados) => {
    const saved = await getJson(`${API}/sessoes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    })

    set((s) => ({
      sessoes: s.sessoes.map((sessao) => (sessao._id === id ? saved : sessao)),
    }))

    return saved
  },

  deleteSessao: async (id) => {
    await getJson(`${API}/sessoes/${id}`, { method: 'DELETE' })

    set((s) => ({
      sessoes: s.sessoes.filter((x) => x._id !== id),
    }))
  },

  // ── Metas ────────────────────────────────
  addMeta: async (nova) => {
    const saved = await getJson(`${API}/metas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nova),
    })

    set((s) => ({ metas: [...s.metas, saved] }))
    return saved
  },

  updateMeta: async (id, dados) => {
    const saved = await getJson(`${API}/metas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    })

    set((s) => ({
      metas: s.metas.map((meta) => (meta._id === id ? saved : meta)),
    }))

    return saved
  },

  deleteMeta: async (id) => {
    await getJson(`${API}/metas/${id}`, { method: 'DELETE' })

    set((s) => ({
      metas: s.metas.filter((x) => x._id !== id),
    }))
  },
}))

export default useStore