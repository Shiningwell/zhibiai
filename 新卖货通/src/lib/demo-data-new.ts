import { ForbiddenWord, ForbiddenCheckResult, KeywordData, KeywordAnalysisResult, CompetitorItem, MonitorResult, PricingSuggestion, CalendarDayInfo, CalendarResult, PlatformCopy } from '@/types';

// ============ 违禁词库 ============
const FORBIDDEN_WORDS: ForbiddenWord[] = [
  // 绝对化用语
  { word: '最好', category: 'absolute', categoryName: '绝对化用语', suggestion: '改为"优质""精选"', severity: 'high' },
  { word: '最佳', category: 'absolute', categoryName: '绝对化用语', suggestion: '改为"上佳""出色"', severity: 'high' },
  { word: '第一', category: 'absolute', categoryName: '绝对化用语', suggestion: '改为"领先""前列"', severity: 'high' },
  { word: '首个', category: 'absolute', categoryName: '绝对化用语', suggestion: '改为"早期""新式"', severity: 'high' },
  { word: '唯一', category: 'absolute', categoryName: '绝对化用语', suggestion: '改为"独特""专属"', severity: 'high' },
  { word: '顶级', category: 'absolute', categoryName: '绝对化用语', suggestion: '改为"高端""高级"', severity: 'high' },
  { word: '极品', category: 'absolute', categoryName: '绝对化用语', suggestion: '改为"精品""优品"', severity: 'high' },
  { word: '最先进', category: 'absolute', categoryName: '绝对化用语', suggestion: '改为"新款""升级版"', severity: 'high' },
  { word: '100%', category: 'absolute', categoryName: '绝对化用语', suggestion: '改为"高品质""可靠"', severity: 'high' },
  { word: '百分之百', category: 'absolute', categoryName: '绝对化用语', suggestion: '改为"优质""可信赖"', severity: 'high' },
  { word: '绝对', category: 'absolute', categoryName: '绝对化用语', suggestion: '改为"确实""肯定"', severity: 'high' },
  { word: '全网最低', category: 'absolute', categoryName: '绝对化用语', suggestion: '改为"超值""优惠"', severity: 'high' },
  { word: '史上最强', category: 'absolute', categoryName: '绝对化用语', suggestion: '改为"实力出色""表现优秀"', severity: 'high' },
  { word: '国家级', category: 'absolute', categoryName: '绝对化用语', suggestion: '删除或改为"高品质"', severity: 'high' },
  { word: '世界级', category: 'absolute', categoryName: '绝对化用语', suggestion: '改为"国际品质"', severity: 'high' },
  { word: '最高级', category: 'absolute', categoryName: '绝对化用语', suggestion: '改为"高等级"', severity: 'high' },
  // 医疗用语
  { word: '治愈', category: 'medical', categoryName: '医疗用语', suggestion: '改为"改善""缓解"', severity: 'high' },
  { word: '根治', category: 'medical', categoryName: '医疗用语', suggestion: '改为"辅助改善"', severity: 'high' },
  { word: '疗效', category: 'medical', categoryName: '医疗用语', suggestion: '改为"效果""体验"', severity: 'high' },
  { word: '处方', category: 'medical', categoryName: '医疗用语', suggestion: '删除该词', severity: 'high' },
  { word: '药用', category: 'medical', categoryName: '医疗用语', suggestion: '改为"护理""保养"', severity: 'high' },
  { word: '消炎', category: 'medical', categoryName: '医疗用语', suggestion: '改为"舒缓"', severity: 'high' },
  { word: '抗菌', category: 'medical', categoryName: '医疗用语', suggestion: '改为"清洁""抑菌"', severity: 'medium' },
  { word: '治疗', category: 'medical', categoryName: '医疗用语', suggestion: '改为"护理""保养"', severity: 'high' },
  { word: '减肥', category: 'medical', categoryName: '医疗用语', suggestion: '改为"塑形""管理身材"', severity: 'medium' },
  { word: '降血压', category: 'medical', categoryName: '医疗用语', suggestion: '改为"辅助调节"', severity: 'high' },
  // 虚假承诺
  { word: '包治', category: 'false_promise', categoryName: '虚假承诺', suggestion: '删除该承诺', severity: 'high' },
  { word: '无效退款', category: 'false_promise', categoryName: '虚假承诺', suggestion: '改为"品质保证"', severity: 'high' },
  { word: '立竿见影', category: 'false_promise', categoryName: '虚假承诺', suggestion: '改为"效果明显"', severity: 'medium' },
  { word: '秒杀', category: 'false_promise', categoryName: '虚假承诺', suggestion: '改为"限时优惠""特惠"', severity: 'low' },
  { word: '零风险', category: 'false_promise', categoryName: '虚假承诺', suggestion: '改为"安心试用"', severity: 'high' },
  { word: '无副作用', category: 'false_promise', categoryName: '虚假承诺', suggestion: '删除该表述', severity: 'high' },
  { word: '当天见效', category: 'false_promise', categoryName: '虚假承诺', suggestion: '改为"持续使用有改善"', severity: 'high' },
  { word: '永不', category: 'false_promise', categoryName: '虚假承诺', suggestion: '避免绝对化表述', severity: 'high' },
  // 平台特定
  { word: '微信', category: 'platform_specific', categoryName: '平台违禁词', suggestion: '删除或改为"私聊"', severity: 'medium', platforms: ['taobao', 'pinduoduo'] },
  { word: '加V', category: 'platform_specific', categoryName: '平台违禁词', suggestion: '删除导流信息', severity: 'medium', platforms: ['taobao', 'pinduoduo'] },
  { word: '好评返现', category: 'platform_specific', categoryName: '平台违禁词', suggestion: '删除违规内容', severity: 'high', platforms: ['taobao', 'pinduoduo'] },
  { word: '刷单', category: 'platform_specific', categoryName: '平台违禁词', suggestion: '删除违规内容', severity: 'high' },
  { word: '假冒', category: 'platform_specific', categoryName: '平台违禁词', suggestion: '删除，改强调正品保障', severity: 'high' },
];

