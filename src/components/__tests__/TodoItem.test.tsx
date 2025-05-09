import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TodoItem } from '../TodoItem';
import { Todo } from '@/types';

// TodoContextのモック
jest.mock('@/contexts/TodoContext', () => ({
  useTodoContext: () => ({
    toggleTodo: jest.fn((id) => mockToggleHandler(id)),
    deleteTodo: jest.fn((id) => mockDeleteHandler(id)),
    editTodo: jest.fn((id, text) => mockEditHandler(id, text)),
  }),
  TodoProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

// モック関数のハンドラー
const mockToggleHandler = jest.fn();
const mockDeleteHandler = jest.fn();
const mockEditHandler = jest.fn();

// テスト用のモックデータ
const mockTodo: Todo = {
  id: '1',
  text: 'テストタスク',
  completed: false,
  createdAt: new Date(),
};

describe('TodoItem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('タスクが正しくレンダリングされること', () => {
    render(<TodoItem todo={mockTodo} />);

    expect(screen.getByText('テストタスク')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('チェックボックスをクリックするとtoggleTodoが呼ばれること', () => {
    render(<TodoItem todo={mockTodo} />);

    fireEvent.click(screen.getByRole('checkbox'));
    expect(mockToggleHandler).toHaveBeenCalledWith('1');
  });

  it('削除ボタンをクリックするとdeleteTodoが呼ばれること', () => {
    render(<TodoItem todo={mockTodo} />);

    fireEvent.click(screen.getByTitle('タスクを削除'));
    expect(mockDeleteHandler).toHaveBeenCalledWith('1');
  });

  it('編集ボタンをクリックすると編集モードになること', () => {
    render(<TodoItem todo={mockTodo} />);

    fireEvent.click(screen.getByTitle('タスクを編集'));
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveValue('テストタスク');
  });

  it('編集モードでEnterを押すとeditTodoが呼ばれること', () => {
    render(<TodoItem todo={mockTodo} />);

    // 編集モードに入る
    fireEvent.click(screen.getByTitle('タスクを編集'));

    // テキストを変更してEnterキーを押す
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '更新されたタスク' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(mockEditHandler).toHaveBeenCalledWith('1', '更新されたタスク');
  });

  it('完了済みタスクは編集ボタンが表示されないこと', () => {
    const completedTodo = { ...mockTodo, completed: true };

    render(<TodoItem todo={completedTodo} />);

    expect(screen.queryByTitle('タスクを編集')).not.toBeInTheDocument();
  });
});
