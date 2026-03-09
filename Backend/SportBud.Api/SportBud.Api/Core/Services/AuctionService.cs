using SportBud.Api.Core.Interfaces;
using SportBud.Api.Data.Constants;
using SportBud.Api.Data.DTO;
using SportBud.Api.Data.Entities;
using SportBud.Api.Data.Interfaces;

namespace SportBud.Api.Core.Services
{
    // Innehåller affärslogiken för auktioner, implementerar IAuctionService
    public class AuctionService : IAuctionService
    {
        private readonly IAuctionRepo _repo;
        private readonly IBidRepo _bidRepo;

        // Konstruktor som tar emot auktions- och bud-repository via dependency injection
        public AuctionService(IAuctionRepo repo, IBidRepo bidRepo)
        {
            _repo = repo;
            _bidRepo = bidRepo;
        }

        // Skapar en ny auktion baserat på DTO-data och kopplar den till användaren
        public async Task<Result<CreateAuctionResponeDto?>> AddAsync(CreateAuctionDto dto, string userId)
        {
            var entity = new Auction
            {
                Title = dto.Title,
                Description = dto.Description,
                StartPrice = dto.StartPrice,
                StartAtUtc = dto.StartAtUtc,
                EndAtUtc = dto.EndAtUtc,
                UserId = userId,
            };

            var result = await _repo.AddAsync(entity);

            if (result is null)
                return Result<CreateAuctionResponeDto?>.Fail(ErrorMessages.AddEntityFailed);

            var responseDto = new CreateAuctionResponeDto
            {
                AuctionId = result.AuctionId,
                UserId = result.UserId,
                IsOpen = result.IsOpen
            };

            return Result<CreateAuctionResponeDto?>.Ok(responseDto);
        }

        // Admin-metod som aktiverar eller inaktiverar en auktion
        // Returnerar fel om auktionen inte finns eller om statusen redan är densamma
        public async Task<Result<UpdateAuctionResponseDto>> DeActivateAuction(AdminDeactivateAuctionDto dto, int auctionId)
        {
            var auction = await _repo.FindByIdAsync(auctionId);

            if (auction is null)
                return Result<UpdateAuctionResponseDto>.Fail(ErrorMessages.EntityWithIdNotFound);

            if (auction.IsDeactivatedByAdmin == dto.IsDeactivatedByAdmin)
                return Result<UpdateAuctionResponseDto>.Fail(ErrorMessages.UpdateFailed);

            auction.IsDeactivatedByAdmin = dto.IsDeactivatedByAdmin;
            var result = await _repo.SaveChangesAsync();

            if (!result)
                return Result<UpdateAuctionResponseDto>.Fail(ErrorMessages.FailSaveAsync);

            var respDto = new UpdateAuctionResponseDto
            {
                Title = auction.Title,
                IsOpen = auction.IsOpen,
                UserName = auction.User?.UserName,
                Description = auction.Description,
                ImageUrl = auction.ImageUrl,
                StartPrice = auction.StartPrice,
                IsDeactivatedByAdmin = auction.IsDeactivatedByAdmin
            };

            return Result<UpdateAuctionResponseDto>.Ok(respDto);
        }

        // Hämtar alla auktioner med sökning på titel, beräknar högsta budet för varje auktion
        public async Task<Result<List<AuctionsGetResponseDto>>> GetAllAsync(string search)
        {
            var result = await _repo.GetAllAsync(search);

            var dto = result.Select(a => new AuctionsGetResponseDto
            {
                Id = a.AuctionId,
                UserId = a.User?.Id,
                Title = a.Title,
                Description = a.Description,
                StartPrice = a.StartPrice,
                IsOpen = a.IsOpen,
                ImageUrl = a.ImageUrl ?? string.Empty,
                StartDateUtc = a.StartAtUtc,
                EndDateUtc = a.EndAtUtc,
                IsDeactivatedByAdmin = a.IsDeactivatedByAdmin
            }).ToList();

            foreach (var a in dto)
            {
                var highestBid = await _bidRepo.HighestBidByAuctionId(a.Id);
                if (highestBid != null)
                {
                    a.HighestBid = new BidsGetDto
                    {
                        BidId = highestBid.Id,
                        AuctionId = highestBid.AuctionId,
                        BidAmount = highestBid.BidAmount,
                        UserName = highestBid.User?.UserName,
                        BidDateTime = highestBid.BidTimeUtc
                    };
                }
            }

            return Result<List<AuctionsGetResponseDto>>.Ok(dto);
        }

