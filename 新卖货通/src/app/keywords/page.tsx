'use client';

import { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import { getDemoKeywordAnalysis } from '@/lib/demo-data-new';
import { KeywordAnalysisResult, KeywordData } from '@/types';

const CATEGORIES = ['蓝牙耳机', '连衣裙', '手机壳', '护肤品', '运动鞋', '数码配件', '家居用品', '食品饮料'];

export default function KeywordsPage() {
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [result, setResult] = useState<KeywordAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    const targetCategory = customCategory.trim() || category;
    if (!targetCategory) {
      setError('请选择或输入商品类目');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      await new Promise(r => setTimeout(r, 800));
      const analysisResult = getDemoKeywordAnalysis(targetCategory);
      setResult(analysisResult);
    } catch {
      setError('分析失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const getCompetitionBadge = (competition: KeywordData['competition']) => {
    switch (competition) {
      case 'high': return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-600 border border-red-200">高竞争</span>;
      case 'medium': return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-600 border border-amber-200">中竞争</span>;
      case 'low': return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-600 border border-green-200">低竞争</span>;
    }
  };

  const getTrendIcon = (trend: KeywordData['trend']) => {
    switch (trend) {
      case 'up': return <span className="text-green-500 font-bold">↑</span>;
      case 'down': return <span className="text-red-500 font-bold">↓</span>;
      case 'stable': return <span className="text-gray-400 font-bold">→</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        badge="关键词分析"
        title="关键词分析"
        description="输入商品类目，获取热门关键词、搜索热度、竞争度分析"
        actions={
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2 py-1 rounded-full bg-green-50 text-green-600 border border-green-200 font-medium">
              演示阶段免费
            </span>
          </div>
        }
      />

      {/* Input Area */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">选择商品类目</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => { setCategory(cat); setCustomCategory(''); }}
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

        <div className="flex gap-3">
          <input
            type="text"
            value={customCategory}
            onChange={(e) => { setCustomCategory(e.target.value); setCategory(''); }}
            placeholder={'或自定义输入类目，如"蓝牙耳机"'}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#FF6B35] transition-all"
          />
          <button
            onClick={handleAnalyze}
            disabled={loading || (!category && !customCategory.trim())}
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                开始分析
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Results */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="rounded-xl border border-gray-100 bg-white p-5">
              <div className="flex items-center gap-4 mb-3">
                <div className="skeleton h-5 w-32" />
                <div className="skeleton h-5 w-16" />
                <div className="skeleton h-5 w-16" />
              </div>
              <div className="space-y-2">
                <div className="skeleton h-3 w-full" />
                <div className="skeleton h-3 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {result && !loading && (
        <div className="space-y-6">
          {/* Hot Keywords */}
          {result.hotKeywords.length > 0 && (
            <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">🔥 热门上升关键词</h3>
              <div className="flex flex-wrap gap-2">
                {result.hotKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-orange-50 to-red-50 text-sm font-medium text-[#FF6B35] border border-orange-100"
                  >
                    {kw}
                    <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Keyword Table */}
          <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
            <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900">
                关键词详细数据 · {result.category}
              </h3>
            </div>

            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">关键词</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">搜索热度</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">竞争度</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">趋势</th>
                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">相关词</th>
                  </tr>
                </thead>
                <tbody>
                  {result.keywords.map((kw, idx) => (
                    <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3 font-medium text-gray-900">{kw.keyword}</td>
                      <td className="px-5 py-3 text-gray-600">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-[#FF6B35]"
                              style={{ width: `${Math.min(100, (kw.searchVolume / 100000) * 100)}%` }}
                            />
                          </div>
                          <span className="text-xs">{kw.searchVolume.toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3">{getCompetitionBadge(kw.competition)}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1">
                          {getTrendIcon(kw.trend)}
                          <span className="text-xs text-gray-500">
                            {kw.trend === 'up' ? '上升' : kw.trend === 'down' ? '下降' : '平稳'}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex flex-wrap gap-1">
                          {kw.relatedKeywords.slice(0, 3).map((rk, ri) => (
                            <span key={ri} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-50 text-gray-500 border border-gray-100">
                              {rk}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="sm:hidden divide-y divide-gray-50">
              {result.keywords.map((kw, idx) => (
                <div key={idx} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-900">{kw.keyword}</span>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(kw.trend)}
                      {getCompetitionBadge(kw.competition)}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mb-2">
                    搜索热度：{kw.searchVolume.toLocaleString()}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {kw.relatedKeywords.map((rk, ri) => (
                      <span key={ri} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-50 text-gray-500 border border-gray-100">
                        {rk}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">💡 关键词使用建议</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-green-500 mt-0.5">✓</span>
                优先选择<span className="font-medium text-gray-800">搜索热度高、竞争度低</span>的蓝海关键词
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-green-500 mt-0.5">✓</span>
                标题中包含2-3个核心关键词，避免堆砌
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-green-500 mt-0.5">✓</span>
                关注趋势上升的关键词，抓住流量红利期
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-green-500 mt-0.5">✓</span>
                相关词可用于详情页优化和广告投放
              </li>
            </ul>
          </div>

          {/* Demo Notice */}
          <div className="px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-700 flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            演示模式 — 数据为模拟展示，正式版将接入真实搜索数据
          </div>
        </div>
      )}

      {!result && !loading && !error && (
        <div className="rounded-2xl border border-gray-100 bg-white p-8 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center text-3xl mb-4">
            🔑
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">选择类目开始分析</h3>
          <p className="text-sm text-gray-500 max-w-sm">
            输入你的商品类目，获取热门关键词、搜索热度和竞争度分析，优化你的标题和描述
          </p>
        </div>
      )}
    </div>
  );
}
