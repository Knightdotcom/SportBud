import type { UserTableType } from '../../types/Types'
import UserRow from '../UserRow/UserRow'
import styles from './UserTable.module.css'

// Props för användartabellen – lista med användare och callback för att ändra användarens aktiva status
interface Props {
  users: UserTableType[]
  handleStatus: (userId: string, isActive: boolean) => void
}

// Adminvy som visar alla användare i en tabell med möjlighet att inaktivera eller aktivera konton
function UserTable({ users, handleStatus }: Props) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th>Användar-ID</th>
            <th>Användarnamn</th>
            <th>E-post</th>
            <th>Status</th>
            <th className={styles.actions}>Åtgärd</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr><td className={styles.empty} colSpan={5}>Inga användare hittades</td></tr>
          ) : (
            users.map(u => <UserRow key={u.userId} user={u} handleStatus={handleStatus} />)
          )}
        </tbody>
      </table>
    </div>
  )
}

export default UserTable
