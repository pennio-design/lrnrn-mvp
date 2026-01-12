
import { create } from 'zustand';
import { AppState } from './types';

export const useStore = create<AppState>((set) => ({
  view: 'landing',
  currentQuestionIndex: 0,
  answers: {},
  curriculum: null,
  setView: (view) => set({ view }),
  setAnswer: (id, answer) => set((state) => ({
    answers: { ...state.answers, [id]: answer }
  })),
  nextQuestion: () => set((state) => ({
    currentQuestionIndex: state.currentQuestionIndex + 1
  })),
  prevQuestion: () => set((state) => ({
    currentQuestionIndex: Math.max(0, state.currentQuestionIndex - 1)
  })),
  setCurriculum: (curriculum) => set({ curriculum, view: 'curriculum' }),
  reset: () => set({
    view: 'landing',
    currentQuestionIndex: 0,
    answers: {},
    curriculum: null
  }),
}));
