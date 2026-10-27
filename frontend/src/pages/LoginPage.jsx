import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Lock, User, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError('Please provide both username and password.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      await login(username.trim(), password);
      navigate('/dashboard');
    } catch (err) {
      const serverMessage = err.response?.data?.message || 'Invalid username or password. Please try again.';
      setError(serverMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoCredentials = (role) => {
    if (role === 'admin') {
      setUsername('admin');
      setPassword('Admin@123');
    } else {
      setUsername('hr_manager');
      setPassword('Hr@123');
    }
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="p-3 bg-[#0c1b30] rounded-xl shadow-md border border-[#1e3d64] text-white">
            <Building2 className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-2xl font-bold tracking-tight text-slate-900">
          AYSQO TECHNOLOGIES
        </h2>
        <p className="mt-1 text-center text-xs font-semibold tracking-wider uppercase text-slate-500">
          Enterprise Employee Enrollment System
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200/90 rounded-2xl sm:px-10">
          <div className="mb-6">
            <h3 className="text-base font-semibold text-slate-900">Corporate Sign In</h3>
            <p className="text-xs text-slate-500 mt-0.5">Enter your authorized administrative or HR credentials</p>
          </div>

          {error && (
            <div className="mb-5 flex items-start p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
              <AlertCircle className="w-4 h-4 mr-2 shrink-0 text-rose-600 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Username or Work Email
              </label>
              <div className="relative rounded-lg shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. admin or hr_manager"
                  className="block w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-hidden transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Account Password
              </label>
              <div className="relative rounded-lg shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-hidden transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-xs text-sm font-semibold text-white bg-[#0c1b30] hover:bg-[#142a47] focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Authenticating...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo Quick-Fill helper */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 text-center">
              Demonstration Quick Access
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillDemoCredentials('admin')}
                className="flex items-center justify-center px-3 py-2 text-xs font-medium bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 transition"
              >
                <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
                Fill Admin
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('hr')}
                className="flex items-center justify-center px-3 py-2 text-xs font-medium bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 transition"
              >
                <User className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                Fill HR Lead
              </button>
            </div>
            <p className="mt-2 text-[11px] text-slate-400 text-center">
              Admin: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-600">Admin@123</code> | HR: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-600">Hr@123</code>
            </p>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-slate-500">
          Protected corporate network. Authorized internal personnel only.
        </p>
      </div>
    </div>
  );
};
