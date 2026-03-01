"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateNewBrother() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleCancel = () => {
    router.back();
  };

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Creating brother profile...");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
      {/* Desktop Layout - Centered Card */}
      <div className="min-h-screen flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-[480px] lg:max-w-5xl bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden">
          
          {/* Header - Responsive */}
          <div className="border-b border-slate-200 dark:border-slate-800">
            {/* Mobile Header (iOS style) */}
            <div className="lg:hidden">
              <header className="sticky top-0 z-10 flex items-center justify-between px-4 py-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
                <button 
                  onClick={handleCancel}
                  className="flex items-center text-primary hover:opacity-80 transition-opacity"
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
                className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined">close</span>
                <span>Cancel</span>
              </button>
            </div>
          </div>

          {/* Main Content - Responsive Grid */}
          <div className="flex flex-col lg:flex-row">
            {/* Left Column - Form */}
            <div className="flex-1 p-5 lg:p-8">
              <form className="space-y-6" onSubmit={handleCreateProfile}>
                {/* Mobile Header Text (only on mobile) */}
                <div className="lg:hidden">
                  <h2 className="text-2xl font-bold tracking-tight">Brother Profile</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                    Add a new member to the brotherhood fund management system.
                  </p>
                </div>

                {/* Desktop Header Text (only on desktop) */}
                <div className="hidden lg:block mb-8">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    Personal Information
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                    Enter the details of the new brother
                  </p>
                </div>

                {/* Form Grid - 2 columns on desktop */}
                <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-6">
                  {/* Left Column of Form */}
                  <div className="space-y-4">
                    {/* Name */}
                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                        Full Name <span className="text-primary">*</span>
                      </span>
                      <div className="mt-1 relative">
                        <input
                          className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                          placeholder="e.g. John Doe"
                          type="text"
                          required
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
                          className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                          placeholder="john@example.com"
                          type="email"
                          required
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
                          className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                          placeholder="+1 (555) 000-0000"
                          type="tel"
                          required
                        />
                      </div>
                    </label>
                  </div>

                  {/* Right Column of Form */}
                  <div className="space-y-4">
                    {/* Password */}
                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                        Initial Password <span className="text-primary">*</span>
                      </span>
                      <div className="mt-1 relative flex items-center">
                        <input
                          className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                          placeholder="••••••••"
                          type={showPassword ? "text" : "password"}
                          required
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                        >
                          <span className="material-symbols-outlined">
                            {showPassword ? "visibility_off" : "visibility"}
                          </span>
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
                          className="w-full h-12 pl-8 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                          placeholder="0.00"
                          type="number"
                          step="0.01"
                          required
                        />
                      </div>
                    </label>
                  </div>
                </div>

                {/* Employment Status - Full width */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                    Employment Status
                  </span>
                  <div className="mt-2 grid grid-cols-2 gap-3 max-w-md">
                    <label className="relative flex items-center justify-center h-12 cursor-pointer">
                      <input
                        defaultChecked
                        className="peer sr-only"
                        name="employment"
                        type="radio"
                        value="employed"
                      />
                      <div className="w-full h-full flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 peer-checked:bg-primary/10 peer-checked:border-primary peer-checked:text-primary transition-all">
                        <span className="text-sm font-medium">Employed</span>
                      </div>
                    </label>
                    <label className="relative flex items-center justify-center h-12 cursor-pointer">
                      <input
                        className="peer sr-only"
                        name="employment"
                        type="radio"
                        value="unemployed"
                      />
                      <div className="w-full h-full flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 peer-checked:bg-primary/10 peer-checked:border-primary peer-checked:text-primary transition-all">
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
                    className="px-6 py-3 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
                  >
                    Create Brother Profile
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column - Preview/Info Panel (Desktop only) */}
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
                    <p className="font-semibold text-sm">Brotherhood Stats</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Current Members:</span>
                      <span className="font-bold">124</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Active This Month:</span>
                      <span className="font-bold text-green-600">118</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Avg. Contribution:</span>
                      <span className="font-bold">₹1,250</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Bottom Action */}
          <div className="lg:hidden p-5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={handleCreateProfile}
              className="w-full bg-primary text-white font-bold h-14 rounded-xl hover:bg-primary/90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
            >
              Create Brother Profile
            </button>
            <div className="h-4"></div> {/* Home Indicator area */}
          </div>
        </div>
      </div>
    </div>
  );
}