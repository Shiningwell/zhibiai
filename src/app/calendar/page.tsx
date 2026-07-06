'use client';

import { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import { getDemoCalendar } from '@/lib/demo-data-new';
import { CalendarResult, CalendarDayInfo } from '@/types';

const CATEGORIES = ['蓝牙耳机', '连衣裙', '手机壳', '护肤品', '运动鞋', '数码配件', '家居用品', '食品饮料'];

const DAY_COLORS = [
  'from-orange-400 to-red-400',
  'from-blue-400 to-indigo-400',
  'from-green-400 to-teal-400',
  'from-purple-400 to-pink-400',
  'from-amber-400 to-orange-400',
  'from-cyan-400 to-blue-400',
  'from-rose-400 to-red-400',
];

export default function CalendarPage() {
  const [category, setCategory] = useState('');
  const [result, setResult] = useState<CalendarResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const handleAnalyze = async () => {
    if (!category) {
      setError('请选择商品类目');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);
    setSelectedDay(null);

    try {
      await new Promise(r => setTimeout(r, 700));
      const calendarResult = getDemoCalendar(category);
      setResult(calendarResult);
      // Auto-select best day (Friday = 5)
      const bestDayInfo = calendarResult.schedule.find(d => d.dayName === calendarResult.bestDay);
      if (bestDayInfo) setSelectedDay(bestDayInfo.dayOfWeek);
    } catch {
      setError('分析失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const selectedDayInfo: CalendarDayInfo | undefined = result?.schedule.find(d => d.dayOfWeek === selectedDay);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        badge="发布日历"
        title="发布日历"
        description="根据类目显示最佳发布时间，基于各平台流量数据"
        actions={
          <span className="px-2 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-200 text-xs font-medium">
            Pro功能
          </span>
        }
      />

      {/* Category Selection */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">选择商品类目</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                category === cat
                  ? 'bg-[#FF6B35] text-white shadow-sm'
                  : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <button
          onClick={handleAnalyze}
          disabled={loading || !category}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#FF6B35] to-[#FF3D57] text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-orange-200 transition-all btn-press disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              分析中...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              查看最佳发布时间
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-7 gap-2">
          {[1,2,3,4,5,6,7].map(i => (
            <div key={i} className="rounded-xl border border-gray-100 bg-white p-3">
              <div className="skeleton h-4 w-8 mb-2" />
              <div className="skeleton h-3 w-full" />
              <div className="skeleton h-3 w-2/3 mt-1" />
            </div>
          ))}
        </div>
      )}

      {result && !loading && (
        <div className="space-y-6">
          {/* Best Time Summary */}
          <div className="rounded-2xl bg-gradient-to-r from-[#FF6B35] to-[#FF3D57] p-5 sm:p-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🎯</span>
              <h3 className="text-lg font-bold">最佳发布时间</h3>
            </div>
            <p className="text-white/90 text-sm">
              {result.category}类目建议在 <span className="font-bold text-white">{result.bestDay}</span> 的 <span className="font-bold text-white">{result.bestTime}</span> 发布，此时流量最高、转化率最佳
            </p>
          </div>

          {/* Weekly Calendar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {result.schedule.map((day, idx) => {
              const isBest = day.dayName === result.bestDay;
              const isSelected = selectedDay === day.dayOfWeek;
              return (
                <button
                  key={day.dayOfWeek}
                  onClick={() => setSelectedDay(day.dayOfWeek)}
                  className={`relative rounded-xl border p-4 text-left transition-all card-hover ${
                    isSelected
                      ? 'border-[#FF6B35] bg-orange-50 shadow-md'
                      : isBest
                      ? 'border-orange-200 bg-orange-50/50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  {isBest && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#FF6B35] flex items-center justify-center text-white text-[10px] font-bold">★</span>
                  )}
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${DAY_COLORS[idx]} flex items-center justify-center text-white text-sm font-bold mb-2`}>
                    {day.dayName.charAt(1)}
                  </div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">{day.dayName}</p>
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {day.bestTimes[0]?.time || '—'}
                  </p>
                  <div className="flex flex-wrap gap-0.5 mt-2">
                    {day.platforms.slice(0, 2).map((p, pi) => (
                      <span key={pi} className="text-[10px] px-1 py-0.5 rounded bg-gray-100 text-gray-500">
                        {p === 'taobao' ? '淘宝' : p === 'xianyu' ? '闲鱼' : p === 'pinduoduo' ? '拼多多' : p === 'xiaohongshu' ? '小红书' : '抖音'}
                      </span>
                    ))}
                    {day.platforms.length > 2 && (
                      <span className="text-[10px] px-1 py-0.5 rounded bg-gray-100 text-gray-400">
                        +{day.platforms.length - 2}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Day Detail */}
          {selectedDayInfo && (
            <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${DAY_COLORS[selectedDayInfo.dayOfWeek - 1]} flex items-center justify-center text-white font-bold`}>
                  {selectedDayInfo.dayName.charAt(1)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{selectedDayInfo.dayName}</h3>
                  <p className="text-xs text-gray-500">
                    推荐平台：{selectedDayInfo.platforms.map(p =>
                      p === 'taobao' ? '淘宝' : p === 'xianyu' ? '闲鱼' : p === 'pinduoduo' ? '拼多多' : p === 'xiaohongshu' ? '小红书' : '抖音'
                    ).join('、')}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-medium text-gray-500 mb-2">最佳发布时段</h4>
                  <div className="space-y-2">
                    {selectedDayInfo.bestTimes.map((time, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-orange-50 to-red-50 border border-orange-100">
                        <div className="w-10 h-10 rounded-lg bg-white border border-orange-200 flex items-center justify-center">
                          <svg className="w-5 h-5 text-[#FF6B35]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{time.time}</p>
                          <p className="text-xs text-gray-500">{time.reason}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedDayInfo.tips.length > 0 && (
                  <div>
                    <h4 className="text-xs font-medium text-gray-500 mb-2">发布小贴士</h4>
                    <ul className="space-y-1.5">
                      {selectedDayInfo.tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="text-green-500 mt-0.5">✓</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Demo Notice */}
          <div className="px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-700 flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            演示模式 — 数据为模拟展示，正式版将基于各平台真实流量数据
          </div>
        </div>
      )}

      {!result && !loading && !error && (
        <div className="rounded-2xl border border-gray-100 bg-white p-8 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center text-3xl mb-4">
            📅
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">查看最佳发布时间</h3>
          <p className="text-sm text-gray-500 max-w-sm">
            选择你的商品类目，获取各平台最佳发布时间和流量高峰期分析
          </p>
        </div>
      )}
    </div>
  );
}
