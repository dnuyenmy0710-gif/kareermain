/**
 * Kareer API Client
 * 
 * Shared JS module used by all frontend pages (Step 1, 2, 3) to communicate
 * with the backend. Falls back to localStorage if the backend is unreachable.
 * 
 * Usage:
 *   <script src="/api-client.js"></script>
 *   
 *   // Save user
 *   const user = await KareerAPI.saveUser({ name, email, role, ... });
 *   
 *   // Save assessment
 *   const assessment = await KareerAPI.saveAssessment({ user_id, answers, scores, ... });
 */

const KareerAPI = (() => {
  // ── Configuration ──
  // Production: set window.Kareer_API_URL in config.js
  // Development: falls back to localhost:3000
  const API_BASE = (window.Kareer_API_URL || 'http://localhost:3000') + '/api';
  let _backendAvailable = null; // cached after first check

  // ── Helpers ──
  async function checkBackend() {
    if (_backendAvailable !== null) return _backendAvailable;
    try {
      const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(2000) });
      _backendAvailable = res.ok;
    } catch {
      _backendAvailable = false;
    }
    if (!_backendAvailable) {
      console.warn('[KareerAPI] Backend không khả dụng — sử dụng localStorage');
    }
    return _backendAvailable;
  }

  async function post(endpoint, body) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Lỗi không xác định' }));
      throw new Error(err.error || `HTTP ${res.status}`);
    }
    return res.json();
  }

  async function get(endpoint) {
    const res = await fetch(`${API_BASE}${endpoint}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Lỗi không xác định' }));
      throw new Error(err.error || `HTTP ${res.status}`);
    }
    return res.json();
  }

  // ═══════════════════════════════════════
  //  PUBLIC API
  // ═══════════════════════════════════════

  /**
   * Save user profile to backend + localStorage.
   * @param {Object} profile - { name, email, role, subjects?, major?, position?, education?, skills?, experience?, tasks?, interests? }
   * @returns {Object} { user, isNew } or null if backend unavailable
   */
  async function saveUser(profile) {
    // Always save to localStorage (backward compatibility)
    localStorage.setItem('kareer_profile', JSON.stringify(profile));

    const online = await checkBackend();
    if (!online) return null;

    try {
      const result = await post('/users', profile);
      // Store user_id for later use
      if (result.user && result.user.id) {
        localStorage.setItem('kareer_user_id', result.user.id);
      }
      console.log(`[KareerAPI] User ${result.isNew ? 'created' : 'updated'}: ${result.user.email}`);
      return result;
    } catch (err) {
      console.error('[KareerAPI] saveUser error:', err.message);
      return null;
    }
  }

  /**
   * Save assessment results to backend + localStorage.
   * @param {Object} data - { answers, scores, riasec, big_five, schwartz, top_group, second_group, group_details }
   * @returns {Object} { assessment } or null
   */
  async function saveAssessment(data) {
    // Always save to localStorage (backward compatibility)
    const quizResult = {
      scores: data.scores,
      sorted: data.sorted,
      topGroup: data.top_group,
      secondGroup: data.second_group,
      profile: JSON.parse(localStorage.getItem('kareer_profile') || '{}'),
      groupDetails: data.group_details
    };
    localStorage.setItem('kareer_result', JSON.stringify(quizResult));

    const online = await checkBackend();
    if (!online) return null;

    try {
      const userId = localStorage.getItem('kareer_user_id');
      if (!userId) {
        console.warn('[KareerAPI] No user_id found — skipping assessment save');
        return null;
      }

      const result = await post('/assessments', {
        user_id: userId,
        answers: data.answers,
        scores: data.scores,
        riasec: data.riasec,
        big_five: data.big_five,
        schwartz: data.schwartz,
        top_group: data.top_group,
        second_group: data.second_group,
        group_details: data.group_details
      });

      if (result.assessment && result.assessment.id) {
        localStorage.setItem('kareer_assessment_id', result.assessment.id);
      }
      console.log(`[KareerAPI] Assessment saved: ${result.assessment.id}`);
      return result;
    } catch (err) {
      console.error('[KareerAPI] saveAssessment error:', err.message);
      return null;
    }
  }

  /**
   * Save career selection from Step 3 (Matrix).
   * @param {string} careerName - The career name selected
   * @param {string} fitLevel - 'Very High' | 'High' | 'Medium' | 'Low' | 'Very Low'
   * @returns {Object} { selection } or null
   */
  async function saveCareerSelection(careerName, fitLevel) {
    // Also save to localStorage
    localStorage.setItem('selectedCareer', careerName);

    const online = await checkBackend();
    if (!online) return null;

    try {
      const userId = localStorage.getItem('kareer_user_id');
      const assessmentId = localStorage.getItem('kareer_assessment_id');
      if (!userId) return null;

      const result = await post('/career-selections', {
        user_id: userId,
        assessment_id: assessmentId || null,
        career_name: careerName,
        fit_level: fitLevel
      });
      console.log(`[KareerAPI] Career selected: ${careerName}`);
      return result;
    } catch (err) {
      console.error('[KareerAPI] saveCareerSelection error:', err.message);
      return null;
    }
  }

  /**
   * Load user data from backend (if available) or localStorage.
   * @param {string} email
   * @returns {Object|null} user data
   */
  async function loadUser(email) {
    const online = await checkBackend();
    if (online && email) {
      try {
        const result = await get(`/users/${encodeURIComponent(email)}`);
        if (result.user) {
          localStorage.setItem('kareer_profile', JSON.stringify(result.user));
          localStorage.setItem('kareer_user_id', result.user.id);
          return result.user;
        }
      } catch (err) {
        // Fall through to localStorage
      }
    }
    return JSON.parse(localStorage.getItem('kareer_profile') || 'null');
  }

  /**
   * Get stats (admin use).
   * @returns {Object} stats data or null
   */
  async function getStats() {
    const online = await checkBackend();
    if (!online) return null;
    try {
      return await get('/stats');
    } catch (err) {
      console.error('[KareerAPI] getStats error:', err.message);
      return null;
    }
  }

  // ── Expose API ──
  return {
    saveUser,
    saveAssessment,
    saveCareerSelection,
    loadUser,
    getStats,
    checkBackend
  };
})();
