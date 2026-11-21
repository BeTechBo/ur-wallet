'use client'

import { useEffect, useState } from 'react'
import { Gift, Coins } from 'lucide-react'

type GiftRevealClientProps = {
  senderName: string
  recipientName: string
  coinsAmount: number
  verseText: string | null
  verseReference: string | null
  personalNote: string | null
  alreadyOpened: boolean
}

export default function GiftRevealClient({
  senderName,
  recipientName,
  coinsAmount,
  verseText,
  verseReference,
  personalNote,
  alreadyOpened,
}: GiftRevealClientProps) {
  const [phase, setPhase] = useState<'box' | 'opening' | 'revealed'>(
    alreadyOpened ? 'revealed' : 'box'
  )

  // Auto-progress the animation
  useEffect(() => {
    if (alreadyOpened || phase !== 'box') return
    // Don't auto-open — wait for click
  }, [alreadyOpened, phase])

  const handleOpen = () => {
    if (phase !== 'box') return
    setPhase('opening')
    setTimeout(() => setPhase('revealed'), 1200)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FCF8F2] via-[#f5ebe0] to-[#FCF8F2] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full">

        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-[#324b4c] text-3xl mb-2">✝</p>
          <h1 className="text-2xl font-black text-[#324b4c] tracking-tight">The Upper Room</h1>
          <p className="text-sm text-[#324b4c]/50 font-medium mt-1">Community Gifts</p>
        </div>

        {/* Gift Card */}
        <div className="bg-white rounded-3xl border border-[#E8DFD5] shadow-lg overflow-hidden">

          {/* From banner */}
          <div className="bg-[#324b4c] px-8 py-5 text-center">
            <p className="text-[#FCF8F2]/60 text-xs font-bold uppercase tracking-widest mb-1">A gift from</p>
            <p className="text-[#FCF8F2] text-2xl font-black">{senderName}</p>
            <p className="text-[#d88452] text-xs font-bold uppercase tracking-widest mt-1">to {recipientName}</p>
          </div>

          <div className="p-8">
            {/* Phase: Gift Box */}
            {phase === 'box' && (
              <div className="text-center">
                <div
                  onClick={handleOpen}
                  className="cursor-pointer select-none inline-block transition-transform hover:scale-105 active:scale-95"
                  title="Tap to unwrap!"
                >
                  <div className="text-[100px] leading-none mb-2 drop-shadow-lg animate-bounce" style={{ animationDuration: '2s' }}>
                    🎁
                  </div>
                </div>
                <p className="text-[#324b4c] font-black text-xl mt-4">Tap to Unwrap!</p>
                <p className="text-[#324b4c]/50 text-sm mt-2">Your gift is waiting inside</p>
              </div>
            )}

            {/* Phase: Opening */}
            {phase === 'opening' && (
              <div className="text-center py-8">
                <div className="text-[80px] leading-none mb-4 animate-spin" style={{ animationDuration: '0.8s' }}>
                  ✨
                </div>
                <p className="text-[#324b4c] font-black text-xl">Opening...</p>
              </div>
            )}

            {/* Phase: Revealed */}
            {phase === 'revealed' && (
              <div className="text-center space-y-6">

                {/* Coins reveal */}
                <div>
                  <p className="text-xs font-bold text-[#324b4c]/50 uppercase tracking-widest mb-2">You received</p>
                  <div className="bg-[#FCF8F2] rounded-2xl border border-[#E8DFD5] py-6 px-8 inline-block mx-auto">
                    <p className="text-[#d88452] text-6xl font-black tracking-tighter leading-none">
                      +{coinsAmount}
                    </p>
                    <p className="text-[#324b4c] text-sm font-bold uppercase tracking-widest mt-1 opacity-70">
                      UR-Coins
                    </p>
                  </div>
                  {alreadyOpened ? (
                    <p className="text-xs text-[#324b4c]/40 font-medium mt-2">
                      (coins were added to your wallet when you first opened this gift)
                    </p>
                  ) : (
                    <p className="text-xs text-emerald-600 font-bold mt-2 bg-emerald-50 inline-block px-3 py-1 rounded-full border border-emerald-200">
                      Added to your wallet!
                    </p>
                  )}
                </div>

                {/* Verse */}
                {verseText && (
                  <div className="bg-[#324b4c]/5 border border-[#324b4c]/10 rounded-2xl p-6 text-center">
                    <div className="text-[#324b4c] text-xl mb-3">✝</div>
                    <p className="text-[#324b4c] text-xl font-medium leading-[1.8] italic" dir="rtl">
                      "{verseText}"
                    </p>
                    {verseReference && (
                      <p className="text-[#d88452] text-sm font-black uppercase tracking-wider mt-4">
                        {verseReference}
                      </p>
                    )}
                  </div>
                )}

                {/* Personal note */}
                {personalNote && (
                  <div
                    className="text-left rounded-xl p-4 border-l-4"
                    style={{ borderLeftColor: '#d88452', backgroundColor: '#FCF8F2' }}
                  >
                    <p className="text-xs font-bold text-[#324b4c]/50 uppercase tracking-widest mb-1">A note from {senderName}</p>
                    <p className="text-[#324b4c] text-sm leading-relaxed italic">{personalNote}</p>
                  </div>
                )}

                {/* CTA */}
                <a
                  href="/wallet"
                  className="block w-full py-4 bg-[#324b4c] text-[#FCF8F2] font-black text-center rounded-2xl text-sm uppercase tracking-widest hover:bg-[#324b4c]/90 transition-colors mt-4 shadow-sm"
                >
                  View My Wallet
                </a>

              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[#324b4c]/30 text-xs mt-8 font-medium">
          Sent with love by The Upper Room family
        </p>
      </div>
    </div>
  )
}
