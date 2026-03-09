import styles from './LoginForm.module.css'

// Fältvärden för inloggningsformuläret
type LoginValues = {
  userNameOrEmail: string
  password: string
}

// Props för inloggningsformuläret – fältvärden, felmeddelande, laddningsstatus samt callbacks för ändringar och inlämning
interface Props {
  values: LoginValues
  rootError: string
  isSubmitting: boolean
  onChange: (name: keyof LoginValues, value: string) => void
  onSubmit: () => void | Promise<void>
}

// Inloggningsformulär med fält för användarnamn/e-post och lösenord
function LoginForm({ values, rootError, isSubmitting, onChange, onSubmit }: Props) {
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await onSubmit()
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.icon}>🏅</span>
          <h2>Logga in</h2>
          <p>Välkommen tillbaka till SportBud!</p>
        </div>

        {rootError && <div className={styles.errorBanner}>{rootError}</div>}

        <form onSubmit={submit} noValidate>
          <div className={styles.field}>
            <label>Användarnamn eller e-post</label>
            <input
              type="text"
              placeholder="ex. marcus_h"
              value={values.userNameOrEmail}
              onChange={e => onChange('userNameOrEmail', e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className={styles.field}>
            <label>Lösenord</label>
            <input
              type="password"
              placeholder="Ditt lösenord"
              value={values.password}
              onChange={e => onChange('password', e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
            {isSubmitting ? 'Loggar in...' : 'Logga in'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginForm
