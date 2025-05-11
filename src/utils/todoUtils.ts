import { Todo } from '@/types/todo';

// 完了済みタスクの型ガード
export function isCompletedTodo(todo: Todo): boolean {
  return todo.completed === true;
}

// 未完了タスクの型ガード
export function isActiveTodo(todo: Todo): boolean {
  return todo.completed === false;
}

// タスクのソート関数
export function sortTodosByDate(
  todos: Todo[],
  ascending: boolean = true
): Todo[] {
  return [...todos].sort((a, b) => {
    // 文字列形式の日付をDateオブジェクトに変換してから比較
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    const dateComparison = dateA - dateB;
    return ascending ? dateComparison : -dateComparison;
  });
}

// タスクの統計情報を計算
export function getTodoStats(todos: Todo[]) {
  const total = todos.length;
  const completed = todos.filter(isCompletedTodo).length;
  const active = total - completed;

  return {
    total,
    completed,
    active,
    percentComplete: total > 0 ? (completed / total) * 100 : 0,
  };
}
