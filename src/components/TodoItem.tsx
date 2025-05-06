'use client';

import { useState, useRef, useEffect, memo } from 'react';
import { TodoItemProps } from '@/types';
import styles from './TodoItem.module.css';

// eslint-disable-next-line react/display-name
export const TodoItem: React.FC<TodoItemProps> = memo(
  ({ todo, onToggle, onDelete, onEdit }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(todo.text);
    const inputRef = useRef<HTMLInputElement>(null);

    // 編集モードに入ったときにinputにフォーカスを当てる
    useEffect(() => {
      if (isEditing && inputRef.current) {
        inputRef.current.focus();
      }
    }, [isEditing]);

    const handleToggle = () => {
      onToggle(todo.id);
    };

    const handleDelete = () => {
      onDelete(todo.id);
    };

    const handleEdit = () => {
      // 完了済みのタスクは編集できない
      if (todo.completed) return;
      setIsEditing(true);
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setEditText(e.target.value);
    };

    const handleEditSubmit = () => {
      const trimmedText = editText.trim();
      if (trimmedText !== '') {
        onEdit(todo.id, trimmedText);
      } else {
        setEditText(todo.text); // 空の場合は元のテキストに戻す
      }
      setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleEditSubmit();
      } else if (e.key === 'Escape') {
        setEditText(todo.text);
        setIsEditing(false);
      }
    };

    return (
      <div
        className={`${styles.todoItem} ${todo.completed ? styles.completed : ''}`}
      >
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
          className={styles.todoCheckbox}
        />

        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editText}
            onChange={handleEditChange}
            onBlur={handleEditSubmit}
            onKeyDown={handleKeyDown}
            className={styles.todoEditInput}
          />
        ) : (
          <span
            className={styles.todoText}
            title={
              todo.completed ? '完了したタスクは編集できません' : 'タスクの内容'
            }
          >
            {todo.text}
          </span>
        )}

        <div className={styles.todoActions}>
          {!todo.completed && (
            <button
              className={styles.editBtn}
              onClick={handleEdit}
              title="タスクを編集"
            >
              編集
            </button>
          )}
          <button
            className={styles.deleteBtn}
            onClick={handleDelete}
            title="タスクを削除"
          >
            削除
          </button>
        </div>
      </div>
    );
  }
);
