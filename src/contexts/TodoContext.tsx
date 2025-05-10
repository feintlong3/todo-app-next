'use client';

import React, { createContext, useContext, ReactNode, Dispatch } from 'react';
import { Todo } from '@/types/todo';
import { TodoAction } from '@/reducers/todoReducer';
import { useTodos } from '@/hooks/useTodos';

// コンテキストの型定義
interface TodoContextType {
  todos: Todo[];
  dispatch: Dispatch<TodoAction>;
}

export const TodoContext = createContext<TodoContextType>({
  todos: [],
  dispatch: () => undefined,
});

// カスタムフックでコンテキストの値を取得
export function useTodoContext() {
  const context = useContext(TodoContext);
  if (context === null) {
    throw new Error('useTodoContext must be used within a TodoProvider');
  }
  return context;
}

// プロバイダーコンポーネント
interface TodoProviderProps {
  children: ReactNode;
}

export function TodoProvider({ children }: TodoProviderProps) {
  const todoState = useTodos();

  return (
    <TodoContext.Provider value={todoState}>{children}</TodoContext.Provider>
  );
}
