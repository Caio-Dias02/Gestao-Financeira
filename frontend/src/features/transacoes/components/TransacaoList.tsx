// src/features/transacoes/components/TransacaoList.tsx
import TransacaoCard from './TransacaoCard';

interface Transacao {
    descricao: string;
    valor: number;
    categoria: string;
}

interface Props {
    transacoes: Transacao[];
}

export default function TransacaoList({ transacoes }: Props) {
    return (
        <div>
            {transacoes.map((t, i) => (
                <TransacaoCard
                    key={i}
                    descricao={t.descricao}
                    valor={t.valor}
                    categoria={t.categoria}
                />
            ))}
        </div>
    );
}
