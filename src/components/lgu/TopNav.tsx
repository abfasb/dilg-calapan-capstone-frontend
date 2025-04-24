import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBell, FiSearch, FiX, FiSettings, FiUser, FiLogOut } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '../ui/dropdown-menu';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '../ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useDebounce } from 'use-debounce';
import { cn } from '../../lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';

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
  const [notifications] = useState(3);

  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    setUserProfile({
      name: localStorage.getItem("name") || 'Anonymous',
      email: localStorage.getItem("adminEmail") || 'No email',
      avatar: localStorage.getItem("avatar") || undefined
    });
  }, []);

  const handleSearch = useCallback((value: string) => {
    console.log('Searching for:', value);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.clear();
    navigate('/account/login');
    setIsLogoutDialogOpen(false);
  }, [navigate]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    handleSearch(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
    handleSearch('');
  };

  return (
    <TooltipProvider >
    <nav className="sticky top-0 flex justify-between items-center px-6 h-16 border-b border-gray-800 bg-gray-900/95 backdrop-blur-lg z-50">
      <div className="relative flex-1 max-w-2xl mr-4">
        <motion.div
          initial={{ opacity: 0.9 }}
          whileHover={{ opacity: 1 }}
          className="relative group"
        >
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

      {/* Navigation Controls */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-cyan-400 relative rounded-lg hover:bg-gray-800/50"
              aria-label="Notifications"
            >
              <FiBell className="w-5 h-5" />
              {notifications > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 animate-pulse bg-red-500/90 hover:bg-red-400/90 px-1.5 py-0.5"
                >
                  {notifications}
                </Badge>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="bg-gray-800 border-gray-700 text-gray-200">
            Notifications ({notifications})
          </TooltipContent>
        </Tooltip>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="rounded-full p-1 hover:bg-gray-800/50 focus:ring-2 focus:ring-cyan-500/30"
              aria-label="User menu"
            >
              <div className="flex items-center gap-2.5">
                <Avatar className="w-9 h-9 border-2 border-cyan-500/20">
                  <AvatarImage src={userProfile.avatar || undefined} />
                  <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-blue-500 font-medium text-white">
                    {userProfile.name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-medium text-gray-200 truncate max-w-[160px]">
                    {userProfile.name}
                  </p>
                  <p className="text-xs text-gray-400 truncate max-w-[160px]">
                    {userProfile.email}
                  </p>
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent 
            align="end"
            className="w-64 bg-gray-800 border border-gray-700 rounded-xl shadow-xl overflow-hidden"
          >
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
              <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-gray-700/50 focus:bg-gray-700/50 cursor-pointer">
                <FiUser className="w-4 h-4 text-cyan-400" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-gray-700/50 focus:bg-gray-700/50 cursor-pointer">
                <FiSettings className="w-4 h-4 text-cyan-400" />
                <span>Settings</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="bg-gray-700/50" />

            <DropdownMenuItem
              onClick={() => setIsLogoutDialogOpen(true)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 focus:bg-red-500/10 cursor-pointer"
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
            <Button 
              variant="destructive"
              onClick={handleLogout}
              className="bg-red-500/90 hover:bg-red-400/90"
            >
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </nav>
    </TooltipProvider>
  );
};