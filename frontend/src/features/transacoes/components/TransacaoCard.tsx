// src/features/transacoes/components/TransacaoCard.tsx
import { Card, CardContent, CardHeader } from '@/features/shared/components/ui/card';
import { Badge } from '@/features/shared/components/ui/badge';

interface TransacaoCardProps {
    descricao: string;
    valor: number;
    categoria: string;
}

export default function TransacaoCard({ descricao, valor, categoria }: TransacaoCardProps) {
    return (
        <Card className="mb-4"> {/* Tailwind aplicado diretamente */}
            <CardHeader>
                <h3 className="text-lg font-semibold">{descricao}</h3>
            </CardHeader>
            <CardContent className="flex justify-between items-center">
                <span>R$ {valor}</span>
                <Badge>{categoria}</Badge> {/* Componente ShadCN */}
            </CardContent>
        </Card>
    );
}
