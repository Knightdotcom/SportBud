import { useState } from 'react'
import styles from './AddBid.module.css'
import { MakeBid } from '../../services/BidService/BidService'
import { useAuctions } from '../../context/AuctionProvider'

// Props för budformuläret – auktionens ID samt callbacks för avbryt och lyckat bud
interface Props {
  auctionId: number
  onCancel: () => void
  onSuccess?: () => void
}

// Inline-formulär för att lägga ett bud på en auktion – validerar beloppet och skickar budet till API:et
function AddBid({ auctionId, onCancel, onSuccess }: Props) {
  const [amount, setAmount] = useState<number>(0)
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const { reload } = useAuctions()

  const confirmBid = async () => {
    setError('')
    if (amount <= 0) {
      setError('Ange ett bud större än 0 kr')
      return
    }
    setLoading(true)
    try {
      await MakeBid({ auctionId, amount })
      await reload()
      onSuccess?.()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Kunde inte lägga bud')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <input
        type="number"
        min={1}
        value={amount === 0 ? '' : amount}
        onChange={e => setAmount(Number(e.target.value))}
        placeholder="Ditt bud i kr..."
        className={styles.input}
      />
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.actions}>
        <button className={styles.confirmBtn} onClick={confirmBid} disabled={loading}>
          {loading ? 'Skickar...' : 'Bekräfta'}
        </button>
        <button className={styles.cancelBtn} onClick={onCancel} disabled={loading}>
          Avbryt
        </button>
      </div>
    </div>
  )
}

export default AddBid
