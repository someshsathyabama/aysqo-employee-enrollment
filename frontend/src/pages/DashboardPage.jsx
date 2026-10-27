import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  UserCheck, 
  Clock, 
  FileEdit, 
  UserPlus, 
  ArrowRight, 
  RefreshCw, 
  Building,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { dashboardService } from '../services/dashboardService';
import { StatCard } from '../components/ui/StatCard';
import { StatusBadge } from '../components/ui/StatusBadge';

export const DashboardPage = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      setError('');
      const data = await dashboardService.getSummary();
      setSummary(data);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      setError('Failed to fetch dashboard metrics. Please ensure backend is running.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center space-x-3.5">
          <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-xs shrink-0 flex items-center justify-center">
            <img src="/aysqo-logo.png" alt="Aysqo Technology Solutions" className="h-10 w-auto object-contain" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">HR Executive Dashboard</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Aysqo Technology Solutions • Headcount, enrollment pipelines & corporate metrics
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2.5">
          <button
            onClick={fetchDashboardData}
            disabled={refreshing}
            className="inline-flex items-center px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition disabled:opacity-50"
            title="Refresh statistics"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${refreshing ? 'animate-spin text-blue-600' : ''}`} />
            Refresh
          </button>
          <Link
            to="/employees/new"
            className="inline-flex items-center px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition"
          >
            <UserPlus className="w-3.5 h-3.5 mr-1.5" />
            Add Employee Enrollment
          </Link>
        </div>
      </div>

      {error && (
        <div className="flex items-center p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
          <AlertCircle className="w-4 h-4 mr-2 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Workforce"
          value={loading ? '...' : summary?.totalEmployees ?? 0}
          icon={Users}
          changeText="All registered personnel"
          trendColor="text-slate-500"
          badgeText="Total"
        />
        <StatCard
          title="Active Headcount"
          value={loading ? '...' : summary?.activeEmployees ?? 0}
          icon={UserCheck}
          changeText="Operating & active"
          trendColor="text-emerald-600"
          badgeText="Active"
        />
        <StatCard
          title="Pending Approvals"
          value={loading ? '...' : summary?.pendingEnrollments ?? 0}
          icon={Clock}
          changeText="Submitted for HR review"
          trendColor="text-blue-600"
          badgeText="Submitted"
        />
        <StatCard
          title="Draft Enrollments"
          value={loading ? '...' : summary?.draftEnrollments ?? 0}
          icon={FileEdit}
          changeText="Incomplete onboarding"
          trendColor="text-amber-600"
          badgeText="Drafts"
        />
      </div>

      {/* Grid: Recent Enrollments & Department Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Enrollments Table (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Recent Employee Enrollments</h2>
              <p className="text-xs text-slate-500 mt-0.5">Latest registrations added into the system</p>
            </div>
            <Link
              to="/employees"
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center transition"
            >
              View Full Directory
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Department & Role</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-400">
                      Loading latest records...
                    </td>
                  </tr>
                ) : !summary?.recentEnrollments || summary.recentEnrollments.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-400">
                      No recent enrollment records found.
                    </td>
                  </tr>
                ) : (
                  summary.recentEnrollments.map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{emp.fullName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{emp.employeeId}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800">{emp.jobTitle}</div>
                        <div className="text-[11px] text-slate-500">{emp.department}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-medium">
                        {emp.employmentType}
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={emp.enrollmentStatus} active={emp.isActive} />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          to={`/employees/${emp.id}`}
                          className="font-medium text-blue-600 hover:text-blue-800"
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Department Distribution (1 col) */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 flex flex-col">
          <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-slate-100">
            <Building className="w-4 h-4 text-slate-600" />
            <h2 className="text-sm font-semibold text-slate-900">Workforce by Department</h2>
          </div>

          <div className="space-y-3.5 flex-1 overflow-y-auto">
            {loading ? (
              <p className="text-xs text-slate-400 text-center py-6">Calculating distribution...</p>
            ) : !summary?.departmentBreakdown || Object.keys(summary.departmentBreakdown).length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No departmental data available.</p>
            ) : (
              Object.entries(summary.departmentBreakdown).map(([dept, count]) => {
                const total = summary.activeEmployees || 1;
                const percentage = Math.round((count / total) * 100);
                return (
                  <div key={dept} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-slate-700">{dept}</span>
                      <span className="text-slate-500">{count} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <Link
              to="/employees"
              className="w-full py-2 px-3 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center transition"
            >
              Open Full Directory & Filters
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
