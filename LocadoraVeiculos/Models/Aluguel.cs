using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace LocadoraVeiculos.Models
{
    [Table("Alugueis")]
    public class Aluguel
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public DateTime DataInicio { get; set; }

        [Required]
        public DateTime DataFim { get; set; }

        public DateTime? DataDevolucao { get; set; }

        [Required]
        [Range(0, int.MaxValue, ErrorMessage = "A quilometragem inicial não pode ser negativa.")]
        public int QuilometragemInicial { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "A quilometragem final não pode ser negativa.")]
        public int? QuilometragemFinal { get; set; }

        [Required]
        [Range(0.01, 999999, ErrorMessage = "O valor da diária deve ser maior que zero.")]
        [Column(TypeName = "decimal(10,2)")]
        public decimal ValorDiaria { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal? ValorTotal { get; set; }

        // Chave estrangeira Cliente
        [Required]
        public int ClienteId { get; set; }

        [ForeignKey("ClienteId")]
        [JsonIgnore]
        public Cliente Cliente { get; set; }

        // Chave estrangeira Veiculo
        [Required]
        public int VeiculoId { get; set; }

        [ForeignKey("VeiculoId")]
        [JsonIgnore]
        public Veiculo Veiculo { get; set; }
    }
}
