import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Job, PHASE_NAMES, Financials, Supplement } from '../types';
import { calculateProfitability, formatCurrency } from '../utils';
import { ArrowLeft, Save, FileText, Check, DollarSign, Hammer, User, Shield, Users, Plus, Trash, AlertCircle, Sparkles } from 'lucide-react';
import { JobAIAssistant } from './JobAIAssistant';

interface JobDetailProps {
  jobs: Job[];
  onUpdateJob: (job: Job) => void;
}

export const JobDetail: React.FC<JobDetailProps> = ({ jobs, onUpdateJob }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'financials' | 'supplements' | 'documents'>('overview');
  const [isAIOpen, setIsAIOpen] = useState(false);
  
  // Local state for editing financials and basic info
  const [financials, setFinancials] = useState<Financials | null>(null);

  useEffect(() => {
    const found = jobs.find(j => j.id === id);
    if (found) {
      setJob(found);
      setFinancials(found.financials);
    }
  }, [id, jobs]);

  if (!job || !financials) return <div>Loading...</div>;

  const handleFinancialChange = (section: keyof Financials, field: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    const newFinancials = {
      ...financials,
      [section]: {
        ...financials[section],
        [field]: numValue
      }
    };
    // Auto-calculate
    const calculated = calculateProfitability(newFinancials);
    setFinancials(calculated);
  };

  const handleInfoChange = (section: 'client' | 'details' | 'salesRep', field: string, value: string) => {
    setJob(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      };
    });
  };

  const saveChanges = () => {
    if (job && financials) {
      onUpdateJob({ ...job, financials });
      alert('Job Saved Successfully');
    }
  };

  // Supplement Handlers
  const handleAddSupplement = () => {
    const newSupp: Supplement = {
      id: crypto.randomUUID(),
      reason: 'New Supplement Request',
      amountRequested: 0,
      amountApproved: 0,
      status: 'Pending',
      dateSubmitted: new Date().toISOString().split('T')[0],
      notes: ''
    };
    const updatedSupplements = [newSupp, ...(job.supplements || [])];
    setJob({ ...job, supplements: updatedSupplements });
  };

  const handleUpdateSupplement = (suppId: string, field: keyof Supplement, value: any) => {
    const updatedSupplements = (job.supplements || []).map(s => 
      s.id === suppId ? { ...s, [field]: value } : s
    );
    setJob({ ...job, supplements: updatedSupplements });
  };

  const handleDeleteSupplement = (suppId: string) => {
    if (confirm('Are you sure you want to delete this supplement?')) {
      const updatedSupplements = (job.supplements || []).filter(s => s.id !== suppId);
      setJob({ ...job, supplements: updatedSupplements });
    }
  };

  return (
    <div className="space-y-6 pb-12 relative">
      {/* AI Assistant Overlay */}
      <JobAIAssistant job={{...job, financials}} isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />

      {/* Header */}
      <div className="flex items-center space-x-4">
        <button onClick={() => navigate('/jobs')} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
          <ArrowLeft size={24} className="text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{job.client.name}</h1>
          <div className="text-slate-500 text-sm">{job.jobNumber} • {job.client.address || 'No Address'}</div>
        </div>
        <div className="flex-1"></div>
        
        {/* AI Toggle Button */}
        <button 
          onClick={() => setIsAIOpen(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 font-medium shadow-sm transition-all hover:shadow-md animate-pulse"
        >
          <Sparkles size={18} className="text-yellow-300" />
          <span>AI Insights</span>
        </button>

        <button onClick={saveChanges} className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium shadow-sm transition-all hover:shadow-md">
          <Save size={18} />
          <span>Save</span>
        </button>
      </div>

      {/* Phase Tracker (Stepper) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
        <div className="flex justify-between min-w-[800px]">
          {Object.entries(PHASE_NAMES).map(([key, name]) => {
            const phaseNum = parseInt(key);
            const isCompleted = phaseNum < job.phaseTracking.currentPhase;
            const isCurrent = phaseNum === job.phaseTracking.currentPhase;
            
            return (
              <button 
                key={key} 
                onClick={() => onUpdateJob({...job, phaseTracking: {...job.phaseTracking, currentPhase: phaseNum as any}})}
                className="flex flex-col items-center relative flex-1 group"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold z-10 transition-all
                  ${isCompleted ? 'bg-emerald-500 text-white' : isCurrent ? 'bg-blue-600 text-white ring-4 ring-blue-100 scale-110' : 'bg-slate-200 text-slate-500 group-hover:bg-slate-300'}`}>
                  {isCompleted ? <Check size={14} /> : phaseNum}
                </div>
                <div className={`text-xs text-center mt-2 font-medium max-w-[80px] transition-colors ${isCurrent ? 'text-blue-700 font-bold' : 'text-slate-600'}`}>{name}</div>
                {/* Connector Line */}
                {phaseNum !== 10 && (
                  <div className={`absolute top-4 left-1/2 w-full h-0.5 -z-0 ${isCompleted ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-8">
          {(['overview', 'financials', 'supplements', 'documents'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Client Info */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center space-x-2 text-slate-800 border-b border-slate-100 pb-3 mb-2">
              <User size={20} className="text-blue-600" />
              <h3 className="font-bold text-lg">Client Information</h3>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase">Client Name</label>
                <input 
                  type="text" 
                  value={job.client.name} 
                  onChange={(e) => handleInfoChange('client', 'name', e.target.value)}
                  className="w-full mt-1 p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase">Property Address</label>
                <input 
                  type="text" 
                  value={job.client.address} 
                  onChange={(e) => handleInfoChange('client', 'address', e.target.value)}
                  className="w-full mt-1 p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="123 Street Name, City, State"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase">Phone</label>
                  <input 
                    type="tel" 
                    value={job.client.phone} 
                    onChange={(e) => handleInfoChange('client', 'phone', e.target.value)}
                    className="w-full mt-1 p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="(555) 555-5555"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase">Email</label>
                  <input 
                    type="email" 
                    value={job.client.email} 
                    onChange={(e) => handleInfoChange('client', 'email', e.target.value)}
                    className="w-full mt-1 p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="client@example.com"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Insurance Details */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
             <div className="flex items-center space-x-2 text-slate-800 border-b border-slate-100 pb-3 mb-2">
              <Shield size={20} className="text-blue-600" />
              <h3 className="font-bold text-lg">Insurance & Claim</h3>
            </div>
             <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase">Insurance Carrier</label>
                <input 
                  type="text" 
                  value={job.client.carrier} 
                  onChange={(e) => handleInfoChange('client', 'carrier', e.target.value)}
                  className="w-full mt-1 p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="State Farm, Allstate, etc."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase">Claim Number</label>
                  <input 
                    type="text" 
                    value={job.client.claimNumber} 
                    onChange={(e) => handleInfoChange('client', 'claimNumber', e.target.value)}
                    className="w-full mt-1 p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="Claim #"
                  />
                </div>
                 <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase">Damage Type</label>
                  <select 
                    value={job.details.damageType} 
                    onChange={(e) => handleInfoChange('details', 'damageType', e.target.value)}
                    className="w-full mt-1 p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
                  >
                    <option value="Hail">Hail</option>
                    <option value="Wind">Wind</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
               <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase">Date of Loss</label>
                  <input 
                    type="date" 
                    value={job.details.stormDate} 
                    onChange={(e) => handleInfoChange('details', 'stormDate', e.target.value)}
                    className="w-full mt-1 p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
            </div>
          </div>

          {/* Assignment */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center space-x-2 text-slate-800 border-b border-slate-100 pb-3 mb-2">
              <Users size={20} className="text-blue-600" />
              <h3 className="font-bold text-lg">Internal Assignment</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase">Sales Representative</label>
                <input 
                  type="text" 
                  value={job.salesRep.name} 
                  onChange={(e) => handleInfoChange('salesRep', 'name', e.target.value)}
                  className="w-full mt-1 p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="Rep Name"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase">Job Number</label>
                <input 
                  type="text" 
                  value={job.jobNumber} 
                  readOnly
                  className="w-full mt-1 p-2 border border-slate-200 rounded bg-slate-50 text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Financials Tab Content */}
      {activeTab === 'financials' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1: Revenue (Insurance) */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
            <div className="flex items-center space-x-2 text-blue-700 mb-2">
              <DollarSign size={20} />
              <h3 className="font-bold text-lg">Revenue (Insurance)</h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase">RCV Total (Replacement Cost)</label>
                <input 
                  type="number" 
                  value={financials.insurance.rcvTotal}
                  onChange={(e) => handleFinancialChange('insurance', 'rcvTotal', e.target.value)}
                  className="w-full mt-1 p-2 border rounded font-mono text-right focus:ring-2 focus:ring-blue-500 outline-none"
                  onFocus={(e) => e.target.select()}
                />
              </div>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-slate-500 uppercase">ACV (Initial Check)</label>
                  <input 
                    type="number" 
                    value={financials.insurance.acvTotal}
                    onChange={(e) => handleFinancialChange('insurance', 'acvTotal', e.target.value)}
                    className="w-full mt-1 p-2 border rounded font-mono text-right focus:ring-2 focus:ring-blue-500 outline-none"
                    onFocus={(e) => e.target.select()}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-slate-500 uppercase">Deductible</label>
                  <input 
                    type="number" 
                    value={financials.insurance.deductible}
                    onChange={(e) => handleFinancialChange('insurance', 'deductible', e.target.value)}
                    className="w-full mt-1 p-2 border rounded font-mono text-right focus:ring-2 focus:ring-blue-500 outline-none"
                    onFocus={(e) => e.target.select()}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase">Supplements Approved</label>
                <input 
                  type="number" 
                  value={financials.insurance.supplementsTotal}
                  onChange={(e) => handleFinancialChange('insurance', 'supplementsTotal', e.target.value)}
                  className="w-full mt-1 p-2 border rounded font-mono text-right text-emerald-600 font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                  onFocus={(e) => e.target.select()}
                />
              </div>
              <div className="pt-4 border-t">
                 <div className="flex justify-between font-bold">
                   <span>Total Revenue Potential</span>
                   <span>{formatCurrency(financials.insurance.rcvTotal + financials.insurance.supplementsTotal)}</span>
                 </div>
              </div>
            </div>
          </div>

          {/* Column 2: Costs (COGS) */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
            <div className="flex items-center space-x-2 text-amber-700 mb-2">
              <Hammer size={20} />
              <h3 className="font-bold text-lg">Job Costs (COGS)</h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase">Material Cost</label>
                <input 
                  type="number" 
                  value={financials.costs.materials}
                  onChange={(e) => handleFinancialChange('costs', 'materials', e.target.value)}
                  className="w-full mt-1 p-2 border rounded font-mono text-right focus:ring-2 focus:ring-amber-500 outline-none"
                  onFocus={(e) => e.target.select()}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase">Labor Cost</label>
                <input 
                  type="number" 
                  value={financials.costs.labor}
                  onChange={(e) => handleFinancialChange('costs', 'labor', e.target.value)}
                  className="w-full mt-1 p-2 border rounded font-mono text-right focus:ring-2 focus:ring-amber-500 outline-none"
                  onFocus={(e) => e.target.select()}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase">Other (Permits/Dumpster)</label>
                <input 
                  type="number" 
                  value={financials.costs.other}
                  onChange={(e) => handleFinancialChange('costs', 'other', e.target.value)}
                  className="w-full mt-1 p-2 border rounded font-mono text-right focus:ring-2 focus:ring-amber-500 outline-none"
                  onFocus={(e) => e.target.select()}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase">Sales Rep Commission ({financials.commissions.salesRepPct}%)</label>
                <div className="w-full mt-1 p-2 bg-slate-100 border rounded font-mono text-right text-slate-600">
                  {formatCurrency(financials.commissions.salesRepAmount)}
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Profitability (Read Only) */}
          <div className="bg-slate-900 text-white rounded-xl shadow-lg p-6 space-y-6 flex flex-col justify-center">
            <h3 className="font-bold text-lg text-center border-b border-slate-700 pb-2">Profitability Snapshot</h3>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Gross Profit</span>
                <span className="text-xl font-bold">{formatCurrency(financials.profitability.grossProfit)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Gross Margin</span>
                <span className={`text-xl font-bold px-2 py-1 rounded ${financials.profitability.grossMargin > 40 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                  {financials.profitability.grossMargin.toFixed(1)}%
                </span>
              </div>

              <div className="pt-6 border-t border-slate-700">
                <div className="text-center">
                  <span className="text-slate-400 uppercase text-xs tracking-wider">Net Profit (Company)</span>
                  <div className="text-4xl font-bold text-emerald-400 mt-2">
                    {formatCurrency(financials.profitability.netProfit)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Supplements Tab Content */}
      {activeTab === 'supplements' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Supplement Management</h2>
              <p className="text-slate-500">Track additional funds requested from insurance.</p>
            </div>
            <button 
              onClick={handleAddSupplement}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              <Plus size={18} />
              <span>Add Supplement</span>
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Reason / Description</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date Submitted</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-32">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Requested</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Approved</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-16"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {(job.supplements && job.supplements.length > 0) ? job.supplements.map((supp) => (
                    <tr key={supp.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <input 
                          type="text" 
                          value={supp.reason}
                          onChange={(e) => handleUpdateSupplement(supp.id, 'reason', e.target.value)}
                          className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none py-1 font-medium"
                          placeholder="Supplement Reason"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input 
                          type="date" 
                          value={supp.dateSubmitted}
                          onChange={(e) => handleUpdateSupplement(supp.id, 'dateSubmitted', e.target.value)}
                          className="bg-transparent text-sm text-slate-600 focus:outline-none"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <select 
                          value={supp.status}
                          onChange={(e) => handleUpdateSupplement(supp.id, 'status', e.target.value)}
                          className={`text-xs font-bold px-2 py-1 rounded-full border-0 focus:ring-2 cursor-pointer
                            ${supp.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 
                              supp.status === 'Denied' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Approved">Approved</option>
                          <option value="Denied">Denied</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="relative">
                          <span className="absolute left-0 top-1.5 text-slate-400 text-xs">$</span>
                          <input 
                            type="number" 
                            value={supp.amountRequested}
                            onChange={(e) => handleUpdateSupplement(supp.id, 'amountRequested', parseFloat(e.target.value))}
                            className="w-24 text-right bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none py-1"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="relative">
                          <span className="absolute left-0 top-1.5 text-slate-400 text-xs">$</span>
                          <input 
                            type="number" 
                            value={supp.amountApproved}
                            onChange={(e) => handleUpdateSupplement(supp.id, 'amountApproved', parseFloat(e.target.value))}
                            className="w-24 text-right bg-transparent border-b border-transparent hover:border-slate-300 focus:border-emerald-500 focus:outline-none py-1 font-bold text-emerald-700"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleDeleteSupplement(supp.id)}
                          className="text-slate-400 hover:text-red-500 transition-colors p-1"
                          title="Delete Supplement"
                        >
                          <Trash size={16} />
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                        <div className="flex flex-col items-center">
                          <AlertCircle size={32} className="mb-2 opacity-50" />
                          <p>No supplements have been added yet.</p>
                          <button onClick={handleAddSupplement} className="text-blue-600 hover:underline mt-2 text-sm">Add your first supplement</button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
                {(job.supplements && job.supplements.length > 0) && (
                  <tfoot className="bg-slate-50 font-bold text-slate-700">
                    <tr>
                      <td className="px-6 py-3" colSpan={3}>Totals</td>
                      <td className="px-6 py-3 text-right">
                        {formatCurrency(job.supplements.reduce((sum, s) => sum + (s.amountRequested || 0), 0))}
                      </td>
                      <td className="px-6 py-3 text-right text-emerald-700">
                        {formatCurrency(job.supplements.reduce((sum, s) => sum + (s.amountApproved || 0), 0))}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex items-start space-x-3 text-sm text-blue-800">
            <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Pro Tip:</p>
              <p>Once supplements are marked as <strong>Approved</strong>, remember to update the <strong>Supplements Approved</strong> field in the Financials tab to reflect the correct revenue potential.</p>
            </div>
          </div>
        </div>
      )}

      {/* Documents Tab */}
      {activeTab === 'documents' && (
        <div className="bg-white p-12 rounded-xl text-center border border-slate-200 text-slate-500">
          <FileText size={48} className="mx-auto mb-4 text-slate-300" />
          <h3 className="text-lg font-medium text-slate-900">Document Storage</h3>
          <p className="max-w-md mx-auto mt-2">Upload contracts, insurance scopes, and photos here. (File upload capability coming in next update)</p>
          <button className="mt-6 bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-200 transition-colors">
            Upload Document
          </button>
        </div>
      )}
    </div>
  );
};