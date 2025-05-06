'use client';

import React from 'react';

// ジェネリックなリストアイテムのインターフェース
interface ListItemProps<T> {
  item: T;
  renderItem: (item: T) => React.ReactNode;
  onItemClick?: (item: T) => void;
}

// ジェネリックなリストアイテムコンポーネント
function ListItem<T>({ item, renderItem, onItemClick }: ListItemProps<T>) {
  return <li onClick={() => onItemClick?.(item)}>{renderItem(item)}</li>;
}

// ジェネリックなリストコンポーネントのインターフェース
interface ItemListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  onItemClick?: (item: T) => void;
  keyExtractor: (item: T) => string;
  className?: string;
}

// ジェネリックなリストコンポーネント
export function ItemList<T>({
  items,
  renderItem,
  onItemClick,
  keyExtractor,
  className = '',
}: ItemListProps<T>) {
  return (
    <ul className={className}>
      {items.map((item) => (
        <ListItem
          key={keyExtractor(item)}
          item={item}
          renderItem={renderItem}
          onItemClick={onItemClick}
        />
      ))}
    </ul>
  );
}
