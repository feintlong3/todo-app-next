'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { TodoFilter } from '@/types';
import { useTodos } from '@/hooks/useTodos';

// コンテキストの型定義
interface TodoContextType {
  filteredTodos: ReturnType<typeof useTodos>['filteredTodos'];
  filter: TodoFilter;
  stats: ReturnType<typeof useTodos>['stats'];
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  editTodo: (id: string, text: string) => void;
  changeFilter: (filter: TodoFilter) => void;
}

// デフォルト値はnullだが、Providerで必ず値を提供するため実行時にはnullにならない
const TodoContext = createContext<TodoContextType | null>(null);

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
