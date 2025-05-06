// ToDoタスクの型定義
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

// ToDoフィルターの型定義
export type TodoFilter = 'all' | 'active' | 'completed';

// ToDoリストの状態管理のための型定義
export interface TodoState {
  todos: Todo[];
  filter: TodoFilter;
}

// ToDoのアクションの型定義
export type TodoAction =
  | { type: 'ADD_TODO'; payload: { text: string } }
  | { type: 'TOGGLE_TODO'; payload: { id: string } }
  | { type: 'DELETE_TODO'; payload: { id: string } }
  | { type: 'EDIT_TODO'; payload: { id: string; text: string } }
  | { type: 'SET_FILTER'; payload: { filter: TodoFilter } };
