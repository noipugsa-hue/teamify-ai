import type { Timestamp } from 'firebase/firestore'

// ==================== USER TYPES ====================

export interface User {
  id: string
  email: string
  displayName: string
  photoURL?: string
  role: UserRole
  teamId?: string
  referralCode: string
  referredBy?: string
  referralSource?: string
  subscription: SubscriptionTier
  onboardingCompleted: boolean
  stats: UserStats
  gamification: GamificationData
  createdAt: Timestamp
  updatedAt: Timestamp
}

export type UserRole = 'user' | 'admin' | 'team_leader' | 'affiliate'

export type SubscriptionTier = 'free' | 'starter' | 'pro' | 'enterprise'

export interface UserStats {
  totalContent: number
  totalLeads: number
  totalSales: number
  totalCommissions: number
  totalReferrals?: number
  totalReferralClicks?: number
  conversionRate: number
  viralScore: number
}

export interface GamificationData {
  level: number
  xp: number
  xpToNextLevel: number
  rank: string
  badges: Badge[]
  achievements: Achievement[]
  dailyStreak: number
  lastActiveDate: Timestamp
}

// ==================== TEAM TYPES ====================

export interface Team {
  id: string
  name: string
  description: string
  leaderId: string
  members: string[]
  inviteCode: string
  stats: TeamStats
  goals: TeamGoal[]
  missions: Mission[]
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface TeamStats {
  totalMembers: number
  activeMembersToday: number
  totalRevenue: number
  totalCommissions: number
  monthlyGrowth: number
  teamRank: number
}

export interface TeamGoal {
  id: string
  title: string
  description: string
  target: number
  current: number
  deadline: Timestamp
  reward?: string
  completed: boolean
}

export interface Mission {
  id: string
  title: string
  description: string
  type: MissionType
  xpReward: number
  status: 'active' | 'completed' | 'expired'
  deadline: Timestamp
  requirements: string[]
  completedBy: string[]
}

export type MissionType = 'daily' | 'weekly' | 'monthly' | 'special'

// ==================== GAMIFICATION TYPES ====================

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  earnedAt: Timestamp
}

export interface Achievement {
  id: string
  title: string
  description: string
  progress: number
  target: number
  reward: number
  icon: string
  completed: boolean
}

export interface LeaderboardEntry {
  userId: string
  displayName: string
  photoURL?: string
  score: number
  rank: number
  change: number
}

// ==================== CONTENT TYPES ====================

export interface GeneratedContent {
  id: string
  userId: string
  type: ContentType
  platform: Platform
  content: string
  metadata: ContentMetadata
  viralScore: number
  saved: boolean
  used: boolean
  createdAt: Timestamp
}

export type ContentType =
  | 'caption'
  | 'hook'
  | 'script'
  | 'post'
  | 'cta'
  | 'hashtags'
  | 'story'

export type Platform =
  | 'tiktok'
  | 'instagram'
  | 'facebook'
  | 'linkedin'
  | 'twitter'
  | 'youtube'

export interface ContentMetadata {
  niche?: string
  tone?: string
  targetAudience?: string
  keywords?: string[]
  hashtags?: string[]
  callToAction?: string
  wordCount?: number
  rewriteStyle?: 'shorter' | 'longer' | 'more_engaging' | 'professional' | 'casual'
  originalContentId?: string
}

// ==================== AI TYPES ====================

export interface AIGenerationRequest {
  type: ContentType
  platform: Platform
  prompt: string
  context?: string
  tone?: string
  length?: 'short' | 'medium' | 'long'
  maxWords?: number | null
  includeEmoji?: boolean
  includeHashtags?: boolean
}

export interface AIGenerationResponse {
  success: boolean
  content: string
  viralScore: number
  suggestions?: string[]
  error?: string
}

export interface AIChat {
  id: string
  userId: string
  leadId?: string
  messages: AIMessage[]
  type: 'closing' | 'coaching' | 'general'
  context?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface AIMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Timestamp
}

// ==================== CRM TYPES ====================

export interface Lead {
  id: string
  userId: string
  teamId?: string
  name: string
  email?: string
  phone?: string
  platform: Platform
  source: string
  status: LeadStatus
  score: number
  tags: string[]
  notes: Note[]
  interactions: Interaction[]
  assignedTo?: string
  lastContactDate?: Timestamp
  nextFollowUp?: Timestamp
  createdAt: Timestamp
  updatedAt: Timestamp
}

export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'negotiating'
  | 'won'
  | 'lost'
  | 'nurturing'

export interface Note {
  id: string
  content: string
  createdBy: string
  createdAt: Timestamp
}

export interface Interaction {
  id: string
  type: 'call' | 'email' | 'message' | 'meeting' | 'other'
  description: string
  outcome?: string
  nextAction?: string
  createdAt: Timestamp
}

// ==================== AFFILIATE TYPES ====================

