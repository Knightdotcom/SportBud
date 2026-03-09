import AdminAuctionContainer from '../../containers/AdminAuctionContainer/AdminAuctionContainer'
import { checkAdmin } from '../../helpers/adminHelper'

// Admin-undersida för auktionshantering – kontrollerar behörighet innan rendering
function MyPageAdminAuctions() {
  // Omdirigerar icke-admins bort från sidan
  checkAdmin()
  return <AdminAuctionContainer />
}

export default MyPageAdminAuctions
