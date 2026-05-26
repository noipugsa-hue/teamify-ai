import { defineStore } from 'pinia'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth'
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore'
import type { User } from '~/types'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as FirebaseUser | null,
    userProfile: null as User | null,
    loading: false,
    error: null as string | null,
    initialized: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    isAdmin: (state) => state.userProfile?.role === 'admin',
    isTeamLeader: (state) => state.userProfile?.role === 'team_leader',
  },

  actions: {
    /**
     * Initialize auth state listener
     */
    initAuth() {
      const { auth, db } = useFirebase()

      return new Promise<void>((resolve) => {
        onAuthStateChanged(auth, async (firebaseUser) => {
          this.user = firebaseUser

          if (firebaseUser) {
            await this.loadUserProfile(firebaseUser.uid)
          } else {
            this.userProfile = null
          }

          this.initialized = true
          resolve()
        })
      })
    },

    /**
     * Load user profile from Firestore
     */
    async loadUserProfile(userId: string) {
      try {
        const { db } = useFirebase()
        const userDoc = await getDoc(doc(db, 'users', userId))

        if (userDoc.exists()) {
          this.userProfile = { id: userDoc.id, ...userDoc.data() } as User
        } else {
          this.userProfile = null
        }
      } catch (error: any) {
        console.error('Error loading user profile:', error)
        this.error = error.message
      }
    },

    /**
     * Sign in with email and password
     */
    async signIn(email: string, password: string) {
      this.loading = true
      this.error = null

      try {
        const { auth } = useFirebase()
        const credential = await signInWithEmailAndPassword(auth, email, password)
        await this.loadUserProfile(credential.user.uid)
        return credential.user
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Sign up with email and password
     */
    async signUp(email: string, password: string, displayName: string) {
      this.loading = true
      this.error = null

      try {
        const { auth, db } = useFirebase()
        const credential = await createUserWithEmailAndPassword(auth, email, password)

        // Check for referral data
        const referralData = await this.getReferralData()

        // Create user profile in Firestore
        const userProfile: Partial<User> = {
          id: credential.user.uid,
          email,
          displayName,
          role: 'user',
          referralCode: this.generateReferralCode(),
          referredBy: referralData?.referrerId,
          referralSource: referralData?.source,
          subscription: 'free',
          onboardingCompleted: false,
          stats: {
            totalContent: 0,
            totalLeads: 0,
            totalSales: 0,
            totalCommissions: 0,
            conversionRate: 0,
            viralScore: 0,
          },
          gamification: {
            level: 1,
            xp: 0,
            xpToNextLevel: 100,
            rank: 'Beginner',
            badges: [],
            achievements: [],
            dailyStreak: 0,
            lastActiveDate: Timestamp.now(),
          },
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        }

        await setDoc(doc(db, 'users', credential.user.uid), userProfile)
        await this.loadUserProfile(credential.user.uid)

        // Track conversion if there's a referral
        if (referralData) {
          await this.trackReferralConversion(referralData.code, credential.user.uid)
        }

        return credential.user
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Sign in with Google
     */
    async signInWithGoogle() {
      this.loading = true
      this.error = null

      try {
        const { auth, db } = useFirebase()
        const provider = new GoogleAuthProvider()
        const credential = await signInWithPopup(auth, provider)

        // Check if user profile exists
        const userDoc = await getDoc(doc(db, 'users', credential.user.uid))

        if (!userDoc.exists()) {
          // Check for referral data
          const referralData = await this.getReferralData()

          // Create new user profile
          const userProfile: Partial<User> = {
            id: credential.user.uid,
            email: credential.user.email || '',
            displayName: credential.user.displayName || '',
            photoURL: credential.user.photoURL || undefined,
            role: 'user',
            referralCode: this.generateReferralCode(),
            referredBy: referralData?.referrerId,
            referralSource: referralData?.source,
            subscription: 'free',
            onboardingCompleted: false,
            stats: {
              totalContent: 0,
              totalLeads: 0,
              totalSales: 0,
              totalCommissions: 0,
              conversionRate: 0,
              viralScore: 0,
            },
            gamification: {
              level: 1,
              xp: 0,
              xpToNextLevel: 100,
              rank: 'Beginner',
              badges: [],
              achievements: [],
              dailyStreak: 0,
              lastActiveDate: Timestamp.now(),
            },
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
          }

          await setDoc(doc(db, 'users', credential.user.uid), userProfile)

          // Track conversion if there's a referral
          if (referralData) {
            await this.trackReferralConversion(referralData.code, credential.user.uid)
          }
        }

        await this.loadUserProfile(credential.user.uid)
        return credential.user
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Sign out
     */
    async signOut() {
      this.loading = true
      this.error = null

      try {
        const { auth } = useFirebase()
        await signOut(auth)
        this.user = null
        this.userProfile = null
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Update user profile
     */
    async updateProfile(updates: Partial<User>) {
      if (!this.userProfile) return

      try {
        const { db } = useFirebase()
        const userRef = doc(db, 'users', this.userProfile.id)

        await setDoc(
          userRef,
          {
            ...updates,
            updatedAt: Timestamp.now(),
          },
          { merge: true }
        )

        await this.loadUserProfile(this.userProfile.id)
      } catch (error: any) {
        this.error = error.message
        throw error
      }
    },

    /**
     * Generate unique referral code
     */
    generateReferralCode(): string {
      return Math.random().toString(36).substring(2, 10).toUpperCase()
    },

    /**
     * Get referral data from localStorage
     */
    async getReferralData(): Promise<{ code: string; source?: string; referrerId?: string } | null> {
      if (typeof window === 'undefined') return null

      try {
        const referralDataStr = localStorage.getItem('referral_data')
        if (!referralDataStr) return null

        const referralData = JSON.parse(referralDataStr)
        const { code, source } = referralData

        if (!code) return null

        // Find the referrer user ID from the referral code
        const { db } = useFirebase()
        const { collection, query, where, getDocs } = await import('firebase/firestore')

        const usersRef = collection(db, 'users')
        const q = query(usersRef, where('referralCode', '==', code))
        const snapshot = await getDocs(q)

        if (snapshot.empty) {
          // Clear invalid referral data
          localStorage.removeItem('referral_data')
          return null
        }

        const referrerId = snapshot.docs[0].id

        // Clear the referral data after retrieving it
        localStorage.removeItem('referral_data')

        return { code, source, referrerId }
      } catch (error) {
        console.error('Error getting referral data:', error)
        return null
      }
    },

    /**
     * Track referral conversion
     */
    async trackReferralConversion(referralCode: string, newUserId: string) {
      try {
        const { db } = useFirebase()
        const { collection, query, where, getDocs, updateDoc, doc, increment, Timestamp } = await import('firebase/firestore')

        // Find the referrer
        const usersRef = collection(db, 'users')
        const q = query(usersRef, where('referralCode', '==', referralCode))
        const snapshot = await getDocs(q)

        if (snapshot.empty) return

        const referrerId = snapshot.docs[0].id

        // Update referrer's stats
        await updateDoc(doc(db, 'users', referrerId), {
          'stats.totalReferrals': increment(1),
          updatedAt: Timestamp.now(),
        })

        // Find and update affiliate links
        const linksRef = collection(db, 'affiliate_links')
        const linkQuery = query(
          linksRef,
          where('userId', '==', referrerId),
          where('active', '==', true)
        )
        const linkSnapshot = await getDocs(linkQuery)

        // Update all active links (or you could filter by source)
        for (const linkDoc of linkSnapshot.docs) {
          await updateDoc(doc(db, 'affiliate_links', linkDoc.id), {
            conversions: increment(1),
            updatedAt: Timestamp.now(),
          })
        }
      } catch (error) {
        console.error('Error tracking referral conversion:', error)
        // Don't throw - we don't want to block signup if tracking fails
      }
    },
  },
})
