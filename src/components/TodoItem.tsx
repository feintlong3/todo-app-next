'use client';

import { useState, useRef, useEffect, useContext } from 'react';
import { Todo } from '@/types/todo';
import { TodoContext } from '@/contexts/TodoContext';
import styles from './TodoItem.module.css';

interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
  const { dispatch } = useContext(TodoContext);
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
    }
  };

  // 編集をキャンセル
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditText(todo.text);
  };

  // 編集を保存
  const handleSaveEdit = () => {
    if (editText.trim()) {
      dispatch({
        type: 'EDIT',
        payload: { id: todo.id, text: editText.trim() },
      });
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
                onChange={() => dispatch({ type: 'TOGGLE', payload: todo.id })}
                className={styles.checkbox}
              />
              <span
                className={`${styles.text} ${todo.completed ? styles.completed : ''}`}
                onClick={() => dispatch({ type: 'TOGGLE', payload: todo.id })}
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
                onClick={() => dispatch({ type: 'REMOVE', payload: todo.id })}
                className={styles.deleteButton}
                title="タスクを削除"
              >
                削除
              </button>
            </div>
          </div>

          <div className={styles.meta}>
            <span className={styles.date}>
              作成日: {new Date(todo.createdAt).toLocaleDateString()}
            </span>
            {todo.updatedAt !== todo.createdAt && (
              <span className={styles.date}>
                更新日: {new Date(todo.updatedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </>
      )}
    </li>
  );
}
