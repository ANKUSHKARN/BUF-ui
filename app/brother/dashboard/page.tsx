"use client";

import { 
  Bell,
  Users,
  TrendingUp,
  Wallet,
  Heart,
  Hourglass,
  Zap,
  CreditCard,
  ShieldCheck,
  X,
  Upload,
  Image as ImageIcon,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

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

interface ContributionProof {
  fileUrl: string;
  filePublicId: string;
}

export default function BrotherDashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for API data
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [myContribution, setMyContribution] = useState<MyContribution | null>(null);
  const [preview, setPreview] = useState<ContributionPreview | null>(null);

  // Contribution modal state
  const [showContributeModal, setShowContributeModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get user initials for avatar
  const [userInitials, setUserInitials] = useState('JD');

  useEffect(() => {
    setMounted(true);
    
    // Get user data from localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.name) {
          const nameParts = user.name.split(' ');
          const initials = nameParts.map((part: string) => part[0]).join('').toUpperCase().slice(0, 2);
          setUserInitials(initials);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    // Fetch all dashboard data
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      
      // Fetch all APIs in parallel
      const [summaryRes, contributionRes, previewRes] = await Promise.all([
        fetch(`${baseUrl}/api/brother/dashboard/summary`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }),
        fetch(`${baseUrl}/api/brother/mycontribution/total`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }),
        fetch(`${baseUrl}/api/brother/mycontribution/preview`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      ]);

      // Check if any response is unauthorized
      if (summaryRes.status === 401 || contributionRes.status === 401 || previewRes.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
        return;
      }

      // Parse responses
      const [summaryData, contributionData, previewData] = await Promise.all([
        summaryRes.json(),
        contributionRes.json(),
        previewRes.json()
      ]);

      if (!summaryRes.ok) throw new Error(summaryData.message || 'Failed to fetch summary');
      if (!contributionRes.ok) throw new Error(contributionData.message || 'Failed to fetch contribution');
      if (!previewRes.ok) throw new Error(previewData.message || 'Failed to fetch preview');

      setSummary(summaryData);
      setMyContribution(contributionData);
      setPreview(previewData);

    } catch (err: any) {
      setError(err.message);
      console.error('Dashboard data fetch error:', err);
    } finally {
      setIsLoading(false);
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

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      
      // Create form data
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('proofs', file);
      });

      const response = await fetch(`${baseUrl}/api/brother/mycontribution`, {
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
      
      // Refresh dashboard data after successful submission
      await fetchDashboardData();

      // Close modal after 2 seconds
      setTimeout(() => {
        setShowContributeModal(false);
        setSelectedFiles([]);
        setPreviewUrls([]);
        setSubmitSuccess(false);
      }, 2000);

    } catch (err: any) {
      setSubmitError(err.message);
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

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-[#f6f6f8] dark:bg-[#101622] font-[Manrope,sans-serif] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#135bec] animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f6f6f8] dark:bg-[#101622] font-[Manrope,sans-serif] flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-md text-center">
          <div className="text-red-500 mb-4">⚠️</div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Failed to load dashboard</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{error}</p>
          <button 
            onClick={() => fetchDashboardData()}
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
      {/* Mobile Header - Only visible on mobile */}
      <header className="lg:hidden flex items-center bg-[#f6f6f8] dark:bg-[#101622] p-4 pb-2 justify-between sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="bg-[#135bec]/10 p-1.5 rounded-lg">
            <Users className="text-[#135bec] w-5 h-5" />
          </div>
          <h1 className="text-slate-900 dark:text-white text-base font-bold leading-tight tracking-tight">
            Brotherhood
          </h1>
        </div>
        <div className="flex items-center gap-1">
          {/* <button className="flex size-9 cursor-pointer items-center justify-center rounded-lg bg-transparent text-slate-900 dark:text-slate-100 relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full"></span>
          </button> */}
          <div className="size-8 rounded-full bg-[#135bec] flex items-center justify-center text-white font-bold text-sm border-2 border-white dark:border-slate-800 shadow-sm">
            {userInitials}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-4 lg:p-6">
        {/* Desktop Title */}
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
          Welcome back, Brother
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
          Unity is our strength. <br/>Here is your status today.
        </p>

        {/* Overview Cards */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="relative overflow-hidden bg-[#135bec] rounded-xl p-6 shadow-lg shadow-[#135bec]/20">
            <div className="relative z-10">
              <p className="text-white/80 text-sm font-medium mb-1">Total Brotherhood Fund</p>
              <h3 className="text-white text-3xl font-bold leading-tight">
                ₹{summary?.totalCorpus?.toLocaleString('en-IN') || '0'}.00
              </h3>
              <div className="mt-4 flex items-center gap-2 text-xs text-white/70">
                <Users className="w-4 h-4" />
                <span>{summary?.totalBrothers || 0} Active Brothers</span>
              </div>
            </div>
            <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
              <Wallet className="w-[120px] h-[120px]" />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm">
              <div className="size-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-3">
                <Heart className="text-emerald-600 dark:text-emerald-400 w-5 h-5" />
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
                My Total
              </p>
              <p className="text-slate-900 dark:text-white text-xl font-bold mt-1">
                ₹{myContribution?.approvedContribution?.toLocaleString('en-IN') || '0'}.00
              </p>
            </div>

            <div className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm">
              <div className="size-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-3">
                <Hourglass className="text-amber-600 dark:text-amber-400 w-5 h-5" />
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
                Pending
              </p>
              <p className="text-slate-900 dark:text-white text-xl font-bold mt-1">
                ₹{myContribution?.pendingContribution?.toLocaleString('en-IN') || '0'}.00
              </p>
            </div>
          </div>
        </div>

        {/* Quick Pay Section */}
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
                          You have a pending contribution of ₹{myContribution?.pendingContribution?.toLocaleString('en-IN')}.00 that needs approval from the Head Brother before you can make a new contribution.
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

        {/* Recent Activity - Using summary data */}
        <div className="mt-6 mb-15">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-slate-900 dark:text-white text-lg font-bold">Brotherhood Overview</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
                Total Brothers
              </p>
              <p className="text-slate-900 dark:text-white text-2xl font-bold">
                {summary?.totalBrothers || 0}
              </p>
              <div className="mt-2 flex gap-2 text-xs">
                <span className="text-emerald-600 dark:text-emerald-400">👔 {summary?.employedBrothers || 0} Employed</span>
                <span className="text-amber-600 dark:text-amber-400">📊 {summary?.unemployedBrothers || 0} Unemployed</span>
              </div>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
                Contributions
              </p>
              <p className="text-slate-900 dark:text-white text-2xl font-bold">
                {summary?.totalApprovedCount || 0}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                ₹{(summary?.totalPendingAmount || 0).toLocaleString('en-IN')} pending approval
              </p>
            </div>
          </div>
        </div>
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