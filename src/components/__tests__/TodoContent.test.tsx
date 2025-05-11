import { render, screen } from '@testing-library/react';
import { TodoContent } from '../TodoContent';
import { useTodoContext } from '@/contexts/TodoContext';
import { Todo } from '@/types/todo';

// TodoListの引数の型定義
interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
}

// TodoListのモックを作成
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockTodoList = jest.fn((_props: TodoListProps) => (
  <div data-testid="todo-list">TodoList</div>
));
jest.mock('../TodoList', () => ({
  TodoList: (props: TodoListProps) => mockTodoList(props),
}));

// 他のコンポーネントのモック
jest.mock('../TodoForm', () => ({
  TodoForm: () => <div data-testid="todo-form">TodoForm</div>,
}));

jest.mock('../TodoFilter', () => ({
  TodoFilter: () => <div data-testid="todo-filter">TodoFilter</div>,
}));

jest.mock('../TodoInfo', () => ({
  TodoInfo: () => <div data-testid="todo-info">TodoInfo</div>,
}));

// TodoContextのモック
jest.mock('@/contexts/TodoContext');

describe('TodoContent', () => {
  // テスト用モックデータ
  const mockFilteredTodos: Todo[] = [
    {
      id: '1',
      text: 'テストタスク',
      completed: false,
      createdAt: '',
      updatedAt: '',
    },
  ];
  const mockToggleTodo = jest.fn();
  const mockDeleteTodo = jest.fn();
  const mockEditTodo = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // TodoContextのモック設定
    (useTodoContext as jest.Mock).mockReturnValue({
      filteredTodos: mockFilteredTodos,
      toggleTodo: mockToggleTodo,
      deleteTodo: mockDeleteTodo,
      editTodo: mockEditTodo,
      filter: 'all',
    });
  });

  it('すべての子コンポーネントが表示されること', () => {
    render(<TodoContent />);

    // 見出しの確認
    expect(
      screen.getByRole('heading', { name: 'To-Do リスト' })
    ).toBeInTheDocument();

    // 各コンポーネントが表示されていることを確認
    expect(screen.getByTestId('todo-form')).toBeInTheDocument();
    expect(screen.getByTestId('todo-filter')).toBeInTheDocument();
    expect(screen.getByTestId('todo-list')).toBeInTheDocument();
    expect(screen.getByTestId('todo-info')).toBeInTheDocument();
  });

  it('TodoListに正しいpropsが渡されること', () => {
    render(<TodoContent />);

    // TodoListに渡されたpropsを確認
    expect(mockTodoList).toHaveBeenCalledWith({
      todos: mockFilteredTodos,
      onToggle: mockToggleTodo,
      onDelete: mockDeleteTodo,
      onEdit: mockEditTodo,
    });
  });
});
