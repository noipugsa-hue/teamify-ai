import admin from 'firebase-admin'
import { readFileSync } from 'fs'
import { resolve } from 'path'

let isInitialized = false

export function initializeFirebaseAdmin() {
  if (isInitialized) {
    return admin
  }

  if (admin.apps.length === 0) {
    let credential: admin.credential.Credential

    // Method 1: Try to load from service account JSON file
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH

    if (serviceAccountPath) {
      try {
        const absolutePath = resolve(serviceAccountPath)
        const serviceAccount = JSON.parse(readFileSync(absolutePath, 'utf8'))
        credential = admin.credential.cert(serviceAccount)

        console.log('✅ Firebase Admin initialized from service account file')
      } catch (error) {
        throw new Error(
          `Failed to read service account file at ${serviceAccountPath}: ${error}`
        )
      }
    }
    // Method 2: Try to load from JSON string in environment variable
    else if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      try {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)
        credential = admin.credential.cert(serviceAccount)

        console.log('✅ Firebase Admin initialized from JSON environment variable')
      } catch (error) {
        throw new Error(
          'Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON: ' + error
        )
      }
    }
    // Method 3: Load from individual environment variables
    else {
      let privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY || ''

      // Replace escaped newlines with actual newlines
      privateKey = privateKey.replace(/\\n/g, '\n')

      const serviceAccount = {
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey,
      }

      // Validate required credentials
      if (!serviceAccount.projectId || !serviceAccount.clientEmail || !serviceAccount.privateKey) {
        const missing = []
        if (!serviceAccount.projectId) missing.push('FIREBASE_ADMIN_PROJECT_ID')
        if (!serviceAccount.clientEmail) missing.push('FIREBASE_ADMIN_CLIENT_EMAIL')
        if (!serviceAccount.privateKey) missing.push('FIREBASE_ADMIN_PRIVATE_KEY')

        throw new Error(
          `Missing Firebase Admin credentials: ${missing.join(', ')}. \n` +
          'Please use one of these methods:\n' +
          '1. Set FIREBASE_SERVICE_ACCOUNT_PATH to path of your service account JSON file\n' +
          '2. Set FIREBASE_SERVICE_ACCOUNT_JSON with the entire JSON content\n' +
          '3. Set individual variables: FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY'
        )
      }

      credential = admin.credential.cert(serviceAccount as any)

      console.log('✅ Firebase Admin initialized from individual environment variables')
    }

    const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID

    admin.initializeApp({
      credential,
      storageBucket: `${projectId}.firebasestorage.app`,
    })

    isInitialized = true
  }

  return admin
}

export { admin }
