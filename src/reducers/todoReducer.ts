import { TodoList } from '@/types/todo';
import { v4 as uuidv4 } from 'uuid';

export type TodoAction =
  | { type: 'ADD'; payload: string; userId?: string }
  | { type: 'TOGGLE'; payload: string }
  | { type: 'REMOVE'; payload: string }
  | { type: 'EDIT'; payload: { id: string; text: string } }
  | { type: 'COMPLETE_ALL' }
  | { type: 'CLEAR_COMPLETED' }
  | { type: 'INITIALIZE'; payload: TodoList };

export function todoReducer(state: TodoList, action: TodoAction): TodoList {
  switch (action.type) {
    case 'ADD':
      return [
        ...state,
        {
          id: uuidv4(),
          text: action.payload,
          completed: false,
          userId: action.userId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

    case 'TOGGLE':
      return state.map((todo) =>
        todo.id === action.payload
          ? {
              ...todo,
              completed: !todo.completed,
              updatedAt: new Date().toISOString(),
            }
          : todo
      );

    case 'REMOVE':
      return state.filter((todo) => todo.id !== action.payload);

    case 'EDIT':
      return state.map((todo) =>
        todo.id === action.payload.id
          ? {
              ...todo,
              text: action.payload.text,
              updatedAt: new Date().toISOString(),
            }
          : todo
      );

    case 'COMPLETE_ALL':
      const areAllCompleted = state.every((todo) => todo.completed);
      return state.map((todo) => ({
        ...todo,
        completed: !areAllCompleted,
        updatedAt: new Date().toISOString(),
      }));

    case 'CLEAR_COMPLETED':
      return state.filter((todo) => !todo.completed);

    case 'INITIALIZE':
      return action.payload;

    default:
      return state;
  }
}
