import { api } from '../../shared/services/api';

export interface Report {
  id: string;
  name: string;
  description?: string;
  type: 'INCOME_EXPENSE' | 'CATEGORY_ANALYSIS' | 'MONTHLY_SUMMARY' | 'ACCOUNT_BALANCE';
  filters?: any;
  data?: any;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReportData {
  name: string;
  description?: string;
  type: Report['type'];
  filters?: any;
}

export interface UpdateReportData {
  name?: string;
  description?: string;
  type?: Report['type'];
  filters?: any;
}

export const reportsApi = {
  getAll: async (): Promise<Report[]> => {
    const response = await api.get('/reports');
    return response.data.data;
  },

  getById: async (id: string): Promise<Report> => {
    const response = await api.get(`/reports/${id}`);
    return response.data.data;
  },

  create: async (data: CreateReportData): Promise<Report> => {
    const response = await api.post('/reports', data);
    return response.data.data;
  },

  update: async (id: string, data: UpdateReportData): Promise<Report> => {
    const response = await api.patch(`/reports/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/reports/${id}`);
  },

  generateData: async (id: string): Promise<any> => {
    const response = await api.post(`/reports/${id}/generate`);
    return response.data.data;
  },
};