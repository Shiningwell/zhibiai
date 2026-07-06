import Link from 'next/link';

const PLANS = [
  {
    id: 'free',
    name: '免费版',
    price: '¥0',
    period: '永久免费',
    features: [
      '每天3次文案生成',
      '每天5次违禁词检测',
      '每天3次批量生成（每次5个）',
      '2个爆款模板',
      '5平台文案适配',
      '基础爆款拆解',
      '关键词分析（演示模式）',
    ],
    limitations: [
      '不含定价建议',
      '不含发布日历',
      '不含A/B测试',
      '不含竞品监控',
    ],
  },
  {
    id: 'pro',
    name: 'Pro 版',
    price: '¥39',
    period: '/月',
    highlighted: true,
    badge: '最受欢迎',
    features: [
      '无限文案生成',
      '无限违禁词检测',
      '无限批量生成（每次50个）',
      '无限爆款模板',
      '5平台文案适配',
      '高级爆款拆解',
      '定价建议',
      '发布日历',
      'A/B 测试',
      '竞品监控（最多20个）',
      '优先 AI 响应',
      '专属客服支持',
    ],
  },
  {
    id: 'yearly',
    name: 'Pro 年费',
    price: '¥298',
    period: '/年',
    badge: '省¥170',
    features: [
      '包含 Pro 全部功能',
      '年费立省 ¥170',
      '相当于 ¥24.8/月',
      '优先体验新功能',
    ],
  },
];

const ADD_ON_SERVICES = [
  {
    name: '关键词分析',
    price: '¥9.9/次',
    description: '获取真实热门关键词、搜索热度、竞争度数据',
    icon: '🔑',
  },
  {
    name: '竞品监控',
    price: '¥19.9/月',
    description: '追踪竞品价格和文案变化，最多监控20个竞品',
    icon: '👁️',
  },
];

const FEATURE_COMPARISON = [
  { feature: '文案生成', free: '每天3次', pro: '无限' },
  { feature: '违禁词检测', free: '每天5次', pro: '无限' },
  { feature: '批量生成', free: '每天3次×5个', pro: '无限×50个' },
  { feature: '爆款拆解', free: '基础', pro: '高级' },
  { feature: '模板库', free: '2个', pro: '无限' },
  { feature: '定价建议', free: '✗', pro: '✓' },
  { feature: '发布日历', free: '✗', pro: '✓' },
  { feature: 'A/B 测试', free: '✗', pro: '✓' },
  { feature: '竞品监控', free: '✗', pro: '最多20个' },
  { feature: '关键词分析', free: '演示模式', pro: '演示模式' },
  { feature: '客服支持', free: '社区', pro: '专属客服' },
];

export default function PricingPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
          简单透明的定价
        </h1>
        <p className="mt-3 text-lg text-gray-500">
          免费版即可上手，升级 Pro 解锁全部能力
        </p>
      </div>

      {/* Plans */}
      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-2xl p-6 sm:p-7 ${
              plan.highlighted
                ? 'bg-white border-2 border-[#FF6B35] shadow-xl shadow-orange-100'
                : 'bg-white border border-gray-200'
            }`}
          >
            {plan.badge && (
              <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold ${
                plan.highlighted
                  ? 'bg-gradient-to-r from-[#FF6B35] to-[#FF3D57] text-white'
                  : 'bg-green-100 text-green-700'
              }`}>
                {plan.badge}
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-sm text-gray-500">{plan.period}</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                  <svg
                    className={`w-5 h-5 flex-shrink-0 ${
                      plan.highlighted ? 'text-[#FF6B35]' : 'text-green-500'
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
              {'limitations' in plan && (plan as { limitations?: string[] }).limitations?.map((limitation, i) => (
                <li key={`limit-${i}`} className="flex items-start gap-2.5 text-sm text-gray-400">
                  <svg className="w-5 h-5 flex-shrink-0 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {limitation}
                </li>
              ))}
            </ul>

            <Link
              href={plan.id === 'free' ? '/generate' : '/generate'}
              className={`block w-full text-center px-4 py-2.5 rounded-xl text-sm font-semibold transition-all btn-press ${
                plan.highlighted
                  ? 'bg-gradient-to-r from-[#FF6B35] to-[#FF3D57] text-white hover:shadow-lg hover:shadow-orange-200'
                  : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              {plan.id === 'free' ? '免费开始' : '立即升级'}
            </Link>
          </div>
        ))}
      </div>

      {/* Add-on Services */}
      <div className="mt-16 max-w-2xl mx-auto">
        <h2 className="text-xl font-bold text-gray-900 text-center mb-8">增值服务</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {ADD_ON_SERVICES.map((service) => (
            <div key={service.name} className="rounded-xl border border-gray-200 bg-white p-5 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-2xl flex-shrink-0">
                {service.icon}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-gray-900">{service.name}</h3>
                  <span className="text-sm font-bold text-[#FF6B35]">{service.price}</span>
                </div>
                <p className="text-xs text-gray-500">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Comparison Table */}
      <div className="mt-16 max-w-3xl mx-auto">
        <h2 className="text-xl font-bold text-gray-900 text-center mb-8">功能对比</h2>
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">功能</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500">免费版</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-[#FF6B35]">Pro版</th>
              </tr>
            </thead>
            <tbody>
              {FEATURE_COMPARISON.map((row, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3 text-gray-700 font-medium">{row.feature}</td>
                  <td className="px-5 py-3 text-center text-gray-500">
                    {row.free === '✗' ? (
                      <span className="text-gray-300">—</span>
                    ) : row.free === '✓' ? (
                      <span className="text-green-500">✓</span>
                    ) : (
                      row.free
                    )}
                  </td>
                  <td className="px-5 py-3 text-center font-medium text-gray-900">
                    {row.pro === '✗' ? (
                      <span className="text-gray-300">—</span>
                    ) : row.pro === '✓' ? (
                      <span className="text-green-500">✓</span>
                    ) : (
                      <span className="text-[#FF6B35]">{row.pro}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-16 max-w-2xl mx-auto">
        <h2 className="text-xl font-bold text-gray-900 text-center mb-8">常见问题</h2>
        <div className="space-y-4">
          {[
            {
              q: '免费版有什么限制？',
              a: '免费版每天可生成3次文案、5次违禁词检测、3次批量生成（每次5个），最多保存2个爆款模板。定价建议、发布日历、A/B测试和竞品监控为Pro专属功能。',
            },
            {
              q: 'Pro 版的批量模式和免费版有什么区别？',
              a: '免费版每天3次批量生成，每次最多5个商品；Pro版无限批量生成，每次最多50个商品。',
            },
            {
              q: '竞品监控如何收费？',
              a: '竞品监控是Pro版功能，Pro用户最多可同时监控20个竞品。非Pro用户可单独购买竞品监控服务，¥19.9/月。',
            },
            {
              q: '关键词分析为什么收费？',
              a: '关键词分析需要接入真实搜索数据，每次查询消耗数据费用。演示模式下可免费查看模拟数据，真实数据查询¥9.9/次。',
            },
            {
              q: '如何配置 API Key？',
              a: '在环境变量中设置 OPENAI_API_KEY 即可启用真实 AI 模式。未配置时自动进入演示模式，使用高质量模拟数据。',
            },
            {
              q: '支持退款吗？',
              a: 'Pro 版支持7天无理由退款，请联系客服处理。',
            },
          ].map((faq, i) => (
            <div key={i} className="rounded-xl border border-gray-100 bg-white p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">{faq.q}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
