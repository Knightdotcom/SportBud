import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../context/AuthProvider'

// Hook som kontrollerar om den inloggade användaren har admin-behörighet
// Omdirigerar till /login om ej inloggad, eller /forbidden om ej admin
export function checkAdmin() {
  const { user, isLoggedIn } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isLoggedIn === null) return
    if (!isLoggedIn) {
      navigate('/login', { replace: true })
      return
    }
    if (!user) return
    // Kontrollerar om användaren har rollen "Admin"
    const isAdmin = user?.roles?.includes('Admin') ?? false
    if (!isAdmin) {
      navigate('/forbidden', { replace: true })
    }
  }, [user, isLoggedIn, navigate])
}
