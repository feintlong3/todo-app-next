import { todoReducer, TodoState, TodoAction } from '../todoReducer';

describe('todoReducer', () => {
  const initialState: TodoState = {
    todos: [
      {
        id: '1',
        text: 'テストタスク',
        completed: false,
        userId: 'test-user-id',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
    ],
    filter: 'all',
  };

  it('ADD_TODOアクションが正しく処理されること', () => {
    const action: TodoAction = {
      type: 'ADD_TODO',
      payload: { text: '新しいタスク' },
    };

    const newState = todoReducer(initialState, action);

    expect(newState.todos.length).toBe(2);
    expect(newState.todos[1].text).toBe('新しいタスク');
    expect(newState.todos[1].completed).toBe(false);
    // UUIDのフォーマットをチェック
    expect(newState.todos[1].id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
    );
  });

  it('TOGGLE_TODOアクションが正しく処理されること', () => {
    const action: TodoAction = {
      type: 'TOGGLE_TODO',
      payload: { id: '1' },
    };

    const newState = todoReducer(initialState, action);

    expect(newState.todos[0].completed).toBe(true);

    // 再度トグルして元に戻ることを確認
    const nextState = todoReducer(newState, action);

    expect(nextState.todos[0].completed).toBe(false);
  });

  it('DELETE_TODOアクションが正しく処理されること', () => {
    const action: TodoAction = {
      type: 'DELETE_TODO',
      payload: { id: '1' },
    };

    const newState = todoReducer(initialState, action);

    expect(newState.todos.length).toBe(0);
  });

  it('EDIT_TODOアクションが正しく処理されること', () => {
    const action: TodoAction = {
      type: 'EDIT_TODO',
      payload: { id: '1', text: '編集後のタスク' },
    };

    const newState = todoReducer(initialState, action);

    expect(newState.todos[0].text).toBe('編集後のタスク');
    // updatedAtが更新されていることを確認
    expect(newState.todos[0].updatedAt).not.toBe(
      initialState.todos[0].updatedAt
    );
  });

  it('SET_FILTERアクションが正しく処理されること', () => {
    const action: TodoAction = {
      type: 'SET_FILTER',
      payload: { filter: 'completed' },
    };

    const newState = todoReducer(initialState, action);

    expect(newState.filter).toBe('completed');
  });

  it('COMPLETE_ALLアクションが正しく処理されること', () => {
    const action: TodoAction = {
      type: 'COMPLETE_ALL',
    };

    // すべて未完了の状態
    const newState = todoReducer(initialState, action);
    expect(newState.todos.every((todo) => todo.completed)).toBe(true);

    // すべて完了の状態からすべて未完了にする
    const nextState = todoReducer(newState, action);
    expect(nextState.todos.every((todo) => !todo.completed)).toBe(true);
  });

  it('CLEAR_COMPLETEDアクションが正しく処理されること', () => {
    // まずは1つのタスクを完了状態にする
    const stateWithCompleted = todoReducer(initialState, {
      type: 'TOGGLE_TODO',
      payload: { id: '1' },
    });

    // 新しいタスクを追加
    const stateWithMultiple = todoReducer(stateWithCompleted, {
      type: 'ADD_TODO',
      payload: { text: '未完了タスク' },
    });

    // 完了済みをクリア
    const newState = todoReducer(stateWithMultiple, {
      type: 'CLEAR_COMPLETED',
    });

    expect(newState.todos.length).toBe(1);
    expect(newState.todos[0].text).toBe('未完了タスク');
    expect(newState.todos[0].completed).toBe(false);
  });

  it('INITIALIZEアクションが正しく処理されること', () => {
    const newTodos = [
      {
        id: '2',
        text: '初期化タスク',
        completed: true,
        userId: 'test-user-id',
        createdAt: '2023-02-01T00:00:00.000Z',
        updatedAt: '2023-02-01T00:00:00.000Z',
      },
    ];

    const action: TodoAction = {
      type: 'INITIALIZE',
      payload: newTodos,
    };

    const newState = todoReducer(initialState, action);

    expect(newState.todos).toEqual(newTodos);
  });

  it('存在しないアクションは状態を変更しないこと', () => {
    // TypeScriptの型チェックをバイパスするために型アサーション
    const action = { type: 'UNKNOWN_ACTION' } as unknown as TodoAction;

    const newState = todoReducer(initialState, action);

    expect(newState).toEqual(initialState);
  });
});
