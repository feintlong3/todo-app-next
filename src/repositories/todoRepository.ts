import { Todo } from '@/types/todo';

export interface TodoRepository {
  findAll(userId: string): Promise<Todo[]>;
  findById(id: string, userId: string): Promise<Todo | null>;
  findByFilter(
    userId: string,
    filter: 'all' | 'active' | 'completed'
  ): Promise<Todo[]>;
  create(data: { text: string; userId: string }): Promise<Todo>;
  update(
    id: string,
    data: { text?: string; completed?: boolean },
    userId: string
  ): Promise<Todo>;
  delete(id: string, userId: string): Promise<void>;
  deleteCompleted(userId: string): Promise<void>;
  toggleAll(userId: string, completed: boolean): Promise<void>;
}
