import { Card, CardContent, CardHeader, CardTitle } from "@/features/shared/components/ui/card";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/currency";
import { ReactNode } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

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
  default: {
    text: "text-gray-900",
    bg: "from-gray-50 to-gray-100",
    border: "border-gray-200",
    iconBg: "bg-gray-100",
    iconColor: "text-gray-600"
  },
  success: {
    text: "text-green-700",
    bg: "from-green-50 to-emerald-50",
    border: "border-green-200",
    iconBg: "bg-green-100",
    iconColor: "text-green-600"
  },
  warning: {
    text: "text-yellow-700",
    bg: "from-yellow-50 to-orange-50", 
    border: "border-yellow-200",
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600"
  },
  danger: {
    text: "text-red-700",
    bg: "from-red-50 to-rose-50",
    border: "border-red-200",
    iconBg: "bg-red-100",
    iconColor: "text-red-600"
  },
};

export function SummaryCard({ 
  title, 
  amount, 
  icon, 
  variant = "default",
  trend,
  className 
}: SummaryCardProps) {
  const variantStyles = variants[variant];
  const hasRealData = amount !== 0 || trend !== undefined;

  return (
    <Card className={cn(
      "relative overflow-hidden group hover:shadow-financial transition-all duration-300 money-card border-0",
      className
    )}>
      {/* Background gradient */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-60",
        variantStyles.bg
      )} />
      
      {/* Decorative element */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-bl-full" />
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
        <div className="flex items-center gap-2">
          <CardTitle className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            {title}
          </CardTitle>
          {!hasRealData && (
            <div className="w-2 h-2 rounded-full bg-gray-400 opacity-60" title="Sem dados disponíveis" />
          )}
        </div>
        {icon && (
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
            variantStyles.iconBg,
            !hasRealData && "opacity-60"
          )}>
            <div className={cn("w-5 h-5", variantStyles.iconColor)}>
              {icon}
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="relative z-10">
        <div className="space-y-3">
          <div className={cn(
            "text-3xl font-bold", 
            variantStyles.text,
            !hasRealData && "opacity-70"
          )}>
            {formatCurrency(amount)}
            {!hasRealData && amount === 0 && (
              <span className="text-xs font-normal text-gray-500 ml-2">
                (sem dados)
              </span>
            )}
          </div>
          
          {trend && (
            <div className="flex items-center justify-between">
              <div className={cn(
                "flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium",
                trend.isPositive 
                  ? "bg-green-100 text-green-700" 
                  : "bg-red-100 text-red-700"
              )}>
                {trend.isPositive ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span>{Math.abs(trend.value)}%</span>
              </div>
              
              <span className="text-xs text-gray-500 font-medium">
                vs. mês anterior
              </span>
            </div>
          )}
          
          {/* Progress indicator */}
          <div className="w-full bg-white/50 rounded-full h-1.5 overflow-hidden">
            <div 
              className={cn(
                "h-full transition-all duration-1000 rounded-full",
                variant === "success" ? "bg-green-500" :
                variant === "warning" ? "bg-yellow-500" :
                variant === "danger" ? "bg-red-500" : "bg-gray-400"
              )}
              style={{ 
                width: `${Math.min(Math.abs(amount) / 10000 * 100, 100)}%` 
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
  