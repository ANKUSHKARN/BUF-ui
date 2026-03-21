"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Filter,
  ChevronDown,
  RefreshCw,
  DollarSign,
  PieChart,
  BarChart3,
  LineChart,
  Activity
} from 'lucide-react';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

// Types
interface Contribution {
  id: string;
  userId: string;
  month: string;
  baseAmount: number;
  penaltyAmount: number;
  totalPaid: number;
  waiverUsed: boolean;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  proofs: Array<{
    id: string;
    fileUrl: string;
    filePublicId: string;
    createdAt: string;
  }>;
}

interface DashboardSummary {
  totalCorpus: number;
  totalApprovedCount: number;
  totalPendingAmount: number;
  totalBrothers: number;
  employedBrothers: number;
  unemployedBrothers: number;
}

interface UserContributionStats {
  userId: string;
  userName: string;
  totalPaid: number;
  totalPenalty: number;
  averageContribution: number;
  totalContributions: number;
  waiverUsage: number;
}

interface MonthlyStats {
  month: string;
  totalAmount: number;
  approvedCount: number;
  pendingCount: number;
  rejectedCount: number;
  penaltyAmount: number;
}

interface ContributionTrend {
  month: string;
  amount: number;
  count: number;
}

export default function AnalyticsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'6months' | '12months' | 'all'>('12months');
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [userStats, setUserStats] = useState<UserContributionStats[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([]);
  const [contributionTrends, setContributionTrends] = useState<ContributionTrend[]>([]);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      // Fetch contributions and summary
      const [contributionsRes, summaryRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/admin/brotherscontribution`, {
          headers: getAuthHeaders(),
        }),
        fetch(`${API_BASE_URL}/api/brother/dashboard/summary`, {
          headers: getAuthHeaders(),
        })
      ]);

      if (contributionsRes.status === 401 || summaryRes.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
        return;
      }

      if (!contributionsRes.ok) throw new Error('Failed to fetch contributions');
      if (!summaryRes.ok) throw new Error('Failed to fetch summary');

      const contributionsData = await contributionsRes.json();
      const summaryData = await summaryRes.json();

      setContributions(contributionsData);
      setSummary(summaryData);

      // Process data for analytics
      processAnalyticsData(contributionsData);
      
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const processAnalyticsData = (data: Contribution[]) => {
    // Filter contributions based on time range
    let filteredData = [...data];
    if (timeRange !== 'all') {
      const monthsToShow = timeRange === '6months' ? 6 : 12;
      const cutoffDate = new Date();
      cutoffDate.setMonth(cutoffDate.getMonth() - monthsToShow);
      filteredData = data.filter(contribution => 
        new Date(contribution.createdAt) >= cutoffDate
      );
    }

    // Calculate monthly statistics
    const monthlyMap = new Map<string, MonthlyStats>();
    
    filteredData.forEach(contribution => {
      const month = contribution.month;
      if (!monthlyMap.has(month)) {
        monthlyMap.set(month, {
          month,
          totalAmount: 0,
          approvedCount: 0,
          pendingCount: 0,
          rejectedCount: 0,
          penaltyAmount: 0
        });
      }
      
      const stats = monthlyMap.get(month)!;
      stats.totalAmount += contribution.totalPaid;
      stats.penaltyAmount += contribution.penaltyAmount;
      
      if (contribution.status === 'APPROVED') stats.approvedCount++;
      else if (contribution.status === 'PENDING') stats.pendingCount++;
      else if (contribution.status === 'REJECTED') stats.rejectedCount++;
    });
    
    // Convert to array and sort by month
    const monthlyStatsArray = Array.from(monthlyMap.values())
      .sort((a, b) => a.month.localeCompare(b.month));
    
    setMonthlyStats(monthlyStatsArray);
    
    // Calculate contribution trends
    const trends = monthlyStatsArray.map(stat => ({
      month: formatMonthLabel(stat.month),
      amount: stat.totalAmount,
      count: stat.approvedCount + stat.pendingCount + stat.rejectedCount
    }));
    setContributionTrends(trends);
    
    // Calculate user statistics
    const userMap = new Map<string, UserContributionStats>();
    
    data.forEach(contribution => {
      if (contribution.status === 'APPROVED') {
        const userId = contribution.user.id;
        if (!userMap.has(userId)) {
          userMap.set(userId, {
            userId,
            userName: contribution.user.name,
            totalPaid: 0,
            totalPenalty: 0,
            averageContribution: 0,
            totalContributions: 0,
            waiverUsage: 0
          });
        }
        
        const stats = userMap.get(userId)!;
        stats.totalPaid += contribution.totalPaid;
        stats.totalPenalty += contribution.penaltyAmount;
        stats.totalContributions++;
        if (contribution.waiverUsed) stats.waiverUsage++;
      }
    });
    
    // Calculate averages
    const userStatsArray = Array.from(userMap.values()).map(stats => ({
      ...stats,
      averageContribution: stats.totalPaid / stats.totalContributions,
      waiverUsage: (stats.waiverUsage / stats.totalContributions) * 100
    }));
    
    setUserStats(userStatsArray.sort((a, b) => b.totalPaid - a.totalPaid));
  };

  const formatMonthLabel = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleString('default', { month: 'short', year: '2-digit' });
  };

  // Chart data configurations
  const contributionTrendChartData = {
    labels: contributionTrends.map(t => t.month),
    datasets: [
      {
        label: 'Total Contributions (₹)',
        data: contributionTrends.map(t => t.amount),
        borderColor: 'rgb(19, 91, 236)',
        backgroundColor: 'rgba(19, 91, 236, 0.1)',
        tension: 0.4,
        fill: true,
        yAxisID: 'y',
      },
      {
        label: 'Number of Contributions',
        data: contributionTrends.map(t => t.count),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true,
        yAxisID: 'y1',
      }
    ]
  };

  const contributionTrendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          boxWidth: 10,
        }
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.dataset.label?.includes('₹')) {
              label += '₹' + context.parsed.y.toLocaleString('en-IN');
            } else {
              label += context.parsed.y;
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Amount (₹)',
          font: {
            size: 12,
          }
        },
        ticks: {
          callback: function(value: any) {
            return '₹' + value.toLocaleString('en-IN');
          }
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Count',
          font: {
            size: 12,
          }
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  const statusDistributionData = {
    labels: ['Approved', 'Pending', 'Rejected'],
    datasets: [
      {
        data: [
          contributions.filter(c => c.status === 'APPROVED').length,
          contributions.filter(c => c.status === 'PENDING').length,
          contributions.filter(c => c.status === 'REJECTED').length
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(251, 191, 36)',
          'rgb(239, 68, 68)'
        ],
        borderWidth: 2,
      }
    ]
  };

  const monthlyContributionChartData = {
    labels: monthlyStats.map(stat => formatMonthLabel(stat.month)),
    datasets: [
      {
        label: 'Approved',
        data: monthlyStats.map(stat => stat.approvedCount),
        backgroundColor: 'rgba(34, 197, 94, 0.6)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
      },
      {
        label: 'Pending',
        data: monthlyStats.map(stat => stat.pendingCount),
        backgroundColor: 'rgba(251, 191, 36, 0.6)',
        borderColor: 'rgb(251, 191, 36)',
        borderWidth: 1,
      },
      {
        label: 'Rejected',
        data: monthlyStats.map(stat => stat.rejectedCount),
        backgroundColor: 'rgba(239, 68, 68, 0.6)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
      }
    ]
  };

  const monthlyAmountChartData = {
    labels: monthlyStats.map(stat => formatMonthLabel(stat.month)),
    datasets: [
      {
        label: 'Base Amount',
        data: monthlyStats.map(stat => stat.totalAmount - stat.penaltyAmount),
        backgroundColor: 'rgba(19, 91, 236, 0.6)',
        borderColor: 'rgb(19, 91, 236)',
        borderWidth: 1,
      },
      {
        label: 'Penalty Amount',
        data: monthlyStats.map(stat => stat.penaltyAmount),
        backgroundColor: 'rgba(239, 68, 68, 0.6)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
      }
    ]
  };

  const topContributorsData = {
    labels: userStats.slice(0, 5).map(u => u.userName),
    datasets: [
      {
        label: 'Total Contribution (₹)',
        data: userStats.slice(0, 5).map(u => u.totalPaid),
        backgroundColor: 'rgba(19, 91, 236, 0.6)',
        borderColor: 'rgb(19, 91, 236)',
        borderWidth: 1,
      }
    ]
  };

  const calculateAverageContribution = () => {
    const approvedContributions = contributions.filter(c => c.status === 'APPROVED');
    if (approvedContributions.length === 0) return 0;
    const total = approvedContributions.reduce((sum, c) => sum + c.totalPaid, 0);
    return total / approvedContributions.length;
  };

  const calculateTotalPenalty = () => {
    return contributions
      .filter(c => c.status === 'APPROVED')
      .reduce((sum, c) => sum + c.penaltyAmount, 0);
  };

  const calculateTotalWaiverUsage = () => {
    return contributions.filter(c => c.waiverUsed && c.status === 'APPROVED').length;
  };

  const handleExportData = () => {
    const exportData = contributions.map(c => ({
      'User Name': c.user.name,
      'User Email': c.user.email,
      'Month': c.month,
      'Base Amount': c.baseAmount,
      'Penalty Amount': c.penaltyAmount,
      'Total Paid': c.totalPaid,
      'Status': c.status,
      'Waiver Used': c.waiverUsed ? 'Yes' : 'No',
      'Date': new Date(c.createdAt).toLocaleDateString()
    }));
    
    const csv = [
      Object.keys(exportData[0]).join(','),
      ...exportData.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contributions_export_${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f6f8] dark:bg-[#101622] flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-[#135bec] animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f6f6f8] dark:bg-[#101622] flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-md text-center">
          <div className="text-red-500 mb-4">⚠️</div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Failed to load analytics</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{error}</p>
          <button 
            onClick={() => fetchAnalyticsData()}
            className="bg-[#135bec] text-white px-6 py-2 rounded-lg text-sm font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f6f8] dark:bg-[#101622] font-[Manrope,sans-serif]">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="p-4 lg:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Analytics Dashboard
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                Comprehensive insights into brotherhood contributions
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleExportData}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export Data
              </button>
              <button
                onClick={() => fetchAnalyticsData()}
                className="flex items-center gap-2 px-4 py-2 bg-[#135bec] text-white rounded-lg hover:bg-[#135bec]/90 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>

          {/* Time Range Filter */}
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setTimeRange('6months')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                timeRange === '6months'
                  ? 'bg-[#135bec] text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              Last 6 Months
            </button>
            <button
              onClick={() => setTimeRange('12months')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                timeRange === '12months'
                  ? 'bg-[#135bec] text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              Last 12 Months
            </button>
            <button
              onClick={() => setTimeRange('all')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                timeRange === 'all'
                  ? 'bg-[#135bec] text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              All Time
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 lg:p-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <Wallet className="text-[#135bec] w-6 h-6" />
              <TrendingUp className="text-green-500 w-5 h-5" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Corpus</p>
            <p className="text-slate-900 dark:text-white text-2xl font-bold mt-1">
              ₹{summary?.totalCorpus?.toLocaleString('en-IN') || '0'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              {summary?.totalApprovedCount || 0} approved contributions
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <Activity className="text-[#135bec] w-6 h-6" />
              <DollarSign className="text-emerald-500 w-5 h-5" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Average Contribution</p>
            <p className="text-slate-900 dark:text-white text-2xl font-bold mt-1">
              ₹{calculateAverageContribution().toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Per contribution
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <TrendingDown className="text-red-500 w-6 h-6" />
              <Clock className="text-amber-500 w-5 h-5" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Penalty Collected</p>
            <p className="text-slate-900 dark:text-white text-2xl font-bold mt-1">
              ₹{calculateTotalPenalty().toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              From late payments
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <CheckCircle className="text-green-500 w-6 h-6" />
              <Users className="text-[#135bec] w-5 h-5" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Waivers Used</p>
            <p className="text-slate-900 dark:text-white text-2xl font-bold mt-1">
              {calculateTotalWaiverUsage()}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Total waiver applications
            </p>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Contribution Trend Chart */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-900 dark:text-white text-lg font-bold flex items-center gap-2">
                <LineChart className="w-5 h-5 text-[#135bec]" />
                Contribution Trends
              </h3>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Amount vs Count over time
              </div>
            </div>
            <div className="h-[300px]">
              <Line data={contributionTrendChartData} options={contributionTrendOptions} />
            </div>
          </div>

          {/* Status Distribution */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-900 dark:text-white text-lg font-bold flex items-center gap-2">
                <PieChart className="w-5 h-5 text-[#135bec]" />
                Contribution Status Distribution
              </h3>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Overall approval rate
              </div>
            </div>
            <div className="h-[300px] flex items-center justify-center">
              <div className="w-full max-w-[300px]">
                <Pie data={statusDistributionData} options={{ maintainAspectRatio: true }} />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Approved</p>
                <p className="text-lg font-bold text-emerald-600">
                  {contributions.filter(c => c.status === 'APPROVED').length}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Pending</p>
                <p className="text-lg font-bold text-amber-600">
                  {contributions.filter(c => c.status === 'PENDING').length}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Rejected</p>
                <p className="text-lg font-bold text-red-600">
                  {contributions.filter(c => c.status === 'REJECTED').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Monthly Contribution Count */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-900 dark:text-white text-lg font-bold flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#135bec]" />
                Monthly Contribution Count
              </h3>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                By status
              </div>
            </div>
            <div className="h-[300px]">
              <Bar 
                data={monthlyContributionChartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top' as const,
                    }
                  }
                }} 
              />
            </div>
          </div>

          {/* Monthly Amount Breakdown */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-900 dark:text-white text-lg font-bold flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#135bec]" />
                Monthly Amount Breakdown
              </h3>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Base vs Penalty
              </div>
            </div>
            <div className="h-[300px]">
              <Bar 
                data={monthlyAmountChartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top' as const,
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context: any) {
                          return context.dataset.label + ': ₹' + context.parsed.y.toLocaleString('en-IN');
                        }
                      }
                    }
                  },
                  scales: {
                    y: {
                      ticks: {
                        callback: function(value: any) {
                          return '₹' + value.toLocaleString('en-IN');
                        }
                      }
                    }
                  }
                }} 
              />
            </div>
          </div>
        </div>

        {/* Top Contributors */}
        <div className="grid grid-cols-1 gap-6 mb-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-900 dark:text-white text-lg font-bold flex items-center gap-2">
                <Users className="w-5 h-5 text-[#135bec]" />
                Top Contributors
              </h3>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Based on total contribution amount
              </div>
            </div>
            <div className="h-[300px]">
              <Bar 
                data={topContributorsData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context: any) {
                          return 'Total: ₹' + context.parsed.y.toLocaleString('en-IN');
                        }
                      }
                    }
                  },
                  scales: {
                    y: {
                      ticks: {
                        callback: function(value: any) {
                          return '₹' + value.toLocaleString('en-IN');
                        }
                      }
                    }
                  }
                }} 
              />
            </div>
          </div>
        </div>

        {/* User Statistics Table */}
        {userStats.length > 0 && (
          <div className="mb-15 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-slate-900 dark:text-white text-lg font-bold flex items-center gap-2">
                <Users className="w-5 h-5 text-[#135bec]" />
                Detailed User Statistics
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-900/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      User Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Total Paid (₹)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Total Penalty (₹)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Avg Contribution (₹)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Contributions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Waiver Usage
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {userStats.map((user) => (
                    <tr key={user.userId} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-900 dark:text-white">
                          {user.userName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900 dark:text-white font-semibold">
                          ₹{user.totalPaid.toLocaleString('en-IN')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-red-600 dark:text-red-400">
                          ₹{user.totalPenalty.toLocaleString('en-IN')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-700 dark:text-slate-300">
                          ₹{user.averageContribution.toLocaleString('en-IN')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-700 dark:text-slate-300">
                          {user.totalContributions}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#135bec] rounded-full"
                              style={{ width: `${user.waiverUsage}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-600 dark:text-slate-400">
                            {user.waiverUsage.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}