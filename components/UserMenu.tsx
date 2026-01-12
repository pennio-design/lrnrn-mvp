import React from 'react';
import { useStore } from '../lib/store';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { User, LogOut, LogIn } from 'lucide-react';

export default function UserMenu() {
  const { user, setView } = useStore();

  if (!user) {
    return (
      <button 
        onClick={() => setView('auth')}
        className="flex items-center gap-2 text-sm font-bold bg-slate-900 text-white px-4 py-2 rounded-full hover:bg-slate-800 transition-colors shadow-sm"
      >
        <LogIn size={16} /> Sign In
      </button>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="hidden md:flex flex-col items-end">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter leading-none">Logged in as</span>
        <span className="text-sm font-bold text-slate-900 leading-tight">{user.displayName || user.email}</span>
      </div>
      <div className="h-10 w-10 bg-amber-100 border border-amber-200 rounded-full flex items-center justify-center text-amber-700 shadow-sm">
        <User size={20} />
      </div>
      <button 
        onClick={() => signOut(auth)}
        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
        title="Sign Out"
      >
        <LogOut size={20} />
      </button>
    </div>
  );
}