import { useState, useEffect, useMemo } from 'react';
import { Clock, AlertTriangle, Download } from 'lucide-react';
import { ActivityList } from '@/components/ActivityList';
import { SearchAndFilter } from '@/components/SearchAndFilter';
import { activityService } from '@/lib/activity-service';
import { dataExportService } from '@/lib/data-export-service';
import { PMActivity } from '@/types';

export function Pending() {
  const [activities, setActivities] = useState<PMActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'priority' | 'status'>('date');

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const data = await activityService.getPendingActivities();
      setActivities(data);
    } catch (error) {
      console.error('Error loading activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredActivities = useMemo(() => {
    let result = [...activities];

    // Apply search
    if (searchQuery) {
      result = dataExportService.searchActivities(result, searchQuery);
    }

    // Apply priority filter
    if (priorityFilter) {
      result = dataExportService.filterByPriority(result, priorityFilter);
    }

    // Apply sort
    result = dataExportService.sortActivities(result, sortBy);

    return result;
  }, [activities, searchQuery, priorityFilter, sortBy]);

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

  const handleExport = () => {
    try {
      dataExportService.exportAsCSV(filteredActivities, 'pending-activities.csv');
    } catch (error) {
      console.error('Error exporting:', error);
      alert('Failed to export activities');
    }
  };

  const overdueCount = activities.filter(a => new Date(a.dueDate) < new Date()).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Clock className="text-warning" size={32} />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Pending Activities</h1>
              <p className="text-muted text-sm mt-1">{activities.length} activities pending</p>
            </div>
          </div>
          <button
            onClick={handleExport}
            className="bg-primary hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-colors active:scale-95"
          >
            <Download size={20} />
            Export CSV
          </button>
        </div>

        {/* Alert for Overdue */}
        {overdueCount > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 flex items-start gap-3">
            <AlertTriangle className="text-error flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-semibold text-error">Overdue Activities</h3>
              <p className="text-sm text-error text-opacity-80">
                You have {overdueCount} overdue activities that need immediate attention.
              </p>
            </div>
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <p className="text-muted text-sm mb-2">Total Pending</p>
            <p className="text-4xl font-bold text-warning">{activities.length}</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <p className="text-muted text-sm mb-2">Overdue</p>
            <p className="text-4xl font-bold text-error">{overdueCount}</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <p className="text-muted text-sm mb-2">On Schedule</p>
            <p className="text-4xl font-bold text-success">
              {activities.length - overdueCount}
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <SearchAndFilter
          onSearch={setSearchQuery}
          onFilterPriority={setPriorityFilter}
          onSort={setSortBy}
          showPriorityFilter={true}
          showSort={true}
        />

        {/* Activities List */}
        <div className="bg-white rounded-lg p-6 shadow-md mt-8">
          <h2 className="text-xl font-bold text-foreground mb-6">
            {filteredActivities.length} Activities
            {searchQuery && ` (Filtered)`}
          </h2>
          <ActivityList
            activities={filteredActivities}
            onComplete={handleComplete}
            onDelete={handleDelete}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