export function checkForbiddenWords(text: string): ForbiddenCheckResult {
  const foundWords: ForbiddenWord[] = [];

  for (const fw of FORBIDDEN_WORDS) {
    if (text.includes(fw.word)) {
      foundWords.push(fw);
    }
  }

  // Generate highlighted text
  let highlightedText = text;
  // Sort by length descending to avoid partial replacements
  const sortedWords = [...foundWords].sort((a, b) => b.word.length - a.word.length);
  for (const fw of sortedWords) {
    const regex = new RegExp(fw.word, 'g');
    highlightedText = highlightedText.replace(regex, `【${fw.word}】`);
  }

  // Calculate risk score
  const highCount = foundWords.filter(w => w.severity === 'high').length;
  const medCount = foundWords.filter(w => w.severity === 'medium').length;
  const lowCount = foundWords.filter(w => w.severity === 'low').length;
  const riskScore = Math.min(100, highCount * 30 + medCount * 15 + lowCount * 5);

  return {
    originalText: text,
    highlightedText,
    foundWords,
    totalChecked: FORBIDDEN_WORDS.length,
    riskScore,
  };
}

// ============ 关键词分析演示数据 ============
const KEYWORD_DB: Record<string, KeywordData[]> = {
  '蓝牙耳机': [
    { keyword: '蓝牙耳机 降噪', searchVolume: 85420, competition: 'high', trend: 'up', relatedKeywords: ['主动降噪', 'ANC', '头戴式降噪'] },
    { keyword: '蓝牙耳机 无线', searchVolume: 72300, competition: 'high', trend: 'stable', relatedKeywords: ['真无线', 'TWS', '蓝牙5.3'] },
    { keyword: '蓝牙耳机 运动防水', searchVolume: 45600, competition: 'medium', trend: 'up', relatedKeywords: ['IPX7', '跑步', '挂耳式'] },
    { keyword: '蓝牙耳机 超长续航', searchVolume: 38900, competition: 'medium', trend: 'up', relatedKeywords: ['30小时', '充电仓', '快充'] },
    { keyword: '蓝牙耳机 低延迟', searchVolume: 32100, competition: 'medium', trend: 'up', relatedKeywords: ['游戏耳机', '吃鸡', '50ms'] },
    { keyword: '蓝牙耳机 半入耳', searchVolume: 28700, competition: 'medium', trend: 'stable', relatedKeywords: ['舒适', '不入耳', '开放式'] },
    { keyword: '蓝牙耳机 高颜值', searchVolume: 25400, competition: 'low', trend: 'up', relatedKeywords: ['渐变色', '赛博朋克', '透明壳'] },
    { keyword: '蓝牙耳机 学生党', searchVolume: 21300, competition: 'low', trend: 'stable', relatedKeywords: ['平价', '百元内', '性价比'] },
  ],
  '连衣裙': [
    { keyword: '连衣裙 显瘦', searchVolume: 92100, competition: 'high', trend: 'up', relatedKeywords: ['收腰', 'A字裙', '遮肉'] },
    { keyword: '连衣裙 夏季', searchVolume: 88700, competition: 'high', trend: 'up', relatedKeywords: ['雪纺', '清凉', '薄款'] },
    { keyword: '连衣裙 法式', searchVolume: 56300, competition: 'medium', trend: 'up', relatedKeywords: ['复古', '方领', '碎花'] },
    { keyword: '连衣裙 小个子', searchVolume: 48900, competition: 'medium', trend: 'stable', relatedKeywords: ['短款', '高腰', '显高'] },
    { keyword: '连衣裙 气质', searchVolume: 42100, competition: 'medium', trend: 'stable', relatedKeywords: ['优雅', '通勤', '知性'] },
    { keyword: '连衣裙 微胖', searchVolume: 35600, competition: 'low', trend: 'up', relatedKeywords: ['遮肚子', '宽松', '大码'] },
    { keyword: '连衣裙 碎花', searchVolume: 31200, competition: 'medium', trend: 'stable', relatedKeywords: ['清新', '田园', '春款'] },
    { keyword: '连衣裙 高级感', searchVolume: 28700, competition: 'low', trend: 'up', relatedKeywords: ['缎面', '真丝', '轻奢'] },
  ],
};

