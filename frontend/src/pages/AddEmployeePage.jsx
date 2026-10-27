import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  UserPlus, 
  CheckCircle2, 
  Copy, 
  ArrowLeft, 
  AlertCircle, 
  Save, 
  SendHorizontal, 
  Building2, 
  Phone, 
  Mail, 
  Calendar, 
  MapPin, 
  Briefcase, 
  ShieldAlert 
} from 'lucide-react';
import { employeeService } from '../services/employeeService';

export const AddEmployeePage = () => {
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    department: 'Engineering',
    jobTitle: '',
    joiningDate: new Date().toISOString().split('T')[0],
    employmentType: 'Full-Time',
    emergencyContactName: '',
    emergencyContactPhone: '',
    enrollmentStatus: 'Submitted',
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successResult, setSuccessResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const validateForm = () => {
    const errors = {};
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Enter a valid corporate email format';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^[+0-9\s\-()]{7,20}$/.test(formData.phone)) {
      errors.phone = 'Phone must be valid digits/symbols (7-20 chars)';
    }

    if (!formData.dateOfBirth) {
      errors.dateOfBirth = 'Date of birth is required';
    } else {
      const dob = new Date(formData.dateOfBirth);
      const today = new Date();
      if (dob >= today) errors.dateOfBirth = 'Date of birth must be in the past';
    }

    if (!formData.address.trim()) errors.address = 'Residential address is required';
    if (!formData.department) errors.department = 'Department is required';
    if (!formData.jobTitle.trim()) errors.jobTitle = 'Job title is required';
    if (!formData.joiningDate) errors.joiningDate = 'Joining date is required';
    if (!formData.employmentType) errors.employmentType = 'Employment type is required';

    if (!formData.emergencyContactName.trim()) {
      errors.emergencyContactName = 'Emergency contact person is required';
    }

    if (!formData.emergencyContactPhone.trim()) {
      errors.emergencyContactPhone = 'Emergency contact phone is required';
    } else if (!/^[+0-9\s\-()]{7,20}$/.test(formData.emergencyContactPhone)) {
      errors.emergencyContactPhone = 'Emergency phone format invalid';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (submitStatus) => {
    const dataToSend = {
      ...formData,
      enrollmentStatus: submitStatus || formData.enrollmentStatus,
      isActive: true,
    };

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    setServerError('');

    try {
      const created = await employeeService.createEmployee(dataToSend);
      setSuccessResult(created);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Enrollment submission error:', err);
      if (err.response?.data?.errors) {
        setFieldErrors(err.response.data.errors);
      }
      setServerError(
        err.response?.data?.message || 'Failed to enroll employee. Please verify details.'
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyId = () => {
    if (successResult?.employeeId) {
      navigator.clipboard.writeText(successResult.employeeId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      address: '',
      department: 'Engineering',
      jobTitle: '',
      joiningDate: new Date().toISOString().split('T')[0],
      employmentType: 'Full-Time',
      emergencyContactName: '',
      emergencyContactPhone: '',
      enrollmentStatus: 'Submitted',
    });
    setFieldErrors({});
    setServerError('');
    setSuccessResult(null);
  };

  // SUCCESS CONFIRMATION SCREEN
  if (successResult) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">Enrollment Successfully Registered</h1>
            <p className="text-xs text-slate-500 mt-1">
              The employee record has been persisted into MySQL and assigned an official company identifier.
            </p>
          </div>

          {/* Generated ID Card */}
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl max-w-md mx-auto space-y-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Official Generated Employee ID
            </span>
            <div className="flex items-center justify-center space-x-3">
              <span className="text-2xl font-mono font-bold text-blue-700 tracking-wider">
                {successResult.employeeId}
              </span>
              <button
                onClick={handleCopyId}
                className="p-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-600 transition"
                title="Copy to clipboard"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            {copied && <p className="text-[11px] text-emerald-600 font-medium">Copied to clipboard!</p>}
          </div>

          {/* Key Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-left max-w-lg mx-auto bg-slate-50/50 p-4 rounded-xl border border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 block">Full Name</span>
              <span className="font-semibold text-slate-800">{successResult.fullName}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Department</span>
              <span className="font-semibold text-slate-800">{successResult.department}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Job Title</span>
              <span className="font-semibold text-slate-800">{successResult.jobTitle}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Work Email</span>
              <span className="font-semibold text-slate-800">{successResult.email}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Employment Type</span>
              <span className="font-semibold text-slate-800">{successResult.employmentType}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Status</span>
              <span className="font-semibold text-emerald-700">{successResult.enrollmentStatus}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-slate-100">
            <Link
              to={`/employees/${successResult.id}`}
              className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition"
            >
              View Employee Details
            </Link>
            <button
              onClick={resetForm}
              className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition"
            >
              Enroll Another Employee
            </button>
            <Link
              to="/employees"
              className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
            >
              Back to Directory
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <Link
            to="/employees"
            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">New Employee Enrollment</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Unique employee ID will be automatically generated and assigned by the system
            </p>
          </div>
        </div>
      </div>

      {serverError && (
        <div className="flex items-start p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
          <AlertCircle className="w-4 h-4 mr-2 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Unable to process enrollment:</span> {serverError}
          </div>
        </div>
      )}

      {/* Form Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-6 space-y-8">
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
                placeholder="e.g. Liam"
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
                placeholder="e.g. Vance"
                className={`w-full py-2 px-3 text-xs border rounded-lg outline-hidden focus:ring-1 focus:ring-blue-600 ${
                  fieldErrors.lastName ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                }`}
              />
              {fieldErrors.lastName && <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.lastName}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Work Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. liam.vance@aysqo-demo.com"
                className={`w-full py-2 px-3 text-xs border rounded-lg outline-hidden focus:ring-1 focus:ring-blue-600 ${
                  fieldErrors.email ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                }`}
              />
              {fieldErrors.email && <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Primary Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. +1-555-0145"
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
                placeholder="e.g. 504 Innovation Way, Suite 100, Austin, TX"
                className={`w-full py-2 px-3 text-xs border rounded-lg outline-hidden focus:ring-1 focus:ring-blue-600 ${
                  fieldErrors.address ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                }`}
              />
              {fieldErrors.address && <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.address}</p>}
            </div>
          </div>
        </div>

        {/* Section 2: Employment Details */}
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
                Assigned Department <span className="text-rose-500">*</span>
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
                Official Job Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                placeholder="e.g. Senior Backend Engineer"
                className={`w-full py-2 px-3 text-xs border rounded-lg outline-hidden focus:ring-1 focus:ring-blue-600 ${
                  fieldErrors.jobTitle ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                }`}
              />
              {fieldErrors.jobTitle && <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.jobTitle}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Employment Classification <span className="text-rose-500">*</span>
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
                Effective Joining Date <span className="text-rose-500">*</span>
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
                Contact Person Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="emergencyContactName"
                value={formData.emergencyContactName}
                onChange={handleChange}
                placeholder="e.g. Katherine Vance (Spouse)"
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
                Emergency Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                name="emergencyContactPhone"
                value={formData.emergencyContactPhone}
                onChange={handleChange}
                placeholder="e.g. +1-555-0988"
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

        {/* Action Buttons */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Link
            to="/employees"
            className="w-full sm:w-auto px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition text-center"
          >
            Cancel & Return
          </Link>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSubmit('Draft')}
              className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition flex items-center justify-center disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5 mr-1.5" />
              Save as Draft
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSubmit('Submitted')}
              className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition flex items-center justify-center disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Registering...</span>
              ) : (
                <>
                  <SendHorizontal className="w-3.5 h-3.5 mr-1.5" />
                  Submit Enrollment
                </>
              )}
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSubmit('Approved')}
              className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition flex items-center justify-center disabled:opacity-50"
            >
              Approve Directly
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
