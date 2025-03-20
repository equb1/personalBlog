// components/admin/withAdminAuth.tsx
'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function withAdminAuth(WrappedComponent: React.ComponentType) {
  return function ProtectedPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === 'loading') return;
      if (!session?.user?.roles?.includes('ADMIN')) {
        router.push('/auth/login');
      }
    }, [session, status, router]);

    if (status === 'loading' || !session?.user) {
      return <div>Loading...</div>;
    }

    return <WrappedComponent />;
  };
}