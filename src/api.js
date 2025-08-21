// General-purpose API call function
// path: the endpoint to call (e.g., "/api/students/login")
// options: method, body, and token

export async function api(path, { method = 'GET', body, token } = {}) {
  // Default headers -> JSON request
  const headers = {
    'Content-Type': 'application/json',
  }
  // If token exists -> add Authorization header
  if (token) headers['Authorization'] = `Bearer ${token}`

  // Send fetch request to backend
  const res = await fetch(`http://localhost:5274${path}`, {
    method,       // HTTP method (GET, POST, PUT, DELETE, etc.)
    headers,
    body: body ? JSON.stringify(body) : undefined, // HTTP method (GET, POST, PUT, DELETE, etc.)
  })

  // If response is not OK (status code outside 200–299)
  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(errorText || res.statusText)  // Throw error with message
  }


  // If status is 204 (No Content), return null
  // Otherwise, parse response as JSON and return
  return res.status === 204 ? null : res.json()
}
