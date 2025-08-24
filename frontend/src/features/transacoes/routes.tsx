import { Route, Routes } from "react-router-dom";
import { TransacoesPage } from "./pages/TransacoesPage";

export const TransacoesRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<TransacoesPage />} />
        </Routes>
    )
}