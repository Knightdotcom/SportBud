using SportBud.Api.Core.Interfaces;
using SportBud.Api.Data.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Security.Claims;

namespace SportBud.Api.Controllers
{
    // Hanterar alla HTTP-anrop relaterade till auktioner
    [Route("api/[controller]")]
    [ApiController]
    public class AuctionController : ControllerBase
    {
        private readonly IAuctionService _auctionService;

        // Konstruktor som tar emot auktionsservice via dependency injection
        public AuctionController(IAuctionService auctionService)
        {
            _auctionService = auctionService;
        }

        [SwaggerOperation(Summary = "Hämtar en auktion via ID")]
        [HttpGet("/auctions/{auctionId}")]
        public async Task<IActionResult> GetById(int auctionId)
        {
            var result = await _auctionService.GetById(auctionId);
            return Ok(result.Data);
        }

        [SwaggerOperation(Summary = "Söker bland öppna auktioner baserat på sökord")]
        [Route("/open/search")]
        [HttpGet]
        public async Task<IActionResult> SearchOpenAuctions(string search)
        {
            var result = await _auctionService.GetAllOpenAsync(search);
            return Ok(result.Data);
        }

        [SwaggerOperation(Summary = "Hämtar alla öppna auktioner")]
        [Route("/open/all")]
        [HttpGet]
        public async Task<IActionResult> GetAllOpenAuctions()
        {
            var result = await _auctionService.GetAllOpenAsync();
            return Ok(result.Data);
        }

        [SwaggerOperation(Summary = "Söker bland alla auktioner (inklusive stängda) baserat på sökord")]
        [Route("/all/search")]
        [HttpGet]
        public async Task<IActionResult> SearchAllAuctions(string search)
        {
            var result = await _auctionService.GetAllAsync(search);
            return Ok(result.Data);
        }

        [SwaggerOperation(Summary = "Hämtar alla auktioner inklusive stängda (kräver Admin)")]
        [Route("/all")]
        [HttpGet]
        public async Task<IActionResult> AllAuctions()
        {
            var result = await _auctionService.GetAllAsync();
            return Ok(result.Data);
        }

        // Skapar en ny auktion - hämtar användar-id från JWT-token i anropet
        [SwaggerOperation(Summary = "Skapar en ny auktion (kräver inloggning)")]
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateAuction(CreateAuctionDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId is null) return Unauthorized();

            var result = await _auctionService.AddAsync(dto, userId);
            return result.IsSucces ? Ok(result.Data) : BadRequest(result.Error);
        }

        // Uppdaterar en auktion - bara ägaren kan uppdatera sin auktion
        [SwaggerOperation(Summary = "Uppdaterar en auktion (kräver inloggning, bara ägaren)")]
        [Authorize]
        [HttpPut]
        public async Task<IActionResult> UpdateAuction(int auctionId, UpdateAuctionDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId is null) return Unauthorized();

            var result = await _auctionService.UpdateAsync(dto, auctionId, userId);
            return result.IsSucces ? Ok(result.Data) : BadRequest(result.Error);
        }

        [SwaggerOperation(Summary = "Avaktiverar en auktion (kräver Admin-roll)")]
        [Route("/deactivate")]
        [HttpPut]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeActivateAuction(AdminDeactivateAuctionDto dto, int auctionId)
        {
            var result = await _auctionService.DeActivateAuction(dto, auctionId);
            return result.IsSucces ? Ok(result.Data) : BadRequest(result.Error);
        }
    }
}
