import { useState } from 'react'
import styles from './DetailedAuctionCard.module.css'
import type { AuctionType } from '../../types/Types'
import { getTimeLeft } from '../../helpers/timeHelpers'
import { useAuth } from '../../context/AuthProvider'
import PrimaryButton from '../Buttons/PrimaryButton'
import { useNavigate } from 'react-router'
import AddBid from '../AddBid/AddBid'

// Props för detaljkortet – auktionsobjekt samt callback som anropas vid lyckat bud
interface Props {
  auction: AuctionType
  onBidSucces: () => void
}

// Detaljerad vy för en enskild auktion med bild, beskrivning, bud-information och möjlighet att lägga bud eller uppdatera annonsen
function DetailedAuctionCard({ auction, onBidSucces }: Props) {
  const { isLoggedIn, user } = useAuth()
  const navigate = useNavigate()
  const [showBid, setShowBid] = useState(false)

  const isOwner = user?.userId === auction.userId
  const canBid = isLoggedIn && auction.isOpen && !isOwner && !auction.isDeactivatedByAdmin
  const timeLeft = getTimeLeft(auction.endDateUtc)

  const highestBidText = auction.highestBid && auction.highestBid.bidAmount > 0
    ? `${auction.highestBid.bidAmount} kr av ${auction.highestBid.userName}`
    : 'Inga bud ännu'

  return (
    <div className={styles.card}>
      {auction.imageUrl && (
        <img src={auction.imageUrl} alt={auction.title} className={styles.image} />
      )}

      <div className={styles.content}>
        <div className={styles.topRow}>
          <h1 className={styles.title}>{auction.title}</h1>
          <span className={styles.badge + ' ' + (auction.isOpen ? styles.open : styles.closed)}>
            {auction.isOpen ? 'Öppen' : 'Avslutad'}
          </span>
        </div>

        {auction.isDeactivatedByAdmin && (
          <div className={styles.adminWarning}>
            ⚠️ Denna annons har inaktiverats av en administratör
          </div>
        )}

        <p className={styles.description}>{auction.description}</p>

        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Startpris</span>
            <span className={styles.infoValue}>{auction.startPrice} kr</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Högsta bud</span>
            <span className={styles.infoValueHighlight}>{highestBidText}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Tid kvar</span>
            <span className={styles.infoValue}>{timeLeft}</span>
          </div>
        </div>

        <div className={styles.actions} onClick={e => e.stopPropagation()}>
          {isOwner && (
            <PrimaryButton
              buttonText="Uppdatera annons"
              buttonEvent={() => navigate(`/mypage/auction/${auction.id}/update`)}
            />
          )}
          {canBid && !showBid && (
            <PrimaryButton buttonText="Lägg bud" buttonEvent={() => setShowBid(true)} />
          )}
          {showBid && (
            <AddBid
              auctionId={auction.id}
              onCancel={() => setShowBid(false)}
              onSuccess={() => { setShowBid(false); onBidSucces() }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default DetailedAuctionCard
