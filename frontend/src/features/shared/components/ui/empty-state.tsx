import { ReactNode } from "react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center py-16 px-6",
      className
    )}>
      {icon && (
        <div className="mb-6 relative">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/10 via-secondary/5 to-primary/10 flex items-center justify-center text-primary/60 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            <div className="relative z-10">
              {icon}
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-gold opacity-30 animate-bounce delay-300" />
          <div className="absolute -bottom-2 -left-2 w-4 h-4 rounded-full bg-gradient-primary opacity-40 animate-pulse" />
        </div>
      )}
      
      <div className="space-y-3 mb-8">
        <h3 className="text-xl font-bold text-gray-900">
          {title}
        </h3>
        {description && (
          <p className="text-gray-600 max-w-md text-base leading-relaxed">
            {description}
          </p>
        )}
      </div>
      
      {action && (
        <Button 
          onClick={action.onClick}
          className="bg-gradient-primary hover:opacity-90 shadow-green text-white font-medium px-8 py-3 text-base transition-all duration-200 hover:scale-105"
          size="lg"
        >
          <span className="mr-2">✨</span>
          {action.label}
        </Button>
      )}
      
      {/* Bottom decoration */}
      <div className="mt-8 flex items-center gap-2 opacity-40">
        <div className="w-2 h-2 rounded-full bg-primary" />
        <div className="w-2 h-2 rounded-full bg-secondary" />
        <div className="w-2 h-2 rounded-full bg-primary" />
      </div>
    </div>
  );
}