import { render, screen, fireEvent } from '@testing-library/react';
import { TodoForm } from '../TodoForm';
import { useTodoContext } from '@/contexts/TodoContext';
import { useAuth } from '@/hooks/useAuth';

// TodoContextとuseAuthのモック
jest.mock('@/contexts/TodoContext');
jest.mock('@/hooks/useAuth');

describe('TodoForm', () => {
  // モック関数のリセット
  beforeEach(() => {
    jest.clearAllMocks();

    // TodoContextのモック設定
    (useTodoContext as jest.Mock).mockReturnValue({
      addTodo: jest.fn(),
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

    it('タスク入力と送信ができること', () => {
      render(<TodoForm />);

      const { addTodo } = useTodoContext();

      // 入力フィールドにテキストを入力
      const input = screen.getByTestId('todo-input');
      fireEvent.change(input, { target: { value: '新しいタスク' } });

      // フォームを送信
      const form = screen.getByTestId('todo-form');
      fireEvent.submit(form);

      // addTodoが呼ばれたことを確認
      expect(addTodo).toHaveBeenCalledWith('新しいタスク');

      // 送信後、入力フィールドがクリアされること
      expect(input).toHaveValue('');
    });

    it('空の入力では送信できないこと', () => {
      render(<TodoForm />);

      const { addTodo } = useTodoContext();

      // 空のまま送信
      const form = screen.getByTestId('todo-form');
      fireEvent.submit(form);

      // addTodoが呼ばれないことを確認
      expect(addTodo).not.toHaveBeenCalled();
    });

    it('バリデーションエラーが表示されること', () => {
      render(<TodoForm />);

      // 非常に長いテキストを入力（100文字以上）
      const input = screen.getByTestId('todo-input');
      fireEvent.change(input, {
        target: {
          value: 'a'.repeat(101),
        },
      });

      // フォームを送信
      const form = screen.getByTestId('todo-form');
      fireEvent.submit(form);

      // エラーメッセージが表示されることを確認
      const errorMessage = screen.getByTestId('error-message');
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveTextContent(
        /タスクは100文字以内にしてください/
      );
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

    it('未認証状態では送信できないこと', () => {
      render(<TodoForm />);

      const { addTodo } = useTodoContext();

      // フォームを送信
      const form = screen.getByTestId('todo-form');
      fireEvent.submit(form);

      // addTodoが呼ばれないことを確認
      expect(addTodo).not.toHaveBeenCalled();
    });
  });
});
