import { FiMenu, FiX, FiBarChart2, FiFileText, FiUsers, FiSettings, FiCalendar } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { Megaphone } from 'lucide-react';

export const Sidebar = ({ isOpen, onToggle, user }: { 
  isOpen: boolean; 
  onToggle: () => void;
  user: { name: string; email: string };
}) => (
  <motion.nav
    className={`fixed h-full bg-gradient-to-b from-gray-800 to-gray-900 border-r border-gray-700/50 shadow-2xl`}
    style={{ width: isOpen ? '16rem' : '5rem' }}
  >
    <div className="p-4 flex justify-between items-center">
      {isOpen && (
        <div className="flex flex-col">
          <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            LGU Portal
          </h1>
          <p className="text-xs text-gray-400 mt-1">{user.email}</p>
        </div>
      )}
      <button onClick={onToggle} className="text-gray-400 hover:text-cyan-400">
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>
    </div>
      <div className="space-y-2 px-4">
        <NavItem icon={<FiBarChart2 />} text="Dashboard" to="" end isOpen={isOpen} />
        <NavItem icon={<FiFileText />} text="Reports" to="reports" isOpen={isOpen} />
        <NavItem icon={<FiUsers />} text="Staff" to="staff" isOpen={isOpen} />
        <NavItem icon={<Megaphone />} text="News & Announcements" to="announcements" isOpen={isOpen} />
        <NavItem icon={<FiCalendar />} text="Appointments" to="appointments" isOpen={isOpen} />
        <NavItem icon={<FiSettings />} text="Settings" to="settings" isOpen={isOpen} />
      </div>
  </motion.nav>
);

const NavItem = ({ icon, text, to, isOpen, end }: { 
  icon: React.ReactNode; 
  text: string; 
  to: string;
  isOpen: boolean;
  end?: boolean;
}) => (
  <NavLink to={to} end={end} className={({ isActive }) => 
    `flex items-center p-3 rounded-lg transition-colors ${
      isActive ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-400 hover:bg-gray-700/30'
    }`
  }>
    <motion.div whileHover={{ scale: 1.05 }} className="flex items-center">
      <span className="text-xl">{icon}</span>
      {isOpen && <span className="ml-3">{text}</span>}
    </motion.div>
  </NavLink>
);