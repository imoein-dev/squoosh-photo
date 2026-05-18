import React, { memo } from 'react';

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  resizeEnabled: boolean;
  setResizeEnabled: (val: boolean) => void;
  resizeMethod: string;
  setResizeMethod: (val: string) => void;
  maintainAspect: boolean;
  setMaintainAspect: (val: boolean) => void;
  width: number | '';
  height: number | '';
  handleWidthChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleHeightChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  format: string;
  setFormat: (val: string) => void;
  quality: number;
  setQuality: (val: number) => void;
  autoOptimize: boolean;
  setAutoOptimize: (val: boolean) => void;
  onOptimizeNow: () => void;
  optPercent: number;
  sizes: { original: number; compressed: number };
  isProcessing: boolean;
  compressedUrl: string | null;
  originalUrl?: string | null;
}

const Sidebar: React.FC<SidebarProps> = ({
  isSidebarOpen, setIsSidebarOpen, resizeEnabled, setResizeEnabled, resizeMethod, setResizeMethod,
  maintainAspect, setMaintainAspect, width, height, handleWidthChange, handleHeightChange,
  format, setFormat, quality, setQuality, autoOptimize, setAutoOptimize, onOptimizeNow, optPercent, sizes, isProcessing, compressedUrl, originalUrl
}) => {
  return (
    <aside className={`absolute z-[70] bg-[#0a0a0a]/80 backdrop-blur-xl border-white/5 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] flex flex-col transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden left-0 right-0 bottom-0 w-full max-h-[85dvh] rounded-t-[2.5rem] border-t-2 ${isSidebarOpen ? 'translate-y-0 opacity-100' : 'translate-y-[100%] opacity-0'} md:left-auto md:right-5 md:top-5 md:bottom-5 md:w-[360px] md:max-h-none md:rounded-[2rem] md:border-2 ${isSidebarOpen ? 'md:translate-x-0 md:translate-y-0' : 'md:translate-x-[120%] md:translate-y-0'}`}>
      
      <div className="w-full flex justify-center pt-4 pb-2 md:hidden cursor-pointer" onClick={() => setIsSidebarOpen(false)}>
        <div className="w-14 h-1.5 bg-white/20 hover:bg-white/40 transition-colors rounded-full"></div>
      </div>

      <div className="flex justify-between items-center px-6 pb-4 pt-3 md:pt-6 border-b border-white/10 bg-white/[0.02]">
        <h3 className="font-semibold text-white/90 text-lg tracking-wide">Inspector</h3>
        <button 
          onClick={() => setIsSidebarOpen(false)} 
          className="p-2.5 bg-white/5 hover:bg-white/15 rounded-full text-white/70 hover:text-white transition-all shadow-sm active:scale-90"
          aria-label="Close Sidebar"
          title="Close Sidebar"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6 custom-scrollbar pb-8">
        
        <div className="bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors rounded-3xl p-5 shadow-inner">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-white/80 tracking-wide">Resize Image</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={resizeEnabled} 
                onChange={(e) => setResizeEnabled(e.target.checked)} 
                className="sr-only peer" 
                aria-label="Enable Resizing"
              />
              <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-cyan-400 peer-checked:shadow-[0_0_10px_rgba(56,189,248,0.4)]"></div>
            </label>
          </div>
          
          <div className={`grid transition-all duration-300 ease-in-out ${resizeEnabled ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'}`}>
            <div className="overflow-hidden space-y-4">
              <div className="flex justify-between items-center pt-2">
                <span className="text-xs text-white/50 uppercase tracking-widest">Method</span>
                <select 
                  value={resizeMethod} 
                  onChange={(e) => setResizeMethod(e.target.value)} 
                  className="w-36 bg-black/40 text-xs p-2.5 rounded-xl border border-white/10 text-white/90 outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition-all cursor-pointer appearance-none text-center"
                  aria-label="Resizing Method"
                >
                  <option>Lanczos3</option>
                  <option>Browser High</option>
                </select>
              </div>
              <div className="flex justify-between items-center gap-3">
                <div className="flex-1 bg-black/40 border border-white/10 rounded-2xl p-2.5 flex items-center focus-within:border-cyan-400/50 focus-within:ring-1 focus-within:ring-cyan-400/50 transition-all">
                  <span className="text-[10px] text-white/40 mr-2 font-bold uppercase tracking-wider" aria-hidden="true">W</span>
                  <input 
                    type="number" 
                    value={width} 
                    onChange={handleWidthChange} 
                    className="w-full bg-transparent text-sm text-white outline-none font-mono placeholder-white/20" 
                    placeholder="Auto" 
                    aria-label="Width in pixels"
                  />
                </div>
                <div className="flex-1 bg-black/40 border border-white/10 rounded-2xl p-2.5 flex items-center focus-within:border-cyan-400/50 focus-within:ring-1 focus-within:ring-cyan-400/50 transition-all">
                  <span className="text-[10px] text-white/40 mr-2 font-bold uppercase tracking-wider" aria-hidden="true">H</span>
                  <input 
                    type="number" 
                    value={height} 
                    onChange={handleHeightChange} 
                    className="w-full bg-transparent text-sm text-white outline-none font-mono placeholder-white/20" 
                    placeholder="Auto" 
                    aria-label="Height in pixels"
                  />
                </div>
              </div>
              <label className="flex items-center gap-3 cursor-pointer pt-1 group">
                <div className="relative flex items-center justify-center">
                  <input 
                    type="checkbox" 
                    checked={maintainAspect} 
                    onChange={(e) => setMaintainAspect(e.target.checked)} 
                    className="peer appearance-none w-4 h-4 border border-white/20 rounded bg-black/20 checked:bg-cyan-500 checked:border-cyan-500 transition-all cursor-pointer" 
                    aria-label="Maintain aspect ratio"
                  />
                  <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <span className="text-xs text-white/50 group-hover:text-white/80 transition-colors">Maintain proportions</span>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors rounded-3xl p-5 shadow-inner">
          <div className="flex items-center justify-between mb-5">
            <span className="text-sm font-medium text-white/80 tracking-wide">Export Settings</span>
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input 
                  type="checkbox" 
                  checked={autoOptimize} 
                  onChange={(e) => setAutoOptimize(e.target.checked)} 
                  className="peer appearance-none w-4 h-4 border border-white/20 rounded bg-black/20 checked:bg-emerald-500 checked:border-emerald-500 transition-all cursor-pointer" 
                  aria-label="Auto-run optimization"
                />
                <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <span className="text-[11px] text-white/50 uppercase tracking-widest group-hover:text-white/80 transition-colors">Auto-Run</span>
            </label>
          </div>
          
          <div className="flex bg-black/40 p-1.5 rounded-2xl mb-6 border border-white/5 relative" role="group" aria-label="Export Format">
            {['webp', 'jpeg', 'png'].map((f) => {
              const isSelected = format === `image/${f}`;
              return (
                <button 
                  key={f} 
                  onClick={() => setFormat(`image/${f}`)} 
                  className={`flex-1 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 z-10 ${isSelected ? 'bg-white text-black shadow-[0_2px_10px_rgba(255,255,255,0.2)] scale-[1.02]' : 'text-white/50 hover:text-white/90'}`}
                  aria-pressed={isSelected ? "true" : "false"}
                  aria-label={`Select ${f.toUpperCase()} format`}
                  title={`Select ${f.toUpperCase()} format`}
                >
                  {f}
                </button>
              );
            })}
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-xs items-end">
              <span className="text-white/50 uppercase tracking-widest text-[10px]">Quality</span>
              <span className="text-cyan-400 font-mono font-bold text-sm bg-cyan-400/10 px-2 py-0.5 rounded-md border border-cyan-400/20">{quality}%</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="100" 
              value={quality} 
              onChange={(e) => setQuality(parseInt(e.target.value) || 75)} 
              className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-cyan-400 hover:accent-cyan-300 transition-all" 
              aria-label="Optimization Quality"
            />
          </div>

          <div className={`grid transition-all duration-300 ease-in-out ${!autoOptimize ? 'grid-rows-[1fr] opacity-100 mt-6' : 'grid-rows-[0fr] opacity-0 pointer-events-none mt-0'}`}>
            <div className="overflow-hidden">
              <button 
                onClick={onOptimizeNow} 
                className={`w-full py-3.5 rounded-2xl font-bold text-sm tracking-wide bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-white shadow-[0_4px_15px_rgba(16,185,129,0.25)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${isProcessing ? 'opacity-70 pointer-events-none grayscale-[30%]' : ''}`}
                aria-busy={isProcessing ? "true" : "false"}
                title="Optimize the image now"
              >
                {isProcessing ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true"></div> Processing...</>
                ) : 'Optimize Now'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 border-t border-white/10 bg-black/40">
        <div className="flex justify-between items-end mb-5" dir="ltr">
          <div className="flex flex-col items-start">
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1">
              COMPRESSION
            </span>
            <span className="text-4xl font-black text-white tracking-tighter drop-shadow-md">
              {isProcessing ? (
                <span className="animate-pulse text-white/50">...</span>
              ) : (
                `${optPercent}%`
              )}
            </span>
          </div>
          
          <div className="flex flex-col items-end gap-1.5">
            {sizes.compressed > 0 ? (
              <div className="flex flex-col items-end animate-in fade-in slide-in-from-right-2 gap-1.5">
                <span className="text-[11px] font-mono text-white/50 tracking-wider">
                  ORIG: {(sizes.original / 1024).toFixed(1)} KB
                </span>
                <span className="text-sm font-mono font-bold text-white bg-white/10 px-2.5 py-1 rounded-lg border border-white/20 shadow-sm">
                  NEW: {(sizes.compressed / 1024).toFixed(1)} KB
                </span>
              </div>
            ) : (
              <span className="text-sm font-mono font-bold text-gray-400 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                {(sizes.original / 1024).toFixed(1)} KB
              </span>
            )}
          </div>
        </div>
        
        {compressedUrl ? (
          <a href={compressedUrl} download={`squoosh.${format.split('/')[1]}`} className={`flex items-center justify-center w-full py-4 rounded-2xl font-bold text-sm tracking-wide transition-all ${isProcessing ? 'bg-white/5 text-white/30 cursor-not-allowed pointer-events-none border border-white/5' : 'bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-white shadow-[0_4px_20px_rgba(37,99,235,0.3)] hover:shadow-[0_8px_25px_rgba(37,99,235,0.45)] active:scale-[0.98] border border-blue-400/20'}`}>
            {isProcessing ? 'PLEASE WAIT...' : 'DOWNLOAD FILE'}
          </a>
        ) : (
          <a href={originalUrl || '#'} download={`original-image`} className={`flex items-center justify-center w-full py-4 rounded-2xl font-bold text-sm tracking-wide transition-all ${isProcessing ? 'bg-white/5 text-white/30 cursor-not-allowed pointer-events-none' : 'bg-white/10 hover:bg-white/15 text-white/90 border border-white/10 hover:border-white/20 active:scale-[0.98]'}`}>
            DOWNLOAD ORIGINAL
          </a>
        )}
      </div>
    </aside>
  );
};

export default memo(Sidebar);