import styles from './Logo.module.css'

// Visar SportBud-logotypen med ikon och applikationens namn
function Logo() {
  return (
    <div className={styles.logo}>
      <span className={styles.icon}>🏆</span>
      <span className={styles.text}>SportBud</span>
    </div>
  )
}

export default Logo
