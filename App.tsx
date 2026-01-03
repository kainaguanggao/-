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
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse"></div>
          <svg className="animate-spin h-full w-full text-blue-500 relative z-10" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <h3 className="text-2xl font-black mb-3 text-white">正在解析全球 AI 脉动</h3>
        <p className="text-slate-500 animate-pulse text-lg">正在通过 Google 搜索获取今日最新玩法...</p>
      </div>
    </Layout>
  );

  if (state.error) {
    const isMissingKey = state.error === "MISSING_API_KEY";
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <div className="w-20 h-20 bg-amber-500/10 text-amber-500 rounded-3xl flex items-center justify-center mb-8 border border-amber-500/20">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h3 className="text-3xl font-black mb-4 text-white">
            {isMissingKey ? '需配置 API_KEY' : '同步遇到阻碍'}
          </h3>
          <div className="bg-slate-900/50 p-6 rounded-2xl mb-10 max-w-lg border border-slate-800">
            <p className="text-slate-400 text-lg leading-relaxed">
              {isMissingKey 
                ? '请在 Vercel 环境变量中添加 API_KEY（英文大写）。注意：如果之前填的是中文“API密钥”，请改回英文名并【重新部署】。' 
                : `错误详情: ${state.error}`}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={loadData} className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-900/20 transition-all active:scale-95">
              重试连接
            </button>
            <a href="https://ai.google.dev/" target="_blank" className="px-10 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold text-lg transition-all text-center">
              获取 Key
            </a>
          </div>
        </div>
      </Layout>
    );
  }

  const { report } = state;

  return (
    <Layout lastUpdated={report?.lastUpdated}>
      <section className="mb-12 glass rounded-[3rem] p-10 md:p-16 border-l-[12px] border-l-blue-600 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full -mr-48 -mt-48"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-3 px-5 py-2 bg-blue-500/10 rounded-full mb-8 border border-blue-500/20">
            <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-ping"></span>
            <span className="text-blue-400 text-sm font-black tracking-widest uppercase">{report?.date}</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black mb-10 leading-[1.1] tracking-tight text-white">{report?.headline}</h2>
          <p className="text-slate-400 text-2xl md:text-3xl max-w-5xl leading-relaxed font-medium">{report?.summary}</p>
        </div>
      </section>

      <div className="flex items-center justify-between mb-8 px-2">
        <h3 className="text-3xl font-black text-white flex items-center gap-4">
          热门新工具雷达
          <span className="px-2.5 py-1 bg-red-600 text-[10px] font-black text-white rounded-lg animate-pulse tracking-tighter">LIVE FEED</span>
        </h3>
      </div>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
        {report?.tools.map((tool, i) => <ToolCard key={i} item={tool} />)}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-16">
          <section>
            <h3 className="text-3xl font-black text-white mb-10 flex items-center gap-4">
              <span className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center text-2xl shadow-inner">🌍</span>
              全球 AI 大事件
            </h3>
            <div className="space-y-6">
              {report?.events.map((event, i) => (
                <div key={i} className="glass p-8 rounded-[2rem] border border-slate-800/40 hover:border-blue-500/30 transition-all hover:translate-x-2">
                  <h4 className="text-2xl font-bold text-blue-400 mb-4">{event.title}</h4>
                  <p className="text-slate-300 text-lg mb-6 leading-relaxed">{event.summary}</p>
                  <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-slate-900/50 rounded-full border border-slate-800">
                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">影响力指数:</span>
                    <span className="text-[11px] font-bold text-slate-300">{event.impact}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-3xl font-black text-white mb-10 flex items-center gap-4">
              <span className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-2xl flex items-center justify-center text-2xl shadow-inner">💡</span>
              前沿玩法指南
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {report?.playstyles.map((style, i) => (
                <div key={i} className="glass p-10 rounded-[2.5rem] border border-slate-800/40 relative group">
                  <div className="absolute top-6 right-8 text-6xl font-black text-white/5 group-hover:text-purple-500/10 transition-colors">0{i+1}</div>
                  <h4 className="text-2xl font-bold text-white mb-6 pr-12">{style.title}</h4>
                  <p className="text-slate-400 text-base mb-8 leading-relaxed italic">{style.description}</p>
                  <div className="space-y-5">
                    {style.tutorialSteps.map((step, si) => (
                      <div key={si} className="flex gap-4 text-slate-300 items-start">
                        <div className="w-6 h-6 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-[10px] font-bold text-purple-400">{si+1}</span>
                        </div>
                        <p className="text-sm font-medium leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-10">
          <section className="bg-gradient-to-b from-amber-500/20 to-transparent p-1 rounded-[3rem]">
            <div className="glass p-10 rounded-[3rem] h-full">
              <h3 className="text-2xl font-black text-white mb-10 flex items-center gap-4">
                <span className="w-10 h-10 bg-amber-500/20 text-amber-500 rounded-xl flex items-center justify-center text-xl">💰</span>
                商业变现观察
              </h3>
              <div className="space-y-10">
                {report?.businessCases.map((bc, i) => (
                  <div key={i} className="relative pl-8 border-l-2 border-slate-800">
                    <div className="absolute -left-[5px] top-0 w-2 h-2 bg-amber-500 rounded-full"></div>
                    <h4 className="text-xl font-bold text-white mb-3">{bc.title}</h4>
                    <p className="text-sm text-slate-500 mb-5 font-bold tracking-tight">{bc.industry} · 落地案例</p>
                    <div className="p-5 bg-amber-500/5 rounded-2xl text-sm text-amber-200/80 leading-relaxed border border-amber-500/10 shadow-inner">
                      <span className="block font-black text-[10px] uppercase text-amber-500 mb-2 tracking-widest">变现核心策略</span>
                      {bc.monetizationTip}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="glass p-8 rounded-[2rem]">
            <h4 className="text-[11px] font-black text-slate-600 uppercase tracking-[0.2em] mb-6">实时情报源</h4>
            <div className="flex flex-wrap gap-3">
              {report?.sources.map((source, i) => (
                <a key={i} href={source.uri} target="_blank" rel="noopener" className="px-4 py-2 bg-slate-900/50 hover:bg-blue-600/10 rounded-xl text-xs text-slate-400 hover:text-blue-400 transition-all border border-slate-800 hover:border-blue-500/30">
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