export interface AffiliateLink {
  id: string
  userId: string
  name: string
  url: string
  shortCode: string
  clicks: number
  conversions: number
  revenue: number
  active: boolean
  metadata: Record<string, any>
  createdAt: Timestamp
}

export interface Commission {
  id: string
  userId: string
  affiliateId: string
  amount: number
  status: CommissionStatus
  saleId: string
  saleDate: Timestamp
  payoutDate?: Timestamp
  description: string
  createdAt: Timestamp
}

export type CommissionStatus = 'pending' | 'approved' | 'paid' | 'rejected'

export interface TeamTreeNode {
  userId: string
  displayName: string
  photoURL?: string
  level: number
  directReferrals: number
  totalDownline: number
  monthlyRevenue: number
  children: TeamTreeNode[]
}

export interface RankProgress {
  currentRank: string
  nextRank: string
  requirements: RankRequirement[]
  progress: number
}

export interface RankRequirement {
  type: 'sales' | 'referrals' | 'team_size' | 'revenue'
  current: number
  target: number
  label: string
}

// ==================== LANDING PAGE TYPES ====================

export interface LandingPage {
  id: string
  userId: string
  name: string
  slug: string
  template: string
  sections: PageSection[]
  settings: PageSettings
  published: boolean
  views: number
  conversions: number
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface PageSection {
  id: string
  type: SectionType
  order: number
  content: Record<string, any>
  styles: Record<string, any>
  visible: boolean
}

export type SectionType =
  | 'hero'
  | 'features'
  | 'testimonials'
  | 'pricing'
  | 'cta'
  | 'faq'
  | 'footer'
  | 'custom'

export interface PageSettings {
  title: string
  description: string
  ogImage?: string
  favicon?: string
  customCSS?: string
  customJS?: string
  theme: 'light' | 'dark'
  domain?: string
}

// ==================== TIKTOK TYPES ====================

export interface TikTokScript {
  id: string
  userId: string
  title: string
  hook: string
  body: string
  cta: string
  duration: number
  niche: string
  viralScore: number
  hashtags: string[]
  soundSuggestion?: string
  trendingTopics: string[]
  saved: boolean
  createdAt: Timestamp
}

export interface ViralTrend {
  id: string
  keyword: string
  hashtag: string
  category: string
  popularity: number
  growthRate: number
  suggestedContent: string[]
  expiresAt: Timestamp
}

export interface ContentCalendar {
  id: string
  userId: string
  date: Timestamp
  content: ContentCalendarItem[]
  notes?: string
}

export interface ContentCalendarItem {
  id: string
  platform: Platform
  type: ContentType
  content: string
  scheduledTime?: Timestamp
  status: 'draft' | 'scheduled' | 'published'
  performance?: ContentPerformance
}

export interface ContentPerformance {
  views: number
  likes: number
  comments: number
  shares: number
  engagement: number
  viralScore: number
}

// ==================== ANALYTICS TYPES ====================

export interface AnalyticsData {
  userId: string
  period: 'day' | 'week' | 'month' | 'year'
  metrics: Metrics
  charts: ChartData[]
  insights: Insight[]
  generatedAt: Timestamp
}

export interface Metrics {
  revenue: number
  revenueChange: number
  leads: number
  leadsChange: number
  conversions: number
  conversionsChange: number
  conversionRate: number
  conversionRateChange: number
  contentGenerated: number
  viralScore: number
  teamSize: number
  commissions: number
}

export interface ChartData {
  id: string
  type: 'line' | 'bar' | 'pie' | 'doughnut' | 'area'
  title: string
  data: ChartDataPoint[]
}

export interface ChartDataPoint {
  label: string
  value: number
  color?: string
}

export interface Insight {
  id: string
  type: 'success' | 'warning' | 'info' | 'tip'
  title: string
  description: string
  action?: string
  priority: number
}

// ==================== NOTIFICATION TYPES ====================

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  actionUrl?: string
  metadata?: Record<string, any>
  createdAt: Timestamp
}

export type NotificationType =
  | 'team'
  | 'achievement'
  | 'commission'
  | 'lead'
  | 'system'
  | 'milestone'

// ==================== CAMPAIGN TYPES ====================

export interface Campaign {
  id: string
  userId: string
  name: string
  description: string
  type: 'email' | 'social' | 'affiliate' | 'mixed'
  status: 'draft' | 'active' | 'paused' | 'completed'
  budget?: number
  spent: number
  startDate: Timestamp
  endDate?: Timestamp
  metrics: CampaignMetrics
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface CampaignMetrics {
  impressions: number
  clicks: number
  conversions: number
  revenue: number
  roi: number
  ctr: number
  cpc: number
  cpa: number
}

// ==================== UTILITY TYPES ====================

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface FileUpload {
  name: string
  url: string
  size: number
  type: string
  uploadedAt: Timestamp
}
