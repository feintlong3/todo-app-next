import { render, screen, fireEvent, act } from '@testing-library/react';
import { TodoProvider, useTodoContext } from '../TodoContext';
import React from 'react';

// テスト用のコンポーネント
const TestComponent = () => {
  const { addTodo, filteredTodos, deleteTodo, toggleTodo } = useTodoContext();

  return (
    <div>
      <button onClick={() => addTodo('テストタスク')} data-testid="add-button">
        タスク追加
      </button>
      <ul>
        {filteredTodos.map((todo) => (
          <li key={todo.id} data-testid={`todo-item-${todo.id}`}>
            <span
              data-testid={`todo-text-${todo.id}`}
              className={todo.completed ? 'completed' : ''}
            >
              {todo.text}
            </span>
            <button
              onClick={() => toggleTodo(todo.id)}
              data-testid={`toggle-${todo.id}`}
            >
              {todo.completed ? '未完了に戻す' : '完了'}
            </button>
            <button
              onClick={() => deleteTodo(todo.id)}
              data-testid={`delete-${todo.id}`}
            >
              削除
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// UUID生成をモック
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid-123'),
}));

describe('TodoContext', () => {
  beforeEach(() => {
    jest.useFakeTimers(); // 時間関連の操作をモック化
  });

  afterEach(() => {
    jest.useRealTimers(); // モックをリセット
  });

  it('コンテキストが正しく機能すること', () => {
    render(
      <TodoProvider>
        <TestComponent />
      </TodoProvider>
    );

    // 初期状態では、タスクがない
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();

    // タスク追加ボタンをクリック
    fireEvent.click(screen.getByTestId('add-button'));

    // タスクが追加された
    const todoItem = screen.getByRole('listitem');
    expect(todoItem).toBeInTheDocument();
    expect(screen.getByText('テストタスク')).toBeInTheDocument();

    // タスク完了ボタンをクリック
    const todoId = 'test-uuid-123'; // モックされたUUID
    fireEvent.click(screen.getByTestId(`toggle-${todoId}`));

    // タスクが完了状態になったことを確認
    const todoText = screen.getByTestId(`todo-text-${todoId}`);
    expect(todoText).toHaveClass('completed');
    expect(screen.getByTestId(`toggle-${todoId}`)).toHaveTextContent(
      '未完了に戻す'
    );

    // 削除ボタンをクリック
    fireEvent.click(screen.getByTestId(`delete-${todoId}`));

    // タスクが削除された
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
  });

  it('フィルター機能が正しく動作すること', async () => {
    const FilterTestComponent = () => {
      const { addTodo, toggleTodo, filter, changeFilter, filteredTodos } =
        useTodoContext();

      // テスト用のデータを追加（コンポーネントマウント時）
      React.useEffect(() => {
        // 2つのタスクを追加：1つは完了、1つは未完了
        addTodo('タスク1');

        // 非同期処理を模倣
        setTimeout(() => {
          // 最初のタスクを完了状態に
          toggleTodo('test-uuid-123');
          // 2つ目のタスクを追加
          addTodo('タスク2');
        }, 0);
      }, [addTodo, toggleTodo]);

      return (
        <div>
          <div data-testid="current-filter">現在のフィルター: {filter}</div>
          <button onClick={() => changeFilter('all')} data-testid="filter-all">
            すべて
          </button>
          <button
            onClick={() => changeFilter('active')}
            data-testid="filter-active"
          >
            未完了
          </button>
          <button
            onClick={() => changeFilter('completed')}
            data-testid="filter-completed"
          >
            完了済み
          </button>
          <ul>
            {filteredTodos.map((todo) => (
              <li key={todo.id} data-testid={`todo-item-${todo.id}`}>
                {todo.text} - {todo.completed ? '完了' : '未完了'}
              </li>
            ))}
          </ul>
        </div>
      );
    };

    render(
      <TodoProvider>
        <FilterTestComponent />
      </TodoProvider>
    );

    // フィルターのデフォルト値
    expect(screen.getByTestId('current-filter')).toHaveTextContent(
      '現在のフィルター: all'
    );

    // タイマーを進めて非同期処理を完了させる
    act(() => {
      jest.runAllTimers();
    });

    // 完了フィルターをクリック
    fireEvent.click(screen.getByTestId('filter-completed'));
    expect(screen.getByTestId('current-filter')).toHaveTextContent(
      '現在のフィルター: completed'
    );

    // 未完了フィルターをクリック
    fireEvent.click(screen.getByTestId('filter-active'));
    expect(screen.getByTestId('current-filter')).toHaveTextContent(
      '現在のフィルター: active'
    );

    // 全部フィルターをクリック
    fireEvent.click(screen.getByTestId('filter-all'));
    expect(screen.getByTestId('current-filter')).toHaveTextContent(
      '現在のフィルター: all'
    );
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
