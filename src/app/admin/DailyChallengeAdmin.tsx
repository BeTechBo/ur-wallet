import { BookOpen, CalendarDays, Users, CheckCircle2, RotateCcw, Archive } from 'lucide-react'
import { BIBLE_CHARACTERS } from '@/data/bible-characters'
import { setDailyChallenge, resetDailyChallenge, resetTestCharacters } from '@/app/actions'
import { SubmitButton } from '@/components/SubmitButton'

type DailyChallengeAdminProps = {
  todayChallenge: { id: string; character_id: string; active_date: string } | null
  usedChallenges: {
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
  usedChallenges,
  usedCharacterIds,
}: DailyChallengeAdminProps) {
  const todayCharacter = todayChallenge ? getCharacter(todayChallenge.character_id) : null
  const todaySolverCount =
    usedChallenges.find((r) => r.id === todayChallenge?.id)?.solver_count ?? 0

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
            <div className="flex items-center gap-3 text-xs font-semibold mt-1">
              <span className="text-[#416047] bg-[#416047]/10 px-2.5 py-0.5 rounded-full">
                {availableCharacters.length} options available
              </span>
              <span className="text-[#D97746] bg-[#D97746]/10 px-2.5 py-0.5 rounded-full">
                {usedChallenges.length} used in challenges
              </span>
            </div>
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
            <p className="text-xs text-foreground/50">Active Date: {todayChallenge.active_date}</p>
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
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-semibold text-foreground/80" htmlFor="characterId">
              Choose Character for Today
            </label>
            <span className="text-xs text-foreground/40 font-medium">
              Removed from options once added
            </span>
          </div>

          {availableCharacters.length === 0 ? (
            <div className="rounded-xl border border-secondary/20 bg-[#FCF8F2] px-4 py-4 text-sm text-foreground/50 italic text-center">
              All 30 characters have been used. You can reset any character in the Used Characters widget below to make it available again.
            </div>
          ) : (
            <select
              id="characterId"
              name="characterId"
              required
              defaultValue=""
              className="w-full rounded-xl border border-secondary/30 bg-[#FCF8F2] px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition font-medium"
            >
              <option value="" disabled>Select an available character ({availableCharacters.length} remaining)</option>
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
            Add to Daily Challenges
          </SubmitButton>
        )}
      </form>

      {/* Used Characters Widget */}
      <div className="space-y-4 pt-4 border-t border-secondary/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div className="flex items-center gap-2 text-foreground font-bold text-base">
            <Archive className="w-4 h-4 text-secondary" />
            Used Characters Widget ({usedChallenges.length} of {BIBLE_CHARACTERS.length})
          </div>
          <p className="text-xs text-foreground/40 font-medium">
            Characters listed here are excluded from the options dropdown above
          </p>
        </div>

        {usedChallenges.length === 0 ? (
          <div className="rounded-xl border border-dashed border-secondary/30 bg-[#FCF8F2] p-6 text-center text-xs text-foreground/50 font-medium">
            No characters have been used yet. All 30 characters are available in the options dropdown above.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {usedChallenges.map((uc) => {
              const ch = getCharacter(uc.character_id)
              const isActiveToday = uc.id === todayChallenge?.id
              return (
                <div
                  key={uc.id}
                  className={`flex items-start justify-between p-4 rounded-xl border transition ${
                    isActiveToday
                      ? 'bg-[#416047]/5 border-[#416047]/30'
                      : 'bg-[#FCF8F2] border-secondary/20'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-foreground">
                        {ch ? ch.name_en : uc.character_id}
                      </span>
                      <span className="text-xs text-foreground/50 font-medium" dir="rtl">
                        ({ch ? ch.name_ar : uc.character_id})
                      </span>
                      {isActiveToday ? (
                        <span className="bg-[#416047] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Active Today
                        </span>
                      ) : (
                        <span className="bg-secondary/15 text-secondary text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Used
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-foreground/50 font-medium">
                      <span>Date: {uc.active_date}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1 text-secondary font-semibold">
                        <Users className="w-3 h-3" />
                        {uc.solver_count} solvers
                      </span>
                    </div>
                  </div>

                  <form action={resetDailyChallenge}>
                    <input type="hidden" name="challengeId" value={uc.id} />
                    <button
                      type="submit"
                      title="Remove this challenge and restore this character to the dropdown options"
                      className="text-xs text-red-600 hover:text-red-700 font-bold underline transition cursor-pointer ml-3 mt-1"
                    >
                      Reset
                    </button>
                  </form>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
