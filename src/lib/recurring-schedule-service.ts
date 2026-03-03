export type RecurrenceType = 'none' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'annually';

export interface RecurringSchedule {
  id: string;
  activityId: string;
  recurrenceType: RecurrenceType;
  startDate: string;
  endDate?: string;
  nextDueDate: string;
  occurrences: number; // How many times it has occurred
  maxOccurrences?: number; // 0 = infinite
}

export const recurringScheduleService = {
  /**
   * Get recurring schedule for activity
   */
  getSchedule: (activityId: string): RecurringSchedule | null => {
    const key = `recurring_${activityId}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    return null;
  },

  /**
   * Create recurring schedule
   */
  createSchedule: (
    activityId: string,
    recurrenceType: RecurrenceType,
    startDate: string,
    maxOccurrences?: number
  ): RecurringSchedule => {
    const schedule: RecurringSchedule = {
      id: `recurring_${activityId}_${Date.now()}`,
      activityId,
      recurrenceType,
      startDate,
      nextDueDate: startDate,
      occurrences: 0,
      maxOccurrences,
    };

    const key = `recurring_${activityId}`;
    localStorage.setItem(key, JSON.stringify(schedule));

    return schedule;
  },

  /**
   * Update recurring schedule
   */
  updateSchedule: (activityId: string, updates: Partial<RecurringSchedule>): RecurringSchedule | null => {
    const schedule = recurringScheduleService.getSchedule(activityId);
    if (!schedule) return null;

    const updated = { ...schedule, ...updates };
    const key = `recurring_${activityId}`;
    localStorage.setItem(key, JSON.stringify(updated));

    return updated;
  },

  /**
   * Calculate next due date
   */
  calculateNextDueDate: (currentDate: string, recurrenceType: RecurrenceType): string => {
    const date = new Date(currentDate);

    switch (recurrenceType) {
      case 'weekly':
        date.setDate(date.getDate() + 7);
        break;
      case 'biweekly':
        date.setDate(date.getDate() + 14);
        break;
      case 'monthly':
        date.setMonth(date.getMonth() + 1);
        break;
      case 'quarterly':
        date.setMonth(date.getMonth() + 3);
        break;
      case 'annually':
        date.setFullYear(date.getFullYear() + 1);
        break;
      case 'none':
      default:
        return currentDate;
    }

    return date.toISOString().split('T')[0];
  },

  /**
   * Mark as completed and schedule next occurrence
   */
  markCompleted: (activityId: string): RecurringSchedule | null => {
    const schedule = recurringScheduleService.getSchedule(activityId);
    if (!schedule || schedule.recurrenceType === 'none') return null;

    // Check if max occurrences reached
    if (schedule.maxOccurrences && schedule.occurrences >= schedule.maxOccurrences) {
      return schedule;
    }

    const nextDueDate = recurringScheduleService.calculateNextDueDate(
      schedule.nextDueDate,
      schedule.recurrenceType
    );

    return recurringScheduleService.updateSchedule(activityId, {
      nextDueDate,
      occurrences: schedule.occurrences + 1,
    });
  },

  /**
   * Get all recurring activities due today
   */
  getActivitiesDueToday: (activities: any[]): any[] => {
    const today = new Date().toISOString().split('T')[0];

    return activities.filter((activity) => {
      const schedule = recurringScheduleService.getSchedule(activity.id);
      if (!schedule || schedule.recurrenceType === 'none') return false;

      return schedule.nextDueDate === today;
    });
  },

  /**
   * Get all recurring activities due this week
   */
  getActivitiesDueThisWeek: (activities: any[]): any[] => {
    const today = new Date();
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    return activities.filter((activity) => {
      const schedule = recurringScheduleService.getSchedule(activity.id);
      if (!schedule || schedule.recurrenceType === 'none') return false;

      const dueDate = new Date(schedule.nextDueDate);
      return dueDate >= today && dueDate <= weekFromNow;
    });
  },

  /**
   * Get recurrence label
   */
  getRecurrenceLabel: (recurrenceType: RecurrenceType): string => {
    const labels: Record<RecurrenceType, string> = {
      none: 'No Recurrence',
      weekly: 'Every Week',
      biweekly: 'Every 2 Weeks',
      monthly: 'Every Month',
      quarterly: 'Every 3 Months',
      annually: 'Every Year',
    };
    return labels[recurrenceType];
  },

  /**
   * Delete recurring schedule
   */
  deleteSchedule: (activityId: string): void => {
    const key = `recurring_${activityId}`;
    localStorage.removeItem(key);
  },

  /**
   * Get all recurring schedules
   */
  getAllSchedules: (): RecurringSchedule[] => {
    const schedules: RecurringSchedule[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('recurring_')) {
        const stored = localStorage.getItem(key);
        if (stored) {
          try {
            schedules.push(JSON.parse(stored));
          } catch {
            // Skip invalid entries
          }
        }
      }
    }

    return schedules;
  },

  /**
   * Generate future occurrences
   */
  generateFutureOccurrences: (
    activityId: string,
    numOccurrences: number
  ): string[] => {
    const schedule = recurringScheduleService.getSchedule(activityId);
    if (!schedule || schedule.recurrenceType === 'none') return [];

    const occurrences: string[] = [];
    let currentDate = schedule.nextDueDate;

    for (let i = 0; i < numOccurrences; i++) {
      occurrences.push(currentDate);
      currentDate = recurringScheduleService.calculateNextDueDate(currentDate, schedule.recurrenceType);
    }

    return occurrences;
  },
};
