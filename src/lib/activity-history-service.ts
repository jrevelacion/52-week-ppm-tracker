export interface ActivityHistoryEntry {
  id: string;
  activityId: string;
  action: 'created' | 'updated' | 'completed' | 'deleted' | 'note_added';
  timestamp: string;
  details: {
    previousValue?: any;
    newValue?: any;
    note?: string;
    completedBy?: string;
  };
}

export const activityHistoryService = {
  /**
   * Get history for a specific activity
   */
  getActivityHistory: (activityId: string): ActivityHistoryEntry[] => {
    const key = `activity_history_${activityId}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
    return [];
  },

  /**
   * Add history entry
   */
  addHistoryEntry: (
    activityId: string,
    action: ActivityHistoryEntry['action'],
    details: ActivityHistoryEntry['details']
  ): void => {
    const key = `activity_history_${activityId}`;
    const history = activityHistoryService.getActivityHistory(activityId);

    const entry: ActivityHistoryEntry = {
      id: `${activityId}_${Date.now()}`,
      activityId,
      action,
      timestamp: new Date().toISOString(),
      details,
    };

    history.push(entry);

    // Keep only last 100 entries per activity
    if (history.length > 100) {
      history.shift();
    }

    localStorage.setItem(key, JSON.stringify(history));
  },

  /**
   * Get all history entries across all activities
   */
  getAllHistory: (): ActivityHistoryEntry[] => {
    const allHistory: ActivityHistoryEntry[] = [];

    // Iterate through all localStorage keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('activity_history_')) {
        const stored = localStorage.getItem(key);
        if (stored) {
          try {
            const entries = JSON.parse(stored);
            allHistory.push(...entries);
          } catch {
            // Skip invalid entries
          }
        }
      }
    }

    // Sort by timestamp descending
    return allHistory.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },

  /**
   * Get history for date range
   */
  getHistoryByDateRange: (startDate: Date, endDate: Date): ActivityHistoryEntry[] => {
    const allHistory = activityHistoryService.getAllHistory();
    return allHistory.filter((entry) => {
      const entryDate = new Date(entry.timestamp);
      return entryDate >= startDate && entryDate <= endDate;
    });
  },

  /**
   * Get history by action type
   */
  getHistoryByAction: (action: ActivityHistoryEntry['action']): ActivityHistoryEntry[] => {
    return activityHistoryService.getAllHistory().filter((entry) => entry.action === action);
  },

  /**
   * Format history entry for display
   */
  formatHistoryEntry: (entry: ActivityHistoryEntry): string => {
    const date = new Date(entry.timestamp);
    const timeStr = date.toLocaleTimeString();
    const dateStr = date.toLocaleDateString();

    switch (entry.action) {
      case 'created':
        return `Created on ${dateStr} at ${timeStr}`;
      case 'updated':
        return `Updated on ${dateStr} at ${timeStr}`;
      case 'completed':
        return `Completed on ${dateStr} at ${timeStr}${entry.details.completedBy ? ` by ${entry.details.completedBy}` : ''}`;
      case 'deleted':
        return `Deleted on ${dateStr} at ${timeStr}`;
      case 'note_added':
        return `Note added on ${dateStr} at ${timeStr}: ${entry.details.note}`;
      default:
        return `${entry.action} on ${dateStr} at ${timeStr}`;
    }
  },

  /**
   * Get completion history for an activity
   */
  getCompletionHistory: (activityId: string): ActivityHistoryEntry[] => {
    const history = activityHistoryService.getActivityHistory(activityId);
    return history.filter((entry) => entry.action === 'completed');
  },

  /**
   * Get completion count
   */
  getCompletionCount: (activityId: string): number => {
    return activityHistoryService.getCompletionHistory(activityId).length;
  },

  /**
   * Export history as CSV
   */
  exportHistoryAsCSV: (activityId?: string): string => {
    const history = activityId
      ? activityHistoryService.getActivityHistory(activityId)
      : activityHistoryService.getAllHistory();

    const headers = ['Activity ID', 'Action', 'Timestamp', 'Details'];
    const rows = history.map((entry) => [
      entry.activityId,
      entry.action,
      entry.timestamp,
      JSON.stringify(entry.details),
    ]);

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');

    return csv;
  },

  /**
   * Clear history for an activity
   */
  clearActivityHistory: (activityId: string): void => {
    const key = `activity_history_${activityId}`;
    localStorage.removeItem(key);
  },

  /**
   * Clear all history
   */
  clearAllHistory: (): void => {
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('activity_history_')) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => localStorage.removeItem(key));
  },
};
