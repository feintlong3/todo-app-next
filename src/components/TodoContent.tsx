'use client';

import { useTodoContext } from '@/contexts/TodoContext';
import { TodoForm } from './TodoForm';
import { TodoList } from './TodoList';
import { TodoFilter } from './TodoFilter';
import { TodoInfo } from './TodoInfo';

export const TodoContent: React.FC = () => {
  const { filteredTodos, filter, toggleTodo, deleteTodo, editTodo } =
    useTodoContext();

  return (
    <>
      <h1>To-Do リスト</h1>

      <TodoForm />

      <TodoFilter />

      <TodoList
        todos={filteredTodos}
        filter={filter}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
        onEdit={editTodo}
      />

      <TodoInfo />
    </>
  );
};
