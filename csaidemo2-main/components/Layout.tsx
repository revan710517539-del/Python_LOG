
import React from 'react';
import { Home, Users, Briefcase, FileText, Settings, LogOut, Search, User as UserIcon } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const notifyRouter = (payload: Record<string, unknown>) => {
    if (typeof window !== 'undefined' && window.parent && window.parent !== window) {
      window.parent.postMessage({ source: 'router', ...payload }, '*');
    }
  };
  const getUserRole = () => {
    if (typeof window === 'undefined') return 'manager';
    const params = new URLSearchParams(window.location.search);
    const role = (params.get('role') || '').toLowerCase();
    if (['branch', 'leader', 'branch_manager', 'branch-leader', 'branchmanager', 'branchhead'].includes(role)) {
      return 'branch';
    }
    return 'manager';
  };
  const handleDailyReport = () => {
    notifyRouter({
      type: 'open-daily-report',
      role: getUserRole(),
      targetProject: '常熟-理财助手',
    });
  };
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#F5F7FA]">
       {/* Top Header - Matching Screenshot */}
       <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 shadow-sm flex-shrink-0 z-50">
           
           {/* Left: Logo Area */}
           <div className="flex items-center gap-3 min-w-[240px]">
               {/* Mock Logo Icon - Brown/Gold style */}
               <div className="w-8 h-8 rounded bg-[#8B5E3C] flex items-center justify-center text-white font-bold text-xs">
                   CS
               </div>
               <div className="flex flex-col">
                   <span className="text-lg font-bold text-[#333] tracking-tight leading-none">常熟农商银行</span>
                   <span className="text-[9px] text-gray-400 uppercase tracking-wider scale-90 origin-left">Changshu Rural Commercial Bank</span>
               </div>
           </div>

           {/* Center: Segmented Control (Pill) */}
           <div className="hidden md:flex bg-blue-50/50 p-1 rounded-full border border-blue-100">
               <button className="px-6 py-1.5 rounded-full text-sm font-medium text-blue-600 hover:bg-white transition-all">综合</button>
               <button className="px-6 py-1.5 rounded-full text-sm font-medium text-gray-500 hover:text-blue-600 hover:bg-white transition-all">信贷</button>
               <button className="px-6 py-1.5 rounded-full text-sm font-bold text-white bg-blue-500 shadow-sm">营销</button>
           </div>

           {/* Right: User & Search */}
           <div className="flex items-center gap-4 lg:gap-6">
               <button
                   onClick={handleDailyReport}
                   className="hidden sm:inline-flex items-center gap-1.5 px-3 h-9 rounded-full border border-blue-200 text-blue-600 text-xs font-bold hover:bg-blue-50 transition-colors"
               >
                   <FileText size={14} />
                   每日早报
               </button>
               {/* User Profile */}
               <div className="flex items-center gap-3">
                   <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 border border-gray-200">
                       <UserIcon size={20} />
                   </div>
                   <div className="flex flex-col">
                       <span className="text-sm font-bold text-gray-800 leading-tight">周豪</span>
                       <span className="text-[10px] text-gray-400">工号: 009676</span>
                   </div>
               </div>

               {/* Search Bar */}
               <div className="relative hidden lg:block w-64">
                   <input 
                       type="text" 
                       placeholder="输入客户关键字搜索" 
                       className="w-full pl-4 pr-10 py-1.5 text-sm bg-white border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 transition-colors placeholder:text-gray-400 font-light"
                   />
                   <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
               </div>

               {/* Exit */}
               <button className="flex flex-col items-center gap-0.5 text-gray-500 hover:text-red-500 transition-colors">
                   <LogOut size={18} />
                   <span className="text-[9px]">退出</span>
               </button>
           </div>
       </header>

       <div className="flex-1 flex overflow-hidden relative">
            {/* Sidebar - Keeping as requested, but adjusted z-index to stay below header if needed, or side-by-side */}
            <aside className="w-16 md:w-20 bg-slate-900 flex flex-col items-center py-6 gap-8 z-40 flex-shrink-0">
               {/* Sidebar Logo replacement (icon only since header has full logo) or keep functional links */}
                <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center text-blue-400 font-bold text-xl">
                    <Home size={24} />
                </div>

                <nav className="flex flex-col gap-6 flex-1 w-full items-center">
                    <NavItem icon={<Home size={22} />} label="首页" />
                    <NavItem icon={<Users size={22} />} label="AI洞察" active />
                    <NavItem icon={<Briefcase size={22} />} label="任务" />
                    <NavItem icon={<FileText size={22} />} label="报表" />
                </nav>

                <div className="flex flex-col gap-6 w-full items-center mb-4">
                        <NavItem icon={<Settings size={22} />} label="设置" />
                </div>
            </aside>

            {/* Main Page Content */}
            <main className="flex-1 overflow-hidden relative">
                {children}
            </main>
       </div>
    </div>
  );
};

const NavItem = ({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) => (
    <div className={`relative group cursor-pointer flex flex-col items-center gap-1 ${active ? 'text-blue-400' : 'text-slate-400 hover:text-white'}`}>
        {icon}
        <span className="text-[10px] font-medium">{label}</span>
        {active && <div className="absolute -left-5 top-0 bottom-0 w-1 bg-blue-500 rounded-r"></div>}
    </div>
);
