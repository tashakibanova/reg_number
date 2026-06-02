import { useState } from 'react'
import { getHistory, clearHistory } from '../utils/storage'

export default function HistoryScreen() {
  const [history, setHistory] = useState(getHistory)

  function handleClear() {
    clearHistory()
    setHistory([])
  }

  const total = history.length
  const success = history.filter(h => h.status === 'success').length
  const errors = history.filter(h => h.status === 'error').length

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow-sm p-5 text-center">
          <p className="text-3xl font-bold text-gray-800">{total}</p>
          <p className="text-sm text-gray-500 mt-1">Всего</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-5 text-center">
          <p className="text-3xl font-bold text-green-600">{success}</p>
          <p className="text-sm text-gray-500 mt-1">Успешно</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-5 text-center">
          <p className="text-3xl font-bold text-red-500">{errors}</p>
          <p className="text-sm text-gray-500 mt-1">Ошибок</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-800">История отправок</h2>
          <button
            onClick={handleClear}
            disabled={history.length === 0}
            className="px-3 py-1.5 text-sm rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Очистить историю
          </button>
        </div>

        {history.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-10">История отправок пуста</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="pb-2 pr-3 text-gray-500 font-medium whitespace-nowrap">Дата</th>
                  <th className="pb-2 pr-3 text-gray-500 font-medium">Трек-номер</th>
                  <th className="pb-2 pr-3 text-gray-500 font-medium">Email</th>
                  <th className="pb-2 pr-3 text-gray-500 font-medium">Тема</th>
                  <th className="pb-2 text-gray-500 font-medium text-center w-16">Статус</th>
                </tr>
              </thead>
              <tbody>
                {history.map((entry, idx) => (
                  <tr key={idx} className="border-b border-gray-100 last:border-0">
                    <td className="py-2 pr-3 text-gray-400 text-xs whitespace-nowrap">
                      {new Date(entry.date).toLocaleString('ru-RU')}
                    </td>
                    <td className="py-2 pr-3 font-mono text-xs">{entry.tracking}</td>
                    <td className="py-2 pr-3 text-xs">{entry.email}</td>
                    <td className="py-2 pr-3 max-w-xs">
                      <span className="block truncate text-gray-600 text-xs" title={entry.subject}>
                        {entry.subject}
                      </span>
                    </td>
                    <td className="py-2 text-center text-base">
                      {entry.status === 'success' ? '✅' : '❌'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
