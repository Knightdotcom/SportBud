import AdminUserContainer from '../../containers/AdminUserContainer/AdminUserContainer'
import { checkAdmin } from '../../helpers/adminHelper'

// Admin-undersida för användarhantering – kontrollerar behörighet innan rendering
function MyPageAdminUsers() {
  // Omdirigerar icke-admins bort från sidan
  checkAdmin()
  return <AdminUserContainer />
}

export default MyPageAdminUsers
