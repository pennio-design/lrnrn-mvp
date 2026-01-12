
import React from 'react';
import { useStore } from '../../lib/store';
import { ArrowRight, Sparkles, LayoutDashboard, Zap } from 'lucide-react';

export default function HeroSection() {
  const { setView, user, curriculum } = useStore();

  const handleCTA = () => {
    if (!user) {
      setView('auth');
    } else {
      setView('questions');
    }
  };

  const resumeStrategy = () => {
    setView('curriculum');
  };

  return (
    <section className="relative pt-32 pb-20 px-6 bg-slate-50 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-amber-50 to-transparent opacity-50 -z-10" />
      
      <div className="max-w-5xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase animate-pulse">
          <Sparkles size={14} /> LRNRN Strategic Diagnostic
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-tight">
          Eliminate <span className="text-amber-500">Curriculum Doubt.</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          The opinionated AI strategist that skips the fluff and builds high-leverage roadmaps for dedicated builders.
        </p>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-center gap-4">
          {!user ? (
            <button 
              onClick={handleCTA}
              className="bg-slate-900 text-white px-10 py-5 rounded-full text-xl font-black hover:bg-slate-800 transition-all shadow-2xl hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto md:mx-0"
            >
              Get Started <ArrowRight size={24} />
            </button>
          ) : (
            <>
              {curriculum ? (
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <button 
                    onClick={resumeStrategy}
                    className="bg-amber-500 text-slate-900 px-10 py-5 rounded-full text-xl font-black hover:bg-amber-400 transition-all shadow-2xl hover:scale-105 active:scale-95 flex items-center gap-3"
                  >
                    Resume Active Path <Zap size={24} className="fill-current" />
                  </button>
                  <button 
                    onClick={() => setView('questions')}
                    className="bg-white border-2 border-slate-200 text-slate-600 px-10 py-5 rounded-full text-xl font-black hover:bg-slate-50 transition-all flex items-center gap-3"
                  >
                    New Strategy <LayoutDashboard size={24} />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setView('questions')}
                  className="bg-slate-900 text-white px-10 py-5 rounded-full text-xl font-black hover:bg-slate-800 transition-all shadow-2xl hover:scale-105 active:scale-95 flex items-center gap-3"
                >
                  Start First Diagnostic <ArrowRight size={24} />
                </button>
              )}
            </>
          )}
        </div>
        
        {!user && (
          <p className="mt-4 text-sm font-medium text-slate-400">Join 1,200+ self-learners engineering their own expertise.</p>
        )}
      </div>
    </section>
  );
}
