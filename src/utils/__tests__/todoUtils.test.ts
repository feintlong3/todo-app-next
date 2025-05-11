import {
  isCompletedTodo,
  isActiveTodo,
  sortTodosByDate,
  getTodoStats,
} from '../todoUtils';
import { Todo } from '@/types/todo';

describe('todoUtils', () => {
  const mockTodos: Todo[] = [
    {
      id: '1',
      text: 'タスク1',
      completed: false,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
    },
    {
      id: '2',
      text: 'タスク2',
      completed: true,
      createdAt: '2023-01-02T00:00:00.000Z',
      updatedAt: '2023-01-02T00:00:00.000Z',
    },
    {
      id: '3',
      text: 'タスク3',
      completed: false,
      createdAt: '2023-01-03T00:00:00.000Z',
      updatedAt: '2023-01-03T00:00:00.000Z',
    },
  ];

  describe('isCompletedTodo', () => {
    it('完了タスクを正しく判定すること', () => {
      expect(isCompletedTodo(mockTodos[0])).toBe(false);
      expect(isCompletedTodo(mockTodos[1])).toBe(true);
    });
  });

  describe('isActiveTodo', () => {
    it('未完了タスクを正しく判定すること', () => {
      expect(isActiveTodo(mockTodos[0])).toBe(true);
      expect(isActiveTodo(mockTodos[1])).toBe(false);
    });
  });

  describe('sortTodosByDate', () => {
    it('昇順でソートすること', () => {
      const sorted = sortTodosByDate(mockTodos);
      expect(sorted[0].id).toBe('1');
      expect(sorted[1].id).toBe('2');
      expect(sorted[2].id).toBe('3');
    });

    it('降順でソートすること', () => {
      const sorted = sortTodosByDate(mockTodos, false);
      expect(sorted[0].id).toBe('3');
      expect(sorted[1].id).toBe('2');
      expect(sorted[2].id).toBe('1');
    });

    it('元の配列を変更しないこと', () => {
      const originalOrder = [...mockTodos].map((todo) => todo.id);
      sortTodosByDate(mockTodos);
      const newOrder = mockTodos.map((todo) => todo.id);
      expect(newOrder).toEqual(originalOrder);
    });
  });

  describe('getTodoStats', () => {
    it('統計情報を正しく計算すること', () => {
      const stats = getTodoStats(mockTodos);
      expect(stats.total).toBe(3);
      expect(stats.completed).toBe(1);
      expect(stats.active).toBe(2);
      expect(stats.percentComplete).toBeCloseTo(33.33, 1);
    });

    it('空の配列の場合、正しい統計情報を返すこと', () => {
      const stats = getTodoStats([]);
      expect(stats.total).toBe(0);
      expect(stats.completed).toBe(0);
      expect(stats.active).toBe(0);
      expect(stats.percentComplete).toBe(0);
    });
  });
});
