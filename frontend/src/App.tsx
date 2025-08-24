import { DashboardRoutes } from "./features/dashboard/routes"
import { Route, Routes } from "react-router-dom"
import { TransacoesRoutes } from "./features/transacoes/routes";
import { Layout } from "./features/shared/components/layout/Layout";
import { Relatorios } from "./features/relatorios/pages/Relatorios";
import { Configuracoes } from "./features/configuracoes/Configuracoes";
import { ProtectedRoute } from "./features/auth/components/ProtectedRoute";
import { LoginPage } from "./features/auth/pages/LoginPage";
import { AccountsPage } from "./features/account/pages/AccountsPage";
import { Toaster } from "./features/shared/components/ui/toaster";
import { CategoriesRoutes } from "./features/categories/route";


function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Layout><ProtectedRoute><DashboardRoutes /></ProtectedRoute></Layout>} />
        <Route path="/transacoes/*" element={<Layout><ProtectedRoute><TransacoesRoutes /></ProtectedRoute></Layout>} />
        <Route path="/relatorios" element={<Layout><ProtectedRoute><Relatorios /></ProtectedRoute></Layout>} />
        <Route path="/configuracoes" element={<Layout><ProtectedRoute><Configuracoes /></ProtectedRoute></Layout>} />
        <Route path="/contas" element={<Layout><ProtectedRoute><AccountsPage /></ProtectedRoute></Layout>} />
        <Route path="/categorias" element={<Layout><ProtectedRoute><CategoriesRoutes /></ProtectedRoute></Layout>} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App
