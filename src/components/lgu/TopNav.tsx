import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBell, FiSearch, FiX, FiSettings, FiUser, FiLogOut } from 'react-icons/fi';
import { motion } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '../ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';

type Notification = {
  id: number;
  message: string;
  time: string;
  read: boolean;
};

type UserProfile = {
  name?: string | null;
  email?: string | null;
  avatar?: string | null;
};

export const TopNav = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({});
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      message: 'New user registered.',
      time: '2m ago',
      read: false,
    },
    {
      id: 2,
      message: 'System maintenance scheduled.',
      time: '1h ago',
      read: false,
    },
    {
      id: 3,
      message: 'Password changed successfully.',
      time: 'Yesterday',
      read: true,
    },
  ]);

  useEffect(() => {
    setUserProfile({
      name: localStorage.getItem("name") || 'Anonymous',
      email: localStorage.getItem("adminEmail") || 'No email',
      avatar: localStorage.getItem("avatar") || undefined,
    });
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({
        ...n,
        read: true,
      }))
    );
  };

  const handleLogout = useCallback(() => {
    localStorage.clear();
    navigate('/account/login');
    setIsLogoutDialogOpen(false);
  }, [navigate]);

  return (
    <TooltipProvider>
      <nav className="sticky top-0 flex justify-between items-center px-6 h-16 border-b border-gray-800 bg-gray-900/95 backdrop-blur-lg z-50">
        <div className="relative flex-1 max-w-2xl mr-4">
          <motion.div initial={{ opacity: 0.9 }} whileHover={{ opacity: 1 }} className="relative group">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search across portal..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-8 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-sm text-gray-200 placeholder-gray-500 
                     focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all"
              aria-label="Global search"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                aria-label="Clear search"
              >
                <FiX className="w-4 h-4" />
              </button>
            )}
          </motion.div>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-cyan-400 relative rounded-lg hover:bg-gray-800/50">
                <FiBell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 animate-pulse bg-red-500/90 hover:bg-red-400/90 px-1.5 py-0.5"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 bg-gray-800 border border-gray-700 rounded-xl text-gray-100 shadow-xl">
              <DropdownMenuLabel className="px-4 py-2 text-base font-semibold">Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-700/50" />
              <DropdownMenuGroup className="max-h-60 overflow-y-auto">
                {notifications.length === 0 && (
                  <div className="px-4 py-6 text-center text-gray-400">No notifications</div>
                )}
                {notifications.map((notif) => (
                  <DropdownMenuItem
                    key={notif.id}
                    className={`flex flex-col items-start gap-1 px-4 py-2 cursor-default ${
                      notif.read ? 'opacity-60' : ''
                    } hover:bg-gray-700/50 rounded-lg`}
                  >
                    <span className="text-sm">{notif.message}</span>
                    <span className="text-xs text-gray-400">{notif.time}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              {notifications.length > 0 && (
                <>
                  <DropdownMenuSeparator className="bg-gray-700/50" />
                  <div className="px-4 py-2">
                    <Button
                      variant="ghost"
                      className="w-full text-sm text-cyan-400 hover:text-cyan-300 hover:bg-gray-700/50"
                      onClick={markAllAsRead}
                    >
                      Mark all as read
                    </Button>
                  </div>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="rounded-full p-1 hover:bg-gray-800/50 focus:ring-2 focus:ring-cyan-500/30">
                <div className="flex items-center gap-2.5">
                  <Avatar className="w-9 h-9 border-2 border-cyan-500/20">
                    <AvatarImage src={userProfile.avatar || undefined} />
                    <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-blue-500 font-medium text-white">
                      {userProfile.name?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-medium text-gray-200 truncate max-w-[160px]">{userProfile.name}</p>
                    <p className="text-xs text-gray-400 truncate max-w-[160px]">{userProfile.email}</p>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-gray-800 border border-gray-700 rounded-xl shadow-xl overflow-hidden">
              <DropdownMenuLabel className="px-4 py-3 bg-gray-700/20">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={userProfile.avatar || undefined} />
                    <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-blue-500">
                      {userProfile.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-gray-100">{userProfile.name}</p>
                    <p className="text-xs text-gray-400 truncate">{userProfile.email}</p>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuGroup className="p-1.5">
                <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-gray-700/50 cursor-pointer">
                  <FiUser className="w-4 h-4 text-cyan-400" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-gray-700/50 cursor-pointer">
                  <FiSettings className="w-4 h-4 text-cyan-400" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator className="bg-gray-700/50" />
              <DropdownMenuItem
                onClick={() => setIsLogoutDialogOpen(true)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 cursor-pointer"
              >
                <FiLogOut className="w-4 h-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
          <DialogContent className="bg-gray-800 border-gray-700 rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-gray-200">Confirm Logout</DialogTitle>
              <DialogDescription className="text-gray-400 mt-2">
                Are you sure you want to sign out? Any unsaved changes might be lost.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4">
              <Button
                variant="secondary"
                onClick={() => setIsLogoutDialogOpen(false)}
                className="bg-gray-700/50 hover:bg-gray-700 text-gray-200"
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleLogout} className="bg-red-500/90 hover:bg-red-400/90">
                Logout
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </nav>
    </TooltipProvider>
  );
};
