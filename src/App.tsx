import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from '@/context/AppContext';
import { Navigation } from '@/components/Navigation';
import { Home } from '@/pages/Home';
import { Schedule } from '@/pages/Schedule';
import { Completed } from '@/pages/Completed';
import { Pending } from '@/pages/Pending';
import { Reports } from '@/pages/Reports';
import { Info } from '@/pages/Info';

function AppContent() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/completed" element={<Completed />} />
        <Route path="/pending" element={<Pending />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/info" element={<Info />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export function App() {
  return (
    <Router>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </Router>
  );
}

export default App;
