# SportBud — Auktionsplattform för Sportprylar

SportBud är en fullstack-webbapplikation där användare kan lägga upp och buda på begagnade sportprylar. Projektet är byggt med ASP.NET Core 9 som backend-API och React 19 med TypeScript som frontend.

---

## Teknikstack

### Backend
| Teknologi | Användning |
|-----------|------------|
| **ASP.NET Core Web API (.NET 9)** | REST API, affärslogik och endpoints |
| **Entity Framework Core** | ORM för databashantering |
| **SQL Server / LocalDB** | Lagring av användare, auktioner och bud |
| **ASP.NET Core Identity** | Användarhantering, lösenordshashning |
| **JWT (JSON Web Tokens)** | Stateless autentisering |
| **AutoMapper** | Mappning mellan entiteter och DTO:er |
| **Swagger / Swashbuckle** | Interaktiv API-dokumentation |

### Frontend
| Teknologi | Användning |
|-----------|------------|
| **React 19 + TypeScript** | Komponentbaserat användargränssnitt |
| **Vite** | Snabb utvecklingsserver och byggverktyg |
| **React Router** | Klientsidesnavigering |
| **React Bootstrap + Bootstrap** | Responsiv layout och UI-komponenter |
| **Context API** | Global state-hantering (auth + auktioner) |
| **jwt-decode** | Avkodning av JWT-token i webbläsaren |

---

## Arkitektur

### Backend — lagerstruktur

```
SportBud.Api/
├── Controllers/        → Tar emot HTTP-anrop och returnerar svar
├── Services/           → Affärslogik
├── Repositories/       → Databasåtkomst via Entity Framework
├── Entities/           → Databasmodeller (Auction, Bid, AppUser)
├── DTOs/               → Dataöverföringsobjekt
└── Extensions/         → Konfigurationshjälpare (JWT, CORS, Swagger)
```

Varje lager kommunicerar bara med lagret under sig. Controllern anropar service, service anropar repo, repo kommunicerar med databasen. Alla serviceoperationer returnerar ett `Result<T>`-objekt med antingen data eller ett felmeddelande — exceptions används aldrig för förväntade fel.

### Frontend — mappstruktur

```
src/
├── components/         → Presentationskomponenter (Header, AuctionCard, Searchbar m.fl.)
├── containers/         → Logikkomponenter som hämtar data och hanterar events
├── pages/              → Sidkomponenter kopplade till routes
├── context/            → Global state via AuthProvider och AuctionProvider
├── services/           → Alla API-anrop mot backend
├── types/              → TypeScript-interface för all data
└── helpers/            → Hjälpfunktioner (t.ex. datumformatering)
```

---

## Funktioner

### Användare
- Registrera konto med användarnamn, e-post och lösenord
- Logga in och få en JWT-token som sparas i webbläsaren
- Se och uppdatera sin profil via "Min sida"
- Byta lösenord

### Auktioner
- Bläddra bland alla öppna auktioner på startsidan
- Söka och filtrera auktioner
- Klicka på en auktion för att se detaljer och lägga bud
- Skapa egna auktioner (kräver inloggning)
- Auktioner stängs automatiskt när slutdatumet passeras

### Bud
- Lägga bud på öppna auktioner
- Högsta aktuella bud visas i realtid
- Bud som är lägre än nuvarande högstbud avvisas

### Admin
- Adminpanel med översikt av alla användare och auktioner
- Avaktivera användare och auktioner
- Rollbaserad åtkomstkontroll via `[Authorize(Roles = "Admin")]`

---

## Roller och testanvändare

Dessa användare skapas automatiskt vid applikationsstart (seed-data):

| Användarnamn | Lösenord   | Roll  |
|--------------|------------|-------|
| admin        | admin1     | Admin |
| sofia_b      | sportUser  | User  |
| marcus_h     | sportUser  | User  |
| lena_p       | sportUser  | User  |
| johan_e      | sportUser  | User  |

---

## API-endpoints

| Metod  | Endpoint              | Beskrivning                          | Auth      |
|--------|-----------------------|--------------------------------------|-----------|
| POST   | `/login`              | Logga in — returnerar JWT-token      | Nej       |
| POST   | `/api/User`           | Registrera ny användare              | Nej       |
| GET    | `/open/all`           | Hämta alla öppna auktioner           | Nej       |
| GET    | `/open/search`        | Sök bland öppna auktioner            | Nej       |
| POST   | `/api/Auction`        | Skapa ny auktion                     | JWT       |
| PUT    | `/api/Auction`        | Uppdatera auktion                    | JWT       |
| DELETE | `/api/Auction`        | Ta bort auktion                      | JWT       |
| POST   | `/api/Bid`            | Lägg ett bud                         | JWT       |
| GET    | `/allUsers`           | Hämta alla användare                 | Admin     |
| PUT    | `/deactivate`         | Avaktivera auktion                   | Admin     |

> Fullständig dokumentation finns i Swagger UI när API:et körs.

---

## Kom igång

### Krav
- Visual Studio 2022 med .NET 9 SDK
- SQL Server LocalDB (medföljer Visual Studio)
- Node.js LTS

### 1. Starta backend

1. Öppna `SportBud.Api.sln` i Visual Studio
2. Konfigurera connection string i `appsettings.Development.json`
3. Kör migrationer i **Package Manager Console**:
```bash
Add-Migration InitialCreate
Update-Database
```
4. Starta med **F5** — API:et körs på `https://localhost:7064`
5. Swagger UI finns på `https://localhost:7064/swagger`

### 2. Starta frontend

```bash
cd SportBud/Frontend/SportBudReact
npm install
npm run dev
```

Öppna webbläsaren på `http://localhost:5173`

---

## Säkerhet

- Lösenord hashas automatiskt av ASP.NET Core Identity (bcrypt)
- JWT-token valideras vid varje skyddat anrop
- Token innehåller användar-ID och roll — backend verifierar att rätt användare gör rätt sak
- CORS är konfigurerat så att endast tillåtna ursprung kan anropa API:et

---

## Databasmodell

```
AppUser
  ├── Id, UserName, Email, FirstName, LastName
  └── IsActiveUser

Auction
  ├── Id, Title, Description, StartPrice
  ├── StartDateUtc, EndDateUtc, IsOpen, IsDeactivatedByAdmin
  ├── ImageUrl
  └── FK → AppUser (UserId)

Bid
  ├── Id, Amount, CreatedAt
  ├── FK → Auction (AuctionId)
  └── FK → AppUser (UserId)
```

---

*Projektet demonstrerar fullstack-webbutveckling med modern teknik inom .NET 9 och React-ekosystemet.*
