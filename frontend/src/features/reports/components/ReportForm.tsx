import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../shared/components/ui/dialog';
import { Button } from '../../shared/components/ui/button';
import { Input } from '../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../shared/components/ui/select';
import { Label } from '../../shared/components/ui/label';
import { Textarea } from '../../shared/components/ui/textarea';
import type { Report, CreateReportData, UpdateReportData } from '../services/reportsApi';
import { useCreateReport, useUpdateReport } from '../hooks/useReports';

interface ReportFormProps {
  isOpen: boolean;
  onClose: () => void;
  report?: Report;
}

const reportTypes = [
  { value: 'INCOME_EXPENSE', label: 'Receitas e Despesas' },
  { value: 'CATEGORY_ANALYSIS', label: 'Análise por Categorias' },
  { value: 'MONTHLY_SUMMARY', label: 'Resumo Mensal' },
  { value: 'ACCOUNT_BALANCE', label: 'Saldo de Contas' },
];

export const ReportForm = ({ isOpen, onClose, report }: ReportFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'INCOME_EXPENSE' as 'INCOME_EXPENSE' | 'CATEGORY_ANALYSIS' | 'MONTHLY_SUMMARY' | 'ACCOUNT_BALANCE',
  });

  const createReportMutation = useCreateReport();
  const updateReportMutation = useUpdateReport();

  const isEditing = !!report;
  const isLoading = createReportMutation.isPending || updateReportMutation.isPending;

  useEffect(() => {
    if (report) {
      setFormData({
        name: report.name,
        description: report.description || '',
        type: report.type,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        type: 'INCOME_EXPENSE',
      });
    }
  }, [report, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditing) {
      const updateData: UpdateReportData = {
        name: formData.name,
        description: formData.description || undefined,
        type: formData.type,
      };
      
      updateReportMutation.mutate(
        { id: report.id, data: updateData },
        { onSuccess: () => onClose() }
      );
    } else {
      const createData: CreateReportData = {
        name: formData.name,
        description: formData.description || undefined,
        type: formData.type,
      };
      
      createReportMutation.mutate(createData, { onSuccess: () => onClose() });
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Relatório' : 'Novo Relatório'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Nome do relatório"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Descrição do relatório"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tipo do Relatório</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleInputChange('type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {reportTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.name.trim()}
              className="flex-1"
            >
              {isLoading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};