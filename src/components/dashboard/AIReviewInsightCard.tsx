import { Sparkles, AlertTriangle, TrendingUp } from 'lucide-react';

interface AIReviewInsightCardProps {
  negativeSummary: string;
  positiveSummary: string;
}

export function AIReviewInsightCard({ negativeSummary, positiveSummary }: AIReviewInsightCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-start gap-3 mb-4">
        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <span className="text-sm font-medium text-gray-900">AI解读</span>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-start gap-3 bg-orange-50 rounded-lg p-3 border border-orange-100">
          <div className="p-1.5 rounded bg-orange-100">
            <AlertTriangle className="w-4 h-4 text-orange-600" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-medium text-orange-800 mb-1">差评高发区总结</h4>
            <p className="text-sm text-orange-700 leading-relaxed">{negativeSummary}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3 bg-green-50 rounded-lg p-3 border border-green-100">
          <div className="p-1.5 rounded bg-green-100">
            <TrendingUp className="w-4 h-4 text-green-600" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-medium text-green-800 mb-1">好评高发区总结</h4>
            <p className="text-sm text-green-700 leading-relaxed">{positiveSummary}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
