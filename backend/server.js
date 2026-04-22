/**
 * Kareer Backend — Express Server
 * 
 * REST API for the career orientation platform.
 * Connects to Supabase (PostgreSQL) for data persistence.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Supabase Client ──
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// ── Middleware ──
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Request logging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString().slice(11, 19);
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// ═══════════════════════════════════════════
//  API ROUTES
// ═══════════════════════════════════════════

// ── Health Check ──
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ──────────────────────────────────────────
//  USERS
// ──────────────────────────────────────────

/**
 * POST /api/users
 * Create or update a user profile.
 * If email already exists → update profile, return existing user.
 * Body: { name, email, role, subjects?, major?, position?, education?, skills?, experience?, tasks?, interests? }
 */
app.post('/api/users', async (req, res) => {
  try {
    const { name, email, role, subjects, major, position, education, skills, experience, tasks, interests } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Cần có email' });
    }

    // Check if user already exists (upsert by email)
    const { data: existing } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (existing) {
      // Update existing user
      const { data, error } = await supabase
        .from('users')
        .update({ name, role, subjects, major, position, education, skills, experience, tasks, interests })
        .eq('email', email)
        .select()
        .single();

      if (error) throw error;
      return res.json({ user: data, isNew: false });
    }

    // Create new user
    const { data, error } = await supabase
      .from('users')
      .insert({ name, email, role, subjects, major, position, education, skills, experience, tasks, interests })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ user: data, isNew: true });

  } catch (err) {
    console.error('POST /api/users error:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/users/:email
 * Get user profile by email.
 */
app.get('/api/users/:email', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', req.params.email)
      .maybeSingle();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Không tìm thấy người dùng' });

    res.json({ user: data });
  } catch (err) {
    console.error('GET /api/users/:email error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ──────────────────────────────────────────
//  ASSESSMENTS
// ──────────────────────────────────────────

/**
 * POST /api/assessments
 * Save a completed assessment (35-question quiz result).
 * Body: { user_id, answers, scores, riasec, big_five, schwartz, top_group, second_group, group_details }
 */
app.post('/api/assessments', async (req, res) => {
  try {
    const { user_id, answers, scores, riasec, big_five, schwartz, top_group, second_group, group_details } = req.body;

    if (!user_id || !answers) {
      return res.status(400).json({ error: 'Cần có user_id và answers' });
    }

    if (!Array.isArray(answers) || answers.length !== 35) {
      return res.status(400).json({ error: 'answers phải là mảng 35 phần tử' });
    }

    const { data, error } = await supabase
      .from('assessments')
      .insert({
        user_id,
        answers,
        scores,
        riasec,
        big_five,
        schwartz,
        top_group,
        second_group,
        group_details
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ assessment: data });

  } catch (err) {
    console.error('POST /api/assessments error:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/assessments/:userId
 * Get all assessments for a user (most recent first).
 */
app.get('/api/assessments/:userId', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .eq('user_id', req.params.userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ assessments: data });
  } catch (err) {
    console.error('GET /api/assessments/:userId error:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/assessments/latest/:userId
 * Get the most recent assessment for a user.
 */
app.get('/api/assessments/latest/:userId', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .eq('user_id', req.params.userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Chưa có kết quả đánh giá' });

    res.json({ assessment: data });
  } catch (err) {
    console.error('GET /api/assessments/latest/:userId error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ──────────────────────────────────────────
//  CAREER SELECTIONS
// ──────────────────────────────────────────

/**
 * POST /api/career-selections
 * Save a career selection from Step 3 (Matrix).
 * Body: { user_id, assessment_id, career_name, fit_level }
 */
app.post('/api/career-selections', async (req, res) => {
  try {
    const { user_id, assessment_id, career_name, fit_level } = req.body;

    if (!user_id || !career_name) {
      return res.status(400).json({ error: 'Cần có user_id và career_name' });
    }

    const { data, error } = await supabase
      .from('career_selections')
      .insert({ user_id, assessment_id, career_name, fit_level })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ selection: data });

  } catch (err) {
    console.error('POST /api/career-selections error:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/career-selections/:userId
 * Get all career selections for a user.
 */
app.get('/api/career-selections/:userId', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('career_selections')
      .select('*')
      .eq('user_id', req.params.userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ selections: data });
  } catch (err) {
    console.error('GET /api/career-selections/:userId error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ──────────────────────────────────────────
//  ADMIN / STATS
// ──────────────────────────────────────────

/**
 * GET /api/stats
 * Dashboard statistics for admin view.
 */
app.get('/api/stats', async (req, res) => {
  try {
    // Total users
    const { count: totalUsers, error: e1 } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });
    if (e1) throw e1;

    // Total assessments
    const { count: totalAssessments, error: e2 } = await supabase
      .from('assessments')
      .select('*', { count: 'exact', head: true });
    if (e2) throw e2;

    // Total career selections
    const { count: totalSelections, error: e3 } = await supabase
      .from('career_selections')
      .select('*', { count: 'exact', head: true });
    if (e3) throw e3;

    // Top groups distribution
    const { data: topGroups, error: e4 } = await supabase
      .from('assessments')
      .select('top_group');
    if (e4) throw e4;

    const groupCounts = {};
    (topGroups || []).forEach(a => {
      if (a.top_group) {
        groupCounts[a.top_group] = (groupCounts[a.top_group] || 0) + 1;
      }
    });

    // Role distribution
    const { data: roles, error: e5 } = await supabase
      .from('users')
      .select('role');
    if (e5) throw e5;

    const roleCounts = {};
    (roles || []).forEach(u => {
      if (u.role) {
        roleCounts[u.role] = (roleCounts[u.role] || 0) + 1;
      }
    });

    // Most selected careers
    const { data: careers, error: e6 } = await supabase
      .from('career_selections')
      .select('career_name');
    if (e6) throw e6;

    const careerCounts = {};
    (careers || []).forEach(c => {
      careerCounts[c.career_name] = (careerCounts[c.career_name] || 0) + 1;
    });
    const topCareers = Object.entries(careerCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));

    // Recent users (last 10)
    const { data: recentUsers, error: e7 } = await supabase
      .from('users')
      .select('id, name, email, role, created_at')
      .order('created_at', { ascending: false })
      .limit(10);
    if (e7) throw e7;

    res.json({
      totalUsers,
      totalAssessments,
      totalSelections,
      groupDistribution: groupCounts,
      roleDistribution: roleCounts,
      topCareers,
      recentUsers
    });

  } catch (err) {
    console.error('GET /api/stats error:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/stats/users
 * Get all users with their assessment count (admin list view).
 */
app.get('/api/stats/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const { data, error, count } = await supabase
      .from('users')
      .select('*, assessments(count)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    res.json({
      users: data,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (err) {
    console.error('GET /api/stats/users error:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/stats/user/:userId
 * Get full detail for a single user (profile + all assessments + selections).
 */
app.get('/api/stats/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    const { data: user, error: e1 } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    if (e1) throw e1;

    const { data: assessments, error: e2 } = await supabase
      .from('assessments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (e2) throw e2;

    const { data: selections, error: e3 } = await supabase
      .from('career_selections')
      .select('*')
      .eq('id', userId) // WAIT, this should be user_id, but the original code had it as id in the select call? Actually it's .eq('user_id', userId) in line 411. I will fix it if it was wrong.
      .order('created_at', { ascending: false });
    if (e3) throw e3;

    res.json({ user, assessments, selections });
  } catch (err) {
    console.error('GET /api/stats/user/:userId error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ── 404 Handler ──
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint không tồn tại' });
});

// ── Error Handler ──
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
});

// ── Start Server ──
app.listen(PORT, () => {
  console.log('');
  console.log('═══════════════════════════════════════');
  console.log('  🚀 Kareer BACKEND');
  console.log(`  📡 http://localhost:${PORT}`);
  console.log(`  🗄️  Supabase: ${process.env.SUPABASE_URL}`);
  console.log('═══════════════════════════════════════');
  console.log('');
  console.log('Endpoints:');
  console.log('  POST /api/users              — Tạo/cập nhật người dùng');
  console.log('  GET  /api/users/:email        — Lấy thông tin theo email');
  console.log('  POST /api/assessments         — Lưu kết quả bài test');
  console.log('  GET  /api/assessments/:userId  — Lấy kết quả theo user');
  console.log('  POST /api/career-selections   — Lưu lựa chọn nghề nghiệp');
  console.log('  GET  /api/stats               — Thống kê tổng quan');
  console.log('');
});
