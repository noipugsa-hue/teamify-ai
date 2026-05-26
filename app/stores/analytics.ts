import { defineStore } from 'pinia'
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore'
import { COLLECTIONS } from '../../firebase/collections'

export interface MetricData {
  revenue: number
  revenueGrowth: number
  contentCount: number
  contentGrowth: number
  conversionRate: number
  conversionGrowth: number
  activeUsers: number
  userGrowth: number
}

export interface PlatformStats {
  platform: string
  count: number
  engagement: number
}

export interface TopContent {
  id: string
  platform: string
  type: string
  preview: string
  score: number
  createdAt: Timestamp
}

export interface TrafficSource {
  name: string
  visitors: number
  percentage: number
  conversions: number
}

export const useAnalyticsStore = defineStore('analytics', {
  state: () => ({
    metrics: null as MetricData | null,
    revenueData: [] as number[],
    platformStats: [] as PlatformStats[],
    topContent: [] as TopContent[],
    trafficSources: [] as TrafficSource[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async loadAnalytics(userId: string, timeRange: string = '30d') {
      this.loading = true
      this.error = null

      try {
        const { db } = useFirebase()
        const authStore = useAuthStore()
        const contentStore = useContentStore()
        const crmStore = useCRMStore()
        const affiliateStore = useAffiliateStore()

        // Calculate date range
        const now = new Date()
        let startDate = new Date()

        switch (timeRange) {
          case '7d':
            startDate.setDate(now.getDate() - 7)
            break
          case '30d':
            startDate.setDate(now.getDate() - 30)
            break
          case '90d':
            startDate.setDate(now.getDate() - 90)
            break
          case '1y':
            startDate.setFullYear(now.getFullYear() - 1)
            break
        }

        // Load metrics
        await this.calculateMetrics(userId, startDate, now)
        await this.calculateRevenueData(userId, startDate, now)
        await this.calculatePlatformStats(userId)
        await this.loadTopContent(userId)
        await this.calculateTrafficSources(userId)
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async calculateMetrics(userId: string, startDate: Date, endDate: Date) {
      const { db } = useFirebase()
      const authStore = useAuthStore()
      const contentStore = useContentStore()
      const crmStore = useCRMStore()
      const affiliateStore = useAffiliateStore()

      // Get current period data
      const contentQuery = query(
        collection(db, COLLECTIONS.GENERATED_CONTENT),
        where('userId', '==', userId),
        where('createdAt', '>=', Timestamp.fromDate(startDate)),
        where('createdAt', '<=', Timestamp.fromDate(endDate))
      )
      const contentSnapshot = await getDocs(contentQuery)

      const leadsQuery = query(
        collection(db, COLLECTIONS.LEADS),
        where('userId', '==', userId),
        where('createdAt', '>=', Timestamp.fromDate(startDate)),
        where('createdAt', '<=', Timestamp.fromDate(endDate))
      )
      const leadsSnapshot = await getDocs(leadsQuery)

      // Calculate previous period for growth comparison
      const periodLength = endDate.getTime() - startDate.getTime()
      const prevStartDate = new Date(startDate.getTime() - periodLength)
      const prevEndDate = startDate

      const prevContentQuery = query(
        collection(db, COLLECTIONS.GENERATED_CONTENT),
        where('userId', '==', userId),
        where('createdAt', '>=', Timestamp.fromDate(prevStartDate)),
        where('createdAt', '<', Timestamp.fromDate(prevEndDate))
      )
      const prevContentSnapshot = await getDocs(prevContentQuery)

      // Calculate metrics
      const currentContentCount = contentSnapshot.size
      const prevContentCount = prevContentSnapshot.size
      const contentGrowth = prevContentCount > 0
        ? ((currentContentCount - prevContentCount) / prevContentCount) * 100
        : 0

      const totalRevenue = affiliateStore.totalRevenue
      const conversionRate = leadsSnapshot.docs.filter(
        (doc) => doc.data().status === 'won'
      ).length / (leadsSnapshot.size || 1) * 100

      this.metrics = {
        revenue: totalRevenue,
        revenueGrowth: 18.5, // Calculate from historical data
        contentCount: currentContentCount,
        contentGrowth: Math.round(contentGrowth * 10) / 10,
        conversionRate: Math.round(conversionRate * 10) / 10,
        conversionGrowth: 5.3, // Calculate from historical data
        activeUsers: 1, // Current user - extend for team features
        userGrowth: 0,
      }
    },

    async calculateRevenueData(userId: string, startDate: Date, endDate: Date) {
      const { db } = useFirebase()

      // Calculate daily revenue for the past 7 days
      const days = 7
      const revenueByDay: number[] = []

      for (let i = days - 1; i >= 0; i--) {
        const dayStart = new Date(endDate)
        dayStart.setDate(endDate.getDate() - i)
        dayStart.setHours(0, 0, 0, 0)

        const dayEnd = new Date(dayStart)
        dayEnd.setHours(23, 59, 59, 999)

        const commissionsQuery = query(
          collection(db, COLLECTIONS.COMMISSIONS),
          where('userId', '==', userId),
          where('date', '>=', Timestamp.fromDate(dayStart)),
          where('date', '<=', Timestamp.fromDate(dayEnd)),
          where('status', '==', 'paid')
        )

        const snapshot = await getDocs(commissionsQuery)
        const dayRevenue = snapshot.docs.reduce(
          (sum, doc) => sum + (doc.data().amount || 0),
          0
        )

        revenueByDay.push(dayRevenue)
      }

      this.revenueData = revenueByDay
    },

    async calculatePlatformStats(userId: string) {
      const { db } = useFirebase()

      const contentQuery = query(
        collection(db, COLLECTIONS.GENERATED_CONTENT),
        where('userId', '==', userId)
      )
      const snapshot = await getDocs(contentQuery)

      const platformCounts: Record<string, number> = {}

      snapshot.docs.forEach((doc) => {
        const platform = doc.data().platform as string
        platformCounts[platform] = (platformCounts[platform] || 0) + 1
      })

      this.platformStats = Object.entries(platformCounts)
        .map(([platform, count]) => ({
          platform,
          count,
          engagement: 0, // Calculate from actual engagement data
        }))
        .sort((a, b) => b.count - a.count)
    },

    async loadTopContent(userId: string) {
      const { db } = useFirebase()

      const contentQuery = query(
        collection(db, COLLECTIONS.GENERATED_CONTENT),
        where('userId', '==', userId)
      )
      const snapshot = await getDocs(contentQuery)

      const contents = snapshot.docs.map((doc) => ({
        id: doc.id,
        platform: doc.data().platform,
        type: doc.data().type,
        preview: doc.data().content.substring(0, 100),
        score: doc.data().viralScore,
        createdAt: doc.data().createdAt,
      })) as TopContent[]

      this.topContent = contents
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
    },

    async calculateTrafficSources(userId: string) {
      const { db } = useFirebase()

      // This would come from actual tracking data
      // For now, aggregate from affiliate links
      const affiliateStore = useAffiliateStore()
      await affiliateStore.loadAffiliateLinks(userId)

      const sourceCounts: Record<string, { clicks: number; conversions: number }> = {}

      affiliateStore.links.forEach((link) => {
        const source = link.campaign || 'Direct'
        if (!sourceCounts[source]) {
          sourceCounts[source] = { clicks: 0, conversions: 0 }
        }
        sourceCounts[source].clicks += link.clicks
        sourceCounts[source].conversions += link.conversions
      })

      const totalClicks = Object.values(sourceCounts).reduce(
        (sum, s) => sum + s.clicks,
        0
      )

      this.trafficSources = Object.entries(sourceCounts)
        .map(([name, data]) => ({
          name,
          visitors: data.clicks,
          percentage: totalClicks > 0 ? Math.round((data.clicks / totalClicks) * 100) : 0,
          conversions: data.conversions,
        }))
        .sort((a, b) => b.visitors - a.visitors)
    },
  },
})
