import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle, Building2, Briefcase, ShieldAlert } from 'lucide-react';
import { employeeService } from '../services/employeeService';
import { NotificationToast } from '../components/ui/NotificationToast';

export const EditEmployeePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    department: '',
    jobTitle: '',
    joiningDate: '',
    employmentType: 'Full-Time',
    emergencyContactName: '',
    emergencyContactPhone: '',
    enrollmentStatus: 'Submitted',
    isActive: true,
  });

  const [employeeId, setEmployeeId] = useState('');
  const [loading, setLoading] = useState(true);
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      setLoading(true);
      try {
        const emp = await employeeService.getEmployeeById(id);
        setEmployeeId(emp.employeeId);
        setFormData({
          firstName: emp.firstName || '',
          lastName: emp.lastName || '',
          email: emp.email || '',
          phone: emp.phone || '',
          dateOfBirth: emp.dateOfBirth || '',
          address: emp.address || '',
          department: emp.department || 'Engineering',
          jobTitle: emp.jobTitle || '',
          joiningDate: emp.joiningDate || '',
          employmentType: emp.employmentType || 'Full-Time',
          emergencyContactName: emp.emergencyContactName || '',
          emergencyContactPhone: emp.emergencyContactPhone || '',
          enrollmentStatus: emp.enrollmentStatus || 'Submitted',
          isActive: emp.isActive ?? true,
        });
      } catch (err) {
        console.error('Fetch error:', err);
        setServerError('Failed to load employee details for editing.');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  const validateForm = () => {
    const errors = {};
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Enter a valid corporate email format';
    }

    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    if (!formData.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
    if (!formData.address.trim()) errors.address = 'Residential address is required';
    if (!formData.department) errors.department = 'Department is required';
    if (!formData.jobTitle.trim()) errors.jobTitle = 'Job title is required';
    if (!formData.joiningDate) errors.joiningDate = 'Joining date is required';
    if (!formData.employmentType) errors.employmentType = 'Employment type is required';
    if (!formData.emergencyContactName.trim()) errors.emergencyContactName = 'Emergency contact is required';
    if (!formData.emergencyContactPhone.trim()) errors.emergencyContactPhone = 'Emergency phone is required';

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    setServerError('');

    try {
      await employeeService.updateEmployee(id, formData);
      navigate(`/employees/${id}`);
    } catch (err) {
      console.error('Update error:', err);
      if (err.response?.data?.errors) {
        setFieldErrors(err.response.data.errors);
      }
      setServerError(
        err.response?.data?.message || 'Failed to update employee. Please check inputs.'
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-xs font-medium text-slate-500">Loading employee editor...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <Link
            to={`/employees/${id}`}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Edit Employee Profile
              </h1>
              <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                {employeeId}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Update personal information, departmental designation, and enrollment lifecycle state
            </p>
          </div>
        </div>
      </div>

      {serverError && (
        <div className="flex items-start p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
          <AlertCircle className="w-4 h-4 mr-2 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Unable to update:</span> {serverError}
          </div>
        </div>
      )}

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-6 space-y-8">
        {/* Section 1: Personal Information */}
        <div>
          <div className="flex items-center space-x-2 pb-3 mb-4 border-b border-slate-100">
            <Building2 className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider text-[11px]">
              1. Personal Identification
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                First Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full py-2 px-3 text-xs border rounded-lg outline-hidden focus:ring-1 focus:ring-blue-600 ${
                  fieldErrors.firstName ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                }`}
              />
              {fieldErrors.firstName && <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.firstName}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Last Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full py-2 px-3 text-xs border rounded-lg outline-hidden focus:ring-1 focus:ring-blue-600 ${
                  fieldErrors.lastName ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                }`}
              />
              {fieldErrors.lastName && <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.lastName}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Corporate Email <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full py-2 px-3 text-xs border rounded-lg outline-hidden focus:ring-1 focus:ring-blue-600 ${
                  fieldErrors.email ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                }`}
              />
              {fieldErrors.email && <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full py-2 px-3 text-xs border rounded-lg outline-hidden focus:ring-1 focus:ring-blue-600 ${
                  fieldErrors.phone ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                }`}
              />
              {fieldErrors.phone && <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.phone}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Date of Birth <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className={`w-full py-2 px-3 text-xs border rounded-lg outline-hidden focus:ring-1 focus:ring-blue-600 ${
                  fieldErrors.dateOfBirth ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                }`}
              />
              {fieldErrors.dateOfBirth && <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.dateOfBirth}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Residential Street Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={`w-full py-2 px-3 text-xs border rounded-lg outline-hidden focus:ring-1 focus:ring-blue-600 ${
                  fieldErrors.address ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                }`}
              />
              {fieldErrors.address && <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.address}</p>}
            </div>
          </div>
        </div>

        {/* Section 2: Position & Department */}
        <div>
          <div className="flex items-center space-x-2 pb-3 mb-4 border-b border-slate-100">
            <Briefcase className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider text-[11px]">
              2. Position & Department
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Department <span className="text-rose-500">*</span>
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg outline-hidden focus:ring-1 focus:ring-blue-600 bg-white"
              >
                <option value="Engineering">Engineering</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Product">Product</option>
                <option value="Finance">Finance</option>
                <option value="Marketing">Marketing</option>
                <option value="Operations">Operations</option>
                <option value="Sales">Sales</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Job Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                className={`w-full py-2 px-3 text-xs border rounded-lg outline-hidden focus:ring-1 focus:ring-blue-600 ${
                  fieldErrors.jobTitle ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                }`}
              />
              {fieldErrors.jobTitle && <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.jobTitle}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Employment Type <span className="text-rose-500">*</span>
              </label>
              <select
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
                className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg outline-hidden focus:ring-1 focus:ring-blue-600 bg-white"
              >
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Contract">Contract</option>
                <option value="Intern">Intern</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Joining Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleChange}
                className={`w-full py-2 px-3 text-xs border rounded-lg outline-hidden focus:ring-1 focus:ring-blue-600 ${
                  fieldErrors.joiningDate ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                }`}
              />
              {fieldErrors.joiningDate && <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.joiningDate}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Enrollment Lifecycle Status
              </label>
              <select
                name="enrollmentStatus"
                value={formData.enrollmentStatus}
                onChange={handleChange}
                className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg outline-hidden focus:ring-1 focus:ring-blue-600 bg-white"
              >
                <option value="Draft">Draft</option>
                <option value="Submitted">Submitted</option>
                <option value="Approved">Approved</option>
              </select>
            </div>

            <div className="flex items-center space-x-2 pt-6">
              <input
                type="checkbox"
                id="isActiveCheckbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="isActiveCheckbox" className="text-xs font-medium text-slate-700 select-none">
                Active Workforce Status (Uncheck to mark inactive)
              </label>
            </div>
          </div>
        </div>

        {/* Section 3: Emergency Contact */}
        <div>
          <div className="flex items-center space-x-2 pb-3 mb-4 border-b border-slate-100">
            <ShieldAlert className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider text-[11px]">
              3. Emergency Contact Details
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Emergency Contact Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="emergencyContactName"
                value={formData.emergencyContactName}
                onChange={handleChange}
                className={`w-full py-2 px-3 text-xs border rounded-lg outline-hidden focus:ring-1 focus:ring-blue-600 ${
                  fieldErrors.emergencyContactName ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                }`}
              />
              {fieldErrors.emergencyContactName && (
                <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.emergencyContactName}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Emergency Contact Phone <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                name="emergencyContactPhone"
                value={formData.emergencyContactPhone}
                onChange={handleChange}
                className={`w-full py-2 px-3 text-xs border rounded-lg outline-hidden focus:ring-1 focus:ring-blue-600 ${
                  fieldErrors.emergencyContactPhone ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                }`}
              />
              {fieldErrors.emergencyContactPhone && (
                <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.emergencyContactPhone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
          <Link
            to={`/employees/${id}`}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Saving Changes...</span>
            ) : (
              <>
                <Save className="w-3.5 h-3.5 mr-1.5" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
