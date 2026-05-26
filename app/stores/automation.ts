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

export interface WorkflowTemplate {
  id: string
  name: string
  description: string
  category: 'Email' | 'Messaging' | 'Notification' | 'CRM' | 'Social'
  tasks: number
  popularity: number
  icon: string
  color: string
  steps: WorkflowStep[]
  createdAt: Timestamp
}

export interface WorkflowStep {
  id: string
  type: 'trigger' | 'action' | 'condition' | 'delay'
  name: string
  config: Record<string, any>
}

export interface Workflow {
  id: string
  userId: string
  name: string
  description: string
  status: 'active' | 'paused' | 'draft'
  templateId?: string
  steps: WorkflowStep[]
  executions: number
  successCount: number
  failureCount: number
  lastRun?: Timestamp
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface WorkflowExecution {
  id: string
  workflowId: string
  userId: string
  status: 'success' | 'failed' | 'running'
  message: string
  startedAt: Timestamp
  completedAt?: Timestamp
  error?: string
}

export const useAutomationStore = defineStore('automation', {
  state: () => ({
    workflows: [] as Workflow[],
    templates: [] as WorkflowTemplate[],
    executions: [] as WorkflowExecution[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    activeWorkflows: (state) => state.workflows.filter((w) => w.status === 'active'),
    pausedWorkflows: (state) => state.workflows.filter((w) => w.status === 'paused'),
    totalExecutions: (state) => state.workflows.reduce((sum, w) => sum + w.executions, 0),
    totalSuccessCount: (state) => state.workflows.reduce((sum, w) => sum + w.successCount, 0),
    successRate: (state) => {
      const total = state.workflows.reduce((sum, w) => sum + w.executions, 0)
      const success = state.workflows.reduce((sum, w) => sum + w.successCount, 0)
      return total > 0 ? Math.round((success / total) * 100) : 0
    },
    recentExecutions: (state) => state.executions.slice(0, 10),
  },

  actions: {
    async loadWorkflows(userId: string) {
      this.loading = true
      this.error = null

      try {
        const { db } = useFirebase()
        const q = query(
          collection(db, COLLECTIONS.WORKFLOWS),
          where('userId', '==', userId),
          orderBy('updatedAt', 'desc')
        )

        const snapshot = await getDocs(q)
        this.workflows = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Workflow[]
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async loadTemplates() {
      this.loading = true
      this.error = null

      try {
        const { db } = useFirebase()
        const q = query(
          collection(db, COLLECTIONS.WORKFLOW_TEMPLATES),
          orderBy('popularity', 'desc')
        )

        const snapshot = await getDocs(q)
        this.templates = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as WorkflowTemplate[]
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createWorkflow(userId: string, workflowData: Omit<Workflow, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) {
      try {
        const { db } = useFirebase()

        const newWorkflow = {
          ...workflowData,
          userId,
          executions: 0,
          successCount: 0,
          failureCount: 0,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        }

        const docRef = await addDoc(collection(db, COLLECTIONS.WORKFLOWS), newWorkflow)

        const workflow: Workflow = {
          id: docRef.id,
          ...newWorkflow,
        }

        this.workflows.unshift(workflow)
        return workflow
      } catch (error: any) {
        this.error = error.message
        throw error
      }
    },

    async toggleWorkflowStatus(workflowId: string) {
      try {
        const { db } = useFirebase()
        const workflow = this.workflows.find((w) => w.id === workflowId)
        if (!workflow) throw new Error('Workflow not found')

        const newStatus = workflow.status === 'active' ? 'paused' : 'active'

        await updateDoc(doc(db, COLLECTIONS.WORKFLOWS, workflowId), {
          status: newStatus,
          updatedAt: Timestamp.now(),
        })

        workflow.status = newStatus
      } catch (error: any) {
        this.error = error.message
        throw error
      }
    },

    async executeWorkflow(workflowId: string) {
      try {
        const { db } = useFirebase()
        const workflow = this.workflows.find((w) => w.id === workflowId)
        if (!workflow) throw new Error('Workflow not found')

        // Create execution record
        const executionData = {
          workflowId,
          userId: workflow.userId,
          status: 'running' as const,
          message: 'Workflow started',
          startedAt: Timestamp.now(),
        }

        const docRef = await addDoc(collection(db, COLLECTIONS.WORKFLOW_EXECUTIONS), executionData)

        // Update workflow execution count
        await updateDoc(doc(db, COLLECTIONS.WORKFLOWS, workflowId), {
          executions: increment(1),
          lastRun: Timestamp.now(),
          updatedAt: Timestamp.now(),
        })

        workflow.executions++
        workflow.lastRun = Timestamp.now()

        // Simulate workflow execution (in real app, this would be handled by backend)
        // For now, just mark as success
        setTimeout(async () => {
          await updateDoc(doc(db, COLLECTIONS.WORKFLOW_EXECUTIONS, docRef.id), {
            status: 'success',
            completedAt: Timestamp.now(),
          })

          await updateDoc(doc(db, COLLECTIONS.WORKFLOWS, workflowId), {
            successCount: increment(1),
          })

          workflow.successCount++
        }, 2000)

        return docRef.id
      } catch (error: any) {
        this.error = error.message
        throw error
      }
    },

    async loadExecutions(userId: string) {
      this.loading = true
      this.error = null

      try {
        const { db } = useFirebase()
        const q = query(
          collection(db, COLLECTIONS.WORKFLOW_EXECUTIONS),
          where('userId', '==', userId),
          orderBy('startedAt', 'desc')
        )

        const snapshot = await getDocs(q)
        this.executions = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as WorkflowExecution[]
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },
  },
})
