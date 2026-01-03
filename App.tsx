import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import ToolCard from './components/ToolCard';
import { fetchLatestAITrends } from './geminiService';
import { AppState } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({ report: null, isLoading: true, error: null });

  const loadData = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const data = await fetchLatestAITrends();
      setState({ report: data, isLoading: false, error: null });
    } catch (err: any) {
      setState({ report: null, isLoading: false, error: err.message });
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  if (state.isLoading) return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="relative w-20 h-20 mb-8 text-blue-500">
          <svg className="animate-spin h-full w-full" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <h3 className="text-xl font-bold mb-2 text-white">正在同步今日全球 AI 情报</h3>
        <p className="text-slate-500 animate-pulse font-medium">通过 Google 搜索实时分析最新玩法...</p>
      </div>
    </Layout>
  );

  if (state.error) {
    const isMissingKey = state.error === "MISSING_API_KEY";
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <div className="w-20 h-20 bg-amber-500/10 text-amber-500 rounded-3xl flex items-center justify-center mb-8">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h3 className="text-2xl font-black mb-4 text-white">
            {isMissingKey ? '需要 API 密钥' : '数据获取失败'}
          </h3>
          <p className="text-slate-400 mb-10 max-w-md leading-relaxed">
            {isMissingKey 
              ? '检测到环境变量中缺少 API_KEY。请在 Vercel 设置中添加并【重新部署】。' 
              : `原因: ${state.error}`}
          </p>
          <button onClick={loadData} className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold shadow-lg shadow-blue-900/20 transition-all">
            重新尝试连接
          </button>
        </div>
      </Layout>
    );
  }

  const { report } = state;

  return (
    <Layout lastUpdated={report?.lastUpdated}>
      {/* 顶部头条 */}
      <section className="mb-12 glass rounded-[2.5rem] p-8 md:p-12 border-l-8 border-l-blue-500 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full -mr-32 -mt-32"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 rounded-full mb-6">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            <span className="text-blue-400 text-xs font-black uppercase tracking-widest">{report?.date}</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tight text-white">{report?.headline}</h2>
          <p className="text-slate-400 text-xl md:text-2xl max-w-4xl leading-relaxed font-medium">{report?.summary}</p>
        </div>
      </section>

      {/* 实时工具展示 */}
      <div className="flex items-center gap-3 mb-8">
        <h3 className="text-2xl font-black text-white">热门新工具雷达</h3>
        <span className="px-2 py-0.5 bg-red-500 text-[10px] font-bold text-white rounded-md animate-pulse">LIVE</span>
      </div>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
        {report?.tools.map((tool, i) => <ToolCard key={i} item={tool} />)}
      </section>

      {/* 核心资讯展示 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <section>
            <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
              <span className="w-8 h-8 bg-indigo-500/20 text-indigo-400 rounded-lg flex items-center justify-center text-lg">🌍</span>
              全球 AI 大事件
            </h3>
            <div className="space-y-4">
              {report?.events.map((event, i) => (
                <div key={i} className="glass p-6 rounded-2xl border border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                  <h4 className="text-lg font-bold text-blue-400 mb-2">{event.title}</h4>
                  <p className="text-slate-300 text-sm mb-4 leading-relaxed">{event.summary}</p>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <span className="w-1 h-1 bg-slate-500 rounded-full"></span>
                    影响力: {event.impact}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
              <span className="w-8 h-8 bg-purple-500/20 text-purple-400 rounded-lg flex items-center justify-center text-lg">💡</span>
              前沿玩法指南
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {report?.playstyles.map((style, i) => (
                <div key={i} className="glass p-8 rounded-3xl border border-slate-800/50">
                  <h4 className="text-xl font-bold text-white mb-4">{style.title}</h4>
                  <p className="text-slate-400 text-sm mb-6 leading-relaxed">{style.description}</p>
                  <div className="space-y-3">
                    {style.tutorialSteps.map((step, si) => (
                      <div key={si} className="flex gap-3 text-sm text-slate-300">
                        <span className="text-purple-500 font-bold">0{si+1}.</span>
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="bg-gradient-to-b from-blue-600/10 to-transparent p-1 rounded-[2rem]">
            <div className="glass p-8 rounded-[2rem] h-full">
              <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3">
                <span className="w-8 h-8 bg-amber-500/20 text-amber-400 rounded-lg flex items-center justify-center text-lg">💰</span>
                变现案例
              </h3>
              <div className="space-y-8">
                {report?.businessCases.map((bc, i) => (
                  <div key={i} className="relative pl-6 border-l-2 border-slate-700">
                    <div className="absolute -left-[5px] top-0 w-2 h-2 bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
                    <h4 className="font-bold text-white mb-2">{bc.title}</h4>
                    <p className="text-xs text-slate-500 mb-3 italic">{bc.industry}</p>
                    <div className="p-3 bg-slate-900/50 rounded-lg text-xs text-amber-200 leading-relaxed border border-amber-500/10">
                      盈利点：{bc.monetizationTip}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="glass p-6 rounded-2xl">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">今日数据源</h4>
            <div className="flex flex-wrap gap-2">
              {report?.sources.map((source, i) => (
                <a key={i} href={source.uri} target="_blank" rel="noopener" className="px-3 py-1 bg-slate-800/50 hover:bg-blue-500/20 rounded-full text-[10px] text-slate-400 hover:text-blue-400 transition-all border border-slate-700">
                  {source.title}
                </a>
              ))}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default App;