
import React, { useState, useEffect } from 'react';
import { useStore } from '../lib/store';
import { DIAGNOSTIC_QUESTIONS } from '../lib/questions';
import { ArrowRight, ArrowLeft, BrainCircuit, Rocket, CheckCircle2 } from 'lucide-react';
import { generateCurriculum, attachResources } from '../lib/gemini';

export default function QuestionFlow() {
  const { currentQuestionIndex, nextQuestion, prevQuestion, setAnswer, answers, setCurriculum, setView, user } = useStore();
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      setView('auth');
    }
  }, [user, setView]);

  const q = DIAGNOSTIC_QUESTIONS[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / DIAGNOSTIC_QUESTIONS.length) * 100;

  useEffect(() => {
    setInput(answers[q.id] || '');
    setError(null);
  }, [currentQuestionIndex, q.id, answers]);

  const handleNext = async (val?: string) => {
    const finalValue = val !== undefined ? val : input;
    
    if (!finalValue.trim()) {
      setError("Please provide an answer!");
      return;
    }

    for (const rule of q.validation) {
      const result = rule.validate(finalValue);
      if (result !== true) {
        setError(typeof result === 'string' ? result : rule.message);
        return;
      }
    }
    
    setError(null);
    setAnswer(q.id, finalValue);

    if (currentQuestionIndex < DIAGNOSTIC_QUESTIONS.length - 1) {
      nextQuestion();
    } else {
      setIsSubmitting(true);
      setView('generating');
      try {
        const rawAnswers = { ...answers, [q.id]: finalValue };
        let curr = await generateCurriculum(rawAnswers);
        curr = await attachResources(curr);
        setCurriculum(curr);
      } catch (e) {
        console.error("Generation failed:", e);
        alert("Strategic synthesis encountered an error. Please try again.");
        setView('questions');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-xl space-y-10 animate-fade-up">
        {/* Progress header */}
        <div className="flex flex-col items-center text-center space-y-4">
           <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.3)]">
             <Rocket className="text-slate-900" size={32} />
           </div>
           <div className="space-y-1">
             <p className="text-amber-500 font-black text-xs uppercase tracking-[0.2em]">Step {currentQuestionIndex + 1} of {DIAGNOSTIC_QUESTIONS.length}</p>
             <h2 className="text-4xl font-black tracking-tight">{q.label}</h2>
           </div>
        </div>

        <div className="space-y-6">
          <p className="text-slate-400 text-center text-lg">{q.prompt}</p>

          {q.options ? (
            <div className="grid gap-3">
              {q.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleNext(opt)}
                  className={`w-full p-5 rounded-2xl text-left border-2 transition-all duration-200 flex items-center justify-between group
                    ${input === opt 
                      ? 'bg-amber-500 border-amber-400 text-slate-900' 
                      : 'bg-slate-800 border-slate-700 hover:border-slate-500 text-slate-200'}`}
                >
                  <span className="font-bold text-lg">{opt}</span>
                  <CheckCircle2 size={24} className={`opacity-0 group-hover:opacity-20 transition-opacity ${input === opt ? 'opacity-100' : ''}`} />
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <input
                autoFocus
                type="text"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setError(null);
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                placeholder={q.placeholder}
                className={`w-full bg-slate-800 border-2 rounded-2xl p-6 text-xl focus:bg-slate-750 outline-none transition-all
                  ${error ? 'border-red-500/50 focus:border-red-500' : 'border-slate-700 focus:border-amber-500'}`}
              />
              {error && <p className="text-red-400 text-sm font-bold animate-pulse">{error}</p>}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-6">
          <button
            onClick={prevQuestion}
            disabled={currentQuestionIndex === 0}
            className="flex items-center gap-2 text-slate-500 hover:text-white transition-all font-bold disabled:opacity-0"
          >
            <ArrowLeft size={18} /> Go Back
          </button>
          
          {!q.options && (
            <button
              onClick={() => handleNext()}
              disabled={isSubmitting || !input.trim()}
              className="bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-900 px-10 py-4 rounded-full font-black flex items-center gap-3 transition-all transform hover:scale-105 active:scale-95 shadow-xl"
            >
              {currentQuestionIndex === DIAGNOSTIC_QUESTIONS.length - 1 ? 'Make My Plan' : 'Next Step'} 
              <ArrowRight size={20} />
            </button>
          )}
        </div>

        {/* Subtle Progress Bar */}
        <div className="pt-10">
           <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
              <div 
                className="bg-amber-500 h-full transition-all duration-500" 
                style={{ width: `${progress}%` }} 
              />
           </div>
        </div>
      </div>
    </div>
  );
}