const DEFAULT_KEYWORDS: KeywordData[] = [
  { keyword: '热门款', searchVolume: 65400, competition: 'high', trend: 'up', relatedKeywords: ['爆款', '畅销', '人气'] },
  { keyword: '性价比', searchVolume: 52300, competition: 'medium', trend: 'stable', relatedKeywords: ['平价', '超值', '实惠'] },
  { keyword: '新款', searchVolume: 48700, competition: 'high', trend: 'up', relatedKeywords: ['最新', '上新', '当季'] },
  { keyword: '品质好', searchVolume: 35200, competition: 'low', trend: 'stable', relatedKeywords: ['高品质', '精选', '优质'] },
  { keyword: '轻奢', searchVolume: 29800, competition: 'medium', trend: 'up', relatedKeywords: ['高级感', '质感', '轻奢风'] },
];

export function getDemoKeywordAnalysis(category: string): KeywordAnalysisResult {
  const keywords = KEYWORD_DB[category] || DEFAULT_KEYWORDS;
  return {
    category,
    keywords,
    hotKeywords: keywords.filter(k => k.trend === 'up').map(k => k.keyword),
  };
}

// ============ 竞品监控演示数据 ============
export function getDemoMonitorData(): MonitorResult {
  const now = new Date();
  const competitors: CompetitorItem[] = [
    {
      id: '1',
      name: 'Apple AirPods Pro 2 USB-C',
      platform: '淘宝',
      currentPrice: '¥1,599',
      previousPrice: '¥1,799',
      priceChange: '-¥200',
      lastUpdated: now.toISOString(),
      status: 'price_drop',
    },
    {
      id: '2',
      name: 'Sony WH-1000XM5 头戴式降噪耳机',
      platform: '京东',
      currentPrice: '¥2,299',
      previousPrice: '¥2,299',
      lastUpdated: new Date(now.getTime() - 3600000).toISOString(),
      status: 'normal',
    },
    {
      id: '3',
      name: '华为 FreeBuds Pro 3',
      platform: '拼多多',
      currentPrice: '¥899',
      previousPrice: '¥999',
      priceChange: '-¥100',
      lastUpdated: new Date(now.getTime() - 7200000).toISOString(),
      status: 'price_drop',
    },
    {
      id: '4',
      name: '小米 Buds 4 Pro',
      platform: '闲鱼',
      currentPrice: '¥399',
      previousPrice: '¥349',
      priceChange: '+¥50',
      lastUpdated: new Date(now.getTime() - 86400000).toISOString(),
      status: 'price_up',
    },
    {
      id: '5',
      name: 'Bose QuietComfort Ultra',
      platform: '小红书',
      currentPrice: '¥2,999',
      lastUpdated: now.toISOString(),
      status: 'new',
    },
  ];

  return {
    competitors,
    totalTracked: 5,
  };
}

// ============ 定价建议演示数据 ============
export function getDemoPricingSuggestion(productName: string, category: string): PricingSuggestion {
  // Generate plausible demo prices based on category
  const priceRanges: Record<string, { low: number; mid: number; high: number }> = {
    '蓝牙耳机': { low: 89, mid: 299, high: 899 },
    '手机': { low: 899, mid: 2999, high: 8999 },
    '连衣裙': { low: 59, mid: 189, high: 599 },
    '笔记本': { low: 2999, mid: 5999, high: 12999 },
    '手表': { low: 199, mid: 1299, high: 5999 },
  };

  const range = priceRanges[category] || { low: 99, mid: 399, high: 999 };

  return {
    productName,
    category,
    lowestPrice: range.low,
    medianPrice: range.mid,
    highestPrice: range.high,
    suggestedPrice: Math.round(range.mid * 0.85),
    suggestedPriceReason: `基于${category}品类${50}款竞品数据分析，中间价区间竞争适中且转化率较高，建议定价略低于中间价以获得价格优势，同时保持合理利润空间。`,
    priceDistribution: [
      { range: `¥${range.low}-${range.low + Math.round((range.mid - range.low) * 0.3)}`, count: 8 },
      { range: `¥${range.low + Math.round((range.mid - range.low) * 0.3)}-${range.mid}`, count: 15 },
      { range: `¥${range.mid}-${range.mid + Math.round((range.high - range.mid) * 0.3)}`, count: 18 },
      { range: `¥${range.mid + Math.round((range.high - range.mid) * 0.3)}-${range.high}`, count: 7 },
      { range: `¥${range.high}+`, count: 2 },
    ],
  };
}

