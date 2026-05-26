import { defineStore } from 'pinia'
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  Timestamp,
  doc,
  updateDoc,
  increment
} from 'firebase/firestore'
import { COLLECTIONS } from '../../firebase/collections'

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
  campaign?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface Commission {
  id: string
  userId: string
  affiliateLinkId?: string
  referralUserId: string
  amount: number
  status: 'pending' | 'paid' | 'cancelled'
  description: string
  date: Timestamp
  paidAt?: Timestamp
}

export const useAffiliateStore = defineStore('affiliate', {
  state: () => ({
    links: [] as AffiliateLink[],
    commissions: [] as Commission[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    activeLinks: (state) => state.links.filter((link) => link.active),
    totalClicks: (state) => state.links.reduce((sum, link) => sum + link.clicks, 0),
    totalConversions: (state) => state.links.reduce((sum, link) => sum + link.conversions, 0),
    totalRevenue: (state) => state.links.reduce((sum, link) => sum + link.revenue, 0),
    conversionRate: (state) => {
      const clicks = state.links.reduce((sum, link) => sum + link.clicks, 0)
      const conversions = state.links.reduce((sum, link) => sum + link.conversions, 0)
      return clicks > 0 ? ((conversions / clicks) * 100).toFixed(1) : '0'
    },
    pendingCommissions: (state) =>
      state.commissions.filter((c) => c.status === 'pending')
        .reduce((sum, c) => sum + c.amount, 0),
    paidCommissions: (state) =>
      state.commissions.filter((c) => c.status === 'paid')
        .reduce((sum, c) => sum + c.amount, 0),
  },

  actions: {
    async loadAffiliateLinks(userId: string) {
      this.loading = true
      this.error = null

      try {
        const { db } = useFirebase()
        // Simple query without orderBy to avoid index requirement
        const q = query(
          collection(db, COLLECTIONS.AFFILIATE_LINKS),
          where('userId', '==', userId)
        )

        const snapshot = await getDocs(q)
        // Sort on client-side
        this.links = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .sort((a: any, b: any) => {
            const dateA = a.createdAt?.toDate?.() || new Date(0)
            const dateB = b.createdAt?.toDate?.() || new Date(0)
            return dateB.getTime() - dateA.getTime()
          }) as AffiliateLink[]
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createAffiliateLink(userId: string, name: string, campaign?: string) {
      try {
        const { db } = useFirebase()
        const authStore = useAuthStore()
        const referralCode = authStore.userProfile?.referralCode || ''

        const shortCode = name.toLowerCase().replace(/\s+/g, '-')
        const url = `${window.location.origin}/ref/${referralCode}?source=${shortCode}`

        const linkData = {
          userId,
          name,
          url,
          shortCode,
          clicks: 0,
          conversions: 0,
          revenue: 0,
          active: true,
          campaign: campaign || '',
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        }

        const docRef = await addDoc(collection(db, COLLECTIONS.AFFILIATE_LINKS), linkData)

        const newLink: AffiliateLink = {
          id: docRef.id,
          ...linkData,
        }

        this.links.unshift(newLink)
        return newLink
      } catch (error: any) {
        this.error = error.message
        throw error
      }
    },

    async toggleLinkStatus(linkId: string) {
      try {
        const { db } = useFirebase()
        const link = this.links.find((l) => l.id === linkId)
        if (!link) throw new Error('Link not found')

        const newStatus = !link.active

        await updateDoc(doc(db, COLLECTIONS.AFFILIATE_LINKS, linkId), {
          active: newStatus,
          updatedAt: Timestamp.now(),
        })

        link.active = newStatus
      } catch (error: any) {
        this.error = error.message
        throw error
      }
    },

    async trackClick(linkId: string) {
      try {
        const { db } = useFirebase()

        await updateDoc(doc(db, COLLECTIONS.AFFILIATE_LINKS, linkId), {
          clicks: increment(1),
          updatedAt: Timestamp.now(),
        })

        const link = this.links.find((l) => l.id === linkId)
        if (link) {
          link.clicks++
        }
      } catch (error: any) {
        this.error = error.message
        throw error
      }
    },

    async trackConversion(linkId: string, revenue: number) {
      try {
        const { db } = useFirebase()

        await updateDoc(doc(db, COLLECTIONS.AFFILIATE_LINKS, linkId), {
          conversions: increment(1),
          revenue: increment(revenue),
          updatedAt: Timestamp.now(),
        })

        const link = this.links.find((l) => l.id === linkId)
        if (link) {
          link.conversions++
          link.revenue += revenue
        }
      } catch (error: any) {
        this.error = error.message
        throw error
      }
    },

    async loadCommissions(userId: string) {
      this.loading = true
      this.error = null

      try {
        const { db } = useFirebase()
        // Simple query without orderBy to avoid index requirement
        const q = query(
          collection(db, COLLECTIONS.COMMISSIONS),
          where('userId', '==', userId)
        )

        const snapshot = await getDocs(q)
        // Sort on client-side
        this.commissions = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .sort((a: any, b: any) => {
            const dateA = a.date?.toDate?.() || new Date(0)
            const dateB = b.date?.toDate?.() || new Date(0)
            return dateB.getTime() - dateA.getTime()
          }) as Commission[]
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async addCommission(commissionData: Omit<Commission, 'id'>) {
      try {
        const { db } = useFirebase()
        const docRef = await addDoc(collection(db, COLLECTIONS.COMMISSIONS), commissionData)

        const newCommission: Commission = {
          id: docRef.id,
          ...commissionData,
        }

        this.commissions.unshift(newCommission)
        return newCommission
      } catch (error: any) {
        this.error = error.message
        throw error
      }
    },
  },
})
