import { FilterType } from '@/types/todo';
import styles from './FilterButtons.module.css';

interface FilterButtonsProps {
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
}

export function FilterButtons({ filter, setFilter }: FilterButtonsProps) {
  return (
    <div className={styles.filters}>
      <button
        className={`${styles.filterButton} ${filter === 'all' ? styles.active : ''}`}
        onClick={() => setFilter('all')}
      >
        すべて
      </button>
      <button
        className={`${styles.filterButton} ${filter === 'active' ? styles.active : ''}`}
        onClick={() => setFilter('active')}
      >
        未完了
      </button>
      <button
        className={`${styles.filterButton} ${filter === 'completed' ? styles.active : ''}`}
        onClick={() => setFilter('completed')}
      >
        完了済み
      </button>
    </div>
  );
}
