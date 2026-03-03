import apiClient from './api';
import { PMActivity, WeeklyStats, MonthlyStats } from '@/types';

export const activityService = {
  // Get all activities
  getActivities: async (filters?: {
    status?: string;
    week?: number;
    category?: string;
  }) => {
    const response = await apiClient.get('/activities', { params: filters });
    return response.data as PMActivity[];
  },

  // Get activity by ID
  getActivity: async (id: string) => {
    const response = await apiClient.get(`/activities/${id}`);
    return response.data as PMActivity;
  },

  // Create new activity
  createActivity: async (data: Partial<PMActivity>) => {
    const response = await apiClient.post('/activities', data);
    return response.data as PMActivity;
  },

  // Update activity
  updateActivity: async (id: string, data: Partial<PMActivity>) => {
    const response = await apiClient.put(`/activities/${id}`, data);
    return response.data as PMActivity;
  },

  // Delete activity
  deleteActivity: async (id: string) => {
    await apiClient.delete(`/activities/${id}`);
  },

  // Mark activity as completed
  completeActivity: async (id: string, notes?: string, evidence?: string[]) => {
    const response = await apiClient.post(`/activities/${id}/complete`, {
      notes,
      evidence,
      completedAt: new Date().toISOString(),
    });
    return response.data as PMActivity;
  },

  // Get weekly statistics
  getWeeklyStats: async (week?: number) => {
    const response = await apiClient.get('/stats/weekly', {
      params: week ? { week } : {},
    });
    return response.data as WeeklyStats;
  },

  // Get monthly statistics
  getMonthlyStats: async (month?: number, year?: number) => {
    const response = await apiClient.get('/stats/monthly', {
      params: { month, year },
    });
    return response.data as MonthlyStats;
  },

  // Get all activities for a specific week
  getWeekActivities: async (week: number) => {
    const response = await apiClient.get('/activities/week', {
      params: { week },
    });
    return response.data as PMActivity[];
  },

  // Get completed activities
  getCompletedActivities: async (limit?: number) => {
    const response = await apiClient.get('/activities/completed', {
      params: { limit },
    });
    return response.data as PMActivity[];
  },

  // Get pending activities
  getPendingActivities: async () => {
    const response = await apiClient.get('/activities/pending');
    return response.data as PMActivity[];
  },

  // Get overdue activities
  getOverdueActivities: async () => {
    const response = await apiClient.get('/activities/overdue');
    return response.data as PMActivity[];
  },

  // Export activities as CSV
  exportActivities: async (format: 'csv' | 'pdf' = 'csv') => {
    const response = await apiClient.get(`/activities/export?format=${format}`, {
      responseType: 'blob',
    });
    return response.data as Blob;
  },
};
