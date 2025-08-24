# Tech Context — Stack tecnológico e configurações

## Backend Stack

### Core Framework
- **NestJS**: Framework Node.js para aplicações escaláveis
- **TypeScript**: Linguagem principal com tipagem estática
- **Node.js**: Runtime JavaScript

### Database & ORM
- **PostgreSQL**: Banco de dados relacional principal
- **Prisma**: ORM type-safe com migrations automáticas
- **Docker**: Containerização do banco de dados

### Authentication & Security
- **JWT**: JSON Web Tokens para autenticação
- **Passport**: Estratégias de autenticação
- **bcrypt**: Hash de senhas
- **class-validator**: Validação de DTOs
- **class-transformer**: Transformação de dados

### Development Tools
- **ESLint**: Linting de código
- **Jest**: Framework de testes
- **pnpm**: Gerenciador de pacotes

## Frontend Stack

### Core Framework
- **React 18**: Biblioteca para interfaces de usuário
- **TypeScript**: Linguagem principal com tipagem estática
- **Vite**: Build tool e dev server

### State Management & Data Fetching
- **TanStack Query (React Query)**: Gerenciamento de estado do servidor
- **React Hook Form**: Gerenciamento de formulários
- **Zod**: Validação de schemas TypeScript

### UI & Styling
- **Tailwind CSS**: Framework CSS utility-first
- **Shadcn/ui**: Componentes base reutilizáveis
- **Recharts**: Biblioteca de gráficos
- **PostCSS**: Processador CSS
- **Autoprefixer**: Prefixos CSS automáticos

### Development Tools
- **npm**: Gerenciador de pacotes
- **ESLint**: Linting de código
- **TypeScript Compiler**: Compilação e verificação de tipos

## Development Environment

### Backend
- **Port**: 3001
- **Database**: PostgreSQL via Docker (port 5432)
- **Hot Reload**: `npm run start:dev`
- **Build**: `npm run build`
- **Test**: `npm run test`

### Frontend
- **Port**: 3000
- **Dev Server**: `npm start`
- **Build**: `npm run build`
- **Type Check**: `npm run type-check`

### Database
- **PostgreSQL**: Versão 15+
- **Prisma Studio**: Interface visual para banco (`npx prisma studio`)
- **Migrations**: `npx prisma migrate dev`

## Dependencies & Versions

### Backend Dependencies
```json
{
  "@nestjs/common": "^10.0.0",
  "@nestjs/core": "^10.0.0",
  "@nestjs/jwt": "^10.0.0",
  "@nestjs/passport": "^10.0.0",
  "@nestjs/platform-express": "^10.0.0",
  "@prisma/client": "^5.0.0",
  "prisma": "^5.0.0",
  "bcrypt": "^5.0.0",
  "passport": "^0.6.0",
  "passport-jwt": "^4.0.0"
}
```

### Frontend Dependencies
```json
{
  "react": "^18.0.0",
  "react-dom": "^18.0.0",
  "@tanstack/react-query": "^5.0.0",
  "@tanstack/react-query-devtools": "^5.0.0",
  "react-hook-form": "^7.0.0",
  "zod": "^3.0.0",
  "recharts": "^2.0.0",
  "tailwindcss": "^3.0.0",
  "@tailwindcss/postcss": "^3.0.0",
  "autoprefixer": "^10.0.0"
}
```

## Configuration Files

### Backend
- `nest-cli.json`: Configuração do NestJS CLI
- `tsconfig.json`: Configuração do TypeScript
- `eslint.config.mjs`: Configuração do ESLint
- `docker-compose.yml`: Configuração do Docker
- `prisma/schema.prisma`: Schema do banco de dados

### Frontend
- `tsconfig.json`: Configuração do TypeScript
- `tailwind.config.js`: Configuração do Tailwind CSS
- `postcss.config.js`: Configuração do PostCSS
- `vite.config.ts`: Configuração do Vite
- `package.json`: Dependências e scripts

## Build & Deployment

### Development
- **Backend**: Hot reload com `npm run start:dev`
- **Frontend**: Dev server com `npm start`
- **Database**: Docker container local

### Production
- **Backend**: Build otimizado com `npm run build`
- **Frontend**: Build otimizado com `npm run build`
- **Database**: PostgreSQL em servidor dedicado
- **Cache**: Redis para dashboards (futuro)


