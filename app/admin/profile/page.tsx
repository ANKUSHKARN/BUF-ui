"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Award,
  Shield,
  Wallet,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  Edit,
  Copy,
  ChevronRight,
  LogOut,
  Settings,
  HelpCircle,
  Share2,
  QrCode,
  BadgeCheck,
  Star
} from 'lucide-react';

interface ProfileData {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: string;
  monthlyContribution: number;
  waiverRemaining: number;
  isActive: boolean;
  joinDate: string;
  createdAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

  useEffect(() => {
    fetchProfile();
  }, []);

  const openWhatsApp = (phoneNumber: string) => {
    const whatsappUrl = `https://wa.me/${phoneNumber}`;
    window.open(whatsappUrl, '_blank');
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/brother/me/profile`, {
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
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setProfile(data);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };


  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getTierInfo = (monthlyContribution: number) => {
    if (monthlyContribution >= 1000) {
      return {
        tier: 'Gold',
        color: 'from-yellow-400 to-yellow-600',
        bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
        textColor: 'text-yellow-600 dark:text-yellow-400',
        icon: Star,
        benefits: []
      };
    }
    if (monthlyContribution >= 500) {
      return {
        tier: 'Silver',
        color: 'from-gray-300 to-gray-500',
        bgColor: 'bg-gray-50 dark:bg-gray-900/20',
        textColor: 'text-gray-600 dark:text-gray-400',
        icon: Award,
        benefits: []
      };
    }
    if (monthlyContribution >= 50) {
      return {
        tier: 'Bronze',
        color: 'from-amber-600 to-amber-800',
        bgColor: 'bg-amber-50 dark:bg-amber-900/20',
        textColor: 'text-amber-600 dark:text-amber-400',
        icon: Award,
        benefits: []
      };
    }
    return {
      tier: 'Member',
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400',
      icon: User,
      benefits: ['Standard benefits']
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="relative flex min-h-screen flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="relative flex min-h-screen flex-col items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Oops! Something went wrong</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">{error || 'Failed to load profile'}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const tierInfo = getTierInfo(profile.monthlyContribution);
  const TierIcon = tierInfo.icon;
  const joinDate = formatDate(profile.joinDate);
  const memberSince = formatDateTime(profile.createdAt);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 pb-24">
      {/* Header with Back Button */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center justify-between px-4 py-4">
          <button
            onClick={handleGoBack}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400 rotate-180" />
          </button>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">Profile</h1>
          <button
            onClick={() => router.push('/brother/settings')}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            {/* <Settings className="w-5 h-5 text-slate-600 dark:text-slate-400" /> */}
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Header Card */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden">
          {/* Cover with Gradient */}
          <div className={`h-32 bg-gradient-to-r ${tierInfo.color} relative`}>
            <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]"></div>
          </div>
          
          {/* Profile Info */}
          <div className="relative px-6 pb-6">
            {/* Avatar */}
            <div className="flex justify-center">
              <div className="relative -mt-16">
                <div className={`w-32 h-32 rounded-2xl bg-gradient-to-br ${tierInfo.color} p-1 shadow-xl`}>
                  <div className="w-full h-full rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center">
                    <span className="text-4xl font-bold text-slate-900 dark:text-white">
                      {getInitials(profile.name)}
                    </span>
                  </div>
                </div>
                {profile.isActive && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white dark:border-slate-800 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            </div>

            {/* Name and Role */}
            <div className="text-center mt-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{profile.name}</h2>
              <div className="flex items-center justify-center gap-2 mt-1">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${tierInfo.bgColor} ${tierInfo.textColor}`}>
                  {tierInfo.tier} Member
                </span>
                <span className="px-3 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-full text-xs font-medium">
                  {profile.role}
                </span>
              </div>
            </div>

            {/* Member ID */}
            <div className="mt-4 flex items-center justify-center gap-2">
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <Wallet className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Monthly</p>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              ₹{profile.monthlyContribution}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Contribution</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Waivers</p>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {profile.waiverRemaining}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Remaining</p>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <User className="w-5 h-5" />
            Personal Information
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
              <Mail className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <p className="text-xs text-slate-500 dark:text-slate-400">Email Address</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">{profile.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
              <Phone className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <p className="text-xs text-slate-500 dark:text-slate-400">Mobile Number</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">{profile.mobile}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
              <Calendar className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <p className="text-xs text-slate-500 dark:text-slate-400">Join Date</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">{joinDate}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
              <Clock className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <p className="text-xs text-slate-500 dark:text-slate-400">Member Since</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">{memberSince}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
              <BadgeCheck className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <p className="text-xs text-slate-500 dark:text-slate-400">Account Status</p>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${profile.isActive ? 'text-emerald-600' : 'text-red-600'}`}>
                    {profile.isActive ? 'Active' : 'Inactive'}
                  </span>
                  {profile.isActive && (
                    <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full text-xs">
                      Verified
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tier Benefits */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-xl ${tierInfo.bgColor}`}>
              <TierIcon className={`w-5 h-5 ${tierInfo.textColor}`} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{tierInfo.tier} </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Your Current Tier</p>
            </div>
          </div>

          <div className="space-y-3">
            {tierInfo.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                {/* <span className="text-sm text-slate-600 dark:text-slate-300">{benefit}</span> */}
              </div>
            ))}
          </div>

          {/* Next Tier Progress */}
          {profile.monthlyContribution < 1000 && (
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">Next Tier Progress</span>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {profile.monthlyContribution}/1000
                </span>
              </div>
              <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full"
                  style={{ width: `${(profile.monthlyContribution / 1000) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Increase contribution to ₹1000/month to reach Gold tier
              </p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => router.push('/brother/contributionHistory')}
            className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow flex flex-col items-center gap-2"
          >
            <TrendingUp className="w-6 h-6 text-primary" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">History</span>
          </button>

          {/* <button
            onClick={() => router.push('/brother/wallet')}
            className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow flex flex-col items-center gap-2"
          >
            <Wallet className="w-6 h-6 text-primary" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Wallet</span>
          </button> */}

          {/* <button
            onClick={() => router.push('/brother/rewards')}
            className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow flex flex-col items-center gap-2"
          >
            <Award className="w-6 h-6 text-primary" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Rewards</span>
          </button> */}

          <button
            onClick={() => openWhatsApp('+918860552405')}
            className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow flex flex-col items-center gap-2"
          >
            <HelpCircle className="w-6 h-6 text-primary" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Support</span>
          </button>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            router.push("/login");
          }}
          className="w-full bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-red-500 hover:text-red-600"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}