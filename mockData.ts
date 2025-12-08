import { Job, Lead, Contract } from './types';

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

export const MOCK_LEADS: Lead[] = [
  {
    id: 'lead-001',
    customerInfo: {
      name: 'Sarah Johnson',
      address: '123 Maple Street, Austin, TX 78704',
      phone: '(512) 555-0101',
      email: 'sarah.johnson@email.com',
      preferredContact: 'phone'
    },
    source: 'referral',
    status: 'new',
    priority: 'high',
    estimatedValue: 25000,
    description: 'Hail damage to roof and gutters. Need full replacement.',
    notes: 'Customer mentioned they have Allstate insurance. Storm damage from last month.',
    assignedTo: 'Ian',
    createdAt: '2024-12-01T10:00:00.000Z',
    updatedAt: '2024-12-01T10:00:00.000Z'
  },
  {
    id: 'lead-002',
    customerInfo: {
      name: 'Mike Rodriguez',
      address: '456 Oak Drive, Austin, TX 78705',
      phone: '(512) 555-0102',
      email: 'mike.rodriguez@email.com',
      preferredContact: 'email'
    },
    source: 'online',
    status: 'contacted',
    priority: 'medium',
    estimatedValue: 18000,
    description: 'Wind damage to shingles on south side of house.',
    notes: 'Initial contact made. Scheduled for estimate on Friday.',
    assignedTo: 'Justin',
    createdAt: '2024-11-28T14:30:00.000Z',
    updatedAt: '2024-12-02T09:15:00.000Z',
    lastContactDate: '2024-12-02T09:15:00.000Z',
    nextFollowUp: '2024-12-06T10:00:00.000Z'
  },
  {
    id: 'lead-003',
    customerInfo: {
      name: 'Emily Chen',
      address: '789 Pine Avenue, Austin, TX 78701',
      phone: '(512) 555-0103',
      email: 'emily.chen@email.com',
      preferredContact: 'text'
    },
    source: 'advertisement',
    status: 'quoted',
    priority: 'high',
    estimatedValue: 32000,
    description: 'Complete roof replacement needed. House is 15 years old.',
    notes: 'Quote provided for $32,000. Customer is reviewing with spouse.',
    assignedTo: 'Kyle',
    contractId: 'contract-001',
    createdAt: '2024-11-25T11:00:00.000Z',
    updatedAt: '2024-12-03T16:45:00.000Z',
    lastContactDate: '2024-12-03T16:45:00.000Z'
  },
  {
    id: 'lead-004',
    customerInfo: {
      name: 'Robert Smith',
      address: '321 Cedar Lane, Austin, TX 78702',
      phone: '(512) 555-0104',
      email: 'robert.smith@email.com',
      preferredContact: 'phone'
    },
    source: 'cold-call',
    status: 'lost',
    priority: 'low',
    estimatedValue: 12000,
    description: 'Minor roof repair needed.',
    notes: 'Customer decided to go with another contractor. Price was not competitive.',
    assignedTo: 'Ian',
    createdAt: '2024-11-20T09:00:00.000Z',
    updatedAt: '2024-11-30T14:00:00.000Z',
    lastContactDate: '2024-11-30T14:00:00.000Z'
  },
  {
    id: 'lead-005',
    customerInfo: {
      name: 'Jessica Williams',
      address: '654 Elm Street, Austin, TX 78703',
      phone: '(512) 555-0105',
      email: 'jessica.williams@email.com',
      preferredContact: 'email'
    },
    source: 'referral',
    status: 'converted',
    priority: 'high',
    estimatedValue: 28500,
    description: 'Storm damage repair and gutter replacement.',
    notes: 'Converted to job JJR-2024-032. Work scheduled for next week.',
    assignedTo: 'Justin',
    contractId: 'contract-002',
    convertedJobId: 'job-032',
    createdAt: '2024-11-15T08:30:00.000Z',
    updatedAt: '2024-11-28T12:00:00.000Z',
    lastContactDate: '2024-11-28T12:00:00.000Z'
  }
];

