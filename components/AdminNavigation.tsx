"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Users,
  TrendingUp,
  Wallet,
  LayoutDashboard,
  Settings,
  CreditCard,
  Gift,
  Award,
  LogOut,
  ShieldCheck,
  LayoutGrid,
  HelpCircle,
  FileText,
  Home,
  Loader2,
  User,
  History
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

const menuItems = [
  { name: "Dashboard", icon: LayoutGrid, path: "/admin/dashboard" },  
  // { name: "History", icon: LayoutDashboard, path: "/brother/contributionHistory", badge: "" },
  { name: "Brothers", icon: Users, path: "/admin/allBrother"},
  { name: "My Contributions", icon: History, path: "/admin/mycontribution"},
  { name: "Contributions", icon: CreditCard, path: "/admin/allContributions"},
  { name: "Analytics", icon: TrendingUp, path: "/admin/analytics" , badge: "New", isNew: true},
  // { name: "Withdrawals", icon: Wallet, path: "/admin/withdrawals", badge: "5" },
  // { name: "Reports", icon: FileText, path: "/admin/reports" },
  // { name: "Wallet", icon: Wallet, path: "/wallet", badge: "₹1.2k" },
  // { name: "Rewards", icon: Gift, path: "/rewards", badge: "New", isNew: true },
  // { name: "Support", icon: HelpCircle, path: "/support" },
  // { name: "Settings", icon: Settings, path: "/settings" },
  { name: "Profile", icon: User, path: "/admin/profile" },
];

// Mobile bottom navigation items
const mobileNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
  { icon: Users, label: "Brothers", path: "/admin/allBrother" },
  { icon: Wallet, label: "AddBrother", path: "/admin/addBrother" },
  { icon: TrendingUp, label: "Analytics", path: "/admin/analytics" },
  // { icon: Settings, label: "Settings", path: "/settings" },
  { icon: User, label: "Profile", path: "/admin/profile" },
];

