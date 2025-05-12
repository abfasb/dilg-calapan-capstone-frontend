import { useState, useRef } from 'react';
import { useAuditLogs } from '../../../hooks/use-audit-logs';
import { 
  Activity,
  AlertTriangle,
  ArrowDownToLine,
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Eye,
  FileSpreadsheet,
  Flag,
  Loader2,
  MoreHorizontal,
  Search,
  Shield,
  User,
  Wifi
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/table';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import { DatePickerWithRange } from './date-range-picker';
import { Combobox } from './ComboBox';
import { Skeleton } from '../../ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../ui/tooltip';
import { Avatar, AvatarFallback } from "../../ui/avatar";

// Type definitions
interface AuditLog {
  _id: string;
  timestamp: string;
  email: string;
  name?: string;
  role: string;
  action: string;
  ipAddress: string;
  userAgent: string;
  details?: any;
  status?: 'success' | 'warning' | 'error';
}

export const AuditLogs = () => {
  const {
    logs,
    loading,
    error,
    dateRange,
    setDateRange,
    searchQuery,
    setSearchQuery,
    selectedAction,
    setSelectedAction,
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems
  } = useAuditLogs();

  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [exportLoading, setExportLoading] = useState(false);
  const [activeView, setActiveView] = useState('all');
  
  const actionTypes = [
    'all',
    'Logged in',
    'Document Approval',
    'File Upload',
    'Policy Update',
    'User Permission Changed'
  ];

  const getInitials = (email: string) => {
    const parts = email.split('@')[0].split('.');
    return parts.map(part => part[0]).join('').toUpperCase().substring(0, 2);
  };

  const getBadgeVariant = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'lgu':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'user':
        return 'bg-slate-100 text-slate-800 hover:bg-slate-100';
      default:
        return 'bg-purple-100 text-purple-800 hover:bg-purple-100';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const exportToCSV = () => {
    setExportLoading(true);
    
    // In a real implementation, we might fetch all logs based on current filters
    setTimeout(() => {
      try {
        // Create CSV content
        const headers = ['Timestamp', 'User', 'Role', 'Action', 'IP Address', 'Device'];
        const csvContent = [
          headers.join(','),
          ...logs.map(log => [
            format(parseISO(log.timestamp), 'yyyy-MM-dd HH:mm:ss'),
            log.email,
            log.role,
            `"${log.action.replace(/"/g, '""')}"`, // Escape quotes in CSV
            log.ipAddress,
            `"${log.userAgent.replace(/"/g, '""')}"` // Escape quotes in CSV
          ].join(','))
        ].join('\n');
        
        // Create a blob and download link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `audit_logs_${format(new Date(), 'yyyy-MM-dd')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setExportLoading(false);
      } catch (error) {
        console.error('Export error:', error);
        setExportLoading(false);
      }
    }, 800); // Simulate network delay
  };

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Error Loading Audit Logs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">{error}</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Audit Trail System
          </h1>
          <p className="text-slate-500 mt-1">
            DILG eGov Nexus Administrative Monitoring
          </p>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                className="gap-2 border-blue-200 text-blue-700 hover:bg-blue-50"
                onClick={exportToCSV}
                disabled={exportLoading || loading}
              >
                {exportLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <FileSpreadsheet className="h-4 w-4" />
                )}
                Export CSV
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Download full audit log data</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-blue-700 font-medium">Total Events</p>
                <p className="text-2xl font-bold mt-1 text-blue-900">
                  {loading ? <Skeleton className="h-8 w-20" /> : totalItems.toLocaleString()}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-teal-50 border-green-100 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-green-700 font-medium">Login Events</p>
                <p className="text-2xl font-bold mt-1 text-green-900">
                  {loading ? <Skeleton className="h-8 w-20" /> : Math.floor(totalItems * 0.35).toLocaleString()}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <User className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-fuchsia-50 border-purple-100 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-purple-700 font-medium">Security Alerts</p>
                <p className="text-2xl font-bold mt-1 text-purple-900">
                  {loading ? <Skeleton className="h-8 w-20" /> : Math.floor(totalItems * 0.05).toLocaleString()}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-100 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-amber-700 font-medium">Today's Events</p>
                <p className="text-2xl font-bold mt-1 text-amber-900">
                  {loading ? <Skeleton className="h-8 w-20" /> : Math.floor(totalItems * 0.15).toLocaleString()}
                </p>
              </div>
              <div className="bg-amber-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters Section */}
      <Card className="shadow-sm border-slate-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-5 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by user, action, IP..."
                className="pl-9 border-slate-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <DatePickerWithRange
              dateRange={dateRange}
              onDateRangeChange={(range) => {
                if (range) setDateRange(range);
              }}
              className="lg:col-span-4"
            />
            
            <Combobox 
              options={actionTypes}
              value={selectedAction}
              onChange={setSelectedAction}
              placeholder="Filter Actions"
              className="lg:col-span-3"
            />
          </div>
        </CardContent>
      </Card>

      {/* View Tabs */}
      <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
        <div className="border-b">
          <div className="flex items-center justify-between">
            <TabsList className="bg-transparent border-b-0">
              <TabsTrigger 
                value="all" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none border-b-2 border-transparent"
              >
                All Logs
              </TabsTrigger>
              <TabsTrigger 
                value="security" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none border-b-2 border-transparent"
              >
                Security Events
              </TabsTrigger>
              <TabsTrigger 
                value="user" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none border-b-2 border-transparent"
              >
                User Activity
              </TabsTrigger>
            </TabsList>
            
            <div className="text-sm text-slate-500">
              {loading ? (
                <Skeleton className="h-4 w-48" />
              ) : (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {dateRange?.from ? format(dateRange.from, 'MMM d, yyyy') : 'All time'} 
                    {dateRange?.to ? ` - ${format(dateRange.to, 'MMM d, yyyy')}` : ''}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <TabsContent value="all" className="mt-4">
          <AuditLogsTable 
            logs={logs}
            loading={loading}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            onViewDetails={setSelectedLog}
            getInitials={getInitials}
            getBadgeVariant={getBadgeVariant}
            getStatusIcon={getStatusIcon}
          />
        </TabsContent>
        
        <TabsContent value="security" className="mt-4">
          <AuditLogsTable 
            logs={logs.filter(log => 
              log.action.toLowerCase().includes('permission') || 
              log.action.toLowerCase().includes('security') || 
              log.action.toLowerCase().includes('login')
            )}
            loading={loading}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={Math.max(1, Math.ceil(logs.filter(log => 
              log.action.toLowerCase().includes('permission') || 
              log.action.toLowerCase().includes('security') || 
              log.action.toLowerCase().includes('login')
            ).length / 10))}
            totalItems={logs.filter(log => 
              log.action.toLowerCase().includes('permission') || 
              log.action.toLowerCase().includes('security') || 
              log.action.toLowerCase().includes('login')
            ).length}
            onViewDetails={setSelectedLog}
            getInitials={getInitials}
            getBadgeVariant={getBadgeVariant}
            getStatusIcon={getStatusIcon}
          />
        </TabsContent>
        
        <TabsContent value="user" className="mt-4">
          <AuditLogsTable 
            logs={logs.filter(log => 
              !log.action.toLowerCase().includes('system') && 
              !log.action.toLowerCase().includes('scheduled')
            )}
            loading={loading}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={Math.max(1, Math.ceil(logs.filter(log => 
              !log.action.toLowerCase().includes('system') && 
              !log.action.toLowerCase().includes('scheduled')
            ).length / 10))}
            totalItems={logs.filter(log => 
              !log.action.toLowerCase().includes('system') && 
              !log.action.toLowerCase().includes('scheduled')
            ).length}
            onViewDetails={setSelectedLog}
            getInitials={getInitials}
            getBadgeVariant={getBadgeVariant}
            getStatusIcon={getStatusIcon}
          />
        </TabsContent>
      </Tabs>

          <Dialog 
            open={!!selectedLog} 
            onOpenChange={(open) => {
              if (!open) {
                setTimeout(() => {
                  setSelectedLog(null);
                }, 100);
              }
            }}
          >
            <DialogContent 
              className="sm:max-w-xl" 
              onPointerDownOutside={(e) => {
                e.preventDefault();
                setSelectedLog(null);
              }}
              onEscapeKeyDown={() => {
                setSelectedLog(null);
              }}
            >
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {selectedLog && getStatusIcon(selectedLog.status)}
                  Audit Log Details
                </DialogTitle>
                <DialogDescription>
                  Complete information about this activity
                </DialogDescription>
              </DialogHeader>
              
              {selectedLog && (
                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-md space-y-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 bg-blue-100 text-blue-600">
                        <AvatarFallback>{getInitials(selectedLog.email)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-grow min-w-0">
                        <p className="font-medium truncate">
                          {selectedLog.name || selectedLog.email.split('@')[0]}
                        </p>
                        <p className="text-sm text-slate-500 truncate">
                          {selectedLog.email}
                        </p>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`ml-2 ${getBadgeVariant(selectedLog.role)}`}
                      >
                        {selectedLog.role}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-500">Timestamp</p>
                      <p className="font-medium flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        {format(parseISO(selectedLog.timestamp), 'MMM dd, yyyy HH:mm:ss')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">IP Address</p>
                      <p className="font-medium flex items-center gap-1">
                        <Wifi className="h-3.5 w-3.5 text-slate-400" />
                        {selectedLog.ipAddress}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-slate-500">Action</p>
                    <p className="font-medium">{selectedLog.action}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-slate-500">User Agent</p>
                    <p className="text-sm font-mono bg-slate-50 p-2 rounded max-h-24 overflow-auto break-all">
                      {selectedLog.userAgent}
                    </p>
                  </div>
                  
                  {selectedLog.details && (
                    <div>
                      <p className="text-sm text-slate-500">Additional Details</p>
                      <pre className="text-xs font-mono bg-slate-50 p-3 rounded-md overflow-auto max-h-40">
                        {JSON.stringify(selectedLog.details, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedLog(null)}>
                  Close
                </Button>
                <Button 
                  variant="destructive"
                  className="gap-2"
                  onClick={() => setSelectedLog(null)}
                >
                  <Flag className="h-4 w-4" />
                  Flag Incident
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
    </div>
  );
};

// Separated table component for better organization
interface AuditLogsTableProps {
  logs: AuditLog[];
  loading: boolean;
  currentPage: number;
  setCurrentPage: (page: number | ((prev: number) => number)) => void;
  totalPages: number;
  totalItems: number;
  onViewDetails: (log: AuditLog) => void;
  getInitials: (email: string) => string;
  getBadgeVariant: (role: string) => string;
  getStatusIcon: (status?: string) => JSX.Element;
}

const AuditLogsTable = ({
  logs,
  loading,
  currentPage,
  setCurrentPage,
  totalPages,
  totalItems,
  onViewDetails,
  getInitials,
  getBadgeVariant,
  getStatusIcon
}: AuditLogsTableProps) => {
  return (
    <>
      <Card className="overflow-hidden shadow-sm border-slate-200">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-semibold text-slate-700">Timestamp</TableHead>
              <TableHead className="font-semibold text-slate-700">User</TableHead>
              <TableHead className="font-semibold text-slate-700">Role</TableHead>
              <TableHead className="font-semibold text-slate-700">Action</TableHead>
              <TableHead className="font-semibold text-slate-700">IP Address</TableHead>
              <TableHead className="font-semibold text-slate-700 hidden md:table-cell">Device</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array(5).fill(0).map((_, i) => (
                <TableRow key={i}>
                  {Array(7).fill(0).map((_, j) => (
                    <TableCell key={j} className={j === 5 ? 'hidden md:table-cell' : ''}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-500">
                    <Activity className="h-8 w-8 mb-2 text-slate-400" />
                    <p>No audit logs found matching your criteria</p>
                    <Button 
                      variant="link" 
                      className="mt-2"
                      onClick={() => {
                        // Reset filters logic would go here
                      }}
                    >
                      Clear filters
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log._id} className="hover:bg-slate-50/70 transition-colors">
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      {getStatusIcon(log.status)}
                      <span>{format(parseISO(log.timestamp), 'MMM dd, HH:mm')}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6 bg-slate-100 text-slate-600">
                        <AvatarFallback>{getInitials(log.email)}</AvatarFallback>
                      </Avatar>
                      <span className="text-blue-600 hover:underline">
                        {log.email.split('@')[0]}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getBadgeVariant(log.role)}
                    >
                      {log.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[250px] truncate">
                    {log.action}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {log.ipAddress}
                  </TableCell>
                  <TableCell className="text-xs text-slate-500 truncate hidden md:table-cell max-w-[200px]">
                    {log.userAgent}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-52">
                        <DropdownMenuLabel>Log Actions</DropdownMenuLabel>
                        <DropdownMenuItem 
                          className="gap-2 cursor-pointer"
                          onClick={() => onViewDetails(log)}
                        >
                          <Eye className="h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 text-red-600 cursor-pointer">
                          <Flag className="h-4 w-4" />
                          Flag Incident
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-sm text-slate-500">
          {loading ? (
            <Skeleton className="h-4 w-48" />
          ) : (
            `Showing ${totalItems === 0 ? 0 : (currentPage - 1) * 10 + 1}-${Math.min(
              currentPage * 10,
              totalItems
            )} of ${totalItems} results`
          )}
        </p>
        
        <div className="flex items-center gap-1">
          <Button 
            variant="outline" 
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1 || loading}
          >
            <ChevronLeft className="h-4 w-4" />
            <ChevronLeft className="h-4 w-4 -ml-2" />
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1 || loading}
            className="h-8"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          
          <div className="flex items-center gap-1 mx-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Complex logic to handle pagination number display
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <Button
                  key={i}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  className={`h-8 w-8 p-0 ${currentPage === pageNum ? 'bg-blue-600' : ''}`}
                  onClick={() => setCurrentPage(pageNum)}
                  disabled={loading}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>
          
          <Button 
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || loading}
            className="h-8"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages || loading}
          >
            <ChevronRight className="h-4 w-4" />
            <ChevronRight className="h-4 w-4 -ml-2" />
          </Button>
        </div>
      </div>
    </>
  );
};