import { supabase } from './supabase';
import type { Database } from '../types/database.types';
import { Lead, Contract, Job } from '../types';

// Type aliases for database types
type LeadRow = Database['public']['Tables']['leads']['Row'];
type ContractRow = Database['public']['Tables']['contracts']['Row'];
type JobRow = Database['public']['Tables']['jobs']['Row'];
type SalesRepRow = Database['public']['Tables']['sales_reps']['Row'];

// Transformation functions to convert database rows to app types
export const transformLead = (row: LeadRow): Lead => ({
  id: row.id,
  customerInfo: {
    name: row.customer_name,
    address: row.customer_address || '',
    phone: row.customer_phone,
    email: row.customer_email || '',
    preferredContact: row.preferred_contact,
  },
  source: row.source,
  status: row.status,
  priority: row.priority,
  estimatedValue: Number(row.estimated_value),
  description: row.description,
  notes: row.notes || '',
  assignedTo: row.assigned_to || '',
  contractId: row.contract_id || undefined,
  convertedJobId: row.converted_job_id || undefined,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  lastContactDate: row.last_contact_date || undefined,
  nextFollowUp: row.next_follow_up || undefined,
});

export const transformContract = (row: ContractRow, lineItems: any[] = []): Contract => ({
  id: row.id,
  leadId: row.lead_id || undefined,
  jobId: row.job_id || undefined,
  details: {
    customerName: row.customer_name,
    customerAddress: row.customer_address,
    customerPhone: row.customer_phone,
    customerEmail: row.customer_email || '',
    companyRepName: row.company_rep_name,
    companyRepTitle: row.company_rep_title,
    projectDescription: row.project_description,
    workLocation: row.work_location,
    startDate: row.start_date,
    completionDate: row.completion_date,
    totalAmount: Number(row.total_amount),
    paymentSchedule: {
      depositAmount: Number(row.deposit_amount),
      progressPayments: [],
      finalPayment: Number(row.final_payment),
    },
    terms: row.terms,
    warrantyInfo: row.warranty_info,
    thirdPartyAuth: row.third_party_auth as any,
  },
  lineItems: lineItems.map(item => ({
    id: item.id,
    description: item.description,
    quantity: item.quantity,
    unitPrice: Number(item.unit_price),
    total: Number(item.total),
    category: item.category,
  })),
  signatures: (row.signatures as any) || {},
  status: row.status,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  notes: row.notes || undefined,
});

