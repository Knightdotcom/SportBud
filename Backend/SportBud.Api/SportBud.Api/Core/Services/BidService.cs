using SportBud.Api.Core.Interfaces;
using SportBud.Api.Data.Constants;
using SportBud.Api.Data.DTO;
using SportBud.Api.Data.Entities;
using SportBud.Api.Data.Interfaces;

namespace SportBud.Api.Core.Services
{
    // Innehåller affärslogiken för bud, implementerar IBidService
    public class BidService : IBidService
    {
        private readonly IBidRepo _bidRepo;
        private readonly IAuctionRepo _auctionRepo;

        // Konstruktor som tar emot bud- och auktions-repository via dependency injection
        public BidService(IBidRepo bidRepo, IAuctionRepo auctionRepo)
        {
            _bidRepo = bidRepo;
            _auctionRepo = auctionRepo;
        }

        // Lägger ett nytt bud med flera valideringar:
        // - Auktionen måste finnas och vara öppen
        // - Budet får inte vara lägre än startpriset
        // - Man kan inte buda på sin egna auktion
        // - Budet måste vara högre än nuvarande högsta bud
        public async Task<Result<AddBidResponseDto>> AddBidAsync(AddBidDto dto, string userId)
        {
            var auctionExists = await _auctionRepo.FindByIdAsync(dto.AuctionId);

            if (auctionExists is null)
                return Result<AddBidResponseDto>.Fail(ErrorMessages.EntityWithIdNotFound);

            if (!auctionExists.IsOpen)
                return Result<AddBidResponseDto>.Fail(ErrorMessages.AuctionIsClosed);

            if (dto.Amount < auctionExists.StartPrice)
                return Result<AddBidResponseDto>.Fail(ErrorMessages.BidLowerThanStartPrice);

            if (auctionExists.UserId == userId)
                return Result<AddBidResponseDto>.Fail(ErrorMessages.BidOnOwnAuction);

            var highestBid = await _bidRepo.HighestBidByAuctionId(dto.AuctionId);

            if (highestBid?.BidAmount >= dto.Amount && highestBid is not null)
                return Result<AddBidResponseDto>.Fail(ErrorMessages.HigherBidExists);

            var bidEntity = new Bid
            {
                BidAmount = dto.Amount,
                UserId = userId,
                AuctionId = dto.AuctionId
            };

            var result = await _bidRepo.AddAsync(bidEntity);

            if (result is null)
                return Result<AddBidResponseDto>.Fail(ErrorMessages.AddEntityFailed);

            var responseDto = new AddBidResponseDto
            {
                UserId = result.UserId ?? string.Empty,
                AuctionId = result.AuctionId,
                BidId = result.Id,
                BidDateTime = result.BidTimeUtc,
                Amount = result.BidAmount
            };

            return Result<AddBidResponseDto>.Ok(responseDto);
        }

        // Tar bort ett bud med valideringar:
        // - Auktionen måste vara öppen
        // - Man kan bara ta bort sitt eget bud
        // - Man kan bara ta bort det senaste (högsta) budet
        public async Task<Result<DeleteBidResponseDto>> DeleteAsync(DeleteBidDto dto, string userId)
        {
            var auctionEntity = await _auctionRepo.FindByIdAsync(dto.AuctionId);

            if (auctionEntity is null)
                return Result<DeleteBidResponseDto>.Fail(ErrorMessages.EntityWithIdNotFound);

            if (!auctionEntity.IsOpen)
                return Result<DeleteBidResponseDto>.Fail(ErrorMessages.AuctionIsClosed);

            var bidEntity = await _bidRepo.FindByIdAsync(dto.BidId);

            if (bidEntity is null)
                return Result<DeleteBidResponseDto>.Fail(ErrorMessages.EntityWithIdNotFound);

            var highestBid = await _bidRepo.HighestBidByAuctionId(dto.AuctionId);

            if (highestBid is null)
                return Result<DeleteBidResponseDto>.Fail(ErrorMessages.EntityWithIdNotFound);

            if (bidEntity.BidAmount < highestBid.BidAmount)
                return Result<DeleteBidResponseDto>.Fail(ErrorMessages.BidIsNotLatest);

            if (bidEntity.UserId != userId)
                return Result<DeleteBidResponseDto>.Fail(ErrorMessages.DeleteBidThatIsNotUsers);

            var result = await _bidRepo.DeleteAsync(dto.BidId);

            if (!result)
                return Result<DeleteBidResponseDto>.Fail(ErrorMessages.FailSaveAsync);

            return Result<DeleteBidResponseDto>.Ok(new DeleteBidResponseDto { Message = ResponseMessages.DeleteSuccess });
        }

        // Hämtar alla bud som en specifik användare har lagt
        public async Task<Result<List<BidsGetDto>>> GetBidsByUser(string userId)
        {
            var bids = await _bidRepo.GetBidByUserId(userId);

            var resultList = bids.Select(b => new BidsGetDto
            {
                BidId = b.Id,
                AuctionId = b.AuctionId,
                UserId = b.UserId,
                BidAmount = b.BidAmount,
                BidDateTime = b.BidTimeUtc,
                UserName = b.User?.UserName
            }).ToList();

            return Result<List<BidsGetDto>>.Ok(resultList);
        }

        // Hämtar alla bud för en specifik auktion, sorterade efter belopp
        public async Task<Result<List<BidsGetDto>>> GetBidsForAuction(int auctionId)
        {
            var bidsList = await _bidRepo.BidsByAuctionId(auctionId);

            var dto = bidsList.Select(b => new BidsGetDto
            {
                BidId = b.Id,
                UserId = b.UserId,
                BidAmount = b.BidAmount,
                BidDateTime = b.BidTimeUtc,
                UserName = b.User?.UserName,
                AuctionId = b.AuctionId
            }).ToList();

            return Result<List<BidsGetDto>>.Ok(dto);
        }

        // Hämtar det högsta budet för en specifik auktion
        public async Task<Result<BidsGetDto>> GetHighestBidsForAuction(int auctionId)
        {
            var highestBid = await _bidRepo.HighestBidByAuctionId(auctionId);

            if (highestBid is null)
                return Result<BidsGetDto>.Fail(ErrorMessages.EntityWithIdNotFound);

            var dto = new BidsGetDto
            {
                BidId = highestBid.Id,
                AuctionId = highestBid.AuctionId,
                UserId = highestBid.UserId,
                BidAmount = highestBid.BidAmount,
                BidDateTime = highestBid.BidTimeUtc,
                UserName = highestBid.User?.UserName
            };

            return Result<BidsGetDto>.Ok(dto);
        }
    }
}
