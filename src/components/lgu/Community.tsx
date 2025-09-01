"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { toast, Toaster } from 'react-hot-toast'
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from 'recharts';
import barangays from '../../types/barangays';
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious, PaginationEllipsis, PaginationLink } from '../ui/pagination';

interface Form {
  _id: string;
  title: string;
}

interface BarangayStatus {
  barangayId: string;
  barangayName: string;
  submitted: boolean;
  submissionDate: string | null;
  overallStatus: 'completed' | 'pending';
}

const COLORS = ['#FF8042', '#00C49F'];

const Community = () => {
  const [forms, setForms] = useState<Form[]>([]);
  const [selectedForm, setSelectedForm] = useState<string>('');
  const [barangayStatuses, setBarangayStatuses] = useState<BarangayStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'table' | 'analytics'>('table');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const totalPages = Math.ceil(barangayStatuses.length / itemsPerPage);
  
  // Get current barangays for pagination
  const currentBarangays = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return barangayStatuses.slice(startIndex, endIndex);
  }, [currentPage, itemsPerPage, barangayStatuses]);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/monitoring/get-forms`);
        const data = await response.json();
        setForms(data);
        if (data.length > 0) setSelectedForm(data[0]._id);
      } catch (error) {
        console.error('Error fetching forms:', error);
      }
    };

    fetchForms();
  }, []);

  useEffect(() => {
    const fetchSubmissionStatus = async () => {
      if (!selectedForm) return;
      
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/monitoring/get-monitoring?formId=${selectedForm}`);
        const data: BarangayStatus[] = await response.json();
        setBarangayStatuses(data);
        setCurrentPage(1); 
      } catch (error) {
        console.error('Error fetching submission status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissionStatus();
  }, [selectedForm]);

  const analyticsData = useMemo(() => {
    const statusCounts = {
      completed: 0,
      pending: 0
    };

    barangayStatuses.forEach(barangay => {
      statusCounts[barangay.overallStatus]++;
    });

    const totalBarangays = barangayStatuses.length;
    const completedBarangays = statusCounts.completed;
    const completionRate = totalBarangays > 0 
      ? (completedBarangays / totalBarangays) * 100 
      : 0;

    const completedBarangaysList = barangayStatuses.filter(b => b.submitted);
    const pendingBarangaysList = barangayStatuses.filter(b => !b.submitted);

    return {
      statusCounts,
      completedBarangaysList,
      pendingBarangaysList,
      totalBarangays,
      completedBarangays,
      completionRate
    };
  }, [barangayStatuses]);

  const handleNotifyBarangay = async (barangayId: string) => {
    if (!notificationMessage.trim()) {
      alert('Please enter a notification message');
      return;
    }
    
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/monitoring/send-notification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formId: selectedForm,
          barangayId,
          message: notificationMessage
        })
      });
      toast.success('Notification sent successfully!')
      setNotificationMessage('');
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Failed to send notification');
    }
  };

  const getStatusColor = (status: 'completed' | 'pending') => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'pending': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: 'completed' | 'pending') => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'pending': return 'Pending';
      default: return 'Unknown';
    }
  };

  const statusChartData = [
    { name: 'Completed', value: analyticsData.statusCounts.completed, color: '#00C49F' },
    { name: 'Pending', value: analyticsData.statusCounts.pending, color: '#FF8042' },
  ];

  // Pagination handlers
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink 
            href="#" 
            isActive={i === currentPage}
            className='text-cyan-600'
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(i);
            }}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return pages;
  };

  return (
    <div className="space-y-8">
      <Toaster
        position="top-right"
        gutter={32}
        containerClassName="!top-4 !right-6"
        toastOptions={{
          className: '!bg-[#1a1d24] !text-white !rounded-xl !border !border-[#2a2f38]',
        }}
      />
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-cyan-400">Monitoring and Submissions</h1>
        <div className="flex space-x-2">
          <Button 
            variant={activeTab === 'table' ? 'default' : 'outline'} 
            className="bg-cyan-600 hover:bg-cyan-700 text-white"
            onClick={() => setActiveTab('table')}
          >
            Data Table
          </Button>
          <Button 
            variant={activeTab === 'analytics' ? 'default' : 'outline'} 
            className="bg-cyan-600 hover:bg-cyan-700 text-white"
            onClick={() => setActiveTab('analytics')}
          >
            Analytics Dashboard
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-cyan-600 to-blue-500 border-0 text-white">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Barangays</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analyticsData.totalBarangays}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-emerald-500 border-0 text-white">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Completed Barangays</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analyticsData.completedBarangays}</div>
            <div className="text-sm mt-1">
              {Math.round(analyticsData.completionRate)}% completion rate
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-rose-500 to-red-500 border-0 text-white">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Pending Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analyticsData.statusCounts.pending}</div>
            <div className="text-sm mt-1">
              Barangays need to submit
            </div>
          </CardContent>
        </Card>
      </div>

      {activeTab === 'table' ? (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-white">Monitoring</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
              <div className="w-full md:w-64">
                <Select value={selectedForm} onValueChange={setSelectedForm}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select a form" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    {forms.map(form => (
                      <SelectItem key={form._id} value={form._id}>
                        {form.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex-1 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                <input
                  type="text"
                  value={notificationMessage}
                  onChange={(e) => setNotificationMessage(e.target.value)}
                  placeholder="Enter notification message"
                  className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                />
                <Button 
                  variant="outline"
                  className="bg-cyan-600 hover:bg-cyan-700 text-white whitespace-nowrap"
                  onClick={() => {
                    const pendingBarangays = barangayStatuses.filter(b => b.overallStatus === 'pending');
                    if (pendingBarangays.length === 0) {
                      alert('All barangays have completed submissions!');
                      return;
                    }
                    if (!notificationMessage.trim()) {
                      alert('Please enter a notification message');
                      return;
                    }
                    if (confirm(`Send notification to ${pendingBarangays.length} barangays?`)) {
                      pendingBarangays.forEach(b => handleNotifyBarangay(b.barangayId));
                    }
                  }}
                >
                  Notify All Pending
                </Button>
              </div>
              
              {/* Items per page selector */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-300">Show:</span>
                <Select 
                  value={itemsPerPage.toString()} 
                  onValueChange={handleItemsPerPageChange}
                >
                  <SelectTrigger className="w-20 bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-gray-300">entries</span>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
              </div>
            ) : (
              <>
                <Table className="border border-gray-700 rounded-lg">
                  <TableHeader>
                    <TableRow className="hover:bg-gray-800">
                      <TableHead className="text-white">Barangay</TableHead>
                      <TableHead className="text-white">Status</TableHead>
                      <TableHead className="text-white">Submission Date</TableHead>
                      <TableHead className="text-white">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentBarangays.map((barangay) => (
                      <TableRow key={barangay.barangayId} className="hover:bg-gray-800">
                        <TableCell className="font-medium text-white">
                          {barangay.barangayName}
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(barangay.overallStatus)} text-white`}>
                            {getStatusText(barangay.overallStatus)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-white">
                          {barangay.submissionDate 
                            ? new Date(barangay.submissionDate).toLocaleDateString() 
                            : 'Not submitted'}
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outline"
                            className="bg-cyan-600 hover:bg-cyan-700 text-white hover:text-white"
                            onClick={() => handleNotifyBarangay(barangay.barangayId)}
                            disabled={!notificationMessage.trim() || barangay.submitted}
                          >
                            {barangay.submitted ? 'Submitted' : 'Notify'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {/* Pagination Controls */}
                <div className="flex flex-col md:flex-row items-center justify-between mt-6 space-y-4 md:space-y-0">
                  <div className="text-sm text-gray-400">
                    Showing {Math.min((currentPage - 1) * itemsPerPage + 1, barangayStatuses.length)} to{' '}
                    {Math.min(currentPage * itemsPerPage, barangayStatuses.length)} of{' '}
                    {barangayStatuses.length} entries
                  </div>
                  
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(currentPage - 1);
                          }}
                          className={`px-3 py-2 rounded-md bg-gray-800 text-white hover:bg-gray-700 transition 
                                      ${currentPage === 1 ? 'pointer-events-none opacity-50' : ''}`}
                        />
                      </PaginationItem>
                      
                      {renderPageNumbers()}
                      
                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                      
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) =>  {
                            e.preventDefault();
                            handlePageChange(currentPage + 1);
                          }}
                          className={`px-3 py-2 rounded-md bg-gray-800 text-white hover:bg-white hover:text-blacks transition 
                                      ${currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}`}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Distribution */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-white">
                Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} barangays`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Completion Progress */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-white">
                Completion Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl font-bold text-cyan-400 mb-2">
                  {Math.round(analyticsData.completionRate)}%
                </div>
                <div className="text-gray-300">Overall Completion Rate</div>
                <div className="w-64 h-4 bg-gray-700 rounded-full mt-6 mx-auto">
                  <div 
                    className="h-4 rounded-full bg-green-500 transition-all duration-500"
                    style={{ width: `${analyticsData.completionRate}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-400 mt-2">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Completed Barangays */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-white">
                Completed Barangays
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {analyticsData.completedBarangaysList.map((barangay, index) => (
                  <div key={barangay.barangayId} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-500 text-white mr-3">
                        {index + 1}
                      </div>
                      <span className="font-medium text-white">{barangay.barangayName}</span>
                    </div>
                    <div className="text-sm text-gray-300">
                      {barangay.submissionDate ? new Date(barangay.submissionDate).toLocaleDateString() : ''}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending Barangays */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-white">
                Pending Barangays
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {analyticsData.pendingBarangaysList.map((barangay, index) => (
                  <div key={barangay.barangayId} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500 text-white mr-3">
                        {index + 1}
                      </div>
                      <span className="font-medium text-white">{barangay.barangayName}</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="bg-cyan-600 hover:bg-cyan-700 text-white"
                      onClick={() => handleNotifyBarangay(barangay.barangayId)}
                      disabled={!notificationMessage.trim()}
                    >
                      Notify
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Community;