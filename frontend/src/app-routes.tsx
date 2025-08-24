import { Routes, Route, Outlet } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// Import direto dos layouts (sem lazy loading para evitar suspensão)
import AppLayout from './components/_shared/app-layout';
import AuthGuard from './features/auth/components/auth-guard';

// Lazy loading das páginas
const LoginPage = lazy(() => import('./features/auth/pages/login-page'));
const DashboardPage = lazy(() => import('./features/dashboard/pages/dashboard-page'));
const CategoriesPage = lazy(() => import('./features/categories/pages/categories-page'));
const AccountsPage = lazy(() => import('./features/accounts/pages/accounts-page'));
const TransactionsPage = lazy(() => import('./features/transactions/pages/transactions-page'));
const NotFoundPage = lazy(() => import('./pages/not-found-page'));

// Componente de loading para rotas
const RouteLoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
  </div>
);

// HOC para envolver componentes com Suspense
const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<RouteLoadingFallback />}>
    <Component />
  </Suspense>
);

export function AppRoutes() {
  return (
    <Routes>
      {/* Rota de Login - não protegida, lazy loaded */}
      <Route
        path="/login"
        element={withSuspense(LoginPage)}
      />

      {/* Rotas Protegidas por Autenticação */}
      <Route element={<AuthGuard />}>
        {/* Layout principal da aplicação */}
        <Route
          path="/"
          element={<AppLayout />}
        >
          <Route
            index
            element={withSuspense(DashboardPage)}
          />
          <Route
            path="dashboard"
            element={withSuspense(DashboardPage)}
          />
          <Route
            path="categorias"
            element={withSuspense(CategoriesPage)}
          />
          <Route
            path="contas"
            element={withSuspense(AccountsPage)}
          />
          <Route
            path="transacoes"
            element={withSuspense(TransactionsPage)}
          />
        </Route>
      </Route>

      {/* Rota 404 */}
      <Route
        path="*"
        element={withSuspense(NotFoundPage)}
      />
    </Routes>
  );
}

