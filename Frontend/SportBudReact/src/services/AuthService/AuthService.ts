import { jwtDecode } from 'jwt-decode'

// Nyckel för att lagra JWT-token i localStorage
const TOKEN_KEY = 'sportbud_token'
// Händelsenamn som används för att meddela om autentiseringsändringar
const AUTH_EVENT = 'auth:changed'

// Typ för att läsa ut utgångstid från JWT-token
type JwtPayload = {
  exp?: number
}

// Kontrollerar om ett token är giltigt och inte har löpt ut
function isTokenValid(token: string | null): boolean {
  if (!token) return false
  try {
    const decoded = jwtDecode<JwtPayload>(token)
    if (!decoded.exp) return true
    return decoded.exp * 1000 > Date.now()
  } catch {
    return false
  }
}

// Samling av hjälpfunktioner för att hantera autentisering och JWT-token
export const authService = {
  // Hämtar det sparade JWT-token från localStorage
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)
  },

  // Sparar ett nytt JWT-token i localStorage och skickar ett händelsesignal
  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token)
    window.dispatchEvent(new Event(AUTH_EVENT))
  },

  // Tar bort JWT-token från localStorage och skickar ett händelsesignal
  clearToken(): void {
    localStorage.removeItem(TOKEN_KEY)
    window.dispatchEvent(new Event(AUTH_EVENT))
  },

  // Kontrollerar om användaren är inloggad via ett giltigt token
  async isLoggedIn(): Promise<boolean> {
    const token = this.getToken()
    return isTokenValid(token)
  },

  // Hämtar användar-id från JWT-token via base64-avkodning av payloaden
  getUserId(): string | null {
    const token = this.getToken()
    if (!token) return null
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return (
        payload.sub ||
        payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ||
        null
      )
    } catch {
      return null
    }
  },

  // Registrerar en lyssnare som anropas när autentiseringsstatusen ändras
  // Returnerar en funktion som tar bort lyssnaren (för cleanup i useEffect)
  onAuthChange(handler: () => void): () => void {
    const listener = () => handler()
    window.addEventListener(AUTH_EVENT, listener)
    window.addEventListener('storage', listener)
    return () => {
      window.removeEventListener(AUTH_EVENT, listener)
      window.removeEventListener('storage', listener)
    }
  },
}

// Skickar inloggningsuppgifter till backend och sparar token vid lyckad inloggning
export async function LoginUser(usernameOrEmail: string, password: string) {
  const url = 'http://localhost:6200/login'
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usernameOrEmail, password }),
  })
  const result = await response.json()
  // Sparar token bara om inloggningen lyckades och kontot är aktivt
  if (response.ok && result.isActive === true) {
    await authService.setToken(result.token)
  }
  return result
}
