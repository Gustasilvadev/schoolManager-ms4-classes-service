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

| Método | Endpoint                          | Descrição                          | Auth | Body |
|--------|----------------------------------|------------------------------------|------|------|
| GET    | `/classes/listClasses`           | Lista todas as turmas              | ✅   | — |
| GET    | `/classes/listClassById/{id}`    | Busca turma por ID                 | ✅   | — |
| POST   | `/classes/createClass`           | Cria nova turma                    | ✅   | dados da turma |
| PUT    | `/classes/updateClass/{id}`      | Atualiza dados da turma            | ✅   | dados da turma |
| DELETE | `/classes/deleteClass/{id}`      | Deleta turma (lógico)              | ✅   | — |

---

## 📚 Disciplines

| Método | Endpoint                               | Descrição                          | Auth | Body |
|--------|----------------------------------------|------------------------------------|------|------|
| GET    | `/disciplines/listDisciplines`         | Lista todas as disciplinas         | ✅   | — |
| GET    | `/disciplines/listDisciplineById/{id}` | Busca disciplina por ID            | ✅   | — |
| POST   | `/disciplines/createDiscipline`        | Cria nova disciplina               | ✅   | dados da disciplina |
| PUT    | `/disciplines/updateDiscipline/{id}`   | Atualiza disciplina                | ✅   | dados da disciplina |
| DELETE | `/disciplines/deleteDiscipline/{id}`   | Deleta disciplina (lógico)         | ✅   | — |

---

## 🔗 Relacionamentos Acadêmicos

| Método | Endpoint                                   | Descrição                                      | Auth | Body |
|--------|--------------------------------------------|-----------------------------------------------|------|------|
| POST   | `/classes/linkStudent/{classId}`           | Vincula aluno a uma turma                     | ✅   | student_id |
| DELETE | `/classes/unlinkStudent/{classId}/{studentId}` | Remove aluno da turma                    | ✅   | — |
| POST   | `/classes/linkTeacher/{classId}`           | Vincula professor a uma turma                 | ✅   | teacher_id |
| DELETE | `/classes/unlinkTeacher/{classId}/{teacherId}` | Remove professor da turma               | ✅   | — |

---

## ❤️ Health Check

| Método | Endpoint   | Descrição                  | Auth |
|--------|-----------|---------------------------|------|
| GET    | `/health` | Verifica status da API     | ❌   |

---

## 🔐 Autenticação

- ✅ = Requer token JWT  
- ❌ = Público  