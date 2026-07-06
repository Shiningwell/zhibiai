import { Platform, PlatformInfo } from '@/types';

export const PLATFORMS: PlatformInfo[] = [
  {
    id: 'taobao',
    name: '淘宝',
    icon: '🛒',
    color: '#FF6A00',
    description: '关键词丰富、卖点堆叠、300字以内',
  },
  {
    id: 'xianyu',
    name: '闲鱼',
    icon: '🐟',
    color: '#FFD700',
    description: '口语化、真实感、像个人卖家',
  },
  {
    id: 'pinduoduo',
    name: '拼多多',
    icon: '🏷️',
    color: '#E02E24',
    description: '低价感、实惠、突出性价比',
  },
  {
    id: 'xiaohongshu',
    name: '小红书',
    icon: '📕',
    color: '#FF2442',
    description: '种草风、emoji、第一人称体验',
  },
  {
    id: 'douyin',
    name: '抖音',
    icon: '🎵',
    color: '#010101',
    description: '短平快、冲击力标题、口语化卖点',
  },
];

export function getPlatformInfo(id: Platform): PlatformInfo {
  return PLATFORMS.find((p) => p.id === id) ?? PLATFORMS[0];
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  }
  return new Promise((resolve, reject) => {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      resolve();
    } catch (e) {
      reject(e);
    }
  });
}
