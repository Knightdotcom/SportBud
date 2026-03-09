import type { AuctionType } from '../../types/Types'
import styles from '../AuctionTable/AuctionTable.module.css'

// Props för en auktionsrad i admintabellen – auktionsobjekt och callback för statusändring
interface Props {
  auction: AuctionType
  handleStatus: (auctionId: number, isDeactivatedByAdmin: boolean) => void
}

// Renderar en tabellrad för en enskild auktion i adminvyn med knappar för att inaktivera eller aktivera annonsen
function AuctionRow({ auction, handleStatus }: Props) {
  return (
    <tr className={styles.row}>
      <td data-label="ID">{auction.id}</td>
      <td data-label="Titel">{auction.title}</td>
      <td data-label="Skapad av">{auction.userName}</td>
      <td data-label="Status">
        <span className={auction.isOpen ? styles.statusOpen : styles.statusClosed}>
          {auction.isOpen ? 'Öppen' : 'Avslutad'}
        </span>
      </td>
      <td data-label="Admin-status">
        <span className={auction.isDeactivatedByAdmin ? styles.adminYes : styles.adminNo}>
          {auction.isDeactivatedByAdmin ? 'Inaktiverad' : 'Aktiv'}
        </span>
      </td>
      <td data-label="Åtgärd" className={styles.actionsCell}>
        <button
          className={styles.disableBtn}
          onClick={() => handleStatus(auction.id, true)}
          disabled={auction.isDeactivatedByAdmin}
        >Inaktivera</button>
        <button
          className={styles.enableBtn}
          onClick={() => handleStatus(auction.id, false)}
          disabled={!auction.isDeactivatedByAdmin}
        >Aktivera</button>
      </td>
    </tr>
  )
}

export default AuctionRow
