import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Menu, Bell, User, LogOut, CheckCircle2, ChevronDown, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar = ({ openMobile }) => {
  const { user, logout, role } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-slate-200/90 h-16 flex items-center px-4 sm:px-6 lg:px-8 justify-between">
      <div className="flex items-center space-x-3">
        <button
          onClick={openMobile}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition"
          aria-label="Open mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center space-x-2.5">
          <img 
            src="/aysqo-logo.png" 
            alt="Aysqo Logo" 
            className="h-7 w-auto object-contain hidden sm:block" 
          />
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
            Aysqo Technologies Portal
          </span>
          <span className="hidden sm:inline-flex items-center text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
            MySQL Connected
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* User Account Menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-3 p-1.5 rounded-lg hover:bg-slate-100 transition focus:outline-hidden"
            aria-expanded={dropdownOpen}
          >
            <div className="w-8 h-8 rounded-full bg-navy-800 text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
              {user?.fullName ? user.fullName.charAt(0) : 'U'}
            </div>
            <div className="hidden md:block text-left">
              <span className="text-xs font-semibold text-slate-800 block leading-tight">
                {user?.fullName || 'HR Manager'}
              </span>
              <span className="text-[10px] text-slate-500 block">
                {role || 'Role'} • {user?.username}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-900">{user?.fullName}</p>
                <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                <div className="mt-1 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700">
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  Role: {role}
                </div>
              </div>

              <Link
                to="/profile"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition"
              >
                <User className="w-4 h-4 mr-2 text-slate-400" />
                Account Profile & Details
              </Link>

              <div className="border-t border-slate-100 my-1"></div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
