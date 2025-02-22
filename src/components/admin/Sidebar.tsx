import React, { useState, useEffect } from 'react';
import { 
  FiHome, FiShield, FiUser, FiBarChart, FiMonitor, FiBell,
  FiChevronDown, FiChevronUp, FiSettings, FiDatabase,
  FiLock, FiUsers, FiFileText, FiActivity, FiAlertCircle 
} from 'react-icons/fi';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
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
  icon?: JSX.Element;
}

export const Sidebar = ({ 
  activeSection, 
  setActiveSection,
  isOpen,
  onToggle 
}: SidebarProps) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const menuItems: MenuItem[] = [
    { 
      text: "Dashboard", 
      section: "dashboard", 
      icon: <FiHome className="w-5 h-5" />
    },
    { 
      text: "Access Control",
      icon: <FiShield className="w-5 h-5" />,
      subItems: [
        { text: "RBAC Management", section: "rbac", icon: <FiLock /> },
        { text: "Session Policies", section: "session", icon: <FiActivity /> },
        { text: "Audit Logs", section: "audit", icon: <FiFileText /> }
      ]
    },
    { 
      text: "Citizen Management",
      icon: <FiUser className="w-5 h-5" />,
      subItems: [
        { text: "Registration", section: "citizen-reg", icon: <FiUser /> },
        { text: "Staff Onboarding", section: "staff-onboard", icon: <FiUsers /> },
        { text: "Report Oversight", section: "report-oversight", icon: <FiAlertCircle /> },
        { text: "Verification", section: "verification", icon: <FiShield /> }
      ]
    },
    { 
      text: "Analytics",
      icon: <FiBarChart className="w-5 h-5" />,
      subItems: [
        { text: "Create Reports", section: "add-reports", icon: <FiFileText /> },
        { text: "Custom Reports", section: "custom-reports", icon: <FiSettings /> },
        { text: "Resolution Analytics", section: "resolution", icon: <FiActivity /> },
        { text: "AI Reports", section: "ai-reports", icon: <FiDatabase /> }
      ]
    },
    { 
      text: "System Health",
      icon: <FiMonitor className="w-5 h-5" />,
      subItems: [
        { text: "Workflows", section: "workflow", icon: <FiActivity /> },
        { text: "Performance", section: "performance", icon: <FiBarChart /> },
        { text: "Backups", section: "backups", icon: <FiDatabase /> }
      ]
    },
    { 
      text: "Communications",
      icon: <FiBell className="w-5 h-5" />,
      subItems: [
        { text: "Announcements", section: "sys-announce", icon: <FiBell /> },
        { text: "Public Notices", section: "notices", icon: <FiAlertCircle /> },
        { text: "Alert History", section: "alert-history", icon: <FiFileText /> }
      ]
    },
  ];

  const toggleDropdown = (text: string) => {
    setOpenDropdown(openDropdown === text ? null : text);
  };

  const isSubItemActive = (item: MenuItem) => {
    return item.subItems?.some(sub => sub.section === activeSection) || false;
  };

  const handleSubItemClick = (section: string, e: React.MouseEvent<HTMLButtonElement>) => {
    setActiveSection(section);
    e.currentTarget.blur(); 
  };
  

  return (
    <div className={`w-64 h-full bg-gray-900 text-white flex flex-col fixed border-r border-gray-700 transition-all duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center gap-3 px-2">
          <img 
            src="https://i.ibb.co/QFh5dS8r/images-1.png" 
            alt="Logo" 
            className="w-9 h-9 rounded-full object-cover"
          />
          <div>
            <h2 className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              DILG Admin
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Calapan City
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <div key={item.text} className="space-y-1">
            <button
              onClick={() => item.subItems ? toggleDropdown(item.text) : setActiveSection(item.section!)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all
                ${item.subItems && openDropdown === item.text ? 'bg-gray-800/30' : ''}
                ${(activeSection === item.section || isSubItemActive(item)) 
                  ? 'bg-blue-600/20 border border-blue-500/30 text-blue-400' 
                  : 'hover:bg-gray-800/20 text-gray-300'}`}
            >
              <div className="flex items-center gap-3">
                <span className={`${(activeSection === item.section || isSubItemActive(item)) ? 'text-blue-400' : 'text-gray-400'}`}>
                  {item.icon}
                </span>
                <span className="text-sm font-medium">{item.text}</span>
              </div>
              {item.subItems && (
                openDropdown === item.text ? 
                <FiChevronUp className="w-4 h-4 text-gray-400" /> : 
                <FiChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>

            {item.subItems && openDropdown === item.text && (
              <div className="ml-8 space-y-1">
                {item.subItems.map((subItem) => (
                 <button
                  key={subItem.section}
                  onClick={() => handleSubItemClick(subItem.section)}
               
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg 
                      ${activeSection === subItem.section 
                        ? 'bg-blue-600/20 border border-blue-500/30 text-blue-400 transition-none' 
                        : 'hover:bg-gray-800/20 text-gray-300'}`}                    
                  >
                    {subItem.icon && (
                      <span className={`w-4 h-4 ${activeSection === subItem.section ? 'text-blue-400' : 'text-gray-400'}`}>
                        {subItem.icon}
                      </span>
                    )}
                    <span className="text-xs font-medium">{subItem.text}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <div className="p-3 bg-gray-800/20 rounded-lg space-y-2">
          <div className="flex items-center gap-2 text-green-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs font-medium">All Systems Operational</span>
          </div>
          <div className="flex justify-between items-center text-gray-400">
            <span className="text-xs">v2.1.0</span>
            <div className="flex items-center gap-1">
              <FiDatabase className="w-4 h-4" />
              <span className="text-xs">98% Storage</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};