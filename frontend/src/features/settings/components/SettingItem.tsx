import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../shared/components/ui/card';
import { Button } from '../../shared/components/ui/button';
import { Input } from '../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../shared/components/ui/select';
import { Switch } from '../../shared/components/ui/switch';
import { Label } from '../../shared/components/ui/label';
import type { Setting } from '../services/settingsApi';
import { useUpsertSetting } from '../hooks/useSettings';
import { Save, RotateCcw } from 'lucide-react';

interface SettingItemProps {
  setting: Setting;
  title: string;
  description: string;
  type: 'text' | 'select' | 'switch';
  options?: { value: string; label: string }[];
  defaultValue?: string;
}

export const SettingItem = ({ 
  setting, 
  title, 
  description, 
  type, 
  options, 
  defaultValue 
}: SettingItemProps) => {
  const [value, setValue] = useState(setting.value);
  const [hasChanges, setHasChanges] = useState(false);

  const upsertMutation = useUpsertSetting();

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    setHasChanges(newValue !== setting.value);
  };

  const handleSave = () => {
    upsertMutation.mutate(
      { key: setting.key, value },
      {
        onSuccess: () => {
          setHasChanges(false);
        },
      }
    );
  };

  const handleReset = () => {
    const resetValue = defaultValue || setting.value;
    setValue(resetValue);
    setHasChanges(resetValue !== setting.value);
  };

  const renderInput = () => {
    switch (type) {
      case 'text':
        return (
          <Input
            value={value}
            onChange={(e) => handleValueChange(e.target.value)}
            className="max-w-xs"
          />
        );

      case 'select':
        return (
          <Select value={value} onValueChange={handleValueChange}>
            <SelectTrigger className="max-w-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {options?.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'switch':
        return (
          <div className="flex items-center space-x-2">
            <Switch
              id={setting.key}
              checked={value === 'enabled'}
              onCheckedChange={(checked: boolean) => 
                handleValueChange(checked ? 'enabled' : 'disabled')
              }
            />
            <Label htmlFor={setting.key}>
              {value === 'enabled' ? 'Ativado' : 'Desativado'}
            </Label>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          {renderInput()}
        </div>

        {hasChanges && (
          <div className="flex gap-2 pt-2">
            <Button 
              size="sm" 
              onClick={handleSave}
              disabled={upsertMutation.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              {upsertMutation.isPending ? 'Salvando...' : 'Salvar'}
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleReset}
              disabled={upsertMutation.isPending}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};