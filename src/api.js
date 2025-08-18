export async function api(path, { method = 'GET', body, token } = {}) {
  const headers = {
    'Content-Type': 'application/json',
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`http://localhost:5274${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(errorText || res.statusText)
  }

  return res.status === 204 ? null : res.json()
}
