import React from 'react';
import { User } from '../types';

interface HeaderProps {
    user: User | null;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="mb-8 sm:mb-12">
      <div className="flex justify-between items-center">
        <div></div>
        <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Zenith To-Do
            </h1>
            <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
                Achieve your goals, one task at a time.
            </p>
        </div>
        {user ? (
            <div className="text-right">
                <p className="text-sm text-slate-600 dark:text-slate-400 hidden sm:block">Welcome, <span className="font-bold">{user.username}</span></p>
                <button 
                    onClick={onLogout}
                    className="mt-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                    Logout
                </button>
            </div>
        ) : <div className="w-24"></div>}
      </div>
    </header>
  );
};

export default Header;
