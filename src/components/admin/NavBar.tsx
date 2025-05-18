import { useState, useRef, useEffect } from "react";
import {
  FiChevronDown,
  FiBell,
  FiSearch,
  FiUser,
  FiSettings,
  FiLogOut,
  FiShield,
  FiFileText,
  FiMenu,
} from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { AlertCircle, Maximize, Minimize } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";

interface NavbarProps {
  onMenuToggle: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuToggle }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadNotifications, setUnreadNotifications] = useState(0);

    useEffect(() => {
      const fetchNotifications = async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notify/admin`);
          const data = await response.json();
          setNotifications(data);
          setUnreadNotifications(data.filter((n: any) => !n.read).length);
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      };
      
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }, []);

    const handleMarkAllAsRead = async () => {
      try {
        await fetch(`${import.meta.env.VITE_API_URL}/api/notify/mark-read`, { method: 'PUT' });
        setUnreadNotifications(0);
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      } catch (error) {
        console.error('Error marking notifications:', error);
      }
    };

  const adminEmail = localStorage.getItem("adminEmail");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminEmail");
    window.location.href = "/account/login";
  };

  const toggleFullscreen = () => {
    const doc = document as any;
    const docEl = document.documentElement as any;

    if (!isFullscreen) {
      if (docEl.requestFullscreen) {
        docEl.requestFullscreen();
      } else if (docEl.webkitRequestFullscreen) {
        docEl.webkitRequestFullscreen();
      } else if (docEl.msRequestFullscreen) {
        docEl.msRequestFullscreen();
      }
    } else {
      if (doc.exitFullscreen) {
        doc.exitFullscreen();
      } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen();
      } else if (doc.msExitFullscreen) {
        doc.msExitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="w-full bg-gray-900 text-white shadow-lg px-6 py-3 flex justify-between items-center border-b border-gray-700">
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-lg hover:bg-gray-800 transition-all duration-200"
        >
          <FiMenu className="h-6 w-6 text-gray-300" />
        </button>
      </div>

      <div className="hidden md:flex items-center bg-gray-800 rounded-lg px-4 py-2 w-96">
        <FiSearch className="h-5 w-5 text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search across platforms..."
          className="w-full bg-transparent outline-none placeholder-gray-400 text-sm"
        />
      </div>

      <div className="flex items-center space-x-6">
        {/* Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative p-2 hover:bg-gray-800 rounded-full focus:outline-none">
              <FiBell className="h-6 w-6 text-gray-300" />
              <span className="absolute top-0 right-0 bg-red-500 text-xs px-1.5 py-0.5 rounded-full">
                3
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-96" align="end">
            <DropdownMenuLabel className="flex items-center justify-between">
              Notifications
              <Button variant="link" size="sm" onClick={handleMarkAllAsRead}>
                Mark all as read
              </Button>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-96 overflow-y-auto">
              {notifications.map((notification) => (
                <DropdownMenuItem 
                  key={notification._id}
                  className="flex items-start gap-3 py-3"
                  onSelect={(e) => e.preventDefault()}
                >
                  <AlertCircle className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{notification.message}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="ml-auto h-2 w-2 rounded-full bg-blue-500" />
                  )}
                </DropdownMenuItem>
              ))}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-primary">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-full hover:bg-gray-800 transition-all duration-200"
        >
          {isFullscreen ? (
            <Minimize className="h-6 w-6 text-gray-300" />
          ) : (
            <Maximize className="h-6 w-6 text-gray-300" />
          )}
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-all duration-200"
          >
            <FaUserCircle className="h-7 w-7 text-blue-400" />
            <div className="text-left">
              <p className="text-sm font-medium">Super Admin</p>
              <p className="text-xs text-gray-400">{adminEmail}</p>
            </div>
            <FiChevronDown
              className={`h-4 w-4 transition-transform ${isDropdownOpen ? "transform rotate-180" : ""}`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute z-50 right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl">
              <div className="px-4 py-3 border-b border-gray-700">
                <p className="text-sm font-medium">DILG Calapan City</p>
                <p className="text-xs text-gray-400 mt-1">Super Administrator</p>
              </div>

              <div className="py-1">
                <a href="#" className="flex items-center px-4 py-2.5 text-sm hover:bg-gray-700">
                  <FiUser className="h-5 w-5 mr-3 text-blue-400" />
                  User Profile
                </a>
                <a href="#" className="flex items-center px-4 py-2.5 text-sm hover:bg-gray-700">
                  <FiSettings className="h-5 w-5 mr-3 text-blue-400" />
                  System Settings
                </a>
                <a href="#" className="flex items-center px-4 py-2.5 text-sm hover:bg-gray-700">
                  <FiShield className="h-5 w-5 mr-3 text-blue-400" />
                  Manage Permissions
                </a>
                <a href="#" className="flex items-center px-4 py-2.5 text-sm hover:bg-gray-700">
                  <FiFileText className="h-5 w-5 mr-3 text-blue-400" />
                  Audit Logs
                </a>
              </div>

              <div className="py-1 border-t border-gray-700">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2.5 text-sm text-red-400 hover:bg-gray-700"
                >
                  <FiLogOut className="h-5 w-5 mr-3" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
