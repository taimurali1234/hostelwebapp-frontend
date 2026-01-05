import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Hook to handle automatic token refresh before expiration
 * Refreshes token 5 minutes before it expires
 */
export const useTokenRefresh = () => {
  const { refreshAccessToken } = useAuth();

  useEffect(() => {
    // Access token expires in 1 hour (3600 seconds)
    // Refresh 5 minutes (300 seconds) before expiration
    const refreshInterval = setInterval(() => {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        try {
          refreshAccessToken().catch((err) => {
            console.error('Auto token refresh failed:', err);
          });
        } catch (error) {
          console.error('Token refresh error:', error);
        }
      }
    }, (3600 - 300) * 1000); // Refresh after 55 minutes

    return () => clearInterval(refreshInterval);
  }, [refreshAccessToken]);
};

export default useTokenRefresh;
