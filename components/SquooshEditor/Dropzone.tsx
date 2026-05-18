import React, { useRef, memo } from 'react';

interface DropzoneProps {
  onFileDrop: (file: File) => void;
  isDragging: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
}

const Dropzone: React.FC<DropzoneProps> = ({ onFileDrop, isDragging, onDragOver, onDragLeave }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDragLeave(e);
    const file = e.dataTransfer.files?.[0];
    if (file) onFileDrop(file);
  };

  return (
    <div 
      onClick={() => fileInputRef.current?.click()} 
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={handleDrop}
      role="button"
      tabIndex={0}
      aria-label="Upload image"
      title="Tap to select or drop image"
      className={`border border-white/10 rounded-[2rem] md:rounded-[3rem] p-10 md:p-20 mx-4 text-center cursor-pointer transition-all duration-500 backdrop-blur-2xl bg-white/5 shadow-2xl ${isDragging ? 'border-blue-500/50 bg-blue-500/10 scale-105' : 'hover:bg-white/10 hover:border-white/20'}`}
    >
      <div className="text-6xl md:text-8xl mb-4 md:mb-6 drop-shadow-2xl">📸</div>
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">Photo Squoosh</h2>
      <p className="text-gray-400 text-xs md:text-sm">Tap to select or drop image</p>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            onFileDrop(file);
          }
          // این خط اضافه شد تا کاربر بتواند یک عکس را دو بار پشت سر هم آپلود کند
          e.target.value = ''; 
        }} 
        className="hidden" 
        accept="image/*" 
        aria-label="Select image file"
      />
    </div>
  );
};

export default memo(Dropzone);