'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Cross } from 'lucide-react';
import { login } from '@/app/actions';

import { SubmitButton } from '@/components/SubmitButton';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const searchParams = useSearchParams();
  const errorMsg = searchParams.get('error');

  return (
    <div className="flex flex-col justify-center py-20 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-8">
          <div className="bg-white p-3 rounded-full shadow-md border border-secondary overflow-hidden">
            <img src="/logo.jpg" alt="The Upper Room Logo" className="h-36 w-36 object-cover rounded-full" />
          </div>
        </div>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-foreground">
          The Upper Room
        </h2>
        <p className="mt-2 text-center text-sm text-foreground/70">
          Sign in to access your UR Wallet
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-secondary">
          {errorMsg && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium text-center">
              {errorMsg === 'Invalid login credentials' 
                ? 'Incorrect email or password. Please try again.' 
                : errorMsg}
            </div>
          )}
          <form className="space-y-6" action={login}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-secondary rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-background/50"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-secondary rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-background/50"
                />
              </div>
            </div>

            <div>
              <SubmitButton
                loadingText="Signing in..."
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
              >
                Sign in to your Wallet
              </SubmitButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
