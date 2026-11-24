# Locadora de Veículos - Front-end (TP2)

Front-end em React + Vite (JavaScript) + Bootstrap 5 + react-router-dom que consome a API ASP.NET da pasta `LocadoraVeiculos/`.

## Como rodar

1. Suba a API primeiro (ela deve ficar em `https://localhost:7001`):
   ```
   cd ..\LocadoraVeiculos
   dotnet run
   ```
2. Em outro terminal, instale e rode o front-end:
   ```
   cd frontend
   npm install
   npm run dev
   ```
3. Abra http://localhost:5173

O Vite faz proxy de `/api` para `https://localhost:7001` (`vite.config.js`, com `secure: false` por causa do certificado de desenvolvimento), então não há problema de CORS.

Para apontar para outra API, crie um `.env.local` com `VITE_API_URL=https://outro-host:porta` (padrão: vazio, usa o proxy).

## Build

```
npm run build
```

## Telas

- **Painel**: totais de cada entidade, aluguéis ativos e veículos nunca alugados.
- **Fabricantes, Categorias, Clientes, Veículos, Aluguéis**: filtros, tabela, criar/editar em modal, exclusão com confirmação. Em Aluguéis há o badge Ativo/Devolvido e a ação "Registrar devolução".
- **Consultas**: as 5 consultas com JOIN, mostrando a rota chamada e a descrição do JOIN.

## Estrutura

```
src/
  api/client.js      cliente fetch central (JSON, 204, erros)
  api/index.js       recursos da API e consultas
  components/        CrudPage (tela CRUD genérica), Modal, Toasts, etc.
  entities.jsx       configuração de cada entidade (campos, filtros, validação)
  pages/             Dashboard e Consultas
```
