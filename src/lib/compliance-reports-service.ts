import { PMActivity } from '@/types';

export interface ComplianceReport {
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: string;
  endDate: string;
  generatedAt: string;
  summary: {
    totalActivities: number;
    completedActivities: number;
    pendingActivities: number;
    overdueActivities: number;
    completionRate: number;
    averageCompletionTime?: number; // in days
  };
  byPriority: {
    low: { total: number; completed: number; rate: number };
    medium: { total: number; completed: number; rate: number };
    high: { total: number; completed: number; rate: number };
    urgent: { total: number; completed: number; rate: number };
  };
  byCategory?: {
    [category: string]: { total: number; completed: number; rate: number };
  };
  trends: {
    dailyCompletion: Array<{ date: string; completed: number; total: number }>;
  };
}

export const complianceReportsService = {
  /**
   * Generate daily compliance report
   */
  generateDailyReport: (activities: PMActivity[], date?: string): ComplianceReport => {
    const reportDate = date || new Date().toISOString().split('T')[0];
    const dayStart = new Date(reportDate);
    const dayEnd = new Date(reportDate);
    dayEnd.setDate(dayEnd.getDate() + 1);

    return complianceReportsService.generateReport(activities, 'daily', dayStart, dayEnd);
  },

  /**
   * Generate weekly compliance report
   */
  generateWeeklyReport: (activities: PMActivity[], weekStart?: Date): ComplianceReport => {
    const start = weekStart || new Date();
    start.setDate(start.getDate() - start.getDay()); // Start of week (Sunday)

    const end = new Date(start);
    end.setDate(end.getDate() + 7);

    return complianceReportsService.generateReport(activities, 'weekly', start, end);
  },

  /**
   * Generate monthly compliance report
   */
  generateMonthlyReport: (activities: PMActivity[], monthDate?: Date): ComplianceReport => {
    const date = monthDate || new Date();
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 1);

    return complianceReportsService.generateReport(activities, 'monthly', start, end);
  },

  /**
   * Generate yearly compliance report
   */
  generateYearlyReport: (activities: PMActivity[], year?: number): ComplianceReport => {
    const y = year || new Date().getFullYear();
    const start = new Date(y, 0, 1);
    const end = new Date(y + 1, 0, 1);

    return complianceReportsService.generateReport(activities, 'yearly', start, end);
  },

  /**
   * Generate custom period report
   */
  generateReport: (
    activities: PMActivity[],
    period: 'daily' | 'weekly' | 'monthly' | 'yearly',
    startDate: Date,
    endDate: Date
  ): ComplianceReport => {
    const filteredActivities = activities.filter((a) => {
      const completedDate = a.completedAt ? new Date(a.completedAt) : null;
      const dueDate = new Date(a.dueDate);

      // Include activities that were due or completed in the period
      return (dueDate >= startDate && dueDate < endDate) ||
             (completedDate && completedDate >= startDate && completedDate < endDate);
    });

    const completed = filteredActivities.filter((a) => a.status === 'completed').length;
    const pending = filteredActivities.filter((a) => a.status === 'pending').length;
    const overdue = filteredActivities.filter((a) => a.status === 'overdue').length;
    const total = filteredActivities.length;

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Calculate by priority
    const byPriority = {
      low: complianceReportsService.calculatePriorityStats(filteredActivities, 'low'),
      medium: complianceReportsService.calculatePriorityStats(filteredActivities, 'medium'),
      high: complianceReportsService.calculatePriorityStats(filteredActivities, 'high'),
      urgent: complianceReportsService.calculatePriorityStats(filteredActivities, 'urgent'),
    };

    // Calculate by category
    const byCategory: Record<string, any> = {};
    const categories = new Set(filteredActivities.map((a) => a.category || 'Uncategorized'));
    categories.forEach((category) => {
      const categoryActivities = filteredActivities.filter((a) => (a.category || 'Uncategorized') === category);
      const categoryCompleted = categoryActivities.filter((a) => a.status === 'completed').length;
      byCategory[category] = {
        total: categoryActivities.length,
        completed: categoryCompleted,
        rate: categoryActivities.length > 0 ? Math.round((categoryCompleted / categoryActivities.length) * 100) : 0,
      };
    });

    // Generate daily trends
    const trendsData = complianceReportsService.generateDailyTrends(filteredActivities, startDate, endDate);

    return {
      period,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      generatedAt: new Date().toISOString(),
      summary: {
        totalActivities: total,
        completedActivities: completed,
        pendingActivities: pending,
        overdueActivities: overdue,
        completionRate,
      },
      byPriority,
      byCategory,
      trends: trendsData,
    };
  },

  /**
   * Calculate statistics for a priority level
   */
  calculatePriorityStats: (activities: PMActivity[], priority: string) => {
    const priorityActivities = activities.filter((a) => a.priority === priority);
    const completed = priorityActivities.filter((a) => a.status === 'completed').length;
    const total = priorityActivities.length;

    return {
      total,
      completed,
      rate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  },

  /**
   * Generate daily trends
   */
  generateDailyTrends: (
    activities: PMActivity[],
    startDate: Date,
    endDate: Date
  ): { dailyCompletion: Array<{ date: string; completed: number; total: number }> } => {
    const trends: Array<{ date: string; completed: number; total: number }> = [];
    const current = new Date(startDate);

    while (current < endDate) {
      const dateStr = current.toISOString().split('T')[0];
      const dayActivities = activities.filter((a) => {
        const dueDate = new Date(a.dueDate).toISOString().split('T')[0];
        return dueDate === dateStr;
      });

      const completed = dayActivities.filter((a) => a.status === 'completed').length;

      trends.push({
        date: dateStr,
        completed,
        total: dayActivities.length,
      });

      current.setDate(current.getDate() + 1);
    }

    return { dailyCompletion: trends };
  },

  /**
   * Export report as CSV
   */
  exportReportAsCSV: (report: ComplianceReport): string => {
    const lines: string[] = [];

    lines.push(`Compliance Report - ${report.period.toUpperCase()}`);
    lines.push(`Period: ${report.startDate} to ${report.endDate}`);
    lines.push(`Generated: ${new Date(report.generatedAt).toLocaleString()}`);
    lines.push('');

    lines.push('SUMMARY');
    lines.push(`Total Activities,${report.summary.totalActivities}`);
    lines.push(`Completed,${report.summary.completedActivities}`);
    lines.push(`Pending,${report.summary.pendingActivities}`);
    lines.push(`Overdue,${report.summary.overdueActivities}`);
    lines.push(`Completion Rate,${report.summary.completionRate}%`);
    lines.push('');

    lines.push('BY PRIORITY');
    lines.push('Priority,Total,Completed,Rate');
    Object.entries(report.byPriority).forEach(([priority, stats]) => {
      lines.push(`${priority},${stats.total},${stats.completed},${stats.rate}%`);
    });
    lines.push('');

    if (report.byCategory) {
      lines.push('BY CATEGORY');
      lines.push('Category,Total,Completed,Rate');
      Object.entries(report.byCategory).forEach(([category, stats]) => {
        lines.push(`${category},${stats.total},${stats.completed},${stats.rate}%`);
      });
    }

    return lines.join('\n');
  },

  /**
   * Save report to storage
   */
  saveReport: (report: ComplianceReport): void => {
    const key = `report_${report.period}_${report.startDate}`;
    localStorage.setItem(key, JSON.stringify(report));
  },

  /**
   * Get saved report
   */
  getReport: (period: string, startDate: string): ComplianceReport | null => {
    const key = `report_${period}_${startDate}`;
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
   * Get all saved reports
   */
  getAllReports: (): ComplianceReport[] => {
    const reports: ComplianceReport[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('report_')) {
        const stored = localStorage.getItem(key);
        if (stored) {
          try {
            reports.push(JSON.parse(stored));
          } catch {
            // Skip invalid entries
          }
        }
      }
    }

    return reports.sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime());
  },
};
