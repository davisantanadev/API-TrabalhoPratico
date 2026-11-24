using LocadoraVeiculos.Data;
using LocadoraVeiculos.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

namespace LocadoraVeiculos.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FabricantesController : ControllerBase
    {
        private readonly ApplicationContext _context;

        public FabricantesController(ApplicationContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Fabricante>>> GetFabricantes([FromQuery] string nome, [FromQuery] bool? comVeiculos)
        {
            try
            {
                IQueryable<Fabricante> query = _context.Fabricantes;
                if (!string.IsNullOrWhiteSpace(nome))
                    query = query.Where(e => EF.Functions.Like(e.Nome, LikeHelper.Contem(nome), "\\"));
                if (comVeiculos == true)
                    query = query.Where(e => e.Veiculos.Any());
                else if (comVeiculos == false)
                    query = query.Where(e => !e.Veiculos.Any());
                return await query.ToListAsync();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Fabricante>> GetFabricante(int id)
        {
            try
            {
                var fabricante = await _context.Fabricantes.FindAsync(id);
                if (fabricante == null) return NotFound("Fabricante não encontrado.");
                return fabricante;
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<ActionResult<Fabricante>> PostFabricante(Fabricante fabricante)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                _context.Fabricantes.Add(fabricante);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetFabricante), new { id = fabricante.Id }, fabricante);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutFabricante(int id, Fabricante fabricante)
        {
            if (id != fabricante.Id) return BadRequest("O ID informado na rota é diferente do corpo da requisição.");
            if (!ModelState.IsValid) return BadRequest(ModelState);

            _context.Entry(fabricante).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FabricanteExists(id)) return NotFound("Fabricante não encontrado.");
                else throw;
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno: {ex.Message}");
            }
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFabricante(int id)
        {
            try
            {
                var fabricante = await _context.Fabricantes.FindAsync(id);
                if (fabricante == null) return NotFound("Fabricante não encontrado.");

                if (await _context.Veiculos.AnyAsync(v => v.FabricanteId == id))
                    return Conflict("Não é possível excluir: existem veículos vinculados a este fabricante.");

                _context.Fabricantes.Remove(fabricante);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno: {ex.Message}");
            }
        }

        private bool FabricanteExists(int id) => _context.Fabricantes.Any(e => e.Id == id);
    }
}
