import React, { useState } from 'react';
import { 
  FiHome, FiUsers, FiMap, FiBarChart, FiMonitor, FiBell, 
  FiChevronDown, FiChevronUp, FiShield, FiUserCheck, 
  FiFileText, FiSettings, FiDatabase, FiAlertCircle 
} from 'react-icons/fi';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

interface MenuItem {
  text: string;
  section?: string;
  icon: JSX.Element;
  subItems?: SubItem[];
}

interface SubItem {
  text: string;
  section: string;
}

export const Sidebar = ({ activeSection, setActiveSection }: SidebarProps) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const menuItems: MenuItem[] = [
    { 
      text: "Dashboard", 
      section: "dashboard", 
      icon: <FiHome className="text-lg" />
    },
    { 
      text: "User & Access Control",
      icon: <FiShield className="text-lg" />,
      subItems: [
        { text: "MFA Configuration", section: "mfa" },
        { text: "RBAC Management", section: "rbac" },
        { text: "Session Policies", section: "session" },
        { text: "Audit Logs", section: "audit" }
      ]
    },
    { 
      text: "LGU & Citizen",
      icon: <FiUserCheck className="text-lg" />,
      subItems: [
        { text: "Citizen Registration", section: "citizen-reg" },
        { text: "Staff Onboarding", section: "staff-onboard" },
        { text: "Report Oversight", section: "report-oversight" },
        { text: "Verification System", section: "verification" }
      ]
    },
    { 
      text: "Reports & Analytics",
      icon: <FiBarChart className="text-lg" />,
      subItems: [
        { text: "Add New Reports", section: "add-reports" },
        { text: "Custom Reports", section: "custom-reports" },
        { text: "Resolution Analytics", section: "resolution" },
        { text: "AI Summary Reports", section: "ai-reports" }
      ]
    },
    { 
      text: "System Monitoring",
      icon: <FiMonitor className="text-lg" />,
      subItems: [
        { text: "Workflow Automation", section: "workflow" },
        { text: "Performance Metrics", section: "performance" },
        { text: "Backup Management", section: "backups" },
      ]
    },
    { 
      text: "Announcements & Alerts",
      icon: <FiBell className="text-lg" />,
      subItems: [
        { text: "System Announcements", section: "sys-announce" },
        { text: "Public Notices", section: "notices" },
        { text: "Alert History", section: "alert-history" }
      ]
    },
  ];

  const toggleDropdown = (text: string) => {
    setOpenDropdown(openDropdown === text ? null : text);
  };

  return (
    <div className="w-64 h-full bg-gray-900 text-white p-4 flex flex-col fixed border-r border-gray-700">
      <div className="mb-8 px-2">
        <h2 className="text-xl font-bold flex items-center gap-3">
        <img src="https://i.ibb.co/QFh5dS8r/images-1.png" alt="Logo" className="w-8 h-8 rounded-full" />
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            DILG Admin
          </span>
        </h2>
        <p className="text-xs text-gray-400 mt-2">
          System Control & Operational Management
        </p>
      </div>

      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => (
          <div key={item.text}>
            <button
              onClick={() => item.subItems ? toggleDropdown(item.text) : setActiveSection(item.section!)}
              className={`w-full flex items-center justify-between px-3 py-3 rounded-lg transition-all
                ${item.subItems && openDropdown === item.text ? 'bg-gray-800/50' : ''}
                ${activeSection === item.section ? 'bg-blue-600/90 text-white' : 'hover:bg-gray-800/50 text-gray-300'}`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="text-sm font-medium">{item.text}</span>
              </div>
              {item.subItems && (
                openDropdown === item.text ? <FiChevronUp /> : <FiChevronDown />
              )}
            </button>

            {item.subItems && openDropdown === item.text && (
              <div className="ml-8 mt-1 space-y-1">
                {item.subItems.map((subItem) => (
                  <button
                    key={subItem.section}
                    onClick={() => setActiveSection(subItem.section)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all
                      ${activeSection === subItem.section 
                        ? 'bg-blue-600/90 text-white' 
                        : 'hover:bg-gray-800/30 text-gray-300'}`}
                  >
                    <span className="text-xs">{subItem.text}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="mt-auto p-3 bg-gray-800/30 rounded-lg border border-gray-700">
        <div className="flex items-center gap-2 text-green-400">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs font-medium">Operational</span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-400">v2.1.0</span>
          <FiDatabase className="text-gray-400 text-sm" />
        </div>
      </div>
    </div>
  );
};