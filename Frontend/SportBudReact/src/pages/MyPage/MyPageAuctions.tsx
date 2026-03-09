import { useEffect } from 'react'
import AuctionList from '../../components/AuctionList/AuctionList'
import { useAuctions } from '../../context/AuctionProvider'
import { useAuth } from '../../context/AuthProvider'

// Undersida på Min Sida som visar enbart den inloggade användarens egna auktioner
function MyPageAuctions() {
  const { user } = useAuth()
  const { allAuctions, loadAllAuctions } = useAuctions()

  useEffect(() => { loadAllAuctions() }, [])

  // Filtrerar auktioner så att bara användarens egna visas
  const myAuctions = allAuctions.filter(a => a.userId === user?.userId)

  return <AuctionList auctions={myAuctions} />
}

export default MyPageAuctions
