-- Seed data for additional tables

-- Insert sample marketing sources
INSERT INTO marketing_sources (id, source_name, source_type, cost_per_month, active, description) VALUES
('44444444-4444-4444-4444-444444444001', 'Google Ads', 'online', 1500.00, true, 'Google search and display ads'),
('44444444-4444-4444-4444-444444444002', 'Facebook Ads', 'social', 800.00, true, 'Facebook and Instagram advertising'),
('44444444-4444-4444-4444-444444444003', 'Referral Program', 'referral', 0.00, true, 'Customer referral incentive program'),
('44444444-4444-4444-4444-444444444004', 'Door Hangers', 'print', 300.00, true, 'Neighborhood door hanger campaigns'),
('44444444-4444-4444-4444-444444444005', 'Radio Sponsorship', 'radio', 2000.00, false, 'Local radio weather sponsorship');

-- Insert sample insurance carriers
INSERT INTO insurance_carriers (id, carrier_name, contact_phone, contact_email, typical_deductible_range, payment_terms, notes, active) VALUES
('55555555-5555-5555-5555-555555555001', 'State Farm', '(800) 782-8332', 'claims@statefarm.com', '$1000-$2500', 'Net 30 after completion', 'Generally easy to work with, quick approvals', true),
('55555555-5555-5555-5555-555555555002', 'Allstate', '(800) 255-7828', 'claims@allstate.com', '$1000-$5000', 'Net 45 after completion', 'Requires detailed documentation', true),
('55555555-5555-5555-5555-555555555003', 'USAA', '(800) 531-8722', 'claims@usaa.com', '$500-$2000', 'Net 30 after completion', 'Excellent for military families, thorough but fair', true),
('55555555-5555-5555-5555-555555555004', 'Progressive', '(800) 776-4737', 'claims@progressive.com', '$1000-$3000', 'Net 30 after completion', 'Online claims process, good communication', true),
('55555555-5555-5555-5555-555555555005', 'Farmers', '(800) 435-7764', 'claims@farmers.com', '$1000-$2500', 'Net 45 after completion', 'Regional variations in approval process', true);

-- Insert sample communications
INSERT INTO communications (id, lead_id, communication_type, direction, subject, content, outcome, sales_rep_id) VALUES
('66666666-6666-6666-6666-666666666001', '11111111-1111-1111-1111-111111111001', 'call', 'outbound', 'Initial Contact', 'Called customer about roof inspection inquiry. Discussed storm damage and scheduled appointment for estimate.', 'Appointment scheduled for Friday 2PM', '550e8400-e29b-41d4-a716-446655440001'),
('66666666-6666-6666-6666-666666666002', '11111111-1111-1111-1111-111111111002', 'email', 'outbound', 'Estimate Follow-up', 'Sent detailed estimate for wind damage repair. Included photos and recommended timeline.', 'Customer requested time to review with spouse', '550e8400-e29b-41d4-a716-446655440002'),
('66666666-6666-6666-6666-666666666003', '11111111-1111-1111-1111-111111111003', 'visit', 'outbound', 'Property Inspection', 'Conducted thorough roof inspection. Found hail damage to 60% of roof surface. Documented all damage areas.', 'Customer approved full replacement estimate', '550e8400-e29b-41d4-a716-446655440003');

-- Insert sample cost items for existing jobs
INSERT INTO cost_items (id, job_id, item_type, category, description, quantity, unit_cost, total_cost, vendor, invoice_number) VALUES
('77777777-7777-7777-7777-777777777001', '33333333-3333-3333-3333-333333333001', 'material', 'shingles', 'Owens Corning Duration Architectural Shingles', 35.00, 120.00, 4200.00, 'ABC Roofing Supply', 'INV-2024-1001'),
('77777777-7777-7777-7777-777777777002', '33333333-3333-3333-3333-333333333001', 'material', 'underlayment', 'Synthetic Underlayment', 20.00, 45.00, 900.00, 'ABC Roofing Supply', 'INV-2024-1001'),
('77777777-7777-7777-7777-777777777003', '33333333-3333-3333-3333-333333333001', 'material', 'flashing', 'Step Flashing and Drip Edge', 1.00, 350.00, 350.00, 'ABC Roofing Supply', 'INV-2024-1002'),
('77777777-7777-7777-7777-777777777004', '33333333-3333-3333-3333-333333333001', 'labor', 'installation', 'Roof Installation Labor', 3.00, 1200.00, 3600.00, 'J&J Roofing Crew', null),
('77777777-7777-7777-7777-777777777005', '33333333-3333-3333-3333-333333333001', 'equipment', 'dumpster', '20-yard Dumpster Rental', 1.00, 450.00, 450.00, 'Waste Management', 'WM-2024-5678');

