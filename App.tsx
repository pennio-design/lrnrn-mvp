
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
import { Loader2 } from 'lucide-react';

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
  const { view, setUser, setAuthLoading, curriculum, authLoading } = useStore();

  useEffect(() => {
    // Only run the listener once on mount
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setAuthLoading(false);
      
      if (u) {
        try {
          // Only fetch if we don't have a curriculum in local state yet
          const currentCurriculum = useStore.getState().curriculum;
          if (!currentCurriculum) {
            const saved = await getLatestCurriculum(u.uid);
            if (saved) {
              useStore.setState({ curriculum: saved });
            }
          }
        } catch (err) {
          console.error("Error fetching initial curriculum:", err);
        }
      }
    });
    return () => unsubscribe();
  }, [setUser, setAuthLoading]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-amber-500" size={32} />
          <span className="text-slate-400 font-mono text-xs uppercase tracking-widest">Waking up systems...</span>
        </div>
      </div>
    );
  }

  return (
    <main className="antialiased selection:bg-amber-100 selection:text-amber-900">
      {view === 'landing' && (
        <>
          <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
              <span 
                onClick={() => useStore.getState().reset()} 
                className="text-2xl font-black tracking-tighter text-slate-900 italic cursor-pointer hover:opacity-80 transition-opacity"
              >
                LRNRN
              </span>
              <div className="flex items-center gap-8">
                <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-500 uppercase tracking-widest">
                  <a href="#methodology" className="hover:text-amber-500">Methodology</a>
                </div>
                <UserMenu />
              </div>
            </div>
          </nav>
          
          <HeroSection />
          
          <div id="methodology">
            <ComparisonTable />
          </div>

          <footer className="bg-slate-50 py-12 px-6 border-t border-slate-100">
            <div className="max-w-5xl mx-auto text-center space-y-4">
              <span className="text-2xl font-black tracking-tighter text-slate-300 italic">LRNRN</span>
              <p className="text-slate-400 text-sm font-mono uppercase tracking-widest">
                AI-native pedagogical engineering. Made for makers.
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
