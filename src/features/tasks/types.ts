export type TaskPriority = 'low' | 'medium' | 'high';

export type TaskFilterParam = 'all' | 'overdue' | 'today' | 'upcoming' | 'done';

export interface Task {
  _id: string;
  user: string;
  bobble?: string;
  title: string;
  notes?: string;
  done: boolean;
  completedAt?: string | null;
  dueAt?: string | null;
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
  priority?: TaskPriority;
}

export type UpdateTaskBody = Partial<CreateTaskBody>;

export interface CreateTasksBulkBody {
  bobble?: string;
  /** Stable per-action key so retries return the original tasks instead of duplicating them. */
  idempotencyKey?: string;
  tasks: CreateTaskBody[];
}
