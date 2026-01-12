
import { Question } from './types';

export const DIAGNOSTIC_QUESTIONS: Question[] = [
  {
    id: 'goal',
    label: "What's your big idea?",
    prompt: "Tell us in one short sentence what you want to build or make.",
    placeholder: "e.g. A game with a cat, or a simple calculator.",
    examples: {
      good: "I want to make a website that lists my favorite books.",
      generic: "I want to learn code."
    },
    validation: [
      {
        validate: (input) => input.length > 5,
        message: "Tell us just a tiny bit more!"
      }
    ]
  },
  {
    id: 'level',
    label: "How much do you know?",
    prompt: "Pick the one that sounds most like you right now.",
    options: [
      "I'm a total beginner",
      "I've done a little bit",
      "I'm pretty good at this",
      "I'm a pro builder"
    ],
    placeholder: "Select an option...",
    examples: {
      good: "Beginner",
      generic: "None"
    },
    validation: [
      {
        validate: (input) => input.length > 0,
        message: "Please pick one!"
      }
    ]
  },
  {
    id: 'constraints',
    label: "How hard do you want to work?",
    prompt: "How much time can you spend on this every week?",
    options: [
      "Just 1-2 hours (Slow & Steady)",
      "3-5 hours (The Normal Way)",
      "10+ hours (Super Fast!)"
    ],
    placeholder: "Select an option...",
    examples: {
      good: "5 hours",
      generic: "1"
    },
    validation: [
      {
        validate: (input) => input.length > 0,
        message: "Pick your speed!"
      }
    ]
  }
];
