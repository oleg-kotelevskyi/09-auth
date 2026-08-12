'use client';

import React, { useEffect } from 'react';
import { clientApi } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import { User } from '@/types/user';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { setUser, clearIsAuthenticated } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const response = await clientApi.checkSession();
        const sessionData = response.data;

        if (sessionData && sessionData.email) {
          const userData = (await clientApi.getMe()) as User;
          
          if (userData && userData.email) {
            setUser(userData);
            return;
          }
        }
        clearIsAuthenticated();
      } catch (error) {
        console.error('AuthProvider session init failed:', error);
        clearIsAuthenticated();
      }
    };

    initAuth();
  }, [setUser, clearIsAuthenticated]);

  return <>{children}</>;
};

export default AuthProvider;
