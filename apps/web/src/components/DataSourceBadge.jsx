import React from 'react';

// Maps types to CSS badge classes
const TYPE_CONFIG = {
  'Measured': 'badge-blue',
  'Estimated': 'badge-amber',
  'Forecast': 'badge-purple',
  'Simulated': 'badge-teal',
  'Indicative': 'badge-emerald',
  'Verified': 'badge-emerald',
};

const DataSourceBadge = ({ type, className = '' }) => {
  const badgeClass = TYPE_CONFIG[type] || 'badge-gray';
  
  return (
    <span className={`badge ${badgeClass} ${className}`}>
      {type}
    </span>
  );
};

export default DataSourceBadge;
