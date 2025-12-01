import React from 'react';

export type Phase = 
  | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export const PHASE_NAMES: Record<Phase, string> = {
  1: "Pre-Claim",
  2: "Filing Claim",
  3: "Adjuster Meeting",
  4: "Negotiation",
  5: "Payment Structure",
  6: "Contracting",
  7: "Materials & Scheduling",
  8: "Installation",
  9: "Final Payment",
  10: "Post-Job / Closed"
};

export interface Supplement {
  id: string;
  reason: string; // e.g. "Missed Vents", "Code Upgrade", "Hidden Damage"
  amountRequested: number;
  amountApproved: number;
  status: 'Pending' | 'Approved' | 'Denied';
  dateSubmitted: string;
  notes?: string;
}

export interface Financials {
  isLegacy?: boolean; // If true, disable auto-calc logic to preserve historical data
  insurance: {
    rcvTotal: number;
    acvTotal: number;
    depreciation: number;
    deductible: number;
    supplementsTotal: number;
  };
  payments: {
    acvReceived: number;
    rcvReceived: number;
    deductibleCollected: number;
    supplementsReceived: number;
    totalReceived: number;
  };
  costs: {
    materials: number;
    labor: number;
    other: number; // Dumpsters, permits
  };
  commissions: {
    salesRepPct: number; // e.g. 10
    salesRepAmount: number;
    paid: boolean;
  };
  profitability: {
    grossProfit: number;
    netProfit: number;
    grossMargin: number;
  };
}

export interface Job {
  id: string;
  jobNumber: string;
  client: {
    name: string;
    address: string;
    phone: string;
    email: string;
    carrier: string;
    claimNumber: string;
  };
  details: {
    stormDate: string;
    damageType: 'Hail' | 'Wind' | 'Other';
  };
  phaseTracking: {
    currentPhase: Phase;
    daysInPhase: number;
    isStuck: boolean;
  };
  financials: Financials;
  supplements: Supplement[];
  salesRep: {
    name: string;
    id: string;
  };
  timeline: {
    startDate: string;
    installDate?: string;
    completionDate?: string;
  };
}

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendColor?: 'green' | 'red' | 'neutral';
}