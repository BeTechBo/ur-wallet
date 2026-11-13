'use client'

import { useState, useTransition, useRef, useEffect } from 'react'
import { submitChallengeAnswer } from '@/app/actions'
import { BIBLE_CHARACTERS } from '@/data/bible-characters'

type DailyChallengeProps = {
  challenge: { id: string; character_id: string; active_date: string } | null
  character: {
    id: string; name_en: string; name_ar: string
    clues: [string, string, string]
    clues_ar: [string, string, string]
    biography: string; key_verse: string; key_verse_ref: string
    testament: 'OT' | 'NT'
  } | null
  userSubmission: { solved_at: string; coins_awarded: number } | null
  submissionsCount: number
  userId: string
}

type SolvedState = { coinsAwarded: number; rank: number }

function ordinal(n: number) {
  const s = ['th', 'st', 'nd', 'rd'], v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

function normalise(s: string) { return s.trim().toLowerCase() }

function playCorrectSound() {
  try {
    const Ctx = window.AudioContext || (window as any).webkitAudioContext
    if (!Ctx) return
    const ctx = new Ctx()
    ;[523.25, 659.25, 783.99].forEach((freq, i) => {
      const osc = ctx.createOscillator(), g = ctx.createGain()
      osc.connect(g); g.connect(ctx.destination)
      osc.type = 'sine'; osc.frequency.value = freq
      const t = ctx.currentTime + i * 0.14
      g.gain.setValueAtTime(0, t)
      g.gain.linearRampToValueAtTime(0.28, t + 0.04)
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.7)
      osc.start(t); osc.stop(t + 0.75)
    })
  } catch (_) {}
}

// ── No challenge ──────────────────────────────────────────────────────────────

function NoChallengeCard() {
  return (
    <div className="border border-[#2E4034]/12 bg-white">
      <div className="bg-[#2E4034] px-5 py-3 flex items-center justify-between">
        <span className="text-[11px] font-black tracking-[0.2em] uppercase text-white/90">Daily Quest</span>
      </div>
      <div className="px-6 py-14 text-center space-y-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#D97746]">No challenge right now</p>
        <p className="text-sm text-[#2E4034]/50 max-w-xs mx-auto leading-relaxed">
          A new mystery character goes live every day. Check back tonight.
        </p>
        <p className="text-xs text-[#2E4034]/30 font-medium pt-2">Updates daily at 10:00 PM</p>
      </div>
    </div>
  )
}

// ── Solved ────────────────────────────────────────────────────────────────────

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
    <div className="border border-[#2E4034]/12 bg-white overflow-hidden">
      {/* Success bar */}
      <div className="bg-[#416047] px-5 py-3 flex items-center justify-between">
        <span className="text-[11px] font-black tracking-[0.2em] uppercase text-white/90">Solved</span>
        <span className="text-[11px] font-bold text-white/70">
          {ordinal(rank)} to solve · +{submission.coins_awarded} coins
        </span>
      </div>

      {/* Character reveal */}
      <div className="px-5 py-5 border-b border-[#2E4034]/8">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#D97746] mb-2">
          {character.testament === 'OT' ? 'Old Testament' : 'New Testament'}
        </p>
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="text-2xl font-black text-[#2E4034] tracking-tight">{character.name_en}</span>
          <span className="text-lg text-[#2E4034]/40 font-medium" dir="rtl">{character.name_ar}</span>
        </div>
      </div>

      {/* Biography */}
      <div className="px-5 py-5 border-b border-[#2E4034]/8">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#2E4034]/40 mb-3">About</p>
        <p className="text-sm text-[#2E4034]/75 leading-relaxed">{character.biography}</p>
      </div>

      {/* Key verse */}
      <div className="px-5 py-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#2E4034]/40 mb-3">Key Verse</p>
        <p className="text-sm text-[#416047] font-serif italic leading-relaxed">
          &ldquo;{character.key_verse}&rdquo;
        </p>
        <p className="text-xs text-[#D97746] font-semibold mt-2 tracking-wide">{character.key_verse_ref}</p>
      </div>

      <div className="bg-[#FCF8F2] border-t border-[#2E4034]/8 px-5 py-3">
        <p className="text-xs text-[#2E4034]/40">Come back tomorrow at 10:00 PM for the next mystery.</p>
      </div>
    </div>
  )
}

// ── Active challenge ──────────────────────────────────────────────────────────

