import { User, Todo } from './types';

// --- In-Memory Database ---
let users: Record<string, User> = {};
let todos: Record<string, Todo[]> = {}; // Keyed by userId

// --- Helper Functions ---
const simulateDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

const getUserByEmail = (email: string) => Object.values(users).find(u => u.email === email);
const getUserById = (id: string) => users[id];

// --- API Functions ---

export const register = async (username: string, email: string, password: string): Promise<{ data?: { user: User, token: string }, error?: string }> => {
  await simulateDelay(500);
  if (getUserByEmail(email)) {
    return { error: 'An account with this email already exists.' };
  }
  if (Object.values(users).find(u => u.username === username)) {
    return { error: 'This username is already taken.' };
  }
  
  const newUser: User = { id: crypto.randomUUID(), username, email };
  users[newUser.id] = newUser;
  // In a real app, you would hash the password. We'll skip that here.
  todos[newUser.id] = [];
  
  // The token would be a real JWT in a real app. Here, it's just the user ID.
  const token = newUser.id; 
  return { data: { user: newUser, token } };
};

export const login = async (email: string, password: string): Promise<{ data?: { user: User, token: string }, error?: string }> => {
  await simulateDelay(500);
  const user = getUserByEmail(email);
  if (!user) {
    return { error: 'Invalid email or password.' };
  }
  // In a real app, you'd compare a hashed password.
  // We'll just accept any password for this mock.
  const token = user.id;
  return { data: { user, token } };
};

export const getTodos = async (token: string): Promise<{ data?: Todo[], error?: string }> => {
  await simulateDelay(300);
  const user = getUserById(token);
  if (!user) return { error: 'Invalid session.' };
  return { data: todos[user.id] || [] };
};

export const addTodo = async (token: string, text: string): Promise<{ data?: Todo, error?: string }> => {
    await simulateDelay(200);
    const user = getUserById(token);
    if (!user) return { error: 'Invalid session.' };
    
    const newTodo: Todo = { id: crypto.randomUUID(), text, completed: false };
    todos[user.id] = [newTodo, ...todos[user.id]];
    return { data: newTodo };
};

export const updateTodo = async (token: string, todoId: string, updates: Partial<Pick<Todo, 'text' | 'completed'>>): Promise<{ data?: Todo, error?: string }> => {
    await simulateDelay(150);
    const user = getUserById(token);
    if (!user) return { error: 'Invalid session.' };

    let updatedTodo: Todo | undefined;
    todos[user.id] = todos[user.id].map(todo => {
        if (todo.id === todoId) {
            updatedTodo = { ...todo, ...updates };
            return updatedTodo;
        }
        return todo;
    });

    if (!updatedTodo) return { error: 'Todo not found.' };
    return { data: updatedTodo };
};

export const deleteTodo = async (token: string, todoId: string): Promise<{ data?: { success: boolean }, error?: string }> => {
    await simulateDelay(150);
    const user = getUserById(token);
    if (!user) return { error: 'Invalid session.' };
    
    const initialLength = todos[user.id].length;
    todos[user.id] = todos[user.id].filter(todo => todo.id !== todoId);
    
    if (todos[user.id].length === initialLength) {
        return { error: 'Todo not found.' };
    }
    return { data: { success: true } };
};

export const clearCompletedTodos = async (token: string, completedIds: string[]): Promise<{ data?: { success: boolean }, error?: string }> => {
    await simulateDelay(250);
    const user = getUserById(token);
    if (!user) return { error: 'Invalid session.' };

    todos[user.id] = todos[user.id].filter(todo => !completedIds.includes(todo.id));
    return { data: { success: true } };
}
