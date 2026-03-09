import styles from '../MyPageQuickStats/MyPageQuickStats.module.css'

// Färgton för statistikkortet – styr visuell betoning
type Tone = 'default' | 'success' | 'warning' | 'danger'

// Props för statistikkortet – etikett, värde, undertext, färgton och valfri klickhändelse
interface Props {
  label: string
  value: number | string
  subText?: string
  tone?: Tone
  onClick?: () => void
}

// Visar ett klickbart statistikkort med etikett, numeriskt värde och undertext – används i snabbstatistik-översikten
export default function StatCard({ label, value, subText, tone = 'default', onClick }: Props) {
  const clickable = !!onClick
  return (
    <button
      type="button"
      className={`${styles.card} ${styles[tone]} ${clickable ? styles.clickable : ''}`}
      onClick={onClick}
      disabled={!clickable}
    >
      <div className={styles.label}>{label}</div>
      <div className={styles.value}>{value}</div>
      {subText ? <div className={styles.subText}>{subText}</div> : <div className={styles.subTextPlaceholder} />}
    </button>
  )
}
