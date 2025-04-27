
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
import axios from "axios";
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
import { ErrorIcon, toast, Toaster} from 'react-hot-toast';7
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Clock, User, Plus } from "lucide-react";
import { format } from 'date-fns';
import { ScrollArea } from "../ui/scroll-area";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { ReportList } from "./partials/ReportList";
import ChatBot from "./partials/ChatBot";
import { Navigate } from "react-router-dom";
import UnAuthorizedPage from "../../pages/authentication/UnAuthorizedPage";
import { AppointmentsCard } from "./ui/AppointmentCard";




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


interface Appointment {
  _id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  user: string;
}


interface Event {
  _id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  status: 'draft' | 'published'
  createdAt: string
  updatedAt: string
}

export default function MainCitizen() {

  const role = localStorage.getItem('role');
    
    if (role !== 'citizen') {
      return <UnAuthorizedPage/>;
    }

  const [anonymousMode, setAnonymousMode] = useState(false);
  const navigate = useNavigate();

  const { id } = useParams();
  console.log("ID from URL:", id);

  const [reports, setReports] = useState<Report[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPage, setTotalPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/events/citizen`);
        const data = await response.json()
        if (response.ok) {
          setEvents(data)
        } else {
          setError('Failed to fetch events')
        }
      } catch (err) {
        setError('Network error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const reportsPerPage = 8;
 
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formDataa, setFormDataa] = useState({
    title: '',
    date: '',
    time: '',
    description: '',
  });

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

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
                value="events" 
                className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm"
              >
                <AlertCircle className="w-4 h-4 mr-2" />
                Events 
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
          <ReportList
            currentReport={currentReport as any}
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            handleViewDetails={handleViewDetails}
          />
          </TabsContent>
            
          <TabsContent value="events">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events
                .filter(event => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  
                  const eventDate = new Date(event.date);
                  eventDate.setHours(0, 0, 0, 0);

                  return eventDate >= today;
                })
                .map((event) => (
                  <Card key={event._id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row justify-between items-start">
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <Badge 
                        variant={event.status === 'published' ? 'default' : 'secondary'}
                        className="ml-2"
                      >
                        {event.status}
                      </Badge>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {format(new Date(event.date), 'PPP')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{event.location === 'TBA' ? 'Location TBA' : event.location}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {event.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
            </div>
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          <ChatBot />

          <div className="md:col-span-2">
            {id && <AppointmentsCard userId={id} />}
          </div>

        </div>
      </main>
    </div>
    </ThemeProvider>
    </>
  );
}