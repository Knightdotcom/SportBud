import type { AuctionType, BidType } from '../../types/Types'
import BidRow from '../BidRow/BidRow'
import styles from './BidTable.module.css'

// Props för budtabellen – lista med bud, tillhörande auktioner och callback för att ta bort ett bud
interface Props {
  bids: BidType[]
  auctions: AuctionType[]
  onDelete: (bidId: number, auctionId: number) => Promise<void>
}

// Visar en sorterad tabell över bud med information om användare, belopp, datum och tillhörande auktion
function BidTable({ bids, auctions, onDelete }: Props) {
  const sorted = [...bids].sort(
    (a, b) => new Date(b.bidDateTime).getTime() - new Date(a.bidDateTime).getTime()
  )

  return (
    <div className={styles.wrapper}>
      {bids.length === 0 ? (
        <div className={styles.emptyCard}>Inga bud hittades</div>
      ) : (
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th>Användare</th>
              <th>Bud</th>
              <th>Datum</th>
              <th className={styles.actions}>Åtgärd</th>
              <th>Annons</th>
              <th>Tid kvar</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(b => (
              <BidRow
                key={b.bidId}
                bid={b}
                auction={auctions.find(a => Number(a.id) === Number(b.auctionId))}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default BidTable
