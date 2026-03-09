import styles from './ClosedAuctionCard.module.css'
import type { AuctionType } from '../../types/Types'
import { useNavigate } from 'react-router'
import { FormatDate } from '../../helpers/timeHelpers'

// Props för det avslutade auktionskortet – tar emot ett auktionsobjekt
interface Props {
  auction: AuctionType
}

// Visar ett kort för en avslutad auktion med slutpris, vinnare och avslutsdatum
function ClosedAuctionCard({ auction }: Props) {
  const navigate = useNavigate()

  const winnerText = auction.highestBid && auction.highestBid.bidAmount > 0
    ? `${auction.highestBid.bidAmount} kr — ${auction.highestBid.userName}`
    : 'Inga bud lades'

  return (
    <div className={styles.card} onClick={() => navigate(`/auction/${auction.id}`)}>
      <div className={styles.closedBadge}>Avslutad</div>
      <div className={styles.body}>
        <h3 className={styles.title}>{auction.title}</h3>
        <div className={styles.row}>
          <span className={styles.label}>Slutpris</span>
          <span className={styles.value}>{winnerText}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Avslutades</span>
          <span className={styles.date}>{FormatDate(auction.endDateUtc)}</span>
        </div>
      </div>
    </div>
  )
}

export default ClosedAuctionCard
