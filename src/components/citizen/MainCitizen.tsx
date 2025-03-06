
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
import { Skeleton } from "../ui/skeleton";
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
import { 
  AlertCircle,
  Shield,
  Bot,
  Camera,
  MessageSquare,
  Calendar,
  AlertTriangle
} from "lucide-react";
import { Header } from "./ui/Header";
import { useEffect } from "react";
import { ThemeProvider } from "../../contexts/theme-provider";
import { useNavigate, useLocation , useParams} from "react-router-dom";
import { toast, Toaster} from 'react-hot-toast';


interface Report {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: 'pending' | 'in_progress' | 'resolved';
  createdAt: string;
  updatedAt: string;
  hasSubmitted?: boolean;
  submissions?: Array<{ 
    userId: string;
    responseId: string;
    createdAt: string;
  }>;
}

export default function CitizenPanelPage() {
  const [anonymousMode, setAnonymousMode] = useState(false);
  const navigate = useNavigate();

  const { id } = useParams();


  const [reports, setReports] = useState<Report[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPage, setTotalPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

  const reportsPerPage = 8;


  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/form/get-report`);
        const data = await response.json();
        
        if (!response.ok) throw new Error(data.message || 'Failed to fetch reports');

        const reportsWithStatus = data.map(report => ({
          ...report,
          hasSubmitted: report.submittedUsers?.includes(localStorage.getItem("userId"))
        }));
        
        setReports(reportsWithStatus);
        setTotalPage(Math.ceil(data.length / reportsPerPage));
      } catch (error) {
        console.error('Fetch error:', error);
        toast.error('Failed to load reports. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();

   
  }, []);

  const currentReport = reports.slice(
    (currentPage - 1) * reportsPerPage,
    currentPage * reportsPerPage
  );


  const name =localStorage.getItem("name");
  const email = localStorage.getItem("adminEmail");
  const token = localStorage.getItem("token");

  useEffect(() => { 
    console.log("Checking authentication...");
    console.log("ID:", id);
  
    if (!id) {
      console.log("Redirecting to login...");
      navigate('/account/login');
    }
  }, [id, navigate]); 
  
  
  const categories = [
    'Road Issues',
    'Sanitation',
    'Public Safety',
    'Infrastructure',
    'Other'
  ];

 

  const filteredReports = reports.filter(report => {
    const categoryMatch = selectedCategories.length === 0 || 
      selectedCategories.includes(report.category);
    const statusMatch = selectedStatus.length === 0 || 
      selectedStatus.includes(report.status);
    return categoryMatch && statusMatch;
  });


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReports = filteredReports.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

if (isLoading) {
    return (
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-[250px]" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-[400px]" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleViewDetails = (reportId: string) => {
    navigate(`/report/${reportId}`);
  };


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
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table className="dark:bg-gray-800">
                      <TableHeader className="dark:bg-gray-700">
                        <TableRow>
                          <TableHead>Report ID</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Fields</TableHead>
                          <TableHead>Date Created</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentReport.map((report : any) => (
                         <TableRow key={report._id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                         <TableCell className="font-medium text-sm">
                           <span className="font-mono">#{report._id.substring(0, 6)}</span>
                         </TableCell>
                         <TableCell className="max-w-[200px] truncate">
                           {report.title}
                         </TableCell>
                         <TableCell className="max-w-[300px] truncate">
                           {report.description}
                         </TableCell>
                         <TableCell>
                           <Badge variant="outline">
                             {report.fields.length} fields
                           </Badge>
                         </TableCell>
                         <TableCell>
                           {new Date(report.createdAt).toLocaleDateString('en-US', {
                             year: 'numeric',
                             month: 'short',
                             day: 'numeric',
                           })}
                         </TableCell>
                         <TableCell>
                          {report.hasSubmitted ? (
                            <Badge variant="outline" className="dark:bg-green-900/20 dark:text-green-400">
                              Submitted
                            </Badge>
                          ) : (
                            <Button 
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(report._id)} 
                              className="dark:bg-gray-700 dark:hover:bg-gray-600"
                            >
                              View Details
                            </Button>
                          )}
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