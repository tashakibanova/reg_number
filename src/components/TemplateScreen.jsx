import { useState } from 'react'
import { getTemplate, saveTemplate } from '../utils/storage'

export default function TemplateScreen() {
  const [template, setTemplate] = useState(getTemplate)
  const [saved, setSaved] = useState(false)

  function handleSave() {
    saveTemplate(template)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <div className="flex items-start justify-between mb-4 gap-4 flex-wrap">
          <div>
            <h2 className="font-semibold text-gray-800">HTML-шаблон письма</h2>
            <p className="text-xs text-gray-400 mt-1">
              Плейсхолдеры:{' '}
              <code className="bg-gray-100 px-1 rounded">{'{{'}<span>tracking_number</span>{'}}'}</code>
              {' и '}
              <code className="bg-gray-100 px-1 rounded">{'{{'}<span>email</span>{'}}'}</code>
            </p>
          </div>
          <button
            onClick={handleSave}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors shrink-0 ${
              saved
                ? 'bg-green-100 text-green-700 border border-green-300'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {saved ? '✓ Сохранено' : 'Сохранить шаблон'}
          </button>
        </div>
        <textarea
          value={template}
          onChange={e => setTemplate(e.target.value)}
          rows={18}
          spellCheck={false}
          className="w-full font-mono text-xs border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y leading-relaxed"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-5">
        <h2 className="font-semibold text-gray-800 mb-4">Предпросмотр</h2>
        <div className="border border-gray-200 rounded-xl overflow-hidden" style={{ height: 420 }}>
          <iframe
            srcDoc={template}
            title="Предпросмотр шаблона"
            className="w-full h-full"
            sandbox="allow-same-origin"
          />
        </div>
      </div>
    </div>
  )
}
