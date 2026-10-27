import React from 'react';

export const StatCard = ({ title, value, icon: Icon, changeText, trendColor = 'text-blue-600', badgeText }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs hover:border-slate-300 transition-all duration-200">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</span>
        {Icon && (
          <div className="p-2.5 rounded-lg bg-navy-50 text-navy-700">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      <div className="mt-3 flex items-baseline justify-between">
        <span className="text-3xl font-bold tracking-tight text-slate-900">{value}</span>
        {badgeText && (
          <span className="text-xs px-2 py-0.5 rounded-md font-medium bg-slate-100 text-slate-600">
            {badgeText}
          </span>
        )}
      </div>
      {changeText && (
        <div className="mt-2 text-xs font-medium text-slate-500">
          <span className={trendColor}>{changeText}</span>
        </div>
      )}
    </div>
  );
};
