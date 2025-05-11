'use client';

import { useState, useRef, useEffect } from 'react';
import { Todo } from '@/types/todo';
import styles from './TodoItem.module.css';

interface TodoItemProps {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: (text: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const editInputRef = useRef<HTMLInputElement>(null);

  // 編集モードに入ったとき、入力フィールドにフォーカスする
  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditing]);

  // 編集を開始
  const handleEdit = () => {
    if (!todo.completed) {
      setIsEditing(true);
      setEditText(todo.text); // 編集開始時に現在のテキストをセット
    }
  };

  // 編集をキャンセル
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditText(todo.text); // 元のテキストに戻す
  };

  // 編集を保存
  const handleSaveEdit = () => {
    if (editText.trim()) {
      onEdit(editText.trim());
      setIsEditing(false);
    }
  };

  // Enterキーで編集を保存、Escキーで編集をキャンセル
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  // 日付をフォーマット
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <li className={styles.item}>
      {isEditing ? (
        <div className={styles.editContainer}>
          <input
            ref={editInputRef}
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            className={styles.editInput}
          />
          <div className={styles.editActions}>
            <button
              onClick={handleSaveEdit}
              className={styles.saveButton}
              disabled={!editText.trim()}
            >
              保存
            </button>
            <button onClick={handleCancelEdit} className={styles.cancelButton}>
              キャンセル
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className={styles.todoContent}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={onToggle}
                className={styles.checkbox}
              />
              <span
                className={`${styles.text} ${todo.completed ? styles.completed : ''}`}
              >
                {todo.text}
              </span>
            </label>

            <div className={styles.actions}>
              <button
                onClick={handleEdit}
                className={`${styles.editButton} ${todo.completed ? styles.disabled : ''}`}
                disabled={todo.completed}
                title={
                  todo.completed
                    ? '完了済みのタスクは編集できません'
                    : 'タスクを編集'
                }
              >
                編集
              </button>
              <button
                onClick={onDelete}
                className={styles.deleteButton}
                title="タスクを削除"
              >
                削除
              </button>
            </div>
          </div>

          <div className={styles.meta}>
            <span className={styles.date}>
              作成日: {formatDate(todo.createdAt)}
            </span>
            {todo.updatedAt &&
              String(todo.updatedAt) !== String(todo.createdAt) && (
                <span className={styles.date}>
                  更新日: {formatDate(todo.updatedAt)}
                </span>
              )}
          </div>
        </>
      )}
    </li>
  );
}
