using SportBud.Api.Core.Interfaces;
using SportBud.Api.Data.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Security.Claims;

namespace SportBud.Api.Controllers
{
    // Hanterar alla HTTP-anrop relaterade till bud
    [Route("api/[controller]")]
    [ApiController]
    public class BidController : ControllerBase
    {
        private readonly IBidService _bidService;

        // Konstruktor som tar emot budservice via dependency injection
        public BidController(IBidService bidService)
        {
            _bidService = bidService;
        }

        [SwaggerOperation(Summary = "Lägger ett bud på en auktion (kräver inloggning)")]
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> AddBid(AddBidDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId is null) return Unauthorized();

            var result = await _bidService.AddBidAsync(dto, userId);
            return result.IsSucces ? Ok(result.Data) : BadRequest(result.Error);
        }

        [SwaggerOperation(Summary = "Tar bort ett bud (kräver inloggning, bara budskaparen)")]
        [Authorize]
        [HttpDelete]
        public async Task<IActionResult> DeleteBid(DeleteBidDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId is null) return Unauthorized();

            var result = await _bidService.DeleteAsync(dto, userId);
            return result.IsSucces ? Ok(result.Data) : BadRequest(result.Error);
        }

        [SwaggerOperation(Summary = "Hämtar alla bud för en specifik auktion")]
        [HttpGet]
        public async Task<IActionResult> GetBidsByAuction(int auctionId)
        {
            var result = await _bidService.GetBidsForAuction(auctionId);
            return Ok(result.Data);
        }

        [SwaggerOperation(Summary = "Hämtar det högsta budet för en specifik auktion")]
        [Route("/highest")]
        [HttpGet]
        public async Task<IActionResult> GetHighestBidByAuction([FromQuery] int auctionId)
        {
            var result = await _bidService.GetHighestBidsForAuction(auctionId);
            if (!result.IsSucces) return BadRequest(result.Error);
            if (result.Data is null) return NoContent();
            return Ok(result.Data);
        }

        [SwaggerOperation(Summary = "Hämtar alla bud gjorda av den inloggade användaren (kräver inloggning)")]
        [Authorize]
        [HttpGet("/bids/user")]
        public async Task<IActionResult> GetBidsByUser()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId is null) return Unauthorized();

            var result = await _bidService.GetBidsByUser(userId);
            return Ok(result.Data);
        }
    }
}
