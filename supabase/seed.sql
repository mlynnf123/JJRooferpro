-- Insert initial sales representatives
INSERT INTO sales_reps (id, name, email, phone, commission_rate, active) VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'Ian Johnson', 'ian@jjroofingpros.com', '(512) 555-0101', 10.00, true),
('550e8400-e29b-41d4-a716-446655440002', 'Justin Johnson', 'justin@jjroofingpros.com', '(512) 555-0102', 10.00, true),
('550e8400-e29b-41d4-a716-446655440003', 'Kyle Thompson', 'kyle@jjroofingpros.com', '(512) 555-0103', 8.50, true);

-- Insert sample leads
INSERT INTO leads (id, customer_name, customer_address, customer_phone, customer_email, preferred_contact, source, status, priority, estimated_value, description, notes, assigned_to) VALUES
('11111111-1111-1111-1111-111111111001', 'Sarah Johnson', '123 Maple Street, Austin, TX 78704', '(512) 555-0201', 'sarah.johnson@email.com', 'phone', 'referral', 'new', 'high', 25000, 'Hail damage to roof and gutters. Need full replacement.', 'Customer mentioned they have Allstate insurance. Storm damage from last month.', '550e8400-e29b-41d4-a716-446655440001'),
('11111111-1111-1111-1111-111111111002', 'Mike Rodriguez', '456 Oak Drive, Austin, TX 78705', '(512) 555-0202', 'mike.rodriguez@email.com', 'email', 'online', 'contacted', 'medium', 18000, 'Wind damage to shingles on south side of house.', 'Initial contact made. Scheduled for estimate on Friday.', '550e8400-e29b-41d4-a716-446655440002'),
('11111111-1111-1111-1111-111111111003', 'Emily Chen', '789 Pine Avenue, Austin, TX 78701', '(512) 555-0203', 'emily.chen@email.com', 'text', 'advertisement', 'quoted', 'high', 32000, 'Complete roof replacement needed. House is 15 years old.', 'Quote provided for $32,000. Customer is reviewing with spouse.', '550e8400-e29b-41d4-a716-446655440003'),
('11111111-1111-1111-1111-111111111004', 'Robert Smith', '321 Cedar Lane, Austin, TX 78702', '(512) 555-0204', 'robert.smith@email.com', 'phone', 'cold-call', 'lost', 'low', 12000, 'Minor roof repair needed.', 'Customer decided to go with another contractor. Price was not competitive.', '550e8400-e29b-41d4-a716-446655440001'),
('11111111-1111-1111-1111-111111111005', 'Jessica Williams', '654 Elm Street, Austin, TX 78703', '(512) 555-0205', 'jessica.williams@email.com', 'email', 'referral', 'converted', 'high', 28500, 'Storm damage repair and gutter replacement.', 'Converted to job JJR-2024-032. Work scheduled for next week.', '550e8400-e29b-41d4-a716-446655440002');

-- Insert sample contracts
INSERT INTO contracts (id, lead_id, customer_name, customer_address, customer_phone, customer_email, company_rep_name, company_rep_title, project_description, work_location, start_date, completion_date, total_amount, deposit_amount, final_payment, terms, warranty_info, status) VALUES
('22222222-2222-2222-2222-222222222001', '11111111-1111-1111-1111-111111111003', 'Emily Chen', '789 Pine Avenue, Austin, TX 78701', '(512) 555-0203', 'emily.chen@email.com', 'Kyle Thompson', 'Sales Representative', 'Complete roof replacement including removal of existing shingles, installation of new underlayment, and premium architectural shingles. Includes gutters and downspouts replacement.', '789 Pine Avenue, Austin, TX 78701', '2024-12-15', '2024-12-22', 32000.00, 3200.00, 3200.00, 'All work to be completed according to local building codes and manufacturer specifications. Weather delays may extend completion date.', '10-year workmanship warranty, 25-year material warranty as per manufacturer specifications.', 'draft'),
('22222222-2222-2222-2222-222222222002', '11111111-1111-1111-1111-111111111005', 'Jessica Williams', '654 Elm Street, Austin, TX 78703', '(512) 555-0205', 'jessica.williams@email.com', 'Justin Johnson', 'Sales Representative', 'Storm damage repair including partial roof replacement and complete gutter system replacement.', '654 Elm Street, Austin, TX 78703', '2024-12-09', '2024-12-14', 28500.00, 2850.00, 2850.00, 'Insurance claim work. Final payment due upon insurance adjustment completion.', '5-year workmanship warranty, material warranty per manufacturer specifications.', 'signed');

