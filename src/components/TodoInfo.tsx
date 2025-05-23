'use client';

import { useTodoContext } from '@/contexts/TodoContext';

export const TodoInfo: React.FC = () => {
  const { stats } = useTodoContext();
  const { total, active } = stats;

  if (total === 0) {
    return <div className="info">タスクを追加してください</div>;
  }

  return (
    <div className="info">
      <p>
        {total}個中{active}個のタスクが残っています
      </p>
    </div>
  );
};
