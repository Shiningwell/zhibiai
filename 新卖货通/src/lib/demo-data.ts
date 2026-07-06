import { Template, AnalysisResult, PlatformCopy, Platform } from '@/types';

export function getDemoAnalysisResults(titles: string[]): AnalysisResult[] {
  return titles.map((title) => {
    const chars = title.replace(/\s+/g, '');
    const demoResults: AnalysisResult[] = [
      {
        title,
        formula: '品牌词 + 核心品类 + 修饰卖点 + 使用场景 + 规格参数',
        keywords: extractDemoKeywords(title),
        structure:
          '该标题采用"品牌引流+品类定位+差异化卖点+场景暗示"四层结构，前半段锁定搜索流量，后半段提升点击率。关键词密度合理，覆盖用户多种搜索意图。',
        tips: [
          '建议将最核心卖点前置，提升前3秒吸引力',
          '可补充使用场景词（如"居家必备""出行首选"）扩大搜索覆盖',
          '数字类卖点（如"99%好评""10万+回购"）可显著提升CTR',
        ],
      },
      {
        title,
        formula: '痛点词 + 解决方案 + 产品名 + 信任背书 + 促转化词',
        keywords: extractDemoKeywords(title),
        structure:
          '标题以痛点开场引发共鸣，随后给出解决方案，产品名居中便于搜索，信任词增强可信度，尾部促转化词推动行动。',
        tips: [
          '痛点前置策略有效，可尝试A/B测试不同痛点词的转化率',
          '添加"限时""今日"等时效词可制造紧迫感',
          '信任背书可用具体数据替代，如"5万+用户选择"',
        ],
      },
    ];
    const idx = chars.length % demoResults.length;
    return demoResults[idx];
  });
}

function extractDemoKeywords(title: string): string[] {
  const commonWords = [
    '正品', '新款', '爆款', '热销', '限时', '特价', '包邮',
    '专柜', '同款', '高颜值', '必买', '推荐', '自用', '转卖',
    '全新', '未拆', '现货', '急出', '低价', '好物', '回购',
    '神器', '安利', '种草', '亲测',
  ];
  return commonWords.filter((w) => title.includes(w)).slice(0, 5).concat(
    ['高转化', '精准流量', '爆款公式'].slice(0, 3 - Math.min(2, title.length % 3))
  );
}

export function getDemoGenerateResult(
  productName: string,
  sellingPoints: string,
  price: string,
  condition: string
): PlatformCopy[] {
  const name = productName || '商品';
  const points = sellingPoints || '品质优良';
  const pr = price || '面议';
  const cond = condition || '全新';

  return [
    {
      platform: 'taobao',
      content: `【正品直发】${name} ${points} ${cond}品质保障 全国包邮\n\n✅ 品质保证：${cond}正品，假一赔十\n✅ 核心卖点：${points}\n✅ 价格优势：仅${pr}，性价比拉满\n✅ 极速发货：下单24小时内发出\n✅ 售后无忧：7天无理由退换\n\n🔥 爆款热销中，库存有限，手慢无！\n同款实体店${Math.floor(parseFloat(pr.replace(/[^0-9.]/g, '') || '99') * 1.8)}+，现在下单立省！`,
    },
    {
      platform: 'xianyu',
      content: `出${name}，${cond}的\n\n说实话买来${cond === '全新' ? '还没用过，买多了' : '用了几次觉得不太适合我'}，东西是真的好，${points}\n\n💰 ${pr}出，诚心要的来，屠龙刀勿扰\n\n东西很新没毛病，可以走验货宝，不墨迹的直接拍，拍下就发\n\n同城自取也行，闲鱼交易安全有保障～`,
    },
    {
      platform: 'pinduoduo',
      content: `${name} 超值特惠！${points}\n\n💥 限时特价 ${pr}！比别家便宜太多！\n\n✅ ${cond}正品 假一赔三\n✅ 全场包邮 到货快\n✅ ${points}\n✅ 已拼10万+ 好评率99%\n\n⚡ 拼单更便宜！快叫上朋友一起拼！\n库存不多，赶紧下单！晚了就没了！`,
    },
    {
      platform: 'xiaohongshu',
      content: `终于找到啦😭 ${name}真的绝了！\n\n姐妹们我必须安利这个${name}🙋‍♀️\n\n💫 ${points}\n💫 ${cond}入手，品质感人\n💫 只需要${pr}，性价比太可了\n\n用了一段时间真的爱不释手💯\n之前纠结了好久，买了完全不后悔！\n细节做工都很到位，质感在线✨\n\n真心建议入手，趁现在还有货！\n\n#${name} #好物推荐 #种草 #性价比 #必买清单`,
    },
    {
      platform: 'douyin',
      content: `${name}只要${pr}？！这也太香了！\n\n${points}\n${cond}品质 闭眼入！\n\n点击下方链接👇\n限量抢！手慢无！`,
    },
  ];
}
