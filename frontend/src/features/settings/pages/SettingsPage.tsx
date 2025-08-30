import { Button } from '../../shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../shared/components/ui/card';
import { SettingItem } from '../components/SettingItem';
import { useSettings, useDefaultSettings } from '../hooks/useSettings';
import { Loader2, Settings as SettingsIcon, RotateCcw } from 'lucide-react';

const settingsConfig = {
  theme: {
    title: 'Tema',
    description: 'Escolha entre tema claro ou escuro',
    type: 'select' as const,
    options: [
      { value: 'light', label: 'Claro' },
      { value: 'dark', label: 'Escuro' },
      { value: 'system', label: 'Sistema' },
    ],
    defaultValue: 'light',
  },
  language: {
    title: 'Idioma',
    description: 'Selecione o idioma da interface',
    type: 'select' as const,
    options: [
      { value: 'pt-BR', label: 'Português (Brasil)' },
      { value: 'en-US', label: 'English (US)' },
      { value: 'es-ES', label: 'Español' },
    ],
    defaultValue: 'pt-BR',
  },
  currency: {
    title: 'Moeda',
    description: 'Moeda padrão para exibição de valores',
    type: 'select' as const,
    options: [
      { value: 'BRL', label: 'Real Brasileiro (R$)' },
      { value: 'USD', label: 'Dólar Americano ($)' },
      { value: 'EUR', label: 'Euro (€)' },
    ],
    defaultValue: 'BRL',
  },
  dateFormat: {
    title: 'Formato de Data',
    description: 'Como as datas serão exibidas no sistema',
    type: 'select' as const,
    options: [
      { value: 'DD/MM/YYYY', label: 'DD/MM/AAAA' },
      { value: 'MM/DD/YYYY', label: 'MM/DD/AAAA' },
      { value: 'YYYY-MM-DD', label: 'AAAA-MM-DD' },
    ],
    defaultValue: 'DD/MM/YYYY',
  },
  notifications: {
    title: 'Notificações',
    description: 'Receber notificações sobre transações e lembretes',
    type: 'switch' as const,
    defaultValue: 'enabled',
  },
};

export const SettingsPage = () => {
  const { data: settings, isLoading, error } = useSettings();
  const defaultSettingsMutation = useDefaultSettings();

  const handleApplyDefaults = () => {
    if (window.confirm('Tem certeza que deseja restaurar as configurações padrão?')) {
      defaultSettingsMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Carregando configurações...</span>
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
              Não foi possível carregar as configurações. Tente novamente mais tarde.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Create a map of settings for easy lookup
  const settingsMap = (settings || []).reduce((acc, setting) => {
    acc[setting.key] = setting;
    return acc;
  }, {} as Record<string, any>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Configurações</h1>
          <p className="text-muted-foreground">
            Personalize sua experiência no sistema
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleApplyDefaults}
          disabled={defaultSettingsMutation.isPending}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          {defaultSettingsMutation.isPending ? 'Aplicando...' : 'Restaurar Padrão'}
        </Button>
      </div>

      {!settings || settings.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent className="space-y-4">
            <SettingsIcon className="h-16 w-16 text-muted-foreground mx-auto" />
            <div>
              <h3 className="text-lg font-semibold">Nenhuma configuração encontrada</h3>
              <p className="text-muted-foreground">
                Aplique as configurações padrão para começar.
              </p>
            </div>
            <Button 
              onClick={handleApplyDefaults}
              disabled={defaultSettingsMutation.isPending}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              {defaultSettingsMutation.isPending ? 'Aplicando...' : 'Aplicar Configurações Padrão'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(settingsConfig).map(([key, config]) => {
            const setting = settingsMap[key];
            
            if (!setting) {
              return null;
            }

            return (
              <SettingItem
                key={key}
                setting={setting}
                title={config.title}
                description={config.description}
                type={config.type}
                options={'options' in config ? config.options : undefined}
                defaultValue={config.defaultValue}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};