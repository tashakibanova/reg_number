const GITHUB_OWNER = 'tashakibanova'
const GITHUB_REPO = 'reg_number'
const WORKFLOW_FILE = 'send-email.yml'

export async function sendEmail({ trackingNumber, email, subject, htmlBody }) {
  const token = import.meta.env.VITE_GITHUB_TOKEN

  const rendered = htmlBody
    .replace(/\{\{tracking_number\}\}/g, trackingNumber)
    .replace(/\{\{email\}\}/g, email)

  const response = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/actions/workflows/${WORKFLOW_FILE}/dispatches`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify({
        ref: 'main',
        inputs: {
          tracking_number: trackingNumber,
          email,
          subject,
          html_body: rendered,
        },
      }),
    }
  )

  if (response.status === 204) {
    return { queued: true }
  }

  const text = await response.text()
  throw new Error(`GitHub API ${response.status}: ${text}`)
}
