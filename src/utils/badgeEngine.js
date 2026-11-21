// src/utils/badgeEngine.js
// Badge definitions and unlock triggers for SimilarQuest — Survey Crew Theme (PRD §10, TRD §11)

export const BADGES = [
  { id: 'first_match',      icon: '🔭', label: 'First Match',          description: 'Answered your very first similarity question correctly!' },
  { id: 'steady_survey',    icon: '📏', label: 'Steady Survey',        description: 'Achieved a streak of 5 correct answers in a row!' },
  { id: 'surveyor_streak',  icon: '⚡', label: 'Surveyor\'s Streak',    description: 'Achieved an incredible 10-question winning streak!' },
  { id: 'crew_certified',   icon: '🧭', label: 'Crew Certified',       description: 'Completed all 4 interactive survey simulation stations!' },
  { id: 'triple_star',      icon: '⭐', label: 'Triple-Star Surveyor', description: 'Scored 3 stars in a Practice World!' },
  { id: 'site_champion',    icon: '🥇', label: 'Site Champion',        description: 'Defeated a World Boss on the survey field!' },
  { id: 'field_worker',     icon: '🏕️', label: 'Field Worker',         description: 'Answered 20 or more questions in Practice!' },
  { id: 'master_of_scale',  icon: '🏆', label: 'Master of Scale',      description: 'Completed the full 5-phase SimilarQuest journey!' },
];

export function checkBadges(state) {
  const unlocked = [];

  // First correct answer
  const totalCorrect = state.districtCorrect?.reduce((s, c) => s + (c || 0), 0) || 0;
  if (totalCorrect >= 1) unlocked.push('first_match');

  // Streak checks
  if (state.maxStreak >= 5) unlocked.push('steady_survey');
  if (state.maxStreak >= 10) unlocked.push('surveyor_streak');

  // Simulation completion
  if (state.simStationsComplete && state.simStationsComplete.every(Boolean)) {
    unlocked.push('crew_certified');
  }

  // 3-star district check
  if (state.districtScores && state.districtScores.some((score) => score !== null && score >= 9)) {
    unlocked.push('triple_star');
  }

  // Centurion / Field Worker (20+ answered or correct)
  if (state.currentQuestion >= 20 || totalCorrect >= 20) {
    unlocked.push('field_worker');
  }

  // Boss slayer / Site Champion
  if (state.bossDefeated) {
    unlocked.push('site_champion');
  }

  // Full journey
  if (state.phaseComplete && Object.values(state.phaseComplete).every(Boolean)) {
    unlocked.push('master_of_scale');
  }

  return unlocked;
}
