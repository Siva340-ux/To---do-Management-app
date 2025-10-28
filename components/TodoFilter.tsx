
import React from 'react';
import { FilterType } from '../types';

interface TodoFilterProps {
  filter: FilterType;
  onSetFilter: (filter: FilterType) => void;
  activeTodosCount: number;
  hasCompletedTodos: boolean;
  onClearCompleted: () => void;
}

const FilterButton: React.FC<{
  currentFilter: FilterType;
  targetFilter: FilterType;
  onSetFilter: (filter: FilterType) => void;
  children: React.ReactNode;
}> = ({ currentFilter, targetFilter, onSetFilter, children }) => {
  const isActive = currentFilter === targetFilter;
  return (
    <button
      onClick={() => onSetFilter(targetFilter)}
      className={`px-3 py-1 text-sm font-medium rounded-md transition-colors duration-200 ${
        isActive
          ? 'text-indigo-600 dark:text-indigo-400'
          : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
      }`}
    >
      {children}
    </button>
  );
};

const TodoFilter: React.FC<TodoFilterProps> = ({
  filter,
  onSetFilter,
  activeTodosCount,
  hasCompletedTodos,
  onClearCompleted,
}) => {
  return (
    <div className="flex items-center justify-between p-4 text-sm text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700 flex-wrap gap-2">
      <span>
        {activeTodosCount} {activeTodosCount === 1 ? 'item' : 'items'} left
      </span>
      <div className="flex items-center gap-2">
        <FilterButton currentFilter={filter} targetFilter={FilterType.ALL} onSetFilter={onSetFilter}>
          All
        </FilterButton>
        <FilterButton currentFilter={filter} targetFilter={FilterType.ACTIVE} onSetFilter={onSetFilter}>
          Active
        </FilterButton>
        <FilterButton currentFilter={filter} targetFilter={FilterType.COMPLETED} onSetFilter={onSetFilter}>
          Completed
        </FilterButton>
      </div>
      <button
        onClick={onClearCompleted}
        className={`text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-200 ${
            hasCompletedTodos ? 'opacity-100' : 'opacity-0 cursor-default'
        }`}
        disabled={!hasCompletedTodos}
      >
        Clear completed
      </button>
    </div>
  );
};

export default TodoFilter;
