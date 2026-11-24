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
    public class ClientesController : ControllerBase
    {
        private readonly ApplicationContext _context;

        public ClientesController(ApplicationContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Cliente>>> GetClientes([FromQuery] string nome, [FromQuery] string cpf, [FromQuery] string email)
        {
            try
            {
                IQueryable<Cliente> query = _context.Clientes;
                if (!string.IsNullOrWhiteSpace(nome))
                    query = query.Where(c => EF.Functions.Like(c.Nome, LikeHelper.Contem(nome), "\\"));
                if (!string.IsNullOrWhiteSpace(cpf))
                    query = query.Where(c => EF.Functions.Like(c.CPF, LikeHelper.Contem(cpf), "\\"));
                if (!string.IsNullOrWhiteSpace(email))
                    query = query.Where(c => EF.Functions.Like(c.Email, LikeHelper.Contem(email), "\\"));
                return await query.ToListAsync();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Cliente>> GetCliente(int id)
        {
            try
            {
                var cliente = await _context.Clientes.FindAsync(id);
                if (cliente == null) return NotFound("Cliente não encontrado.");
                return cliente;
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<ActionResult<Cliente>> PostCliente(Cliente cliente)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                _context.Clientes.Add(cliente);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetCliente), new { id = cliente.Id }, cliente);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutCliente(int id, Cliente cliente)
        {
            if (id != cliente.Id) return BadRequest("ID divergente.");
            if (!ModelState.IsValid) return BadRequest(ModelState);

            _context.Entry(cliente).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClienteExists(id)) return NotFound("Cliente não encontrado.");
                else throw;
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno: {ex.Message}");
            }
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCliente(int id)
        {
            try
            {
                var cliente = await _context.Clientes.FindAsync(id);
                if (cliente == null) return NotFound("Cliente não encontrado.");

                if (await _context.Alugueis.AnyAsync(a => a.ClienteId == id))
                    return Conflict("Não é possível excluir: existem aluguéis vinculados a este cliente.");

                _context.Clientes.Remove(cliente);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno: {ex.Message}");
            }
        }

        // ==========================================
        // FILTRO 1 (LEFT JOIN)
        // ==========================================
        [HttpGet("ComOuSemAlugueis")]
        public async Task<IActionResult> GetClientesComOuSemAlugueis()
        {
            try
            {
                // Utilizando sintaxe LINQ para LEFT JOIN (Cliente left join Aluguel)
                var query = from c in _context.Clientes
                            join a in _context.Alugueis on c.Id equals a.ClienteId into alugueisGroup
                            from a in alugueisGroup.DefaultIfEmpty()
                            select new
                            {
                                ClienteId = c.Id,
                                ClienteNome = c.Nome,
                                ClienteCPF = c.CPF,
                                PossuiAluguel = a != null,
                                AluguelId = a != null ? a.Id : (int?)null
                            };

                var resultado = await query.ToListAsync();
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno: {ex.Message}");
            }
        }

        private bool ClienteExists(int id) => _context.Clientes.Any(e => e.Id == id);
    }
}
