import { initializeFirebaseAdmin } from '../../utils/firebase-admin'

const admin = initializeFirebaseAdmin()
const db = admin.firestore()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { referralCode, source } = body

    if (!referralCode) {
      throw createError({
        statusCode: 400,
        message: 'Referral code is required',
      })
    }

    // Find the user with this referral code
    const usersSnapshot = await db
      .collection('users')
      .where('referralCode', '==', referralCode)
      .limit(1)
      .get()

    if (usersSnapshot.empty || !usersSnapshot.docs[0]) {
      throw createError({
        statusCode: 404,
        message: 'Invalid referral code',
      })
    }

    const userId = usersSnapshot.docs[0].id

    // If source is provided, find and update the specific affiliate link
    if (source) {
      const linksSnapshot = await db
        .collection('affiliate_links')
        .where('userId', '==', userId)
        .where('shortCode', '==', source)
        .where('active', '==', true)
        .limit(1)
        .get()

      if (!linksSnapshot.empty && linksSnapshot.docs[0]) {
        const linkDoc = linksSnapshot.docs[0]
        await linkDoc.ref.update({
          clicks: admin.firestore.FieldValue.increment(1),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        })
      }
    }

    // Update user's total referral clicks
    await db.collection('users').doc(userId).update({
      'stats.totalReferralClicks': admin.firestore.FieldValue.increment(1),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    })

    return {
      success: true,
      message: 'Click tracked successfully',
    }
  } catch (error: any) {
    console.error('Error tracking click:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to track click',
    })
  }
})
