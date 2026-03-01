"use client";

import { 
  Users,
  TrendingUp,
  Wallet,
  User,
  Bell
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render until mounted to avoid hydration issues
  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#f6f6f8] dark:bg-[#101622] font-[Manrope,sans-serif]">
      {/* Header - Only visible on mobile, hidden on desktop because Navigation has its own header */}
      <div className="lg:hidden flex items-center bg-[#f6f6f8] dark:bg-[#101622] p-4 pb-2 justify-between sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight flex-1 text-center">
          Admin Overview
        </h2>
        <div className="flex items-center justify-end">
          <button className="flex size-10 cursor-pointer items-center justify-center rounded-lg bg-transparent text-slate-900 dark:text-slate-100 relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 lg:p-6">
        {/* Page Title - Visible on desktop */}
        <h1 className="hidden lg:block text-2xl font-extrabold text-slate-900 dark:text-white mb-6">
          Admin Overview
        </h1>

        {/* Summary Stats */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex min-w-[200px] flex-1 flex-col gap-2 rounded-xl p-5 bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-normal">
                Total Members
              </p>
              <Users className="text-[#135bec] w-5 h-5" />
            </div>
            <p className="text-slate-900 dark:text-slate-100 tracking-tight text-2xl font-bold leading-tight">
              124
            </p>
            <div className="flex items-center gap-1">
              <TrendingUp className="text-green-600 w-4 h-4" />
              <p className="text-green-600 text-xs font-semibold leading-normal">+3% this month</p>
            </div>
          </div>

          <div className="flex min-w-[200px] flex-1 flex-col gap-2 rounded-xl p-5 bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-normal">
                Fund Balance
              </p>
              <Wallet className="text-[#135bec] w-5 h-5" />
            </div>
            <p className="text-slate-900 dark:text-slate-100 tracking-tight text-2xl font-bold leading-tight">
              ₹45,280.00
            </p>
            <div className="flex items-center gap-1">
              <TrendingUp className="text-green-600 w-4 h-4" />
              <p className="text-green-600 text-xs font-semibold leading-normal">+12.5%</p>
            </div>
          </div>
        </div>

        {/* Pending Approvals Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-slate-900 dark:text-slate-100 text-xl font-bold leading-tight tracking-tight">
              Pending Contributions
            </h2>
            <a className="text-[#135bec] text-sm font-semibold" href="#">
              View All
            </a>
          </div>

          <div className="flex flex-col gap-3">
            {/* Request Item 1 */}
            <RequestItem 
              name="Kwame Mensah"
              amount="500.00"
              time="2 hours ago"
              description="January Dues"
            />

            {/* Request Item 2 */}
            <RequestItem 
              name="Abena Osei"
              amount="1,200.00"
              time="5 hours ago"
              description="Special Unity Fund"
            />

            {/* Request Item 3 */}
            <RequestItem 
              name="Kofi Boateng"
              amount="500.00"
              time="Yesterday"
              description="Monthly Contribution"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 mb-20">
          <div className="bg-[#135bec] rounded-xl p-6 text-white overflow-hidden relative">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">Unity &amp; Growth</h3>
              <p className="text-white/80 text-sm mb-4">
                You have 12 brotherhood members currently inactive. Reach out to maintain collective harmony.
              </p>
              <button className="bg-white text-[#135bec] px-4 py-2 rounded-lg text-sm font-bold hover:bg-white/90 transition-colors">
                Manage Members
              </button>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <Users className="w-[120px] h-[120px]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Component for Request Items
function RequestItem({ name, amount, time, description }: { name: string; amount: string; time: string; description: string }) {
  return (
    <div className="flex flex-col gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
      <div className="flex items-start gap-4">
        <div className="bg-[#135bec]/10 rounded-full h-12 w-12 flex items-center justify-center text-[#135bec] shrink-0">
          <User className="w-6 h-6" />
        </div>
        <div className="flex flex-1 flex-col justify-center">
          <div className="flex items-center justify-between">
            <p className="text-slate-900 dark:text-slate-100 text-base font-bold leading-normal">
              {name}
            </p>
            <span className="text-[#135bec] font-bold">₹{amount}</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-normal leading-normal">
            {time} • {description}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <button className="flex-1 flex items-center justify-center rounded-lg h-10 bg-[#135bec] text-white text-sm font-bold transition-opacity hover:opacity-90">
          Approve
        </button>
        <button className="flex-1 flex items-center justify-center rounded-lg h-10 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
          Reject
        </button>
      </div>
    </div>
  );
}