# 🏫 SchoolManager: MS4 - ClassesService

## 1. Visão Geral do Projeto
O SchoolManager é um sistema de gestão escolar desenvolvido para digitalizar e acelerar processos administrativos e acadêmicos de escolas. O foco está na produtividade da secretaria e dos professores. 

O sistema possui uma arquitetura baseada em **microsserviços**, utilizando um API Gateway como ponto de entrada (validando tokens gerados por este serviço) e comunicação híbrida (HTTP/REST para requisições síncronas e RabbitMQ para operações assíncronas). O ecossistema completo conta com 6 microsserviços isolados com seus próprios bancos de dados (MariaDB).

---

## 2. Sobre o ClassesService (MS4)
Este repositório contém exclusivamente o código do **MS4 - ClassesService**. Ele é responsável pela gestão de turmas, disciplinas e organização acadêmica dentro do sistema.

**Domínio:** Turmas, disciplinas e estrutura acadêmica.

### Responsabilidades Principais
* **Gestão de Turmas:** Criação, atualização e controle de turmas.
* **Gestão de Disciplinas:** Cadastro e organização das disciplinas oferecidas pela instituição.
* **Vinculação Acadêmica:** Relacionamento entre turmas, professores (MS3) e alunos (MS2).
* **Base para estrutura escolar:** Define como os alunos e professores se organizam dentro do sistema.

### Banco de Dados
Este microsserviço possui seu domínio de dados totalmente isolado, utilizando uma instância de **MariaDB** dedicada às tabelas de turmas e disciplinas.

---

## 3. Padrão de Commits

Para mantermos o histórico limpo e rastreável, este projeto utiliza a especificação conforme os exemplos abaixo.

**Formato:** `<tipo>: <mensagem curta>`

**Tipos permitidos:**
- `feat`: Nova funcionalidade (ex: criação de nova rota de login).
- `fix`: Correção de bug (ex: ajuste na expiração do token).
- `chore`: Configurações, dependências e estrutura (ex: setup do banco MariaDB).
- `docs`: Atualização de documentação (ex: melhorias neste README).
- `refactor`: Refatoração de código sem alterar regra de negócio.
- `style`: Formatação de código (linting, prettier).
- `test`: Criação/alteração de testes de segurança ou unitários.

---

# 📡 Endpoints da API

## 🏫 Classes (Turmas)

| Método | Endpoint                              | Descrição                          | Auth | Role             | Body |
|--------|---------------------------------------|------------------------------------|------|------------------|------|
| GET    | `/classes/listClasses`                | Lista turmas. TEACHER: só ACTIVE das suas turmas. ADMIN: ACTIVE+INACTIVE (use `?includeDeleted=true`/`?class_status=N` para variar). | ✅   | ADMIN ou TEACHER | — |
| GET    | `/classes/listClassById/{id}`         | Busca turma por ID                 | ✅   | ADMIN ou TEACHER | — |
| POST   | `/classes/createClass`                | Cria nova turma                    | ✅   | ADMIN            | dados da turma |
| PUT    | `/classes/updateClassById/{id}`       | Atualiza dados da turma (bloqueado se status=DELETED) | ✅   | ADMIN            | dados da turma |
| DELETE | `/classes/deleteClassById/{id}`       | Deleta turma (soft, status=2)      | ✅   | ADMIN            | — |
| POST   | `/classes/restoreClassById/{id}`      | Restaura turma deletada (status: 2 → 1) | ✅   | ADMIN            | — |

---

## 📚 Disciplines

| Método | Endpoint                                       | Descrição                          | Auth | Role             | Body |
|--------|------------------------------------------------|------------------------------------|------|------------------|------|
| GET    | `/disciplines/listDisciplines`                 | Lista disciplinas. ADMIN: ACTIVE+INACTIVE (use `?includeDeleted=true`/`?discipline_status=N`). TEACHER: força ACTIVE. | ✅   | ADMIN            | — |
| GET    | `/disciplines/listDisciplineById/{id}`         | Busca disciplina por ID            | ✅   | ADMIN ou TEACHER | — |
| POST   | `/disciplines/createDiscipline`                | Cria nova disciplina               | ✅   | ADMIN            | dados da disciplina |
| PUT    | `/disciplines/updateDisciplineById/{id}`       | Atualiza disciplina (bloqueado se status=DELETED) | ✅   | ADMIN            | dados da disciplina |
| DELETE | `/disciplines/deleteDisciplineById/{id}`       | Deleta disciplina (soft, status=2) | ✅   | ADMIN            | — |
| POST   | `/disciplines/restoreDisciplineById/{id}`      | Restaura disciplina deletada (status: 2 → 1) | ✅   | ADMIN            | — |
| GET    | `/disciplines/listClassesByDisciplineId/{id}`  | Lista turmas que oferecem a disciplina | ✅ | ADMIN          | — |

