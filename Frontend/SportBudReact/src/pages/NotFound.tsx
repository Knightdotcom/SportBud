import { useNavigate } from 'react-router'
import styles from './NotFound.module.css'

// Felsida som visas när en URL inte matchar någon definierad route (404).
// Erbjuder användaren en knapp för att navigera tillbaka till startsidan.
function NotFound() {
  const navigate = useNavigate()
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.code}>404</h1>
      <p className={styles.message}>Sidan hittades inte.</p>
      <button className={styles.btn} onClick={() => navigate('/')}>Gå till startsidan</button>
    </div>
  )
}

export default NotFound
