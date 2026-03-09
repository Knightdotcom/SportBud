import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { AuctionType, CreateAuctionType, UpdateAuctionType } from '../types/Types'
import {
  GetAllAuctions,
  GetAllAuctionsSearch,
  GetAllOpenAuctions,
  GetOpenAuctionsSearch,
  CreateAuction,
  UpdateAuction,
} from '../services/AuctionService/AuctionsService'

// Typen för auktionscontexten som delas globalt
interface AuctionContextType {
  auctions: AuctionType[]
  allAuctions: AuctionType[]
  searchTerm: string
  includeClosed: boolean
  setSearchTerm: (v: string) => void
  setIncludeClosed: (v: boolean) => void
  reload: () => Promise<void>
  loadAllAuctions: () => Promise<void>
  createAuction: (values: CreateAuctionType) => Promise<AuctionType | null>
  updateAuction: (id: number, values: UpdateAuctionType) => Promise<AuctionType | null>
}

// Globalt context för auktioner
const AuctionContext = createContext<AuctionContextType | null>(null)

// Provider-komponent som hanterar auktionsdata, sökning och filtrering
export function AuctionProvider({ children }: { children: React.ReactNode }) {
  const [auctions, setAuctions] = useState<AuctionType[]>([])
  const [allAuctions, setAllAuctions] = useState<AuctionType[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [includeClosed, setIncludeClosed] = useState(false)

  // Hämtar auktioner baserat på söktermen och om stängda auktioner ska inkluderas
  const load = useCallback(async () => {
    try {
      const term = searchTerm.trim()
      const result = includeClosed
        ? term === ''
          ? await GetAllAuctions()
          : await GetAllAuctionsSearch(term)
        : term === ''
        ? await GetAllOpenAuctions()
        : await GetOpenAuctionsSearch(term)
      setAuctions(result ?? [])
    } catch (err) {
      console.error('Failed to load auctions:', err)
    }
  }, [includeClosed, searchTerm])

  // Hämtar alla auktioner utan filtrering, används för admin-vyn
  const loadAllAuctions = useCallback(async () => {
    try {
      const result = await GetAllAuctions()
      setAllAuctions(result ?? [])
    } catch (err) {
      console.error('Failed to load all auctions:', err)
    }
  }, [])

  // Skapar en ny auktion och uppdaterar listan efteråt
  const createAuction = async (values: CreateAuctionType) => {
    try {
      const created = await CreateAuction(values)
      if (!created) return null
      await load()
      if (allAuctions.length > 0) await loadAllAuctions()
      return created
    } catch (err) {
      console.error('Failed to create auction:', err)
      return null
    }
  }

  // Uppdaterar en auktion och laddar om listan efteråt
  const updateAuction = async (id: number, values: UpdateAuctionType) => {
    try {
      const updated = await UpdateAuction(id, values)
      if (!updated) return null
      await load()
      if (allAuctions.length > 0) await loadAllAuctions()
      return updated
    } catch (err) {
      console.error('Failed to update auction:', err)
      return null
    }
  }

  // Laddar om auktioner automatiskt när söktermen eller inkludera-stängda ändras
  useEffect(() => {
    load()
  }, [load])

  return (
    <AuctionContext.Provider
      value={{
        auctions,
        allAuctions,
        searchTerm,
        includeClosed,
        setSearchTerm,
        setIncludeClosed,
        reload: load,
        loadAllAuctions,
        createAuction,
        updateAuction,
      }}
    >
      {children}
    </AuctionContext.Provider>
  )
}

// Custom hook för att komma åt auktionscontexten i komponenter
export function useAuctions() {
  const ctx = useContext(AuctionContext)
  if (!ctx) throw new Error('useAuctions must be used in AuctionProvider')
  return ctx
}
