import { useState, useEffect } from 'react';
import { Calendar, Plus } from 'lucide-react';
import { ActivityList } from '@/components/ActivityList';
import { ActivityFormModal } from '@/components/ActivityFormModal';
import { activityService } from '@/lib/activity-service';
import { PMActivity } from '@/types';
import { getCurrentWeek } from '@/lib/date-utils';

export function Schedule() {
  const [activities, setActivities] = useState<PMActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(getCurrentWeek());
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadActivities();
  }, [selectedWeek]);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const data = await activityService.getWeekActivities(selectedWeek);
      setActivities(data);
    } catch (error) {
      console.error('Error loading activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (id: string) => {
    try {
      await activityService.completeActivity(id);
      loadActivities();
    } catch (error) {
      console.error('Error completing activity:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this activity?')) {
      try {
        await activityService.deleteActivity(id);
        loadActivities();
      } catch (error) {
        console.error('Error deleting activity:', error);
      }
    }
  };

  const handleAddActivity = async (activityData: Partial<PMActivity>) => {
    try {
      await activityService.createActivity({
        ...activityData,
        week: selectedWeek,
      } as PMActivity);
      loadActivities();
    } catch (error) {
      console.error('Error creating activity:', error);
      throw error;
    }
  };

  return (
    <>
      <ActivityFormModal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleAddActivity}
        week={selectedWeek}
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Calendar className="text-primary" size={32} />
              <h1 className="text-3xl font-bold text-foreground">Schedule</h1>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-primary hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-colors active:scale-95"
            >
              <Plus size={20} />
              Add Activity
            </button>
          </div>

          {/* Week Navigation */}
          <div className="bg-white rounded-lg p-4 mb-8 shadow-md">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSelectedWeek(Math.max(1, selectedWeek - 1))}
                className="px-4 py-2 hover:bg-surface rounded-lg transition-colors active:scale-95"
              >
                ← Previous Week
              </button>
              <span className="text-lg font-semibold text-foreground">
                Week {selectedWeek} of 52
              </span>
              <button
                onClick={() => setSelectedWeek(Math.min(52, selectedWeek + 1))}
                className="px-4 py-2 hover:bg-surface rounded-lg transition-colors active:scale-95"
              >
                Next Week →
              </button>
            </div>
          </div>

          {/* Activities List */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-bold text-foreground mb-6">
              Activities for Week {selectedWeek}
            </h2>
            <ActivityList
              activities={activities}
              onComplete={handleComplete}
              onDelete={handleDelete}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </>
  );
}
