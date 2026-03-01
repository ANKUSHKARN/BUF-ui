"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminBrotherProfile() {
  const router = useRouter();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const handleGoBack = () => {
    router.back();
  };

  const handleMoreOptions = () => {
    setShowMoreMenu(!showMoreMenu);
    // You can implement a dropdown menu here
    console.log("More options clicked");
  };

  const handleMessage = () => {
    console.log("Message brother");
  };

  const handleEditProfile = () => {
    console.log("Edit profile");
    // router.push('/admin/members/edit/88219');
  };

  const handleDeactivate = () => {
    // Show confirmation modal
    console.log("Deactivate account");
  };

  const handleAuditLogs = () => {
    console.log("View audit logs");
    // router.push('/admin/members/88219/audit');
  };

  const handleResetPassword = () => {
    console.log("Reset password");
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen lg:mr-10 lg:ml-10">
      <div className="min-h-screen flex flex-col lg:flex-row ">
        
        {/* Main Content Area */}
        <div className="flex-1"> {/* Margin for desktop sidebar */}
          
          {/* Header */}
          <div className="flex items-center bg-background-light dark:bg-background-dark p-4 justify-between sticky top-0 z-10 border-b border-primary/10">
            <button
              onClick={handleGoBack}
              className="text-primary flex size-12 shrink-0 items-center justify-center rounded-lg hover:bg-primary/10 transition-colors"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
              Brother Profile
            </h2>
            <div className="flex w-12 items-center justify-end">
              <button
                onClick={handleMoreOptions}
                className="flex items-center justify-center overflow-hidden rounded-lg h-12 w-12 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <span className="material-symbols-outlined">more_vert</span>
              </button>
            </div>
          </div>

          {/* Profile Hero Section */}
          <div className="flex p-6 @container bg-white dark:bg-slate-900/50">
            <div className="flex w-full flex-col gap-4 items-center text-center">
              <div className="relative">
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-24 w-24 border-4 border-primary/20"
                  style={{
                    backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBBI-I3JQ0Drsp4_i8qv-hgeK7NwWmV9tJasarJdbzLNUl8G0V2ZpPArGPyT-6BrEpnsjQqll5wW3sqO5ezC3SheYWU-vgVtvMVekAzXyMzM0XcJzt3m5LsVjwhrOyFkKDTzkUfIlC3nTXuY7rcK3TRQLcqGwn1pA_B1kCLtzGuyg4eEp41NZ65qinh6FYslNNP16ZyC_1l3f41fs25b3cugJblCxbATAthfCAi0bZv_09jkDMklVwWxrj455gmKP0pyDs1gwWbSTU")'
                  }}
                />
                <div className="absolute bottom-0 right-0 bg-green-500 border-2 border-white dark:border-slate-900 h-5 w-5 rounded-full"></div>
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-slate-900 dark:text-slate-100 text-2xl font-bold leading-tight tracking-[-0.015em]">
                  John Doe
                </p>
                <div className="mt-1 flex items-center justify-center gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    Active Member
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 text-xs font-normal">
                    ID: #88219
                  </span>
                </div>
              </div>
              <div className="flex gap-3 w-full max-w-sm mt-2">
                <button
                  onClick={handleMessage}
                  className="flex-1 flex cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors"
                >
                  <span className="truncate">Message</span>
                </button>
                <button
                  onClick={handleEditProfile}
                  className="flex-1 flex cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-primary/10 text-primary text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/20 transition-colors"
                >
                  <span className="truncate">Edit Profile</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="flex flex-col gap-6 p-4">
            {/* Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Personal Details Column */}
              <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border border-primary/5">
                <h3 className="text-slate-900 dark:text-slate-100 text-base font-bold mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-sm">person</span>
                  Personal Details
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Email</p>
                    <p className="text-slate-900 dark:text-slate-100 text-sm font-medium">john.doe@unity.com</p>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Mobile</p>
                    <p className="text-slate-900 dark:text-slate-100 text-sm font-medium">+1 234 567 8900</p>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Employment</p>
                    <p className="text-slate-900 dark:text-slate-100 text-sm font-medium">Full-time</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Joined Date</p>
                    <p className="text-slate-900 dark:text-slate-100 text-sm font-medium">Jan 12, 2023</p>
                  </div>
                </div>
              </div>

              {/* Financial Health Column */}
              <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border border-primary/5">
                <h3 className="text-slate-900 dark:text-slate-100 text-base font-bold mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-sm">account_balance_wallet</span>
                  Contribution Health
                </h3>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-500 dark:text-slate-400 text-xs">Monthly Obligation</p>
                      <p className="text-primary text-lg font-bold">₹5,000</p>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-500 dark:text-slate-400 text-xs">Wallet Balance</p>
                      <p className="text-slate-900 dark:text-slate-100 text-lg font-bold">₹12,450</p>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full w-[85%]"></div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Paid 10/12 months this year</p>
                </div>
              </div>
            </div>

            {/* Account Actions / Danger Zone */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border border-red-100 dark:border-red-900/30">
              <h3 className="text-red-600 dark:text-red-400 text-base font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">shield_person</span>
                Admin Actions
              </h3>
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={handleDeactivate}
                  className="w-full flex items-center justify-between px-4 py-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined">person_off</span>
                    <div className="text-left">
                      <p className="text-sm font-bold">Deactivate Account</p>
                      <p className="text-[10px] opacity-75">Revoke all member privileges immediately</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>

                <button
                  onClick={handleAuditLogs}
                  className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined">history</span>
                    <div className="text-left">
                      <p className="text-sm font-bold">Audit Logs</p>
                      <p className="text-[10px] opacity-75">View administrative changes for this user</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>

                <button
                  onClick={handleResetPassword}
                  className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined">mail_lock</span>
                    <div className="text-left">
                      <p className="text-sm font-bold">Reset Password</p>
                      <p className="text-[10px] opacity-75">Send recovery link to john.doe@unity.com</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
          <div className="h-20"></div> {/* Spacer */}
        </div>

        {/* Desktop Right Sidebar - Member Quick Stats */}
        <div className="hidden lg:block fixed right-0 top-0 h-screen w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-xl p-6 overflow-y-auto">
          <div className="sticky top-0 bg-white dark:bg-slate-900 pt-4 pb-6 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">analytics</span>
              Member Analytics
            </h3>
          </div>

          <div className="space-y-6 mt-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-primary/5 rounded-xl p-4 text-center">
                <p className="text-xs text-slate-500 mb-1">Contributions</p>
                <p className="text-xl font-bold text-primary">₹45k</p>
                <p className="text-[10px] text-green-600">+12% this year</p>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/10 rounded-xl p-4 text-center">
                <p className="text-xs text-slate-500 mb-1">Pending</p>
                <p className="text-xl font-bold text-amber-600">₹5k</p>
                <p className="text-[10px] text-amber-600">1 month</p>
              </div>
            </div>

            {/* Activity Timeline */}
            <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm">schedule</span>
                Recent Activity
              </h4>
              <div className="space-y-3">
                <div className="flex gap-2 text-xs">
                  <div className="w-1 h-1 mt-1.5 rounded-full bg-green-500"></div>
                  <div>
                    <p className="font-medium">Contribution received</p>
                    <p className="text-slate-500">₹5,000 • 2 days ago</p>
                  </div>
                </div>
                <div className="flex gap-2 text-xs">
                  <div className="w-1 h-1 mt-1.5 rounded-full bg-blue-500"></div>
                  <div>
                    <p className="font-medium">Profile updated</p>
                    <p className="text-slate-500">Contact info • 1 week ago</p>
                  </div>
                </div>
                <div className="flex gap-2 text-xs">
                  <div className="w-1 h-1 mt-1.5 rounded-full bg-amber-500"></div>
                  <div>
                    <p className="font-medium">Late payment reminder</p>
                    <p className="text-slate-500">February dues • 2 weeks ago</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Referral Info */}
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-primary">group_add</span>
                <p className="font-semibold text-sm">Referred by</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-300"></div>
                <div>
                  <p className="text-sm font-bold">Michael Chen</p>
                  <p className="text-xs text-slate-500">Member since 2022</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <button className="w-full flex items-center justify-between px-4 py-3 bg-primary/5 rounded-xl text-primary hover:bg-primary/10 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">receipt</span>
                  <span className="text-sm font-medium">View Transaction History</span>
                </div>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Navigation - Mobile Only (already in layout) */}
        {/* Removed as requested - bottom nav is in layout */}
      </div>
    </div>
  );
}