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
  User
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function BrotherDashboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#f6f6f8] dark:bg-[#101622] font-[Manrope,sans-serif] ">
      {/* Mobile Header - Only visible on mobile */}
<header className="lg:hidden flex items-center bg-[#f6f6f8] dark:bg-[#101622] p-4 pb-2 justify-between sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800">
  <div className="flex items-center gap-2 ">
    <div className="bg-[#135bec]/10 p-1.5 rounded-lg">
      <Users className="text-[#135bec] w-5 h-5" />
    </div>
    <h1 className="text-slate-900 dark:text-white text-base font-bold leading-tight tracking-tight">
      Brotherhood
    </h1>
  </div>
  <div className="flex items-center gap-1">
    <button className="flex size-9 cursor-pointer items-center justify-center rounded-lg bg-transparent text-slate-900 dark:text-slate-100 relative">
      <Bell className="w-5 h-5" />
      <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full"></span>
    </button>
    <div className="size-8 rounded-full bg-[#135bec] flex items-center justify-center text-white font-bold text-sm border-2 border-white dark:border-slate-800 shadow-sm">
      JD
    </div>
    </div>
</header>

      {/* Main Content */}
      <div className="p-4 lg:p-6">
        {/* Desktop Title */}
        <h1 className=" text-2xl font-extrabold text-slate-900 dark:text-white mb-6">
          Welcome back, Brother
        </h1>
        <p className=" text-slate-500 dark:text-slate-400 text-sm mb-6">
          Unity is our strength. Here is your status today.
        </p>

        {/* Overview Cards */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="relative overflow-hidden bg-[#135bec] rounded-xl p-6 shadow-lg shadow-[#135bec]/20">
            <div className="relative z-10">
              <p className="text-white/80 text-sm font-medium mb-1">Total Brotherhood Fund</p>
              <h3 className="text-white text-3xl font-bold leading-tight">₹45,280.00</h3>
              <div className="mt-4 flex items-center gap-2 text-xs text-white/70">
                <TrendingUp className="w-4 h-4" />
                <span>+12% from last month</span>
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
              <p className="text-slate-900 dark:text-white text-xl font-bold mt-1">₹1,250.00</p>
            </div>

            <div className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm">
              <div className="size-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-3">
                <Hourglass className="text-amber-600 dark:text-amber-400 w-5 h-5" />
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
                Pending
              </p>
              <p className="text-slate-900 dark:text-white text-xl font-bold mt-1">₹150.00</p>
            </div>
          </div>
        </div>

        {/* Quick Pay Section */}
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
                    October 2023
                  </p>
                  <h4 className="text-white dark:text-white text-2xl font-bold mt-1">Monthly Due</h4>
                </div>
                <div className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs font-bold border border-red-500/30">
                  5 Days Left
                </div>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 dark:text-slate-300">Standard Contribution</span>
                  <span className="text-white font-semibold">₹100.00</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 dark:text-slate-300">Late Penalty Fee</span>
                  <span className="text-red-400 font-semibold">+₹50.00</span>
                </div>
                <div className="pt-3 border-t border-slate-800 dark:border-[#135bec]/20 flex justify-between items-center">
                  <span className="text-white font-bold">Total Preview</span>
                  <span className="text-white text-2xl font-black">₹150.00</span>
                </div>
              </div>

              <button className="w-full bg-[#135bec] hover:bg-[#135bec]/90 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all">
                <CreditCard className="w-5 h-5" />
                Contribute Now
              </button>
            </div>
            <div className="bg-slate-800/50 dark:bg-[#135bec]/5 px-6 py-3 flex items-center justify-center gap-2">
              <ShieldCheck className="text-slate-500 w-4 h-4" />
              <p className="text-slate-500 dark:text-slate-400 text-xs">
                Secure encrypted payment via Brotherhood Fund
              </p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-slate-900 dark:text-white text-lg font-bold">Brotherhood Activity</h3>
            <a className="text-[#135bec] text-sm font-semibold" href="#">
              View All
            </a>
          </div>
          <div className="space-y-3">
            <ActivityItem 
              name="Michael S."
              time="2h ago"
              image="https://lh3.googleusercontent.com/aida-public/AB6AXuD41cnCcEvlzPPNNaJTj_iC22S3Nv_R16SJjknGprrX-9oLDovlHVOtjbZyWCaEIcCTMOusHtn3WnMz0Ic5_e4dviQE037vDtGRNf1Rt6x6fkoreDRvdXmJrBnaOtXwFkTpEsqJ2YMK-tcIW1byCucfyFYErbgeZU2Ju-VHzWHusSk_MAU5zt3cGFFrPp7G1N7OS67GM6Pf4c1bheTmZUMdWcKERaCCdzjEexF6smqDsMxuIhrIsd9uM3ZZwXz7enuL8nliuemqzhE"
            />
            <ActivityItem 
              name="David K."
              time="5h ago"
              image="https://lh3.googleusercontent.com/aida-public/AB6AXuC9K5xB_QT1lvUoeOcbW4SrBxrFGFBHRbPJhGD1KObBKehVP-DA-ath5N65w0MnVMg-ui2PsniT5KoBmjqVe5Ws_QSD-E07VHsebwyjNY2REe4y9ZD8If3YQKzREd2JmrabRZOcjG-_QrIFMAM14HmsHNOveXB-MeGh4Cw0MLR36t7jPVjr-CJforShj-3QqbS9pCubnTFpcfJxQaG3Fbu-nNFZzvpFNopsmaq5jfPLSjO17cbmaUTJI5eFrrQnRESCbxACqjDaJEU"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityItem({ name, time, image }: { name: string; time: string; image: string }) {
  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className="size-10 rounded-full overflow-hidden shrink-0">
        <img
          className="w-full h-full object-cover"
          alt={`Profile picture of ${name}`}
          src={image}
        />
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold text-slate-900 dark:text-white">Brother {name}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">Contributed ₹100.00</p>
      </div>
      <div className="text-slate-400 text-[10px] font-medium">{time}</div>
    </div>
  );
}