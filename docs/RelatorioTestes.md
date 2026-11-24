# Relatório de Testes – Locadora de Veículos API

**Ferramenta:** Swagger UI (`https://localhost:7001/swagger`)
**Banco:** SQL Server Express – `LocadoraVeiculosDB`
**Data dos testes:** ____/____/______

> Para cada teste: execute no Swagger (botão **Try it out** → **Execute**), tire um print mostrando **a requisição** (corpo/parâmetros) e **a resposta** (código + corpo), salve em `docs/prints/` com o nome indicado e confira se o código bate com o esperado.
> Siga a ordem: os testes de cima criam os dados usados nos de baixo.

## 1. Fabricantes

| # | Método / Rota | Entrada | Esperado | Obtido | Print |
|---|---|---|---|---|---|
| 1.1 | POST `/api/Fabricantes` | `{ "nome": "Volkswagen" }` | 201 | | `01-fab-post.png` |
| 1.2 | POST `/api/Fabricantes` | `{ "nome": "Fiat" }` | 201 | | `02-fab-post2.png` |
| 1.3 | POST `/api/Fabricantes` (inválido) | `{ "nome": "" }` | 400 | | `03-fab-post-invalido.png` |
| 1.4 | GET `/api/Fabricantes` | – | 200 + lista | | `04-fab-get.png` |
| 1.5 | GET `/api/Fabricantes/{id}` | `id = 1` | 200 | | `05-fab-getid.png` |
| 1.6 | GET `/api/Fabricantes/{id}` | `id = 999` | 404 | | `06-fab-getid-404.png` |
| 1.7 | PUT `/api/Fabricantes/{id}` | `id = 2`, `{ "id": 2, "nome": "Fiat Brasil" }` | 204 | | `07-fab-put.png` |
| 1.8 | PUT `/api/Fabricantes/{id}` (ID divergente) | `id = 2`, `{ "id": 3, "nome": "X" }` | 400 | | `08-fab-put-400.png` |

## 2. Categorias

| # | Método / Rota | Entrada | Esperado | Obtido | Print |
|---|---|---|---|---|---|
| 2.1 | POST `/api/Categorias` | `{ "nome": "Hatch" }` | 201 | | `09-cat-post.png` |
| 2.2 | POST `/api/Categorias` | `{ "nome": "SUV" }` | 201 | | `10-cat-post2.png` |
| 2.3 | GET `/api/Categorias` | – | 200 | | `11-cat-get.png` |
| 2.4 | GET `/api/Categorias/{id}` | `id = 1` | 200 | | `12-cat-getid.png` |
| 2.5 | PUT `/api/Categorias/{id}` | `id = 2`, `{ "id": 2, "nome": "SUV Compacto" }` | 204 | | `13-cat-put.png` |

## 3. Clientes

| # | Método / Rota | Entrada | Esperado | Obtido | Print |
|---|---|---|---|---|---|
| 3.1 | POST `/api/Clientes` | `{ "nome": "Maria Silva", "cpf": "12345678900", "email": "maria@email.com" }` | 201 | | `14-cli-post.png` |
| 3.2 | POST `/api/Clientes` | `{ "nome": "João Souza", "cpf": "98765432100", "email": "joao@email.com" }` | 201 | | `15-cli-post2.png` |
| 3.3 | POST `/api/Clientes` (e-mail inválido) | `{ "nome": "Teste", "cpf": "11122233344", "email": "abc" }` | 400 | | `16-cli-post-400.png` |
| 3.4 | GET `/api/Clientes` | – | 200 | | `17-cli-get.png` |
| 3.5 | GET `/api/Clientes/{id}` | `id = 1` | 200 | | `18-cli-getid.png` |
| 3.6 | PUT `/api/Clientes/{id}` | `id = 2`, `{ "id": 2, "nome": "João P. Souza", "cpf": "98765432100", "email": "joao@email.com" }` | 204 | | `19-cli-put.png` |

## 4. Veículos

