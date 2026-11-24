using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace LocadoraVeiculos.Models
{
    [Table("Fabricantes")]
    public class Fabricante
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "O nome do fabricante é obrigatório.")]
        [MaxLength(100)]
        public string Nome { get; set; }

        [JsonIgnore]
        public ICollection<Veiculo> Veiculos { get; set; }
    }
}
