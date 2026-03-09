import styles from './Searchbar.module.css'
import { useAuctions } from '../../context/AuctionProvider'
import IncludeClosedCheckbox from '../IncludeClosedCheckbox/IncludeClosedCheckbox'

// Sökfält för att filtrera auktioner efter titel – inkluderar även en kryssruta för att visa avslutade auktioner
function Searchbar() {
  const { searchTerm, setSearchTerm } = useAuctions()

  return (
    <div className={styles.wrapper}>
      <div className={styles.searchRow}>
        <div className={styles.inputWrap}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Sök sportprylar..."
            className={styles.input}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className={styles.checkboxWrap}>
          <IncludeClosedCheckbox text="Visa avslutade" />
        </div>
      </div>
    </div>
  )
}

export default Searchbar
