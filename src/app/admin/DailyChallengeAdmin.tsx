import { BookOpen, CalendarDays, Trophy, Users } from 'lucide-react'
import { BIBLE_CHARACTERS } from '@/data/bible-characters'
import { setDailyChallenge } from '@/app/actions'
import { SubmitButton } from '@/components/SubmitButton'

type DailyChallengeAdminProps = {
  todayChallenge: { id: string; character_id: string; active_date: string } | null
  recentChallenges: {
    id: string
    character_id: string
    active_date: string
    solver_count: number
  }[]
}

function getCharacter(characterId: string) {
  return BIBLE_CHARACTERS.find((c) => c.id === characterId) ?? null
}

export default function DailyChallengeAdmin({
  todayChallenge,
  recentChallenges,
}: DailyChallengeAdminProps) {
  const todayCharacter = todayChallenge ? getCharacter(todayChallenge.character_id) : null
  const todaySolverCount =
    recentChallenges.find((r) => r.active_date === todayChallenge?.active_date)?.solver_count ?? 0

  return (
    <div className="bg-white rounded-2xl p-8 border border-secondary/30 shadow-sm space-y-8">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <BookOpen className="w-5 h-5 text-secondary" />
        <h2 className="font-bold text-lg text-foreground">Who Am I? — Daily Bible Challenge</h2>
      </div>

      {/* Today's Active Challenge */}
      <div className="rounded-xl border border-primary/20 bg-[#FCF8F2] p-5 space-y-2">
        <div className="flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-wide">
          <CalendarDays className="w-4 h-4" />
          Today's Challenge
        </div>
        {todayCharacter && todayChallenge ? (
          <div className="space-y-1">
            <p className="text-foreground font-bold text-base">
              {todayCharacter.name_en}{' '}
              <span className="text-foreground/60 font-normal text-sm">({todayCharacter.name_ar})</span>
            </p>
            <p className="text-xs text-foreground/50">{todayChallenge.active_date}</p>
            <div className="flex items-center gap-1 text-xs text-secondary font-medium">
              <Users className="w-3 h-3" />
              {todaySolverCount} {todaySolverCount === 1 ? 'solver' : 'solvers'} today
            </div>
          </div>
        ) : (
          <p className="text-foreground/50 text-sm italic">No challenge set for today yet.</p>
        )}
      </div>

      {/* Set Today's Challenge Form */}
      <form action={setDailyChallenge} className="space-y-4">
        <label className="block text-sm font-semibold text-foreground/80" htmlFor="characterId">
          Set as Today's Character
        </label>
        <select
          id="characterId"
          name="characterId"
          required
          defaultValue={todayChallenge?.character_id ?? ''}
          className="w-full rounded-xl border border-secondary/30 bg-[#FCF8F2] px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition"
        >
          <option value="" disabled>
            — Choose a character —
          </option>
          {BIBLE_CHARACTERS.map((char) => (
            <option key={char.id} value={char.id}>
              {char.name_en} ({char.name_ar}) — {char.testament === 'OT' ? 'Old Testament' : 'New Testament'}
            </option>
          ))}
        </select>

        <SubmitButton className="w-full sm:w-auto rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-3 text-sm transition">
          Set as Today's Challenge
        </SubmitButton>
      </form>

      {/* Recent History */}
      {recentChallenges.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-foreground/70 font-semibold text-sm">
            <Trophy className="w-4 h-4 text-secondary" />
            Recent Challenges (Last 7 Days)
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
                  <div className="flex items-center gap-1 text-xs text-secondary font-semibold">
                    <Users className="w-3 h-3" />
                    {rc.solver_count}
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
