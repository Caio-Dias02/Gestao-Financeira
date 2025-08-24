// src/features/transacoes/pages/TransacoesPage.tsx
import TransacaoList from '../components/TransacaoList';

export function TransacoesPage() {
    const transacoes = [
        { descricao: 'Compra Mercado', valor: 150, categoria: 'Alimentação' },
        { descricao: 'Salário', valor: 2500, categoria: 'Receita' },
    ];

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-center">Transações</h1>
            <TransacaoList transacoes={transacoes} />
        </div>
    );
}