### Ciclo de vida de turmas e disciplinas (status)

- `ACTIVE (1)`: registro operacional.
- `INACTIVE (0)`: pausado/suspenso. Reversível via `PUT`.
- `DELETED (2)`: encerrado. Update bloqueado. Reativação **apenas** via `POST /restore<Entity>ById/{id}` (ADMIN).

### Filtragem por papel nos endpoints `/list*`

- **ADMIN** (default): retorna ACTIVE + INACTIVE; `?includeDeleted=true` para incluir DELETED, ou `?class_status=N`/`?discipline_status=N` para filtro fino.
- **TEACHER**: força ACTIVE; query string de status/includeDeleted é ignorada. Em `listClasses`, ainda restringe às turmas atribuídas ao próprio professor.

---

## 🔗 Relacionamentos Acadêmicos

### Matrícula de alunos

| Método | Endpoint                                  | Descrição                                | Auth | Role             | Body |
|--------|-------------------------------------------|------------------------------------------|------|------------------|------|
| POST   | `/classes/enroll/{id}`                    | Matricula aluno na turma                 | ✅   | ADMIN            | `student_id` |
| DELETE | `/classes/enroll/{id}/{studentId}`        | Remove aluno da turma                    | ✅   | ADMIN            | — |
| GET    | `/classes/students/{id}`                  | Lista alunos da turma (enriquecido com `student_name`, `student_email`, `student_photo` via MS2) | ✅   | ADMIN ou TEACHER | — |

### Alocação de professores

| Método | Endpoint                                       | Descrição                                | Auth | Role             | Body |
|--------|------------------------------------------------|------------------------------------------|------|------------------|------|
| POST   | `/classes/assignTeacher/{id}`                  | Aloca professor na turma                 | ✅   | ADMIN            | `teacher_id` |
| DELETE | `/classes/assignTeacher/{id}/{teacherId}`      | Remove professor da turma                | ✅   | ADMIN            | — |
| GET    | `/classes/teachers/{id}`                       | Lista professores da turma               | ✅   | ADMIN ou TEACHER | — |

### Disciplinas da turma (turma-disciplina)

| Método | Endpoint                                       | Descrição                                | Auth | Role             | Body |
|--------|------------------------------------------------|------------------------------------------|------|------------------|------|
| POST   | `/classes/disciplines/{id}`                    | Associa disciplina à turma               | ✅   | ADMIN            | `discipline_id` |
| DELETE | `/classes/disciplines/{id}/{disciplineId}`     | Remove disciplina da turma               | ✅   | ADMIN            | — |
| GET    | `/classes/disciplines/{id}`                    | Lista disciplinas da turma               | ✅   | ADMIN ou TEACHER | — |

> **`enroll` valida o `student_id` no MS2** via Token Propagation — retorna `404 STUDENT_NOT_FOUND` se o aluno não existe ou `503 EXTERNAL_SERVICE_UNAVAILABLE` se o MS2 estiver indisponível.
>
> **`assignTeacher` consulta as disciplinas habilitadas no MS3** (cross-MS) e exige interseção com pelo menos uma das disciplinas da turma. Sem habilitação compatível, retorna `400 TEACHER_NOT_QUALIFIED`.
>
> **`students/{id}` enriquece cada matrícula** com `student_name`, `student_email` e `student_photo` consultando o MS2 (`listStudentById`, aberto a ADMIN/TEACHER) — uma chamada por aluno, com Token Propagation. Falha pontual retorna esses campos como `null` para aquele aluno, sem quebrar a lista.

---

## 🔌 Endpoints Internos (Service-to-Service)

Endpoints consumidos por outros microsserviços. Todos exigem JWT propagado (Token Propagation).

| Método | Endpoint                                                       | Auth | Role             | Consumidor | Finalidade                                                  |
|--------|----------------------------------------------------------------|------|------------------|------------|-------------------------------------------------------------|
| GET    | `/classes/checkTeacherAccess/{teacherId}/{classDisciplineId}`  | ✅   | ADMIN ou TEACHER | MS5        | Verifica se o professor leciona a `class_discipline`        |
| GET    | `/classes/listClassDisciplineById/{id}`                        | ✅   | ADMIN ou TEACHER | MS5        | Valida existência de `class_discipline_id` (404 se não existe) |

---

## ❤️ Health Check

| Método | Endpoint   | Descrição                  | Auth |
|--------|-----------|---------------------------|------|
| GET    | `/health` | Verifica status da API     | ❌   |

---

## 🔐 Autenticação

- ✅ = Requer token JWT  
- ❌ = Público  