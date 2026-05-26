import { defineStore } from 'pinia'
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'
import type { Team, TeamTreeNode, User } from '~/types'
import { COLLECTIONS } from '../../firebase/collections'

export const useTeamStore = defineStore('team', {
  state: () => ({
    team: null as Team | null,
    teamMembers: [] as User[],
    teamTree: null as TeamTreeNode | null,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    hasTeam: (state) => !!state.team,
    isTeamLeader: (state) => {
      const authStore = useAuthStore()
      return state.team?.leaderId === authStore.userProfile?.id
    },
    activeMembers: (state) => {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      return state.teamMembers.filter((member) => {
        const lastActive = member.gamification.lastActiveDate.toDate()
        return lastActive >= today
      })
    },
  },

  actions: {
    async loadTeam(teamId: string) {
      this.loading = true
      this.error = null

      try {
        const { db } = useFirebase()
        const teamDoc = await getDoc(doc(db, COLLECTIONS.TEAMS, teamId))

        if (teamDoc.exists()) {
          this.team = { id: teamDoc.id, ...teamDoc.data() } as Team
          await this.loadTeamMembers()
        }
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async loadTeamMembers() {
      if (!this.team) return

      try {
        const { db } = useFirebase()
        const q = query(
          collection(db, COLLECTIONS.USERS),
          where('teamId', '==', this.team.id)
        )

        const snapshot = await getDocs(q)
        this.teamMembers = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as User[]
      } catch (error: any) {
        this.error = error.message
        throw error
      }
    },

    async buildTeamTree(userId: string): Promise<TeamTreeNode> {
      const { db } = useFirebase()
      const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, userId))

      if (!userDoc.exists()) {
        throw new Error('User not found')
      }

      const userData = userDoc.data() as User

      // Get direct referrals
      const q = query(
        collection(db, COLLECTIONS.USERS),
        where('referredBy', '==', userId)
      )

      const snapshot = await getDocs(q)
      const children: TeamTreeNode[] = []

      for (const doc of snapshot.docs) {
        const childTree = await this.buildTeamTree(doc.id)
        children.push(childTree)
      }

      const node: TeamTreeNode = {
        userId: userDoc.id,
        displayName: userData.displayName,
        photoURL: userData.photoURL,
        level: 1,
        directReferrals: snapshot.size,
        totalDownline: snapshot.size + children.reduce((sum, child) => sum + child.totalDownline, 0),
        monthlyRevenue: userData.stats.totalCommissions,
        children,
      }

      return node
    },
  },
})
