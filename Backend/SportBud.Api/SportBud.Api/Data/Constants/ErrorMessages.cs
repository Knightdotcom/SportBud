namespace SportBud.Api.Data.Constants
{
    // Samling av svenska felmeddelanden som används i hela applikationen
    public static class ErrorMessages
    {
        public const string AddEntityFailed = "Kunde inte lägga till i databasen";
        public const string BidExistsOnPriceUpdate = "Kan inte ändra pris när det finns bud";
        public const string EntityWithIdNotFound = "Objektet hittades inte";
        public const string FailSaveAsync = "Något gick fel vid sparning";
        public const string UserCredentialsMissing = "Ogiltiga uppgifter för ny användare";
        public const string UserNotFound = "Felaktigt användarnamn eller e-post";
        public const string WrongPassword = "Felaktigt lösenord";
        public const string FailedAddingRole = "Misslyckades med att tilldela roll";
        public const string HigherBidExists = "Budet måste vara högre än nuvarande högsta bud";
        public const string BidOnOwnAuction = "Du kan inte buda på din egna auktion";
        public const string DeleteBidThatIsNotUsers = "Du kan bara ta bort ditt eget bud";
        public const string Unauthorized = "Inte behörig";
        public const string UpdateElsesAuction = "Du äger inte denna auktion";
        public const string BidLowerThanStartPrice = "Budet är lägre än startpriset";
        public const string BidIsNotLatest = "Du kan bara ta bort det senaste budet";
        public const string AuctionIsClosed = "Auktionen är avslutad";
        public const string UpdateFailed = "Ingen uppdatering gjordes";
        public const string DeActivatedByAdmin = "Kontot är inaktiverat";
    }
}
