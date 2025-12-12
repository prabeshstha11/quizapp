import { useState } from 'react';
import { QuizProvider, useQuiz } from './context/QuizContext';
import { Header } from './components/Header';
import { DeckList } from './components/DeckList';
import { CreateDeck } from './components/CreateDeck';
import { CustomQuiz } from './components/CustomQuiz';
import { Quiz } from './components/Quiz';
import { StatsPanel } from './components/StatsPanel';
import { Layout } from './components/Layout';
import './index.css';

function AppContent() {
  const { decks, startQuiz, startCustomQuiz, currentSession } = useQuiz();
  const [showCreateDeck, setShowCreateDeck] = useState(false);
  const [showCustomQuiz, setShowCustomQuiz] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [activeQuizDeckId, setActiveQuizDeckId] = useState<string | null>(null);

  const handleStartQuiz = (deckId: string) => {
    startQuiz(deckId);
    setActiveQuizDeckId(deckId);
  };

  const handleStartCustomQuiz = (deckIds: string[], questionCount: number) => {
    startCustomQuiz(deckIds, questionCount);
    setActiveQuizDeckId('custom');
  };

  const handleCloseQuiz = () => {
    setActiveQuizDeckId(null);
  };

  const activeDeck = activeQuizDeckId && activeQuizDeckId !== 'custom' 
    ? decks.find(d => d.id === activeQuizDeckId) 
    : undefined;

  return (
    <Layout>
      <Header 
        onCreateDeck={() => setShowCreateDeck(true)} 
        onViewStats={() => setShowStats(true)}
        onCustomQuiz={() => setShowCustomQuiz(true)}
      />
      
      <DeckList 
        onStartQuiz={handleStartQuiz}
        onCreateDeck={() => setShowCreateDeck(true)}
      />

      {showCreateDeck && (
        <CreateDeck onClose={() => setShowCreateDeck(false)} />
      )}

      {showCustomQuiz && (
        <CustomQuiz 
          onClose={() => setShowCustomQuiz(false)}
          onStart={handleStartCustomQuiz}
        />
      )}

      {showStats && (
        <StatsPanel onClose={() => setShowStats(false)} />
      )}

      {currentSession && (
        <Quiz deck={activeDeck} onClose={handleCloseQuiz} />
      )}
    </Layout>
  );
}

function App() {
  return (
    <QuizProvider>
      <AppContent />
    </QuizProvider>
  );
}

export default App;


