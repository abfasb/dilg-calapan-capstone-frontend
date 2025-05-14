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
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Loader2,
  MoreVertical,
  Search,
  CheckCircle2,
  XCircle,
  CheckCircleIcon,
  CalendarClock,
  Filter,
  Clock,
  AlertTriangle,
  CalendarIcon,
  User2,
  Info,
  Eye,
  ClipboardList,
  Calendar
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/card';
import { Separator } from '../ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '../ui/tooltip';
import { toast, Toaster } from 'react-hot-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { format, parseISO, isToday, isPast, isFuture } from 'date-fns';
import { Skeleton } from '../ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';

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
  { value: 'all', label: 'All Statuses', icon: <ClipboardList className="w-4 h-4 mr-2" /> },
  { value: 'pending', label: 'Pending', icon: <Clock className="w-4 h-4 mr-2 text-yellow-400" /> },
  { value: 'confirmed', label: 'Confirmed', icon: <CheckCircle2 className="w-4 h-4 mr-2 text-green-400" /> },
  { value: 'cancelled', label: 'Cancelled', icon: <XCircle className="w-4 h-4 mr-2 text-red-400" /> },
];

const dateFilters = [
  { value: 'all', label: 'All Dates' },
  { value: 'today', label: 'Today' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'past', label: 'Past' },
];

const timeSlots = Array.from({ length: 9 }, (_, i) => {
  const hour = i + 8;
  return `${hour.toString().padStart(2, '0')}:00`;
});

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

const LGUAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDateFilter, setSelectedDateFilter] = useState('all');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [timeError, setTimeError] = useState('');
  const [detailsOpen, setDetailsOpen] = useState(false);

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
  }, [searchQuery, selectedStatus, selectedDateFilter, appointments]);

  const filterAppointments = () => {
    let filtered = appointments;

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(appt => appt.status === selectedStatus);
    }

    if (selectedDateFilter !== 'all') {
      filtered = filtered.filter(appt => {
        const appointmentDate = parseISO(appt.date);
        switch (selectedDateFilter) {
          case 'today':
            return isToday(appointmentDate);
          case 'upcoming':
            return isFuture(appointmentDate);
          case 'past':
            return isPast(appointmentDate) && !isToday(appointmentDate);
          default:
            return true;
        }
      });
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

  const handleStatusUpdate = async (id: string, newStatus: 'pending' | 'confirmed' | 'cancelled', time?: string) => {
    try {
      setUpdatingId(id);
      const payload = newStatus === 'confirmed' ? { status: newStatus, time } : { status: newStatus };
      
      const { data } = await api.patch(`/appointments/${id}/status`, payload);
      
      setAppointments(prev =>
        prev.map(appt => 
          appt._id === id ? { ...appt, ...data } : appt
        )
      );

      const statusMessages = {
        confirmed: 'Appointment confirmed successfully!',
        cancelled: 'Appointment cancelled',
        pending: 'Appointment marked as pending'
      };

      const statusIcons = {
        confirmed: <CheckCircleIcon className="w-6 h-6 text-green-400" />,
        cancelled: <XCircle className="w-6 h-6 text-red-400" />,
        pending: <Clock className="w-6 h-6 text-yellow-400" />
      };

      toast.success(statusMessages[newStatus], {
        icon: statusIcons[newStatus],
        style: {
          background: '#1a1d24',
          color: '#fff',
          border: '1px solid #2a2f38',
          padding: '16px',
          borderRadius: '10px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        },
        duration: 4000,
      });
    } catch (err) {
      handleError(err);
    } finally {
      setUpdatingId(null);
      setIsConfirmOpen(false);
      setDetailsOpen(false);
      setSelectedTime('');
      setTimeError('');
    }
  };

  const openConfirmationDialog = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setSelectedTime(appointment.time || '08:00');
    setIsConfirmOpen(true);
  };

  const openDetailsDialog = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setDetailsOpen(true);
  };

  const validateTime = (time: string) => {
    if (!time) {
      setTimeError('Please select a time slot');
      return false;
    }
    if (!timeSlots.includes(time)) {
      setTimeError('Invalid time slot');
      return false;
    }
    setTimeError('');
    return true;
  };

  const handleConfirmation = () => {
    if (!selectedAppointment || !validateTime(selectedTime)) return;
    
    handleStatusUpdate(selectedAppointment._id, 'confirmed', selectedTime);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500/15 text-green-400 border-green-500/20';
      case 'cancelled':
        return 'bg-red-500/15 text-red-400 border-red-500/20';
      default:
        return 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle2 className="h-4 w-4 mr-2 text-green-400" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 mr-2 text-red-400" />;
      default:
        return <Clock className="h-4 w-4 mr-2 text-yellow-400" />;
    }
  };

  const handleError = (error: unknown) => {
    const message = axios.isAxiosError(error) 
      ? error.response?.data?.message || 'An error occurred'
      : 'An unexpected error occurred';
    
    toast.error(message, {
      icon: <AlertTriangle className="w-6 h-6 text-red-400" />,
      style: {
        background: '#1a1d24',
        color: '#fff',
        border: '1px solid #2a2f38',
        padding: '16px',
        borderRadius: '10px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    });
  };

  if (loading) {
    return (
      <div className="grid gap-6 p-6">
        <div className="flex justify-between">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-4 w-96" />
        <Separator className="bg-gray-800" />
        <div className="rounded-xl overflow-hidden border border-gray-800">
          <div className="p-4 bg-gray-900">
            <div className="flex justify-between items-center">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex justify-between items-center py-3 px-4 bg-gray-800/20 rounded-lg">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-8 w-24" />
              </div>
            ))}
          </div>
        </div>
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
      
      {/* Confirmation Dialog */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 sm:max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-gray-100 text-xl">Confirm Appointment</DialogTitle>
            <DialogDescription className="text-gray-400">
              Select a time slot for {selectedAppointment?.user.firstName}'s appointment
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-5 py-2">
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-800">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <User2 className="h-5 w-5 text-gray-400" />
                  <div className="text-gray-100 font-medium">
                    {selectedAppointment?.user.firstName} {selectedAppointment?.user.lastName}
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <CalendarClock className="h-5 w-5 text-gray-400" />
                  <div className="text-gray-100">
                    {selectedAppointment?.date && format(parseISO(selectedAppointment.date), 'PPP')}
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Info className="h-5 w-5 text-gray-400" />
                  <div className="text-gray-100 line-clamp-2">
                    {selectedAppointment?.title}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300 flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                Select Time Slot *
              </Label>
              <Select
                value={selectedTime}
                onValueChange={(value) => {
                  setSelectedTime(value);
                  validateTime(value);
                }}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-100 focus:ring-primary focus:ring-offset-gray-900">
                  <SelectValue placeholder="Choose time" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-800">
                  {timeSlots.map((time) => (
                    <SelectItem
                      key={time}
                      value={time}
                      className="hover:bg-gray-800 text-gray-100 focus:bg-gray-800 focus:text-gray-100"
                    >
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {timeError && (
                <p className="text-sm text-red-400 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" /> {timeError}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="border-gray-700 hover:bg-gray-800 text-gray-100 hover:text-white"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={handleConfirmation}
              disabled={!selectedTime || !!timeError}
              className="bg-green-600 hover:bg-green-700 text-white font-medium"
            >
              {updatingId === selectedAppointment?._id ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <CheckCircle2 className="h-4 w-4 mr-2" />
              )}
              Confirm Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

       <Dialog open={detailsOpen} onOpenChange={(open) => {
        if (!processingAction || !open) {
          setDetailsOpen(open);
        }
      }}>
        <DialogContent className="bg-gray-900 border-gray-800 sm:max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-gray-100 text-xl">Appointment Details</DialogTitle>
            <Separator className="bg-gray-800 my-2" />
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Status</span>
              <Badge
                variant="outline"
                className={`${getStatusVariant(selectedAppointment?.status || 'pending')} px-3 py-1`}
              >
                {getStatusIcon(selectedAppointment?.status || 'pending')}
                {selectedAppointment?.status}
              </Badge>
            </div>
            
            <div className="space-y-4 bg-gray-800/50 p-4 rounded-lg border border-gray-800">
              <div>
                <h3 className="text-sm text-gray-400 mb-1">Title</h3>
                <p className="text-gray-100 font-medium">{selectedAppointment?.title}</p>
              </div>
              
              <div>
                <h3 className="text-sm text-gray-400 mb-1">Description</h3>
                <p className="text-gray-100">{selectedAppointment?.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm text-gray-400 mb-1">Date</h3>
                  <p className="text-gray-100 flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-gray-400" />
                    {selectedAppointment?.date && format(parseISO(selectedAppointment.date), 'PPP')}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-400 mb-1">Time</h3>
                  <p className="text-gray-100 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    {selectedAppointment?.time || 'Not set'}
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm text-gray-400 mb-1">Citizen</h3>
                <div className="flex items-center gap-2">
                  <div className="bg-gray-700 h-8 w-8 rounded-full flex items-center justify-center">
                    <User2 className="h-4 w-4 text-gray-300" />
                  </div>
                  <div>
                    <p className="text-gray-100 font-medium">
                      {selectedAppointment?.user.firstName} {selectedAppointment?.user.lastName}
                    </p>
                    <p className="text-sm text-gray-400">{selectedAppointment?.user.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="space-x-2">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="border-gray-700 hover:bg-gray-800 text-black"
              >
                Close
              </Button>
            </DialogClose>
            
            {selectedAppointment?.status !== 'confirmed' && (
              <Button
                onClick={() => {
                  setDetailsOpen(false);
                  openConfirmationDialog(selectedAppointment!);
                }}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Confirm
              </Button>
            )}
            
            {selectedAppointment?.status !== 'cancelled' && (
              <Button
                onClick={() => handleStatusUpdate(selectedAppointment!._id, 'cancelled')}
                variant="destructive"
                className="bg-red-600 hover:bg-red-700"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="space-y-6 p-6 bg-background text-foreground">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-gray-100 flex items-center gap-2">
              <Calendar className="h-6 w-6 text-primary" />
              Appointment Management
            </h1>
            <p className="text-gray-400">
              Manage citizen appointments and schedule requests
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="border-gray-700 bg-black hover:bg-gray-800 hover:text-white text-gray-100"
              onClick={() => {
                setSearchQuery('');
                setSelectedStatus('all');
                setSelectedDateFilter('all');
              }}
            >
              <Filter className="h-4 w-4 mr-2" />
              Reset Filters
            </Button>
            
            <Button 
              size="sm" 
              className="bg-primary hover:bg-primary/90"
            >
              <Clock className="h-4 w-4 mr-2" />
              Manage Schedule
            </Button>
          </div>
        </div>

        <Separator className="bg-gray-700" />

        <Card className="bg-gray-900 border-gray-800 rounded-xl overflow-hidden shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-gray-100 font-medium">Appointment Requests</CardTitle>
            
            <div className="flex flex-col md:flex-row justify-between gap-4 mt-4">
              <div className="relative w-full md:max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by title, citizen name or email..."
                  className="pl-10 h-10 bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-400 focus:ring-primary focus:border-primary focus:ring-offset-gray-900"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-100 w-40 focus:ring-primary focus:ring-offset-gray-900">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-800">
                    {statusOptions.map(option => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        className="hover:bg-gray-800 text-gray-100 focus:bg-gray-800 focus:text-gray-100"
                      >
                        <div className="flex items-center">
                          {option.icon}
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={selectedDateFilter}
                  onValueChange={setSelectedDateFilter}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-100 w-40 focus:ring-primary focus:ring-offset-gray-900">
                    <SelectValue placeholder="Filter by date" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-800">
                    {dateFilters.map(option => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        className="hover:bg-gray-800 text-gray-100 focus:bg-gray-800 focus:text-gray-100"
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="rounded-lg border border-gray-800 overflow-hidden">
              <div className="overflow-x-auto">
                <Table className="border-collapse w-full">
                  <TableHeader className="bg-gray-800/80">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-gray-300 font-medium py-4">Citizen</TableHead>
                      <TableHead className="text-gray-300 font-medium">Title</TableHead>
                      <TableHead className="text-gray-300 font-medium">Date & Time</TableHead>
                      <TableHead className="text-gray-300 font-medium">Status</TableHead>
                      <TableHead className="text-gray-300 font-medium">Description</TableHead>
                      <TableHead className="text-right text-gray-300 font-medium">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {filteredAppointments.map((appointment, index) => (
                        <motion.tr
                          key={appointment._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          className="hover:bg-gray-800/50 transition-colors border-gray-800 group"
                        >
                          <TableCell className="py-3">
                            <div className="flex items-center gap-3">
                              <div className="bg-gray-800 h-9 w-9 rounded-full flex items-center justify-center">
                                <User2 className="h-5 w-5 text-gray-400" />
                              </div>
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
                              <div className="bg-gray-800/50 p-2 rounded-md flex-shrink-0">
                                <CalendarClock className="h-4 w-4 text-gray-300" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-gray-100">
                                  {format(parseISO(appointment.date), 'PPP')}
                                </span>
                                <span className="text-sm flex items-center gap-1 text-gray-400">
                                  <Clock className="h-3.5 w-3.5" />
                                  {appointment.time || 'Not scheduled'}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`flex items-center gap-1 px-2.5 py-1 w-fit capitalize font-medium ${getStatusVariant(appointment.status)}`}
                            >
                              {getStatusIcon(appointment.status)}
                              {appointment.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Tooltip>
                              <TooltipTrigger>
                                <span className="line-clamp-1 max-w-[200px] text-gray-400 hover:text-gray-200 transition-colors">
                                  {appointment.description}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent className="bg-gray-900 border-gray-800 max-w-[300px] p-3 text-gray-100">
                                <p>{appointment.description}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TableCell>
                                                    <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 hover:bg-gray-800 text-gray-400"
                                    onClick={() => openDetailsDialog(appointment)}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom">
                                  <p className="text-xs">View Details</p>
                                </TooltipContent>
                              </Tooltip>
                            
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-8 w-8 p-0 hover:bg-gray-800 text-gray-400"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent 
                                  align="end" 
                                  className="bg-gray-900 border-gray-800 w-48"
                                >
                                   <DropdownMenuItem
                                    onClick={() => openConfirmationDialog(appointment)}
                                    disabled={updatingId === appointment._id}
                                    className="hover:bg-gray-800 focus:bg-gray-800 text-gray-100"
                                  >
                                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-400" />
                                    Confirm
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleStatusUpdate(appointment._id, 'cancelled')}
                                    disabled={updatingId === appointment._id}
                                    className="hover:bg-gray-800 focus:bg-gray-800 text-gray-100"
                                  >
                                    <XCircle className="h-4 w-4 mr-2 text-red-400" />
                                    Cancel
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="hover:bg-gray-800 focus:bg-gray-800 text-gray-100 cursor-pointer"
                                    onClick={() => navigator.clipboard.writeText(appointment._id)}
                                  >
                                    <ClipboardList className="h-4 w-4 mr-2 text-gray-400" />
                                    Copy ID
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator className="bg-gray-800" />
                                  <DropdownMenuItem
                                    className="hover:bg-red-800/30 focus:bg-red-800/30 text-red-400 cursor-pointer"
                                    onClick={() => handleStatusUpdate(appointment._id, 'cancelled')}
                                    disabled={updatingId === appointment._id}
                                  >
                                    {updatingId === appointment._id ? (
                                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    ) : (
                                      <XCircle className="h-4 w-4 mr-2" />
                                    )}
                                    Cancel
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>

                    {filteredAppointments.length === 0 && !loading && (
                      <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-transparent"
                      >
                        <TableCell colSpan={6} className="h-96 text-center">
                          <div className="flex flex-col items-center justify-center gap-4">
                            <CalendarClock className="h-16 w-16 text-gray-600" />
                            <div className="space-y-1">
                              <h3 className="text-gray-200 font-medium text-lg">
                                No appointments found
                              </h3>
                              <p className="text-gray-500 text-sm">
                                Try adjusting your filters or check back later
                              </p>
                            </div>
                          </div>
                        </TableCell>
                      </motion.tr>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between items-center px-6 py-4 border-t border-gray-800">
            <div className="text-sm text-gray-400">
              Showing {filteredAppointments.length} of {appointments.length} results
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-gray-700 bg-black hover:bg-gray-800 text-white"
                disabled={true} 
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-700 hover:bg-gray-800 text-gray-100"
                disabled={true} // Add pagination logic
              >
                Next
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default LGUAppointments;