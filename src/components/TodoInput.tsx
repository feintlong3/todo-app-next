'use client';

import { useContext, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { TodoContext } from '@/contexts/TodoContext';
import styles from './TodoInput.module.css';

export function TodoInput() {
  const [text, setText] = useState('');
  const { isAuthenticated, user } = useAuth();
  const { dispatch } = useContext(TodoContext);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    // ユーザーIDを付与してToDoを追加
    dispatch({
      type: 'ADD',
      payload: text.trim(),
      userId: user?.id,
    });
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={
          isAuthenticated
            ? '新しいタスクを入力...'
            : 'ログインするとタスクを保存できます...'
        }
        className={styles.input}
        disabled={!isAuthenticated}
      />
      <button
        type="submit"
        className={styles.button}
        disabled={!isAuthenticated || !text.trim()}
      >
        追加
      </button>
    </form>
  );
}
