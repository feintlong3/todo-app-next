import { z } from 'zod';

// 実行環境の判定
const isServer = typeof window === 'undefined';

// スキーマ定義（クライアントには NEXT_PUBLIC_ のみ）
const baseSchema = {
  NODE_ENV: z.enum(['development', 'production', 'test']),
  NEXT_PUBLIC_API_URL: z.string().url().optional(),
  // 他の環境変数もここに追加（NEXT_PUBLIC_ のみクライアントで使える）
};

const envSchema = isServer
  ? z.object(baseSchema) // サーバーではすべて検証
  : z.object({
      NEXT_PUBLIC_API_URL: baseSchema.NEXT_PUBLIC_API_URL,
    }); // クライアントでは NEXT_PUBLIC_* のみ

// 型定義
type Env = z.infer<typeof envSchema>;

// 環境変数バリデーション
function validateEnv(): Env {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const { fieldErrors } = error.flatten();
      const errorMessage = Object.entries(fieldErrors)
        .map(([field, errors]) => `${field}: ${errors?.join(', ')}`)
        .join('\n  ');
      const fullMessage = `❌ 環境変数の検証に失敗しました：\n  ${errorMessage}`;
      if (isServer) {
        console.error(fullMessage);
        process.exit(1);
      } else {
        throw new Error(fullMessage); // クライアントでは例外を投げるだけ
      }
    }
    throw error;
  }
}

// シングルトンでバリデーション済み変数を保持
let validatedEnv: Env;

export function getEnv(): Env {
  if (!validatedEnv) {
    validatedEnv = validateEnv();
  }
  return validatedEnv;
}
