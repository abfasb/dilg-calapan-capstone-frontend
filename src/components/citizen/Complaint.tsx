import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  Alert, 
  AlertDescription, 
  AlertTitle 
} from "@/components/ui/alert";
import { 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Tag,
  Search,
  X,
  Filter,
  MoreHorizontal
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface ComplaintType {
  _id: string;
  title: string;
  name: string;
  createdAt: string;
  description: string;
  category: string;
  location: string;
  status: string;
  adminNote?: string;
  anonymous: boolean;
}

const Complaint = () => {
  const [complaints, setComplaints] = useState<ComplaintType[]>([]);
  const [filteredComplaints, setFilteredComplaints] = useState<ComplaintType[]>([]);
  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/complaints/complaint-citizen`
        );
        setComplaints(response.data);
        setFilteredComplaints(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch complaints');
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const filteredAndSearchedComplaints = useMemo(() => {
    let result = complaints;

    // Filter by status
    if (statusFilter !== "all") {
      result = result.filter(complaint => complaint.status === statusFilter);
    }

    // Search filter
    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
      result = result.filter(complaint => 
        complaint.title.toLowerCase().includes(lowercaseQuery) ||
        complaint.description.toLowerCase().includes(lowercaseQuery) ||
        complaint.category.toLowerCase().includes(lowercaseQuery) ||
        complaint.location.toLowerCase().includes(lowercaseQuery)
      );
    }

    return result;
  }, [complaints, statusFilter, searchQuery]);

  const handleViewDetails = async (id: string) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/complaints/complaint-citizen/${id}`
      );
      setSelectedComplaint(response.data);
      setDialogOpen(true);
    } catch (err) {
      setError('Failed to fetch complaint details');
    }
  };

  const handleReturn = () => {
    navigate(-1);
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'Pending':
        return {
          icon: <Clock className="h-4 w-4" />,
          color: "text-amber-500 dark:text-amber-400",
          bgColor: "bg-amber-100 dark:bg-amber-950/50",
          borderColor: "border-amber-500 dark:border-amber-400",
          hoverColor: "hover:bg-amber-200 dark:hover:bg-amber-900/50",
          description: "Your complaint is being reviewed by our team."
        };
      case 'In Review':
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          color: "text-blue-500 dark:text-blue-400",
          bgColor: "bg-blue-100 dark:bg-blue-950/50",
          borderColor: "border-blue-500 dark:border-blue-400",
          hoverColor: "hover:bg-blue-200 dark:hover:bg-blue-900/50",
          description: "Our team is actively working on your complaint."
        };
      case 'Resolved':
        return {
          icon: <CheckCircle2 className="h-4 w-4" />,
          color: "text-emerald-500 dark:text-emerald-400",
          bgColor: "bg-emerald-100 dark:bg-emerald-950/50",
          borderColor: "border-emerald-500 dark:border-emerald-400",
          hoverColor: "hover:bg-emerald-200 dark:hover:bg-emerald-900/50",
          description: "Your complaint has been addressed and resolved."
        };
      default:
        return {
          icon: null,
          color: "text-gray-500 dark:text-gray-400",
          bgColor: "bg-gray-100 dark:bg-gray-800",
          borderColor: "border-gray-300 dark:border-gray-700",
          hoverColor: "hover:bg-gray-200 dark:hover:bg-gray-700",
          description: "Status unknown"
        };
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-6 max-w-6xl">
        <div className="flex items-center mb-8 space-x-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-8 w-48" />
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <Skeleton className="h-8 w-full md:w-64" />
            <Skeleton className="h-10 w-full md:w-40" />
          </div>
          
          <Skeleton className="h-px w-full mb-6" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-lg border bg-card p-4">
                <div className="space-y-2 mb-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-16 w-full mb-4" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-9 w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 md:p-6 max-w-6xl">
        <Button onClick={handleReturn} variant="outline" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const complaintsByStatus = {
    all: filteredAndSearchedComplaints,
    Pending: filteredAndSearchedComplaints.filter(c => c.status === 'Pending'),
    'In Review': filteredAndSearchedComplaints.filter(c => c.status === 'In Review'),
    Resolved: filteredAndSearchedComplaints.filter(c => c.status === 'Resolved')
  };

  const statusCounts = {
    all: filteredAndSearchedComplaints.length,
    Pending: complaintsByStatus.Pending.length,
    'In Review': complaintsByStatus['In Review'].length,
    Resolved: complaintsByStatus.Resolved.length
  };

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-6xl min-h-screen">
      <div className="flex items-center mb-6">
        <Button 
          onClick={handleReturn} 
          variant="ghost" 
          size="sm"
          className="mr-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span className="sr-only md:not-sr-only">Back</span>
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold">My Complaints</h1>
      </div>

      <Card className="mb-6 border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Track Your Complaints</CardTitle>
          <CardDescription>
            View and manage all the complaints you've submitted
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                type="text" 
                placeholder="Search complaints..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-full"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Clear search</span>
                </Button>
              )}
            </div>
            
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter Status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses ({statusCounts.all})</SelectItem>
                <SelectItem value="Pending">Pending ({statusCounts.Pending})</SelectItem>
                <SelectItem value="In Review">In Review ({statusCounts['In Review']})</SelectItem>
                <SelectItem value="Resolved">Resolved ({statusCounts.Resolved})</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Tabs defaultValue={statusFilter === "all" ? "all" : statusFilter} onValueChange={setStatusFilter} className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="all" className="text-xs md:text-sm">
                All ({statusCounts.all})
              </TabsTrigger>
              <TabsTrigger value="Pending" className="text-xs md:text-sm">
                Pending ({statusCounts.Pending})
              </TabsTrigger>
              <TabsTrigger value="In Review" className="text-xs md:text-sm">
                In Review ({statusCounts['In Review']})
              </TabsTrigger>
              <TabsTrigger value="Resolved" className="text-xs md:text-sm">
                Resolved ({statusCounts.Resolved})
              </TabsTrigger>
            </TabsList>
            
            {Object.entries(complaintsByStatus).map(([status, complaints]) => (
              <TabsContent key={status} value={status} className="mt-0">
                {complaints.length === 0 ? (
                  <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-xl font-medium text-muted-foreground mb-2">No complaints found</p>
                    <p className="text-muted-foreground mb-6">Try adjusting your search or filter</p>
                    {(statusFilter !== "all" || searchQuery) && (
                      <Button 
                        onClick={() => {
                          setStatusFilter("all");
                          setSearchQuery("");
                        }}
                        variant="outline"
                        size="sm"
                      >
                        Reset Filters
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {complaints.map((complaint) => {
                      const statusInfo = getStatusInfo(complaint.status);
                      
                      return (
                        <Card 
                          key={complaint._id} 
                          className={cn(
                            "border-l-4 transition-all duration-200 hover:shadow-md",
                            statusInfo.borderColor
                          )}
                        >
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start gap-2">
                              <div className="flex-grow">
                                <CardTitle className="text-base md:text-lg font-bold truncate">
                                  {complaint.title}
                                </CardTitle>
                                <CardDescription className="text-xs md:text-sm mt-1">
                                  {complaint.anonymous ? 'Anonymous' : formatDate(complaint.createdAt)}  
                                </CardDescription>
                              </div>
                              
                              <HoverCard>
                                <HoverCardTrigger asChild>
                                  <Badge 
                                    variant="outline" 
                                    className={cn(
                                      "cursor-pointer flex items-center gap-1 px-2 py-1",
                                      statusInfo.bgColor,
                                      statusInfo.color,
                                      statusInfo.hoverColor
                                    )}
                                  >
                                    {statusInfo.icon}
                                    <span className="text-xs hidden xs:inline">{complaint.status}</span>
                                  </Badge>
                                </HoverCardTrigger>
                                <HoverCardContent align="end" className="w-64">
                                  <div className="space-y-2">
                                    <h4 className="font-medium">Status: {complaint.status}</h4>
                                    <p className="text-sm text-muted-foreground">
                                      {statusInfo.description}
                                    </p>
                                  </div>
                                </HoverCardContent>
                              </HoverCard>
                            </div>
                          </CardHeader>
                          
                          <CardContent className="pb-2">
                            <p className="line-clamp-2 text-sm">{complaint.description}</p>
                          </CardContent>
                          
                          <CardFooter className="flex items-center justify-between pt-0">
                            <div className="flex items-center text-xs text-muted-foreground">
                              <div className="flex items-center mr-3">
                                <Tag className="h-3 w-3 mr-1" />
                                <span className="truncate max-w-[100px]">{complaint.category}</span>
                              </div>
                              <div className="flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                <span className="truncate max-w-[100px]">{complaint.location}</span>
                              </div>
                            </div>
                            
                            <Button
                              onClick={() => handleViewDetails(complaint._id)}
                              variant="ghost"
                              size="sm"
                              className="text-xs md:text-sm"
                            >
                              View Details
                            </Button>
                          </CardFooter>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          {selectedComplaint && (
            <>
              <DialogHeader>
                <div className="flex justify-between items-start gap-2">
                  <DialogTitle className="text-xl font-bold pr-4">{selectedComplaint.title}</DialogTitle>
                  <Badge 
                    variant="outline"
                    className={cn(
                      "flex items-center gap-1 px-2 py-1 whitespace-nowrap",
                      getStatusInfo(selectedComplaint.status).bgColor,
                      getStatusInfo(selectedComplaint.status).color
                    )}
                  >
                    {getStatusInfo(selectedComplaint.status).icon}
                    <span>{selectedComplaint.status}</span>
                  </Badge>
                </div>
                <DialogDescription className="text-sm text-muted-foreground">
                  {selectedComplaint.anonymous ? 'Anonymous' : `Submitted by: ${selectedComplaint.name}`} • {formatDate(selectedComplaint.createdAt)}
                </DialogDescription>
              </DialogHeader>
              
              <ScrollArea className="max-h-[calc(90vh-12rem)]">
                <div className="space-y-6 p-1">
                  <div>
                    <h3 className="font-medium text-sm mb-2">Description</h3>
                    <div className="bg-muted/30 p-4 rounded-md border">
                      <p className="text-sm whitespace-pre-wrap">
                        {selectedComplaint.description}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-muted/30 p-4 rounded-md border">
                      <div className="flex items-center mb-2">
                        <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
                        <h3 className="text-sm font-medium">Category</h3>
                      </div>
                      <p className="text-sm font-medium">{selectedComplaint.category}</p>
                    </div>
                    
                    <div className="bg-muted/30 p-4 rounded-md border">
                      <div className="flex items-center mb-2">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <h3 className="text-sm font-medium">Location</h3>
                      </div>
                      <p className="text-sm font-medium">{selectedComplaint.location}</p>
                    </div>
                  </div>

                  {selectedComplaint.adminNote && (
                    <Alert 
                      className={cn(
                        "border-l-4 border-blue-500 dark:border-blue-400",
                        "bg-blue-50 dark:bg-blue-950/50"
                      )}
                    >
                      <AlertCircle className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                      <AlertTitle className="text-blue-700 dark:text-blue-300">Admin Note</AlertTitle>
                      <AlertDescription className="text-blue-700 dark:text-blue-300 mt-2 whitespace-pre-wrap bg-white dark:bg-background p-3 rounded-md border border-blue-100 dark:border-blue-800 shadow-sm">
                        {selectedComplaint.adminNote}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </ScrollArea>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setDialogOpen(false)}
                >
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Complaint;