'use client';

import Link from 'next/link';
import { signIn, signOut } from 'next-auth/react';
import { useAuth } from '@/hooks/useAuth';
import styles from './Header.module.css';

export function Header() {
  const { isAuthenticated, user, loading } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link href="/">ToDoアプリ</Link>
        </div>

        <nav className={styles.nav}>
          {loading ? (
            <div className={styles.loadingIndicator}>読み込み中...</div>
          ) : isAuthenticated ? (
            <div className={styles.userMenu}>
              <Link href="/profile" className={styles.profileLink}>
                <div className={styles.userInfo}>
                  {user?.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.image}
                      alt={user.name || 'ユーザープロフィール'}
                      className={styles.avatar}
                    />
                  )}
                  <span className={styles.username}>{user?.name}</span>
                </div>
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className={styles.signOutButton}
              >
                ログアウト
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn('google', { callbackUrl: '/' })}
              className={styles.signInButton}
            >
              Googleでログイン
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
