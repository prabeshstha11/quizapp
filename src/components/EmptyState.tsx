import { BookOpen } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export function EmptyState({ 
  title, 
  description, 
  actionLabel, 
  onAction,
  icon = <BookOpen size={48} />
}: EmptyStateProps) {
  return (
    <div className="fade-in" style={{
      textAlign: 'center',
      padding: 'var(--spacing-2xl)',
      maxWidth: '500px',
      margin: '0 auto',
    }}>
      <div style={{
        width: '80px',
        height: '80px',
        background: 'var(--glass-bg)',
        borderRadius: 'var(--radius-xl)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto var(--spacing-xl)',
        color: 'var(--text-muted)',
      }}>
        {icon}
      </div>
      
      <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>{title}</h3>
      <p className="text-muted" style={{ marginBottom: 'var(--spacing-xl)' }}>
        {description}
      </p>
      
      {actionLabel && onAction && (
        <button className="btn-primary" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
