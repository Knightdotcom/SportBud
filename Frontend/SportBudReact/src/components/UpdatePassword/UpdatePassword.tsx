import React from 'react'
import type { UpdatePasswordType } from '../../types/Types'
import styles from './UpdatePassword.module.css'

// Fältvisa valideringsfel för lösenordsformuläret
type FieldErrors = Partial<Record<keyof UpdatePasswordType, string>>

// Props för lösenordsformuläret – fältvärden, fel, laddningsstatus samt callbacks för ändringar, fokustapp och inlämning
type Props = {
  values: UpdatePasswordType
  errors: FieldErrors
  rootError: string
  isSubmitting: boolean
  onChange: (name: keyof UpdatePasswordType, value: string) => void
  onBlur: (name: keyof UpdatePasswordType) => void
  onSubmit: () => void
}

// Formulär för att byta lösenord – kräver nuvarande lösenord och ett nytt lösenord
function UpdatePassword({ values, errors, rootError, isSubmitting, onChange, onBlur, onSubmit }: Props) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit()
  }
  const inputProps = (name: keyof UpdatePasswordType) => ({
    name,
    value: values[name] ?? '',
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange(name, e.target.value),
    onBlur: () => onBlur(name),
    'aria-invalid': !!errors[name],
    required: true,
  })
  return (
    <div className={styles.wrapper}>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <h2 className={styles.heading}>Byt lösenord</h2>
        {rootError && <p className={styles.rootError} role="alert">{rootError}</p>}
        <div className={styles.field}>
          <input type="password" placeholder="Nuvarande lösenord" autoComplete="current-password" {...inputProps('oldPassword')} />
          {errors.oldPassword && <p className={styles.errorText}>{errors.oldPassword}</p>}
        </div>
        <div className={styles.field}>
          <input type="password" placeholder="Nytt lösenord" autoComplete="new-password" {...inputProps('newPassword')} />
          {errors.newPassword && <p className={styles.errorText}>{errors.newPassword}</p>}
        </div>
        <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
          {isSubmitting ? 'Uppdaterar...' : 'Uppdatera lösenord'}
        </button>
      </form>
    </div>
  )
}

export default UpdatePassword
