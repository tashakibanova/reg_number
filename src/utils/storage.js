const KEYS = {
  ROWS: 'tns_rows',
  TEMPLATE: 'tns_template',
  SUBJECT: 'tns_subject',
  HISTORY: 'tns_history',
}

const DEFAULT_TEMPLATE = `<!DOCTYPE html>
<html lang="ru">
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
  <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">
    Информация о вашем заказе
  </h2>
  <p>Уважаемый получатель,</p>
  <p>Ваш трек-номер отправления:</p>
  <div style="background: #f4f4f4; border-left: 4px solid #3498db; padding: 12px 16px; margin: 16px 0; font-size: 18px; font-family: monospace; letter-spacing: 1px;">
    {{tracking_number}}
  </div>
  <p>Для отслеживания посылки воспользуйтесь официальным сайтом почтовой службы.</p>
  <p style="margin-top: 32px;">С уважением,<br/><strong>Служба доставки</strong></p>
  <hr style="border: none; border-top: 1px solid #eee; margin-top: 32px;" />
  <p style="font-size: 11px; color: #999;">Это письмо отправлено на адрес {{email}}</p>
</body>
</html>`

export function getRows() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.ROWS)) || []
  } catch {
    return []
  }
}

export function saveRows(rows) {
  localStorage.setItem(KEYS.ROWS, JSON.stringify(rows))
}

export function getTemplate() {
  return localStorage.getItem(KEYS.TEMPLATE) || DEFAULT_TEMPLATE
}

export function saveTemplate(tpl) {
  localStorage.setItem(KEYS.TEMPLATE, tpl)
}

export function getSubject() {
  return localStorage.getItem(KEYS.SUBJECT) || 'Информация о трек-номере вашего заказа'
}

export function saveSubject(s) {
  localStorage.setItem(KEYS.SUBJECT, s)
}

export function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.HISTORY)) || []
  } catch {
    return []
  }
}

export function addHistoryEntry(entry) {
  const history = getHistory()
  history.unshift({ ...entry, date: new Date().toISOString() })
  localStorage.setItem(KEYS.HISTORY, JSON.stringify(history))
}

export function clearHistory() {
  localStorage.removeItem(KEYS.HISTORY)
}
