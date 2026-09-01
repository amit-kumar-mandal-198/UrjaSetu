import React from 'react';
import DataSourceBadge from './DataSourceBadge';

const MetricCard = ({ title, value, unit, icon: Icon, iconColorClass = 'text-blue-500', iconBgClass = 'bg-blue-100', dataSourceType }) => {
  return (
    <div className="card">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconBgClass} ${iconColorClass}`}>
          {Icon && <Icon size={24} />}
        </div>
        {dataSourceType && <DataSourceBadge type={dataSourceType} />}
      </div>
      
      <div className="text-muted text-sm font-medium mb-1">{title}</div>
      <div className="text-2xl font-semibold">
        {value} <span className="text-sm font-normal text-muted">{unit}</span>
      </div>
    </div>
  );
};

export default MetricCard;
