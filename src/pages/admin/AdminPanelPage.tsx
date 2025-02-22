import { useState } from "react";
import UserManagement from "../../components/admin/UserManagement";
import ReportsAnalytics from "../../components/admin/ReportsAnalytics";
import SystemMonitoring from "../../components/admin/SystemMonitoring";
import Announcements from "../../components/admin/Announcements";
import { Sidebar } from "../../components/admin/Sidebar";
import Dashboard from "../../components/admin/Dashboard";
import LGUManagement from "../../components/admin/LGUManagement";
import { Navbar } from "../../components/admin/NavBar";

export default function AdminPanelPage() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard />;
      case "users":
        return <UserManagement />;
      case "lgu":
        return <LGUManagement />;
      case "reports":
        return <ReportsAnalytics />;
      case "monitoring":
        return <SystemMonitoring />;
      case "announcements":
        return <Announcements />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
      />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        isSidebarOpen ? 'ml-0 lg:ml-64' : 'ml-0'
      }`}>
        <Navbar  />
        
        <main className="flex-1 p-6 pt-20 lg:pt-6">
          <div className="max-w-7xl mx-auto">

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-300">
              <div className="p-6 sm:p-8">
                {renderSection()}
              </div>
            </div>
          </div>
        </main>

        <footer className="border-t border-gray-100 dark:border-gray-800 mt-auto">
          <div className="max-w-7xl mx-auto py-4 px-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              © {new Date().getFullYear()} DILG Calapan. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

const getSectionDescription = (section: string) => {
  const descriptions: { [key: string]: string } = {
    dashboard: "Comprehensive overview of system health and key metrics",
    users: "Manage user accounts, roles, and access permissions",
    lgu: "Oversee local government unit partnerships and data",
    reports: "Generate detailed analytics and system reports",
    monitoring: "Real-time system performance monitoring",
    announcements: "Create and manage public communications"
  };
  return descriptions[section] || "Administrative management section";
};