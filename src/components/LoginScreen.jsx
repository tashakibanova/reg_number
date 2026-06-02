import { useState } from 'react'

export default function LoginScreen({ onLogin }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const ok = onLogin(password)
    if (!ok) {
      setError('Неверный пароль')
      setPassword('')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-800 mb-1 text-center">Track &amp; Send</h1>
        <p className="text-gray-500 text-sm text-center mb-6">Рассылка трек-номеров</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError('') }}
            placeholder="Пароль администратора"
            autoFocus
            className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          {error && (
            <p className="text-red-500 text-sm -mt-2">{error}</p>
          )}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium py-2.5 rounded-lg transition-colors"
          >
            Войти
          </button>
        </form>
      </div>
    </div>
  )
}
