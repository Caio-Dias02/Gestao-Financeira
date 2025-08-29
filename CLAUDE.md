# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture Overview

This is a **monorepo** financial management application with two main components:

### Backend (NestJS API)
- **Location**: `backend/` directory
- **Framework**: NestJS 11 with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens with HttpOnly cookies + Bearer token fallback
- **Structure**: Feature-based modules (user, auth, category, accounts, transaction, groups, dashboard)
- **Key Files**:
  - `src/main.ts` - Application bootstrap with CORS, cookies, global validation
  - `src/app.module.ts` - Root module importing all feature modules
  - `prisma/schema.prisma` - Database schema with User, Category, Transaction, Account, Group models
  - `src/prisma/prisma.service.ts` - Database service injection point

### Frontend (React SPA)
- **Location**: `frontend/` directory
- **Framework**: React 19 + TypeScript + Vite
- **State Management**: TanStack Query for server state
- **Styling**: Tailwind CSS + Radix UI components
- **Structure**: Feature-based organization under `src/features/`
- **Key Features**: dashboard, auth, categories, accounts, transactions, reports, settings

### Authentication Flow
- Login sets HttpOnly cookie `access_token` AND returns token in response body
- Protected routes check cookie first, then `Authorization: Bearer <token>` header
- All protected routes use `AuthGuard('jwt')` with Passport JWT strategy
- Frontend uses `ProtectedRoute` wrapper component for route protection

### Database Schema
- **Users**: Basic auth + profile info
- **Categories**: Income/Expense with colors and icons (user-scoped)
- **Accounts**: Multiple account types (checking, savings, credit, etc.)
- **Transactions**: Financial records linked to categories and accounts
- **Groups**: Multi-user collaboration (partially implemented)

## Development Commands

### Backend Development
```bash
cd backend

# Database setup (first time)
docker compose up -d              # Start PostgreSQL
pnpm install                      # Install dependencies
pnpm prisma generate              # Generate Prisma client
pnpm prisma migrate dev           # Run database migrations

# Development
pnpm run backend                  # Start with watch mode (recommended)
pnpm run dev                      # Start with debug mode
pnpm run start                    # Start without watch

# Database management
pnpm prisma studio               # Visual database browser
pnpm prisma migrate dev          # Create and apply new migration
pnpm prisma generate             # Regenerate Prisma client after schema changes

# Testing and quality
pnpm run test                    # Unit tests
pnpm run test:e2e               # End-to-end tests
pnpm run test:cov               # Test coverage
pnpm run lint                   # ESLint with auto-fix
```

### Frontend Development
```bash
cd frontend

pnpm install                     # Install dependencies
pnpm run dev                     # Start dev server (usually port 5173)
pnpm run build                   # Production build
pnpm run lint                    # ESLint check
```

### Environment Setup
Backend requires `.env` file:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/gestao_financeira?schema=public
JWT_SECRET=super-secret
JWT_EXPIRES_IN=1d
```

## Code Patterns and Conventions

### Backend Patterns
- **DTOs**: Strong validation with class-validator decorators and Portuguese error messages
- **Error Handling**: Use NestJS HTTP exceptions (BadRequestException, NotFoundException, ConflictException) instead of generic Error
- **Services**: Handle business logic, return structured responses with `message` field
- **Controllers**: Thin layer, delegate to services
- **Prisma Errors**: Catch P2002 (unique constraint), P2025 (record not found) specifically

### Frontend Patterns
- **Features**: Each major feature has `components/`, `hooks/`, `pages/`, `services/` subdirectories
- **API Calls**: Use TanStack Query hooks for server state management
- **Components**: Radix UI base components in `shared/components/ui/`
- **Routing**: React Router with nested routes and protected route wrappers

### Security Considerations
- Passwords hashed with bcrypt (10 rounds)
- No sensitive data in logs (debug logs have been removed)
- Input validation on all DTOs with Portuguese error messages
- CORS configured for specific origins only

## Testing Strategy
- **Unit Tests**: Jest for services and utilities
- **E2E Tests**: Supertest for API endpoints
- **Test Location**: `backend/test/` for E2E, `*.spec.ts` files alongside source

## Database Migrations
- Always use `pnpm prisma migrate dev` to create migrations
- Never modify existing migrations
- Prisma client is generated to `backend/generated/prisma/` (custom output location)
- All models use UUID as primary keys

## API Endpoints Structure
- `/auth/login` - Authentication (sets cookie + returns token)
- `/auth/logout` - Clear authentication
- `/user/*` - User management
- `/category/*` - Category CRUD (user-scoped)
- `/accounts/*` - Account management
- `/transaction/*` - Transaction CRUD
- `/dashboard/*` - Aggregated financial data

## Feature Status
- ✅ **Complete**: Authentication, Users, Categories, Basic Accounts
- 🚧 **In Progress**: Transactions, Dashboard metrics
- ❌ **Planned**: Groups collaboration, Advanced reporting, Goals/budgets