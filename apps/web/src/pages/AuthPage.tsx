import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { Mail, User, Settings, Shield, LogOut, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/Button';

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isSignUp, setIsSignUp] = useState(location.state?.isSignUp || false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    setIsSignUp(location.state?.isSignUp || false);
  }, [location.state]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEmailLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              full_name: name,
            },
          },
        });
        if (error) throw error;
        setMessage('Check your email for the confirmation link!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setIsEmailLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'An error occurred with Google Sign In.');
      setIsGoogleLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError(null);
    setMessage(null);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (user) {
    return (
      <div className="flex-1 w-full bg-[#09090b] flex flex-col">
        {/* Header / Cover Image Area */}
        <div className="relative h-28 md:h-36 bg-zinc-900 border-b border-zinc-800 flex flex-col items-center justify-end">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
          
          {/* Avatar overlaps the boundary */}
          <div className="relative z-10 w-20 h-20 rounded-full bg-brand-500 flex items-center justify-center text-3xl font-medium text-white border-4 border-[#09090b] translate-y-10">
            {(user.user_metadata?.full_name?.[0] || user.email?.[0] || 'U').toUpperCase()}
          </div>
        </div>

        {/* User Info */}
        <div className="pt-12 px-6 text-center">
          <h2 className="text-xl font-medium text-zinc-100 tracking-tight">
            {user.user_metadata?.full_name || 'Traveler'}
          </h2>
          <div className="flex items-center justify-center gap-1.5 mt-1 text-zinc-400 text-[13px]">
            <Mail className="w-3.5 h-3.5" />
            <span>{user.email}</span>
          </div>
        </div>

        {/* Settings Menu List */}
        <div className="flex-1 mt-6 px-4 pb-4 space-y-3 max-w-2xl mx-auto w-full">
          <button className="w-full flex items-center justify-between h-14 px-4 bg-dark-900/50 hover:bg-dark-900 border border-white/10 rounded-xl transition-colors shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                <User className="w-4 h-4 text-zinc-300" />
              </div>
              <span className="font-medium text-zinc-100 text-[14px]">Personal Information</span>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </button>
          
          <button className="w-full flex items-center justify-between h-14 px-4 bg-dark-900/50 hover:bg-dark-900 border border-white/10 rounded-xl transition-colors shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                <Settings className="w-4 h-4 text-zinc-300" />
              </div>
              <span className="font-medium text-zinc-100 text-[14px]">App Settings</span>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </button>

          <button className="w-full flex items-center justify-between h-14 px-4 bg-dark-900/50 hover:bg-dark-900 border border-white/10 rounded-xl transition-colors shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                <Shield className="w-4 h-4 text-zinc-300" />
              </div>
              <span className="font-medium text-zinc-100 text-[14px]">Privacy & Security</span>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </button>

          <div className="pt-2">
            <button 
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 h-14 px-4 bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 rounded-xl transition-colors shadow-sm group"
            >
              <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                <LogOut className="w-4 h-4 text-red-400" />
              </div>
              <span className="font-medium text-red-400 text-[14px]">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full flex flex-col relative bg-dark-950 overflow-y-auto overflow-x-hidden">
      {/* Simple decorative layer */}
      <div className="pointer-events-none absolute top-0 left-[-20%] w-[70%] h-[70%] rounded-full bg-brand-500/[0.03] blur-[120px]" />

      {/* Card Container */}
      <div className="relative z-10 w-full max-w-[420px] mx-auto my-auto py-12 px-4 sm:px-6">
        {/* Glass card */}
        <div className="bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] rounded-xl px-5 py-7 sm:px-6 shadow-2xl shadow-black/20">
          {/* Header Text */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h1>
            <p className="text-sm text-white/50 mt-1.5">
              {isSignUp
                ? 'Start planning your next adventure today.'
                : 'Sign in to access your travel plans.'}
            </p>
          </div>
          {/* Error alert */}
          {error && (
            <div className="mb-5 flex items-start gap-3 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl animate-[fadeIn_0.3s_ease-out]">
              <div className="shrink-0 w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center mt-0.5">
                <svg className="w-3 h-3 text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="text-sm text-red-300 leading-relaxed">{error}</p>
            </div>
          )}

          {/* Success alert */}
          {message && (
            <div className="mb-5 flex items-start gap-3 p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl animate-[fadeIn_0.3s_ease-out]">
              <div className="shrink-0 w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center mt-0.5">
                <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
              <p className="text-sm text-emerald-300 leading-relaxed">{message}</p>
            </div>
          )}

          {/* Google Sign In */}
          <Button
            variant="primary"
            onClick={handleGoogleSignIn}
            isLoading={isGoogleLoading}
            disabled={isEmailLoading}
            className="w-full h-9 bg-white hover:bg-gray-100 text-gray-900 shadow-sm"
          >
            {!isGoogleLoading && (
              <>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </>
            )}
          </Button>

          {/* Divider */}
          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.08]" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 text-xs uppercase tracking-widest text-white/30 bg-transparent font-medium select-none"
                style={{ background: 'linear-gradient(to right, transparent, rgba(15,23,42,0.8) 20%, rgba(15,23,42,0.8) 80%, transparent)' }}
              >
                Or continue with email
              </span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {/* Full Name - Sign Up only */}
            <div
              className={`transition-all duration-300 ease-out overflow-hidden ${
                isSignUp ? 'max-h-[80px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="relative group">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={isSignUp}
                  placeholder="Full Name"
                  className="peer w-full h-10 px-4 rounded-md bg-white/[0.05] border border-white/[0.08] text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20 transition-all duration-200"
                />
                <div className="pointer-events-none absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-brand-500/[0.03]" />
              </div>
            </div>

            {/* Email */}
            <div className="relative group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email address"
                className="peer w-full h-10 px-4 rounded-md bg-white/[0.05] border border-white/[0.08] text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20 transition-all duration-200"
              />
              <div className="pointer-events-none absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-brand-500/[0.03]" />
            </div>

            {/* Password */}
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Password"
                className="peer w-full h-10 pl-4 pr-10 rounded-md bg-white/[0.05] border border-white/[0.08] text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20 transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <div className="pointer-events-none absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-brand-500/[0.03]" />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="brand"
              disabled={!email || !password || isGoogleLoading}
              isLoading={isEmailLoading}
              className="w-full h-9 mt-4"
            >
              {isSignUp ? 'Create Account' : 'Sign In'}
            </Button>
          </form>

          {/* Toggle Mode */}
          <div className="mt-7 text-center">
            <p className="text-sm text-white/40">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={toggleMode}
                className="font-semibold text-brand-500 hover:text-brand-400 transition-colors duration-200 focus:outline-none"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Inline keyframes for fadeIn animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
