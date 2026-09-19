import { Users, Coins, Mail, Plus, Trophy, Cake } from 'lucide-react';
import { registerMember, distributeVerses, sendBirthdayAction } from '@/app/actions';
import { createAdminClient } from '@/utils/supabase/admin';
import AwardForm from './AwardForm';
import AdminSchedule from './AdminSchedule';
import { SubmitButton } from '@/components/SubmitButton';

export default async function AdminDashboard(props: { searchParams?: Promise<{ error?: string }> }) {
  const adminClient = createAdminClient();
  const { data: users } = await adminClient.from('profiles').select('id, email, full_name, date_of_birth').eq('role', 'user');
  const { data: allTransactions } = await adminClient.from('transactions').select('user_id, points_added, event_name');
  const { data: events } = await adminClient.from('events').select('*');

  const searchParams = await props.searchParams;
  const errorMsg = searchParams?.error;

  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();

  const upcomingBirthdays = (users || [])
    .filter(u => u.date_of_birth)
    .map(u => {
      const parts = u.date_of_birth.split('-');
      if (parts.length !== 3) return null;
      const month = parseInt(parts[1], 10);
      const day = parseInt(parts[2], 10);
      
      let nextBirthdayYear = today.getFullYear();
      if (month < currentMonth || (month === currentMonth && day < currentDay)) {
        nextBirthdayYear++;
      }
      
      const nextBday = new Date(nextBirthdayYear, month - 1, day);
      const daysUntil = Math.ceil((nextBday.getTime() - today.getTime()) / (1000 * 3600 * 24));
      
      return { ...u, month, day, daysUntil, nextBday };
    })
    .filter(Boolean)
    .sort((a, b) => (a as any).daysUntil - (b as any).daysUntil)
    .slice(0, 5);

  type LeaderboardEntry = {
    userId: string;
    name: string;
    totalCoins: number;
    badges: Set<string>;
  };

  const leaderboardMap = new Map<string, LeaderboardEntry>();
  
  users?.forEach(u => {
    leaderboardMap.set(u.id, { userId: u.id, name: u.full_name || u.email, totalCoins: 0, badges: new Set() });
  });

  allTransactions?.forEach(tx => {
    if (leaderboardMap.has(tx.user_id)) {
      const entry = leaderboardMap.get(tx.user_id)!;
      entry.totalCoins += tx.points_added;
      if (tx.event_name && tx.event_name !== 'Custom Points' && !tx.event_name.toLowerCase().includes('verse')) {
        entry.badges.add(tx.event_name);
      }
    }
  });

  const leaderboard = Array.from(leaderboardMap.values()).sort((a, b) => b.totalCoins - a.totalCoins);
  const uniqueScores = Array.from(new Set(leaderboard.map(u => u.totalCoins))).sort((a, b) => b - a);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 border-b border-secondary/30 pb-6">
        <h1 className="text-3xl font-bold text-foreground">Admin Controls</h1>
        <p className="text-sm text-foreground/60 mt-2">Manage the family, award UR-coins, and distribute the verses of the day.</p>
        
        {errorMsg && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
            ⚠️ Error: {errorMsg}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Register Member */}
        <div className="bg-white rounded-2xl p-8 border border-secondary/30 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-lg text-foreground">Register Member</h2>
          </div>
          <p className="text-xs text-foreground/60 mb-6 leading-relaxed flex-1">
            Add a new member. They will automatically receive a beautifully styled welcome email containing their login credentials.
          </p>
          <form className="space-y-5" action={registerMember}>
            <div>
              <label className="block text-[11px] font-bold text-foreground/50 uppercase tracking-widest mb-2">Full Name</label>
              <input name="fullName" type="text" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-gray-50 outline-none transition-all" placeholder="John Doe" required />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-foreground/50 uppercase tracking-widest mb-2">Email Address</label>
              <input name="email" type="email" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-gray-50 outline-none transition-all" placeholder="member@example.com" required />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-foreground/50 uppercase tracking-widest mb-2">Major</label>
              <input name="major" type="text" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-gray-50 outline-none transition-all" placeholder="e.g. Computer Science" required />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-foreground/50 uppercase tracking-widest mb-2">Birthday (Opt)</label>
              <div className="flex gap-2">
                <select name="dob_month" className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-gray-50 outline-none text-foreground/70">
                  <option value="">Month</option>
                  <option value="01">Jan</option>
                  <option value="02">Feb</option>
                  <option value="03">Mar</option>
                  <option value="04">Apr</option>
                  <option value="05">May</option>
                  <option value="06">Jun</option>
                  <option value="07">Jul</option>
                  <option value="08">Aug</option>
                  <option value="09">Sep</option>
                  <option value="10">Oct</option>
                  <option value="11">Nov</option>
                  <option value="12">Dec</option>
                </select>
                <select name="dob_day" className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-gray-50 outline-none text-foreground/70">
                  <option value="">Day</option>
                  {Array.from({length: 31}).map((_, i) => <option key={i} value={String(i+1).padStart(2, '0')}>{i+1}</option>)}
                </select>
                <input name="dob_year" type="number" placeholder="Year" min="1900" max={new Date().getFullYear()} className="w-20 px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-gray-50 outline-none" />
              </div>
            </div>
            <SubmitButton loadingText="Adding..." className="w-full bg-foreground text-white py-3 rounded-xl text-sm font-bold hover:bg-foreground/90 transition-colors shadow-sm">
              Add Member & Send Email
            </SubmitButton>
          </form>
        </div>

        {/* Upcoming Birthdays */}
        {upcomingBirthdays.length > 0 && (
          <div className="bg-white rounded-2xl p-8 border border-secondary/30 shadow-sm flex flex-col mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Cake className="w-5 h-5 text-secondary" />
              <h2 className="font-bold text-lg text-foreground">Upcoming Birthdays</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingBirthdays.map((u, i) => (
                <div key={i} className="border border-gray-100 bg-gray-50/50 rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-foreground">{u.full_name || u.email || 'Member'}</h3>
                    <p className="text-xs text-foreground/50 mb-3">
                      {u.nextBday.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} 
                      <span className="font-bold text-secondary ml-1">
                        ({u.daysUntil === 0 ? 'Today!' : `in ${u.daysUntil} day${u.daysUntil > 1 ? 's' : ''}`})
                      </span>
                    </p>
                  </div>
                  <form action={sendBirthdayAction}>
                    <input type="hidden" name="userId" value={u.id} />
                    <SubmitButton loadingText="Sending..." className="w-full bg-secondary/10 text-secondary hover:bg-secondary hover:text-white py-2 rounded-lg text-xs font-bold transition-colors">
                      Send Birthday Email
                    </SubmitButton>
                  </form>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Award UR-coins */}
        <AwardForm users={users || []} />

        {/* Verse of the Day */}
        <div className="bg-white rounded-2xl p-8 border border-secondary/30 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="w-5 h-5 text-secondary" />
            <h2 className="font-bold text-lg text-foreground">Distribute Verses</h2>
          </div>
          <p className="text-xs text-foreground/60 mb-6 leading-relaxed">
            Picks a daily pool of 10 random verses from your collection, then distributes 1 to everyone in small batches (20 at a time), or sends 1 to a specific targeted member.
          </p>
          <div className="bg-background border border-secondary/40 rounded-xl p-6 mb-6 text-center flex-1 flex flex-col justify-center items-center relative">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-3 bg-white px-2 text-secondary text-xl">✨</div>
             <p className="text-sm text-foreground font-medium mt-2">
              Ready to distribute verses to the family!
             </p>
          </div>
          <form action={distributeVerses} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-foreground/50 uppercase tracking-widest mb-2">Select Target</label>
              <select 
                name="userId" 
                className="w-full px-4 py-2 border border-secondary/30 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary text-sm bg-gray-50 outline-none transition-all"
              >
                <option value="all">Everyone (Send next 20)</option>
                {users?.map(u => (
                  <option key={u.id} value={u.id}>{u.full_name || u.email}</option>
                ))}
              </select>
            </div>
            <SubmitButton loadingText="Distributing..." className="w-full border-2 border-secondary text-secondary py-3 rounded-xl text-sm font-bold hover:bg-secondary hover:text-white transition-colors cursor-pointer">
              Randomize & Send Emails
            </SubmitButton>
          </form>
        </div>

      </div>
      
      <div className="mt-8">
        <AdminSchedule initialEvents={events || []} />
      </div>

      {/* Leaderboard Section */}
      <div className="mt-8 bg-white rounded-2xl p-8 border border-secondary/30 shadow-sm">
        <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
          <Trophy className="w-5 h-5 text-secondary" />
          <h2 className="font-bold text-xl text-foreground">Community Leaderboard</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="py-4 px-4 text-[11px] font-bold text-foreground/50 uppercase tracking-widest w-16">Rank</th>
                <th className="py-4 px-4 text-[11px] font-bold text-foreground/50 uppercase tracking-widest">Name</th>
                <th className="py-4 px-4 text-[11px] font-bold text-foreground/50 uppercase tracking-widest text-right">Coins</th>
                <th className="py-4 px-4 text-[11px] font-bold text-foreground/50 uppercase tracking-widest">Badges</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((user) => {
                const userRank = uniqueScores.indexOf(user.totalCoins) + 1;
                return (
                <tr key={user.userId} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-4 font-bold text-foreground/50">#{userRank}</td>
                  <td className="py-4 px-4 font-bold text-foreground">{user.name}</td>
                  <td className="py-4 px-4 font-black text-secondary text-right">{user.totalCoins}</td>
                  <td className="py-4 px-4 text-xs font-medium text-foreground/70">
                    {user.badges.size > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {Array.from(user.badges).map(badge => (
                          <span key={badge} className="bg-secondary/10 text-secondary px-2 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold">
                            {badge}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="opacity-50">—</span>
                    )}
                  </td>
                </tr>
                );
              })}
              {leaderboard.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-foreground/50 text-sm">
                    No members have earned points yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
