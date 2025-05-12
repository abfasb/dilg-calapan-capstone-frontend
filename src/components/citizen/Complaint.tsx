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
  Filter, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Tag,
  Search,
  X
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
      case 'In Review':
        return 'bg-sky-100 text-sky-800 hover:bg-sky-200';
      case 'Resolved':
        return 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Clock className="h-4 w-4 mr-1 text-amber-600" />;
      case 'In Review':
        return <AlertCircle className="h-4 w-4 mr-1 text-sky-600" />;
      case 'Resolved':
        return <CheckCircle2 className="h-4 w-4 mr-1 text-emerald-600" />;
      default:
        return null;
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
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="flex items-center mb-8 space-x-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-8 w-48" />
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-40" />
        </div>
        
        {[1, 2, 3].map((i) => (
          <Card key={i} className="mb-4 border-l-4 border-l-gray-300">
            <CardHeader>
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-24" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
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

  return (
    <div className="container mx-auto p-6 max-w-6xl bg-gray-50 min-h-screen">
      <div className="flex items-center mb-8">
        <Button 
          onClick={handleReturn} 
          variant="ghost" 
          className="mr-4 hover:bg-gray-200"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <h1 className="text-3xl font-bold text-gray-800">My Complaints</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative col-span-2">
            <Input 
              type="text" 
              placeholder="Search complaints..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 py-2 border-gray-300 focus:ring-2 focus:ring-primary-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            {searchQuery && (
              <X 
                onClick={() => setSearchQuery('')} 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600" 
              />
            )}
          </div>
          
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="In Review">In Review</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Separator className="mb-6" />

        {filteredAndSearchedComplaints.length === 0 ? (
          <div className="text-center py-12 bg-gray-100 rounded-lg">
            <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-500 mb-4">No complaints found</p>
            <p className="text-gray-600 mb-6">Try adjusting your search or filter</p>
            {(statusFilter !== "all" || searchQuery) && (
              <Button 
                onClick={() => {
                  setStatusFilter("all");
                  setSearchQuery("");
                }}
                variant="outline"
                className="hover:bg-gray-200"
              >
                Reset Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredAndSearchedComplaints.map((complaint) => (
              <Card 
                key={complaint._id} 
                className={`
                  border-l-4 shadow-sm hover:shadow-md transition-all duration-300 
                  ${
                    complaint.status === 'Resolved' ? 'border-l-emerald-500 hover:border-l-emerald-600' :
                    complaint.status === 'In Review' ? 'border-l-sky-500 hover:border-l-sky-600' :
                    'border-l-amber-500 hover:border-l-amber-600'
                  }
                `}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-grow pr-4">
                      <CardTitle className="text-xl truncate">{complaint.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {complaint.anonymous ? 'Anonymous' : formatDate(complaint.createdAt)}  
                      </CardDescription>
                    </div>
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <Badge className={`cursor-pointer ${getStatusColor(complaint.status)}`}>
                          {getStatusIcon(complaint.status)} {complaint.status}
                        </Badge>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-64">
                        <div className="space-y-2">
                          <h4 className="font-medium">Status Information</h4>
                          <p className="text-sm text-gray-600">
                            {complaint.status === 'Pending' && "Your complaint is being reviewed by our team."}
                            {complaint.status === 'In Review' && "Our team is actively working on your complaint."}
                            {complaint.status === 'Resolved' && "Your complaint has been addressed and resolved."}
                          </p>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3 text-gray-700 mb-3">{complaint.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <Tag className="h-4 w-4 mr-1 text-gray-400" />
                      {complaint.category}
                      <span className="mx-2">•</span>
                      <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                      {complaint.location}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end pt-2">
                  <Button
                    onClick={() => handleViewDetails(complaint._id)}
                    variant="outline"
                    className="hover:bg-gray-100"
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl">
          {selectedComplaint && (
            <>
              <DialogHeader className="border-b pb-4">
                <div className="flex justify-between items-center">
                  <DialogTitle className="text-2xl font-bold">{selectedComplaint.title}</DialogTitle>
                  <Badge 
                    className={`${getStatusColor(selectedComplaint.status)} px-3 py-1`}
                  >
                    {getStatusIcon(selectedComplaint.status)} {selectedComplaint.status}
                  </Badge>
                </div>
                <DialogDescription className="mt-2 text-base text-gray-600">
                  {selectedComplaint.anonymous ? 'Anonymous' : `Submitted by: ${selectedComplaint.name}`} • {formatDate(selectedComplaint.createdAt)}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 my-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
                  <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {selectedComplaint.description}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                    <div className="flex items-centermb-2">
                      <Tag className="h-4 w-4 mr-2 text-gray-600" />
                      <h3 className="font-medium text-gray-700">Category</h3>
                    </div>
                    <p className="text-gray-800 font-semibold">{selectedComplaint.category}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                    <div className="flex items-center mb-2">
                      <MapPin className="h-4 w-4 mr-2 text-gray-600" />
                      <h3 className="font-medium text-gray-700">Location</h3>
                    </div>
                    <p className="text-gray-800 font-semibold">{selectedComplaint.location}</p>
                  </div>
                </div>

                {selectedComplaint.adminNote && (
                  <div className="bg-sky-50 p-4 rounded-md border-l-4 border-sky-500">
                    <h3 className="font-semibold text-sky-800 mb-2 flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2 text-sky-600" />
                      Admin Note
                    </h3>
                    <p className="text-sky-700 whitespace-pre-wrap bg-white p-3 rounded-md shadow-sm">
                      {selectedComplaint.adminNote}
                    </p>
                  </div>
                )}
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setDialogOpen(false)}
                  className="w-full sm:w-auto"
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