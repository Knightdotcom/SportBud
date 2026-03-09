import { useEffect, useState } from 'react'
import { GetUsers, SetUserStatus } from '../../services/UserService/UserServices'
import UserTable from '../../components/UserTable/UserTable'
import type { UserTableType } from '../../types/Types'

// Adminvy för att hantera alla användare i systemet.
// Hämtar användarlistan och låter administratören aktivera eller inaktivera konton.
function AdminUserContainer() {
  const [users, setUsers] = useState<UserTableType[]>([])

  // Ändrar aktiveringsstatus för en användare och laddar om användarlistan
  const handleStatus = async (userId: string, isActive: boolean) => {
    await SetUserStatus({ userId, isActive })
    const data = await GetUsers()
    setUsers(data ?? [])
  }

  // Hämtar alla användare från API:et vid första rendering
  useEffect(() => {
    const load = async () => {
      const data = await GetUsers()
      setUsers(data ?? [])
    }
    load()
  }, [])

  return <UserTable handleStatus={handleStatus} users={users} />
}

export default AdminUserContainer
