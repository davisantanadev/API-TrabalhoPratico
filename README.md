# Locadora de Veículos – TP1 (TADS)

API RESTful em ASP.NET Core 8 + Entity Framework Core + SQL Server Express + Swagger.

## Pré-requisitos
- .NET SDK 8
- SQL Server Express (instância `.\SQLEXPRESS`)
- Ferramenta do EF: `dotnet tool install --global dotnet-ef`

## Como executar
```powershell
cd LocadoraVeiculos
dotnet restore
dotnet ef migrations add InicialCriacao
dotnet ef database update
dotnet run --launch-profile LocadoraVeiculos
```
Acesse o Swagger em `https://localhost:7001/swagger`.

## Documentação
- [Documentação dos endpoints](docs/DocumentacaoAPI.md)
- [Relatório de testes](docs/RelatorioTestes.md)
