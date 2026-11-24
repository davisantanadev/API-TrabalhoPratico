# Roteiro do pitch em vídeo – Locadora de Veículos (TP2)

**Duração alvo:** ~4 min (limite: 5 min)
**Stack:** API ASP.NET Core 8 + EF Core + SQLite (TP1) · Front-end React + Vite + Bootstrap (TP2)
**Escopo do vídeo:** problema, modelagem e duas consultas (banco e rota) com resultado na tela, com foco nas telas produzidas.

---

## Bloco 1 – Gancho e problema (00:00 a 00:50)

| Tempo | O que mostrar na tela | Fala |
|---|---|---|
| 00:00 – 00:12 | Título "Locadora de Veículos" sobre a tela do Painel | "Numa locadora, a pergunta mais cara é simples: qual carro está na rua, com quem, e até quando?" |
| 00:12 – 00:50 | Tela do Painel (Dashboard) | "Muitas locadoras ainda controlam isso em caderno ou planilha. O resultado aparece no balcão: carro alugado que figura como disponível, devolução esquecida e cliente esperando enquanto alguém procura um papel. O problema é a falta de um controle central da frota, dos clientes e dos aluguéis, consultável em tempo real." |

## Bloco 2 – Solução e arquitetura (00:50 a 01:20)

| Tempo | O que mostrar na tela | Fala |
|---|---|---|
| 00:50 – 01:20 | Diagrama simples: React → API REST → SQLite | "Construí o sistema em três camadas. O atendente usa um front-end em React com Vite e Bootstrap. Esse front conversa com uma API REST em ASP.NET Core 8, que valida os dados e aplica as regras. Os dados ficam num banco SQLite, acessado pelo Entity Framework Core. O front nunca fala direto com o banco." |

## Bloco 3 – Modelagem (01:20 a 02:00)

| Tempo | O que mostrar na tela | Fala |
|---|---|---|
| 01:20 – 01:35 | Wireframe no Figma: https://www.figma.com/design/aIJADObNyI8M4PpqKf1J1X (passar rápido pelas telas) | "Antes de programar, desenhei o wireframe das telas no Figma. Ele guiou o que vocês vão ver agora." |
| 01:35 – 02:00 | Diagrama das 5 entidades com setas 1:N: Fabricante, Categoria, Veículo, Cliente, Aluguel | "A modelagem tem cinco entidades. Fabricante e Categoria classificam o Veículo. Veículo e Cliente se ligam ao Aluguel, que guarda a data de início, a data prevista de fim e, quando o carro volta, a data de devolução. Todos os relacionamentos são de um para muitos: um fabricante tem vários veículos, uma categoria tem vários veículos, um cliente tem vários aluguéis e um veículo tem vários aluguéis. Se a data de devolução está vazia, o aluguel está ativo." |

## Bloco 4 – Demonstração (02:00 a 03:40)

### 4a – CRUD de veículo e filtro por fabricante e ano (02:00 a 02:30)

| Tempo | O que mostrar na tela | Fala |
|---|---|---|
| 02:00 – 02:15 | Tela Veículos > "Novo veículo": cadastrar Gol, ano 2022, fabricante Volkswagen, categoria Hatch | "Vamos ao sistema. Cadastro um veículo com modelo, fabricante, categoria, ano e quilometragem. Se o ano estiver fora da faixa, o formulário avisa, e a API também recusa com 400." |
| 02:15 – 02:30 | Filtros de fabricante e de ano; aba Rede do navegador ou Swagger mostrando `GET /api/Veiculos?fabricanteId=1&anoMin=2020&anoMax=2024`; caixa de SQL (ver anexo) | "Agora filtro por fabricante e faixa de ano. O front chama GET /api/Veiculos com esses parâmetros, e no banco isso vira um WHERE: fabricante igual a 1 e ano entre 2020 e 2024." |

### 4b – Consulta 1: Detalhes dos veículos (INNER JOIN) (02:30 a 02:55)

| Tempo | O que mostrar na tela | Fala |
|---|---|---|
| 02:30 – 02:55 | Tela Consultas > aba "Detalhes dos veículos": badge INNER JOIN, rota `GET /api/Veiculos/Detalhes`, contador de registros, tabela com fabricante e categoria, caixa de SQL | "A primeira consulta é Detalhes dos veículos. A rota é GET /api/Veiculos/Detalhes e ela faz um INNER JOIN entre Veículos, Fabricantes e Categorias. Em vez de ver um número, o atendente vê o nome do fabricante e da categoria de cada carro. O SQL aqui embaixo é o equivalente da consulta." |

### 4c – Consulta 2: Aluguéis ativos (INNER JOIN) (02:55 a 03:15)

| Tempo | O que mostrar na tela | Fala |
|---|---|---|
| 02:55 – 03:15 | Tela Consultas > aba "Aluguéis ativos": badge INNER JOIN, rota `GET /api/Alugueis/Ativos`, caixa de SQL, lista com cliente e veículo | "A segunda consulta é Aluguéis ativos, a rota GET /api/Alugueis/Ativos. Ela cruza Aluguéis com Clientes e Veículos e filtra os aluguéis sem data de devolução. É a lista que o balcão usa para saber quem está com cada carro agora." |

