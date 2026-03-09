# SportBud – Auktionsplattform för Sportprylar

SportBud är en fullstack-webbapplikation där användare kan lägga upp och buda på begagnade sportprylar. Projektet består av ett REST API byggt i ASP.NET Core och ett frontend byggt i React med TypeScript.

---

## Teknikstack

### Backend
- **ASP.NET Core Web API** (.NET 9) – hanterar all affärslogik och data
- **Entity Framework Core** – kommunikation med databasen via kod (ORM)
- **SQL Server / LocalDB** – lagrar användare, auktioner och bud
- **ASP.NET Core Identity** – inbyggt system för användarhantering och lösenordssäkerhet
- **JWT (JSON Web Token)** – autentisering, användaren får en token vid inloggning
- **AutoMapper** – konverterar mellan databasentiteter och DTO:er
- **Swagger / Swashbuckle** – automatiskt genererat API-dokumentationsgränssnitt

### Frontend
- **React 19** med **TypeScript** – komponentbaserat användargränssnitt
- **Vite** – snabb utvecklingsserver och byggverktyg
- **React Router** – klientsidesnavigering mellan sidor
- **React Bootstrap + Bootstrap** – responsiv layout och färdiga UI-komponenter
- **Context API** – global state-hantering (inloggning och auktioner)
- **jwt-decode** – läser av innehållet i JWT-token i webbläsaren

---

## Arkitektur

### Backend – lager-struktur
```
Controllers      → tar emot HTTP-anrop och returnerar svar
Services         → innehåller affärslogiken
Repositories     → kommunicerar med databasen via Entity Framework
Entities         → databasmodeller (Auction, Bid, AppUser)
DTO:er           → dataöverföringsobjekt, bestämmer vad som skickas/tas emot
```

Varje lager kommunicerar bara med lagret under sig. Controllern anropar service, service anropar repo, repo pratar med databasen. Detta gör koden lättare att underhålla och testa.

### Result-mönster
Alla service-metoder returnerar ett `Result<T>`-objekt som innehåller antingen data eller ett felmeddelande. Det undviker undantag (exceptions) för förväntade fel.

### Frontend – mappstruktur
```
components/    → presentationskomponenter (Header, AuctionCard, Searchbar m.fl.)
containers/    → logikkomponenter som hämtar data och hanterar events
pages/         → sidkomponenter kopplade till routes
context/       → global state via AuthProvider och AuctionProvider
services/      → alla API-anrop mot backend
types/         → TypeScript-interface för all data
helpers/       → hjälpfunktioner (t.ex. datumformatering)
```

---

## Funktioner

### Användare
- Registrera konto med användarnamn, e-post och lösenord
- Logga in och få en JWT-token som sparas i webbläsaren
- Se och uppdatera sitt konto via "Min sida"
- Byta lösenord

### Auktioner
- Se alla öppna auktioner på startsidan
- Söka efter auktioner med sökfält
- Klicka på en auktion för att se detaljer och lägga bud
- Skapa egna auktioner (inloggad krävs)
- Auktioner stängs automatiskt när slutdatum passeras

### Bud
- Lägga bud på öppna auktioner
- Högsta bud visas i realtid på auktionskortet
- Bud under nuvarande högstbud accepteras inte

### Adminroller
- Admin kan se alla användare och auktioner
- Admin kan avaktivera användare och auktioner
- Separata rollkontroller med `[Authorize(Roles = "Admin")]`

---

## Roller och testanvändare

Dessa användare skapas automatiskt när applikationen startas (seed-data):

| Användarnamn | Lösenord   | Roll  |
|--------------|------------|-------|
| admin        | admin1     | Admin |
| sofia_b      | sportUser  | User  |
| marcus_h     | sportUser  | User  |
| lena_p       | sportUser  | User  |
| johan_e      | sportUser  | User  |

---

## API-endpoints (urval)

| Metod  | Endpoint              | Beskrivning                        | Auth krävs |
|--------|-----------------------|------------------------------------|------------|
| POST   | /login                | Logga in, returnerar JWT-token     | Nej        |
| POST   | /api/User             | Registrera ny användare            | Nej        |
| GET    | /open/all             | Hämta alla öppna auktioner         | Nej        |
| GET    | /open/search          | Sök bland öppna auktioner          | Nej        |
| POST   | /api/Auction          | Skapa ny auktion                   | Ja         |
| PUT    | /api/Auction          | Uppdatera auktion                  | Ja         |
| POST   | /api/Bid              | Lägga ett bud                      | Ja         |
| GET    | /allUsers             | Hämta alla användare (admin)       | Admin      |
| PUT    | /deactivate           | Avaktivera auktion (admin)         | Admin      |

---

## Så här kör du projektet

### Krav
- Visual Studio 2022 med .NET 9 SDK
- SQL Server LocalDB (följer med Visual Studio)
- Node.js (LTS) – för frontend

### Backend
1. Öppna `SportBud.Api.sln` i Visual Studio
2. Kontrollera att connection string i `appsettings.Development.json` stämmer
3. Öppna **Package Manager Console** och kör:
```
Add-Migration InitialCreate
Update-Database
```
4. Tryck **F5** eller kör `dotnet run` – backend startar på `https://localhost:7064`
5. Swagger finns på `https://localhost:7064/swagger`

### Frontend
1. Öppna en terminal och navigera till frontend-mappen:
```
cd SportBud/Frontend/SportBudReact
```
2. Installera paket:
```
npm install
```
3. Starta frontend:
```
npm run dev
```
4. Öppna webbläsaren på `http://localhost:5173`

---

## Säkerhet

- Lösenord hashas automatiskt av ASP.NET Core Identity (bcrypt)
- JWT-token valideras vid varje skyddat anrop
- Token innehåller användar-ID och roll – backend verifierar att rätt användare gör rätt sak
- CORS är konfigurerat så att endast frontend-ursprunget tillåts anropa API:et

---

## Databasmodell (förenklad)

```
AppUser
  - Id, UserName, Email, FirstName, LastName, IsActiveUser

Auction
  - Id, Title, Description, StartPrice, StartDateUtc, EndDateUtc
  - IsOpen, IsDeactivatedByAdmin, ImageUrl
  - FK → AppUser (UserId)

Bid
  - Id, Amount, CreatedAt
  - FK → Auction (AuctionId)
  - FK → AppUser (UserId)
```

---

*Projektet är byggt som en inlämningsuppgift och demonstrerar fullstack-webbutveckling med modern teknik inom både .NET och React-ekosystemet.*
