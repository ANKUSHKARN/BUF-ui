"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, AlertCircle, CheckCircle, Eye, EyeOff, X } from "lucide-react";

interface FormData {
  name: string;
  email: string;
  mobile: string;
  password: string;
  monthlyContribution: number;
  employmentStatus: "EMPLOYED" | "UNEMPLOYED";
}

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

export default function CreateNewBrother() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    mobile: "",
    password: "",
    monthlyContribution: 500,
    employmentStatus: "EMPLOYED",
  });

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  // Toast functions
  const addToast = (type: ToastType, message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleEmploymentChange = (status: "EMPLOYED" | "UNEMPLOYED") => {
    setFormData(prev => ({
      ...prev,
      employmentStatus: status,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate form
    if (!formData.name || !formData.email || !formData.mobile || !formData.password) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    if (formData.monthlyContribution < 0) {
      setError("Monthly contribution cannot be negative");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/admin/brother`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create brother');
      }

      // Success
      addToast('success', `Brother ${formData.name} created successfully`);
      
      // Redirect back to all brothers page after short delay
      setTimeout(() => {
        router.push('/admin/allBrother');
      }, 1500);

    } catch (error: any) {
      console.error('Error creating brother:', error);
      setError(error.message);
      addToast('error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg animate-slideIn ${
              toast.type === 'success' ? 'bg-emerald-500 text-white' :
              toast.type === 'error' ? 'bg-red-500 text-white' :
              toast.type === 'warning' ? 'bg-amber-500 text-white' :
              'bg-blue-500 text-white'
            }`}
          >
            {toast.type === 'success' && <CheckCircle className="w-5 h-5" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5" />}
            <p className="text-sm font-medium">{toast.message}</p>
            <button onClick={() => removeToast(toast.id)} className="ml-4">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="min-h-screen flex items-center justify-center p-4 lg:p-8 mb-20">
        <div className="w-full max-w-[480px] lg:max-w-5xl bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden">
          
          {/* Header - Responsive */}
          <div className="border-b border-slate-200 dark:border-slate-800">
            {/* Mobile Header */}
            <div className="lg:hidden">
              <header className="sticky top-0 z-10 flex items-center justify-between px-4 py-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
                <button 
                  onClick={handleCancel}
                  className="flex items-center text-primary hover:opacity-80 transition-opacity"
                  disabled={loading}
                >
                  <span className="material-symbols-outlined text-[28px]">chevron_left</span>
                  <span className="text-base font-medium">Cancel</span>
                </button>
                <h1 className="text-lg font-bold tracking-tight">New Brother</h1>
                <div className="w-16"></div>
              </header>
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:flex items-center justify-between px-8 py-6 bg-gradient-to-r from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Add New Brother
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                  Expand your brotherhood family
                </p>
              </div>
              <button
                onClick={handleCancel}
                disabled={loading}
                className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined">close</span>
                <span>Cancel</span>
              </button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mx-5 lg:mx-8 mt-5 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 rounded-xl text-red-700 dark:text-red-400 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row">
            {/* Left Column - Form */}
            <div className="flex-1 p-5 lg:p-8">
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Mobile Header Text */}
                <div className="lg:hidden">
                  <h2 className="text-2xl font-bold tracking-tight">Brother Profile</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                    Add a new member to the brotherhood fund management system.
                  </p>
                </div>

                {/* Desktop Header Text */}
                <div className="hidden lg:block mb-8">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    Personal Information
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                    Enter the details of the new brother
                  </p>
                </div>

                {/* Form Grid */}
                <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    {/* Name */}
                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                        Full Name <span className="text-primary">*</span>
                      </span>
                      <div className="mt-1 relative">
                        <input
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                          placeholder=""
                          type="text"
                          required
                          disabled={loading}
                        />
                      </div>
                    </label>

                    {/* Email */}
                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                        Email Address <span className="text-primary">*</span>
                      </span>
                      <div className="mt-1 relative">
                        <input
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                          placeholder=""
                          type="email"
                          required
                          disabled={loading}
                        />
                      </div>
                    </label>

                    {/* Mobile */}
                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                        Mobile Number <span className="text-primary">*</span>
                      </span>
                      <div className="mt-1 relative">
                        <input
                          name="mobile"
                          value={formData.mobile}
                          onChange={handleChange}
                          className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                          placeholder=""
                          type="tel"
                          required
                          disabled={loading}
                        />
                      </div>
                    </label>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    {/* Password */}
                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                        Initial Password <span className="text-primary">*</span>
                      </span>
                      <div className="mt-1 relative flex items-center">
                        <input
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                          placeholder="••••••••"
                          type={showPassword ? "text" : "password"}
                          required
                          disabled={loading}
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors disabled:opacity-50"
                          disabled={loading}
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </label>

                    {/* Monthly Contribution */}
                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                        Monthly Contribution (₹) <span className="text-primary">*</span>
                      </span>
                      <div className="mt-1 relative flex items-center">
                        <span className="absolute left-4 text-slate-500 font-medium">₹</span>
                        <input
                          name="monthlyContribution"
                          value={formData.monthlyContribution}
                          onChange={handleChange}
                          className="w-full h-12 pl-8 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                          placeholder="500"
                          type="number"
                          min="0"
                          step="100"
                          required
                          disabled={loading}
                        />
                      </div>
                    </label>
                  </div>
                </div>

                {/* Employment Status */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                    Employment Status
                  </span>
                  <div className="mt-2 grid grid-cols-2 gap-3 max-w-md">
                    <label className="relative flex items-center justify-center h-12 cursor-pointer">
                      <input
                        checked={formData.employmentStatus === "EMPLOYED"}
                        onChange={() => handleEmploymentChange("EMPLOYED")}
                        className="peer sr-only"
                        name="employment"
                        type="radio"
                        disabled={loading}
                      />
                      <div className={`w-full h-full flex items-center justify-center rounded-xl border transition-all ${
                        formData.employmentStatus === "EMPLOYED"
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      }`}>
                        <span className="text-sm font-medium">Employed</span>
                      </div>
                    </label>
                    <label className="relative flex items-center justify-center h-12 cursor-pointer">
                      <input
                        checked={formData.employmentStatus === "UNEMPLOYED"}
                        onChange={() => handleEmploymentChange("UNEMPLOYED")}
                        className="peer sr-only"
                        name="employment"
                        type="radio"
                        disabled={loading}
                      />
                      <div className={`w-full h-full flex items-center justify-center rounded-xl border transition-all ${
                        formData.employmentStatus === "UNEMPLOYED"
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      }`}>
                        <span className="text-sm font-medium">Unemployed</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Desktop Action Buttons */}
                <div className="hidden lg:flex items-center justify-end gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={loading}
                    className="px-6 py-3 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Brother Profile"
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column - Preview/Info Panel */}
            <div className="hidden lg:block lg:w-80 bg-gradient-to-b from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5 p-8 border-l border-slate-200 dark:border-slate-800">
              <div className="sticky top-8">
                <h3 className="text-lg font-bold mb-4">Quick Tips</h3>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <span className="material-symbols-outlined text-primary text-sm">info</span>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Use a valid email address for login credentials
                    </p>
                  </li>
                  <li className="flex gap-3">
                    <span className="material-symbols-outlined text-primary text-sm">lock</span>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Initial password should be shared securely with the brother
                    </p>
                  </li>
                  <li className="flex gap-3">
                    <span className="material-symbols-outlined text-primary text-sm">currency_rupee</span>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Set monthly contribution amount in Indian Rupees (₹)
                    </p>
                  </li>
                  <li className="flex gap-3">
                    <span className="material-symbols-outlined text-primary text-sm">badge</span>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Employment status helps determine contribution flexibility
                    </p>
                  </li>
                </ul>

                <div className="mt-8 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-primary/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <span className="material-symbols-outlined text-primary">group_add</span>
                    </div>
                    <p className="font-semibold text-sm">Form Preview</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Name:</span>
                      <span className="font-bold truncate max-w-[150px]">{formData.name || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Email:</span>
                      <span className="font-bold truncate max-w-[150px]">{formData.email || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Mobile:</span>
                      <span className="font-bold">{formData.mobile || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Contribution:</span>
                      <span className="font-bold text-primary">₹{formData.monthlyContribution}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Status:</span>
                      <span className={`font-bold ${formData.employmentStatus === 'EMPLOYED' ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {formData.employmentStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Bottom Action */}
          <div className="lg:hidden p-5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-primary text-white font-bold h-14 rounded-xl hover:bg-primary/90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Brother Profile"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}