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
    Shield
  } from "lucide-react";
  
  export function Header() {

    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const [user, setUser] = useState<{ name: string; email: string; token?: string } | null>(null);
  
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
    const [unreadNotifications] = useState(3); 
    const { theme, toggleTheme } = useTheme();  

    const handleLogout = () => {
      localStorage.removeItem("name");
      localStorage.removeItem("adminEmail");
      localStorage.removeItem("token");
      setUser(null); 
      navigate('/account/login');
    };
    const userId = localStorage.getItem("userId");

    const navigateToReports = () => {
      navigate(`/account/citizen/my-report/${userId}}`)
    }
    
    return (
        <TooltipProvider>
    <header className="bg-background border-b sticky top-0 z-50 dark:border-gray-800">
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
                  {unreadNotifications > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 justify-center rounded-full"
                    >
                      {unreadNotifications}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-96" align="end">
                <DropdownMenuLabel className="flex items-center justify-between">
                  Notifications
                  <Button variant="link" size="sm">Mark all as read</Button>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <div className="max-h-96 overflow-y-auto">
                  {[1, 2, 3].map((notification) => (
                    <DropdownMenuItem 
                      key={notification}
                      className="flex items-start gap-3 py-3"
                      onSelect={(e) => e.preventDefault()}
                    >
                      <AlertCircle className="h-4 w-4 mt-1 text-muted-foreground" />
                      <div>
                        <p className="font-medium">New update on case #12345</p>
                        <p className="text-sm text-muted-foreground">
                          2 hours ago · Status changed to "In Progress"
                        </p>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
                
                <DropdownMenuSeparator />
                <DropdownMenuItem className="justify-center text-primary">
                  View all notifications
                </DropdownMenuItem>
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
                  <AvatarImage src="/user-avatar.jpg" />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent className="w-64" align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  My Profile
                </DropdownMenuItem>
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
        </div>
      </header>
      </TooltipProvider>

    );
  }