'use client'

import { useState, useTransition, useRef, useEffect } from 'react'
import { submitChallengeAnswer } from '@/app/actions'
import { BIBLE_CHARACTERS, type BibleCharacter } from '@/data/bible-characters'

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

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function normalise(s: string) {
  return s.trim().toLowerCase()
}

function isCorrectGuess(guess: string, name_en: string, name_ar: string): boolean {
  const g = normalise(guess)
  if (!g) return false
  return normalise(name_en) === g || normalise(name_ar) === g
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function ScrollIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="10" width="32" height="30" rx="3" fill="#D97746" fillOpacity="0.15" stroke="#D97746" strokeOpacity="0.5" strokeWidth="1.5"/>
      <path d="M8 14c0-2.2 1.8-4 4-4h24c2.2 0 4 1.8 4 4" stroke="#D97746" strokeOpacity="0.6" strokeWidth="1.5"/>
      <path d="M8 36c0 2.2 1.8 4 4 4h24c2.2 0 4-1.8 4-4" stroke="#D97746" strokeOpacity="0.6" strokeWidth="1.5"/>
      <line x1="15" y1="21" x2="33" y2="21" stroke="#416047" strokeOpacity="0.4" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="15" y1="26" x2="33" y2="26" stroke="#416047" strokeOpacity="0.4" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="15" y1="31" x2="26" y2="31" stroke="#416047" strokeOpacity="0.4" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  )
}

function ParchmentDivider() {
  return (
    <div className="flex items-center gap-2 my-3 opacity-40">
      <div className="flex-1 h-px bg-[#D97746]" />
      <span className="text-[#D97746] text-xs">✝</span>
      <div className="flex-1 h-px bg-[#D97746]" />
    </div>
  )
}

