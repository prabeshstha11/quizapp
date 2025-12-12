import { Target, Award, Shuffle, Plus } from 'lucide-react';
import { useQuiz } from '../context/QuizContext';

interface HeaderProps {
  onCreateDeck: () => void;
  onViewStats: () => void;
  onCustomQuiz: () => void;
}

export function Header({ onCreateDeck, onViewStats, onCustomQuiz }: HeaderProps) {
  const { userProgress } = useQuiz();

  return (
    <header style={{
      background: 'var(--glass-bg)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--glass-border)',
      padding: 'var(--spacing-lg) var(--spacing-xl)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div className="container" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        gap: 'var(--spacing-lg)',
        flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)',
          }}>
            <Target size={28} color="white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 style={{ 
              fontSize: '1.75rem', 
              margin: 0,
              color: 'var(--text-primary)',
              fontWeight: 800,
            }}>
              QuizMaster
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
              Learn. Practice. Master.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center' }}>
          <button 
            className="btn-icon"
            onClick={onViewStats}
            title="View Statistics"
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}
          >
            <Award size={20} />
            {userProgress.totalQuizzes > 0 && (
              <span className="badge badge-primary">
                {Math.round(userProgress.overallAccuracy)}%
              </span>
            )}
          </button>

          <button 
            className="btn-secondary"
            onClick={onCustomQuiz}
            title="Custom Quiz"
          >
            <Shuffle size={20} />
            <span className="hide-mobile">Custom</span>
          </button>
          
          <button 
            className="btn-primary"
            onClick={onCreateDeck}
          >
            <Plus size={20} />
            <span className="hide-mobile">Create Deck</span>
          </button>
        </div>
      </div>
    </header>
  );
}
