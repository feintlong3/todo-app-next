import { render, screen } from '@testing-library/react';
import { TodoContent } from '../TodoContent';
import { TodoProvider } from '@/contexts/TodoContext';

// TodoListコンポーネントのモック
jest.mock('../TodoList', () => ({
  TodoList: () => <div data-testid="todo-list">TodoList</div>,
}));

describe('TodoContent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('すべての子コンポーネントが表示されること', () => {
    render(
      <TodoProvider>
        <TodoContent />
      </TodoProvider>
    );

    // 見出しの確認
    expect(
      screen.getByRole('heading', { name: 'To-Do リスト' })
    ).toBeInTheDocument();

    // TodoListコンポーネントが表示されていることを確認
    expect(screen.getByTestId('todo-list')).toBeInTheDocument();
  });
});
