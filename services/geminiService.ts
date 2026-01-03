import { GoogleGenAI } from "@google/genai";
import { DailyReport } from "../types";

const extractJson = (text: string) => {
  try {
    return JSON.parse(text);
  } catch (e) {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (innerE) {
        throw new Error("解析失败，AI 生成的格式不符合要求。");
      }
    }
    throw new Error("无法从响应中提取数据。");
  }
};

export const fetchLatestAITrends = async (): Promise<DailyReport> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const today = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
  
  const prompt = `
    你是一位顶尖的 AI 趋势观察员。请通过 Google Search 深度搜索并汇总今天（${today}）全球范围内最值得关注的 AI 动态。
    
    内容要求：
    1. 【全球 AI 大事件】：包含 3 条今日重磅新闻。
    2. 【热门新工具雷达】：搜索并推荐 4 个最新发布的 AI 工具（要有 URL）。
    3. 【前沿玩法指南】：提供 2 个具体的 AI 创作或实用玩法。
    4. 【商业成功案例】：挖掘 2 个 AI 落地变现的真实案例。

    请严格按照以下 JSON 格式输出：
    {
      "date": "${today}",
      "headline": "今日 AI 全球情报站",
      "summary": "一句话概括今日最核心的趋势",
      "events": [{"title": "事件名", "summary": "简要描述", "impact": "影响分析"}],
      "tools": [{"name": "工具名", "category": "分类", "description": "简介", "url": "链接", "highlight": "亮点"}],
      "playstyles": [{"title": "玩法名称", "description": "介绍", "communityCase": "案例", "tutorialSteps": ["步骤1", "步骤2", "步骤3", "步骤4"]}],
      "businessCases": [{"title": "标题", "industry": "行业", "solution": "方案", "result": "效果", "monetizationTip": "建议"}]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: 32768 }
      },
    });

    const result = extractJson(response.text || "");
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || "参考来源",
      uri: chunk.web?.uri || "#"
    })) || [];

    return {
      ...result,
      lastUpdated: new Date().toISOString(),
      sources
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("同步失败，请检查 API Key 是否有效或网络是否通畅。");
  }
};