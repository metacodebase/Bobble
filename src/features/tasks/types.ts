export type TaskPriority = 'low' | 'medium' | 'high';

export type TaskFilterParam = 'all' | 'today' | 'upcoming' | 'done';

export interface Task {
  _id: string;
  user: string;
  bobble?: string;
  title: string;
  notes?: string;
  done: boolean;
  completedAt?: string | null;
  dueAt?: string | null;
  reminderAt?: string | null;
  priority: TaskPriority;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskBody {
  title: string;
  notes?: string;
  bobble?: string;
  done?: boolean;
  dueAt?: string | null;
  reminderAt?: string | null;
  priority?: TaskPriority;
}

export type UpdateTaskBody = Partial<CreateTaskBody>;

export interface CreateTasksBulkBody {
  bobble?: string;
  tasks: CreateTaskBody[];
}
