import React from 'react';

const AccountsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Contas</h2>
        <button className="btn btn-primary">
          Nova Conta
        </button>
      </div>
      
      <div className="card">
        <p className="text-gray-600">
          Lista de contas será implementada aqui.
        </p>
      </div>
    </div>
  );
};

export default AccountsPage;
