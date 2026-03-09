import type { AuctionType, CreateAuctionType, SetAuctionStatusType, UpdateAuctionType } from '../../types/Types'
import { authService } from '../AuthService/AuthService'

// Bas-URL för alla anrop till backend-API:et
const BASE = 'http://localhost:6200'

// Hämtar alla auktioner som fortfarande är öppna
export async function GetAllOpenAuctions(): Promise<AuctionType[]> {
  const auctions: AuctionType[] = await fetch(`${BASE}/open/all`).then(r => r.json())
  return auctions
}

// Hämtar öppna auktioner som matchar söktermen
export async function GetOpenAuctionsSearch(titleSearch: string): Promise<AuctionType[]> {
  const auctions: AuctionType[] = await fetch(
    `${BASE}/open/search?search=${encodeURIComponent(titleSearch)}`
  ).then(r => r.json())
  return auctions
}

// Hämtar alla auktioner (inklusive stängda) som matchar söktermen
export async function GetAllAuctionsSearch(titleSearch: string): Promise<AuctionType[]> {
  const auctions: AuctionType[] = await fetch(
    `${BASE}/all/search?search=${encodeURIComponent(titleSearch)}`
  ).then(r => r.json())
  return auctions
}

// Hämtar alla auktioner utan filtrering, används för admin-vyn
export async function GetAllAuctions(): Promise<AuctionType[]> {
  const auctions: AuctionType[] = await fetch(`${BASE}/all`).then(r => r.json())
  return auctions
}

// Hämtar en specifik auktion baserat på id
export async function GetById(auctionId: number): Promise<AuctionType> {
  const auction: AuctionType = await fetch(`${BASE}/auctions/${auctionId}`).then(r => r.json())
  return auction
}

// Skapar en ny auktion, kräver att användaren är inloggad
export async function CreateAuction(auction: CreateAuctionType) {
  const token = authService.getToken()
  const response = await fetch(`${BASE}/api/auction`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(auction),
  })
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Kunde inte skapa annons: ${errorText}`)
  }
  return await response.json()
}

// Uppdaterar en befintlig auktion, kräver att användaren äger auktionen
export async function UpdateAuction(auctionId: number, auction: UpdateAuctionType) {
  const token = authService.getToken()
  const response = await fetch(`${BASE}/api/Auction?auctionId=${auctionId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(auction),
  })
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Kunde inte uppdatera annons: ${errorText}`)
  }
  return await response.json()
}

// Admin-funktion för att aktivera eller inaktivera en auktion
export async function SetAuctionStatus({ auctionId, isDeactivatedByAdmin }: SetAuctionStatusType) {
  const token = authService.getToken()
  const response = await fetch(`${BASE}/deactivate?auctionId=${auctionId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ isDeactivatedByAdmin }),
  })
  if (!response.ok) {
    const errorText = await response.text().catch(() => '')
    throw new Error(errorText || `Request failed: ${response.status}`)
  }
  return await response.json()
}
