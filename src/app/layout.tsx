import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ToDoリストアプリ',
  description: 'Next.jsとTypeScriptで実装したToDoリストアプリ',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
