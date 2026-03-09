import styles from './AuctionForm.module.css'
import type { AuctionFormValues } from '../../types/Types'

// Props för auktionsformuläret – fältvärden, felmeddelanden, laddningsstatus samt callbacks för ändringar och inlämning
interface Props {
  values: AuctionFormValues
  rootError: string
  isSubmitting: boolean
  title: string
  submitText: string
  onChange: <K extends keyof AuctionFormValues>(name: K, value: string) => void
  onSubmit: () => void | Promise<void>
}

// Formulär för att skapa eller uppdatera en auktion – innehåller fält för titel, beskrivning, startpris, bild-URL samt start- och slutdatum
function AuctionForm({ values, rootError, isSubmitting, title, submitText, onChange, onSubmit }: Props) {
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await onSubmit()
  }

  return (
    <div className={styles.wrapper}>
      <form className={styles.form} onSubmit={submit} noValidate>
        <h2 className={styles.heading}>{title}</h2>

        {rootError && <p className={styles.rootError} role="alert">{rootError}</p>}

        <div className={styles.field}>
          <label htmlFor="title">Titel</label>
          <input id="title" type="text" value={values.title}
            onChange={e => onChange('title', e.target.value)} required />
        </div>

        <div className={styles.field}>
          <label htmlFor="description">Beskrivning</label>
          <textarea id="description" value={values.description}
            onChange={e => onChange('description', e.target.value)} required />
        </div>

        <div className={styles.field + (values.hasBid ? ' ' + styles.disabled : '')}>
          <label htmlFor="startPrice">Startpris (kr)</label>
          <input id="startPrice" type="number" min="0" step="1"
            value={values.startPrice}
            onChange={e => onChange('startPrice', e.target.value)}
            required disabled={values.hasBid} />
        </div>

        <div className={styles.field}>
          <label htmlFor="imageUrl">Bild-URL (valfritt)</label>
          <input id="imageUrl" type="text" value={values.imageUrl}
            onChange={e => onChange('imageUrl', e.target.value)} />
        </div>

        <div className={styles.field}>
          <label htmlFor="startAtUtc">Startdatum</label>
          <input id="startAtUtc" type="datetime-local" value={values.startAtUtc}
            onChange={e => onChange('startAtUtc', e.target.value)}
            required disabled={values.hasBid} />
        </div>

        <div className={styles.field}>
          <label htmlFor="endAtUtc">Slutdatum</label>
          <input id="endAtUtc" type="datetime-local" value={values.endAtUtc}
            onChange={e => onChange('endAtUtc', e.target.value)} required />
        </div>

        <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
          {isSubmitting ? `${submitText}...` : submitText}
        </button>
      </form>
    </div>
  )
}

export default AuctionForm
