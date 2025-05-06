import Link from 'next/link';

export default function Home() {
  return (
    <>
      <h1>To-Do リストアプリ</h1>
      <p>
        <Link href="/todos">ToDoリストを開く →</Link>
      </p>
    </>
  );
}
