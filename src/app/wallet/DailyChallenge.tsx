'use client'

import { useState, useTransition, useRef, useEffect } from 'react'
import { submitChallengeAnswer } from '@/app/actions'
import { BIBLE_CHARACTERS } from '@/data/bible-characters'

// ─── Types ───────────────────────────────────────────────────────────────────

type DailyChallengeProps = {
  challenge: {
    id: string
    character_id: string
    active_date: string
  } | null
  character: {
    id: string
    name_en: string
    name_ar: string
    clues: [string, string, string]
    biography: string
    key_verse: string
    key_verse_ref: string
    testament: 'OT' | 'NT'
  } | null
  userSubmission: {
    solved_at: string
    coins_awarded: number
  } | null
  submissionsCount: number
  userId: string
}

type SolvedState = {
  coinsAwarded: number
  rank: number
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

function normalise(s: string) {
  return s.trim().toLowerCase()
}

// ─── Decorative Cross Divider ─────────────────────────────────────────────────

function CrossDivider({ light = false }: { light?: boolean }) {
  const col = light ? 'rgba(252,248,242,0.25)' : 'rgba(217,119,70,0.35)'
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-px" style={{ background: col }} />
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <line x1="6" y1="0" x2="6" y2="12" stroke={light ? 'rgba(252,248,242,0.4)' : '#D97746'} strokeWidth="1.2" strokeOpacity="0.6"/>
        <line x1="0" y1="6" x2="12" y2="6" stroke={light ? 'rgba(252,248,242,0.4)' : '#D97746'} strokeWidth="1.2" strokeOpacity="0.6"/>
      </svg>
      <div className="flex-1 h-px" style={{ background: col }} />
    </div>
  )
}

// ─── Candle SVG ───────────────────────────────────────────────────────────────

function CandleIcon() {
  return (
    <svg width="32" height="48" viewBox="0 0 32 48" fill="none">
      {/* flame glow */}
      <ellipse cx="16" cy="10" rx="6" ry="8" fill="#D97746" fillOpacity="0.15"/>
      {/* flame */}
      <path d="M16 2 C13 6 11 9 13 12 C14 14 18 14 19 12 C21 9 19 6 16 2Z" fill="#D97746" fillOpacity="0.8"/>
      <path d="M16 4 C15 7 14 9 15 11 C15.5 12 16.5 12 17 11 C18 9 17 7 16 4Z" fill="#FCF8F2" fillOpacity="0.7"/>
      {/* wick */}
      <line x1="16" y1="13" x2="16" y2="16" stroke="#2E4034" strokeWidth="1.2" strokeLinecap="round"/>
      {/* body */}
      <rect x="10" y="16" width="12" height="26" rx="2" fill="#416047" fillOpacity="0.15" stroke="#416047" strokeOpacity="0.3" strokeWidth="1"/>
      {/* wax drip */}
      <path d="M10 22 Q8 24 10 26" stroke="#D97746" strokeWidth="1" strokeOpacity="0.3" fill="none" strokeLinecap="round"/>
      {/* base */}
      <rect x="7" y="42" width="18" height="4" rx="2" fill="#416047" fillOpacity="0.2" stroke="#416047" strokeOpacity="0.3" strokeWidth="1"/>
    </svg>
  )
}

// ─── Scroll SVG ───────────────────────────────────────────────────────────────

function ScrollSVG() {
  return (
    <svg width="64" height="72" viewBox="0 0 64 72" fill="none">
      {/* shadow */}
      <ellipse cx="32" cy="68" rx="20" ry="4" fill="#2E4034" fillOpacity="0.08"/>
      {/* top roll */}
      <ellipse cx="32" cy="12" rx="22" ry="8" fill="#E8D5B7"/>
      <ellipse cx="32" cy="12" rx="22" ry="8" fill="none" stroke="#C4956A" strokeWidth="1.2"/>
      <ellipse cx="32" cy="12" rx="14" ry="4" fill="#D4B896" fillOpacity="0.6"/>
      {/* body */}
      <rect x="10" y="12" width="44" height="44" fill="#EDD9B8"/>
      <rect x="10" y="12" width="44" height="44" fill="none" stroke="#C4956A" strokeWidth="1.2"/>
      {/* text lines on scroll */}
      <line x1="18" y1="24" x2="46" y2="24" stroke="#8B6340" strokeWidth="1" strokeOpacity="0.4" strokeLinecap="round"/>
      <line x1="18" y1="31" x2="46" y2="31" stroke="#8B6340" strokeWidth="1" strokeOpacity="0.4" strokeLinecap="round"/>
      <line x1="18" y1="38" x2="38" y2="38" stroke="#8B6340" strokeWidth="1" strokeOpacity="0.4" strokeLinecap="round"/>
      {/* question mark */}
      <text x="32" y="47" textAnchor="middle" fontFamily="serif" fontSize="18" fontWeight="bold" fill="#8B6340" fillOpacity="0.5">?</text>
      {/* bottom roll */}
      <ellipse cx="32" cy="56" rx="22" ry="8" fill="#E8D5B7"/>
      <ellipse cx="32" cy="56" rx="22" ry="8" fill="none" stroke="#C4956A" strokeWidth="1.2"/>
      <ellipse cx="32" cy="56" rx="14" ry="4" fill="#D4B896" fillOpacity="0.6"/>
    </svg>
  )
}

