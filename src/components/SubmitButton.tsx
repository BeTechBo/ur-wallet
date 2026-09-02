'use client';

import { useFormStatus } from 'react-dom';
import { Loader2 } from 'lucide-react';

export function SubmitButton({ 
  children, 
  loadingText = "Processing...", 
  className = "",
  icon = null,
  disabled = false
}: { 
  children: React.ReactNode, 
  loadingText?: string, 
  className?: string,
  icon?: React.ReactNode,
  disabled?: boolean
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className={`relative overflow-hidden transition-all ${className} ${pending ? 'opacity-90 cursor-wait' : disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <div className="flex items-center justify-center gap-2">
        {pending ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>{loadingText}</span>
          </>
        ) : (
          <>
            {icon}
            {children}
          </>
        )}
      </div>
      
      {/* Indeterminate Progress Bar */}
      {pending && (
        <div className="absolute bottom-0 left-0 h-1 w-full overflow-hidden bg-black/10">
          <div className="h-full bg-white/40 animate-[indeterminate_1.5s_infinite_linear] origin-left w-full" 
               style={{ transformOrigin: '0% 50%', animation: 'indeterminate 1.5s infinite linear' }} 
          />
        </div>
      )}
    </button>
  );
}
