import { useState, useRef } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { X, Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { useQuiz } from '../context/QuizContext';
import { Deck, ParseResult } from '../types';

interface CreateDeckProps {
  onClose: () => void;
}

export function CreateDeck({ onClose }: CreateDeckProps) {
  const { addDeck } = useQuiz();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const content = await file.text();
      const result = await invoke<ParseResult>('parse_quiz_file', { content });
      setParseResult(result);
    } catch (error) {
      console.error('Error parsing file:', error);
      setParseResult({
        questions: [],
        error: 'Failed to parse file. Please check the format.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (!name.trim() || !parseResult || parseResult.questions.length === 0) {
      return;
    }

    const deck: Deck = {
      id: crypto.randomUUID(),
      name: name.trim(),
      description: description.trim(),
      questions: parseResult.questions,
      createdAt: new Date().toISOString(),
    };

    addDeck(deck);
    onClose();
  };

  const canSave = name.trim() && parseResult && parseResult.questions.length > 0 && !parseResult.error;

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
          <h2 style={{ margin: 0 }}>Create New Deck</h2>
          <button className="btn-icon" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div style={{ padding: 'var(--spacing-xl)' }}>
          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: 'var(--spacing-sm)',
              fontWeight: 600,
            }}>
              Deck Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., French Vocabulary, Math Formulas"
              autoFocus
            />
          </div>

          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: 'var(--spacing-sm)',
              fontWeight: 600,
            }}>
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this deck..."
              rows={3}
            />
          </div>

          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: 'var(--spacing-sm)',
              fontWeight: 600,
            }}>
              Upload Questions *
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <button
              className="btn-secondary"
              onClick={() => fileInputRef.current?.click()}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <Upload size={18} />
              Choose .txt File
            </button>
            <p className="text-muted" style={{ 
              fontSize: '0.875rem', 
              marginTop: 'var(--spacing-sm)',
            }}>
              Format: Question? | Option A | Option B | Option C | Option D | Correct (0-3)
            </p>
          </div>

          {isLoading && (
            <div className="pulse" style={{ 
              textAlign: 'center', 
              padding: 'var(--spacing-lg)',
              color: 'var(--text-muted)',
            }}>
              <FileText size={32} style={{ margin: '0 auto var(--spacing-sm)' }} />
              <p>Parsing questions...</p>
            </div>
          )}

          {parseResult && !isLoading && (
            <div style={{
              padding: 'var(--spacing-lg)',
              background: parseResult.error ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
              borderRadius: 'var(--radius-md)',
              border: `1px solid ${parseResult.error ? 'var(--error)' : 'var(--success)'}`,
              marginBottom: 'var(--spacing-lg)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                {parseResult.error ? (
                  <>
                    <AlertCircle size={20} color="var(--error)" />
                    <span style={{ color: 'var(--error)' }}>{parseResult.error}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} color="var(--success)" />
                    <span style={{ color: 'var(--success)' }}>
                      Successfully parsed {parseResult.questions.length} question{parseResult.questions.length !== 1 ? 's' : ''}
                    </span>
                  </>
                )}
              </div>
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
              onClick={handleSave}
              disabled={!canSave}
            >
              Create Deck
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
