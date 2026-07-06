'use client';

import { useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import { checkForbiddenWords } from '@/lib/demo-data-new';
import { ForbiddenCheckResult, ForbiddenWord } from '@/types';

const SAMPLE_TEXT = '这是最好的蓝牙耳机，100%降噪效果，全网最低价！治愈你的耳朵，绝对零风险，无效退款！第一品牌，顶级品质，秒杀全网！';

export default function ForbiddenCheckPage() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<ForbiddenCheckResult | null>(null);
  const [checking, setChecking] = useState(false);
  const [dailyUsed, setDailyUsed] = useState(0);
  const maxDaily = 5;

  const handleCheck = async () => {
    if (!text.trim()) return;

    if (dailyUsed >= maxDaily) {
      return;
    }

    setChecking(true);
    // Simulate API delay
    await new Promise(r => setTimeout(r, 600));
    const checkResult = checkForbiddenWords(text);
    setResult(checkResult);
    setDailyUsed(prev => prev + 1);
    setChecking(false);
  };

  const handleSample = () => {
    setText(SAMPLE_TEXT);
    setResult(null);
  };

  const getSeverityBadge = (severity: ForbiddenWord['severity']) => {
    switch (severity) {
      case 'high': return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-600 border border-red-200">高风险</span>;
      case 'medium': return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-600 border border-amber-200">中风险</span>;
      case 'low': return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-600 border border-green-200">低风险</span>;
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-600';
    if (score >= 40) return 'text-amber-600';
    return 'text-green-600';
  };

  const getRiskBg = (score: number) => {
    if (score >= 70) return 'bg-red-50 border-red-200';
    if (score >= 40) return 'bg-amber-50 border-amber-200';
    return 'bg-green-50 border-green-200';
  };

  const getRiskLabel = (score: number) => {
    if (score >= 70) return '高风险';
    if (score >= 40) return '中等风险';
    return '低风险';
  };

  // Group found words by category
  const groupedWords = result?.foundWords.reduce<Record<string, ForbiddenWord[]>>((acc, w) => {
    if (!acc[w.categoryName]) acc[w.categoryName] = [];
    acc[w.categoryName].push(w);
    return acc;
  }, {}) || {};

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        badge="合规检测"
        title="违禁词检测"
        description="粘贴电商文案，一键检测广告法禁用词和平台违禁词，避免违规风险"
        actions={
          <div className="text-xs text-gray-400">
            今日已用 <span className="font-semibold text-gray-600">{dailyUsed}</span>/{maxDaily} 次
          </div>
        }
      />

      {dailyUsed >= maxDaily && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-700 flex items-center justify-between">
          <span>免费版每天仅可检测{maxDaily}次</span>
          <Link href="/pricing" className="text-[#FF6B35] font-medium hover:underline">升级Pro无限检测 →</Link>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                粘贴你的电商文案
              </label>
              <button
                onClick={handleSample}
                className="text-xs text-[#FF6B35] hover:underline font-medium"
              >
                试试示例文案
              </button>
            </div>
            <textarea
              value={text}
              onChange={(e) => { setText(e.target.value); setResult(null); }}
              placeholder="在此粘贴你的电商文案，检测是否包含违禁词..."
              className="w-full h-48 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#FF6B35] resize-none transition-all"
            />
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-gray-400">
                {text.length} 字
              </span>
              <button
                onClick={handleCheck}
                disabled={checking || !text.trim() || dailyUsed >= maxDaily}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#FF6B35] to-[#FF3D57] text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-orange-200 transition-all btn-press disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
              >
                {checking ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    检测中...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944m-7.618 8.04A11.955 11.955 0 0112 21.056m7.618-8.04A11.955 11.955 0 0112 21.056m0 0a11.955 11.955 0 01-7.618-8.04m7.618 8.04A11.955 11.955 0 0012 2.944" />
                    </svg>
                    开始检测
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Word Library Preview */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">违禁词库概览</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">绝对化用语</span>
                <span className="text-xs text-gray-400">最好、第一、100%...</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">医疗用语</span>
                <span className="text-xs text-gray-400">治愈、疗效、处方...</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">虚假承诺</span>
                <span className="text-xs text-gray-400">包治、零风险、无效退款...</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">平台违禁词</span>
                <span className="text-xs text-gray-400">好评返现、刷单、加V...</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {checking && (
            <div className="rounded-2xl border border-gray-100 bg-white p-8 flex flex-col items-center justify-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full border-2 border-orange-100" />
                <div className="w-10 h-10 rounded-full border-2 border-transparent border-t-[#FF6B35] animate-spin absolute inset-0" />
              </div>
              <p className="text-sm text-gray-400">正在检测违禁词...</p>
            </div>
          )}

          {result && !checking && (
            <>
              {/* Risk Score */}
              <div className={`rounded-2xl border p-5 sm:p-6 ${getRiskBg(result.riskScore)}`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900">风险评估</h3>
                  <span className={`text-2xl font-bold ${getRiskColor(result.riskScore)}`}>
                    {result.riskScore}分
                  </span>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-1 h-2 rounded-full bg-white/50 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        result.riskScore >= 70 ? 'bg-red-500' :
                        result.riskScore >= 40 ? 'bg-amber-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${result.riskScore}%` }}
                    />
                  </div>
                  <span className={`text-sm font-medium ${getRiskColor(result.riskScore)}`}>
                    {getRiskLabel(result.riskScore)}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  共检测 {result.totalChecked} 个违禁词，发现 {result.foundWords.length} 个命中
                </p>
              </div>

              {/* Highlighted Text */}
              {result.foundWords.length > 0 && (
                <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">高亮标注</h3>
                  <div className="rounded-lg bg-gray-50 p-4 border border-gray-100">
                    <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                      {result.highlightedText.split('【').map((part, i) => {
                        if (i === 0) return <span key={i}>{part}</span>;
                        const closeIdx = part.indexOf('】');
                        if (closeIdx === -1) return <span key={i}>{part}</span>;
                        const word = part.substring(0, closeIdx);
                        const rest = part.substring(closeIdx + 1);
                        const fw = result.foundWords.find(w => w.word === word);
                        const bgColor = fw?.severity === 'high' ? 'bg-red-100 text-red-700' :
                                        fw?.severity === 'medium' ? 'bg-amber-100 text-amber-700' :
                                        'bg-green-100 text-green-700';
                        return <span key={i}><span className={`px-1 rounded ${bgColor} font-medium`}>{word}</span>{rest}</span>;
                      })}
                    </p>
                  </div>
                </div>
              )}

              {/* Found Words Detail */}
              {result.foundWords.length > 0 ? (
                <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">违禁词详情</h3>
                  <div className="space-y-4">
                    {Object.entries(groupedWords).map(([category, words]) => (
                      <div key={category}>
                        <h4 className="text-xs font-medium text-gray-500 mb-2">{category}</h4>
                        <div className="space-y-2">
                          {words.map((fw, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-sm font-semibold text-gray-900">&ldquo;{fw.word}&rdquo;</span>
                                  {getSeverityBadge(fw.severity)}
                                  {fw.platforms && (
                                    <span className="text-xs text-gray-400">
                                      ({fw.platforms.join('、')}限制)
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500">
                                  💡 {fw.suggestion}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
                  <div className="text-3xl mb-2">✅</div>
                  <h3 className="text-lg font-semibold text-green-700 mb-1">恭喜，未检测到违禁词！</h3>
                  <p className="text-sm text-green-600">你的文案符合广告法和平台规范</p>
                </div>
              )}
            </>
          )}

          {!result && !checking && (
            <div className="rounded-2xl border border-gray-100 bg-white p-8 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center text-3xl mb-4">
                🛡️
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">粘贴文案开始检测</h3>
              <p className="text-sm text-gray-500 max-w-sm">
                检测广告法禁用词、各平台违禁词，高亮显示并给出替换建议，避免违规风险
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
