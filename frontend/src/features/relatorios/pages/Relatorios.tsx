import { useState } from 'react';
import { Button } from '../../shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../shared/components/ui/card';
import { ReportCard } from '../../reports/components/ReportCard';
import { ReportForm } from '../../reports/components/ReportForm';
import { useReports } from '../../reports/hooks/useReports';
import type { Report } from '../../reports/services/reportsApi';
import { Plus, FileText, Loader2 } from 'lucide-react';

export const Relatorios = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | undefined>(undefined);

  const { data: reports, isLoading, error } = useReports();

  const handleNewReport = () => {
    setSelectedReport(undefined);
    setIsFormOpen(true);
  };

  const handleEditReport = (report: Report) => {
    setSelectedReport(report);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedReport(undefined);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Carregando relatórios...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Erro</CardTitle>
            <CardDescription>
              Não foi possível carregar os relatórios. Tente novamente mais tarde.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Relatórios</h1>
          <p className="text-muted-foreground">
            Gerencie e visualize seus relatórios financeiros
          </p>
        </div>
        <Button onClick={handleNewReport}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Relatório
        </Button>
      </div>

      {!reports || reports.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent className="space-y-4">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto" />
            <div>
              <h3 className="text-lg font-semibold">Nenhum relatório encontrado</h3>
              <p className="text-muted-foreground">
                Crie seu primeiro relatório para começar a analisar suas finanças.
              </p>
            </div>
            <Button onClick={handleNewReport}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Relatório
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onEdit={handleEditReport}
            />
          ))}
        </div>
      )}

      <ReportForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        report={selectedReport}
      />
    </div>
  );
};