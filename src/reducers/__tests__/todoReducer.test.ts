import { todoReducer } from '../todoReducer';
import { TodoState, TodoAction } from '@/types';

describe('todoReducer', () => {
  const initialState: TodoState = {
    todos: [
      {
        id: '1',
        text: 'テストタスク',
        completed: false,
        createdAt: new Date('2023-01-01'),
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
  });

  it('SET_FILTERアクションが正しく処理されること', () => {
    const action: TodoAction = {
      type: 'SET_FILTER',
      payload: { filter: 'completed' },
    };

    const newState = todoReducer(initialState, action);

    expect(newState.filter).toBe('completed');
  });

  it('存在しないアクションは状態を変更しないこと', () => {
    // TypeScriptの型チェックをバイパスするために型アサーション
    const action = { type: 'UNKNOWN_ACTION' } as unknown as TodoAction;

    const newState = todoReducer(initialState, action);

    expect(newState).toEqual(initialState);
  });
});
