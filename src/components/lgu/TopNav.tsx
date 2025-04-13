// Enhanced TopNav.tsx
import { FiBell, FiSearch } from "react-icons/fi";
import { motion, AnimatePresence } from 'framer-motion';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Badge } from '../ui/badge';
import { cn } from "../../lib/utils";
import { useNavigate } from "react-router-dom";

export const TopNav = ({ user }: { user: { name: string; email: string } }) => {
  const Email = localStorage.getItem("adminEmail"); 
  const name = localStorage.getItem("name");

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("name");
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("barangay");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    localStorage.removeItem("phoneNumber");
    localStorage.removeItem("position");
    localStorage.removeItem("user");
    navigate('/account/login');
  };

  return (
    <div className="flex justify-between items-center px-6 h-16 border-b border-gray-800 bg-gray-900/80 backdrop-blur-lg z-40">
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="flex items-center bg-gray-800/50 rounded-xl px-4 py-2 w-96 gap-3 border border-gray-700 hover:border-cyan-400/30 transition-all"
      >
        <FiSearch className="text-gray-500" />
        <input
          type="text"
          placeholder="Search across portal..."
          className="flex-1 bg-transparent outline-none text-gray-300 placeholder-gray-500 text-sm focus:ring-0"
        />
        <kbd className="hidden lg:inline-flex items-center px-2 py-1 text-xs font-sans text-gray-400 border border-gray-700 rounded">
          ⌘ K
        </kbd>
      </motion.div>

      <div className="flex items-center gap-6">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-gray-400 hover:text-cyan-400 relative p-2 rounded-lg hover:bg-gray-800/50"
        >
          <FiBell size={20} />
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 animate-pulse bg-red-500 hover:bg-red-400"
          >
            3
          </Badge>
        </motion.button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3 cursor-pointer p-1.5 rounded-lg hover:bg-gray-800/50"
            >
              <div className="relative">
                <div className="h-9 w-9 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 rounded-full border-2 border-gray-900" />
              </div>
              <div className="text-left hidden lg:block">
                <p className="text-sm font-medium text-gray-200">{name}</p>
                <p className="text-xs text-gray-400 truncate max-w-[160px]">{Email}</p>
              </div>
            </motion.div>
          </DropdownMenuTrigger>

          <DropdownMenuContent 
            align="end"
            className="w-48 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-2"
          >
            <DropdownMenuItem className="flex items-center gap-2 p-2 text-gray-300 hover:bg-gray-700/50 rounded-lg">
              <span>👤</span> Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2 p-2 text-gray-300 hover:bg-gray-700/50 rounded-lg">
              <span>⚙️</span> Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 p-2 text-red-400 hover:bg-red-500/10 rounded-lg">
              <span>🚪</span> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};