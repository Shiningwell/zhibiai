import { NextRequest, NextResponse } from 'next/server';
import { AnalysisResult, ApiResponse } from '@/types';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

function isDemoMode(): boolean {
  return !OPENAI_API_KEY;
}

// Demo mode analysis
function demoAnalyze(titles: string[]): AnalysisResult[] {
  return titles.map((title) => ({
    title,
    formula: '品牌词 + 核心品类 + 修饰卖点 + 使用场景 + 规格参数',
    keywords: ['高转化', '精准流量', '爆款公式'],
    structure:
      '该标题采用"品牌引流+品类定位+差异化卖点+场景暗示"四层结构，前半段锁定搜索流量，后半段提升点击率。关键词密度合理，覆盖用户多种搜索意图。',
    tips: [
      '建议将最核心卖点前置，提升前3秒吸引力',
      '可补充使用场景词（如"居家必备""出行首选"）扩大搜索覆盖',
      '数字类卖点（如"99%好评""10万+回购"）可显著提升CTR',
    ],
  }));
}

async function aiAnalyze(titles: string[]): Promise<AnalysisResult[]> {
  const prompt = `你是一位电商爆款分析专家。请分析以下商品标题，提取爆款标题公式。

标题列表：
${titles.map((t, i) => `${i + 1}. ${t}`).join('\n')}

请对每个标题分析：
1. 标题公式（如：身份词+痛点+产品名+卖点词）
2. 关键词标签（3-8个）
3. 结构分析（100字以内）
4. 优化建议（2-3条）

请以JSON数组格式返回，每个元素包含 title, formula, keywords, structure, tips 字段。只返回JSON，不要其他内容。`;

  const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: [
        { role: 'system', content: '你是电商爆款分析专家，擅长拆解商品标题的爆款公式。' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content ?? '';
  const parsed = JSON.parse(content);

  // Handle both array and object with results key
  if (Array.isArray(parsed)) return parsed;
  if (parsed.results && Array.isArray(parsed.results)) return parsed.results;
  if (parsed.titles && Array.isArray(parsed.titles)) return parsed.titles;

  return demoAnalyze(titles);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const titles: string[] = body.titles;

    if (!titles || !Array.isArray(titles) || titles.length === 0) {
      return NextResponse.json(
        { success: false, error: '请提供至少一个商品标题' },
        { status: 400 }
      );
    }

    if (isDemoMode()) {
      return NextResponse.json({
        success: true,
        data: demoAnalyze(titles),
        demo: true,
      });
    }

    const results = await aiAnalyze(titles);
    return NextResponse.json({
      success: true,
      data: results,
      demo: false,
    });
  } catch (error) {
    console.error('Analyze API error:', error);
    return NextResponse.json(
      { success: false, error: '分析失败，请稍后重试' },
      { status: 500 }
    );
  }
}
