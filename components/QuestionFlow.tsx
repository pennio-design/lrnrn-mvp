
import React, { useState } from 'react';
import { useStore } from '../lib/store';
import { DIAGNOSTIC_QUESTIONS } from '../lib/questions';
import { ArrowRight } from 'lucide-react';
import { ArrowLeft } from 'lucide-react';
import { ChevronDown } from 'lucide-react';
import { ChevronUp } from 'lucide-react';
import { generateCurriculum, attachResources } from '../lib/gemini';

export default function QuestionFlow() {
  const { currentQuestionIndex, nextQuestion, prevQuestion, setAnswer, answers, setCurriculum, setView } = useStore();
  const [input, setInput] = useState(answers[DIAGNOSTIC_QUESTIONS[currentQuestionIndex].id] || '');
  const [error, setError] = useState<string | null>(null);
  const [showExamples, setShowExamples] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const q = DIAGNOSTIC_QUESTIONS[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / DIAGNOSTIC_QUESTIONS.length) * 100;

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
      setInput(answers[DIAGNOSTIC_QUESTIONS[currentQuestionIndex + 1].id] || '');
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
        console.error(e);
        setView('questions');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-8">
        {/* Progress */}
        <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
          <div className="bg-amber-500 h-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>

        <div className="space-y-2">
          <span className="text-amber-500 font-mono text-sm uppercase tracking-wider">Diagnostic 0{currentQuestionIndex + 1}</span>
          <h2 className="text-3xl font-bold">{q.label}</h2>
          <p className="text-slate-400 text-lg leading-relaxed">{q.prompt}</p>
        </div>

        <div className="space-y-4">
          <textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError(null);
            }}
            placeholder={q.placeholder}
            className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl p-4 text-lg focus:border-amber-500 outline-none transition-colors min-h-[160px] resize-none"
          />
          {error && <p className="text-red-400 text-sm animate-pulse">{error}</p>}
        </div>

        {/* Examples Accordion */}
        <div className="border border-slate-800 rounded-xl overflow-hidden">
          <button 
            onClick={() => setShowExamples(!showExamples)}
            className="w-full p-4 flex items-center justify-between text-slate-400 hover:bg-slate-800 transition-colors"
          >
            <span className="text-sm font-medium">See comparative examples</span>
            {showExamples ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          {showExamples && (
            <div className="p-4 bg-slate-800/50 space-y-4 text-sm">
              <div>
                <span className="text-success font-bold block mb-1">STRATEGIC (DO THIS):</span>
                <p className="text-slate-300 italic">"{q.examples.good}"</p>
              </div>
              <div>
                <span className="text-red-400 font-bold block mb-1">GENERIC (AVOID):</span>
                <p className="text-slate-500 italic">"{q.examples.generic}"</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4">
          <button
            onClick={prevQuestion}
            disabled={currentQuestionIndex === 0}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors disabled:opacity-0"
          >
            <ArrowLeft size={20} /> Back
          </button>
          <button
            onClick={handleNext}
            className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-all transform hover:translate-x-1"
          >
            {currentQuestionIndex === DIAGNOSTIC_QUESTIONS.length - 1 ? 'Generate Strategy' : 'Next Step'} <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
