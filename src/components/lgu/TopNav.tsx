import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiBell, 
  FiSearch, 
  FiX, 
  FiSettings, 
  FiUser, 
  FiLogOut, 
  FiMaximize, 
  FiMinimize, 
  FiCheck,
  FiCheckCircle,
  FiAlertTriangle,
  FiInfo,
  FiTrash2,
  FiMoreVertical
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
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
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';

type NotificationType = 'submission' | 'appointment';

interface INotification {
  _id: string;
  userId: string;
  type: NotificationType;
  referenceId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export const TopNav = ({user} : any) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const currentUserId = localStorage.getItem('userId') || '';
  const userProfile = {
    name: localStorage.getItem('name') || 'Anonymous User',
    email: localStorage.getItem('adminEmail') || 'user@example.com',
    avatar: localStorage.getItem('avatar') || undefined,
    role: localStorage.getItem('userRole') || 'LGU',
  };


  console.log(user);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/lgu-notification/`);
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
    
    setIsFullscreen(!!document.fullscreenElement);
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [currentUserId]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Fullscreen toggle failed:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = async (id: string) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/api/lgu-notification/${id}/read`);
      setNotifications(prev => 
        prev.map(n => n._id === id ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/api/lgu-notification/${currentUserId}/read-all`);
      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true }))
      );
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/lgu-notification/${id}`);
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleClearAllNotifications = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/lgu-notification/${currentUserId}/clear-all`);
      setNotifications([]);
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'submission':
        return <FiCheckCircle className="w-4 h-4 text-green-400" />;
      case 'appointment':
        return <FiInfo className="w-4 h-4 text-blue-400" />;
      default:
        return <FiInfo className="w-4 h-4 text-blue-400" />;
    }
  };

  const getNotificationBorderColor = (type: NotificationType) => {
    switch (type) {
      case 'submission':
        return 'border-l-green-400';
      case 'appointment':
        return 'border-l-blue-400';
      default:
        return 'border-l-blue-400';
    }
  };

  const handleLogout = useCallback(() => {
    localStorage.clear();
    navigate('/account/login');
  }, [navigate]);

  return (
    <TooltipProvider>
      <nav className="sticky top-0 flex justify-between items-center px-6 h-16 border-b border-gray-800 bg-gray-900/95 backdrop-blur-lg z-50">
        {/* Search Section */}
        <div className="relative flex-1 max-w-2xl mr-6">
          <motion.div 
            initial={{ opacity: 0.9 }} 
            whileHover={{ opacity: 1 }} 
            className="relative group"
          >
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-cyan-400 transition-colors" />
            <input
              type="text"
              placeholder="Search users, settings, reports..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-10 py-2.5 bg-gray-800/60 border border-gray-700/80 rounded-xl text-sm text-gray-200 placeholder-gray-500 
                     focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/60 focus:bg-gray-800 transition-all duration-200
                     hover:border-gray-600 hover:bg-gray-800/80"
              aria-label="Global search"
            />
            <AnimatePresence>
              {searchQuery && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 hover:bg-gray-700 p-1 rounded transition-all"
                  aria-label="Clear search"
                >
                  <FiX className="w-3 h-3" />
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Fullscreen Toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleFullscreen}
                className="text-gray-400 hover:text-cyan-400 hover:bg-gray-800/60 rounded-lg transition-all duration-200"
              >
                {isFullscreen ? (
                  <FiMinimize className="w-4 h-4" />
                ) : (
                  <FiMaximize className="w-4 h-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            </TooltipContent>
          </Tooltip>

          {/* Enhanced Notifications Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-400 hover:text-cyan-400 relative rounded-lg hover:bg-gray-800/60 transition-all duration-200"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiBell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 animate-pulse bg-red-500 hover:bg-red-400 px-1.5 py-0.5 text-xs min-w-[18px] h-[18px] flex items-center justify-center"
                    >
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </Badge>
                  )}
                </motion.div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="w-96 bg-gray-800/95 backdrop-blur-lg border border-gray-700/80 rounded-xl text-gray-100 shadow-2xl"
              align="end"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700/50">
                <DropdownMenuLabel className="text-base font-semibold text-gray-100">
                  Notifications
                </DropdownMenuLabel>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400 text-xs">
                      {unreadCount} new
                    </Badge>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-gray-200">
                        <FiMoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-gray-800 border border-gray-700">
                      <DropdownMenuItem 
                        onClick={handleMarkAllAsRead} 
                        className="text-gray-300 hover:bg-gray-700"
                      >
                        <FiCheckCircle className="w-4 h-4 mr-2" />
                        Mark all as read
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={handleClearAllNotifications} 
                        className="text-red-400 hover:bg-red-500/10"
                      >
                        <FiTrash2 className="w-4 h-4 mr-2" />
                        Clear all
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {isLoading ? (
                  <div className="px-4 py-8 text-center text-gray-400">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto"></div>
                    <p className="mt-2">Loading notifications...</p>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-gray-400">
                    <FiBell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No notifications</p>
                  </div>
                ) : (
                  notifications.map(notif => (
                    <motion.div
                      key={notif._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`group relative border-l-2 ${getNotificationBorderColor(notif.type)} ${
                        !notif.read ? 'bg-gray-700/30' : 'bg-transparent'
                      } hover:bg-gray-700/40 transition-all duration-200`}
                    >
                      <div className="flex items-start gap-3 px-4 py-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getNotificationIcon(notif.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p className={`text-sm font-medium ${!notif.read ? 'text-gray-100' : 'text-gray-300'}`}>
                                {notif.title}
                              </p>
                              <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                                {notif.message}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-gray-500">
                                  {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                                </span>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="h-6 text-xs text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                                  onClick={() => navigate(
                                    notif.type === 'submission' 
                                      ? `/submissions/${notif.referenceId}` 
                                      : `/appointments/${notif.referenceId}`
                                  )}
                                >
                                  View
                                </Button>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {!notif.read && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleMarkAsRead(notif._id)}
                                      className="h-6 w-6 text-gray-400 hover:text-green-400"
                                    >
                                      <FiCheck className="w-3 h-3" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Mark as read</TooltipContent>
                                </Tooltip>
                              )}
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDeleteNotification(notif._id)}
                                    className="h-6 w-6 text-gray-400 hover:text-red-400"
                                  >
                                    <FiX className="w-3 h-3" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Delete</TooltipContent>
                              </Tooltip>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {notifications.length > 0 && (
                <div className="border-t border-gray-700/50 p-3">
                  <Button 
                    variant="ghost" 
                    className="w-full text-sm text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-all"
                    onClick={() => navigate('/notifications')}
                  >
                    View all notifications
                  </Button>
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Enhanced User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="rounded-full p-1 hover:bg-gray-800/60 focus:ring-2 focus:ring-cyan-500/40 transition-all duration-200"
              >
                <motion.div 
                  className="flex items-center gap-3"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Avatar className="w-9 h-9 border-2 border-cyan-500/30 ring-2 ring-transparent hover:ring-cyan-500/20 transition-all">
                    <AvatarImage src={userProfile.avatar || undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 font-medium text-white text-sm">
                      {userProfile.name?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-medium text-gray-200 truncate max-w-[140px]">
                      {userProfile.name}
                    </p>
                    <p className="text-xs text-gray-400 truncate max-w-[140px]">
                      {userProfile.role}
                    </p>
                  </div>
                </motion.div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-72 bg-gray-800/95 backdrop-blur-lg border border-gray-700/80 rounded-xl shadow-2xl overflow-hidden"
            >
              <DropdownMenuLabel className="px-4 py-4 bg-gradient-to-r from-gray-700/30 to-gray-600/20 border-b border-gray-700/50">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12 ring-2 ring-cyan-500/30">
                    <AvatarImage src={userProfile.avatar || undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-semibold">
                      {userProfile.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-100">{userProfile.name}</p>
                    <p className="text-xs text-cyan-400 font-medium">{userProfile.role}</p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{userProfile.email}</p>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuGroup className="p-2">
                <DropdownMenuItem 
                  onClick={() => navigate('/profile')}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-300 hover:bg-gray-700/50 cursor-pointer transition-all group"
                >
                  <FiUser className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300" />
                  <div className="flex-1">
                    <span className="text-sm font-medium">My Profile</span>
                    <p className="text-xs text-gray-500">Manage your account</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => navigate('/settings')}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-300 hover:bg-gray-700/50 cursor-pointer transition-all group"
                >
                  <FiSettings className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300" />
                  <div className="flex-1">
                    <span className="text-sm font-medium">Settings</span>
                    <p className="text-xs text-gray-500">Preferences & privacy</p>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator className="bg-gray-700/50 mx-2" />
              <div className="p-2">
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-red-400 hover:bg-red-500/10 cursor-pointer transition-all group"
                >
                  <FiLogOut className="w-4 h-4 group-hover:text-red-300" />
                  <span className="text-sm font-medium group-hover:text-red-300">Sign Out</span>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Enhanced Logout Dialog */}
        <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
          <DialogContent className="bg-gray-800/95 backdrop-blur-lg border border-gray-700/80 rounded-2xl max-w-md">
            <DialogHeader className="text-center">
              <DialogTitle className="text-gray-200 text-lg font-semibold">
                Sign Out Confirmation
              </DialogTitle>
              <DialogDescription className="text-gray-400 mt-3 text-sm leading-relaxed">
                Are you sure you want to sign out of your account? Any unsaved changes will be lost, and you'll need to sign in again to access your dashboard.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-6 flex gap-3">
              <Button
                variant="ghost"
                onClick={() => setIsLogoutDialogOpen(false)}
                className="flex-1 bg-gray-700/50 hover:bg-gray-700 text-gray-200 border border-gray-600/50"
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleLogout} 
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium"
              >
                Sign Out
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </nav>
    </TooltipProvider>
  );
};