// ============ 发布日历演示数据 ============
export function getDemoCalendar(category: string): CalendarResult {
  const schedule: CalendarDayInfo[] = [
    {
      dayOfWeek: 1,
      dayName: '周一',
      bestTimes: [
        { time: '8:00-9:00', reason: '早间通勤高峰，上班族刷手机高峰' },
        { time: '12:00-13:00', reason: '午休浏览高峰' },
      ],
      platforms: ['taobao', 'pinduoduo'],
      tips: ['周一用户购买决策较理性，适合推性价比商品'],
    },
    {
      dayOfWeek: 2,
      dayName: '周二',
      bestTimes: [
        { time: '20:00-22:00', reason: '晚间浏览高峰，用户购买意愿最强' },
      ],
      platforms: ['xiaohongshu', 'douyin'],
      tips: ['小红书种草内容在周二晚间曝光效果最好'],
    },
    {
      dayOfWeek: 3,
      dayName: '周三',
      bestTimes: [
        { time: '12:00-13:00', reason: '午间浏览小高峰' },
        { time: '21:00-23:00', reason: '深夜购物冲动期' },
      ],
      platforms: ['xianyu', 'pinduoduo'],
      tips: ['闲鱼用户在周中更活跃，适合出二手商品'],
    },
    {
      dayOfWeek: 4,
      dayName: '周四',
      bestTimes: [
        { time: '19:00-21:00', reason: '下班后浏览高峰' },
      ],
      platforms: ['taobao', 'xiaohongshu'],
      tips: ['淘宝周四开始预热周末促销效果较好'],
    },
    {
      dayOfWeek: 5,
      dayName: '周五',
      bestTimes: [
        { time: '9:00-10:00', reason: '工作日最后一天早上，轻松心态浏览' },
        { time: '20:00-23:00', reason: '周末前夜，消费冲动最强' },
      ],
      platforms: ['douyin', 'taobao', 'pinduoduo'],
      tips: ['周五晚间是本周最佳发布时间，用户消费意愿最高'],
    },
    {
      dayOfWeek: 6,
      dayName: '周六',
      bestTimes: [
        { time: '10:00-12:00', reason: '周末上午自由浏览时间' },
        { time: '15:00-17:00', reason: '下午休闲时段' },
      ],
      platforms: ['xiaohongshu', 'douyin'],
      tips: ['周末种草内容效果好，用户有时间详细看评价'],
    },
    {
      dayOfWeek: 7,
      dayName: '周日',
      bestTimes: [
        { time: '20:00-22:00', reason: '周末结束前囤货心理' },
      ],
      platforms: ['pinduoduo', 'taobao'],
      tips: ['周日晚上用户有"补货"心理，适合推日用品和消耗品'],
    },
  ];

  return {
    category,
    schedule,
    bestDay: '周五',
    bestTime: '20:00-23:00',
  };
}

// ============ A/B 测试演示数据 ============
export function getDemoABTestVariants(productName: string): PlatformCopy[] {
  const name = productName || '商品';
  return [
    {
      platform: 'taobao',
      content: `【版本A】${name} 正品保证 全国包邮 品质之选\n\n✅ 正品保障 假一赔十\n✅ 极速发货 24小时内\n✅ 7天无理由退换\n\n限时特惠，库存有限！`,
    },
    {
      platform: 'taobao',
      content: `【版本B】${name} | 万人回购 同款最低\n\n🔥 已售10万+ | 好评率99.8%\n🔥 同品质比实体店省50%\n🔥 买过都说好 闭眼入\n\n抢到就是赚到！`,
    },
    {
      platform: 'taobao',
      content: `【版本C】你还在犹豫？${name} 这价格绝了\n\n为什么10万人选择我们？\n→ 品质：严格品控 件件精选\n→ 价格：源头直供 去掉中间商\n→ 服务：1对1售后 全程跟踪\n\n现在下单 立享优惠→`,
    },
  ];
}
