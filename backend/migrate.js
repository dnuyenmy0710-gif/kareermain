/**
 * Kareer Database Migration
 * 
 * Creates the required tables in Supabase (PostgreSQL).
 * Run once: `npm run migrate`
 * 
 * Tables:
 *   - users: User profiles from Step 1
 *   - assessments: Quiz results from Step 2 (RIASEC, Big Five, Schwartz)
 *   - career_selections: Career choices from Step 3 (Matrix)
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function migrate() {
  console.log('🚀 Kareer Database Migration');
  console.log('─'.repeat(50));

  // ── 1. Create users table ──
  console.log('\n📋 Creating "users" table...');
  const { error: usersError } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        role TEXT,
        subjects TEXT,
        major TEXT,
        position TEXT,
        education TEXT,
        skills TEXT,
        experience TEXT,
        tasks TEXT,
        interests TEXT,
        created_at TIMESTAMPTZ DEFAULT now()
      );
    `
  });

  if (usersError) {
    console.log('⚠️  users table — RPC not available, will try direct SQL approach');
    console.log('   Error:', usersError.message);
  } else {
    console.log('✅ users table created');
  }

  // ── 2. Create assessments table ──
  console.log('\n📋 Creating "assessments" table...');
  const { error: assessError } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS assessments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        answers JSONB NOT NULL,
        scores JSONB,
        riasec JSONB,
        big_five JSONB,
        schwartz JSONB,
        top_group TEXT,
        second_group TEXT,
        group_details JSONB,
        created_at TIMESTAMPTZ DEFAULT now()
      );

      CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON assessments(user_id);
    `
  });

  if (assessError) {
    console.log('⚠️  assessments table — RPC not available');
    console.log('   Error:', assessError.message);
  } else {
    console.log('✅ assessments table created');
  }

  // ── 3. Create career_selections table ──
  console.log('\n📋 Creating "career_selections" table...');
  const { error: careerError } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS career_selections (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
        career_name TEXT NOT NULL,
        fit_level TEXT,
        created_at TIMESTAMPTZ DEFAULT now()
      );

      CREATE INDEX IF NOT EXISTS idx_career_sel_user ON career_selections(user_id);
    `
  });

  if (careerError) {
    console.log('⚠️  career_selections table — RPC not available');
    console.log('   Error:', careerError.message);
  } else {
    console.log('✅ career_selections table created');
  }

  console.log('\n' + '─'.repeat(50));
  console.log('');
  console.log('⚠️  NẾU BẠN THẤY LỖI RPC, hãy chạy SQL sau trong Supabase Dashboard:');
  console.log('   https://supabase.com/dashboard → SQL Editor → New Query');
  console.log('');
  console.log('   Copy/paste nội dung từ file: migration.sql');
  console.log('');
}

migrate().catch(console.error);
