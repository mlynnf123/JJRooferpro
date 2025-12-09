-- Fix the lead_source_performance table structure
DROP TABLE IF EXISTS lead_source_performance CASCADE;

-- Recreate with correct precision
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

-- Add index
CREATE INDEX idx_lead_source_performance_month_year ON lead_source_performance(month_year);

-- Enable RLS
ALTER TABLE lead_source_performance ENABLE ROW LEVEL SECURITY;

-- Create RLS policy
CREATE POLICY "Allow all operations on lead_source_performance" ON lead_source_performance FOR ALL USING (true);