import { useState } from 'react'
import { useNavigate } from 'react-router'
import AuctionForm from '../../components/AuctionForm/AuctionForm'
import type { AuctionFormValues, CreateAuctionType } from '../../types/Types'
import { useAuctions } from '../../context/AuctionProvider'

// Hanterar skapandet av en ny auktion.
// Visar ett formulär och skickar data till API:et, sedan navigerar till användarens auktioner.
function NewAuctionContainer() {
  const { createAuction } = useAuctions()
  const navigate = useNavigate()
  const [values, setValues] = useState<AuctionFormValues>({ title: '', description: '', startPrice: 0, imageUrl: '', startAtUtc: '', endAtUtc: '', hasBid: false })
  const [rootError, setRootError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Uppdaterar formulärfältet och omvandlar startpris till ett tal
  const handleChange = <K extends keyof AuctionFormValues>(name: K, value: string) => {
    setValues(prev => ({ ...prev, [name]: name === 'startPrice' ? Number(value) : value }))
    setRootError('')
  }

  // Skickar den nya auktionen till API:et och navigerar vid lyckat svar
  const handleSubmit = async () => {
    setRootError('')
    setIsSubmitting(true)
    try {
      const dto: CreateAuctionType = { title: values.title, description: values.description, startPrice: values.startPrice, imageUrl: values.imageUrl, startAtUtc: values.startAtUtc, endAtUtc: values.endAtUtc }
      const created = await createAuction(dto)
      if (!created) { setRootError('Kunde inte skapa annonsen. Försök igen.'); return }
      navigate('/mypage/auctions')
    } catch { setRootError('Något gick fel. Försök igen.') }
    finally { setIsSubmitting(false) }
  }

  return <AuctionForm values={values} rootError={rootError} isSubmitting={isSubmitting} title="Skapa annons" submitText="Skapa" onChange={handleChange} onSubmit={handleSubmit} />
}

export default NewAuctionContainer
