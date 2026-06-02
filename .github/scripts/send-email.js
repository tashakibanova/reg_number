;(async () => {
  const formData = new URLSearchParams()
  formData.append('api_key', process.env.UNISENDER_API_KEY)
  formData.append('email', process.env.EMAIL)
  formData.append('sender_name', process.env.SENDER_NAME)
  formData.append('sender_email', process.env.SENDER_EMAIL)
  formData.append('subject', process.env.SUBJECT)
  formData.append('body', process.env.HTML_BODY)
  formData.append('list_id', '0')
  formData.append('format', 'json')

  const response = await fetch('https://api.unisender.com/ru/api/sendEmail', {
    method: 'POST',
    body: formData,
  })

  const data = await response.json()
  if (data.error) {
    console.error('Unisender error:', data.error)
    process.exit(1)
  }
  console.log('OK:', JSON.stringify(data))
})()
