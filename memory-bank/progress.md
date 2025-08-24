### Progress — Status atual

**O que funciona**

- [x] NestJS configurado com ValidationPipe global (whitelist/forbidNonWhitelisted)
- [x] Prisma + PostgreSQL (Docker) e migrations iniciais
- [x] CRUD de usuários (`/user`) com hash de senha
- [x] Pipes de validação (`ParseUuidIdPipe`)
- [x] Autenticação JWT básica concluída (`AuthModule`, `AuthController` com `POST /auth/login`, `JwtStrategy`)
  - Login grava cookie HttpOnly `access_token` e também retorna `{ access_token }`; `JwtStrategy` lê cookie e Bearer.
- [x] Categories: CRUD protegido criado (module/controller/service) com DTOs e validação; Prisma `Category` com `color` e `icon` migrado.
- [x] Accounts: CRUD protegido criado (module/controller/service) com DTOs e validação; Prisma `Account` com `type`, `balance`, `color`, `icon` migrado.
- [x] Transactions: CRUD protegido criado (module/controller/service) com DTOs e validação; Inclui filtros por categoria, conta e período; Prisma `Transaction` com relacionamentos para `Category` e `Account`.
- [x] Groups: CRUD protegido criado (module/controller/service) com DTOs e validação; Inclui gerenciamento de usuários (ADMIN/MEMBER); Prisma `Group` e `UserGroup` com migration aplicada.
- [x] **Dashboard: módulo completo implementado** com 7 endpoints para agregações financeiras, filtros por período, breakdown por categorias, saldos de contas, histórico temporal e tendências mensais.
- [x] **PrismaModule criado** para exportar PrismaService para outros módulos
- [x] **Frontend: estrutura inicial criada** com Feature-Based Architecture (React + TypeScript)
- [x] **Frontend: dependências instaladas** (TanStack Query, React Hook Form, Zod, Recharts, Shadcn/ui, Tailwind CSS)
- [x] **Frontend: configuração Tailwind CSS** com paleta de cores customizada
- [x] **Frontend: estrutura de features** criada (auth, dashboard, categories, accounts, transactions, groups)
- [x] **Frontend: módulo auth implementado** (types, services, hooks, components, forms)
- [x] **Frontend: providers e roteamento** configurados (AppProviders, AppRouter)

**O que falta**

- [ ] **Backend:**
  - [ ] Módulos: `goals`
  - [ ] Redis integrado para cache de dashboards
  - [ ] DTOs com validações avançadas (class-validator)
  - [ ] CORS/config de deploy
  - [ ] Testes e2e e documentação pública dos endpoints

- [ ] **Frontend:**
  - [ ] Implementar módulo dashboard (componentes, hooks, services)
  - [ ] Implementar módulo categories (CRUD completo)
  - [ ] Implementar módulo accounts (CRUD completo)
  - [ ] Implementar módulo transactions (CRUD completo)
  - [ ] Implementar módulo groups (CRUD completo)
  - [ ] Implementar módulo goals (quando backend estiver pronto)
  - [ ] Sistema de navegação e layout principal
  - [ ] Componentes de UI reutilizáveis
  - [ ] Integração completa com backend
  - [ ] Testes unitários e de integração

**Riscos e considerações**

- Desenho de saldos/transferências entre contas requer regras claras de consistência
- Escopos por grupo familiar (permissionamento) devem ser definidos cedo para evitar retrabalho
- Estratégia de invalidação de cache (Redis) em mutações que afetam dashboards
- Frontend e backend devem estar sincronizados em termos de tipos e validações


