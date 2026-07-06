'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import EmptyState from '@/components/EmptyState';
import { getTemplates, deleteTemplate } from '@/lib/storage';
import { Template } from '@/types';

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    setTemplates(getTemplates());
  }, []);

  const handleDelete = (id: string) => {
    deleteTemplate(id);
    setTemplates(getTemplates());
    setDeletingId(null);
  };

  const maxFreeTemplates = 2;
  const isAtLimit = templates.length >= maxFreeTemplates;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        badge="模板管理"
        title="模板库"
        description="保存和管理你的爆款标题公式模板"
        actions={
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">
              已用 <span className="font-semibold text-gray-600">{templates.length}</span>/{maxFreeTemplates} 个模板
            </span>
            <Link
              href="/analyze"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#FF6B35] to-[#FF3D57] rounded-lg hover:shadow-lg hover:shadow-orange-200 transition-all btn-press"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              添加模板
            </Link>
          </div>
        }
      />

      {/* Limit Banner */}
      {isAtLimit && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-700 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            免费版最多保存 {maxFreeTemplates} 个模板
          </span>
          <Link href="/pricing" className="text-[#FF6B35] font-medium hover:underline">
            升级 Pro →
          </Link>
        </div>
      )}

      {/* Templates Grid */}
      {templates.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template, idx) => (
            <div
              key={template.id}
              className="group rounded-2xl border border-gray-200 bg-white p-5 card-hover animate-fade-in"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center text-lg">
                  📋
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link
                    href="/generate"
                    className="p-1.5 rounded-lg hover:bg-orange-50 text-gray-400 hover:text-[#FF6B35] transition-colors"
                    title="使用此模板"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </Link>
                  {deletingId === template.id ? (
                    <button
                      onClick={() => handleDelete(template.id)}
                      className="p-1.5 rounded-lg bg-red-50 text-red-500 transition-colors text-xs font-medium"
                    >
                      确认
                    </button>
                  ) : (
                    <button
                      onClick={() => setDeletingId(template.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                      title="删除"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-1">
                {template.formula}
              </h3>

              <div className="flex flex-wrap gap-1 mb-3">
                {template.keywords.slice(0, 5).map((kw, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-0.5 rounded bg-gray-50 text-gray-600 border border-gray-100"
                  >
                    {kw}
                  </span>
                ))}
                {template.keywords.length > 5 && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-gray-50 text-gray-400">
                    +{template.keywords.length - 5}
                  </span>
                )}
              </div>

              <div className="pt-3 border-t border-gray-50">
                <p className="text-xs text-gray-400 line-clamp-1">
                  来源：{template.source}
                </p>
                <p className="text-xs text-gray-300 mt-1">
                  {new Date(template.createdAt).toLocaleDateString('zh-CN')}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon="📋"
          title="还没有保存的模板"
          description="在爆款拆解页面分析竞品标题后，可以将爆款公式保存为模板，方便复用"
          action={{ label: '去拆解爆款', href: '/analyze' }}
        />
      )}
    </div>
  );
}
