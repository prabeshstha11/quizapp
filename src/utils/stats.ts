import { DeckStats } from '../types';

export function calculateAccuracy(correct: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

export function formatAccuracy(accuracy: number): string {
  return `${accuracy.toFixed(0)}%`;
}

export function getPerformanceLevel(accuracy: number): 'excellent' | 'good' | 'fair' | 'poor' {
  if (accuracy >= 90) return 'excellent';
  if (accuracy >= 75) return 'good';
  if (accuracy >= 60) return 'fair';
  return 'poor';
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  
  return date.toLocaleDateString();
}

export function getStreakMessage(stats: DeckStats): string {
  if (stats.totalAttempts === 0) return 'Start your first quiz!';
  if (stats.accuracy >= 90) return '🔥 On fire!';
  if (stats.accuracy >= 75) return '⭐ Great job!';
  if (stats.accuracy >= 60) return '👍 Keep it up!';
  return '💪 Practice makes perfect!';
}
