'use client';

import { useState } from 'react';
import { useTodoContext } from '@/contexts/TodoContext';
import { todoFormInputSchema } from '@/schemas/todoSchema';
import { z } from 'zod';

export const TodoForm: React.FC = () => {
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { addTodo } = useTodoContext();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // zodでバリデーション
      const validatedInput = todoFormInputSchema.parse({ text });
      addTodo(validatedInput.text);
      setText('');
      setError(null);
    } catch (err) {
      if (err instanceof z.ZodError) {
        // エラーメッセージを表示
        setError(err.errors[0].message);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    // 入力中はエラーをクリア
    if (error) setError(null);
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <div className="todo-form-container">
        <input
          type="text"
          value={text}
          onChange={handleChange}
          placeholder="タイトルを入力..."
          className={`todo-input ${error ? 'has-error' : ''}`}
        />
        <button type="submit" className="todo-submit">
          登録
        </button>
      </div>
      {error && <div className="error-message">{error}</div>}
    </form>
  );
};
