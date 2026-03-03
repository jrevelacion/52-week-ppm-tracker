export interface NotificationSettings {
  enabled: boolean;
  dueActivityAlerts: boolean;
  overdueActivityAlerts: boolean;
  completionReminders: boolean;
  dailySummary: boolean;
  alertTime: string; // HH:mm format
}

const DEFAULT_SETTINGS: NotificationSettings = {
  enabled: true,
  dueActivityAlerts: true,
  overdueActivityAlerts: true,
  completionReminders: false,
  dailySummary: false,
  alertTime: '09:00',
};

export const notificationService = {
  /**
   * Get notification settings
   */
  getSettings: (): NotificationSettings => {
    const stored = localStorage.getItem('notification_settings');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  },

  /**
   * Save notification settings
   */
  saveSettings: (settings: NotificationSettings): void => {
    localStorage.setItem('notification_settings', JSON.stringify(settings));
  },

  /**
   * Check if notifications are enabled
   */
  isEnabled: (): boolean => {
    return notificationService.getSettings().enabled;
  },

  /**
   * Send browser notification
   */
  sendNotification: (title: string, options?: NotificationOptions): void => {
    if (!notificationService.isEnabled()) return;

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, options);
    }
  },

  /**
   * Request notification permission
   */
  requestPermission: async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      console.log('Notifications not supported');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  },

  /**
   * Generate alert for due activities
   */
  alertDueActivities: (count: number): void => {
    if (count === 0) return;

    const settings = notificationService.getSettings();
    if (!settings.dueActivityAlerts) return;

    notificationService.sendNotification('PM Tracker - Due Activities', {
      body: `You have ${count} activity/activities due today`,
      icon: '/icon.png',
      tag: 'due-activities',
    });
  },

  /**
   * Generate alert for overdue activities
   */
  alertOverdueActivities: (count: number): void => {
    if (count === 0) return;

    const settings = notificationService.getSettings();
    if (!settings.overdueActivityAlerts) return;

    notificationService.sendNotification('PM Tracker - Overdue Activities', {
      body: `You have ${count} overdue activity/activities that need attention`,
      icon: '/icon.png',
      tag: 'overdue-activities',
    });
  },

  /**
   * Generate completion reminder
   */
  sendCompletionReminder: (activityName: string): void => {
    const settings = notificationService.getSettings();
    if (!settings.completionReminders) return;

    notificationService.sendNotification('PM Tracker - Completion Reminder', {
      body: `Don't forget to mark "${activityName}" as complete`,
      icon: '/icon.png',
      tag: 'completion-reminder',
    });
  },

  /**
   * Send daily summary
   */
  sendDailySummary: (stats: {
    total: number;
    completed: number;
    pending: number;
    overdue: number;
  }): void => {
    const settings = notificationService.getSettings();
    if (!settings.dailySummary) return;

    const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

    notificationService.sendNotification('PM Tracker - Daily Summary', {
      body: `Completed: ${stats.completed}/${stats.total} (${completionRate}%) | Pending: ${stats.pending} | Overdue: ${stats.overdue}`,
      icon: '/icon.png',
      tag: 'daily-summary',
    });
  },

  /**
   * Schedule notifications
   */
  scheduleNotifications: (callback: () => void, timeString: string): ReturnType<typeof setTimeout> => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);

    // If time has passed today, schedule for tomorrow
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const timeUntilNotification = scheduledTime.getTime() - now.getTime();

    // Schedule first notification
    const timeout = setTimeout(callback, timeUntilNotification);

    // Schedule recurring daily notifications
    setInterval(callback, 24 * 60 * 60 * 1000);

    return timeout;
  },
};
