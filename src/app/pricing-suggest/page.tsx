'use client';

import { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import { getDemoPricingSuggestion } from '@/lib/demo-data-new';
import { PricingSuggestion } from '@/types';

const CATEGORIES = ['蓝牙耳机', '手机', '连衣裙', '笔记本', '手表', '手机壳', '护肤品', '运动鞋'];

export default function PricingSuggestPage() {
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [cost, setCost] = useState('');
  const [result, setResult] = useState<PricingSuggestion | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!productName.trim()) {
      setError('请输入商品名称');
      return;
    }
    if (!category) {
      setError('请选择商品类目');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      await new Promise(r => setTimeout(r, 900));
      const pricingResult = getDemoPricingSuggestion(productName, category);
      setResult(pricingResult);
    } catch {
      setError('定价分析失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        badge="定价建议"
        title="定价建议"
        description="基于竞品数据分析，给出最优价格区间和推荐定价"
        actions={
          <span className="px-2 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-200 text-xs font-medium">
            Pro功能
          </span>
        }
      />

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Input */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                商品名称 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="如：Apple AirPods Pro 2"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#FF6B35] transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                商品类目 <span className="text-red-400">*</span>
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      category === cat
                        ? 'bg-[#FF6B35] text-white'
                        : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                你的成本价（可选）
              </label>
              <input
                type="text"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                placeholder="如：199"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#FF6B35] transition-all"
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={loading || !productName.trim() || !category}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-[#FF6B35] to-[#FF3D57] text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-orange-200 transition-all btn-press disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  分析中...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  获取定价建议
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-3">
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
              {error}
            </div>
          )}

          {loading && (
            <div className="space-y-4">
              <div className="rounded-xl border border-gray-100 bg-white p-6">
                <div className="skeleton h-8 w-32 mb-4" />
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {[1,2,3].map(i => <div key={i} className="skeleton h-16 w-full" />)}
                </div>
                <div className="skeleton h-4 w-full" />
                <div className="skeleton h-4 w-3/4 mt-2" />
              </div>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-4">
              {/* Price Range Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">最低价</p>
                  <p className="text-xl font-bold text-gray-600">¥{result.lowestPrice}</p>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-orange-50 to-red-50 border-2 border-[#FF6B35] p-4 text-center relative">
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-[#FF6B35] text-white text-[10px] font-bold rounded-full">推荐</span>
                  <p className="text-xs text-[#FF6B35] mb-1">建议定价</p>
                  <p className="text-2xl font-bold text-[#FF6B35]">¥{result.suggestedPrice}</p>
                </div>
                <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">最高价</p>
                  <p className="text-xl font-bold text-gray-600">¥{result.highestPrice}</p>
                </div>
              </div>

              {/* Median & Reason */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-900">定价分析</h3>
                  <span className="text-xs text-gray-400">中间价：¥{result.medianPrice}</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mb-4">
                  {result.suggestedPriceReason}
                </p>
                {cost && (
                  <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                    <p className="text-sm text-green-700">
                      💰 按成本价 ¥{cost} 计算，建议定价 ¥{result.suggestedPrice}，利润率约 {Math.round(((result.suggestedPrice - parseInt(cost)) / parseInt(cost)) * 100)}%
                    </p>
                  </div>
                )}
              </div>

              {/* Price Distribution */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">竞品价格分布</h3>
                <div className="space-y-2">
                  {result.priceDistribution.map((item, idx) => {
                    const maxCount = Math.max(...result.priceDistribution.map(d => d.count));
                    const widthPct = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
                    return (
                      <div key={idx} className="flex items-center gap-3">
                        <span className="text-xs text-gray-500 w-24 flex-shrink-0 text-right">{item.range}</span>
                        <div className="flex-1 h-6 rounded bg-gray-100 overflow-hidden relative">
                          <div
                            className={`h-full rounded transition-all duration-500 ${idx === 2 ? 'bg-gradient-to-r from-[#FF6B35] to-[#FF3D57]' : 'bg-gray-300'}`}
                            style={{ width: `${widthPct}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 w-8">{item.count}款</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Demo Notice */}
              <div className="px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-700 flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                演示模式 — 数据为模拟展示，正式版将接入真实竞品数据
              </div>
            </div>
          )}

          {!result && !loading && !error && (
            <div className="rounded-2xl border border-gray-100 bg-white p-8 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center text-3xl mb-4">
                💰
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">获取最优定价</h3>
              <p className="text-sm text-gray-500 max-w-sm">
                输入商品信息和类目，基于竞品数据分析给出最优价格区间和推荐定价
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
