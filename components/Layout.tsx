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

const SidebarItem = ({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => 
      `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
        isActive 
          ? 'bg-blue-900 text-white shadow-md' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`
    }
  >
    {icon}
    <span className="font-medium">{label}</span>
  </NavLink>
);

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="font-bold text-xl">J</span>
            </div>
            <span className="font-bold text-lg tracking-tight">RoofRunners OS</span>
          </div>
          <button onClick={() => setIsMobileOpen(false)} className="md:hidden">
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          <SidebarItem to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <SidebarItem to="/jobs" icon={<Briefcase size={20} />} label="Jobs Board" />
          <SidebarItem to="/reports" icon={<TrendingUp size={20} />} label="Financial Reports" />
          <SidebarItem to="/documents" icon={<FileText size={20} />} label="Documents" />
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-700">
          <SidebarItem to="/settings" icon={<Settings size={20} />} label="Settings" />
          <button className="flex items-center space-x-3 px-4 py-3 text-slate-400 hover:text-red-400 w-full mt-2">
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white shadow-sm z-10 p-4 md:hidden flex justify-between items-center">
          <span className="font-bold text-slate-800">J&J Roofing Pros</span>
          <button onClick={() => setIsMobileOpen(true)} className="text-slate-600">
            <Menu size={24} />
          </button>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
