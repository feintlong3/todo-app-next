'use client';

import React, {
  createContext,
  useContext,
  ReactNode,
  useReducer,
  useCallback,
  useMemo,
} from 'react';
import { Todo, FilterType } from '@/types/todo';
import { todoReducer, TodoAction, TodoState } from '@/reducers/todoReducer';

// 初期状態
const initialState: TodoState = {
  todos: [],
  filter: 'all',
};

// コンテキストの型定義
interface TodoContextType {
  todos: Todo[];
  filter: FilterType;
  filteredTodos: Todo[];
  stats: {
    total: number;
    completed: number;
    active: number;
  };
  dispatch: React.Dispatch<TodoAction>;
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  editTodo: (id: string, text: string) => void;
  changeFilter: (filter: FilterType) => void;
}

// TodoContextを作成
export const TodoContext = createContext<TodoContextType | null>(null);

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
  const [state, dispatch] = useReducer(todoReducer, initialState);
  const { todos, filter } = state;

  // 便利なアクションディスパッチャー
  const addTodo = useCallback((text: string) => {
    dispatch({ type: 'ADD_TODO', payload: { text } });
  }, []);

  const toggleTodo = useCallback((id: string) => {
    dispatch({ type: 'TOGGLE_TODO', payload: { id } });
  }, []);

  const deleteTodo = useCallback((id: string) => {
    dispatch({ type: 'DELETE_TODO', payload: { id } });
  }, []);

  const editTodo = useCallback((id: string, text: string) => {
    dispatch({ type: 'EDIT_TODO', payload: { id, text } });
  }, []);

  const changeFilter = useCallback((filter: FilterType) => {
    dispatch({ type: 'SET_FILTER', payload: { filter } });
  }, []);

  // フィルターされたTodoを計算
  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      if (filter === 'active') return !todo.completed;
      if (filter === 'completed') return todo.completed;
      return true; // 'all'の場合はすべて表示
    });
  }, [todos, filter]);

  // 統計情報を計算
  const stats = useMemo(() => {
    return {
      total: todos.length,
      completed: todos.filter((todo) => todo.completed).length,
      active: todos.filter((todo) => !todo.completed).length,
    };
  }, [todos]);

  // コンテキスト値を作成
  const contextValue = {
    todos,
    filter,
    filteredTodos,
    stats,
    dispatch,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    changeFilter,
  };

  return (
    <TodoContext.Provider value={contextValue}>{children}</TodoContext.Provider>
  );
}
