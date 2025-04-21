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
import { FiPlus, FiActivity, FiUserCheck, FiUsers } from "react-icons/fi";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

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

export default function Staff() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredStaff = staff.filter((member) =>
    `${member.firstName} ${member.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

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
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-[200px] bg-gray-800" />
          <Skeleton className="h-10 w-[150px] bg-gray-800" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl bg-gray-800" />
          ))}
        </div>
        <Skeleton className="h-[400px] rounded-xl bg-gray-800" />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 bg-gray-900 min-h-screen">
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
            className="w-full md:w-64 bg-gray-800 border-gray-700 text-white placeholder-gray-500"
          />
          <Button className="gap-2 bg-cyan-400 hover:bg-cyan-500 text-gray-900">
            <FiPlus className="h-4 w-4" />
            Add Staff
          </Button>
        </div>
      </div>

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

      <Card className="rounded-xl border-gray-700 bg-gray-800">
        <Table>
          <TableHeader className="bg-gray-900">
            <TableRow className="hover:bg-gray-900">
              <TableHead className="text-gray-300">Staff Member</TableHead>
              <TableHead className="text-gray-300">Position</TableHead>
              <TableHead className="text-gray-300">Barangay</TableHead>
              <TableHead className="text-gray-300">Contact</TableHead>
              <TableHead className="text-gray-300">Status</TableHead>
              <TableHead className="text-gray-300">Last Activity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStaff.map((member) => (
              <TableRow key={member._id} className="border-gray-700 hover:bg-gray-700/50">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-9 w-9 border-2 border-cyan-400">
                      <AvatarImage src={member.avatarUrl} />
                      <AvatarFallback className="bg-gray-700 text-cyan-400">
                        {member.firstName[0]}
                        {member.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-white">{`${member.firstName} ${member.lastName}`}</p>
                      <p className="text-sm text-gray-400">
                        {member.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-gray-300">{member.position}</TableCell>
                <TableCell>
                  <Badge className="bg-gray-700 text-cyan-400 hover:bg-gray-600 text-sm">
                    {member.barangay}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-300">{member.phoneNumber}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        getActivityStatus(member.lastActivity) === "Online"
                          ? "bg-cyan-400"
                          : getActivityStatus(member.lastActivity) === "Away"
                          ? "bg-yellow-400"
                          : "bg-gray-500"
                      }`}
                    />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge
                            className={
                              getActivityStatus(member.lastActivity) === "Online"
                                ? "bg-cyan-400/20 text-cyan-400 hover:bg-cyan-400/30"
                                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                            }
                          >
                            {getActivityStatus(member.lastActivity)}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent className="bg-gray-800 text-white border-gray-700">
                          Last active:{" "}
                          {new Date(member.lastActivity).toLocaleString()}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
                <TableCell className="text-gray-400">
                  {new Date(member.lastActivity).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}