import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ShieldCheck, Mail, Key, LogOut, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ProfilePage = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="pb-3 border-b border-slate-200">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">User Account & Authorization Profile</h1>
        <p className="text-xs text-slate-500 mt-1">
          Review your authenticated enterprise session, organizational permissions, and access level
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-slate-100">
          <div className="w-20 h-20 rounded-full bg-[#0c1b30] text-white flex items-center justify-center font-bold text-2xl uppercase shadow-xs shrink-0">
            {user?.fullName ? user.fullName.charAt(0) : 'U'}
          </div>
          <div className="flex-1 text-center sm:text-left space-y-1">
            <h2 className="text-xl font-bold text-slate-900">{user?.fullName || 'HR Executive'}</h2>
            <p className="text-xs text-slate-500">{user?.email || 'user@aysqo.com'}</p>
            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-blue-600" />
                Role: {role || 'HR'}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                Active Session
              </span>
            </div>
          </div>
        </div>

        {/* Account Details */}
        <div className="p-6 sm:p-8 space-y-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            System Account Credentials
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/70">
              <span className="text-slate-400 block mb-1">Username Identifier</span>
              <span className="font-semibold text-slate-800">{user?.username}</span>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/70">
              <span className="text-slate-400 block mb-1">Registered Work Email</span>
              <span className="font-semibold text-slate-800">{user?.email}</span>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/70">
              <span className="text-slate-400 block mb-1">Assigned Security Role</span>
              <span className="font-semibold text-slate-800">{role}</span>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/70">
              <span className="text-slate-400 block mb-1">Session Security</span>
              <span className="font-semibold text-slate-800">JWT + BCrypt Authentication</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="text-xs text-slate-500">
              Session is protected and authenticated against MySQL backend.
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 text-xs font-semibold text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-200 rounded-lg transition"
            >
              <LogOut className="w-3.5 h-3.5 mr-1.5" />
              Sign Out of System
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
