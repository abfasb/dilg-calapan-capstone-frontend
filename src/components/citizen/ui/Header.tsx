import { useState, useEffect } from "react";
import { Button } from "../../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "../../ui/avatar";
import { Input } from "../../ui/input";
import { Badge } from "../../ui/badge";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "../../ui/tooltip";
import { Separator } from "../../ui/separator";
import { useTheme } from "../../../contexts/theme-provider";
import { useParams, useLocation, useNavigate } from "react-router-dom";

import { 
  Bell,
  Sun,
  Moon,
  User,
  Settings,
  LogOut,
  Search,
  AlertCircle,
  FileText,
  HelpCircle,
  Mail,
  Shield,
  Calendar,
  MessageSquare,
  Inbox,
  Sparkles,
  ChevronDown,
  Menu,
  X
} from "lucide-react";

interface INotification {
  _id: string;
  userId: string;
  message: string;
  read: boolean;
  type: 'submission' | 'complaint' | 'appointment';
  referenceId: string;
  createdAt: string;
}

export function Header() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [user, setUser] = useState<{ name: string; email: string; token?: string } | null>(null);
  const userId = localStorage.getItem("userId");
  
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!userId) return;
      
      try {
        setLoadingNotifications(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/citizen/notification/${userId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch notifications: ${response.status}`);
        }
        
        const data = await response.json();
        setNotifications(data);
        
        const unread = data.filter((n: INotification) => !n.read).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoadingNotifications(false);
      }
    };

    fetchNotifications();
    
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [userId]);

  // Handle user data
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const googleName = queryParams.get("name");
    const googleEmail = queryParams.get("email");
    const googleToken = queryParams.get("token");

    const manualName = localStorage.getItem("name");
    const manualEmail = localStorage.getItem("adminEmail");

    if (googleName && googleEmail && googleToken) {
      setUser({ name: googleName, email: googleEmail, token: googleToken });
      localStorage.setItem("name", googleName);
      localStorage.setItem("adminEmail", googleEmail);
      localStorage.setItem("token", googleToken);
    } else if (manualName && manualEmail) {
      setUser({ name: manualName, email: manualEmail });
    }
  }, [location]);

  const { theme, toggleTheme } = useTheme();  

  const markAsRead = async (id: string) => {
    try {
      setNotifications(prev => 
        prev.map(n => n._id === id ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/citizen/notification/${id}/read`, { 
        method: 'PATCH' 
      });
      
      if (!response.ok) {
        throw new Error(`Failed to mark notification as read: ${response.status}`);
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
      setNotifications(prev => 
        prev.map(n => n._id === id ? { ...n, read: false } : n)
      );
      setUnreadCount(prev => prev + 1);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications
        .filter(n => !n.read)
        .map(n => n._id);
      
      if (unreadIds.length === 0) return;
      
      const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
      setNotifications(updatedNotifications);
      setUnreadCount(0);
      
      await Promise.all(
        unreadIds.map(id => 
          fetch(`${import.meta.env.VITE_API_URL}/api/citizen/notification/${id}/read`, { method: 'PATCH' })
        )
      );
    } catch (error) {
      console.error("Error marking all as read:", error);
      // Revert on error
      const originalNotifications = notifications;
      setNotifications(originalNotifications);
      setUnreadCount(originalNotifications.filter(n => !n.read).length);
    }
  };

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
    setUser(null); 
    navigate('/account/login');
  };

  const navigateToReports = () => {
    navigate(`/account/citizen/my-report/${userId}`);
    setMobileMenuOpen(false);
  }

  const navigateToAppointments = () => {
    navigate(`/account/citizen/appointments/${userId}`);
    setMobileMenuOpen(false);
  }

  const navigateToProfile = () => {
    navigate(`/account/citizen/profile/${userId}`);
    setMobileMenuOpen(false);
  }

  const navigateToComplaintHistory = () => {
    navigate(`/account/citizen/complaint/${userId}`);
    setMobileMenuOpen(false);
  }

  const navigateToAllNotifications = () => {
    navigate(`/account/citizen/notifications/${userId}`);
    setMobileMenuOpen(false);
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'submission':
        return <FileText className="h-4 w-4 text-blue-500 flex-shrink-0" />;
      case 'complaint':
        return <AlertCircle className="h-4 w-4 text-orange-500 flex-shrink-0" />;
      case 'appointment':
        return <Calendar className="h-4 w-4 text-green-500 flex-shrink-0" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" />;
    }
  };

  return (
    <TooltipProvider>
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container flex h-16 items-center justify-between px-4">
          {/* Brand Section */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            
            <div 
              className="flex items-center gap-2 cursor-pointer group" 
              onClick={() => navigate('/')}
            >
              <div className="relative">
                <Shield className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold">CitizenPortal</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={navigateToReports} 
                  className="gap-2 transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <FileText className="h-4 w-4" />
                  <span>My Reports</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View your submitted reports</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={navigateToComplaintHistory} 
                  className="gap-2 transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>My Complaints</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View your complaints and responses</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={navigateToAppointments} 
                  className="gap-2 transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Appointments</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Manage your appointments</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-2 transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <HelpCircle className="h-4 w-4" />
                  <span>Support</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Get help and support</p>
              </TooltipContent>
            </Tooltip>
          </nav>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-4 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reports, announcements, services..."
                className="pl-10 pr-4 bg-background border-input transition-colors focus-visible:ring-2 focus-visible:ring-ring"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full text-xs p-0"
                    >
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-96 max-h-96 overflow-y-auto" align="end">
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <Button 
                      variant="link" 
                      size="sm"
                      onClick={markAllAsRead}
                      className="h-auto p-0 text-xs"
                    >
                      Mark all as read
                    </Button>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {loadingNotifications ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Inbox className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">No notifications</p>
                  </div>
                ) : (
                  notifications.map(notification => (
                    <DropdownMenuItem 
                      key={notification._id}
                      className={`flex items-start gap-3 p-3 cursor-pointer transition-colors ${
                        !notification.read ? 'bg-accent/50' : ''
                      }`}
                      onSelect={() => markAsRead(notification._id)}
                    >
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 space-y-1">
                        <p className={`text-sm leading-snug ${!notification.read ? 'font-medium' : ''}`}>
                          {notification.message}
                        </p>
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-muted-foreground">
                            {formatDate(notification.createdAt)}
                          </p>
                          {!notification.read && (
                            <div className="h-2 w-2 rounded-full bg-primary"></div>
                          )}
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))
                )}
                
                {notifications.length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="justify-center text-center"
                      onSelect={navigateToAllNotifications}
                    >
                      View all notifications
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Theme Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="transition-colors hover:bg-accent hover:text-accent-foreground"
              onClick={toggleTheme}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/user-avatar.jpg" alt="User avatar" />
                    <AvatarFallback>
                      {user?.name ? (
                        user.name.split(' ').map(n => n[0]).join('').toUpperCase()
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent className="w-64" align="end">
                <DropdownMenuLabel>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/user-avatar.jpg" alt="User avatar" />
                      <AvatarFallback>
                        {user?.name ? (
                          user.name.split(' ').map(n => n[0]).join('').toUpperCase()
                        ) : (
                          <User className="h-5 w-5" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user?.name || "User"}</p>
                      <p className="text-xs text-muted-foreground">{user?.email || "no-email@example.com"}</p>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={navigateToProfile} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>My Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={navigateToReports} className="cursor-pointer">
                  <FileText className="mr-2 h-4 w-4" />
                  <span>My Reports</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={navigateToComplaintHistory} className="cursor-pointer">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span>My Complaints</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={navigateToAppointments} className="cursor-pointer">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>Appointments</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Mail className="mr-2 h-4 w-4" />
                  <span>Contact Support</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <Shield className="mr-2 h-4 w-4" />
                  <span>Privacy Policy</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive cursor-pointer" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-background">
            <div className="p-4 space-y-4">
              {/* Mobile Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  className="pl-10"
                />
              </div>
              
              {/* Mobile Navigation */}
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="ghost" 
                  onClick={navigateToReports} 
                  className="flex items-center gap-2 justify-start h-12"
                >
                  <FileText className="h-4 w-4" />
                  <span>My Reports</span>
                </Button>
                
                <Button 
                  variant="ghost" 
                  onClick={navigateToComplaintHistory} 
                  className="flex items-center gap-2 justify-start h-12"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>My Complaints</span>
                </Button>
                
                <Button 
                  variant="ghost" 
                  onClick={navigateToAppointments} 
                  className="flex items-center gap-2 justify-start h-12"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Appointments</span>
                </Button>
                
                <Button 
                  variant="ghost" 
                  className="flex items-center gap-2 justify-start h-12"
                >
                  <HelpCircle className="h-4 w-4" />
                  <span>Support</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>
    </TooltipProvider>
  );
}