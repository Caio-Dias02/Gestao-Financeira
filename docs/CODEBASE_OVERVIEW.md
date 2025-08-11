### Gestão Financeira — Visão Geral do Código (Backend)

Este documento resume a estrutura, tecnologias, modelos de dados, endpoints e instruções de execução do backend do projeto.

- **Stack**: NestJS 11, TypeScript, Prisma 6 (PostgreSQL), JWT (implementado), BCrypt, Class-Validator/Transformer
- **Banco**: PostgreSQL 16 (Docker Compose)
- **ORM**: Prisma Client (gerado em `backend/generated/prisma`)
- **Cache (planejado)**: Redis (dashboards, sessões, filtros)

---

### Objetivo do Projeto

Criar uma plataforma web que permita ao usuário controlar receitas, despesas, investimentos e metas financeiras de forma simples, organizada e visual, com foco tanto em uso individual quanto familiar.

### Público-Alvo

- Pessoas que querem controle financeiro pessoal
- Famílias que compartilham despesas e querem gerenciar finanças em conjunto
- Jovens aprendendo a organizar dinheiro
- Pessoas com renda variável ou múltiplas fontes de receita

---

### Estrutura de pastas (resumo)

```
backend/
  docker-compose.yml            # PostgreSQL local (dev)
  prisma/
    schema.prisma              # Modelos e enums
    migrations/...             # Migrations SQL
  src/
    main.ts                    # Bootstrap + ValidationPipe
    app.module.ts              # Módulo raiz
    app.controller.ts          # GET /
    app.service.ts
    prisma/prisma.service.ts   # Conexão Prisma
    commom/pipes/
      parse-uuid-id.pipe.ts    # Valida UUID em params:id
      parse-int-id.pipe.ts     # (auxiliar, não usado no User)
    user/
      user.module.ts
      user.controller.ts       # CRUD /user
      user.service.ts          # Regras e acesso a dados
      dto/
        create-user.dto.ts     # name, email, password
        update-user.dto.ts     # Partial<CreateUserDto>
    auth/
      auth.service.ts          # validação + geração de JWT
      auth.controller.ts       # POST /auth/login
      auth.module.ts           # JwtModule registrado (secret/expiração)
      jwt.strategy.ts          # popula req.user a partir do token
    category/                  # (a implementar)
    transaction/               # (a implementar)
```

---

### Modelos (Prisma)

- **User**: `id (uuid)`, `name`, `email (unique)`, `password`, timestamps
- **Category**: `id (uuid)`, `name`, `type (INCOME|EXPENSE)`, `userId`, `createdAt`
- **Transaction**: `id (uuid)`, `title`, `amount (Decimal 10,2)`, `type (INCOME|EXPENSE)`, `description?`, `date`, `userId`, `categoryId?`, `createdAt`

Enums:
- `CategoryType`: INCOME | EXPENSE
- `TransactionType`: INCOME | EXPENSE

Relações:
- `User 1-N Category`
- `User 1-N Transaction`
- `Category 0-N Transaction`

---

### Banco de dados (planejado)

- Tabelas a adicionar: `groups`, `accounts`, `goals`
- Uso pretendido:
  - `groups`: modo familiar (multiusuário, escopos/compartilhamento)
  - `accounts`: contas/saldos e transferências
  - `goals`: metas com valor, prazo e progresso (vínculo opcional a conta/categoria)

---

### Módulos e serviços principais

- `AppModule`: importa `UserModule` e registra `PrismaService`.
- `PrismaService`: estende `PrismaClient`, conecta/desconecta no ciclo do módulo.
- `main.ts`: registra `ValidationPipe` global com `whitelist: true` e `forbidNonWhitelisted: true`.
- `Pipes`:
  - `ParseUuidIdPipe`: garante que `:id` nos params seja um UUID válido.
  - `ParseIntIdPipe`: utilitário para IDs inteiros (não usado no `UserController`).
- `AuthService` + `AuthController` + `AuthModule` + `JwtStrategy`: login JWT implementado. Para proteger rotas use `@UseGuards(AuthGuard('jwt'))`; o retorno de `JwtStrategy.validate` fica disponível em `req.user`.

