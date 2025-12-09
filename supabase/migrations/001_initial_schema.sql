-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Sales Representatives table
CREATE TABLE sales_reps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    commission_rate DECIMAL(5,2) DEFAULT 10.00,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leads table
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name VARCHAR(255) NOT NULL,
    customer_address TEXT,
    customer_phone VARCHAR(20) NOT NULL,
    customer_email VARCHAR(255),
    preferred_contact VARCHAR(10) DEFAULT 'phone' CHECK (preferred_contact IN ('phone', 'email', 'text')),
    source VARCHAR(20) NOT NULL CHECK (source IN ('referral', 'online', 'advertisement', 'cold-call', 'other')),
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'quoted', 'converted', 'lost')),
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    estimated_value DECIMAL(10,2) NOT NULL DEFAULT 0,
    description TEXT NOT NULL,
    notes TEXT,
    assigned_to UUID REFERENCES sales_reps(id),
    contract_id UUID,
    converted_job_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_contact_date TIMESTAMP WITH TIME ZONE,
    next_follow_up TIMESTAMP WITH TIME ZONE
);

-- Contracts table
CREATE TABLE contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id),
    job_id UUID,
    customer_name VARCHAR(255) NOT NULL,
    customer_address TEXT NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_email VARCHAR(255),
    company_rep_name VARCHAR(255) NOT NULL,
    company_rep_title VARCHAR(255) NOT NULL,
    project_description TEXT NOT NULL,
    work_location TEXT NOT NULL,
    start_date DATE NOT NULL,
    completion_date DATE NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    deposit_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    final_payment DECIMAL(10,2) NOT NULL DEFAULT 0,
    terms TEXT NOT NULL,
    warranty_info TEXT NOT NULL,
    third_party_auth JSONB,
    signatures JSONB,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'signed', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT
);

-- Contract line items table
CREATE TABLE contract_line_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    category VARCHAR(20) NOT NULL CHECK (category IN ('roofing', 'gutter', 'window', 'other')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Jobs table
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_number VARCHAR(50) UNIQUE NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    client_address TEXT,
    client_phone VARCHAR(20),
    client_email VARCHAR(255),
    client_carrier VARCHAR(255),
    claim_number VARCHAR(100),
    storm_date DATE,
    damage_type VARCHAR(10) DEFAULT 'Hail' CHECK (damage_type IN ('Hail', 'Wind', 'Other')),
    current_phase INTEGER DEFAULT 1 CHECK (current_phase BETWEEN 1 AND 10),
    days_in_phase INTEGER DEFAULT 0,
    is_stuck BOOLEAN DEFAULT false,
    start_date DATE,
    install_date DATE,
    completion_date DATE,
    lead_id UUID REFERENCES leads(id),
    contract_id UUID REFERENCES contracts(id),
    contract_status VARCHAR(20) CHECK (contract_status IN ('none', 'draft', 'sent', 'signed', 'completed')),
    assigned_sales_rep UUID REFERENCES sales_reps(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Job financials table
CREATE TABLE job_financials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    rcv_total DECIMAL(10,2) DEFAULT 0,
    acv_total DECIMAL(10,2) DEFAULT 0,
    depreciation DECIMAL(10,2) DEFAULT 0,
    deductible DECIMAL(10,2) DEFAULT 0,
    supplements_total DECIMAL(10,2) DEFAULT 0,
    acv_received DECIMAL(10,2) DEFAULT 0,
    rcv_received DECIMAL(10,2) DEFAULT 0,
    deductible_collected DECIMAL(10,2) DEFAULT 0,
    supplements_received DECIMAL(10,2) DEFAULT 0,
    total_received DECIMAL(10,2) DEFAULT 0,
    materials_cost DECIMAL(10,2) DEFAULT 0,
    labor_cost DECIMAL(10,2) DEFAULT 0,
    other_costs DECIMAL(10,2) DEFAULT 0,
    sales_rep_pct DECIMAL(5,2) DEFAULT 10.00,
    sales_rep_amount DECIMAL(10,2) DEFAULT 0,
    commission_paid BOOLEAN DEFAULT false,
    gross_profit DECIMAL(10,2) DEFAULT 0,
    net_profit DECIMAL(10,2) DEFAULT 0,
    gross_margin DECIMAL(5,2) DEFAULT 0,
    is_legacy BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Supplements table
CREATE TABLE supplements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    reason VARCHAR(255) NOT NULL,
    amount_requested DECIMAL(10,2) NOT NULL,
    amount_approved DECIMAL(10,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Denied')),
    date_submitted DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key constraints
ALTER TABLE contracts ADD CONSTRAINT fk_contracts_job FOREIGN KEY (job_id) REFERENCES jobs(id);
ALTER TABLE leads ADD CONSTRAINT fk_leads_contract FOREIGN KEY (contract_id) REFERENCES contracts(id);
ALTER TABLE leads ADD CONSTRAINT fk_leads_job FOREIGN KEY (converted_job_id) REFERENCES jobs(id);

-- Create indexes for better performance
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX idx_leads_created_at ON leads(created_at);
CREATE INDEX idx_contracts_lead_id ON contracts(lead_id);
CREATE INDEX idx_contracts_job_id ON contracts(job_id);
CREATE INDEX idx_contracts_status ON contracts(status);
CREATE INDEX idx_jobs_current_phase ON jobs(current_phase);
CREATE INDEX idx_jobs_lead_id ON jobs(lead_id);
CREATE INDEX idx_jobs_contract_id ON jobs(contract_id);
CREATE INDEX idx_jobs_assigned_sales_rep ON jobs(assigned_sales_rep);
CREATE INDEX idx_contract_line_items_contract_id ON contract_line_items(contract_id);
CREATE INDEX idx_job_financials_job_id ON job_financials(job_id);
CREATE INDEX idx_supplements_job_id ON supplements(job_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_sales_reps_updated_at BEFORE UPDATE ON sales_reps FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON contracts FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_job_financials_updated_at BEFORE UPDATE ON job_financials FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_supplements_updated_at BEFORE UPDATE ON supplements FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE sales_reps ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_financials ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplements ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (for now, allow all operations - adjust based on your auth needs)
CREATE POLICY "Allow all operations on sales_reps" ON sales_reps FOR ALL USING (true);
CREATE POLICY "Allow all operations on leads" ON leads FOR ALL USING (true);
CREATE POLICY "Allow all operations on contracts" ON contracts FOR ALL USING (true);
CREATE POLICY "Allow all operations on contract_line_items" ON contract_line_items FOR ALL USING (true);
CREATE POLICY "Allow all operations on jobs" ON jobs FOR ALL USING (true);
CREATE POLICY "Allow all operations on job_financials" ON job_financials FOR ALL USING (true);
CREATE POLICY "Allow all operations on supplements" ON supplements FOR ALL USING (true);