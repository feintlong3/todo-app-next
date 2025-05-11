import { renderHook } from '@testing-library/react';
import { useTodos } from '../useTodos';
import { useTodoContext } from '@/contexts/TodoContext';

// useTodoContextのモック
jest.mock('@/contexts/TodoContext');

describe('useTodos', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // モックの設定
    (useTodoContext as jest.Mock).mockReturnValue({
      todos: [],
      filter: 'all',
      filteredTodos: [],
      stats: {
        total: 0,
        completed: 0,
        active: 0,
      },
      dispatch: jest.fn(),
      addTodo: jest.fn(),
      toggleTodo: jest.fn(),
      deleteTodo: jest.fn(),
      editTodo: jest.fn(),
      changeFilter: jest.fn(),
    });
  });

  it('useTodoContextのラッパーとして正しく動作すること', () => {
    const { result } = renderHook(() => useTodos());

    // useTodoContextから返された値と同じ値が返されることを確認
    expect(result.current).toEqual(useTodoContext());
  });

  it('TodoContextの値の変更が反映されること', () => {
    // 初期値
    const initialMock = {
      todos: [],
      filter: 'all',
      filteredTodos: [],
      stats: { total: 0, completed: 0, active: 0 },
      dispatch: jest.fn(),
      addTodo: jest.fn(),
      toggleTodo: jest.fn(),
      deleteTodo: jest.fn(),
      editTodo: jest.fn(),
      changeFilter: jest.fn(),
    };
    (useTodoContext as jest.Mock).mockReturnValue(initialMock);

    const { result, rerender } = renderHook(() => useTodos());

    // 初期値が反映されていることを確認
    expect(result.current).toEqual(initialMock);

    // モックの値を変更
    const updatedMock = {
      todos: [
        {
          id: '1',
          text: 'テスト',
          completed: false,
          createdAt: '',
          updatedAt: '',
        },
      ],
      filter: 'active' as const,
      filteredTodos: [
        {
          id: '1',
          text: 'テスト',
          completed: false,
          createdAt: '',
          updatedAt: '',
        },
      ],
      stats: { total: 1, completed: 0, active: 1 },
      dispatch: jest.fn(),
      addTodo: jest.fn(),
      toggleTodo: jest.fn(),
      deleteTodo: jest.fn(),
      editTodo: jest.fn(),
      changeFilter: jest.fn(),
    };
    (useTodoContext as jest.Mock).mockReturnValue(updatedMock);

    // 再レンダリング
    rerender();

    // 更新された値が反映されていることを確認
    expect(result.current).toEqual(updatedMock);
  });
});
