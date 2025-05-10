import { z } from 'zod';

// サーバー環境で利用する環境変数のスキーマ
const serverSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  NEXT_PUBLIC_API_URL: z.string().url().optional(), // サーバーではオプショナルな場合も
  // 認証関連（サーバー専用）
  NEXTAUTH_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(1),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
});

// クライアント環境で利用する環境変数のスキーマ
const clientSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url(), // クライアントでは必須
});

type ServerEnv = z.infer<typeof serverSchema>;
type ClientEnv = z.infer<typeof clientSchema>;

// 環境変数のパースと検証を行うコア関数
function parseEnv<T>(
  schema: z.ZodSchema<T>,
  envSource: NodeJS.ProcessEnv | Record<string, string | undefined>, // process.env 以外も許容
  context: 'server' | 'client' | 'build' // エラー処理を制御するためのコンテキスト
): T {
  const result = schema.safeParse(envSource);
  if (!result.success) {
    const { fieldErrors } = result.error.flatten();
    const errorMessage = Object.entries(fieldErrors)
      .map(([field, errors]) => `${field}: ${(errors as string[]).join(', ')}`)
      .join('\n  ');
    // コンテキスト情報をエラーメッセージに含める
    const fullMessage = `❌ 環境変数の検証に失敗しました (コンテキスト: ${context})：\n  ${errorMessage}`;
    console.error(fullMessage);

    if (context === 'server' || context === 'build') {
      // サーバー起動時やビルド時はプロセスを終了
      // Next.jsのビルドプロセス等でエラーがあれば、ここでビルドが失敗する
      process.exit(1);
    } else {
      // クライアントランタイムではエラーをスロー（ブラウザコンソールに表示される）
      throw new Error(fullMessage);
    }
  }
  return result.data;
}

// --- シングルトンインスタンスのキャッシュ ---
let cachedServerEnv: ServerEnv | null = null;
let cachedClientEnv: ClientEnv | null = null;

/**
 * サーバーサイドの環境変数を取得・検証します。
 * この関数はサーバーサイドでのみ呼び出してください。
 * 初回呼び出し時に環境変数を検証し、結果をキャッシュします。
 * 検証失敗時はプロセスを終了します (parseEnv の 'server' コンテキストによる)。
 */
export function getServerEnv(): ServerEnv {
  if (typeof window !== 'undefined') {
    // クライアントサイドでサーバー環境変数を取得しようとした場合のエラー
    throw new Error(
      'getServerEnv() はサーバーサイドでのみ使用できます。クライアントサイドでサーバーの環境変数を参照しようとしています。'
    );
  }
  if (!cachedServerEnv) {
    // サーバーサイドでは process.env を直接使用し、'server' コンテキストで検証
    cachedServerEnv = parseEnv(serverSchema, process.env, 'server');
  }
  return cachedServerEnv;
}

/**
 * クライアントサイドで利用可能な環境変数 (NEXT_PUBLIC_ プレフィックス) を取得・検証します。
 * 検証失敗時は例外をスローします (parseEnv の 'client' コンテキストによる)。
 */
export function getClientEnv(): ClientEnv {
  if (!cachedClientEnv) {
    cachedClientEnv = parseEnv(clientSchema, process.env, 'client');
  }
  return cachedClientEnv;
}
