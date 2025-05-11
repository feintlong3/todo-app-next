'use server';

import { getTodoRepository } from '@/repositories';
import { Todo } from '@/types/todo';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';

// 入力バリデーション用のスキーマ
const todoSchema = z.object({
  text: z
    .string()
    .min(1, 'テキストは必須です')
    .max(100, '100文字以内で入力してください'),
});

// 認証済みユーザーIDを取得するヘルパー関数
async function getAuthenticatedUserId(): Promise<string> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/api/auth/signin');
  }
  return session.user.id;
}

// Todo作成アクション
export async function createTodo(
  formData: FormData
): Promise<{ success: boolean; error?: string; todo?: Todo }> {
  try {
    const text = formData.get('text') as string;

    // 入力バリデーション
    const result = todoSchema.safeParse({ text });
    if (!result.success) {
      return {
        success: false,
        error: result.error.errors[0].message,
      };
    }

    const userId = await getAuthenticatedUserId();
    const repository = getTodoRepository();

    const todo = await repository.create({
      text: result.data.text,
      userId,
    });

    revalidatePath('/todos');
    return { success: true, todo };
  } catch (error) {
    console.error('Todo作成エラー:', error);
    return { success: false, error: 'Todoの作成に失敗しました' };
  }
}

// Todo更新アクション
export async function updateTodo(
  id: string,
  data: { text?: string; completed?: boolean }
): Promise<{ success: boolean; error?: string; todo?: Todo }> {
  try {
    // テキスト更新の場合はバリデーション
    if (data.text) {
      const result = todoSchema.safeParse({ text: data.text });
      if (!result.success) {
        return {
          success: false,
          error: result.error.errors[0].message,
        };
      }
    }

    const userId = await getAuthenticatedUserId();
    const repository = getTodoRepository();

    // 更新前に所有権チェック
    const existingTodo = await repository.findById(id, userId);
    if (!existingTodo) {
      return { success: false, error: 'Todoが見つかりません' };
    }

    const todo = await repository.update(id, data, userId);

    revalidatePath('/todos');
    return { success: true, todo };
  } catch (error) {
    console.error('Todo更新エラー:', error);
    return { success: false, error: 'Todoの更新に失敗しました' };
  }
}

// Todo削除アクション
export async function deleteTodo(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const userId = await getAuthenticatedUserId();
    const repository = getTodoRepository();

    // 削除前に所有権チェック
    const existingTodo = await repository.findById(id, userId);
    if (!existingTodo) {
      return { success: false, error: 'Todoが見つかりません' };
    }

    await repository.delete(id, userId);

    revalidatePath('/todos');
    return { success: true };
  } catch (error) {
    console.error('Todo削除エラー:', error);
    return { success: false, error: 'Todoの削除に失敗しました' };
  }
}

// 完了済みTodoの削除アクション
export async function clearCompletedTodos(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const userId = await getAuthenticatedUserId();
    const repository = getTodoRepository();

    await repository.deleteCompleted(userId);

    revalidatePath('/todos');
    return { success: true };
  } catch (error) {
    console.error('完了済みTodo削除エラー:', error);
    return { success: false, error: '完了済みTodoの削除に失敗しました' };
  }
}

// 全Todoの状態トグルアクション
export async function toggleAllTodos(
  completed: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const userId = await getAuthenticatedUserId();
    const repository = getTodoRepository();

    await repository.toggleAll(userId, completed);

    revalidatePath('/todos');
    return { success: true };
  } catch (error) {
    console.error('全Todoのトグルエラー:', error);
    return { success: false, error: 'Todoの一括更新に失敗しました' };
  }
}

// Todoの取得アクション
export async function getTodos(
  filter: 'all' | 'active' | 'completed' = 'all'
): Promise<{
  success: boolean;
  error?: string;
  todos?: Todo[];
}> {
  try {
    const userId = await getAuthenticatedUserId();
    const repository = getTodoRepository();

    const todos = await repository.findByFilter(userId, filter);

    return { success: true, todos };
  } catch (error) {
    console.error('Todo取得エラー:', error);
    return { success: false, error: 'Todoの取得に失敗しました' };
  }
}
