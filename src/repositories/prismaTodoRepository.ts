import { prisma } from '@/lib/prisma';
import { Todo } from '@/types/todo';
import { TodoRepository } from './todoRepository';

// Prismaの日付型をTodo型に変換するヘルパー関数
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function convertPrismaTodoToTodo(todo: any): Todo {
  return {
    ...todo,
    createdAt: todo.createdAt.toISOString(),
    updatedAt: todo.updatedAt.toISOString(),
  };
}

export class PrismaTodoRepository implements TodoRepository {
  async findAll(userId: string): Promise<Todo[]> {
    const todos = await prisma.todo.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    // Dateオブジェクトを文字列に変換
    return todos.map(convertPrismaTodoToTodo);
  }

  async findById(id: string, userId: string): Promise<Todo | null> {
    const todo = await prisma.todo.findFirst({
      where: { id, userId },
    });
    return todo ? convertPrismaTodoToTodo(todo) : null;
  }

  async findByFilter(
    userId: string,
    filter: 'all' | 'active' | 'completed'
  ): Promise<Todo[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { userId };

    if (filter === 'active') {
      where.completed = false;
    } else if (filter === 'completed') {
      where.completed = true;
    }

    const todos = await prisma.todo.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    return todos.map(convertPrismaTodoToTodo);
  }

  async create(data: { text: string; userId: string }): Promise<Todo> {
    const todo = await prisma.todo.create({
      data: {
        text: data.text,
        userId: data.userId,
      },
    });
    return convertPrismaTodoToTodo(todo);
  }

  async update(
    id: string,
    data: { text?: string; completed?: boolean },
    userId: string
  ): Promise<Todo> {
    const todo = await prisma.todo.update({
      where: { id, userId },
      data,
    });
    return convertPrismaTodoToTodo(todo);
  }

  async delete(id: string, userId: string): Promise<void> {
    await prisma.todo.delete({
      where: { id, userId },
    });
  }

  async deleteCompleted(userId: string): Promise<void> {
    await prisma.todo.deleteMany({
      where: { userId, completed: true },
    });
  }

  async toggleAll(userId: string, completed: boolean): Promise<void> {
    await prisma.todo.updateMany({
      where: { userId },
      data: { completed },
    });
  }
}
