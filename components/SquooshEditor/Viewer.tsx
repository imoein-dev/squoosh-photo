"use client";

import React, { memo, useState } from 'react';
import { ReactCompareSlider } from 'react-compare-slider';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import Toolbar from './Toolbar';

interface ViewerProps {
  originalUrl: string;
  displayUrl: string | null; 
  compressedUrl: string | null;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  rotation: number;
  setRotation: React.Dispatch<React.SetStateAction<number>>;
  bgTheme: 'dark' | 'light';
  setBgTheme: React.Dispatch<React.SetStateAction<'dark' | 'light'>>;
  isPixelated: boolean;
  setIsPixelated: React.Dispatch<React.SetStateAction<boolean>>;
  zoomInputValue: string;
  setZoomInputValue: (val: string) => void;
  onCloseImage: () => void;
  onNewFileDrop: (file: File) => void;
  originalDim: { w: number, h: number };
}

const Viewer: React.FC<ViewerProps> = ({
  originalUrl, displayUrl, compressedUrl, isSidebarOpen, setIsSidebarOpen,
  rotation, setRotation, bgTheme, setBgTheme, isPixelated, setIsPixelated, zoomInputValue, setZoomInputValue,
  onCloseImage, onNewFileDrop, originalDim
}) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const isVertical = (rotation / 90) % 2 !== 0;

  // Dimensions relative to the screen (after rotation)
  const displayW = isVertical ? originalDim.h : originalDim.w;
  const displayH = isVertical ? originalDim.w : originalDim.h;

  const imageStyle: React.CSSProperties = {
    imageRendering: isPixelated ? 'pixelated' : 'auto',
    display: 'block',
    width: 'auto',
    height: 'auto',
    maxWidth: isVertical ? '80vh' : '85vw',
    maxHeight: isVertical ? '85vw' : '80vh',
    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
    userSelect: 'none',
    WebkitUserSelect: 'none'
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onNewFileDrop(file); 
    }
  };

  const renderUrl = displayUrl || originalUrl;

  return (
    <div 
      className="w-full h-full relative flex items-center justify-center overflow-hidden"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      
      <div className={`absolute inset-0 z-[100] bg-blue-500/10 backdrop-blur-md flex flex-col items-center justify-center transition-all duration-300 border-4 border-blue-500/50 m-4 rounded-[2rem] pointer-events-none ${isDraggingOver ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}>
        <div className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 animate-bounce shadow-[0_0_30px_rgba(59,130,246,0.3)]">
          <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-wide drop-shadow-md">Drop new image here</h2>
        <p className="text-blue-200/70 mt-2 font-medium">Settings will be preserved</p>
      </div>

      {compressedUrl && (
        <div className="absolute top-4 md:top-6 left-1/2 -translate-x-1/2 z-[60] pointer-events-none transition-opacity duration-300" dir="ltr">
          <div className="bg-black/60 backdrop-blur-lg border border-white/10 px-4 md:px-6 py-2 rounded-full shadow-2xl flex items-center gap-3 md:gap-5">
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">BEFORE</span>
            <div className="flex items-center gap-1 md:gap-2 opacity-80">
              <svg className="w-3 h-3 md:w-4 md:h-4 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l-3 3m0 0l3 3m-3-3h14m0 0l-3-3m3 3l-3 3"></path>
              </svg>
            </div>
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">AFTER</span>
          </div>
        </div>
      )}

      <TransformWrapper 
        key={originalUrl} 
        initialScale={1} minScale={0.1} maxScale={30} limitToBounds={false}
        onTransform={(ref) => { 
          if (ref && ref.state && !isNaN(ref.state.scale)) {
            setZoomInputValue(Math.round(ref.state.scale * 100).toString()); 
          }
        }}
      >
        {({ zoomIn, zoomOut, resetTransform, setTransform, state }) => (
          <div className="w-full h-full relative flex items-center justify-center">
            
            <div className={`absolute top-4 right-4 md:top-6 md:right-6 z-[60] flex gap-2 transition-all duration-300 ${isSidebarOpen ? 'opacity-0 scale-50 pointer-events-none' : 'opacity-100 scale-100'}`}>
              <button 
                onClick={() => setIsSidebarOpen(true)} 
                className="bg-white/10 backdrop-blur-2xl border border-white/20 text-white p-2.5 md:p-3 rounded-full shadow-2xl hover:bg-white/20 active:scale-95 transition-all"
                aria-label="Open Inspector Sidebar"
                title="Open Inspector"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
              </button>
            </div>

            <Toolbar 
              zoomInputValue={zoomInputValue} setZoomInputValue={setZoomInputValue} zoomIn={zoomIn} zoomOut={zoomOut} resetTransform={resetTransform} 
              setRotation={setRotation} bgTheme={bgTheme} setBgTheme={setBgTheme} isPixelated={isPixelated} setIsPixelated={setIsPixelated} 
              handleZoomInputSubmit={() => {
                const num = parseInt(zoomInputValue);
                if (!isNaN(num) && num > 0) setTransform(state.positionX, state.positionY, num / 100, 300);
              }} 
            />

            <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }} contentStyle={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="shadow-2xl animate-in fade-in zoom-in-95">
                {compressedUrl ? (
                  <ReactCompareSlider
                    itemOne={
                      <div className="flex items-center justify-center overflow-hidden" style={{ width: displayW, height: displayH }}>
                        <img 
                          src={renderUrl} 
                          alt="Original Image" 
                          draggable={false} 
                          style={{
                            ...imageStyle,
                            transform: `rotate(${rotation}deg)`,
                            maxWidth: isVertical ? displayH : displayW,
                            maxHeight: isVertical ? displayW : displayH,
                          }} 
                          className="pointer-events-none" 
                        />
                      </div>
                    }
                    itemTwo={
                      <div className="flex items-center justify-center overflow-hidden" style={{ width: displayW, height: displayH }}>
                        <img 
                          src={compressedUrl} 
                          alt="Optimized Image" 
                          draggable={false} 
                          style={imageStyle} 
                          className="pointer-events-none" 
                        />
                      </div>
                    }
                  />
                ) : (
                  <div className="flex items-center justify-center overflow-hidden" style={{ width: displayW, height: displayH }}>
                    <img 
                      src={renderUrl} 
                      alt="Current Image" 
                      draggable={false} 
                      style={{
                        ...imageStyle,
                        transform: `rotate(${rotation}deg)`,
                        maxWidth: isVertical ? displayH : displayW,
                        maxHeight: isVertical ? displayW : displayH,
                      }} 
                      className="pointer-events-none" 
                    />
                  </div>
                )}
              </div>
            </TransformComponent>
            
            <button 
              onClick={onCloseImage} 
              className="absolute top-4 left-4 md:top-6 md:left-6 z-50 bg-white/15 backdrop-blur-lg hover:bg-red-500/80 p-2.5 md:p-3 rounded-full border border-white/20 transition-all shadow-2xl text-white" 
              title="Close and Discard Image"
              aria-label="Close and Discard Image"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
        )}
      </TransformWrapper>
    </div>
  );
};

export default memo(Viewer);