export default function AdminNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

  useEffect(() => {
    setMounted(true);
    fetchProfile();
  }, []);

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
          // Token expired or invalid
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} days ago`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} year${years > 1 ? 's' : ''} ago`;
    }
  };

  const getAdminTier = (monthlyContribution: number) => {
    if (monthlyContribution >= 3000) return { tier: 'Diamond ', color: 'from-purple-400 to-purple-600', icon: '👑' };
    if (monthlyContribution >= 1500) return { tier: 'Gold ', color: 'from-yellow-400 to-yellow-600', icon: '⭐' };
    if (monthlyContribution >= 500) return { tier: 'Silver ', color: 'from-gray-300 to-gray-500', icon: '💫' };
    return { tier: 'Head Brother', color: 'from-amber-300 to-amber-500', icon: '🔰' };
  };

  // Don't render anything until mounted to prevent hydration issues
  if (!mounted) {
    return null;
  }

  const adminTier = profile ? getAdminTier(profile.monthlyContribution) : { tier: 'Admin', color: 'from-amber-300 to-amber-500', icon: '🔰' };

  return (
    <>
      {/* Desktop Right Sidebar */}
      <aside className="fixed right-0 top-0 h-screen w-80 bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl border-l border-slate-200/80 dark:border-slate-800/80 shadow-2xl hidden lg:flex flex-col z-30">
        
        {/* Premium Gradient Header */}
        <div className="relative p-8 pb-6 bg-gradient-to-br from-[#135bec] via-[#135bec] to-[#0f4ac0] overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]"></div>
          <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -left-10 bottom-0 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <Users className="text-white w-5 h-5" />
              </div>
              <div>
                <h2 className="text-white/70 text-xs font-semibold tracking-wider uppercase">Admin Panel</h2>
                <p className="text-white text-sm font-medium">Community Fund</p>
              </div>
            </div>
            
            {/* Admin Profile Card */}
            {loading ? (
              <div className="flex items-center gap-4 bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/20">
                <div className="size-14 rounded-full bg-white/20 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-white/20 rounded animate-pulse"></div>
                  <div className="h-3 bg-white/20 rounded w-2/3 animate-pulse"></div>
                </div>
              </div>
            ) : error ? (
              <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/20">
                <p className="text-white/70 text-sm text-center">Failed to load profile</p>
                <button 
                  onClick={fetchProfile}
                  className="mt-2 w-full text-white/90 text-xs underline"
                >
                  Retry
                </button>
              </div>
            ) : profile && (
              <div className="flex items-center gap-4 bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/20">
                <div className="relative">
                  <div className={`size-14 rounded-full bg-gradient-to-br ${adminTier.color} flex items-center justify-center text-white font-bold text-xl border-2 border-white/50 shadow-xl`}>
                    {getInitials(profile.name)}
                  </div>
                  <div className="absolute -bottom-1 -right-1 size-4 bg-emerald-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-lg leading-tight truncate">{profile.name}</p>
                  <p className="text-white/70 text-xs flex items-center gap-1">
                    <span>{adminTier.icon}</span>
                    <span className="truncate">{adminTier.tier} • {profile.role}</span>
                  </p>
                  <p className="text-white/60 text-[10px] mt-1">
                    Jai Dharmraj Baba
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-8 px-6 overflow-y-auto">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              const Icon = item.icon;
              
              if (isActive) {
                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavigation(item.path)}
                    className="w-full flex items-center gap-4 px-4 py-3.5 bg-gradient-to-r from-[#135bec] to-[#135bec]/90 text-white rounded-xl shadow-lg shadow-[#135bec]/20 relative group transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <Icon className="w-5 h-5 relative z-10" />
                    <span className="font-semibold relative z-10 flex-1 text-left">{item.name}</span>
                    <div className="absolute right-4 w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                  </button>
                );
              }

              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.path)}
                  className="w-full flex items-center gap-4 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-300 group relative"
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium flex-1 text-left">{item.name}</span>
                  {item.badge && (
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      item.isNew 
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white' 
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  <div className="absolute left-0 w-1 h-0 bg-[#135bec] rounded-r-full group-hover:h-6 transition-all duration-300"></div>
                </button>
              );
            })}
          </div>

          {/* Admin Tools Section */}
          {profile && (
            <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-4 mb-4">
                Admin Tools
              </p>
              
              <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-slate-800 dark:to-slate-900 rounded-xl p-4 mb-4 border border-amber-200/50 dark:border-amber-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-amber-500 rounded-lg">
                    <Award className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">{adminTier.tier} Tier</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Member since {formatJoinDate(profile.joinDate)}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  {profile.waiverRemaining > 0 && (
                    <div className="flex items-center gap-2 text-xs mt-2 pt-2 border-t border-amber-200/50 dark:border-amber-500/20">
                      <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                      <span className="text-slate-600 dark:text-slate-400">
                        {profile.waiverRemaining} waiver{profile.waiverRemaining > 1 ? 's' : ''} available
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Links */}
              {/* <div className="space-y-1 px-4">
                <QuickLink icon={FileText} label="Privacy Policy" />
                <QuickLink icon={HelpCircle} label="FAQs" />
                <QuickLink icon={Home} label="About Us" />
              </div> */}
            </div>
          )}

          {/* Logout */}
          <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all duration-300 group relative"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium flex-1 text-left">Logout</span>
              <div className="absolute left-0 w-1 h-0 bg-red-500 rounded-r-full group-hover:h-6 transition-all duration-300"></div>
            </button>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>© 2026 Brotherhood</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Secured
            </span>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pb-safe shadow-lg z-20 lg:hidden">
        <div className="flex h-16 items-center justify-around px-2">
          {mobileNavItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            return (
              <MobileNavItem 
                key={item.path}
                icon={Icon}
                label={item.label}
                active={isActive}
                onClick={() => handleNavigation(item.path)}
              />
            );
          })}
        </div>
      </nav>
    </>
  );
}

// Helper Components
function QuickLink({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <a href="#" className="flex items-center gap-3 py-2 text-sm text-slate-500 dark:text-slate-400 hover:text-[#135bec] transition-colors">
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </a>
  );
}

function MobileNavItem({ icon: Icon, label, active = false, onClick }: { 
  icon: any; 
  label: string; 
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-1 flex-col items-center justify-center gap-1 ${
        active ? 'text-[#135bec]' : 'text-slate-400 dark:text-slate-500'
      }`}
    >
      <Icon className="w-6 h-6" />
      <p className={`text-[10px] ${active ? 'font-bold' : 'font-medium'} leading-normal`}>{label}</p>
    </button>
  );
}