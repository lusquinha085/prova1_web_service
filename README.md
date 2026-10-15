```markdown
# Sistema de Reservas de Equipamentos e Laboratórios - IFMS

Avaliação Prática do 1º Bimestre — Disciplina de Web Services  
Instituto Federal de Educação, Ciência e Tecnologia de Mato Grosso do Sul

---

## Sumário

- Visão Geral
- Arquitetura da Solução
- Tecnologias Utilizadas
- Instruções de Execução
- Contrato da API — Serviço de Catálogo (Porta 3001)
- Contrato da API — Serviço de Agendamentos (Porta 3000)
- Autenticação e Autorização
- Mapeamento de Status HTTP e Erros
- Guia de Testes
- Regras de Entrega

---

## Visão Geral

Esta aplicação consiste em um sistema distribuído para reserva de laboratórios e equipamentos acadêmicos. A solução é composta por dois microserviços independentes em Node.js com TypeScript e Express, executados em portas distintas e comunicando-se via HTTP.

---

## Arquitetura da Solução

- **Serviço de Catálogo** (`http://localhost:3001`): Atua como provedor de dados. Responsável por manter o cadastro e estado atualizado dos recursos.
- **Serviço de Agendamentos** (`http://localhost:3000`): Atua como consumidor e orquestrador. Recebe solicitações de reserva, valida os dados recebidos, consulta a disponibilidade no Serviço de Catálogo por meio do protocolo HTTP (`fetch`) e registra o agendamento.

---

## Tecnologias Utilizadas

- Node.js
- TypeScript
- Express.js
- tsx (Execução em ambiente de desenvolvimento)

---

## Instruções de Execução

### Pré-requisitos
- Node.js (versão 18 ou superior)
- Gerenciador de pacotes `npm`

---

### Passo 1: Inicializar o Serviço de Catálogo (Terminal 1)

```bash
cd servico-catalogo
npm install
npm run dev

```

*Resultado esperado no console:*

`Catálogo rodando em http://localhost:3001`

---

### Passo 2: Inicializar o Serviço de Agendamentos (Terminal 2)

```bash
cd servico-agendamentos
npm install
npm run dev

```

*Resultado esperado no console:*

`Agendamentos rodando em http://localhost:3000`

---

## Contrato da API — Serviço de Catálogo (Porta 3001)

### Endpoints Disponíveis

| Método | Endpoint | Descrição | Autenticação | Status Esperados |
| --- | --- | --- | --- | --- |
| `GET` | `/recursos` | Lista recursos (aceita query params `?tipo=` e `?status=`) | Não | 200 |
| `GET` | `/recursos/:id` | Busca um recurso específico por ID | Não | 200, 404 |
| `POST` | `/recursos` | Cadastra um novo recurso no catálogo | Não | 201, 400 |
| `PATCH` | `/recursos/:id/status` | Altera o status de um recurso | Sim | 200, 400, 401, 404 |

---

### Exemplo de Requisição — POST /recursos

```json
{
  "nome": "Laboratório 4",
  "tipo": "laboratorio",
  "local": "Bloco B",
  "status": "disponivel"
}

```

---

## Contrato da API — Serviço de Agendamentos (Porta 3000)

### Endpoints Disponíveis

| Método | Endpoint | Descrição | Autenticação | Status Esperados |
| --- | --- | --- | --- | --- |
| `GET` | `/agendamentos` | Lista reservas (aceita query params `?curso=` e `?status=`) | Não | 200 |
| `GET` | `/agendamentos/:id` | Busca uma reserva específica por ID | Não | 200, 404 |
| `POST` | `/agendamentos` | Cria reserva consultando o catálogo via HTTP | Não | 201, 400, 404, 409, 502 |
| `PATCH` | `/agendamentos/:id/status` | Altera o status de uma reserva | Sim | 200, 400, 401, 404 |
| `DELETE` | `/agendamentos/:id` | Cancela/Remove uma reserva | Sim | 204, 401, 404 |

---

### Exemplo de Requisição — POST /agendamentos

```json
{
  "solicitante": "Ana Souza",
  "curso": "TSI",
  "recursoId": 1,
  "data": "2026-10-20",
  "horario": "18:50-20:20",
  "finalidade": "Aula prática de redes"
}

```

---

## Autenticação e Autorização

As operações que alteram estados sensíveis ou excluem registros (`PATCH` e `DELETE`) exigem a inclusão do cabeçalho de autorização:

```http
Authorization: Bearer ifms2026

```

Caso o token seja omitido ou incorreto, a API responderá com o código `401 Unauthorized`.

---

## Mapeamento de Status HTTP e Erros

Todas as respostas de erro seguem um formato JSON padronizado:

```json
{
  "mensagem": "Descrição detalhada do erro",
  "status": 400,
  "origem": "servico-agendamentos"
}

```

### Códigos Utilizados

* `200 OK`: Requisição bem-sucedida.
* `201 Created`: Recurso/Agendamento criado com sucesso.
* `204 No Content`: Remoção concluída sem conteúdo de retorno.
* `400 Bad Request`: Parâmetros ausentes, incorretos ou tipos incompatíveis.
* `401 Unauthorized`: Token de autorização ausente ou inválido.
* `404 Not Found`: Identificador pesquisado não existe no sistema.
* `409 Conflict`: Recurso em estado `manutencao` ou `indisponivel`.
* `502 Bad Gateway`: Falha de comunicação ou Serviço de Catálogo fora do ar.

---

## Guia de Testes

1. **Caminho Feliz (Criação de Reserva):**
* Certifique-se de que ambos os serviços estão rodando.
* Realize uma chamada `POST` para `http://localhost:3000/agendamentos` com um `recursoId` válido e disponível.
* Confirme o retorno do status `201 Created`.


2. **Caminho Triste (Reserva de Recurso Indisponível):**
* Altere o status do recurso para `manutencao`.
* Tente efetuar o agendamento para o mesmo recurso.
* Confirme o retorno do status `409 Conflict`.


3. **Caminho Triste (Falha de Integração):**
* Encerre o Serviço de Catálogo (Terminal 1).
* Tente efetuar um novo agendamento.
* Confirme o retorno do status `502 Bad Gateway`.



---

## Regras de Entrega

* O diretório `node_modules` foi explicitamente ignorado no arquivo `.gitignore`.
* As evidências de execução e testes encontram-se organizadas no diretório `evidencias/`.

```

```