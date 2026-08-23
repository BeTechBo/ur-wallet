import Link from 'next/link';
import { Cross } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="w-full bg-white border-b border-secondary shadow-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-24 items-center">
          
          <Link href="/" className="flex items-center space-x-4">
            <div className="bg-white rounded-full overflow-hidden border border-secondary shadow-sm">
              <img src="/logo.jpg" alt="Logo" className="h-20 w-20 object-cover" />
            </div>
            <div>
              <span className="text-xl font-bold text-foreground block">
                The Upper Room
              </span>
              <span className="text-xs text-primary font-medium tracking-widest uppercase">
                UR Wallet
              </span>
            </div>
          </Link>
          
          {/* We will add navigation links here depending on if user is admin/normal */}
        </div>
      </div>
    </nav>
  );
}
