import React from 'react';
import { Job } from '../types';
import { formatCurrency } from '../utils';

export const FinancialReports: React.FC<{ jobs: Job[] }> = ({ jobs }) => {
  // Aggregate data for P&L
  const totalRevenue = jobs.reduce((acc, j) => acc + j.financials.insurance.rcvTotal + j.financials.insurance.supplementsTotal, 0);
  const totalMaterials = jobs.reduce((acc, j) => acc + j.financials.costs.materials, 0);
  const totalLabor = jobs.reduce((acc, j) => acc + j.financials.costs.labor, 0);
  const totalCommissions = jobs.reduce((acc, j) => acc + j.financials.commissions.salesRepAmount, 0);
  
  const grossProfit = totalRevenue - (totalMaterials + totalLabor);
  const netProfit = grossProfit - totalCommissions;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Profit & Loss Statement</h1>
      
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-200">
          <div>
             <h2 className="text-xl font-bold text-slate-900">J&J Roofing Pros</h2>
             <p className="text-slate-500">Period: Current Year to Date</p>
          </div>
          <div className="text-right">
             <div className="text-sm font-bold text-slate-400 uppercase">Net Income</div>
             <div className="text-2xl font-bold text-emerald-600">{formatCurrency(netProfit)}</div>
          </div>
        </div>

        <div className="space-y-2">
          {/* Revenue */}
          <div className="flex justify-between py-2 font-bold text-slate-800">
            <span>Total Revenue</span>
            <span>{formatCurrency(totalRevenue)}</span>
          </div>
          
          {/* COGS */}
          <div className="pl-4 space-y-2 text-sm text-slate-600">
            <div className="flex justify-between">
              <span>Materials</span>
              <span>({formatCurrency(totalMaterials)})</span>
            </div>
            <div className="flex justify-between">
              <span>Labor</span>
              <span>({formatCurrency(totalLabor)})</span>
            </div>
             <div className="flex justify-between">
              <span>Other Costs</span>
              <span>({formatCurrency(0)})</span>
            </div>
          </div>

          <div className="flex justify-between py-3 border-t border-slate-100 font-bold text-slate-700">
            <span>Gross Profit</span>
            <span>{formatCurrency(grossProfit)}</span>
          </div>

          {/* Expenses */}
           <div className="pl-4 space-y-2 text-sm text-slate-600">
            <div className="flex justify-between">
              <span>Sales Commissions</span>
              <span>({formatCurrency(totalCommissions)})</span>
            </div>
          </div>

          <div className="flex justify-between py-4 border-t-2 border-slate-800 font-bold text-xl text-slate-900 mt-4">
            <span>Net Profit</span>
            <span>{formatCurrency(netProfit)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
