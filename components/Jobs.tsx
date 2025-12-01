import React, { useState } from 'react';
import { Job, PHASE_NAMES } from '../types';
import { getPhaseColor, formatCurrency } from '../utils';
import { Search, Filter, ChevronRight, AlertCircle, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface JobsProps {
  jobs: Job[];
  onAddJob: () => string;
}

export const Jobs: React.FC<JobsProps> = ({ jobs, onAddJob }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [phaseFilter, setPhaseFilter] = useState<string>('all');

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.jobNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPhase = phaseFilter === 'all' ? true : job.phaseTracking.currentPhase.toString() === phaseFilter;
    return matchesSearch && matchesPhase;
  });

  const handleCreateJob = () => {
    const newId = onAddJob();
    navigate(`/jobs/${newId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Job Management</h1>
        <button 
          onClick={handleCreateJob}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors"
        >
          <Plus size={20} />
          <span>New Job</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search clients, job numbers..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2 min-w-[200px]">
          <Filter size={20} className="text-slate-500" />
          <select 
            className="flex-1 p-2 border border-slate-300 rounded-lg outline-none"
            value={phaseFilter}
            onChange={(e) => setPhaseFilter(e.target.value)}
          >
            <option value="all">All Phases</option>
            {Object.entries(PHASE_NAMES).map(([key, val]) => (
              <option key={key} value={key}>{val}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Job List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {jobs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Job Details</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Phase</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Financials</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Rep</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => navigate(`/jobs/${job.id}`)}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {job.phaseTracking.isStuck && (
                          <AlertCircle size={16} className="text-red-500 mr-2" title="Stuck > 7 Days" />
                        )}
                        <div>
                          <div className="font-bold text-slate-900">{job.client.name}</div>
                          <div className="text-sm text-slate-500">{job.address || 'No Address Listed'}</div>
                          <div className="text-xs text-slate-400 mt-1">{job.jobNumber} • {job.client.carrier || 'Unknown Carrier'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPhaseColor(job.phaseTracking.currentPhase)}`}>
                        Phase {job.phaseTracking.currentPhase}: {PHASE_NAMES[job.phaseTracking.currentPhase]}
                      </span>
                      <div className="text-xs text-slate-400 mt-1">{job.phaseTracking.daysInPhase} days in phase</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{formatCurrency(job.financials.insurance.rcvTotal)}</div>
                      <div className={`text-xs font-medium ${job.financials.profitability.grossMargin > 35 ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {job.financials.profitability.grossMargin.toFixed(1)}% Margin
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-900">{job.salesRep.name || 'Unassigned'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <ChevronRight className="text-slate-400" size={20} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-500">
            <div className="mb-4 text-slate-300">
              <Filter size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">No Jobs Found</h3>
            <p className="mb-6">Get started by creating your first job record.</p>
            <button 
              onClick={handleCreateJob}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              Create New Job
            </button>
          </div>
        )}
      </div>
    </div>
  );
};