import { initializeFirebaseAdmin } from '../../utils/firebase-admin'

export default defineEventHandler(async (event) => {
  try {
    // Initialize Firebase Admin
    const admin = initializeFirebaseAdmin()

    // Get the request body
    const body = await readBody(event)
    const { file, fileName, contentType, userId } = body

    if (!file || !fileName || !userId) {
      return {
        success: false,
        error: 'Missing required fields: file, fileName, and userId',
      }
    }

    // Remove data URL prefix (e.g., "data:image/png;base64,")
    const base64Data = file.replace(/^data:image\/\w+;base64,/, '')
    const buffer = Buffer.from(base64Data, 'base64')

    // Generate unique file name
    const timestamp = Date.now()
    const fileExtension = fileName.split('.').pop()
    const uniqueFileName = `profile-photos/${userId}/${timestamp}.${fileExtension}`

    // Get Firebase Storage bucket
    const bucket = admin.storage().bucket()

    // Upload file
    const fileRef = bucket.file(uniqueFileName)
    await fileRef.save(buffer, {
      metadata: {
        contentType: contentType || 'image/jpeg',
      },
    })

    // Make the file public
    await fileRef.makePublic()

    // Get public URL
    const photoURL = `https://storage.googleapis.com/${bucket.name}/${uniqueFileName}`

    return {
      success: true,
      data: {
        photoURL,
        fileName: uniqueFileName,
      },
    }
  } catch (error: any) {
    console.error('Upload error:', error)
    return {
      success: false,
      error: error.message || 'Failed to upload photo',
    }
  }
})
