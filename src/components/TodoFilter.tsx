'use client';

import { useTodoContext } from '@/contexts/TodoContext';
import { FilterType } from '@/types/todo';
import styles from './TodoFilter.module.css';

export const TodoFilter: React.FC = () => {
  const { filter, changeFilter } = useTodoContext();

  const filters: { value: FilterType; label: string }[] = [
    { value: 'all', label: 'すべて' },
    { value: 'active', label: '未完了' },
    { value: 'completed', label: '完了' },
  ];

  return (
    <div className={styles.filterContainer}>
      {filters.map((filterOption) => (
        <button
          key={filterOption.value}
          className={`${styles.filterBtn} ${filter === filterOption.value ? 'active' : ''}`.trim()}
          onClick={() => changeFilter(filterOption.value)}
        >
          {filterOption.label}
        </button>
      ))}
    </div>
  );
};
