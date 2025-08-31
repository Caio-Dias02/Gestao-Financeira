# Frontend - Gestão Financeira

Interface moderna e responsiva para o sistema de gestão financeira pessoal, construída com React 19, TypeScript, Tailwind CSS e shadcn/ui.

## 🚀 Tecnologias

- **React 19** - Framework principal
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Estilização utilitária
- **shadcn/ui** - Componentes UI modernos
- **Radix UI** - Primitivos acessíveis
- **TanStack Query** - Gerenciamento de estado do servidor
- **React Router v7** - Roteamento
- **Lucide React** - Ícones
- **React Hook Form** - Gerenciamento de formulários
- **Axios** - Cliente HTTP

## 📦 Instalação

```bash
# Instalar dependências
pnpm install

# Iniciar servidor de desenvolvimento
pnpm dev

# Build de produção
pnpm build

# Preview do build
pnpm preview

# Lint
pnpm lint
```

## 🎨 Design System

### Componentes Principais

- **shadcn/ui components**: Button, Card, Input, Dialog, Select, etc.
- **Layout**: Sidebar responsiva com navegação colapsável
- **Loading States**: Skeletons e indicadores de carregamento
- **Empty States**: Estados vazios com call-to-actions
- **Error Handling**: Boundary de erros e alertas
- **Page Headers**: Cabeçalhos consistentes com ações

### Padrões Visuais

- **Cores**: Sistema baseado em CSS variables para suporte a temas
- **Espaçamento**: Grid system responsivo
- **Tipografia**: Sistema hierárquico
- **Animações**: Transições suaves e micro-interações
- **Acessibilidade**: Componentes acessíveis por padrão

## 📱 Layout

### Desktop
- Sidebar fixa à esquerda
- Conteúdo principal responsivo
- Navegação por ícones e texto

### Mobile
- Sidebar colapsável com overlay
- Menu hamburger
- Otimizado para touch

## 🔧 Estrutura de Componentes

```
src/
├── features/
│   ├── shared/
│   │   └── components/
│   │       ├── layout/
│   │       │   ├── Layout.tsx
│   │       │   └── Sidebar.tsx
│   │       └── ui/
│   │           ├── button.tsx
│   │           ├── card.tsx
│   │           ├── page-header.tsx
│   │           ├── loading-state.tsx
│   │           ├── empty-state.tsx
│   │           └── error-boundary.tsx
│   ├── dashboard/
│   ├── categories/
│   ├── accounts/
│   ├── transactions/
│   └── auth/
└── lib/
    ├── utils.ts
    ├── api.ts
    └── currency.ts
```

## 🎯 Funcionalidades

### Dashboard
- Cards de resumo com indicadores visuais
- Gráficos de receitas e despesas
- Últimas transações
- Estados de loading otimizados

### Categorias
- Grid responsivo de cards
- Modal de criação/edição
- Dropdown menu com ações
- Estados vazios intuitivos

### Autenticação
- Login com design moderno
- Gradientes e micro-animações
- Validação em tempo real
- Error boundary

## 🔄 Estados da Aplicação

### Loading
- Skeleton loaders personalizados
- Indicadores de carregamento contextuais
- Estados por tipo (lista, grid, página)

### Erro
- Boundary de erro global
- Alertas contextuais
- Botões de retry
- Feedback visual consistente

### Vazio
- Empty states com ilustrações
- Call-to-actions claras
- Onboarding integrado

## 🎨 Customização

### Temas
O sistema suporta temas claro/escuro através de CSS variables:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 224 71.4% 4.1%;
  --primary: 220.9 39.3% 11%;
  --primary-foreground: 210 20% 98%;
  /* ... */
}
```

### Componentes
Todos os componentes são baseados em shadcn/ui com customizações:

```tsx
// Exemplo de uso
<PageHeader 
  title="Dashboard" 
  description="Visão geral das finanças"
>
  <Button>Nova Transação</Button>
</PageHeader>
```

## 📱 Responsividade

- **Mobile First**: Design otimizado para dispositivos móveis
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Sidebar Adaptativa**: Colapsa em telas menores
- **Grid System**: Responsivo para diferentes tamanhos

## ⚡ Performance

- **Code Splitting**: Lazy loading de rotas
- **Memoização**: React.memo em componentes pesados
- **Otimizações**: Bundle size otimizado
- **Caching**: TanStack Query para cache inteligente

## 🔧 Desenvolvimento

### Comandos Úteis

```bash
# Desenvolvimento
pnpm dev              # Servidor dev (localhost:5173)

# Build
pnpm build           # Build de produção
pnpm preview         # Preview do build

# Qualidade
pnpm lint            # ESLint
```

### Padrões de Código

- **Componentes**: PascalCase
- **Hooks**: camelCase com prefixo "use"
- **Utilitários**: camelCase
- **Constantes**: UPPER_SNAKE_CASE
- **Imports**: Organizados por ordem (externos, internos, relativos)

## 🎭 Estados e Interações

### Micro-interações
- Hover states suaves
- Loading spinners contextuais
- Transições de página
- Feedback visual imediato

### UX Patterns
- Confirmações para ações destrutivas
- Feedbacks de sucesso/erro
- Navegação breadcrumb
- Atalhos de teclado

---

**Nota**: Este frontend foi reestruturado para usar shadcn/ui consistentemente, melhorando a experiência do usuário e a manutenibilidade do código.
