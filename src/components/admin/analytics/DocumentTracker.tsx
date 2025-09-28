import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { toast, Toaster } from 'react-hot-toast';
import {
  FileText,
  Download,
  Upload,
  Calendar,
  User,
  MapPin,
  BarChart3,
  Filter,
  Search,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  FileCheck,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  CalendarClock,
  AlertTriangle,
  Grid,
  List,
  CalendarRange,
  File
} from 'lucide-react';
import barangays from '../../../types/barangays';

interface Form {
  _id: string;
  title: string;
  deadline: string;
}

interface BarangaySubmission {
  barangay: string;
  hasSubmission: boolean;
  submissionCount: number;
  latestSubmission: any;
  formId: string;
  formTitle: string;
}

interface SubmissionDetail {
  _id: string;
  referenceNumber: string;
  status: string;
  data: Record<string, any>;
  files: Array<{
    filename: string;
    url: string;
    mimetype: string;
  }>;
  bulkFile: {
    fileName: string;
    fileUrl: string;
  };
  userId: {
    firstName: string;
    lastName: string;
    barangay: string;
  };
  formId: {
    title: string;
    fields: Array<any>;
    deadline: string;
  };
  createdAt: string;
  comments: string;
  history: Array<{
    status: string;
    updatedBy: string;
    lguName: string;
    document: string;
    timestamp: Date;
    assignedLgu: any;
    currentStatus: string;
  }>;
}

interface FullSubmission {
  _id: string;
  referenceNumber: string;
  status: string;
  createdAt: string;
  userId: {
    firstName: string;
    lastName: string;
    barangay: string;
  };
  formId: {
    title: string;
    deadline: string;
  };
}

