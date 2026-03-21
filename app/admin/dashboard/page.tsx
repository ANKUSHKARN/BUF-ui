"use client";

import { 
  Users,
  TrendingUp,
  Wallet,
  User,
  Bell,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Image as ImageIcon,
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Eye,
  CreditCard,
  Upload,
  Loader2,
  AlertCircle,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Types
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

interface MyContribution {
  totalContribution: number;
  approvedContribution: number;
  pendingContribution: number;
}

interface MonthData {
  month: string;
  baseAmount: number;
  penaltyAmount: number;
  totalPaid: number;
}

interface ContributionPreview {
  months: MonthData[];
  totalBase: number;
  totalPenalty: number;
  totalPayable: number;
  waiverWillBeUsed: number;
}

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

type ConfirmationModalType = 'approve' | 'reject' | 'delete' | null;

export default function AdminDashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [brothers, setBrothers] = useState<Brother[]>([]);
  const [allContributions, setAllContributions] = useState<Contribution[]>([]);
  const [pendingContributions, setPendingContributions] = useState<Contribution[]>([]);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [myContribution, setMyContribution] = useState<MyContribution | null>(null);
  const [preview, setPreview] = useState<ContributionPreview | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Toast notifications
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  // Contribution modal state
  const [showContributeModal, setShowContributeModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Confirmation modal
  const [confirmationModal, setConfirmationModal] = useState<{
    type: ConfirmationModalType;
    contributionId: string;
    contributionName: string;
    contributionAmount: number;
  } | null>(null);

  // Proof viewer modal
  const [proofViewer, setProofViewer] = useState<{
    contribution: Contribution;
    currentIndex: number;
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
    setMounted(true);
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      // Fetch all data in parallel
      const [brothersRes, contributionsRes, summaryRes, myContributionRes, previewRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/admin/brothers`, {
          headers: getAuthHeaders(),
        }),
        fetch(`${API_BASE_URL}/api/admin/brotherscontribution`, {
          headers: getAuthHeaders(),
        }),
        fetch(`${API_BASE_URL}/api/brother/dashboard/summary`, {
          headers: getAuthHeaders(),
        }),
        fetch(`${API_BASE_URL}/api/brother/mycontribution/total`, {
          headers: getAuthHeaders(),
        }),
        fetch(`${API_BASE_URL}/api/brother/mycontribution/preview`, {
          headers: getAuthHeaders(),
        })
      ]);

      // Check if any response is unauthorized
      if (brothersRes.status === 401 || contributionsRes.status === 401 || summaryRes.status === 401 || 
          myContributionRes.status === 401 || previewRes.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
        return;
      }

      if (!brothersRes.ok) throw new Error('Failed to fetch brothers');
      if (!contributionsRes.ok) throw new Error('Failed to fetch contributions');
      if (!summaryRes.ok) throw new Error('Failed to fetch summary');
      if (!myContributionRes.ok) throw new Error('Failed to fetch my contribution');
      if (!previewRes.ok) throw new Error('Failed to fetch preview');

      const brothersData = await brothersRes.json();
      const contributionsData = await contributionsRes.json();
      const summaryData = await summaryRes.json();
      const myContributionData = await myContributionRes.json();
      const previewData = await previewRes.json();

      setBrothers(brothersData);
      setAllContributions(contributionsData);
      
      // Filter pending contributions
      const pending = contributionsData.filter((c: Contribution) => c.status === 'PENDING');
      setPendingContributions(pending);
      setSummary(summaryData);
      setMyContribution(myContributionData);
      setPreview(previewData);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
      addToast('error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveClick = (contribution: Contribution) => {
    setConfirmationModal({
      type: 'approve',
      contributionId: contribution.id,
      contributionName: contribution.user.name,
      contributionAmount: contribution.totalPaid
    });
  };

  const handleRejectClick = (contribution: Contribution) => {
    setConfirmationModal({
      type: 'reject',
      contributionId: contribution.id,
      contributionName: contribution.user.name,
      contributionAmount: contribution.totalPaid
    });
  };

  const handleDeleteClick = (contribution: Contribution) => {
    setConfirmationModal({
      type: 'delete',
      contributionId: contribution.id,
      contributionName: contribution.user.name,
      contributionAmount: contribution.totalPaid
    });
  };

  const handleConfirmAction = async () => {
    if (!confirmationModal) return;

    const { type, contributionId } = confirmationModal;
    setProcessingId(contributionId);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      let response;
      let actionName = '';

      if (type === 'approve') {
        actionName = 'approved';
        response = await fetch(`${API_BASE_URL}/api/admin/brotherscontribution/${contributionId}/approve`, {
          method: 'PATCH',
          headers: getAuthHeaders(),
        });
      } else if (type === 'reject') {
        actionName = 'rejected';
        response = await fetch(`${API_BASE_URL}/api/admin/brotherscontribution/${contributionId}/reject`, {
          method: 'PATCH',
          headers: getAuthHeaders(),
        });
      } else if (type === 'delete') {
        actionName = 'deleted';
        response = await fetch(`${API_BASE_URL}/api/admin/brotherscontribution/${contributionId}`, {
          method: 'DELETE',
          headers: getAuthHeaders(),
        });
      }

      if (!response) return;

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || `Failed to ${type} contribution`);
      }

      // Update local state
      if (type === 'approve') {
        setAllContributions(prev => 
          prev.map(c => c.id === contributionId ? { ...c, status: 'APPROVED' } : c)
        );
        setPendingContributions(prev => prev.filter(c => c.id !== contributionId));
        addToast('success', `Contribution from ${confirmationModal.contributionName} has been approved`);
      } else if (type === 'reject') {
        setAllContributions(prev => 
          prev.map(c => c.id === contributionId ? { ...c, status: 'REJECTED' } : c)
        );
        setPendingContributions(prev => prev.filter(c => c.id !== contributionId));
        addToast('warning', `Contribution from ${confirmationModal.contributionName} has been rejected`);
      } else if (type === 'delete') {
        setAllContributions(prev => prev.filter(c => c.id !== contributionId));
        setPendingContributions(prev => prev.filter(c => c.id !== contributionId));
        addToast('info', `Contribution from ${confirmationModal.contributionName} has been deleted`);
      }

      // Refresh summary data to update totals
      const summaryRes = await fetch(`${API_BASE_URL}/api/brother/dashboard/summary`, {
        headers: getAuthHeaders(),
      });
      const summaryData = await summaryRes.json();
      setSummary(summaryData);

      // Refresh my contribution data
      const myContributionRes = await fetch(`${API_BASE_URL}/api/brother/mycontribution/total`, {
        headers: getAuthHeaders(),
      });
      const myContributionData = await myContributionRes.json();
      setMyContribution(myContributionData);

    } catch (error: any) {
      console.error(`Error ${type}ing contribution:`, error);
      setError(error.message);
      addToast('error', error.message);
    } finally {
      setProcessingId(null);
      setConfirmationModal(null);
    }
  };

  const handleContributeClick = () => {
    setShowContributeModal(true);
    setSelectedFiles([]);
    setPreviewUrls([]);
    setSubmitError(null);
    setSubmitSuccess(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validate file count (max 5)
    if (files.length > 5) {
      setSubmitError('Maximum 5 files allowed');
      return;
    }

    // Validate file types (images only)
    const invalidFiles = files.filter(file => !file.type.startsWith('image/'));
    if (invalidFiles.length > 0) {
      setSubmitError('Only image files are allowed');
      return;
    }

    // Validate file size (max 5MB each)
    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setSubmitError('Each file must be less than 5MB');
      return;
    }

    setSelectedFiles(files);

    // Create preview URLs
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => {
      // Clean up previous URLs
      prev.forEach(url => URL.revokeObjectURL(url));
      return urls;
    });
    setSubmitError(null);
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = [...selectedFiles];
    const newUrls = [...previewUrls];
    
    // Revoke the URL to prevent memory leaks
    URL.revokeObjectURL(newUrls[index]);
    
    newFiles.splice(index, 1);
    newUrls.splice(index, 1);
    
    setSelectedFiles(newFiles);
    setPreviewUrls(newUrls);
  };

  const handleSubmitContribution = async () => {
    if (selectedFiles.length === 0) {
      setSubmitError('Please select at least one proof image');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      // Create form data
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('proofs', file);
      });

      const response = await fetch(`${API_BASE_URL}/api/brother/mycontribution`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit contribution');
      }

      setSubmitSuccess(true);
      
      // Refresh all dashboard data after successful submission
      await fetchDashboardData();

      // Close modal after 2 seconds
      setTimeout(() => {
        setShowContributeModal(false);
        setSelectedFiles([]);
        setPreviewUrls([]);
        setSubmitSuccess(false);
      }, 2000);

      addToast('success', 'Contribution submitted successfully!');

    } catch (err: any) {
      setSubmitError(err.message);
      addToast('error', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  // Check if there's any pending contribution
  const hasPendingContribution = (myContribution?.pendingContribution || 0) > 0;

  // Don't render until mounted to avoid hydration issues
  if (!mounted) return null;

  // Calculate inactive brothers count
  const inactiveBrothersCount = brothers.filter(b => !b.isActive).length;

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
            {toast.type === 'info' && <Bell className="w-5 h-5" />}
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
                confirmationModal.type === 'approve' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                confirmationModal.type === 'reject' ? 'bg-amber-100 dark:bg-amber-900/30' :
                'bg-red-100 dark:bg-red-900/30'
              }`}>
                {confirmationModal.type === 'approve' && <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />}
                {confirmationModal.type === 'reject' && <XCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />}
                {confirmationModal.type === 'delete' && <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {confirmationModal.type === 'approve' ? 'Approve Contribution' :
                 confirmationModal.type === 'reject' ? 'Reject Contribution' :
                 'Delete Contribution'}
              </h3>
            </div>

            <div className="mb-6">
              <p className="text-slate-600 dark:text-slate-400 mb-2">
                You are about to {confirmationModal.type} a contribution of{' '}
                <span className="font-bold text-slate-900 dark:text-white">
                  ₹{confirmationModal.contributionAmount}
                </span>{' '}
                from{' '}
                <span className="font-bold text-slate-900 dark:text-white">
                  {confirmationModal.contributionName}
                </span>
                .
              </p>
              <p className="text-sm text-red-500 dark:text-red-400 flex items-center gap-1 mt-3">
                <AlertTriangle className="w-4 h-4" />
                This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleConfirmAction}
                disabled={processingId === confirmationModal.contributionId}
                className={`flex-1 py-3 rounded-lg text-white font-semibold transition-colors ${
                  confirmationModal.type === 'approve' ? 'bg-emerald-500 hover:bg-emerald-600' :
                  confirmationModal.type === 'reject' ? 'bg-amber-500 hover:bg-amber-600' :
                  'bg-red-500 hover:bg-red-600'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {processingId === confirmationModal.contributionId ? 'Processing...' : 
                 confirmationModal.type === 'approve' ? 'Yes, Approve' :
                 confirmationModal.type === 'reject' ? 'Yes, Reject' :
                 'Yes, Delete'}
              </button>
              <button
                onClick={() => setConfirmationModal(null)}
                disabled={processingId === confirmationModal.contributionId}
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
              {/* Image container with max height for better viewing */}
              <div className="max-h-[80vh] overflow-auto bg-black/50 rounded-lg p-2">
                <img
                  src={proofViewer.contribution.proofs[proofViewer.currentIndex].fileUrl}
                  alt={`Proof ${proofViewer.currentIndex + 1}`}
                  className="max-w-full max-h-[75vh] w-auto h-auto object-contain rounded-lg"
                  style={{ 
                    minHeight: '200px',
                    backgroundColor: '#f0f0f0'
                  }}
                  onError={(e) => {
                    // Fallback for broken images
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
                  }}
                />
              </div>
              
              {proofViewer.contribution.proofs.length > 1 && (
                <>
                  <button
                    onClick={() => setProofViewer(prev => prev ? {
                      ...prev,
                      currentIndex: (prev.currentIndex - 1 + prev.contribution.proofs.length) % prev.contribution.proofs.length
                    } : null)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => setProofViewer(prev => prev ? {
                      ...prev,
                      currentIndex: (prev.currentIndex + 1) % prev.contribution.proofs.length
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
                  Proof {proofViewer.currentIndex + 1} of {proofViewer.contribution.proofs.length}
                </p>
                {proofViewer.contribution.proofs.length > 1 && (
                  <div className="flex gap-1">
                    {proofViewer.contribution.proofs.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setProofViewer(prev => prev ? {...prev, currentIndex: idx} : null)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          idx === proofViewer.currentIndex ? 'bg-white' : 'bg-white/30 hover:bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
              <a
                href={proofViewer.contribution.proofs[proofViewer.currentIndex].fileUrl}
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

      {/* Header */}
      <div className="lg:hidden flex items-center bg-[#f6f6f8] dark:bg-[#101622] p-4 pb-2 justify-between sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight flex-1 text-center">
          Admin Overview
        </h2>
        <div className="flex items-center justify-end">
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 lg:p-6">
        <h1 className="hidden lg:block text-2xl font-extrabold text-slate-900 dark:text-white mb-6">
          Admin Overview
        </h1>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 rounded-xl text-red-700 dark:text-red-400">
            <p className="font-semibold">Error:</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#135bec]"></div>
          </div>
        ) : (
          <>
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
                  {summary?.totalBrothers || brothers.length}
                </p>
                <div className="flex items-center gap-1">
                  <TrendingUp className="text-green-600 w-4 h-4" />
                  <p className="text-green-600 text-xs font-semibold leading-normal">
                    {summary?.employedBrothers || 0} Employed, {summary?.unemployedBrothers || 0} Unemployed
                  </p>
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
                  ₹{summary?.totalCorpus?.toLocaleString('en-IN') || '0'}.00
                </p>
                <div className="flex items-center gap-1">
                  <TrendingUp className="text-green-600 w-4 h-4" />
                  <p className="text-green-600 text-xs font-semibold leading-normal">
                    {summary?.totalApprovedCount || 0} approved contributions
                  </p>
                </div>
              </div>

              {/* My Contribution Card */}
              <div className="flex min-w-[200px] flex-1 flex-col gap-2 rounded-xl p-5 bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-normal">
                    My Contribution
                  </p>
                  <CreditCard className="text-[#135bec] w-5 h-5" />
                </div>
                <p className="text-slate-900 dark:text-slate-100 tracking-tight text-2xl font-bold leading-tight">
                  ₹{myContribution?.approvedContribution?.toLocaleString('en-IN') || '0'}.00
                </p>
                {myContribution?.pendingContribution && myContribution.pendingContribution > 0 && (
                  <div className="flex items-center gap-1">
                    <AlertCircle className="text-amber-500 w-4 h-4" />
                    <p className="text-amber-500 text-xs font-semibold leading-normal">
                      ₹{myContribution.pendingContribution} pending approval
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Pay Section - Admin Contribution */}
            {preview && preview.months.length > 0 && (
              <div className="mb-6">
                <h3 className="text-slate-900 dark:text-white text-lg font-bold mb-3 flex items-center gap-2">
                  <Zap className="text-[#135bec] w-5 h-5" />
                  Quick Contribute
                </h3>
                <div className="bg-slate-900 dark:bg-[#135bec]/10 border border-slate-800 dark:border-[#135bec]/20 rounded-xl overflow-hidden shadow-xl">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <p className="text-slate-400 dark:text-[#135bec]/70 text-sm font-medium uppercase tracking-widest">
                          {preview.months.length > 1 ? `Pay till ${formatMonth(preview.months[preview.months.length - 1].month)}` : `Pay for ${formatMonth(preview.months[0].month)}`}
                        </p>
                        <h4 className="text-white dark:text-white text-2xl font-bold mt-1">Monthly Due</h4>
                      </div>
                      <div className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs font-bold border border-red-500/30">
                        {preview.waiverWillBeUsed > 0 ? `${preview.waiverWillBeUsed} Waiver Available` : 'Due Now'}
                      </div>
                    </div>

                    <div className="space-y-3 mb-8">
                      {preview.months.map((month, index) => (
                        <div key={month.month} className="space-y-2">
                          {index > 0 && <div className="border-t border-slate-800 dark:border-[#135bec]/20 my-2"></div>}
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-400 dark:text-slate-300">
                              {formatMonth(month.month)} Base
                            </span>
                            <span className="text-white font-semibold">₹{month.baseAmount}.00</span>
                          </div>
                          {month.penaltyAmount > 0 && (
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-slate-400 dark:text-slate-300">Late Penalty</span>
                              <span className="text-red-400 font-semibold">+₹{month.penaltyAmount}.00</span>
                            </div>
                          )}
                        </div>
                      ))}
                      
                      <div className="pt-3 border-t border-slate-800 dark:border-[#135bec]/20 flex justify-between items-center">
                        <span className="text-white font-bold">Total Preview</span>
                        <span className="text-white text-2xl font-black">
                          ₹{preview.totalPayable?.toLocaleString('en-IN') || '0'}.00
                        </span>
                      </div>
                    </div>

                    {/* Pending Contribution Warning */}
                    {hasPendingContribution ? (
                      <div className="space-y-3">
                        <div className="bg-amber-500/20 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-amber-400 font-semibold text-sm mb-1">
                              Pending Contribution Detected
                            </p>
                            <p className="text-amber-400/80 text-xs">
                              You have a pending contribution of ₹{myContribution?.pendingContribution?.toLocaleString('en-IN')}.00 that needs approval before you can make a new contribution.
                            </p>
                          </div>
                        </div>
                        <button 
                          disabled
                          className="w-full bg-slate-600 cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 opacity-50"
                        >
                          <CreditCard className="w-5 h-5" />
                          Contribution Disabled
                        </button>
                        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
                          Please wait for approval or contact Head Brother
                        </p>
                      </div>
                    ) : (
                      <button 
                        onClick={handleContributeClick}
                        className="w-full bg-[#135bec] hover:bg-[#135bec]/90 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
                      >
                        <CreditCard className="w-5 h-5" />
                        Contribute Now
                      </button>
                    )}
                  </div>
                  <div className="bg-slate-800/50 dark:bg-[#135bec]/5 px-6 py-3 flex items-center justify-center gap-2">
                    <ShieldCheck className="text-slate-500 w-4 h-4" />
                    <p className="text-slate-500 dark:text-slate-400 text-xs">
                      Secure encrypted payment via Brotherhood Fund
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Pending Approvals Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-slate-900 dark:text-slate-100 text-xl font-bold leading-tight tracking-tight">
                  Pending Contributions ({pendingContributions.length})
                </h2>
                <Link 
                  href="/admin/allContributions"
                  className="text-[#135bec] text-sm font-semibold hover:text-[#135bec]/80 transition-colors flex items-center gap-1"
                >
                  <Eye className="w-4 h-4" />
                  View All
                </Link>
              </div>

              {pendingContributions.length === 0 ? (
                <div className="bg-white dark:bg-slate-800 rounded-xl p-8 text-center border border-slate-100 dark:border-slate-700">
                  <p className="text-slate-500 dark:text-slate-400">No pending contributions</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {pendingContributions.map((contribution) => (
                    <RequestItem
                      key={contribution.id}
                      contribution={contribution}
                      onApprove={() => handleApproveClick(contribution)}
                      onReject={() => handleRejectClick(contribution)}
                      onDelete={() => handleDeleteClick(contribution)}
                      onViewProofs={() => setProofViewer({ contribution, currentIndex: 0 })}
                      isProcessing={processingId === contribution.id}
                      formatMonth={formatMonth}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="mt-6 mb-20">
              <div className="bg-[#135bec] rounded-xl p-6 text-white overflow-hidden relative">
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-2">Unity &amp; Growth</h3>
                  <p className="text-white/80 text-sm mb-4">
                    You have {inactiveBrothersCount} brotherhood member{inactiveBrothersCount !== 1 ? 's' : ''} currently inactive. Reach out to maintain collective harmony.
                  </p>
                  <button onClick={() => router.push('/admin/allBrother')} className="bg-white text-[#135bec] px-4 py-2 rounded-lg text-sm font-bold hover:bg-white/90 transition-colors">
                    Manage Brothers
                  </button>
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-10">
                  <Users className="w-[120px] h-[120px]" />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Contribution Modal */}
      {showContributeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-slate-900 p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Submit Contribution</h2>
              <button
                onClick={() => setShowContributeModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {/* Preview Summary */}
              {preview && preview.months.length > 0 && (
                <div className="mb-6 p-4 bg-slate-100 dark:bg-slate-800 rounded-xl">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Payment Summary</h3>
                  {preview.months.map((month) => (
                    <div key={month.month} className="flex justify-between text-sm mb-2">
                      <span className="text-slate-600 dark:text-slate-400">{formatMonth(month.month)}</span>
                      <span className="text-slate-900 dark:text-white font-medium">₹{month.totalPaid}.00</span>
                    </div>
                  ))}
                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between font-bold">
                    <span className="text-slate-900 dark:text-white">Total Payable</span>
                    <span className="text-[#135bec]">₹{preview.totalPayable}.00</span>
                  </div>
                  {preview.waiverWillBeUsed > 0 && (
                    <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">
                      ✨ {preview.waiverWillBeUsed} waiver{preview.waiverWillBeUsed > 1 ? 's' : ''} will be applied
                    </div>
                  )}
                </div>
              )}

              {/* File Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Upload Payment Proof {selectedFiles.length > 0 && `(${selectedFiles.length}/5)`}
                </label>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  multiple
                  accept="image/*"
                  className="hidden"
                />

                {selectedFiles.length === 0 ? (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-32 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-[#135bec] transition-colors"
                  >
                    <Upload className="w-6 h-6 text-slate-400" />
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      Click to upload proof images
                    </span>
                    <span className="text-xs text-slate-400">
                      Max 5 images, 5MB each
                    </span>
                  </button>
                ) : (
                  <div className="space-y-3">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
                        <img 
                          src={url} 
                          alt={`Proof ${index + 1}`}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-900 dark:text-white truncate">
                            {selectedFiles[index].name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {(selectedFiles[index].size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveFile(index)}
                          className="text-slate-400 hover:text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    
                    {selectedFiles.length < 5 && (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-2 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:border-[#135bec] transition-colors"
                      >
                        + Add More Images
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Error Message */}
              {submitError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                  {submitError}
                </div>
              )}

              {/* Success Message */}
              {submitSuccess && (
                <div className="mb-4 p-3 bg-emerald-100 border border-emerald-400 text-emerald-700 rounded-lg text-sm flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Contribution submitted successfully! Redirecting...
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleSubmitContribution}
                disabled={isSubmitting || selectedFiles.length === 0 || submitSuccess}
                className="w-full bg-[#135bec] text-white font-bold py-4 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Submit Contribution
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper Component for Request Items
function RequestItem({ 
  contribution,
  onApprove,
  onReject,
  onDelete,
  onViewProofs,
  isProcessing,
  formatMonth
}: { 
  contribution: Contribution;
  onApprove: () => void;
  onReject: () => void;
  onDelete: () => void;
  onViewProofs: () => void;
  isProcessing: boolean;
  formatMonth: (month: string) => string;
}) {
  return (
    <div className="flex flex-col gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
      <div className="flex items-start gap-4">
        <div className="bg-[#135bec]/10 rounded-full h-12 w-12 flex items-center justify-center text-[#135bec] shrink-0">
          <User className="w-6 h-6" />
        </div>
        <div className="flex flex-1 flex-col">
          <div className="flex items-center justify-between">
            <p className="text-slate-900 dark:text-slate-100 text-base font-bold leading-normal">
              {contribution.user.name}
            </p>
            <span className="text-[#135bec] font-bold">₹{contribution.totalPaid}</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-normal">
            {new Date(contribution.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit'
            })} • {formatMonth(contribution.month)}
          </p>
          
          {/* Status Badge */}
          <div className="mt-1">
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
              contribution.status === 'PENDING' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
              contribution.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' :
              'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              {contribution.status}
            </span>
          </div>
          
          {/* Proofs Preview */}
          {contribution.proofs.length > 0 && (
            <div className="mt-3">
              <button
                onClick={onViewProofs}
                className="inline-flex items-center gap-1 text-xs text-[#135bec] hover:text-[#135bec]/80"
              >
                <ImageIcon className="w-4 h-4" />
                View {contribution.proofs.length} proof{contribution.proofs.length !== 1 ? 's' : ''}
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex gap-2">
        <button 
          onClick={onApprove}
          disabled={isProcessing}
          className="flex-1 flex items-center justify-center rounded-lg h-10 bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? 'Processing...' : 'Approve'}
        </button>
        <button 
          onClick={onReject}
          disabled={isProcessing}
          className="flex-1 flex items-center justify-center rounded-lg h-10 bg-amber-500 text-white text-sm font-bold hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? 'Processing...' : 'Reject'}
        </button>
        <button 
          onClick={onDelete}
          disabled={isProcessing}
          className="flex items-center justify-center rounded-lg h-10 w-10 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Delete contribution"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}