function ActiveChallenge({
  challenge, character, submissionsCount, userId,
}: {
  challenge: NonNullable<DailyChallengeProps['challenge']>
  character: NonNullable<DailyChallengeProps['character']>
  submissionsCount: number
  userId: string
}) {
  const [attemptsLeft, setAttemptsLeft] = useState(3)
  const [guess, setGuess] = useState('')
  const [showBio, setShowBio] = useState(false)
  const [revealed, setRevealed] = useState(1)
  const [shake, setShake] = useState(false)
  const [msg, setMsg] = useState('')
  const [solved, setSolved] = useState<SolvedState | null>(null)
  const [suggestions, setSuggestions] = useState<typeof BIBLE_CHARACTERS>([])
  const [showSug, setShowSug] = useState(false)
  const [pending, startTransition] = useTransition()
  const inputRef = useRef<HTMLInputElement>(null)
  const sugRef = useRef<HTMLDivElement>(null)

  const failed = attemptsLeft === 0 && !solved

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (sugRef.current && !sugRef.current.contains(e.target as Node) &&
          inputRef.current && !inputRef.current.contains(e.target as Node))
        setShowSug(false)
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  function onGuessChange(val: string) {
    setGuess(val)
    if (val.trim()) {
      const q = normalise(val)
      const hits = BIBLE_CHARACTERS.filter(c =>
        normalise(c.name_en).includes(q) || c.name_ar.includes(val.trim())
      ).slice(0, 5)
      setSuggestions(hits); setShowSug(hits.length > 0)
    } else { setSuggestions([]); setShowSug(false) }
  }

  function pick(c: (typeof BIBLE_CHARACTERS)[number]) {
    setGuess(c.name_en); setSuggestions([]); setShowSug(false)
    inputRef.current?.focus()
  }

  function triggerShake(m: string) {
    setShake(true); setMsg(m)
    setTimeout(() => setShake(false), 600)
  }

  function submit() {
    if (!guess.trim() || pending || attemptsLeft === 0 || solved) return
    startTransition(async () => {
      const res = await submitChallengeAnswer({ challengeId: challenge.id, userId, guess: guess.trim() })
      if (!res.success) { triggerShake(res.error || 'Something went wrong.'); return }
      if (res.correct) {
        playCorrectSound()
        setSolved({ coinsAwarded: res.coinsAwarded ?? 2, rank: res.rank ?? 1 })
        setShowBio(true)
      } else {
        const rem = attemptsLeft - 1
        setAttemptsLeft(rem)
        setGuess('')
        if (rem === 0) { setShowBio(true); triggerShake('No more attempts. Here is who it was:') }
        else triggerShake(`Not quite. ${rem} ${rem === 1 ? 'attempt' : 'attempts'} left.`)
      }
    })
  }

  if (solved) {
    return (
      <div className="animate-slide-up">
        <SolvedCard
          character={character}
          submission={{ solved_at: new Date().toISOString(), coins_awarded: solved.coinsAwarded }}
          rank={solved.rank}
        />
      </div>
    )
  }

  return (
    <div className="border border-[#2E4034]/12 bg-white overflow-visible">

      {/* Header */}
      <div className="bg-[#2E4034] px-5 py-3 flex items-center justify-between">
        <span className="text-[11px] font-black tracking-[0.2em] uppercase text-white/90">Daily Quest</span>
        {submissionsCount > 0 && (
          <span className="text-[11px] text-white/50 font-medium">
            {submissionsCount} solved today
          </span>
        )}
      </div>

      {/* Title */}
      <div className="px-5 pt-6 pb-4 border-b border-[#2E4034]/8">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D97746] mb-1">Who Am I?</p>
        <p className="text-[10px] font-bold tracking-[0.15em] text-[#2E4034]/30" dir="rtl">من أنا؟</p>
      </div>

      {/* Clues */}
      <div>
        {character.clues.map((clue, i) => {
          if (i >= revealed) return null
          return (
            <div key={i} className="px-5 py-5 border-b border-[#2E4034]/8">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2E4034]/30 mb-2">
                Clue {String(i + 1).padStart(2, '0')}
              </p>
              {/* English */}
              <p className="text-sm text-[#2E4034] leading-relaxed font-serif italic mb-2">
                &ldquo;{clue}&rdquo;
              </p>
              {/* Arabic */}
              <p className="text-sm text-[#2E4034]/50 leading-relaxed font-medium" dir="rtl">
                &laquo;{character.clues_ar[i]}&raquo;
              </p>
            </div>
          )
        })}
      </div>

      {/* Reveal button */}
      {revealed < 3 && !failed && (
        <div className="px-5 py-3 border-b border-[#2E4034]/8">
          <button
            onClick={() => setRevealed(p => p + 1)}
            className="text-xs font-bold text-[#416047] hover:text-[#2E4034] transition-colors tracking-wide uppercase"
          >
            Reveal clue {String(revealed + 1).padStart(2, '0')}
            <span className="font-normal text-[#2E4034]/30 normal-case tracking-normal ml-1">(no penalty)</span>
          </button>
        </div>
      )}

      {/* Answer area */}
      <div className="px-5 py-5 space-y-4">

        {/* Attempts */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#2E4034]/30">Attempts</span>
          <div className="flex gap-1.5 ml-1">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: '#D97746', opacity: i < attemptsLeft ? 1 : 0.15 }}
              />
            ))}
          </div>
        </div>

        {!failed ? (
          <>
            {/* Input */}
            <div style={shake ? { animation: 'dqshake 0.5s ease-in-out' } : {}}>
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={guess}
                  onChange={e => onGuessChange(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') submit() }}
                  onFocus={() => { if (suggestions.length > 0) setShowSug(true) }}
                  placeholder="Type a name in English or Arabic"
                  dir="auto"
                  disabled={pending}
                  className="w-full border-0 border-b-2 border-[#2E4034]/20 bg-transparent text-sm text-[#2E4034] placeholder-[#2E4034]/25 py-2 focus:outline-none focus:border-[#416047] transition-colors"
                />

                {showSug && suggestions.length > 0 && (
                  <div
                    ref={sugRef}
                    className="absolute z-20 left-0 right-0 top-full mt-1 bg-white border border-[#2E4034]/12 shadow-sm overflow-hidden"
                  >
                    {suggestions.map(c => (
                      <button
                        key={c.id}
                        onMouseDown={e => { e.preventDefault(); pick(c) }}
                        className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-[#416047]/5 transition-colors border-b border-[#2E4034]/6 last:border-0 text-left"
                      >
                        <span className="font-semibold text-[#2E4034]">{c.name_en}</span>
                        <span className="text-[#2E4034]/40 text-sm" dir="rtl">{c.name_ar}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {msg && (
                <p className="text-xs text-[#D97746] font-semibold mt-2">{msg}</p>
              )}
            </div>

            {/* Submit */}
            <button
              onClick={submit}
              disabled={pending || !guess.trim()}
              className="w-full py-3 bg-[#2E4034] hover:bg-[#416047] text-white text-xs font-black tracking-[0.15em] uppercase transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {pending ? 'Checking' : 'Submit Answer'}
            </button>

            {/* Reward */}
            <div className="border-t border-[#2E4034]/8 pt-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#2E4034]/30 mb-2">Coin Reward</p>
              <div className="flex gap-4 text-xs text-[#2E4034]/60 font-medium">
                <span>1st — <strong className="text-[#D97746]">6</strong></span>
                <span>2nd — <strong className="text-[#D97746]">5</strong></span>
                <span>3rd — <strong className="text-[#D97746]">4</strong></span>
                <span>Others — <strong className="text-[#D97746]">2</strong></span>
              </div>
            </div>
          </>
        ) : (
          <p className="text-sm text-[#D97746] font-semibold">No more attempts for today.</p>
        )}
      </div>

      {/* Biography after failure */}
      {showBio && !solved && (
        <div className="border-t border-[#2E4034]/8 animate-slide-up">
          <div className="px-5 py-5 border-b border-[#2E4034]/8">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#D97746] mb-2">
              {character.testament === 'OT' ? 'Old Testament' : 'New Testament'}
            </p>
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-2xl font-black text-[#2E4034]">{character.name_en}</span>
              <span className="text-lg text-[#2E4034]/40" dir="rtl">{character.name_ar}</span>
            </div>
          </div>
          <div className="px-5 py-5 border-b border-[#2E4034]/8">
            <p className="text-sm text-[#2E4034]/75 leading-relaxed">{character.biography}</p>
          </div>
          <div className="px-5 py-5">
            <p className="text-sm text-[#416047] font-serif italic leading-relaxed">
              &ldquo;{character.key_verse}&rdquo;
            </p>
            <p className="text-xs text-[#D97746] font-semibold mt-2">{character.key_verse_ref}</p>
          </div>
        </div>
      )}
    </div>
  )
}

const shakeStyle = `
@keyframes dqshake {
  0%,100%{ transform:translateX(0) }
  20%     { transform:translateX(-5px) }
  40%     { transform:translateX(5px) }
  60%     { transform:translateX(-4px) }
  80%     { transform:translateX(4px) }
}
`

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
            challenge={challenge} character={character}
            submissionsCount={submissionsCount} userId={userId}
          />
        )}
        {challenge && character && userSubmission && (
          <SolvedCard character={character} submission={userSubmission} rank={submissionsCount} />
        )}
      </div>
    </>
  )
}