// ─── Biography Card ───────────────────────────────────────────────────────────

function BiographyCard({
  character,
}: {
  character: NonNullable<DailyChallengeProps['character']>
}) {
  return (
    <div
      className="rounded-2xl overflow-hidden border border-[#C4956A]/40"
      style={{
        background: 'linear-gradient(160deg, #2E4034 0%, #1e2d24 100%)',
        boxShadow: '0 4px 24px rgba(46,64,52,0.18)',
      }}
    >
      {/* Header band */}
      <div className="px-6 pt-6 pb-4 text-center border-b border-white/8">
        <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#D97746]/70 mb-3">
          {character.testament === 'OT' ? 'العهد القديم · Old Testament' : 'العهد الجديد · New Testament'}
        </div>
        <div className="text-3xl font-bold text-[#EDD9B8] mb-1 leading-tight" dir="rtl">
          {character.name_ar}
        </div>
        <div className="text-base font-semibold text-[#D97746]/80 tracking-wide">
          {character.name_en}
        </div>
      </div>

      {/* Biography */}
      <div className="px-6 py-5">
        <p className="text-sm text-[#EDD9B8]/75 leading-relaxed">
          {character.biography}
        </p>
        <CrossDivider light />
        {/* Key verse */}
        <div className="border-r-2 border-[#D97746]/50 pr-3">
          <p className="text-sm text-[#EDD9B8]/90 italic font-serif leading-relaxed">
            &ldquo;{character.key_verse}&rdquo;
          </p>
          <p className="text-xs text-[#D97746]/70 mt-2 font-medium tracking-wide">
            — {character.key_verse_ref}
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── State A: No Challenge ────────────────────────────────────────────────────

function NoChallengeCard() {
  return (
    <div
      className="rounded-2xl overflow-hidden relative"
      style={{
        background: 'linear-gradient(160deg, #2E4034 0%, #1a2820 100%)',
        boxShadow: '0 4px 32px rgba(46,64,52,0.2)',
      }}
    >
      {/* Top ornament strip */}
      <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, transparent, #D97746, transparent)' }} />

      <div className="p-8 text-center space-y-6">
        {/* Candle + scroll */}
        <div className="flex items-end justify-center gap-6 opacity-90">
          <CandleIcon />
          <ScrollSVG />
          <CandleIcon />
        </div>

        {/* Arabic title */}
        <div>
          <div className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#D97746]/60 mb-3">
            🌙 لغز الليلة · Tonight&apos;s Mystery
          </div>
          <h2 className="text-2xl font-bold text-[#EDD9B8] mb-2 leading-snug" dir="rtl">
            البكرة ممهورة بالختم…
          </h2>
          <p className="text-[#EDD9B8]/50 text-sm leading-relaxed font-serif italic">
            The scroll is sealed until tonight.
          </p>
          <p className="text-[#EDD9B8]/40 text-sm leading-relaxed mt-1" dir="rtl">
            كل مساء يُكشف عن شخصية جديدة من الكتاب المقدس.
          </p>
        </div>

        <CrossDivider light />

        {/* Time pill */}
        <div
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-[#EDD9B8]"
          style={{ border: '1px solid rgba(217,119,70,0.35)', background: 'rgba(217,119,70,0.1)' }}
        >
          🕯️ يفتح اللغز الليلة الساعة <strong>10:00 م</strong>&nbsp;·&nbsp;<strong>10:00 PM</strong>
        </div>

        <p className="text-xs text-[#EDD9B8]/30">
          من يحل اللغز أولاً ينال أكبر مكافأة — the first to solve earns the most coins.
        </p>
      </div>

      {/* Bottom ornament */}
      <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, transparent, #D97746, transparent)' }} />
    </div>
  )
}

// ─── State C: Already Solved ──────────────────────────────────────────────────

function SolvedCard({
  character,
  submission,
  rank,
}: {
  character: NonNullable<DailyChallengeProps['character']>
  submission: NonNullable<DailyChallengeProps['userSubmission']>
  rank: number
}) {
  const rankLabel = ordinal(rank)
  const rankAr = rank === 1 ? 'الأول' : rank === 2 ? 'الثاني' : rank === 3 ? 'الثالث' : `رقم ${rank}`

  return (
    <div className="space-y-5">
      {/* Celebration header */}
      <div
        className="rounded-2xl overflow-hidden relative text-center"
        style={{
          background: 'linear-gradient(160deg, #2E4034, #1a2820)',
          border: '1px solid rgba(217,119,70,0.4)',
          boxShadow: '0 4px 24px rgba(46,64,52,0.2)',
        }}
      >
        <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, transparent, #D97746, transparent)' }} />
        <div className="px-6 py-6 space-y-3">
          <div className="text-3xl">✨</div>
          <div className="text-xl font-bold text-[#EDD9B8]">تم حل اللغز!</div>
          <div className="text-base text-[#D97746]/80 font-serif italic">Mystery Solved!</div>
          <CrossDivider light />
          <p className="text-sm text-[#EDD9B8]/70">
            كنت <strong className="text-[#EDD9B8]">{rankAr}</strong> في الإجابة
            {' · '}You were the <strong className="text-[#EDD9B8]">{rankLabel}</strong> to solve it!
          </p>
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-base font-bold text-[#D97746]"
            style={{ background: 'rgba(217,119,70,0.12)', border: '1px solid rgba(217,119,70,0.3)' }}
          >
            🪙 +{submission.coins_awarded} UR-coins
          </div>
        </div>
        <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, transparent, #D97746, transparent)' }} />
      </div>

      {/* Biography */}
      <BiographyCard character={character} />

      <p className="text-center text-xs text-[#2E4034]/40 font-serif italic">
        🕯️ تعال غداً الساعة 10 مساءً للغز جديد · Come back tomorrow at 10:00 PM!
      </p>
    </div>
  )
}

// ─── State B: Active Challenge ────────────────────────────────────────────────

function ActiveChallenge({
  challenge,
  character,
  submissionsCount,
  userId,
}: {
  challenge: NonNullable<DailyChallengeProps['challenge']>
  character: NonNullable<DailyChallengeProps['character']>
  submissionsCount: number
  userId: string
}) {
  const [attemptsLeft, setAttemptsLeft] = useState(3)
  const [guess, setGuess] = useState('')
  const [showBiography, setShowBiography] = useState(false)
  const [revealedClues, setRevealedClues] = useState(1)
  const [shake, setShake] = useState(false)
  const [wrongMessage, setWrongMessage] = useState('')
  const [solvedState, setSolvedState] = useState<SolvedState | null>(null)
  const [suggestions, setSuggestions] = useState<typeof BIBLE_CHARACTERS>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isPending, startTransition] = useTransition()
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  const failed = attemptsLeft === 0 && !solvedState

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleGuessChange(value: string) {
    setGuess(value)
    if (value.trim().length > 0) {
      const q = normalise(value)
      const matches = BIBLE_CHARACTERS.filter(
        (c) =>
          normalise(c.name_en).includes(q) ||
          c.name_ar.includes(value.trim())
      ).slice(0, 6)
      setSuggestions(matches)
      setShowSuggestions(matches.length > 0)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  function pickSuggestion(c: (typeof BIBLE_CHARACTERS)[number]) {
    setGuess(c.name_en)
    setSuggestions([])
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  function triggerShake(msg: string) {
    setShake(true)
    setWrongMessage(msg)
    setTimeout(() => setShake(false), 600)
  }

  function handleSubmit() {
    if (!guess.trim() || isPending || attemptsLeft === 0 || solvedState) return

    startTransition(async () => {
      const result = await submitChallengeAnswer({
        challengeId: challenge.id,
        userId,
        guess: guess.trim(),
      })

      if (!result.success) {
        triggerShake(result.error || 'حدث خطأ ما. حاول مرة أخرى.')
        return
      }

      if (result.correct) {
        setSolvedState({ coinsAwarded: result.coinsAwarded ?? 2, rank: result.rank ?? 1 })
        setShowBiography(true)
      } else {
        const remaining = attemptsLeft - 1
        setAttemptsLeft(remaining)
        if (remaining === 0) {
          setShowBiography(true)
          triggerShake('اللغز يبقى سراً لهذا اليوم… The mystery remains for today 🙏')
        } else {
          triggerShake('إجابة خاطئة… حاول مرة أخرى 🙏  Not quite — try again!')
        }
        setGuess('')
      }
    })
  }

  // Show solved state inline
  if (solvedState) {
    return (
      <div className="space-y-4 animate-slide-up">
        <SolvedCard
          character={character}
          submission={{ solved_at: new Date().toISOString(), coins_awarded: solvedState.coinsAwarded }}
          rank={solvedState.rank}
        />
      </div>
    )
  }

  const clueLabels = [
    { ar: 'القرينة الأولى', en: 'Clue I', icon: '🔑' },
    { ar: 'القرينة الثانية', en: 'Clue II', icon: '📜' },
    { ar: 'القرينة الثالثة', en: 'Clue III', icon: '🕯️' },
  ]

  return (
    <div className="space-y-5">
      {/* Solver count badge */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-[#D97746]"
          style={{ background: 'rgba(217,119,70,0.1)', border: '1px solid rgba(217,119,70,0.25)' }}
        >
          📜 لغز اليوم · Daily Mystery
        </span>
        {submissionsCount > 0 && (
          <span className="text-xs text-[#2E4034]/50 font-medium">
            ⚔️ {submissionsCount} {submissionsCount === 1 ? 'شخص حلّ' : 'أشخاص حلّوا'} اللغز اليوم
          </span>
        )}
      </div>

      {/* Main mystery card — dark parchment */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #2E4034 0%, #1e2d24 100%)',
          boxShadow: '0 4px 32px rgba(46,64,52,0.2)',
          border: '1px solid rgba(196,149,106,0.3)',
        }}
      >
        {/* Top ornament */}
        <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg, transparent, #D97746, transparent)' }} />

        {/* Title area */}
        <div
          className="text-center px-6 py-5"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div
            className="text-4xl font-bold text-[#EDD9B8] leading-none mb-1"
            style={{ fontFamily: 'serif', letterSpacing: '0.02em' }}
            dir="rtl"
          >
            من أنا؟
          </div>
          <div className="text-sm text-[#D97746]/60 tracking-[0.2em] uppercase font-semibold mt-1">
            Who Am I?
          </div>
        </div>

        {/* Clues */}
        <div className="px-6 py-5 space-y-1">
          {character.clues.map((clue, i) => {
            if (i >= revealedClues) return null
            const label = clueLabels[i]
            return (
              <div key={i}>
                {i > 0 && <CrossDivider light />}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{label.icon}</span>
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#D97746]/70">
                      {label.ar} · {label.en}
                    </span>
                  </div>
                  <p className="text-sm text-[#EDD9B8]/85 font-serif italic leading-relaxed pl-5">
                    &ldquo;{clue}&rdquo;
                  </p>
                </div>
              </div>
            )
          })}

          {/* Reveal button */}
          {revealedClues < 3 && !failed && (
            <div className="pt-4">
              <button
                onClick={() => setRevealedClues(prev => prev + 1)}
                className="w-full py-2.5 rounded-xl text-xs font-semibold text-[#EDD9B8]/70 hover:text-[#EDD9B8] transition-colors"
                style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)' }}
              >
                🔎 {revealedClues === 1 ? 'اكشف القرينة التالية · Reveal Next Clue' : 'اكشف القرينة الأخيرة · Reveal Final Clue'}
              </button>
              <p className="text-center text-[10px] text-[#EDD9B8]/25 mt-1.5">
                الكشف عن قرائن إضافية لا يقلل من مكافأتك · Revealing clues does not reduce your reward
              </p>
            </div>
          )}
        </div>

        {/* Bottom ornament */}
        <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg, transparent, #D97746, transparent)' }} />
      </div>

      {/* Answer section */}
      {!failed ? (
        <div className="space-y-3">
          {/* Attempts */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#2E4034]/50 font-medium">المحاولات · Attempts:</span>
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="text-base transition-opacity duration-300"
                  style={{ opacity: i < attemptsLeft ? 1 : 0.15 }}
                >
                  📜
                </span>
              ))}
            </div>
          </div>

          {/* Shake wrapper */}
          <div style={shake ? { animation: 'shake 0.5s ease-in-out' } : {}}>
            {/* Input + autocomplete */}
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={guess}
                onChange={(e) => handleGuessChange(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit() }}
                onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true) }}
                placeholder="اكتب الاسم… أو بالإنجليزية · Type the name…"
                dir="auto"
                className="w-full px-4 py-3 rounded-xl text-sm text-[#2E4034] placeholder-[#2E4034]/30 focus:outline-none transition-all"
                style={{
                  background: '#FCF8F2',
                  border: '1.5px solid rgba(65,96,71,0.25)',
                  boxShadow: 'inset 0 1px 3px rgba(46,64,52,0.06)',
                }}
                disabled={isPending}
              />

              {/* Suggestions dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div
                  ref={suggestionsRef}
                  className="absolute z-20 left-0 right-0 top-full mt-1 rounded-xl overflow-hidden"
                  style={{
                    background: '#FCF8F2',
                    border: '1px solid rgba(217,119,70,0.3)',
                    boxShadow: '0 8px 24px rgba(46,64,52,0.12)',
                  }}
                >
                  {suggestions.map((c) => (
                    <button
                      key={c.id}
                      onMouseDown={(e) => { e.preventDefault(); pickSuggestion(c) }}
                      className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-[#416047]/5 transition-colors"
                      style={{ borderBottom: '1px solid rgba(217,119,70,0.1)' }}
                    >
                      <span className="text-[#2E4034] font-medium">{c.name_en}</span>
                      <span className="text-[#D97746]/80 text-sm font-medium" dir="rtl">{c.name_ar}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Wrong message */}
          {wrongMessage && (
            <p className="text-xs text-center text-[#D97746] font-medium animate-slide-up">
              {wrongMessage}
            </p>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={isPending || !guess.trim()}
            className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: isPending ? '#416047' : 'linear-gradient(135deg, #416047, #2E4034)',
              boxShadow: '0 2px 12px rgba(65,96,71,0.3)',
            }}
          >
            {isPending ? '⏳ جاري التحقق… Checking…' : '✝ تأكيد الإجابة · Submit Answer'}
          </button>

          {/* Reward preview */}
          <div
            className="rounded-xl px-4 py-3 text-center"
            style={{ background: 'rgba(217,119,70,0.07)', border: '1px solid rgba(217,119,70,0.2)' }}
          >
            <p className="text-xs text-[#2E4034]/65">
              🥇 الأول: <strong>+6 coins</strong>&nbsp;•&nbsp;
              🥈 الثاني: <strong>+5</strong>&nbsp;•&nbsp;
              🥉 الثالث: <strong>+4</strong>&nbsp;•&nbsp;
              الباقون: <strong>+2 coins</strong>
            </p>
          </div>
        </div>
      ) : (
        /* Failed — out of attempts */
        <div className="space-y-3">
          <div
            className="rounded-xl px-4 py-4 text-center space-y-1"
            style={{ background: 'rgba(217,119,70,0.08)', border: '1px solid rgba(217,119,70,0.25)' }}
          >
            <p className="text-sm font-bold text-[#D97746]">اللغز يبقى سراً لهذا اليوم…</p>
            <p className="text-xs text-[#2E4034]/60 font-serif italic">
              Come back tomorrow at 10:00 PM for a new challenge 🕯️
            </p>
          </div>
          <p className="text-xs text-[#416047] font-medium text-center">
            لكن انظر من كان… But here is who it was:
          </p>
        </div>
      )}

      {/* Biography (shown after failure) */}
      {showBiography && !solvedState && (
        <div className="animate-slide-up">
          <BiographyCard character={character} />
        </div>
      )}
    </div>
  )
}

// ─── Shake keyframe ───────────────────────────────────────────────────────────

const shakeStyle = `
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  15%       { transform: translateX(-6px); }
  30%       { transform: translateX(6px); }
  45%       { transform: translateX(-5px); }
  60%       { transform: translateX(5px); }
  75%       { transform: translateX(-3px); }
  90%       { transform: translateX(3px); }
}
`

// ─── Main Export ─────────────────────────────────────────────────────────────

export default function DailyChallenge({
  challenge,
  character,
  userSubmission,
  submissionsCount,
  userId,
}: DailyChallengeProps) {
  return (
    <>
      <style>{shakeStyle}</style>
      <div className="w-full max-w-lg mx-auto">
        {/* State A: no challenge set */}
        {!challenge && <NoChallengeCard />}

        {/* State B: active, not solved */}
        {challenge && character && !userSubmission && (
          <ActiveChallenge
            challenge={challenge}
            character={character}
            submissionsCount={submissionsCount}
            userId={userId}
          />
        )}

        {/* State C: already solved */}
        {challenge && character && userSubmission && (
          <SolvedCard
            character={character}
            submission={userSubmission}
            rank={submissionsCount}
          />
        )}
      </div>
    </>
  )
}
