namespace SportBud.Api.Data.DTO
{
    // DTO för att skicka budinformation till klienten
    public class BidsGetDto
    {
        public int BidId { get; set; }
        public decimal BidAmount { get; set; }
        public string? UserName { get; set; }
        public string? UserId { get; set; }
        public int AuctionId { get; set; }
        public DateTime BidDateTime { get; set; }
    }

    // DTO för att ta emot data när ett nytt bud läggs
    public class AddBidDto
    {
        public int AuctionId { get; set; }
        public int Amount { get; set; }
    }

    // DTO för svar efter att ett bud har lagts
    public class AddBidResponseDto
    {
        public int AuctionId { get; set; }
        public int BidId { get; set; }
        public string UserId { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public DateTime BidDateTime { get; set; }
    }

    // DTO för svar efter att ett bud har tagits bort, innehåller ett meddelande
    public class DeleteBidResponseDto
    {
        public string Message { get; set; } = string.Empty;
    }

    // DTO för att ta emot data när ett bud ska tas bort
    public class DeleteBidDto
    {
        public int BidId { get; set; }
        public int AuctionId { get; set; }
    }
}
