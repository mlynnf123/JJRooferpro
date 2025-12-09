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
  // Contract integration
  leadId?: string;
  contractId?: string;
  contractStatus?: 'none' | 'draft' | 'sent' | 'signed' | 'completed';
}

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendColor?: 'green' | 'red' | 'neutral';
}

// Contract and Lead related types
export interface Signature {
  id: string;
  dataURL: string;
  timestamp: string;
  signerName: string;
  signerRole: 'customer' | 'company';
}

export interface ContractLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  category: 'roofing' | 'gutter' | 'window' | 'other';
}

export interface ContractDetails {
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  customerEmail: string;
  companyRepName: string;
  companyRepTitle: string;
  projectDescription: string;
  workLocation: string;
  startDate: string;
  completionDate: string;
  totalAmount: number;
  paymentSchedule: {
    depositAmount: number;
    progressPayments: { description: string; amount: number }[];
    finalPayment: number;
  };
  terms: string;
  warrantyInfo: string;
  worksheetData?: {
    deductible: number;
    nonRecoverableDepreciation: number;
    upgrades: string;
    discounts: number;
    workNotDoing: string;
    remainingBalance: number;
  };
  reviewData?: {
    shingleType: string;
    existingDamage: string;
    liabilityDisclosures: {
      constructionCaution: boolean;
      drivewayUsage: boolean;
      puncturedLines: boolean;
      termsReverse: boolean;
      propertyCode: boolean;
    };
  };
  thirdPartyAuth?: {
    homeownerName: string;
    propertyAddress: string;
    insuranceCompany: string;
    claimNumber: string;
    authorizations: {
      requestInspections: boolean;
      discussSupplements: boolean;
      issuedPayment: boolean;
      requestClaimStatus: boolean;
    };
  };
}

export interface Contract {
  id: string;
  leadId?: string;
  jobId?: string;
  details: ContractDetails;
  lineItems: ContractLineItem[];
  signatures: {
    company?: Signature;
    customer1?: Signature;
    customer2?: Signature;
    customer3?: Signature;
    customer4?: Signature;
  };
  status: 'draft' | 'sent' | 'signed' | 'completed';
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export type LeadStatus = 'new' | 'contacted' | 'quoted' | 'converted' | 'lost';

export interface Lead {
  id: string;
  customerInfo: {
    name: string;
    address: string;
    phone: string;
    email: string;
    preferredContact: 'phone' | 'email' | 'text';
  };
  source: 'referral' | 'online' | 'advertisement' | 'cold-call' | 'other';
  status: LeadStatus;
  priority: 'low' | 'medium' | 'high';
  estimatedValue: number;
  description: string;
  notes: string;
  assignedTo?: string;
  contractId?: string;
  convertedJobId?: string;
  createdAt: string;
  updatedAt: string;
  lastContactDate?: string;
  nextFollowUp?: string;
}