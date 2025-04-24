import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Sidebar } from "../components/lgu/Sidebar";
import { useParams, Navigate } from "react-router-dom";
import { TopNav } from "../components/lgu/TopNav";

export default function DashboardLayout() {

  const role = localStorage.getItem('role');
  
  if (role !== 'lgu') {
    return <Navigate to="/" replace />;
  }

  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { id } = useParams();
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("lguUser");
    return storedUser ? JSON.parse(storedUser) : { name: "Guest", email: "guest@lgu.gov" };
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
        {!id ? <Navigate to="/" replace /> : <Outlet />}
        </main>
      </div>
    </div>
  );
}
