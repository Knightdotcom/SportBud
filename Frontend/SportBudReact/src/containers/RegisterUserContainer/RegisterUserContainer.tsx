import { useState } from 'react'
import RegisterForm from '../../components/RegisterForm/RegisterForm'
import type { RegisterUserType } from '../../types/Types'
import { LoginUser } from '../../services/AuthService/AuthService'
import { RegisterUser } from '../../services/UserService/UserServices'
import { useNavigate } from 'react-router'
import { useAuth } from '../../context/AuthProvider'

// Typ för registreringsformulärets fältvärden
type FormValues = { firstName: string; lastName: string; username: string; email: string; password: string; confirmPassword: string }
// Typ för fältspecifika felmeddelanden
type FieldErrors = Partial<Record<keyof FormValues, string>>

// Hanterar registrering av ny användare: validerar formulärfält, skapar kontot
// via API:et och loggar sedan in användaren automatiskt.
function RegisterUserContainer() {
  const [values, setValues] = useState<FormValues>({ firstName: '', lastName: '', username: '', email: '', password: '', confirmPassword: '' })
  const navigate = useNavigate()
  const [errors, setErrors] = useState<FieldErrors>({})
  const [rootError, setRootError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { refreshUser } = useAuth()

  // Validerar ett enskilt formulärfält och returnerar felmeddelande om ogiltigt
  const validateField = (name: keyof FormValues, value: string): string => {
    const v = value.trim()
    switch (name) {
      case 'firstName': return v ? '' : 'Fyll i förnamn.'
      case 'lastName': return v ? '' : 'Fyll i efternamn.'
      case 'username': return !v ? 'Fyll i användarnamn.' : v.length < 3 ? 'Minst 3 tecken.' : ''
      case 'email': return !v ? 'Fyll i e-post.' : !/^\S+@\S+\.\S+$/.test(v) ? 'Ogiltig e-postadress.' : ''
      case 'password': return !value ? 'Fyll i lösenord.' : value.length < 8 ? 'Minst 8 tecken.' : ''
      case 'confirmPassword': return !value ? 'Bekräfta lösenord.' : value !== values.password ? 'Lösenorden matchar inte.' : ''
      default: return ''
    }
  }

  // Validerar alla fält i formuläret och returnerar true om allt är korrekt
  const validateAll = () => {
    const next: FieldErrors = {}
    ;(Object.keys(values) as (keyof FormValues)[]).forEach(k => { const m = validateField(k, values[k]); if (m) next[k] = m })
    setErrors(next)
    return Object.keys(next).length === 0
  }

  // Uppdaterar fältvärde och kör realtidsvalidering om fältet redan har ett fel
  const handleChange = (name: keyof FormValues, value: string) => {
    setValues(prev => ({ ...prev, [name]: value }))
    setRootError('')
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: validateField(name, value) || undefined }))
  }

  // Validerar ett fält när användaren lämnar det (on blur)
  const handleBlur = (name: keyof FormValues) => {
    setErrors(prev => ({ ...prev, [name]: validateField(name, values[name]) || undefined }))
  }

  // Skickar registreringsdata till API:et och loggar in användaren vid lyckat svar
  const handleSubmit = async () => {
    setRootError('')
    if (!validateAll()) return
    const dto: RegisterUserType = { userName: values.username.trim(), email: values.email.trim(), firstName: values.firstName.trim(), lastName: values.lastName.trim(), password: values.password, isAdmin: false }
    try {
      setIsSubmitting(true)
      const registered = await RegisterUser(dto)
      if (!registered) { setRootError('Något gick fel, försök igen.'); return }
      await LoginUser(dto.userName, dto.password)
      refreshUser()
      navigate('/mypage', { replace: true })
    } catch { setRootError('Något gick fel. Försök igen.') }
    finally { setIsSubmitting(false) }
  }

  return <RegisterForm values={values} errors={errors} rootError={rootError} isSubmitting={isSubmitting} onChange={handleChange} onBlur={handleBlur} onSubmit={handleSubmit} />
}

export default RegisterUserContainer
