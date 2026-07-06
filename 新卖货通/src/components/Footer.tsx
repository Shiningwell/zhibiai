import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#FF6B35] to-[#FF3D57] flex items-center justify-center text-white font-bold text-[10px]">
              卖
            </div>
            <span className="text-sm font-semibold text-gray-900">卖货通</span>
            <span className="text-xs text-gray-400">— 拆解爆款，一键生成5平台文案</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-gray-400">
            <Link href="/forbidden-check" className="hover:text-gray-600 transition-colors">违禁词检测</Link>
            <Link href="/batch" className="hover:text-gray-600 transition-colors">批量生成</Link>
            <Link href="/keywords" className="hover:text-gray-600 transition-colors">关键词分析</Link>
            <Link href="/monitor" className="hover:text-gray-600 transition-colors">竞品监控</Link>
            <Link href="/pricing" className="hover:text-gray-600 transition-colors">定价</Link>
            <span>© 2026 卖货通</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
