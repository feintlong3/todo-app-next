import { renderHook, act } from '@testing-library/react';
import { useTodos } from '../useTodos';

describe('useTodos', () => {
  it('初期状態が正しいこと', () => {
    const { result } = renderHook(() => useTodos());

    expect(result.current.todos).toEqual([]);
    expect(result.current.filter).toBe('all');
    expect(result.current.filteredTodos).toEqual([]);
    expect(result.current.stats).toEqual({
      total: 0,
      completed: 0,
      active: 0,
    });
  });

  it('addTodoが正しく機能すること', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo('新しいタスク');
    });

    expect(result.current.todos.length).toBe(1);
    expect(result.current.todos[0].text).toBe('新しいタスク');
    expect(result.current.todos[0].completed).toBe(false);
  });

  it('toggleTodoが正しく機能すること', () => {
    const { result } = renderHook(() => useTodos());

    // タスクを追加
    act(() => {
      result.current.addTodo('テストタスク');
    });

    const todoId = result.current.todos[0].id;

    // タスクを完了に変更
    act(() => {
      result.current.toggleTodo(todoId);
    });

    expect(result.current.todos[0].completed).toBe(true);

    // タスクを未完了に戻す
    act(() => {
      result.current.toggleTodo(todoId);
    });

    expect(result.current.todos[0].completed).toBe(false);
  });

  it('deleteTodoが正しく機能すること', () => {
    const { result } = renderHook(() => useTodos());

    // タスクを追加
    act(() => {
      result.current.addTodo('削除するタスク');
    });

    const todoId = result.current.todos[0].id;

    // タスクを削除
    act(() => {
      result.current.deleteTodo(todoId);
    });

    expect(result.current.todos.length).toBe(0);
  });

  it('editTodoが正しく機能すること', () => {
    const { result } = renderHook(() => useTodos());

    // タスクを追加
    act(() => {
      result.current.addTodo('編集前のタスク');
    });

    const todoId = result.current.todos[0].id;

    // タスクを編集
    act(() => {
      result.current.editTodo(todoId, '編集後のタスク');
    });

    expect(result.current.todos[0].text).toBe('編集後のタスク');
  });

  it('changeFilterが正しく機能すること', () => {
    const { result } = renderHook(() => useTodos());

    // フィルターを変更
    act(() => {
      result.current.changeFilter('completed');
    });

    expect(result.current.filter).toBe('completed');
  });

  it('フィルターが正しく適用されること', () => {
    const { result } = renderHook(() => useTodos());

    // 複数のタスクを追加
    act(() => {
      result.current.addTodo('タスク1');
      result.current.addTodo('タスク2');
    });

    const todoId1 = result.current.todos[0].id;

    // 1つのタスクを完了に
    act(() => {
      result.current.toggleTodo(todoId1);
    });

    // すべてのタスク
    expect(result.current.filteredTodos.length).toBe(2);

    // フィルターを完了に変更
    act(() => {
      result.current.changeFilter('completed');
    });

    expect(result.current.filteredTodos.length).toBe(1);
    expect(result.current.filteredTodos[0].id).toBe(todoId1);

    // フィルターを未完了に変更
    act(() => {
      result.current.changeFilter('active');
    });

    expect(result.current.filteredTodos.length).toBe(1);
    expect(result.current.filteredTodos[0].id).not.toBe(todoId1);
  });

  it('統計情報が正しく計算されること', () => {
    const { result } = renderHook(() => useTodos());

    // 複数のタスクを追加
    act(() => {
      result.current.addTodo('タスク1');
      result.current.addTodo('タスク2');
      result.current.addTodo('タスク3');
    });

    expect(result.current.stats).toEqual({
      total: 3,
      completed: 0,
      active: 3,
    });

    // 1つのタスクを完了に
    act(() => {
      result.current.toggleTodo(result.current.todos[0].id);
    });

    expect(result.current.stats).toEqual({
      total: 3,
      completed: 1,
      active: 2,
    });
  });
});
