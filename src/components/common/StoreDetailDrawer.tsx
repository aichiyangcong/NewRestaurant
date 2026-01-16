import { MapPin, Star, ThumbsDown, MessageCircle, Calendar, Trophy, AlertTriangle, Clock } from 'lucide-react';
import { format, differenceInHours } from 'date-fns';
import { Drawer } from './Drawer';
import { useDashboardStore } from '../../store/dashboardStore';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';

const RISK_KEYWORDS = ['异物', '腹泻', '变质', '拉肚子', '不新鲜', '过期', '脏', '虫子', '头发'];
const NEGATIVE_KEYWORDS = ['差', '难吃', '慢', '态度', '冷', '少', '贵', '等', '服务'];

export function StoreDetailDrawer() {
  const { selectedStoreDetail, showStoreDrawer, closeStoreDrawer, openReviewDrillDown } = useDashboardStore();

  if (!selectedStoreDetail) return null;

  const positiveData = selectedStoreDetail.positiveTagsTop3;
  const negativeData = selectedStoreDetail.negativeTagsTop3;

  const hasRiskTags = negativeData.some(tag =>
    RISK_KEYWORDS.some(keyword => tag.name.includes(keyword))
  );

  const allTags = [
    ...positiveData.map(d => ({ ...d, type: 'positive' as const })),
    ...negativeData.map(d => ({ ...d, type: 'negative' as const })),
  ].slice(0, 5);

  const handleChartClick = (params: any) => {
    const tagName = allTags[params.dataIndex]?.name;
    const tagType = allTags[params.dataIndex]?.type;

    if (tagName) {
      openReviewDrillDown({
        storeId: selectedStoreDetail.id,
        storeName: selectedStoreDetail.name,
        tagFilter: tagName,
        sentiment: tagType === 'positive' ? 'positive' : 'negative',
      });
    }
  };

  const chartOption: EChartsOption = {
    title: { text: '门店Top5正负评价', left: 'center', textStyle: { fontSize: 16 } },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params: any) => {
        const param = Array.isArray(params) ? params[0] : params;
        return `${param.name}: ${param.value}条`;
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: 50,
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      name: '提及次数',
      minInterval: 1,
      axisLabel: {
        formatter: '{value}',
      },
    },
    yAxis: {
      type: 'category',
      data: allTags.map(d => d.name),
      axisLabel: {
        fontSize: 12,
        color: '#374151',
      },
    },
    series: [
      {
        type: 'bar',
        data: allTags.map(d => ({
          value: d.value,
          itemStyle: {
            color: d.type === 'positive'
              ? '#16a34a'
              : RISK_KEYWORDS.some(keyword => d.name.includes(keyword))
              ? '#dc2626'
              : '#f97316',
          },
        })),
        barWidth: '60%',
        label: {
          show: true,
          position: 'right',
          formatter: '{c}条',
          color: '#374151',
          fontSize: 12,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0,0,0,0.3)',
          },
        },
        cursor: 'pointer',
      },
    ],
  };

  const highlightKeywords = (text: string) => {
    const allKeywords = [...RISK_KEYWORDS, ...NEGATIVE_KEYWORDS];
    let highlightedText = text;

    allKeywords.forEach(keyword => {
      const regex = new RegExp(`(${keyword})`, 'gi');
      const isRisk = RISK_KEYWORDS.includes(keyword);
      const className = isRisk
        ? 'bg-red-100 text-red-700 font-semibold px-1 rounded'
        : 'bg-yellow-100 text-yellow-700 px-1 rounded';
      highlightedText = highlightedText.replace(regex, `<mark class="${className}">$1</mark>`);
    });

    return highlightedText;
  };

  return (
    <Drawer
      isOpen={showStoreDrawer}
      onClose={closeStoreDrawer}
      title="门店详情"
      width="max-w-3xl"
    >
      <div className="space-y-6">
        <div className="border-b pb-4">
          <div className="flex items-start justify-between mb-2">
            <h2 className="text-2xl font-bold text-gray-900">{selectedStoreDetail.name}</h2>
            {selectedStoreDetail.commercialAreaRanking && (
              <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1.5 rounded-full shadow-md">
                <Trophy className="w-4 h-4" />
                <span className="text-sm font-semibold">
                  {selectedStoreDetail.commercialAreaRanking.area}商圈
                  {selectedStoreDetail.commercialAreaRanking.category}
                  第 {selectedStoreDetail.commercialAreaRanking.rank} 名
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{selectedStoreDetail.address}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>开业于 {format(selectedStoreDetail.openDate, 'yyyy-MM-dd')}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-gray-600">平均评分</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{selectedStoreDetail.avgRating}</p>
          </div>

          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <ThumbsDown className="w-4 h-4 text-red-600" />
              <span className="text-sm text-gray-600">差评率</span>
            </div>
            <p className="text-2xl font-bold text-red-600">{selectedStoreDetail.negativeRate}%</p>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-600">回复率</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{selectedStoreDetail.replyRate}%</p>
          </div>
        </div>

        {(positiveData.length > 0 || negativeData.length > 0) && (
          <div className="bg-white border rounded-lg p-4">
            {hasRiskTags && (
              <div className="mb-4 flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-900">食品安全风险警告</p>
                  <p className="text-xs text-red-700 mt-1">
                    检测到严重问题标签，请立即处理相关评价并核查店内情况
                  </p>
                </div>
              </div>
            )}
            <ReactECharts
              option={chartOption}
              style={{ height: '200px' }}
              onEvents={{
                click: handleChartClick
              }}
            />
            <p className="text-xs text-gray-500 text-center mt-2">点击柱状图查看详细评价</p>
          </div>
        )}

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">最近评价</h3>
          <div className="space-y-3">
            {selectedStoreDetail.recentReviews.slice(0, 5).map((review) => {
              const replyHours = review.replied && review.replyTime
                ? differenceInHours(review.replyTime, review.createTime)
                : null;
              const isSlowReply = replyHours && replyHours > 24;

              return (
                <div
                  key={review.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(review.rating)
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{review.rating}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {format(review.createTime, 'yyyy-MM-dd HH:mm')}
                    </span>
                  </div>

                  <div
                    className="text-sm text-gray-700 mb-2"
                    dangerouslySetInnerHTML={{ __html: highlightKeywords(review.content) }}
                  />

                  <div className="flex items-center gap-2 flex-wrap">
                    {review.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`text-xs px-2 py-1 rounded ${
                          RISK_KEYWORDS.some(keyword => tag.includes(keyword))
                            ? 'bg-red-100 text-red-700 font-semibold'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                      {review.channel}
                    </span>
                  </div>

                  {review.replied && review.replyContent && (
                    <div className="mt-3 pl-4 border-l-2 border-blue-500">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-xs text-gray-500">商家回复</p>
                        {replyHours !== null && (
                          <div className={`flex items-center gap-1 text-xs ${
                            isSlowReply ? 'text-orange-600' : 'text-green-600'
                          }`}>
                            <Clock className="w-3 h-3" />
                            <span>耗时 {replyHours} 小时</span>
                            {isSlowReply && <span className="font-semibold">⚠️</span>}
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-700">{review.replyContent}</p>
                    </div>
                  )}

                  {!review.replied && review.rating < 3 && (
                    <div className="mt-3 flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                      <p className="text-xs text-yellow-700 font-medium">差评未回复，请尽快处理</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Drawer>
  );
}
