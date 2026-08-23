import { Users, Coins, Mail, Plus } from 'lucide-react';
import { registerMember, awardCoins, distributeVerses } from '@/app/actions';
import { createAdminClient } from '@/utils/supabase/admin';

export default async function AdminDashboard() {
  const adminClient = createAdminClient();
  const { data: users } = await adminClient.from('profiles').select('id, email, full_name').eq('role', 'user');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 border-b border-secondary/30 pb-6">
        <h1 className="text-3xl font-bold text-foreground">Admin Controls</h1>
        <p className="text-sm text-foreground/60 mt-2">Manage the family, award UR-coins, and distribute the verses of the day.</p>
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
              <label className="block text-[11px] font-bold text-foreground/50 uppercase tracking-widest mb-2">Email Address</label>
              <input name="email" type="email" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-gray-50 outline-none transition-all" placeholder="member@example.com" required />
            </div>
            <button type="submit" className="w-full bg-foreground text-white py-3 rounded-xl text-sm font-bold hover:bg-foreground/90 transition-colors shadow-sm">
              Add Member & Send Email
            </button>
          </form>
        </div>

        {/* Award UR-coins */}
        <div className="bg-white rounded-2xl p-8 border border-secondary/30 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <Coins className="w-5 h-5 text-secondary" />
            <h2 className="font-bold text-lg text-foreground">Award UR-coins</h2>
          </div>
          <p className="text-xs text-foreground/60 mb-6 leading-relaxed flex-1">
            Select a member to reward them. A nicely designed email will automatically notify them of their new UR-coins.
          </p>
          <form className="space-y-5" action={awardCoins}>
            <div>
              <label className="block text-[11px] font-bold text-foreground/50 uppercase tracking-widest mb-2">Select Member</label>
              <select name="userId" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-gray-50 outline-none transition-all" required>
                {users?.map(u => (
                  <option key={u.id} value={u.id}>{u.full_name || u.email}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-4">
              <div className="w-1/3">
                <label className="block text-[11px] font-bold text-foreground/50 uppercase tracking-widest mb-2">UR-coins</label>
                <input name="points" type="number" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-gray-50 outline-none transition-all" defaultValue={10} required />
              </div>
              <div className="w-2/3">
                <label className="block text-[11px] font-bold text-foreground/50 uppercase tracking-widest mb-2">Event Name</label>
                <input name="eventName" type="text" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-gray-50 outline-none transition-all" placeholder="e.g. Bible Study" required />
              </div>
            </div>
            <button type="submit" className="w-full bg-primary text-white py-3 rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Award UR-coins
            </button>
          </form>
        </div>

        {/* Verse of the Day */}
        <div className="bg-white rounded-2xl p-8 border border-secondary/30 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="w-5 h-5 text-secondary" />
            <h2 className="font-bold text-lg text-foreground">Distribute Verses</h2>
          </div>
          <p className="text-xs text-foreground/60 mb-6 leading-relaxed">
            Picks 3 unsent verses from your collection. Every member of the family will randomly receive 1 of these 3 verses.
          </p>
          <div className="bg-background border border-secondary/40 rounded-xl p-6 mb-6 text-center flex-1 flex flex-col justify-center items-center relative">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-3 bg-white px-2 text-secondary text-xl">✝</div>
             <p className="text-sm text-foreground font-medium mt-2">
              Ready to distribute 3 random verses to the family!
             </p>
          </div>
          <form action={distributeVerses}>
            <button type="submit" className="w-full border-2 border-secondary text-secondary py-3 rounded-xl text-sm font-bold hover:bg-secondary hover:text-white transition-colors cursor-pointer">
              Randomize & Send Emails
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