const DocumentTracker: React.FC = () => {
  const [forms, setForms] = useState<Form[]>([]);
  const [selectedForm, setSelectedForm] = useState<string>('');
  const [selectedFormDeadline, setSelectedFormDeadline] = useState<Date | null>(null);
  const [allBarangaySubmissions, setAllBarangaySubmissions] = useState<BarangaySubmission[]>([]);
  const [fullSubmissions, setFullSubmissions] = useState<FullSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionDetail | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [newFile, setNewFile] = useState<File | null>(null);
  const [fileIndexToUpdate, setFileIndexToUpdate] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' } | null>(null);
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>('all');
  const [deadlineStatusFilter, setDeadlineStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'simple' | 'full'>('simple');
  const [timePeriodFilter, setTimePeriodFilter] = useState<string>('all');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(null);

  const API_BASE = import.meta.env.VITE_API_URL || '';

  useEffect(() => {
    fetchForms();
  }, []);

  useEffect(() => {
    if (viewMode === 'simple' && selectedForm) {
      const form = forms.find(f => f._id === selectedForm);
      if (form) {
        const deadlineDate = new Date(form.deadline);
        if (!isNaN(deadlineDate.getTime())) {
          setSelectedFormDeadline(deadlineDate);
        } else {
          console.error('Invalid deadline date:', form.deadline);
          setSelectedFormDeadline(null);
        }
      }
      
      fetchSubmissionsByBarangay();
    } else if (viewMode === 'full') {
      fetchAllFormsSubmissions();
    }
  }, [selectedForm, viewMode, timePeriodFilter]);

  const fetchForms = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/document-tracker/forms`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Expected JSON but received: ${contentType}. Response: ${text.substring(0, 100)}`);
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setForms(data);
    } catch (error) {
      console.error('Error fetching forms:', error);
      toast.error('Error fetching forms: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const fetchAllFormsSubmissions = async () => {
    setIsLoading(true);
    try {
      // Fetch submissions for all forms
      const submissionsPromises = forms.map(form => 
        fetch(`${API_BASE}/api/document-tracker/submissions/${form._id}${timePeriodFilter !== 'all' ? `?period=${timePeriodFilter}` : ''}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }).then(res => res.json())
      );
      
      const allSubmissions = await Promise.all(submissionsPromises);
      
      // Merge all submissions with form information
      const mergedSubmissions = [];
      for (let i = 0; i < forms.length; i++) {
        const form = forms[i];
        const formSubmissions = allSubmissions[i];
        
        const mergedData = barangays.map(barangay => {
          const submission = formSubmissions.find((sub: BarangaySubmission) => sub.barangay === barangay.name);
          return {
            ...(submission || {
              barangay: barangay.name,
              hasSubmission: false,
              submissionCount: 0,
              latestSubmission: null
            }),
            formId: form._id,
            formTitle: form.title
          };
        });
        
        mergedSubmissions.push(...mergedData);
      }
      
      setAllBarangaySubmissions(mergedSubmissions);
    } catch (error) {
      console.error('Error fetching all forms submissions:', error);
      toast.error("Failed to fetch all forms submissions: " + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const fetchSubmissionsByBarangay = async () => {
  setIsLoading(true);
  try {
    let url = `${API_BASE}/api/document-tracker/submissions/${selectedForm}`;
    
    if (timePeriodFilter !== 'all') {
      url += `?period=${timePeriodFilter}`;
    }
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      throw new Error(`Expected JSON but received: ${contentType}. Response: ${text.substring(0, 100)}`);
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    const mergedData = barangays.map(barangay => {
      const submission = data.find((sub: any) => sub.barangay === barangay.name);
      
      if (submission) {
        return submission;
      } else {
        return {
          barangay: barangay.name,
          hasSubmission: false,
          submissionCount: 0,
          latestSubmission: null,
          formId: selectedForm
        };
      }
    });
    
    setAllBarangaySubmissions(mergedData);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    toast.error("Failed to fetch submissions: " + (error instanceof Error ? error.message : 'Unknown error'));
  } finally {
    setIsLoading(false);
    setIsRefreshing(false);
  }
};

  const fetchAllSubmissions = async () => {
    setIsLoading(true);
    try {
      let url = `${API_BASE}/api/document-tracker/submissions-all/${selectedForm}`;
      
      if (timePeriodFilter !== 'all') {
        url += `?period=${timePeriodFilter}`;
      }
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Expected JSON but received: ${contentType}. Response: ${text.substring(0, 100)}`);
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setFullSubmissions(data);
    } catch (error) {
      console.error('Error fetching all submissions:', error);
      toast.error("Failed to fetch all submissions: " + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const fetchSubmissionDetails = async (submissionId: string) => {
    try {
      const response = await fetch(`${API_BASE}/api/document-tracker/submission/${submissionId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Expected JSON but received: ${contentType}. Response: ${text.substring(0, 100)}`);
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setSelectedSubmission(data);
      setIsDialogOpen(true);
    } catch (error) {
      console.error('Error fetching submission details:', error);
      toast.error('Error fetching submission details: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleFileUpdate = async (submissionId: string) => {
    if (!newFile || selectedFileIndex === null) return;

    const formData = new FormData();
    formData.append('file', newFile);
    
    if (selectedFileIndex !== -1) {
      formData.append('fileIndex', selectedFileIndex.toString());
    }

    try {
      const response = await fetch(`${API_BASE}/form/submission/${submissionId}/file`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (response.ok) {
        toast.success('File updated successfully');
        setNewFile(null);
        setSelectedFileIndex(null);
        if (selectedSubmission) {
          fetchSubmissionDetails(selectedSubmission._id);
        }
        if (viewMode === 'simple') {
          fetchSubmissionsByBarangay();
        } else {
          fetchAllFormsSubmissions();
        }
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || 'Failed to update file');
      }
    } catch (error) {
      console.error('Error updating file:', error);
      toast.error('Error updating file: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const triggerFileInput = (index: number) => {
    setSelectedFileIndex(index);
    fileInputRef.current?.click();
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    if (viewMode === 'simple') {
      fetchSubmissionsByBarangay();
    } else {
      fetchAllFormsSubmissions();
    }
  };

  const handleSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getStatusIndicator = (hasSubmission: boolean) => {
    return (
      <div className="flex items-center gap-2">
        <div className={`h-3 w-3 rounded-full ${hasSubmission ? 'bg-green-500' : 'bg-red-500'}`} />
        <span>{hasSubmission ? 'Submitted' : 'Not Submitted'}</span>
      </div>
    );
  };

  const getDeadlineStatus = (submissionDate: string | null, formDeadline: string) => {
    if (!submissionDate || !formDeadline) return { status: 'No Submission', color: 'gray' };
    
    const submittedDate = new Date(submissionDate);
    const deadlineDate = new Date(formDeadline);
    
    if (isNaN(submittedDate.getTime()) || isNaN(deadlineDate.getTime())) {
      return { status: 'Invalid Date', color: 'gray' };
    }
    
    if (submittedDate <= deadlineDate) {
      return { status: 'On Time', color: 'green' };
    } else {
      const daysLate = Math.floor((submittedDate.getTime() - deadlineDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysLate <= 3) {
        return { status: 'Slightly Late', color: 'yellow' };
      } else if (daysLate <= 7) {
        return { status: 'Late', color: 'orange' };
      } else {
        return { status: 'Very Late', color: 'red' };
      }
    }
  };

  const [fileInputKey, setFileInputKey] = useState(0);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    if (e.target.files && e.target.files[0]) {
      setNewFile(e.target.files[0]);
      if (index !== undefined) {
        setSelectedFileIndex(index);
      }
      setFileInputKey(prev => prev + 1);
    }
  };

  const filteredAndSortedSubmissions = () => {
  let filtered = allBarangaySubmissions;
  
  // Always filter by selected form in simple view
  if (viewMode === 'simple' && selectedForm) {
    filtered = filtered.filter(item => item.formId === selectedForm);
  }
  
  // Apply status filter
  if (activeStatusFilter !== 'all') {
    filtered = filtered.filter(item => {
      if (activeStatusFilter === 'submitted') return item.hasSubmission;
      if (activeStatusFilter === 'not-submitted') return !item.hasSubmission;
      return true;
    });
  }
  
  // Apply deadline status filter
  if (deadlineStatusFilter !== 'all') {
    filtered = filtered.filter(item => {
      if (!item.hasSubmission) return deadlineStatusFilter === 'no-submission';
      
      const form = forms.find(f => f._id === item.formId);
      if (!form) return false;
      
      const deadlineStatus = getDeadlineStatus(item.latestSubmission?.createdAt, form.deadline);
      const statusKey = deadlineStatus.status.toLowerCase().replace(' ', '-');
      return statusKey === deadlineStatusFilter;
    });
  }
  
  // Apply search filter
  if (searchQuery) {
    filtered = filtered.filter(item => 
      item.barangay.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (viewMode === 'full' && item.formTitle && item.formTitle.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }
  
  // Apply sorting
  if (sortConfig) {
    filtered = [...filtered].sort((a, b) => {
      if (sortConfig.key === 'deadlineStatus') {
        const formA = forms.find(f => f._id === a.formId);
        const formB = forms.find(f => f._id === b.formId);
        
        const aStatus = getDeadlineStatus(a.latestSubmission?.createdAt, formA?.deadline || '').status;
        const bStatus = getDeadlineStatus(b.latestSubmission?.createdAt, formB?.deadline || '').status;
        
        if (aStatus < bStatus) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aStatus > bStatus) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      }

      switch (sortConfig.key) {
        case 'barangay':
          return sortConfig.direction === 'ascending' 
            ? a.barangay.localeCompare(b.barangay)
            : b.barangay.localeCompare(a.barangay);
        case 'formTitle':
          return sortConfig.direction === 'ascending' 
            ? (a.formTitle || '').localeCompare(b.formTitle || '')
            : (b.formTitle || '').localeCompare(a.formTitle || '');
        case 'submissionCount':
          return sortConfig.direction === 'ascending'
            ? a.submissionCount - b.submissionCount
            : b.submissionCount - a.submissionCount;
        case 'latestSubmission.createdAt':
          const aDate = a.latestSubmission?.createdAt || '';
          const bDate = b.latestSubmission?.createdAt || '';
          return sortConfig.direction === 'ascending'
            ? aDate.localeCompare(bDate)
            : bDate.localeCompare(aDate);
        default:
          return 0;
      }
    });
  }
  
  return filtered;
};

  const filteredAndSortedFullSubmissions = () => {
    let filtered = fullSubmissions;
    
    // Apply status filter
    if (activeStatusFilter !== 'all') {
      filtered = filtered.filter(item => {
        if (activeStatusFilter === 'submitted') return true;
        return false;
      });
    }
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.userId.barangay.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.userId.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.userId.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply sorting
    if (sortConfig) {
      filtered = [...filtered].sort((a, b) => {
        switch (sortConfig.key) {
          case 'barangay':
            return sortConfig.direction === 'ascending' 
              ? a.userId.barangay.localeCompare(b.userId.barangay)
              : b.userId.barangay.localeCompare(a.userId.barangay);
          case 'name':
            const aName = `${a.userId.firstName} ${a.userId.lastName}`;
            const bName = `${b.userId.firstName} ${b.userId.lastName}`;
            return sortConfig.direction === 'ascending' 
              ? aName.localeCompare(bName)
              : bName.localeCompare(aName);
          case 'referenceNumber':
            return sortConfig.direction === 'ascending' 
              ? a.referenceNumber.localeCompare(b.referenceNumber)
              : b.referenceNumber.localeCompare(a.referenceNumber);
          case 'createdAt':
            return sortConfig.direction === 'ascending'
              ? a.createdAt.localeCompare(b.createdAt)
              : b.createdAt.localeCompare(a.createdAt);
          case 'status':
            return sortConfig.direction === 'ascending'
              ? a.status.localeCompare(b.status)
              : b.status.localeCompare(a.status);
          default:
            return 0;
        }
      });
    }
    
    return filtered;
  };

  const statusFilters = [
    { id: 'all', label: 'All Statuses', icon: <BarChart3 size={16} /> },
    { id: 'submitted', label: 'Submitted', icon: <CheckCircle size={16} /> },
    { id: 'not-submitted', label: 'Not Submitted', icon: <XCircle size={16} /> },
  ];

  const deadlineStatusFilters = [
    { id: 'all', label: 'All Deadline Statuses', icon: <CalendarClock size={16} /> },
    { id: 'on-time', label: 'On Time', icon: <CheckCircle size={16} /> },
    { id: 'slightly-late', label: 'Slightly Late', icon: <AlertCircle size={16} /> },
    { id: 'late', label: 'Late', icon: <AlertTriangle size={16} /> },
    { id: 'very-late', label: 'Very Late', icon: <XCircle size={16} /> },
    { id: 'no-submission', label: 'No Submission', icon: <Clock size={16} /> },
  ];

  const timePeriodFilters = [
    { id: 'all', label: 'All Time', icon: <CalendarRange size={16} /> },
    { id: 'weekly', label: 'Weekly', icon: <CalendarRange size={16} /> },
    { id: 'monthly', label: 'Monthly', icon: <CalendarRange size={16} /> },
    { id: 'quarterly', label: 'Quarterly', icon: <CalendarRange size={16} /> },
    { id: 'yearly', label: 'Yearly', icon: <CalendarRange size={16} /> },
  ];

  // Group submissions by barangay for the grid view
  const getBarangayGridData = () => {
    const barangayData: Record<string, Record<string, BarangaySubmission>> = {};
    
    // Initialize with all barangays
    barangays.forEach(barangay => {
      barangayData[barangay.name] = {};
    });
    
    // Populate with submission data
    allBarangaySubmissions.forEach(submission => {
      if (!barangayData[submission.barangay]) {
        barangayData[submission.barangay] = {};
      }
      barangayData[submission.barangay][submission.formId] = submission;
    });
    
    return barangayData;
  };

  
  const renderSimpleView = () => (
  <div className="rounded-md border">
    <Table>
      <TableHeader className="bg-muted/50">
        <TableRow>
          <TableHead 
            className="w-[200px] cursor-pointer"
            onClick={() => handleSort('barangay')}
          >
            <div className="flex items-center">
              Barangay
              {sortConfig?.key === 'barangay' && (
                sortConfig.direction === 'ascending' ? 
                  <ChevronUp className="ml-1 h-4 w-4" /> : 
                  <ChevronDown className="ml-1 h-4 w-4" />
              )}
            </div>
          </TableHead>
          <TableHead>Status</TableHead>
          <TableHead 
            className="cursor-pointer"
            onClick={() => handleSort('deadlineStatus')}
          >
            <div className="flex items-center">
              Deadline Status
              {sortConfig?.key === 'deadlineStatus' && (
                sortConfig.direction === 'ascending' ? 
                  <ChevronUp className="ml-1 h-4 w-4" /> : 
                  <ChevronDown className="ml-1 h-4 w-4" />
              )}
            </div>
          </TableHead>
          <TableHead 
            className="cursor-pointer text-right"
            onClick={() => handleSort('submissionCount')}
          >
            <div className="flex items-center justify-end">
              Submissions
              {sortConfig?.key === 'submissionCount' && (
                sortConfig.direction === 'ascending' ? 
                  <ChevronUp className="ml-1 h-4 w-4" /> : 
                  <ChevronDown className="ml-1 h-4 w-4" />
              )}
            </div>
          </TableHead>
          <TableHead 
            className="cursor-pointer"
            onClick={() => handleSort('latestSubmission.createdAt')}
          >
            <div className="flex items-center">
              Last Submission
              {sortConfig?.key === 'latestSubmission.createdAt' && (
                sortConfig.direction === 'ascending' ? 
                  <ChevronUp className="ml-1 h-4 w-4" /> : 
                  <ChevronDown className="ml-1 h-4 w-4" />
              )}
            </div>
          </TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredAndSortedSubmissions().map((item) => {
          const form = forms.find(f => f._id === item.formId);
          const deadlineStatus = getDeadlineStatus(item.latestSubmission?.createdAt, form?.deadline || '');
          
          return (
            <TableRow key={`${item.barangay}-${item.formId}`}>
              <TableCell className="font-medium">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  {item.barangay}
                </div>
              </TableCell>
              <TableCell>
                {getStatusIndicator(item.hasSubmission)}
              </TableCell>
              <TableCell>
                <Badge 
                  variant="outline" 
                  className={
                    deadlineStatus.color === 'green' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                    deadlineStatus.color === 'yellow' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' :
                    deadlineStatus.color === 'orange' ? 'bg-orange-100 text-orange-800 hover:bg-orange-100' :
                    deadlineStatus.color === 'red' ? 'bg-red-100 text-red-800 hover:bg-red-100' :
                    'bg-gray-100 text-gray-800 hover:bg-gray-100'
                  }
                >
                  {deadlineStatus.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">{item.submissionCount}</TableCell>
              <TableCell>
                {item.latestSubmission ? (
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    {new Date(item.latestSubmission.createdAt).toLocaleDateString()}
                  </div>
                ) : (
                  'N/A'
                )}
              </TableCell>
              <TableCell className="text-right">
                {item.hasSubmission && item.latestSubmission ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchSubmissionDetails(item.latestSubmission._id)}
                    className="flex items-center gap-1"
                  >
                    <FileText size={14} />
                    Details
                  </Button>
                ) : (
                  <span className="text-muted-foreground text-sm">No submission</span>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  </div>
);

  const renderFullGridView = () => {
    const barangayData = getBarangayGridData();
    
    return (
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead 
                className="w-[200px] cursor-pointer sticky left-0 bg-muted/50 z-10"
                onClick={() => handleSort('barangay')}
              >
                <div className="flex items-center">
                  Barangay
                  {sortConfig?.key === 'barangay' && (
                    sortConfig.direction === 'ascending' ? 
                      <ChevronUp className="ml-1 h-4 w-4" /> : 
                      <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              {forms.map(form => (
                <TableHead key={form._id} className="text-center min-w-[150px]">
                  <div className="flex flex-col items-center">
                    <span className="font-medium">{form.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(form.deadline).toLocaleDateString()}
                    </span>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(barangayData).map(([barangayName, formSubmissions]) => (
              <TableRow key={barangayName}>
                <TableCell className="font-medium sticky left-0 bg-background z-10">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    {barangayName}
                  </div>
                </TableCell>
                {forms.map(form => {
                  const submission = formSubmissions[form._id];
                  const hasSubmission = submission?.hasSubmission || false;
                  const deadlineStatus = getDeadlineStatus(
                    submission?.latestSubmission?.createdAt, 
                    form.deadline
                  );
                  
                  return (
                    <TableCell key={form._id} className="text-center">
                      {hasSubmission ? (
                        <div 
                          className="inline-flex flex-col items-center gap-1 cursor-pointer p-2 rounded hover:bg-muted/50"
                          onClick={() => submission.latestSubmission && fetchSubmissionDetails(submission.latestSubmission._id)}
                        >
                          <div className={`h-3 w-3 rounded-full bg-green-500`} />
                          <span className="text-xs font-medium">{deadlineStatus.status}</span>
                          {submission.submissionCount > 1 && (
                            <span className="text-xs text-muted-foreground">
                              {submission.submissionCount} submissions
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="inline-flex flex-col items-center gap-1 p-2">
                          <div className="h-3 w-3 rounded-full bg-red-500" />
                          <span className="text-xs font-medium">Not Submitted</span>
                        </div>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  const renderFullListView = () => (
    <div className="rounded-md border">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead 
              className="w-[200px] cursor-pointer"
              onClick={() => handleSort('barangay')}
            >
              <div className="flex items-center">
                Barangay
                {sortConfig?.key === 'barangay' && (
                  sortConfig.direction === 'ascending' ? 
                    <ChevronUp className="ml-1 h-4 w-4" /> : 
                    <ChevronDown className="ml-1 h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('formTitle')}
            >
              <div className="flex items-center">
                Form Title
                {sortConfig?.key === 'formTitle' && (
                  sortConfig.direction === 'ascending' ? 
                    <ChevronUp className="ml-1 h-4 w-4" /> : 
                    <ChevronDown className="ml-1 h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('deadlineStatus')}
            >
              <div className="flex items-center">
                Deadline Status
                {sortConfig?.key === 'deadlineStatus' && (
                  sortConfig.direction === 'ascending' ? 
                    <ChevronUp className="ml-1 h-4 w-4" /> : 
                    <ChevronDown className="ml-1 h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer text-right"
              onClick={() => handleSort('submissionCount')}
            >
              <div className="flex items-center justify-end">
                Submissions
                {sortConfig?.key === 'submissionCount' && (
                  sortConfig.direction === 'ascending' ? 
                    <ChevronUp className="ml-1 h-4 w-4" /> : 
                    <ChevronDown className="ml-1 h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('latestSubmission.createdAt')}
            >
              <div className="flex items-center">
                Last Submission
                {sortConfig?.key === 'latestSubmission.createdAt' && (
                  sortConfig.direction === 'ascending' ? 
                    <ChevronUp className="ml-1 h-4 w-4" /> : 
                    <ChevronDown className="ml-1 h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndSortedSubmissions().map((item) => {
            const form = forms.find(f => f._id === item.formId);
            const deadlineStatus = getDeadlineStatus(item.latestSubmission?.createdAt, form?.deadline || '');
            
            return (
              <TableRow key={`${item.barangay}-${item.formId}`}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    {item.barangay}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                    {item.formTitle}
                  </div>
                </TableCell>
                <TableCell>
                  {getStatusIndicator(item.hasSubmission)}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={
                      deadlineStatus.color === 'green' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                      deadlineStatus.color === 'yellow' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' :
                      deadlineStatus.color === 'orange' ? 'bg-orange-100 text-orange-800 hover:bg-orange-100' :
                      deadlineStatus.color === 'red' ? 'bg-red-100 text-red-800 hover:bg-red-100' :
                      'bg-gray-100 text-gray-800 hover:bg-gray-100'
                    }
                  >
                    {deadlineStatus.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{item.submissionCount}</TableCell>
                <TableCell>
                  {item.latestSubmission ? (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      {new Date(item.latestSubmission.createdAt).toLocaleDateString()}
                    </div>
                  ) : (
                    'N/A'
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {item.hasSubmission && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchSubmissionDetails(item.latestSubmission._id)}
                      className="flex items-center gap-1"
                    >
                      <FileText size={14} />
                      Details
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Toaster
        position="top-right"
        gutter={32}
        containerClassName="!top-4 !right-6"
        toastOptions={{
          className: '!bg-[#1a1d24] !text-white !rounded-xl !border !border-[#2a2f38]',
        }}
      />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Document Tracker</h1>
          <p className="text-muted-foreground">Track all submitted reports by barangay</p>
        </div>
        <div className="flex items-center gap-2">
          {viewMode === 'simple' && selectedFormDeadline && (
            <Badge variant="outline" className="flex items-center gap-1 py-1">
              <CalendarClock size={14} />
              Deadline: {selectedFormDeadline.toLocaleDateString()}
            </Badge>
          )}
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === 'simple' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('simple')}
              className="rounded-r-none flex items-center gap-1"
            >
              <List size={14} />
              Simple View
            </Button>
            <Button
              variant={viewMode === 'full' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('full')}
              className="rounded-l-none flex items-center gap-1"
            >
              <Grid size={14} />
              Grid View
            </Button>
          </div>
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing || (viewMode === 'simple' && !selectedForm)}>
            <RefreshCw size={16} className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Report Overview</CardTitle>
          <CardDescription>
            {viewMode === 'simple' 
              ? 'Select a report form to view submission status across barangays' 
              : 'View submission status for all reports across barangays'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {viewMode === 'simple' && (
              <div className="flex-1">
                <Label htmlFor="form-select" className="text-sm font-medium mb-2 block">Select Report Form</Label>
                <Select value={selectedForm} onValueChange={setSelectedForm}>
                  <SelectTrigger id="form-select" className="w-full">
                    <SelectValue placeholder="Select a report form" />
                  </SelectTrigger>
                  <SelectContent>
                    {forms.map((form) => {
                      const deadlineDate = new Date(form.deadline);
                      const isValidDate = !isNaN(deadlineDate.getTime());
                      
                      return (
                        <SelectItem key={form._id} value={form._id}>
                          <div className="flex flex-col">
                            <span>{form.title}</span>
                            <span className="text-xs text-muted-foreground">
                              Deadline: {isValidDate ? deadlineDate.toLocaleDateString() : 'Invalid Date'}
                            </span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="flex-1">
              <Label htmlFor="search" className="text-sm font-medium mb-2 block">
                {viewMode === 'simple' ? 'Search Barangay' : 'Search Barangay or Form Title'}
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder={viewMode === 'simple' ? 'Search barangay...' : 'Search barangay or form title...'}
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <Label className="text-sm font-medium mb-2 block">Filter by Submission Status</Label>
              <div className="flex flex-wrap gap-2">
                {statusFilters.map((filter) => (
                  <Button
                    key={filter.id}
                    variant={activeStatusFilter === filter.id ? "default" : "outline"}
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => setActiveStatusFilter(filter.id)}
                  >
                    {filter.icon}
                    {filter.label}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Filter by Deadline Status</Label>
              <div className="flex flex-wrap gap-2">
                {deadlineStatusFilters.map((filter) => (
                  <Button
                    key={filter.id}
                    variant={deadlineStatusFilter === filter.id ? "default" : "outline"}
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => setDeadlineStatusFilter(filter.id)}
                  >
                    {filter.icon}
                    {filter.label}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Filter by Time Period</Label>
              <div className="flex flex-wrap gap-2">
                {timePeriodFilters.map((filter) => (
                  <Button
                    key={filter.id}
                    variant={timePeriodFilter === filter.id ? "default" : "outline"}
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => setTimePeriodFilter(filter.id)}
                  >
                    {filter.icon}
                    {filter.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : viewMode === 'simple' && !selectedForm ? (
            <div className="text-center py-12 border rounded-lg bg-muted/20">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Form Selected</h3>
              <p className="text-muted-foreground">Select a report form to view submissions</p>
            </div>
          ) : filteredAndSortedSubmissions().length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-muted/20">
              <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Submissions Found</h3>
              <p className="text-muted-foreground">No submissions match your search criteria</p>
            </div>
          ) : (
            viewMode === 'simple' ? renderSimpleView() : renderFullGridView()
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedSubmission && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Submission Details
                </DialogTitle>
                <DialogDescription>
                  Reference: {selectedSubmission.referenceNumber}
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="details" className="flex items-center gap-2">
                    <FileText size={16} />
                    Details
                  </TabsTrigger>
                  <TabsTrigger value="files" className="flex items-center gap-2">
                    <Download size={16} />
                    Files
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="details">
                  <Card>
                    <CardHeader>
                      <CardTitle>Submission Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-muted-foreground">Submitted By</Label>
                          <div className="flex items-center p-3 rounded-lg bg-muted/50">
                            <User className="h-5 w-5 mr-2 text-muted-foreground" />
                            <span>{selectedSubmission.userId.firstName} {selectedSubmission.userId.lastName}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-muted-foreground">Barangay</Label>
                          <div className="flex items-center p-3 rounded-lg bg-muted/50">
                            <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
                            <span>{selectedSubmission.userId.barangay}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                          <div className="p-3">
                            {selectedSubmission.status === 'approved' ? (
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-100 flex items-center gap-1">
                                <CheckCircle size={14} /> Approved
                              </Badge>
                            ) : selectedSubmission.status === 'rejected' ? (
                              <Badge className="bg-red-100 text-red-800 hover:bg-red-100 flex items-center gap-1">
                                <XCircle size={14} /> Rejected
                              </Badge>
                            ) : (
                              <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 flex items-center gap-1">
                                <Clock size={14} /> Pending
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-muted-foreground">Submitted On</Label>
                          <div className="flex items-center p-3 rounded-lg bg-muted/50">
                            <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                            <span>{new Date(selectedSubmission.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {selectedSubmission.formId.deadline && (
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-muted-foreground">Form Deadline</Label>
                            <div className="flex items-center p-3 rounded-lg bg-muted/50">
                              <CalendarClock className="h-5 w-5 mr-2 text-muted-foreground" />
                              <span>
                                {(() => {
                                  const deadlineDate = new Date(selectedSubmission.formId.deadline);
                                  return !isNaN(deadlineDate.getTime()) 
                                    ? deadlineDate.toLocaleDateString() 
                                    : 'Invalid Date';
                                })()}
                              </span>
                            </div>
                          </div>
                        )}

                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-muted-foreground">Deadline Status</Label>
                          <div className="p-3">
                            {(() => {
                              const deadlineStatus = getDeadlineStatus(selectedSubmission.createdAt, selectedSubmission.formId.deadline);
                              return (
                                <Badge 
                                  variant="outline" 
                                  className={
                                    deadlineStatus.color === 'green' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                                    deadlineStatus.color === 'yellow' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' :
                                    deadlineStatus.color === 'orange' ? 'bg-orange-100 text-orange-800 hover:bg-orange-100' :
                                    deadlineStatus.color === 'red' ? 'bg-red-100 text-red-800 hover:bg-red-100' :
                                    'bg-gray-100 text-gray-800 hover:bg-gray-100'
                                  }
                                >
                                  {deadlineStatus.status}
                                </Badge>
                              );
                            })()}
                          </div>
                        </div>
                      </div>

                      {selectedSubmission.comments && (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-muted-foreground">Comments</Label>
                          <div className="p-3 rounded-lg bg-muted/50 border-l-4 border-yellow-500">
                            <p className="text-sm">{selectedSubmission.comments}</p>
                          </div>
                        </div>
                      )}

                      <div className="space-y-4">
                        <Label className="text-lg font-semibold">Form Data</Label>
                        <div className="border rounded-lg p-4 space-y-4">
                          {selectedSubmission.formId.fields.map((field: any, index: number) => (
                            <div key={index} className="space-y-2">
                              <Label className="font-medium text-muted-foreground">{field.label}</Label>
                              <p className="p-2 bg-muted/30 rounded-md">
                                {selectedSubmission.data[field.label] || 'N/A'}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="files">
                  <Card>
                    <CardHeader>
                      <CardTitle>Submitted Files</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Hidden file input for all file replacements */}
                      <Input
                        type="file"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setNewFile(e.target.files[0]);
                          }
                        }}
                      />
                      
                      {selectedSubmission.files && selectedSubmission.files.length > 0 && (
                        <div className="space-y-4">
                          <h3 className="font-semibold text-lg flex items-center gap-2">
                            <FileCheck size={18} />
                            Individual Files
                          </h3>
                          <div className="grid gap-4">
                            {selectedSubmission.files.map((file, index) => (
                              <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4">
                                <div className="flex items-start gap-3">
                                  <FileText className="h-6 w-6 text-blue-500 mt-1 flex-shrink-0" />
                                  <div>
                                    <p className="font-medium">{file.filename}</p>
                                    <p className="text-sm text-muted-foreground">{file.mimetype}</p>
                                  </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2">
                                  <Button size="sm" asChild className="flex items-center gap-2">
                                    <a href={file.url} target="_blank" rel="noopener noreferrer">
                                      <Download size={14} />
                                      Download
                                    </a>
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="flex items-center gap-2"
                                    onClick={() => triggerFileInput(index)}
                                  >
                                    <Upload size={14} />
                                    Replace
                                  </Button>
                                  {newFile && selectedFileIndex === index && (
                                    <Button 
                                      size="sm" 
                                      onClick={() => handleFileUpdate(selectedSubmission._id)}
                                      className="flex items-center gap-2"
                                    >
                                      <Upload size={14} />
                                      Upload New File
                                    </Button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedSubmission.bulkFile && selectedSubmission.bulkFile.fileName && (
                        <div className="space-y-4">
                          <h3 className="font-semibold text-lg flex items-center gap-2">
                            <FileCheck size={18} />
                            Bulk File
                          </h3>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4">
                            <div className="flex items-start gap-3">
                              <FileText className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                              <div>
                                <p className="font-medium">{selectedSubmission.bulkFile.fileName}</p>
                                <p className="text-sm text-muted-foreground">Bulk submission file</p>
                              </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2">
                              <Button size="sm" asChild className="flex items-center gap-2">
                                <a href={selectedSubmission.bulkFile.fileUrl} target="_blank" rel="noopener noreferrer">
                                  <File size={14} />
                                  View
                                </a>
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="flex items-center gap-2"
                                onClick={() => triggerFileInput(-1)}
                              >
                                <Upload size={14} />
                                Replace
                              </Button>
                              {newFile && selectedFileIndex === -1 && (
                                <Button 
                                  size="sm" 
                                  onClick={() => handleFileUpdate(selectedSubmission._id)}
                                  className="flex items-center gap-2"
                                >
                                  <Upload size={14} />
                                  Upload New File
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="history">
                  <Card>
                    <CardHeader>
                      <CardTitle>Submission History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedSubmission.history && selectedSubmission.history.length > 0 ? (
                        <div className="space-y-4">
                          {selectedSubmission.history.map((event, index) => (
                            <div key={index} className="flex gap-4">
                              <div className="flex flex-col items-center">
                                <div className={`h-4 w-4 rounded-full ${index === 0 ? 'bg-primary' : 'bg-muted-foreground'}`}></div>
                                {index < selectedSubmission.history.length - 1 && (
                                  <div className="w-0.5 h-16 bg-muted my-1"></div>
                                )}
                              </div>
                              <div className="flex-1 pb-6">
                                <p className="font-medium">{event.document}</p>
                                <p className="text-sm text-muted-foreground">
                                  By {event.lguName} on {new Date(event.timestamp).toLocaleString()}
                                </p>
                                <div className="mt-2">
                                  {event.status === 'approved' ? (
                                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100 flex items-center gap-1">
                                      <CheckCircle size={14} /> Approved
                                    </Badge>
                                  ) : event.status === 'rejected' ? (
                                    <Badge className="bg-red-100 text-red-800 hover:bg-red-100 flex items-center gap-1">
                                      <XCircle size={14} /> Rejected
                                    </Badge>
                                  ) : (
                                    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 flex items-center gap-1">
                                      <Clock size={14} /> Pending
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <Clock className="mx-auto h-12 w-12 mb-4" />
                          <p>No history available for this submission</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentTracker;