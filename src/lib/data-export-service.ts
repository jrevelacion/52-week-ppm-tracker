import { PMActivity } from '@/types';

export const dataExportService = {
  /**
   * Export activities as JSON
   */
  exportAsJSON: (activities: PMActivity[], filename = 'pm-tracker-backup.json') => {
    const data = {
      exportDate: new Date().toISOString(),
      version: '1.0.0',
      activities,
    };

    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  /**
   * Export activities as CSV
   */
  exportAsCSV: (activities: PMActivity[], filename = 'pm-tracker-activities.csv') => {
    const headers = [
      'ID',
      'Title',
      'Description',
      'Priority',
      'Status',
      'Due Date',
      'Category',
      'Frequency',
      'Completed At',
      'Notes',
    ];

    const rows = activities.map((activity) => [
      activity.id,
      activity.title || activity.name || '',
      activity.description || '',
      activity.priority || '',
      activity.status,
      activity.dueDate,
      activity.category || '',
      activity.frequency || '',
      activity.completedAt || '',
      activity.notes || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) =>
        row
          .map((cell) => {
            // Escape quotes and wrap in quotes if contains comma
            const cellStr = String(cell || '').replace(/"/g, '""');
            return cellStr.includes(',') ? `"${cellStr}"` : cellStr;
          })
          .join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  /**
   * Export activities as PDF (placeholder - use CSV for now)
   */
  exportAsPDF: async (activities: PMActivity[], filename = 'pm-tracker-report.pdf') => {
    // For now, export as CSV instead
    dataExportService.exportAsCSV(activities, filename.replace('.pdf', '.csv'));
  },

  /**
   * Import activities from JSON file
   */
  importFromJSON: (file: File): Promise<PMActivity[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          const data = JSON.parse(content);

          if (!Array.isArray(data.activities)) {
            throw new Error('Invalid JSON format: activities array not found');
          }

          resolve(data.activities);
        } catch (error) {
          reject(new Error(`Failed to parse JSON: ${error instanceof Error ? error.message : 'Unknown error'}`));
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsText(file);
    });
  },

  /**
   * Generate compliance report
   */
  generateComplianceReport: (activities: PMActivity[], period: 'weekly' | 'monthly' = 'weekly') => {
    const completed = activities.filter((a) => a.status === 'completed').length;
    const total = activities.length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    const pending = activities.filter((a) => a.status === 'pending').length;
    const overdue = activities.filter((a) => a.status === 'overdue').length;

    return {
      period,
      generatedAt: new Date().toISOString(),
      summary: {
        total,
        completed,
        pending,
        overdue,
        completionRate,
      },
      activities,
    };
  },

  /**
   * Get activities by priority
   */
  filterByPriority: (activities: PMActivity[], priority: string | null): PMActivity[] => {
    if (!priority) return activities;
    return activities.filter((a) => a.priority === priority);
  },

  /**
   * Search activities
   */
  searchActivities: (activities: PMActivity[], query: string): PMActivity[] => {
    if (!query) return activities;

    const lowerQuery = query.toLowerCase();
    return activities.filter(
      (a) =>
        (a.title || a.name || '').toLowerCase().includes(lowerQuery) ||
        (a.description || '').toLowerCase().includes(lowerQuery) ||
        (a.notes || '').toLowerCase().includes(lowerQuery)
    );
  },

  /**
   * Sort activities
   */
  sortActivities: (
    activities: PMActivity[],
    sortBy: 'name' | 'date' | 'priority' | 'status' = 'date'
  ): PMActivity[] => {
    const sorted = [...activities];

    switch (sortBy) {
      case 'name':
        return sorted.sort((a, b) => {
          const nameA = (a.title || a.name || '').toLowerCase();
          const nameB = (b.title || b.name || '').toLowerCase();
          return nameA.localeCompare(nameB);
        });

      case 'date':
        return sorted.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

      case 'priority': {
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
        return sorted.sort(
          (a, b) =>
            (priorityOrder[a.priority as keyof typeof priorityOrder] || 99) -
            (priorityOrder[b.priority as keyof typeof priorityOrder] || 99)
        );
      }

      case 'status': {
        const statusOrder = { overdue: 0, pending: 1, 'in-progress': 2, completed: 3 };
        return sorted.sort(
          (a, b) =>
            (statusOrder[a.status as keyof typeof statusOrder] || 99) -
            (statusOrder[b.status as keyof typeof statusOrder] || 99)
        );
      }

      default:
        return sorted;
    }
  },
};