function TestamentBadge({ testament }: { testament: 'OT' | 'NT' }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
      testament === 'OT'
        ? 'border-[#416047]/30 text-[#416047] bg-[#416047]/8'
        : 'border-[#D97746]/30 text-[#D97746] bg-[#D97746]/8'
    }`}>
      {testament === 'OT' ? '📜 Old Testament' : '✝ New Testament'}
    </span>
  )
}

function BiographyCard({
  character,
}: {
  character: NonNullable<DailyChallengeProps['character']>
}) {
  return (
    <div className="rounded-2xl border border-[#D97746]/30 bg-[#FCF8F2] shadow-sm p-5 space-y-4">
      {/* Name */}
      <div className="text-center space-y-1">
        <div className="text-2xl font-bold text-[#2E4034]" dir="rtl">
          {character.name_ar}
        </div>
        <div className="text-lg font-semibold text-[#416047]">{character.name_en}</div>
        <div className="mt-1">
          <TestamentBadge testament={character.testament} />
        </div>
      </div>

      <ParchmentDivider />

      {/* Biography */}
      <p className="text-sm text-[#2E4034]/80 leading-relaxed font-serif italic">
        {character.biography}
      </p>

      {/* Key verse */}
      <blockquote className="border-l-2 border-[#D97746]/50 pl-3 mt-2">
        <p className="text-sm text-[#416047] italic font-serif">&ldquo;{character.key_verse}&rdquo;</p>
        <footer className="text-xs text-[#D97746] mt-1 font-medium">— {character.key_verse_ref}</footer>
      </blockquote>
    </div>
  )
}

// ─── State A: No Challenge ────────────────────────────────────────────────────

function NoChallengeCard() {
  return (
    <div className="rounded-2xl border border-[#D97746]/25 bg-[#FCF8F2] shadow-sm p-8 text-center space-y-5">
      <div className="flex justify-center animate-float">
        <ScrollIcon className="w-16 h-16 opacity-70" />
      </div>

      <div>
        <div className="text-xs font-semibold tracking-widest uppercase text-[#D97746]/70 mb-2">
          🌙 Tonight&apos;s Mystery
        </div>
        <h2 className="text-2xl font-bold text-[#2E4034] mb-1">The scroll is sealed…</h2>
        <p className="text-[#416047]/80 font-serif italic text-sm leading-relaxed">
          Every evening a new mystery is revealed to the faithful.
          <br />
          Return tonight — a character from Scripture awaits your discovery.
        </p>
      </div>

      <ParchmentDivider />

      <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#416047]/8 border border-[#416047]/20 text-[#416047] text-sm font-medium">
        🕯️ The next challenge unlocks tonight at <strong>10:00 PM</strong>
      </div>

      <p className="text-xs text-[#2E4034]/40 mt-2">
        Gather your brothers &amp; sisters — the first to solve earns the most coins.
      </p>
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

  return (
    <div className="space-y-5">
      {/* Celebration header */}
      <div className="rounded-2xl border border-[#D97746]/30 bg-[#FCF8F2] p-6 text-center space-y-3 shadow-sm">
        <div className="text-3xl animate-sway inline-block">✨</div>
        <h2 className="text-xl font-bold text-[#2E4034]">Mystery Solved!</h2>
        <p className="text-lg text-[#D97746] font-serif" dir="rtl">الغاز محلول!</p>

        <ParchmentDivider />

        <p className="text-sm text-[#416047] font-medium">
          You were the <strong className="text-[#2E4034]">{rankLabel}</strong> to solve today&apos;s mystery!
        </p>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D97746]/10 border border-[#D97746]/30 text-[#D97746] font-bold text-base">
          🪙 +{submission.coins_awarded} UR-coins earned
        </div>
      </div>

      {/* Biography reveal */}
      <BiographyCard character={character} />

      {/* Come back tomorrow */}
      <div className="text-center text-xs text-[#2E4034]/50 font-serif italic">
        🕯️ Come back tomorrow at 10:00 PM for the next mystery!
      </div>
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
  const [suggestions, setSuggestions] = useState<BibleCharacter[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isPending, startTransition] = useTransition()
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  const failed = attemptsLeft === 0 && !solvedState

  // Close suggestions on outside click
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
        (c: BibleCharacter) =>
          normalise(c.name_en).includes(q) ||
          normalise(c.name_ar).includes(q)
      ).slice(0, 6)
      setSuggestions(matches)
      setShowSuggestions(matches.length > 0)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  function pickSuggestion(c: BibleCharacter) {
    setGuess(c.name_en)
    setSuggestions([])
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  function handleRevealClue() {
    if (revealedClues < 3) setRevealedClues((prev) => prev + 1)
  }

  function triggerShake(msg: string) {
    setShake(true)
    setWrongMessage(msg)
    setTimeout(() => setShake(false), 600)
  }

  function handleSubmit() {
    if (!guess.trim() || isPending || attemptsLeft === 0 || solvedState) return

    startTransition(async () => {
      const result = await submitChallengeAnswer({ challengeId: challenge.id, userId, guess: guess.trim() })

      if (result.error) {
        triggerShake(result.error)
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
          triggerShake("The mystery remains for today… come back tomorrow 🙏")
        } else {
          triggerShake("Not quite… try again 🙏")
        }
        setGuess('')
      }
    })
  }

  // ── Solved inline ──
  if (solvedState && solvedState.rank) {
    return (
      <div className="space-y-4 animate-fade-in">
        <SolvedCard
          character={character}
          submission={{ solved_at: new Date().toISOString(), coins_awarded: solvedState.coinsAwarded }}
          rank={solvedState.rank}
        />
      </div>
    )
  }

  const clueRomanNumerals = ['I', 'II', 'III']
  const clueIcons = ['🔑', '📜', '🕯️']

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FCF8F2] border border-[#D97746]/30 text-[#D97746] text-xs font-semibold shadow-sm">
          📜 Daily Mystery
        </span>
        <span className="text-xs text-[#2E4034]/50 font-medium">
          {formatDate(challenge.active_date)}
        </span>
      </div>

      <p className="text-xs text-[#416047] font-medium">
        ⚔️ {submissionsCount} {submissionsCount === 1 ? 'brother or sister has' : 'brothers & sisters have'} solved today&apos;s mystery
      </p>

      {/* Parchment mystery card */}
      <div
        className={`rounded-2xl border border-[#D97746]/30 bg-[#FCF8F2] shadow-sm overflow-hidden transition-all ${
          shake ? 'animate-[shake_0.5s_ease-in-out]' : ''
        }`}
        style={shake ? { animation: 'shake 0.5s ease-in-out' } : {}}
      >
        {/* Title */}
        <div className="bg-[#416047]/5 border-b border-[#D97746]/20 px-5 py-4 text-center">
          <div className="text-3xl font-bold text-[#2E4034] leading-tight" dir="rtl">
            من أنا؟
          </div>
          <div className="text-sm text-[#416047]/70 tracking-widest uppercase font-medium mt-0.5">
            Who Am I?
          </div>
        </div>

        {/* Clues */}
        <div className="p-5 space-y-1">
          {character.clues.map((clue, i) => {
            if (i >= revealedClues) return null
            return (
              <div key={i}>
                {i > 0 && <ParchmentDivider />}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#D97746] uppercase tracking-wide">
                    <span>{clueIcons[i]}</span>
                    <span>Clue {clueRomanNumerals[i]}</span>
                  </div>
                  <p className="text-sm text-[#2E4034] font-serif italic leading-relaxed pl-1">
                    &ldquo;{clue}&rdquo;
                  </p>
                </div>
              </div>
            )
          })}

          {/* Reveal clue button */}
          {revealedClues < 3 && !failed && !solvedState && (
            <div className="pt-3">
              <button
                onClick={handleRevealClue}
                className="w-full py-2 rounded-xl border border-[#416047]/25 text-[#416047] text-xs font-semibold hover:bg-[#416047]/5 transition-colors"
              >
                {revealedClues === 1 ? '🔎 Reveal Next Clue' : '🔎 Reveal Final Clue'}
              </button>
              <p className="text-center text-xs text-[#2E4034]/30 mt-1">
                Revealing clues does not reduce your reward
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Answer section */}
      {!failed ? (
        <div className="space-y-3">
          {/* Attempts indicator */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#2E4034]/50 font-medium">Attempts:</span>
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className={`text-base transition-opacity duration-300 ${
                    i < attemptsLeft ? 'opacity-100' : 'opacity-20'
                  }`}
                >
                  📜
                </span>
              ))}
            </div>
          </div>

          {/* Input + autocomplete */}
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={guess}
              onChange={(e) => handleGuessChange(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit() }}
              onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true) }}
              placeholder="Type the name… (English or Arabic)"
              dir="auto"
              className="w-full px-4 py-3 rounded-xl border border-[#416047]/25 bg-[#FCF8F2] text-[#2E4034] placeholder-[#2E4034]/30 text-sm focus:outline-none focus:border-[#416047]/60 focus:ring-1 focus:ring-[#416047]/20 transition-all"
              disabled={isPending}
            />

            {/* Suggestions dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div
                ref={suggestionsRef}
                className="absolute z-20 left-0 right-0 top-full mt-1 bg-[#FCF8F2] border border-[#D97746]/30 rounded-xl shadow-md overflow-hidden"
              >
                {suggestions.map((c) => (
                  <button
                    key={c.id}
                    onMouseDown={(e) => { e.preventDefault(); pickSuggestion(c) }}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-[#416047]/5 transition-colors border-b border-[#D97746]/10 last:border-0"
                  >
                    <span className="text-[#2E4034] font-medium">{c.name_en}</span>
                    <span className="text-[#D97746]/80 text-xs" dir="rtl">{c.name_ar}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Wrong answer message */}
          {wrongMessage && (
            <p className="text-xs text-center text-[#D97746] font-medium animate-slide-up">
              {wrongMessage}
            </p>
          )}

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={isPending || !guess.trim()}
            className="w-full py-3 rounded-xl bg-[#416047] text-white text-sm font-semibold hover:bg-[#2E4034] active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            {isPending ? '⏳ Checking…' : '✝ Submit Answer'}
          </button>
        </div>
      ) : (
        /* Failed — out of attempts */
        <div className="space-y-3">
          <div className="rounded-xl border border-[#D97746]/30 bg-[#D97746]/5 px-4 py-3 text-center space-y-1">
            <p className="text-sm font-semibold text-[#D97746]">
              The mystery remains for today…
            </p>
            <p className="text-xs text-[#2E4034]/60 font-serif italic">
              Come back tomorrow at 10:00 PM for a new challenge 🕯️
            </p>
          </div>
          <p className="text-xs text-[#416047] font-medium text-center">
            But all is not lost — here is who it was:
          </p>
        </div>
      )}

      {/* Biography (shown after failure or inline solve) */}
      {showBiography && !solvedState && (
        <div className="animate-slide-up">
          <BiographyCard character={character} />
        </div>
      )}

      {/* Reward preview */}
      {!failed && !solvedState && (
        <div className="rounded-xl border border-[#D97746]/20 bg-[#D97746]/5 px-3 py-2.5 text-center">
          <p className="text-xs text-[#2E4034]/70">
            🥇 1st to solve: <strong>+6 coins</strong> &nbsp;•&nbsp; 🥈 2nd: <strong>+5</strong> &nbsp;•&nbsp; 🥉 3rd: <strong>+4</strong> &nbsp;•&nbsp; Others: <strong>+2 coins</strong>
          </p>
        </div>
      )}
    </div>
  )
}

// ─── Shake keyframe (injected inline for portability) ─────────────────────────

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
        {/* State A */}
        {!challenge && <NoChallengeCard />}

        {/* State B */}
        {challenge && character && !userSubmission && (
          <ActiveChallenge
            challenge={challenge}
            character={character}
            submissionsCount={submissionsCount}
            userId={userId}
          />
        )}

        {/* State C */}
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
