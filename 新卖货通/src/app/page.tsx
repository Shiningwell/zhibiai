import Link from 'next/link';

const FEATURES = [
  {
    icon: '🔍',
    title: '爆款拆解',
    description: '输入竞品标题，AI 自动提取爆款公式、关键词标签，找到高转化规律',
    href: '/analyze',
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: '✍️',
    title: '一键生成5平台文案',
    description: '淘宝/闲鱼/拼多多/小红书/抖音，每个平台风格精准适配',
    href: '/generate',
    color: 'from-blue-500 to-purple-500',
  },
  {
    icon: '🛡️',
    title: '违禁词检测',
    description: '广告法+各平台违禁词库，高亮标注风险词，给出替换建议',
    href: '/forbidden-check',
    color: 'from-red-500 to-pink-500',
    new: true,
  },
  {
    icon: '⚡',
    title: '批量文案生成',
    description: '上传CSV/Excel，一键批量生成5平台文案，导出直接上架',
    href: '/batch',
    color: 'from-amber-500 to-orange-500',
    new: true,
  },
  {
    icon: '🔑',
    title: '关键词分析',
    description: '热门关键词+搜索热度+竞争度，找到蓝海词提升流量',
    href: '/keywords',
    color: 'from-green-500 to-teal-500',
    new: true,
  },
  {
    icon: '👁️',
    title: '竞品监控',
    description: '追踪竞品价格、文案变化，及时调整你的定价和策略',
    href: '/monitor',
    color: 'from-indigo-500 to-blue-500',
    new: true,
  },
];

const PLATFORMS_SHOWCASE = [
  { name: '淘宝', style: '关键词丰富 · 卖点堆叠 · 300字以内', icon: '🛒' },
  { name: '闲鱼', style: '口语化 · 真实感 · 像个人卖家', icon: '🐟' },
  { name: '拼多多', style: '低价感 · 实惠 · 突出性价比', icon: '🏷️' },
  { name: '小红书', style: '种草风 · emoji · 第一人称体验', icon: '📕' },
  { name: '抖音', style: '短平快 · 冲击力标题 · 口语化卖点', icon: '🎵' },
];

