"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft,
  User,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  DollarSign,
  Award,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  ChevronDown,
  Download,
  RefreshCw,
  Activity,
  TrendingUp,
  Users,
  Wallet,
  Clock,
  Ban,
  Check,
  X,
  PlusCircle,
  FileText,
  BarChart3,
  PieChart,
  Target,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  AlertTriangle
} from 'lucide-react';

interface Brother {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: string;
  employmentStatus: string;
  monthlyContribution: number;
  waiverRemaining: number;
  isActive: boolean;
  joinDate: string;
  createdAt: string;
  updatedAt: string;
}

interface ContributionProof {
  id: string;
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
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  proofs?: ContributionProof[];
}

interface BrotherDetails {
  basicInfo: {
    id: string;
    name: string;
    email: string;
    isActive: boolean;
    monthlyContribution: number;
    waiverRemaining: number;
    createdAt: string;
  };
  summary: {
    totalContribution: number;
    totalLoans: number;
    totalWithdrawals: number;
    totalInvestments: number;
  };
  contributions: Contribution[];
  loans: Array<any>;
  withdrawals: Array<any>;
  investments: Array<any>;
  votes: Array<any>;
}

interface DashboardSummary {
  totalCorpus: number;
  totalApprovedCount: number;
  totalPendingAmount: number;
  totalBrothers: number;
  employedBrothers: number;
  unemployedBrothers: number;
}

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

type ConfirmationModalType = 'activate' | 'deactivate' | null;

