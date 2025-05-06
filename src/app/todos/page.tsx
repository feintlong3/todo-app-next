'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function TodosPage() {
  const [message, setMessage] = useState<string>('ToDoリストページ');

  return (
    <>
      <h1>To-Do リスト</h1>
      <p>{message}</p>
      <div>
        <button
          onClick={() => setMessage('TypeScriptとNext.jsが連携しています！')}
        >
          確認ボタン
        </button>
      </div>
      <p>
        <Link href="/">← ホームに戻る</Link>
      </p>
    </>
  );
}
