import { useState, useRef } from 'react'
import {
  getRows, saveRows,
  getTemplate, getSubject, saveSubject,
  addHistoryEntry,
} from '../utils/storage'
import { sendEmail } from '../utils/unisender'
import ConfirmDialog from './ConfirmDialog'

function createRow(init = {}) {
  return { id: Date.now() + Math.random(), tracking: '', email: '', status: 'idle', ...init }
}

const STATUS_ICON = { idle: '', pending: '⏳', sending: '⏳', sent: '✅', error: '❌' }

export default function MailingScreen() {
  const [rows, setRows] = useState(() => {
    const stored = getRows()
    return stored.length ? stored.map(r => ({ ...r, status: 'idle' })) : [createRow()]
  })
  const [subject, setSubject] = useState(getSubject)
  const [sending, setSending] = useState(false)
  const [progress, setProgress] = useState({ sent: 0, total: 0 })
  const [showConfirm, setShowConfirm] = useState(false)
  const fileInputRef = useRef(null)

  function persist(newRows) {
    setRows(newRows)
    saveRows(newRows.map(r => ({ ...r, status: 'idle' })))
  }

  function addRow() {
    persist([...rows, createRow()])
  }

  function updateRow(id, field, value) {
    persist(rows.map(r => (r.id === id ? { ...r, [field]: value } : r)))
  }

  function removeRow(id) {
    const filtered = rows.filter(r => r.id !== id)
    persist(filtered.length ? filtered : [createRow()])
  }

  function clearTable() {
    persist([createRow()])
  }

  function importCSV(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const lines = ev.target.result.split(/\r?\n/).filter(l => l.trim())
      const imported = lines
        .map(line => {
          const parts = line.split(/[,;]/)
          return createRow({
            tracking: (parts[0] || '').trim(),
            email: (parts[1] || '').trim(),
          })
        })
        .filter(r => r.tracking || r.email)
      if (imported.length) persist(imported)
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  async function doSend() {
    setShowConfirm(false)
    const valid = rows.filter(r => r.tracking.trim() && r.email.trim())
    if (!valid.length) return

    const template = getTemplate()
    saveSubject(subject)

    setSending(true)
    setProgress({ sent: 0, total: valid.length })

    setRows(prev =>
      prev.map(r => ({
        ...r,
        status: valid.some(v => v.id === r.id) ? 'pending' : r.status,
      }))
    )

    for (let i = 0; i < valid.length; i++) {
      const row = valid[i]

      setRows(prev => prev.map(r => (r.id === row.id ? { ...r, status: 'sending' } : r)))

      try {
        await sendEmail({
          trackingNumber: row.tracking,
          email: row.email,
          subject,
          htmlBody: template,
        })
        setRows(prev => prev.map(r => (r.id === row.id ? { ...r, status: 'sent' } : r)))
        addHistoryEntry({ tracking: row.tracking, email: row.email, subject, status: 'success' })
      } catch {
        setRows(prev => prev.map(r => (r.id === row.id ? { ...r, status: 'error' } : r)))
        addHistoryEntry({ tracking: row.tracking, email: row.email, subject, status: 'error' })
      }

      setProgress({ sent: i + 1, total: valid.length })

      if (i < valid.length - 1) {
        await new Promise(res => setTimeout(res, 500))
      }
    }

    setSending(false)
  }

  const validCount = rows.filter(r => r.tracking.trim() && r.email.trim()).length
  const pct = progress.total ? Math.round((progress.sent / progress.total) * 100) : 0

  return (
    <div className="flex flex-col gap-6">
      {showConfirm && (
        <ConfirmDialog
          message={`Отправить письма ${validCount} получател${validCount === 1 ? 'ю' : 'ям'}? Это действие нельзя отменить.`}
          onConfirm={doSend}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      {/* Subject */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">Тема письма</label>
        <input
          type="text"
          value={subject}
          onChange={e => { setSubject(e.target.value); saveSubject(e.target.value) }}
          disabled={sending}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-gray-50"
        />
      </div>

      {/* Recipients table */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
          <h2 className="font-semibold text-gray-800">
            Получатели{' '}
            <span className="text-sm font-normal text-gray-400">({rows.length})</span>
          </h2>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={addRow}
              disabled={sending}
              className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              + Добавить строку
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={sending}
              className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Импорт CSV
            </button>
            <button
              onClick={clearTable}
              disabled={sending}
              className="px-3 py-1.5 text-sm rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors"
            >
              Очистить таблицу
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.txt"
              onChange={importCSV}
              className="hidden"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left">
                <th className="pb-2 pr-3 text-gray-400 font-medium w-8">№</th>
                <th className="pb-2 pr-3 text-gray-500 font-medium">Трек-номер</th>
                <th className="pb-2 pr-3 text-gray-500 font-medium">Email</th>
                <th className="pb-2 pr-3 text-gray-500 font-medium text-center w-16">Статус</th>
                <th className="pb-2 w-6"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={row.id} className="border-b border-gray-100 last:border-0">
                  <td className="py-2 pr-3 text-gray-400 text-xs">{idx + 1}</td>
                  <td className="py-2 pr-3">
                    <input
                      type="text"
                      value={row.tracking}
                      onChange={e => updateRow(row.id, 'tracking', e.target.value)}
                      disabled={sending}
                      placeholder="RA000000000RU"
                      className="w-full border border-gray-200 rounded px-2 py-1 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-400 disabled:bg-gray-50"
                    />
                  </td>
                  <td className="py-2 pr-3">
                    <input
                      type="email"
                      value={row.email}
                      onChange={e => updateRow(row.id, 'email', e.target.value)}
                      disabled={sending}
                      placeholder="user@example.com"
                      className="w-full border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400 disabled:bg-gray-50"
                    />
                  </td>
                  <td className="py-2 pr-3 text-center text-base">
                    {STATUS_ICON[row.status] || <span className="text-gray-300">—</span>}
                  </td>
                  <td className="py-2">
                    <button
                      onClick={() => removeRow(row.id)}
                      disabled={sending}
                      title="Удалить строку"
                      className="text-gray-300 hover:text-red-400 disabled:opacity-30 leading-none text-lg"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Send panel */}
      <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-col gap-4">
        {sending && (
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Отправлено {progress.sent} из {progress.total}...</span>
              <span className="text-gray-400">{pct}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )}
        <button
          onClick={() => setShowConfirm(true)}
          disabled={sending || validCount === 0}
          className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-3 rounded-xl transition-colors text-base"
        >
          {sending
            ? `Отправка... (${progress.sent}/${progress.total})`
            : `Отправить всем (${validCount})`}
        </button>
        {validCount === 0 && !sending && (
          <p className="text-xs text-gray-400 text-center -mt-2">
            Заполните трек-номер и email хотя бы в одной строке
          </p>
        )}
      </div>
    </div>
  )
}
