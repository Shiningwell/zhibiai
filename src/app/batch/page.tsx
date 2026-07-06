'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import CopyButton from '@/components/CopyButton';
import { getDemoGenerateResult } from '@/lib/demo-data';
import { PLATFORMS } from '@/lib/constants';
import { BatchItem, BatchResult } from '@/types';

const DAILY_LIMIT_FREE = 3;
const MAX_ITEMS_FREE = 5;
const MAX_ITEMS_PRO = 50;

export default function BatchPage() {
  const [items, setItems] = useState<BatchItem[]>([
    { productName: '', sellingPoints: '', price: '', condition: '全新' },
  ]);
  const [results, setResults] = useState<BatchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dailyUsed, setDailyUsed] = useState(0);
  const [csvInput, setCsvInput] = useState('');

  const addItem = () => {
    if (items.length >= MAX_ITEMS_FREE) return;
    setItems([...items, { productName: '', sellingPoints: '', price: '', condition: '全新' }]);
  };

  const removeItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof BatchItem, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleCsvImport = () => {
    if (!csvInput.trim()) return;
    const lines = csvInput.trim().split('\n');
    const parsed: BatchItem[] = [];
    for (const line of lines) {
      const parts = line.split(',').map(s => s.trim());
      if (parts[0]) {
        parsed.push({
          productName: parts[0] || '',
          sellingPoints: parts[1] || '',
          price: parts[2] || '',
          condition: parts[3] || '全新',
        });
      }
    }
    if (parsed.length > 0) {
      setItems(parsed.slice(0, MAX_ITEMS_FREE));
      setCsvInput('');
    }
  };

  const handleBatchGenerate = async () => {
    const validItems = items.filter(item => item.productName.trim());
    if (validItems.length === 0) {
      setError('请至少填写一个商品名称');
      return;
    }

    if (dailyUsed >= DAILY_LIMIT_FREE) {
      setError('今日批量生成次数已用完');
      return;
    }

    setLoading(true);
    setError('');
    setResults([]);

    try {
      await new Promise(r => setTimeout(r, 1200));
      const batchResults = validItems.map(item => ({
        item,
        copies: getDemoGenerateResult(item.productName, item.sellingPoints, item.price, item.condition),
      }));
      setResults(batchResults);
      setDailyUsed(prev => prev + 1);
    } catch {
      setError('批量生成失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = useCallback(() => {
    if (results.length === 0) return;

    // Generate CSV content
    const headers = ['商品名称', '淘宝', '闲鱼', '拼多多', '小红书', '抖音'];
    const rows = results.map(r => {
      const copies: Record<string, string> = {};
      r.copies.forEach(c => { copies[c.platform] = c.content; });
      return [
        r.item.productName,
        copies['taobao'] || '',
        copies['xianyu'] || '',
        copies['pinduoduo'] || '',
        copies['xiaohongshu'] || '',
        copies['douyin'] || '',
      ].map(v => `"${v.replace(/"/g, '""')}"`).join(',');
    });

    const csv = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `卖货通_批量文案_${new Date().toLocaleDateString('zh-CN')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [results]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        badge="批量生成"
        title="批量文案生成"
        description="上传商品列表，一键批量生成5平台文案，导出Excel直接上架"
        actions={
          <div className="text-xs text-gray-400">
            今日已用 <span className="font-semibold text-gray-600">{dailyUsed}</span>/{DAILY_LIMIT_FREE} 次
          </div>
        }
      />

      {dailyUsed >= DAILY_LIMIT_FREE && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-700 flex items-center justify-between">
          <span>免费版每天{DAILY_LIMIT_FREE}次批量生成，每次最多{MAX_ITEMS_FREE}个商品</span>
          <Link href="/pricing" className="text-[#FF6B35] font-medium hover:underline">升级Pro →</Link>
        </div>
      )}

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Input Panel */}
        <div className="lg:col-span-2 space-y-4">
          {/* CSV Import */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">快速导入</h3>
            <textarea
              value={csvInput}
              onChange={(e) => setCsvInput(e.target.value)}
              placeholder={"每行一个商品，逗号分隔：\n商品名,卖点,价格,成色\n蓝牙耳机,降噪续航,299,全新\n连衣裙,显瘦法式,189,全新"}
              className="w-full h-24 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#FF6B35] resize-none transition-all"
            />
            <button
              onClick={handleCsvImport}
              disabled={!csvInput.trim()}
              className="mt-2 w-full px-4 py-2 bg-gray-50 text-gray-700 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              导入CSV数据
            </button>
          </div>

          {/* Manual Items */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">
                商品列表 ({items.length}/{MAX_ITEMS_FREE})
              </h3>
              <button
                onClick={addItem}
                disabled={items.length >= MAX_ITEMS_FREE}
                className="text-xs text-[#FF6B35] font-medium hover:underline disabled:text-gray-300 disabled:cursor-not-allowed"
              >
                + 添加商品
              </button>
            </div>

            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {items.map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-500">商品 {idx + 1}</span>
                    {items.length > 1 && (
                      <button
                        onClick={() => removeItem(idx)}
                        className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                      >
                        删除
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={item.productName}
                    onChange={(e) => updateItem(idx, 'productName', e.target.value)}
                    placeholder="商品名称 *"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#FF6B35] transition-all mb-2"
                  />
                  <input
                    type="text"
                    value={item.sellingPoints}
                    onChange={(e) => updateItem(idx, 'sellingPoints', e.target.value)}
                    placeholder="核心卖点"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#FF6B35] transition-all mb-2"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={item.price}
                      onChange={(e) => updateItem(idx, 'price', e.target.value)}
                      placeholder="价格"
                      className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#FF6B35] transition-all"
                    />
                    <select
                      value={item.condition}
                      onChange={(e) => updateItem(idx, 'condition', e.target.value)}
                      className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#FF6B35] transition-all"
                    >
                      <option>全新</option>
                      <option>几乎全新</option>
                      <option>轻微使用痕迹</option>
                      <option>明显使用痕迹</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleBatchGenerate}
              disabled={loading || items.every(i => !i.productName.trim()) || dailyUsed >= DAILY_LIMIT_FREE}
              className="mt-4 w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-[#FF6B35] to-[#FF3D57] text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-orange-200 transition-all btn-press disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  批量生成中...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  一键批量生成
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-3">
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
              {error}
            </div>
          )}

          {loading && (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="rounded-xl border border-gray-100 bg-white p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="skeleton h-4 w-24" />
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
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-900">
                  生成结果 ({results.length} 个商品)
                </h3>
                <button
                  onClick={handleExport}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#FF6B35] bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  导出CSV
                </button>
              </div>

              {results.map((result, idx) => (
                <div key={idx} className="rounded-2xl border border-gray-200 bg-white overflow-hidden animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-gradient-to-br from-[#FF6B35] to-[#FF3D57] flex items-center justify-center text-white text-xs font-bold">
                        {idx + 1}
                      </span>
                      <span className="text-sm font-semibold text-gray-900">{result.item.productName}</span>
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    {result.copies.map((copy) => {
                      const platform = PLATFORMS.find(p => p.id === copy.platform);
                      if (!platform) return null;
                      return (
                        <div key={copy.platform} className="rounded-lg bg-gray-50 border border-gray-100 p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm">{platform.icon}</span>
                              <span className="text-xs font-semibold text-gray-700">{platform.name}</span>
                            </div>
                            <CopyButton text={copy.content} />
                          </div>
                          <p className="text-xs text-gray-600 line-clamp-3">{copy.content}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {results.length === 0 && !loading && !error && (
            <div className="rounded-2xl border border-gray-100 bg-white p-8 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center text-3xl mb-4">
                ⚡
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">批量生成5平台文案</h3>
              <p className="text-sm text-gray-500 max-w-sm">
                在左侧添加多个商品信息，一键批量生成所有平台的适配文案，支持导出CSV直接用于上架
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
