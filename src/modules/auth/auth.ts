const AUTH_KEY = 'kv-miniapp-auth'

function getLocalStorage() {
  if (typeof window === 'undefined') return null
  return window.localStorage
}

export function isAuthenticated() {
  const localStorage = getLocalStorage()
  if (!localStorage) return false
  return localStorage.getItem(AUTH_KEY) === '1'
}

export function loginWithCredential(username: string, password: string) {
  if (username !== 'admin' || password !== 'admin') return false
  const localStorage = getLocalStorage()
  if (!localStorage) return false
  localStorage.setItem(AUTH_KEY, '1')
  return true
}

export function logout() {
  const localStorage = getLocalStorage()
  if (!localStorage) return
  localStorage.removeItem(AUTH_KEY)
}
