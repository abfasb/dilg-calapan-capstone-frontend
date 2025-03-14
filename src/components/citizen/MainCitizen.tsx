
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
  AlertTriangle,
  MapPin,
  Megaphone,
  ClipboardList,
  CheckCircleIcon
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

export default function MainCitizen() {
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

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    anonymous: false,
  });
  
  const handleSubmitComplaint = async () => {
    try {
      if (!formData.title || !formData.description || !formData.category || !formData.location) {
        toast.error('Please fill all required fields');
        return;
      }
  
      const formPayload = new FormData();
      formPayload.append('title', formData.title);
      formPayload.append('description', formData.description);
      formPayload.append('category', formData.category);
      formPayload.append('location', formData.location);
      formPayload.append('anonymous', formData.anonymous.toString());
  
      const response = await fetch(`${import.meta.env.VITE_API_URL}/complaints`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ 
          title: formData.title,
          description: formData.description,
          category: formData.category,
          location: formData.location,
          anonymous: formData.anonymous,
        }),
      });
  
      if (!response.ok) throw new Error('Submission failed');
        toast.success('Complaint Submitted Successfully!', {
                icon: <CheckCircleIcon className="w-6 h-6 text-green-400" />,
                style: {
                  background: '#1a1d24',
                  color: '#fff',
                  border: '1px solid #2a2f38',
                  padding: '16px',
                },
                duration: 4000,
              });
      setFormData({
        title: '',
        description: '',
        category: '',
        location: '',
        anonymous: false,
      });
    } catch (error) {
      toast.error('Failed to submit complaint. Please try again.');
    }
  };

  
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


  return (<>
    <Toaster
          position="top-right"
          gutter={32}
          containerClassName="!top-4 !right-6"
          toastOptions={{
            className: '!bg-[#1a1d24] !text-white !rounded-xl !border !border-[#2a2f38]',
          }}
        />
    <ThemeProvider>
    <div className="min-h-screen bg-muted/40 dark:bg-gray-900/50">
      
      <Header />
      <main className="max-w-7xl mx-auto p-4 grid gap-6">
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

                <Tabs defaultValue="reporting">
                <TabsList className="w-full grid grid-cols-2 lg:grid-cols-5 h-14 bg-gray-100/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl">
              <TabsTrigger value="reporting" className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm">
                <MessageSquare className="w-4 h-4 mr-2" />
                Report Incident
              </TabsTrigger>
              <TabsTrigger value="tracking" className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm">
                <MapPin className="w-4 h-4 mr-2" />
                Track Cases
              </TabsTrigger>
              <TabsTrigger value="community" className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm">
                <Megaphone className="w-4 h-4 mr-2" />
                Community
              </TabsTrigger>
              <TabsTrigger value="public-reports" className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm">
                <ClipboardList className="w-4 h-4 mr-2" />
                Public Reports
              </TabsTrigger>
              <TabsTrigger 
                value="announcements" 
                className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm"
              >
                <AlertCircle className="w-4 h-4 mr-2" />
                Announcements
              </TabsTrigger>
            </TabsList>

                  <TabsContent value="reporting">
                    <div className="grid md:grid-cols-2 gap-6">
                    <Card>
              <CardHeader>
                <CardTitle>New Complaint Report</CardTitle>
                <CardDescription>
                  Submit your concern to DILG Calapan City Office
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input 
                  placeholder="Complaint Title" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
                
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="">Select Complaint Category</option>
                  <option value="Road Issues">Road Issues</option>
                  <option value="Sanitation">Sanitation</option>
                  <option value="Public Safety">Public Safety</option>
                  <option value="Local Ordinances">Local Ordinances</option>
                  <option value="Other">Other</option>
                </select>

                <Input 
                  placeholder="Location in Calapan City" 
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />

                <Textarea
                  placeholder="Detailed description of your complaint..."
                  className="min-h-[150px]"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />

                <div className="flex items-center justify-between p-2 border rounded-lg">
                  <span className="text-sm">Submit Anonymously</span>
                  <Switch 
                    checked={formData.anonymous}
                    onCheckedChange={(checked) => setFormData({...formData, anonymous: checked})}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={handleSubmitComplaint}
                >
                  Submit Complaint
                </Button>
              </CardFooter>
            </Card>
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
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <CardTitle>Case Tracking</CardTitle>
                  <CardDescription>
                    Monitor the status of your submitted reports and cases
                  </CardDescription>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <Input 
                    placeholder="Search cases..." 
                    className="w-full md:w-64"
                  />
                  <Button variant="outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    Filter by Date
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4 flex-wrap">
                <Badge 
                  variant={selectedStatus.length === 0 ? 'default' : 'secondary'} 
                  className="cursor-pointer"
                  onClick={() => setSelectedStatus([])}
                >
                  All ({reports.length})
                </Badge>
                {['pending', 'in_progress', 'resolved'].map((status) => (
                  <Badge
                    key={status}
                    variant={selectedStatus.includes(status) ? 'default' : 'secondary'}
                    className="cursor-pointer capitalize"
                    onClick={() => setSelectedStatus(prev => 
                      prev.includes(status) 
                        ? prev.filter(s => s !== status) 
                        : [...prev, status]
                    )}
                  >
                    {status.replace('_', ' ')} ({
                      reports.filter(r => r.status === status).length
                    })
                  </Badge>
                ))}
              </div>

              <Table>
                <TableHeader className="dark:bg-gray-700">
                  <TableRow>
                    <TableHead className="w-[120px]">Case ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Update</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentReports.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        <div className="flex flex-col items-center gap-2 py-8">
                          <Shield className="w-12 h-12 text-muted-foreground" />
                          <p className="text-muted-foreground">
                            No cases found. Submit a new report to track its status.
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentReports.map((report) => (
                      <TableRow
                        key={report._id}
                        className="group hover:bg-gray-100/50 dark:hover:bg-gray-700/50"
                      >
                        <TableCell className="font-medium">
                          #{report._id?.substring(0, 6) || "N/A"}
                        </TableCell>

                        <TableCell className="max-w-[200px] truncate">
                          {report.title || "Untitled"}
                        </TableCell>

                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {report.category?.toLowerCase() || "Unknown"}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                report.status === "pending"
                                  ? "bg-yellow-500"
                                  : report.status === "in_progress"
                                  ? "bg-blue-500"
                                  : report.status === "resolved"
                                  ? "bg-green-500"
                                  : "bg-gray-400"
                              }`}
                            />
                            <span className="capitalize">
                              {report.status?.replace("_", " ") || "Unknown"}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell>
                          {report.updatedAt
                            ? new Date(report.updatedAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "N/A"}
                        </TableCell>

                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(report._id)}
                            className="transition-opacity"
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>


              {/* Pagination */}
              {currentReports.length > 0 && (
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
              )}
            </CardContent>
          </Card>
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
            <TabsContent value="announcements">
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Megaphone className="w-5 h-5" />
                    Official Announcements
                  </CardTitle>
                  <CardDescription>
                    Important updates from DILG Calapan City Office
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {/* Announcement Card 1 */}
                    <Card className="hover:shadow-lg transition-shadow dark:bg-gray-700/30">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base">Road Closure Notice</CardTitle>
                          <Badge variant="destructive" className="text-xs">Urgent</Badge>
                        </div>
                        <CardDescription className="text-sm">July 20, 2023</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Main Street closure for repairs from July 25-30. Detour routes available.
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm" className="w-full">
                          View Details
                        </Button>
                      </CardFooter>
                    </Card>

                    {/* Announcement Card 2 */}
                    <Card className="hover:shadow-lg transition-shadow dark:bg-gray-700/30">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base">New Waste Policy</CardTitle>
                          <Badge variant="secondary" className="text-xs">Update</Badge>
                        </div>
                        <CardDescription className="text-sm">July 15, 2023</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Enhanced recycling guidelines effective August 1st. Download the new handbook.
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm" className="w-full">
                          Download PDF
                        </Button>
                      </CardFooter>
                    </Card>

                    {/* Announcement Card 3 */}
                    <Card className="hover:shadow-lg transition-shadow dark:bg-gray-700/30">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base">Public Meeting</CardTitle>
                          <Badge className="text-xs">Event</Badge>
                        </div>
                        <CardDescription className="text-sm">July 18, 2023</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Town hall meeting on urban development. July 25th, 2PM at City Hall.
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm" className="w-full">
                          RSVP Now
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>

                  <div className="mt-6">
                    <Card className="dark:bg-gray-800/50">
                      <CardHeader className="py-3">
                        <CardTitle className="text-sm font-medium">
                          Archived Announcements
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableBody>
                            <TableRow className="hover:bg-gray-100/50 dark:hover:bg-gray-700/50">
                              <TableCell className="font-medium">Tax Deadline</TableCell>
                              <TableCell>April 15, 2023</TableCell>
                              <TableCell className="text-right">
                                <Button variant="link" size="sm" className="h-5 text-primary">
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                            <TableRow className="hover:bg-gray-100/50 dark:hover:bg-gray-700/50">
                              <TableCell className="font-medium">Health Advisory</TableCell>
                              <TableCell>March 1, 2023</TableCell>
                              <TableCell className="text-right">
                                <Button variant="link" size="sm" className="h-5 text-primary">
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
        </Tabs>

        <Card className="border-red-200 bg-red-50 dark:border-red-900/30 dark:bg-red-900/30">
          <CardHeader className="flex flex-row items-center gap-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <div>
              <CardTitle>Emergency Alerts</CardTitle>
              <CardDescription>Storm warning in your area</CardDescription>
            </div>
          </CardHeader>
        </Card>

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
    </>
  );
}