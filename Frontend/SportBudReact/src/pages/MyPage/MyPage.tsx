import { Route, Routes } from 'react-router'
import MyPageNav from '../../components/MyPageNav/MyPageNav'
import MyPageAuctions from './MyPageAuctions'
import MyPageAdminUsers from './MyPageAdminUsers'
import MyPageAdminAuctions from './MyPageAdminAuctions'
import UpdateAuctionContainer from '../../containers/UpdateAuctionContainer/UpdateAuctionContainer'
import NewAuctionContainer from '../../containers/NewAuctionContainer/NewAuctionContainer'
import UserBidsContainer from '../../containers/BidContainer/UserBidsContainer'
import UpdatePasswordContainer from '../../containers/UpdatePasswordContainer/UpdatePasswordContainer'
import MyPageHomeContainer from '../../containers/MyPageHomeContainer/MyPageHomeContainer'

// Min Sida – huvudlayout för inloggade användare.
// Visar navigering och snabbstatistik alltid, och renderar undersidor via inbäddade routes.
function MyPage() {
  return (
    <>
      <MyPageNav />
      <MyPageHomeContainer />
      {/* Undersidor för auktioner, bud, admin och kontoinställningar */}
      <Routes>
        <Route path="auctions" element={<MyPageAuctions />} />
        <Route path="bids" element={<UserBidsContainer />} />
        <Route path="create" element={<NewAuctionContainer />} />
        <Route path="auction/:id/update" element={<UpdateAuctionContainer />} />
        <Route path="admin/users" element={<MyPageAdminUsers />} />
        <Route path="admin/auctions" element={<MyPageAdminAuctions />} />
        <Route path="update-password" element={<UpdatePasswordContainer />} />
      </Routes>
    </>
  )
}

export default MyPage
