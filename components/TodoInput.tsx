
import React, { useState } from 'react';
import PlusIcon from './icons/PlusIcon';

interface TodoInputProps {
  onAddTodo: (text: string) => void;
}

const TodoInput: React.FC<TodoInputProps> = ({ onAddTodo }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTodo(text);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-4">
      <input
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="e.g., Finish project proposal"
        className="flex-grow bg-slate-100 dark:bg-slate-700 border-2 border-transparent focus:border-indigo-500 focus:ring-indigo-500 rounded-lg px-4 py-3 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all duration-300 outline-none"
      />
      <button
        type="submit"
        className="flex-shrink-0 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg px-4 py-3 flex items-center gap-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-indigo-500"
        disabled={!text.trim()}
      >
        <PlusIcon />
        <span className="hidden sm:inline">Add Task</span>
      </button>
    </form>
  );
};

export default TodoInput;
