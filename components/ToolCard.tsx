
import React, { useState } from 'react';
import { AITool } from '../types';

interface ToolCardProps {
  item: AITool;
}

const ToolCard: React.FC<ToolCardProps> = ({ item }) => {
  const [showDetail, setShowDetail] = useState(false);

  // 根据分类返回对应的色彩样式
  const getCategoryColor = (category: string) => {
    if (category.includes('语言') || category.includes('LLM')) return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    if (category.includes('绘画') || category.includes('图像')) return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    if (category.includes('视频')) return 'bg-red-500/20 text-red-400 border-red-500/30';
    if (category.includes('音频') || category.includes('音乐')) return 'bg-green-500/20 text-green-400 border-green-500/30';
    return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  };

  return (
    <>
      <div className="glass rounded-2xl p-6 flex flex-col h-full hover:border-blue-500/50 transition-all duration-300 group">
        <div className="flex justify-between items-start mb-4">
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getCategoryColor(item.category)}`}>
            {item.category}
          </span>
        </div>

        <h3 className="text-xl font-bold text-slate-100 mb-2 group-hover:text-blue-400 transition-colors">
          {item.name}
        </h3>
        
        <p className="text-slate-400 text-sm mb-6 line-clamp-3">
          {item.description}
        </p>

        <div className="mt-auto space-y-3">
          <button 
            onClick={() => setShowDetail(true)}
            className="w-full py-2.5 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 text-slate-200 text-sm font-medium rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            查看亮点与详情
          </button>
          
          <a 
            href={item.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
          >
            去体验
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>

      {/* 详情详情模态框 */}
      {showDetail && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowDetail(false)}></div>
          <div className="relative glass w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl border border-slate-700 animate-in zoom-in-95 duration-300">
            <div className="sticky top-0 glass border-b border-slate-800 p-6 flex justify-between items-center z-10">
              <div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getCategoryColor(item.category)} mb-2 inline-block`}>
                  {item.category}
                </span>
                <h2 className="text-2xl font-bold text-white">{item.name} 深度解析</h2>
              </div>
              <button 
                onClick={() => setShowDetail(false)}
                className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-8 space-y-8">
              {/* 核心亮点板块 */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <span className="p-1.5 bg-purple-500/20 rounded-lg text-purple-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </span>
                  <h4 className="text-lg font-bold text-slate-100">核心亮点</h4>
                </div>
                <div className="bg-slate-800/30 border border-slate-700/50 p-5 rounded-2xl italic text-slate-300 leading-relaxed">
                  {item.highlight}
                </div>
              </section>

              {/* 简介板块 */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <span className="p-1.5 bg-blue-500/20 rounded-lg text-blue-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                  </span>
                  <h4 className="text-lg font-bold text-slate-100">工具简介</h4>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {item.description}
                </p>
              </section>
              
              <div className="pt-4">
                 <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-900/40"
                >
                  前往官网立即体验
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ToolCard;
