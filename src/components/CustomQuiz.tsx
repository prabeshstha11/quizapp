import { useState } from 'react';
import { X, Shuffle } from 'lucide-react';
import { useQuiz } from '../context/QuizContext';

interface CustomQuizProps {
  onClose: () => void;
  onStart: (deckIds: string[], questionCount: number) => void;
}

export function CustomQuiz({ onClose, onStart }: CustomQuizProps) {
  const { decks } = useQuiz();
  const [selectedDeckIds, setSelectedDeckIds] = useState<string[]>([]);
  const [questionCount, setQuestionCount] = useState(10);

  const toggleDeck = (deckId: string) => {
    if (selectedDeckIds.includes(deckId)) {
      setSelectedDeckIds(selectedDeckIds.filter(id => id !== deckId));
    } else {
      setSelectedDeckIds([...selectedDeckIds, deckId]);
    }
  };

  const totalAvailableQuestions = decks
    .filter(d => selectedDeckIds.includes(d.id))
    .reduce((sum, d) => sum + d.questions.length, 0);

  const handleStart = () => {
    if (selectedDeckIds.length > 0 && questionCount > 0) {
      onStart(selectedDeckIds, questionCount);
      onClose();
    }
  };

  const canStart = selectedDeckIds.length > 0 && questionCount > 0 && questionCount <= totalAvailableQuestions;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content scale-in" onClick={(e) => e.stopPropagation()}>
        <div style={{ 
          padding: 'var(--spacing-xl)',
          borderBottom: '1px solid var(--glass-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
            <Shuffle size={24} color="var(--primary)" />
            <h2 style={{ margin: 0 }}>Custom Quiz</h2>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div style={{ padding: 'var(--spacing-xl)' }}>
          <div style={{ marginBottom: 'var(--spacing-xl)' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: 'var(--spacing-md)',
              fontWeight: 600,
            }}>
              Select Decks
            </label>
            
            {decks.length === 0 ? (
              <p className="text-muted">No decks available. Create a deck first!</p>
            ) : (
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 'var(--spacing-sm)',
                maxHeight: '300px',
                overflowY: 'auto',
              }}>
                {decks.map(deck => (
                  <label
                    key={deck.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-md)',
                      padding: 'var(--spacing-md)',
                      background: selectedDeckIds.includes(deck.id) 
                        ? 'rgba(99, 102, 241, 0.1)' 
                        : 'var(--glass-bg)',
                      border: `2px solid ${
                        selectedDeckIds.includes(deck.id) 
                          ? 'var(--primary)' 
                          : 'var(--glass-border)'
                      }`,
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      transition: 'all var(--transition-base)',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedDeckIds.includes(deck.id)}
                      onChange={() => toggleDeck(deck.id)}
                      style={{ 
                        width: '20px', 
                        height: '20px',
                        cursor: 'pointer',
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600 }}>{deck.name}</div>
                      <div className="text-muted" style={{ fontSize: '0.875rem' }}>
                        {deck.questions.length} questions
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {selectedDeckIds.length > 0 && (
            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: 'var(--spacing-sm)',
                fontWeight: 600,
              }}>
                Number of Questions
              </label>
              <input
                type="number"
                min="1"
                max={totalAvailableQuestions}
                value={questionCount}
                onChange={(e) => setQuestionCount(parseInt(e.target.value) || 1)}
                style={{ width: '100%' }}
              />
              <p className="text-muted" style={{ 
                fontSize: '0.875rem', 
                marginTop: 'var(--spacing-sm)',
              }}>
                Total available: {totalAvailableQuestions} questions
              </p>
            </div>
          )}

          <div style={{ 
            display: 'flex', 
            gap: 'var(--spacing-md)',
            justifyContent: 'flex-end',
          }}>
            <button className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button 
              className="btn-primary" 
              onClick={handleStart}
              disabled={!canStart}
            >
              <Shuffle size={18} />
              Start Custom Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
