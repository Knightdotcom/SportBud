import type { AuctionType } from '../../types/Types'
import AuctionRow from '../AuctionRow/AuctionRow'
import styles from './AuctionTable.module.css'

// Props för auktionsadmintabellen – lista med auktioner och callback för att ändra adminstatusens aktiv/inaktiv
interface Props {
  auctions: AuctionType[]
  handleStatus: (auctionId: number, isDeactivatedByAdmin: boolean) => void
}

// Adminvy som visar alla auktioner i en tabell med möjlighet att inaktivera eller aktivera enskilda annonser
function AuctionTable({ auctions, handleStatus }: Props) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th>ID</th>
            <th>Titel</th>
            <th>Skapad av</th>
            <th>Status</th>
            <th>Admin-status</th>
            <th className={styles.actions}>Åtgärd</th>
          </tr>
        </thead>
        <tbody>
          {auctions.length === 0 ? (
            <tr><td className={styles.empty} colSpan={6}>Inga annonser hittades</td></tr>
          ) : (
            auctions.map(a => (
              <AuctionRow key={a.id} auction={a} handleStatus={handleStatus} />
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default AuctionTable