-- Insert contract line items
INSERT INTO contract_line_items (contract_id, description, quantity, unit_price, total, category) VALUES
('22222222-2222-2222-2222-222222222001', 'Roof Tear-off and Disposal', 1, 3500.00, 3500.00, 'roofing'),
('22222222-2222-2222-2222-222222222001', 'Premium Architectural Shingles Installation', 1, 22000.00, 22000.00, 'roofing'),
('22222222-2222-2222-2222-222222222001', 'Gutter and Downspout Replacement', 1, 4500.00, 4500.00, 'gutter'),
('22222222-2222-2222-2222-222222222001', 'Permits and Cleanup', 1, 2000.00, 2000.00, 'other'),
('22222222-2222-2222-2222-222222222002', 'Storm Damage Roof Repair', 1, 18000.00, 18000.00, 'roofing'),
('22222222-2222-2222-2222-222222222002', 'Gutter System Replacement', 1, 7500.00, 7500.00, 'gutter'),
('22222222-2222-2222-2222-222222222002', 'Emergency Tarp and Cleanup', 1, 3000.00, 3000.00, 'other');

-- Insert sample jobs
INSERT INTO jobs (id, job_number, client_name, client_address, client_phone, client_email, client_carrier, claim_number, storm_date, damage_type, current_phase, days_in_phase, is_stuck, start_date, lead_id, contract_id, contract_status, assigned_sales_rep) VALUES
('33333333-3333-3333-3333-333333333001', 'JJR-2024-001', 'Jessica Williams', '654 Elm Street, Austin, TX 78703', '(512) 555-0205', 'jessica.williams@email.com', 'State Farm', 'SF-2024-789456', '2024-11-15', 'Hail', 8, 5, false, '2024-12-09', '11111111-1111-1111-1111-111111111005', '22222222-2222-2222-2222-222222222002', 'signed', '550e8400-e29b-41d4-a716-446655440002'),
('33333333-3333-3333-3333-333333333002', 'JJR-2024-002', 'Charlie Dao', '12401 Tinker Dr, Austin, TX 78704', '(512) 555-0301', null, 'Allstate', 'ALL-2024-123789', '2024-11-20', 'Hail', 10, 0, false, '2024-05-19', null, null, 'none', '550e8400-e29b-41d4-a716-446655440002'),
('33333333-3333-3333-3333-333333333003', 'JJR-2024-003', 'Donald Lyon', '13005 Tinker Dr, Austin, TX 78704', '(512) 555-0302', null, 'USAA', 'USAA-2024-456123', '2024-11-18', 'Wind', 9, 12, true, '2024-05-23', null, null, 'none', '550e8400-e29b-41d4-a716-446655440002');

-- Insert job financials
INSERT INTO job_financials (job_id, rcv_total, acv_total, depreciation, deductible, supplements_total, materials_cost, labor_cost, other_costs, sales_rep_pct, sales_rep_amount, commission_paid, gross_profit, net_profit, gross_margin) VALUES
('33333333-3333-3333-3333-333333333001', 28500.00, 17100.00, 11400.00, 1000.00, 0.00, 14250.00, 8550.00, 1000.00, 10.00, 2850.00, false, 4700.00, 1850.00, 16.49),
('33333333-3333-3333-3333-333333333002', 15000.00, 9000.00, 6000.00, 500.00, 2000.00, 7557.75, 1500.00, 500.00, 10.00, 1700.00, true, 5442.25, 3742.25, 36.28),
('33333333-3333-3333-3333-333333333003', 18500.00, 11100.00, 7400.00, 1000.00, 1500.00, 5450.92, 3925.00, 750.00, 10.00, 2000.00, false, 8374.08, 6374.08, 45.26);

-- Update lead references to contracts
UPDATE leads SET contract_id = '22222222-2222-2222-2222-222222222001' WHERE id = '11111111-1111-1111-1111-111111111003';
UPDATE leads SET contract_id = '22222222-2222-2222-2222-222222222002', converted_job_id = '33333333-3333-3333-3333-333333333001' WHERE id = '11111111-1111-1111-1111-111111111005';

-- Update contract references to jobs
UPDATE contracts SET job_id = '33333333-3333-3333-3333-333333333001' WHERE id = '22222222-2222-2222-2222-222222222002';