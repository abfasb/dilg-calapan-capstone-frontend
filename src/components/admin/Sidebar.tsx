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
        { text: "Performance", path: "system-health/performance", icon: <FiBarChart /> },
        { text: "Service Management", path: "system-health/backups", icon: <FiDatabase /> }
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
    <div className={`w-72 h-full bg-gray-950 text-white flex flex-col fixed border-r border-gray-800/50 shadow-2xl transition-all duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="p-6 pb-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="p-1.5  rounded-lg shadow-lg">
            <img 
              src="https://i.ibb.co/QFh5dS8r/images-1.png" 
              alt="Logo" 
              className="w-8 h-8 rounded-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-300 bg-clip-text text-transparent">
              DILG Portal
            </h2>
            <p className="text-xs font-medium text-gray-400 mt-0.5 tracking-wide">
              Calapan City Division
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-gray-900">
        {menuItems.map((item) => (
          <div key={item.text} className="space-y-1.5">
            {item.subItems ? (
              <div>
                <button
                  onClick={() => toggleDropdown(item.text)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all
                    ${openDropdown === item.text ? 'bg-gray-800/40 backdrop-blur-sm' : ''}
                    ${isSubItemActive(item) 
                      ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-l-2 border-blue-400/80 shadow-md' 
                      : 'hover:bg-gray-800/30 hover:border-l-2 hover:border-gray-600/50'}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-lg p-1.5 rounded-md ${isSubItemActive(item) ? 'text-blue-400 bg-blue-500/20' : 'text-gray-300 bg-gray-800/50'}`}>
                      {item.icon}
                    </span>
                    <span className="text-sm font-medium tracking-wide">{item.text}</span>
                  </div>
                  {item.subItems && (
                    openDropdown === item.text ? 
                    <FiChevronUp className="w-4 h-4 text-gray-400 transform transition-transform duration-200" /> : 
                    <FiChevronDown className="w-4 h-4 text-gray-400 transform transition-transform duration-200" />
                  )}
                </button>

                {item.subItems && openDropdown === item.text && (
                  <div className="ml-8 mt-1 space-y-1.5 animate-slideDown">
                    {item.subItems.map((subItem) => (
                      <NavLink
                        key={subItem.path}
                        to={`/account/admin/${adminId}/${subItem.path}`}
                        className={({ isActive }) => 
                          `group flex items-center gap-2 px-3 py-2.5 rounded-lg transition-all
                          ${isActive 
                            ? 'bg-blue-500/20 text-blue-300 border-l-2 border-blue-400 shadow-sm' 
                            : 'hover:bg-gray-800/40 text-gray-300'}`
                        }
                      >
                        {subItem.icon && (
                          <span className="text-base p-1 rounded-md bg-gray-800/50 group-hover:bg-blue-500/20 transition-colors">
                            {subItem.icon}
                          </span>
                        )}
                        <span className="text-xs font-medium tracking-wide">{subItem.text}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                to={`/account/admin/${adminId}/${item.path}`}
                className={({ isActive }) => 
                  `w-full flex items-center px-4 py-3 rounded-xl transition-all
                  ${isActive 
                    ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-l-2 border-blue-400/80 shadow-md' 
                    : 'hover:bg-gray-800/30 hover:border-l-2 hover:border-gray-600/50'}`
                }
              >
                <div className="flex items-center gap-3">
                  <span className={`text-lg p-1.5 rounded-md ${location.pathname.includes(item.path!) ? 'text-blue-400 bg-blue-500/20' : 'text-gray-300 bg-gray-800/50'}`}>
                    {item.icon}
                  </span>
                  <span className="text-sm font-medium tracking-wide">{item.text}</span>
                </div>
              </NavLink>
            )}
          </div>
        ))}
      </nav>

      {/* System Status */}
      <div className="p-4 border-t border-gray-800">
        <div className="p-3 bg-gradient-to-br from-gray-800/50 to-gray-900/30 rounded-xl backdrop-blur-sm border border-gray-800 shadow-lg">
          <div className="flex items-center gap-2.5 text-green-400 mb-2">
            <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs font-semibold tracking-wide">All Systems Operational</span>
          </div>
          <div className="flex justify-between items-center text-gray-400">
            <span className="text-xs font-medium tracking-wide">v2.1.0</span>
            <div className="flex items-center gap-1.5">
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};