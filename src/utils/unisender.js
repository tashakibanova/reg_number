export async function sendEmail({ trackingNumber, email, subject, htmlBody }) {
  const apiKey = import.meta.env.VITE_UNISENDER_API_KEY
  const senderEmail = import.meta.env.VITE_SENDER_EMAIL
  const senderName = import.meta.env.VITE_SENDER_NAME

  const rendered = htmlBody
    .replace(/\{\{tracking_number\}\}/g, trackingNumber)
    .replace(/\{\{email\}\}/g, email)

  const formData = new FormData()
  formData.append('api_key', apiKey)
  formData.append('email', email)
  formData.append('sender_name', senderName)
  formData.append('sender_email', senderEmail)
  formData.append('subject', subject)
  formData.append('body', rendered)
  formData.append('list_id', '0')
  formData.append('format', 'json')

  const response = await fetch('https://api.unisender.com/ru/api/sendEmail', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  const data = await response.json()
  if (data.error) {
    throw new Error(data.error)
  }

  return data
}
