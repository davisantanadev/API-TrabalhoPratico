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
    public class VeiculosController : ControllerBase
    {
        private readonly ApplicationContext _context;

        public VeiculosController(ApplicationContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Veiculo>>> GetVeiculos()
        {
            try
            {
                return await _context.Veiculos.ToListAsync();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Veiculo>> GetVeiculo(int id)
        {
            try
            {
                var veiculo = await _context.Veiculos.FindAsync(id);
                if (veiculo == null) return NotFound("Veículo não encontrado.");
                return veiculo;
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<ActionResult<Veiculo>> PostVeiculo(Veiculo veiculo)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                _context.Veiculos.Add(veiculo);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetVeiculo), new { id = veiculo.Id }, veiculo);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutVeiculo(int id, Veiculo veiculo)
        {
            if (id != veiculo.Id) return BadRequest("ID divergente.");
            if (!ModelState.IsValid) return BadRequest(ModelState);

            _context.Entry(veiculo).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VeiculoExists(id)) return NotFound("Veículo não encontrado.");
                else throw;
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno: {ex.Message}");
            }
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVeiculo(int id)
        {
            try
            {
                var veiculo = await _context.Veiculos.FindAsync(id);
                if (veiculo == null) return NotFound("Veículo não encontrado.");

                _context.Veiculos.Remove(veiculo);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno: {ex.Message}");
            }
        }

        // ==========================================
        // FILTRO 2 (INNER JOIN)
        // ==========================================
        [HttpGet("Detalhes")]
        public async Task<IActionResult> GetVeiculosDetalhes()
        {
            try
            {
                // Utilizando Include que traduz para INNER JOIN pois FabricanteId e CategoriaId são chaves estrangeiras requeridas (non-nullable).
                var veiculos = await _context.Veiculos
                    .Include(v => v.Fabricante)
                    .Include(v => v.Categoria)
                    .Select(v => new
                    {
                        v.Modelo,
                        v.AnoFabricacao,
                        FabricanteNome = v.Fabricante.Nome,
                        CategoriaNome = v.Categoria.Nome
                    })
                    .ToListAsync();

                return Ok(veiculos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno: {ex.Message}");
            }
        }

        // ==========================================
        // FILTRO 3 (LEFT JOIN simulando ANTI JOIN)
        // ==========================================
        [HttpGet("NuncaAlugados")]
        public async Task<IActionResult> GetVeiculosNuncaAlugados()
        {
            try
            {
                // LEFT JOIN explícito buscando onde aluguel é nulo
                var query = from v in _context.Veiculos
                            join a in _context.Alugueis on v.Id equals a.VeiculoId into alugueisGroup
                            from a in alugueisGroup.DefaultIfEmpty()
                            where a == null
                            select new
                            {
                                v.Modelo,
                                v.AnoFabricacao,
                                v.Quilometragem
                            };

                var resultado = await query.ToListAsync();
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno: {ex.Message}");
            }
        }

        private bool VeiculoExists(int id) => _context.Veiculos.Any(e => e.Id == id);
    }
}
