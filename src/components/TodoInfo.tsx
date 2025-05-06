'use client';

import { TodoInfoProps } from '@/types';

export const TodoInfo: React.FC<TodoInfoProps> = ({ total, completed }) => {
  if (total === 0) {
    return <div className="info">タスクを追加してください</div>;
  }

  const remaining = total - completed;

  return (
    <div className="info">
      <p>
        {total}個中{remaining}個のタスクが残っています
      </p>
    </div>
  );
};
