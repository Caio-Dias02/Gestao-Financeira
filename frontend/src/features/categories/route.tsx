import { Route, Routes } from "react-router-dom";
import { CategoriesPage } from "./pages/CategoriesPage";

export const CategoriesRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<CategoriesPage />} />
        </Routes>
    );
};
