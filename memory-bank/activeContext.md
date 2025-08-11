### Active Context — Foco atual e próximos passos

**Estado atual**

- Backend inicial pronto com NestJS + Prisma
- CRUD de `users` funcional (hash de senha, pipes, respostas padronizadas)
- Banco PostgreSQL via Docker + migrations aplicadas
- Autenticação JWT concluída: `AuthModule` configurado (`JwtModule` com secret/expiração), `AuthController` com `POST /auth/login`, `JwtStrategy` ativa e `AppModule` importando `AuthModule`
 - Categories: módulo criado com CRUD protegido (controller/service/module), DTOs com validação e escopo por `userId`. Prisma `Category` estendido com `color` e `icon` e migration aplicada.

**Foco atual**

- Proteger rotas com `AuthGuard('jwt')` e expor endpoint `/user/me` (retorna `req.user`)
  - Implementado login com cookie HttpOnly (`access_token`) + fallback Bearer; CORS `credentials: true` e `cookie-parser` habilitados.
  - Corrigido login para salvar a STRING do token no cookie (não o objeto).
- Definir/estender schema do Prisma para `groups`, `accounts`, `goals`
- Implementar módulos: `categories`, `transactions`, `accounts`, `goals`, `groups`, `dashboard`
- Introduzir Redis (cache de dashboards e filtros comuns)
- Adicionar validações ricas nos DTOs (class-validator)

**Próximos passos (ordem sugerida)**

1) Categories: adicionar `ParseUuidIdPipe` nas rotas `/:id` e documentar endpoints
3) Accounts: CRUD + saldo calculado + transferências
4) Transactions: CRUD + filtros (data/tipo/categoria/conta/usuário)
5) Groups: associação usuário-grupo e escopos
6) Goals: CRUD + cálculo de progresso (vínculo a conta/categoria)
7) Dashboard: endpoints agregados + cache Redis
8) Testes e2e + documentação de API


