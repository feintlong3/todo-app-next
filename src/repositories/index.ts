import { PrismaTodoRepository } from './prismaTodoRepository';
import { TodoRepository } from './todoRepository';

// シングルトンパターンでリポジトリインスタンスを管理
let todoRepository: TodoRepository | null = null;

export function getTodoRepository(): TodoRepository {
  if (!todoRepository) {
    todoRepository = new PrismaTodoRepository();
  }
  return todoRepository;
}
