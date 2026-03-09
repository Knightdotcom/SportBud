import { useState } from 'react'
import { useNavigate } from 'react-router'
import LoginForm from '../../components/LoginForm/LoginForm'
import { LoginUser } from '../../services/AuthService/AuthService'
import { useAuth } from '../../context/AuthProvider'

// Typ för inloggningsformulärets fältvärden
type LoginValues = { userNameOrEmail: string; password: string }

// Hanterar inloggningslogiken: tar emot formulärdata, anropar inloggningstjänsten
// och navigerar användaren till Min Sida vid lyckad inloggning.
function LoginContainer() {
  const { refreshUser } = useAuth()
  const navigate = useNavigate()
  const [values, setValues] = useState<LoginValues>({ userNameOrEmail: '', password: '' })
  const [rootError, setRootError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Uppdaterar formulärfältet och rensar eventuellt felmeddelande
  const handleChange = (name: keyof LoginValues, value: string) => {
    setValues(prev => ({ ...prev, [name]: value }))
    setRootError('')
  }

  // Skickar inloggningsuppgifter till API:et och hanterar svar och felfall
  const handleSubmit = async () => {
    setRootError('')
    setIsSubmitting(true)
    try {
      const result = await LoginUser(values.userNameOrEmail.trim(), values.password)
      if (result.isSucces === false) { setRootError(result.error); return }
      if (!result.isActive) { navigate('/deactivated', { replace: true }); return }
      await refreshUser()
      navigate('/mypage', { replace: true })
    } catch {
      setRootError('Något gick fel. Försök igen.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return <LoginForm values={values} rootError={rootError} isSubmitting={isSubmitting} onChange={handleChange} onSubmit={handleSubmit} />
}

export default LoginContainer
