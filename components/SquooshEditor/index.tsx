"use client";

import React, { useEffect, useCallback, useMemo, useRef, useReducer } from 'react';
import Dropzone from './Dropzone';
import Sidebar from './Sidebar';
import Viewer from './Viewer';
import { useObjectUrl } from '../../hooks/useObjectUrl';
import imageCompression from 'browser-image-compression';

type State = {
  originalFile: File | null;
  originalDim: { w: number, h: number };
  sizes: { original: number, compressed: number };
  isProcessing: boolean;
  isDragging: boolean;
  isSidebarOpen: boolean;
  rotation: number;
  bgTheme: 'dark' | 'light';
  isPixelated: boolean;
  zoomInputValue: string;
  resizeEnabled: boolean;
  resizeMethod: string;
  maintainAspect: boolean;
  width: number | '';
  height: number | '';
  format: string;
  quality: number;
  autoOptimize: boolean;
  error: string | null;
};

type Action = 
  | { type: 'SET_FILE', file: File, dim: { w: number, h: number } }
  | { type: 'CLOSE_IMAGE' }
  | { type: 'SET_PROCESSING', val: boolean }
  | { type: 'SET_DRAGGING', val: boolean }
  | { type: 'SET_SIDEBAR', val: boolean }
  | { type: 'SET_ROTATION', val: number }
  | { type: 'SET_BG_THEME', val: 'dark' | 'light' }
  | { type: 'SET_PIXELATED', val: boolean }
  | { type: 'SET_ZOOM', val: string }
  | { type: 'SET_RESIZE_ENABLED', val: boolean }
  | { type: 'SET_RESIZE_METHOD', val: string }
  | { type: 'SET_MAINTAIN_ASPECT', val: boolean }
  | { type: 'SET_WIDTH', val: number | '' }
  | { type: 'SET_HEIGHT', val: number | '' }
  | { type: 'SET_FORMAT', val: string }
  | { type: 'SET_QUALITY', val: number }
  | { type: 'SET_AUTO_OPTIMIZE', val: boolean }
  | { type: 'SET_COMPRESSED_SIZE', val: number }
  | { type: 'SET_ERROR', val: string | null };

const initialState: State = {
  originalFile: null,
  originalDim: { w: 0, h: 0 },
  sizes: { original: 0, compressed: 0 },
  isProcessing: false,
  isDragging: false,
  isSidebarOpen: false,
  rotation: 0,
  bgTheme: 'dark',
  isPixelated: false,
  zoomInputValue: '100',
  resizeEnabled: false,
  resizeMethod: 'Lanczos3',
  maintainAspect: true,
  width: '',
  height: '',
  format: 'image/webp',
  quality: 75,
  autoOptimize: false,
  error: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_FILE':
      return { 
        ...state, 
        originalFile: action.file, 
        originalDim: action.dim, 
        sizes: { original: action.file.size, compressed: 0 },
        width: action.dim.w,
        height: action.dim.h,
        rotation: 0,
        isSidebarOpen: true,
        error: null
      };
    case 'CLOSE_IMAGE':
      return { ...initialState };
    case 'SET_PROCESSING': return { ...state, isProcessing: action.val };
    case 'SET_DRAGGING': return { ...state, isDragging: action.val };
    case 'SET_SIDEBAR': return { ...state, isSidebarOpen: action.val };
    case 'SET_ROTATION': 
      const wasVertical = (state.rotation / 90) % 2 !== 0;
      const isNowVertical = (action.val / 90) % 2 !== 0;
      if (wasVertical !== isNowVertical && state.width !== '' && state.height !== '') {
        return { ...state, rotation: action.val, width: state.height, height: state.width };
      }
      return { ...state, rotation: action.val };
    case 'SET_BG_THEME': return { ...state, bgTheme: action.val };
    case 'SET_PIXELATED': return { ...state, isPixelated: action.val };
    case 'SET_ZOOM': return { ...state, zoomInputValue: action.val };
    case 'SET_RESIZE_ENABLED': return { ...state, resizeEnabled: action.val };
    case 'SET_RESIZE_METHOD': return { ...state, resizeMethod: action.val };
    case 'SET_MAINTAIN_ASPECT': return { ...state, maintainAspect: action.val };
    case 'SET_WIDTH': return { ...state, width: action.val };
    case 'SET_HEIGHT': return { ...state, height: action.val };
    case 'SET_FORMAT': return { ...state, format: action.val };
    case 'SET_QUALITY': return { ...state, quality: action.val };
    case 'SET_AUTO_OPTIMIZE': return { ...state, autoOptimize: action.val };
    case 'SET_COMPRESSED_SIZE': return { ...state, sizes: { ...state.sizes, compressed: action.val } };
    case 'SET_ERROR': return { ...state, error: action.val, isProcessing: false };
    default: return state;
  }
}

