import { useEffect, useState } from 'react'
import BidTable from '../../components/BidTable/BidTable'
import { GetBidsByUserId, DeleteBid } from '../../services/BidService/BidService'
import type { BidType } from '../../types/Types'
import { useAuth } from '../../context/AuthProvider'
import { useAuctions } from '../../context/AuctionProvider'

// Visar alla bud lagda av den inloggade användaren.
// Tillåter användaren att ta bort egna bud och uppdaterar listan automatiskt.
function UserBidContainer() {
  const { user } = useAuth()
  const [bids, setBids] = useState<BidType[]>([])
  const { allAuctions, loadAllAuctions } = useAuctions()
  const [loading, setLoading] = useState(true)

  // Hämtar användarens bud från API:et när användaren är inloggad
  useEffect(() => {
    if (!user?.userId) return
    const load = async () => {
      setLoading(true)
      const data = await GetBidsByUserId()
      setBids(data ?? [])
      setLoading(false)
    }
    load()
  }, [user])

  useEffect(() => { loadAllAuctions() }, [loadAllAuctions])

  // Tar bort ett bud och uppdaterar listan lokalt samt laddar om auktioner
  const handleDelete = async (bidId: number, auctionId: number) => {
    const ok = await DeleteBid({ bidId, auctionId })
    if (!ok) return
    setBids(prev => prev.filter(b => b.bidId !== bidId))
    loadAllAuctions()
  }

  if (loading) return <p style={{ padding: '1rem' }}>Laddar bud...</p>
  return <BidTable auctions={allAuctions} bids={bids} onDelete={handleDelete} />
}

export default UserBidContainer
