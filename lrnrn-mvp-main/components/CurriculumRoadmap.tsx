
import React, { useState } from 'react';
import { useStore } from '../lib/store';
import { CurriculumNode } from '../lib/types';
import { Clock } from 'lucide-react';
import { BookOpen } from 'lucide-react';
import { ExternalLink } from 'lucide-react';
import { ChevronRight } from 'lucide-react';
import { CheckCircle } from 'lucide-react';
import { Brain } from 'lucide-react';

// Added key to props definition to satisfy TypeScript when component is used within a map()
const NodeCard = ({ node, index }: { node: CurriculumNode; index: number; key?: React.Key }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="relative group">
      {/* Dependency Line */}
      {index !== 0 && (
        <div className="absolute -top-8 left-1/2 w-0.5 h-8 bg-slate-200" />
      )}
      
      <div className={`
        bg-white border-2 border-slate-100 rounded-2xl p-6 transition-all duration-300
        ${expanded ? 'shadow-xl border-amber-200' : 'hover:border-slate-300 hover:shadow-md'}
      `}>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-tighter">
              <span>Step {index + 1}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Clock size={12} /> {node.estimated_hours}h</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">{node.title}</h3>
          </div>
          <button 
            onClick={() => setExpanded(!expanded)}
            className="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-amber-500 transition-colors"
          >
            <ChevronRight size={20} className={`transition-transform duration-300 ${expanded ? 'rotate-90' : ''}`} />
          </button>
        </div>

        <p className="mt-3 text-slate-600 leading-relaxed line-clamp-2">
          {node.description}
        </p>

        {expanded && (
          <div className="mt-6 space-y-6 animate-in fade-in slide-in-from-top-2">
            <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100">
              <h4 className="text-xs font-bold text-amber-700 uppercase flex items-center gap-2 mb-2">
                <Brain size={14} /> Strategic Reasoning
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed italic">
                {node.reasoning}
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
                <BookOpen size={14} /> Curated Resources
              </h4>
              <div className="grid gap-2">
                {node.resources?.map((res, i) => (
                  <a 
                    key={i}
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors group/link"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-900">{res.title}</span>
                      <span className="text-xs text-slate-500">{res.source} • {res.type}</span>
                    </div>
                    <ExternalLink size={14} className="text-slate-300 group-hover/link:text-amber-500" />
                  </a>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
                <CheckCircle size={14} /> Outcomes
              </h4>
              <ul className="grid gap-1">
                {node.learning_outcomes.map((outcome, i) => (
                  <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                    <span className="text-success mt-1">•</span> {outcome}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function CurriculumRoadmap() {
  const { curriculum, reset } = useStore();

  if (!curriculum) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-1 rounded-full text-sm font-bold">
            LRNRN STRATEGY
          </div>
          <h1 className="text-4xl font-black text-slate-900">{curriculum.title}</h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">{curriculum.description}</p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-6">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
              <span className="block text-slate-400 text-xs uppercase font-bold">Total Time</span>
              <span className="text-2xl font-black text-slate-900">{curriculum.total_hours}h</span>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
              <span className="block text-slate-400 text-xs uppercase font-bold">Path Focus</span>
              <span className="text-sm font-bold text-slate-900 truncate block">Opinionated</span>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 col-span-2 md:col-span-1">
              <span className="block text-slate-400 text-xs uppercase font-bold">Milestone</span>
              <span className="text-sm font-bold text-success truncate block">{curriculum.completion_milestone}</span>
            </div>
          </div>
        </header>

        <section className="space-y-8 pb-20">
          {curriculum.nodes.map((node, i) => (
            <NodeCard key={i} node={node} index={i} />
          ))}
        </section>

        <footer className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-md border-t border-slate-200 flex justify-center z-50">
          <button 
            onClick={reset}
            className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold hover:bg-slate-800 transition-all shadow-lg"
          >
            Start New Strategy
          </button>
        </footer>
      </div>
    </div>
  );
}
