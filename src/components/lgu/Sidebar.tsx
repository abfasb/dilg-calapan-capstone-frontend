import { motion, AnimatePresence } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { FiMenu, FiX, FiBarChart2, FiFileText, FiUsers, FiSettings, FiCalendar } from 'react-icons/fi';
import { Megaphone, ChevronRight } from 'lucide-react';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '../ui/tooltip';
import { cn } from '../../lib/utils';

const sidebarVariants = {
  open: { width: '17rem' },
  closed: { width: '5.5rem' }
};

export const Sidebar = ({ isOpen, onToggle, user }: { 
  isOpen: boolean; 
  onToggle: () => void;
  user: { name: string; email: string };
}) => {
  const email = localStorage.getItem("adminEmail");
  const name = localStorage.getItem("name");

  return (
    <TooltipProvider delayDuration={150}>
      <motion.nav
        initial={false}
        animate={isOpen ? 'open' : 'closed'}
        variants={sidebarVariants}
        className="fixed h-full bg-gradient-to-b from-gray-900/95 to-gray-900/90 backdrop-blur-xl border-r border-gray-800/60 z-50"
        style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.35)' }}
      >
        <div className="p-4 flex justify-between items-center h-20 border-b border-gray-800/50">
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col overflow-hidden"
              >
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  LGU Portal
                </h1>
                <p className="text-xs text-gray-400/80 mt-1 truncate tracking-wide">{email}</p>
              </motion.div>
            )}
          </AnimatePresence>
          <motion.button
            whileHover={{ scale: 1.05, rotate: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggle}
            className="text-gray-400 hover:text-cyan-400 p-1.5 rounded-xl hover:bg-gray-800/30 transition-colors"
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          >
            {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </motion.button>
        </div>

        <div className="space-y-2 mt-4 p-2.5">
          <NavItem icon={<FiBarChart2 />} text="Dashboard" to="" end isOpen={isOpen} />
          <NavItem icon={<FiFileText />} text="Reports" to="reports" isOpen={isOpen} />
          <NavItem icon={<FiUsers />} text="Staff" to="staff" isOpen={isOpen} />
          <NavItem icon={<Megaphone />} text="Announcements" to="announcements" isOpen={isOpen} />
          <NavItem icon={<FiCalendar />} text="Appointments" to="appointments" isOpen={isOpen} />
          <NavItem icon={<FiSettings />} text="Settings" to="settings" isOpen={isOpen} />
        </div>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-800/50 bg-gradient-to-t from-gray-900/50 to-transparent">
          <div className="flex items-center gap-3.5">
            <div className="relative group">
              <div className="h-11 w-11 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
                <span className="text-white font-medium text-sm">
                  {name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="absolute bottom-0 right-0 h-3 w-3 bg-emerald-400 rounded-full border-[3px] border-gray-900 shadow-sm" />
            </div>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 truncate space-y-0.5"
                >
                  <p className="text-sm font-semibold text-gray-200 truncate tracking-wide">{name}</p>
                  <p className="text-xs text-gray-400/80 truncate tracking-wide">{email}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.nav>
    </TooltipProvider>
  );
};


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
              'flex items-center p-3.5 rounded-xl transition-all group relative overflow-hidden',
              isActive 
                ? 'bg-gradient-to-r from-cyan-500/15 to-blue-500/10 text-cyan-400 border-l-4 border-cyan-400'
                : 'text-gray-400 hover:bg-gray-800/20 hover:border-l-4 hover:border-gray-700/50',
              !isOpen && 'justify-center border-l-0'
            )
          }
        >
          {({ isActive }) => (
            <>
              <motion.div 
                className="flex items-center gap-3.5"
                whileHover={{ paddingLeft: isOpen ? '1.25rem' : 0 }}
              >
                <span className="text-xl transform transition-transform group-hover:scale-110">
                  {icon}
                </span>
                <AnimatePresence>
                  {isOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-sm font-medium tracking-wide"
                    >
                      {text}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
              {!isOpen && (
                <ChevronRight className="absolute right-2.5 w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1" />
              )}
              {!isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </>
          )}
        </NavLink>
      </div>
    </TooltipTrigger>
    {!isOpen && (
      <TooltipContent 
        side="right" 
        className="bg-gray-800 border border-gray-700/50 shadow-xl text-cyan-400/90 px-3 py-1.5 text-sm font-medium rounded-lg"
      >
        {text}
        <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-800 border-l border-t border-gray-700/50 rotate-45" />
      </TooltipContent>
    )}
  </Tooltip>
);