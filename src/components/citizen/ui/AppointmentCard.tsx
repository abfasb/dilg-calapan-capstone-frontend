import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../ui/card';
import { ScrollArea } from '../../ui/scroll-area';
import { Avatar, AvatarImage } from '../../ui/avatar';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Calendar, Clock, Plus, CheckCircleIcon, EraserIcon } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

interface Appointment {
  _id: string;
  title: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  description?: string;
}

interface AppointmentsCardProps {
  userId: string;
}

export function AppointmentsCard({ userId }: AppointmentsCardProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    description: ''
  });

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.get('/appointments', { params: { userId } });
        setAppointments(res.data);
      } catch (err) {
        console.error('Error fetching appointments:', err);
      }
    };

    if (userId) fetchAppointments();
    else setAppointments([]);
  }, [userId, isDialogOpen]);

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        user: userId,
        date: new Date(formData.date).toISOString()
      };

      await api.post('/appointments', payload);
      const newAppointments = await api.get('/appointments', { params: { userId } });
      
      setAppointments(newAppointments.data);
      setIsDialogOpen(false);
      setFormData({ title: '', date: '', time: '', description: '' });
      
      toast.success('Appointment Submitted Successfully. Please wait for confirmation.', {
        icon: <CheckCircleIcon className="w-6 h-6 text-green-400" />,
        style: {
          background: '#1a1d24',
          color: '#fff',
          border: '1px solid #2a2f38',
          padding: '16px',
        },
        duration: 4000,
      });
    } catch (err: any) {
      toast.error(err.message || 'An error occurred', {
        icon: <EraserIcon className="w-6 h-6 text-red-400" />,
        style: {
          background: '#1a1d24',
          color: '#fff',
          border: '1px solid #2a2f38',
          padding: '16px',
        },
        duration: 4000,
      });
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow rounded-xl w-full border-0 shadow-sm bg-white dark:bg-gray-900">
      <Toaster
        position="top-right"
        gutter={32}
        containerClassName="!top-4 !right-6"
        toastOptions={{
          className: '!bg-[#1a1d24] !text-white !rounded-xl !border !border-[#2a2f38]',
        }}
      />
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-700">
        <CardTitle className="text-lg font-semibold flex items-center gap-2 text-blue-600 dark:text-blue-400">
          <Calendar className="w-5 h-5" />
          <span>Appointments</span>
          <Badge variant="secondary" className="ml-2">
            {appointments.length} upcoming
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        <ScrollArea className="h-64 pr-4">
          {appointments.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No upcoming appointments found
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div
                  key={appointment._id}
                  className="flex items-start p-4 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <Avatar className="h-9 w-9 mr-3">
                    <AvatarImage src={`/avatars/${appointment._id}.jpg`} />
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">
                        {appointment.title}
                      </h3>
                      <Badge
                        variant={
                          appointment.status === 'confirmed' ? 'default' :
                          appointment.status === 'pending' ? 'secondary' : 'destructive'
                        }
                      >
                        {appointment.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(appointment.date).toLocaleDateString()}</span>
                        <Clock className="w-4 h-4 ml-2" />
                        <span>{appointment.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>

      <CardFooter className="border-t bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full" variant="default">
              <Plus className="w-4 h-4 mr-2" />
              Book New Meeting
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md rounded-xl dark:bg-gray-900 dark:text-gray-100">
            <DialogHeader>
              <DialogTitle className="text-blue-600 dark:text-blue-400">
                Schedule New Appointment
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Meeting Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:text-gray-100"
                  placeholder="Enter meeting title"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Preferred Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:text-gray-100"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:text-gray-100"
                  placeholder="Add meeting details..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                variant="default"   
                onClick={handleSubmit}
                disabled={!formData.title || !formData.date}
              >
                Request Booking
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
