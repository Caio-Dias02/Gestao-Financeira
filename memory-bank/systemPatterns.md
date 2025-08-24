# System Patterns — Padrões arquiteturais e decisões técnicas

## Backend Architecture

### NestJS Module Structure
- **Feature-based modules**: Cada domínio de negócio tem seu próprio módulo
- **Shared services**: `PrismaService` compartilhado via `PrismaModule`
- **Guards**: `AuthGuard('jwt')` para proteção de rotas
- **DTOs**: Validação com `class-validator` e `class-transformer`
- **Pipes**: `ParseUuidIdPipe` para validação de IDs

### Database Patterns
- **Prisma ORM**: Type-safe database access
- **Migrations**: Versionamento de schema via Prisma
- **Relationships**: Relacionamentos bem definidos entre entidades
- **Soft deletes**: Implementados onde necessário

### Authentication & Authorization
- **JWT Strategy**: Cookie-based + Bearer token fallback
- **User context**: `req.user` disponível em rotas protegidas
- **Group permissions**: ADMIN/MEMBER roles para grupos

## Frontend Architecture

### Feature-Based Architecture (Domain-Driven Design Frontend)
- **Organização por domínio**: Cada feature tem sua própria pasta com todos os recursos
- **Estrutura de features**:
  ```
  src/features/
  ├── auth/           # Autenticação
  │   ├── components/ # Componentes React
  │   ├── hooks/      # Custom hooks
  │   ├── services/   # API calls
  │   ├── types/      # TypeScript interfaces
  │   └── index.ts    # Exports públicos
  ├── dashboard/      # Dashboard financeiro
  ├── categories/     # Gerenciamento de categorias
  ├── accounts/       # Gerenciamento de contas
  ├── transactions/   # Gerenciamento de transações
  └── groups/         # Gerenciamento de grupos
  ```

### State Management
- **TanStack Query**: Gerenciamento de estado do servidor
- **React Hook Form**: Gerenciamento de formulários
- **Zod**: Validação de schemas
- **Context API**: Estado global quando necessário

### UI Component System
- **Shadcn/ui**: Componentes base reutilizáveis
- **Tailwind CSS**: Sistema de design utility-first
- **Custom components**: Componentes específicos do domínio
- **Responsive design**: Mobile-first approach

### Data Flow
- **API Layer**: Services para comunicação com backend
- **Type Safety**: TypeScript interfaces sincronizadas com backend
- **Error Handling**: Tratamento consistente de erros
- **Loading States**: Estados de carregamento para UX

## Integration Patterns

### API Communication
- **RESTful endpoints**: Padrão REST para APIs
- **Error responses**: Formato consistente de erros
- **Authentication**: JWT tokens via cookies/headers
- **CORS**: Configurado para credenciais

### Type Synchronization
- **Shared types**: Interfaces compartilhadas entre frontend/backend
- **DTO validation**: Validação consistente em ambas as camadas
- **API contracts**: Contratos bem definidos para comunicação

## Development Patterns

### Code Organization
- **Separation of concerns**: Lógica de negócio separada da UI
- **Composition over inheritance**: Reutilização via composição
- **Custom hooks**: Lógica reutilizável encapsulada em hooks
- **Service layer**: Abstração da comunicação com APIs

### Testing Strategy
- **Unit tests**: Testes de componentes e hooks
- **Integration tests**: Testes de fluxos completos
- **E2E tests**: Testes de cenários de usuário
- **Mock services**: Mocks para APIs externas

### Performance Patterns
- **Code splitting**: Lazy loading de features
- **Memoization**: React.memo e useMemo para otimizações
- **Query caching**: TanStack Query para cache inteligente
- **Bundle optimization**: Tree shaking e minificação


