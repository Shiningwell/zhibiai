'use client';

import { useState, useCallback } from 'react';
import PageHeader from '@/components/PageHeader';
import CopyButton from '@/components/CopyButton';
import { getDemoABTestVariants } from '@/lib/demo-data-new';
import { ABTestVariant, ABTestResult } from '@/types';

export default function ABTestPage() {
  const [productName, setProductName] = useState('');
  const [variants, setVariants] = useState<ABTestVariant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [analysisResult, setAnalysisResult] = useState<ABTestResult | null>(null);
  const [editingVariant, setEditingVariant] = useState<string | null>(null);
  const [editImpressions, setEditImpressions] = useState('');
  const [editConversions, setEditConversions] = useState('');

  const handleGenerate = async () => {
    if (!productName.trim()) {
      setError('请输入商品名称');
      return;
    }

    setLoading(true);
    setError('');
    setVariants([]);
    setAnalysisResult(null);

    try {
      await new Promise(r => setTimeout(r, 1000));
      const demoVariants = getDemoABTestVariants(productName);
      const abVariants: ABTestVariant[] = demoVariants.map((v, i) => ({
        id: `v${i + 1}`,
        label: `版本 ${String.fromCharCode(65 + i)}`,
        content: v.content.replace(/【版本[ABC]】/, ''),
        impressions: 0,
        conversions: 0,
        conversionRate: 0,
      }));
      setVariants(abVariants);
    } catch {
      setError('生成失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleRecordData = (variantId: string) => {
    const variant = variants.find(v => v.id === variantId);
    if (!variant) return;
    setEditingVariant(variantId);
    setEditImpressions(variant.impressions.toString());
    setEditConversions(variant.conversions.toString());
  };

  const saveRecordData = () => {
    if (!editingVariant) return;
    const imp = parseInt(editImpressions) || 0;
    const conv = parseInt(editConversions) || 0;
    setVariants(prev => prev.map(v =>
      v.id === editingVariant
        ? { ...v, impressions: imp, conversions: conv, conversionRate: imp > 0 ? (conv / imp) * 100 : 0 }
        : v
    ));
    setEditingVariant(null);
    setEditImpressions('');
    setEditConversions('');
  };

  const handleAnalyze = useCallback(() => {
    const hasData = variants.some(v => v.impressions > 0);
    if (!hasData) {
      setError('请先记录至少一个版本的数据');
      return;
    }

    // Simple analysis
    const sortedVariants = [...variants]
      .filter(v => v.impressions > 0)
      .sort((a, b) => b.conversionRate - a.conversionRate);

    const winner = sortedVariants[0];
    const confidence = winner.impressions >= 100 ? 95 : winner.impressions >= 30 ? 75 : 50;

    setAnalysisResult({
      variants: sortedVariants,
      winner: winner.id,
      confidence,
      analysis: confidence >= 95
        ? `版本${winner.label}在${winner.impressions}次曝光中获得了${winner.conversionRate.toFixed(1)}%的转化率，显著优于其他版本，建议采用此版本。`
        : confidence >= 75
        ? `版本${winner.label}目前表现最佳（转化率${winner.conversionRate.toFixed(1)}%），但样本量还不够大，建议继续测试以获得更可靠的结果。`
        : `当前数据量较少，尚无法得出可靠结论。建议每个版本至少收集100次曝光数据后再做判断。`,
    });
  }, [variants]);

  const getWinnerColor = (variantId: string) => {
    if (!analysisResult || !analysisResult.winner) return '';
    return variantId === analysisResult.winner ? 'border-green-300 bg-green-50' : '';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        badge="A/B 测试"
        title="A/B 测试"
        description="为同一商品生成多个文案版本，记录数据，分析哪个版本效果最好"
        actions={
          <span className="px-2 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-200 text-xs font-medium">
            Pro功能
          </span>
        }
      />

      {/* Input */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 mb-6">
        <div className="flex gap-3">
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="输入商品名称，如：蓝牙耳机 Pro Max"
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#FF6B35] transition-all"
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !productName.trim()}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#FF6B35] to-[#FF3D57] text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-orange-200 transition-all btn-press disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                生成中...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                生成3个版本
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Variants */}
      {variants.length > 0 && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            {variants.map((variant) => (
              <div
                key={variant.id}
                className={`rounded-2xl border-2 bg-white p-5 transition-all ${getWinnerColor(variant.id)} ${
                  analysisResult?.winner === variant.id ? 'ring-2 ring-green-300' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold ${
                      variant.id === 'v1' ? 'bg-blue-500' : variant.id === 'v2' ? 'bg-purple-500' : 'bg-green-500'
                    }`}>
                      {variant.label}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">{variant.label}</span>
                  </div>
                  {analysisResult?.winner === variant.id && (
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                      🏆 最优
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="rounded-lg bg-gray-50 p-3 border border-gray-100 mb-4">
                  <p className="text-xs text-gray-700 line-clamp-4">{variant.content}</p>
                </div>

                <CopyButton text={variant.content} className="mb-4" />

                {/* Data Recording */}
                <div className="border-t border-gray-100 pt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-500">测试数据</span>
                    <button
                      onClick={() => handleRecordData(variant.id)}
                      className="text-xs text-[#FF6B35] font-medium hover:underline"
                    >
                      记录数据
                    </button>
                  </div>

                  {editingVariant === variant.id ? (
                    <div className="space-y-2 mb-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={editImpressions}
                          onChange={(e) => setEditImpressions(e.target.value)}
                          placeholder="曝光数"
                          className="flex-1 px-2 py-1.5 rounded-lg border border-gray-200 bg-white text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-orange-200"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={editConversions}
                          onChange={(e) => setEditConversions(e.target.value)}
                          placeholder="转化数"
                          className="flex-1 px-2 py-1.5 rounded-lg border border-gray-200 bg-white text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-orange-200"
                        />
                      </div>
                      <button
                        onClick={saveRecordData}
                        className="w-full px-3 py-1.5 bg-[#FF6B35] text-white text-xs font-medium rounded-lg"
                      >
                        保存
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-1.5 rounded bg-gray-50">
                        <p className="text-xs text-gray-400">曝光</p>
                        <p className="text-sm font-bold text-gray-900">{variant.impressions}</p>
                      </div>
                      <div className="p-1.5 rounded bg-gray-50">
                        <p className="text-xs text-gray-400">转化</p>
                        <p className="text-sm font-bold text-gray-900">{variant.conversions}</p>
                      </div>
                      <div className="p-1.5 rounded bg-gray-50">
                        <p className="text-xs text-gray-400">转化率</p>
                        <p className={`text-sm font-bold ${variant.conversionRate > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                          {variant.conversionRate > 0 ? `${variant.conversionRate.toFixed(1)}%` : '—'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Analyze Button */}
          <div className="text-center">
            <button
              onClick={handleAnalyze}
              disabled={variants.every(v => v.impressions === 0)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FF6B35] to-[#FF3D57] text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-orange-200 transition-all btn-press disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              分析测试结果
            </button>
          </div>

          {/* Analysis Result */}
          {analysisResult && (
            <div className="rounded-2xl border-2 border-green-200 bg-green-50 p-5 sm:p-6 animate-fade-in">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🏆</span>
                <h3 className="text-lg font-bold text-gray-900">测试结果</h3>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                {analysisResult.analysis}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>置信度：{analysisResult.confidence}%</span>
                <span>·</span>
                <span>基于 {analysisResult.variants.reduce((s, v) => s + v.impressions, 0)} 次曝光数据</span>
              </div>
            </div>
          )}

          {/* Demo Notice */}
          <div className="px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-700 flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            演示模式 — 文案由模拟生成，记录数据后可分析对比效果
          </div>
        </div>
      )}

      {variants.length === 0 && !loading && !error && (
        <div className="rounded-2xl border border-gray-100 bg-white p-8 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center text-3xl mb-4">
            🧪
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">A/B 测试你的文案</h3>
          <p className="text-sm text-gray-500 max-w-sm">
            输入商品名称，生成3个不同版本的文案，记录曝光和转化数据，系统分析哪个版本效果最好
          </p>
        </div>
      )}
    </div>
  );
}
