import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { 
  Home, 
  CreditCard, 
  ArrowUpDown, 
  FileText, 
  Settings, 
  Tag,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Wallet
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Contas", href: "/contas", icon: CreditCard },
  { name: "Transações", href: "/transacoes", icon: ArrowUpDown },
  { name: "Categorias", href: "/categorias", icon: Tag },
  { name: "Relatórios", href: "/relatorios", icon: FileText },
  { name: "Configurações", href: "/configuracoes", icon: Settings },
];

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollapsed = () => setCollapsed(!collapsed);
  const toggleMobile = () => setMobileOpen(!mobileOpen);

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={toggleMobile}
        />
      )}

      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="sm"
        className="lg:hidden fixed top-4 left-4 z-50"
        onClick={toggleMobile}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 z-40 h-full bg-gradient-to-b from-white via-primary/5 to-secondary/10 border-r border-primary/20 backdrop-blur-sm transition-all duration-300 ease-in-out shadow-financial",
          "lg:relative lg:translate-x-0",
          collapsed ? "w-16" : "w-72",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-primary/10">
            {!collapsed && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg">
                  <Wallet className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">
                  Gestão Financeira
                </h1>
              </div>
            )}
            {collapsed && (
              <div className="w-8 h-8 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg mx-auto">
                <Wallet className="w-4 h-4 text-white" />
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleCollapsed}
              className="hidden lg:flex hover:bg-primary/10 transition-colors"
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4 text-primary" />
              ) : (
                <ChevronLeft className="h-4 w-4 text-primary" />
              )}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 p-3">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <Button
                  key={item.name}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 transition-all duration-200 hover:scale-[1.02]",
                    collapsed ? "px-2 py-3" : "px-4 py-3 h-12",
                    isActive 
                      ? "bg-gradient-primary text-white shadow-green hover:bg-gradient-primary/90" 
                      : "hover:bg-primary/10 hover:text-primary text-gray-700"
                  )}
                  onClick={() => {
                    navigate(item.href);
                    setMobileOpen(false);
                  }}
                >
                  <Icon className={cn(
                    "h-5 w-5 flex-shrink-0 transition-transform duration-200",
                    isActive ? "scale-110" : "group-hover:scale-105"
                  )} />
                  {!collapsed && (
                    <span className="truncate font-medium">{item.name}</span>
                  )}
                  {isActive && !collapsed && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-white/80" />
                  )}
                </Button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-primary/10">
            {!collapsed ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5">
                  <div className="w-6 h-6 rounded-full bg-gradient-gold flex items-center justify-center">
                    <span className="text-xs font-bold text-white">💎</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 truncate">
                      Plano Premium
                    </p>
                    <p className="text-xs text-gray-500">
                      Recursos ilimitados
                    </p>
                  </div>
                </div>
                <div className="text-xs text-gray-500 text-center font-medium">
                  v1.0.0 • Gestão Financeira
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-6 h-6 rounded-full bg-gradient-gold flex items-center justify-center">
                  <span className="text-xs">💎</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}