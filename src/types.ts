export interface Question {
  id: string;
  question: string;
  options: string[];
  correct_answer: number; // Index of correct option (0-based)
}

export interface Deck {
  id: string;
  name: string;
  description: string;
  questions: Question[];
  createdAt: string;
}

export interface QuizSession {
  deckId: string;
  deckIds?: string[]; // For custom quizzes with multiple decks
  questionCount?: number; // For custom quizzes with limited questions
  currentQuestionIndex: number;
  answers: UserAnswer[];
  startTime: string;
  completed: boolean;
}

export interface UserAnswer {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  timestamp: string;
}

export interface DeckStats {
  deckId: string;
  totalAttempts: number;
  correctAnswers: number;
  totalQuestions: number;
  accuracy: number;
  lastAttemptDate: string;
}

export interface ParseResult {
  questions: Question[];
  error: string | null;
}

export interface UserProgress {
  decks: Record<string, DeckStats>;
  totalQuizzes: number;
  totalQuestionsAnswered: number;
  overallAccuracy: number;
}
