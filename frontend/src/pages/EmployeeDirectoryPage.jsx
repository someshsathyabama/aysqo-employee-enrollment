import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  UserPlus, 
  Eye, 
  Edit2, 
  Power, 
  RefreshCw, 
  X, 
  AlertCircle,
  FileCheck2,
  Trash2
} from 'lucide-react';
import { employeeService } from '../services/employeeService';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Pagination } from '../components/ui/Pagination';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { NotificationToast } from '../components/ui/NotificationToast';
import { useAuth } from '../context/AuthContext';

export const EmployeeDirectoryPage = () => {
  const { isAdmin } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState(null);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [employmentType, setEmploymentType] = useState('');
  const [enrollmentStatus, setEnrollmentStatus] = useState('');
  const [activeFilter, setActiveFilter] = useState('true');

  // Pagination state
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Modal confirmation state
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmLabel: 'Confirm',
    isDestructive: false,
    action: null,
  });

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(0);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page,
        size: pageSize,
        search: debouncedSearch || undefined,
        department: department || undefined,
        employmentType: employmentType || undefined,
        enrollmentStatus: enrollmentStatus || undefined,
        active: activeFilter === 'all' ? undefined : activeFilter === 'true',
      };

      const result = await employeeService.getEmployees(params);
      setEmployees(result.content || []);
      setTotalPages(result.totalPages || 0);
      setTotalElements(result.totalElements || 0);
    } catch (err) {
      console.error('Directory fetch error:', err);
      setError('Unable to fetch employee records. Please verify backend connection.');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, debouncedSearch, department, employmentType, enrollmentStatus, activeFilter]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleToggleActivePrompt = (employee) => {
    const isCurrentlyActive = employee.isActive;
    setModalConfig({
      isOpen: true,
      title: isCurrentlyActive ? 'Deactivate Employee' : 'Reactivate Employee',
      message: isCurrentlyActive
        ? `Are you sure you want to deactivate ${employee.fullName} (${employee.employeeId})? This marks their profile as inactive.`
        : `Reactivate ${employee.fullName} (${employee.employeeId}) back to active workforce status?`,
      confirmLabel: isCurrentlyActive ? 'Deactivate' : 'Reactivate',
      isDestructive: isCurrentlyActive,
      action: async () => {
        try {
          await employeeService.toggleActive(employee.id);
          setNotification({
            type: 'success',
            message: `Employee ${employee.fullName} status updated successfully.`,
          });
          fetchEmployees();
        } catch (err) {
          setNotification({
            type: 'error',
            message: 'Failed to update employee status.',
          });
        } finally {
          setModalConfig((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  const handleStatusChangePrompt = (employee, newStatus) => {
    setModalConfig({
      isOpen: true,
      title: `Update Enrollment Status to ${newStatus}`,
      message: `Change enrollment status for ${employee.fullName} (${employee.employeeId}) to ${newStatus}?`,
      confirmLabel: `Set to ${newStatus}`,
      isDestructive: false,
      action: async () => {
        try {
          await employeeService.updateStatus(employee.id, newStatus);
          setNotification({
            type: 'success',
            message: `Enrollment status changed to ${newStatus} for ${employee.fullName}.`,
          });
          fetchEmployees();
        } catch (err) {
          setNotification({
            type: 'error',
            message: 'Failed to change enrollment status.',
          });
        } finally {
          setModalConfig((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setDepartment('');
    setEmploymentType('');
    setEnrollmentStatus('');
    setActiveFilter('true');
    setPage(0);
  };

  return (
    <div className="space-y-5">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Employee Master Directory</h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse, search, and manage corporate employee records and enrollment status
          </p>
        </div>
        <div className="flex items-center space-x-2.5">
          <button
            onClick={fetchEmployees}
            className="p-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition"
            title="Refresh Directory"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link
            to="/employees/new"
            className="inline-flex items-center px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition"
          >
            <UserPlus className="w-3.5 h-3.5 mr-1.5" />
            Add Employee
          </Link>
        </div>
      </div>

      {notification && (
        <NotificationToast
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ID (AYS-...), full name, or email..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-hidden"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Department Filter */}
          <div className="md:col-span-2">
            <select
              value={department}
              onChange={(e) => { setDepartment(e.target.value); setPage(0); }}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-1 focus:ring-blue-600 outline-hidden"
            >
              <option value="">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Product">Product</option>
              <option value="Finance">Finance</option>
              <option value="Marketing">Marketing</option>
              <option value="Operations">Operations</option>
              <option value="Sales">Sales</option>
            </select>
          </div>

          {/* Employment Type */}
          <div className="md:col-span-2">
            <select
              value={employmentType}
              onChange={(e) => { setEmploymentType(e.target.value); setPage(0); }}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-1 focus:ring-blue-600 outline-hidden"
            >
              <option value="">All Types</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Contract">Contract</option>
              <option value="Intern">Intern</option>
            </select>
          </div>

          {/* Enrollment Status */}
          <div className="md:col-span-2">
            <select
              value={enrollmentStatus}
              onChange={(e) => { setEnrollmentStatus(e.target.value); setPage(0); }}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-1 focus:ring-blue-600 outline-hidden"
            >
              <option value="">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Submitted">Submitted</option>
              <option value="Approved">Approved</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          <div className="md:col-span-1">
            <button
              onClick={clearFilters}
              className="w-full py-2 px-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
              title="Reset all filters"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8fafc] text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 px-4">Employee ID</th>
                <th className="py-3 px-4">Full Name & Contact</th>
                <th className="py-3 px-4">Department & Role</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Joining Date</th>
                <th className="py-3 px-4">Enrollment Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-xs">Loading employee records...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-rose-500">
                    <AlertCircle className="w-6 h-6 mx-auto mb-2" />
                    <span>{error}</span>
                  </td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    <p className="font-medium text-slate-600">No employees match your search criteria.</p>
                    <p className="text-xs text-slate-400 mt-1">Try resetting the filters or add a new employee enrollment.</p>
                    <button
                      onClick={clearFilters}
                      className="mt-3 px-3 py-1.5 text-xs text-blue-600 hover:underline font-medium"
                    >
                      Clear search filters
                    </button>
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/80 transition group">
                    <td className="py-3.5 px-4 font-mono font-semibold text-blue-700">
                      {emp.employeeId}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{emp.fullName}</div>
                      <div className="text-[11px] text-slate-500">{emp.email}</div>
                      <div className="text-[11px] text-slate-400">{emp.phone}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{emp.jobTitle}</div>
                      <div className="text-[11px] text-slate-500">{emp.department}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {emp.employmentType}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {emp.joiningDate}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        <StatusBadge status={emp.enrollmentStatus} active={emp.isActive} />
                        {emp.enrollmentStatus !== 'Approved' && emp.isActive && (
                          <button
                            onClick={() => handleStatusChangePrompt(emp, 'Approved')}
                            className="opacity-0 group-hover:opacity-100 text-[10px] bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 px-1.5 py-0.5 rounded transition"
                            title="Approve Enrollment"
                          >
                            Approve
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/employees/${emp.id}`}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/employees/${emp.id}/edit`}
                          className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-md transition"
                          title="Edit Record"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleToggleActivePrompt(emp)}
                          className={`p-1.5 rounded-md transition ${
                            emp.isActive
                              ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                              : 'text-emerald-600 hover:bg-emerald-50'
                          }`}
                          title={emp.isActive ? 'Deactivate' : 'Reactivate'}
                        >
                          <Power className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Server Pagination */}
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalElements={totalElements}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setPage(0);
          }}
        />
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmLabel={modalConfig.confirmLabel}
        isDestructive={modalConfig.isDestructive}
        onConfirm={modalConfig.action}
        onCancel={() => setModalConfig((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};
