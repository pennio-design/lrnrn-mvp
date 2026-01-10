
import React from 'react';
import { Check } from 'lucide-react';
import { X } from 'lucide-react';

export default function ComparisonTable() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center">
          <h2 className="text-4xl font-black text-slate-900">Why Strategic Curation?</h2>
          <p className="text-slate-500 mt-4">Standard curricula are built for everyone, which means they're right for no one.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 space-y-6">
            <h3 className="text-xl font-bold text-slate-400 flex items-center gap-2">
              <X className="text-red-400" /> Traditional Tutorials
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-slate-500">
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                Start at "Hello World" every time
              </li>
              <li className="flex items-center gap-3 text-slate-500">
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                Taught by teachers, not builders
              </li>
              <li className="flex items-center gap-3 text-slate-500">
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                Generic "Todo App" examples
              </li>
              <li className="flex items-center gap-3 text-slate-500">
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                Optimized for watch-time
              </li>
            </ul>
          </div>

          <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 space-y-6 ring-4 ring-amber-500/20">
            <h3 className="text-xl font-bold text-amber-500 flex items-center gap-2">
              <Check className="text-success" /> LRNRN Strategy
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-slate-300">
                <Check size={16} className="text-success" />
                Skips basics based on your history
              </li>
              <li className="flex items-center gap-3 text-slate-300">
                <Check size={16} className="text-success" />
                Opinionated tool selection
              </li>
              <li className="flex items-center gap-3 text-slate-300">
                <Check size={16} className="text-success" />
                Curated by architectural logic
              </li>
              <li className="flex items-center gap-3 text-slate-300">
                <Check size={16} className="text-success" />
                Optimized for production shipping
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
