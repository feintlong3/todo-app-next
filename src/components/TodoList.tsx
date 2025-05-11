'use client';

import { useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useAuth } from '@/hooks/useAuth';
import { useTodoContext } from '@/contexts/TodoContext';
import { TodoItem } from './TodoItem';
import styles from './TodoList.module.css';
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  clearCompletedTodos,
  toggleAllTodos,
} from '@/app/actions/todoActions';

export function TodoList() {
  const { isAuthenticated } = useAuth();
  const { todos, filter, filteredTodos, changeFilter, dispatch } =
    useTodoContext();

  // 初期データの読み込み
  useEffect(() => {
    async function loadTodos() {
      if (isAuthenticated) {
        try {
          // 常に全てのタスクを取得
          const result = await getTodos('all');
          if (result.success && result.todos) {
            // TodoContextに初期データをセット
            dispatch({ type: 'INITIALIZE', payload: result.todos });
          }
        } catch (err) {
          console.error('データの読み込み中にエラーが発生しました', err);
        }
      }
    }

    loadTodos();
  }, [isAuthenticated, dispatch]);

  // タスク追加ハンドラー
  const handleAddTodo = async (formData: FormData) => {
    if (!isAuthenticated) return;

    try {
      const result = await createTodo(formData);
      if (result.success && result.todo) {
        // 追加に成功した場合、新しいタスクをコンテキストに追加
        dispatch({
          type: 'ADD_TODO',
          payload: { text: result.todo.text },
        });
      }
    } catch (err) {
      console.error('タスクの追加中にエラーが発生しました', err);
    }
  };

  // タスクトグルハンドラー
  const handleToggleTodo = async (id: string, completed: boolean) => {
    try {
      await updateTodo(id, { completed: !completed });
      // コンテキストの状態を更新
      dispatch({ type: 'TOGGLE_TODO', payload: { id } });
    } catch (err) {
      console.error('タスクの更新中にエラーが発生しました', err);
    }
  };

  // タスク編集ハンドラー
  const handleEditTodo = async (id: string, text: string) => {
    try {
      await updateTodo(id, { text });
      // コンテキストの状態を更新
      dispatch({ type: 'EDIT_TODO', payload: { id, text } });
    } catch (err) {
      console.error('タスクの更新中にエラーが発生しました', err);
    }
  };

  // タスク削除ハンドラー
  const handleDeleteTodo = async (id: string) => {
    try {
      await deleteTodo(id);
      // コンテキストの状態を更新
      dispatch({ type: 'DELETE_TODO', payload: { id } });
    } catch (err) {
      console.error('タスクの削除中にエラーが発生しました', err);
    }
  };

  // 完了済みタスクのクリアハンドラー
  const handleClearCompleted = async () => {
    try {
      await clearCompletedTodos();
      // コンテキストの状態を更新
      dispatch({ type: 'CLEAR_COMPLETED' });
    } catch (err) {
      console.error('完了済みタスクのクリア中にエラーが発生しました', err);
    }
  };

  // 全タスク完了切り替えハンドラー
  const handleToggleAll = async () => {
    // 現在のすべてのタスクが完了しているかチェック
    const areAllCompleted = todos.every((todo) => todo.completed);

    try {
      await toggleAllTodos(!areAllCompleted);
      // コンテキストの状態を更新
      dispatch({ type: 'COMPLETE_ALL' });
    } catch (err) {
      console.error('タスクの一括更新中にエラーが発生しました', err);
    }
  };

  // 完了済みのタスク数
  const completedCount = todos.filter((todo) => todo.completed).length;

  return (
    <div className={styles.container}>
      <form action={handleAddTodo} className={styles.form}>
        <input
          type="text"
          name="text"
          placeholder={
            isAuthenticated
              ? 'タイトルを入力...'
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
          登録
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
              onClick={() => changeFilter('all')}
            >
              すべて
            </button>
            <button
              className={`${styles.filterButton} ${filter === 'active' ? styles.active : ''}`}
              onClick={() => changeFilter('active')}
            >
              未完了
            </button>
            <button
              className={`${styles.filterButton} ${filter === 'completed' ? styles.active : ''}`}
              onClick={() => changeFilter('completed')}
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
          <li className={styles.emptyMessage}>タスクがありません</li>
        ) : filteredTodos.length === 0 ? (
          <li className={styles.emptyMessage}>
            {filter === 'active'
              ? '未完了のタスクがありません'
              : '完了済みのタスクがありません'}
          </li>
        ) : (
          filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={() => handleToggleTodo(todo.id, todo.completed)}
              onDelete={() => handleDeleteTodo(todo.id)}
              onEdit={(text) => handleEditTodo(todo.id, text)}
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
    </div>
  );
}
