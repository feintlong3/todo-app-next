'use client';

import { useAuth } from '@/hooks/useAuth';
import styles from './profile.module.css';

export default function ProfilePage() {
  const { user, loading, isAuthenticated } = useAuth({ required: true });

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>読み込み中...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // リダイレクト処理はuseAuthフックで行われます
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>プロファイル</h1>

      <div className={styles.profileCard}>
        <div className={styles.avatarSection}>
          {user?.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.image}
              alt={user.name || 'プロフィール画像'}
              className={styles.avatar}
            />
          ) : (
            <div className={styles.avatarPlaceholder}>
              {user?.name?.charAt(0) || 'U'}
            </div>
          )}
        </div>

        <div className={styles.infoSection}>
          <div className={styles.infoItem}>
            <div className={styles.label}>名前</div>
            <div className={styles.value}>{user?.name}</div>
          </div>

          <div className={styles.infoItem}>
            <div className={styles.label}>メールアドレス</div>
            <div className={styles.value}>{user?.email}</div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>アカウント情報</h2>
        <div className={styles.accountInfo}>
          <div className={styles.infoRow}>
            <div className={styles.label}>ユーザーID</div>
            <div className={styles.value}>{user?.id}</div>
          </div>
          <div className={styles.infoRow}>
            <div className={styles.label}>認証プロバイダ</div>
            <div className={styles.value}>Google</div>
          </div>
        </div>
      </div>
    </div>
  );
}
