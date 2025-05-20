// components/ReportList.tsx
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Badge } from "../../ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../ui/pagination";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  SearchIcon,
  SlidersIcon,
  FileTextIcon,
  CalendarIcon,
  CheckCircleIcon,
  EyeIcon,
  FilterIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { Skeleton } from "../../ui/skeleton";

type Report = {
  _id: string;
  title: string;
  fields: any[];
  createdAt: string;
  hasSubmitted: boolean;
};

interface ReportListProps {
  currentReport: Report[];
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  handleViewDetails: (id: string) => void;
  isLoading?: boolean;
}

export const ReportList = ({
  currentReport,
  currentPage,
  totalPages,
  setCurrentPage,
  handleViewDetails,
  isLoading = false,
}: ReportListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [statusFilter, setStatusFilter] = useState<"all" | "submitted" | "pending">("all");

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ChevronUpIcon className="ml-1 h-4 w-4 inline" />
    ) : (
      <ChevronDownIcon className="ml-1 h-4 w-4 inline" />
    );
  };

  // Function to get page range to display
  const getPageRange = () => {
    const delta = 2; // Number of pages to show before and after current page
    let range = [];
    
    // Always include page 1
    range.push(1);
    
    // Calculate range of pages around current page
    for (let i = currentPage - delta; i <= currentPage + delta; i++) {
      if (i > 1 && i < totalPages) {
        range.push(i);
      }
    }
    
    // Always include last page if there's more than one page
    if (totalPages > 1) {
      range.push(totalPages);
    }
    
    // Sort and deduplicate
    range = [...new Set(range)].sort((a, b) => a - b);
    
    // Add ellipses where needed
    let result = [];
    let prevPage = null;
    
    for (const page of range) {
      if (prevPage && page - prevPage > 1) {
        result.push("ellipsis");
      }
      result.push(page);
      prevPage = page;
    }
    
    return result;
  };

  return (
    <Card className="shadow-md border-gray-200 dark:bg-gray-800/95 dark:border-gray-700 transition-all">
      <CardHeader className="bg-gray-50 dark:bg-gray-800 rounded-t-lg border-b dark:border-gray-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <FileTextIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <CardTitle className="text-xl font-bold">Official Public Reports</CardTitle>
            </div>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              View and manage all government-issued reports and updates
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-auto">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                placeholder="Search reports..."
                className="pl-9 w-full md:w-64 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-10 w-10">
                  <FilterIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className={statusFilter === "all" ? "bg-gray-100 dark:bg-gray-700" : ""}
                  onClick={() => setStatusFilter("all")}
                >
                  <span className="w-4 h-4 mr-2">{statusFilter === "all" && <CheckCircleIcon className="h-4 w-4 text-green-500" />}</span>
                  All Reports
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={statusFilter === "submitted" ? "bg-gray-100 dark:bg-gray-700" : ""}
                  onClick={() => setStatusFilter("submitted")}
                >
                  <span className="w-4 h-4 mr-2">{statusFilter === "submitted" && <CheckCircleIcon className="h-4 w-4 text-green-500" />}</span>
                  Submitted
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={statusFilter === "pending" ? "bg-gray-100 dark:bg-gray-700" : ""}
                  onClick={() => setStatusFilter("pending")}
                >
                  <span className="w-4 h-4 mr-2">{statusFilter === "pending" && <CheckCircleIcon className="h-4 w-4 text-green-500" />}</span>
                  Pending
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader className="bg-gray-50 dark:bg-gray-800/70">
              <TableRow>
                <TableHead 
                  className="font-semibold cursor-pointer"
                  onClick={() => handleSort("id")}
                >
                  <div className="flex items-center">
                    Report ID {getSortIcon("id")}
                  </div>
                </TableHead>
                <TableHead 
                  className="font-semibold cursor-pointer"
                  onClick={() => handleSort("title")}
                >
                  <div className="flex items-center">
                    Title {getSortIcon("title")}
                  </div>
                </TableHead>
                <TableHead
                  className="font-semibold cursor-pointer"
                  onClick={() => handleSort("fields")}
                >
                  <div className="flex items-center">
                    Fields {getSortIcon("fields")}
                  </div>
                </TableHead>
                <TableHead
                  className="font-semibold cursor-pointer"
                  onClick={() => handleSort("date")}
                >
                  <div className="flex items-center">
                    Date Created {getSortIcon("date")}
                  </div>
                </TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <TableRow key={`skeleton-${i}`}>
                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : currentReport.length > 0 ? (
                currentReport.map((report) => (
                  <TableRow
                    key={report._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <TableCell className="font-medium">
                      <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 py-1 px-2 rounded">
                        #{report._id.substring(0, 6)}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-xs md:max-w-md truncate font-medium">
                      {report.title}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">
                        {report.fields.length} fields
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <CalendarIcon className="h-3 w-3" />
                        {new Date(report.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </TableCell>
                    
                    <TableCell className="text-center">
                      <Button
                        variant={report.hasSubmitted ? "outline" : "default"}
                        size="sm"
                        onClick={() => handleViewDetails(report._id)}
                        className={report.hasSubmitted 
                          ? "text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/20" 
                          : "bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700"}
                      >
                        <EyeIcon className="mr-1 h-3.5 w-3.5" />
                        {report.hasSubmitted ? "View" : "View Details"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center justify-center p-6">
                      <FileTextIcon className="h-10 w-10 text-gray-400 dark:text-gray-600 mb-2" />
                      <p>No reports found</p>
                      <p className="text-sm">Try adjusting your search or filters</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Enhanced Pagination */}
        {totalPages > 0 && (
          <div className="py-4 px-6 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/70 rounded-b-lg">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing page {currentPage} of {totalPages}
              </p>
              
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      className={
                        currentPage === 1 
                          ? "opacity-50 cursor-not-allowed" 
                          : "hover:bg-gray-100 dark:hover:bg-gray-700"
                      }
                      onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                    />
                  </PaginationItem>

                  {getPageRange().map((page, i) => 
                    page === "ellipsis" ? (
                      <PaginationItem key={`ellipsis-${i}`}>
                        <span className="px-2">...</span>
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={`page-${page}`}>
                        <PaginationLink
                          isActive={currentPage === page}
                          onClick={() => setCurrentPage(page as number)}
                          className={currentPage === page 
                            ? "bg-blue-600 text-white hover:bg-blue-700 border-blue-600" 
                            : "hover:bg-gray-100 dark:hover:bg-gray-700"}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}

                  <PaginationItem>
                    <PaginationNext
                      className={
                        currentPage === totalPages
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700"
                      }
                      onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};