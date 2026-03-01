"use client";

import { useRouter } from "next/navigation";

export default function ContributionHistory() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden pb-24">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md p-4 justify-between border-b border-primary/10">
          <button
            onClick={handleGoBack}
            className="text-primary flex size-10 items-center justify-center rounded-full hover:bg-primary/10 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
          <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">
            Contribution History
          </h2>
        </div>

        {/* Summary Cards */}
        <div className="flex flex-wrap gap-4 p-4">
          <div className="flex min-w-[150px] flex-1 flex-col gap-2 rounded-xl p-5 bg-white dark:bg-slate-800 shadow-sm border border-primary/5">
            <div className="flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined text-sm">payments</span>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">
                Total Contributed
              </p>
            </div>
            <p className="text-slate-900 dark:text-slate-100 tracking-tight text-2xl font-bold leading-tight">
              $1,200.00
            </p>
          </div>
          <div className="flex min-w-[150px] flex-1 flex-col gap-2 rounded-xl p-5 bg-white dark:bg-slate-800 shadow-sm border border-primary/5">
            <div className="flex items-center gap-2 text-amber-500">
              <span className="material-symbols-outlined text-sm">schedule</span>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">
                Pending Amount
              </p>
            </div>
            <p className="text-slate-900 dark:text-slate-100 tracking-tight text-2xl font-bold leading-tight">
              $50.00
            </p>
          </div>
        </div>

        {/* Filters Section */}
        <div className="px-4 pt-4">
          <h3 className="text-slate-900 dark:text-slate-100 text-sm font-bold uppercase tracking-widest pb-3 opacity-70">
            Filters
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-primary text-white px-5 shadow-md shadow-primary/20">
              <p className="text-sm font-semibold">2024</p>
              <span className="material-symbols-outlined text-sm">expand_more</span>
            </button>
            <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-5 border border-primary/10">
              <p className="text-sm font-medium">Status</p>
              <span className="material-symbols-outlined text-sm">filter_list</span>
            </button>
            <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-5 border border-primary/10">
              <p className="text-sm font-medium">All History</p>
            </button>
          </div>
        </div>

        {/* History List */}
        <div className="flex flex-col gap-1 p-4 mt-2">
          {/* Item 1: Approved */}
          <div className="flex flex-col gap-3 rounded-xl bg-white dark:bg-slate-800 p-4 border border-primary/5 shadow-sm mb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600">
                  <span className="material-symbols-outlined">check_circle</span>
                </div>
                <div>
                  <p className="text-slate-900 dark:text-slate-100 font-bold">March 2024</p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">Monthly Dues</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-slate-900 dark:text-slate-100 font-bold">$100.00</p>
                <span className="inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                  Approved
                </span>
              </div>
            </div>
          </div>

          {/* Item 2: Pending with Penalty */}
          <div className="flex flex-col gap-3 rounded-xl bg-white dark:bg-slate-800 p-4 border border-primary/5 shadow-sm mb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600">
                  <span className="material-symbols-outlined">pending</span>
                </div>
                <div>
                  <p className="text-slate-900 dark:text-slate-100 font-bold">February 2024</p>
                  <p className="text-amber-600 dark:text-amber-500 text-xs font-medium">+ $10.00 Late Fee</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-slate-900 dark:text-slate-100 font-bold">$110.00</p>
                <span className="inline-flex items-center rounded-full bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400">
                  Pending
                </span>
              </div>
            </div>
          </div>

          {/* Item 3: Approved */}
          <div className="flex flex-col gap-3 rounded-xl bg-white dark:bg-slate-800 p-4 border border-primary/5 shadow-sm mb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600">
                  <span className="material-symbols-outlined">check_circle</span>
                </div>
                <div>
                  <p className="text-slate-900 dark:text-slate-100 font-bold">January 2024</p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">Monthly Dues</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-slate-900 dark:text-slate-100 font-bold">$100.00</p>
                <span className="inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                  Approved
                </span>
              </div>
            </div>
          </div>

          {/* Item 4: Rejected */}
          <div className="flex flex-col gap-3 rounded-xl bg-white dark:bg-slate-800 p-4 border border-primary/5 shadow-sm mb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600">
                  <span className="material-symbols-outlined">cancel</span>
                </div>
                <div>
                  <p className="text-slate-900 dark:text-slate-100 font-bold">December 2023</p>
                  <p className="text-rose-500 dark:text-rose-400 text-xs">Invalid Receipt</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-slate-900 dark:text-slate-100 font-bold">$100.00</p>
                <span className="inline-flex items-center rounded-full bg-rose-50 dark:bg-rose-900/20 px-2 py-0.5 text-xs font-medium text-rose-700 dark:text-rose-400">
                  Rejected
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Note: Bottom navigation removed as requested - it's already in your layout component */}
      </div>
    </div>
  );
}