---

### Módulos planejados (Backend)

- `auth`: login, registro, JWT, roles (admin/user)
- `users`: dados do usuário (existente)
- `groups`: grupos familiares (escopos e compartilhamento)
- `transactions`: receitas/despesas (filtros por data/tipo/categoria/conta/usuário)
- `accounts`: contas e saldos (transferências entre contas)
- `categories`: categorias com cor/ícone
- `goals`: metas financeiras (valor, prazo, progresso visual)
- `dashboard`: dados agregados (com cache em Redis)
- `notifications` (futuro): lembretes de contas a pagar, metas próximas do vencimento

---

### Endpoints

- `GET /` — retorna "Hello World!" (saúde da API).

- `POST /auth/login`
  - Body: `{ email: string, password: string }`
  - Retorna `{ message: string, token: { access_token: string } }`.

- `POST /user`
  - Body: `{ name: string, email: string, password: string }`
  - Cria usuário (senha com hash) e retorna `{ message, user: { id, name, email } }`.

- `GET /user`
  - Lista usuários, omitindo senha: `{ message, users: Array<{ id, name, email }> }`.

- `GET /user/:id`
  - `:id` deve ser UUID válido (pipe).
  - Retorna `{ message, user: { id, name, email } }`.

- `PATCH /user/:id`
  - Body parcial: `{ name?, email?, password? }` (se enviar `password`, é re-hashada).
  - Retorna `{ message, user: { id, name, email } }`.

- `DELETE /user/:id`
  - Remove usuário por UUID.
  - Retorna `{ message }`.

Padrão de resposta do serviço: sempre `{ message: string, <payload> }`.

---

### Execução local (dev)

1) Instalar deps (na pasta `backend/`):

```bash
pnpm install
```

2) Subir banco via Docker (na pasta `backend/`):

```bash
docker compose up -d
```

3) Configurar `.env` (na pasta `backend/`):

```bash
echo DATABASE_URL=postgresql://postgres:postgres@localhost:5432/gestao_financeira?schema=public > .env
echo JWT_SECRET=uma_chave_bem_secreta >> .env
```

4) Gerar cliente Prisma e aplicar migrations:

```bash
pnpm prisma generate
pnpm prisma migrate dev
```

5) Rodar a API:

```bash
# modo watch (definido como "backend" em package.json)
pnpm run backend

# ou modo normal
pnpm start
```

Verifique em `http://localhost:3000`.

---

### Front-end (planejado)

- Stack: React + TypeScript, TanStack Router, TanStack Query, React Hook Form + Zod, gráficos (ex.: Recharts)
- Páginas: `/login`, `/register`, `/dashboard`, `/transactions`, `/accounts`, `/categories`, `/goals`
- Componentes: Navbar/Sidebar, cards de resumo (saldo, metas), modais de criação/edição, gráficos (pizza/barras/linha)

---

### Exemplos de requisição

Criar usuário:

```bash
curl -X POST http://localhost:3000/user \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice",
    "email": "alice@example.com",
    "password": "secret123"
  }'
```

Listar usuários:

```bash
curl http://localhost:3000/user
```

Buscar por id (UUID):

```bash
curl http://localhost:3000/user/<uuid>
```

---

### Observações e próximos passos

- Proteger endpoints privados com `AuthGuard('jwt')` e, se desejar, expor `/user/me` para retornar `req.user`.
- Implementar módulos `categories/`, `accounts/`, `transactions/`, `groups/`, `goals/` e `dashboard/` (com cache Redis).
- Adicionar validações com `class-validator` nos DTOs (`@IsEmail`, `@IsString`, `@MinLength`, etc.).
- Habilitar CORS se necessário (`app.enableCors()`).
- Scripts: considerar renomear `"backend"` para `"start:dev"` por convenção.

---

---

### Referências rápidas

- Prisma schema: `backend/prisma/schema.prisma`
- Migration inicial: `backend/prisma/migrations/20250728005739_init/migration.sql`
- Service de banco: `backend/src/prisma/prisma.service.ts`
- CRUD de usuários: `backend/src/user/*`


