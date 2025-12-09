export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      // Sales Representatives
      sales_reps: {
        Row: {
          id: string
          name: string
          email: string | null
          phone: string | null
          commission_rate: number
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email?: string | null
          phone?: string | null
          commission_rate?: number
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string | null
          phone?: string | null
          commission_rate?: number
          active?: boolean
          updated_at?: string
        }
      }
      
      // Leads
      leads: {
        Row: {
          id: string
          customer_name: string
          customer_address: string | null
          customer_phone: string
          customer_email: string | null
          preferred_contact: 'phone' | 'email' | 'text'
          source: 'referral' | 'online' | 'advertisement' | 'cold-call' | 'other'
          status: 'new' | 'contacted' | 'quoted' | 'converted' | 'lost'
          priority: 'low' | 'medium' | 'high'
          estimated_value: number
          description: string
          notes: string | null
          assigned_to: string | null
          contract_id: string | null
          converted_job_id: string | null
          created_at: string
          updated_at: string
          last_contact_date: string | null
          next_follow_up: string | null
        }
        Insert: {
          id?: string
          customer_name: string
          customer_address?: string | null
          customer_phone: string
          customer_email?: string | null
          preferred_contact?: 'phone' | 'email' | 'text'
          source: 'referral' | 'online' | 'advertisement' | 'cold-call' | 'other'
          status?: 'new' | 'contacted' | 'quoted' | 'converted' | 'lost'
          priority?: 'low' | 'medium' | 'high'
          estimated_value: number
          description: string
          notes?: string | null
          assigned_to?: string | null
          contract_id?: string | null
          converted_job_id?: string | null
          created_at?: string
          updated_at?: string
          last_contact_date?: string | null
          next_follow_up?: string | null
        }
        Update: {
          customer_name?: string
          customer_address?: string | null
          customer_phone?: string
          customer_email?: string | null
          preferred_contact?: 'phone' | 'email' | 'text'
          source?: 'referral' | 'online' | 'advertisement' | 'cold-call' | 'other'
          status?: 'new' | 'contacted' | 'quoted' | 'converted' | 'lost'
          priority?: 'low' | 'medium' | 'high'
          estimated_value?: number
          description?: string
          notes?: string | null
          assigned_to?: string | null
          contract_id?: string | null
          converted_job_id?: string | null
          updated_at?: string
          last_contact_date?: string | null
          next_follow_up?: string | null
        }
      }

      // Contracts
      contracts: {
        Row: {
          id: string
          lead_id: string | null
          job_id: string | null
          customer_name: string
          customer_address: string
          customer_phone: string
          customer_email: string | null
          company_rep_name: string
          company_rep_title: string
          project_description: string
          work_location: string
          start_date: string
          completion_date: string
          total_amount: number
          deposit_amount: number
          final_payment: number
          terms: string
          warranty_info: string
          third_party_auth: Json | null
          signatures: Json | null
          status: 'draft' | 'sent' | 'signed' | 'completed'
          created_at: string
          updated_at: string
          notes: string | null
        }
        Insert: {
          id?: string
          lead_id?: string | null
          job_id?: string | null
          customer_name: string
          customer_address: string
          customer_phone: string
          customer_email?: string | null
          company_rep_name: string
          company_rep_title: string
          project_description: string
          work_location: string
          start_date: string
          completion_date: string
          total_amount: number
          deposit_amount: number
          final_payment: number
          terms: string
          warranty_info: string
          third_party_auth?: Json | null
          signatures?: Json | null
          status?: 'draft' | 'sent' | 'signed' | 'completed'
          created_at?: string
          updated_at?: string
          notes?: string | null
        }
        Update: {
          lead_id?: string | null
          job_id?: string | null
          customer_name?: string
          customer_address?: string
          customer_phone?: string
          customer_email?: string | null
          company_rep_name?: string
          company_rep_title?: string
          project_description?: string
          work_location?: string
          start_date?: string
          completion_date?: string
          total_amount?: number
          deposit_amount?: number
          final_payment?: number
          terms?: string
          warranty_info?: string
          third_party_auth?: Json | null
          signatures?: Json | null
          status?: 'draft' | 'sent' | 'signed' | 'completed'
          updated_at?: string
          notes?: string | null
        }
      }

      // Contract Line Items
      contract_line_items: {
        Row: {
          id: string
          contract_id: string
          description: string
          quantity: number
          unit_price: number
          total: number
          category: 'roofing' | 'gutter' | 'window' | 'other'
          created_at: string
        }
        Insert: {
          id?: string
          contract_id: string
          description: string
          quantity: number
          unit_price: number
          total: number
          category: 'roofing' | 'gutter' | 'window' | 'other'
          created_at?: string
        }
        Update: {
          description?: string
          quantity?: number
          unit_price?: number
          total?: number
          category?: 'roofing' | 'gutter' | 'window' | 'other'
        }
      }

      // Jobs
      jobs: {
        Row: {
          id: string
          job_number: string
          client_name: string
          client_address: string | null
          client_phone: string | null
          client_email: string | null
          client_carrier: string | null
          claim_number: string | null
          storm_date: string | null
          damage_type: 'Hail' | 'Wind' | 'Other'
          current_phase: number
          days_in_phase: number
          is_stuck: boolean
          start_date: string | null
          install_date: string | null
          completion_date: string | null
          lead_id: string | null
          contract_id: string | null
          contract_status: 'none' | 'draft' | 'sent' | 'signed' | 'completed' | null
          assigned_sales_rep: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          job_number: string
          client_name: string
          client_address?: string | null
          client_phone?: string | null
          client_email?: string | null
          client_carrier?: string | null
          claim_number?: string | null
          storm_date?: string | null
          damage_type?: 'Hail' | 'Wind' | 'Other'
          current_phase?: number
          days_in_phase?: number
          is_stuck?: boolean
          start_date?: string | null
          install_date?: string | null
          completion_date?: string | null
          lead_id?: string | null
          contract_id?: string | null
          contract_status?: 'none' | 'draft' | 'sent' | 'signed' | 'completed' | null
          assigned_sales_rep?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          job_number?: string
          client_name?: string
          client_address?: string | null
          client_phone?: string | null
          client_email?: string | null
          client_carrier?: string | null
          claim_number?: string | null
          storm_date?: string | null
          damage_type?: 'Hail' | 'Wind' | 'Other'
          current_phase?: number
          days_in_phase?: number
          is_stuck?: boolean
          start_date?: string | null
          install_date?: string | null
          completion_date?: string | null
          lead_id?: string | null
          contract_id?: string | null
          contract_status?: 'none' | 'draft' | 'sent' | 'signed' | 'completed' | null
          assigned_sales_rep?: string | null
          updated_at?: string
        }
      }

      // Job Financials
      job_financials: {
        Row: {
          id: string
          job_id: string
          rcv_total: number
          acv_total: number
          depreciation: number
          deductible: number
          supplements_total: number
          acv_received: number
          rcv_received: number
          deductible_collected: number
          supplements_received: number
          total_received: number
          materials_cost: number
          labor_cost: number
          other_costs: number
          sales_rep_pct: number
          sales_rep_amount: number
          commission_paid: boolean
          gross_profit: number
          net_profit: number
          gross_margin: number
          is_legacy: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          job_id: string
          rcv_total?: number
          acv_total?: number
          depreciation?: number
          deductible?: number
          supplements_total?: number
          acv_received?: number
          rcv_received?: number
          deductible_collected?: number
          supplements_received?: number
          total_received?: number
          materials_cost?: number
          labor_cost?: number
          other_costs?: number
          sales_rep_pct?: number
          sales_rep_amount?: number
          commission_paid?: boolean
          gross_profit?: number
          net_profit?: number
          gross_margin?: number
          is_legacy?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          rcv_total?: number
          acv_total?: number
          depreciation?: number
          deductible?: number
          supplements_total?: number
          acv_received?: number
          rcv_received?: number
          deductible_collected?: number
          supplements_received?: number
          total_received?: number
          materials_cost?: number
          labor_cost?: number
          other_costs?: number
          sales_rep_pct?: number
          sales_rep_amount?: number
          commission_paid?: boolean
          gross_profit?: number
          net_profit?: number
          gross_margin?: number
          is_legacy?: boolean
          updated_at?: string
        }
      }

      // Supplements
      supplements: {
        Row: {
          id: string
          job_id: string
          reason: string
          amount_requested: number
          amount_approved: number
          status: 'Pending' | 'Approved' | 'Denied'
          date_submitted: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          job_id: string
          reason: string
          amount_requested: number
          amount_approved?: number
          status?: 'Pending' | 'Approved' | 'Denied'
          date_submitted: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          reason?: string
          amount_requested?: number
          amount_approved?: number
          status?: 'Pending' | 'Approved' | 'Denied'
          date_submitted?: string
          notes?: string | null
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}