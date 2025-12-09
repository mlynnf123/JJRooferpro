-- Additional tables for enhanced roofing business management

-- Customer communication tracking
CREATE TABLE communications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    communication_type VARCHAR(20) NOT NULL CHECK (communication_type IN ('call', 'email', 'text', 'visit', 'other')),
    direction VARCHAR(10) NOT NULL CHECK (direction IN ('inbound', 'outbound')),
    subject VARCHAR(255),
    content TEXT,
    outcome VARCHAR(100),
    scheduled_follow_up TIMESTAMP WITH TIME ZONE,
    sales_rep_id UUID REFERENCES sales_reps(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Document attachments (photos, estimates, insurance docs)
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL, -- 'photo', 'estimate', 'insurance', 'permit', etc.
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL, -- Supabase storage URL
    file_size BIGINT,
    mime_type VARCHAR(100),
    description TEXT,
    uploaded_by UUID REFERENCES sales_reps(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Material and labor cost tracking
CREATE TABLE cost_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    item_type VARCHAR(20) NOT NULL CHECK (item_type IN ('material', 'labor', 'equipment', 'permit', 'other')),
    category VARCHAR(50), -- 'shingles', 'gutters', 'flashing', etc.
    description VARCHAR(255) NOT NULL,
    quantity DECIMAL(10,2) DEFAULT 1,
    unit_cost DECIMAL(10,2) NOT NULL,
    total_cost DECIMAL(10,2) NOT NULL,
    vendor VARCHAR(255),
    invoice_number VARCHAR(100),
    date_incurred DATE DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inspection and milestone tracking
CREATE TABLE inspections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    inspection_type VARCHAR(50) NOT NULL, -- 'initial', 'progress', 'final', 'insurance'
    inspector_name VARCHAR(255),
    inspector_company VARCHAR(255),
    scheduled_date TIMESTAMP WITH TIME ZONE,
    completed_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'passed', 'failed', 'cancelled')),
    notes TEXT,
    follow_up_required BOOLEAN DEFAULT false,
    follow_up_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customer feedback and reviews
CREATE TABLE customer_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    customer_name VARCHAR(255) NOT NULL,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    review_text TEXT,
    would_recommend BOOLEAN,
    feedback_date DATE DEFAULT CURRENT_DATE,
    feedback_source VARCHAR(50), -- 'survey', 'google', 'facebook', etc.
    public_review BOOLEAN DEFAULT false,
    response_text TEXT, -- Company response to review
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Weather and project delays tracking
CREATE TABLE project_delays (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    delay_type VARCHAR(30) NOT NULL, -- 'weather', 'materials', 'permits', 'inspection', 'customer', 'other'
    delay_reason TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    estimated_duration INTEGER, -- days
    impact_description TEXT,
    mitigation_actions TEXT,
    created_by UUID REFERENCES sales_reps(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Marketing source tracking
CREATE TABLE marketing_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_name VARCHAR(100) NOT NULL UNIQUE,
    source_type VARCHAR(30) NOT NULL, -- 'online', 'print', 'radio', 'referral', 'social', etc.
    cost_per_month DECIMAL(10,2),
    active BOOLEAN DEFAULT true,
    description TEXT,
    tracking_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lead source performance tracking
CREATE TABLE lead_source_performance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    marketing_source_id UUID NOT NULL REFERENCES marketing_sources(id),
    month_year DATE NOT NULL, -- First day of the month for grouping
    leads_generated INTEGER DEFAULT 0,
    leads_contacted INTEGER DEFAULT 0,
    leads_quoted INTEGER DEFAULT 0,
    leads_converted INTEGER DEFAULT 0,
    total_revenue DECIMAL(12,2) DEFAULT 0,
    cost_per_lead DECIMAL(10,2),
    conversion_rate DECIMAL(7,2), -- Allow for percentages up to 99999.99%
    roi DECIMAL(8,2), -- Allow for ROI up to 999999.99%
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(marketing_source_id, month_year)
);

-- Insurance carrier tracking
CREATE TABLE insurance_carriers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    carrier_name VARCHAR(255) NOT NULL UNIQUE,
    contact_phone VARCHAR(20),
    contact_email VARCHAR(255),
    typical_deductible_range VARCHAR(50), -- e.g., "$1000-$2500"
    payment_terms VARCHAR(100),
    notes TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_communications_lead_id ON communications(lead_id);
CREATE INDEX idx_communications_job_id ON communications(job_id);
CREATE INDEX idx_communications_created_at ON communications(created_at);
CREATE INDEX idx_documents_lead_id ON documents(lead_id);
CREATE INDEX idx_documents_job_id ON documents(job_id);
CREATE INDEX idx_documents_contract_id ON documents(contract_id);
CREATE INDEX idx_cost_items_job_id ON cost_items(job_id);
CREATE INDEX idx_cost_items_item_type ON cost_items(item_type);
CREATE INDEX idx_inspections_job_id ON inspections(job_id);
CREATE INDEX idx_inspections_status ON inspections(status);
CREATE INDEX idx_customer_feedback_job_id ON customer_feedback(job_id);
CREATE INDEX idx_customer_feedback_rating ON customer_feedback(rating);
CREATE INDEX idx_project_delays_job_id ON project_delays(job_id);
CREATE INDEX idx_project_delays_delay_type ON project_delays(delay_type);
CREATE INDEX idx_lead_source_performance_month_year ON lead_source_performance(month_year);

-- Add updated_at triggers
CREATE TRIGGER update_communications_updated_at BEFORE UPDATE ON communications FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_cost_items_updated_at BEFORE UPDATE ON cost_items FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_inspections_updated_at BEFORE UPDATE ON inspections FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_project_delays_updated_at BEFORE UPDATE ON project_delays FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_marketing_sources_updated_at BEFORE UPDATE ON marketing_sources FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_insurance_carriers_updated_at BEFORE UPDATE ON insurance_carriers FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Enable RLS on new tables
ALTER TABLE communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE cost_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_delays ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_source_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE insurance_carriers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow all for now - adjust based on your needs)
CREATE POLICY "Allow all operations on communications" ON communications FOR ALL USING (true);
CREATE POLICY "Allow all operations on documents" ON documents FOR ALL USING (true);
CREATE POLICY "Allow all operations on cost_items" ON cost_items FOR ALL USING (true);
CREATE POLICY "Allow all operations on inspections" ON inspections FOR ALL USING (true);
CREATE POLICY "Allow all operations on customer_feedback" ON customer_feedback FOR ALL USING (true);
CREATE POLICY "Allow all operations on project_delays" ON project_delays FOR ALL USING (true);
CREATE POLICY "Allow all operations on marketing_sources" ON marketing_sources FOR ALL USING (true);
CREATE POLICY "Allow all operations on lead_source_performance" ON lead_source_performance FOR ALL USING (true);
CREATE POLICY "Allow all operations on insurance_carriers" ON insurance_carriers FOR ALL USING (true);