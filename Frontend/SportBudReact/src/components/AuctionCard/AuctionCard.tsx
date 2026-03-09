import { useState } from 'react'
import styles from './AuctionCard.module.css'
import type { AuctionType } from '../../types/Types'
import { useAuth } from '../../context/AuthProvider'
import { getTimeLeft } from '../../helpers/timeHelpers'
import { useNavigate } from 'react-router'
import AddBid from '../AddBid/AddBid'
import PrimaryButton from '../Buttons/PrimaryButton'

// Props för auktionskortet – tar emot ett auktionsobjekt
interface Props {
  auction: AuctionType
}

// Visar ett auktionskort med titel, startpris, högsta bud och tid kvar – inloggade användare kan lägga bud direkt från kortet
function AuctionCard({ auction }: Props) {
  const { isLoggedIn, user } = useAuth()
  const navigate = useNavigate()
  const [showBid, setShowBid] = useState(false)

  const goToAuction = () => navigate(`/auction/${auction.id}`)
  const timeLeft = getTimeLeft(auction.endDateUtc)

  const highestBidText = auction.highestBid && auction.highestBid.bidAmount > 0
    ? `${auction.highestBid.bidAmount} kr — ${auction.highestBid.userName}`
    : 'Inga bud ännu'

  const canBid =
    isLoggedIn &&
    auction.isOpen &&
    user?.userId !== auction.userId &&
    !auction.isDeactivatedByAdmin

  return (
    <div className={styles.card} onClick={goToAuction}>
      {auction.isDeactivatedByAdmin && (
        <div className={styles.adminBanner}>Inaktiverad av admin</div>
      )}

      <div className={styles.statusBadge + ' ' + (auction.isOpen ? styles.open : styles.closed)}>
        {auction.isOpen ? 'Öppen' : 'Avslutad'}
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{auction.title}</h3>

        <div className={styles.priceRow}>
          <span className={styles.label}>Startpris</span>
          <span className={styles.price}>{auction.startPrice} kr</span>
        </div>

        <div className={styles.bidRow}>
          <span className={styles.label}>Högsta bud</span>
          <span className={styles.bidValue}>{highestBidText}</span>
        </div>

        <div className={styles.timeRow}>
          <span className={styles.clockIcon}>⏱</span>
          <span className={styles.timeLeft}>{timeLeft}</span>
        </div>
      </div>

      <div className={styles.footer} onClick={e => e.stopPropagation()}>
        {canBid && !showBid && (
          <PrimaryButton buttonText="Lägg bud" buttonEvent={() => setShowBid(true)} />
        )}
        {showBid && (
          <AddBid
            auctionId={auction.id}
            onCancel={() => setShowBid(false)}
            onSuccess={() => setShowBid(false)}
          />
        )}
      </div>
    </div>
  )
}

export default AuctionCard
