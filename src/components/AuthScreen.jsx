import { useState } from 'react'
import useStore from '../store/useStore'
import './AuthScreen.css'

function EyeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 3l18 18" />
      <path d="M10.6 10.7A3 3 0 0 0 13.4 13.5" />
      <path d="M9.9 5.2A10.7 10.7 0 0 1 12 5c6.4 0 10 7 10 7a17.2 17.2 0 0 1-3.2 4.2" />
      <path d="M6.6 6.7C3.8 8.5 2 12 2 12a17.8 17.8 0 0 0 5.4 5.6" />
      <path d="M14.1 14.2A3 3 0 0 1 9.8 9.9" />
    </svg>
  )
}

export default function AuthScreen() {
  const { login, register, loading, authError } = useStore()

  const [mode, setMode] = useState('login')
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  })

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (mode === 'login') {
      await login({
        email: form.email,
        password: form.password,
      })
      return
    }

    await register({
      name: form.name,
      email: form.email,
      password: form.password,
    })
  }

  return (
    <main className="auth-layout">
      <section className="auth-panel">
        <div className="auth-card">
          <div className="auth-head">
            <div className="auth-badge">StudyTrack</div>
            <h1>{mode === 'login' ? 'Bem-vindo de volta' : 'Crie sua conta'}</h1>
            <p>
              {mode === 'login'
                ? 'Faça login para acessar suas matérias, metas e sessões.'
                : 'Cadastre-se para começar a organizar seus estudos.'}
            </p>
          </div>

          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
              onClick={() => setMode('login')}
            >
              Login
            </button>

            <button
              type="button"
              className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
              onClick={() => setMode('register')}
            >
              Cadastro
            </button>
          </div>

          {authError && <div className="auth-alert auth-alert-error">{authError}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            {mode === 'register' && (
              <div className="auth-form-group">
                <label className="auth-label">Nome</label>
                <input
                  className="auth-input"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Seu nome"
                  required
                />
              </div>
            )}

            <div className="auth-form-group">
              <label className="auth-label">E-mail</label>
              <input
                className="auth-input"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="voce@email.com"
                required
              />
            </div>

            <div className="auth-form-group">
              <label className="auth-label">Senha</label>

              <div className="auth-password-field">
                <input
                  className="auth-input"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Digite sua senha"
                  required
                />

                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading
                ? 'Carregando...'
                : mode === 'login'
                ? 'Entrar'
                : 'Criar conta'}
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}