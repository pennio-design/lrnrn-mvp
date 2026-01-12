import React, { useState } from 'react';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useStore } from '../lib/store';
import { Loader2, ArrowRight, User, Mail, Lock, Sparkles } from 'lucide-react';

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const setView = useStore(state => state.setView);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName: name });
      }
      setView('landing');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white">
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
            <Sparkles size={14} /> LRNRN Profile
          </div>
          <h1 className="text-4xl font-black">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
          <p className="text-slate-400">Save your custom strategies and track progress across devices.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-800 border border-slate-700 p-8 rounded-3xl shadow-2xl space-y-6">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400 flex items-center gap-2">
                <User size={14} /> Name
              </label>
              <input 
                required
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:border-amber-500 outline-none transition-colors"
                placeholder="Your name"
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400 flex items-center gap-2">
              <Mail size={14} /> Email Address
            </label>
            <input 
              required
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:border-amber-500 outline-none transition-colors"
              placeholder="name@example.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400 flex items-center gap-2">
              <Lock size={14} /> Password
            </label>
            <input 
              required
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:border-amber-500 outline-none transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20">
              {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-900 font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
          >
            {loading ? <Loader2 className="animate-spin" /> : (
              <>
                {isLogin ? 'Sign In' : 'Create Strategy Profile'} <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-slate-500 hover:text-white transition-colors text-sm font-medium"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
          </button>
        </div>
        
        <button 
          onClick={() => setView('landing')}
          className="w-full text-slate-600 hover:text-slate-400 transition-colors text-xs uppercase tracking-widest font-bold"
        >
          Cancel and return home
        </button>
      </div>
    </div>
  );
}