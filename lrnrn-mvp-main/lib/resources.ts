
export interface ResourceTemplate {
  source: string;
  type: 'video' | 'text' | 'docs' | 'interactive';
  urlBase: string;
  specialty: string[];
}

export const TOP_TIER_SOURCES: ResourceTemplate[] = [
  { source: 'React.dev', type: 'docs', urlBase: 'https://react.dev', specialty: ['react', 'frontend', 'javascript'] },
  { source: 'MDN Web Docs', type: 'docs', urlBase: 'https://developer.mozilla.org', specialty: ['web', 'javascript', 'css', 'html'] },
  { source: 'TypeScript.org', type: 'docs', urlBase: 'https://typescriptlang.org', specialty: ['typescript'] },
  { source: 'Fireship', type: 'video', urlBase: 'https://youtube.com/@fireship', specialty: ['quick-start', 'modern-tech', 'backend'] },
  { source: 'Josh Comeau', type: 'text', urlBase: 'https://joshwcomeau.com', specialty: ['css', 'react', 'animation'] },
  { source: 'Kent C. Dodds', type: 'text', urlBase: 'https://kentcdodds.com', specialty: ['testing', 'remix', 'react-fundamentals'] },
  { source: 'WebDevSimplified', type: 'video', urlBase: 'https://youtube.com/@webdevsimplified', specialty: ['css', 'react-hooks', 'clean-code'] },
  { source: 'Theo T3.gg', type: 'video', urlBase: 'https://youtube.com/@t3dotgg', specialty: ['architecture', 'deployment', 'modern-stack'] },
  { source: 'CS50', type: 'video', urlBase: 'https://youtube.com/@cs50', specialty: ['computer-science', 'python', 'c', 'sql'] },
  { source: 'web.dev', type: 'text', urlBase: 'https://web.dev', specialty: ['performance', 'accessibility', 'browser-api'] }
];
