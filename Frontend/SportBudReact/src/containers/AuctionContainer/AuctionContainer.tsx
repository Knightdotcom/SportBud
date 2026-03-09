import Searchbar from '../../components/Searchbar/Searchbar'
import AuctionList from '../../components/AuctionList/AuctionList'
import { useAuctions } from '../../context/AuctionProvider'
import { useLocation } from 'react-router'
import { useEffect } from 'react'

// Visar söksidan med sökfält och lista över auktioner.
// Laddar om auktioner varje gång användaren navigerar till sidan.
function AuctionContainer() {
  const { auctions, reload } = useAuctions()
  const location = useLocation()

  // Laddar om auktionslistan vid sidnavigering
  useEffect(() => {
    reload()
  }, [reload, location.key])

  return (
    <>
      <Searchbar />
      <AuctionList auctions={auctions} />
    </>
  )
}

export default AuctionContainer
