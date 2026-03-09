import styles from './RegisterForm.module.css'

// Fältvärden för registreringsformuläret
type FormValues = {
  firstName: string
  lastName: string
  username: string
  email: string
  password: string
  confirmPassword: string
}

// Fältvisa valideringsfel
type FieldErrors = Partial<Record<keyof FormValues, string>>

// Props för registreringsformuläret – fältvärden, fel, laddningsstatus samt callbacks för ändringar, fokustapp och inlämning
type Props = {
  values: FormValues
  errors: FieldErrors
  rootError: string
  isSubmitting: boolean
  onChange: (name: keyof FormValues, value: string) => void
  onBlur: (name: keyof FormValues) => void
  onSubmit: () => void
}

// Registreringsformulär för att skapa ett nytt konto med validering av alla fält
function RegisterForm({ values, errors, rootError, isSubmitting, onChange, onBlur, onSubmit }: Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  const inputProps = (name: keyof FormValues) => ({
    name,
    value: values[name],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange(name, e.target.value),
    onBlur: () => onBlur(name),
    'aria-invalid': !!errors[name],
  })

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.icon}>🎽</span>
          <h2>Skapa konto</h2>
          <p>Börja buda på sportprylar idag!</p>
        </div>

        {rootError && <div className={styles.errorBanner}>{rootError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Förnamn</label>
              <input type="text" placeholder="Erik" {...inputProps('firstName')} />
              {errors.firstName && <span className={styles.fieldError}>{errors.firstName}</span>}
            </div>
            <div className={styles.field}>
              <label>Efternamn</label>
              <input type="text" placeholder="Lindqvist" {...inputProps('lastName')} />
              {errors.lastName && <span className={styles.fieldError}>{errors.lastName}</span>}
            </div>
          </div>

          <div className={styles.field}>
            <label>Användarnamn</label>
            <input type="text" placeholder="ex. erik_l" {...inputProps('username')} />
            {errors.username && <span className={styles.fieldError}>{errors.username}</span>}
          </div>

          <div className={styles.field}>
            <label>E-postadress</label>
            <input type="email" placeholder="erik@exempel.se" {...inputProps('email')} />
            {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
          </div>

          <div className={styles.field}>
            <label>Lösenord</label>
            <input type="password" placeholder="Minst 8 tecken" autoComplete="new-password" {...inputProps('password')} />
            {errors.password && <span className={styles.fieldError}>{errors.password}</span>}
          </div>

          <div className={styles.field}>
            <label>Bekräfta lösenord</label>
            <input type="password" placeholder="Upprepa lösenord" autoComplete="new-password" {...inputProps('confirmPassword')} />
            {errors.confirmPassword && <span className={styles.fieldError}>{errors.confirmPassword}</span>}
          </div>

          <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
            {isSubmitting ? 'Registrerar...' : 'Skapa konto'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default RegisterForm
