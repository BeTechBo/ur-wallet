import { BookOpen, CalendarDays, Users, CheckCircle2, RotateCcw } from 'lucide-react'
import { BIBLE_CHARACTERS } from '@/data/bible-characters'
import { setDailyChallenge, resetDailyChallenge, resetTestCharacters } from '@/app/actions'
import { SubmitButton } from '@/components/SubmitButton'

type DailyChallengeAdminProps = {
  todayChallenge: { id: string; character_id: string; active_date: string } | null
  recentChallenges: {
    id: string
    character_id: string
    active_date: string
    solver_count: number
  }[]
  usedCharacterIds: string[]
}

function getCharacter(characterId: string) {
  return BIBLE_CHARACTERS.find((c) => c.id === characterId) ?? null
}

export default function DailyChallengeAdmin({
  todayChallenge,
  recentChallenges,
  usedCharacterIds,
}: DailyChallengeAdminProps) {
  const todayCharacter = todayChallenge ? getCharacter(todayChallenge.character_id) : null
  const todaySolverCount =
    recentChallenges.find((r) => r.active_date === todayChallenge?.active_date)?.solver_count ?? 0

  const usedSet = new Set(usedCharacterIds)
  const availableCharacters = BIBLE_CHARACTERS.filter((c) => !usedSet.has(c.id))
  const hasTestCharactersUsed = usedSet.has('martha') || usedSet.has('mary-mother-of-jesus')

  return (
    <div className="bg-white rounded-2xl p-8 border border-secondary/30 shadow-sm space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-secondary" />
          <div>
            <h2 className="font-bold text-lg text-foreground">Daily Quest: Who Am I</h2>
            <p className="text-xs text-foreground/50 mt-0.5">
              {availableCharacters.length} of {BIBLE_CHARACTERS.length} characters remaining
            </p>
          </div>
        </div>

        {hasTestCharactersUsed && (
          <form action={resetTestCharacters}>
            <SubmitButton className="inline-flex items-center gap-1.5 rounded-xl border border-secondary/40 bg-secondary/10 hover:bg-secondary/20 text-secondary text-xs font-bold px-3.5 py-2 transition">
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Martha & Virgin Mary
            </SubmitButton>
          </form>
        )}
      </div>

      {/* Today's active challenge */}
      <div className="rounded-xl border border-primary/20 bg-[#FCF8F2] p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-wide">
            <CalendarDays className="w-4 h-4" />
            Active Challenge
          </div>
          {todayChallenge && (
            <form action={resetDailyChallenge}>
              <input type="hidden" name="challengeId" value={todayChallenge.id} />
              <button
                type="submit"
                className="text-xs text-red-600 hover:text-red-700 font-semibold underline transition cursor-pointer"
              >
                Clear Active Challenge
              </button>
            </form>
          )}
        </div>
        {todayCharacter && todayChallenge ? (
          <div className="space-y-1">
            <p className="text-foreground font-bold text-base">
              {todayCharacter.name_en}{' '}
              <span className="text-foreground/60 font-normal text-sm" dir="rtl">({todayCharacter.name_ar})</span>
            </p>
            <p className="text-xs text-foreground/50">{todayChallenge.active_date}</p>
            <div className="flex items-center gap-1 text-xs text-secondary font-medium">
              <Users className="w-3 h-3" />
              {todaySolverCount} {todaySolverCount === 1 ? 'solver' : 'solvers'} so far
            </div>
          </div>
        ) : (
          <p className="text-foreground/50 text-sm italic">No challenge is active right now.</p>
        )}
      </div>

      {/* Set new challenge form */}
      <form action={setDailyChallenge} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-foreground/80 mb-2" htmlFor="characterId">
            Set Today&apos;s Challenge
          </label>
          {availableCharacters.length === 0 ? (
            <div className="rounded-xl border border-secondary/20 bg-[#FCF8F2] px-4 py-4 text-sm text-foreground/50 italic text-center">
              All 30 characters have been used! You can reset any character from recent history below.
            </div>
          ) : (
            <select
              id="characterId"
              name="characterId"
              required
              defaultValue=""
              className="w-full rounded-xl border border-secondary/30 bg-[#FCF8F2] px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition"
            >
              <option value="" disabled>Choose a character (unused only)</option>
              {availableCharacters.map((char) => (
                <option key={char.id} value={char.id}>
                  {char.name_en} ({char.name_ar}) [{char.testament === 'OT' ? 'Old Testament' : 'New Testament'}]
                </option>
              ))}
            </select>
          )}
        </div>

        {availableCharacters.length > 0 && (
          <SubmitButton className="w-full sm:w-auto rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-3 text-sm transition">
            Set as Active Challenge
          </SubmitButton>
        )}
      </form>

      {/* Recent history */}
      {recentChallenges.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-foreground/70 font-semibold text-sm">
            <CheckCircle2 className="w-4 h-4 text-secondary" />
            Recent Challenges
          </div>
          <ul className="divide-y divide-secondary/10 rounded-xl border border-secondary/20 overflow-hidden">
            {recentChallenges.map((rc) => {
              const ch = getCharacter(rc.character_id)
              return (
                <li
                  key={rc.id}
                  className="flex items-center justify-between px-5 py-3 bg-[#FCF8F2] hover:bg-secondary/5 transition text-sm"
                >
                  <div>
                    <span className="font-medium text-foreground">
                      {ch ? `${ch.name_en} (${ch.name_ar})` : rc.character_id}
                    </span>
                    <span className="ml-2 text-xs text-foreground/40">{rc.active_date}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-xs text-secondary font-semibold">
                      <Users className="w-3 h-3" />
                      {rc.solver_count}
                    </div>
                    <form action={resetDailyChallenge}>
                      <input type="hidden" name="challengeId" value={rc.id} />
                      <button
                        type="submit"
                        className="text-xs text-red-500 hover:text-red-700 font-semibold underline transition cursor-pointer"
                      >
                        Reset
                      </button>
                    </form>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
