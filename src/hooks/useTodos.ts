import { useReducer, useCallback, useMemo } from 'react';
import { TodoState, TodoFilter } from '@/types';
import { todoReducer } from '@/reducers/todoReducer';

const initialState: TodoState = {
  todos: [],
  filter: 'all',
};

export function useTodos() {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  const { todos, filter } = state;

  const addTodo = useCallback((text: string) => {
    dispatch({ type: 'ADD_TODO', payload: { text } });
  }, []);

  const toggleTodo = useCallback((id: string) => {
    dispatch({ type: 'TOGGLE_TODO', payload: { id } });
  }, []);

  const deleteTodo = useCallback((id: string) => {
    dispatch({ type: 'DELETE_TODO', payload: { id } });
  }, []);

  const editTodo = useCallback((id: string, text: string) => {
    dispatch({ type: 'EDIT_TODO', payload: { id, text } });
  }, []);

  const changeFilter = useCallback((filter: TodoFilter) => {
    dispatch({ type: 'SET_FILTER', payload: { filter } });
  }, []);

  // フィルタリングされたToDo一覧を取得（useMemoでメモ化）
  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      if (filter === 'active') return !todo.completed;
      if (filter === 'completed') return todo.completed;
      return true; // 'all'の場合はすべて表示
    });
  }, [todos, filter]);

  // 統計情報（useMemoでメモ化）
  const stats = useMemo(() => {
    return {
      total: todos.length,
      completed: todos.filter((todo) => todo.completed).length,
      active: todos.filter((todo) => !todo.completed).length,
    };
  }, [todos]);

  return {
    todos,
    filter,
    filteredTodos,
    stats,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    changeFilter,
  };
}
