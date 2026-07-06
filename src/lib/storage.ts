'use client';

import { Template } from '@/types';

const STORAGE_KEY = 'maihuotong_templates';
const USAGE_KEY = 'maihuotong_usage';

export function getTemplates(): Template[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveTemplate(template: Template): void {
  const templates = getTemplates();
  const existing = templates.findIndex((t) => t.id === template.id);
  if (existing >= 0) {
    templates[existing] = template;
  } else {
    templates.unshift(template);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
}

export function deleteTemplate(id: string): void {
  const templates = getTemplates().filter((t) => t.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
}

export function getTemplateById(id: string): Template | undefined {
  return getTemplates().find((t) => t.id === id);
}

interface UsageData {
  date: string;
  generations: number;
}

export function getUsageData(): UsageData {
  if (typeof window === 'undefined') return { date: today(), generations: 0 };
  try {
    const data = localStorage.getItem(USAGE_KEY);
    if (!data) return { date: today(), generations: 0 };
    const usage: UsageData = JSON.parse(data);
    if (usage.date !== today()) {
      return { date: today(), generations: 0 };
    }
    return usage;
  } catch {
    return { date: today(), generations: 0 };
  }
}

export function incrementUsage(): void {
  const usage = getUsageData();
  usage.generations += 1;
  localStorage.setItem(USAGE_KEY, JSON.stringify(usage));
}

export function canGenerate(isPro: boolean): boolean {
  if (isPro) return true;
  return getUsageData().generations < 3;
}

function today(): string {
  return new Date().toISOString().split('T')[0];
}
