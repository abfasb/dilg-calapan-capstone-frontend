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
  Inbox
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
      <header className="bg-background border-b sticky m-0 p-0 top-0 z-50 dark:border-gray-800">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold tracking-tight">CitizenPortal</span>
            </div>
            
            <div className="hidden lg:flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={navigateToReports} className="gap-2">
                    <FileText className="h-4 w-4" />
                    <span className="hidden xl:inline">My Reports</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>View submitted reports</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={navigateToComplaintHistory} className="gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span className="hidden xl:inline"> My Complaint</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>View admin responses to your reports</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={navigateToAppointments} className="gap-2">
                    <Calendar className="h-4 w-4" />
                    <span className="hidden xl:inline">Appointments</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>View and manage appointments</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <HelpCircle className="h-4 w-4" />
                    <span className="hidden xl:inline">Support</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Get help and support</TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Center Search */}
          <div className="flex-1 max-w-2xl mx-4 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reports, announcements..."
                className="pl-10 pr-4 py-2 rounded-full"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="relative rounded-full aspect-square p-2"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 justify-center rounded-full"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-96 max-h-[80vh]" align="end">
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <Button 
                      variant="link" 
                      size="sm"
                      onClick={markAllAsRead}
                      className="h-6 p-0"
                    >
                      Mark all as read
                    </Button>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <div className="max-h-[65vh] overflow-y-auto">
                  {loadingNotifications ? (
                    <div className="flex justify-center items-center py-6">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                      <Inbox className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No notifications yet</p>
                      <p className="text-sm text-muted-foreground mt-1">We'll notify you when something arrives</p>
                    </div>
                  ) : (
                    notifications.map(notification => (
                      <DropdownMenuItem 
                        key={notification._id}
                        className={`flex items-start gap-3 py-3 ${!notification.read ? 'bg-muted/50 dark:bg-gray-800' : ''}`}
                        onSelect={() => markAsRead(notification._id)}
                      >
                        {getNotificationIcon(notification.type)}
                        <div className="w-full">
                          <p className="font-medium">{notification.message}</p>
                          <div className="flex justify-between items-center w-full mt-1">
                            <p className="text-xs text-muted-foreground">
                              {formatDate(notification.createdAt)}
                            </p>
                            {!notification.read && (
                              <span className="h-2 w-2 rounded-full bg-primary"></span>
                            )}
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))
                  )}
                </div>
                
                {notifications.length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="justify-center text-primary font-medium"
                      onSelect={navigateToAllNotifications}
                    >
                      View all notifications
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="rounded-full aspect-square p-2"
              onClick={toggleTheme}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/user-avatar.jpg" alt="User avatar" />
                  <AvatarFallback>
                    {user?.name ? (
                      user.name.split(' ').map(n => n[0]).join('').toUpperCase()
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent className="w-64" align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user?.name || "User"}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user?.email || "no-email@example.com"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={navigateToProfile}>
                  <User className="mr-2 h-4 w-4" />
                  My Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={navigateToReports}>
                  <FileText className="mr-2 h-4 w-4" />
                  My Reports
                </DropdownMenuItem>
                <DropdownMenuItem onClick={navigateToComplaintHistory}>
                  <Inbox className="mr-2 h-4 w-4" />
                  My Complaint
                </DropdownMenuItem>
                <DropdownMenuItem onClick={navigateToAppointments}>
                  <Calendar className="mr-2 h-4 w-4" />
                  Appointments
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Mail className="mr-2 h-4 w-4" />
                  Contact Support
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem>
                  <Shield className="mr-2 h-4 w-4" />
                  Privacy Policy
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="md:hidden p-4 border-t">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search portal..."
              className="pl-10 pr-4"
            />
          </div>
          
          {/* Mobile Navigation */}
          <div className="grid grid-cols-4 gap-2 mt-4">
            <Button variant="ghost" size="sm" onClick={navigateToReports} className="flex flex-col items-center gap-1 h-auto py-2">
              <FileText className="h-4 w-4" />
              <span className="text-xs">Reports</span>
            </Button>
            
            <Button variant="ghost" size="sm" onClick={navigateToComplaintHistory} className="flex flex-col items-center gap-1 h-auto py-2">
              <MessageSquare className="h-4 w-4" />
              <span className="text-xs">My Complaint</span>
            </Button>
            
            <Button variant="ghost" size="sm" onClick={navigateToAppointments} className="flex flex-col items-center gap-1 h-auto py-2">
              <Calendar className="h-4 w-4" />
              <span className="text-xs">Appointments</span>
            </Button>
            
            <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 h-auto py-2">
              <HelpCircle className="h-4 w-4" />
              <span className="text-xs">Support</span>
            </Button>
          </div>
        </div>
      </header>
    </TooltipProvider>
  );
}