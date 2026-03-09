import type { BidType, DeleteBidType, MakeBidRequest, MakeBidType } from '../../types/Types'
import { authService } from '../AuthService/AuthService'

// Bas-URL för alla anrop till backend-API:et
const BASE = 'http://localhost:6200'

// Hämtar alla bud för en specifik auktion
export async function GetBidsByAuctionId(auctionId: number): Promise<BidType[]> {
  const bids: BidType[] = await fetch(`${BASE}/api/Bid?auctionId=${auctionId}`).then(r => r.json())
  return bids
}

// Hämtar alla bud som den inloggade användaren har lagt, kräver inloggning
export async function GetBidsByUserId() {
  const token = authService.getToken()
  const response = await fetch(`${BASE}/bids/user`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) throw new Error(`Kunde inte hämta bud: ${response.status}`)
  return await response.json()
}

// Hämtar det högsta budet för en auktion, returnerar null om inga bud finns (204)
export async function GetHighestBidByAuctionId(auctionId: number): Promise<BidType | null> {
  const res = await fetch(`${BASE}/highest?auctionId=${auctionId}`)
  if (res.status === 204) return null
  if (!res.ok) return null
  return (await res.json()) as BidType
}

// Lägger ett nytt bud på en auktion, kräver att användaren är inloggad
export async function MakeBid({ auctionId, amount }: MakeBidRequest): Promise<MakeBidType> {
  const token = authService.getToken()
  if (!token) throw new Error('Ej inloggad')

  const response = await fetch(`${BASE}/api/bid`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ auctionId, amount }),
  })

  if (!response.ok) {
    throw new Error((await response.text()) || 'Kunde inte lägga bud')
  }
  return await response.json()
}

// Tar bort ett specifikt bud, kräver att användaren äger budet
export async function DeleteBid({ bidId, auctionId }: DeleteBidType): Promise<boolean> {
  const token = authService.getToken()
  const result = await fetch(`${BASE}/api/bid`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ bidId, auctionId }),
  })
  return result.ok
}
