### Progress — Status atual

**O que funciona**

- [x] NestJS configurado com ValidationPipe global (whitelist/forbidNonWhitelisted)
- [x] Prisma + PostgreSQL (Docker) e migrations iniciais
- [x] CRUD de usuários (`/user`) com hash de senha
- [x] Pipes de validação (`ParseUuidIdPipe`)
- [x] Autenticação JWT básica concluída (`AuthModule`, `AuthController` com `POST /auth/login`, `JwtStrategy`)
  - Login grava cookie HttpOnly `access_token` e também retorna `{ access_token }`; `JwtStrategy` lê cookie e Bearer.
 - [x] Categories: CRUD protegido criado (module/controller/service) com DTOs e validação; Prisma `Category` com `color` e `icon` migrado.

**O que falta**

- [ ] Proteger rotas privadas com `AuthGuard('jwt')` e adicionar endpoint `/user/me`
- [ ] Módulos: `transactions`, `accounts`, `goals`, `groups`, `dashboard`
- [ ] Redis integrado para cache de dashboards
- [ ] DTOs com validações avançadas (class-validator)
- [ ] CORS/config de deploy
- [ ] Testes e2e e documentação pública dos endpoints

**Riscos e considerações**

- Desenho de saldos/transferências entre contas requer regras claras de consistência
- Escopos por grupo familiar (permissionamento) devem ser definidos cedo para evitar retrabalho
- Estratégia de invalidação de cache (Redis) em mutações que afetam dashboards