export default function AllBrotherPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState<string | null>(null);
  const [brothers, setBrothers] = useState<Brother[]>([]);
  const [filteredBrothers, setFilteredBrothers] = useState<Brother[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [employmentFilter, setEmploymentFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedBrother, setSelectedBrother] = useState<BrotherDetails | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [brotherTotals, setBrotherTotals] = useState<Record<string, number>>({});
  const [dashboardSummary, setDashboardSummary] = useState<DashboardSummary | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(true);
  
  // Confirmation modal
  const [confirmationModal, setConfirmationModal] = useState<{
    type: ConfirmationModalType;
    brotherId: string;
    brotherName: string;
    currentStatus: boolean;
  } | null>(null);

  // Proof viewer modal
  const [proofViewer, setProofViewer] = useState<{
    proofs: ContributionProof[];
    currentIndex: number;
    contributionMonth: string;
  } | null>(null);

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

  useEffect(() => {
    fetchDashboardSummary();
    fetchBrothers();
  }, []);

  useEffect(() => {
    // Apply filters and sorting
    let filtered = [...brothers];
    
    // Status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(b => 
        statusFilter === 'ACTIVE' ? b.isActive : !b.isActive
      );
    }
    
    // Employment filter
    if (employmentFilter !== 'ALL') {
      filtered = filtered.filter(b => b.employmentStatus === employmentFilter);
    }
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(b => 
        b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.mobile.includes(searchTerm)
      );
    }
    
    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'monthlyContribution':
          comparison = a.monthlyContribution - b.monthlyContribution;
          break;
        case 'joinDate':
          comparison = new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime();
          break;
        case 'status':
          comparison = (a.isActive === b.isActive) ? 0 : a.isActive ? -1 : 1;
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    setFilteredBrothers(filtered);
  }, [brothers, searchTerm, statusFilter, employmentFilter, sortBy, sortOrder]);

  const fetchDashboardSummary = async () => {
    setLoadingSummary(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/brother/dashboard/summary`, {
        headers: getAuthHeaders(),
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard summary');
      }

      const data = await response.json();
      setDashboardSummary(data);
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
      addToast('error', 'Failed to load dashboard summary');
    } finally {
      setLoadingSummary(false);
    }
  };

  const fetchBrothers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/admin/brothers`, {
        headers: getAuthHeaders(),
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch brothers');
      }

      const data = await response.json();
      setBrothers(data);
      setFilteredBrothers(data);
      addToast('success', 'Brothers loaded successfully');
    } catch (error) {
      console.error('Error fetching brothers:', error);
      setError('Failed to load brothers data');
      addToast('error', 'Failed to load brothers data');
    } finally {
      setLoading(false);
    }
  };

  const fetchBrotherTotal = async (brotherId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/api/admin/brother/${brotherId}`, {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        const total = data.contributions
          .filter((c: any) => c.status === 'APPROVED')
          .reduce((sum: number, c: any) => sum + c.totalPaid, 0);
        
        setBrotherTotals(prev => ({ ...prev, [brotherId]: total }));
      }
    } catch (error) {
      console.error(`Error fetching total for brother ${brotherId}:`, error);
    }
  };

  // In the useEffect after fetching brothers
  useEffect(() => {
    if (brothers.length > 0) {
      brothers.forEach(brother => {
        fetchBrotherTotal(brother.id);
      });
    }
  }, [brothers]);

  const handleToggleActiveClick = (brother: Brother) => {
    setConfirmationModal({
      type: brother.isActive ? 'deactivate' : 'activate',
      brotherId: brother.id,
      brotherName: brother.name,
      currentStatus: brother.isActive
    });
  };

  const handleConfirmToggleActive = async () => {
    if (!confirmationModal) return;

    const { brotherId, currentStatus } = confirmationModal;
    setProcessingId(brotherId);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const endpoint = currentStatus ? 'deactivate' : 'activate';
      const response = await fetch(`${API_BASE_URL}/api/admin/brother/${brotherId}/${endpoint}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
        return;
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Failed to ${endpoint} brother`);
      }

      // Update local state
      setBrothers(prev => prev.map(b => 
        b.id === brotherId ? { ...b, isActive: !currentStatus } : b
      ));
      
      // Refresh dashboard summary after status change
      await fetchDashboardSummary();
      
      addToast('success', `${confirmationModal.brotherName} has been ${currentStatus ? 'deactivated' : 'activated'} successfully`);
    } catch (error: any) {
      console.error('Error toggling brother status:', error);
      addToast('error', error.message);
    } finally {
      setProcessingId(null);
      setConfirmationModal(null);
    }
  };

  const handleViewDetails = async (brotherId: string) => {
    setLoadingDetails(brotherId);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/admin/brother/${brotherId}`, {
        headers: getAuthHeaders(),
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch brother details');
      }

      const data = await response.json();
      
      // Fetch proofs for each contribution
      const contributionsWithProofs = await Promise.all(
        data.contributions.map(async (contribution: Contribution) => {
          try {
            const proofsResponse = await fetch(`${API_BASE_URL}/api/admin/brotherscontribution/${contribution.id}/proofs`, {
              headers: getAuthHeaders(),
            });
            if (proofsResponse.ok) {
              const proofs = await proofsResponse.json();
              return { ...contribution, proofs };
            }
          } catch (error) {
            console.error(`Error fetching proofs for contribution ${contribution.id}:`, error);
          }
          return contribution;
        })
      );

      setSelectedBrother({
        ...data,
        contributions: contributionsWithProofs
      });
      setShowDetailsModal(true);
    } catch (error) {
      console.error('Error fetching brother details:', error);
      addToast('error', 'Failed to load brother details');
    } finally {
      setLoadingDetails(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const getEmploymentStatusColor = (status: string) => {
    switch (status) {
      case 'EMPLOYED':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'UNEMPLOYED':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'STUDENT':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <span className="px-2 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full text-xs font-medium">Approved</span>;
      case 'PENDING':
        return <span className="px-2 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 rounded-full text-xs font-medium">Pending</span>;
      case 'REJECTED':
        return <span className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded-full text-xs font-medium">Rejected</span>;
      default:
        return null;
    }
  };

  // Calculate stats from dashboard summary
  const activeBrothers = dashboardSummary?.employedBrothers || 0;
  const inactiveBrothers = (dashboardSummary?.totalBrothers || 0) - (dashboardSummary?.employedBrothers || 0);
  const studentBrothers = 0; // Not provided in API, default to 0

  return (
    <div className="min-h-screen bg-[#f6f6f8] dark:bg-[#101622] font-[Manrope,sans-serif]">
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
            {toast.type === 'error' && <XCircle className="w-5 h-5" />}
            {toast.type === 'warning' && <AlertTriangle className="w-5 h-5" />}
            {toast.type === 'info' && <Activity className="w-5 h-5" />}
            <p className="text-sm font-medium">{toast.message}</p>
            <button onClick={() => removeToast(toast.id)} className="ml-4">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {confirmationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 rounded-full ${
                confirmationModal.type === 'deactivate' 
                  ? 'bg-amber-100 dark:bg-amber-900/30' 
                  : 'bg-emerald-100 dark:bg-emerald-900/30'
              }`}>
                {confirmationModal.type === 'deactivate' ? (
                  <Ban className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                ) : (
                  <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                )}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {confirmationModal.type === 'deactivate' ? 'Deactivate Brother' : 'Activate Brother'}
              </h3>
            </div>

            <div className="mb-6">
              <p className="text-slate-600 dark:text-slate-400 mb-2">
                You are about to {confirmationModal.type} {' '}
                <span className="font-bold text-slate-900 dark:text-white">
                  {confirmationModal.brotherName}
                </span>
                .
              </p>
              <p className="text-sm text-red-500 dark:text-red-400 flex items-center gap-1 mt-3">
                <AlertTriangle className="w-4 h-4" />
                This action will affect their access to the brotherhood system.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleConfirmToggleActive}
                disabled={processingId === confirmationModal.brotherId}
                className={`flex-1 py-3 rounded-lg text-white font-semibold transition-colors ${
                  confirmationModal.type === 'deactivate' 
                    ? 'bg-amber-500 hover:bg-amber-600' 
                    : 'bg-emerald-500 hover:bg-emerald-600'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {processingId === confirmationModal.brotherId ? (
                  'Processing...'
                ) : (
                  `Yes, ${confirmationModal.type}`
                )}
              </button>
              <button
                onClick={() => setConfirmationModal(null)}
                disabled={processingId === confirmationModal.brotherId}
                className="flex-1 py-3 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Proof Viewer Modal */}
      {proofViewer && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
          <div className="relative w-full max-w-5xl">
            <button
              onClick={() => setProofViewer(null)}
              className="absolute -top-12 right-0 text-white/70 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="relative flex items-center justify-center">
              <div className="max-h-[80vh] overflow-auto bg-black/50 rounded-lg p-2">
                <img
                  src={proofViewer.proofs[proofViewer.currentIndex].fileUrl}
                  alt={`Proof ${proofViewer.currentIndex + 1}`}
                  className="max-w-full max-h-[75vh] w-auto h-auto object-contain rounded-lg"
                  style={{ minHeight: '200px', backgroundColor: '#f0f0f0' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
                  }}
                />
              </div>
              
              {proofViewer.proofs.length > 1 && (
                <>
                  <button
                    onClick={() => setProofViewer(prev => prev ? {
                      ...prev,
                      currentIndex: (prev.currentIndex - 1 + prev.proofs.length) % prev.proofs.length
                    } : null)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => setProofViewer(prev => prev ? {
                      ...prev,
                      currentIndex: (prev.currentIndex + 1) % prev.proofs.length
                    } : null)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>
            
            <div className="mt-4 flex justify-between items-center text-white">
              <div className="flex items-center gap-2">
                <p className="text-sm bg-black/50 px-3 py-1 rounded-full">
                  Proof {proofViewer.currentIndex + 1} of {proofViewer.proofs.length}
                </p>
                <p className="text-sm text-white/70">
                  {formatMonth(proofViewer.contributionMonth)}
                </p>
              </div>
              <a
                href={proofViewer.proofs[proofViewer.currentIndex].fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white/70 hover:text-white flex items-center gap-1 bg-black/50 px-3 py-1 rounded-full"
              >
                <ExternalLink className="w-4 h-4" />
                Open in new tab
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Brother Details Modal */}
      {showDetailsModal && selectedBrother && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-4xl w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6 sticky top-0 bg-white dark:bg-slate-800 pb-4 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Brother Details</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Basic Info */}
            <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Basic Information</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Name</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{selectedBrother.basicInfo.name}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Email</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{selectedBrother.basicInfo.email}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Status</p>
                  <div className="mt-1">
                    {selectedBrother.basicInfo.isActive ? (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                        <CheckCircle className="w-3 h-3" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                        <XCircle className="w-3 h-3" />
                        Inactive
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Joined</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {formatDate(selectedBrother.basicInfo.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Financial Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Wallet className="w-4 h-4 text-emerald-600" />
                    <p className="text-xs text-emerald-600 font-medium">Total Contribution</p>
                  </div>
                  <p className="text-xl font-bold text-emerald-700 dark:text-emerald-400">
                    ₹{selectedBrother.summary.totalContribution}
                  </p>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <p className="text-xs text-blue-600 font-medium">Monthly</p>
                  </div>
                  <p className="text-xl font-bold text-blue-700 dark:text-blue-400">
                    ₹{selectedBrother.basicInfo.monthlyContribution}
                  </p>
                </div>
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-4 h-4 text-amber-600" />
                    <p className="text-xs text-amber-600 font-medium">Waivers Left</p>
                  </div>
                  <p className="text-xl font-bold text-amber-700 dark:text-amber-400">
                    {selectedBrother.basicInfo.waiverRemaining}
                  </p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-purple-600" />
                    <p className="text-xs text-purple-600 font-medium">Total Loans</p>
                  </div>
                  <p className="text-xl font-bold text-purple-700 dark:text-purple-400">
                    ₹{selectedBrother.summary.totalLoans}
                  </p>
                </div>
              </div>
            </div>

            {/* All Contributions with Proofs */}
            {selectedBrother.contributions.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  All Contributions ({selectedBrother.contributions.length})
                </h3>
                <div className="space-y-4">
                  {selectedBrother.contributions.map((contribution) => (
                    <div key={contribution.id} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {formatMonth(contribution.month)}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {formatDateTime(contribution.createdAt)}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-[#135bec]">₹{contribution.totalPaid}</span>
                          {getStatusBadge(contribution.status)}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                        <div>
                          <span className="text-slate-500 dark:text-slate-400">Base:</span>
                          <span className="ml-1 text-slate-900 dark:text-white font-medium">₹{contribution.baseAmount}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 dark:text-slate-400">Penalty:</span>
                          <span className="ml-1 text-red-600 font-medium">₹{contribution.penaltyAmount}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 dark:text-slate-400">Waiver:</span>
                          <span className="ml-1 text-amber-600 font-medium">{contribution.waiverUsed ? 'Used' : 'Not used'}</span>
                        </div>
                      </div>

                      {/* Proofs */}
                      {contribution.proofs && contribution.proofs.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                            Proofs ({contribution.proofs.length})
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {contribution.proofs.map((proof, idx) => (
                              <button
                                key={proof.id}
                                onClick={() => setProofViewer({
                                  proofs: contribution.proofs || [],
                                  currentIndex: idx,
                                  contributionMonth: contribution.month
                                })}
                                className="relative group"
                              >
                                <img
                                  src={proof.fileUrl}
                                  alt={`Proof ${idx + 1}`}
                                  className="w-16 h-16 object-cover rounded-lg border-2 border-transparent group-hover:border-[#135bec] transition-colors"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64x64?text=Error';
                                  }}
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity flex items-center justify-center">
                                  <Eye className="w-5 h-5 text-white" />
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Contributions Message */}
            {selectedBrother.contributions.length === 0 && (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 dark:text-slate-400">No contributions yet</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/admin/dashboard"
              className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </Link>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">All Brothers</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/addBrother"
              className="flex items-center gap-2 px-4 py-2 bg-[#135bec] text-white rounded-lg text-sm font-semibold hover:bg-[#135bec]/90 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              Add Brother
            </Link>
            <button
              onClick={() => {
                fetchDashboardSummary();
                fetchBrothers();
              }}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="p-4 grid grid-cols-2 lg:grid-cols-5 gap-4">
        {loadingSummary ? (
          // Loading skeletons for stats
          <>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-100 dark:border-slate-700 animate-pulse">
                <div className="flex items-center justify-between mb-2">
                  <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  <div className="w-4 h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                </div>
                <div className="h-8 w-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
              </div>
            ))}
          </>
        ) : (
          <>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-100 dark:border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <p className="text-slate-500 dark:text-slate-400 text-xs">Total Corpus</p>
                <Wallet className="w-4 h-4 text-[#135bec]" />
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">₹{dashboardSummary?.totalCorpus || 0}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-100 dark:border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <p className="text-slate-500 dark:text-slate-400 text-xs">Approved Count</p>
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-2xl font-bold text-emerald-600">{dashboardSummary?.totalApprovedCount || 0}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-100 dark:border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <p className="text-slate-500 dark:text-slate-400 text-xs">Pending Amount</p>
                <AlertCircle className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-2xl font-bold text-amber-600">₹{dashboardSummary?.totalPendingAmount || 0}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-100 dark:border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <p className="text-slate-500 dark:text-slate-400 text-xs">Total Brothers</p>
                <Users className="w-4 h-4 text-[#135bec]" />
              </div>
              <p className="text-2xl font-bold text-[#135bec]">{dashboardSummary?.totalBrothers || 0}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-100 dark:border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <p className="text-slate-500 dark:text-slate-400 text-xs">Avg Contribution</p>
                <BarChart3 className="w-4 h-4 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-purple-600">
                ₹{dashboardSummary?.totalBrothers ? Math.round((dashboardSummary.totalCorpus || 0) / dashboardSummary.totalBrothers) : 0}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Employment Stats */}
      <div className="px-4 grid grid-cols-3 gap-4 mb-4">
        {loadingSummary ? (
          <>
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-100 dark:bg-slate-800/50 rounded-lg p-3 animate-pulse">
                <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                <div className="h-6 w-12 bg-slate-200 dark:bg-slate-700 rounded"></div>
              </div>
            ))}
          </>
        ) : (
          <>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3">
              <p className="text-xs text-emerald-600 dark:text-emerald-400">Employed</p>
              <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">{dashboardSummary?.employedBrothers || 0}</p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3">
              <p className="text-xs text-amber-600 dark:text-amber-400">Unemployed</p>
              <p className="text-lg font-bold text-amber-700 dark:text-amber-400">{dashboardSummary?.unemployedBrothers || 0}</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
              <p className="text-xs text-blue-600 dark:text-blue-400">Student</p>
              <p className="text-lg font-bold text-blue-700 dark:text-blue-400">0</p>
            </div>
          </>
        )}
      </div>

      {/* Filters */}
      <div className="p-4 bg-white dark:bg-slate-800 border-y border-slate-200 dark:border-slate-700">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#135bec]"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="w-5 h-5 text-slate-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#135bec]"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
            <select
              value={employmentFilter}
              onChange={(e) => setEmploymentFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#135bec]"
            >
              <option value="ALL">All Employment</option>
              <option value="EMPLOYED">Employed</option>
              <option value="UNEMPLOYED">Unemployed</option>
              <option value="STUDENT">Student</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#135bec]"
            >
              <option value="name">Sort by Name</option>
              <option value="monthlyContribution">Sort by Contribution</option>
              <option value="joinDate">Sort by Join Date</option>
              <option value="status">Sort by Status</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>

      {/* Brothers List */}
      <div className="p-4 mb-20">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-[#135bec] animate-spin mb-4" />
            <p className="text-slate-500 dark:text-slate-400">Loading brothers...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 rounded-xl p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-700 dark:text-red-400 font-medium mb-2">Error loading data</p>
            <p className="text-sm text-red-600 dark:text-red-500 mb-4">{error}</p>
            <button
              onClick={() => {
                fetchDashboardSummary();
                fetchBrothers();
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            {/* Results count */}
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Showing {filteredBrothers.length} of {brothers.length} brothers
            </p>

            {/* Grid of brothers */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredBrothers.length === 0 ? (
                <div className="col-span-full bg-white dark:bg-slate-800 rounded-xl p-12 text-center border border-slate-100 dark:border-slate-700">
                  <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 dark:text-slate-400 text-lg mb-2">No brothers found</p>
                  <p className="text-sm text-slate-400 dark:text-slate-500 mb-6">
                    Try adjusting your filters or add a new brother
                  </p>
                  <Link
                    href="/admin/addBrother"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#135bec] text-white rounded-lg text-sm font-semibold hover:bg-[#135bec]/90"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Add New Brother
                  </Link>
                </div>
              ) : (
                filteredBrothers.map((brother) => (
                  <div
                    key={brother.id}
                    className="group bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 hover:shadow-lg transition-all duration-200 overflow-hidden"
                  >
                    {/* Status Bar */}
                    <div className={`h-1 ${brother.isActive ? 'bg-emerald-500' : 'bg-amber-500'}`} />

                    <div className="p-5">
                      {/* Header with avatar and actions */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                              brother.isActive ? 'bg-[#135bec]' : 'bg-slate-400'
                            }`}>
                              {brother.name.charAt(0).toUpperCase()}
                            </div>
                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-800 ${
                              brother.isActive ? 'bg-emerald-500' : 'bg-amber-500'
                            }`} />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                              {brother.name}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Member since {formatDate(brother.joinDate)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleViewDetails(brother.id)}
                            disabled={loadingDetails === brother.id}
                            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                            title="View details"
                          >
                            {loadingDetails === brother.id ? (
                              <Loader2 className="w-4 h-4 text-[#135bec] animate-spin" />
                            ) : (
                              <Eye className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                            )}
                          </button>
                          <button
                            onClick={() => handleToggleActiveClick(brother)}
                            disabled={processingId === brother.id}
                            className={`p-2 rounded-lg transition-colors ${
                              brother.isActive 
                                ? 'hover:bg-amber-100 dark:hover:bg-amber-900/30 text-amber-600' 
                                : 'hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-emerald-600'
                            } disabled:opacity-50`}
                            title={brother.isActive ? 'Deactivate brother' : 'Activate brother'}
                          >
                            {processingId === brother.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : brother.isActive ? (
                              <Ban className="w-4 h-4" />
                            ) : (
                              <CheckCircle className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-600 dark:text-slate-400 truncate">{brother.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-600 dark:text-slate-400">{brother.mobile}</span>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEmploymentStatusColor(brother.employmentStatus)}`}>
                          {brother.employmentStatus}
                        </span>
                        <span className="px-2 py-1 bg-[#135bec]/10 text-[#135bec] rounded-full text-xs font-medium">
                          ₹{brother.monthlyContribution}/mo
                        </span>
                        <span className="px-2 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 rounded-full text-xs font-medium">
                          {brother.waiverRemaining} waiver{brother.waiverRemaining !== 1 ? 's' : ''}
                        </span>
                      </div>

                      {/* Footer Stats */}
                      <div className="pt-4 border-t border-slate-100 dark:border-slate-700 grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Total Paid</p>
                          <p className="text-sm font-bold text-[#135bec]">
                            ₹{brotherTotals[brother.id]?.toLocaleString('en-IN') || '0'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Loans</p>
                          <p className="text-sm font-bold text-purple-600">₹0</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}