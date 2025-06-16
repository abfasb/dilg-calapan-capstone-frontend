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
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { 
  Alert, 
  AlertDescription, 
  AlertTitle 
} from "../ui/alert";
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
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  Info
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ScrollArea } from "../ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { cn } from '../../lib/utils';

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
  priority?: 'low' | 'medium' | 'high';
  attachments?: string[];
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
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/complaints/complaint-citizen`
        );
        const dataWithExtras = response.data.map((complaint: ComplaintType) => ({
          ...complaint,
          priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
          attachments: Array(Math.floor(Math.random() * 3)).fill('attachment.jpg')
        }));
        setComplaints(dataWithExtras);
        setFilteredComplaints(dataWithExtras);
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

    if (statusFilter !== "all") {
      result = result.filter(complaint => complaint.status === statusFilter);
    }

    // Filter by priority
    if (priorityFilter !== "all") {
      result = result.filter(complaint => complaint.priority === priorityFilter);
    }

    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
      result = result.filter(complaint => 
        complaint.title.toLowerCase().includes(lowercaseQuery) ||
        complaint.description.toLowerCase().includes(lowercaseQuery) ||
        complaint.category.toLowerCase().includes(lowercaseQuery) ||
        complaint.location.toLowerCase().includes(lowercaseQuery)
      );
    }

    // Sorting
    if (sortOrder === 'newest') {
      result = [...result].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else {
      result = [...result].sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    }

    return result;
  }, [complaints, statusFilter, priorityFilter, searchQuery, sortOrder]);

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
          bgColor: "bg-amber-100 dark:bg-amber-900/30",
          borderColor: "border-amber-500 dark:border-amber-400",
          hoverColor: "hover:bg-amber-200 dark:hover:bg-amber-900/50",
          description: "Your complaint is being reviewed by our team."
        };
      case 'In Review':
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          color: "text-blue-500 dark:text-blue-400",
          bgColor: "bg-blue-100 dark:bg-blue-900/30",
          borderColor: "border-blue-500 dark:border-blue-400",
          hoverColor: "hover:bg-blue-200 dark:hover:bg-blue-900/50",
          description: "Our team is actively working on your complaint."
        };
      case 'Resolved':
        return {
          icon: <CheckCircle2 className="h-4 w-4" />,
          color: "text-emerald-500 dark:text-emerald-400",
          bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
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

  const getPriorityInfo = (priority: string) => {
    switch (priority) {
      case 'high':
        return {
          text: 'High',
          color: 'text-rose-500',
          bgColor: 'bg-rose-100 dark:bg-rose-900/30'
        };
      case 'medium':
        return {
          text: 'Medium',
          color: 'text-amber-500',
          bgColor: 'bg-amber-100 dark:bg-amber-900/30'
        };
      case 'low':
        return {
          text: 'Low',
          color: 'text-emerald-500',
          bgColor: 'bg-emerald-100 dark:bg-emerald-900/30'
        };
      default:
        return {
          text: 'Unknown',
          color: 'text-gray-500',
          bgColor: 'bg-gray-100 dark:bg-gray-800'
        };
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest');
  };

  const clearFilters = () => {
    setStatusFilter('all');
    setPriorityFilter('all');
    setSearchQuery('');
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-6 max-w-6xl">
        <div className="flex items-center mb-8 space-x-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-8 w-48" />
        </div>
        
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <Skeleton className="h-8 w-full md:w-64" />
            <Skeleton className="h-10 w-full md:w-40" />
          </div>
          
          <Skeleton className="h-px w-full mb-6" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-xl border bg-card p-4">
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
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
        
        <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
          <Filter className="h-4 w-4 mr-2" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </Button>
      </div>

      <Card className="mb-6 border shadow-sm rounded-xl overflow-hidden">
        <CardHeader className="bg-muted/20 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-xl">Track Your Complaints</CardTitle>
              <CardDescription className="mt-1">
                View and manage all the complaints you've submitted
              </CardDescription>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={toggleSortOrder}>
                {sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}
                {sortOrder === 'newest' ? <ChevronDown className="ml-2 h-4 w-4" /> : <ChevronUp className="ml-2 h-4 w-4" />}
              </Button>
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" /> Clear Filters
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                type="text" 
                placeholder="Search complaints..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-full rounded-lg"
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
              <SelectTrigger className="w-full md:w-[180px] rounded-lg">
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
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
          
          {showFilters && (
            <div className="bg-muted/20 p-4 rounded-lg mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2 flex items-center">
                    <Filter className="h-4 w-4 mr-2" /> Priority
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {['all', 'high', 'medium', 'low'].map(priority => (
                      <Button
                        key={priority}
                        variant={priorityFilter === priority ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => setPriorityFilter(priority)}
                        className={cn(
                          priority === 'high' && priorityFilter === 'high' && "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300",
                          priority === 'medium' && priorityFilter === 'medium' && "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300",
                          priority === 'low' && priorityFilter === 'low' && "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                        )}
                      >
                        {priority === 'all' ? 'All Priorities' : priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <Tabs defaultValue={statusFilter === "all" ? "all" : statusFilter} onValueChange={setStatusFilter} className="w-full">
            <TabsList className="grid grid-cols-4 mb-6 bg-muted/20 p-1 h-auto rounded-lg">
              <TabsTrigger value="all" className="py-2 text-xs md:text-sm rounded-md">
                All ({statusCounts.all})
              </TabsTrigger>
              <TabsTrigger value="Pending" className="py-2 text-xs md:text-sm rounded-md">
                Pending ({statusCounts.Pending})
              </TabsTrigger>
              <TabsTrigger value="In Review" className="py-2 text-xs md:text-sm rounded-md">
                In Review ({statusCounts['In Review']})
              </TabsTrigger>
              <TabsTrigger value="Resolved" className="py-2 text-xs md:text-sm rounded-md">
                Resolved ({statusCounts.Resolved})
              </TabsTrigger>
            </TabsList>
            
            {Object.entries(complaintsByStatus).map(([status, complaints]) => (
              <TabsContent key={status} value={status} className="mt-0">
                {complaints.length === 0 ? (
                  <div className="text-center py-12 bg-gradient-to-br from-muted/10 to-muted/30 rounded-xl border border-dashed">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-xl font-medium text-muted-foreground mb-2">No complaints found</p>
                    <p className="text-muted-foreground mb-6">Try adjusting your search or filter</p>
                    {(statusFilter !== "all" || searchQuery || priorityFilter !== 'all') && (
                      <Button 
                        onClick={clearFilters}
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
                      const priorityInfo = getPriorityInfo(complaint.priority || 'medium');
                      
                      return (
                        <Card 
                          key={complaint._id} 
                          className={cn(
                            "border-l-4 transition-all duration-200 hover:shadow-lg rounded-xl overflow-hidden group",
                            statusInfo.borderColor
                          )}
                        >
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start gap-2">
                              <div className="flex-grow">
                                <CardTitle className="text-base md:text-lg font-bold truncate">
                                  {complaint.title}
                                </CardTitle>
                                <CardDescription className="text-xs md:text-sm mt-1 flex items-center">
                                  <span>{complaint.anonymous ? 'Anonymous' : formatDate(complaint.createdAt)}</span>
                                  <span className="mx-2">•</span>
                                  <Badge 
                                    variant="outline" 
                                    className={cn(
                                      "text-xs px-2 py-0.5",
                                      priorityInfo.bgColor,
                                      priorityInfo.color
                                    )}
                                  >
                                    {priorityInfo.text} Priority
                                  </Badge>
                                </CardDescription>
                              </div>
                              
                              <HoverCard>
                                <HoverCardTrigger asChild>
                                  <Badge 
                                    variant="outline" 
                                    className={cn(
                                      "cursor-pointer flex items-center gap-1 px-2 py-1 text-xs",
                                      statusInfo.bgColor,
                                      statusInfo.color,
                                      statusInfo.hoverColor
                                    )}
                                  >
                                    {statusInfo.icon}
                                    <span className="hidden xs:inline">{complaint.status}</span>
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
                            <p className="line-clamp-3 text-sm text-muted-foreground">
                              {complaint.description}
                            </p>
                          </CardContent>
                          
                          <CardFooter className="flex items-center justify-between pt-0 pb-4">
                            <div className="flex items-center text-xs text-muted-foreground">
                              <div className="flex items-center mr-3">
                                <Tag className="h-3.5 w-3.5 mr-1.5" />
                                <span className="truncate max-w-[100px]">{complaint.category}</span>
                              </div>
                              <div className="flex items-center">
                                <MapPin className="h-3.5 w-3.5 mr-1.5" />
                                <span className="truncate max-w-[100px]">{complaint.location}</span>
                              </div>
                            </div>
                            
                            <Button
                              onClick={() => handleViewDetails(complaint._id)}
                              variant="outline"
                              size="sm"
                              className="text-xs md:text-sm group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
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
        <DialogContent className="max-w-3xl max-h-[90vh] rounded-2xl p-0 overflow-hidden">
          {selectedComplaint && (
            <>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 p-6">
                <DialogHeader>
                  <div className="flex justify-between items-start gap-2">
                    <DialogTitle className="text-xl font-bold pr-4">{selectedComplaint.title}</DialogTitle>
                    <div className="flex gap-2">
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
                      <Badge 
                        variant="outline"
                        className={cn(
                          getPriorityInfo(selectedComplaint.priority || 'medium').bgColor,
                          getPriorityInfo(selectedComplaint.priority || 'medium').color
                        )}
                      >
                        {getPriorityInfo(selectedComplaint.priority || 'medium').text} Priority
                      </Badge>
                    </div>
                  </div>
                  <DialogDescription className="text-sm text-muted-foreground mt-2">
                    {selectedComplaint.anonymous ? 'Anonymous' : `Submitted by: ${selectedComplaint.name}`} • {formatDate(selectedComplaint.createdAt)}
                  </DialogDescription>
                </DialogHeader>
              </div>
              
              <ScrollArea className="max-h-[calc(90vh-12rem)] px-6 py-4">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-sm mb-3 flex items-center">
                      <Info className="h-4 w-4 mr-2 text-blue-500" /> Description
                    </h3>
                    <div className="bg-muted/20 p-4 rounded-xl border">
                      <p className="text-sm whitespace-pre-wrap">
                        {selectedComplaint.description}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-muted/20 p-4 rounded-xl border">
                      <div className="flex items-center mb-2">
                        <Tag className="h-4 w-4 mr-2 text-blue-500" />
                        <h3 className="text-sm font-medium">Category</h3>
                      </div>
                      <p className="text-sm font-medium">{selectedComplaint.category}</p>
                    </div>
                    
                    <div className="bg-muted/20 p-4 rounded-xl border">
                      <div className="flex items-center mb-2">
                        <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                        <h3 className="text-sm font-medium">Location</h3>
                      </div>
                      <p className="text-sm font-medium">{selectedComplaint.location}</p>
                    </div>
                  </div>

                  {selectedComplaint.attachments && selectedComplaint.attachments.length > 0 && (
                    <div>
                      <h3 className="font-medium text-sm mb-3">Attachments</h3>
                      <div className="flex gap-2">
                        {selectedComplaint.attachments.map((attachment, index) => (
                          <div key={index} className="border rounded-lg p-2 w-20 h-20 flex items-center justify-center bg-muted/20">
                            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedComplaint.adminNote && (
                    <Alert 
                      className={cn(
                        "border-l-4 border-blue-500 dark:border-blue-400 rounded-xl",
                        "bg-blue-50 dark:bg-blue-900/30"
                      )}
                    >
                      <div className="flex">
                        <AlertCircle className="h-4 w-4 text-blue-500 dark:text-blue-400 mt-1 mr-3" />
                        <div>
                          <AlertTitle className="text-blue-700 dark:text-blue-300">Admin Note</AlertTitle>
                          <AlertDescription className="text-blue-700 dark:text-blue-300 mt-2 whitespace-pre-wrap bg-white dark:bg-background p-3 rounded-lg border border-blue-100 dark:border-blue-800 shadow-sm">
                            {selectedComplaint.adminNote}
                          </AlertDescription>
                        </div>
                      </div>
                    </Alert>
                  )}
                </div>
              </ScrollArea>
              
              <DialogFooter className="px-6 py-4 bg-muted/10">
                <Button 
                  variant="outline" 
                  onClick={() => setDialogOpen(false)}
                  className="rounded-lg"
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