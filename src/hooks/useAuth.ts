import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useAuth({ required = false, redirectTo = '/login' } = {}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const loading = status === 'loading';
  const isAuthenticated = status === 'authenticated';
  const user = session?.user;

  useEffect(() => {
    if (!loading && required && !session) {
      router.push(redirectTo);
    }
  }, [loading, required, session, router, redirectTo]);

  return {
    session,
    status,
    loading,
    isAuthenticated,
    user,
  };
}
