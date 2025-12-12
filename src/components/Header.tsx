import { Target, TrendingUp, Shuffle, Plus, Moon, Sun } from 'lucide-react';
import { useQuiz } from '../context/QuizContext';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  onCreateDeck: () => void;
  onViewStats: () => void;
  onCustomQuiz: () => void;
}

export function Header({ onCreateDeck, onViewStats, onCustomQuiz }: HeaderProps) {
  const { userProgress } = useQuiz();
  const { theme, toggleTheme } = useTheme();

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
          {/* Stats Button - Professional Design */}
          <button 
            className="btn-stats"
            onClick={onViewStats}
            title="View Statistics"
          >
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 'var(--spacing-sm)',
            }}>
              <TrendingUp size={20} />
              {userProgress.totalQuizzes > 0 && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                }}>
                  <span style={{ 
                    fontSize: '1rem', 
                    fontWeight: 700,
                    lineHeight: 1,
                  }}>
                    {Math.round(userProgress.overallAccuracy)}%
                  </span>
                  <span style={{ 
                    fontSize: '0.625rem', 
                    opacity: 0.7,
                    lineHeight: 1,
                  }}>
                    accuracy
                  </span>
                </div>
              )}
            </div>
          </button>

          {/* Theme Toggle */}
          <button 
            className="btn-icon"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
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