        // Hämtar alla auktioner utan sökning, beräknar högsta budet för varje auktion
        public async Task<Result<List<AuctionsGetResponseDto>>> GetAllAsync()
        {
            var result = await _repo.GetAllAsync();

            var dto = result.Select(a => new AuctionsGetResponseDto
            {
                Id = a.AuctionId,
                UserId = a.User?.Id,
                Title = a.Title,
                Description = a.Description,
                StartPrice = a.StartPrice,
                IsOpen = a.IsOpen,
                ImageUrl = a.ImageUrl ?? string.Empty,
                StartDateUtc = a.StartAtUtc,
                EndDateUtc = a.EndAtUtc,
                IsDeactivatedByAdmin = a.IsDeactivatedByAdmin
            }).ToList();

            foreach (var a in dto)
            {
                var highestBid = await _bidRepo.HighestBidByAuctionId(a.Id);
                if (highestBid != null)
                {
                    a.HighestBid = new BidsGetDto
                    {
                        BidId = highestBid.Id,
                        UserId = highestBid.User?.Id,
                        AuctionId = highestBid.AuctionId,
                        BidAmount = highestBid.BidAmount,
                        UserName = highestBid.User?.UserName,
                        BidDateTime = highestBid.BidTimeUtc
                    };
                }
            }

            return Result<List<AuctionsGetResponseDto>>.Ok(dto);
        }

        // Hämtar bara öppna auktioner, beräknar högsta budet för varje auktion
        public async Task<Result<List<AuctionsGetResponseDto>>> GetAllOpenAsync()
        {
            var result = await _repo.GetAllOpenAsync();

            var dto = result.Select(a => new AuctionsGetResponseDto
            {
                Id = a.AuctionId,
                UserId = a.User?.Id,
                Title = a.Title,
                Description = a.Description,
                StartPrice = a.StartPrice,
                IsOpen = a.IsOpen,
                ImageUrl = a.ImageUrl ?? string.Empty,
                StartDateUtc = a.StartAtUtc,
                EndDateUtc = a.EndAtUtc,
                IsDeactivatedByAdmin = a.IsDeactivatedByAdmin
            }).ToList();

            foreach (var a in dto)
            {
                var highestBid = await _bidRepo.HighestBidByAuctionId(a.Id);
                if (highestBid != null)
                {
                    a.HighestBid = new BidsGetDto
                    {
                        AuctionId = highestBid.AuctionId,
                        BidAmount = highestBid.BidAmount,
                        UserName = highestBid.User?.UserName,
                        BidDateTime = highestBid.BidTimeUtc
                    };
                }
            }

            return Result<List<AuctionsGetResponseDto>>.Ok(dto);
        }

        // Hämtar öppna auktioner med sökning på titel
        public async Task<Result<List<AuctionsGetResponseDto>>> GetAllOpenAsync(string search)
        {
            var result = await _repo.GetAllOpenAsync(search);

            var dto = result.Select(a => new AuctionsGetResponseDto
            {
                Id = a.AuctionId,
                UserId = a.User?.Id,
                Title = a.Title,
                Description = a.Description,
                StartPrice = a.StartPrice,
                IsOpen = a.IsOpen,
                ImageUrl = a.ImageUrl ?? string.Empty,
                StartDateUtc = a.StartAtUtc,
                EndDateUtc = a.EndAtUtc,
                IsDeactivatedByAdmin = a.IsDeactivatedByAdmin
            }).ToList();

            foreach (var a in dto)
            {
                var highestBid = await _bidRepo.HighestBidByAuctionId(a.Id);
                if (highestBid != null)
                {
                    a.HighestBid = new BidsGetDto
                    {
                        AuctionId = highestBid.AuctionId,
                        BidAmount = highestBid.BidAmount,
                        UserName = highestBid.User?.UserName,
                        BidDateTime = highestBid.BidTimeUtc
                    };
                }
            }

            return Result<List<AuctionsGetResponseDto>>.Ok(dto);
        }

