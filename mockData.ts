import { Job } from './types';

// Helper to create historical job
const createHistoricalJob = (
  id: number,
  clientName: string,
  address: string,
  repName: string,
  startDate: string,
  laborCost: number,
  materialCost: number,
  revenue: number, // "Payout" from CSV
  grossProfit: number, // "Profit" from CSV
  repComm: number,
  netProfit: number, // "JJ Profit"
  paid: boolean,
  completedDate?: string
): Job => {
  return {
    id: `legacy-${id}`,
    jobNumber: `JJR-LEGACY-${String(id).padStart(3, '0')}`,
    client: {
      name: clientName,
      address: address || 'No Address',
      phone: '',
      email: '',
      carrier: 'Unknown',
      claimNumber: '',
    },
    details: {
      stormDate: '2025-01-01', // Default for legacy
      damageType: 'Hail',
    },
    phaseTracking: {
      currentPhase: completedDate ? 10 : 8, // If completed date exists, phase 10, else 8 (Install)
      daysInPhase: 0,
      isStuck: false,
    },
    supplements: [],
    salesRep: {
      name: repName || 'Unassigned',
      id: repName?.toLowerCase() || 'unknown',
    },
    timeline: {
      startDate: startDate || new Date().toISOString().split('T')[0],
      completionDate: completedDate
    },
    financials: {
      isLegacy: true,
      insurance: {
        rcvTotal: revenue,
        acvTotal: revenue * 0.6, // Estimate
        depreciation: revenue * 0.4, // Estimate
        deductible: 0,
        supplementsTotal: 0,
      },
      payments: {
        acvReceived: 0,
        rcvReceived: 0,
        deductibleCollected: 0,
        supplementsReceived: 0,
        totalReceived: revenue, // Assuming fully paid for legacy record ease
      },
      costs: {
        materials: materialCost,
        labor: laborCost,
        other: 0,
      },
      commissions: {
        salesRepPct: 0, // Legacy is fixed amount
        salesRepAmount: repComm,
        paid: paid,
      },
      profitability: {
        grossProfit: grossProfit,
        netProfit: netProfit,
        grossMargin: revenue > 0 ? (grossProfit / revenue) * 100 : 0,
      }
    }
  };
};

