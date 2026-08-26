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
          
          <div className="flex items-center gap-4">
            <a 
              href="https://www.instagram.com/the_upper_room_gathering" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors p-2 bg-gray-50 hover:bg-gray-100 rounded-full border border-gray-200"
              title="Follow us on Instagram"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
