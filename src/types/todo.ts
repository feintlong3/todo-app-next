// ToDoタスクの型定義
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  userId?: string; // ユーザーIDを追加
  createdAt: string;
  updatedAt: string;
}

export type TodoList = Todo[];

export type FilterType = 'all' | 'active' | 'completed';

// フォーム入力の型定義
export interface TodoFormInput {
  text: string;
}

// コンポーネントのプロパティ型定義
export interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
}

export interface TodoFormProps {
  onAdd: (text: string) => void;
}

export interface TodoFilterProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
}

export interface TodoInfoProps {
  total: number;
  completed: number;
}
