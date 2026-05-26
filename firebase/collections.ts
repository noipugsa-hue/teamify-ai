/**
 * Firestore Collection Names
 * Centralized collection names for type safety and consistency
 */

export const COLLECTIONS = {
  // User & Auth
  USERS: 'users',
  USER_PROFILES: 'user_profiles',
  USER_SETTINGS: 'user_settings',

  // Team Management
  TEAMS: 'teams',
  TEAM_MEMBERS: 'team_members',
  TEAM_GOALS: 'team_goals',
  MISSIONS: 'missions',

  // Content & AI
  GENERATED_CONTENT: 'generated_content',
  AI_CHATS: 'ai_chats',
  CONTENT_TEMPLATES: 'content_templates',
  TIKTOK_SCRIPTS: 'tiktok_scripts',
  VIRAL_TRENDS: 'viral_trends',
  CONTENT_CALENDAR: 'content_calendar',

  // CRM
  LEADS: 'leads',
  INTERACTIONS: 'interactions',
  NOTES: 'notes',

  // Affiliate & Sales
  AFFILIATE_LINKS: 'affiliate_links',
  COMMISSIONS: 'commissions',
  REFERRALS: 'referrals',
  SALES: 'sales',

  // Landing Pages
  LANDING_PAGES: 'landing_pages',
  PAGE_TEMPLATES: 'page_templates',
  PAGE_VIEWS: 'page_views',

  // Gamification
  BADGES: 'badges',
  ACHIEVEMENTS: 'achievements',
  LEADERBOARD: 'leaderboard',
  REWARDS: 'rewards',

  // Analytics & Tracking
  ANALYTICS: 'analytics',
  CAMPAIGNS: 'campaigns',
  EVENTS: 'events',
  PAGE_ANALYTICS: 'page_analytics',

  // Automation
  WORKFLOWS: 'workflows',
  WORKFLOW_TEMPLATES: 'workflow_templates',
  WORKFLOW_EXECUTIONS: 'workflow_executions',

  // Notifications
  NOTIFICATIONS: 'notifications',
  ANNOUNCEMENTS: 'announcements',

  // System
  APP_CONFIG: 'app_config',
  FEATURE_FLAGS: 'feature_flags',
} as const

/**
 * Subcollection helpers
 */
export function getUserCollection(userId: string, collection: string) {
  return `${COLLECTIONS.USERS}/${userId}/${collection}`
}

export function getTeamCollection(teamId: string, collection: string) {
  return `${COLLECTIONS.TEAMS}/${teamId}/${collection}`
}
