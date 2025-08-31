import { Card, CardContent, CardHeader, CardTitle } from "@/features/shared/components/ui/card";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SummaryCardProps {
  title: string;
  amount: number;
  icon?: ReactNode;
  variant?: "default" | "success" | "warning" | "danger";
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const variants = {
  default: "text-gray-900",
  success: "text-green-600",
  warning: "text-yellow-600",
  danger: "text-red-600",
};

export function SummaryCard({ 
  title, 
  amount, 
  icon, 
  variant = "default",
  trend,
  className 
}: SummaryCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && (
          <div className="h-4 w-4 text-muted-foreground">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between">
          <div className={cn("text-2xl font-bold", variants[variant])}>
            {formatCurrency(amount)}
          </div>
          {trend && (
            <div className={cn(
              "flex items-center text-xs font-medium",
              trend.isPositive ? "text-green-600" : "text-red-600"
            )}>
              <span>{trend.isPositive ? "↗" : "↘"}</span>
              <span className="ml-1">{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
  