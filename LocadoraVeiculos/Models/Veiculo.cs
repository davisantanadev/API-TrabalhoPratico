using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace LocadoraVeiculos.Models
{
    [Table("Veiculos")]
    public class Veiculo
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "O modelo é obrigatório.")]
        [MaxLength(100)]
        public string Modelo { get; set; }

        [Required]
        [Range(1950, 2100, ErrorMessage = "Ano de fabricação inválido.")]
        public int AnoFabricacao { get; set; }

        [Required]
        [Range(0, int.MaxValue, ErrorMessage = "A quilometragem não pode ser negativa.")]
        public int Quilometragem { get; set; }

        // Chave estrangeira Fabricante
        [Required]
        public int FabricanteId { get; set; }

        [ForeignKey("FabricanteId")]
        [JsonIgnore]
        public Fabricante Fabricante { get; set; }

        // Chave estrangeira Categoria
        [Required]
        public int CategoriaId { get; set; }

        [ForeignKey("CategoriaId")]
        [JsonIgnore]
        public Categoria Categoria { get; set; }

        [JsonIgnore]
        public ICollection<Aluguel> Alugueis { get; set; }
    }
}
