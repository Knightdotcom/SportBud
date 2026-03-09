import { authService } from '../services/AuthService/AuthService'
import { GetUser } from '../services/UserService/UserServices'
import { createContext, useState, useEffect, useContext } from 'react'
import type { AuthContextType } from '../types/Types'

// Globalt context för autentisering som delas i hela applikationen
export const AuthContext = createContext<AuthContextType | null>(null)

// Provider-komponent som hanterar inloggningsstatus och användardata
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthContextType['user']>(null)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)

  // Uppdaterar användartillståndet baserat på om ett giltigt token finns
  const refreshUser = async () => {
    const loggedIn = await authService.isLoggedIn()
    setIsLoggedIn(loggedIn)

    if (!loggedIn) {
      setUser(null)
      return
    }

    const userId = authService.getUserId()
    if (!userId) {
      setUser(null)
      setIsLoggedIn(false)
      return
    }

    // Hämtar användarens fullständiga information från backend
    const u = await GetUser(userId)
    setUser(u)
  }

  // Loggar ut användaren genom att ta bort token och återställa tillståndet
  const logout = () => {
    authService.clearToken()
    setUser(null)
    setIsLoggedIn(false)
  }

  // Kontrollerar inloggningsstatus direkt när applikationen laddas
  useEffect(() => {
    refreshUser()
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook för att komma åt autentiseringscontexten i komponenter
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
