import { useEffect, type ReactNode } from 'react';
import { useSegments, useRouter } from 'expo-router';
import { useAuthStore } from '@/store/auth-store';
import { getAccessToken } from '@/lib/api/client';

/**
 * Auth guard component that protects routes based on authentication state
 * Redirects to login if not authenticated, otherwise renders children
 */
export function AuthGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated, isInitializing, initialize } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  // Initialize auth state on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Check if we're on the login screen
  // TypeScript may infer segments as a tuple [string], so we assert it as an array
  // to safely access index 1
  const segmentsArray = segments as string[];
  const isLoginScreen = 
    segmentsArray.length >= 2 && 
    segmentsArray[0] === '(auth)' && 
    segmentsArray[1] === 'login';

  // Handle navigation based on auth state
  useEffect(() => {
    if (isInitializing) {
      return; // Wait for initialization
    }

    // If not authenticated and not on login screen, redirect to login
    if (!isAuthenticated && !isLoginScreen) {
      router.replace('/(auth)/login');
      return;
    }

    // If authenticated and on login screen, redirect to main app
    if (isAuthenticated && isLoginScreen) {
      router.replace('/(tabs)');
      return;
    }
  }, [isAuthenticated, isInitializing, isLoginScreen, router]);

  // Verify token still exists (in case it was cleared externally)
  useEffect(() => {
    const verifyToken = async () => {
      if (isAuthenticated && !isLoginScreen && !isInitializing) {
        const token = await getAccessToken();
        if (!token) {
          // Token was cleared externally, clear auth state
          useAuthStore.getState().clearAuth();
          router.replace('/(auth)/login');
        }
      }
    };
    verifyToken();
  }, [isAuthenticated, isLoginScreen, isInitializing, router]);

  // Show loading state while initializing
  if (isInitializing) {
    return null; // Or return a loading spinner component
  }

  return <>{children}</>;
}
