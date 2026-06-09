import { create } from 'zustand'

const API = 'http://localhost:3001'

async function request(path, options = {}, token = null) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(`${API}${path}`, {
    ...options,
    headers,
  })

  if (!res.ok) {
    let message = 'Erro na requisição'

    try {
      const err = await res.json()
      message = err.error || message
    } catch {}

    throw new Error(message)
  }

  if (res.status === 204) return null
  return await res.json()
}

const useStore = create((set, get) => ({
  user: null,
  token: null,

  materias: [],
  sessoes: [],
  metas: [],

  loading: false,
  error: null,
  authError: null,

  register: async ({ name, email, password }) => {
    set({ loading: true, authError: null })

    try {
      const data = await request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      })

      set({
        user: data.user,
        token: data.token,
        loading: false,
      })

      await get().fetchAll()
    } catch (err) {
      set({ authError: err.message, loading: false })
    }
  },

  login: async ({ email, password }) => {
    set({ loading: true, authError: null })

    try {
      const data = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })

      set({
        user: data.user,
        token: data.token,
        loading: false,
      })

      await get().fetchAll()
    } catch (err) {
      set({ authError: err.message, loading: false })
    }
  },

  logout: () => {
    set({
      user: null,
      token: null,
      materias: [],
      sessoes: [],
      metas: [],
      error: null,
      authError: null,
    })
  },

  fetchAll: async () => {
    const { token } = get()

    if (!token) return

    set({ loading: true, error: null })

    try {
      const [materias, sessoes, metas] = await Promise.all([
        request('/materias', {}, token),
        request('/sessoes', {}, token),
        request('/metas', {}, token),
      ])

      set({ materias, sessoes, metas, loading: false })
    } catch (err) {
      set({ error: err.message, loading: false })
    }
  },

  addMateria: async (nova) => {
    const { token } = get()
    const saved = await request('/materias', {
      method: 'POST',
      body: JSON.stringify(nova),
    }, token)

    set((s) => ({ materias: [...s.materias, saved] }))
    return saved
  },

  updateMateria: async (id, dados) => {
    const { token } = get()
    const saved = await request(`/materias/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dados),
    }, token)

    set((s) => ({
      materias: s.materias.map((m) => (m._id === id ? saved : m)),
    }))

    return saved
  },

  deleteMateria: async (id) => {
    const { token } = get()
    await request(`/materias/${id}`, { method: 'DELETE' }, token)

    set((s) => ({
      materias: s.materias.filter((m) => m._id !== id),
      sessoes: s.sessoes.filter((sessao) => sessao.materiaId !== id),
      metas: s.metas.filter((meta) => meta.materiaId !== id),
    }))
  },

  addSessao: async (nova) => {
    const { token } = get()
    const saved = await request('/sessoes', {
      method: 'POST',
      body: JSON.stringify(nova),
    }, token)

    set((s) => ({ sessoes: [saved, ...s.sessoes] }))
    return saved
  },

  updateSessao: async (id, dados) => {
    const { token } = get()
    const saved = await request(`/sessoes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dados),
    }, token)

    set((s) => ({
      sessoes: s.sessoes.map((sessao) => (sessao._id === id ? saved : sessao)),
    }))

    return saved
  },

  deleteSessao: async (id) => {
    const { token } = get()
    await request(`/sessoes/${id}`, { method: 'DELETE' }, token)

    set((s) => ({
      sessoes: s.sessoes.filter((x) => x._id !== id),
    }))
  },

  addMeta: async (nova) => {
    const { token } = get()
    const saved = await request('/metas', {
      method: 'POST',
      body: JSON.stringify(nova),
    }, token)

    set((s) => ({ metas: [...s.metas, saved] }))
    return saved
  },

  updateMeta: async (id, dados) => {
    const { token } = get()
    const saved = await request(`/metas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dados),
    }, token)

    set((s) => ({
      metas: s.metas.map((meta) => (meta._id === id ? saved : meta)),
    }))

    return saved
  },

  deleteMeta: async (id) => {
    const { token } = get()
    await request(`/metas/${id}`, { method: 'DELETE' }, token)

    set((s) => ({
      metas: s.metas.filter((x) => x._id !== id),
    }))
  },
}))

export default useStore