import { useState, useMemo } from 'react';
import { LogOut, Check, X } from 'lucide-react';
import { useQuiz } from '../context/QuizContext';
import { Deck, Question } from '../types';
import { QuestionCard } from './QuestionCard';
import { getRandomQuestions } from '../utils/shuffle';

interface QuizProps {
  deck?: Deck;
  onClose: () => void;
}

export function Quiz({ deck, onClose }: QuizProps) {
  const { currentSession, decks, submitAnswer, nextQuestion, completeQuiz, resetSession } = useQuiz();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Get questions for this quiz - keep in original order
  const quizQuestions = useMemo<Question[]>(() => {
    if (!currentSession) return [];

    let questions: Question[] = [];

    // Custom quiz mode - get random questions from selected decks
    if (currentSession.deckId === 'custom' && currentSession.deckIds) {
      const selectedDecks = decks.filter(d => currentSession.deckIds!.includes(d.id));
      const allQuestions = selectedDecks.flatMap(d => d.questions);
      questions = getRandomQuestions(allQuestions, currentSession.questionCount || 10);
    } 
    // Regular deck quiz - keep original order
    else if (deck) {
      questions = deck.questions;
    }

    return questions;
  }, [currentSession, deck, decks]);

  const currentQuestion = currentSession && quizQuestions.length > 0
    ? quizQuestions[currentSession.currentQuestionIndex]
    : null;

  const progress = currentSession && quizQuestions.length > 0
    ? ((currentSession.currentQuestionIndex + 1) / quizQuestions.length) * 100
    : 0;

  const totalQuestions = quizQuestions.length;

  const handleAnswerSelect = (optionIndex: number) => {
    if (hasSubmitted || !currentQuestion) return;
    setSelectedAnswer(optionIndex);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null || !currentSession || !currentQuestion || hasSubmitted) return;

    const correct = selectedAnswer === currentQuestion.correct_answer;
    setIsCorrect(correct);
    submitAnswer(currentQuestion.id, selectedAnswer, correct);
    setHasSubmitted(true);
  };

  const handleContinue = () => {
    setHasSubmitted(false);
    setSelectedAnswer(null);

    if (!currentSession) return;

    if (currentSession.currentQuestionIndex < totalQuestions - 1) {
      nextQuestion();
    } else {
      completeQuiz();
    }
  };

  const handleQuit = () => {
    resetSession();
    onClose();
  };

  if (!currentSession || !currentQuestion) return null;

  // Show results if completed
  if (currentSession.completed) {
    const correctCount = currentSession.answers.filter(a => a.isCorrect).length;
    const accuracy = (correctCount / currentSession.answers.length) * 100;

    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--bg-primary)',
        zIndex: 1000,
        overflow: 'auto',
      }}>
        <div className="container" style={{ 
          maxWidth: '600px', 
          paddingTop: 'var(--spacing-2xl)',
          paddingBottom: 'var(--spacing-2xl)',
        }}>
          <div className="card scale-in" style={{ textAlign: 'center' }}>
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: 'var(--radius-full)',
              background: accuracy >= 75 ? 'var(--success)' : accuracy >= 60 ? 'var(--warning)' : 'var(--error)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--spacing-xl)',
            }}>
              {accuracy >= 75 ? (
                <Check size={60} color="white" strokeWidth={3} />
              ) : (
                <X size={60} color="white" strokeWidth={3} />
              )}
            </div>

            <h2 style={{ marginBottom: 'var(--spacing-md)' }}>
              Quiz Complete!
            </h2>

            <div style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              color: accuracy >= 75 ? 'var(--success)' : accuracy >= 60 ? 'var(--warning)' : 'var(--error)',
              marginBottom: 'var(--spacing-lg)',
            }}>
              {Math.round(accuracy)}%
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 'var(--spacing-md)',
              marginBottom: 'var(--spacing-xl)',
            }}>
              <div>
                <div className="text-muted" style={{ fontSize: '0.875rem' }}>Correct</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--success)' }}>
                  {correctCount}
                </div>
              </div>
              <div>
                <div className="text-muted" style={{ fontSize: '0.875rem' }}>Incorrect</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--error)' }}>
                  {currentSession.answers.length - correctCount}
                </div>
              </div>
              <div>
                <div className="text-muted" style={{ fontSize: '0.875rem' }}>Total</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                  {currentSession.answers.length}
                </div>
              </div>
            </div>

            <p className="text-muted" style={{ marginBottom: 'var(--spacing-xl)' }}>
              {accuracy >= 90 && "Outstanding! You've mastered this content!"}
              {accuracy >= 75 && accuracy < 90 && "Excellent work! Keep it up!"}
              {accuracy >= 60 && accuracy < 75 && "Good job! A bit more practice will help."}
              {accuracy < 60 && "Keep practicing! You'll improve with time."}
            </p>

            <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
              <button 
                className="btn-secondary" 
                onClick={() => {
                  resetSession();
                  onClose();
                }}
                style={{ flex: 1 }}
              >
                Back to Decks
              </button>
              <button 
                className="btn-primary"
                onClick={() => {
                  resetSession();
                  window.location.reload();
                }}
                style={{ flex: 1 }}
              >
                New Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const quizTitle = currentSession.deckId === 'custom' 
    ? 'Custom Quiz' 
    : deck?.name || 'Quiz';

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'var(--bg-primary)',
      zIndex: 1000,
      overflow: 'auto',
    }}>
      <div style={{
        position: 'sticky',
        top: 0,
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--glass-border)',
        padding: 'var(--spacing-lg)',
        zIndex: 100,
      }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: 'var(--spacing-md)',
          }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{quizTitle}</h3>
              <p className="text-muted" style={{ margin: 0, fontSize: '0.875rem' }}>
                Question {currentSession.currentQuestionIndex + 1} of {totalQuestions}
              </p>
            </div>
            <button 
              className="btn-secondary" 
              onClick={handleQuit}
              style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}
            >
              <LogOut size={18} />
              Quit
            </button>
          </div>

          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div className="container fade-in" style={{ 
        maxWidth: '800px',
        paddingTop: 'var(--spacing-2xl)',
        paddingBottom: 'var(--spacing-2xl)',
      }}>
        <QuestionCard
          question={currentQuestion}
          selectedAnswer={selectedAnswer}
          onSelectAnswer={handleAnswerSelect}
          showResult={hasSubmitted}
        />

        <div style={{ 
          marginTop: 'var(--spacing-xl)',
          display: 'flex',
          justifyContent: 'center',
        }}>
          {!hasSubmitted ? (
            <button
              className="btn-primary"
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
              style={{ minWidth: '200px', fontWeight: 'bold', textTransform: 'uppercase' }}
            >
              Check Answer
            </button>
          ) : (
            <button
              className={isCorrect ? "btn-success" : "btn-error"}
              onClick={handleContinue}
              style={{ minWidth: '200px', fontWeight: 'bold', textTransform: 'uppercase' }}
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
