import React, { useEffect } from 'react';
import { useStore } from './lib/store';
import { auth } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getLatestCurriculum } from './lib/db';
import HeroSection from './components/marketing/HeroSection';
import ComparisonTable from './components/marketing/ComparisonTable';
import QuestionFlow from './components/QuestionFlow';
import CurriculumRoadmap from './components/CurriculumRoadmap';
import AuthForm from './components/AuthForm';
import UserMenu from './components/UserMenu';
import { Loader2, RefreshCcw } from 'lucide-react';

function GeneratingView() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-center p-6 space-y-6">
      <Loader2 size={48} className="text-amber-500 animate-spin" />
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white">Synthesizing Your Strategy...</h2>
        <p className="text-slate-400 max-w-sm mx-auto">
          Gemini is analyzing your project goals and cross-referencing high-quality resources. This usually takes 10-15 seconds.
        </p>
      </div>
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
        <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
        <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" />
      </div>
    </div>
  );
}

export default function App() {
  const { view, user, setUser, setAuthLoading, setCurriculum, curriculum } = useStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setAuthLoading(false);
      
      if (u && !curriculum) {
        try {
          const saved = await getLatestCurriculum(u.uid);
          if (saved) {
            setCurriculum(saved);
          }
        } catch (err) {
          console.error("Error fetching initial curriculum:", err);
        }
      }
    });
    return () => unsubscribe();
  }, [user, curriculum]);

  return (
    <main className="antialiased selection:bg-amber-100 selection:text-amber-900">
      {view === 'landing' && (
        <>
          <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
              <span className="text-2xl font-black tracking-tighter text-slate-900 italic">LRNRN</span>
              <div className="flex items-center gap-8">
                <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-500 uppercase tracking-widest">
                  <a href="#about" className="hover:text-amber-500">Methodology</a>
                </div>
                <UserMenu />
              </div>
            </div>
          </nav>
          
          <HeroSection />
          
          {user && curriculum && (
            <div className="max-w-5xl mx-auto px-6 -mt-10 mb-20 relative z-10">
              <button 
                onClick={() => useStore.getState().setView('curriculum')}
                className="w-full bg-white border-2 border-amber-500/20 p-6 rounded-3xl shadow-xl flex items-center justify-between hover:border-amber-500 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-100 rounded-2xl text-amber-600">
                    <RefreshCcw size={24} />
                  </div>
                  <div className="text-left">
                    <span className="block text-xs font-bold text-amber-600 uppercase tracking-widest">Active Strategy</span>
                    <h3 className="text-xl font-bold text-slate-900">{curriculum.title}</h3>
                  </div>
                </div>
                <div className="bg-slate-900 text-white px-6 py-2 rounded-full font-bold group-hover:scale-105 transition-transform">
                  Resume Path
                </div>
              </button>
            </div>
          )}

          <ComparisonTable />
          <footer className="bg-slate-50 py-12 px-6 border-t border-slate-100">
            <div className="max-w-5xl mx-auto text-center">
              <p className="text-slate-400 text-sm font-mono uppercase tracking-widest">
                LRNRN is an experiment in AI-native pedagogical engineering.
              </p>
            </div>
          </footer>
        </>
      )}

      {view === 'questions' && <QuestionFlow />}
      {view === 'generating' && <GeneratingView />}
      {view === 'curriculum' && <CurriculumRoadmap />}
      {view === 'auth' && <AuthForm />}
    </main>
  );
}