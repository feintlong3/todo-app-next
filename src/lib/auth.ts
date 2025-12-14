import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import { getServerEnv } from '@/utils/env';

// 環境変数からクライアントIDとシークレットを取得
export function getAuthOptions(): NextAuthOptions {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = getServerEnv();

  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    adapter: PrismaAdapter(prisma as any),
    providers: [
      GoogleProvider({
        clientId: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
      }),
    ],
    session: {
      strategy: 'jwt',
    },
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.id = user.id;
        }
        return token;
      },
      async session({ session, token }) {
        if (session.user) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (session.user as any).id = token.id;
        }
        return session;
      },
    },
  };
}

// エクスポートするauthOptions定数
export const authOptions = getAuthOptions();
