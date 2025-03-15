// src/components/LGUAppointments.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Loader2,
  MoreVertical,
  Search,
  AlertCircle,
  CheckCircle2,
  XCircle,
  CalendarClock,
  Filter
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Separator } from '../ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '../ui/tooltip';

interface Appointment {
  _id: string;
  title: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  user: {
    _id: string;
    name: string;
    email: string;
  };
  description: string;
  createdAt: string;
}

const statusOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const LGUAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.get('/appointments/lgu');
        setAppointments(res.data);
        setFilteredAppointments(res.data);
      } catch (err) {
        console.error(err);
       
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [searchQuery, selectedStatus]);

  const filterAppointments = () => {
    let filtered = appointments;

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(appt => appt.status === selectedStatus);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(appt =>
        appt.title.toLowerCase().includes(query) ||
        appt.description.toLowerCase().includes(query) ||
        appt.user.name.toLowerCase().includes(query) ||
        appt.user.email.toLowerCase().includes(query)
      );
    }

    setFilteredAppointments(filtered);
  };

  const handleStatusUpdate = async (id: string, newStatus: 'pending' | 'confirmed' | 'cancelled') => {
    try {
      setUpdatingId(id);
      const res = await api.patch(`/appointments/${id}/status`, { status: newStatus });

      setAppointments(prev =>
        prev.map(appt => 
          appt._id === id ? { ...appt, status: newStatus } : appt
        )
      );
      
    } catch (err) {
      console.error(err);
      
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 mr-2 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 mr-2 text-yellow-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <TooltipProvider>
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Appointment Management</h1>
          <p className="text-muted-foreground">
            Manage citizen appointments and schedules
          </p>
        </div>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search appointments..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <select 
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-background border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[200px]">Citizen</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.map((appointment) => (
                  <TableRow key={appointment._id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                          <span className="font-medium">{appointment.user.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {appointment.user.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {appointment.title}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CalendarClock className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {new Date(appointment.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                        <span className="text-muted-foreground">•</span>
                        <span>{appointment.time}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="flex items-center w-fit border-none bg-opacity-10"
                        style={{
                          backgroundColor: `var(--${appointment.status})`,
                        }}
                      >
                        {getStatusIcon(appointment.status)}
                        <span className="capitalize">{appointment.status}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Tooltip>
                        <TooltipTrigger>
                          <span className="line-clamp-1 max-w-[200px]">
                            {appointment.description}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">{appointment.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            {updatingId === appointment._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <MoreVertical className="h-4 w-4" />
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleStatusUpdate(appointment._id, 'confirmed')}
                            disabled={updatingId === appointment._id}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                            Confirm
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusUpdate(appointment._id, 'cancelled')}
                            disabled={updatingId === appointment._id}
                          >
                            <XCircle className="h-4 w-4 mr-2 text-red-500" />
                            Cancel
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredAppointments.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="text-muted-foreground mb-4">
                  No appointments found
                </div>
                <Button variant="outline" onClick={() => {
                  setSearchQuery('');
                  setSelectedStatus('all');
                }}>
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
    </TooltipProvider>
  );
};

export default LGUAppointments;