        // Uppdaterar en auktion - kontrollerar ägarskap och förhindrar prisändring om det finns bud
        // Endast fält som skickas med uppdateras, övriga behålls oförändrade
        public async Task<Result<UpdateAuctionResponseDto>> UpdateAsync(UpdateAuctionDto dto, int auctionId, string userId)
        {
            var bids = await _bidRepo.BidsByAuctionId(auctionId) ?? new List<Bid>();
            var entity = await _repo.FindByIdAsync(auctionId);

            if (entity is null)
                return Result<UpdateAuctionResponseDto>.Fail(ErrorMessages.EntityWithIdNotFound);

            if (entity.UserId != userId)
                return Result<UpdateAuctionResponseDto>.Fail(ErrorMessages.UpdateElsesAuction);

            if (bids.Any() && dto.StartPrice is not null)
                return Result<UpdateAuctionResponseDto>.Fail(ErrorMessages.BidExistsOnPriceUpdate);

            entity.Title = dto.Title ?? entity.Title;
            entity.Description = dto.Description ?? entity.Description;
            entity.StartPrice = dto.StartPrice ?? entity.StartPrice;
            entity.EndAtUtc = dto.newEndDateUtc ?? entity.EndAtUtc;
            entity.ImageUrl = dto.ImageUrl ?? entity.ImageUrl;

            var success = await _repo.SaveChangesAsync();

            if (!success)
                return Result<UpdateAuctionResponseDto>.Fail(ErrorMessages.FailSaveAsync);

            var responseDto = new UpdateAuctionResponseDto
            {
                Title = entity.Title,
                Description = entity.Description,
                StartPrice = entity.StartPrice,
                ImageUrl = entity.ImageUrl,
                IsOpen = entity.IsOpen,
                IsDeactivatedByAdmin = entity.IsDeactivatedByAdmin
            };

            return Result<UpdateAuctionResponseDto>.Ok(responseDto);
        }

        // Hämtar en specifik auktion med dess högsta bud baserat på id
        public async Task<Result<AuctionsGetResponseDto>> GetById(int auctionId)
        {
            var auction = await _repo.FindByIdAsync(auctionId);

            if (auction is null)
                return Result<AuctionsGetResponseDto>.Fail(ErrorMessages.EntityWithIdNotFound);

            var highestBid = await _bidRepo.HighestBidByAuctionId(auctionId);
            var highestBidDto = new BidsGetDto();

            if (highestBid is not null)
            {
                highestBidDto.UserName = highestBid.User?.UserName;
                highestBidDto.BidAmount = highestBid.BidAmount;
                highestBidDto.BidDateTime = highestBid.BidTimeUtc;
            }

            var responseDto = new AuctionsGetResponseDto
            {
                Id = auction.AuctionId,
                UserId = auction.UserId,
                Title = auction.Title,
                Description = auction.Description,
                StartPrice = auction.StartPrice,
                HighestBid = highestBidDto,
                ImageUrl = auction.ImageUrl,
                IsOpen = auction.IsOpen,
                StartDateUtc = auction.StartAtUtc,
                EndDateUtc = auction.EndAtUtc,
                IsDeactivatedByAdmin = auction.IsDeactivatedByAdmin
            };

            return Result<AuctionsGetResponseDto>.Ok(responseDto);
        }
    }
}
