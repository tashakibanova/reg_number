import { useState } from 'react'
import LoginScreen from './components/LoginScreen'
import MailingScreen from './components/MailingScreen'
import TemplateScreen from './components/TemplateScreen'
import HistoryScreen from './components/HistoryScreen'

const TABS = [
  { id: 'mailing', label: 'Рассылка' },
  { id: 'template', label: 'Шаблон письма' },
  { id: 'history', label: 'История' },
]

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin'

export default function App() {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem('tns_auth') === '1'
  )
  const [tab, setTab] = useState('mailing')

  function handleLogin(password) {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('tns_auth', '1')
      setAuthed(true)
      return true
    }
    return false
  }

  function handleLogout() {
    sessionStorage.removeItem('tns_auth')
    setAuthed(false)
  }

  if (!authed) {
    return <LoginScreen onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <h1 className="text-base font-bold text-gray-800 shrink-0">Track &amp; Send</h1>
          <nav className="flex gap-1 overflow-x-auto">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  tab === t.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-400 hover:text-gray-600 shrink-0"
          >
            Выйти
          </button>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-6">
        {tab === 'mailing' && <MailingScreen />}
        {tab === 'template' && <TemplateScreen />}
        {tab === 'history' && <HistoryScreen />}
      </main>
    </div>
  )
}
