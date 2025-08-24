interface LastTransactionsProps {
    transactions: {
        id: string;
        title: string;
        amount: number;
        type: string;
    }[];
}

export function LastTransactions({ transactions }: LastTransactionsProps) {
    return (
      <div className="flex flex-col gap-4 bg-white p-4 rounded-lg">
        <h2 className="text-lg font-bold text-center">Últimas Transações</h2>
        {transactions.map(t => (
          <div key={t.id} className="flex justify-between items-center border-b border-gray-200 pb-2">
            <span>{t.title}</span>
            <span className={t.type === "INCOME" ? "text-green-600" : "text-red-600"}>R$ {t.amount}</span>
          </div>
        ))}
      </div>
    )
  }
  