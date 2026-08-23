import React from 'react';

export default function URCoin({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.3)] bg-gradient-to-br from-[#FDE08B] via-[#D4AF37] to-[#AA7C11] border-[3px] border-[#8C6208] text-[#5C4000] font-serif font-black ${className}`}>
      {/* Inner ring to make it look carved/minted */}
      <div className="absolute inset-1 rounded-full border-[1.5px] border-dashed border-[#8C6208]/40" />
      {/* The embossed UR text */}
      <span 
        className="relative z-10 tracking-tighter" 
        style={{ textShadow: "1px 1px 0px rgba(255,255,255,0.5), -1px -1px 0px rgba(0,0,0,0.2)" }}
      >
        UR
      </span>
    </div>
  );
}
