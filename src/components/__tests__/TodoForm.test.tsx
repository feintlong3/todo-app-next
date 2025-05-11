import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TodoForm } from '../TodoForm';
import { useTodoContext } from '@/contexts/TodoContext';
import { useAuth } from '@/hooks/useAuth';
import * as todoActions from '@/app/actions/todoActions';

// TodoContext, useAuth, サーバーアクションのモック
jest.mock('@/contexts/TodoContext');
jest.mock('@/hooks/useAuth');
jest.mock('@/app/actions/todoActions', () => ({
  createTodo: jest.fn().mockImplementation(async () => ({
    success: true,
    todo: {
      id: 'new-id',
      text: 'テストタスク',
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  })),
}));

describe('TodoForm', () => {
  const mockDispatch = jest.fn();

  // モック関数のリセット
  beforeEach(() => {
    jest.clearAllMocks();

    // TodoContextのモック設定
    (useTodoContext as jest.Mock).mockReturnValue({
      dispatch: mockDispatch,
    });
  });

  describe('認証済み状態', () => {
    beforeEach(() => {
      // useAuthのモックを認証済み状態に設定
      (useAuth as jest.Mock).mockReturnValue({
        isAuthenticated: true,
        user: { id: 'test-user-id' },
      });
    });

    it('タスク入力と送信ができること', async () => {
      render(<TodoForm />);

      // 入力フィールドにテキストを入力
      const input = screen.getByTestId('todo-input');
      fireEvent.change(input, { target: { value: 'テストタスク' } });

      // フォームを送信
      const form = screen.getByTestId('todo-form');
      fireEvent.submit(form);

      // サーバーアクションが呼ばれたことを確認
      await waitFor(() => {
        expect(todoActions.createTodo).toHaveBeenCalled();
      });

      // dispatchが呼ばれたことを確認（成功時）
      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith({
          type: 'ADD_TODO',
          payload: { text: 'テストタスク' },
        });
      });

      // 送信後、入力フィールドがクリアされること
      expect(input).toHaveValue('');
    });

    it('空の入力では送信できないこと', async () => {
      render(<TodoForm />);

      // 空のまま送信
      const form = screen.getByTestId('todo-form');
      fireEvent.submit(form);

      // createTodoとdispatchが呼ばれないことを確認
      await waitFor(() => {
        expect(todoActions.createTodo).not.toHaveBeenCalled();
        expect(mockDispatch).not.toHaveBeenCalled();
      });
    });

    it('バリデーションエラーが表示されること', async () => {
      // エラーレスポンスをモック
      (todoActions.createTodo as jest.Mock).mockImplementationOnce(
        async () => ({
          success: false,
          error: '100文字以内で入力してください',
        })
      );

      render(<TodoForm />);

      // 入力フィールドにテキストを入力
      const input = screen.getByTestId('todo-input');
      fireEvent.change(input, { target: { value: 'テストタスク' } });

      // フォームを送信
      const form = screen.getByTestId('todo-form');
      fireEvent.submit(form);

      // エラーメッセージが表示されることを確認
      await waitFor(() => {
        const errorMessage = screen.getByTestId('error-message');
        expect(errorMessage).toBeInTheDocument();
        expect(errorMessage).toHaveTextContent('100文字以内で入力してください');
      });
    });
  });

  describe('未認証状態', () => {
    beforeEach(() => {
      // useAuthのモックを未認証状態に設定
      (useAuth as jest.Mock).mockReturnValue({
        isAuthenticated: false,
        user: null,
      });
    });

    it('入力フィールドが無効化されていること', () => {
      render(<TodoForm />);

      const input = screen.getByTestId('todo-input');
      expect(input).toBeDisabled();

      const button = screen.getByTestId('todo-submit');
      expect(button).toBeDisabled();
    });

    it('未認証状態では送信できないこと', async () => {
      render(<TodoForm />);

      // フォームを送信
      const form = screen.getByTestId('todo-form');
      fireEvent.submit(form);

      // サーバーアクションが呼ばれないことを確認
      await waitFor(() => {
        expect(todoActions.createTodo).not.toHaveBeenCalled();
        expect(mockDispatch).not.toHaveBeenCalled();
      });
    });
  });
});
