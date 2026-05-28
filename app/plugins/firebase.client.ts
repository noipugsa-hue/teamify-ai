import { initializeFirebase } from '~/firebase'

export default defineNuxtPlugin(() => {
  // Initialize Firebase on client side
  const { app, auth, db, storage } = initializeFirebase()

  console.log('✅ Firebase initialized:', {
    projectId: app.options.projectId,
    authDomain: app.options.authDomain,
  })

  return {
    provide: {
      firebase: {
        app,
        auth,
        db,
        storage,
      },
    },
  }
})
