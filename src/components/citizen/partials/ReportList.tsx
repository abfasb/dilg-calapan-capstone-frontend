// components/ReportList.tsx
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
  }
  
  export const ReportList = ({
    currentReport,
    currentPage,
    totalPages,
    setCurrentPage,
    handleViewDetails,
  }: ReportListProps) => {
    return (
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle>Official Public Reports</CardTitle>
              <CardDescription>
                View all government-issued reports and updates
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table className="dark:bg-gray-800">
            <TableHeader className="dark:bg-gray-700">
              <TableRow>
                <TableHead>Report ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Fields</TableHead>
                <TableHead>Date Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentReport.map((report) => (
                <TableRow
                  key={report._id}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <TableCell className="font-medium text-sm">
                    <span className="font-mono">#{report._id.substring(0, 6)}</span>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {report.title}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{report.fields.length} fields</Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(report.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    {report.hasSubmitted ? (
                      <Badge
                        variant="outline"
                        className="dark:bg-green-900/20 dark:text-green-400"
                      >
                        Submitted
                      </Badge>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(report._id)}
                        className="dark:bg-gray-700 dark:hover:bg-gray-600"
                      >
                        View Details
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
  
          {/* Pagination */}
          <div className="mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    className={
                      currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                    }
                    onClick={() =>
                      currentPage > 1 && setCurrentPage(currentPage - 1)
                    }
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
                    className={
                      currentPage === totalPages
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }
                    onClick={() =>
                      currentPage < totalPages && setCurrentPage(currentPage + 1)
                    }
                    size={6}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    );
  };
  