import { useTodoContext } from '@/contexts/TodoContext';

export function useTodos() {
  // TodoContextから必要な値と関数を取得
  return useTodoContext();
}
