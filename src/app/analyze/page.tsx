'use client';

import { useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import LoadingSpinner from '@/components/Loading';
import { analyzeTitles } from '@/lib/api';
import { generateId } from '@/lib/constants';
import { saveTemplate } from '@/lib/storage';
import { AnalysisResult, Template } from '@/types';

export default function AnalyzePage() {
  const [titles, setTitles] = useState('');
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState('');
  const [isDemo, setIsDemo] = useState(false);

  const handleAnalyze = async () => {
    const titleList = titles
      .split('\n')
      .map((t) => t.trim())
      .filter(Boolean);

    if (titleList.length === 0) return;

    setLoading(true);
    setError('');
    setResults([]);

    try {
      const res = await analyzeTitles(titleList);
      if (res.success && res.data) {
        setResults(res.data);
        setIsDemo(res.demo ?? false);
      } else {
        setError(res.error ?? '分析失败');
      }
    } catch {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTemplate = (result: AnalysisResult) => {
    const template: Template = {
      id: generateId(),
      name: result.formula.substring(0, 20) + '...',
      formula: result.formula,
      keywords: result.keywords,
      source: result.title,
      createdAt: Date.now(),
    };
    saveTemplate(template);
    setSavedIds((prev) => new Set(prev).add(result.title));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        badge="AI 爆款拆解"
        title="爆款拆解"
        description="输入竞品商品标题，AI 自动提取爆款公式、关键词标签，找到高转化规律"
      />

      {/* Input Area */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          竞品商品标题
          <span className="text-gray-400 font-normal ml-1">（每行一个，可输入多个）</span>
        </label>
        <textarea
          value={titles}
          onChange={(e) => setTitles(e.target.value)}
          placeholder={"示例：\n2024新款轻薄羽绒服女中长款韩版修身白鸭绒冬季保暖外套\n苹果iPhone15 Pro Max 256G 远峰蓝 国行全网通5G"}
          className="w-full h-36 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#FF6B35] resize-none transition-all"
        />
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-gray-400">
            {titles.split('\n').filter((t) => t.trim()).length} 个标题待分析
          </span>
          <button
            onClick={handleAnalyze}
            disabled={loading || !titles.trim()}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#FF6B35] to-[#FF3D57] text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-orange-200 transition-all btn-press disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
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
                开始拆解
              </>
            )}
          </button>
        </div>
      </div>

      {/* Demo Mode Banner */}
      {isDemo && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-700 flex items-center gap-2">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          演示模式 — 结果由模拟数据生成，配置 API Key 后可获得真实 AI 分析
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && <LoadingSpinner text="AI 正在拆解爆款公式..." />}

      {/* Results */}
      {results.length > 0 && !loading && (
        <div className="space-y-5">
          {results.map((result, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 animate-fade-in"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              {/* Original Title */}
              <div className="flex items-start gap-3 mb-5">
                <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center text-xs font-bold text-[#FF6B35] flex-shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">原始标题</p>
                  <p className="text-sm font-medium text-gray-900">{result.title}</p>
                </div>
              </div>

              {/* Formula */}
              <div className="mb-4 p-4 rounded-xl bg-gradient-to-r from-orange-50 to-red-50 border border-orange-100">
                <p className="text-xs font-medium text-[#FF6B35] mb-1.5">标题公式</p>
                <p className="text-sm font-semibold text-gray-900">{result.formula}</p>
              </div>

              {/* Structure Analysis */}
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-500 mb-1.5">结构分析</p>
                <p className="text-sm text-gray-700 leading-relaxed">{result.structure}</p>
              </div>

              {/* Keywords */}
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-500 mb-2">关键词标签</p>
                <div className="flex flex-wrap gap-1.5">
                  {result.keywords.map((kw, ki) => (
                    <span
                      key={ki}
                      className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-50 text-xs font-medium text-gray-700 border border-gray-100"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div className="mb-5">
                <p className="text-xs font-medium text-gray-500 mb-2">优化建议</p>
                <ul className="space-y-1.5">
                  {result.tips.map((tip, ti) => (
                    <li key={ti} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-green-500 mt-0.5">✓</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleSaveTemplate(result)}
                  disabled={savedIds.has(result.title)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-lg transition-all btn-press ${
                    savedIds.has(result.title)
                      ? 'bg-green-50 text-green-600 border border-green-200'
                      : 'bg-orange-50 text-[#FF6B35] border border-orange-200 hover:bg-orange-100'
                  }`}
                >
                  {savedIds.has(result.title) ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      已保存
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                      保存为模板
                    </>
                  )}
                </button>
                <Link
                  href="/generate"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-all"
                >
                  用此公式生成文案
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {results.length === 0 && !loading && !error && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-50 flex items-center justify-center text-3xl mb-4">
            🔍
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">输入竞品标题，开始拆解</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            粘贴1个或多个爆款商品标题，AI 将自动分析标题结构、提取关键词和爆款公式
          </p>
        </div>
      )}
    </div>
  );
}
