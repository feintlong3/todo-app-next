'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTodoContext } from '@/contexts/TodoContext';
import { todoFormInputSchema } from '@/schemas/todoSchema';
import { z } from 'zod';
import { createTodo } from '@/app/actions/todoActions';

export const TodoForm: React.FC = () => {
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { dispatch } = useTodoContext();
  const { isAuthenticated } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isAuthenticated) return;

    try {
      // zodでバリデーション
      const validatedInput = todoFormInputSchema.parse({ text });

      // Server Action実行
      const formData = new FormData();
      formData.append('text', validatedInput.text);
      const result = await createTodo(formData);

      if (result.success && result.todo) {
        // TodoContextに追加
        dispatch({
          type: 'ADD_TODO',
          payload: { text: validatedInput.text },
        });
        setText('');
        setError(null);
      } else if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        // エラーメッセージを表示
        setError(err.errors[0].message);
      } else {
        setError('エラーが発生しました');
        console.error(err);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    // 入力中はエラーをクリア
    if (error) setError(null);
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form" data-testid="todo-form">
      <div className="todo-form-container">
        <input
          type="text"
          value={text}
          onChange={handleChange}
          placeholder={
            isAuthenticated
              ? 'タイトルを入力...'
              : 'ログインするとタスクを保存できます...'
          }
          className={`todo-input ${error ? 'has-error' : ''}`}
          disabled={!isAuthenticated}
          data-testid="todo-input"
        />
        <button
          type="submit"
          className="todo-submit"
          disabled={!isAuthenticated || !text.trim()}
          data-testid="todo-submit"
        >
          登録
        </button>
      </div>
      {error && (
        <div className="error-message" data-testid="error-message">
          {error}
        </div>
      )}
    </form>
  );
};
