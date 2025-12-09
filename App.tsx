import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Jobs } from './components/Jobs';
import { JobDetail } from './components/JobDetail';
import { FinancialReports } from './components/FinancialReports';
import { Leads } from './components/Leads';
import { MOCK_JOBS } from './mockData';
import { Job, Lead, Contract } from './types';
import { leadOperations, contractOperations, testDatabaseConnection } from './lib/database';

function App() {
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbConnected, setDbConnected] = useState(false);

  // Initialize database connection and load data
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Test database connection
        const connected = await testDatabaseConnection();
        setDbConnected(connected);

        if (connected) {
          // Load leads and contracts from database
          const [leadsData, contractsData] = await Promise.all([
            leadOperations.getAll(),
            contractOperations.getAll(),
          ]);
          
          setLeads(leadsData);
          setContracts(contractsData);
        }
      } catch (error) {
        setDbConnected(false);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

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
  const addLead = async (lead: Lead) => {
    try {
      if (dbConnected) {
        const savedLead = await leadOperations.create(lead);
        setLeads(prev => [savedLead, ...prev]);
      } else {
        setLeads(prev => [lead, ...prev]);
      }
    } catch (error) {
      setLeads(prev => [lead, ...prev]);
    }
  };

  const updateLead = async (updatedLead: Lead) => {
    try {
      if (dbConnected) {
        const savedLead = await leadOperations.update(updatedLead.id, updatedLead);
        setLeads(prev => prev.map(l => l.id === updatedLead.id ? savedLead : l));
      } else {
        setLeads(prev => prev.map(l => l.id === updatedLead.id ? updatedLead : l));
      }
    } catch (error) {
      setLeads(prev => prev.map(l => l.id === updatedLead.id ? updatedLead : l));
    }
  };

  // Contract management functions
  const createContract = async (contract: Contract) => {
    try {
      if (dbConnected) {
        const savedContract = await contractOperations.create(contract);
        setContracts(prev => [savedContract, ...prev]);
      } else {
        setContracts(prev => [contract, ...prev]);
      }
    } catch (error) {
      setContracts(prev => [contract, ...prev]);
    }
  };

  const updateContract = async (updatedContract: Contract) => {
    try {
      if (dbConnected) {
        const savedContract = await contractOperations.update(updatedContract.id, updatedContract);
        setContracts(prev => prev.map(c => c.id === updatedContract.id ? savedContract : c));
      } else {
        setContracts(prev => prev.map(c => c.id === updatedContract.id ? updatedContract : c));
      }
    } catch (error) {
      setContracts(prev => prev.map(c => c.id === updatedContract.id ? updatedContract : c));
    }
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

  // Show loading spinner while initializing
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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