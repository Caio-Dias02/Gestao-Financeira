import { Card, CardContent, CardHeader, CardTitle } from "@/features/shared/components/ui/card";

interface SummaryCardProps {
    title: string;
    amount: number;
    color: string;
}

export function SummaryCard({ title, amount, color }: SummaryCardProps) {
    return (
      <Card className="bg-white p-4 rounded-lg">
        <CardHeader><CardTitle className="text-center text-lg font-bold">{title}</CardTitle></CardHeader>
        <CardContent className="flex justify-center items-center"><span className={color}>R$ {amount}</span></CardContent>
      </Card>
    )
  }
  