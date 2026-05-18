import React, { memo } from 'react';

interface ToolbarProps {
  zoomInputValue: string;
  setZoomInputValue: (val: string) => void;
  zoomIn: (step: number) => void;
  zoomOut: (step: number) => void;
  resetTransform: () => void;
  setRotation: React.Dispatch<React.SetStateAction<number>>;
  bgTheme: 'dark' | 'light';
  setBgTheme: React.Dispatch<React.SetStateAction<'dark' | 'light'>>;
  isPixelated: boolean;
  setIsPixelated: React.Dispatch<React.SetStateAction<boolean>>;
  handleZoomInputSubmit: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  zoomInputValue, setZoomInputValue, zoomIn, zoomOut, resetTransform, 
  setRotation, bgTheme, setBgTheme, isPixelated, setIsPixelated, handleZoomInputSubmit
}) => {
  return (
    <div className="absolute bottom-6 md:bottom-8 left-4 md:left-8 z-[60] flex items-center bg-[#1e1e1e]/95 backdrop-blur-lg border border-[#333] rounded-xl shadow-2xl p-1 gap-1">
      <div className="flex items-center bg-[#111] rounded-lg border border-[#222]">
        <button 
          onClick={() => zoomOut(0.2)} 
          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-l-lg transition-colors" 
          title="Zoom Out"
          aria-label="Zoom Out"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 12H4"></path></svg>
        </button>
        <input 
          type="text" 
          value={zoomInputValue} 
          onChange={(e) => setZoomInputValue(e.target.value)} 
          onBlur={handleZoomInputSubmit} 
          onKeyDown={(e) => e.key === 'Enter' && handleZoomInputSubmit()} 
          className="w-10 bg-transparent text-center text-xs text-white font-mono outline-none" 
          aria-label="Zoom percentage"
        />
        <span className="text-[10px] text-gray-500 pr-1 -ml-1 pointer-events-none" aria-hidden="true">%</span>
        <button 
          onClick={() => zoomIn(0.2)} 
          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-r-lg transition-colors" 
          title="Zoom In"
          aria-label="Zoom In"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
        </button>
      </div>

      <div className="w-px h-6 bg-[#333] mx-1"></div>

      <button 
        onClick={() => { resetTransform(); setZoomInputValue('100'); }} 
        className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors" 
        title="Reset Zoom to 1:1"
        aria-label="Reset Zoom to 1:1"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>
      </button>
      <button 
        onClick={() => setRotation((r) => (r + 90) % 360)} 
        className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors" 
        title="Rotate 90 degrees"
        aria-label="Rotate 90 degrees"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
      </button>
      <button 
        onClick={() => setBgTheme((t) => t === 'dark' ? 'light' : 'dark')} 
        className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors ${bgTheme === 'light' ? 'text-blue-400 bg-blue-500/10' : 'text-gray-400 hover:text-white hover:bg-white/10'}`} 
        title="Toggle Background Theme"
        aria-label={`Switch to ${bgTheme === 'dark' ? 'light' : 'dark'} background`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
      </button>
      <button 
        onClick={() => setIsPixelated((p) => !p)} 
        className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors ${isPixelated ? 'text-blue-400 bg-blue-500/10' : 'text-gray-400 hover:text-white hover:bg-white/10'}`} 
        title="Toggle Pixelated/Smooth Rendering"
        aria-label={`Switch to ${isPixelated ? 'smooth' : 'pixelated'} rendering`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
      </button>
    </div>
  );
};

export default memo(Toolbar);