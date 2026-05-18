"use client";

import dynamic from 'next/dynamic';

// optimized loading placeholder
const SquooshEditor = dynamic(() => import('../components/SquooshEditor'), {
  ssr: false, 
  loading: () => (
    <div className="h-[100dvh] w-screen bg-[#000] flex flex-col items-center justify-center text-white font-sans">
      <div className="w-12 h-12 border-4 border-white/10 border-t-blue-500 rounded-full animate-spin mb-4 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
      <p className="text-gray-400 text-sm font-medium tracking-widest uppercase animate-pulse">Loading Editor...</p>
    </div>
  )
});

export default function Page() {
  return <SquooshEditor />;
}