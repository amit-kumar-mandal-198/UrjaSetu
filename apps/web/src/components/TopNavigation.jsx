import React from 'react';
import { AlertCircle, Bell, ChevronDown } from 'lucide-react';
import DataSourceBadge from './DataSourceBadge';

const TopNavigation = ({ title = "Overview" }) => {
  return (
    <div className="flex justify-between items-center mb-8 pb-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
      
      <div className="flex items-center gap-6">
        
        {/* System Online Indicator */}
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'var(--color-emerald)' }}></div>
          <span className="text-sm font-medium text-gray-700">System Online</span>
        </div>

        {/* Property Selector */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors border border-gray-200">
          <span className="text-sm font-semibold text-gray-700">Shanti Hostel · Roorkee</span>
          <ChevronDown size={16} className="text-gray-500" />
        </div>

        {/* Notification Icon */}
        <div className="relative cursor-pointer hover:bg-gray-100 p-2 rounded-full transition-colors">
          <Bell size={20} className="text-gray-600" />
          <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-red)' }}></div>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm" style={{ backgroundColor: 'var(--bg-red)', color: 'var(--color-red)' }}>
          <AlertCircle size={16} />
          Prototype: 5-12V DC Only
        </div>
        
        <DataSourceBadge type="Indicative" />

        {/* Avatar */}
        <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold border" style={{ backgroundColor: 'var(--bg-card-hover)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}>
          SK
        </div>
      </div>
    </div>
  );
};

export default TopNavigation;
