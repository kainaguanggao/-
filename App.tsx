import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import ToolCard from './components/ToolCard';
import { fetchLatestAITrends } from './geminiService';
import { AppState, DailyReport } from './types';

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
        <div className="relative w-20 h-20 mb-8">
          <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h3 className="text-xl font-bold mb-2 text-white">正在深度调研今日 AI 趋势</h3>
        <p className="text-slate-500 animate-pulse">正在通过全球网络检索最新的玩法与商业案例...</p>
      </div>
    </Layout>
  );

  if (state.error) {
    const isMissingKey = state.error === "MISSING_API_KEY" || state.error.includes("API Key");
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <div className={`w-20 h-20 ${isMissingKey ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'} rounded-3xl flex items-center justify-center mb-8 rotate-3`}>
            {isMissingKey ? (
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            ) : (
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
          </div>
          
          <h3 className="text-2xl font-black mb-4 text-white">
            {isMissingKey ? '需配置 API 密钥' : '数据同步挑战'}
          </h3>
          
          <p className="text-slate-400 mb-10 max-w-md leading-relaxed">
            {isMissingKey 
              ? '请在 Vercel 后台添加环境变量 API_KEY。这是应用访问 Google AI 服务的通行证。' 
              : `错误详情: ${state.error}`}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            {isMissingKey && (
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold transition-all shadow-xl shadow-blue-900/40"
              >
                免费获取 API Key
              </a>
            )}
            <button onClick={loadData} className="px-8 py-4 bg-slate-800 text-slate-300 rounded-2xl font-bold border border-slate-700">
              重试同步
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const { report } = state;

  return (
    <Layout lastUpdated={report?.lastUpdated}>
      {/* 头部摘要 */}
      <section className="mb-12 glass rounded-[2.5rem] p-8 md:p-12 border-l-8 border-l-blue-500 relative overflow-hidden group">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 rounded-full mb-6 border border-blue-500/20">
            <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse"></span>
            <span className="text-blue-400 text-xs font-black uppercase tracking-[0.2em]">{report?.date}</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-8 leading-[1.1] tracking-tight">{report?.headline}</h2>
          <p className="text-slate-400 text-xl md:text-2xl max-w-4xl leading-relaxed font-medium">{report?.summary}</p>
        </div>
      </section>

      {/* 大事件板块 */}
      <section id="events" className="mb-24">
        <h3 className="text-4xl font-black tracking-tight mb-10">全球 AI 大事件</h3>
        <div className="grid grid-cols-1 gap-6">
          {report?.events.map((event, i) => (
            <div key={i} className="glass p-10 rounded-[2rem] hover:bg-slate-800/40 transition-all border border-slate-800/50 group">
              <h4 className="text-2xl font-black text-white mb-4 group-hover:text-blue-400 transition-colors">{event.title}</h4>
              <p className="text-slate-400 text-lg leading-relaxed mb-6">{event.summary}</p>
              <div className="inline-flex items-center gap-3 text-sm text-blue-400 font-bold bg-blue-500/5 px-5 py-3 rounded-xl">
                影响：{event.impact}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 工具卡片板块 */}
      <section id="tools" className="mb-24">
        <h3 className="text-4xl font-black tracking-tight mb-10">热门新工具雷达</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {report?.tools.map((tool, i) => (
            <ToolCard key={i} item={tool} />
          ))}
        </div>
      </section>

      {/* 玩法板块 */}
      <section id="playstyles" className="mb-24">
        <h3 className="text-4xl font-black tracking-tight mb-10">AI 创意玩法指南</h3>
        <div className="grid grid-cols-1 gap-10">
          {report?.playstyles.map((ps, i) => (
            <div key={i} className="glass rounded-[3rem] p-12 border border-slate-800 hover:border-green-500/30 transition-all">
              <h4 className="text-3xl font-black mb-6">{ps.title}</h4>
              <p className="text-slate-400 text-xl leading-relaxed mb-10">{ps.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {ps.tutorialSteps.map((step, idx) => (
                  <div key={idx} className="pl-6 border-l-4 border-slate-800 hover:border-green-500/50 transition-all">
                    <p className="text-slate-100 text-lg font-bold leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 商业案例板块 */}
      <section id="business" className="mb-24">
        <h3 className="text-4xl font-black tracking-tight mb-10">商业成功案例</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {report?.businessCases.map((bc, i) => (
            <div key={i} className="glass rounded-[2.5rem] p-12 border border-slate-800 hover:border-amber-500/40 transition-all group">
              <div className="mb-8">
                 <span className="px-5 py-2 bg-amber-500/10 text-amber-500 text-xs font-black rounded-2xl">{bc.industry}</span>
              </div>
              <h4 className="text-3xl font-black mb-8 text-white leading-tight">{bc.title}</h4>
              <p className="text-slate-300 text-lg leading-relaxed mb-8">{bc.solution}</p>
              <div className="p-6 bg-green-500/5 rounded-3xl border border-green-500/10 mb-8">
                <p className="text-green-400 text-2xl font-black">{bc.result}</p>
              </div>
              <div className="text-base text-slate-400 font-medium">
                <span className="font-black text-amber-500">建议：</span> {bc.monetizationTip}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 数据来源 */}
      <section className="py-16 border-t border-slate-800">
        <h4 className="text-xs font-black text-slate-600 mb-8 tracking-[0.4em] uppercase text-center">Intelligence Sources</h4>
        <div className="flex flex-wrap justify-center gap-4">
          {report?.sources.map((s, i) => (
            <a key={i} href={s.uri} target="_blank" className="text-xs glass px-6 py-3.5 rounded-2xl text-slate-400 hover:text-blue-400 transition-all font-bold">
              {s.title}
            </a>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default App;