import { useAuctions } from '../../context/AuctionProvider'

// Props för kryssrutans etikettext
interface Props {
  text: string
}

// Kryssruta som styr om avslutade auktioner ska visas i listan
function IncludeClosedCheckbox({ text }: Props) {
  const { includeClosed, setIncludeClosed } = useAuctions()

  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', userSelect: 'none' }}>
      <input
        type="checkbox"
        checked={includeClosed}
        onChange={e => setIncludeClosed(e.target.checked)}
        style={{ accentColor: '#f97316', width: '1rem', height: '1rem' }}
      />
      {text}
    </label>
  )
}

export default IncludeClosedCheckbox
