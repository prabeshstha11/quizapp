import { createContext, useContext, ReactNode } from 'react';
import { Deck, QuizSession, UserProgress, DeckStats, UserAnswer } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface QuizContextType {
  decks: Deck[];
  currentSession: QuizSession | null;
  userProgress: UserProgress;
  addDeck: (deck: Deck) => void;
  deleteDeck: (deckId: string) => void;
  updateDeck: (deckId: string, updates: Partial<Deck>) => void;
  startQuiz: (deckId: string) => void;
  startCustomQuiz: (deckIds: string[], questionCount: number) => void;
  submitAnswer: (questionId: string, selectedAnswer: number, isCorrect: boolean) => void;
  nextQuestion: () => void;
  completeQuiz: () => void;
  resetSession: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [decks, setDecks] = useLocalStorage<Deck[]>('quiz-decks', []);
  const [currentSession, setCurrentSession] = useLocalStorage<QuizSession | null>('current-session', null);
  const [userProgress, setUserProgress] = useLocalStorage<UserProgress>('user-progress', {
    decks: {},
    totalQuizzes: 0,
    totalQuestionsAnswered: 0,
    overallAccuracy: 0,
  });

  const addDeck = (deck: Deck) => {
    setDecks([...decks, deck]);
  };

  const deleteDeck = (deckId: string) => {
    setDecks(decks.filter(d => d.id !== deckId));
    // Also remove from progress
    const newProgress = { ...userProgress };
    delete newProgress.decks[deckId];
    setUserProgress(newProgress);
  };

  const updateDeck = (deckId: string, updates: Partial<Deck>) => {
    setDecks(decks.map(d => d.id === deckId ? { ...d, ...updates } : d));
  };

  const startQuiz = (deckId: string) => {
    const deck = decks.find(d => d.id === deckId);
    if (!deck) return;

    const session: QuizSession = {
      deckId,
      deckIds: [deckId],
      currentQuestionIndex: 0,
      answers: [],
      startTime: new Date().toISOString(),
      completed: false,
    };
    setCurrentSession(session);
  };

  const startCustomQuiz = (deckIds: string[], questionCount: number) => {
    if (deckIds.length === 0) return;

    const session: QuizSession = {
      deckId: 'custom', // Custom quiz identifier
      deckIds,
      questionCount,
      currentQuestionIndex: 0,
      answers: [],
      startTime: new Date().toISOString(),
      completed: false,
    };
    setCurrentSession(session);
  };

  const submitAnswer = (questionId: string, selectedAnswer: number, isCorrect: boolean) => {
    if (!currentSession) return;

    const answer: UserAnswer = {
      questionId,
      selectedAnswer,
      isCorrect,
      timestamp: new Date().toISOString(),
    };

    setCurrentSession({
      ...currentSession,
      answers: [...currentSession.answers, answer],
    });
  };

  const nextQuestion = () => {
    if (!currentSession) return;
    
    setCurrentSession({
      ...currentSession,
      currentQuestionIndex: currentSession.currentQuestionIndex + 1,
    });
  };

  const completeQuiz = () => {
    if (!currentSession) return;

    const deck = decks.find(d => d.id === currentSession.deckId);
    if (!deck) return;

    const correctCount = currentSession.answers.filter(a => a.isCorrect).length;
    const totalQuestions = currentSession.answers.length;

    // Update deck stats
    const deckStats: DeckStats = userProgress.decks[currentSession.deckId] || {
      deckId: currentSession.deckId,
      totalAttempts: 0,
      correctAnswers: 0,
      totalQuestions: 0,
      accuracy: 0,
      lastAttemptDate: new Date().toISOString(),
    };

    const updatedDeckStats: DeckStats = {
      ...deckStats,
      totalAttempts: deckStats.totalAttempts + 1,
      correctAnswers: deckStats.correctAnswers + correctCount,
      totalQuestions: deckStats.totalQuestions + totalQuestions,
      accuracy: ((deckStats.correctAnswers + correctCount) / (deckStats.totalQuestions + totalQuestions)) * 100,
      lastAttemptDate: new Date().toISOString(),
    };

    // Update overall progress
    const newTotalQuestions = userProgress.totalQuestionsAnswered + totalQuestions;
    const newTotalCorrect = Object.values({
      ...userProgress.decks,
      [currentSession.deckId]: updatedDeckStats,
    }).reduce((sum, stats) => sum + stats.correctAnswers, 0);

    setUserProgress({
      decks: {
        ...userProgress.decks,
        [currentSession.deckId]: updatedDeckStats,
      },
      totalQuizzes: userProgress.totalQuizzes + 1,
      totalQuestionsAnswered: newTotalQuestions,
      overallAccuracy: newTotalQuestions > 0 ? (newTotalCorrect / newTotalQuestions) * 100 : 0,
    });

    setCurrentSession({
      ...currentSession,
      completed: true,
    });
  };

  const resetSession = () => {
    setCurrentSession(null);
  };

  return (
    <QuizContext.Provider
      value={{
        decks,
        currentSession,
        userProgress,
        addDeck,
        deleteDeck,
        updateDeck,
        startQuiz,
        startCustomQuiz,
        submitAnswer,
        nextQuestion,
        completeQuiz,
        resetSession,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}
