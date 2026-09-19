import { useState } from 'react';
import { Mic, MicOff, MessageSquareText, Sparkles } from 'lucide-react';
import { BackToDashboardButton } from '../components/BackToDashboardButton';

export const VoiceAssistant = () => {
  const [listening, setListening] = useState(false);
  const [query, setQuery] = useState('Find a pediatrician near Mandya');

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem 3.5rem', minHeight: '70vh' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        <BackToDashboardButton />
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ margin: 0, color: 'var(--primary)', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', fontSize: '0.75rem' }}>
            Voice Assistant
          </p>
          <h1 style={{ margin: '0.35rem 0 0', fontSize: '2rem', fontWeight: 800 }}>Speak to get help faster</h1>
        </div>

        <div className="card" style={{ backgroundColor: '#ffffff', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <button
              type="button"
              onClick={() => setListening((prev) => !prev)}
              style={{
                width: '84px',
                height: '84px',
                borderRadius: '50%',
                border: 'none',
                background: listening ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'linear-gradient(135deg, #14b8a6, #0f766e)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 12px 28px rgba(20, 184, 166, 0.28)',
                cursor: 'pointer',
              }}
            >
              {listening ? <MicOff size={28} /> : <Mic size={28} />}
            </button>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--text-muted)' }}>
            {listening ? 'Listening now...' : 'Tap to start voice command'}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1rem', borderRadius: '12px', backgroundColor: 'var(--bg-subtle)', marginBottom: '1rem' }}>
            <Sparkles size={18} color="var(--primary)" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ border: 'none', outline: 'none', background: 'transparent', flex: 1, fontSize: '0.96rem' }}
            />
          </div>

          <div style={{ display: 'grid', gap: '0.6rem' }}>
            <div style={{ backgroundColor: 'var(--bg-subtle)', borderRadius: '12px', padding: '0.9rem 1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                <MessageSquareText size={16} color="var(--primary)" /> Assistant reply
              </div>
              <div style={{ marginTop: '0.4rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                I found pediatric doctors in Mandya. Best available option is Dr. Ananya Rao, available today after 3:00 PM.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
