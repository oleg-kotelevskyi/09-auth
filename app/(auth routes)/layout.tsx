'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    router.refresh();

    if (isAuthenticated) {
      router.push('/notes/filter/all');
    }
  }, [isAuthenticated, router]);

  return <>{children}</>;
}

