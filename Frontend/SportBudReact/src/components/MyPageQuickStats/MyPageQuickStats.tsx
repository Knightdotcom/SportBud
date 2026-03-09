import styles from './MyPageQuickStats.module.css'
import type { AuctionType, BidType } from '../../types/Types'
import StatCard from '../StatCard/StatCard'

// Props för snabbstatistiken – användarens auktioner, bud, tröskel för "slutar snart" och navigeringscallbacks
type Props = {
  myAuctions: AuctionType[]
  myBids: BidType[]
  endingSoonHours?: number
  onGoToAuctions?: () => void
  onGoToBids?: () => void
}

// Visar en översikt med statistikkort för användarens aktiva/avslutade annonser, bud och auktioner som snart avslutas
export default function MyPageQuickStats({ myAuctions, myBids, endingSoonHours = 24, onGoToAuctions, onGoToBids }: Props) {
  const now = Date.now()
  const soonMs = endingSoonHours * 60 * 60 * 1000

  const activeCount = myAuctions.filter(a => a.isOpen).length
  const closedCount = myAuctions.filter(a => !a.isOpen).length
  const bidCount = myBids.length
  const uniqueAuctions = new Set(myBids.map(b => Number(b.auctionId))).size
  const endingSoon = myAuctions.filter(a => {
    if (!a.isOpen) return false
    const end = new Date(a.endDateUtc).getTime()
    return end - now > 0 && end - now <= soonMs
  }).length

  return (
    <section className={styles.wrapper}>
      <div className={styles.grid}>
        <StatCard label="Aktiva annonser" value={activeCount} subText="Öppna just nu" onClick={onGoToAuctions} />
        <StatCard label="Avslutade annonser" value={closedCount} subText="Historik" onClick={onGoToAuctions} />
        <StatCard label="Mina bud" value={bidCount} subText="Totalt lagda" tone={bidCount > 0 ? 'warning' : 'default'} onClick={onGoToBids} />
        <StatCard label="Unika annonser" value={uniqueAuctions} subText="Jag har budat på" onClick={onGoToBids} />
        <StatCard label="Slutar snart" value={endingSoon} subText={`Inom ${endingSoonHours}h`} tone={endingSoon > 0 ? 'danger' : 'default'} onClick={onGoToAuctions} />
      </div>
    </section>
  )
}
