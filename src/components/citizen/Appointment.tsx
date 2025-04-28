import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '../ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { format, formatDistanceToNow, isToday, isTomorrow } from 'date-fns';
import { 
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  ClockIcon,
  InformationCircleIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { cn } from '../../lib/utils';

interface Appointment {
  _id: string;
  title: string;
  date: string;
  time?: string;
  description?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  location?: string;
  serviceType?: string;
}

const statusConfig = {
  pending: {
    icon: ClockIcon,
    color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200',
    border: 'border-amber-200 dark:border-amber-800',
  },
  confirmed: {
    icon: CheckCircleIcon,
    color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200',
    border: 'border-emerald-200 dark:border-emerald-800',
  },
  cancelled: {
    icon: XCircleIcon,
    color: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200',
    border: 'border-red-200 dark:border-red-800',
  },
};

const MotionCard = motion(Card);

const Appointment = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'upcoming'>('upcoming');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/appointments/citizen?userId=${id}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch appointments');
        }

        const data = await response.json();
        setAppointments(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [id]);

  const getRelativeDate = (date: string) => {
    const appointmentDate = new Date(date);
    let relativeDate = formatDistanceToNow(appointmentDate, { addSuffix: true });
    
    if (isToday(appointmentDate)) {
      return `Today • ${relativeDate}`;
    }
    if (isTomorrow(appointmentDate)) {
      return `Tomorrow • ${relativeDate}`;
    }
    return `${format(appointmentDate, 'PPP')} • ${relativeDate}`;
  };

  const filteredAppointments = appointments.filter(app => 
    filter === 'upcoming' ? app.status !== 'cancelled' && new Date(app.date) > new Date() : true
  );

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-6xl mx-auto p-4"
      >
        <Alert variant="destructive" className="mt-8">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button 
          className="mt-4 gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Return to Dashboard
        </Button>
      </motion.div>
    );
  }

  return (
    <TooltipProvider>
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-6xl mx-auto p-4 space-y-6"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="gap-2 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <ArrowLeftIcon className="h-4 w-4 text-gray-700 dark:text-gray-300" />
            <span className="hidden sm:inline text-gray-700 dark:text-gray-300">Back</span>
          </Button>
          
          <div className="space-y-1 text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
              Appointment Manager
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage and track your scheduled appointments
            </p>
          </div>

          <div className="flex gap-2">
            <Button 
              variant={filter === 'upcoming' ? 'default' : 'outline'}
              onClick={() => setFilter('upcoming')}
              className="dark:border-gray-600 dark:text-gray-300"
            >
              Upcoming
            </Button>
            <Button 
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
              className="dark:border-gray-600 dark:text-gray-300"
            >
              All
            </Button>
          </div>
        </div>

        <Separator className="bg-gray-100 dark:bg-gray-800" />

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array(3).fill(0).map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Card className="h-[200px] relative overflow-hidden border-gray-200 dark:border-gray-800">
                  <Skeleton className="h-full w-full bg-gray-100 dark:bg-gray-800" />
                </Card>
              </motion.div>
            ))}
          </div>
        ) : filteredAppointments.length === 0 ? (
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center py-12"
          >
            <img 
              src="https://img.uxcel.com/practices/replace-the-element-1602859019475/b-1702667421185-2x.jpg" 
              alt="No appointments" 
              className="w-64 h-64 mb-8 opacity-75 dark:invert"
            />
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
              No Appointments Found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md text-center">
              You don't have any {filter === 'upcoming' ? 'upcoming' : ''} appointments scheduled.
              Start by creating a new appointment.
            </p>
            <Button onClick={() => navigate('/schedule')}>
              Schedule New Appointment
            </Button>
          </motion.div>
        ) : (
          <motion.div 
            layout
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence>
              {filteredAppointments.map((appointment) => {
                const StatusIcon = statusConfig[appointment.status].icon;
                
                return (
                  <MotionCard
                    key={appointment._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    whileHover={{ y: -4 }}
                    className={cn(
                      'group relative overflow-hidden border-gray-200 dark:border-gray-800',
                      'transition-shadow duration-300 hover:shadow-lg dark:hover:shadow-xl',
                      'bg-white dark:bg-gray-900'
                    )}
                  >
                    <div className={cn(
                      'absolute top-0 right-0 px-3 py-1 rounded-bl-lg',
                      statusConfig[appointment.status].color,
                      'text-sm font-medium flex items-center gap-2'
                    )}>
                      <StatusIcon className="h-4 w-4" />
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </div>

                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                        {appointment.title}
                      </CardTitle>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {appointment.serviceType || 'General Service'}
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg dark:bg-blue-900/30">
                          <CalendarIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {getRelativeDate(appointment.date)}
                          </div>
                          {appointment.time && (
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              at {format(new Date(`1970-01-01T${appointment.time}`), 'hh:mm a')}
                            </div>
                          )}
                        </div>
                      </div>

                      {appointment.location && (
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-50 rounded-lg dark:bg-purple-900/30">
                            <MapPinIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div className="text-sm text-gray-700 dark:text-gray-300">
                            {appointment.location}
                          </div>
                        </div>
                      )}
                    </CardContent>

                    <CardFooter className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-800">
                      <Tooltip>
                        <TooltipTrigger>
                          <InformationCircleIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                          {appointment.description || 'No additional details provided'}
                        </TooltipContent>
                      </Tooltip>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="dark:border-gray-600 dark:text-gray-300"
                        onClick={() => navigate(`/appointments/${appointment._id}`)}
                      >
                        View Details
                      </Button>
                    </CardFooter>
                  </MotionCard>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </motion.div>
    </TooltipProvider>
  );
};

export default Appointment;