export const MOCK_CONTRACTS: Contract[] = [
  {
    id: 'contract-001',
    leadId: 'lead-003',
    details: {
      customerName: 'Emily Chen',
      customerAddress: '789 Pine Avenue, Austin, TX 78701',
      customerPhone: '(512) 555-0103',
      customerEmail: 'emily.chen@email.com',
      companyRepName: 'Kyle Johnson',
      companyRepTitle: 'Sales Representative',
      projectDescription: 'Complete roof replacement including removal of existing shingles, installation of new underlayment, and premium architectural shingles. Includes gutters and downspouts replacement.',
      workLocation: '789 Pine Avenue, Austin, TX 78701',
      startDate: '2024-12-15',
      completionDate: '2024-12-22',
      totalAmount: 32000,
      paymentSchedule: {
        depositAmount: 3200,
        progressPayments: [
          { description: 'Materials delivery', amount: 16000 },
          { description: 'Work completion', amount: 9600 }
        ],
        finalPayment: 3200
      },
      terms: 'All work to be completed according to local building codes and manufacturer specifications. Weather delays may extend completion date.',
      warrantyInfo: '10-year workmanship warranty, 25-year material warranty as per manufacturer specifications.'
    },
    lineItems: [
      {
        id: 'item-001',
        description: 'Roof Tear-off and Disposal',
        quantity: 1,
        unitPrice: 3500,
        total: 3500,
        category: 'roofing'
      },
      {
        id: 'item-002',
        description: 'Premium Architectural Shingles Installation',
        quantity: 1,
        unitPrice: 22000,
        total: 22000,
        category: 'roofing'
      },
      {
        id: 'item-003',
        description: 'Gutter and Downspout Replacement',
        quantity: 1,
        unitPrice: 4500,
        total: 4500,
        category: 'gutter'
      },
      {
        id: 'item-004',
        description: 'Permits and Cleanup',
        quantity: 1,
        unitPrice: 2000,
        total: 2000,
        category: 'other'
      }
    ],
    signatures: {},
    status: 'draft',
    createdAt: '2024-12-03T16:45:00.000Z',
    updatedAt: '2024-12-03T16:45:00.000Z'
  },
  {
    id: 'contract-002',
    leadId: 'lead-005',
    jobId: 'job-032',
    details: {
      customerName: 'Jessica Williams',
      customerAddress: '654 Elm Street, Austin, TX 78703',
      customerPhone: '(512) 555-0105',
      customerEmail: 'jessica.williams@email.com',
      companyRepName: 'Justin Johnson',
      companyRepTitle: 'Sales Representative',
      projectDescription: 'Storm damage repair including partial roof replacement and complete gutter system replacement.',
      workLocation: '654 Elm Street, Austin, TX 78703',
      startDate: '2024-12-09',
      completionDate: '2024-12-14',
      totalAmount: 28500,
      paymentSchedule: {
        depositAmount: 2850,
        progressPayments: [
          { description: 'Materials delivery', amount: 14250 },
          { description: 'Work 75% complete', amount: 8550 }
        ],
        finalPayment: 2850
      },
      terms: 'Insurance claim work. Final payment due upon insurance adjustment completion.',
      warrantyInfo: '5-year workmanship warranty, material warranty per manufacturer specifications.'
    },
    lineItems: [
      {
        id: 'item-005',
        description: 'Storm Damage Roof Repair',
        quantity: 1,
        unitPrice: 18000,
        total: 18000,
        category: 'roofing'
      },
      {
        id: 'item-006',
        description: 'Gutter System Replacement',
        quantity: 1,
        unitPrice: 7500,
        total: 7500,
        category: 'gutter'
      },
      {
        id: 'item-007',
        description: 'Emergency Tarp and Cleanup',
        quantity: 1,
        unitPrice: 3000,
        total: 3000,
        category: 'other'
      }
    ],
    signatures: {
      company: {
        id: 'sig-001',
        dataURL: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        timestamp: '2024-11-28T12:00:00.000Z',
        signerName: 'Justin Johnson',
        signerRole: 'company'
      },
      customer1: {
        id: 'sig-002',
        dataURL: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        timestamp: '2024-11-28T12:05:00.000Z',
        signerName: 'Jessica Williams',
        signerRole: 'customer'
      }
    },
    status: 'signed',
    createdAt: '2024-11-25T10:00:00.000Z',
    updatedAt: '2024-11-28T12:05:00.000Z'
  }
];
