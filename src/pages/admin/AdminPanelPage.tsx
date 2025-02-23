import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../../components/admin/Sidebar";
import Dashboard from "../../components/admin/Dashboard";
import { Navbar } from "../../components/admin/NavBar";


//for the sub-menu
import RBACManagement from "../../components/admin/access-control/RBACManagement";
import SessionPolicies from "../../components/admin/access-control/SessionPolicies";
import AuditLogs from "../../components/admin/access-control/AuditLogs";
import CitizenRegistration from "../../components/admin/citizen-management/CitizenRegistration";
import StaffOnboarding from "../../components/admin/citizen-management/StaffOnboarding";
import ReportOversight from "../../components/admin/citizen-management/ReportOversight";
import VerificationSystem from "../../components/admin/citizen-management/VerificationSystem";
import AddReports from "../../components/admin/analytics/AddReports";
import CustomReports from "../../components/admin/analytics/CustomReports";
import ResolutionAnalytics from "../../components/admin/analytics/ResolutionAnalytics";
import AISummaryReports from "../../components/admin/analytics/AISummaryReports";
import WorkflowAutomation from "../../components/admin/system-health/WorkflowAutomation";
import PerformanceMetrics from "../../components/admin/system-health/PerformanceMetrics";
import BackupManagement from "../../components/admin/system-health/BackupManagement";
import SystemAnnouncements from "../../components/admin/communications/SystemAnnouncements";
import PublicNotices from "../../components/admin/communications/PublicNotices";
import AlertHistory from "../../components/admin/communications/AlertHistory";


export default function AdminPanelPage() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token"); 
    if (!token) {
      navigate("/account/login"); 
    }
  }, [navigate]);

  const renderSection = () => {
    switch (activeSection) {

      //main section if i ever use it
      case "dashboard": return <Dashboard />;

      // my sub-section
      case "rbac": return <RBACManagement />;
      case "session": return <SessionPolicies />;
      case "audit": return <AuditLogs />;
      case "citizen-reg": return <CitizenRegistration />;
      case "staff-onboard": return <StaffOnboarding />;
      case "report-oversight": return <ReportOversight />;
      case "verification": return <VerificationSystem />;
      case "add-reports": return <AddReports />;
      case "custom-reports": return <CustomReports />;
      case "resolution": return <ResolutionAnalytics />;
      case "ai-reports": return <AISummaryReports />;
      case "workflow": return <WorkflowAutomation />;
      case "performance": return <PerformanceMetrics />;
      case "backups": return <BackupManagement />;
      case "sys-announce": return <SystemAnnouncements />;
      case "notices": return <PublicNotices />;
      case "alert-history": return <AlertHistory />;

      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        isOpen={isSidebarOpen}
        onToggle={setIsSidebarOpen}
      />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        isSidebarOpen ? 'lg:ml-64' : 'ml-0'
      }`}>
        <Navbar onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        
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