const COMPARISON_TABLE = [
  { feature: '文案生成', free: '每天3次', pro: '无限' },
  { feature: '违禁词检测', free: '每天5次', pro: '无限' },
  { feature: '批量生成', free: '3次/天×5个', pro: '无限×50个' },
  { feature: '定价建议', free: '✗', pro: '✓' },
  { feature: '发布日历', free: '✗', pro: '✓' },
  { feature: 'A/B 测试', free: '✗', pro: '✓' },
  { feature: '竞品监控', free: '✗', pro: '最多20个' },
];

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-red-50" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-red-100/30 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 sm:pt-24 sm:pb-28">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-orange-100 shadow-sm mb-6 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-medium text-gray-600">免费使用 · 无需注册</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 animate-slide-up">
              拆解爆款，<br />
              <span className="gradient-text">一键生成5平台文案</span>
            </h1>

            <p className="mt-5 text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto animate-slide-up stagger-2">
              帮电商卖家拆解爆款标题公式，AI 一键生成淘宝、闲鱼、拼多多、小红书、抖音适配文案
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 animate-slide-up stagger-3">
              <Link
                href="/analyze"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FF6B35] to-[#FF3D57] text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-orange-200 transition-all btn-press animate-pulse-glow"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                开始拆解爆款
              </Link>
              <Link
                href="/generate"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all btn-press"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                直接生成文案
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Showcase */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {PLATFORMS_SHOWCASE.map((platform) => (
              <div
                key={platform.name}
                className="flex flex-col items-center p-4 rounded-xl bg-gray-50 hover:bg-orange-50 transition-colors group"
              >
                <span className="text-2xl mb-2">{platform.icon}</span>
                <span className="text-sm font-semibold text-gray-900 group-hover:text-[#FF6B35] transition-colors">
                  {platform.name}
                </span>
                <span className="text-xs text-gray-400 mt-1 text-center">{platform.style}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Feature Highlight */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-100 mb-4">
              <span className="text-xs font-semibold text-red-600">NEW</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              全新功能上线
            </h2>
            <p className="mt-2 text-gray-500">
              不只是文案生成，更完整的电商工具链
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/forbidden-check" className="group rounded-2xl border-2 border-red-100 bg-gradient-to-br from-red-50 to-pink-50 p-6 card-hover relative overflow-hidden">
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-[10px] font-bold">NEW</div>
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform shadow-sm">
                🛡️
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">违禁词检测</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                粘贴文案一键检测，覆盖广告法+各平台违禁词库，高亮标注并给出替换建议
              </p>
            </Link>

            <Link href="/batch" className="group rounded-2xl border-2 border-amber-100 bg-gradient-to-br from-amber-50 to-orange-50 p-6 card-hover relative overflow-hidden">
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-amber-100 text-amber-600 text-[10px] font-bold">NEW</div>
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform shadow-sm">
                ⚡
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">批量文案生成</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                上传CSV/Excel商品列表，一键批量生成5平台文案，导出Excel直接上架
              </p>
            </Link>

            <Link href="/monitor" className="group rounded-2xl border-2 border-indigo-100 bg-gradient-to-br from-indigo-50 to-blue-50 p-6 card-hover relative overflow-hidden">
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-600 text-[10px] font-bold">NEW</div>
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform shadow-sm">
                👁️
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">竞品监控</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                追踪竞品价格和文案变化，及时调整定价策略，抢占市场先机
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              全方位电商文案工具
            </h2>
            <p className="mt-2 text-gray-500">
              从拆解到生成，从检测到监控，AI 帮你省下80%的文案时间
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => (
              <Link
                key={feature.title}
                href={feature.href}
                className="group relative rounded-2xl border border-gray-100 bg-white p-6 card-hover overflow-hidden"
              >
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${feature.color}`} />
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  {'new' in feature && feature.new && (
                    <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-600 text-[10px] font-bold border border-red-100">NEW</span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
                <div className="mt-4 flex items-center text-sm font-medium text-[#FF6B35] opacity-0 group-hover:opacity-100 transition-opacity">
                  立即使用
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              免费版 vs Pro版
            </h2>
            <p className="mt-2 text-gray-500">
              选择适合你的方案
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500">功能</th>
                  <th className="px-5 py-3.5 text-center text-xs font-semibold text-gray-500">免费版</th>
                  <th className="px-5 py-3.5 text-center text-xs font-semibold text-[#FF6B35]">
                    <span className="px-2 py-0.5 rounded-full bg-orange-50 text-[10px] font-bold mr-1">PRO</span>
                    Pro版
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_TABLE.map((row, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3 text-gray-700 font-medium">{row.feature}</td>
                    <td className="px-5 py-3 text-center text-gray-500">
                      {row.free === '✗' ? (
                        <span className="text-gray-300">—</span>
                      ) : (
                        row.free
                      )}
                    </td>
                    <td className="px-5 py-3 text-center font-medium">
                      {row.pro === '✓' ? (
                        <span className="text-green-500">✓</span>
                      ) : (
                        <span className="text-[#FF6B35]">{row.pro}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-5 py-4 bg-gray-50 text-center">
              <Link
                href="/pricing"
                className="inline-flex items-center gap-1 text-sm font-medium text-[#FF6B35] hover:underline"
              >
                查看完整定价方案
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl sm:text-4xl font-bold gradient-text">12,580+</p>
              <p className="text-sm text-gray-500 mt-1">卖家正在使用</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-bold gradient-text">86万+</p>
              <p className="text-sm text-gray-500 mt-1">已生成文案</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-bold gradient-text">5</p>
              <p className="text-sm text-gray-500 mt-1">平台适配</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-bold gradient-text">98%</p>
              <p className="text-sm text-gray-500 mt-1">用户满意度</p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Preview */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 bg-gray-50/50">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span className="ml-3 text-xs text-gray-400">卖货通 — 文案生成结果</span>
            </div>
            <div className="p-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {PLATFORMS_SHOWCASE.slice(0, 3).map((p) => (
                <div key={p.name} className="rounded-lg bg-gray-50 p-4 border border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{p.icon}</span>
                    <span className="text-sm font-semibold text-gray-900">{p.name}</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="skeleton h-3 w-full" />
                    <div className="skeleton h-3 w-4/5" />
                    <div className="skeleton h-3 w-3/5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            开始提升你的电商文案效率
          </h2>
          <p className="text-gray-500 mb-8">
            免费版每天可生成3次文案，无需信用卡
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/generate"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#FF6B35] to-[#FF3D57] text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-orange-200 transition-all btn-press text-lg"
            >
              免费开始使用
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/forbidden-check"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all btn-press"
            >
              试试违禁词检测
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
