// MainDashboard.tsx
import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { TopNav } from './TopNav';
import { Sidebar }from './Sidebar';
import { DashboardHome } from './DashboardHome';
import Reports from './Reports';
import Staff from './Staff';
import Settings from './Settings';

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
        
        <main className="p-8 space-y-8">
        <DashboardHome />
          <Routes>
            <Route path="/account/lgu/:id" element={<DashboardHome />} />
            <Route path="/account/lgu/reports/:id" element={<Reports />} />
            <Route path="/account/lgu/staff/:id" element={<Staff />} />
            <Route path="/account/lgu/settings/:id" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}