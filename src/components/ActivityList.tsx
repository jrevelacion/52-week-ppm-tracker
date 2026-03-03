import { PMActivity } from '@/types';
import { CheckCircle, Clock, AlertCircle, Trash2, Edit2 } from 'lucide-react';

interface ActivityListProps {
  activities: PMActivity[];
  onComplete?: (id: string) => void;
  onEdit?: (activity: PMActivity) => void;
  onDelete?: (id: string) => void;
  loading?: boolean;
}

export function ActivityList({
  activities,
  onComplete,
  onEdit,
  onDelete,
  loading,
}: ActivityListProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="text-success" size={20} />;
      case 'pending':
        return <Clock className="text-warning" size={20} />;
      case 'overdue':
        return <AlertCircle className="text-error" size={20} />;
      default:
        return <Clock className="text-muted" size={20} />;
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      overdue: 'bg-red-100 text-red-800',
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-muted text-sm">Loading activities...</p>
        </div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted text-lg">No activities found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="bg-white rounded-lg border border-border p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              {getStatusIcon(activity.status)}
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{activity.title}</h3>
                <p className="text-sm text-muted mt-1">{activity.description}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(activity.status)}`}>
                    {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                    {activity.frequency}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                    {activity.category}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {activity.status !== 'completed' && onComplete && (
                <button
                  onClick={() => onComplete(activity.id)}
                  className="p-2 text-success hover:bg-green-50 rounded-lg transition-colors"
                  title="Mark as completed"
                >
                  <CheckCircle size={20} />
                </button>
              )}
              {onEdit && (
                <button
                  onClick={() => onEdit(activity)}
                  className="p-2 text-primary hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit activity"
                >
                  <Edit2 size={20} />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(activity.id)}
                  className="p-2 text-error hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete activity"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>
          </div>

          {activity.notes && (
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-sm text-muted">
                <strong>Notes:</strong> {activity.notes}
              </p>
            </div>
          )}

          <div className="mt-3 text-xs text-muted">
            Due: {new Date(activity.dueDate).toLocaleDateString()}
            {activity.completedAt && (
              <> • Completed: {new Date(activity.completedAt).toLocaleDateString()}</>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
