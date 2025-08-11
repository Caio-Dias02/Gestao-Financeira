### Tech Context — Tecnologias e setup

**Front-end**

- React + TypeScript
- TanStack Router (rotas)
- TanStack Query (server state)
- React Hook Form + Zod (forms/validação)
- Recharts (gráficos) — ou alternativa equivalente
- UI Library: a definir (ex.: Shadcn UI/Chakra/MUI)

**Back-end**

- NestJS 11 (TypeScript)
- Prisma 6 (client) + PostgreSQL 16 (Docker Compose)
- Redis (cache dashboards/sessões)
- JWT (auth) + `passport-jwt`
- BCrypt (hash de senha)
- class-validator/class-transformer

**Banco de dados**

- Tabelas atuais: `users`, `categories`, `transactions`
- A serem adicionadas: `groups`, `accounts`, `goals`

**Variáveis de ambiente (sugestão)**

- `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/gestao_financeira?schema=public`
- `JWT_SECRET=...`
- `JWT_EXPIRES_IN=1d`
- `REDIS_URL=redis://localhost:6379` (ou host/porta separados)

**Comandos úteis (backend)**

```bash
pnpm install
docker compose up -d
pnpm prisma generate
pnpm prisma migrate dev
pnpm run backend # modo watch
```


