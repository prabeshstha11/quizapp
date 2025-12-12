import { useQuiz } from '../context/QuizContext';
import { DeckCard } from './DeckCard';
import { EmptyState } from './EmptyState';
import { Plus } from 'lucide-react';

interface DeckListProps {
  onStartQuiz: (deckId: string) => void;
  onCreateDeck: () => void;
}

export function DeckList({ onStartQuiz, onCreateDeck }: DeckListProps) {
  const { decks } = useQuiz();

  if (decks.length === 0) {
    return (
      <EmptyState
        title="No decks yet"
        description="Create your first study deck to start learning!"
        actionLabel="Create Deck"
        onAction={onCreateDeck}
        icon={<Plus size={48} />}
      />
    );
  }

  return (
    <div className="container" style={{ paddingTop: 'var(--spacing-xl)' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 'var(--spacing-lg)',
      }}>
        {decks.map(deck => (
          <DeckCard
            key={deck.id}
            deck={deck}
            onStartQuiz={onStartQuiz}
          />
        ))}
      </div>
    </div>
  );
}
