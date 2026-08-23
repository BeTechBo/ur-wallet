import { Trophy, History, BookOpen } from 'lucide-react';
import AnimatedWallet from '@/components/AnimatedWallet';
import URCoin from '@/components/URCoin';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function WalletPage() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  
  if (!authData.user) {
    redirect('/');
  }

  // Fetch transactions
  const { data: txs } = await supabase
    .from('transactions')
    .select('amount, reason, created_at')
    .eq('user_id', authData.user.id)
    .order('created_at', { ascending: false });
    
  const totalCoins = txs?.reduce((sum, tx) => sum + tx.amount, 0) || 0;

  // Fetch verses
  const { data: verses } = await supabase
    .from('verses')
    .select('verse_text, reference')
    .eq('user_id', authData.user.id);

  // Calculate Rank
  const { data: allTxs } = await supabase.from('transactions').select('user_id, amount');
  const userTotals: Record<string, number> = {};
  allTxs?.forEach(tx => {
    userTotals[tx.user_id] = (userTotals[tx.user_id] || 0) + tx.amount;
  });
  
  const uniqueScores = Array.from(new Set(Object.values(userTotals))).sort((a, b) => b - a);
  const myRank = uniqueScores.indexOf(totalCoins) + 1;

  // Fetch Profile
  const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', authData.user.id).single();
  const displayName = profile?.full_name ? profile.full_name.split(' ')[0] : 'My';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{displayName}{displayName === 'My' ? '' : "'s"} UR Wallet</h1>
            <p className="text-sm text-foreground/70 mt-1">Tracking your journey with The Upper Room family.</p>
          </div>
        </div>
        <div className="mt-6 md:mt-0 flex items-center gap-4 bg-zakhrafa px-6 py-3 rounded-full border border-secondary/50 shadow-sm">
          <Trophy className="w-6 h-6 text-primary" />
          <div className="flex flex-col">
            <span className="text-[10px] text-foreground/50 font-bold uppercase tracking-widest">Current Rank</span>
            <span className="text-lg font-bold text-foreground">#{myRank || '-'}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* UR-Coins Card with Circular Ring */}
        <div className="md:col-span-1 bg-zakhrafa text-foreground rounded-2xl p-6 border border-secondary/30 shadow-sm relative overflow-hidden flex flex-col items-center justify-center min-h-[300px]">
          <div className="absolute bottom-0 left-0 -ml-2 mb-[-20px] opacity-90 scale-75 origin-bottom-left">
            <AnimatedWallet />
          </div>
          
          <div className="relative z-20 w-48 h-48 mt-4">
             {/* Solid Circular Ring */}
             <svg className="w-full h-full" viewBox="0 0 100 100">
               <circle cx="50" cy="50" r="42" stroke="var(--secondary)" strokeWidth="6" fill="none" className="text-secondary" />
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center text-center mt-1">
               <span className="text-[9px] uppercase tracking-widest font-bold opacity-80 mb-1">Total</span>
               <span className="text-4xl font-bold tracking-tight">{totalCoins}</span>
               <span className="text-[9px] uppercase tracking-widest font-bold opacity-80 mt-1">UR-coins</span>
             </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="md:col-span-2 bg-zakhrafa rounded-2xl p-8 border border-secondary/30 shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
            <History className="w-5 h-5 text-secondary" />
            <h2 className="text-xl font-bold text-foreground">Recent Activity</h2>
          </div>
          
          <div className="space-y-4 overflow-y-auto flex-1 pr-2">
            {txs?.length === 0 ? (
              <p className="text-sm text-foreground/50 italic">No activity yet. Attend gatherings to earn UR-coins!</p>
            ) : (
              txs?.map((tx, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 hover:bg-black/5 rounded-xl transition-colors border border-transparent hover:border-black/5">
                  <div>
                    <p className="font-bold text-foreground text-sm">{tx.reason}</p>
                    <p className="text-[10px] text-foreground/50 mt-1 font-medium tracking-wide uppercase">{new Date(tx.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center text-primary font-bold bg-primary/10 px-4 py-1.5 rounded-full text-sm shrink-0">
                    <URCoin className="w-5 h-5 text-[10px] mr-2" /> +{tx.amount}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Verses Section */}
      <div className="mt-6 bg-zakhrafa rounded-2xl p-8 border border-secondary/30 shadow-sm">
        <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
          <BookOpen className="w-5 h-5 text-secondary" />
          <h2 className="text-xl font-bold text-foreground">Collected Verses</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {verses?.length === 0 ? (
             <p className="text-sm text-foreground/50 italic col-span-full">No verses collected yet.</p>
          ) : (
            verses?.map((verse, idx) => (
              <div key={idx} className="bg-background border border-secondary/40 rounded-xl p-8 text-center hover:shadow-md transition-shadow relative">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-3 bg-[#FCF8F2] px-2 text-secondary text-xl">✝</div>
                 <p className="text-lg text-foreground font-medium leading-loose mt-2" dir="rtl">
                  "{verse.verse_text}"
                 </p>
                 <p className="text-xs text-secondary font-bold mt-6 tracking-wider">({verse.reference})</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
