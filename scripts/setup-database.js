#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Setting up JJRooferPro Database\n');

// Check for .env file
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  console.log('❌ No .env file found!');
  console.log('📝 Please create a .env file with your Supabase credentials:');
  console.log('');
  console.log('VITE_SUPABASE_URL=https://your-project-id.supabase.co');
  console.log('VITE_SUPABASE_ANON_KEY=your-anon-key');
  console.log('');
  console.log('📚 See DATABASE_SETUP.md for detailed instructions.');
  process.exit(1);
}

// Read environment variables
const envContent = fs.readFileSync(envPath, 'utf8');
const hasUrl = envContent.includes('VITE_SUPABASE_URL=');
const hasKey = envContent.includes('VITE_SUPABASE_ANON_KEY=');

if (!hasUrl || !hasKey) {
  console.log('⚠️  Incomplete .env file!');
  console.log('✅ Make sure you have both:');
  console.log('   - VITE_SUPABASE_URL');
  console.log('   - VITE_SUPABASE_ANON_KEY');
  console.log('');
  console.log('📚 See DATABASE_SETUP.md for detailed instructions.');
  process.exit(1);
}

console.log('✅ Environment variables found');

// Read SQL files
const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '001_initial_schema.sql');
const seedPath = path.join(__dirname, '..', 'supabase', 'seed.sql');

if (!fs.existsSync(migrationPath)) {
  console.log('❌ Migration file not found at:', migrationPath);
  process.exit(1);
}

if (!fs.existsSync(seedPath)) {
  console.log('❌ Seed file not found at:', seedPath);
  process.exit(1);
}

console.log('✅ SQL files found');
console.log('');

console.log('📋 Next steps:');
console.log('');
console.log('1. Open your Supabase project dashboard');
console.log('2. Go to the SQL Editor');
console.log('3. Copy and paste the contents of:');
console.log('   📄 supabase/migrations/001_initial_schema.sql');
console.log('4. Run the migration script');
console.log('5. Copy and paste the contents of:');
console.log('   📄 supabase/seed.sql');
console.log('6. Run the seed script');
console.log('');
console.log('🎉 Then start the application with: npm run dev');
console.log('');
console.log('📚 For detailed instructions, see DATABASE_SETUP.md');
console.log('');

console.log('🏗️  Database Schema Overview:');
console.log('   • sales_reps (3 initial reps)');
console.log('   • leads (5 sample leads)');
console.log('   • contracts (2 sample contracts)');
console.log('   • jobs (3 sample jobs)');
console.log('   • job_financials (financial tracking)');
console.log('   • supplements (insurance supplements)');
console.log('');