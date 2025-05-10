import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// 保護されたルートを指定
const protectedRoutes = ['/profile'];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // 保護されたルートかどうかを確認
  const isProtectedRoute = protectedRoutes.some(
    (route) => path === route || path.startsWith(`${route}/`)
  );

  if (isProtectedRoute) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // 認証されていない場合、ログインページにリダイレクト
    if (!token) {
      const url = new URL('/api/auth/signin', request.url);
      url.searchParams.set('callbackUrl', encodeURI(request.url));
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// ミドルウェアを適用するパスを指定
export const config = {
  matcher: [
    '/profile/:path*',
    // 他の保護されたルートを追加
  ],
};
