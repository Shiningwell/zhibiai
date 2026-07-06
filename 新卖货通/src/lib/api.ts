import { AnalysisResult, PlatformCopy, GenerateInput, ApiResponse } from '@/types';

const API_BASE = '';

export async function analyzeTitles(titles: string[]): Promise<ApiResponse<AnalysisResult[]>> {
  try {
    const res = await fetch(`${API_BASE}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titles }),
    });
    return await res.json();
  } catch (error) {
    console.error('Analyze error:', error);
    return { success: false, error: '分析请求失败，请稍后重试' };
  }
}

export async function generateCopies(
  input: GenerateInput
): Promise<ApiResponse<PlatformCopy[]>> {
  try {
    const res = await fetch(`${API_BASE}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    return await res.json();
  } catch (error) {
    console.error('Generate error:', error);
    return { success: false, error: '文案生成失败，请稍后重试' };
  }
}