export const MOCK_JOBS: Job[] = [
  createHistoricalJob(1, "Charlie Dao", "12401 tinker dr", "Justin", "2025-05-19", 1500.00, 7557.75, 0, 0, 0, 0, false, "2025-05-19"),
  createHistoricalJob(2, "Donald Lyon", "13005 Tinker dr", "Justin", "2025-05-23", 3925.00, 5450.92, 0, 0, 0, 0, false, "2025-05-23"),
  createHistoricalJob(3, "Landon Tourne", "13009 Tinker dr", "Justin", "2025-05-24", 2000.00, 6303.90, 0, 0, 0, 0, false, "2025-05-24"),
  createHistoricalJob(4, "Maria Hernandez", "811 Kettering Dr", "Ian", "", 2465.00, 6152.48, 13646.81, 5029.33, 3520.53, 1508.80, true),
  createHistoricalJob(5, "David Bagacina", "804 Timber trail", "Ian", "", 2360.00, 4860.96, 16200.00, 8979.04, 6285.33, 2693.71, false),
  createHistoricalJob(6, "Luther Oliver", "2411 Aspen Meadow", "Ian", "", 4449.00, 9396.95, 27650.00, 13804.05, 9662.84, 4141.22, true),
  createHistoricalJob(7, "Frank S", "2406 Aspen Meadow", "Ian", "", 4317.00, 9078.16, 27606.00, 14210.84, 9947.59, 4263.25, false),
  createHistoricalJob(8, "Jae Lee", "2418 Glen Field dr", "Ian", "", 2100.00, 5004.01, 11414.05, 4310.04, 3017.03, 1293.01, false),
  createHistoricalJob(9, "Yuhan Zho", "907 Petaluma Dr", "Ian", "", 3224.00, 7001.27, 17190.49, 6965.22, 4875.65, 2089.57, false),
  createHistoricalJob(10, "Robert & Elsa Garza", "10204 Channel island dr", "Justin", "", 3240.00, 6916.51, 21525.00, 11368.49, 7957.94, 3410.55, false),
  createHistoricalJob(11, "Rod Fluker", "1700 Broadmore dr", "Justin", "", 25345.00, 0, 33141.00, 7796.00, 5457.20, 2338.80, true),
  createHistoricalJob(12, "John Delaney", "205 jackrabbit dr", "Kyle", "", 5853.00, 0, 10700.00, 4847.00, 0, 0, true),
  createHistoricalJob(13, "Jose Vega", "1704 adina", "Kyle", "", 1995.00, 3219.72, 0, 0, 0, 0, false),
  createHistoricalJob(14, "John Allen", "413 clear shadow cove", "Ian", "", 5310.00, 11480.13, 25300.00, 8509.87, 5956.91, 2552.96, true),
  createHistoricalJob(15, "Tim Bulgrin", "2504 Lost mine trail", "Ian", "", 3870.00, 7692.19, 15150.00, 3587.81, 2511.47, 1076.34, false),
  createHistoricalJob(16, "Julie Wiley", "", "Ian", "", 122000.00, 0, 200000.00, 78000.00, 54600.00, 23400.00, false),
  createHistoricalJob(17, "Annissa", "", "Ian", "", 4230.00, 9036.33, 23315.72, 10049.39, 7034.57, 3014.82, false),
  createHistoricalJob(18, "Amy", "", "Ian/Justin", "2025-10-07", 4230.00, 10507.06, 22862.43, 8125.37, 5687.76, 2437.61, false),
  createHistoricalJob(19, "Mohit", "", "Ian", "", 7195.82, 10092.06, 23176.94, 5889.06, 4122.34, 1766.72, true),
  createHistoricalJob(20, "Tam", "", "Ian", "", 4750.00, 0, 28921.00, 14939.5, 10457.65, 4481.85, false),
  createHistoricalJob(21, "Michael Hu", "", "Ian", "2025-09-18", 5000.00, 9023.13, 24500.00, 7976.87, 5583.81, 2393.06, true),
  createHistoricalJob(22, "Michael Van Luven", "1216 Shadow Creek Blvd", "Kyle", "2025-09-18", 4525.81, 0, 8000.00, 3474.19, 0, 0, false),
  createHistoricalJob(23, "Ozumba- home", "", "Ian/Collier", "2025-10-08", 2280.00, 4267.42, 11000.00, 4452.58, 2627.02, 1825.56, false),
  createHistoricalJob(24, "Doug Eckel", "404 clear shadow", "Ian", "", 6200.00, 12748.29, 30000.00, 11051.71, 7736.20, 3315.51, false),
  createHistoricalJob(25, "Alex Do", "", "Ian", "", 4230.00, 9960.58, 23462.50, 9271.92, 6490.34, 2781.58, false),
  createHistoricalJob(26, "Nathan Powell", "310 Parkwest drive", "Justin", "2025-09-29", 6000.00, 10950.26, 35222.49, 18272.23, 12790.56, 5481.67, true),
  createHistoricalJob(27, "Matt Gonzalez", "12045 Riparian Road", "Justin", "2025-09-19", 3240.00, 6022.76, 14529.22, 5266.49, 3686.54, 1579.95, false),
  createHistoricalJob(28, "Elton Fite", "140 Diamondback Drive", "Kyle", "2025-10-27", 3150.00, 5935.32, 16816.80, 7731.48, 2783.33, 4948.15, false),
  createHistoricalJob(29, "Arjurn Thippeswamy", "108 Summer Park Bend", "Ian", "", 3800.00, 8887.02, 21435.81, 8748.79, 6124.15, 2624.64, true),
  createHistoricalJob(30, "Victor Lapinskii", "1501 Serene oaks dr", "Kyle", "", 2880.00, 6961.94, 17197.49, 7355.55, 3310.00, 4045.55, true),
  createHistoricalJob(31, "Uzomba- Commercial", "2200 S Bagdad", "Ian", "2025-12-01", 0, 7513.60, 18480.00, 10966.40, 7676.48, 3289.92, false),
];
