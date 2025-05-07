import { z } from 'zod';

// 単一のToDoアイテムのスキーマ
export const todoSchema = z.object({
  id: z.string().uuid(),
  text: z.string().min(1, { message: 'タスクは1文字以上必要です' }).max(100, {
    message: 'タスクは100文字以内にしてください',
  }),
  completed: z.boolean(),
  createdAt: z.date(),
});

// ToDoリストのスキーマ
export const todoListSchema = z.array(todoSchema);

// フィルター値のスキーマ
export const todoFilterSchema = z.enum(['all', 'active', 'completed']);

// フォーム入力値のスキーマ
export const todoFormInputSchema = z.object({
  text: z
    .string()
    .min(1, { message: 'タスクは1文字以上必要です' })
    .max(100, { message: 'タスクは100文字以内にしてください' })
    .trim(),
});

// zodの型からTypeScript型を導出
export type TodoSchema = z.infer<typeof todoSchema>;
export type TodoListSchema = z.infer<typeof todoListSchema>;
export type TodoFilterSchema = z.infer<typeof todoFilterSchema>;
export type TodoFormInputSchema = z.infer<typeof todoFormInputSchema>;
