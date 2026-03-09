import { useEffect, useState } from 'react'
import BidTable from '../../components/BidTable/BidTable'
import { DeleteBid, GetBidsByAuctionId } from '../../services/BidService/BidService'
import type { BidType } from '../../types/Types'
import { useAuctions } from '../../context/AuctionProvider'

// Props för BidContainer: auktionens ID och en valfri nyckel för att trigga omladdning
interface Props {
  auctionId: number
  refreshKey?: number
}

// Visar och hanterar bud för en specifik auktion.
// Laddar buden från API:et och tillåter borttagning av enskilda bud.
function BidContainer({ auctionId, refreshKey }: Props) {
  const [bids, setBids] = useState<BidType[]>([])
  const { allAuctions, loadAllAuctions, reload } = useAuctions()

  useEffect(() => { loadAllAuctions() }, [loadAllAuctions])

  // Hämtar bud för auktionen varje gång auctionId eller refreshKey ändras
  useEffect(() => {
    const loadBids = async () => {
      try {
        const data = await GetBidsByAuctionId(auctionId)
        setBids(data ?? [])
      } catch {
        setBids([])
      }
    }
    loadBids()
  }, [auctionId, refreshKey])

  // Tar bort ett bud och uppdaterar lokal lista samt auktionskontext
  const handleDelete = async (bidId: number, aucId: number) => {
    const ok = await DeleteBid({ bidId, auctionId: aucId })
    if (!ok) return
    setBids(prev => prev.filter(b => b.bidId !== bidId))
    await reload()
    await loadAllAuctions()
  }

  return <BidTable bids={bids} auctions={allAuctions} onDelete={handleDelete} />
}

export default BidContainer
