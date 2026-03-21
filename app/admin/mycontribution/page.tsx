"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Proof {
  id: string;
  contributionId: string;
  fileUrl: string;
  filePublicId: string;
  createdAt: string;
}

interface Contribution {
  id: string;
  userId: string;
  month: string;
  baseAmount: number;
  penaltyAmount: number;
  totalPaid: number;
  waiverUsed: boolean;
  status: string;
  createdAt: string;
  proofs: Proof[];
}

interface ContributionResponse {
  total: number;
  page: number;
  totalPages: number;
  data: Contribution[];
}

interface TotalContribution {
  totalContribution: number;
  approvedContribution: number;
  pendingContribution: number;
}

type FilterType = 'all' | 'APPROVED' | 'PENDING' | 'REJECTED';
type YearFilter = string | 'all';

export default function ContributionHistory() {
  const router = useRouter();
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [totals, setTotals] = useState<TotalContribution | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<YearFilter>('all');
  const [statusFilter, setStatusFilter] = useState<FilterType>('all');
  const [availableYears, setAvailableYears] = useState<string[]>([]);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

  useEffect(() => {
    fetchContributions();
    fetchTotals();
  }, []);

  useEffect(() => {
    // Extract unique years from contributions
    if (contributions.length > 0) {
      const years = [...new Set(contributions.map(c => c.month.substring(0, 4)))];
      setAvailableYears(['all', ...years.sort().reverse()]);
    }
  }, [contributions]);

  const fetchContributions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/brother/mycontribution/history`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.push("/login");
          return;
        }
        throw new Error('Failed to fetch contributions');
      }

      const data: ContributionResponse = await response.json();
      setContributions(data.data);
    } catch (err) {
      console.error('Error fetching contributions:', err);
      setError(err instanceof Error ? err.message : 'Failed to load contributions');
    } finally {
      setLoading(false);
    }
  };

  const fetchTotals = async () => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/api/brother/mycontribution/total`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch totals');
      }

      const data: TotalContribution = await response.json();
      setTotals(data);
    } catch (err) {
      console.error('Error fetching totals:', err);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'check_circle';
      case 'PENDING':
        return 'pending';
      case 'REJECTED':
        return 'cancel';
      default:
        return 'help';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600';
      case 'PENDING':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-600';
      case 'REJECTED':
        return 'bg-rose-100 dark:bg-rose-900/30 text-rose-600';
      default:
        return 'bg-slate-100 dark:bg-slate-700 text-slate-600';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400';
      case 'PENDING':
        return 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400';
      case 'REJECTED':
        return 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400';
      default:
        return 'bg-slate-50 dark:bg-slate-700 text-slate-600';
    }
  };

  const filteredContributions = contributions.filter(contribution => {
    // Apply year filter
    if (selectedYear !== 'all' && !contribution.month.startsWith(selectedYear)) {
      return false;
    }
    // Apply status filter
    if (statusFilter !== 'all' && contribution.status !== statusFilter) {
      return false;
    }
    return true;
  });

  if (loading) {
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

          {/* Loading State */}
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
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

          {/* Error State */}
          <div className="flex-1 flex flex-col items-center justify-center p-4">
            <span className="material-symbols-outlined text-6xl text-red-500 mb-4">error</span>
            <p className="text-red-500 text-center mb-4">{error}</p>
            <button
              onClick={() => {
                setError(null);
                fetchContributions();
                fetchTotals();
              }}
              className="px-6 py-2 bg-primary text-white rounded-full"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

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
              ₹{totals?.totalContribution.toLocaleString('en-IN') || '0'}
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
              ₹{totals?.pendingContribution.toLocaleString('en-IN') || '0'}
            </p>
          </div>
        </div>

        {/* Filters Section */}
        <div className="px-4 pt-4">
          <h3 className="text-slate-900 dark:text-slate-100 text-sm font-bold uppercase tracking-widest pb-3 opacity-70">
            Filters
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {/* Year Filter */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value as YearFilter)}
              className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-primary text-white px-5 shadow-md shadow-primary/20 appearance-none cursor-pointer"
            >
              <option value="all">All Years</option>
              {availableYears.filter(y => y !== 'all').map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as FilterType)}
              className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-5 border border-primary/10 appearance-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="APPROVED">Approved</option>
              <option value="PENDING">Pending</option>
              <option value="REJECTED">Rejected</option>
            </select>

            {/* Clear Filters */}
            {(selectedYear !== 'all' || statusFilter !== 'all') && (
              <button
                onClick={() => {
                  setSelectedYear('all');
                  setStatusFilter('all');
                }}
                className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-5 border border-primary/10"
              >
                <p className="text-sm font-medium">Clear</p>
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
          </div>
        </div>

        {/* History List */}
        <div className="flex flex-col gap-1 p-4 mt-2">
          {filteredContributions.length === 0 ? (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              No contributions found
            </div>
          ) : (
            filteredContributions.map((contribution) => {
              const dateTime = formatDateTime(contribution.createdAt);
              
              return (
                <div key={contribution.id} className="flex flex-col gap-3 rounded-xl bg-white dark:bg-slate-800 p-4 border border-primary/5 shadow-sm mb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`flex size-10 items-center justify-center rounded-full ${getStatusColor(contribution.status)}`}>
                        <span className="material-symbols-outlined">{getStatusIcon(contribution.status)}</span>
                      </div>
                      <div>
                        <p className="text-slate-900 dark:text-slate-100 font-bold">{formatMonth(contribution.month)}</p>
                        <p className="text-slate-500 dark:text-slate-400 text-xs">
                          Monthly Dues
                          {contribution.penaltyAmount > 0 && (
                            <span className="text-amber-600 dark:text-amber-500 ml-1">
                              • + ₹{contribution.penaltyAmount} Late Fee
                            </span>
                          )}
                          {contribution.waiverUsed && (
                            <span className="text-emerald-600 dark:text-emerald-500 ml-1">
                              • Waiver Applied
                            </span>
                          )}
                        </p>
                        {/* Date and Time Display */}
                        <div className="flex items-center gap-1 mt-1">
                          <span className="material-symbols-outlined text-[10px] text-slate-400">calendar_today</span>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500">
                            {dateTime.date}
                          </p>
                          <span className="material-symbols-outlined text-[10px] text-slate-400 ml-1">schedule</span>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500">
                            {dateTime.time}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-900 dark:text-slate-100 font-bold">₹{contribution.totalPaid.toLocaleString('en-IN')}</p>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getStatusBadgeColor(contribution.status)}`}>
                        {contribution.status.charAt(0) + contribution.status.slice(1).toLowerCase()}
                      </span>
                    </div>
                  </div>
                  {contribution.proofs.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Receipt uploaded:</p>
                      <a 
                        href={contribution.proofs[0].fileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-sm">image</span>
                        View Receipt
                      </a>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Note: Bottom navigation removed as requested - it's already in your layout component */}
      </div>
    </div>
  );
}