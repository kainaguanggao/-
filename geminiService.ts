import { GoogleGenAI } from "@google/genai";
import { DailyReport } from "./types";

const extractJson = (text: string) => {
  try {
    const cleanText = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanText);
  } catch (e) {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (innerE) {
        throw new Error("模型返回数据格式有误，请重试");
      }
    }
    throw new Error("未能解析到有效的 JSON 数据");
  }
};

export const fetchLatestAITrends = async (): Promise<DailyReport> => {
  // 这里的读取逻辑会由 vite.config.ts 注入，支持两种变量名
  const apiKey = (process.env.API_KEY || (process as any).env?.API);
  
  if (!apiKey || apiKey === "undefined" || apiKey === "" || apiKey === "null") {
    throw new Error("MISSING_API_KEY");
  }

  const ai = new GoogleGenAI({ apiKey });
  const today = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
  
  const prompt = `
    你是一位顶尖的 AI 行业分析师。请利用实时搜索功能，深度挖掘今天（${today}）全球最前沿的 AI 动态。
    
    内容要求：
    1. 【全球 AI 大事件】：包含 3 条今日最有影响力的 AI 新闻。
    2. 【热门新工具雷达】：推荐 4 个最新发布的 AI 工具，包含真实官网 URL。
    3. 【前沿玩法指南】：提供 2 个具体的 AI 创作实用新玩法。
    4. 【商业成功案例】：挖掘 2 个 AI 变现的成功案例。

    必须以 JSON 格式返回：
    {
      "date": "${today}",
      "headline": "今日 AI 全球情报站",
      "summary": "一句话概括核心趋势",
      "events": [{"title": "标题", "summary": "简述", "impact": "影响"}],
      "tools": [{"name": "工具", "category": "分类", "description": "简介", "url": "URL", "highlight": "亮点"}],
      "playstyles": [{"title": "玩法", "description": "简述", "communityCase": "案例", "tutorialSteps": ["步骤"]}],
      "businessCases": [{"title": "标题", "industry": "行业", "solution": "方案", "result": "效果", "monetizationTip": "建议"}]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }]
      },
    });

    const result = extractJson(response.text || "");
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || "来源",
      uri: chunk.web?.uri || "#"
    })) || [];

    return {
      ...result,
      lastUpdated: new Date().toISOString(),
      sources: sources.filter(s => s.uri !== "#")
    };
  } catch (error: any) {
    console.error("Gemini Error:", error);
    if (error.message?.includes("API_KEY") || error.message?.includes("not found")) {
      throw new Error("MISSING_API_KEY");
    }
    throw new Error(error.message || "同步失败，请刷新");
  }
};