import { Card, CardContent, CardHeader, CardTitle } from "@/features/shared/components/ui/card";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Area, AreaChart } from "recharts";
import { formatCurrency } from "@/lib/currency";
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react";

interface GraficoCardProps {
    data: {
        nome: string;
        valor: number;
    }[];
}

export function GraficoCard({ data }: GraficoCardProps) {
    // Validate and sanitize data with better error handling
    const validData = Array.isArray(data) ? data
        .filter(item => {
            const isValid = item && 
                typeof item === 'object' && 
                (item.nome || item.name) && 
                !isNaN(Number(item.valor || item.value || 0));
            
            return isValid;
        })
        .map(item => ({
            nome: String(item.nome || item.name || 'Período'),
            valor: Number(item.valor || item.value || 0)
        })) : [];
    
    const hasData = validData.length > 0;
    
    // Calculate trend with better error handling
    const trend = hasData && validData.length > 1 
        ? validData[validData.length - 1].valor - validData[0].valor 
        : 0;
    const isPositiveTrend = trend >= 0;

    // Get min/max values for better Y-axis scaling
    const values = validData.map(d => d.valor);
    const minValue = values.length > 0 ? Math.min(...values) : 0;
    const maxValue = values.length > 0 ? Math.max(...values) : 0;
    const padding = Math.abs(maxValue - minValue) * 0.1 || 1000;

    return (
        <Card className="money-card border-0 shadow-financial overflow-hidden">
            <CardHeader className="pb-2 px-6 pt-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-primary" />
                        <CardTitle className="text-lg font-bold text-gray-900">
                            Evolução Financeira
                        </CardTitle>
                    </div>
                    {hasData && validData.length > 1 && (
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
                            isPositiveTrend 
                                ? 'bg-green-100 text-green-700 border border-green-200' 
                                : 'bg-red-100 text-red-700 border border-red-200'
                        }`}>
                            {isPositiveTrend ? (
                                <TrendingUp className="w-3 h-3" />
                            ) : (
                                <TrendingDown className="w-3 h-3" />
                            )}
                            <span>{formatCurrency(Math.abs(trend))}</span>
                        </div>
                    )}
                </div>
                {hasData && (
                    <p className="text-sm text-gray-500 mt-1">
                        Últimos {validData.length} períodos
                    </p>
                )}
            </CardHeader>

            <CardContent className="px-2 pb-6">
                {!hasData ? (
                    <div className="flex flex-col items-center justify-center h-[280px] text-gray-500">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-4">
                            <BarChart3 className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="font-semibold text-gray-700 mb-2">Sem dados financeiros</h3>
                        <p className="text-sm text-gray-500 text-center max-w-xs">
                            Adicione algumas transações para visualizar a evolução das suas finanças
                        </p>
                    </div>
                ) : (
                    <div className="w-full h-[280px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart 
                                data={validData} 
                                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                            >
                                <defs>
                                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2B8A3E" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#2B8A3E" stopOpacity={0.02}/>
                                    </linearGradient>
                                    <filter id="shadow">
                                        <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.1"/>
                                    </filter>
                                </defs>
                                
                                <CartesianGrid 
                                    strokeDasharray="2 2" 
                                    stroke="#e5e7eb" 
                                    vertical={false}
                                    horizontal={true}
                                />
                                
                                <XAxis 
                                    dataKey="nome" 
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fill: '#6b7280', fontWeight: 500 }}
                                    dy={10}
                                />
                                
                                <YAxis 
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fill: '#6b7280', fontWeight: 500 }}
                                    tickFormatter={(value) => {
                                        const num = Number(value);
                                        if (num >= 1000000) return `${(num/1000000).toFixed(1)}M`;
                                        if (num >= 1000) return `${(num/1000).toFixed(0)}K`;
                                        return formatCurrency(num).replace('R$', '').trim();
                                    }}
                                    domain={[minValue - padding, maxValue + padding]}
                                    dx={-10}
                                />
                                
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: 'white',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '12px',
                                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                                        padding: '12px'
                                    }}
                                    formatter={(value: number, name: string) => [
                                        formatCurrency(value), 
                                        'Saldo'
                                    ]}
                                    labelFormatter={(label) => `Período: ${label}`}
                                    labelStyle={{ 
                                        color: '#374151', 
                                        fontWeight: '600', 
                                        marginBottom: '4px' 
                                    }}
                                    cursor={{ 
                                        stroke: '#2B8A3E', 
                                        strokeWidth: 1.5, 
                                        strokeDasharray: '4 4',
                                        strokeOpacity: 0.7
                                    }}
                                />
                                
                                <Area 
                                    type="monotone" 
                                    dataKey="valor" 
                                    stroke="#2B8A3E"
                                    strokeWidth={2.5}
                                    fill="url(#areaGradient)"
                                    filter="url(#shadow)"
                                />
                                
                                <Line 
                                    type="monotone" 
                                    dataKey="valor" 
                                    stroke="#2B8A3E"
                                    strokeWidth={2.5}
                                    dot={{ 
                                        fill: '#ffffff', 
                                        strokeWidth: 3,
                                        stroke: '#2B8A3E',
                                        r: 4
                                    }}
                                    activeDot={{ 
                                        r: 6, 
                                        fill: '#2B8A3E',
                                        stroke: '#ffffff',
                                        strokeWidth: 3,
                                        filter: 'drop-shadow(0 2px 4px rgba(43, 138, 62, 0.3))'
                                    }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}