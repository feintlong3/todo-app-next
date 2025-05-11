'use client';

import { useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import { Todo, FilterType } from '@/types/todo';
import { useAuth } from '@/hooks/useAuth';
import { TodoItem } from './TodoItem';
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  clearCompletedTodos,
  toggleAllTodos,
} from '@/app/actions/todoActions';
import styles from './TodoList.module.css';

export function TodoList() {
  const { isAuthenticated } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 初期データの読み込み
  useEffect(() => {
    async function loadTodos() {
      if (isAuthenticated) {
        setIsLoading(true);
        setError(null);

        try {
          const result = await getTodos(filter);
          if (result.success && result.todos) {
            setTodos(result.todos);
          } else if (result.error) {
            setError(result.error);
          }
        } catch (err) {
          setError('データの読み込み中にエラーが発生しました');
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
        setTodos([]);
      }
    }

    loadTodos();
  }, [isAuthenticated, filter]);

  // タスク追加ハンドラー
  const handleAddTodo = async (formData: FormData) => {
    if (!isAuthenticated) {
      return;
    }

    try {
      const result = await createTodo(formData);
      if (result.success && result.todo) {
        setTodos([result.todo, ...todos]);
      } else if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      setError('タスクの追加中にエラーが発生しました');
      console.error(err);
    }
  };

  // タスク更新ハンドラー
  const handleUpdateTodo = async (
    id: string,
    data: { text?: string; completed?: boolean }
  ) => {
    try {
      const result = await updateTodo(id, data);
      if (result.success && result.todo) {
        setTodos(todos.map((todo) => (todo.id === id ? result.todo! : todo)));
      } else if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      setError('タスクの更新中にエラーが発生しました');
      console.error(err);
    }
  };

  // タスク削除ハンドラー
  const handleDeleteTodo = async (id: string) => {
    try {
      const result = await deleteTodo(id);
      if (result.success) {
        setTodos(todos.filter((todo) => todo.id !== id));
      } else if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      setError('タスクの削除中にエラーが発生しました');
      console.error(err);
    }
  };

  // 完了済みタスクのクリアハンドラー
  const handleClearCompleted = async () => {
    try {
      const result = await clearCompletedTodos();
      if (result.success) {
        setTodos(todos.filter((todo) => !todo.completed));
      } else if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      setError('完了済みタスクのクリア中にエラーが発生しました');
      console.error(err);
    }
  };

  // 全タスク完了切り替えハンドラー
  const handleToggleAll = async () => {
    // 現在のすべてのタスクが完了しているかチェック
    const areAllCompleted = todos.every((todo) => todo.completed);

    try {
      const result = await toggleAllTodos(!areAllCompleted);
      if (result.success) {
        setTodos(
          todos.map((todo) => ({
            ...todo,
            completed: !areAllCompleted,
          }))
        );
      } else if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      setError('タスクの一括更新中にエラーが発生しました');
      console.error(err);
    }
  };

  // 完了済みのタスク数
  const completedCount = todos.filter((todo) => todo.completed).length;

  return (
    <div className={styles.container}>
      {error && <div className={styles.error}>{error}</div>}

      {isLoading ? (
        <div className={styles.loading}>読み込み中...</div>
      ) : (
        <>
          <form action={handleAddTodo} className={styles.form}>
            <input
              type="text"
              name="text"
              placeholder={
                isAuthenticated
                  ? '新しいタスクを入力...'
                  : 'ログインするとタスクを保存できます...'
              }
              className={styles.input}
              disabled={!isAuthenticated}
              required
            />
            <button
              type="submit"
              className={styles.button}
              disabled={!isAuthenticated}
            >
              追加
            </button>
          </form>

          {todos.length > 0 && (
            <div className={styles.actions}>
              <button onClick={handleToggleAll} className={styles.actionButton}>
                {todos.every((todo) => todo.completed)
                  ? 'すべて未完了に'
                  : 'すべて完了'}
              </button>

              <div className={styles.filters}>
                <button
                  className={`${styles.filterButton} ${filter === 'all' ? styles.active : ''}`}
                  onClick={() => setFilter('all')}
                >
                  すべて
                </button>
                <button
                  className={`${styles.filterButton} ${filter === 'active' ? styles.active : ''}`}
                  onClick={() => setFilter('active')}
                >
                  未完了
                </button>
                <button
                  className={`${styles.filterButton} ${filter === 'completed' ? styles.active : ''}`}
                  onClick={() => setFilter('completed')}
                >
                  完了済み
                </button>
              </div>

              {completedCount > 0 && (
                <button
                  onClick={handleClearCompleted}
                  className={styles.actionButton}
                >
                  完了済みをクリア
                </button>
              )}
            </div>
          )}

          <ul className={styles.list}>
            {todos.length === 0 ? (
              <li className={styles.emptyMessage}>
                {filter === 'all'
                  ? 'タスクがありません'
                  : filter === 'active'
                    ? '未完了のタスクがありません'
                    : '完了済みのタスクがありません'}
              </li>
            ) : (
              todos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={(id) =>
                    handleUpdateTodo(id, { completed: !todo.completed })
                  }
                  onDelete={handleDeleteTodo}
                  onEdit={(id, text) => handleUpdateTodo(id, { text })}
                />
              ))
            )}
          </ul>

          {!isAuthenticated && (
            <div className={styles.authMessage}>
              <p>Googleでログインすると、あなたのToDo項目が保存されます。</p>
              <button
                onClick={() => signIn('google', { callbackUrl: '/todos' })}
                className={styles.googleButton}
              >
                Googleでログイン
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
