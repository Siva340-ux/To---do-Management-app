
import React, { useState, useRef, useEffect } from 'react';
import { Todo } from '../types';
import CheckIcon from './icons/CheckIcon';
import TrashIcon from './icons/TrashIcon';

interface TodoItemProps {
  todo: Todo;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  onEditTodo: (id: string, text: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggleTodo,
  onDeleteTodo,
  onEditTodo,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (isEditing) {
        inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleEdit = () => {
      setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditText(todo.text);
  };

  const handleSave = () => {
    if (editText.trim()) {
        onEditTodo(todo.id, editText.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
        handleSave();
    } else if (e.key === 'Escape') {
        handleCancelEdit();
    }
  };

  return (
    <li
      className="group flex items-center p-4 transition-colors duration-200 ease-in-out hover:bg-slate-50 dark:hover:bg-slate-700/50"
    >
        <button
            onClick={() => onToggleTodo(todo.id)}
            className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center mr-4 transition-all duration-300 ${
                todo.completed
                ? 'bg-indigo-600 border-indigo-600'
                : 'border-slate-300 dark:border-slate-600 group-hover:border-indigo-400'
            }`}
            aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
            {todo.completed && <CheckIcon />}
        </button>

        <div className="flex-grow" onDoubleClick={!todo.completed ? handleEdit : undefined}>
            {isEditing ? (
                <input 
                    ref={inputRef}
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-transparent p-0 m-0 border-0 focus:ring-0 text-slate-800 dark:text-slate-200"
                />
            ) : (
                <span
                    className={`cursor-pointer transition-all duration-300 ${
                    todo.completed ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-700 dark:text-slate-300'
                    }`}
                >
                    {todo.text}
                </span>
            )}
        </div>
        
      <button
        onClick={() => onDeleteTodo(todo.id)}
        className="ml-4 p-1 text-slate-400 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full"
        aria-label="Delete task"
      >
        <TrashIcon />
      </button>
    </li>
  );
};

export default TodoItem;
