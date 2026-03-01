'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Handshake, Mail, Eye, EyeOff, LogIn, Lock, X } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotDialog, setShowForgotDialog] = useState(false);

  const handleBack = () => {
    router.push('/');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Save token to localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirect based on role
      if (data.user.role === 'BROTHER') {
        router.push('/brother');
      } else if (data.user.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('brother/dashboard');
      }
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const openWhatsApp = (phoneNumber: string) => {
    const whatsappUrl = `https://wa.me/${phoneNumber}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="bg-[#f6f6f8] dark:bg-[#101622] font-[Manrope,sans-serif] min-h-screen flex flex-col">
      {/* Top Navigation Bar (iOS Style) */}
      <header className="flex items-center justify-between p-4 bg-[#f6f6f8] dark:bg-[#101622]">
        <button
          onClick={handleBack}
          className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 text-slate-900 dark:text-slate-100" />
        </button>
        <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight flex-1 text-center">
          Brotherhood Fund
        </h2>
        <div className="w-9" /> {/* Spacer for alignment */}
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
        {/* Hero Section */}
        <div className="w-full max-w-sm text-center mb-6">
          <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#135bec]/10 text-[#135bec]">
            <Handshake className="w-10 h-10" />
          </div>
          <h1 className="text-slate-900 dark:text-slate-100 text-3xl font-extrabold leading-tight tracking-tight mb-2">
            Welcome Brother!
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-base font-normal">
            Always Keep Money Secondary<br/>but Our Unity Primary❤️
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="w-full max-w-sm mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Login Form Card */}
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5">
          {/* Email Input */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-slate-900 dark:text-slate-100 text-sm font-semibold ml-1">
              Email Address
            </label>
            <div className="relative flex items-center group">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-14 pl-4 pr-12 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#135bec] focus:border-transparent transition-all outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                placeholder="name@brotherhood.com"
                required
                disabled={isLoading}
              />
              <div className="absolute right-4 text-slate-400 dark:text-slate-500 group-focus-within:text-[#135bec] transition-colors">
                <Mail className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label htmlFor="password" className="text-slate-900 dark:text-slate-100 text-sm font-semibold">
                Password
              </label>
              <button 
                type="button"
                onClick={() => setShowForgotDialog(true)}
                className="text-[#135bec] text-xs font-bold hover:underline cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative flex items-center group">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-14 pl-4 pr-12 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#135bec] focus:border-transparent transition-all outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-4 text-slate-400 dark:text-slate-500 group-focus-within:text-[#135bec] transition-colors cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Remember Me & Submit */}
          <div className="pt-2">
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-[#135bec] text-white font-bold rounded-xl shadow-lg shadow-[#135bec]/30 hover:bg-[#135bec]/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <LogIn className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="mt-auto pt-5 text-center">
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
            Facing issues?
          </p>
          <button
            onClick={() => openWhatsApp('+1234567890')} // Replace with actual contact number
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-bold transition-colors hover:bg-slate-300 dark:hover:bg-slate-700 cursor-pointer"
          >
            Contact Admin
          </button>

          {/* Secure Badge */}
          <div className="mt-8 flex items-center justify-center gap-2 text-slate-400 dark:text-slate-500">
            <Lock className="w-4 h-4" />
            <span className="text-[10px] uppercase tracking-widest font-bold">
              Secure Encrypted Portal
            </span>
          </div>
        </div>
      </main>

      {/* Forgot Password Dialog */}
      {showForgotDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowForgotDialog(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Forgot Password?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Please contact the Head Brother for password reset assistance.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => openWhatsApp('+1987654321')} // Replace with Head Brother's number
                className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.91 2.78 15.79 3.93 17.33L2.09 21.87L6.82 20.07C8.32 21.08 10.06 21.66 12.05 21.66C17.51 21.66 21.96 17.21 21.96 11.75C21.96 6.29 17.5 2 12.04 2ZM12.05 19.96C10.34 19.96 8.7 19.43 7.34 18.49L6.99 18.27L4.31 19.17L5.24 16.62L5 16.24C3.94 14.8 3.34 13.08 3.34 11.26C3.34 6.7 7.08 3.01 12.04 3.01C16.99 3.01 20.73 6.75 20.73 11.71C20.73 16.67 16.99 19.96 12.05 19.96ZM16.3 14.29C16.01 14.14 14.96 13.62 14.69 13.52C14.42 13.42 14.21 13.37 14.01 13.66C13.81 13.95 13.25 14.43 13.07 14.63C12.89 14.83 12.71 14.85 12.42 14.7C12.13 14.55 11.42 14.29 10.58 13.54C9.92 12.97 9.47 12.26 9.29 11.97C9.11 11.68 9.27 11.51 9.43 11.36C9.57 11.23 9.74 11.02 9.9 10.84C10.06 10.66 10.13 10.52 10.23 10.32C10.33 10.12 10.28 9.94 10.21 9.79C10.14 9.64 9.7 8.58 9.52 8.15C9.34 7.73 9.15 7.78 9.01 7.78C8.87 7.78 8.71 7.78 8.55 7.78C8.39 7.78 8.13 7.84 7.91 8.08C7.69 8.32 7.13 8.84 7.13 9.9C7.13 10.96 7.91 11.98 8.03 12.14C8.15 12.3 9.46 14.28 11.53 15.14C12.72 15.66 13.34 15.85 14.11 15.94C14.88 16.03 15.57 15.86 16.1 15.63C16.63 15.4 17.59 14.94 17.76 14.45C17.93 13.96 17.93 13.54 17.86 13.43C17.79 13.32 17.58 13.25 17.29 13.14C17 13.03 16.3 14.29 16.3 14.29Z"/>
                </svg>
                Contact Head Brother on WhatsApp
              </button>

              <button
                onClick={() => setShowForgotDialog(false)}
                className="w-full py-3 px-4 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Indicator for iOS */}
      <div className="h-1.5 w-32 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mb-2 shrink-0" />
    </div>
  );
}