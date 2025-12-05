import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  TrendingUp, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react';

const TopNavItem = ({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => 
      `flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors font-medium text-sm whitespace-nowrap ${
        isActive 
          ? 'bg-blue-600 text-white shadow-sm' 
          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
      }`
    }
  >
    {icon}
    <span>{label}</span>
  </NavLink>
);

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="bg-slate-900 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Branding */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="font-bold text-xl text-white">J</span>
              </div>
              <span className="font-bold text-lg tracking-tight hidden sm:block">RoofRunners OS</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1 ml-6">
              <TopNavItem to="/" icon={<LayoutDashboard size={18} />} label="Dashboard" />
              <TopNavItem to="/jobs" icon={<Briefcase size={18} />} label="Jobs Board" />
              <TopNavItem to="/reports" icon={<TrendingUp size={18} />} label="Reports" />
              <TopNavItem to="/documents" icon={<FileText size={18} />} label="Documents" />
            </nav>

            {/* Right Actions */}
            <div className="hidden md:flex items-center space-x-4 ml-6 border-l border-slate-700 pl-6">
               <NavLink to="/settings" className="text-slate-400 hover:text-white transition-colors">
                 <Settings size={20} />
               </NavLink>
               <button className="text-slate-400 hover:text-red-400 transition-colors">
                 <LogOut size={20} />
               </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="text-slate-300 hover:text-white focus:outline-none p-2"
              >
                {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileOpen && (
          <div className="md:hidden bg-slate-800 border-t border-slate-700">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
               <TopNavItem to="/" icon={<LayoutDashboard size={18} />} label="Dashboard" />
               <TopNavItem to="/jobs" icon={<Briefcase size={18} />} label="Jobs Board" />
               <TopNavItem to="/reports" icon={<TrendingUp size={18} />} label="Financial Reports" />
               <TopNavItem to="/documents" icon={<FileText size={18} />} label="Documents" />
               <div className="border-t border-slate-700 my-2 pt-2">
                 <TopNavItem to="/settings" icon={<Settings size={18} />} label="Settings" />
               </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4 md:p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
};