### 4d – Registrar devolução e ver o aluguel sair da lista (03:15 a 03:40)

| Tempo | O que mostrar na tela | Fala |
|---|---|---|
| 03:15 – 03:30 | Tela Aluguéis > ação "Registrar devolução" em um aluguel ativo; preencher data e km final; salvar; aviso de sucesso | "Agora registro a devolução de um desses aluguéis. Ao salvar, o sistema faz um PUT com a data de devolução, a quilometragem final e o valor total." |
| 03:30 – 03:40 | Voltar a Consultas > "Aluguéis ativos": o registro sumiu e o contador diminuiu | "Ao voltar na consulta, o aluguel saiu da lista, porque a data de devolução deixou de ser nula. A consulta lê o banco, não uma cópia guardada na tela." |

## Bloco 5 – Fechamento (03:40 a 03:55)

| Tempo | O que mostrar na tela | Fala |
|---|---|---|
| 03:40 – 03:55 | Painel do sistema, depois slide com o nome do grupo | "Resumindo: o problema é a falta de controle da frota e dos aluguéis. A modelagem com cinco entidades e relacionamentos de um para muitos sustenta esse controle, e as consultas com JOIN entregam a informação na hora em que o atendente precisa. Se você tem uma locadora, pense em quantos carros estão na rua agora e com quem estão. O sistema responde em um clique. Obrigado!" |

---

## Anexo – SQL equivalente às consultas

Os blocos abaixo são o SQL equivalente ao LINQ dos controllers (`VeiculosController.GetVeiculosDetalhes`, `AlugueisController.GetAlugueisAtivos` e o filtro de `GetVeiculos`). São equivalentes, não capturas do log: o SQL exato gerado pelo EF Core pode ser conferido no console ao rodar a API.

**Consulta 1 – `GET /api/Veiculos/Detalhes` (INNER JOIN)**
```sql
SELECT v.Id, v.Modelo, v.AnoFabricacao, v.Quilometragem,
       v.FabricanteId, f.Nome AS FabricanteNome,
       v.CategoriaId, c.Nome AS CategoriaNome
FROM Veiculos v
INNER JOIN Fabricantes f ON f.Id = v.FabricanteId
INNER JOIN Categorias c ON c.Id = v.CategoriaId;
```

**Consulta 2 – `GET /api/Alugueis/Ativos` (INNER JOIN com filtro de devolução)**
```sql
SELECT a.Id AS AluguelId, a.DataInicio,
       c.Id AS ClienteId, c.Nome AS ClienteNome,
       v.Id AS VeiculoId, v.Modelo AS VeiculoModelo, a.ValorDiaria
FROM Alugueis a
INNER JOIN Clientes c ON c.Id = a.ClienteId
INNER JOIN Veiculos v ON v.Id = a.VeiculoId
WHERE a.DataDevolucao IS NULL;
```

**Filtro da demonstração 4a – `GET /api/Veiculos?fabricanteId=1&anoMin=2020&anoMax=2024`**
```sql
SELECT * FROM Veiculos
WHERE FabricanteId = 1
  AND AnoFabricacao >= 2020
  AND AnoFabricacao <= 2024;
```

---

## Checklist de gravação

**Ambiente**
- [ ] API no ar: `cd D:\Faculdade\TADS\TrabalhoPratico01\LocadoraVeiculos` e depois `dotnet run --launch-profile LocadoraVeiculos` (https://localhost:7001; Swagger em /swagger).
- [ ] Banco criado: `dotnet ef database update` (o arquivo `locadora.db` precisa existir).
- [ ] Front no ar: `cd D:\Faculdade\TADS\TrabalhoPratico01\frontend` e depois `npm run dev` (http://localhost:5173). Confirmar que a tela carrega sem o aviso de API indisponível.
- [ ] Figma aberto no link antes de gravar, já no frame de wireframe.

**Dados de exemplo (cadastrar antes de gravar)**
- [ ] 2 fabricantes (ex.: Volkswagen e Fiat).
- [ ] 2 categorias (ex.: Hatch e SUV).
- [ ] 2 clientes.
- [ ] 3 veículos, sendo um deles sem aluguel (para o CRUD poder excluí-lo sem erro 409).
- [ ] 2 aluguéis ativos (sem data de devolução) e 1 devolvido, para a consulta 2 ter registros.
- [ ] Um veículo com ano dentro da faixa 2020–2024 e um fabricante com mais de um veículo, para o filtro 4a ter resultado.

**Gravação**
- [ ] Resolução 1920×1080, zoom do navegador em 100%, favoritos ocultos, notificações do sistema desligadas.
- [ ] Ferramenta: OBS Studio (captura de tela e microfone, cobre navegador e Figma). O Xbox Game Bar (Win+Alt+R) grava só a janela em foco, então pode não servir para o trecho com Figma e Swagger.
- [ ] Ensaio com cronômetro: a fala completa deve ficar perto de 4 min.
- [ ] Gravar em blocos (um por bloco do roteiro) e montar no final.
- [ ] Cortar para no máximo 5 min e exportar em MP4 1080p.
