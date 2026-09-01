import React from 'react';
import { Zap } from 'lucide-react';

const RecommendationCard = ({ title, description, logicDetails, onAccept }) => {
  return (
    <div className="card" style={{ borderTop: '4px solid var(--color-purple)' }}>
      <div className="flex items-center gap-2 mb-4" style={{ color: 'var(--color-purple)', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
        <Zap size={16} />
        UrjaSetu Planning
      </div>
      
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted mb-6 line-height-relaxed">{description}</p>
      
      {logicDetails && (
        <div className="p-4 mb-6 rounded-lg" style={{ backgroundColor: 'var(--bg-card-hover)', border: '1px solid var(--border-color)' }}>
          <p className="text-sm font-medium">{logicDetails}</p>
        </div>
      )}
      
      <button className="btn btn-primary w-full" onClick={onAccept}>
        Review & Approve Plan
      </button>
    </div>
  );
};

export default RecommendationCard;
