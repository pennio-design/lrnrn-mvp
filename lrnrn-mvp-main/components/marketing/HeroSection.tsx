
import React from 'react';
import { useStore } from '../../lib/store';
import { ArrowRight } from 'lucide-react';
import { Sparkles } from 'lucide-react';

export default function HeroSection() {
  const setView = useStore(state => state.setView);

  return (
    <section className="relative pt-32 pb-20 px-6 bg-slate-50 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-amber-50 to-transparent opacity-50 -z-10" />
      
      <div className="max-w-5xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase animate-bounce">
          <Sparkles size={14} /> Now Powered by Gemini 3.0
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-tight">
          Eliminate <span className="text-amber-500">Curriculum Doubt.</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Stop wondering what to learn next. Get an opinionated, strategic roadmap designed for your specific project goal.
        </p>

        <div className="pt-8">
          <button 
            onClick={() => setView('questions')}
            className="bg-slate-900 text-white px-10 py-5 rounded-full text-xl font-black hover:bg-slate-800 transition-all shadow-2xl hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto"
          >
            Design My Strategy <ArrowRight size={24} />
          </button>
          <p className="mt-4 text-sm font-medium text-slate-400">No account required. Free for dedicated self-learners.</p>
        </div>
      </div>
    </section>
  );
}
