import React, { useState } from 'react';
import * as api from '../api';
import { User } from '../types';

interface AuthProps {
  onAuthSuccess: (token: string, user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    let response;
    if (isLogin) {
      response = await api.login(email, password);
    } else {
      response = await api.register(username, email, password);
    }

    setIsLoading(false);

    if (response.data) {
      onAuthSuccess(response.data.token, response.data.user);
    } else {
      setError(response.error || 'An unexpected error occurred.');
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setUsername('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 sm:p-8">
      <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-slate-200 mb-6">
        {isLogin ? 'Welcome Back!' : 'Create Your Account'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              className="w-full bg-slate-100 dark:bg-slate-700 border-2 border-transparent focus:border-indigo-500 focus:ring-indigo-500 rounded-lg px-4 py-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all duration-300 outline-none"
            />
          </div>
        )}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full bg-slate-100 dark:bg-slate-700 border-2 border-transparent focus:border-indigo-500 focus:ring-indigo-500 rounded-lg px-4 py-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all duration-300 outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={isLogin ? 1 : 6}
            className="w-full bg-slate-100 dark:bg-slate-700 border-2 border-transparent focus:border-indigo-500 focus:ring-indigo-500 rounded-lg px-4 py-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all duration-300 outline-none"
          />
        </div>
        {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-lg px-4 py-3 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-indigo-500"
        >
          {isLoading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
        </button>
      </form>
      <div className="mt-6 text-center">
        <button onClick={toggleMode} className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
          {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  );
};

export default Auth;
