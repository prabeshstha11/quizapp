import { CheckCircle, XCircle } from 'lucide-react';

interface FeedbackModalProps {
  isCorrect: boolean;
  correctAnswer: string;
  onContinue: () => void;
}

export function FeedbackModal({ isCorrect, correctAnswer, onContinue }: FeedbackModalProps) {
  return (
    <div 
      className="modal-overlay" 
      onClick={onContinue}
      style={{ 
        background: isCorrect 
          ? 'rgba(16, 185, 129, 0.1)' 
          : 'rgba(239, 68, 68, 0.1)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div 
        className="scale-in celebrate"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--spacing-2xl)',
          textAlign: 'center',
          maxWidth: '400px',
          border: `2px solid ${isCorrect ? 'var(--success)' : 'var(--error)'}`,
          boxShadow: isCorrect 
            ? '0 0 30px rgba(16, 185, 129, 0.3)' 
            : '0 0 30px rgba(239, 68, 68, 0.3)',
        }}
      >
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: 'var(--radius-full)',
          background: isCorrect ? 'var(--success)' : 'var(--error)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto var(--spacing-lg)',
        }}>
          {isCorrect ? (
            <CheckCircle size={40} color="white" />
          ) : (
            <XCircle size={40} color="white" />
          )}
        </div>

        <h3 style={{ 
          fontSize: '2rem', 
          marginBottom: 'var(--spacing-md)',
          color: isCorrect ? 'var(--success)' : 'var(--error)',
        }}>
          {isCorrect ? 'Correct!' : 'Incorrect'}
        </h3>

        {!isCorrect && (
          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <p className="text-muted" style={{ marginBottom: 'var(--spacing-sm)' }}>
              The correct answer is:
            </p>
            <p style={{ 
              fontSize: '1.125rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
            }}>
              {correctAnswer}
            </p>
          </div>
        )}

        {isCorrect && (
          <p className="text-muted" style={{ marginBottom: 'var(--spacing-lg)' }}>
            {['Great job!', 'Excellent!', 'Well done!', 'Perfect!', 'Amazing!'][Math.floor(Math.random() * 5)]}
          </p>
        )}

        <button className="btn-primary" onClick={onContinue} style={{ width: '100%' }}>
          Continue
        </button>
      </div>
    </div>
  );
}
