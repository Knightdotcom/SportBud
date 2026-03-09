import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { GetById } from '../../services/AuctionService/AuctionsService'
import DetailedAuctionCard from '../../components/DetailedAuctionCard/DetailedAuctionCard'
import BidContainer from '../BidContainer/BidContainer'
import { useAuctions } from '../../context/AuctionProvider'
import type { AuctionType } from '../../types/Types'
import styles from './DetailedAuctionContainer.module.css'

// Hämtar och visar detaljerad information om en specifik auktion baserat på ID i URL:en.
// Visar auktionskortet och budlistan, och uppdaterar båda när ett nytt bud läggs.
function DetailedAuctionContainer() {
  const { id } = useParams()
  const [auction, setAuction] = useState<AuctionType | null>(null)
  // refreshKey används för att tvinga om budlistan när ett bud läggs
  const [refreshKey, setRefreshKey] = useState(0)
  const { loadAllAuctions } = useAuctions()

  // Uppdaterar auktionslistan och triggar omladdning av bud efter lyckat bud
  const handleBidSuccess = () => {
    loadAllAuctions()
    setRefreshKey(k => k + 1)
  }

  // Hämtar auktionen från API:et när ID:t ändras
  useEffect(() => {
    if (!id) return
    GetById(Number(id)).then(setAuction)
  }, [id])

  if (!auction) return <p style={{ textAlign: 'center', padding: '2rem' }}>Laddar annons...</p>

  return (
    <div className={styles.container}>
      <DetailedAuctionCard auction={auction} onBidSucces={handleBidSuccess} />
      <BidContainer auctionId={auction.id} refreshKey={refreshKey} />
    </div>
  )
}

export default DetailedAuctionContainer
