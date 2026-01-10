
import { Question } from './types';

export const DIAGNOSTIC_QUESTIONS: Question[] = [
  {
    id: 'goal',
    label: 'The Project Objective',
    prompt: 'What specific project or capability will you demonstrate to prove you have mastered this skill?',
    placeholder: 'e.g., A multi-user Kanban board with drag-and-drop and real-time persistence using Firebase.',
    examples: {
      good: 'I want to build a calorie tracking mobile app with a barcode scanner using React Native and SQLite.',
      generic: 'I want to learn how to make mobile apps.'
    },
    validation: [
      {
        validate: (input) => input.length > 20,
        message: 'Please be more specific. Generic goals lead to generic curricula.'
      },
      {
        validate: (input) => !['learn', 'understand', 'know'].some(word => input.toLowerCase() === word),
        message: 'Avoid "learning" as the primary goal. Describe the output.'
      }
    ]
  },
  {
    id: 'level',
    label: 'Behavioral Assessment',
    prompt: 'What is the most complex architecture or logic you have successfully implemented in any domain?',
    placeholder: 'Explain a technical hurdle you solved or a complex data flow you designed.',
    examples: {
      good: 'I built a custom web scraper that handled pagination and rate-limiting using Python and BeautifulSoup.',
      generic: 'I am a beginner programmer.'
    },
    validation: [
      {
        validate: (input) => input.split(' ').length > 10,
        message: 'We need more context to skip the basics you already know.'
      }
    ]
  },
  {
    id: 'constraints',
    label: 'Strategic Constraints',
    prompt: 'How many hours per week can you realistically commit, and what is your "high-retention" learning format?',
    placeholder: 'e.g., 10 hours/week, prefer deep-dive text documentation over video tutorials.',
    examples: {
      good: '5 hours per week. I retain best through interactive labs and text-based deep dives.',
      generic: 'As much as possible, video tutorials.'
    },
    validation: [
      {
        validate: (input) => /\d+/.test(input),
        message: 'Please include a specific hourly commitment.'
      }
    ]
  }
];
