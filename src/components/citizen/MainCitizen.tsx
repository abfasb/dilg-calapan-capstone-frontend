import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "../ui/card";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationPrevious, 
  PaginationLink, 
  PaginationNext 
} from "../ui/pagination";
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
  ClipboardList
} from "lucide-react";
import { Label } from "../ui/label";
import { Header } from "./ui/Header";
import { ThemeProvider } from "../../contexts/theme-provider";
import { useNavigate, useParams } from "react-router-dom";
import { toast, Toaster } from 'react-hot-toast';

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

const services = [
  { title: "Chat Support", icon: MessageSquare, action: "Start Conversation" },
  { title: "Appointments", icon: Calendar, action: "Schedule Meeting" },
  { title: "Track Issue", icon: MapPin, action: "View Status" },
  { title: "Public Alerts", icon: Megaphone, action: "View Notices" }
];

export default function MainCitizen() {
  const [anonymousMode, setAnonymousMode] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPage, setTotalPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    anonymous: false,
  });

  const reportsPerPage = 8;

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/form/get-report`);
        const data = await response.json();
        
        if (!response.ok) throw new Error(data.message || 'Failed to fetch reports');

        const reportsWithStatus = data.map((report: Report) => ({
          ...report,
          hasSubmitted: report.submissions?.some(sub => sub.userId === localStorage.getItem("userId"))
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

  const handleSubmitComplaint = async () => {
    try {
      if (!formData.title || !formData.description || !formData.category || !formData.location) {
        toast.error('Please fill all required fields');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/complaints`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Submission failed');
      toast.success('Complaint submitted successfully!');
      setFormData({ title: '', description: '', category: '', location: '', anonymous: false });

    } catch (error) {
      toast.error('Failed to submit complaint. Please try again.');
    }
  };

  const handleViewDetails = (reportId: string) => {
    navigate(`/report/${reportId}`);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6 grid gap-6">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-muted/40 dark:bg-gray-900/90">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid gap-8">
          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-xl transition-all duration-300 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100/20 dark:bg-blue-900/20 rounded-lg">
                    <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-lg">Anonymous Reporting</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex items-center justify-between px-6 pb-4">
                <span className="text-sm text-muted-foreground">Protect your identity</span>
                <Switch 
                  checked={anonymousMode}
                  onCheckedChange={setAnonymousMode}
                  className="data-[state=checked]:bg-blue-600"
                />
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100/20 dark:bg-purple-900/20 rounded-lg">
                    <Bot className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-lg">AI Assistant</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-4">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Start Smart Report
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100/20 dark:bg-green-900/20 rounded-lg">
                    <Camera className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle className="text-lg">Image Report</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-4">
                <Input 
                  type="file" 
                  accept="image/*" 
                  className="cursor-pointer file:text-transparent"
                />
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="reporting">
            <TabsList className="w-full grid grid-cols-2 lg:grid-cols-4 h-14 bg-gray-100/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl">
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
            </TabsList>

            {/* Reporting Tab Content */}
            <TabsContent value="reporting" className="mt-6">
              <div className="grid lg:grid-cols-2 gap-8">
                <Card className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
                  <CardHeader className="bg-gray-50 dark:bg-gray-800/50 border-b">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Bot className="w-5 h-5 text-purple-600" />
                      Smart Report Assistant
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-5">
                    <div className="space-y-1">
                      <Label className="text-sm font-medium">Incident Title</Label>
                      <Input 
                        placeholder="Brief description..."
                        className="rounded-lg h-11"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-sm font-medium">Category</Label>
                      <select
                        className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                      >
                        <option value="">Select Category</option>
                        <option value="Road Issues">Road Issues</option>
                        <option value="Sanitation">Sanitation</option>
                        <option value="Public Safety">Public Safety</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-sm font-medium">Location</Label>
                      <Input 
                        placeholder="Enter location in Calapan City"
                        className="rounded-lg h-11"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-sm font-medium">Description</Label>
                      <Textarea
                        placeholder="Detailed description of the incident..."
                        className="min-h-[150px] rounded-lg"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50 dark:bg-gray-800/30">
                      <Label className="text-sm">Anonymous Submission</Label>
                      <Switch
                        checked={formData.anonymous}
                        onCheckedChange={(checked) => setFormData({...formData, anonymous: checked})}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="bg-gray-50 dark:bg-gray-800/30 px-6 py-4 border-t">
                    <Button 
                      className="w-full h-11 rounded-lg bg-blue-600 hover:bg-blue-700"
                      onClick={handleSubmitComplaint}
                    >
                      Submit Report
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="border border-gray-200 dark:border-gray-700 rounded-2xl">
                  <CardHeader className="bg-gray-50 dark:bg-gray-800/50 border-b">
                    <CardTitle className="text-xl">Recent Submissions</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table className="min-w-[600px] lg:min-w-full">
                        <TableHeader className="bg-gray-100/50 dark:bg-gray-700/50">
                          <TableRow className="hover:bg-transparent">
                            <TableHead className="pl-6 w-[120px]">Case ID</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="pr-6 text-right">Last Updated</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {currentReport.map((report) => (
                            <TableRow key={report._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                              <TableCell className="pl-6 font-medium">
                                <span className="font-mono text-sm">#{report._id.slice(-6)}</span>
                              </TableCell>
                              <TableCell>
                              <Badge 
                                variant="outline" 
                                className={`px-2.5 py-1 text-xs ${
                                  report.status === 'resolved' ? 'bg-green-100/30 text-green-700 dark:bg-green-900/20' :
                                  report.status === 'in_progress' ? 'bg-blue-100/30 text-blue-700 dark:bg-blue-900/20' :
                                  'bg-orange-100/30 text-orange-700 dark:bg-orange-900/20'
                                }`}
                              >
                                {report.status ? report.status.replace('_', ' ') : "Unknown"} {/* Fallback for undefined */}
                              </Badge>
                            </TableCell>

                              <TableCell className="pr-6 text-right text-sm text-muted-foreground">
                                {new Date(report.updatedAt).toLocaleDateString()}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Public Reports Tab */}
            <TabsContent value="public-reports" className="mt-6">
              <Card className="border border-gray-200 dark:border-gray-700 rounded-2xl">
                <CardHeader className="bg-gray-50 dark:bg-gray-800/50 border-b">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                      <CardTitle className="text-xl">Public Reports</CardTitle>
                      <CardDescription className="mt-1">
                        Official government reports and updates
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table className="min-w-[1000px] lg:min-w-full">
                      <TableHeader className="bg-gray-100/50 dark:bg-gray-700/50">
                        <TableRow>
                          <TableHead className="pl-6">Report ID</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead className="pr-6 text-right">Date Created</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentReport.map((report) => (
                          <TableRow key={report._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                            <TableCell className="pl-6 font-medium">
                              <span className="font-mono text-sm">#{report._id.slice(-6)}</span>
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate">
                              {report.title}
                            </TableCell>
                            <TableCell className="max-w-[300px] truncate">
                              {report.description}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="dark:bg-gray-700/50">
                                {report.category}
                              </Badge>
                            </TableCell>
                            <TableCell className="pr-6 text-right text-sm text-muted-foreground">
                              {new Date(report.createdAt).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 dark:bg-gray-800/30 px-6 py-4 border-t">
                  <Pagination className="w-full justify-between">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          className={currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}
                          onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                          size={6}
                        />
                      </PaginationItem>
                      <div className="flex items-center gap-2">
                        {Array.from({ length: totalPage }, (_, i) => (
                          <PaginationItem key={i + 1}>
                            <PaginationLink
                              isActive={currentPage === i + 1}
                              onClick={() => setCurrentPage(i + 1)}
                              className="rounded-lg"
                              size={6}
                            >
                              {i + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                      </div>
                      <PaginationItem>
                        <PaginationNext
                          className={currentPage === totalPage ? "opacity-50 cursor-not-allowed" : ""}
                          onClick={() => currentPage < totalPage && setCurrentPage(currentPage + 1)}
                          size={6}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Emergency Alert */}
          <div className="animate-pulse">
            <Card className="border-red-200 bg-red-100/50 dark:border-red-900/30 dark:bg-red-900/20 rounded-2xl overflow-hidden">
              <CardHeader className="flex flex-row items-center gap-4 py-3">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                <div>
                  <CardTitle className="text-red-700 dark:text-red-300">Emergency Alert</CardTitle>
                  <CardDescription className="text-red-600/70 dark:text-red-400/70">
                    Storm warning in Calapan City area
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((service) => (
              <Card 
                key={service.title}
                className="hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 rounded-xl"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <service.icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    <CardTitle className="text-base">{service.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-1 px-6 pb-4">
                  <Button variant="link" className="text-sm px-0 text-blue-600 dark:text-blue-400">
                    {service.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>

        <Toaster
          position="top-center"
          toastOptions={{
            className: '!bg-white !text-gray-900 dark:!bg-gray-800 dark:!text-gray-100 !rounded-lg',
            iconTheme: {
              primary: '#3b82f6',
              secondary: '#fff',
            },
          }}
        />
      </div>
    </ThemeProvider>
  );
}