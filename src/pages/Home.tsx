import { useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Home() {
  const { company, weeklyStats, loading, refreshStats } = useApp();

  useEffect(() => {
    refreshStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-border border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Company Header */}
        <div className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-6 md:p-8 text-white mb-8 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
              <span className="text-2xl font-bold">🏢</span>
            </div>
            <div>
              <p className="text-blue-100 text-sm">Company</p>
              <h1 className="text-2xl md:text-3xl font-bold">
                {company?.name || 'Your Company'}
              </h1>
            </div>
          </div>
        </div>

        {/* Current Week */}
        <div className="bg-white rounded-2xl p-6 md:p-8 mb-8 shadow-md">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">Current Week</h2>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-surface rounded-lg transition-colors">
                <ChevronLeft size={20} className="text-foreground" />
              </button>
              <button className="p-2 hover:bg-surface rounded-lg transition-colors">
                <ChevronRight size={20} className="text-foreground" />
              </button>
            </div>
          </div>

          <div className="text-center">
            <p className="text-muted text-sm mb-2">Week {weeklyStats?.week || 1}</p>
            <h3 className="text-5xl font-bold text-primary mb-2">
              Week {weeklyStats?.week || 1}
            </h3>
            <p className="text-muted">of 52 weeks</p>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {/* Completed */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 shadow-md border border-green-100">
            <div className="text-center">
              <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-xl">✓</span>
              </div>
              <p className="text-3xl font-bold text-foreground mb-1">
                {weeklyStats?.completed || 0}
              </p>
              <p className="text-sm text-muted">Completed</p>
            </div>
          </div>

          {/* Total */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 shadow-md border border-blue-100">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-xl">📋</span>
              </div>
              <p className="text-3xl font-bold text-foreground mb-1">
                {weeklyStats?.total || 0}
              </p>
              <p className="text-sm text-muted">Total</p>
            </div>
          </div>

          {/* Completion Rate */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 shadow-md border border-emerald-100">
            <div className="text-center">
              <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-xl">📈</span>
              </div>
              <p className="text-3xl font-bold text-foreground mb-1">
                {weeklyStats?.completionRate || 0}%
              </p>
              <p className="text-sm text-muted">Completion Rate</p>
            </div>
          </div>

          {/* Pending */}
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-6 shadow-md border border-yellow-100">
            <div className="text-center">
              <div className="w-12 h-12 bg-warning rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-xl">⏱</span>
              </div>
              <p className="text-3xl font-bold text-foreground mb-1">
                {weeklyStats?.pending || 0}
              </p>
              <p className="text-sm text-muted">Pending</p>
            </div>
          </div>

          {/* Overdue */}
          <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-6 shadow-md border border-red-100">
            <div className="text-center">
              <div className="w-12 h-12 bg-error rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-xl">⚠</span>
              </div>
              <p className="text-3xl font-bold text-foreground mb-1">
                {weeklyStats?.overdue || 0}
              </p>
              <p className="text-sm text-muted">Overdue</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-md">
          <h3 className="text-lg font-bold text-foreground mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-primary hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">
              Add New Activity
            </button>
            <button className="bg-success hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">
              View Schedule
            </button>
            <button className="bg-warning hover:bg-amber-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
