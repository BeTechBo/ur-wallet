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

type SolvedState = { coinsAwarded: number; rank: number }

// ─── Helpers ─────────────────────────────────────────────────────────────────

function ordinal(n: number) {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

function normalise(s: string) {
  return s.trim().toLowerCase()
}

// Web Audio "victory" ding — 3-note ascending chord
function playCorrectSound() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    const notes = [523.25, 659.25, 783.99] // C5 E5 G5
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.value = freq
      const t = ctx.currentTime + i * 0.14
      gain.gain.setValueAtTime(0, t)
      gain.gain.linearRampToValueAtTime(0.28, t + 0.04)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.7)
      osc.start(t)
      osc.stop(t + 0.75)
    })
  } catch (_) {}
}

// ─── Thin rule divider ────────────────────────────────────────────────────────

function Rule() {
  return <div className="h-px w-full bg-[#416047]/12 my-4" />
}

// ─── Clue badge ───────────────────────────────────────────────────────────────

function ClueBadge({ label }: { label: string }) {
  return (
    <span className="inline-block text-[9px] font-black tracking-[0.22em] uppercase px-2 py-0.5 rounded bg-[#416047]/10 text-[#416047] mr-2">
      {label}
    </span>
  )
}

// ─── Biography reveal ────────────────────────────────────────────────────────

function BiographyCard({ character }: { character: NonNullable<DailyChallengeProps['character']> }) {
  return (
    <div className="border border-[#416047]/20 rounded-2xl overflow-hidden bg-white/60">
      {/* Name header */}
      <div className="bg-[#416047] px-5 py-4">
        <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/50 mb-1">
          {character.testament === 'OT' ? 'Old Testament' : 'New Testament'}
        </div>
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="text-2xl font-black text-white tracking-tight">{character.name_en}</span>
          <span className="text-lg text-white/60 font-medium" dir="rtl">{character.name_ar}</span>
        </div>
      </div>
      {/* Bio body */}
      <div className="px-5 py-4 space-y-4">
        <p className="text-sm text-[#2E4034]/80 leading-relaxed">{character.biography}</p>
        <div className="border-l-[3px] border-[#D97746]/50 pl-3">
          <p className="text-sm text-[#416047] italic font-serif leading-relaxed">
            &ldquo;{character.key_verse}&rdquo;
          </p>
          <p className="text-xs text-[#D97746] mt-1.5 font-semibold tracking-wide">— {character.key_verse_ref}</p>
        </div>
      </div>
    </div>
  )
}

// ─── State A: No Challenge ────────────────────────────────────────────────────

function NoChallengeCard() {
  return (
    <div className="border-2 border-dashed border-[#416047]/20 rounded-2xl p-10 text-center space-y-5 bg-white/40">
      {/* Big question mark — the whole point, typographically */}
      <div
        className="text-[96px] leading-none font-black select-none"
        style={{ color: '#416047', opacity: 0.07 }}
      >
        ?
      </div>
      <div className="space-y-2 -mt-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#D97746]/80">
          Daily Mystery
        </p>
        <h2 className="text-xl font-black text-[#2E4034] tracking-tight">
          No challenge set yet.
        </h2>
        <p className="text-sm text-[#2E4034]/50 leading-relaxed max-w-xs mx-auto">
          A new Bible character mystery goes live each evening. Check back later tonight — the first to solve it earns the most coins.
        </p>
      </div>
      <Rule />
      <p className="text-xs text-[#416047]/60 font-medium">
        🕯️ Challenges update every day at <strong>10:00 PM</strong>
      </p>
    </div>
  )
}

// ─── State C: Solved ─────────────────────────────────────────────────────────

function SolvedCard({
  character,
  submission,
  rank,
}: {
  character: NonNullable<DailyChallengeProps['character']>
  submission: NonNullable<DailyChallengeProps['userSubmission']>
  rank: number
}) {
  return (
    <div className="space-y-5">
      {/* Trophy banner */}
      <div className="rounded-2xl border border-[#D97746]/30 overflow-hidden">
        <div className="bg-[#D97746] px-5 py-3 flex items-center gap-3">
          <span className="text-2xl">✨</span>
          <div>
            <p className="text-white font-black text-base tracking-tight">Mystery Solved!</p>
            <p className="text-white/70 text-xs font-medium">
              You were the <strong className="text-white">{ordinal(rank)}</strong> to crack it today
            </p>
          </div>
          <div className="ml-auto bg-white/20 rounded-full px-4 py-1.5 text-white font-black text-sm">
            +{submission.coins_awarded} coins
          </div>
        </div>
        <div className="bg-[#FCF8F2] px-5 py-2.5 text-xs text-[#2E4034]/50 font-medium">
          🕯️ Come back tomorrow at 10:00 PM for the next mystery!
        </div>
      </div>
      {/* Biography */}
      <BiographyCard character={character} />
    </div>
  )
}

