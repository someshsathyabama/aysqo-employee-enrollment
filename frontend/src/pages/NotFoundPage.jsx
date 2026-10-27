import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="p-4 bg-slate-100 rounded-2xl mb-4 text-slate-500">
        <FileQuestion className="w-12 h-12" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">404 — Page Not Found</h1>
      <p className="mt-2 text-sm text-slate-500 max-w-md">
        The corporate page or employee record you are trying to view does not exist or has been relocated.
      </p>
      <div className="mt-6">
        <Link
          to="/dashboard"
          className="inline-flex items-center px-4 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};