export default function SquooshEditor() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    originalFile, originalDim, sizes, isProcessing, isDragging, isSidebarOpen,
    rotation, bgTheme, isPixelated, zoomInputValue, resizeEnabled, resizeMethod,
    maintainAspect, width, height, format, quality, autoOptimize, error
  } = state;

  const [originalUrl, setOriginalUrl] = useObjectUrl();
  const [displayUrl, setDisplayUrl] = useObjectUrl();
  const [compressedUrl, setCompressedUrl] = useObjectUrl();

  const processIdRef = useRef(0);
  const workerRef = useRef<Worker | null>(null);

  const formatRef = useRef(format);
  const qualityRef = useRef(quality);

  useEffect(() => {
    formatRef.current = format;
    qualityRef.current = quality;
  }, [format, quality]);

  useEffect(() => {
    const worker = new Worker('/workers/image-processor.js');
    workerRef.current = worker;
    
    worker.onmessage = async (e) => {
      const { blob, error: workerError, processId } = e.data;
      if (processId !== processIdRef.current) return;
      
      if (workerError) {
        dispatch({ type: 'SET_ERROR', val: workerError });
        return;
      }

      let finalBlob = blob;

      // Use current values from refs to avoid stale closures and unnecessary worker re-creations
      const currentFormat = formatRef.current;
      const currentQuality = qualityRef.current;

      if (currentFormat === 'image/png') {
        try {
          const options = {
            maxSizeMB: (blob.size * (currentQuality / 100)) / (1024 * 1024),
            maxWidthOrHeight: undefined,
            useWebWorker: true,
            fileType: 'image/png'
          };
          const compressedBlob = await imageCompression(blob, options);
          if (processId === processIdRef.current) {
            finalBlob = compressedBlob;
          }
        } catch (err) {
          console.error("PNG compression error:", err);
        }
      }

      if (processId !== processIdRef.current) return;

      setCompressedUrl(finalBlob);
      dispatch({ type: 'SET_COMPRESSED_SIZE', val: finalBlob.size });
      dispatch({ type: 'SET_PROCESSING', val: false });
    };

    return () => {
      worker.terminate();
    };
  }, [setCompressedUrl]);

  const handleCloseImage = useCallback(() => {
    setOriginalUrl(null);
    setDisplayUrl(null);
    setCompressedUrl(null);
    dispatch({ type: 'CLOSE_IMAGE' });
  }, [setOriginalUrl, setDisplayUrl, setCompressedUrl]);

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      dispatch({ type: 'SET_ERROR', val: 'Please select a valid image file.' });
      return;
    }
    
    setOriginalUrl(file);
    setDisplayUrl(file);

    if ('createImageBitmap' in window) {
      window.createImageBitmap(file).then((bitmap) => {
        dispatch({ type: 'SET_FILE', file, dim: { w: bitmap.width, h: bitmap.height } });
        bitmap.close();
      }).catch(() => {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
          dispatch({ type: 'SET_FILE', file, dim: { w: img.width, h: img.height } });
          URL.revokeObjectURL(img.src);
        };
      });
    } else {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        dispatch({ type: 'SET_FILE', file, dim: { w: img.width, h: img.height } });
        URL.revokeObjectURL(img.src);
      };
    }
  }, [setOriginalUrl, setDisplayUrl]);

  // Handle rotation preview - Simplified to avoid lag
  useEffect(() => {
    if (!originalFile) return;
    setDisplayUrl(originalFile);
  }, [originalFile, setDisplayUrl]);

  const processImage = useCallback(() => {
    if (!originalFile || !workerRef.current) return;
    
    const currentProcessId = ++processIdRef.current;
    dispatch({ type: 'SET_PROCESSING', val: true });

    window.createImageBitmap(originalFile).then((bitmap) => {
      workerRef.current?.postMessage({
        bitmap,
        settings: {
          rotation, resizeEnabled, width, height, format, quality, resizeMethod, originalDim
        },
        processId: currentProcessId
      }, [bitmap]);
    }).catch((err) => {
      dispatch({ type: 'SET_ERROR', val: err.message });
    });
  }, [originalFile, rotation, resizeEnabled, width, height, format, quality, resizeMethod, originalDim]);

  const handleNewFileDrop = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    setCompressedUrl(null); 
    processFile(file);
  }, [processFile, setCompressedUrl]);

  const handleWidthChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (isNaN(val)) { dispatch({ type: 'SET_WIDTH', val: '' }); return; }
    dispatch({ type: 'SET_WIDTH', val });
    if (maintainAspect) {
      const isVertical = (rotation / 90) % 2 !== 0;
      const currentW = isVertical ? originalDim.h : originalDim.w;
      const currentH = isVertical ? originalDim.w : originalDim.h;
      if (currentW > 0) {
        const calcHeight = Math.round((val / currentW) * currentH);
        dispatch({ type: 'SET_HEIGHT', val: isNaN(calcHeight) ? '' : calcHeight });
      }
    }
  }, [maintainAspect, originalDim, rotation]);

  const handleHeightChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (isNaN(val)) { dispatch({ type: 'SET_HEIGHT', val: '' }); return; }
    dispatch({ type: 'SET_HEIGHT', val });
    if (maintainAspect) {
      const isVertical = (rotation / 90) % 2 !== 0;
      const currentW = isVertical ? originalDim.h : originalDim.w;
      const currentH = isVertical ? originalDim.w : originalDim.h;
      if (currentH > 0) {
        const calcWidth = Math.round((val / currentH) * currentW);
        dispatch({ type: 'SET_WIDTH', val: isNaN(calcWidth) ? '' : calcWidth });
      }
    }
  }, [maintainAspect, originalDim, rotation]);

  useEffect(() => {
    if (!autoOptimize) return;
    const timeoutId = setTimeout(processImage, 400); 
    return () => clearTimeout(timeoutId);
  }, [processImage, autoOptimize, rotation]); 

  const optPercent = useMemo(() => {
    if (!sizes.original || !sizes.compressed) return 0;
    const diff = sizes.original - sizes.compressed;
    return Math.round((diff / sizes.original) * 100);
  }, [sizes]);

  const bgStyles = useMemo(() => ({
    dark: 'conic-gradient(#333 0.25turn, #111 0.25turn 0.5turn, #333 0.5turn 0.75turn, #111 0.75turn)',
    light: 'conic-gradient(#ddd 0.25turn, #fff 0.25turn 0.5turn, #ddd 0.5turn 0.75turn, #fff 0.75turn)'
  }), []);

  return (
    <main 
      className="relative h-[100dvh] w-screen bg-[#000000] overflow-hidden flex font-sans text-gray-200"
      onDragOver={(e) => { e.preventDefault(); dispatch({ type: 'SET_DRAGGING', val: true }); }}
      onDragLeave={(e) => { e.preventDefault(); dispatch({ type: 'SET_DRAGGING', val: false }); }}
      onDrop={(e) => { e.preventDefault(); dispatch({ type: 'SET_DRAGGING', val: false }); if (!originalFile && e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]); }}
    >
      <div className={`absolute inset-0 z-0 pointer-events-none transition-opacity duration-300 ${bgTheme === 'light' ? 'opacity-100' : 'opacity-20'}`} style={{ backgroundImage: bgStyles[bgTheme], backgroundSize: '32px 32px' }} />

      <div className={`flex-1 relative z-10 flex items-center justify-center h-full w-full transition-all duration-300 ${originalUrl && isSidebarOpen ? 'md:pr-[340px]' : 'pr-0'}`}>
        {!originalUrl ? (
          <Dropzone 
            onFileDrop={processFile} isDragging={isDragging} 
            onDragOver={() => dispatch({ type: 'SET_DRAGGING', val: true })} 
            onDragLeave={() => dispatch({ type: 'SET_DRAGGING', val: false })} 
          />
        ) : (
          <Viewer 
            originalUrl={originalUrl} displayUrl={displayUrl} compressedUrl={compressedUrl} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={(val) => dispatch({ type: 'SET_SIDEBAR', val })}
            rotation={rotation} setRotation={(val) => typeof val === 'function' ? dispatch({ type: 'SET_ROTATION', val: val(rotation) }) : dispatch({ type: 'SET_ROTATION', val })}
            bgTheme={bgTheme} setBgTheme={(val) => typeof val === 'function' ? dispatch({ type: 'SET_BG_THEME', val: val(bgTheme) }) : dispatch({ type: 'SET_BG_THEME', val })} 
            isPixelated={isPixelated} setIsPixelated={(val) => typeof val === 'function' ? dispatch({ type: 'SET_PIXELATED', val: val(isPixelated) }) : dispatch({ type: 'SET_PIXELATED', val })}
            zoomInputValue={zoomInputValue} setZoomInputValue={(val) => dispatch({ type: 'SET_ZOOM', val })}
            onCloseImage={handleCloseImage}
            onNewFileDrop={handleNewFileDrop}
            originalDim={originalDim}
          />
        )}
      </div>

      {originalUrl && (
        <Sidebar 
          isSidebarOpen={isSidebarOpen} setIsSidebarOpen={(val) => dispatch({ type: 'SET_SIDEBAR', val })} 
          resizeEnabled={resizeEnabled} setResizeEnabled={(val) => dispatch({ type: 'SET_RESIZE_ENABLED', val })}
          resizeMethod={resizeMethod} setResizeMethod={(val) => dispatch({ type: 'SET_RESIZE_METHOD', val })} 
          maintainAspect={maintainAspect} setMaintainAspect={(val) => dispatch({ type: 'SET_MAINTAIN_ASPECT', val })}
          width={width} height={height} handleWidthChange={handleWidthChange} handleHeightChange={handleHeightChange} 
          format={format} setFormat={(val) => dispatch({ type: 'SET_FORMAT', val })} 
          quality={quality} setQuality={(val) => dispatch({ type: 'SET_QUALITY', val })} 
          autoOptimize={autoOptimize} setAutoOptimize={(val) => dispatch({ type: 'SET_AUTO_OPTIMIZE', val })} 
          onOptimizeNow={processImage} optPercent={optPercent} sizes={sizes} isProcessing={isProcessing} 
          compressedUrl={compressedUrl} originalUrl={originalUrl}
        />
      )}

      {error && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-[100] bg-red-500/90 backdrop-blur-md text-white px-6 py-3 rounded-2xl shadow-2xl border border-red-400/20 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span className="text-sm font-medium">{error}</span>
          <button onClick={() => dispatch({ type: 'SET_ERROR', val: null })} className="ml-2 hover:bg-white/10 rounded-full p-1 transition-colors" aria-label="Dismiss error" title="Dismiss error">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
      )}
    </main>
  );
}