import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ErrorState = ({ title = "Something went wrong", message = "An error occurred while loading this data.", onRetry }) => {
  return (
    <div className="card flex flex-col items-center justify-center p-12 text-center" style={{ border: '1px solid var(--color-red)' }}>
      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--bg-red)', color: 'var(--color-red)' }}>
        <AlertTriangle size={32} />
      </div>
      <h3 className="text-lg font-semibold mb-2 text-red-700">{title}</h3>
      <p className="text-muted mb-6">{message}</p>
      
      {onRetry && (
        <button className="btn btn-outline" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorState;
