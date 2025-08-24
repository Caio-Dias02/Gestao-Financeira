import { DashboardRoutes } from "./features/dashboard/routes"
import { useRoutes } from "react-router-dom"
import { TransacoesRoutes } from "./features/transacoes/routes";

function App() {

  const routes = useRoutes([
    {
      path: "/",
      element: <DashboardRoutes />,
    },
    {
      path: "/transacoes",
      element: <TransacoesRoutes />,
    },
  ])

  return routes;
}

export default App
