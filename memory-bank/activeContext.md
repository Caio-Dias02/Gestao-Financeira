### Active Context — Foco atual e próximos passos

**Estado atual**

- Backend inicial pronto com NestJS + Prisma
- CRUD de `users` funcional (hash de senha, pipes, respostas padronizadas)
- Banco PostgreSQL via Docker + migrations aplicadas
- Autenticação JWT concluída: `AuthModule` configurado (`JwtModule` com secret/expiração), `AuthController` com `POST /auth/login`, `JwtStrategy` ativa e `AppModule` importando `AuthModule`
- Categories: módulo criado com CRUD protegido (controller/service/module), DTOs com validação e escopo por `userId`. Prisma `Category` estendido com `color` e `icon` e migration aplicada.
- Accounts: módulo criado com CRUD protegido (controller/service/module), DTOs com validação e escopo por `userId`. Prisma `Account` com `type`, `balance`, `color`, `icon` e migration aplicada.
- Transactions: módulo criado com CRUD protegido (controller/service/module), DTOs com validação e escopo por `userId`. Inclui filtros por categoria, conta e período. Prisma `Transaction` com relacionamentos para `Category` e `Account`.
- Groups: módulo criado com CRUD protegido (controller/service/module), DTOs com validação e escopo por `userId`. Inclui gerenciamento de usuários (ADMIN/MEMBER) e relacionamentos. Prisma `Group` e `UserGroup` com migration aplicada.

**Foco atual**

- Proteger rotas com `AuthGuard('jwt')` e expor endpoint `/user/me` (retorna `req.user`)
  - Implementado login com cookie HttpOnly (`access_token`) + fallback Bearer; CORS `credentials: true` e `cookie-parser` habilitados.
  - Corrigido login para salvar a STRING do token no cookie (não o objeto).
- Definir/estender schema do Prisma para `goals`
- Implementar módulos: `goals`, `dashboard`
- Introduzir Redis (cache de dashboards e filtros comuns)
- Adicionar validações ricas nos DTOs (class-validator)

**Próximos passos (ordem sugerida)**

1) Categories: adicionar `ParseUuidIdPipe` nas rotas `/:id` e documentar endpoints
2) Goals: CRUD + cálculo de progresso (vínculo a conta/categoria)
3) Dashboard: endpoints agregados + cache Redis
4) Testes e2e + documentação de API


