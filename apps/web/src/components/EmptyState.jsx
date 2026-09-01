import React from 'react';
import { PackageOpen } from 'lucide-react';

const EmptyState = ({ title, message, icon: Icon = PackageOpen }) => {
  return (
    <div className="card flex flex-col items-center justify-center p-12 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
        <Icon size={32} />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted">{message}</p>
    </div>
  );
};

export default EmptyState;
