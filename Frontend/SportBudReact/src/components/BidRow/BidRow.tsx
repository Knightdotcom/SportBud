import type { AuctionType, BidType } from '../../types/Types'
import { FormatDate, getTimeLeft } from '../../helpers/timeHelpers'
import { useNavigate } from 'react-router'
import styles from '../BidTable/BidTable.module.css'
import { useAuth } from '../../context/AuthProvider'

// Props för en budrad – budobjekt, tillhörande auktion och callback för att ångra budet
interface Props {
  bid: BidType
  auction?: AuctionType
  onDelete: (bidId: number, auctionId: number) => Promise<void>
}

// Renderar en tabellrad för ett enskilt bud – visar budinfo och låter användaren ångra sitt högsta bud på en öppen auktion
function BidRow({ bid, auction, onDelete }: Props) {
  const navigate = useNavigate()
  const { user } = useAuth()

  const canDelete =
    !!auction &&
    bid.bidId === auction.highestBid?.bidId &&
    bid.userId === auction.highestBid?.userId &&
    bid.userId === user?.userId &&
    auction.isOpen

  const timeText = !auction ? '—' : auction.isOpen ? getTimeLeft(auction.endDateUtc) : 'Avslutad'

  return (
    <tr className={styles.row}>
      <td data-label="Användare">{bid.userName}</td>
      <td data-label="Bud">{bid.bidAmount} kr</td>
      <td data-label="Datum">{FormatDate(bid.bidDateTime)}</td>
      <td data-label="Åtgärd" className={styles.actionsCell}>
        {canDelete ? (
          <button className={styles.dangerBtn} onClick={() => onDelete(bid.bidId, bid.auctionId)}>
            Ångra bud
          </button>
        ) : (
          <span className={styles.muted}>—</span>
        )}
      </td>
      <td data-label="Annons">
        {auction ? (
          <button className={styles.linkBtn} onClick={() => navigate(`/auction/${auction.id}`)}>
            {auction.title}
          </button>
        ) : (
          <span className={styles.muted}>Laddar...</span>
        )}
      </td>
      <td data-label="Tid kvar">
        <span className={auction?.isOpen ? styles.timeOpen : styles.timeClosed}>{timeText}</span>
      </td>
    </tr>
  )
}

export default BidRow
