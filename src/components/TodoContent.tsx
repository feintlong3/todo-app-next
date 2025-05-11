'use client';

import { useTodoContext } from '@/contexts/TodoContext';
import { TodoForm } from './TodoForm';
import { TodoFilter } from './TodoFilter';
import { TodoInfo } from './TodoInfo';
import { TodoList } from './TodoList';

export const TodoContent: React.FC = () => {
  const { filteredTodos, toggleTodo, deleteTodo, editTodo } = useTodoContext();

  return (
    <>
      <h1>To-Do リスト</h1>

      <TodoForm />

      <TodoFilter />

      <TodoList
        todos={filteredTodos}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
        onEdit={editTodo}
      />

      <TodoInfo />
    </>
  );
};
