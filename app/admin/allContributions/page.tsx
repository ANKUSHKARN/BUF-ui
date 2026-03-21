"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft,
  User,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  X,
  Trash2,
  Filter
} from 'lucide-react';

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

export default function AllContributionsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [filteredContributions, setFilteredContributions] = useState<Contribution[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  
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

  useEffect(() => {
    fetchContributions();
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = [...contributions];
    
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(c => c.status === statusFilter);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(c => 
        c.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.month.includes(searchTerm)
      );
    }
    
    setFilteredContributions(filtered);
  }, [contributions, statusFilter, searchTerm]);

  const fetchContributions = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/admin/brotherscontribution`, {
        headers: getAuthHeaders(),
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch contributions');
      }

      const data = await response.json();
      setContributions(data);
      setFilteredContributions(data);
    } catch (error) {
      console.error('Error fetching contributions:', error);
      setError('Failed to load contributions');
    } finally {
      setLoading(false);
    }
  };

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-2 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 rounded-full text-xs font-medium">Pending</span>;
      case 'APPROVED':
        return <span className="px-2 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full text-xs font-medium">Approved</span>;
      case 'REJECTED':
        return <span className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded-full text-xs font-medium">Rejected</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f6f8] dark:bg-[#101622] font-[Manrope,sans-serif]">
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
                  src={proofViewer.contribution.proofs[proofViewer.currentIndex].fileUrl}
                  alt={`Proof ${proofViewer.currentIndex + 1}`}
                  className="max-w-full max-h-[75vh] w-auto h-auto object-contain rounded-lg"
                  style={{ minHeight: '200px', backgroundColor: '#f0f0f0' }}
                  onError={(e) => {
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
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="p-4 flex items-center gap-4">
          <Link 
            href="/admin/dashboard"
            className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </Link>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">All Contributions</h1>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name, email, or month..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#135bec]"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#135bec]"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contributions List */}
      <div className="p-4">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#135bec]"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 rounded-xl p-4 text-red-700 dark:text-red-400">
            {error}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredContributions.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 rounded-xl p-8 text-center border border-slate-100 dark:border-slate-700">
                <p className="text-slate-500 dark:text-slate-400">No contributions found</p>
              </div>
            ) : (
              filteredContributions.map((contribution) => (
                <div
                  key={contribution.id}
                  className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-[#135bec]/10 rounded-full h-12 w-12 flex items-center justify-center text-[#135bec] shrink-0">
                      <User className="w-6 h-6" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                            {contribution.user.name}
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {contribution.user.email}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(contribution.status)}
                          <span className="text-lg font-bold text-[#135bec]">
                            ₹{contribution.totalPaid}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                        <div>
                          <p className="text-slate-500 dark:text-slate-400 text-xs">Month</p>
                          <p className="text-slate-900 dark:text-white font-medium">
                            {formatMonth(contribution.month)}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500 dark:text-slate-400 text-xs">Base Amount</p>
                          <p className="text-slate-900 dark:text-white">₹{contribution.baseAmount}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 dark:text-slate-400 text-xs">Penalty</p>
                          <p className="text-red-600 dark:text-red-400">₹{contribution.penaltyAmount}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 dark:text-slate-400 text-xs">Submitted</p>
                          <p className="text-slate-900 dark:text-white">
                            {new Date(contribution.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {contribution.proofs.length > 0 && (
                        <div className="mt-3">
                          <button
                            onClick={() => setProofViewer({ contribution, currentIndex: 0 })}
                            className="inline-flex items-center gap-1 text-sm text-[#135bec] hover:text-[#135bec]/80"
                          >
                            <ImageIcon className="w-4 h-4" />
                            View {contribution.proofs.length} proof{contribution.proofs.length !== 1 ? 's' : ''}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}