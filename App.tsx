import React, { useState, useMemo, useEffect } from 'react';
import { Todo, FilterType, User } from './types';
import Header from './components/Header';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import TodoFilter from './components/TodoFilter';
import Auth from './components/Auth';
import * as api from './api';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>(FilterType.ALL);

  useEffect(() => {
    const savedToken = sessionStorage.getItem('authToken');
    const savedUser = sessionStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (token) {
      api.getTodos(token).then(response => {
        if (response.data) {
          setTodos(response.data);
        } else {
          // Handle error, maybe logout
          console.error(response.error);
        }
      });
    } else {
      setTodos([]);
    }
  }, [token]);

  const handleAuthSuccess = (newToken: string, newUser: User) => {
    sessionStorage.setItem('authToken', newToken);
    sessionStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const addTodo = async (text: string) => {
    if (text.trim() === '' || !token) return;
    const response = await api.addTodo(token, text);
    if (response.data) {
      setTodos([response.data, ...todos]);
    }
  };

  const toggleTodo = async (id: string) => {
    if (!token) return;
    const originalTodo = todos.find(t => t.id === id);
    if (!originalTodo) return;
    
    const updatedTodo = { ...originalTodo, completed: !originalTodo.completed };
    setTodos(todos.map(t => (t.id === id ? updatedTodo : t))); // Optimistic update

    const response = await api.updateTodo(token, id, { completed: updatedTodo.completed });
    if (response.error) {
        setTodos(todos.map(t => (t.id === id ? originalTodo : t))); // Revert on error
    }
  };

  const deleteTodo = async (id: string) => {
    if (!token) return;
    const originalTodos = [...todos];
    setTodos(todos.filter(todo => todo.id !== id)); // Optimistic update
    const response = await api.deleteTodo(token, id);
    if(response.error) {
        setTodos(originalTodos); // Revert on error
    }
  };
  
  const editTodo = async (id: string, text: string) => {
    if (!token) return;
    const originalTodo = todos.find(t => t.id === id);
    if (!originalTodo) return;

    setTodos(todos.map(todo => (todo.id === id ? { ...todo, text } : todo))); // Optimistic update
    
    const response = await api.updateTodo(token, id, { text });
    if(response.error) {
        setTodos(todos.map(t => (t.id === id ? originalTodo : t))); // Revert on error
    }
  };

  const clearCompleted = async () => {
    if (!token) return;
    const activeTodos = todos.filter(t => !t.completed);
    const completedIds = todos.filter(t => t.completed).map(t => t.id);
    
    setTodos(activeTodos); // Optimistic update
    
    const response = await api.clearCompletedTodos(token, completedIds);
    if(response.error) {
        const originalTodos = await api.getTodos(token); // Refetch to revert
        if (originalTodos.data) setTodos(originalTodos.data);
    }
  };

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case FilterType.ACTIVE:
        return todos.filter(todo => !todo.completed);
      case FilterType.COMPLETED:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const activeTodosCount = useMemo(() => todos.filter(todo => !todo.completed).length, [todos]);
  
  if (isLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
            <p className="text-slate-500 dark:text-slate-400">Loading...</p>
        </div>
    );
  }

  return (
    <div className="min-h-screen font-sans text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-900 transition-colors duration-300">
      <div className="container mx-auto p-4 sm:p-6 md:p-8 max-w-2xl">
        <Header user={user} onLogout={handleLogout} />
        <main>
          {!token ? (
            <Auth onAuthSuccess={handleAuthSuccess} />
          ) : (
            <>
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6">
                <TodoInput onAddTodo={addTodo} />
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg">
                {todos.length > 0 ? (
                    <>
                        <TodoList
                            todos={filteredTodos}
                            onToggleTodo={toggleTodo}
                            onDeleteTodo={deleteTodo}
                            onEditTodo={editTodo}
                        />
                        <TodoFilter 
                            filter={filter} 
                            onSetFilter={setFilter} 
                            activeTodosCount={activeTodosCount}
                            hasCompletedTodos={todos.some(t => t.completed)}
                            onClearCompleted={clearCompleted}
                        />
                    </>
                ) : (
                    <p className="text-center p-8 text-slate-500 dark:text-slate-400">
                        Welcome, {user?.username}! Your task list is empty.
                    </p>
                )}
              </div>
            </>
          )}
        </main>
        <footer className="text-center mt-8 text-slate-500 dark:text-slate-400 text-sm">
            <p>Designed for productivity. Built with React & Tailwind CSS.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
