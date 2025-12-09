import React, { useState } from 'react';
import { Lead, LeadStatus, Contract } from '../types';
import { Search, Filter, Plus, User, Phone, Mail, ArrowUpRight, FileText, CheckCircle, Edit } from 'lucide-react';
import { ContractModal } from './ContractModal';
import { PrintableContract } from './PrintableContract';
import { LeadModal } from './LeadModal';

interface LeadsProps {
  leads: Lead[];
  contracts: Contract[];
  onAddLead: (lead: Lead) => void;
  onUpdateLead: (lead: Lead) => void;
  onCreateContract: (contract: Contract) => void;
  onUpdateContract: (contract: Contract) => void;
  onConvertToJob: (lead: Lead, contract: Contract) => string;
}

export const Leads: React.FC<LeadsProps> = ({
  leads,
  contracts,
  onAddLead,
  onUpdateLead,
  onCreateContract,
  onUpdateContract,
  onConvertToJob
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [leadModal, setLeadModal] = useState<{
    isOpen: boolean;
    lead?: Lead;
  }>({
    isOpen: false
  });
  const [contractModal, setContractModal] = useState<{
    isOpen: boolean;
    leadId?: string;
    contract?: Contract;
  }>({
    isOpen: false
  });
  const [printContract, setPrintContract] = useState<Contract | null>(null);

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.customerInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.customerInfo.phone.includes(searchTerm) ||
      lead.customerInfo.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || lead.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: LeadStatus) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'quoted': return 'bg-purple-100 text-purple-800';
      case 'converted': return 'bg-green-100 text-green-800';
      case 'lost': return 'bg-red-100 text-red-800';
    }
  };

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
    }
  };

  const getLeadContract = (leadId: string) => {
    return contracts.find(c => c.leadId === leadId);
  };

  const handleCreateContract = (leadId: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (lead) {
      setContractModal({
        isOpen: true,
        leadId,
        contract: undefined
      });
    }
  };

  const handleEditContract = (contract: Contract) => {
    setContractModal({
      isOpen: true,
      leadId: contract.leadId,
      contract
    });
  };

  const handleSaveContract = (contract: Contract) => {
    if (contractModal.contract) {
      onUpdateContract(contract);
    } else {
      const updatedContract = { ...contract, leadId: contractModal.leadId };
      onCreateContract(updatedContract);
      
      // Update lead to reference contract
      const lead = leads.find(l => l.id === contractModal.leadId);
      if (lead) {
        onUpdateLead({
          ...lead,
          contractId: contract.id,
          status: 'quoted',
          updatedAt: new Date().toISOString()
        });
      }
    }
  };

  const handleViewContract = (contract: Contract) => {
    setPrintContract(contract);
  };

  const handleConvertToJob = (lead: Lead) => {
    const contract = getLeadContract(lead.id);
    if (contract) {
      const jobId = onConvertToJob(lead, contract);
      
      // Update lead status to converted
      onUpdateLead({
        ...lead,
        status: 'converted',
        convertedJobId: jobId,
        updatedAt: new Date().toISOString()
      });
    }
  };

  const handleCreateNewLead = () => {
    setLeadModal({ isOpen: true });
  };

  const handleEditLead = (lead: Lead) => {
    setLeadModal({ isOpen: true, lead });
  };

  const handleSaveLead = (lead: Lead) => {
    if (leadModal.lead) {
      onUpdateLead(lead);
    } else {
      onAddLead(lead);
    }
  };

  const handleUpdateStatus = (lead: Lead, newStatus: LeadStatus) => {
    onUpdateLead({
      ...lead,
      status: newStatus,
      updatedAt: new Date().toISOString(),
      lastContactDate: newStatus === 'contacted' ? new Date().toISOString() : lead.lastContactDate
    });
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-slate-900">Lead Management</h1>
          <button 
            onClick={handleCreateNewLead}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors"
          >
            <Plus size={20} />
            <span>New Lead</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Search leads..." 
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter size={20} className="text-slate-500" />
                <select 
                  className="p-2 border border-slate-300 rounded-lg outline-none"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as LeadStatus | 'all')}
                >
                  <option value="all">All Status</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="quoted">Quoted</option>
                  <option value="converted">Converted</option>
                  <option value="lost">Lost</option>
                </select>
              </div>
              <select 
                className="p-2 border border-slate-300 rounded-lg outline-none"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as 'all' | 'high' | 'medium' | 'low')}
              >
                <option value="all">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Leads Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredLeads.map((lead) => {
            const contract = getLeadContract(lead.id);
            return (
              <div key={lead.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <User size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{lead.customerInfo.name}</h3>
                      <p className="text-sm text-slate-600">{lead.source}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditLead(lead)}
                      className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                      title="Edit lead"
                    >
                      <Edit size={16} />
                    </button>
                    <div className={`w-3 h-3 rounded-full ${getPriorityColor(lead.priority)}`} title={`${lead.priority} priority`} />
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <Phone size={16} />
                    <span>{lead.customerInfo.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <Mail size={16} />
                    <span>{lead.customerInfo.email}</span>
                  </div>
                </div>

                <p className="text-sm text-slate-700 mb-4 line-clamp-2">{lead.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-bold text-green-600">
                    ${lead.estimatedValue.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-500">
                    {new Date(lead.updatedAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Contract Status */}
                <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                  {contract ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText size={16} className="text-green-600" />
                        <span className="text-sm font-medium text-green-700">Contract Created</span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewContract(contract)}
                          className="text-xs text-blue-600 hover:text-blue-700"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEditContract(contract)}
                          className="text-xs text-blue-600 hover:text-blue-700"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleCreateContract(lead.id)}
                      className="w-full flex items-center justify-center space-x-2 p-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-colors"
                    >
                      <FileText size={16} />
                      <span className="text-sm">Create Contract</span>
                    </button>
                  )}
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <select 
                    value={lead.status}
                    onChange={(e) => handleUpdateStatus(lead, e.target.value as LeadStatus)}
                    className="flex-1 p-2 text-xs border border-slate-300 rounded-lg outline-none"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="quoted">Quoted</option>
                    <option value="converted">Converted</option>
                    <option value="lost">Lost</option>
                  </select>
                  
                  {lead.status === 'quoted' && contract && (
                    <button
                      onClick={() => handleConvertToJob(lead)}
                      className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle size={14} />
                      <span>Convert</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredLeads.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <div className="mb-4 text-slate-300">
              <User size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">No Leads Found</h3>
            <p className="text-slate-500 mb-6">
              {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' 
                ? 'Try adjusting your filters to see more results.'
                : 'Get started by creating your first lead.'}
            </p>
            <button 
              onClick={handleCreateNewLead}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              Create New Lead
            </button>
          </div>
        )}
      </div>

      <LeadModal
        isOpen={leadModal.isOpen}
        onClose={() => setLeadModal({ isOpen: false })}
        onSave={handleSaveLead}
        lead={leadModal.lead}
      />

      <ContractModal
        isOpen={contractModal.isOpen}
        onClose={() => setContractModal({ isOpen: false })}
        onSave={handleSaveContract}
        contract={contractModal.contract}
        leadInfo={contractModal.leadId ? (() => {
          const lead = leads.find(l => l.id === contractModal.leadId);
          return lead ? {
            customerName: lead.customerInfo.name,
            customerAddress: lead.customerInfo.address,
            customerPhone: lead.customerInfo.phone,
            customerEmail: lead.customerInfo.email,
          } : undefined;
        })() : undefined}
      />

      {printContract && (
        <PrintableContract
          contract={printContract}
          onClose={() => setPrintContract(null)}
        />
      )}
    </>
  );
};