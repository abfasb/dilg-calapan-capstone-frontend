import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { Input } from "../ui/input";
import { FiPlus, FiActivity, FiUserCheck, FiUsers, FiChevronUp, FiChevronDown, FiClock } from "react-icons/fi";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { cn } from "../../lib/utils";

interface StaffMember {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  position: string;
  phoneNumber: string;
  barangay: string;
  lastActivity: Date;
  avatarUrl?: string;
}

type SortKey = keyof StaffMember;
type SortDirection = 'asc' | 'desc';

export default function Staff() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection } | null>({
    key: 'lastActivity',
    direction: 'desc'
  });
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/staff`);
        const data = await response.json();
        setStaff(data);
      } catch (error) {
        console.error("Error fetching staff:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
    const interval = setInterval(fetchStaff, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSort = (key: SortKey) => {
    let direction: SortDirection = 'asc';
    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedStaff = [...staff].sort((a, b) => {
    if (!sortConfig) return 0;
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortConfig.direction === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (aValue instanceof Date && bValue instanceof Date) {
      return sortConfig.direction === 'asc'
        ? aValue.getTime() - bValue.getTime()
        : bValue.getTime() - aValue.getTime();
    }
    
    return 0;
  });

  const filteredStaff = sortedStaff.filter((member) => {
    const matchesSearch = `${member.firstName} ${member.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    
    if (activeTab === "active") return matchesSearch && member.isActive;
    if (activeTab === "inactive") return matchesSearch && !member.isActive;
    return matchesSearch;
  });

  const stats = {
    total: staff.length,
    active: staff.filter((m) => m.isActive).length,
    barangays: new Set(staff.map((m) => m.barangay)).size,
  };

  const getActivityStatus = (lastActivity: Date) => {
    const now = new Date();
    const diffMinutes = Math.floor(
      (now.getTime() - new Date(lastActivity).getTime()) / 60000
    );
    
    if (diffMinutes < 5) return "Online";
    if (diffMinutes < 15) return "Away";
    return "Offline";
  };


  if (loading) {
    return (
      <div className="space-y-8 p-6 bg-gray-900 min-h-screen">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <Skeleton className="h-12 w-64 bg-gray-800 rounded-lg" />
          <div className="flex gap-4 w-full md:w-auto">
            <Skeleton className="h-10 w-full md:w-64 bg-gray-800 rounded-lg" />
            <Skeleton className="h-10 w-32 bg-gray-800 rounded-lg" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl bg-gray-800" />
          ))}
        </div>
        <div className="space-y-4">
          <Skeleton className="h-12 w-full bg-gray-800 rounded-lg" />
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full bg-gray-800 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 bg-gray-900 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-cyan-400">Staff Management</h1>
          <p className="text-gray-400 mt-2">
            Manage your LGU staff members and their activities
          </p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <Input
            placeholder="Search staff..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500"
          />
          <Button className="gap-2 bg-cyan-500 hover:bg-cyan-600 text-white transition-transform hover:scale-105">
            <FiPlus className="h-4 w-4" />
            Add Staff
          </Button>
        </div>
      </div>

      {/* Status Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-gray-800 border border-gray-700">
          <TabsTrigger value="all" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
            All Staff
          </TabsTrigger>
          <TabsTrigger value="active" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400">
            Active
          </TabsTrigger>
          <TabsTrigger value="inactive" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400">
            Inactive
          </TabsTrigger>
        </TabsList>
      </Tabs>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gray-800 border-gray-700 hover:border-cyan-400 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Total Staff
            </CardTitle>
            <FiUsers className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.total}</div>
            <p className="text-xs text-gray-500 mt-1">
              Across all barangays
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 hover:border-cyan-400 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Active Now
            </CardTitle>
            <FiActivity className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-cyan-400">
              {stats.active}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Currently online
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 hover:border-cyan-400 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Barangays Covered
            </CardTitle>
            <FiUserCheck className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.barangays}</div>
            <p className="text-xs text-gray-500 mt-1">
              Unique locations
            </p>
          </CardContent>
        </Card>
      </div>
     
      <Card className="rounded-xl border-gray-700 bg-gray-800 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-900">
            <TableRow className="hover:bg-gray-900">
              {[
                { key: 'firstName', label: 'Staff Member' },
                { key: 'position', label: 'Position' },
                { key: 'barangay', label: 'Barangay' },
                { key: 'phoneNumber', label: 'Contact' },
                { key: 'isActive', label: 'Status' },
                { key: 'lastActivity', label: 'Last Activity' },
              ].map((header) => (
                <TableHead
                  key={header.key}
                  className="text-gray-300 cursor-pointer hover:bg-gray-800/50"
                  onClick={() => handleSort(header.key as SortKey)}
                >
                  <div className="flex items-center gap-2">
                    {header.label}
                    {sortConfig?.key === header.key && (
                      sortConfig.direction === 'asc' ? (
                        <FiChevronUp className="w-4 h-4 text-cyan-400" />
                      ) : (
                        <FiChevronDown className="w-4 h-4 text-cyan-400" />
                      )
                    )}
                  </div>
                </TableHead>
              ))}
              <TableHead className="text-gray-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStaff.map((member) => {
              const lastActivityDate = new Date(member.lastActivity);
              const isValidDate = !isNaN(lastActivityDate.getTime());
              
              return (
                <TableRow key={member._id} className="border-gray-700 hover:bg-gray-700/20 group">
                  {/* Staff Member Cell */}
                  <TableCell className="py-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10 border-2 border-cyan-500">
                        <AvatarImage src={member.avatarUrl} />
                        <AvatarFallback className="bg-gray-700 text-cyan-400 font-medium">
                          {member.firstName[0]}{member.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-white">{`${member.firstName} ${member.lastName}`}</p>
                        <p className="text-sm text-gray-400">{member.email}</p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Position Cell */}
                  <TableCell className="text-gray-300">{member.position}</TableCell>

                  {/* Barangay Cell */}
                  <TableCell>
                    <Badge className="bg-gray-700 text-cyan-400 hover:bg-gray-600 text-sm font-medium">
                      {member.barangay}
                    </Badge>
                  </TableCell>

                  {/* Contact Cell */}
                  <TableCell className="text-gray-300">
                    <a href={`tel:${member.phoneNumber}`} className="hover:text-cyan-400 transition-colors">
                      {member.phoneNumber}
                    </a>
                  </TableCell>

                  {/* Status Cell */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "h-2.5 w-2.5 rounded-full animate-pulse",
                        member.isActive ? "bg-green-400" : "bg-gray-500"
                      )} />
                      <Badge
                        className={cn(
                          "font-medium",
                          member.isActive
                            ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                            : "bg-gray-700/50 text-gray-400 hover:bg-gray-700"
                        )}
                      >
                        {member.isActive ? "Active" : "Offline"}
                      </Badge>
                    </div>
                  </TableCell>

                  {/* Last Activity Cell */}
                  <TableCell className="text-gray-400">
                    {isValidDate ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className="flex items-center gap-2">
                            <FiClock className="w-4 h-4" />
                            {lastActivityDate.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </TooltipTrigger>
                          <TooltipContent className="bg-gray-800 border-gray-700 text-white">
                            {lastActivityDate.toLocaleString()}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <span className="text-gray-500">N/A</span>
                    )}
                  </TableCell>

                  {/* Actions Cell */}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="sr-only">Open menu</span>
                          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" />
                          </svg>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
                        <DropdownMenuItem className="hover:bg-gray-700/50 cursor-pointer">
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-gray-700/50 cursor-pointer">
                          Edit Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-400 hover:bg-red-500/20 cursor-pointer">
                          Deactivate
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )}
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}