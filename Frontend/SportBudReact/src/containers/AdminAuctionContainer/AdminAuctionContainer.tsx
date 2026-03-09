import { useEffect } from 'react'
import AuctionTable from '../../components/AuctionTable/AuctionTable'
import { useAuctions } from '../../context/AuctionProvider'
import { SetAuctionStatus } from '../../services/AuctionService/AuctionsService'
import IncludeClosedCheckbox from '../../components/IncludeClosedCheckbox/IncludeClosedCheckbox'

// Adminvy för att hantera alla auktioner i systemet.
// Låter administratören aktivera eller inaktivera auktioner och filtrera på avslutade.
function AdminAuctionContainer() {
  const { auctions, reload } = useAuctions()

  // Ändrar status (aktiverad/inaktiverad) för en auktion och laddar om listan
  const handleStatus = async (auctionId: number, isDeactivatedByAdmin: boolean) => {
    await SetAuctionStatus({ auctionId, isDeactivatedByAdmin })
    await reload()
  }

  useEffect(() => { reload() }, [reload])

  return (
    <>
      <IncludeClosedCheckbox text="Visa avslutade" />
      <AuctionTable handleStatus={handleStatus} auctions={auctions} />
    </>
  )
}

export default AdminAuctionContainer
