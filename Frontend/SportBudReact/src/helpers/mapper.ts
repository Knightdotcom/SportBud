import type { AuctionType } from '../types/Types'

// Interface för auktionsdata i tabellformat som används i admin-vyn
export interface AuctionTableType {
  auctionId: number
  title: string
  userName: string
  isOpen: boolean
  isDeactivatedByAdmin: boolean
}

// Mappar ett auktionsobjekt till det format som används i admin-tabellen
export function mapAuctionToTable(auction: AuctionType): AuctionTableType {
  return {
    auctionId: auction.id,
    title: auction.title,
    userName: auction.userName,
    isOpen: auction.isOpen,
    isDeactivatedByAdmin: auction.isDeactivatedByAdmin,
  }
}
