
import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import ToolCard from './components/ToolCard';
import { fetchLatestAITrends } from './services/geminiService';
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

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  if (state.isLoading) return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="relative w-20 h-20 mb-8">
          <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h3 className="text-xl font-bold mb-2 text-white">正在深度调研今日 AI 趋势</h3>
        <p className="text-slate-500 animate-pulse">正在通过全球网络检索最新的玩法与商业案例...</p>
        <div className="mt-8 text-xs text-slate-600">首次同步约需 15-30 秒，请稍候</div>
      </div>
    </Layout>
  );

  if (state.error) return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-6">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold mb-2 text-white">数据同步未成功</h3>
        <p className="text-slate-400 mb-8 max-w-md">可能是网络波动或 API 密钥未配置正确。错误信息：{state.error}</p>
        <div className="flex gap-4">
          <button onClick={loadData} className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-900/40">
            重新同步
          </button>
          <button onClick={() => window.location.reload()} className="px-8 py-3 bg-slate-800 text-slate-300 rounded-xl font-bold border border-slate-700">
            刷新页面
          </button>
        </div>
      </div>
    </Layout>
  );

  const { report } = state;

  return (
    <Layout lastUpdated={report?.lastUpdated}>
      {/* 头部摘要 */}
      <section className="mb-12 glass rounded-3xl p-10 border-l-4 border-l-blue-500 relative overflow-hidden group">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 rounded-full mb-4">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            <span className="text-blue-400 text-xs font-bold uppercase tracking-widest">{report?.date}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">{report?.headline}</h2>
          <p className="text-slate-400 text-xl max-w-4xl leading-relaxed">{report?.summary}</p>
        </div>
      </section>

      {/* 快速导航 */}
      <nav className="flex overflow-x-auto pb-4 mb-12 gap-3 no-scrollbar sticky top-20 z-40 bg-[#020617]/80 backdrop-blur-xl p-2 rounded-2xl border border-slate-800/50">
        {[
          { id: 'events', label: '大事件', color: 'bg-blue-500' },
          { id: 'tools', label: '新工具', color: 'bg-purple-500' },
          { id: 'playstyles', label: '玩法指南', color: 'bg-green-500' },
          { id: 'business', label: '商业案例', color: 'bg-amber-500' }
        ].map(nav => (
          <button 
            key={nav.id} 
            onClick={() => scrollToSection(nav.id)}
            className="flex items-center gap-2 whitespace-nowrap px-6 py-3 rounded-xl glass text-sm font-bold hover:bg-slate-800 transition-all border border-slate-800"
          >
            <span className={`w-2 h-2 rounded-full ${nav.color}`}></span>
            {nav.label}
          </button>
        ))}
      </nav>

      {/* 板块一：大事件 */}
      <section id="events" className="mb-20">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-3xl font-bold flex items-center gap-3">
            <span className="w-2 h-10 bg-blue-500 rounded-full"></span> 全球 AI 大事件
          </h3>
          <span className="text-slate-500 text-sm font-medium">{report?.events.length} 条情报</span>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {report?.events.map((event, i) => (
            <div key={i} className="glass p-8 rounded-3xl hover:bg-slate-800/40 transition-all border border-slate-800 group">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 font-black text-xl">
                  0{i + 1}
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">{event.title}</h4>
                  <p className="text-slate-400 text-base leading-relaxed mb-4">{event.summary}</p>
                  <div className="inline-flex items-center gap-2 text-sm text-blue-400/80 bg-blue-500/5 px-4 py-2 rounded-lg border border-blue-500/10">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                    <strong>影响分析：</strong> {event.impact}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 板块二：新工具雷达 */}
      <section id="tools" className="mb-20">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-3xl font-bold flex items-center gap-3">
            <span className="w-2 h-10 bg-purple-500 rounded-full"></span> 热门新工具雷达
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {report?.tools.map((tool, i) => (
            <ToolCard key={i} item={tool} />
          ))}
        </div>
      </section>

      {/* 板块三：前沿玩法指南 */}
      <section id="playstyles" className="mb-20">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-3xl font-bold flex items-center gap-3">
            <span className="w-2 h-10 bg-green-500 rounded-full"></span> AI 创意玩法指南
          </h3>
          <span className="text-green-500/80 text-sm font-bold bg-green-500/10 px-3 py-1 rounded-full uppercase tracking-widest">Hot Playbook</span>
        </div>
        <div className="grid grid-cols-1 gap-8">
          {report?.playstyles.map((ps, i) => (
            <div key={i} className="glass rounded-[2.5rem] overflow-hidden border border-slate-800 hover:border-green-500/30 transition-all">
              <div className="grid grid-cols-1 lg:grid-cols-5">
                <div className="lg:col-span-2 p-10 border-b lg:border-b-0 lg:border-r border-slate-800 bg-gradient-to-br from-transparent to-green-500/5">
                  <div className="mb-6">
                    <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-2xl flex items-center justify-center mb-6">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>
                    </div>
                    <h4 className="text-3xl font-bold mb-4">{ps.title}</h4>
                    <p className="text-slate-400 text-lg leading-relaxed mb-8">{ps.description}</p>
                  </div>
                  <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-inner">
                    <div className="text-xs text-green-400 font-bold mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                      社区实操案例
                    </div>
                    <div className="text-base text-slate-300 italic leading-relaxed">“{ps.communityCase}”</div>
                  </div>
                </div>
                <div className="lg:col-span-3 p-10 bg-slate-900/30">
                  <h5 className="text-xs font-bold text-slate-500 uppercase mb-8 tracking-[0.2em]">Step-by-Step Tutorial</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                    {ps.tutorialSteps.map((step, idx) => (
                      <div key={idx} className="relative group">
                        <div className="absolute -left-6 top-0 text-4xl font-black text-slate-800 group-hover:text-green-500/20 transition-colors">0{idx + 1}</div>
                        <div className="relative z-10 pl-4 border-l-2 border-slate-800 group-hover:border-green-500/50 transition-all">
                          <p className="text-slate-200 font-medium leading-relaxed">{step}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 板块四：商业赋能案例 */}
      <section id="business" className="mb-20">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-3xl font-bold flex items-center gap-3">
            <span className="w-2 h-10 bg-amber-500 rounded-full"></span> 商业成功案例
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {report?.businessCases.map((bc, i) => (
            <div key={i} className="relative glass rounded-[2rem] p-10 border border-slate-800 hover:border-amber-500/40 transition-all group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-all transform group-hover:scale-110 group-hover:-rotate-12">
                <svg className="w-32 h-32 text-amber-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.82v-1.91c-1.84-.25-3.28-1.23-3.28-3.05h2.16c0 .71.56 1.28 1.12 1.28.69 0 1.12-.41 1.12-.91 0-.66-.47-.94-1.78-1.56-1.31-.62-2.31-1.34-2.31-2.94 0-1.38 1.12-2.47 2.81-2.75V6h2.82v1.91c1.25.17 2.56.84 2.88 2.34h-2.09c-.22-.62-.69-.78-1.09-.78-.66 0-1.12.31-1.12.84 0 .5.31.78 1.59 1.38 1.47.66 2.5 1.38 2.5 3.13 0 1.53-1.03 2.56-2.81 2.77z"/></svg>
              </div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-6">
                   <span className="px-4 py-1.5 bg-amber-500/10 text-amber-500 text-xs font-bold rounded-xl border border-amber-500/20">{bc.industry}</span>
                </div>
                <h4 className="text-2xl font-bold mb-6 text-white leading-tight">{bc.title}</h4>
                
                <div className="space-y-6 mb-8 flex-grow">
                  <div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">落地场景 & 方案</div>
                    <p className="text-slate-300 text-sm leading-relaxed">{bc.solution}</p>
                  </div>
                  <div className="p-4 bg-green-500/5 rounded-2xl border border-green-500/10">
                    <div className="text-[10px] font-bold text-green-500 uppercase tracking-widest mb-1">商业成果 / ROI</div>
                    <p className="text-green-400 text-lg font-bold">{bc.result}</p>
                  </div>
                </div>

                <div className="mt-auto pt-6 border-t border-slate-800">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1 w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    </div>
                    <div className="text-sm text-slate-400">
                      <span className="font-bold text-amber-500/80">变现避坑：</span> {bc.monetizationTip}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 来源 */}
      <section className="py-12 border-t border-slate-800">
        <h4 className="text-xs font-bold text-slate-500 mb-6 tracking-[0.3em] uppercase">Intelligence Sources</h4>
        <div className="flex flex-wrap gap-3">
          {report?.sources.map((s, i) => (
            <a key={i} href={s.uri} target="_blank" className="text-xs glass px-5 py-2.5 rounded-xl hover:text-blue-400 hover:border-blue-500/30 transition-all flex items-center gap-2">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              {s.title}
            </a>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default App;
