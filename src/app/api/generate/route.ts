import { NextRequest, NextResponse } from 'next/server';
import { PlatformCopy, GenerateInput } from '@/types';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

function isDemoMode(): boolean {
  return !OPENAI_API_KEY;
}

function demoGenerate(input: GenerateInput): PlatformCopy[] {
  const { productName, coreSellingPoints, price, condition } = input;
  const name = productName || '商品';
  const points = coreSellingPoints || '品质优良';
  const pr = price || '面议';
  const cond = condition || '全新';

  return [
    {
      platform: 'taobao',
      content: `【正品直发】${name} ${points} ${cond}品质保障 全国包邮\n\n✅ 品质保证：${cond}正品，假一赔十\n✅ 核心卖点：${points}\n✅ 价格优势：仅${pr}，性价比拉满\n✅ 极速发货：下单24小时内发出\n✅ 售后无忧：7天无理由退换\n\n🔥 爆款热销中，库存有限，手慢无！`,
    },
    {
      platform: 'xianyu',
      content: `出${name}，${cond}的\n\n说实话买来${cond === '全新' ? '还没用过，买多了' : '用了几次觉得不太适合我'}，东西是真的好，${points}\n\n💰 ${pr}出，诚心要的来，屠龙刀勿扰\n\n东西很新没毛病，可以走验货宝，不墨迹的直接拍`,
    },
    {
      platform: 'pinduoduo',
      content: `${name} 超值特惠！${points}\n\n💥 限时特价 ${pr}！比别家便宜太多！\n\n✅ ${cond}正品 假一赔三\n✅ 全场包邮 到货快\n✅ ${points}\n✅ 已拼10万+ 好评率99%\n\n⚡ 拼单更便宜！快叫上朋友一起拼！`,
    },
    {
      platform: 'xiaohongshu',
      content: `终于找到啦😭 ${name}真的绝了！\n\n姐妹们我必须安利这个${name}🙋‍♀️\n\n💫 ${points}\n💫 ${cond}入手，品质感人\n💫 只需要${pr}，性价比太可了\n\n用了一段时间真的爱不释手💯\n\n#${name} #好物推荐 #种草 #性价比`,
    },
    {
      platform: 'douyin',
      content: `${name}只要${pr}？！这也太香了！\n\n${points}\n${cond}品质 闭眼入！\n\n点击下方链接👇\n限量抢！手慢无！`,
    },
  ];
}

const PLATFORM_PROMPTS: Record<string, string> = {
  taobao: `淘宝文案风格：关键词丰富、卖点堆叠、300字以内、SEO友好、突出正品保障和售后服务`,
  xianyu: `闲鱼文案风格：极度口语化、真实感、像个人卖家、带转卖原因、不刻意营销、简洁直接`,
  pinduoduo: `拼多多文案风格：强调低价感、实惠、突出性价比、制造紧迫感、拼单优惠、已拼数量`,
  xiaohongshu: `小红书文案风格：种草风、大量emoji、第一人称体验感、姐妹语气、带话题标签#`,
  douyin: `抖音文案风格：短平快、冲击力标题、口语化卖点、制造好奇、引导行动`,
};

async function aiGenerate(input: GenerateInput): Promise<PlatformCopy[]> {
  const { productName, coreSellingPoints, price, condition, templateId } = input;

  const prompt = `你是一位电商文案专家。请根据以下商品信息，为5个平台分别生成适配的文案。

商品信息：
- 名称：${productName}
- 核心卖点：${coreSellingPoints}
- 价格：${price}
- 成色：${condition}
${templateId ? `- 使用爆款模板ID：${templateId}` : ''}

平台风格要求：
${Object.entries(PLATFORM_PROMPTS)
  .map(([k, v]) => `- ${k}：${v}`)
  .join('\n')}

请以JSON对象格式返回，key为平台名(taobao/xianyu/pinduoduo/xiaohongshu/douyin)，value为文案字符串。只返回JSON。`;

  const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: [
        {
          role: 'system',
          content:
            '你是电商文案专家，精通淘宝/闲鱼/拼多多/小红书/抖音的文案风格。请严格按照各平台风格生成文案。',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.8,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content ?? '';
  const parsed = JSON.parse(content);

  const platforms = ['taobao', 'xianyu', 'pinduoduo', 'xiaohongshu', 'douyin'];
  return platforms.map((p) => ({
    platform: p as PlatformCopy['platform'],
    content: parsed[p] ?? '文案生成失败，请重试',
  }));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input: GenerateInput = body;

    if (!input.productName) {
      return NextResponse.json(
        { success: false, error: '请输入商品名称' },
        { status: 400 }
      );
    }

    if (isDemoMode()) {
      return NextResponse.json({
        success: true,
        data: demoGenerate(input),
        demo: true,
      });
    }

    const results = await aiGenerate(input);
    return NextResponse.json({
      success: true,
      data: results,
      demo: false,
    });
  } catch (error) {
    console.error('Generate API error:', error);
    return NextResponse.json(
      { success: false, error: '文案生成失败，请稍后重试' },
      { status: 500 }
    );
  }
}
