import { randomUUID } from 'node:crypto';
import { DataStore } from '../../core/dataStore';
import { Task } from '../../core/types';

export interface TaskFilters {
  warehouseId?: string;
  status?: Task['status'];
  type?: Task['type'];
}

export const listTasks = (store: DataStore, filters: TaskFilters = {}): Task[] => {
  return store.tasks.filter((task) => {
    if (filters.warehouseId && task.warehouseId !== filters.warehouseId) return false;
    if (filters.status && task.status !== filters.status) return false;
    if (filters.type && task.type !== filters.type) return false;
    return true;
  });
};

export interface TaskInput extends Omit<Task, 'id'> {}

export const createTask = (store: DataStore, payload: TaskInput): Task => {
  const task: Task = { ...payload, id: randomUUID() };
  store.tasks.push(task);
  return task;
};

export const updateTaskStatus = (store: DataStore, taskId: string, status: Task['status']): Task => {
  const task = store.tasks.find((t) => t.id === taskId);
  if (!task) {
    throw new Error('Task not found');
  }
  task.status = status;
  return task;
};
