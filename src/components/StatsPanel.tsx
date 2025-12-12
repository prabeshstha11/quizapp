import { X, TrendingUp, Target, Award } from 'lucide-react';
import { useQuiz } from '../context/QuizContext';
import { formatDate } from '../utils/stats';

interface StatsPanelProps {
  onClose: () => void;
}

export function StatsPanel({ onClose }: StatsPanelProps) {
  const { decks, userProgress } = useQuiz();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content scale-in" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '700px' }}
      >
        <div style={{ 
          padding: 'var(--spacing-xl)',
          borderBottom: '1px solid var(--glass-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <h2 style={{ margin: 0 }}>Your Statistics</h2>
          <button className="btn-icon" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div style={{ padding: 'var(--spacing-xl)' }}>
          {userProgress.totalQuizzes === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
              <Target size={48} color="var(--text-muted)" style={{ margin: '0 auto var(--spacing-md)' }} />
              <p className="text-muted">No quiz attempts yet. Start learning!</p>
            </div>
          ) : (
            <>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: 'var(--spacing-md)',
                marginBottom: 'var(--spacing-xl)',
              }}>
                <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-lg)' }}>
                  <TrendingUp size={24} color="var(--primary)" style={{ margin: '0 auto var(--spacing-sm)' }} />
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                    {Math.round(userProgress.overallAccuracy)}%
                  </div>
                  <div className="text-muted" style={{ fontSize: '0.875rem' }}>
                    Overall Accuracy
                  </div>
                </div>

                <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-lg)' }}>
                  <Award size={24} color="var(--secondary)" style={{ margin: '0 auto var(--spacing-sm)' }} />
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--secondary)' }}>
                    {userProgress.totalQuizzes}
                  </div>
                  <div className="text-muted" style={{ fontSize: '0.875rem' }}>
                    Quizzes Taken
                  </div>
                </div>

                <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-lg)' }}>
                  <Target size={24} color="var(--success)" style={{ margin: '0 auto var(--spacing-sm)' }} />
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success)' }}>
                    {userProgress.totalQuestionsAnswered}
                  </div>
                  <div className="text-muted" style={{ fontSize: '0.875rem' }}>
                    Questions Answered
                  </div>
                </div>
              </div>

              <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Deck Performance</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                {Object.entries(userProgress.decks).map(([deckId, stats]) => {
                  const deck = decks.find(d => d.id === deckId);
                  if (!deck) return null;

                  return (
                    <div 
                      key={deckId}
                      className="card"
                      style={{ padding: 'var(--spacing-md)' }}
                    >
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: 'var(--spacing-sm)',
                      }}>
                        <h4 style={{ margin: 0, fontSize: '1.125rem' }}>{deck.name}</h4>
                        <span className={`badge ${
                          stats.accuracy >= 75 ? 'badge-success' : 
                          stats.accuracy >= 60 ? 'badge-warning' : 
                          'badge-error'
                        }`}>
                          {Math.round(stats.accuracy)}%
                        </span>
                      </div>

                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: 'var(--spacing-sm)',
                        fontSize: '0.875rem',
                      }}>
                        <div>
                          <span className="text-muted">Attempts: </span>
                          <span style={{ fontWeight: 600 }}>{stats.totalAttempts}</span>
                        </div>
                        <div>
                          <span className="text-muted">Correct: </span>
                          <span style={{ fontWeight: 600, color: 'var(--success)' }}>
                            {stats.correctAnswers}/{stats.totalQuestions}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted">Last: </span>
                          <span style={{ fontWeight: 600 }}>{formatDate(stats.lastAttemptDate)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
