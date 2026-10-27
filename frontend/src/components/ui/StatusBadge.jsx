import React from 'react';

export const StatusBadge = ({ status, active = true }) => {
  if (active === false) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
        <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-gray-400"></span>
        Inactive
      </span>
    );
  }

  const normalized = status ? status.toLowerCase() : '';

  if (normalized === 'approved') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-emerald-500"></span>
        Approved
      </span>
    );
  }

  if (normalized === 'submitted' || normalized === 'pending') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
        <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-blue-500 animate-pulse"></span>
        Submitted
      </span>
    );
  }

  // Draft
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
      <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-amber-500"></span>
      Draft
    </span>
  );
};
