import { Users, Coins, Mail, Plus, Trophy } from 'lucide-react';
import { registerMember, distributeVerses } from '@/app/actions';
import { createAdminClient } from '@/utils/supabase/admin';
import AwardForm from './AwardForm';
import { SubmitButton } from '@/components/SubmitButton';

export default async function AdminDashboard(props: { searchParams?: Promise<{ error?: string }> }) {
  const adminClient = createAdminClient();
  const { data: users } = await adminClient.from('profiles').select('id, email, full_name').eq('role', 'user');
  const { data: allTransactions } = await adminClient.from('transactions').select('user_id, points_added, event_name');

  const searchParams = await props.searchParams;
  const errorMsg = searchParams?.error;

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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-foreground/50 uppercase tracking-widest mb-2">Major</label>
                <input name="major" type="text" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-gray-50 outline-none transition-all" placeholder="e.g. Computer Science" required />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-foreground/50 uppercase tracking-widest mb-2">Date of Birth</label>
                <input name="dob" type="date" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-gray-50 outline-none transition-all text-foreground/70" />
              </div>
            </div>
            <SubmitButton loadingText="Adding..." className="w-full bg-foreground text-white py-3 rounded-xl text-sm font-bold hover:bg-foreground/90 transition-colors shadow-sm">
              Add Member & Send Email
            </SubmitButton>
          </form>
        </div>

        {/* Award UR-coins */}
        <AwardForm users={users || []} />

        {/* Verse of the Day */}
        <div className="bg-white rounded-2xl p-8 border border-secondary/30 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="w-5 h-5 text-secondary" />
            <h2 className="font-bold text-lg text-foreground">Distribute Verses</h2>
          </div>
          <p className="text-xs text-foreground/60 mb-6 leading-relaxed">
            Picks a daily pool of 10 random verses from your collection, then distributes 1 to everyone, or sends 1 to a specific targeted member.
          </p>
          <div className="bg-background border border-secondary/40 rounded-xl p-6 mb-6 text-center flex-1 flex flex-col justify-center items-center relative">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-3 bg-white px-2 text-secondary text-xl">🕊️</div>
             <p className="text-sm text-foreground font-medium mt-2">
              Ready to distribute 10 random verses to the family!
             </p>
          </div>
          <form action={distributeVerses} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-foreground/50 uppercase tracking-widest mb-2">Select Target</label>
              <select 
                name="userId" 
                className="w-full px-4 py-2 border border-secondary/30 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary text-sm bg-gray-50 outline-none transition-all"
              >
                <option value="all">Everyone (All Members)</option>
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
