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
  CheckCircleIcon,
  CalendarClock,
  Filter
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Separator } from '../ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '../ui/tooltip';
import { toast, Toaster } from 'react-hot-toast';

interface Appointment {
  _id: string;
  title: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  user: {
    _id: string;
    firstName: string;
    lastName: string;
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

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

const Appointment = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await api.get<Appointment[]>('/appointments/lgu');
        setAppointments(data);
        setFilteredAppointments(data);
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [searchQuery, selectedStatus, appointments]);

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
        appt.user.firstName.toLowerCase().includes(query) ||
        appt.user.lastName.toLowerCase().includes(query) ||
        appt.user.email.toLowerCase().includes(query)
      );
    }

    setFilteredAppointments(filtered);
  };

  const handleStatusUpdate = async (id: string, newStatus: 'pending' | 'confirmed' | 'cancelled') => {
    try {
      setUpdatingId(id);
      await api.patch(`/appointments/${id}/status`, { status: newStatus });

      setAppointments(prev =>
        prev.map(appt => 
          appt._id === id ? { ...appt, status: newStatus } : appt
        )
      );

      toast.success('Status Updated!', {
        icon: <CheckCircleIcon className="w-6 h-6 text-green-400" />,
        style: {
          background: '#1a1d24',
          color: '#fff',
          border: '1px solid #2a2f38',
          padding: '16px',
        },
        duration: 4000,
      });
    } catch (err) {
      handleError(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'cancelled':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    }
  };

  const handleError = (error: unknown) => {
    const message = axios.isAxiosError(error) 
      ? error.response?.data?.message || 'An error occurred'
      : 'An unexpected error occurred';
    
    toast.error(message, {
      style: {
        background: '#1a1d24',
        color: '#fff',
        border: '1px solid #2a2f38',
        padding: '16px',
      },
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary-foreground" />
      </div>
    );
  }

  return (
    <TooltipProvider>
      <Toaster
        position="top-right"
        gutter={32}
        containerClassName="!top-4 !right-6"
        toastOptions={{
          className: '!bg-[#1a1d24] !text-white !rounded-xl !border !border-[#2a2f38]',
        }}
      />
      <div className="space-y-6 p-6 bg-background text-foreground">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-gray-100">Appointment Management</h1>
            <p className="text-gray-400">
              Manage citizen appointments and schedules
            </p>
          </div>
        </div>

        <Separator className="bg-gray-700" />

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search appointments..."
                  className="pl-8 bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select 
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="bg-gray-800 border-gray-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-gray-100"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value} className="text-gray-100">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="rounded-lg border border-gray-800">
              <Table>
                <TableHeader className="bg-gray-800">
                  <TableRow>
                    <TableHead className="w-[200px] text-gray-300 text-sm">Citizen</TableHead>
                    <TableHead className="text-gray-300 text-sm">Title</TableHead>
                    <TableHead className="text-gray-300 text-sm">Date & Time</TableHead>
                    <TableHead className="text-gray-300 text-sm">Status</TableHead>
                    <TableHead className="text-gray-300 text-sm">Description</TableHead>
                    <TableHead className="text-right text-gray-300 text-sm">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAppointments.map((appointment) => (
                    <TableRow 
                      key={appointment._id} 
                      className="hover:bg-gray-800/50 transition-colors border-gray-800"
                    >
                      <TableCell>
                        <div className="flex items-center gap-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-100">
                              {appointment.user.firstName} {appointment.user.lastName}
                            </span>
                            <span className="text-sm text-gray-400">
                              {appointment.user.email}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-gray-100">
                        {appointment.title}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-gray-400">
                          <CalendarClock className="h-4 w-4" />
                          <span>
                            {new Date(appointment.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                          <span className="text-gray-600">•</span>
                          <span>{appointment.time}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`flex items-center w-fit capitalize ${getStatusVariant(appointment.status)}`}
                        >
                          {appointment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger>
                            <span className="line-clamp-1 max-w-[200px] text-gray-400">
                              {appointment.description}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent className="bg-gray-900 border-gray-800">
                            <p className="max-w-xs text-gray-100">{appointment.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 hover:bg-gray-700 text-gray-400"
                              disabled={updatingId === appointment._id}
                            >
                              {updatingId === appointment._id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <MoreVertical className="h-4 w-4" />
                              )}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent 
                            align="end" 
                            className="bg-gray-900 border-gray-800"
                          >
                            <DropdownMenuItem
                              onClick={() => handleStatusUpdate(appointment._id, 'confirmed')}
                              disabled={updatingId === appointment._id}
                              className="hover:bg-gray-800 bg-black hover:text-white text-white"
                            >
                              <CheckCircle2 className="h-4 w-4 mr-2 text-green-400" />
                              Confirm
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleStatusUpdate(appointment._id, 'cancelled')}
                              disabled={updatingId === appointment._id}
                              className="hover:bg-gray-800 hover:text-white text-white"
                            >
                              <XCircle className="h-4 w-4 mr-2 text-red-400" />
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
                  <div className="text-gray-400 mb-4">
                    No appointments found
                  </div>
                  <Button 
                    variant="outline"
                    className="border-gray-700 hover:bg-gray-800 text-gray-100"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedStatus('all');
                    }}
                  >
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

export default Appointment;