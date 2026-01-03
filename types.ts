
export interface AIEvent {
  title: string;
  summary: string;
  impact: string; // 影响力描述
}

export interface AITool {
  name: string;
  category: '语言' | '图像' | '视频' | '音频' | '其他';
  description: string;
  url: string;
  highlight: string; // 核心亮点
}

export interface AIPlaystyle {
  title: string;
  description: string;
  communityCase: string; // 社区真实案例
  tutorialSteps: string[];
}

export interface AIBusinessCase {
  title: string;
  industry: string;
  solution: string;
  result: string; // 商业效果或变现逻辑
  monetizationTip: string; // 赚钱建议
}

export interface DailyReport {
  date: string;
  lastUpdated: string;
  headline: string;
  summary: string;
  events: AIEvent[];
  tools: AITool[];
  playstyles: AIPlaystyle[];
  businessCases: AIBusinessCase[];
  sources: { title: string; uri: string }[];
}

export interface AppState {
  report: DailyReport | null;
  isLoading: boolean;
  error: string | null;
}
