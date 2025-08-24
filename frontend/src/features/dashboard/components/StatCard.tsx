import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: 'success' | 'danger' | 'warning' | 'info';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color = 'info',
  trend,
}) => {
  const colorClasses = {
    success: 'border-success-200 bg-success-50',
    danger: 'border-danger-200 bg-danger-50',
    warning: 'border-warning-200 bg-warning-50',
    info: 'border-info-200 bg-info-50',
  };

  const textColorClasses = {
    success: 'text-success-600',
    danger: 'text-danger-600',
    warning: 'text-warning-600',
    info: 'text-info-600',
  };

  const trendColorClasses = {
    success: 'text-success-600',
    danger: 'text-danger-600',
  };

  return (
    <Card className={`border-2 ${colorClasses[color]} transition-all hover:shadow-lg`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className={`text-sm font-medium ${textColorClasses[color]}`}>
            {title}
          </CardTitle>
          {icon && (
            <div className="text-2xl opacity-20">
              {icon}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-3xl font-bold">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center">
              <span className={`text-sm font-medium ${trendColorClasses[trend.isPositive ? 'success' : 'danger']}`}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span className="text-xs text-gray-500 ml-1">vs mês anterior</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
