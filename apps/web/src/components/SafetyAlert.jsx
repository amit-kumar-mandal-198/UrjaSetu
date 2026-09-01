import React from 'react';
import { AlertOctagon } from 'lucide-react';

const SafetyAlert = ({ title, message }) => {
  return (
    <div style={{
      padding: '1rem',
      borderRadius: '8px',
      backgroundColor: 'var(--bg-red)',
      color: 'var(--color-red)',
      border: '1px solid #fca5a5',
      display: 'flex',
      gap: '1rem',
      alignItems: 'flex-start',
      marginBottom: '1.5rem'
    }}>
      <AlertOctagon size={24} style={{ flexShrink: 0 }} />
      <div>
        <h4 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{title}</h4>
        <p style={{ fontSize: '0.9rem' }}>{message}</p>
      </div>
    </div>
  );
};

export default SafetyAlert;
