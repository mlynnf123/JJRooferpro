import { Job, Financials } from './types';

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const calculateProfitability = (financials: Financials): Financials => {
  const { insurance, costs, commissions, payments, isLegacy } = financials;
  
  // Total Revenue Potential = RCV + Supplements
  const totalRevenue = insurance.rcvTotal + insurance.supplementsTotal;
  const totalCosts = costs.materials + costs.labor + costs.other;
  const grossProfit = totalRevenue - totalCosts;
  const grossMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;
  
  // IF LEGACY: Return as is, or only update derived totals that don't change history
  if (isLegacy) {
    const totalReceived = payments.acvReceived + payments.rcvReceived + payments.deductibleCollected + payments.supplementsReceived;
    return {
      ...financials,
      payments: {
        ...payments,
        totalReceived
      },
      profitability: {
        ...financials.profitability, // Keep historical profit numbers exactly as imported
        grossMargin // Update margin percent just in case
      }
    };
  }

  // STANDARD CALCULATION (For new jobs)
  // Commission Model: Percentage of Revenue (Simplified for new jobs, unless specific split logic added)
  const calculatedCommission = (totalRevenue * (commissions.salesRepPct / 100));
  const netProfit = grossProfit - calculatedCommission;
  const totalReceived = payments.acvReceived + payments.rcvReceived + payments.deductibleCollected + payments.supplementsReceived;

  return {
    ...financials,
    payments: {
      ...payments,
      totalReceived
    },
    commissions: {
      ...commissions,
      salesRepAmount: calculatedCommission
    },
    profitability: {
      grossProfit,
      netProfit,
      grossMargin
    }
  };
};

export const getPhaseColor = (phase: number) => {
  if (phase <= 3) return 'bg-blue-100 text-blue-800 border-blue-200'; // Intake
  if (phase <= 6) return 'bg-amber-100 text-amber-800 border-amber-200'; // Negotiation
  if (phase <= 8) return 'bg-purple-100 text-purple-800 border-purple-200'; // Build
  return 'bg-emerald-100 text-emerald-800 border-emerald-200'; // Closeout
};