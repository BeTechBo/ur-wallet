import React from 'react';
import URCoin from './URCoin';

export default function AnimatedWallet() {
  return (
    <div className="relative w-32 h-40 overflow-hidden flex flex-col items-center justify-end group">
      {/* The Animated Coin popping up and down */}
      <div className="absolute animate-pop-coin z-0 bottom-14">
        <URCoin className="w-24 h-24 text-4xl" />
      </div>
      
      {/* The Front of the Wallet overlapping the coin to hide its bottom half when it drops */}
      <div className="w-32 h-20 bg-secondary rounded-t-xl border-t-4 border-background/20 shadow-inner relative z-10 flex justify-center">
        {/* Wallet clasp/detail */}
        <div className="w-12 h-3 bg-secondary-foreground mx-auto rounded-b-lg opacity-30"></div>
      </div>
    </div>
  );
}
