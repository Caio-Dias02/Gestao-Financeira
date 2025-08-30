import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../shared/components/ui/card";
import { Button } from "../../shared/components/ui/button";
import { Badge } from "../../shared/components/ui/badge";
import type { Report } from "../services/reportsApi";
import { useDeleteReport, useGenerateReportData } from "../hooks/useReports";
import { FileText, Play, Edit, Trash2, Calendar } from "lucide-react";

interface ReportCardProps {
  report: Report;
  onEdit: (report: Report) => void;
}

const reportTypeLabels = {
  INCOME_EXPENSE: 'Receitas e Despesas',
  CATEGORY_ANALYSIS: 'Análise por Categorias',
  MONTHLY_SUMMARY: 'Resumo Mensal',
  ACCOUNT_BALANCE: 'Saldo de Contas',
};

const reportTypeColors = {
  INCOME_EXPENSE: 'bg-blue-100 text-blue-800',
  CATEGORY_ANALYSIS: 'bg-green-100 text-green-800',
  MONTHLY_SUMMARY: 'bg-purple-100 text-purple-800',
  ACCOUNT_BALANCE: 'bg-orange-100 text-orange-800',
};

export const ReportCard = ({ report, onEdit }: ReportCardProps) => {
  const deleteReportMutation = useDeleteReport();
  const generateDataMutation = useGenerateReportData();

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir este relatório?')) {
      deleteReportMutation.mutate(report.id);
    }
  };

  const handleGenerate = () => {
    generateDataMutation.mutate(report.id);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle className="text-lg">{report.name}</CardTitle>
              {report.description && (
                <CardDescription className="mt-1">{report.description}</CardDescription>
              )}
            </div>
          </div>
          <Badge className={reportTypeColors[report.type]}>
            {reportTypeLabels[report.type]}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Calendar className="h-4 w-4" />
          <span>Criado em {formatDate(report.createdAt)}</span>
        </div>

        <div className="flex gap-2">
          <Button 
            size="sm" 
            onClick={handleGenerate}
            disabled={generateDataMutation.isPending}
            className="flex-1"
          >
            <Play className="h-4 w-4 mr-2" />
            {generateDataMutation.isPending ? 'Gerando...' : 'Gerar'}
          </Button>
          
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => onEdit(report)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleDelete}
            disabled={deleteReportMutation.isPending}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};