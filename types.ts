export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export interface User {
  id: string;
  username: string;
  email: string;
}

export enum FilterType {
  ALL = 'all',
  ACTIVE = 'active',
  COMPLETED = 'completed'
}
