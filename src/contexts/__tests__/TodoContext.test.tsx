import { render, screen, fireEvent } from '@testing-library/react';
import { TodoProvider, useTodoContext } from '../TodoContext';
import React from 'react';

// テスト用のコンポーネント
const TestComponent = () => {
  const { addTodo, filteredTodos, deleteTodo } = useTodoContext();

  return (
    <div>
      <button onClick={() => addTodo('テストタスク')}>タスク追加</button>
      <ul>
        {filteredTodos.map((todo) => (
          <li key={todo.id}>
            {todo.text}
            <button onClick={() => deleteTodo(todo.id)}>削除</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

describe('TodoContext', () => {
  it('コンテキストが正しく機能すること', () => {
    render(
      <TodoProvider>
        <TestComponent />
      </TodoProvider>
    );

    // 初期状態では、タスクがない
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();

    // タスク追加ボタンをクリック
    fireEvent.click(screen.getByText('タスク追加'));

    // タスクが追加された
    expect(screen.getByRole('listitem')).toBeInTheDocument();
    expect(screen.getByText('テストタスク')).toBeInTheDocument();

    // 削除ボタンをクリック
    fireEvent.click(screen.getByText('削除'));

    // タスクが削除された
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
  });

  it('コンテキスト外でuseTodoContextを使用するとエラーがスローされること', () => {
    // コンソールエラーを抑制
    const originalError = console.error;
    console.error = jest.fn();

    // TodoProvider外でuseTodoContextを使用すると、エラーが発生する
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useTodoContext must be used within a TodoProvider');

    // コンソールエラーを戻す
    console.error = originalError;
  });
});
