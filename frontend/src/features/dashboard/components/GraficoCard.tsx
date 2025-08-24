import { Card, CardContent, CardHeader, CardTitle } from "@/features/shared/components/ui/card";
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";

interface GraficoCardProps {
    data: {
        nome: string;
        valor: number;
    }[];
}

export function GraficoCard({ data }: GraficoCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Resumo Financeiro</CardTitle>
            </CardHeader>

            <CardContent className="flex justify-center items-center">
                <LineChart width={600} height={300} data={data}>
                    <CartesianGrid stroke="#ccc" />
                    <XAxis dataKey="nome" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="valor" stroke="#8884d8" />
                </LineChart>

            </CardContent>
        </Card>
    )
}