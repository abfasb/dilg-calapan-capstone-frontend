import { useEffect, useState } from 'react';
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Calendar, MapPin, Users, Clock, Edit, Trash2, Settings, Archive, ClipboardList, Plus, X, CheckCircleIcon} from "lucide-react"
import { Badge } from "../ui/badge"
import { Progress } from "../ui/progress"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogClose } from "../ui/dialog"
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  status: 'draft' | 'published';
  attendees: number;
  capacity: number;
  lguId: string;
}

interface JwtPayload {
  userId: string;
}

function jwtDecode<T>(token: string): T {
  return JSON.parse(atob(token.split('.')[1]));
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

const LGUEventManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventLocation, setEventLocation] = useState("TBA");
  const [eventStatus, setEventStatus] = useState<'draft' | 'published'>('draft');
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [lguId, setLguId] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode<JwtPayload>(token);
      setLguId(decoded.userId);
      fetchEvents(decoded.userId);
    }
  }, []);

  const fetchEvents = async (lguId: string) => {
    try {
      const { data } = await api.get('/events');
      setEvents(data);
    } catch (error) {
      toast.error('Failed to fetch events');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newEvent = {
        title: eventTitle,
        description: eventDescription,
        date: eventDate,
        time: eventTime,
        location: eventLocation,
        status: eventStatus,
        capacity: 100,
        lguId,
      };

      const { data } = await api.post('/events', newEvent);
      setEvents([...events, data]);
      resetForm();
      setIsDialogOpen(false);
      toast.success('Event Created Successfully!', {
        icon: <CheckCircleIcon className="w-6 h-6 text-green-400" />,
        style: {
          background: '#1a1d24',
          color: '#fff',
          border: '1px solid #2a2f38',
          padding: '16px',
        },
        duration: 4000,
      });
    } catch (error : any) {
      toast.error(error.message || 'Failed to create event', {
        style: {
          background: '#1a1d24',
          color: '#fff',
          border: '1px solid #2a2f38',
          padding: '16px',
        },
      });
    }
  };

  const openEditDialog = (event: Event) => {
    setSelectedEvent(event);
    setEventTitle(event.title);
    setEventDescription(event.description);
    setEventDate(event.date);
    setEventTime(event.time);
    setEventLocation(event.location);
    setEventStatus(event.status);
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;

    try {
      const updatedEvent = {
        title: eventTitle,
        description: eventDescription,
        date: eventDate,
        time: eventTime,
        location: eventLocation,
        status: eventStatus
      };

      const { data } = await api.patch(`/events/${selectedEvent._id}`, updatedEvent);
      setEvents(events.map(event => event._id === data._id ? data : event));
      setIsEditDialogOpen(false);
      resetForm();
      toast.success('Event Updated Successfully!', {
        icon: <CheckCircleIcon className="w-6 h-6 text-green-400" />,
        style: {
          background: '#1a1d24',
          color: '#fff',
          border: '1px solid #2a2f38',
          padding: '16px',
        },
        duration: 4000,
      });
    } catch (error : any) {
      toast.error(error.message || 'Failed to update event', {
        style: {
          background: '#1a1d24',
          color: '#fff',
          border: '1px solid #2a2f38',
          padding: '16px',
        },
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedEvent) return;
    try {
      await api.delete(`/events/${selectedEvent._id}`);
      setEvents(events.filter(event => event._id !== selectedEvent._id));
      setIsDeleteDialogOpen(false);
      toast.success('Event Deleted Successfully!', {
        icon: <CheckCircleIcon className="w-6 h-6 text-green-400" />,
        style: {
          background: '#1a1d24',
          color: '#fff',
          border: '1px solid #2a2f38',
          padding: '16px',
        },
        duration: 4000,
      });
    } catch (error) {
      toast.error('Failed to delete event');
    }
  };

  const resetForm = () => {
    setEventTitle("");
    setEventDescription("");
    setEventDate("");
    setEventTime("");
    setEventLocation("TBA");
    setEventStatus('draft');
    setSelectedEvent(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      month: date.toLocaleString('default', { month: 'short' }).toUpperCase(),
      day: date.getDate(),
      fullDate: date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      })
    };
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen">
      <Toaster
        position="top-right"
        gutter={16}
        containerClassName="!top-4 !right-4 sm:!top-6 sm:!right-6"
        toastOptions={{
          className: '!bg-[#1a1d24] !text-white !rounded-xl !border !border-[#2a2f38] !text-sm sm:!text-base',
        }}
      />
      
      {/* Header - Responsive layout */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <div className="max-w-2xl">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            LGU Event Management
          </h1>
          <p className="text-gray-400 mt-1 text-sm sm:text-base">Administer and monitor community events</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg rounded-xl px-4 py-2 sm:px-5 sm:py-3 w-full sm:w-auto">
              <Plus size={16} className="sm:size-[18px]" />
              <span className="text-sm sm:text-base">Create New Event</span>
            </Button>
          </DialogTrigger>
          
          <DialogContent className="bg-gray-900 border border-gray-700 rounded-2xl shadow-xl p-4 sm:p-6 max-w-[95vw] sm:max-w-md md:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-xl sm:text-2xl text-gray-100">Create New Event</DialogTitle>
            </DialogHeader>

            <DialogClose className="absolute top-3 sm:top-4 right-3 sm:right-4 text-gray-400 hover:text-red-400 hover:bg-gray-700 p-1 sm:p-2 rounded-full transition">
              <X size={18} className="sm:size-6" />
            </DialogClose>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <input 
                placeholder="Event Title" 
                className="w-full p-3 sm:p-4 rounded-lg bg-gray-800 border border-gray-600 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                required
              />

              <textarea
                placeholder="Event Description"
                className="w-full p-3 sm:p-4 rounded-lg bg-gray-800 border border-gray-600 text-gray-300 h-28 sm:h-36 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <input 
                  type="date" 
                  className="p-3 sm:p-4 rounded-lg bg-gray-800 border border-gray-600 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  required
                />
                <input 
                  type="time" 
                  className="p-3 sm:p-4 rounded-lg bg-gray-800 border border-gray-600 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  required
                />
              </div>

              <input
                placeholder="Event location"
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
                required
              />

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={eventStatus === 'draft' ? 'default' : 'outline'}
                  className="flex-1 py-2 text-xs sm:text-sm"
                  onClick={() => setEventStatus('draft')}
                >
                  Draft
                </Button>
                <Button
                  type="button"
                  variant={eventStatus === 'published' ? 'default' : 'outline'}
                  className="flex-1 py-2 text-xs sm:text-sm"
                  onClick={() => setEventStatus('published')}
                >
                  Published
                </Button>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-lg py-2 sm:py-3 text-sm sm:text-base rounded-xl"
              >
                {eventStatus === 'draft' ? 'Save Draft' : 'Publish Event'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6 sm:gap-8">
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-white gap-2 text-lg sm:text-xl">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
              Managed Events
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 sm:space-y-6">
            {events.length === 0 ? (
              <div className="text-center py-12">
                <ClipboardList className="mx-auto h-12 w-12 text-gray-500" />
                <h3 className="mt-4 text-lg font-medium text-gray-300">No events yet</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Get started by creating a new event
                </p>
              </div>
            ) : (
              events.map((event) => {
                const formattedDate = formatDate(event.date);
                const progressValue = event.capacity && event.attendees 
                  ? (event.attendees / event.capacity) * 100 
                  : 0;

                return (
                  <div key={event._id} className="group relative p-4 sm:p-6 rounded-xl bg-gray-700/30 hover:bg-gray-700/50 transition-all duration-300 border border-transparent hover:border-purple-500/30">
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Date Box - Responsive */}
                      <div className={`w-full sm:w-24 h-24 sm:h-32 rounded-lg flex flex-col sm:flex-col items-center justify-center ${
                        event.status === 'published' 
                          ? 'bg-gradient-to-br from-purple-500 to-blue-500' 
                          : 'bg-gray-600/50'
                      }`}>
                        <span className="text-xl sm:text-2xl font-bold">
                          {formattedDate.month}
                        </span>
                        <span className="text-3xl sm:text-4xl font-bold">
                          {formattedDate.day}
                        </span>
                      </div>
                      
                      {/* Event Details - Responsive */}
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                          <h3 className="text-lg sm:text-xl text-white font-semibold">{event.title}</h3>
                          <Badge 
                            variant="outline" 
                            className={`w-fit ${
                              event.status === 'published' 
                                ? 'border-green-400 text-green-400' 
                                : 'border-gray-400 text-gray-400'
                            }`}
                          >
                            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-2 text-gray-400 mb-3 text-sm sm:text-base">
                          <MapPin size={14} className="sm:size-4" />
                          <span>{event.location}</span>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-gray-400 text-sm sm:text-base">
                          <div className="flex items-center gap-1">
                            <Clock size={14} className="sm:size-4" />
                            <span>{formattedDate.fullDate} • {event.time}</span>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <div className="flex justify-between text-xs sm:text-sm text-gray-400 mb-1">
                            <span>Attendees: {event.attendees}/{event.capacity}</span>
                            <span>{Math.round(progressValue)}%</span>
                          </div>
                          <Progress value={progressValue} className="h-2 bg-gray-700" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons - Responsive */}
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex gap-1 sm:gap-2">
                      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="size-8 sm:size-9 text-purple-400 hover:text-purple-300 hover:bg-gray-600/50"
                            onClick={() => openEditDialog(event)}
                          >
                            <Edit size={14} className="sm:size-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-gray-900 border border-gray-700 rounded-2xl p-4 sm:p-6 max-w-[95vw] sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle className="text-xl sm:text-2xl text-white">Edit Event</DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handleEditSubmit} className="space-y-4 sm:space-y-5">
                            <input 
                              placeholder="Event Title" 
                              className="w-full p-3 sm:p-4 rounded-lg bg-gray-800 border border-gray-600 text-gray-300 text-sm sm:text-base"
                              value={eventTitle}
                              onChange={(e) => setEventTitle(e.target.value)}
                              required
                            />
                            <textarea
                              placeholder="Event Description"
                              className="w-full p-3 sm:p-4 rounded-lg bg-gray-800 border border-gray-600 text-gray-300 h-28 sm:h-32 text-sm sm:text-base"
                              value={eventDescription}
                              onChange={(e) => setEventDescription(e.target.value)}
                              required
                            />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                              <input 
                                type="date" 
                                className="p-3 sm:p-4 rounded-lg bg-gray-800 border border-gray-600 text-gray-300 text-sm sm:text-base"
                                value={eventDate}
                                onChange={(e) => setEventDate(e.target.value)}
                                required
                              />
                              <input 
                                type="time" 
                                className="p-3 sm:p-4 rounded-lg bg-gray-800 border border-gray-600 text-gray-300 text-sm sm:text-base"
                                value={eventTime}
                                onChange={(e) => setEventTime(e.target.value)}
                                required
                              />
                            </div>
                            <input
                              placeholder="Location"
                              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-gray-300 text-sm sm:text-base"
                              value={eventLocation}
                              onChange={(e) => setEventLocation(e.target.value)}
                              required
                            />
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant={eventStatus === 'draft' ? 'default' : 'outline'}
                                className="flex-1 py-2 text-xs sm:text-sm"
                                onClick={() => setEventStatus('draft')}
                              >
                                Draft
                              </Button>
                              <Button
                                type="button"
                                variant={eventStatus === 'published' ? 'default' : 'outline'}
                                className="flex-1 py-2 text-xs sm:text-sm"
                                onClick={() => setEventStatus('published')}
                              >
                                Published
                              </Button>
                            </div>
                            <Button 
                              type="submit" 
                              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 py-2 sm:py-3 text-sm sm:text-base"
                            >
                              Save Changes
                            </Button>
                          </form>
                        </DialogContent>
                      </Dialog>

                      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="size-8 sm:size-9 text-red-400 hover:text-red-300 hover:bg-gray-600/50"
                            onClick={() => setSelectedEvent(event)}
                          >
                            <Trash2 size={14} className="sm:size-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-gray-900 border border-gray-700 rounded-2xl p-4 sm:p-6 max-w-[95vw] sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle className="text-xl sm:text-2xl">Delete Event</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <p className="text-gray-300 text-sm sm:text-base">
                              Are you sure you want to delete "{selectedEvent?.title}"?
                            </p>
                            <div className="flex flex-col sm:flex-row gap-2 justify-end">
                              <Button 
                                variant="outline" 
                                className="w-full sm:w-auto"
                                onClick={() => setIsDeleteDialogOpen(false)}
                              >
                                Cancel
                              </Button>
                              <Button 
                                variant="destructive"
                                className="w-full sm:w-auto"
                                onClick={handleDelete}
                              >
                                Delete Event
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                )}
              )
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default LGUEventManagement;