import { Question } from '../types';
import { CheckCircle, XCircle } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  selectedAnswer: number | null;
  onSelectAnswer: (index: number) => void;
  showResult: boolean;
}

export function QuestionCard({ 
  question, 
  selectedAnswer, 
  onSelectAnswer, 
  showResult 
}: QuestionCardProps) {
  const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F'];

  return (
    <div className="card" style={{ maxWidth: '100%' }}>
      <h2 style={{ 
        fontSize: '1.5rem', 
        marginBottom: 'var(--spacing-xl)',
        lineHeight: 1.4,
      }}>
        {question.question}
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = index === question.correct_answer;
          const showCorrect = showResult && isCorrect;
          const showIncorrect = showResult && isSelected && !isCorrect;

          return (
            <button
              key={index}
              onClick={() => onSelectAnswer(index)}
              disabled={showResult}
              style={{
                padding: 'var(--spacing-lg)',
                borderRadius: 'var(--radius-lg)',
                border: `2px solid ${
                  showCorrect ? 'var(--success)' :
                  showIncorrect ? 'var(--error)' :
                  isSelected ? 'var(--primary)' :
                  'var(--glass-border)'
                }`,
                background: showCorrect 
                  ? 'rgba(16, 185, 129, 0.1)' 
                  : showIncorrect 
                  ? 'rgba(239, 68, 68, 0.1)'
                  : isSelected 
                  ? 'rgba(99, 102, 241, 0.1)' 
                  : 'var(--glass-bg)',
                cursor: showResult ? 'default' : 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-md)',
                transition: 'all var(--transition-base)',
                transform: isSelected && !showResult ? 'scale(1.02)' : 'scale(1)',
              }}
              className={!showResult ? 'scale-in' : ''}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-full)',
                background: showCorrect 
                  ? 'var(--success)' 
                  : showIncorrect 
                  ? 'var(--error)'
                  : isSelected 
                  ? 'var(--primary)' 
                  : 'var(--bg-tertiary)',
                color: (isSelected || showCorrect || showIncorrect) ? 'white' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                flexShrink: 0,
              }}>
                {showCorrect ? <CheckCircle size={18} /> : 
                 showIncorrect ? <XCircle size={18} /> : 
                 optionLetters[index]}
              </div>
              <span style={{ 
                flex: 1,
                color: 'var(--text-primary)',
              }}>
                {option}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
