import { Trophy, History, BookOpen, Music, Book, Home, HeartHandshake, Package, Flame, Star, User } from 'lucide-react';
import AnimatedWallet from '@/components/AnimatedWallet';
import URCoin from '@/components/URCoin';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { PACKAGES } from '@/lib/packages';
import Link from 'next/link';

export default async function WalletPage({ searchParams }: { searchParams?: { tab?: string } }) {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  
  if (!authData.user) {
    redirect('/');
  }

  // Get current tab from search params or default to 'profile'
  const currentTab = searchParams?.tab || 'profile';

  // Fetch transactions
  const { data: txs } = await supabase
    .from('transactions')
    .select('points_added, event_name, created_at')
    .eq('user_id', authData.user.id)
    .order('created_at', { ascending: false });
    
  const totalCoins = txs?.reduce((sum, tx) => sum + tx.points_added, 0) || 0;

  // Calculate collected packages
  const collectedPackages: Record<string, number> = {};
  txs?.forEach(tx => {
    collectedPackages[tx.event_name] = (collectedPackages[tx.event_name] || 0) + 1;
  });

  // Fetch verses
  const { data: verses } = await supabase
    .from('verses')
    .select('verse_text, reference')
    .eq('user_id', authData.user.id);

  // Calculate Rank
  const { data: allTxs } = await supabase.from('transactions').select('user_id, points_added');
  const userTotals: Record<string, number> = {};
  allTxs?.forEach(tx => {
    userTotals[tx.user_id] = (userTotals[tx.user_id] || 0) + tx.points_added;
  });
  
  const uniqueScores = Array.from(new Set(Object.values(userTotals))).sort((a, b) => b - a);
  const myRank = uniqueScores.indexOf(totalCoins) + 1;

  // Fetch Profile
  const { data: profile } = await supabase.from('profiles').select('full_name, major, date_of_birth, email').eq('id', authData.user.id).single();
  const displayName = profile?.full_name ? profile.full_name.split(' ')[0] : 'My';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
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

      {/* Tabs Navigation */}
      <div className="flex overflow-x-auto gap-2 mb-8 pb-2 border-b border-foreground/10">
        {[
          { id: 'profile', label: 'Profile', icon: User },
          { id: 'wallet', label: 'UR Wallet', icon: Trophy },
          { id: 'verses', label: 'Verses Collected', icon: BookOpen },
          { id: 'badges', label: 'Badges', icon: Package }
        ].map(tab => {
          const isActive = currentTab === tab.id;
          const Icon = tab.icon;
          return (
            <Link 
              key={tab.id} 
              href={`?tab=${tab.id}`}
              className={`flex items-center gap-2 px-5 py-3 rounded-t-xl font-bold text-sm whitespace-nowrap transition-colors ${isActive ? 'bg-secondary text-white shadow-sm' : 'text-foreground/70 hover:bg-black/5'}`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </Link>
          )
        })}
      </div>

      {currentTab === 'profile' && (
        <div className="bg-zakhrafa rounded-2xl p-8 border border-secondary/30 shadow-sm">
          <h2 className="text-2xl font-bold text-foreground mb-6">Profile Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-1">
              <p className="text-xs font-bold text-foreground/50 uppercase tracking-widest">Full Name</p>
              <p className="text-lg font-medium text-foreground">{profile?.full_name || '-'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-foreground/50 uppercase tracking-widest">Email Address</p>
              <p className="text-lg font-medium text-foreground">{authData.user.email || profile?.email || '-'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-foreground/50 uppercase tracking-widest">Major</p>
              <p className="text-lg font-medium text-foreground">{profile?.major || '-'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-foreground/50 uppercase tracking-widest">Date of Birth</p>
              <p className="text-lg font-medium text-foreground">{profile?.date_of_birth ? new Date(profile.date_of_birth).toLocaleDateString() : '-'}</p>
            </div>
          </div>
        </div>
      )}

      {currentTab === 'wallet' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* UR-Coins Card */}
          <div className="md:col-span-1 bg-zakhrafa text-foreground rounded-2xl p-6 border border-secondary/30 shadow-sm relative overflow-hidden flex flex-col items-center justify-center min-h-[300px]">
            <div className="absolute bottom-0 left-0 -ml-2 mb-[-20px] opacity-90 scale-75 origin-bottom-left">
              <AnimatedWallet />
            </div>
            
            <div className="relative z-20 w-48 h-48 mt-4">
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
                      <p className="font-bold text-foreground text-sm">{tx.event_name}</p>
                      <p className="text-[10px] text-foreground/50 mt-1 font-medium tracking-wide uppercase">{new Date(tx.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center text-primary font-bold bg-primary/10 px-4 py-1.5 rounded-full text-sm shrink-0">
                      <URCoin className="w-5 h-5 text-[10px] mr-2" /> +{tx.points_added}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {currentTab === 'badges' && (
        <div className="bg-zakhrafa rounded-2xl p-8 border border-secondary/30 shadow-sm">
          <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
            <Package className="w-5 h-5 text-secondary" />
            <h2 className="text-xl font-bold text-foreground">Collected Packages</h2>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 mt-4">
            {Object.values(PACKAGES).map(pkg => {
              const count = collectedPackages[pkg.name] || 0;
              const isCollected = count > 0;
              
              if (pkg.id === 'david') {
                return (
                  <div key={pkg.id} className={`relative flex flex-col items-center justify-center w-full max-w-[170px] aspect-square transition-all duration-300 ${isCollected ? 'hover:scale-105' : 'opacity-50 grayscale hover:opacity-80'}`}>
                    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full drop-shadow-md">
                      <circle cx="50" cy="50" r="48" fill="#324b4c" />
                      <circle cx="50" cy="50" r="43" fill="none" stroke="#FCF8F2" strokeWidth="1.5" strokeDasharray="3 3" />
                    </svg>
                    <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
                      <Music className="w-7 h-7 text-[#FCF8F2] mb-1.5" />
                      <span className="text-[#FCF8F2] font-black text-xs sm:text-sm tracking-widest uppercase leading-none">David</span>
                      <span className="text-[#FCF8F2] font-bold text-[8px] sm:text-[9px] tracking-wider uppercase opacity-80 mt-1">Tasbeha</span>
                      <div className="mt-2.5 bg-[#FCF8F2] text-[#324b4c] text-[8px] sm:text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-widest shadow-sm">
                        {count > 0 ? `${count}x Earned` : 'Locked'}
                      </div>
                    </div>
                  </div>
                );
              }
              if (pkg.id === 'samuel') {
                return (
                  <div key={pkg.id} className={`relative flex flex-col items-center justify-center w-full max-w-[170px] aspect-square transition-all duration-300 ${isCollected ? 'hover:scale-105' : 'opacity-50 grayscale hover:opacity-80'}`}>
                    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full drop-shadow-md">
                      <polygon points="50,2 95,25 95,75 50,98 5,75 5,25" fill="#d88452" />
                      <polygon points="50,8 89,30 89,70 50,92 11,70 11,30" fill="none" stroke="#FCF8F2" strokeWidth="1.5" />
                    </svg>
                    <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 mt-1">
                      <Book className="w-7 h-7 text-[#FCF8F2] mb-1.5" />
                      <span className="text-[#FCF8F2] font-black text-xs sm:text-sm tracking-widest uppercase leading-none">Samuel</span>
                      <span className="text-[#FCF8F2] font-bold text-[8px] sm:text-[9px] tracking-wider uppercase opacity-80 mt-1">Bible Study</span>
                      <div className="mt-2.5 bg-[#FCF8F2] text-[#d88452] text-[8px] sm:text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-widest shadow-sm">
                        {count > 0 ? `${count}x Earned` : 'Locked'}
                      </div>
                    </div>
                  </div>
                );
              }
              if (pkg.id === 'upper_room') {
                return (
                  <div key={pkg.id} className={`relative flex flex-col items-center justify-center w-full max-w-[170px] aspect-square transition-all duration-300 ${isCollected ? 'hover:scale-105' : 'opacity-50 grayscale hover:opacity-80'}`}>
                    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full drop-shadow-md">
                      <path d="M12,5 L88,5 L88,40 C88,75 50,98 50,98 C50,98 12,75 12,40 Z" fill="#223637" />
                      <path d="M17,10 L83,10 L83,40 C83,70 50,89 50,89 C50,89 17,70 17,40 Z" fill="none" stroke="#FCF8F2" strokeWidth="1.5" />
                    </svg>
                    <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 mb-2">
                      <Home className="w-7 h-7 text-[#FCF8F2] mb-1.5" />
                      <span className="text-[#FCF8F2] font-black text-[10px] sm:text-xs tracking-widest uppercase leading-none mt-0.5">Upper Room</span>
                      <span className="text-[#FCF8F2] font-bold text-[8px] sm:text-[9px] tracking-wider uppercase opacity-80 mt-1">Fellowship</span>
                      <div className="mt-2.5 bg-[#FCF8F2] text-[#223637] text-[8px] sm:text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-widest shadow-sm">
                        {count > 0 ? `${count}x Earned` : 'Locked'}
                      </div>
                    </div>
                  </div>
                );
              }
              if (pkg.id === 'paul') {
                return (
                  <div key={pkg.id} className={`relative flex flex-col items-center justify-center w-full max-w-[170px] aspect-square transition-all duration-300 ${isCollected ? 'hover:scale-105' : 'opacity-50 grayscale hover:opacity-80'}`}>
                    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full drop-shadow-md">
                      <polygon points="30,5 70,5 95,30 95,70 70,95 30,95 5,70 5,30" fill="#b75d32" />
                      <polygon points="32,10 68,10 90,32 90,68 68,90 32,90 10,68 10,32" fill="none" stroke="#FCF8F2" strokeWidth="1.5" />
                    </svg>
                    <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
                      <HeartHandshake className="w-7 h-7 text-[#FCF8F2] mb-1.5" />
                      <span className="text-[#FCF8F2] font-black text-xs sm:text-sm tracking-widest uppercase leading-none">St. Paul</span>
                      <span className="text-[#FCF8F2] font-bold text-[8px] sm:text-[9px] tracking-wider uppercase opacity-80 mt-1">Service</span>
                      <div className="mt-2.5 bg-[#FCF8F2] text-[#b75d32] text-[8px] sm:text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-widest shadow-sm">
                        {count > 0 ? `${count}x Earned` : 'Locked'}
                      </div>
                    </div>
                  </div>
                );
              }
              if (pkg.id === 'nehemiah') {
                return (
                  <div key={pkg.id} className={`relative flex flex-col items-center justify-center w-full max-w-[170px] aspect-square transition-all duration-300 ${isCollected ? 'hover:scale-105' : 'opacity-50 grayscale hover:opacity-80'}`}>
                    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full drop-shadow-md">
                      {/* Horizontal Hexagon Badge */}
                      <polygon points="25,5 75,5 95,50 75,95 25,95 5,50" fill="#3b5c5e" />
                      <polygon points="28,11 72,11 89,50 72,89 28,89 11,50" fill="none" stroke="#FCF8F2" strokeWidth="1.5" />
                    </svg>
                    <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
                      <Flame className="w-7 h-7 text-[#FCF8F2] mb-1.5" />
                      <span className="text-[#FCF8F2] font-black text-[10px] sm:text-xs tracking-widest uppercase leading-none mt-1">Nehemiah</span>
                      <span className="text-[#FCF8F2] font-bold text-[8px] sm:text-[9px] tracking-wider uppercase opacity-80 mt-1">Engager</span>
                      <div className="mt-2.5 bg-[#FCF8F2] text-[#3b5c5e] text-[8px] sm:text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-widest shadow-sm">
                        {count > 0 ? `${count}x Earned` : 'Locked'}
                      </div>
                    </div>
                  </div>
                );
              }
              if (pkg.id === 'christmas_night') {
                return (
                  <div key={pkg.id} className={`relative flex flex-col items-center justify-center w-full max-w-[170px] aspect-square transition-all duration-300 ${isCollected ? 'hover:scale-105' : 'opacity-50 grayscale hover:opacity-80'}`}>
                    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full drop-shadow-md">
                      <polygon points="50,5 61,35 95,35 68,57 79,90 50,70 21,90 32,57 5,35 39,35" fill="#c84b31" />
                      <polygon points="50,12 59,38 86,38 64,55 72,81 50,65 28,81 36,55 14,38 41,38" fill="none" stroke="#FCF8F2" strokeWidth="1.5" />
                    </svg>
                    <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 mt-2">
                      <Star className="w-6 h-6 text-[#FCF8F2] mb-1" fill="#FCF8F2" />
                      <span className="text-[#FCF8F2] font-black text-[10px] sm:text-[11px] tracking-widest uppercase leading-none mt-0.5">Christmas</span>
                      <span className="text-[#FCF8F2] font-bold text-[8px] sm:text-[9px] tracking-wider uppercase opacity-90 mt-1">Major Event</span>
                      <div className="mt-2 bg-[#FCF8F2] text-[#c84b31] text-[8px] sm:text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-widest shadow-sm">
                        {count > 0 ? `${count}x Earned` : 'Locked'}
                      </div>
                    </div>
                  </div>
                );
              }
              
              return null;
            })}
          </div>
        </div>
      )}

      {currentTab === 'verses' && (
        <div className="bg-zakhrafa rounded-2xl p-8 border border-secondary/30 shadow-sm">
          <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
            <BookOpen className="w-5 h-5 text-secondary" />
            <h2 className="text-xl font-bold text-foreground">Echoes from the Upper Room</h2>
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
      )}
    </div>
  );
}
