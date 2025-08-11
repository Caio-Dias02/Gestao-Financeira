## Gestão Financeira

Aplicação web para controle de receitas, despesas, categorias e metas, com autenticação JWT e API em NestJS.

- Repositório: https://github.com/Caio-Dias02/Gestao-Financeira  
- Stack: NestJS, Prisma, PostgreSQL (Docker), JWT, Redis (planejado)

### Conteúdo
- Visão Geral
- Tecnologias
- Estrutura do projeto
- Como rodar (dev)
- Variáveis de ambiente
- Banco de dados (Prisma)
- Scripts
- Endpoints principais
- Exemplos de uso (curl)
- Testes e lint
- Roadmap

### Visão Geral
- Backend em NestJS com autenticação JWT.
- Login grava cookie HttpOnly `access_token` e também retorna o token no body para compatibilidade.
- CORS habilitado para `http://localhost:3000` e `http://localhost:3001`; cookies ativados.
- CRUD de usuários e categorias implementados; transações/metas/contas/grupos no roadmap.

### Tecnologias
- Runtime: Node.js 20+, pnpm
- Backend: NestJS 11, Passport-JWT, class-validator
- ORM: Prisma 6 + PostgreSQL 16 (Docker)
- Cache: Redis (planejado)
- Testes: Jest, Supertest
- Lint/Format: ESLint + Prettier

### Estrutura do projeto
- `backend/` API NestJS
- `docs/` documentação geral
- `memory-bank/` contexto do projeto (projectbrief, progress, etc.)

### Como rodar (dev)

Pré-requisitos:
- Node.js 20+
- pnpm (`npm i -g pnpm`)
- Docker Desktop

Passos:
1) Suba o banco
```bash
cd backend
docker compose up -d
```

2) Instale dependências
```bash
pnpm install
```

3) Configure o .env
Crie `backend/.env`:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/gestao_financeira?schema=public
JWT_SECRET=super-secret
JWT_EXPIRES_IN=1d
# Opcional para futuramente:
# REDIS_URL=redis://localhost:6379
```

4) Gere client e rode migrações
```bash
pnpm prisma generate
pnpm prisma migrate dev
```

5) Inicie o servidor
```bash
pnpm run backend
# Porta padrão: 3000
```

### Variáveis de ambiente
- `DATABASE_URL` string de conexão do PostgreSQL
- `JWT_SECRET` segredo do JWT
- `JWT_EXPIRES_IN` expiração do token (ex.: 1d, 12h)
- `REDIS_URL` opcional, para cache no dashboard

### Banco de dados (Prisma)
Entidades principais atuais:
- `User` (id, name, email, password, timestamps)
- `Category` (id, name, type INCOME|EXPENSE, color, icon, userId, createdAt)
- `Transaction` (id, title, amount decimal(10,2), type INCOME|EXPENSE, description, date, userId, categoryId?, createdAt)

Comandos úteis:
```bash
pnpm prisma studio           # UI do Prisma
pnpm prisma migrate dev      # cria/aplica migrações
pnpm prisma generate         # gera client
```

### Scripts (backend/package.json)
- `pnpm run backend` inicia em modo watch
- `pnpm run start` inicia sem watch
- `pnpm run start:prod` roda build produzido
- `pnpm run lint` corrige lint
- `pnpm run test` roda testes
- `pnpm run test:e2e` testes end-to-end

### Endpoints principais

Auth
- POST `/auth/login` body: `{ "email": "...", "password": "..." }`
  - Seta cookie HttpOnly `access_token` e responde `{ token: { access_token } }`
- POST `/auth/logout` limpa cookie

Users (protegidos por JWT)
- GET `/user/me` retorna o usuário autenticado (payload do JWT)
- POST `/user` cria usuário
- GET `/user` lista usuários
- GET `/user/:id`
- PATCH `/user/:id`
- DELETE `/user/:id`

Categories (protegidos por JWT)
- POST `/category` cria categoria para o usuário logado
- GET `/category` lista categorias do usuário
- GET `/category/:id`
- PATCH `/category/:id`
- DELETE `/category/:id`

Observações:
- Todas as rotas protegidas usam `AuthGuard('jwt')`.
- O token é lido primeiro do cookie; se ausente, do header `Authorization: Bearer <token>`.

### Exemplos (curl)

Login (gera cookie + retorna token):
```bash
curl -i -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"senha"}'
```

Usando cookie retornado para acessar categorias:
```bash
# copie o valor de 'set-cookie' do login e substitua abaixo
curl -i http://localhost:3000/category \
  -H "Cookie: access_token=SEU_TOKEN_AQUI"
```

Ou usando Bearer:
```bash
curl -i http://localhost:3000/category \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

Criar categoria:
```bash
curl -i -X POST http://localhost:3000/category \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{"name":"Salário","type":"INCOME","color":"#22c55e","icon":"lucide:wallet"}'
```

### Testes e Lint
```bash
pnpm run test
pnpm run test:e2e
pnpm run lint
```

### Roadmap curto
- Accounts: CRUD + saldo e transferências
- Transactions: CRUD + filtros de data/tipo/categoria/conta
- Goals: metas por valor/prazo, progresso
- Groups: escopos multiusuário
- Dashboard: agregações com cache Redis

### Licença
Uso interno/estudo.
