import { Deck } from '../types';
import { useQuiz } from '../context/QuizContext';
import { Play, BookOpen, Calendar, Percent, Trash2 } from 'lucide-react';
import { formatDate } from '../utils/stats';

interface DeckCardProps {
  deck: Deck;
  onStartQuiz: (deckId: string) => void;
}

export function DeckCard({ deck, onStartQuiz }: DeckCardProps) {
  const { userProgress, deleteDeck } = useQuiz();
  const stats = userProgress.decks[deck.id];

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Delete "${deck.name}"? This cannot be undone.`)) {
      deleteDeck(deck.id);
    }
  };

  return (
    <div className="card scale-in" style={{
      cursor: 'pointer',
      position: 'relative',
    }}>
      <div onClick={() => onStartQuiz(deck.id)}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          marginBottom: 'var(--spacing-md)',
        }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ 
              fontSize: '1.25rem', 
              marginBottom: 'var(--spacing-xs)',
              color: 'var(--text-primary)',
            }}>
              {deck.name}
            </h3>
            {deck.description && (
              <p className="text-secondary" style={{ 
                fontSize: '0.875rem',
                marginBottom: 'var(--spacing-md)',
              }}>
                {deck.description}
              </p>
            )}
          </div>
          
          <button
            className="btn-icon"
            onClick={handleDelete}
            style={{ color: 'var(--error)' }}
            title="Delete deck"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: 'var(--spacing-sm)',
          marginBottom: 'var(--spacing-lg)',
        }}>
          <div className="badge badge-primary" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 'var(--spacing-xs)',
            justifyContent: 'center',
          }}>
            <BookOpen size={14} />
            {deck.questions.length} questions
          </div>
          
          {stats && stats.totalAttempts > 0 && (
            <>
              <div className={`badge ${
                stats.accuracy >= 75 ? 'badge-success' : 
                stats.accuracy >= 60 ? 'badge-warning' : 
                'badge-error'
              }`} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 'var(--spacing-xs)',
                justifyContent: 'center',
              }}>
                <Percent size={14} />
                {Math.round(stats.accuracy)}% accuracy
              </div>
              
              <div className="badge badge-primary" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 'var(--spacing-xs)',
                justifyContent: 'center',
                fontSize: '0.75rem',
              }}>
                <Calendar size={12} />
                {formatDate(stats.lastAttemptDate)}
              </div>
            </>
          )}
        </div>

        <button 
          className="btn-primary" 
          style={{ width: '100%', justifyContent: 'center' }}
          onClick={(e) => {
            e.stopPropagation();
            onStartQuiz(deck.id);
          }}
        >
          <Play size={18} />
          Start Quiz
        </button>
      </div>
    </div>
  );
}