// Lead operations
export const leadOperations = {
  async getAll(): Promise<Lead[]> {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(transformLead);
  },

  async create(lead: Lead): Promise<Lead> {
    const { data, error } = await supabase
      .from('leads')
      .insert({
        customer_name: lead.customerInfo.name,
        customer_address: lead.customerInfo.address,
        customer_phone: lead.customerInfo.phone,
        customer_email: lead.customerInfo.email,
        preferred_contact: lead.customerInfo.preferredContact,
        source: lead.source,
        status: lead.status,
        priority: lead.priority,
        estimated_value: lead.estimatedValue,
        description: lead.description,
        notes: lead.notes,
        assigned_to: lead.assignedTo || null,
        contract_id: lead.contractId || null,
        converted_job_id: lead.convertedJobId || null,
        last_contact_date: lead.lastContactDate || null,
        next_follow_up: lead.nextFollowUp || null,
      })
      .select()
      .single();

    if (error) throw error;
    return transformLead(data);
  },

  async update(id: string, updates: Partial<Lead>): Promise<Lead> {
    const updateData: any = {};
    
    if (updates.customerInfo) {
      updateData.customer_name = updates.customerInfo.name;
      updateData.customer_address = updates.customerInfo.address;
      updateData.customer_phone = updates.customerInfo.phone;
      updateData.customer_email = updates.customerInfo.email;
      updateData.preferred_contact = updates.customerInfo.preferredContact;
    }
    
    if (updates.source) updateData.source = updates.source;
    if (updates.status) updateData.status = updates.status;
    if (updates.priority) updateData.priority = updates.priority;
    if (updates.estimatedValue !== undefined) updateData.estimated_value = updates.estimatedValue;
    if (updates.description) updateData.description = updates.description;
    if (updates.notes !== undefined) updateData.notes = updates.notes;
    if (updates.assignedTo !== undefined) updateData.assigned_to = updates.assignedTo;
    if (updates.contractId !== undefined) updateData.contract_id = updates.contractId;
    if (updates.convertedJobId !== undefined) updateData.converted_job_id = updates.convertedJobId;
    if (updates.lastContactDate !== undefined) updateData.last_contact_date = updates.lastContactDate;
    if (updates.nextFollowUp !== undefined) updateData.next_follow_up = updates.nextFollowUp;

    const { data, error } = await supabase
      .from('leads')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return transformLead(data);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

// Contract operations
export const contractOperations = {
  async getAll(): Promise<Contract[]> {
    const { data: contracts, error: contractsError } = await supabase
      .from('contracts')
      .select('*')
      .order('created_at', { ascending: false });

    if (contractsError) throw contractsError;

    const { data: lineItems, error: lineItemsError } = await supabase
      .from('contract_line_items')
      .select('*');

    if (lineItemsError) throw lineItemsError;

    return contracts.map(contract => {
      const contractLineItems = lineItems.filter(item => item.contract_id === contract.id);
      return transformContract(contract, contractLineItems);
    });
  },

  async create(contract: Contract): Promise<Contract> {
    const { data: contractData, error: contractError } = await supabase
      .from('contracts')
      .insert({
        lead_id: contract.leadId || null,
        job_id: contract.jobId || null,
        customer_name: contract.details.customerName,
        customer_address: contract.details.customerAddress,
        customer_phone: contract.details.customerPhone,
        customer_email: contract.details.customerEmail,
        company_rep_name: contract.details.companyRepName,
        company_rep_title: contract.details.companyRepTitle,
        project_description: contract.details.projectDescription,
        work_location: contract.details.workLocation,
        start_date: contract.details.startDate,
        completion_date: contract.details.completionDate,
        total_amount: contract.details.totalAmount,
        deposit_amount: contract.details.paymentSchedule.depositAmount,
        final_payment: contract.details.paymentSchedule.finalPayment,
        terms: contract.details.terms,
        warranty_info: contract.details.warrantyInfo,
        third_party_auth: contract.details.thirdPartyAuth || null,
        signatures: contract.signatures || null,
        status: contract.status,
        notes: contract.notes || null,
      })
      .select()
      .single();

    if (contractError) throw contractError;

    // Insert line items
    if (contract.lineItems.length > 0) {
      const { error: lineItemsError } = await supabase
        .from('contract_line_items')
        .insert(
          contract.lineItems.map(item => ({
            contract_id: contractData.id,
            description: item.description,
            quantity: item.quantity,
            unit_price: item.unitPrice,
            total: item.total,
            category: item.category,
          }))
        );

      if (lineItemsError) throw lineItemsError;
    }

    return transformContract(contractData, contract.lineItems);
  },

  async update(id: string, updates: Partial<Contract>): Promise<Contract> {
    const updateData: any = {};
    
    if (updates.details) {
      updateData.customer_name = updates.details.customerName;
      updateData.customer_address = updates.details.customerAddress;
      updateData.customer_phone = updates.details.customerPhone;
      updateData.customer_email = updates.details.customerEmail;
      updateData.company_rep_name = updates.details.companyRepName;
      updateData.company_rep_title = updates.details.companyRepTitle;
      updateData.project_description = updates.details.projectDescription;
      updateData.work_location = updates.details.workLocation;
      updateData.start_date = updates.details.startDate;
      updateData.completion_date = updates.details.completionDate;
      updateData.total_amount = updates.details.totalAmount;
      updateData.deposit_amount = updates.details.paymentSchedule.depositAmount;
      updateData.final_payment = updates.details.paymentSchedule.finalPayment;
      updateData.terms = updates.details.terms;
      updateData.warranty_info = updates.details.warrantyInfo;
      updateData.third_party_auth = updates.details.thirdPartyAuth;
    }
    
    if (updates.signatures) updateData.signatures = updates.signatures;
    if (updates.status) updateData.status = updates.status;
    if (updates.notes !== undefined) updateData.notes = updates.notes;

    const { data, error } = await supabase
      .from('contracts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Handle line items updates if provided
    if (updates.lineItems) {
      // Delete existing line items
      await supabase
        .from('contract_line_items')
        .delete()
        .eq('contract_id', id);

      // Insert new line items
      if (updates.lineItems.length > 0) {
        await supabase
          .from('contract_line_items')
          .insert(
            updates.lineItems.map(item => ({
              contract_id: id,
              description: item.description,
              quantity: item.quantity,
              unit_price: item.unitPrice,
              total: item.total,
              category: item.category,
            }))
          );
      }
    }

    return transformContract(data, updates.lineItems || []);
  },
};

// Sales rep operations
export const salesRepOperations = {
  async getAll(): Promise<SalesRepRow[]> {
    const { data, error } = await supabase
      .from('sales_reps')
      .select('*')
      .eq('active', true)
      .order('name');

    if (error) throw error;
    return data;
  },
};

// Test database connection
export const testDatabaseConnection = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('sales_reps')
      .select('count')
      .limit(1);
    
    if (error) throw error;
    return true;
  } catch (error) {
    return false;
  }
};