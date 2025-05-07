'use client';

import { TodoListProps, Todo } from '@/types';
import { ItemList } from './ItemList';
import { TodoItem } from './TodoItem';

export const TodoList: React.FC<TodoListProps> = ({ todos, filter }) => {
  // フィルタリングされたToDoリストを取得
  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true; // 'all'の場合はすべて表示
  });

  if (filteredTodos.length === 0) {
    return (
      <div className="empty-list">
        {todos.length === 0
          ? 'タスクがありません'
          : `${filter === 'active' ? '未完了' : filter === 'completed' ? '完了済み' : ''}のタスクはありません`}
      </div>
    );
  }

  const renderTodoItem = (todo: Todo) => <TodoItem todo={todo} />;

  return (
    <ItemList
      items={filteredTodos}
      renderItem={renderTodoItem}
      keyExtractor={(todo) => todo.id}
      className="todo-list"
    />
  );
};
