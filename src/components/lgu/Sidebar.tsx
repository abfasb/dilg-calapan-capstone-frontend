import { motion, AnimatePresence } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { FiMenu, FiX, FiBarChart2, FiFileText, FiUsers, FiSettings, FiCalendar } from 'react-icons/fi';
import { Megaphone, ChevronRight } from 'lucide-react';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '../ui/tooltip';
import { cn } from '../../lib/utils';

const sidebarVariants = {
  open: { width: '16rem' },
  closed: { width: '5rem' }
};

const Email = localStorage.getItem("adminEmail"); 
const name = localStorage.getItem("name");

export const Sidebar = ({ isOpen, onToggle, user }: { 
  isOpen: boolean; 
  onToggle: () => void;
  user: { name: string; email: string };
}) => (
  <TooltipProvider delayDuration={100}>
    <motion.nav
      initial={false}
      animate={isOpen ? 'open' : 'closed'}
      variants={sidebarVariants}
      className="fixed h-full bg-gray-900/80 backdrop-blur-lg border-r border-gray-800 shadow-2xl z-50"
      style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}
    >
      <div className="p-4 flex justify-between items-center h-16 border-b border-gray-800">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col overflow-hidden"
            >
              <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                LGU Portal
              </h1>
              <p className="text-xs text-gray-400 mt-1 truncate">{Email}</p>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggle}
          className="text-gray-400 hover:text-cyan-400 p-1.5 rounded-lg hover:bg-gray-800/50"
        >
          {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </motion.button>
      </div>

      <div className="space-y-3 mt-4 p-2 ">
          <NavItem 
        icon={<FiBarChart2 />}  
        text="Dashboard" 
        to="" 
        end    
        isOpen={isOpen} 
      />
        <NavItem icon={<FiFileText />} text="Reports" to="reports" isOpen={isOpen} />
        <NavItem icon={<FiUsers />} text="Staff" to="staff" isOpen={isOpen} />
        <NavItem icon={<Megaphone />} text="Announcements" to="announcements" isOpen={isOpen} />
        <NavItem icon={<FiCalendar />} text="Appointments" to="appointments" isOpen={isOpen} />
        <NavItem icon={<FiSettings />} text="Settings" to="settings" isOpen={isOpen} />
      </div>

      <div className="absolute bottom-0 w-full p-4 border-t border-gray-800">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {name.charAt(0).toUpperCase() || 'lgu'}
              </span>
            </div>
            <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 rounded-full border-2 border-gray-900" />
          </div>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="flex-1 truncate"
              >
                <p className="text-sm font-medium text-gray-200 truncate">{name}</p>
                <p className="text-xs text-gray-400 truncate">{Email}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.nav>
  </TooltipProvider>
);

const NavItem = ({ icon, text, to, isOpen, end }: { 
  icon: React.ReactNode; 
  text: string; 
  to: string;
  isOpen: boolean;
  end?: boolean;
}) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <div>
        <NavLink 
          to={to} 
          end={end} 
          className={({ isActive }) => 
            cn(
              'flex items-center p-3 rounded-lg transition-all group',
              isActive 
                ? 'bg-cyan-500/10 text-cyan-400 border-l-4 border-cyan-400'
                : 'text-gray-400 hover:bg-gray-800/30 hover:border-l-4 hover:border-gray-700',
              !isOpen && 'justify-center border-l-0'
            )
          }
        >
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ paddingLeft: isOpen ? '1rem' : 0 }}
          >
            <span className="text-xl">{icon}</span>
            <AnimatePresence>
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-sm font-medium"
                >
                  {text}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
          {!isOpen && (
            <ChevronRight className="absolute right-2 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </NavLink>
      </div>
    </TooltipTrigger>
    {!isOpen && (
      <TooltipContent side="right" className="bg-gray-800 border border-gray-700 text-cyan-400">
        {text}
      </TooltipContent>
    )}
  </Tooltip>
);