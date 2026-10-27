import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  UserX, 
  UserCheck, 
  LogOut, 
  Building2, 
  ShieldCheck 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ isMobileOpen, closeMobile }) => {
  const { user, logout, role } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Employee Directory', path: '/employees', icon: Users },
    { name: 'New Enrollment', path: '/employees/new', icon: UserPlus },
    { name: 'Inactive Employees', path: '/employees/inactive', icon: UserX },
    { name: 'Account Profile', path: '/profile', icon: UserCheck },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0c1b30] text-slate-300 border-r border-[#1e3d64]">
      {/* Brand Header */}
      <div className="flex items-center px-4 h-16 border-b border-[#1e3d64] bg-[#081322]">
        <div className="flex items-center space-x-3 w-full">
          <div className="bg-white p-1 rounded-lg shadow-xs flex items-center justify-center shrink-0">
            <img 
              src="/aysqo-logo.png" 
              alt="Aysqo Technology Solutions" 
              className="h-8 w-auto object-contain max-w-[130px]" 
            />
          </div>
          <div className="overflow-hidden">
            <span className="text-[10px] font-semibold tracking-wider text-blue-300 uppercase block">HR Portal</span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        <div className="px-3 mb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Management
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeMobile}
              className={({ isActive }) =>
                `flex items-center px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-slate-300 hover:bg-[#142a47] hover:text-white'
                }`
              }
            >
              <Icon className="w-4 h-4 mr-3 shrink-0" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      {/* User Card & Logout */}
      <div className="p-4 border-t border-[#1e3d64] bg-[#081322]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-blue-700/60 border border-blue-400/30 flex items-center justify-center text-white text-xs font-bold uppercase shrink-0">
              {user?.fullName ? user.fullName.charAt(0) : 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">{user?.fullName || 'HR User'}</p>
              <div className="flex items-center space-x-1 mt-0.5">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span className="text-[10px] font-medium text-slate-400 uppercase">{role || 'HR'}</span>
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center px-3 py-2 text-xs font-medium text-slate-300 hover:text-rose-400 hover:bg-[#142a47] rounded-lg transition"
        >
          <LogOut className="w-3.5 h-3.5 mr-2" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-slate-900/60" onClick={closeMobile} />
          <div className="fixed inset-y-0 left-0 w-64 bg-[#0c1b30] shadow-xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
