import React from 'react';

const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
        <p className="text-gray-600">
          Bem-vindo ao seu painel de gestão financeira!
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Saldo Total</h3>
          <p className="text-3xl font-bold text-success-600">R$ 0,00</p>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Receitas do Mês</h3>
          <p className="text-3xl font-bold text-success-600">R$ 0,00</p>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Despesas do Mês</h3>
          <p className="text-3xl font-bold text-danger-600">R$ 0,00</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
