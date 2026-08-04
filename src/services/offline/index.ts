import { resetGuestBobbles } from './bobbles';
import { resetGuestTasks } from './tasks';

export * as offlineAuth from './auth';
export * as offlineTasks from './tasks';
export * as offlineBobbles from './bobbles';
export * as offlineProfile from './profile';

/** Clear all mutable data owned by a guest session. */
export function resetGuestData(): void {
  resetGuestTasks();
  resetGuestBobbles();
}
