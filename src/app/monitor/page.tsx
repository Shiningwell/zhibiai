'use client';

import { useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import { getDemoMonitorData } from '@/lib/demo-data-new';
import { CompetitorItem, MonitorResult } from '@/types';

export default function MonitorPage() {
  const [inputType, setInputType] = useState<'link' | 'name'>('name');
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState<MonitorResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleMonitor = async () => {
    if (!inputValue.trim()) {
      setError('请输入竞品链接或商品名');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      await new Promise(r => setTimeout(r, 1000));
      const monitorResult = getDemoMonitorData();
      setResult(monitorResult);
    } catch {
      setError('监控数据获取失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: CompetitorItem['status']) => {
    switch (status) {
      case 'price_drop': return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-600 border border-green-200">📉 降价</span>;
      case 'price_up': return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-600 border border-red-200">📈 涨价</span>;
      case 'new': return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-600 border border-blue-200">🆕 新增</span>;
      default: return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-50 text-gray-500 border border-gray-200">— 正常</span>;
    }
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return '刚刚';
    if (hours < 24) return `${hours}小时前`;
    return `${Math.floor(hours / 24)}天前`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        badge="竞品监控"
        title="竞品监控"
        description="追踪竞品价格、文案变化，及时调整你的策略"
        actions={
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-200 text-xs font-medium">
              Pro功能
            </span>
          </div>
        }
      />

      {/* Input Area */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => setInputType('name')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              inputType === 'name'
                ? 'bg-[#FF6B35] text-white'
                : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
            }`}
          >
            按商品名
          </button>
          <button
            onClick={() => setInputType('link')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              inputType === 'link'
                ? 'bg-[#FF6B35] text-white'
                : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
            }`}
          >
            按链接
          </button>
        </div>

        <div className="flex gap-3">
          {inputType === 'name' ? (
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={'输入竞品商品名，如"蓝牙耳机 降噪"'}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#FF6B35] transition-all"
            />
          ) : (
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="粘贴竞品商品链接"
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#FF6B35] transition-all"
            />
          )}
          <button
            onClick={handleMonitor}
            disabled={loading || !inputValue.trim()}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#FF6B35] to-[#FF3D57] text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-orange-200 transition-all btn-press disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                监控中...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                开始监控
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

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="rounded-xl border border-gray-100 bg-white p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="skeleton h-5 w-48" />
                <div className="skeleton h-5 w-16" />
              </div>
              <div className="flex items-center gap-4">
                <div className="skeleton h-4 w-20" />
                <div className="skeleton h-4 w-24" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-xl bg-white border border-gray-200 p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{result.totalTracked}</p>
              <p className="text-xs text-gray-500 mt-1">监控竞品数</p>
            </div>
            <div className="rounded-xl bg-white border border-gray-200 p-4 text-center">
              <p className="text-2xl font-bold text-green-600">
                {result.competitors.filter(c => c.status === 'price_drop').length}
              </p>
              <p className="text-xs text-gray-500 mt-1">降价提醒</p>
            </div>
            <div className="rounded-xl bg-white border border-gray-200 p-4 text-center">
              <p className="text-2xl font-bold text-red-600">
                {result.competitors.filter(c => c.status === 'price_up').length}
              </p>
              <p className="text-xs text-gray-500 mt-1">涨价提醒</p>
            </div>
            <div className="rounded-xl bg-white border border-gray-200 p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">
                {result.competitors.filter(c => c.status === 'new').length}
              </p>
              <p className="text-xs text-gray-500 mt-1">新增竞品</p>
            </div>
          </div>

          {/* Competitor List */}
          <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
            <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">竞品追踪列表</h3>
              <span className="text-xs text-gray-400">最多可监控20个竞品</span>
            </div>
            <div className="divide-y divide-gray-50">
              {result.competitors.map((comp) => (
                <div key={comp.id} className="px-5 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-gray-900 truncate">{comp.name}</h4>
                      {getStatusBadge(comp.status)}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>平台：{comp.platform}</span>
                      <span>更新：{formatTime(comp.lastUpdated)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">{comp.currentPrice}</p>
                      {comp.priceChange && (
                        <p className={`text-xs font-medium ${comp.priceChange.startsWith('-') ? 'text-green-600' : 'text-red-600'}`}>
                          {comp.priceChange}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Demo Notice */}
          <div className="px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-700 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              演示模式 — 数据为模拟展示
            </span>
            <Link href="/pricing" className="text-[#FF6B35] font-medium hover:underline">
              升级Pro ¥19.9/月 →
            </Link>
          </div>
        </div>
      )}

      {!result && !loading && !error && (
        <div className="rounded-2xl border border-gray-100 bg-white p-8 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center text-3xl mb-4">
            👁️
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">开始监控竞品</h3>
          <p className="text-sm text-gray-500 max-w-sm">
            输入竞品商品名或链接，追踪价格变动和文案变化，及时调整你的定价和营销策略
          </p>
          <p className="text-xs text-gray-400 mt-4">
            Pro功能 · ¥19.9/月 · 最多监控20个竞品
          </p>
        </div>
      )}
    </div>
  );
}
