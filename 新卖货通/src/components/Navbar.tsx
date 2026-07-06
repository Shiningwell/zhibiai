'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const NAV_ITEMS = [
  { href: '/', label: '首页' },
  { href: '/analyze', label: '爆款拆解' },
  { href: '/generate', label: '文案生成' },
  { href: '/forbidden-check', label: '违禁词检测' },
  { href: '/batch', label: '批量生成' },
  { href: '/keywords', label: '关键词分析' },
  { href: '/monitor', label: '竞品监控' },
  { href: '/pricing', label: '定价' },
];

const MORE_ITEMS = [
  { href: '/templates', label: '模板库' },
  { href: '/pricing-suggest', label: '定价建议' },
  { href: '/calendar', label: '发布日历' },
  { href: '/ab-test', label: 'A/B测试' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF6B35] to-[#FF3D57] flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:shadow-md transition-shadow">
              卖
            </div>
            <span className="text-lg font-bold text-gray-900">卖货通</span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={
                  'px-3 py-2 rounded-lg text-sm font-medium transition-colors ' +
                  (isActive(item.href)
                    ? 'bg-orange-50 text-[#FF6B35]'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50')
                }
              >
                {item.label}
              </Link>
            ))}
            <div className="relative">
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                onBlur={() => setTimeout(() => setMoreOpen(false), 200)}
                className={
                  'px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ' +
                  (MORE_ITEMS.some(item => isActive(item.href))
                    ? 'bg-orange-50 text-[#FF6B35]'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50')
                }
              >
                更多
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {moreOpen && (
                <div className="absolute top-full left-0 mt-1 w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-1 animate-fade-in z-50">
                  {MORE_ITEMS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={
                        'block px-4 py-2.5 text-sm font-medium transition-colors ' +
                        (isActive(item.href)
                          ? 'text-[#FF6B35] bg-orange-50'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50')
                      }
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/generate"
              className="px-4 py-2 bg-gradient-to-r from-[#FF6B35] to-[#FF3D57] text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-orange-200 transition-all btn-press"
            >
              免费生成文案
            </Link>
          </div>

          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-50 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {mobileOpen && (
          <div className="lg:hidden py-3 border-t border-gray-100 animate-fade-in">
            {[...NAV_ITEMS, ...MORE_ITEMS].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={
                  'block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ' +
                  (isActive(item.href)
                    ? 'bg-orange-50 text-[#FF6B35]'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50')
                }
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 px-3">
              <Link
                href="/generate"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center px-4 py-2.5 bg-gradient-to-r from-[#FF6B35] to-[#FF3D57] text-white text-sm font-medium rounded-lg"
              >
                免费生成文案
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
