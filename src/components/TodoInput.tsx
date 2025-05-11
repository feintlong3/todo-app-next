'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTodoContext } from '@/contexts/TodoContext';
import styles from './TodoInput.module.css';

export function TodoInput() {
  const [text, setText] = useState('');
  const { isAuthenticated } = useAuth();
  const { addTodo } = useTodoContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !isAuthenticated) return;

    // ユーザーIDを持つタスクの追加はaddTodoで行う
    addTodo(text.trim());
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
