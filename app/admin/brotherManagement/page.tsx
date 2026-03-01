"use client";

import { 
  ChevronLeft,
  UserPlus,
  Search,
  Edit,
  MoreVertical,
  Plus,
  LayoutDashboard,
  Users,
  Wallet,
  Settings,
  Home
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function BrotherManagement() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const handleAddBrother = () => {
    // Navigate to add brother page or open modal
    console.log('Add brother clicked');
  };

  const handleEditBrother = (id: string) => {
    // Navigate to edit brother page
    console.log('Edit brother:', id);
  };

  const handleViewOptions = (id: string) => {
    // Open options menu
    console.log('Options for:', id);
  };

  return (
    <div className="bg-[#f6f6f8] dark:bg-[#101622] text-slate-900 dark:text-slate-100 min-h-screen">
      <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#f6f6f8] dark:bg-[#101622] overflow-x-hidden pb-20">
        {/* Header */}
        <div className="flex items-center bg-[#f6f6f8] dark:bg-[#101622] p-4 pb-2 justify-between sticky top-0 z-10 border-b border-[#135bec]/10">
          <button 
            onClick={handleGoBack}
            className="text-slate-900 dark:text-slate-100 flex size-10 items-center justify-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight flex-1 text-center">
            Brother Management
          </h2>
          <button 
            onClick={handleAddBrother}
            className="flex w-10 items-center justify-end text-[#135bec] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg h-10 transition-colors"
          >
            <UserPlus className="w-6 h-6" />
          </button>
        </div>

        {/* Stats Cards */}
        <div className="flex flex-wrap gap-3 p-4">
          <div className="flex min-w-[140px] flex-1 flex-col gap-1 rounded-xl p-4 border border-[#135bec]/10 bg-white dark:bg-slate-800/50 shadow-sm">
            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">
              Total Brothers
            </p>
            <p className="text-slate-900 dark:text-slate-100 text-2xl font-bold">124</p>
          </div>
          <div className="flex min-w-[140px] flex-1 flex-col gap-1 rounded-xl p-4 border border-[#135bec]/10 bg-white dark:bg-slate-800/50 shadow-sm">
            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">
              Active Members
            </p>
            <p className="text-[#135bec] text-2xl font-bold">118</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 py-2">
          <div className="relative flex items-center">
            <Search className="absolute left-3 text-slate-400 w-5 h-5" />
            <input
              className="w-full bg-slate-200/50 dark:bg-slate-800 border-none rounded-lg py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#135bec] outline-none"
              placeholder="Search by name or ID..."
              type="text"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-2">
          <div className="flex border-b border-[#135bec]/10 px-4 gap-6">
            <button className="flex flex-col items-center justify-center border-b-2 border-[#135bec] text-[#135bec] pb-3 pt-2">
              <p className="text-sm font-bold">Active</p>
            </button>
            <button className="flex flex-col items-center justify-center border-b-2 border-transparent text-slate-500 pb-3 pt-2">
              <p className="text-sm font-bold">Inactive</p>
            </button>
            <button className="flex flex-col items-center justify-center border-b-2 border-transparent text-slate-500 pb-3 pt-2">
              <p className="text-sm font-bold">Pending</p>
            </button>
          </div>
        </div>

        {/* Member List */}
        <div className="flex flex-col divide-y divide-[#135bec]/5">
          {/* Member 1 */}
          <div className="flex items-center gap-4 bg-transparent px-4 py-4 justify-between active:bg-slate-100 dark:active:bg-slate-800 transition-colors">
            <div className="flex items-center gap-3 flex-1">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-12 w-12 border-2 border-white shadow-sm flex-shrink-0"
                style={{
                  backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAZ6I9vDf3DE3KHYMjHDMMNpEnIjDkxJyc1ee_xzWOHeHQKuwL6GQ8sFAeasDxJbTQy7vbAwwSW_zDgpoYtrSIQJuz4LLnq0uOGFxi63SVVt29-mpLxKOZ40j_pmseTjz6B8otFPgix2kD1zLk-1eB-876a6Iy9dt-d1eD_n9wuVXeayjEkdpmVMMmxgs5eS2mpS8oVFe5snIjLeg3WuQ8945f1KbqPcoLd9jgc7WYpecHulSbpPUcDVwzo0s0H0CbPhJxdIn4aX1Q")'
                }}
              />
              <div className="flex flex-col min-w-0">
                <p className="text-slate-900 dark:text-slate-100 text-base font-bold leading-none mb-1 truncate">
                  Abebe Balcha
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-normal">
                  Joined: Jan 2023 • ID: #BR001
                </p>
                <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full w-fit uppercase">
                  <span className="w-1 h-1 rounded-full bg-green-600"></span> Fully Paid
                </span>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button 
                onClick={() => handleEditBrother('BR001')}
                className="flex size-9 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button 
                onClick={() => handleViewOptions('BR001')}
                className="flex size-9 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Member 2 */}
          <div className="flex items-center gap-4 bg-transparent px-4 py-4 justify-between active:bg-slate-100 dark:active:bg-slate-800 transition-colors">
            <div className="flex items-center gap-3 flex-1">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-12 w-12 border-2 border-white shadow-sm flex-shrink-0"
                style={{
                  backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAwOCJZT8M_0bdeOEHkIYt1aW7vd_y-yIiKByf-1a1LLYPyFdbYOMGsjHes1hQNrZ4uXA6nj_bmLwOMv5rKRXpqV3BKbg2APBZypLGAdo4ydKdflK5meb10YiwjQRn1_HMY5kSYwHT53PlXn984NPrAzjINEh2Tp-PfxflIMAO8F9OhexXThq5_1dHW7Mc8FmvUQPOVkK0HkQbVEF9Z7OnzquLCW433j0AfkV56v-hfZXueKg8V8kMmM4KUsLXUujyOoCknG07hknQ")'
                }}
              />
              <div className="flex flex-col min-w-0">
                <p className="text-slate-900 dark:text-slate-100 text-base font-bold leading-none mb-1 truncate">
                  Dawit Mekonnen
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-normal">
                  Joined: Mar 2023 • ID: #BR042
                </p>
                <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold text-amber-600 bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded-full w-fit uppercase">
                  <span className="w-1 h-1 rounded-full bg-amber-600"></span> 1 Month Owed
                </span>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button 
                onClick={() => handleEditBrother('BR042')}
                className="flex size-9 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button 
                onClick={() => handleViewOptions('BR042')}
                className="flex size-9 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Member 3 */}
          <div className="flex items-center gap-4 bg-transparent px-4 py-4 justify-between active:bg-slate-100 dark:active:bg-slate-800 transition-colors">
            <div className="flex items-center gap-3 flex-1">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-12 w-12 border-2 border-white shadow-sm flex-shrink-0"
                style={{
                  backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAj-kodO07IUIz59kUIiPfe3668vyItNCivtbs0pIqcY8EOsQhPL1iNHbJFjqVgxpL3zeTSh6VJ0L3ZAiyw2D22JRhjkEJoKOFEV67QIHRcyV2jyvAxNm0D25Mcj1kNJzuOTlTCCbpHTjuflx75NbM2tjoUU0v0k4U6X0VH63aUbpW3f4vxZXu2l3clhAfxPIPSz0PPJk3RY1XdYo4e6MYeOVMxNHDswub644pVr9cn4zYcjnHbaBqVJxBx9RPUY1vESV1Lqs2CpFI")'
                }}
              />
              <div className="flex flex-col min-w-0">
                <p className="text-slate-900 dark:text-slate-100 text-base font-bold leading-none mb-1 truncate">
                  Elias Tadesse
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-normal">
                  Joined: Nov 2022 • ID: #BR112
                </p>
                <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full w-fit uppercase">
                  <span className="w-1 h-1 rounded-full bg-green-600"></span> Fully Paid
                </span>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button 
                onClick={() => handleEditBrother('BR112')}
                className="flex size-9 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button 
                onClick={() => handleViewOptions('BR112')}
                className="flex size-9 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Member 4 */}
          <div className="flex items-center gap-4 bg-transparent px-4 py-4 justify-between active:bg-slate-100 dark:active:bg-slate-800 transition-colors">
            <div className="flex items-center gap-3 flex-1">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-12 w-12 border-2 border-white shadow-sm flex-shrink-0"
                style={{
                  backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDvQIL-bRVTKlLpfG-goKGPV478S5OeSd45IqWojXteFqhZIigLSYa02f0LkzScH1SHfXz2chMEeLWLyA61TZNZtmA-1VBgGdt2Yl7rLpNEW6kzgDLhp7iyf6NmxvoOXIU5HI4jSM-N0GP0cOEx1aiGwTWgEQ4vsQzp8fK7BO11tuXa-WXcDor3CvIWiBvYPHkFvuNLv1B0R2QC7adA4lIfssbRlduny4aKfZDT_Py_HRrVxnWFaQ7JXBmaukp8VwWNEqoYb67bqlM")'
                }}
              />
              <div className="flex flex-col min-w-0">
                <p className="text-slate-900 dark:text-slate-100 text-base font-bold leading-none mb-1 truncate">
                  Samuel Girma
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-normal">
                  Joined: Feb 2024 • ID: #BR005
                </p>
                <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold text-slate-600 bg-slate-100 dark:bg-slate-700/50 px-2 py-0.5 rounded-full w-fit uppercase">
                  <span className="w-1 h-1 rounded-full bg-slate-600"></span> New Member
                </span>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button 
                onClick={() => handleEditBrother('BR005')}
                className="flex size-9 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button 
                onClick={() => handleViewOptions('BR005')}
                className="flex size-9 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Floating Add Button */}
        <div className="fixed bottom-24 right-6 lg:bottom-6 z-30">
          <button 
            onClick={handleAddBrother}
            className="flex size-14 items-center justify-center rounded-full bg-[#135bec] text-white shadow-lg shadow-[#135bec]/40 hover:bg-[#0f4ac0] transition-colors"
          >
            <Plus className="w-8 h-8" />
          </button>
        </div>
      </div>
    </div>
  );
}