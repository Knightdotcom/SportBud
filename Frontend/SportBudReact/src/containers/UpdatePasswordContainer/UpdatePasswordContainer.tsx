import { useState } from 'react'
import UpdatePassword from '../../components/UpdatePassword/UpdatePassword'
import type { UpdatePasswordType } from '../../types/Types'
import { UpdatePassword as UpdatePasswordService } from '../../services/UserService/UserServices'
import { useAuth } from '../../context/AuthProvider'
import { useNavigate } from 'react-router'

// Typ för fältspecifika felmeddelanden vid lösenordsbyte
type FieldErrors = Partial<Record<keyof UpdatePasswordType, string>>

// Hanterar lösenordsbyte för den inloggade användaren.
// Validerar gammalt och nytt lösenord och skickar uppdateringen till API:et.
function UpdatePasswordContainer() {
  const { refreshUser } = useAuth()
  const navigate = useNavigate()
  const [values, setValues] = useState<UpdatePasswordType>({ oldPassword: '', newPassword: '' })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [rootError, setRootError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Uppdaterar värdet för ett lösenordsfält
  const handleChange = (name: keyof UpdatePasswordType, value: string) => {
    setValues(prev => ({ ...prev, [name]: value }))
  }

  // Visar felmeddelande om ett fält lämnas tomt (on blur)
  const handleBlur = (name: keyof UpdatePasswordType) => {
    if (!values[name].trim()) setErrors(prev => ({ ...prev, [name]: 'Fältet är obligatoriskt' }))
    else setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  // Validerar att båda lösenordsfälten är ifyllda och att det nya har minst 6 tecken
  const validate = () => {
    const errs: FieldErrors = {}
    if (!values.oldPassword.trim()) errs.oldPassword = 'Ange nuvarande lösenord'
    if (!values.newPassword.trim()) errs.newPassword = 'Ange nytt lösenord'
    else if (values.newPassword.length < 6) errs.newPassword = 'Minst 6 tecken'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  // Skickar lösenordsbyte till API:et och navigerar till Min Sida vid lyckat svar
  const handleSubmit = async () => {
    setRootError('')
    if (!validate()) return
    try {
      setIsSubmitting(true)
      await UpdatePasswordService(values)
      await refreshUser()
      alert('Lösenord uppdaterat!')
      navigate('/mypage', { replace: true })
    } catch (err: unknown) {
      setRootError(err instanceof Error ? err.message : 'Något gick fel')
    } finally {
      setIsSubmitting(false)
    }
  }

  return <UpdatePassword values={values} errors={errors} rootError={rootError} isSubmitting={isSubmitting} onChange={handleChange} onBlur={handleBlur} onSubmit={handleSubmit} />
}

export default UpdatePasswordContainer
