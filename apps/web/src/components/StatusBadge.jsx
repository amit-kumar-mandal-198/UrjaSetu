import React from 'react';

const STATUS_CONFIG = {
  'Running': { color: 'var(--color-emerald)', bg: 'var(--bg-emerald)' },
  'Planned': { color: 'var(--color-purple)', bg: 'var(--bg-purple)' },
  'Offline': { color: 'var(--text-muted)', bg: '#F1F5F9' },
  'Error': { color: 'var(--color-red)', bg: 'var(--bg-red)' },
  'OK': { color: 'var(--color-teal)', bg: 'var(--bg-teal)' },
  'OPTIMIZED': { color: 'var(--color-blue)', bg: 'var(--bg-blue)' },
  'GOOD': { color: 'var(--color-emerald)', bg: 'var(--bg-emerald)' },
};

const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG['Offline'];

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
      padding: '0.3rem 0.6rem', borderRadius: '20px',
      fontSize: '0.85rem', fontWeight: '500',
      backgroundColor: 'var(--bg-card-hover)', border: '1px solid var(--border-color)'
    }}>
      <span style={{
        width: '8px', height: '8px', borderRadius: '50%',
        backgroundColor: config.color
      }} />
      {status}
    </span>
  );
};

export default StatusBadge;
