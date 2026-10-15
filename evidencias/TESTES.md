Para preencher o arquivo **`evidencias/TESTES.md`** de forma clara, organizada e sem poluição visual, você pode documentar a execução dos testes obrigatórios (caminho feliz e caminho triste) solicitados na rubrica da avaliação.

Crie/edite o arquivo `evidencias/TESTES.md` e cole o conteúdo abaixo:

```markdown
# Evidências e Relatório de Testes

Este documento registra a execução e os resultados dos testes realizados no Serviço de Catálogo e no Serviço de Agendamentos, cobrindo cenários de sucesso (caminho feliz) e cenários de erro (caminho triste), conforme exigido pelos critérios de avaliação.

---

## 1. Testes — Serviço de Catálogo (Porta 3001)

### Teste 1.1: Listar todos os recursos
- **Método / URL:** `GET http://localhost:3001/recursos`
- **Headers:** NFF (Nenhum)
- **Status Esperado:** `200 OK`
- **Resposta JSON:**
```json
[
  {
    "id": 1,
    "nome": "Laboratório 1",
    "tipo": "laboratorio",
    "local": "Bloco A",
    "status": "disponivel"
  },
  {
    "id": 3,
    "nome": "Projetor Epson",
    "tipo": "equipamento",
    "local": "Armário 2",
    "status": "manutencao"
  }
]

```

---

### Teste 1.2: Buscar recurso por ID inexistente (Caminho Triste)

* **Método / URL:** `GET http://localhost:3001/recursos/999`
* **Status Esperado:** `404 Not Found`
* **Resposta JSON:**

```json
{
  "mensagem": "Recurso não encontrado",
  "status": 404,
  "origem": "servico-catalogo"
}

```

---

### Teste 1.3: Cadastrar novo recurso com dados válidos

* **Método / URL:** `POST http://localhost:3001/recursos`
* **Body JSON:**

```json
{
  "nome": "Laboratório 4",
  "tipo": "laboratorio",
  "local": "Bloco B",
  "status": "disponivel"
}

```

* **Status Esperado:** `201 Created`

---

### Teste 1.4: Alterar status de recurso sem token de autorização (Caminho Triste)

* **Método / URL:** `PATCH http://localhost:3001/recursos/1/status`
* **Body JSON:**

```json
{
  "status": "manutencao"
}

```

* **Status Esperado:** `401 Unauthorized`
* **Resposta JSON:**

```json
{
  "mensagem": "Token inválido ou ausente"
}

```

---

### Teste 1.5: Alterar status de recurso com token válido

* **Método / URL:** `PATCH http://localhost:3001/recursos/1/status`
* **Header:** `Authorization: Bearer ifms2026`
* **Body JSON:**

```json
{
  "status": "manutencao"
}

```

* **Status Esperado:** `200 OK`

---

## 2. Testes — Serviço de Agendamentos (Porta 3000)

### Teste 2.1: Criar agendamento com recurso disponível (Caminho Feliz / Integração)

* **Método / URL:** `POST http://localhost:3000/agendamentos`
* **Body JSON:**

```json
{
  "solicitante": "Ana Souza",
  "curso": "TSI",
  "recursoId": 2,
  "data": "2026-10-20",
  "horario": "18:50-20:20",
  "finalidade": "Aula prática de redes"
}

```

* **Status Esperado:** `201 Created`
* **Resposta JSON:**

```json
{
  "id": 1,
  "solicitante": "Ana Souza",
  "curso": "TSI",
  "recurso": {
    "id": 2,
    "nome": "Laboratório 3",
    "local": "Bloco B"
  },
  "data": "2026-10-20",
  "horario": "18:50-20:20",
  "status": "confirmado"
}

```

---

### Teste 2.2: Tentar agendar com recurso em manutenção (Caminho Triste)

* **Método / URL:** `POST http://localhost:3000/agendamentos`
* **Body JSON:**

```json
{
  "solicitante": "Carlos Lima",
  "curso": "TSI",
  "recursoId": 3,
  "data": "2026-10-21",
  "horario": "19:00-20:30",
  "finalidade": "Apresentação de trabalho"
}

```

* **Status Esperado:** `409 Conflict`
* **Resposta JSON:**

```json
{
  "mensagem": "Recurso em estado 'manutencao' não pode ser reservado",
  "status": 409,
  "origem": "servico-agendamentos"
}

```

---

### Teste 2.3: Tentar agendar com recurso inexistente (Caminho Triste)

* **Método / URL:** `POST http://localhost:3000/agendamentos`
* **Body JSON:**

```json
{
  "solicitante": "Mariana Silva",
  "curso": "TSI",
  "recursoId": 999,
  "data": "2026-10-22",
  "horario": "07:30-09:00",
  "finalidade": "Aula prática"
}

```

* **Status Esperado:** `404 Not Found`
* **Resposta JSON:**

```json
{
  "mensagem": "Recurso não encontrado no catálogo",
  "status": 404,
  "origem": "servico-agendamentos"
}

```

---

### Teste 2.4: Tentar agendar com o Serviço de Catálogo fora do ar (Falha de Integração)

* **Procedimento:** Encerramento prévio do Serviço de Catálogo (Terminal 1 desligado).
* **Método / URL:** `POST http://localhost:3000/agendamentos`
* **Body JSON:**

```json
{
  "solicitante": "Ana Souza",
  "curso": "TSI",
  "recursoId": 2,
  "data": "2026-10-20",
  "horario": "18:50-20:20",
  "finalidade": "Aula prática"
}

```

* **Status Esperado:** `502 Bad Gateway`
* **Resposta JSON:**

```json
{
  "mensagem": "Serviço de catálogo fora do ar ou inacessível",
  "status": 502,
  "origem": "servico-agendamentos"
}

```

---

### Teste 2.5: Cancelar/Remover agendamento com token válido

* **Método / URL:** `DELETE http://localhost:3000/agendamentos/1`
* **Header:** `Authorization: Bearer ifms2026`
* **Status Esperado:** `204 No Content`

```

```