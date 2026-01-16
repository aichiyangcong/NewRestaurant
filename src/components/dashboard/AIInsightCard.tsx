import { Sparkles } from 'lucide-react';

interface AIInsightCardProps {
  summary: string;
}

export function AIInsightCard({ summary }: AIInsightCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-gray-900">AI洞察</span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{summary}</p>
        </div>
      </div>
    </div>
  );
}