| # | Método / Rota | Entrada | Esperado | Obtido | Print |
|---|---|---|---|---|---|
| 4.1 | POST `/api/Veiculos` | `{ "modelo": "Gol", "anoFabricacao": 2022, "quilometragem": 15000, "fabricanteId": 1, "categoriaId": 1 }` | 201 | | `20-vei-post.png` |
| 4.2 | POST `/api/Veiculos` | `{ "modelo": "Pulse", "anoFabricacao": 2023, "quilometragem": 5000, "fabricanteId": 2, "categoriaId": 2 }` | 201 | | `21-vei-post2.png` |
| 4.3 | POST `/api/Veiculos` (km negativa) | `{ "modelo": "X", "anoFabricacao": 2020, "quilometragem": -1, "fabricanteId": 1, "categoriaId": 1 }` | 400 | | `22-vei-post-400.png` |
| 4.4 | POST `/api/Veiculos` (fabricante inexistente) | `{ "modelo": "X", "anoFabricacao": 2020, "quilometragem": 0, "fabricanteId": 999, "categoriaId": 1 }` | 500 (violação de FK) | | `23-vei-post-fk.png` |
| 4.5 | GET `/api/Veiculos` | – | 200 | | `24-vei-get.png` |
| 4.6 | GET `/api/Veiculos/{id}` | `id = 1` | 200 | | `25-vei-getid.png` |
| 4.7 | PUT `/api/Veiculos/{id}` | `id = 1`, `{ "id": 1, "modelo": "Gol 1.0", "anoFabricacao": 2022, "quilometragem": 15500, "fabricanteId": 1, "categoriaId": 1 }` | 204 | | `26-vei-put.png` |

## 5. Aluguéis

| # | Método / Rota | Entrada | Esperado | Obtido | Print |
|---|---|---|---|---|---|
| 5.1 | POST `/api/Alugueis` | `{ "dataInicio": "2026-10-01T10:00:00", "dataFim": "2026-10-05T10:00:00", "quilometragemInicial": 15500, "valorDiaria": 120.00, "clienteId": 1, "veiculoId": 1 }` | 201 | | `27-alu-post.png` |
| 5.2 | POST `/api/Alugueis` (diária zero) | mesmo corpo com `"valorDiaria": 0` | 400 | | `28-alu-post-400.png` |
| 5.3 | GET `/api/Alugueis` | – | 200 | | `29-alu-get.png` |
| 5.4 | GET `/api/Alugueis/{id}` | `id = 1` | 200 | | `30-alu-getid.png` |
| 5.5 | PUT `/api/Alugueis/{id}` (registrar devolução) | `id = 1`, corpo do 5.1 com `"id": 1, "dataDevolucao": "2026-10-05T09:00:00", "quilometragemFinal": 16000, "valorTotal": 480.00` | 204 | | `31-alu-put.png` |

## 6. Filtros (JOINs)

> Antes do filtro 4, crie mais um aluguel **sem** devolução (repita o 5.1 com `"clienteId": 2`, `"veiculoId": 1`) para aparecer resultado.

| # | Rota | Esperado | Obtido | Print |
|---|---|---|---|---|
| 6.1 | GET `/api/Clientes/ComOuSemAlugueis` (LEFT JOIN) | 200 – todos os clientes, com `possuiAluguel` true/false | | `32-filtro1.png` |
| 6.2 | GET `/api/Veiculos/Detalhes` (INNER JOIN) | 200 – veículos com nome do fabricante e categoria | | `33-filtro2.png` |
| 6.3 | GET `/api/Veiculos/NuncaAlugados` (LEFT JOIN) | 200 – apenas o Pulse | | `34-filtro3.png` |
| 6.4 | GET `/api/Alugueis/Ativos` (INNER JOIN) | 200 – aluguéis sem devolução | | `35-filtro4.png` |
| 6.5 | GET `/api/Alugueis/PorCategoria/1` (INNER JOIN) | 200 – aluguéis de veículos Hatch | | `36-filtro5.png` |

## 7. Exclusões (por último)

| # | Método / Rota | Entrada | Esperado | Obtido | Print |
|---|---|---|---|---|---|
| 7.1 | DELETE `/api/Fabricantes/{id}` (com veículos) | `id = 1` | 500 (restrição de FK – integridade preservada) | | `37-fab-delete-fk.png` |
| 7.2 | DELETE `/api/Alugueis/{id}` | `id = 1` | 204 | | `38-alu-delete.png` |
| 7.3 | DELETE `/api/Veiculos/{id}` | `id = 2` | 204 | | `39-vei-delete.png` |
| 7.4 | DELETE `/api/Clientes/{id}` | `id = 999` | 404 | | `40-cli-delete-404.png` |
| 7.5 | DELETE `/api/Categorias/{id}` | `id = 2` | 204 | | `41-cat-delete.png` |

## Conclusão

_Resumo dos resultados: quantidade de testes executados, quantos passaram e observações._

## Evidências

<!-- Inclua os prints abaixo, ex.: -->
<!-- ![1.1 POST Fabricante](prints/01-fab-post.png) -->
