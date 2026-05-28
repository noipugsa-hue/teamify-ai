/**
 * Firebase Security Rules
 *
 * These rules should be deployed to Firebase Console.
 * Run: firebase deploy --only firestore:rules
 */

export const firestoreRules = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    function isAdmin() {
      return isAuthenticated() &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Users collection
    match /users/{userId} {
      // Users can read their own profile
      allow read: if isOwner(userId);

      // Users can create their own profile
      allow create: if isOwner(userId);

      // Users can update their own profile (except role)
      allow update: if isOwner(userId) &&
                       (!request.resource.data.diff(resource.data).affectedKeys().hasAny(['role']));

      // Only admins can delete users
      allow delete: if isAdmin();

      // User's generated content subcollection
      match /generated_content/{contentId} {
        allow read, write: if isOwner(userId);
      }

      // User's notifications subcollection
      match /notifications/{notificationId} {
        allow read, write: if isOwner(userId);
      }

      // User's analytics subcollection
      match /analytics/{analyticsId} {
        allow read: if isOwner(userId);
        allow write: if false; // Only server can write
      }
    }

    // Generated content collection
    match /generated_content/{contentId} {
      allow read: if isAuthenticated() &&
                     resource.data.userId == request.auth.uid;

      allow create: if isAuthenticated() &&
                       request.resource.data.userId == request.auth.uid;

      allow update: if isAuthenticated() &&
                       resource.data.userId == request.auth.uid;

      allow delete: if isAuthenticated() &&
                       resource.data.userId == request.auth.uid;
    }

    // Affiliate links collection
    match /affiliate_links/{linkId} {
      // Users can read their own links
      allow read: if isAuthenticated() &&
                     resource.data.userId == request.auth.uid;

      // Users can create their own links
      allow create: if isAuthenticated() &&
                       request.resource.data.userId == request.auth.uid;

      // Users can update their own links
      allow update: if isAuthenticated() &&
                       resource.data.userId == request.auth.uid;

      // Users can delete their own links
      allow delete: if isAuthenticated() &&
                       resource.data.userId == request.auth.uid;
    }

    // Landing pages collection
    match /landing_pages/{pageId} {
      // Anyone can read published pages
      allow read: if resource.data.published == true ||
                     (isAuthenticated() && resource.data.userId == request.auth.uid);

      // Users can create their own pages
      allow create: if isAuthenticated() &&
                       request.resource.data.userId == request.auth.uid;

      // Users can update their own pages
      allow update: if isAuthenticated() &&
                       resource.data.userId == request.auth.uid;

      // Users can delete their own pages
      allow delete: if isAuthenticated() &&
                       resource.data.userId == request.auth.uid;
    }

    // Notifications collection
    match /notifications/{notificationId} {
      // Users can read their own notifications
      allow read: if isAuthenticated() &&
                     resource.data.userId == request.auth.uid;

      // Only server can create notifications
      allow create: if false;

      // Users can update their own notifications (e.g., mark as read)
      allow update: if isAuthenticated() &&
                       resource.data.userId == request.auth.uid;

      // Users can delete their own notifications
      allow delete: if isAuthenticated() &&
                       resource.data.userId == request.auth.uid;
    }

    // Subscriptions collection
    match /subscriptions/{subscriptionId} {
      // Users can read their own subscription
      allow read: if isAuthenticated() &&
                     resource.data.userId == request.auth.uid;

      // Only server can write subscriptions
      allow create, update, delete: if false;
    }

    // Analytics collection
    match /analytics/{analyticsId} {
      // Users can read their own analytics
      allow read: if isAuthenticated() &&
                     resource.data.userId == request.auth.uid;

      // Only server can write analytics
      allow create, update, delete: if false;
    }

    // Viral hooks collection
    match /viral_hooks/{hookId} {
      // Users can read their own hooks
      allow read: if isAuthenticated() &&
                     resource.data.userId == request.auth.uid;

      // Users can create their own hooks
      allow create: if isAuthenticated() &&
                       request.resource.data.userId == request.auth.uid;

      // Users can update their own hooks
      allow update: if isAuthenticated() &&
                       resource.data.userId == request.auth.uid;

      // Users can delete their own hooks
      allow delete: if isAuthenticated() &&
                       resource.data.userId == request.auth.uid;
    }

    // Templates collection
    match /templates/{templateId} {
      // All authenticated users can read templates
      allow read: if isAuthenticated();

      // Only admins can write templates
      allow create, update, delete: if isAdmin();
    }

    // AI chats collection
    match /ai_chats/{chatId} {
      // Users can read their own chats
      allow read: if isAuthenticated() &&
                     resource.data.userId == request.auth.uid;

      // Users can create their own chats
      allow create: if isAuthenticated() &&
                       request.resource.data.userId == request.auth.uid;

      // Users can update their own chats
      allow update: if isAuthenticated() &&
                       resource.data.userId == request.auth.uid;

      // Users can delete their own chats
      allow delete: if isAuthenticated() &&
                       resource.data.userId == request.auth.uid;
    }

    // Payments collection
    match /payments/{paymentId} {
      // Users can read their own payments
      allow read: if isAuthenticated() &&
                     resource.data.userId == request.auth.uid;

      // Only server can write payments
      allow create, update, delete: if false;
    }

    // Webhooks collection (server only)
    match /webhooks/{webhookId} {
      allow read, write: if false;
    }

    // Default deny all other collections
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
`

export const storageRules = `
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    function isValidImageType() {
      return request.resource.contentType.matches('image/.*');
    }

    function isValidFileSize() {
      return request.resource.size < 5 * 1024 * 1024; // 5MB
    }

    // User profile images
    match /users/{userId}/profile/{fileName} {
      allow read: if true;
      allow write: if isOwner(userId) &&
                      isValidImageType() &&
                      isValidFileSize();
    }

    // User content images
    match /users/{userId}/content/{fileName} {
      allow read: if true;
      allow write: if isOwner(userId) &&
                      isValidImageType() &&
                      isValidFileSize();
    }

    // Landing page assets
    match /landing-pages/{pageId}/{fileName} {
      allow read: if true;
      allow write: if isAuthenticated() &&
                      isValidFileSize();
    }

    // Default deny
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
`

export default {
  firestoreRules,
  storageRules
}
