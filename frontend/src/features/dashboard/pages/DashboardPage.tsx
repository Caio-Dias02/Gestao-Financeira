import { GraficoCard } from "../components/GraficoCard"

export const DashboardPage = () => {
    const data = [
        { nome: "Janeiro", valor: 100 },
        { nome: "Fevereiro", valor: 200 },
        { nome: "Março", valor: 300 },
    ]
    return (
        <div className="flex flex-col gap-4 p-4">
            <h1 className="text-2xl font-bold text-center">Dashboard</h1>
            <div className="flex flex-col gap-4">
                <GraficoCard data={data} />
            </div>
        </div>
    )
}