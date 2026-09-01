import React from 'react';
import { Sun, Home, Zap } from 'lucide-react';
import DataSourceBadge from './DataSourceBadge';

const EnergyFlowCard = ({ solar, home, gridImport, gridExport }) => {
  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Energy Flow</h3>
        <DataSourceBadge type="Measured" />
      </div>
      
      <div className="flex justify-between items-center px-4 py-8">
        {/* Solar */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{backgroundColor: 'var(--bg-amber)', color: 'var(--color-amber)'}}>
            <Sun size={32} />
          </div>
          <span className="font-semibold">{solar} W</span>
          <span className="text-sm text-muted">Solar</span>
        </div>
        
        <div className="flex-1 flex flex-col items-center relative">
          <div className="h-1 w-full bg-gray-200 absolute top-1/2 -z-10"></div>
          <span className="text-xs font-semibold px-2 py-1 bg-white border rounded-full text-green-600 mb-8" style={{color: 'var(--color-emerald)', borderColor: 'var(--color-emerald)'}}>
            OPTIMIZED
          </span>
        </div>

        {/* Home */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{backgroundColor: 'var(--bg-blue)', color: 'var(--color-blue)'}}>
            <Home size={32} />
          </div>
          <span className="font-semibold">{home} W</span>
          <span className="text-sm text-muted">Home</span>
        </div>
        
        <div className="flex-1 flex flex-col items-center relative">
          <div className="h-1 w-full bg-gray-200 absolute top-1/2 -z-10"></div>
        </div>

        {/* Grid */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{backgroundColor: 'var(--bg-card-hover)', color: 'var(--text-muted)'}}>
            <Zap size={32} />
          </div>
          <span className="font-semibold">{gridExport > 0 ? gridExport : gridImport} W</span>
          <span className="text-sm text-muted">{gridExport > 0 ? 'Export' : 'Import'}</span>
        </div>
      </div>
    </div>
  );
};

export default EnergyFlowCard;
