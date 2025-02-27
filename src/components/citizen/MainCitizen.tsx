
import React, { useState } from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "../ui/card";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from "../ui/pagination";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { 
  Alert,
  AlertTitle,
  AlertDescription,
} from "../ui/alert";
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider 
} from "../ui/tooltip";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel
  ,DropdownMenuSeparator
} from "../ui/dropdown-menu";
import { 
  AlertCircle,
  Shield,
  Bot,
  Bell,
  Camera,
  Mail,
  MessageSquare,
  Calendar,
  AlertTriangle,
  FileText,
  User
} from "lucide-react";
import { Header } from "./ui/Header";
import { useEffect } from "react";
import { ThemeProvider } from "../../contexts/theme-provider";

interface Report {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'pending' | 'in_progress' | 'resolved';
  createdAt: string;
  updatedAt: string;
}

export default function CitizenPanelPage() {
  const [anonymousMode, setAnonymousMode] = useState(false);

  const [reports, setReports] = useState<Report[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);

  // Mock categories - replace with your actual categories
  const categories = [
    'Road Issues',
    'Sanitation',
    'Public Safety',
    'Infrastructure',
    'Other'
  ];

  // Mock data - replace with actual API call
  useEffect(() => {
    // Simulate API call
    const mockReports: Report[] = Array.from({ length: 25 }, (_, i) => ({
      id: `REPORT-${i + 1}`,
      title: `Public Report ${i + 1}`,
      description: `Description of report ${i + 1} detailing the issue...`,
      category: categories[Math.floor(Math.random() * categories.length)],
      status: ['pending', 'in_progress', 'resolved'][Math.floor(Math.random() * 3)] as Report['status'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    
    setReports(mockReports);
  }, []);

  // Filtering logic
  const filteredReports = reports.filter(report => {
    const categoryMatch = selectedCategories.length === 0 || 
      selectedCategories.includes(report.category);
    const statusMatch = selectedStatus.length === 0 || 
      selectedStatus.includes(report.status);
    return categoryMatch && statusMatch;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReports = filteredReports.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);


  return (
    <ThemeProvider>
    <div className="min-h-screen bg-muted/40 dark:bg-gray-900/50">
      
      <Header />
      <main className="max-w-7xl mx-auto p-4 grid gap-6">
        {/* Quick Actions Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-primary" />
                Anonymous Reporting
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span>Enable Anonymous Mode</span>
                <Switch 
                  checked={anonymousMode}
                  onCheckedChange={setAnonymousMode}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-6 h-6 text-primary" />
                AI Reporting Assistant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                Start Smart Report
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-6 h-6 text-primary" />
                Image Recognition
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input type="file" accept="image/*" className="cursor-pointer" />
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="reporting">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="reporting">Incident Reporting</TabsTrigger>
            <TabsTrigger value="tracking">Case Tracking</TabsTrigger>
            <TabsTrigger value="community">Community Services</TabsTrigger>
            <TabsTrigger value="public-reports">Public Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="reporting">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Reporting Form */}
              <Card>
                <CardHeader>
                  <CardTitle>New Incident Report</CardTitle>
                  <CardDescription>
                    AI-powered smart form with auto-complete
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input placeholder="Location (auto-detected)" />
                  <Textarea 
                    placeholder="Describe the incident..." 
                    className="min-h-[150px]" 
                  />
                  <div className="flex gap-2">
                    <Input type="file" multiple />
                    <Button variant="outline">Scan Image</Button>
                  </div>
                  <Alert className="dark:bg-gray-800 dark:border-gray-700">
                    <AlertCircle className="w-4 h-4" />
                    <AlertTitle>Possible duplicate detected</AlertTitle>
                    <AlertDescription>
                      Similar report from 2 hours ago
                    </AlertDescription>
                  </Alert>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Submit Report</Button>
                </CardFooter>
              </Card>

              {/* Recent Reports */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Reports</CardTitle>
                </CardHeader>
                <CardContent>
                <Table className="dark:bg-gray-800">
                  <TableHeader className="dark:bg-gray-700">
                      <TableRow>
                        <TableHead>Case ID</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Update</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[1, 2, 3].map((item) => (
                        <TableRow key={item}>
                          <TableCell>#CASE-{item}23</TableCell>
                          <TableCell>
                          <Badge className="dark:bg-gray-700 dark:text-white" variant="outline">In Progress</Badge>
                          </TableCell>
                          <TableCell>2 hours ago</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tracking">
                      <h1>hello this is for tracking your document</h1>
          </TabsContent>

          <TabsContent value="community">
             <h1>hello this is for the community</h1>
          </TabsContent>

          <TabsContent value="public-reports">
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <CardTitle>Official Public Reports</CardTitle>
                      <CardDescription>
                        View all government-issued reports and updates
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              fill="none"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            Filters
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-64">
                          <DropdownMenuLabel>Category</DropdownMenuLabel>
                          {categories.map(category => (
                            <DropdownMenuItem key={category}>
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={selectedCategories.includes(category)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedCategories([...selectedCategories, category]);
                                    } else {
                                      setSelectedCategories(selectedCategories.filter(c => c !== category));
                                    }
                                  }}
                                />
                                {category}
                              </label>
                            </DropdownMenuItem>
                          ))}
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel>Status</DropdownMenuLabel>
                          {['pending', 'in_progress', 'resolved'].map(status => (
                            <DropdownMenuItem key={status}>
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={selectedStatus.includes(status)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedStatus([...selectedStatus, status]);
                                    } else {
                                      setSelectedStatus(selectedStatus.filter(s => s !== status));
                                    }
                                  }}
                                />
                                {status.replace('_', ' ').toUpperCase()}
                              </label>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table className="dark:bg-gray-800">
                    <TableHeader className="dark:bg-gray-700">
                      <TableRow>
                        <TableHead>Report ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentReports.map((report) => (
                        <TableRow key={report.id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                          <TableCell className="font-medium">{report.id}</TableCell>
                          <TableCell>{report.title}</TableCell>
                          <TableCell>{report.category}</TableCell>
                          <TableCell>
                          <Badge 
                          variant={
                            report.status === 'resolved' ? 'default' :
                            report.status === 'in_progress' ? 'secondary' : 'destructive'
                          }
                          className={
                            report.status === 'resolved' ? 'bg-green-500 hover:bg-green-600' :
                            report.status === 'in_progress' ? 'bg-orange-500 hover:bg-orange-600' : ''
                          }
                        >
                          {report.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(report.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                console.log('View report:', report.id);
                              }}
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  {/* Pagination */}
                  <div className="mt-6">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                        <PaginationPrevious
                          className={currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}
                          onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                          size={6}
                        />
                        </PaginationItem>
                        
                        {Array.from({ length: totalPages }, (_, i) => (
                          <PaginationItem key={i + 1}>
                            <PaginationLink
                              isActive={currentPage === i + 1}
                              onClick={() => setCurrentPage(i + 1)}
                              size={6}
                            >
                              {i + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ))}

                        <PaginationItem>                     
                          <PaginationNext
                            className={currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}
                            onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                            size={6}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
        </Tabs>

        {/* Emergency Section */}
        <Card className="border-red-200 bg-red-50 dark:border-red-900/30 dark:bg-red-900/30">
          <CardHeader className="flex flex-row items-center gap-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <div>
              <CardTitle>Emergency Alerts</CardTitle>
              <CardDescription>Storm warning in your area</CardDescription>
            </div>
          </CardHeader>
        </Card>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Chat Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="link" className="text-primary">
                Start Conversation
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="link" className="text-primary">
                Book Meeting
              </Button>
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
    </ThemeProvider>
  );
}