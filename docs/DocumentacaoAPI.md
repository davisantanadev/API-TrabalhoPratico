# Documentação da API – Locadora de Veículos

**Base URL (local):** `https://localhost:7001`
**Swagger UI:** `https://localhost:7001/swagger`
**Formato:** JSON (`Content-Type: application/json`)

## Códigos de resposta usados

| Código | Significado | Quando ocorre |
|---|---|---|
| 200 OK | Sucesso | GET retornou dados |
| 201 Created | Criado | POST criou o registro (retorna o objeto e o header `Location`) |
| 204 No Content | Sucesso sem corpo | PUT e DELETE bem-sucedidos |
| 400 Bad Request | Requisição inválida | Campos obrigatórios ausentes, formato inválido (ex.: e-mail), valores fora da faixa, ou ID da rota diferente do ID do corpo no PUT |
| 404 Not Found | Não encontrado | ID inexistente em GET/{id}, PUT ou DELETE |
| 500 Internal Server Error | Erro interno | Falha no banco (ex.: chave estrangeira inexistente, exclusão de registro que possui dependentes, banco fora do ar) |

---

## 1. Fabricantes – `/api/Fabricantes`

| Método | Rota | Parâmetros | Corpo | Respostas |
|---|---|---|---|---|
| GET | `/api/Fabricantes` | – | – | 200, 500 |
| GET | `/api/Fabricantes/{id}` | `id` (rota, int) | – | 200, 404, 500 |
| POST | `/api/Fabricantes` | – | Fabricante | 201, 400, 500 |
| PUT | `/api/Fabricantes/{id}` | `id` (rota, int) | Fabricante | 204, 400, 404, 500 |
| DELETE | `/api/Fabricantes/{id}` | `id` (rota, int) | – | 204, 404, 500 |

```json
{ "id": 0, "nome": "Volkswagen" }
```
Regras: `nome` obrigatório, máx. 100 caracteres.

## 2. Categorias – `/api/Categorias`

| Método | Rota | Parâmetros | Corpo | Respostas |
|---|---|---|---|---|
| GET | `/api/Categorias` | – | – | 200, 500 |
| GET | `/api/Categorias/{id}` | `id` (rota, int) | – | 200, 404, 500 |
| POST | `/api/Categorias` | – | Categoria | 201, 400, 500 |
| PUT | `/api/Categorias/{id}` | `id` (rota, int) | Categoria | 204, 400, 404, 500 |
| DELETE | `/api/Categorias/{id}` | `id` (rota, int) | – | 204, 404, 500 |

```json
{ "id": 0, "nome": "SUV" }
```
Regras: `nome` obrigatório, máx. 50 caracteres.

## 3. Clientes – `/api/Clientes`

| Método | Rota | Parâmetros | Corpo | Respostas |
|---|---|---|---|---|
| GET | `/api/Clientes` | – | – | 200, 500 |
| GET | `/api/Clientes/{id}` | `id` (rota, int) | – | 200, 404, 500 |
| POST | `/api/Clientes` | – | Cliente | 201, 400, 500 |
| PUT | `/api/Clientes/{id}` | `id` (rota, int) | Cliente | 204, 400, 404, 500 |
| DELETE | `/api/Clientes/{id}` | `id` (rota, int) | – | 204, 404, 500 |
| GET | `/api/Clientes/ComOuSemAlugueis` | – | – | 200, 500 |

```json
{ "id": 0, "nome": "Maria Silva", "cpf": "123.456.789-00", "email": "maria@email.com" }
```
Regras: `nome` obrigatório (máx. 200); `cpf` obrigatório (11 a 14 caracteres); `email` obrigatório e em formato válido.

## 4. Veículos – `/api/Veiculos`

| Método | Rota | Parâmetros | Corpo | Respostas |
|---|---|---|---|---|
| GET | `/api/Veiculos` | – | – | 200, 500 |
| GET | `/api/Veiculos/{id}` | `id` (rota, int) | – | 200, 404, 500 |
| POST | `/api/Veiculos` | – | Veiculo | 201, 400, 500 |
| PUT | `/api/Veiculos/{id}` | `id` (rota, int) | Veiculo | 204, 400, 404, 500 |
| DELETE | `/api/Veiculos/{id}` | `id` (rota, int) | – | 204, 404, 500 |
| GET | `/api/Veiculos/Detalhes` | – | – | 200, 500 |
| GET | `/api/Veiculos/NuncaAlugados` | – | – | 200, 500 |

```json
{ "id": 0, "modelo": "Gol", "anoFabricacao": 2022, "quilometragem": 15000, "fabricanteId": 1, "categoriaId": 1 }
```
Regras: `modelo` obrigatório (máx. 100); `anoFabricacao` entre 1950 e 2100; `quilometragem` ≥ 0; `fabricanteId` e `categoriaId` devem existir.

## 5. Aluguéis – `/api/Alugueis`

| Método | Rota | Parâmetros | Corpo | Respostas |
|---|---|---|---|---|
| GET | `/api/Alugueis` | – | – | 200, 500 |
| GET | `/api/Alugueis/{id}` | `id` (rota, int) | – | 200, 404, 500 |
| POST | `/api/Alugueis` | – | Aluguel | 201, 400, 500 |
| PUT | `/api/Alugueis/{id}` | `id` (rota, int) | Aluguel | 204, 400, 404, 500 |
| DELETE | `/api/Alugueis/{id}` | `id` (rota, int) | – | 204, 404, 500 |
| GET | `/api/Alugueis/Ativos` | – | – | 200, 500 |
| GET | `/api/Alugueis/PorCategoria/{categoriaId}` | `categoriaId` (rota, int) | – | 200, 500 |

```json
{
  "id": 0,
  "dataInicio": "2026-10-01T10:00:00",
  "dataFim": "2026-10-05T10:00:00",
  "dataDevolucao": null,
  "quilometragemInicial": 15000,
  "quilometragemFinal": null,
  "valorDiaria": 120.00,
  "valorTotal": null,
  "clienteId": 1,
  "veiculoId": 1
}
```
Regras: datas e `quilometragemInicial` obrigatórias; `valorDiaria` > 0; `clienteId` e `veiculoId` devem existir. A devolução é registrada via PUT preenchendo `dataDevolucao`, `quilometragemFinal` e `valorTotal`.

---

## Filtros (consultas com JOIN)

| # | Rota | Tipo de JOIN | Descrição |
|---|---|---|---|
| 1 | `GET /api/Clientes/ComOuSemAlugueis` | LEFT JOIN (Clientes × Aluguéis) | Lista todos os clientes, indicando se possuem aluguel |
| 2 | `GET /api/Veiculos/Detalhes` | INNER JOIN (Veículos × Fabricantes × Categorias) | Veículos com nome do fabricante e da categoria |
| 3 | `GET /api/Veiculos/NuncaAlugados` | LEFT JOIN + `IS NULL` (Veículos × Aluguéis) | Veículos que nunca foram alugados |
| 4 | `GET /api/Alugueis/Ativos` | INNER JOIN (Aluguéis × Clientes × Veículos) | Aluguéis sem devolução registrada |
| 5 | `GET /api/Alugueis/PorCategoria/{categoriaId}` | INNER JOIN (Aluguéis × Veículos) | Aluguéis de veículos de uma categoria |
