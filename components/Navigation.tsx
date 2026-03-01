"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Menu,
  Bell,
  Users,
  TrendingUp,
  Wallet,
  User,
  LayoutDashboard,
  Settings,
  CreditCard,
  Gift,
  Heart,
  Award,
  LogOut,
  ShieldCheck,
  LayoutGrid,
  Home,
  HelpCircle,
  FileText
} from 'lucide-react';

interface NavigationProps {
  userRole: 'admin' | 'member';
}

// Define all menu items with their allowed roles
const menuItems = [
  // Admin specific items
  { name: "Dashboard", icon: LayoutGrid, path: "/admin/dashboard", allowedRoles: ["admin"] },
  { name: "Members", icon: Users, path: "/admin/members", allowedRoles: ["admin"], badge: "24" },
  { name: "Transactions", icon: CreditCard, path: "/admin/transactions", allowedRoles: ["admin"], badge: "12" },
  { name: "Analytics", icon: TrendingUp, path: "/admin/analytics", allowedRoles: ["admin"] },
  { name: "Withdrawals", icon: Wallet, path: "/admin/withdrawals", allowedRoles: ["admin"], badge: "5" },
  { name: "Reports", icon: FileText, path: "/admin/reports", allowedRoles: ["admin"] },
  
  // Member specific items
  { name: "Home", icon: Home, path: "/dashboard", allowedRoles: ["member"] },
  { name: "Drop", icon: LayoutDashboard, path: "/drop", allowedRoles: ["member"], badge: "3" },
  { name: "Store", icon: LayoutDashboard, path: "/store", allowedRoles: ["member"] },
  { name: "Sale", icon: LayoutDashboard, path: "/sale", allowedRoles: ["member"], isNew: true },
  { name: "Wishlist", icon: Heart, path: "/wishlist", allowedRoles: ["member"] },
  { name: "Cart", icon: LayoutDashboard, path: "/cart", allowedRoles: ["member"], badge: "2" },
  
  // Shared items (visible to both)
  { name: "Wallet", icon: Wallet, path: "/wallet", allowedRoles: ["admin", "member"], badge: "₹1.2k" },
  { name: "Rewards", icon: Gift, path: "/rewards", allowedRoles: ["admin", "member"], badge: "New", isNew: true },
  { name: "Support", icon: HelpCircle, path: "/support", allowedRoles: ["admin", "member"] },
  { name: "Settings", icon: Settings, path: "/settings", allowedRoles: ["admin", "member"] },
];

