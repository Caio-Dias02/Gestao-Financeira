import { api } from '../../shared/services/api';

export interface Setting {
  id: string;
  key: string;
  value: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSettingData {
  key: string;
  value: string;
}

export interface UpdateSettingData {
  value: string;
}

export const settingsApi = {
  getAll: async (): Promise<Setting[]> => {
    const response = await api.get('/settings');
    return response.data.data;
  },

  getByKey: async (key: string): Promise<Setting> => {
    const response = await api.get(`/settings/${key}`);
    return response.data.data;
  },

  create: async (data: CreateSettingData): Promise<Setting> => {
    const response = await api.post('/settings', data);
    return response.data.data;
  },

  update: async (key: string, data: UpdateSettingData): Promise<Setting> => {
    const response = await api.patch(`/settings/${key}`, data);
    return response.data.data;
  },

  upsert: async (key: string, value: string): Promise<Setting> => {
    const response = await api.put(`/settings/${key}`, { value });
    return response.data.data;
  },

  delete: async (key: string): Promise<void> => {
    await api.delete(`/settings/${key}`);
  },

  getDefaults: async (): Promise<Setting[]> => {
    const response = await api.get('/settings/defaults');
    return response.data.data;
  },
};