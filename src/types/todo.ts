// ToDoタスクの型定義
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

// ToDoフィルターの型定義
export type TodoFilter = 'all' | 'active' | 'completed';

// フォーム入力の型定義
export interface TodoFormInput {
  text: string;
}

// コンポーネントのプロパティ型定義
export interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
}

export interface TodoFormProps {
  onAdd: (text: string) => void;
}

export interface TodoFilterProps {
  currentFilter: TodoFilter;
  onFilterChange: (filter: TodoFilter) => void;
}

export interface TodoListProps {
  todos: Todo[];
  filter: TodoFilter;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
}

export interface TodoInfoProps {
  total: number;
  completed: number;
}

export type TodoAction =
  | { type: 'ADD_TODO'; payload: { text: string } }
  | { type: 'TOGGLE_TODO'; payload: { id: string } }
  | { type: 'DELETE_TODO'; payload: { id: string } }
  | { type: 'EDIT_TODO'; payload: { id: string; text: string } }
  | { type: 'SET_FILTER'; payload: { filter: TodoFilter } };

export interface TodoState {
  todos: Todo[];
  filter: TodoFilter;
}
