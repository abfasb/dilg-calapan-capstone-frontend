import React from 'react';
import { 
  FiHome, FiShield, FiUser, FiBarChart, FiMonitor, FiBell,
  FiChevronDown, FiChevronUp, FiSettings, FiDatabase,
  FiLock, FiUsers, FiFileText, FiActivity, FiAlertCircle 
} from 'react-icons/fi';
import { NavLink, useLocation } from 'react-router-dom';

interface SidebarProps {
  adminId: string;
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
}

interface MenuItem {
  text: string;
  path?: string;
  icon: JSX.Element;
  subItems?: SubItem[];
}

interface SubItem {
  text: string;
  path: string;
  icon?: JSX.Element;
}

export const Sidebar = ({ 
  adminId,
  isOpen,
  onToggle 
}: SidebarProps) => {
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);

  const menuItems: MenuItem[] = [
    { 
      text: "Dashboard", 
      path: "dashboard", 
      icon: <FiHome className="w-5 h-5" />
    },
    { 
      text: "Access Control",
      icon: <FiShield className="w-5 h-5" />,
      subItems: [
        { text: "RBAC Management", path: "access-control/rbac", icon: <FiLock /> },
        { text: "Session Policies", path: "access-control/session-policies", icon: <FiActivity /> },
        { text: "Audit Logs", path: "access-control/audit-logs", icon: <FiFileText /> }
      ]
    },
    { 
      text: "Citizen Management",
      icon: <FiUser className="w-5 h-5" />,
      subItems: [
        { text: "Registration", path: "citizen-management/registration", icon: <FiUser /> },
        { text: "Staff Onboarding", path: "citizen-management/staff-onboarding", icon: <FiUsers /> },
        { text: "Report Oversight", path: "citizen-management/report-oversight", icon: <FiAlertCircle /> },
        { text: "Verification", path: "citizen-management/verification", icon: <FiShield /> }
      ]
    },
    { 
      text: "Analytics",
      icon: <FiBarChart className="w-5 h-5" />,
      subItems: [
        { text: "Create Reports", path: "analytics/add-reports", icon: <FiFileText /> },
        { text: "Manage Reports", path: "analytics/custom-reports", icon: <FiSettings /> },
        { text: "Resolution Analytics", path: "analytics/resolution", icon: <FiActivity /> },
        { text: "AI Reports", path: "analytics/ai-reports", icon: <FiDatabase /> }
      ]
    },
    { 
      text: "System Health",
      icon: <FiMonitor className="w-5 h-5" />,
      subItems: [
        { text: "Workflows", path: "system-health/workflows", icon: <FiActivity /> },
        { text: "Performance", path: "system-health/performance", icon: <FiBarChart /> },
        { text: "Backups", path: "system-health/backups", icon: <FiDatabase /> }
      ]
    },
    { 
      text: "Communications",
      icon: <FiBell className="w-5 h-5" />,
      subItems: [
        { text: "Announcements", path: "communications/announcements", icon: <FiBell /> },
        { text: "Public Notices", path: "communications/public-notices", icon: <FiAlertCircle /> },
        { text: "Alert History", path: "communications/alert-history", icon: <FiFileText /> }
      ]
    },
  ];

  const isSubItemActive = (item: MenuItem) => {
    return item.subItems?.some(sub => 
      location.pathname.includes(sub.path)
    ) || false;
  };

  const toggleDropdown = (text: string) => {
    setOpenDropdown(openDropdown === text ? null : text);
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
            {item.subItems ? (
              <div>
                <button
                  onClick={() => toggleDropdown(item.text)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all
                    ${openDropdown === item.text ? 'bg-gray-800/30' : ''}
                    ${isSubItemActive(item) 
                      ? 'bg-blue-600/20 border border-blue-500/30 text-blue-400' 
                      : 'hover:bg-gray-800/20 text-gray-300'}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`${isSubItemActive(item) ? 'text-blue-400' : 'text-gray-400'}`}>
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
                      <NavLink
                        key={subItem.path}
                        to={`/account/admin/${adminId}/${subItem.path}`}
                        className={({ isActive }) => 
                          `w-full flex items-center gap-2 px-3 py-2 rounded-lg 
                          ${isActive 
                            ? 'bg-blue-600/20 border border-blue-500/30 text-blue-400' 
                            : 'hover:bg-gray-800/20 text-gray-300'}`
                        }
                      >
                        {subItem.icon && (
                          <span className="w-4 h-4">
                            {subItem.icon}
                          </span>
                        )}
                        <span className="text-xs font-medium">{subItem.text}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                to={`/account/admin/${adminId}/${item.path}`}
                className={({ isActive }) => 
                  `w-full flex items-center px-3 py-2.5 rounded-lg transition-all
                  ${isActive 
                    ? 'bg-blue-600/20 border border-blue-500/30 text-blue-400' 
                    : 'hover:bg-gray-800/20 text-gray-300'}`
                }
              >
                <div className="flex items-center gap-3">
                  <span className={`${location.pathname.includes(item.path!) ? 'text-blue-400' : 'text-gray-400'}`}>
                    {item.icon}
                  </span>
                  <span className="text-sm font-medium">{item.text}</span>
                </div>
              </NavLink>
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