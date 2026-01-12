
export interface ValidationRule {
  validate: (input: string) => boolean | string;
  message: string;
}

export interface Question {
  id: string;
  label: string;
  prompt: string;
  placeholder: string;
  examples: { good: string; generic: string };
  validation: ValidationRule[];
}

export interface CurriculumNode {
  title: string;
  description: string;
  reasoning: string;
  estimated_hours: number;
  prerequisites: string[];
  learning_outcomes: string[];
  resources?: CuratedResource[];
}

export interface CuratedResource {
  title: string;
  url: string;
  type: 'video' | 'text' | 'interactive' | 'docs';
  source: string;
  reasoning: string;
  quality_score: number;
}

export interface Curriculum {
  title: string;
  description: string;
  path_strategy: string;
  nodes: CurriculumNode[];
  total_hours: number;
  completion_milestone: string;
}

export interface AppState {
  view: 'landing' | 'questions' | 'generating' | 'curriculum';
  currentQuestionIndex: number;
  answers: Record<string, string>;
  curriculum: Curriculum | null;
  setView: (view: AppState['view']) => void;
  setAnswer: (id: string, answer: string) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  setCurriculum: (c: Curriculum) => void;
  reset: () => void;
}