// ─── State B: Active ──────────────────────────────────────────────────────────

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
  const [wrongMsg, setWrongMsg] = useState('')
  const [solvedState, setSolvedState] = useState<SolvedState | null>(null)
  const [suggestions, setSuggestions] = useState<typeof BIBLE_CHARACTERS>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isPending, startTransition] = useTransition()
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  const failed = attemptsLeft === 0 && !solvedState

  // Close suggestions on outside click
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (
        suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node) &&
        inputRef.current && !inputRef.current.contains(e.target as Node)
      ) setShowSuggestions(false)
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  function handleGuessChange(val: string) {
    setGuess(val)
    if (val.trim()) {
      const q = normalise(val)
      const hits = BIBLE_CHARACTERS.filter(c =>
        normalise(c.name_en).includes(q) || c.name_ar.includes(val.trim())
      ).slice(0, 6)
      setSuggestions(hits)
      setShowSuggestions(hits.length > 0)
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
    setWrongMsg(msg)
    setTimeout(() => setShake(false), 600)
  }

  function handleSubmit() {
    if (!guess.trim() || isPending || attemptsLeft === 0 || solvedState) return
    startTransition(async () => {
      const result = await submitChallengeAnswer({ challengeId: challenge.id, userId, guess: guess.trim() })
      if (!result.success) { triggerShake(result.error || 'Something went wrong. Try again.'); return }
      if (result.correct) {
        playCorrectSound()
        setSolvedState({ coinsAwarded: result.coinsAwarded ?? 2, rank: result.rank ?? 1 })
        setShowBiography(true)
      } else {
        const rem = attemptsLeft - 1
        setAttemptsLeft(rem)
        if (rem === 0) {
          setShowBiography(true)
          triggerShake('No attempts left — but here\'s who it was!')
        } else {
          triggerShake(`Not quite! ${rem} ${rem === 1 ? 'attempt' : 'attempts'} remaining.`)
        }
        setGuess('')
      }
    })
  }

  // Show solved view inline
  if (solvedState) {
    return (
      <div className="animate-slide-up">
        <SolvedCard
          character={character}
          submission={{ solved_at: new Date().toISOString(), coins_awarded: solvedState.coinsAwarded }}
          rank={solvedState.rank}
        />
      </div>
    )
  }

  return (
    <div className="space-y-5">

      {/* ── Header row ── */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <p className="text-[10px] font-black tracking-[0.22em] uppercase text-[#D97746]">Daily Mystery</p>
          <h2 className="text-2xl font-black text-[#2E4034] tracking-tight leading-none mt-0.5">
            Who Am I?
          </h2>
        </div>
        {submissionsCount > 0 && (
          <span className="text-xs text-[#416047]/60 font-medium bg-[#416047]/8 px-3 py-1.5 rounded-full border border-[#416047]/15">
            ⚔️ {submissionsCount} solved today
          </span>
        )}
      </div>

      <Rule />

      {/* ── Clues ── */}
      <div className="space-y-4">
        {character.clues.map((clue, i) => {
          if (i >= revealedClues) return null
          return (
            <div key={i} className={i > 0 ? 'pt-2 border-t border-[#416047]/10' : ''}>
              <div className="flex items-start gap-2 mb-1.5">
                <ClueBadge label={`Clue ${['I', 'II', 'III'][i]}`} />
                <span className="text-[9px] text-[#2E4034]/30 font-bold tracking-widest uppercase pt-0.5">
                  {['القرينة الأولى', 'القرينة الثانية', 'القرينة الثالثة'][i]}
                </span>
              </div>
              {/* English clue */}
              <p className="text-sm text-[#2E4034] leading-relaxed font-serif italic pl-1">
                &ldquo;{clue}&rdquo;
              </p>
            </div>
          )
        })}
      </div>

      {/* Reveal clue button */}
      {revealedClues < 3 && !failed && (
        <button
          onClick={() => setRevealedClues(p => p + 1)}
          className="text-xs font-semibold text-[#416047]/70 hover:text-[#416047] transition-colors underline underline-offset-2 decoration-dotted"
        >
          🔎 {revealedClues === 1 ? 'Reveal next clue' : 'Reveal final clue'}
          <span className="text-[#2E4034]/30 font-normal no-underline"> — doesn't reduce your reward</span>
        </button>
      )}

      <Rule />

      {/* ── Answer section ── */}
      {!failed ? (
        <div className="space-y-3">

          {/* Attempts dots */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-[#2E4034]/40 font-bold uppercase tracking-widest">Attempts left</span>
            <div className="flex gap-1 ml-1">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full transition-all duration-300"
                  style={{ background: i < attemptsLeft ? '#D97746' : '#D97746', opacity: i < attemptsLeft ? 1 : 0.15 }}
                />
              ))}
            </div>
          </div>

          {/* Input + shake wrapper */}
          <div style={shake ? { animation: 'shake 0.5s ease-in-out' } : {}}>
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={guess}
                onChange={e => handleGuessChange(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSubmit() }}
                onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true) }}
                placeholder="Type a name… English or Arabic"
                dir="auto"
                disabled={isPending}
                className="w-full px-4 py-3 rounded-xl border border-[#416047]/20 bg-white text-[#2E4034] placeholder-[#2E4034]/30 text-sm focus:outline-none focus:border-[#416047]/50 focus:ring-2 focus:ring-[#416047]/10 transition-all"
              />

              {/* Suggestions dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div
                  ref={suggestionsRef}
                  className="absolute z-20 left-0 right-0 top-full mt-1.5 bg-white rounded-xl border border-[#D97746]/25 shadow-lg overflow-hidden"
                >
                  {suggestions.map(c => (
                    <button
                      key={c.id}
                      onMouseDown={e => { e.preventDefault(); pickSuggestion(c) }}
                      className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-[#416047]/5 transition-colors border-b border-[#2E4034]/5 last:border-0"
                    >
                      <span className="font-medium text-[#2E4034]">{c.name_en}</span>
                      <span className="text-[#D97746]/80 text-sm" dir="rtl">{c.name_ar}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {wrongMsg && (
              <p className="text-xs text-[#D97746] font-semibold mt-2 animate-slide-up">{wrongMsg}</p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={isPending || !guess.trim()}
            className="w-full py-3 rounded-xl bg-[#416047] hover:bg-[#2E4034] text-white text-sm font-black tracking-wide transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            {isPending ? '⏳ Checking…' : 'Submit Answer'}
          </button>

          {/* Reward table */}
          <div className="grid grid-cols-4 gap-1 text-center">
            {[
              { emoji: '🥇', label: '1st', coins: 6 },
              { emoji: '🥈', label: '2nd', coins: 5 },
              { emoji: '🥉', label: '3rd', coins: 4 },
              { emoji: '✨', label: 'Others', coins: 2 },
            ].map(r => (
              <div key={r.label} className="rounded-lg bg-[#416047]/5 border border-[#416047]/10 py-2 px-1">
                <div className="text-base">{r.emoji}</div>
                <div className="text-[9px] font-bold text-[#2E4034]/50 uppercase tracking-wide">{r.label}</div>
                <div className="text-sm font-black text-[#416047]">+{r.coins}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-[#D97746]/30 bg-[#D97746]/5 px-4 py-3 text-center space-y-1">
          <p className="text-sm font-bold text-[#D97746]">No more attempts for today.</p>
          <p className="text-xs text-[#2E4034]/50">Come back tomorrow at 10:00 PM 🕯️</p>
        </div>
      )}

      {/* Biography revealed after failure */}
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
  0%,100%{ transform:translateX(0) }
  15%     { transform:translateX(-7px) }
  30%     { transform:translateX(7px) }
  45%     { transform:translateX(-5px) }
  60%     { transform:translateX(5px) }
  75%     { transform:translateX(-3px) }
  90%     { transform:translateX(3px) }
}
`

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function DailyChallenge({
  challenge, character, userSubmission, submissionsCount, userId,
}: DailyChallengeProps) {
  return (
    <>
      <style>{shakeStyle}</style>
      <div className="w-full max-w-lg mx-auto">
        {!challenge && <NoChallengeCard />}
        {challenge && character && !userSubmission && (
          <ActiveChallenge
            challenge={challenge}
            character={character}
            submissionsCount={submissionsCount}
            userId={userId}
          />
        )}
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
