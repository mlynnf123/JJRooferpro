import React from 'react';
import { Job, StatCardProps } from '../types';
import { formatCurrency } from '../utils';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie
} from 'recharts';
import { DollarSign, AlertTriangle, CheckCircle, Clock, Plus, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, trendColor }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
      </div>
      <div className="p-3 bg-slate-50 rounded-lg text-slate-600">
        {icon}
      </div>
    </div>
    {trend && (
      <div className={`mt-4 text-sm font-medium ${
        trendColor === 'green' ? 'text-emerald-600' : 
        trendColor === 'red' ? 'text-rose-600' : 'text-slate-500'
      }`}>
        {trend}
      </div>
    )}
  </div>
);

interface DashboardProps {
  jobs: Job[];
  onAddJob?: () => string;
}

export const Dashboard: React.FC<DashboardProps> = ({ jobs, onAddJob }) => {
  const navigate = useNavigate();

  // Empty State Handling
  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-center space-y-6">
        <div className="p-6 bg-blue-50 rounded-full">
          <LayoutDashboard size={48} className="text-blue-600" />
        </div>
        <div className="max-w-lg">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome to RoofRunners OS</h1>
          <p className="text-slate-500 text-lg">
            Your P&L tracking system is ready. Create your first job record to start tracking profitability and claims status.
          </p>
        </div>
        <button 
          onClick={() => {
            if (onAddJob) {
               const id = onAddJob();
               navigate(`/jobs/${id}`);
            }
          }}
          className="flex items-center space-x-2 bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 font-bold text-lg transition-all shadow-lg hover:shadow-xl"
        >
          <Plus size={24} />
          <span>Create First Job</span>
        </button>
      </div>
    );
  }

  // Aggregate Metrics
  const totalRevenue = jobs.reduce((acc, job) => acc + job.financials.profitability.grossProfit, 0);
  const activeJobs = jobs.filter(j => j.phaseTracking.currentPhase < 10).length;
  const stuckJobs = jobs.filter(j => j.phaseTracking.isStuck).length;
  const collectedCash = jobs.reduce((acc, job) => acc + job.financials.payments.totalReceived, 0);

  // Chart Data Preparation
  const phaseData = [
    { name: 'Pre-Claim', value: jobs.filter(j => j.phaseTracking.currentPhase <= 2).length, color: '#94a3b8' },
    { name: 'Negotiation', value: jobs.filter(j => j.phaseTracking.currentPhase > 2 && j.phaseTracking.currentPhase <= 5).length, color: '#f59e0b' },
    { name: 'Production', value: jobs.filter(j => j.phaseTracking.currentPhase > 5 && j.phaseTracking.currentPhase <= 8).length, color: '#3b82f6' },
    { name: 'Closing', value: jobs.filter(j => j.phaseTracking.currentPhase > 8).length, color: '#10b981' },
  ].filter(d => d.value > 0);

  const revenueData = jobs.map(job => ({
    name: job.client.name.split(' ')[0], // First name for chart
    Revenue: job.financials.insurance.rcvTotal,
    Cost: job.financials.costs.materials + job.financials.costs.labor,
    Profit: job.financials.profitability.netProfit
  })).slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Executive Dashboard</h1>
        <div className="flex space-x-3">
          <div className="text-sm text-slate-500 flex items-center bg-white px-3 py-1 rounded border border-slate-200">
             Today: {new Date().toLocaleDateString()}
          </div>
          {onAddJob && (
            <button 
              onClick={() => {
                const id = onAddJob();
                navigate(`/jobs/${id}`);
              }}
              className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              + New Job
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Gross Profit" 
          value={formatCurrency(totalRevenue)} 
          icon={<DollarSign />} 
          trend="Real-time"
          trendColor="neutral"
        />
        <StatCard 
          title="Cash Collected" 
          value={formatCurrency(collectedCash)} 
          icon={<CheckCircle />} 
          trend="Total Inflows"
          trendColor="green"
        />
        <StatCard 
          title="Active Jobs" 
          value={activeJobs} 
          icon={<Clock />} 
          trend="In Pipeline"
          trendColor="neutral"
        />
        <StatCard 
          title="Stuck Jobs (>7 Days)" 
          value={stuckJobs} 
          icon={<AlertTriangle />} 
          trend="Needs Attention"
          trendColor={stuckJobs > 0 ? "red" : "green"}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Phase Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Job Phase Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={phaseData} 
                  dataKey="value" 
                  nameKey="name" 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={80} 
                  label 
                >
                  {phaseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-4 text-xs text-slate-500 mt-2 flex-wrap gap-y-2">
            {phaseData.map(d => (
              <div key={d.name} className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: d.color }}></div>
                {d.name}
              </div>
            ))}
          </div>
        </div>

        {/* Profitability Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Job Performance</h3>
          <div className="h-64">
            {revenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Bar dataKey="Revenue" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Profit" fill="#1e3a8a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                Not enough data to display analytics
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};