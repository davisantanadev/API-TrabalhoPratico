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
    public class AlugueisController : ControllerBase
    {
        private readonly ApplicationContext _context;

        public AlugueisController(ApplicationContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Aluguel>>> GetAlugueis(
            [FromQuery] int? clienteId, [FromQuery] int? veiculoId, [FromQuery] string status,
            [FromQuery] DateTime? dataInicioDe, [FromQuery] DateTime? dataInicioAte)
        {
            try
            {
                IQueryable<Aluguel> query = _context.Alugueis;
                if (clienteId.HasValue) query = query.Where(a => a.ClienteId == clienteId.Value);
                if (veiculoId.HasValue) query = query.Where(a => a.VeiculoId == veiculoId.Value);
                if (!string.IsNullOrWhiteSpace(status))
                {
                    switch (status.Trim().ToLowerInvariant())
                    {
                        case "ativo": query = query.Where(a => a.DataDevolucao == null); break;
                        case "devolvido": query = query.Where(a => a.DataDevolucao != null); break;
                        default: return BadRequest("Valor inválido para 'status'. Use 'ativo' ou 'devolvido'.");
                    }
                }
                if (dataInicioDe.HasValue)
                {
                    var de = dataInicioDe.Value.Date;
                    query = query.Where(a => a.DataInicio >= de);
                }
                if (dataInicioAte.HasValue)
                {
                    var ate = dataInicioAte.Value.Date.AddDays(1); // inclusivo: até o fim do dia informado
                    query = query.Where(a => a.DataInicio < ate);
                }
                return await query.ToListAsync();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Aluguel>> GetAluguel(int id)
        {
            try
            {
                var aluguel = await _context.Alugueis.FindAsync(id);
                if (aluguel == null) return NotFound("Aluguel não encontrado.");
                return aluguel;
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<ActionResult<Aluguel>> PostAluguel(Aluguel aluguel)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                _context.Alugueis.Add(aluguel);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetAluguel), new { id = aluguel.Id }, aluguel);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutAluguel(int id, Aluguel aluguel)
        {
            if (id != aluguel.Id) return BadRequest("ID divergente.");
            if (!ModelState.IsValid) return BadRequest(ModelState);

            _context.Entry(aluguel).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AluguelExists(id)) return NotFound("Aluguel não encontrado.");
                else throw;
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno: {ex.Message}");
            }
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAluguel(int id)
        {
            try
            {
                var aluguel = await _context.Alugueis.FindAsync(id);
                if (aluguel == null) return NotFound("Aluguel não encontrado.");

                _context.Alugueis.Remove(aluguel);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno: {ex.Message}");
            }
        }

        // ==========================================
        // FILTRO 4 (INNER JOIN múltiplo)
        // ==========================================
        [HttpGet("Ativos")]
        public async Task<IActionResult> GetAlugueisAtivos()
        {
            try
            {
                // Usando explicit join (INNER JOIN) com mais de duas tabelas
                var query = from a in _context.Alugueis
                            join c in _context.Clientes on a.ClienteId equals c.Id
                            join v in _context.Veiculos on a.VeiculoId equals v.Id
                            where a.DataDevolucao == null
                            select new
                            {
                                AluguelId = a.Id,
                                DataInicio = a.DataInicio,
                                ClienteId = c.Id,
                                ClienteNome = c.Nome,
                                VeiculoId = v.Id,
                                VeiculoModelo = v.Modelo,
                                ValorDiaria = a.ValorDiaria
                            };

                var resultado = await query.ToListAsync();
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno: {ex.Message}");
            }
        }

        // ==========================================
        // FILTRO 5 (INNER JOIN)
        // ==========================================
        [HttpGet("PorCategoria/{categoriaId}")]
        public async Task<IActionResult> GetAlugueisPorCategoria(int categoriaId)
        {
            try
            {
                // INNER JOIN entre Aluguel e Veiculo, filtrando pela categoria do veículo
                var query = from a in _context.Alugueis
                            join v in _context.Veiculos on a.VeiculoId equals v.Id
                            where v.CategoriaId == categoriaId
                            select new
                            {
                                AluguelId = a.Id,
                                ClienteId = a.ClienteId,
                                VeiculoId = v.Id,
                                VeiculoModelo = v.Modelo,
                                DataInicio = a.DataInicio
                            };

                var resultado = await query.ToListAsync();
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno: {ex.Message}");
            }
        }

        private bool AluguelExists(int id) => _context.Alugueis.Any(e => e.Id == id);
    }
}
