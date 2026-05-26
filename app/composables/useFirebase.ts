import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'

let firebaseApp: FirebaseApp | null = null
let auth: Auth | null = null
let db: Firestore | null = null

// Initialize Firebase on client side only
export function useFirebase() {
  // Only initialize on client side
  if (import.meta.server) {
    return { auth: null as any, db: null as any }
  }

  // Check if already initialized
  if (firebaseApp && auth && db) {
    return { auth, db }
  }

  // Get config from runtime
  const config = useRuntimeConfig()

  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey,
    authDomain: config.public.firebaseAuthDomain,
    projectId: config.public.firebaseProjectId,
    storageBucket: config.public.firebaseStorageBucket,
    messagingSenderId: config.public.firebaseMessagingSenderId,
    appId: config.public.firebaseAppId,
  }

  // Initialize Firebase if not already initialized
  if (!getApps().length) {
    firebaseApp = initializeApp(firebaseConfig)
  } else {
    firebaseApp = getApps()[0] || null
  }

  // Get auth and firestore instances
  if (firebaseApp) {
    auth = getAuth(firebaseApp)
    db = getFirestore(firebaseApp)
  }

  return { auth, db }
}
