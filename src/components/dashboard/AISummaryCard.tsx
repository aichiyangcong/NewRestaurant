import { AlertTriangle, TrendingUp } from 'lucide-react';

interface AISummaryCardProps {
  summary: string;
  mode: 'positive' | 'negative';
}

export function AISummaryCard({ summary, mode }: AISummaryCardProps) {
  const isNegative = mode === 'negative';
  
  return (
    <div className={`rounded-xl p-4 ${isNegative ? 'bg-orange-50 border border-orange-200' : 'bg-green-50 border border-green-200'}`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${isNegative ? 'bg-orange-100' : 'bg-green-100'}`}>
          {isNegative ? (
            <AlertTriangle className="w-5 h-5 text-orange-600" />
          ) : (
            <TrendingUp className="w-5 h-5 text-green-600" />
          )}
        </div>
        <div className="flex-1">
          <h3 className={`text-sm font-semibold mb-1 ${isNegative ? 'text-orange-800' : 'text-green-800'}`}>
            {isNegative ? '差评高发区总结' : '好评高发区总结'}
          </h3>
          <p className={`text-sm leading-relaxed ${isNegative ? 'text-orange-700' : 'text-green-700'}`}>
            {summary}
          </p>
        </div>
      </div>
    </div>
  );
}
