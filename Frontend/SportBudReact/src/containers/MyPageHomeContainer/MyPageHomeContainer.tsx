import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import type { AuctionType, BidType } from '../../types/Types'
import MyPageQuickStats from '../../components/MyPageQuickStats/MyPageQuickStats'
import { useAuctions } from '../../context/AuctionProvider'
import { useAuth } from '../../context/AuthProvider'
import { GetBidsByUserId } from '../../services/BidService/BidService'

// Visar en snabbstatistik-vy på Min Sida med användarens egna auktioner och bud.
// Beräknar statistik och erbjuder navigeringsknappar till auktioner och bud.
export default function MyPageHomeContainer() {
  const navigate = useNavigate()
  const { allAuctions, loadAllAuctions } = useAuctions()
  const { user } = useAuth()
  const [myBids, setMyBids] = useState<BidType[]>([])
  const userId = user?.userId

  // Filtrerar ut enbart den inloggade användarens auktioner
  const myAuctions: AuctionType[] = useMemo(() => {
    if (!userId) return []
    return allAuctions.filter(a => a.userId === userId)
  }, [allAuctions, userId])

  // Laddar auktioner och användarens egna bud när komponenten monteras
  useEffect(() => {
    if (!userId) return
    const load = async () => {
      if (allAuctions.length === 0) await loadAllAuctions()
      const bids = await GetBidsByUserId()
      setMyBids(bids ?? [])
    }
    load()
  }, [userId])

  if (!userId) return null

  return (
    <MyPageQuickStats
      myAuctions={myAuctions}
      myBids={myBids}
      endingSoonHours={24}
      onGoToAuctions={() => navigate('/mypage/auctions')}
      onGoToBids={() => navigate('/mypage/bids')}
    />
  )
}
