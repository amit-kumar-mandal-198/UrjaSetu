import React from 'react';

const LoadingSkeleton = ({ type = 'card' }) => {
  if (type === 'card') {
    return (
      <div className="card">
        <div className="flex justify-between items-start mb-4">
          <div className="w-11 h-11 bg-gray-200 rounded-xl animate-pulse"></div>
          <div className="w-20 h-6 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
        <div className="w-24 h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
        <div className="w-32 h-8 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  if (type === 'row') {
    return (
      <div className="w-full h-12 bg-gray-200 rounded animate-pulse mb-2"></div>
    );
  }

  return (
    <div className="w-full h-32 bg-gray-200 rounded animate-pulse"></div>
  );
};

export default LoadingSkeleton;
