namespace LocadoraVeiculos.Controllers
{
    internal static class LikeHelper
    {
        // Escapa \ % _ para uso com EF.Functions.Like(campo, padrao, "\\").
        public static string Contem(string valor) =>
            "%" + valor.Trim().Replace("\\", "\\\\").Replace("%", "\\%").Replace("_", "\\_") + "%";
    }
}
