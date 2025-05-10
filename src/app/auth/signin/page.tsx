'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import styles from './signin.module.css';

export function SignInButton() {
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  if (loading) {
    return <div className={styles.loading}>読み込み中...</div>;
  }

  if (session) {
    return (
      <button
        className={styles.signOutButton}
        onClick={() => signOut({ callbackUrl: '/' })}
      >
        ログアウト
      </button>
    );
  }

  return (
    <button
      className={styles.signInButton}
      onClick={() => signIn('google', { callbackUrl: '/' })}
    >
      Googleでログイン
    </button>
  );
}
