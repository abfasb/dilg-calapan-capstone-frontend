import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { useAuditLogs } from '../../../hooks/use-audit-logs';
import { 
  Activity,
  ArrowUpDown,
  Calendar,
  Download,
  Eye,
  Flag,
  MoreHorizontal,
  Search 
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
import { Card } from '../../ui/card';
import { Input } from '../../ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import { DatePickerWithRange } from './date-range-picker';
import { Combobox } from './ComboBox';
import { Skeleton } from '../../ui/skeleton';

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

  const actionTypes = [
    'all',
    'Logged in',
    'Document Approval',
    'File Upload',
    'Policy Update',
    'User Permission Changed'
  ];

  if (error) {
    return (
      <div className="p-6 text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Audit Trail System
          </h1>
          <p className="text-muted-foreground mt-1">
            DILG eGov Nexus Administrative Monitoring
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Filters Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-blue-50/50">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Total Events</p>
              <p className="text-2xl font-bold mt-1">
                {loading ? <Skeleton className="h-8 w-20" /> : totalItems}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <div className="lg:col-span-3 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <DatePickerWithRange
            dateRange={dateRange}
            onDateRangeChange={(range) => {
              if (range) setDateRange(range);
            }}
            
            className="w-full sm:w-[300px]"
          />
          <Combobox 
            options={actionTypes}
            value={selectedAction}
            onChange={setSelectedAction}
            placeholder="Filter Actions"
            className="w-full sm:w-[200px]"
          />
        </div>
      </div>

      {/* Audit Logs Table */}
      <Card className="overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              {['Timestamp', 'User', 'Role', 'Action', 'IP Address', 'Device'].map((header) => (
                <TableHead key={header} className="font-semibold">
                  {header}
                </TableHead>
              ))}
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array(5).fill(0).map((_, i) => (
                <TableRow key={i}>
                  {Array(6).fill(0).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              logs.map((log) => (
                <TableRow key={log._id} className="hover:bg-gray-50/50">
                  <TableCell>
                    {format(parseISO(log.timestamp), 'MMM dd, yyyy HH:mm')}
                  </TableCell>
                  <TableCell className="font-medium text-blue-600">
                    {log.email}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{log.role}</Badge>
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate">
                    {log.action}
                  </TableCell>
                  <TableCell>{log.ipAddress}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {log.userAgent}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2">
                          <Eye className="h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-red-600">
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
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {loading ? (
            <Skeleton className="h-4 w-48" />
          ) : (
            `Showing ${(currentPage - 1) * 10 + 1}-${Math.min(
              currentPage * 10,
              totalItems
            )} of ${totalItems} results`
          )}
        </p>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1 || loading}
          >
            Previous
          </Button>
          <Button 
            variant="outline"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || loading}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};