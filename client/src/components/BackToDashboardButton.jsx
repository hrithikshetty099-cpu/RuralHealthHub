import { ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BackToDashboardButton = ({ label = 'Back to Dashboard' }) => {
  const { navigateTo } = useApp();

  return (
    <button
      type="button"
      onClick={() => navigateTo('dashboard')}
      className="btn btn-secondary btn-sm"
      style={{ marginBottom: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
    >
      <ArrowLeft size={16} />
      <span>{label}</span>
    </button>
  );
};
