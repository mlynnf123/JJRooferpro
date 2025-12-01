import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Jobs } from './components/Jobs';
import { JobDetail } from './components/JobDetail';
import { FinancialReports } from './components/FinancialReports';
import { MOCK_JOBS } from './mockData';
import { Job } from './types';

function App() {
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);

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

  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard jobs={jobs} onAddJob={addJob} />} />
          <Route path="/jobs" element={<Jobs jobs={jobs} onAddJob={addJob} />} />
          <Route path="/jobs/:id" element={<JobDetail jobs={jobs} onUpdateJob={updateJob} />} />
          <Route path="/reports" element={<FinancialReports jobs={jobs} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}

export default App;