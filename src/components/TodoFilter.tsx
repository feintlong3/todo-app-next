'use client';

import { TodoFilterProps, TodoFilter as FilterType } from '@/types';
import styles from './TodoFilter.module.css';

export const TodoFilter: React.FC<TodoFilterProps> = ({
  currentFilter,
  onFilterChange,
}) => {
  const filters: { value: FilterType; label: string }[] = [
    { value: 'all', label: 'すべて' },
    { value: 'active', label: '未完了' },
    { value: 'completed', label: '完了' },
  ];

  return (
    <div className={styles.filterContainer}>
      {filters.map((filter) => (
        <button
          key={filter.value}
          className={`${styles.filterBtn} ${currentFilter === filter.value ? 'active' : ''}`.trim()}
          onClick={() => onFilterChange(filter.value)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};
