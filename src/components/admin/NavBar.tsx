import { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiBell, FiSearch, FiUser, FiSettings, FiLogOut, FiShield, FiFileText, FiMenu } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";

interface NavbarProps {
  onMenuToggle: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuToggle }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const adminEmail = localStorage.getItem('adminEmail');

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminEmail");
  
    window.location.href = "/account/login";
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
        <button className="relative p-2 hover:bg-gray-800 rounded-full">
          <FiBell className="h-6 w-6 text-gray-300" />
          <span className="absolute top-0 right-0 bg-red-500 text-xs px-1.5 py-0.5 rounded-full">3</span>
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
            <FiChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'transform rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl">
              <div className="px-4 py-3 border-b border-gray-700">
                <p className="text-sm font-medium">Juan Dela Cruz</p>
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
                <button onClick={handleLogout} className="flex items-center w-full px-4 py-2.5 text-sm text-red-400 hover:bg-gray-700">
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
