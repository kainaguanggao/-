
import React, { useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
  lastUpdated?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, lastUpdated }) => {
  const [showGuide, setShowGuide] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#020617]">
      <header className="sticky top-0 z-50 glass border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text leading-tight">AI 每日脉动</h1>
              <p className="text-[10px] text-slate-500 font-medium tracking-widest uppercase">Global AI Intelligence</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowGuide(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              使用指南
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="p-2 bg-slate-800/50 hover:bg-slate-700 rounded-lg text-slate-400 transition-colors border border-slate-700"
              title="刷新数据"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* 使用指南弹窗 */}
      {showGuide && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setShowGuide(false)}></div>
          <div className="relative glass max-w-lg w-full rounded-3xl p-8 border border-slate-700 shadow-2xl">
            <h3 className="text-2xl font-bold mb-6 text-blue-400">如何每天使用？</h3>
            <ul className="space-y-4 text-slate-300">
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                <p><strong>自动更新：</strong> 每天打开此网页，AI 都会自动去全球搜索最新的玩法和案例，无需你操作。</p>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                <p><strong>保存到手机：</strong> 点击浏览器“分享”按钮，选择“添加到主屏幕”，就像 App 一样方便。</p>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                <p><strong>寻找灵感：</strong> 重点看“玩法指南”和“商业案例”，它们能直接告诉你怎么用 AI 赚钱。</p>
              </li>
            </ul>
            <button 
              onClick={() => setShowGuide(false)}
              className="w-full mt-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all"
            >
              我知道了
            </button>
          </div>
        </div>
      )}

      <footer className="glass mt-20 py-12 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="text-left">
              <h3 className="text-lg font-bold text-slate-200 mb-2">AI 每日脉动决策系统</h3>
              <p className="text-slate-500 text-sm max-w-md">
                实时分析全球 AI 趋势，为普通人提供可落地的变现方案。
              </p>
            </div>
            <div className="text-left md:text-right">
              <p className="text-slate-400 text-sm mb-2">由 Gemini 3.0 Pro 提供智能驱动</p>
              <div className="flex justify-start md:justify-end gap-4 text-xs text-slate-600">
                <span>每天 09:00 自动更新</span>
                <span>•</span>
                <span>智能避坑指南</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
