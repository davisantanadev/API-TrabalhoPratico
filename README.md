# Locadora de Veículos – TP1 + TP2 (TADS)

Sistema de gestão de frota e aluguéis de uma locadora de veículos.

- **TP1:** API RESTful em ASP.NET Core 8 + Entity Framework Core + SQLite + Swagger.
- **TP2:** front-end em React + Vite + Bootstrap 5, integrado à API do TP1.

Repositório: https://github.com/davisantanadev/API-TrabalhoPratico

## Estrutura do repositório

| Pasta / arquivo | Conteúdo |
|---|---|
| `LocadoraVeiculos/` | Back-end (TP1): API ASP.NET Core 8, EF Core, modelos, controllers e banco SQLite `locadora.db` |
| `frontend/` | Front-end (TP2): aplicação React + Vite + Bootstrap que consome a API |
| `docs/` | Documentação: `DocumentacaoAPI.md` (endpoints), `RoteiroVideo.md` (roteiro do pitch), `RelatorioTestes.md`, `wireframes/` (telas desenhadas), `screenshots/` (capturas do front-end) |
| `README.md` | Este arquivo |

## Pré-requisitos

- .NET SDK 8
- Node.js (versão LTS recente, com npm)

Não é preciso instalar SQL Server: o banco é um arquivo SQLite (`LocadoraVeiculos/locadora.db`) que já vem com dados de exemplo. Também não há migrations para rodar.

## Como rodar a API (back-end)

```powershell
cd LocadoraVeiculos
dotnet run --launch-profile LocadoraVeiculos
```

- A API sobe em `https://localhost:7001`.
- Swagger: `https://localhost:7001/swagger`.
- Se o navegador reclamar do certificado HTTPS de desenvolvimento, confie nele uma vez com:
  ```powershell
  dotnet dev-certs https --trust
  ```

## Como rodar o front-end

Com a API em execução, em outro terminal:

```powershell
cd frontend
npm install
npm run dev
```

Abra http://localhost:5173. O Vite faz proxy de `/api` para `https://localhost:7001`, então não há problema de CORS no uso normal.

## Documentação

- [Documentação da API (endpoints, códigos de resposta e filtros)](docs/DocumentacaoAPI.md)
- [Roteiro do pitch em vídeo](docs/RoteiroVideo.md)
- [README do front-end (telas, estrutura e build)](frontend/README.md)
- Wireframes no Figma: https://www.figma.com/design/aIJADObNyI8M4PpqKf1J1X
