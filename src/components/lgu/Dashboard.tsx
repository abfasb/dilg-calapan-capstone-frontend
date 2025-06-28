// MainDashboard.tsx
import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { TopNav } from './TopNav';
import { Sidebar }from './Sidebar';
import Reports from './Reports';
import Staff from './Staff';
import { DashboardHome } from './DashboardHome';
import Settings from './Settings';
import Appointment from './Appointment';
import Announcements from './Announcements';

export default function MainDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('lguUser');
    return storedUser ? JSON.parse(storedUser) : { name: 'Guest', email: 'guest@lgu.gov' };
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        user={user}
      />
      
      <div className={`transition-all ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <TopNav user={user} />
        
        <main className="p-8 spacey-8">
          <Routes>
            <Route path='/'>
            <Route index element={<DashboardHome />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/appointments" element={<Appointment />} />
            <Route path="/community" element={<Appointment />} />
            <Route path="/settings" element={<Settings />} />
            </Route>
          </Routes>
        </main>
      </div>
    </div>
  );
}