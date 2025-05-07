import { v4 as uuidv4 } from 'uuid';
import { TodoState, TodoAction } from '@/types';

export function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        todos: [
          ...state.todos,
          {
            id: uuidv4(),
            text: action.payload.text,
            completed: false,
            createdAt: new Date(),
          },
        ],
      };
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload.id
            ? { ...todo, completed: !todo.completed }
            : todo
        ),
      };
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload.id),
      };
    case 'EDIT_TODO':
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload.id
            ? { ...todo, text: action.payload.text }
            : todo
        ),
      };
    case 'SET_FILTER':
      return {
        ...state,
        filter: action.payload.filter,
      };
    default:
      // 型の網羅性チェックが効いているのでdefaultは不要だが、
      // 念のため型アサーションでコンパイルエラーを回避
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _exhaustiveCheck: never = action;
      return state;
  }
}
