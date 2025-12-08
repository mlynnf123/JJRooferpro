import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Jobs } from './components/Jobs';
import { JobDetail } from './components/JobDetail';
import { FinancialReports } from './components/FinancialReports';
import { Leads } from './components/Leads';
import { MOCK_JOBS, MOCK_LEADS, MOCK_CONTRACTS } from './mockData';
import { Job, Lead, Contract } from './types';

function App() {
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [contracts, setContracts] = useState<Contract[]>(MOCK_CONTRACTS);

  const updateJob = (updatedJob: Job) => {
    setJobs(prev => prev.map(j => j.id === updatedJob.id ? updatedJob : j));
  };

  const addJob = () => {
    const newJob: Job = {
      id: crypto.randomUUID(),
      jobNumber: `JJR-${new Date().getFullYear()}-${String(jobs.length + 1).padStart(3, '0')}`,
      client: {
        name: 'New Client',
        address: '',
        phone: '',
        email: '',
        carrier: '',
        claimNumber: '',
      },
      details: {
        stormDate: new Date().toISOString().split('T')[0],
        damageType: 'Hail',
      },
      phaseTracking: {
        currentPhase: 1,
        daysInPhase: 0,
        isStuck: false,
      },
      supplements: [],
      salesRep: { name: '', id: '' },
      timeline: { startDate: new Date().toISOString().split('T')[0] },
      financials: {
        insurance: { rcvTotal: 0, acvTotal: 0, depreciation: 0, deductible: 0, supplementsTotal: 0 },
        payments: { acvReceived: 0, rcvReceived: 0, deductibleCollected: 0, supplementsReceived: 0, totalReceived: 0 },
        costs: { materials: 0, labor: 0, other: 0 },
        commissions: { salesRepPct: 10, salesRepAmount: 0, paid: false },
        profitability: { grossProfit: 0, netProfit: 0, grossMargin: 0 }
      }
    };
    
    setJobs(prev => [newJob, ...prev]);
    return newJob.id;
  };

  // Lead management functions
  const addLead = () => {
    const newLead: Lead = {
      id: crypto.randomUUID(),
      customerInfo: {
        name: 'New Customer',
        address: '',
        phone: '',
        email: '',
        preferredContact: 'phone'
      },
      source: 'other',
      status: 'new',
      priority: 'medium',
      estimatedValue: 0,
      description: '',
      notes: '',
      assignedTo: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setLeads(prev => [newLead, ...prev]);
  };

  const updateLead = (updatedLead: Lead) => {
    setLeads(prev => prev.map(l => l.id === updatedLead.id ? updatedLead : l));
  };

  // Contract management functions
  const createContract = (contract: Contract) => {
    setContracts(prev => [contract, ...prev]);
  };

  const updateContract = (updatedContract: Contract) => {
    setContracts(prev => prev.map(c => c.id === updatedContract.id ? updatedContract : c));
  };

  // Convert lead to job
  const convertToJob = (lead: Lead, contract: Contract): string => {
    const newJob: Job = {
      id: crypto.randomUUID(),
      jobNumber: `JJR-${new Date().getFullYear()}-${String(jobs.length + 1).padStart(3, '0')}`,
      client: {
        name: lead.customerInfo.name,
        address: lead.customerInfo.address,
        phone: lead.customerInfo.phone,
        email: lead.customerInfo.email,
        carrier: '',
        claimNumber: '',
      },
      details: {
        stormDate: new Date().toISOString().split('T')[0],
        damageType: 'Hail',
      },
      phaseTracking: {
        currentPhase: 6, // Start at contracting phase
        daysInPhase: 0,
        isStuck: false,
      },
      supplements: [],
      salesRep: { 
        name: lead.assignedTo || '', 
        id: lead.assignedTo?.toLowerCase() || '' 
      },
      timeline: { 
        startDate: contract.details.startDate 
      },
      financials: {
        insurance: { 
          rcvTotal: contract.details.totalAmount, 
          acvTotal: contract.details.totalAmount * 0.6, 
          depreciation: contract.details.totalAmount * 0.4, 
          deductible: 0, 
          supplementsTotal: 0 
        },
        payments: { 
          acvReceived: 0, 
          rcvReceived: 0, 
          deductibleCollected: 0, 
          supplementsReceived: 0, 
          totalReceived: 0 
        },
        costs: { 
          materials: 0, 
          labor: 0, 
          other: 0 
        },
        commissions: { 
          salesRepPct: 10, 
          salesRepAmount: contract.details.totalAmount * 0.1, 
          paid: false 
        },
        profitability: { 
          grossProfit: 0, 
          netProfit: 0, 
          grossMargin: 0 
        }
      },
      leadId: lead.id,
      contractId: contract.id,
      contractStatus: contract.status
    };
    
    setJobs(prev => [newJob, ...prev]);
    
    // Update contract to reference the new job
    const updatedContract = { ...contract, jobId: newJob.id };
    updateContract(updatedContract);
    
    return newJob.id;
  };

  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard jobs={jobs} onAddJob={addJob} />} />
          <Route path="/jobs" element={<Jobs jobs={jobs} contracts={contracts} onAddJob={addJob} />} />
          <Route path="/jobs/:id" element={<JobDetail jobs={jobs} onUpdateJob={updateJob} />} />
          <Route path="/leads" element={
            <Leads 
              leads={leads} 
              contracts={contracts} 
              onAddLead={addLead} 
              onUpdateLead={updateLead} 
              onCreateContract={createContract} 
              onUpdateContract={updateContract} 
              onConvertToJob={convertToJob} 
            />
          } />
          <Route path="/reports" element={<FinancialReports jobs={jobs} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}

export default App;