-- Insert sample inspections
INSERT INTO inspections (id, job_id, inspection_type, inspector_name, inspector_company, scheduled_date, completed_date, status, notes) VALUES
('88888888-8888-8888-8888-888888888001', '33333333-3333-3333-3333-333333333001', 'initial', 'Mike Patterson', 'State Farm', '2024-12-10 10:00:00+00', '2024-12-10 11:30:00+00', 'completed', 'Confirmed hail damage. Approved full replacement claim.'),
('88888888-8888-8888-8888-888888888002', '33333333-3333-3333-3333-333333333001', 'progress', 'City Building Inspector', 'City of Austin', '2024-12-12 14:00:00+00', '2024-12-12 14:30:00+00', 'passed', 'Installation meets code requirements. Approved for final phase.'),
('88888888-8888-8888-8888-888888888003', '33333333-3333-3333-3333-333333333002', 'initial', 'Sarah Williams', 'Allstate', '2024-12-05 09:00:00+00', '2024-12-05 10:15:00+00', 'completed', 'Verified storm damage. Claim approved with $500 deductible.');

-- Insert sample customer feedback
INSERT INTO customer_feedback (id, job_id, customer_name, rating, review_text, would_recommend, feedback_source, public_review) VALUES
('99999999-9999-9999-9999-999999999001', '33333333-3333-3333-3333-333333333002', 'Charlie Dao', 5, 'Excellent work! The crew was professional and cleaned up everything perfectly. Very happy with the new roof.', true, 'survey', true),
('99999999-9999-9999-9999-999999999002', '33333333-3333-3333-3333-333333333003', 'Donald Lyon', 4, 'Good quality work, though the project took a bit longer than expected due to weather delays. Overall satisfied.', true, 'google', true);

-- Insert sample project delays
INSERT INTO project_delays (id, job_id, delay_type, delay_reason, start_date, end_date, estimated_duration, impact_description, created_by) VALUES
('10101010-1010-1010-1010-101010101001', '33333333-3333-3333-3333-333333333003', 'weather', 'Heavy rain for 3 consecutive days prevented installation', '2024-12-08', '2024-12-10', 3, 'Delayed installation phase by 3 days. Rescheduled final inspection.', '550e8400-e29b-41d4-a716-446655440002'),
('10101010-1010-1010-1010-101010101002', '33333333-3333-3333-3333-333333333001', 'materials', 'Shingle delivery delayed due to supplier backorder', '2024-12-06', '2024-12-08', 2, 'Project start delayed by 2 days. Customer was notified and agreed to new timeline.', '550e8400-e29b-41d4-a716-446655440002');

-- Insert sample lead source performance data
INSERT INTO lead_source_performance (id, marketing_source_id, month_year, leads_generated, leads_contacted, leads_quoted, leads_converted, total_revenue, cost_per_lead, conversion_rate, roi) VALUES
('11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444001', '2024-11-01', 25, 22, 15, 8, 185000.00, 60.00, 32.00, 245.33),
('11111111-1111-1111-1111-111111111112', '44444444-4444-4444-4444-444444444002', '2024-11-01', 18, 16, 12, 5, 95000.00, 44.44, 27.78, 143.75),
('11111111-1111-1111-1111-111111111113', '44444444-4444-4444-4444-444444444003', '2024-11-01', 12, 12, 10, 7, 145000.00, 0.00, 58.33, 999999.99),
('11111111-1111-1111-1111-111111111114', '44444444-4444-4444-4444-444444444004', '2024-11-01', 8, 7, 4, 2, 35000.00, 37.50, 25.00, 166.67);

-- Update existing leads to reference marketing sources (update the source field to match marketing_source_id)
UPDATE leads SET notes = CONCAT(notes, ' | Source: Google Ads Campaign') WHERE id = '11111111-1111-1111-1111-111111111002';
UPDATE leads SET notes = CONCAT(notes, ' | Source: Facebook Ad') WHERE id = '11111111-1111-1111-1111-111111111003';
UPDATE leads SET notes = CONCAT(notes, ' | Source: Customer Referral') WHERE id = '11111111-1111-1111-1111-111111111001';