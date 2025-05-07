'use client';

import { TodoProvider } from '@/contexts/TodoContext';
import { TodoContent } from './TodoContent';

export const TodoApp: React.FC = () => {
  return (
    <TodoProvider>
      <TodoContent />
    </TodoProvider>
  );
};
