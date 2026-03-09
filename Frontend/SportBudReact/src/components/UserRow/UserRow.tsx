import type { UserTableType } from '../../types/Types'
import styles from '../UserTable/UserTable.module.css'

// Props för en användarrad – användarobjekt och callback för att aktivera eller inaktivera kontot
interface Props {
  user: UserTableType
  handleStatus: (userId: string, isActive: boolean) => void
}

// Renderar en tabellrad för en enskild användare i adminvyn med knappar för att inaktivera eller aktivera kontot
function UserRow({ user, handleStatus }: Props) {
  return (
    <tr className={styles.row}>
      <td data-label="Användar-ID" style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{user.userId.slice(0, 8)}...</td>
      <td data-label="Användarnamn">{user.userName}</td>
      <td data-label="E-post">{user.userEmail}</td>
      <td data-label="Status">
        <span className={user.isActive ? styles.activeYes : styles.activeNo}>
          {user.isActive ? 'Aktiv' : 'Inaktiverad'}
        </span>
      </td>
      <td data-label="Åtgärd" className={styles.actionsCell}>
        <button className={styles.disableBtn} onClick={() => handleStatus(user.userId, false)} disabled={!user.isActive}>
          Inaktivera
        </button>
        <button className={styles.enableBtn} onClick={() => handleStatus(user.userId, true)} disabled={user.isActive}>
          Aktivera
        </button>
      </td>
    </tr>
  )
}

export default UserRow
