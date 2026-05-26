import { defineStore } from 'pinia'
import { collection, addDoc, query, where, getDocs, orderBy, Timestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import type { Lead, LeadStatus, Note, Interaction } from '~/types'
import { COLLECTIONS } from '../../firebase/collections'

export const useCRMStore = defineStore('crm', {
  state: () => ({
    leads: [] as Lead[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    leadsByStatus: (state) => (status: LeadStatus) => {
      return state.leads.filter((lead) => lead.status === status)
    },

    newLeads: (state) => state.leads.filter((lead) => lead.status === 'new'),
    qualifiedLeads: (state) => state.leads.filter((lead) => lead.status === 'qualified'),
    hotLeads: (state) => state.leads.filter((lead) => lead.score >= 70),
  },

  actions: {
    async loadLeads(userId: string) {
      this.loading = true
      this.error = null

      try {
        const { db } = useFirebase()
        const q = query(
          collection(db, COLLECTIONS.LEADS),
          where('userId', '==', userId),
          orderBy('createdAt', 'desc')
        )

        const snapshot = await getDocs(q)
        this.leads = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Lead[]
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async addLead(leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) {
      try {
        const { db } = useFirebase()

        const newLead = {
          ...leadData,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        }

        const docRef = await addDoc(collection(db, COLLECTIONS.LEADS), newLead)

        const lead: Lead = {
          id: docRef.id,
          ...newLead,
        }

        this.leads.unshift(lead)

        return lead
      } catch (error: any) {
        this.error = error.message
        throw error
      }
    },

    async updateLeadStatus(leadId: string, status: LeadStatus) {
      try {
        const { db } = useFirebase()
        const leadRef = doc(db, COLLECTIONS.LEADS, leadId)

        await updateDoc(leadRef, {
          status,
          updatedAt: Timestamp.now(),
        })

        const lead = this.leads.find((l) => l.id === leadId)
        if (lead) {
          lead.status = status
        }
      } catch (error: any) {
        this.error = error.message
        throw error
      }
    },

    async addNote(leadId: string, content: string, createdBy: string) {
      try {
        const lead = this.leads.find((l) => l.id === leadId)
        if (!lead) throw new Error('Lead not found')

        const note: Note = {
          id: Date.now().toString(),
          content,
          createdBy,
          createdAt: Timestamp.now(),
        }

        const { db } = useFirebase()
        const leadRef = doc(db, COLLECTIONS.LEADS, leadId)

        await updateDoc(leadRef, {
          notes: [...lead.notes, note],
          updatedAt: Timestamp.now(),
        })

        lead.notes.push(note)
      } catch (error: any) {
        this.error = error.message
        throw error
      }
    },

    async deleteLead(leadId: string) {
      try {
        const { db } = useFirebase()
        const leadRef = doc(db, COLLECTIONS.LEADS, leadId)

        await deleteDoc(leadRef)

        const index = this.leads.findIndex((l) => l.id === leadId)
        if (index !== -1) {
          this.leads.splice(index, 1)
        }
      } catch (error: any) {
        this.error = error.message
        throw error
      }
    },
  },
})
