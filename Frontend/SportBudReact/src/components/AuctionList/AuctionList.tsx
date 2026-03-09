import styles from './AuctionList.module.css'
import type { AuctionType } from '../../types/Types'
import AuctionCard from '../AuctionCard/AuctionCard'
import ClosedAuctionCard from '../ClosedAuctionCard/ClosedAuctionCard'

// Props för auktionslistan – tar emot en array med auktionsobjekt
interface Props {
  auctions: AuctionType[]
}

// Renderar en lista av auktionskort – visar öppna auktioner som AuctionCard och avslutade som ClosedAuctionCard
function AuctionList({ auctions }: Props) {
  if (auctions.length === 0) {
    return <div className={styles.empty}><p>Inga annonser hittades.</p></div>
  }
  return (
    <div className={styles.grid}>
      {auctions.map(auction =>
        auction.isOpen
          ? <AuctionCard key={auction.id} auction={auction} />
          : <ClosedAuctionCard key={auction.id} auction={auction} />
      )}
    </div>
  )
}

export default AuctionList
