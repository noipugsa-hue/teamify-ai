export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore()

  // Wait for auth to initialize
  if (!authStore.initialized) {
    await authStore.initAuth()
  }

  // Check if user is authenticated
  if (!authStore.isAuthenticated) {
    return navigateTo('/auth/login')
  }

  // Check if onboarding is completed (optional)
  if (authStore.userProfile && !authStore.userProfile.onboardingCompleted) {
    // You can redirect to onboarding page if needed
    // return navigateTo('/onboarding')
  }
})
