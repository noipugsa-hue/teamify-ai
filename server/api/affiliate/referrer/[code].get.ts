import { initializeFirebaseAdmin } from '../../../utils/firebase-admin'

const admin = initializeFirebaseAdmin()
const db = admin.firestore()

export default defineEventHandler(async (event) => {
  try {
    const code = getRouterParam(event, 'code')

    if (!code) {
      throw createError({
        statusCode: 400,
        message: 'Referral code is required',
      })
    }

    // Find the user with this referral code
    const snapshot = await db
      .collection('users')
      .where('referralCode', '==', code)
      .limit(1)
      .get()

    if (snapshot.empty || !snapshot.docs[0]) {
      throw createError({
        statusCode: 404,
        message: 'Referrer not found',
      })
    }

    const userData = snapshot.docs[0].data()

    // Return limited public information about the referrer
    return {
      displayName: userData.displayName || 'A Team Member',
      referralCode: userData.referralCode,
      // Don't expose sensitive information
    }
  } catch (error: any) {
    console.error('Error fetching referrer:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to fetch referrer information',
    })
  }
})
