import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Calendar,
  CheckCircle,
  Clock,
  BarChart3,
  Info,
  LogOut,
  Edit,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function Navigation() {
  const location = useLocation();
  const { logout, user, company } = useApp();
  const [showLogoUpload, setShowLogoUpload] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(company?.logo || null);

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/schedule', label: 'Schedule', icon: Calendar },
    { path: '/completed', label: 'Completed', icon: CheckCircle },
    { path: '/pending', label: 'Pending', icon: Clock },
    { path: '/reports', label: 'Reports', icon: BarChart3 },
    { path: '/info', label: 'Info', icon: Info },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setLogoPreview(result);
        // Store in localStorage
        localStorage.setItem('company_logo', result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      {/* Logo Upload Modal */}
      {showLogoUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Upload Company Logo</h2>
            <div className="mb-4">
              {logoPreview && (
                <div className="mb-4 flex justify-center">
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="h-32 w-32 object-contain rounded-lg border border-border"
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="w-full px-3 py-2 border border-border rounded-lg"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoUpload(false)}
                className="flex-1 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-surface transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => setShowLogoUpload(false)}
                className="flex-1 px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <nav className="bg-white border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setShowLogoUpload(true)}>
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Company logo"
                  className="w-10 h-10 rounded-lg object-cover group-hover:opacity-80 transition-opacity"
                />
              ) : (
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center group-hover:bg-blue-700 transition-colors">
                  <span className="text-white font-bold text-lg">PM</span>
                </div>
              )}
              <div className="hidden sm:block">
                <span className="font-bold text-lg text-foreground">{company?.name || '52-Week PM Tracker'}</span>
                <div className="flex items-center gap-1 text-xs text-muted opacity-0 group-hover:opacity-100 transition-opacity">
                  <Edit size={12} />
                  <span>Click to edit logo</span>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-colors active:scale-95 ${
                    isActive(path)
                      ? 'bg-primary text-white'
                      : 'text-foreground hover:bg-surface'
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-sm font-medium">{label}</span>
                </Link>
              ))}
            </div>

            {/* User Info & Logout */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted hidden sm:inline">
                {user?.name || 'User'}
              </span>
              <button
                onClick={logout}
                className="p-2 text-foreground hover:bg-surface rounded-lg transition-colors active:scale-95"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex overflow-x-auto pb-2 gap-2">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`px-3 py-2 rounded-lg flex items-center gap-1 whitespace-nowrap transition-colors text-sm active:scale-95 ${
                  isActive(path)
                    ? 'bg-primary text-white'
                    : 'text-foreground hover:bg-surface'
                }`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}
