import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Button } from '../ui/button';
import { format } from 'date-fns';
import { ExclamationTriangleIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';
import { cn } from '../../lib/utils';

interface Appointment {
  _id: string;
  title: string;
  date: string;
  time?: string;
  description?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

const Appointment = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'outline';
      case 'pending':
        return 'outline';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <Alert variant="destructive" className="mt-8">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button className="mt-4" onClick={() => navigate(-1)}>
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Return Back
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Return Back
        </Button>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Appointment History
        </h1>
        <div /> {/* Spacer */}
      </div>

      <Card className="rounded-xl shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-xl">
          <CardTitle className="text-xl font-semibold text-gray-800">
            Scheduled Appointments
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-b-xl overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-medium text-gray-600">Title</TableHead>
                  <TableHead className="font-medium text-gray-600">Date</TableHead>
                  <TableHead className="font-medium text-gray-600">Time</TableHead>
                  <TableHead className="font-medium text-gray-600">Status</TableHead>
                  <TableHead className="font-medium text-gray-600">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array(3).fill(0).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className="h-4 w-[160px] rounded-lg" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[120px] rounded-lg" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[80px] rounded-lg" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[100px] rounded-lg" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[200px] rounded-lg" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : appointments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                      No appointments scheduled yet
                    </TableCell>
                  </TableRow>
                ) : (
                  appointments.map((appointment) => (
                    <TableRow 
                      key={appointment._id}
                      className="hover:bg-gray-50 m-8 transition-colors"
                    >
                      <TableCell className="font-medium text-gray-800">
                        {appointment.title}
                      </TableCell>
                      <TableCell className="text-gray-700">
                        {format(new Date(appointment.date), 'PP')}
                      </TableCell>
                      <TableCell className="text-gray-700">
                        {appointment.time || (
                          <span className="text-gray-400">Not assigned</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={getStatusVariant(appointment.status)}
                          className={cn(
                            'rounded-full py-1 px-3 text-xs font-medium',
                            appointment.status === 'confirmed' && 'bg-green-100 text-green-800',
                            appointment.status === 'pending' && 'bg-yellow-100 text-yellow-800',
                            appointment.status === 'cancelled' && 'bg-red-100 text-red-800'
                          )}
                        >
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600 max-w-[300px] truncate">
                        {appointment.description || '-'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Appointment;