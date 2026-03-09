import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import AuctionForm from '../../components/AuctionForm/AuctionForm'
import type { AuctionFormValues, UpdateAuctionType } from '../../types/Types'
import { useAuctions } from '../../context/AuctionProvider'
import { GetHighestBidByAuctionId } from '../../services/BidService/BidService'
import { useAuth } from '../../context/AuthProvider'

// Hanterar redigering av en befintlig auktion.
// Kontrollerar att inloggad användare äger auktionen och fyller i formuläret med befintliga värden.
function UpdateAuctionContainer() {
  const { id } = useParams()
  const { user, isLoggedIn } = useAuth()
  const auctionId = Number(id)
  const navigate = useNavigate()
  const { auctions, updateAuction } = useAuctions()
  const [values, setValues] = useState<AuctionFormValues>({ title: '', description: '', startPrice: 0, imageUrl: '', startAtUtc: '', endAtUtc: '', hasBid: false })
  const [rootError, setRootError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Verifierar behörighet och laddar auktionens befintliga data i formuläret
  useEffect(() => {
    if (isLoggedIn === null) return
    if (!isLoggedIn) { navigate('/login', { replace: true }); return }
    if (!user || !auctionId) return
    const auction = auctions.find(a => a.id === auctionId)
    if (!auction) return
    // Omdirigerar om användaren inte äger auktionen
    if (auction.userId !== user.userId) { navigate('/forbidden', { replace: true }); return }
    const load = async () => {
      const bid = await GetHighestBidByAuctionId(auctionId)
      setValues({ title: auction.title ?? '', description: auction.description ?? '', startPrice: auction.startPrice ?? 0, imageUrl: auction.imageUrl ?? '', startAtUtc: auction.startDateUtc ?? '', endAtUtc: auction.endDateUtc ?? '', hasBid: !!bid })
    }
    load()
  }, [auctionId, auctions, navigate, user, isLoggedIn])

  // Uppdaterar formulärfältet och omvandlar startpris till ett tal
  const handleChange = <K extends keyof AuctionFormValues>(name: K, value: string) => {
    setValues(prev => ({ ...prev, [name]: name === 'startPrice' ? Number(value) : value }))
    setRootError('')
  }

  // Skickar uppdaterade auktionsdata till API:et och navigerar tillbaka till auktionssidan
  const handleSubmit = async () => {
    setRootError('')
    if (!auctionId) { setRootError('Ogiltigt ID.'); return }
    setIsSubmitting(true)
    try {
      const dto: UpdateAuctionType = { title: values.title, description: values.description, startPrice: values.startPrice, imageUrl: values.imageUrl, newEndDateUtc: values.endAtUtc }
      const updated = await updateAuction(auctionId, dto)
      if (!updated) { setRootError('Kunde inte uppdatera annonsen.'); return }
      navigate(`/auction/${auctionId}`)
    } catch { setRootError('Något gick fel. Försök igen.') }
    finally { setIsSubmitting(false) }
  }

  return <AuctionForm values={values} rootError={rootError} isSubmitting={isSubmitting} title="Uppdatera annons" submitText="Spara" onChange={handleChange} onSubmit={handleSubmit} />
}

export default UpdateAuctionContainer