// Mobile bottom navigation items (simplified for each role)
const mobileNavItems = {
  admin: [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
    { icon: TrendingUp, label: "Analytics", path: "/admin/analytics" },
    { icon: Users, label: "Members", path: "/admin/members" },
    { icon: Wallet, label: "Funds", path: "/wallet" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ],
  member: [
    { icon: Home, label: "Home", path: "/dashboard" },
    { icon: LayoutDashboard, label: "Drop", path: "/drop" },
    { icon: LayoutDashboard, label: "Store", path: "/store" },
    { icon: Heart, label: "Wishlist", path: "/wishlist" },
    { icon: LayoutDashboard, label: "Cart", path: "/cart" },
    { icon: User, label: "Profile", path: "/profile" },
  ]
};

// User profile data based on role
const userProfiles = {
  admin: {
    name: "Ankush Kumar",
    initials: "AK",
    badge: "Admin",
    role: "admin",
    tier: "Admin • Jai Bhadrakali",
    icon: Award
  },
  member: {
    name: "John Doe",
    initials: "JD",
    badge: "Silver Member",
    role: "member",
    tier: "Silver Tier • Member",
    icon: Award
  }
};

export default function Navigation({ userRole }: NavigationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [filteredMenuItems, setFilteredMenuItems] = useState(menuItems);
  const [mounted, setMounted] = useState(false);

  const userProfile = userProfiles[userRole] || userProfiles.member;
  const mobileItems = mobileNavItems[userRole] || mobileNavItems.member;

  useEffect(() => {
    setMounted(true);
    
    // Filter menu items based on user role
    const allowedItems = menuItems.filter(item => 
      item.allowedRoles.includes(userRole)
    );
    setFilteredMenuItems(allowedItems);
  }, [userRole]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setTimeout(() => {
      router.push("/login");
    }, 200);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  if (!mounted) return null;

  return (
    <>
      {/* Desktop Right Sidebar - Premium Design */}
      <aside className="fixed right-0 top-0 h-screen w-80 bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl border-l border-slate-200/80 dark:border-slate-800/80 shadow-2xl hidden lg:flex flex-col z-30">
        
        {/* Premium Gradient Header */}
        <div className="relative p-8 pb-6 bg-gradient-to-br from-[#135bec] via-[#135bec] to-[#0f4ac0] overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]"></div>
          <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -left-10 bottom-0 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <Users className="text-white w-5 h-5" />
              </div>
              <div>
                <h2 className="text-white/70 text-xs font-semibold tracking-wider uppercase">Brotherhood</h2>
                <p className="text-white text-sm font-medium">Community Fund</p>
              </div>
            </div>
            
            {/* User Profile Card */}
            <div className="flex items-center gap-4 bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/20">
              <div className="relative">
                <div className={`size-14 rounded-full bg-gradient-to-br ${
                  userRole === 'admin' 
                    ? 'from-amber-300 to-amber-500' 
                    : 'from-blue-400 to-blue-600'
                } flex items-center justify-center text-white font-bold text-xl border-2 border-white/50 shadow-xl`}>
                  {userProfile.initials}
                </div>
                <div className="absolute -bottom-1 -right-1 size-4 bg-emerald-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1">
                <p className="text-white font-bold text-lg leading-tight">{userProfile.name}</p>
                <p className="text-white/70 text-xs flex items-center gap-1">
                  <userProfile.icon className="w-3 h-3" />
                  {userProfile.tier}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-8 px-6 overflow-y-auto">
          <div className="space-y-2">
            {filteredMenuItems.map((item) => {
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
                <NavItem 
                  key={item.name}
                  icon={Icon}
                  label={item.name}
                  path={item.path}
                  badge={item.badge}
                  isNew={item.isNew}
                  onClick={() => handleNavigation(item.path)}
                />
              );
            })}
          </div>

          {/* Premium Features Section */}
          <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-4 mb-4">
              {userRole === 'admin' ? 'Admin Tools' : 'Member Benefits'}
            </p>
            
            <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-slate-800 dark:to-slate-900 rounded-xl p-4 mb-4 border border-amber-200/50 dark:border-amber-500/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-amber-500 rounded-lg">
                  <Award className="w-4 h-4 text-white" />
                </div>
                <p className="font-bold text-sm">
                  {userRole === 'admin' ? 'Diamond Admin Benefits' : 'Member Benefits'}
                </p>
              </div>
              <div className="space-y-2">
                <FeatureItem text="0% transaction fees" />
                <FeatureItem text="Priority withdrawals" />
                <FeatureItem text="Exclusive events access" />
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-1 px-4">
              <QuickLink icon={FileText} label="Privacy Policy" />
              <QuickLink icon={HelpCircle} label="FAQs" />
              <QuickLink icon={Home} label="About Us" />
            </div>
          </div>

          {/* Settings & Logout */}
          <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800">
            <NavItem 
              icon={Settings} 
              label="Settings" 
              path="/settings"
              onClick={() => handleNavigation('/settings')}
            />
            <NavItem 
              icon={LogOut}
              label="Logout"
              className="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
              onClick={handleLogout} path={""}            />
          </div>
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>© 2024 Brotherhood</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Secured
            </span>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pb-safe shadow-lg z-20 lg:hidden">
        <div className="flex h-16 items-center px-4">
          {mobileItems.map((item) => {
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
function NavItem({ icon: Icon, label, badge, isNew, className = "", path, onClick }: { 
  icon: any; 
  label: string; 
  badge?: string; 
  isNew?: boolean;
  className?: string;
  path: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-300 group relative ${className}`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium flex-1 text-left">{label}</span>
      {badge && (
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
          isNew 
            ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white' 
            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
        }`}>
          {badge}
        </span>
      )}
      <div className="absolute left-0 w-1 h-0 bg-[#135bec] rounded-r-full group-hover:h-6 transition-all duration-300"></div>
    </button>
  );
}

function QuickLink({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <a href="#" className="flex items-center gap-3 py-2 text-sm text-slate-500 dark:text-slate-400 hover:text-[#135bec] transition-colors">
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </a>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <div className="w-1 h-1 bg-amber-500 rounded-full"></div>
      <span className="text-slate-600 dark:text-slate-400">{text}</span>
    </div>
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