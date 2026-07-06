// 爆款模板
export interface Template {
  id: string;
  name: string;
  formula: string;
  keywords: string[];
  source: string;
  createdAt: number;
}

// 爆款拆解结果
export interface AnalysisResult {
  title: string;
  formula: string;
  keywords: string[];
  structure: string;
  tips: string[];
}

// 平台类型
export type Platform = 'taobao' | 'xianyu' | 'pinduoduo' | 'xiaohongshu' | 'douyin';

export interface PlatformInfo {
  id: Platform;
  name: string;
  icon: string;
  color: string;
  description: string;
}

// 文案生成输入
export interface GenerateInput {
  productName: string;
  coreSellingPoints: string;
  price: string;
  condition: string;
  templateId?: string;
}

// 单个平台文案
export interface PlatformCopy {
  platform: Platform;
  content: string;
}

// 文案生成结果
export interface GenerateResult {
  copies: PlatformCopy[];
  productName: string;
  templateUsed?: string;
}

// 定价方案
export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
}

// 使用统计
export interface UsageStats {
  dailyGenerations: number;
  maxDailyGenerations: number;
  templateCount: number;
  maxTemplates: number;
  isPro: boolean;
}

// API 响应
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  demo?: boolean;
}

// ============ 新增功能类型 ============

// 违禁词检测
export interface ForbiddenWord {
  word: string;
  category: 'absolute' | 'medical' | 'false_promise' | 'platform_specific' | 'other';
  categoryName: string;
  suggestion: string;
  severity: 'high' | 'medium' | 'low';
  platforms?: Platform[];
}

export interface ForbiddenCheckResult {
  originalText: string;
  highlightedText: string;
  foundWords: ForbiddenWord[];
  totalChecked: number;
  riskScore: number; // 0-100
}

// 批量文案生成
export interface BatchItem {
  productName: string;
  sellingPoints: string;
  price: string;
  condition: string;
}

export interface BatchResult {
  item: BatchItem;
  copies: PlatformCopy[];
}

// 关键词分析
export interface KeywordData {
  keyword: string;
  searchVolume: number;
  competition: 'low' | 'medium' | 'high';
  trend: 'up' | 'stable' | 'down';
  relatedKeywords: string[];
}

export interface KeywordAnalysisResult {
  category: string;
  keywords: KeywordData[];
  hotKeywords: string[];
}

// 竞品监控
export interface CompetitorItem {
  id: string;
  name: string;
  link?: string;
  platform: string;
  currentPrice: string;
  previousPrice?: string;
  priceChange?: string;
  lastUpdated: string;
  status: 'normal' | 'price_drop' | 'price_up' | 'new';
}

export interface MonitorResult {
  competitors: CompetitorItem[];
  totalTracked: number;
}

// 定价建议
export interface PricingSuggestion {
  productName: string;
  category: string;
  lowestPrice: number;
  medianPrice: number;
  highestPrice: number;
  suggestedPrice: number;
  suggestedPriceReason: string;
  priceDistribution: { range: string; count: number }[];
}

// 发布日历
export interface CalendarDayInfo {
  dayOfWeek: number;
  dayName: string;
  bestTimes: { time: string; reason: string }[];
  platforms: Platform[];
  tips: string[];
}

export interface CalendarResult {
  category: string;
  schedule: CalendarDayInfo[];
  bestDay: string;
  bestTime: string;
}

// A/B 测试
export interface ABTestVariant {
  id: string;
  label: string;
  content: string;
  impressions: number;
  conversions: number;
  conversionRate: number;
}

export interface ABTest {
  id: string;
  productName: string;
  variants: ABTestVariant[];
  status: 'running' | 'completed';
  winner?: string;
  createdAt: number;
}

export interface ABTestResult {
  variants: ABTestVariant[];
  winner: string | null;
  confidence: number;
  analysis: string;
}
