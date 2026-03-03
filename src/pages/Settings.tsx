import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Moon, Bell, Trash2, Download } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { notificationService, NotificationSettings } from '@/lib/notification-service';
import { activityHistoryService } from '@/lib/activity-history-service';

export function Settings() {
  const { theme, toggleTheme } = useTheme();
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(
    notificationService.getSettings()
  );
  const [storageUsed, setStorageUsed] = useState(0);

  useEffect(() => {
    calculateStorageUsed();
  }, []);

  const calculateStorageUsed = () => {
    let total = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const item = localStorage.getItem(key);
        if (item) {
          total += item.length;
        }
      }
    }
    setStorageUsed(total);
  };

  const handleNotificationChange = (key: keyof NotificationSettings, value: any) => {
    const updated = { ...notificationSettings, [key]: value };
    setNotificationSettings(updated);
    notificationService.saveSettings(updated);
  };

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear all activity history? This cannot be undone.')) {
      activityHistoryService.clearAllHistory();
      alert('Activity history cleared');
    }
  };

  const handleClearPhotos = () => {
    if (confirm('Are you sure you want to clear all photos? This cannot be undone.')) {
      // Clear all photos
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('photos_')) {
          localStorage.removeItem(key);
        }
      }
      calculateStorageUsed();
      alert('All photos cleared');
    }
  };

  const handleExportData = () => {
    const csv = activityHistoryService.exportHistoryAsCSV();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `activity-history-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleRequestNotificationPermission = async () => {
    const granted = await notificationService.requestPermission();
    if (granted) {
      alert('Notifications enabled!');
      notificationService.sendNotification('PM Tracker', {
        body: 'Notifications are now enabled',
        icon: '/icon.png',
      });
    } else {
      alert('Notification permission denied');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <SettingsIcon className="text-primary" size={32} />
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        </div>

        {/* Theme Settings */}
        <div className="bg-white rounded-lg p-6 shadow-md mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Moon size={24} className="text-primary" />
            <h2 className="text-xl font-bold text-foreground">Appearance</h2>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-foreground">Dark Mode</p>
              <p className="text-sm text-muted">Currently: {theme === 'dark' ? 'Dark' : 'Light'}</p>
            </div>
            <button
              onClick={toggleTheme}
              className={`px-6 py-2 rounded-lg font-medium transition-colors active:scale-95 ${
                theme === 'dark'
                  ? 'bg-gray-800 text-white'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
            </button>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-lg p-6 shadow-md mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Bell size={24} className="text-primary" />
            <h2 className="text-xl font-bold text-foreground">Notifications</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-foreground">Enable Notifications</p>
                <p className="text-sm text-muted">Receive browser notifications</p>
              </div>
              <input
                type="checkbox"
                checked={notificationSettings.enabled}
                onChange={(e) => handleNotificationChange('enabled', e.target.checked)}
                className="w-5 h-5 cursor-pointer"
              />
            </div>

            {notificationSettings.enabled && (
              <>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Due Activity Alerts</p>
                    <p className="text-sm text-muted">Alert for activities due today</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.dueActivityAlerts}
                    onChange={(e) => handleNotificationChange('dueActivityAlerts', e.target.checked)}
                    className="w-5 h-5 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Overdue Activity Alerts</p>
                    <p className="text-sm text-muted">Alert for overdue activities</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.overdueActivityAlerts}
                    onChange={(e) => handleNotificationChange('overdueActivityAlerts', e.target.checked)}
                    className="w-5 h-5 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Daily Summary</p>
                    <p className="text-sm text-muted">Receive daily completion summary</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.dailySummary}
                    onChange={(e) => handleNotificationChange('dailySummary', e.target.checked)}
                    className="w-5 h-5 cursor-pointer"
                  />
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800 mb-3">
                    Alert Time: {notificationSettings.alertTime}
                  </p>
                  <input
                    type="time"
                    value={notificationSettings.alertTime}
                    onChange={(e) => handleNotificationChange('alertTime', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg"
                  />
                </div>

                <button
                  onClick={handleRequestNotificationPermission}
                  className="w-full bg-primary hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors active:scale-95"
                >
                  Enable Browser Notifications
                </button>
              </>
            )}
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white rounded-lg p-6 shadow-md mb-6">
          <h2 className="text-xl font-bold text-foreground mb-4">Data Management</h2>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-foreground mb-2">Storage Used</p>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted">
                  {(storageUsed / 1024).toFixed(2)} KB / 5 MB
                </p>
                <div className="w-48 h-2 bg-gray-300 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${Math.min((storageUsed / (5 * 1024 * 1024)) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleExportData}
              className="w-full bg-success hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors active:scale-95"
            >
              <Download size={20} />
              Export Activity History
            </button>

            <button
              onClick={handleClearHistory}
              className="w-full bg-warning hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors active:scale-95"
            >
              <Trash2 size={20} />
              Clear Activity History
            </button>

            <button
              onClick={handleClearPhotos}
              className="w-full bg-error hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors active:scale-95"
            >
              <Trash2 size={20} />
              Clear All Photos
            </button>
          </div>
        </div>

        {/* About */}
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-bold text-foreground mb-4">About</h2>

          <div className="space-y-3 text-sm text-muted">
            <p>
              <strong>App:</strong> 52-Week PM Tracker Web
            </p>
            <p>
              <strong>Version:</strong> 2.0.0
            </p>
            <p>
              <strong>Last Updated:</strong> March 2026
            </p>
            <p>
              <strong>Support:</strong> support@52weekpmtracker.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
