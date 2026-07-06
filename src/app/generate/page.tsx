'use client';

import { useState, useEffect } from 'react';
import PageHeader from '@/components/PageHeader';
import CopyButton from '@/components/CopyButton';
import EmptyState from '@/components/EmptyState';
import { generateCopies } from '@/lib/api';
import { getTemplates, getTemplateById, canGenerate, getUsageData, incrementUsage } from '@/lib/storage';
import { PLATFORMS } from '@/lib/constants';
import { PlatformCopy, Template, GenerateInput } from '@/types';

export default function GeneratePage() {
  const [productName, setProductName] = useState('');
  const [coreSellingPoints, setCoreSellingPoints] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('全新');
  const [templateId, setTemplateId] = useState('');
  const [results, setResults] = useState<PlatformCopy[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDemo, setIsDemo] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [usageInfo, setUsageInfo] = useState({ used: 0, max: 3, canGen: true });

  useEffect(() => {
    setTemplates(getTemplates());
    updateUsage();
  }, []);

  const updateUsage = () => {
    const usage = getUsageData();
    const can = canGenerate(false);
    setUsageInfo({ used: usage.generations, max: 3, canGen: can });
  };

  const handleGenerate = async () => {
    if (!productName.trim()) return;

    if (!usageInfo.canGen) {
      setError('今日免费次数已用完，升级 Pro 可无限生成');
      return;
    }

    setLoading(true);
    setError('');
    setResults([]);

    const input: GenerateInput = {
      productName: productName.trim(),
      coreSellingPoints: coreSellingPoints.trim(),
      price: price.trim(),
      condition,
      templateId: templateId || undefined,
    };

    try {
      const res = await generateCopies(input);
      if (res.success && res.data) {
        setResults(res.data);
        setIsDemo(res.demo ?? false);
        incrementUsage();
        updateUsage();
      } else {
        setError(res.error ?? '生成失败');
      }
    } catch {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const selectedTemplate = templateId ? getTemplateById(templateId) : null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        badge="AI 文案生成"
        title="文案生成"
        description="输入商品信息，一键生成5个平台适配文案"
        actions={
          <div className="text-xs text-gray-400">
            今日已用 <span className="font-semibold text-gray-600">{usageInfo.used}</span>/{usageInfo.max} 次
          </div>
        }
      />

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Input Panel */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                商品名称 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="如：iPhone 15 Pro Max 256G"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#FF6B35] transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">核心卖点</label>
              <textarea
                value={coreSellingPoints}
                onChange={(e) => setCoreSellingPoints(e.target.value)}
                placeholder="如：A17 Pro芯片、钛金属边框、4800万像素主摄"
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#FF6B35] resize-none transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">价格</label>
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="¥9999"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#FF6B35] transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">成色</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#FF6B35] transition-all"
                >
                  <option>全新</option>
                  <option>几乎全新</option>
                  <option>轻微使用痕迹</option>
                  <option>明显使用痕迹</option>
                </select>
              </div>
            </div>

            {/* Template Selection */}
            {templates.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">使用爆款模板（可选）</label>
                <select
                  value={templateId}
                  onChange={(e) => setTemplateId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#FF6B35] transition-all"
                >
                  <option value="">不使用模板</option>
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.formula.substring(0, 30)}...
                    </option>
                  ))}
                </select>
                {selectedTemplate && (
                  <div className="mt-2 p-3 rounded-lg bg-orange-50 border border-orange-100">
                    <p className="text-xs text-[#FF6B35] font-medium mb-1">模板公式</p>
                    <p className="text-xs text-gray-700">{selectedTemplate.formula}</p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {selectedTemplate.keywords.map((kw, i) => (
                        <span key={i} className="text-[10px] px-1.5 py-0.5 bg-white rounded text-gray-600 border border-orange-100">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={loading || !productName.trim() || !usageInfo.canGen}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-[#FF6B35] to-[#FF3D57] text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-orange-200 transition-all btn-press disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  AI 生成中...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  一键生成5平台文案
                </>
              )}
            </button>

            {!usageInfo.canGen && (
              <p className="text-xs text-center text-red-500">
                今日免费次数已用完，
                <a href="/pricing" className="underline">升级 Pro</a>
                可无限生成
              </p>
            )}
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-3">
          {isDemo && results.length > 0 && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-700 flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              演示模式 — 配置 API Key 后可获得真实 AI 生成文案
            </div>
          )}

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
              {error}
            </div>
          )}

          {loading && (
            <div className="space-y-3">
              {PLATFORMS.map((p) => (
                <div key={p.id} className="rounded-xl border border-gray-100 bg-white p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">{p.icon}</span>
                    <span className="text-sm font-semibold text-gray-900">{p.name}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="skeleton h-3 w-full" />
                    <div className="skeleton h-3 w-4/5" />
                    <div className="skeleton h-3 w-3/5" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {results.length > 0 && !loading && (
            <div className="space-y-3">
              {results.map((copy, idx) => {
                const platform = PLATFORMS.find((p) => p.id === copy.platform);
                if (!platform) return null;
                return (
                  <div
                    key={copy.platform}
                    className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 animate-fade-in"
                    style={{ animationDelay: `${idx * 0.08}s` }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{platform.icon}</span>
                        <span className="text-sm font-semibold text-gray-900">{platform.name}</span>
                        <span className="text-xs text-gray-400">· {platform.description}</span>
                      </div>
                      <CopyButton text={copy.content} />
                    </div>
                    <div className="rounded-lg bg-gray-50 p-3.5 border border-gray-100">
                      <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{copy.content}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {results.length === 0 && !loading && !error && (
            <EmptyState
              icon="✍️"
              title="输入商品信息，开始生成"
              description="填写左侧的商品名称和卖点，点击按钮即可一键生成5个平台的适配文案"
            />
          )}
        </div>
      </div>
    </div>
  );
}
