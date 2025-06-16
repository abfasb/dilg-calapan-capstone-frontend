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
  ChevronDown
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
      setUnreadCount(prev => prev - 1);
      
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
      
      const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
      setNotifications(updatedNotifications);
      setUnreadCount(0);
      
      await Promise.all(
        unreadIds.map(id => 
          fetch(`/api/citizen/notification/${id}/read`, { method: 'PATCH' })
        )
      );
    } catch (error) {
      console.error("Error marking all as read:", error);
      setNotifications(prev => prev);
      setUnreadCount(prev => prev);
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
  }

  const navigateToAppointments = () => {
    navigate(`/account/citizen/appointments/${userId}`);
  }

  const navigateToProfile = () => {
    navigate(`/account/citizen/profile/${userId}`);
  }

  const navigateToComplaintHistory = () => {
    navigate(`/account/citizen/complaint/${userId}`);
  }

  const navigateToAllNotifications = () => {
    navigate(`/account/citizen/notifications/${userId}`);
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
        return <FileText className="h-4 w-4 mt-1 text-blue-500" />;
      case 'complaint':
        return <AlertCircle className="h-4 w-4 mt-1 text-orange-500" />;
      case 'appointment':
        return <Calendar className="h-4 w-4 mt-1 text-green-500" />;
      default:
        return <AlertCircle className="h-4 w-4 mt-1 text-muted-foreground" />;
    }
  };

  return (
    <TooltipProvider>
      <header className="relative bg-gradient-to-r from-background via-background/95 to-background/90 backdrop-blur-xl border-b border-border/50 sticky top-0 z-50 shadow-sm dark:shadow-gray-900/20">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-50" />
        
        <div className="relative flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {/* Left Section - Brand & Navigation */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
              <div className="relative">
                <Shield className="h-7 w-7 text-primary transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" />
                <div className="absolute -inset-1 bg-primary/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                  CitizenPortal
                </span>
                <span className="text-xs text-muted-foreground font-medium">Your Digital Gateway</span>
              </div>
            </div>
            
            {/* Enhanced Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={navigateToReports} 
                    className="gap-2 hover:bg-primary/10 hover:text-primary transition-all duration-200 hover:scale-105 rounded-xl"
                  >
                    <FileText className="h-4 w-4" />
                    <span className="hidden xl:inline font-medium">My Reports</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-popover/95 backdrop-blur-sm">
                  <p className="font-semibold">View submitted reports</p>
                  <p className="text-xs text-muted-foreground">Track your submissions</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={navigateToComplaintHistory} 
                    className="gap-2 hover:bg-primary/10 hover:text-primary transition-all duration-200 hover:scale-105 rounded-xl"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span className="hidden xl:inline font-medium">My Complaints</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-popover/95 backdrop-blur-sm">
                  <p className="font-semibold">View admin responses</p>
                  <p className="text-xs text-muted-foreground">Check complaint status</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={navigateToAppointments} 
                    className="gap-2 hover:bg-primary/10 hover:text-primary transition-all duration-200 hover:scale-105 rounded-xl"
                  >
                    <Calendar className="h-4 w-4" />
                    <span className="hidden xl:inline font-medium">Appointments</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-popover/95 backdrop-blur-sm">
                  <p className="font-semibold">Manage appointments</p>
                  <p className="text-xs text-muted-foreground">Schedule & track meetings</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-2 hover:bg-primary/10 hover:text-primary transition-all duration-200 hover:scale-105 rounded-xl"
                  >
                    <HelpCircle className="h-4 w-4" />
                    <span className="hidden xl:inline font-medium">Support</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-popover/95 backdrop-blur-sm">
                  <p className="font-semibold">Get help & support</p>
                  <p className="text-xs text-muted-foreground">FAQs and assistance</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Enhanced Center Search */}
          <div className="flex-1 max-w-2xl mx-6 hidden md:block">
            <div className={`relative transition-all duration-300 ${searchFocused ? 'scale-105' : ''}`}>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-50" />
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-200 ${
                searchFocused ? 'text-primary' : 'text-muted-foreground'
              }`} />
              <Input
                placeholder="Search reports, announcements, services..."
                className="pl-12 pr-4 py-3 rounded-full border-2 bg-background/50 backdrop-blur-sm transition-all duration-200 focus:border-primary/50 focus:bg-background focus:shadow-lg focus:shadow-primary/10 hover:bg-background/80"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Badge variant="secondary" className="text-xs px-2 py-1">
                  ⌘K
                </Badge>
              </div>
            </div>
          </div>

          {/* Enhanced Right Section */}
          <div className="flex items-center gap-3">
            {/* Enhanced Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="relative rounded-full p-2.5 hover:bg-primary/10 hover:scale-110 transition-all duration-200 group"
                >
                  <Bell className="h-5 w-5 group-hover:text-primary transition-colors" />
                  {unreadCount > 0 && (
                    <>
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-1 -right-1 h-5 w-5 justify-center rounded-full text-xs animate-pulse shadow-lg"
                      >
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </Badge>
                      <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive animate-ping opacity-20" />
                    </>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-96 max-h-[80vh] bg-background/95 backdrop-blur-xl border-border/50 shadow-2xl" align="end">
                <DropdownMenuLabel className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-primary/5 to-transparent">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-primary" />
                    <span className="font-semibold">Notifications</span>
                  </div>
                  {unreadCount > 0 && (
                    <Button 
                      variant="link" 
                      size="sm"
                      onClick={markAllAsRead}
                      className="h-6 p-0 text-primary hover:text-primary/80 font-medium"
                    >
                      Mark all as read
                    </Button>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/50" />
                
                <div className="max-h-[65vh] overflow-y-auto">
                  {loadingNotifications ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="relative">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary/20 border-t-primary"></div>
                        <Sparkles className="absolute inset-0 h-8 w-8 text-primary/40 animate-pulse" />
                      </div>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <div className="relative mb-4">
                        <Inbox className="h-12 w-12 text-muted-foreground/50" />
                        <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 animate-pulse" />
                      </div>
                      <p className="font-medium text-muted-foreground">All caught up!</p>
                      <p className="text-sm text-muted-foreground/70 mt-1">We'll notify you when something new arrives</p>
                    </div>
                  ) : (
                    notifications.map(notification => (
                      <DropdownMenuItem 
                        key={notification._id}
                        className={`flex items-start gap-3 py-4 px-4 cursor-pointer transition-all duration-200 hover:bg-primary/5 ${
                          !notification.read ? 'bg-gradient-to-r from-primary/10 to-transparent border-l-2 border-primary/50' : ''
                        }`}
                        onSelect={() => markAsRead(notification._id)}
                      >
                        <div className="relative">
                          {getNotificationIcon(notification.type)}
                          {!notification.read && (
                            <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary animate-pulse" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium leading-snug ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {notification.message}
                          </p>
                          <div className="flex justify-between items-center mt-2">
                            <p className="text-xs text-muted-foreground/70 font-medium">
                              {formatDate(notification.createdAt)}
                            </p>
                            {!notification.read && (
                              <div className="flex items-center gap-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>
                                <span className="text-xs text-primary font-medium">New</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))
                  )}
                </div>
                
                {notifications.length > 0 && (
                  <>
                    <DropdownMenuSeparator className="bg-border/50" />
                    <DropdownMenuItem 
                      className="justify-center text-primary font-semibold py-3 hover:bg-primary/10 transition-colors"
                      onSelect={navigateToAllNotifications}
                    >
                      <span className="flex items-center gap-2">
                        View all notifications
                        <ChevronDown className="h-3 w-3 rotate-[-90deg]" />
                      </span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Enhanced Theme Toggle */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative rounded-full p-2.5 hover:bg-primary/10 hover:scale-110 transition-all duration-200 group overflow-hidden"
              onClick={toggleTheme}
            >
              <div className="relative z-10">
                {theme === "dark" ? (
                  <Sun className="h-5 w-5 group-hover:text-yellow-500 transition-colors" />
                ) : (
                  <Moon className="h-5 w-5 group-hover:text-blue-500 transition-colors" />
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>

            {/* Enhanced User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 hover:scale-105 transition-transform duration-200 group">
                <Avatar className="h-10 w-10 ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-200">
                  <AvatarImage src="/user-avatar.jpg" alt="User avatar" />
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
                    {user?.name ? (
                      user.name.split(' ').map(n => n[0]).join('').toUpperCase()
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors opacity-70" />
              </DropdownMenuTrigger>
              
              <DropdownMenuContent className="w-72 bg-background/95 backdrop-blur-xl border-border/50 shadow-2xl" align="end">
                <DropdownMenuLabel className="font-normal px-4 py-3 bg-gradient-to-r from-primary/5 to-transparent">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 ring-2 ring-primary/30">
                      <AvatarImage src="/user-avatar.jpg" alt="User avatar" />
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-bold text-lg">
                        {user?.name ? (
                          user.name.split(' ').map(n => n[0]).join('').toUpperCase()
                        ) : (
                          <User className="h-6 w-6" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-sm font-semibold">{user?.name || "User"}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                        {user?.email || "no-email@example.com"}
                      </p>
                      <Badge variant="outline" className="w-fit mt-1 text-xs">
                        Citizen
                      </Badge>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/50" />
                
                <DropdownMenuItem onClick={navigateToProfile} className="py-3 hover:bg-primary/5 transition-colors">
                  <User className="mr-3 h-4 w-4 text-primary" />
                  <span className="font-medium">My Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={navigateToReports} className="py-3 hover:bg-primary/5 transition-colors">
                  <FileText className="mr-3 h-4 w-4 text-blue-500" />
                  <span className="font-medium">My Reports</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={navigateToComplaintHistory} className="py-3 hover:bg-primary/5 transition-colors">
                  <MessageSquare className="mr-3 h-4 w-4 text-orange-500" />
                  <span className="font-medium">My Complaints</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={navigateToAppointments} className="py-3 hover:bg-primary/5 transition-colors">
                  <Calendar className="mr-3 h-4 w-4 text-green-500" />
                  <span className="font-medium">Appointments</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem className="py-3 hover:bg-primary/5 transition-colors">
                  <Settings className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="py-3 hover:bg-primary/5 transition-colors">
                  <Mail className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Contact Support</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem className="py-3 hover:bg-primary/5 transition-colors">
                  <Shield className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Privacy Policy</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem className="text-destructive hover:bg-destructive/10 py-3 transition-colors" onClick={handleLogout}>
                  <LogOut className="mr-3 h-4 w-4" />
                  <span className="font-medium">Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Enhanced Mobile Section */}
        <div className="md:hidden border-t border-border/50 bg-gradient-to-r from-background/95 to-background/90 backdrop-blur-sm">
          <div className="p-4">
            <div className={`relative transition-all duration-300 ${searchFocused ? 'scale-105' : ''}`}>
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-200 ${
                searchFocused ? 'text-primary' : 'text-muted-foreground'
              }`} />
              <Input
                placeholder="Search portal..."
                className="pl-10 pr-4 py-3 rounded-xl bg-background/50 backdrop-blur-sm border-2 transition-all duration-200 focus:border-primary/50 focus:bg-background focus:shadow-lg focus:shadow-primary/10"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
            </div>
            
            {/* Enhanced Mobile Navigation */}
            <div className="grid grid-cols-4 gap-3 mt-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={navigateToReports} 
                className="flex flex-col items-center gap-2 h-auto py-3 rounded-xl hover:bg-primary/10 hover:scale-105 transition-all duration-200 group"
              >
                <FileText className="h-5 w-5 group-hover:text-primary transition-colors" />
                <span className="text-xs font-semibold">Reports</span>
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={navigateToComplaintHistory} 
                className="flex flex-col items-center gap-2 h-auto py-3 rounded-xl hover:bg-primary/10 hover:scale-105 transition-all duration-200 group"
              >
                <MessageSquare className="h-5 w-5 group-hover:text-primary transition-colors" />
                <span className="text-xs font-semibold">Complaints</span>
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={navigateToAppointments} 
                className="flex flex-col items-center gap-2 h-auto py-3 rounded-xl hover:bg-primary/10 hover:scale-105 transition-all duration-200 group"
              >
                <Calendar className="h-5 w-5 group-hover:text-primary transition-colors" />
                <span className="text-xs font-semibold">Appointments</span>
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex flex-col items-center gap-2 h-auto py-3 rounded-xl hover:bg-primary/10 hover:scale-105 transition-all duration-200 group"
              >
                <HelpCircle className="h-5 w-5 group-hover:text-primary transition-colors" />
                <span className="text-xs font-semibold">Support</span>
              </Button>
            </div>
          </div>
        </div>
      </header>
      </TooltipProvider>
  );
}