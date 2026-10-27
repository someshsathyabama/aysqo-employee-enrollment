import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit2, 
  Power, 
  Building2, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Briefcase, 
  ShieldAlert, 
  CheckCircle, 
  Clock, 
  AlertCircle 
} from 'lucide-react';
import { employeeService } from '../services/employeeService';
import { StatusBadge } from '../components/ui/StatusBadge';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { NotificationToast } from '../components/ui/NotificationToast';

export const EmployeeDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState(null);

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmLabel: 'Confirm',
    isDestructive: false,
    action: null,
  });

  const fetchEmployee = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await employeeService.getEmployeeById(id);
      setEmployee(data);
    } catch (err) {
      console.error('Fetch employee error:', err);
      setError('Employee record not found or server error.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  const handleStatusChange = (newStatus) => {
    setModalConfig({
      isOpen: true,
      title: `Update Enrollment Status to ${newStatus}`,
      message: `Are you sure you want to change enrollment status of ${employee.fullName} to ${newStatus}?`,
      confirmLabel: `Change to ${newStatus}`,
      isDestructive: false,
      action: async () => {
        try {
          const updated = await employeeService.updateStatus(id, newStatus);
          setEmployee(updated);
          setNotification({
            type: 'success',
            message: `Enrollment status successfully updated to ${newStatus}.`,
          });
        } catch (err) {
          setNotification({ type: 'error', message: 'Failed to update enrollment status.' });
        } finally {
          setModalConfig((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  const handleToggleActive = () => {
    const isCurrentlyActive = employee.isActive;
    setModalConfig({
      isOpen: true,
      title: isCurrentlyActive ? 'Deactivate Employee' : 'Reactivate Employee',
      message: isCurrentlyActive
        ? `Are you sure you want to deactivate ${employee.fullName}? This will mark them inactive in the directory.`
        : `Reactivate ${employee.fullName} back to active workforce status?`,
      confirmLabel: isCurrentlyActive ? 'Deactivate' : 'Reactivate',
      isDestructive: isCurrentlyActive,
      action: async () => {
        try {
          const updated = await employeeService.toggleActive(id);
          setEmployee(updated);
          setNotification({
            type: 'success',
            message: `Employee ${isCurrentlyActive ? 'deactivated' : 'reactivated'} successfully.`,
          });
        } catch (err) {
          setNotification({ type: 'error', message: 'Failed to update active state.' });
        } finally {
          setModalConfig((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-xs font-medium text-slate-500">Loading employee profile...</p>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center bg-white rounded-xl border border-slate-200 p-8">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
        <h2 className="text-base font-semibold text-slate-900">Employee Record Not Found</h2>
        <p className="text-xs text-slate-500 mt-1">{error || 'Requested employee could not be located.'}</p>
        <Link
          to="/employees"
          className="mt-5 inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
          Back to Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Bar Navigation & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <Link
            to="/employees"
            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="text-xl font-bold tracking-tight text-slate-900">{employee.fullName}</h1>
              <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                {employee.employeeId}
              </span>
              <StatusBadge status={employee.enrollmentStatus} active={employee.isActive} />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {employee.jobTitle} • {employee.department}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <Link
            to={`/employees/${employee.id}/edit`}
            className="inline-flex items-center px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition"
          >
            <Edit2 className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
            Edit Profile
          </Link>

          <button
            onClick={handleToggleActive}
            className={`inline-flex items-center px-3.5 py-2 text-xs font-semibold rounded-lg transition ${
              employee.isActive
                ? 'text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100'
                : 'text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <Power className="w-3.5 h-3.5 mr-1.5" />
            {employee.isActive ? 'Deactivate' : 'Reactivate'}
          </button>
        </div>
      </div>

      {notification && (
        <NotificationToast
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Essential Identity */}
        <div className="space-y-6">
          {/* Quick Overview Card */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs text-center">
            <div className="w-20 h-20 rounded-full bg-[#0c1b30] text-white flex items-center justify-center font-bold text-2xl mx-auto mb-3 shadow-xs">
              {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
            </div>
            <h2 className="text-base font-bold text-slate-900">{employee.fullName}</h2>
            <p className="text-xs text-slate-500">{employee.jobTitle}</p>
            <div className="mt-3 inline-block">
              <StatusBadge status={employee.enrollmentStatus} active={employee.isActive} />
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 space-y-2 text-left text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span className="text-slate-400">Employee ID:</span>
                <span className="font-mono font-semibold text-slate-800">{employee.employeeId}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="text-slate-400">Department:</span>
                <span className="font-medium text-slate-800">{employee.department}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="text-slate-400">Type:</span>
                <span className="font-medium text-slate-800">{employee.employmentType}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="text-slate-400">Joined:</span>
                <span className="font-medium text-slate-800">{employee.joiningDate}</span>
              </div>
            </div>
          </div>

          {/* Quick Status Control */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
              Workflow Status Transition
            </h3>
            <div className="space-y-2">
              <button
                disabled={employee.enrollmentStatus === 'Approved'}
                onClick={() => handleStatusChange('Approved')}
                className="w-full py-2 px-3 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                Approve Enrollment
              </button>
              <button
                disabled={employee.enrollmentStatus === 'Submitted'}
                onClick={() => handleStatusChange('Submitted')}
                className="w-full py-2 px-3 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Clock className="w-3.5 h-3.5 mr-1.5" />
                Mark as Submitted
              </button>
              <button
                disabled={employee.enrollmentStatus === 'Draft'}
                onClick={() => handleStatusChange('Draft')}
                className="w-full py-2 px-3 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
              >
                Reset to Draft
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Breakdown (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact and Identity Section */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs">
            <h3 className="text-sm font-semibold text-slate-900 pb-3 border-b border-slate-100 mb-4 flex items-center">
              <Mail className="w-4 h-4 mr-2 text-blue-600" />
              Contact & Residential Identity
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Corporate Email</span>
                <span className="font-semibold text-slate-800 break-all">{employee.email}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Primary Contact Phone</span>
                <span className="font-semibold text-slate-800">{employee.phone}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Date of Birth</span>
                <span className="font-semibold text-slate-800">{employee.dateOfBirth}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Residential Address</span>
                <span className="font-semibold text-slate-800">{employee.address}</span>
              </div>
            </div>
          </div>

          {/* Department & Role Section */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs">
            <h3 className="text-sm font-semibold text-slate-900 pb-3 border-b border-slate-100 mb-4 flex items-center">
              <Briefcase className="w-4 h-4 mr-2 text-blue-600" />
              Corporate Position Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Department</span>
                <span className="font-semibold text-slate-800">{employee.department}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Job Designation</span>
                <span className="font-semibold text-slate-800">{employee.jobTitle}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Employment Type</span>
                <span className="font-semibold text-slate-800">{employee.employmentType}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Joining Date</span>
                <span className="font-semibold text-slate-800">{employee.joiningDate}</span>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs">
            <h3 className="text-sm font-semibold text-slate-900 pb-3 border-b border-slate-100 mb-4 flex items-center">
              <ShieldAlert className="w-4 h-4 mr-2 text-blue-600" />
              Emergency Contact Record
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Emergency Contact Person</span>
                <span className="font-semibold text-slate-800">{employee.emergencyContactName}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Emergency Phone Number</span>
                <span className="font-semibold text-slate-800">{employee.emergencyContactPhone}</span>
              </div>
            </div>
          </div>

          {/* System Audit Information */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 text-[11px] text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>Record Created: {employee.createdAt ? new Date(employee.createdAt).toLocaleString() : 'System Seed'}</div>
            <div>Last Updated: {employee.updatedAt ? new Date(employee.updatedAt).toLocaleString() : 'N/A'}</div>
          </div>
        </div>
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
