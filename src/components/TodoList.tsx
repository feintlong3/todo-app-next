'use client';

import { useState, useEffect, useReducer } from 'react';
import { signIn } from 'next-auth/react';
import { TodoList as TodoListType, FilterType } from '@/types/todo';
import { todoReducer } from '@/reducers/todoReducer';
import { TodoContext } from '@/contexts/TodoContext';
import { useAuth } from '@/hooks/useAuth';
import { TodoItem } from './TodoItem';
import { TodoInput } from './TodoInput';
import { FilterButtons } from './FilterButtons';
import styles from './TodoList.module.css';

// 初期ToDo項目
const initialTodos: TodoListType = [];

export function TodoList() {
  const { user, isAuthenticated } = useAuth();
  const [todos, dispatch] = useReducer(todoReducer, initialTodos);
  const [filter, setFilter] = useState<FilterType>('all');
  const [isLoading, setIsLoading] = useState(true);

  // ローカルストレージからToDo項目を読み込む
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      setIsLoading(true);
      const storedTodos = localStorage.getItem(`todos_${user.id}`);

      if (storedTodos) {
        try {
          const parsedTodos = JSON.parse(storedTodos) as TodoListType;
          dispatch({ type: 'INITIALIZE', payload: parsedTodos });
        } catch (e) {
          console.error('Failed to parse stored todos:', e);
          dispatch({ type: 'INITIALIZE', payload: [] });
        }
      } else {
        dispatch({ type: 'INITIALIZE', payload: [] });
      }

      setIsLoading(false);
    } else if (!isAuthenticated) {
      // 未認証の場合はデモデータを表示
      setIsLoading(true);
      dispatch({ type: 'INITIALIZE', payload: initialTodos });
      setIsLoading(false);
    }
  }, [isAuthenticated, user?.id]);

  // ToDo項目が変更されたらローカルストレージに保存
  useEffect(() => {
    if (isAuthenticated && user?.id && !isLoading) {
      localStorage.setItem(`todos_${user.id}`, JSON.stringify(todos));
    }
  }, [todos, isAuthenticated, user?.id, isLoading]);

  // フィルター条件に基づいてToDo項目をフィルタリング
  const filteredTodos = todos.filter((todo) => {
    switch (filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  // 完了済みのToDo項目の数
  const completedCount = todos.filter((todo) => todo.completed).length;

  // すべての未完了のToDo項目を完了に切り替え
  const handleCompleteAll = () => {
    dispatch({ type: 'COMPLETE_ALL' });
  };

  // すべての完了済みToDo項目をクリア
  const handleClearCompleted = () => {
    dispatch({ type: 'CLEAR_COMPLETED' });
  };

  return (
    <TodoContext.Provider value={{ todos, dispatch }}>
      <div className={styles.container}>
        <h1 className={styles.title}>ToDoリスト</h1>

        {isLoading ? (
          <div className={styles.loading}>読み込み中...</div>
        ) : (
          <>
            <TodoInput />

            {todos.length > 0 && (
              <div className={styles.actions}>
                <button
                  onClick={handleCompleteAll}
                  className={styles.actionButton}
                >
                  すべて完了
                </button>

                <FilterButtons filter={filter} setFilter={setFilter} />

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
              {filteredTodos.length === 0 ? (
                <li className={styles.emptyMessage}>
                  {filter === 'all'
                    ? 'タスクがありません'
                    : filter === 'active'
                      ? '未完了のタスクがありません'
                      : '完了済みのタスクがありません'}
                </li>
              ) : (
                filteredTodos.map((todo) => (
                  <TodoItem key={todo.id} todo={todo} />
                ))
              )}
            </ul>

            {!isAuthenticated && (
              <div className={styles.authMessage}>
                <p>Googleでログインすると、あなたのToDo項目が保存されます。</p>
                <button
                  onClick={() => signIn('google', { callbackUrl: '/' })}
                  className={styles.googleButton}
                >
                  <svg className={styles.googleIcon} viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Googleでログイン
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </TodoContext.Provider>
  );
}
