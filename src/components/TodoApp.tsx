'use client';

import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Todo, TodoFilter as FilterType } from '@/types';
import { TodoForm } from './TodoForm';
import { TodoList } from './TodoList';
import { TodoFilter } from './TodoFilter';
import { TodoInfo } from './TodoInfo';

export const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');

  // タスクの追加
  const handleAddTodo = useCallback((text: string) => {
    const newTodo: Todo = {
      id: uuidv4(),
      text,
      completed: false,
      createdAt: new Date(),
    };
    setTodos((prevTodos) => [...prevTodos, newTodo]);
  }, []);

  // タスクの完了状態切り替え
  const handleToggleTodo = useCallback((id: string) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  // タスクの削除
  const handleDeleteTodo = useCallback((id: string) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  }, []);

  // タスクの編集
  const handleEditTodo = useCallback((id: string, newText: string) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, text: newText } : todo
      )
    );
  }, []);

  // フィルターの変更
  const handleFilterChange = useCallback((newFilter: FilterType) => {
    setFilter(newFilter);
  }, []);

  // 完了済みのタスク数を計算
  const completedCount = todos.filter((todo) => todo.completed).length;

  return (
    <>
      <h1>To-Do リスト</h1>

      <TodoForm onAdd={handleAddTodo} />

      <TodoFilter currentFilter={filter} onFilterChange={handleFilterChange} />

      <TodoList
        todos={todos}
        filter={filter}
        onToggle={handleToggleTodo}
        onDelete={handleDeleteTodo}
        onEdit={handleEditTodo}
      />

      <TodoInfo total={todos.length} completed={completedCount} />
    </>
  );
};
