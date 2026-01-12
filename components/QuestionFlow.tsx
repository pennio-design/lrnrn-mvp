import React, { useState, useEffect } from 'react';
import { useStore } from '../lib/store';
import { DIAGNOSTIC_QUESTIONS } from '../lib/questions';
import { ArrowRight, ArrowLeft, ChevronDown, ChevronUp, BrainCircuit } from 'lucide-react';
import { generateCurriculum, attachResources } from '../lib/gemini';

export default function QuestionFlow() {
  const { currentQuestionIndex, nextQuestion, prevQuestion, setAnswer, answers, setCurriculum, setView } = useStore();
  const [input, setInput] = useState(answers[DIAGNOSTIC_QUESTIONS[currentQuestionIndex].id] || '');
  const [error, setError] = useState<string | null>(null);
  const [showExamples, setShowExamples] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const q = DIAGNOSTIC_QUESTIONS[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / DIAGNOSTIC_QUESTIONS.length) * 100;

  useEffect(() => {
    setInput(answers[q.id] || '');
    setError(null);
  }, [currentQuestionIndex, q.id, answers]);

  const handleNext = async () => {
    for (const rule of q.validation) {
      if (!rule.validate(input)) {
        setError(rule.message);
        return;
      }
    }
    
    setError(null);
    setAnswer(q.id, input);

    if (currentQuestionIndex < DIAGNOSTIC_QUESTIONS.length - 1) {
      nextQuestion();
    } else {
      setIsSubmitting(true);
      setView('generating');
      try {
        const rawAnswers = { ...answers, [q.id]: input };
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

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-2xl space-y-8 animate-fade-up">
        {/* Progress bar */}
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <div className="flex items-center gap-2 text-amber-500 font-mono text-sm uppercase tracking-wider font-bold">
              <BrainCircuit size={16} /> 
              Step 0{currentQuestionIndex + 1}
            </div>
            <div className="text-slate-500 text-xs font-mono">
              {Math.round(progress)}% Complete
            </div>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-amber-500 h-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(245,158,11,0.5)]" 
              style={{ width: `${progress}%` }} 
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight">{q.label}</h2>
          <p className="text-slate-400 text-lg leading-relaxed">{q.prompt}</p>
        </div>

        <div className="space-y-4 relative group">
          <textarea
            autoFocus
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError(null);
            }}
            placeholder={q.placeholder}
            className={`w-full bg-slate-800/50 border-2 rounded-2xl p-6 text-lg focus:bg-slate-800 outline-none transition-all min-h-[180px] resize-none
              ${error ? 'border-red-500/50 focus:border-red-500' : 'border-slate-700 focus:border-amber-500'}`}
          />
          {error && <p className="text-red-400 text-sm font-bold flex items-center gap-2 animate-pulse absolute -bottom-8 left-0">
            <span>⚠️</span> {error}
          </p>}
        </div>

        {/* Examples Accordion */}
        <div className="border border-slate-800/50 bg-slate-800/20 rounded-2xl overflow-hidden transition-all duration-300">
          <button 
            onClick={() => setShowExamples(!showExamples)}
            className="w-full p-4 flex items-center justify-between text-slate-400 hover:text-white hover:bg-slate-800/30 transition-colors"
          >
            <span className="text-xs font-bold uppercase tracking-widest">Compare Quality Examples</span>
            {showExamples ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {showExamples && (
            <div className="p-6 bg-slate-900/50 space-y-6 text-sm border-t border-slate-800/50">
              <div>
                <span className="text-green-400 font-bold block mb-2 uppercase text-xs tracking-tighter flex items-center gap-2">
                  <div className="w-1 h-3 bg-green-400 rounded-full" /> Strategic Input
                </span>
                <p className="text-slate-300 italic leading-relaxed">"{q.examples.good}"</p>
              </div>
              <div>
                <span className="text-slate-500 font-bold block mb-2 uppercase text-xs tracking-tighter flex items-center gap-2">
                  <div className="w-1 h-3 bg-slate-500 rounded-full" /> Generic Input (Avoid)
                </span>
                <p className="text-slate-500 italic leading-relaxed">"{q.examples.generic}"</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-10">
          <button
            onClick={prevQuestion}
            disabled={currentQuestionIndex === 0}
            className="flex items-center gap-2 text-slate-500 hover:text-white transition-all font-bold disabled:opacity-0 disabled:cursor-default"
          >
            <ArrowLeft size={18} /> Prev
          </button>
          <button
            onClick={handleNext}
            disabled={isSubmitting || !input.trim()}
            className="bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-900 px-10 py-4 rounded-full font-black flex items-center gap-3 transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-amber-500/10"
          >
            {currentQuestionIndex === DIAGNOSTIC_QUESTIONS.length - 1 ? 'Synthesize My Path' : 'Continue'} 
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}