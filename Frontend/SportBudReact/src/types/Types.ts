// Representerar en inloggad användare med id, användarnamn, e-post och roller
export interface UserType {
  userId: string;
  userName: string;
  email: string;
  roles: string[];
}

// Representerar en auktion med all dess information, inklusive högsta bud
export interface AuctionType {
  id: number;
  userId: string;
  title: string;
  userName: string;
  description: string;
  startPrice: number;
  highestBid: BidType | null;
  imageUrl: string;
  isOpen: boolean;
  startDateUtc: string;
  endDateUtc: string;
  isDeactivatedByAdmin: boolean;
}

// Data som skickas till backend när en ny auktion skapas
export interface CreateAuctionType {
  title: string;
  description: string;
  startPrice: number;
  imageUrl: string;
  startAtUtc: string;
  endAtUtc: string;
}

// Representerar ett bud med belopp, tidpunkt och information om vem som lade det
export interface BidType {
  auctionId: number;
  userId: string;
  bidAmount: number;
  bidId: number;
  bidDateTime: string;
  userName: string;
}

// Data som skickas till backend vid registrering av ny användare
export interface RegisterUserType {
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  isAdmin: boolean;
}

// Data som skickas till backend vid inloggning
export interface LoginUserType {
  userName: string;
  password: string;
}

// Data som skickas till backend vid lösenordsbyte
export interface UpdatePasswordType {
  oldPassword: string;
  newPassword: string;
}

// Typen för autentiseringscontexten som delas globalt i applikationen
export interface AuthContextType {
  user: UserType | null;
  isLoggedIn: boolean | null;
  refreshUser: () => void;
  logout: () => void;
}

// Representerar svarsdata efter att ett bud lagts
export interface MakeBidType {
  userId: string | null;
  auctionId: number | null;
  bidId: number | null;
  amount: number | null;
  bidDateTime: string | null;
}

// Data som skickas till backend när ett nytt bud läggs
export interface MakeBidRequest {
  auctionId: number;
  amount: number;
}

// Data för att uppdatera en auktion, alla fält är valfria
export interface UpdateAuctionType {
  title?: string;
  description?: string;
  startPrice?: number;
  imageUrl?: string;
  newEndDateUtc?: string;
}

// Formulärvärden för att skapa eller uppdatera en auktion
export interface AuctionFormValues {
  title: string;
  description: string;
  startPrice: number;
  imageUrl: string;
  startAtUtc: string;
  endAtUtc: string;
  hasBid: boolean;
}

// Representerar en användare i admin-tabellen
export interface UserTableType {
  userId: string;
  userName: string;
  userEmail: string;
  isActive: boolean;
}

// Data för att ändra en användares aktiva status
export interface SetUserStatusType {
  userId: string;
  isActive: boolean;
}

// Svar från backend efter inloggning, innehåller token och aktivitetsstatus
export interface LoginResponseType {
  isActive: boolean | null;
  token: string | null;
  error: string | null;
}

// Data för att ändra en auktions aktiva status via admin
export interface SetAuctionStatusType {
  auctionId: number;
  isDeactivatedByAdmin: boolean;
}

// Data som skickas till backend för att ta bort ett specifikt bud
export interface DeleteBidType {
  bidId: number;
  auctionId: number;
}
