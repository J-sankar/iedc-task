const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const STATUSES = ['IDEATION', 'PROTOTYPE', 'SEED_FUNDED']

export async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(body.error || 'Request failed')
  return body
}

export function authHeaders(token) {
  return { Authorization: `Bearer ${token}` }
}
