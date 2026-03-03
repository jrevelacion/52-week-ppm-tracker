import { useState } from 'react';
import { Info as InfoIcon, Mail, Phone, Globe, Edit } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function Info() {
  const { company } = useApp();
  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [companyName, setCompanyName] = useState(company?.name || '');

  const handleSaveCompany = () => {
    localStorage.setItem('company_name', companyName);
    setShowCompanyForm(false);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Company Settings */}
        <div className="bg-white rounded-2xl p-8 shadow-md mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Company Settings</h2>
            <button
              onClick={() => setShowCompanyForm(!showCompanyForm)}
              className="p-2 hover:bg-surface rounded-lg transition-colors active:scale-95"
            >
              <Edit size={24} className="text-primary" />
            </button>
          </div>

          {showCompanyForm ? (
            <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCompanyForm(false)}
                  className="flex-1 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-surface transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCompany}
                  className="flex-1 px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg transition-colors active:scale-95"
                >
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-muted mb-1">Company Name</p>
                <p className="text-lg font-semibold text-foreground">{company?.name || 'Not set'}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-muted mb-1">Status</p>
                <p className="text-lg font-semibold text-success">Active</p>
              </div>
            </div>
          )}
        </div>

        {/* About App */}
        <div className="bg-white rounded-2xl p-8 shadow-md">
          <div className="flex items-center gap-3 mb-8">
            <InfoIcon className="text-primary" size={32} />
            <h1 className="text-3xl font-bold text-foreground">About This App</h1>
          </div>

          {/* App Info */}
          <div className="mb-8 pb-8 border-b border-border">
            <h2 className="text-xl font-bold text-foreground mb-4">52-Week PM Tracker</h2>
            <p className="text-muted mb-4">
              A comprehensive preventive maintenance tracking system designed to help facilities and
              operations teams manage their maintenance schedules efficiently.
            </p>
            <p className="text-sm text-muted">Version 1.0.0 • Web Edition</p>
          </div>

          {/* Features */}
          <div className="mb-8 pb-8 border-b border-border">
            <h2 className="text-xl font-bold text-foreground mb-4">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-muted">✓ 52-week maintenance planning and tracking</p>
                <p className="text-muted">✓ Real-time activity status updates</p>
                <p className="text-muted">✓ Weekly and monthly statistics</p>
              </div>
              <div className="space-y-2">
                <p className="text-muted">✓ Completion rate monitoring</p>
                <p className="text-muted">✓ Overdue activity alerts</p>
                <p className="text-muted">✓ Comprehensive reporting and analytics</p>
              </div>
            </div>
          </div>

          {/* Technology Stack */}
          <div className="mb-8 pb-8 border-b border-border">
            <h2 className="text-xl font-bold text-foreground mb-4">Technology Stack</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-blue-50 rounded-lg text-center">
                <p className="text-xs text-muted">Frontend</p>
                <p className="font-semibold text-foreground">React 18</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg text-center">
                <p className="text-xs text-muted">Styling</p>
                <p className="font-semibold text-foreground">Tailwind CSS</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg text-center">
                <p className="text-xs text-muted">Language</p>
                <p className="font-semibold text-foreground">TypeScript</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg text-center">
                <p className="text-xs text-muted">Build</p>
                <p className="font-semibold text-foreground">Vite</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gradient-to-r from-primary to-blue-600 rounded-xl p-6 text-white">
            <h2 className="text-xl font-bold mb-4">Contact & Support</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail size={20} />
                <span>support@52weekpmtracker.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={20} />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3">
                <Globe size={20} />
                <span>www.52weekpmtracker.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
